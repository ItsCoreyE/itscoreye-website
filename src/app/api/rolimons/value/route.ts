import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { verifyCronSecret } from '@/lib/server/cronAuth';
import { fetchWithRetry } from '@/lib/server/httpClient';

const redis = Redis.fromEnv();

const ROBLOX_USER_ID = '3504185';
const ROBLOX_INVENTORY_API = `https://inventory.roblox.com/v1/users/${ROBLOX_USER_ID}/assets/collectibles`;
const ROLIMONS_ITEMS_API = 'https://api.rolimons.com/items/v1/itemdetails';
const REDIS_LATEST_KEY = 'rolimons:latest';
const REDIS_HISTORY_KEY = 'rolimons:history';
const HISTORY_MAX_ENTRIES = 90;

// Rolimons item array indices: [Name, Acronym, RAP, Value, DefaultValue, Demand, Trend, Projected, Hyped, Rare]
const ROLIMONS_VALUE_INDEX = 3;
const ROLIMONS_RAP_INDEX = 2;

interface RobloxCollectible {
  assetId: number;
  name: string;
  recentAveragePrice: number;
}

interface RolimonsSnapshot {
  value: number;
  rap: number;
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

const fetchAllCollectibles = async (): Promise<RobloxCollectible[]> => {
  const all: RobloxCollectible[] = [];
  let cursor: string | null = null;

  do {
    const url = new URL(ROBLOX_INVENTORY_API);
    url.searchParams.set('sortOrder', 'Asc');
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);

    const response = await fetchWithRetry(
      url.toString(),
      undefined,
      { timeoutMs: 15000, retries: 2, retryDelayMs: 1000 }
    );

    if (!response.ok) {
      throw new Error(`Roblox inventory API returned ${response.status}`);
    }

    const data = await response.json();
    const items = data.data as RobloxCollectible[];
    all.push(...items);
    cursor = data.nextPageCursor || null;
  } while (cursor);

  return all;
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
    content: truncate('📊 **Daily inventory value update**', DISCORD_LIMITS.content),
    embeds: [
      {
        title: truncate('📊 Daily Inventory Value Update', DISCORD_LIMITS.embedTitle),
        color,
        fields: [
          toSafeField('💎 Rolimons Value', `\`${formatNumber(current.value)}\``, true),
          toSafeField(`${changeEmoji} Daily Change`, changeText, true),
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

    // Step 1: Fetch inventory from Roblox and item values from Rolimons in parallel
    let collectibles: RobloxCollectible[];
    let rolimonsItems: Record<string, number[]>;

    try {
      const [collectiblesResult, rolimonsResponse] = await Promise.all([
        fetchAllCollectibles(),
        fetchWithRetry(
          ROLIMONS_ITEMS_API,
          undefined,
          { timeoutMs: 15000, retries: 2, retryDelayMs: 1000 }
        ),
      ]);

      collectibles = collectiblesResult;

      if (!rolimonsResponse.ok) {
        return NextResponse.json(
          { success: false, error: `Rolimons items API returned ${rolimonsResponse.status}` },
          { status: 502 }
        );
      }

      const rolimonsData = await rolimonsResponse.json();
      if (!rolimonsData.success || !rolimonsData.items) {
        return NextResponse.json(
          { success: false, error: 'Rolimons items API returned unexpected format' },
          { status: 502 }
        );
      }

      rolimonsItems = rolimonsData.items;
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      console.error('❌ API fetch failed:', message);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch inventory or item data', details: message },
        { status: 502 }
      );
    }

    // Step 2: Cross-reference inventory with Rolimons values
    let totalValue = 0;
    let totalRap = 0;

    for (const item of collectibles) {
      const assetId = String(item.assetId);
      const rolimonsItem = rolimonsItems[assetId];

      if (rolimonsItem) {
        const itemValue = rolimonsItem[ROLIMONS_VALUE_INDEX];
        const itemRap = rolimonsItem[ROLIMONS_RAP_INDEX];
        // Rolimons uses -1 for items with no assigned value — fall back to RAP
        totalValue += (itemValue > 0 ? itemValue : (itemRap > 0 ? itemRap : 0));
        totalRap += (itemRap > 0 ? itemRap : 0);
      } else {
        // Item not tracked by Rolimons — use Roblox RAP
        totalRap += item.recentAveragePrice || 0;
        totalValue += item.recentAveragePrice || 0;
      }
    }

    const snapshot: RolimonsSnapshot = {
      value: totalValue,
      rap: totalRap,
      timestamp: new Date().toISOString(),
    };

    // Step 3: Get previous snapshot for comparison
    const previous = await redis.get<RolimonsSnapshot>(REDIS_LATEST_KEY);

    // Step 4: Store new snapshot
    await redis.set(REDIS_LATEST_KEY, snapshot);
    await redis.lpush(REDIS_HISTORY_KEY, snapshot);
    await redis.ltrim(REDIS_HISTORY_KEY, 0, HISTORY_MAX_ENTRIES - 1);

    // Step 5: Send Discord notification
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

    console.log('✅ Daily Rolimons value update sent to Discord');

    const valueChange = previous ? snapshot.value - previous.value : null;
    return NextResponse.json({
      success: true,
      message: 'Daily value update sent to Discord',
      value: snapshot.value,
      rap: snapshot.rap,
      itemCount: collectibles.length,
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
