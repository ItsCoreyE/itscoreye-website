import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/server/cronAuth';
import { fetchWithRetry } from '@/lib/server/httpClient';
import { redis, KEYS } from '@/lib/server/redis';
import {
  DISCORD_LIMITS,
  formatNumber,
  postDiscordWebhook,
  toSafeField,
  truncate,
} from '@/lib/server/discord';

const ROBLOX_USER_ID = '3504185';
const ROLIMONS_PLAYER_URL = `https://www.rolimons.com/player/${ROBLOX_USER_ID}`;
const HISTORY_MAX_ENTRIES = 90;

interface RolimonsSnapshot {
  value: number;
  rap: number;
  itemCount: number;
  timestamp: string;
}

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
    ? 0xd97706
    : valueChange > 0
    ? 0x059669
    : valueChange < 0
    ? 0xdc2626
    : 0xd97706;

  const changeEmoji = valueChange > 0 ? '📈' : valueChange < 0 ? '📉' : '📊';
  const changeSign = valueChange > 0 ? '+' : '';
  const changeText = hasChange
    ? `\`${changeSign}${formatNumber(valueChange)} (${changeSign}${valuePct}%)\``
    : '`N/A - first snapshot`';

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
      console.error('Rolimons page fetch failed:', message);
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
    const previous = await redis.get<RolimonsSnapshot>(KEYS.rolimonsLatest);

    // Store new snapshot
    await redis.set(KEYS.rolimonsLatest, snapshot);
    await redis.lpush(KEYS.rolimonsHistory, snapshot);
    await redis.ltrim(KEYS.rolimonsHistory, 0, HISTORY_MAX_ENTRIES - 1);

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

    try {
      await postDiscordWebhook(webhookUrl, payload);
    } catch (discordError) {
      const details = discordError instanceof Error ? discordError.message : 'Unknown error';
      console.error('Discord webhook failed:', details);
      return NextResponse.json(
        { success: false, error: 'Discord webhook failed', details },
        { status: 500 }
      );
    }

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
    console.error('Rolimons value route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
