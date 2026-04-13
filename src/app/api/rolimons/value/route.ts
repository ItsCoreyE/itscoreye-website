import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { verifyCronSecret } from '@/lib/server/cronAuth';
import { fetchWithRetry } from '@/lib/server/httpClient';

const redis = Redis.fromEnv();

const ROBLOX_USER_ID = '3504185';
const ROLIMONS_PLAYER_URL = `https://www.rolimons.com/player/${ROBLOX_USER_ID}`;
const REDIS_LATEST_KEY = 'rolimons:latest';
const REDIS_HISTORY_KEY = 'rolimons:history';
const HISTORY_MAX_ENTRIES = 90;

interface RolimonsSnapshot {
  value: number;
  rap: number;
  itemCount: number;
  timestamp: string;
}

const DISCORD_LIMITS = {
  content: 2000,
  embedTitle: 256,
  fieldName: 256,
  fieldValue: 1024,
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
};

const toSafeField = (name: string, value: string, inline = false) => ({
  name: truncate(name, DISCORD_LIMITS.fieldName),
  value: truncate(value || '—', DISCORD_LIMITS.fieldValue),
  inline,
});

const parseRolimonsPage = (html: string): { value: number; rap: number; itemCount: number } => {
  // Extract embedded JS variables from the player page
  const assetsMatch = html.match(/var scanned_player_assets\s*=\s*(\{[\s\S]*?\});/);
  const itemsMatch = html.match(/var item_list\s*=\s*(\{[\s\S]*?\});/);

  if (!assetsMatch || !itemsMatch) {
    throw new Error('Could not parse Rolimons page data');
  }

  const assets: Record<string, unknown[][]> = JSON.parse(assetsMatch[1]);
  const items: Record<string, number[]> = JSON.parse(itemsMatch[1]);

  let totalValue = 0;
  let totalRap = 0;
  let itemCount = 0;

  for (const assetId of Object.keys(assets)) {
    const copies = assets[assetId].length;
    const item = items[assetId];

    if (item) {
      const rap = item[2] || 0;
      const value = item[3] > 0 ? item[3] : rap;
      totalValue += value * copies;
      totalRap += rap * copies;
      itemCount += copies;
    }
  }

  return { value: totalValue, rap: totalRap, itemCount };
};

const buildDiscordPayload = (
  current: RolimonsSnapshot,
  previous: RolimonsSnapshot | null
) => {
  const timestamp = Math.floor(new Date(current.timestamp).getTime() / 1000);

  const hasChange = previous !== null;
  const valueChange = hasChange ? current.value - previous.value : 0;
  const valuePct = hasChange && previous.value !== 0
    ? ((valueChange / previous.value) * 100).toFixed(2)
    : '0.00';

  const color = !hasChange
    ? 0xf59e0b
    : valueChange > 0
    ? 0x22c55e
    : valueChange < 0
    ? 0xef4444
    : 0xf59e0b;

  const changeEmoji = valueChange > 0 ? '📈' : valueChange < 0 ? '📉' : '📊';
  const changeSign = valueChange > 0 ? '+' : '';
  const changeText = hasChange
    ? `\`${changeSign}${formatNumber(valueChange)} (${changeSign}${valuePct}%)\``
    : '`N/A — first snapshot`';

  const quickLinks =
    '[Website](https://www.itscoreye.com) • [Roblox Profile](https://www.roblox.com/users/3504185/profile) • [Rolimons](https://www.rolimons.com/player/3504185)';

  return {
    content: truncate('📊 **Weekly inventory value update**', DISCORD_LIMITS.content),
    embeds: [
      {
        title: truncate('📊 Weekly Inventory Value Update', DISCORD_LIMITS.embedTitle),
        color,
        fields: [
          toSafeField('💎 Rolimons Value', `\`${formatNumber(current.value)}\``, true),
          toSafeField(`${changeEmoji} Weekly Change`, changeText, true),
          toSafeField('💰 RAP', `\`${formatNumber(current.rap)}\``, true),
          toSafeField('🕒 Updated', `<t:${timestamp}:R> • <t:${timestamp}:F>`),
          toSafeField('🔗 Quick Links', quickLinks),
        ],
        footer: { text: 'Rolimons Value Tracker' },
        author: {
          name: 'ItsCoreyE (3504185)',
          url: 'https://www.roblox.com/users/3504185/profile',
        },
      },
    ],
    allowed_mentions: { parse: [] as string[] },
  };
};

export async function GET(request: NextRequest) {
  try {
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch and parse the Rolimons player page
    let value: number;
    let rap: number;
    let itemCount: number;

    try {
      const response = await fetchWithRetry(
        ROLIMONS_PLAYER_URL,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          },
        },
        { timeoutMs: 15000, retries: 2, retryDelayMs: 1000 }
      );

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: `Rolimons page returned ${response.status}` },
          { status: 502 }
        );
      }

      const html = await response.text();
      const parsed = parseRolimonsPage(html);
      value = parsed.value;
      rap = parsed.rap;
      itemCount = parsed.itemCount;
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      console.error('❌ Rolimons page fetch failed:', message);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch Rolimons player page', details: message },
        { status: 502 }
      );
    }

    if (value === 0 && rap === 0) {
      return NextResponse.json(
        { success: false, error: 'Parsed zero value from Rolimons page' },
        { status: 502 }
      );
    }

    const snapshot: RolimonsSnapshot = {
      value,
      rap,
      itemCount,
      timestamp: new Date().toISOString(),
    };

    // Get previous snapshot for comparison
    const previous = await redis.get<RolimonsSnapshot>(REDIS_LATEST_KEY);

    // Store new snapshot
    await redis.set(REDIS_LATEST_KEY, snapshot);
    await redis.lpush(REDIS_HISTORY_KEY, snapshot);
    await redis.ltrim(REDIS_HISTORY_KEY, 0, HISTORY_MAX_ENTRIES - 1);

    // Send Discord notification
    const webhookUrl =
      process.env.DISCORD_ROLIMONS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing DISCORD_ROLIMONS_WEBHOOK_URL (or DISCORD_WEBHOOK_URL) environment variable' },
        { status: 500 }
      );
    }

    const payload = buildDiscordPayload(snapshot, previous);

    const discordResponse = await fetchWithRetry(
      webhookUrl,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      { timeoutMs: 10000, retries: 2, retryDelayMs: 500 }
    );

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error('❌ Discord webhook failed:', errorText);
      return NextResponse.json(
        { success: false, error: `Discord webhook failed (${discordResponse.status})`, details: errorText },
        { status: 500 }
      );
    }

    console.log('✅ Weekly Rolimons value update sent to Discord');

    const valueChange = previous ? snapshot.value - previous.value : null;
    return NextResponse.json({
      success: true,
      message: 'Weekly value update sent to Discord',
      value: snapshot.value,
      rap: snapshot.rap,
      itemCount: snapshot.itemCount,
      change: valueChange,
      isFirstRun: previous === null,
    });
  } catch (error) {
    console.error('❌ Rolimons value route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
