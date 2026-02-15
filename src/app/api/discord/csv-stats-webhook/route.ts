import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';
import { fetchWithRetry } from '@/lib/server/httpClient';
import { WEBHOOK_PINGS_ENABLED } from '@/lib/server/webhookSettings';

interface TopItem {
  name?: string;
  sales?: number;
  revenue?: number;
  price?: number;
  assetId?: string;
  assetType?: string;
  thumbnail?: string;
}

interface StatsData {
  totalRevenue?: number;
  totalSales?: number;
  growthPercentage?: number;
  dataPeriod?: string;
  lastUpdated?: string;
  topItems?: TopItem[];
  uploadType?: 'single' | 'growth' | string;
}

const redis = Redis.fromEnv();

const DISCORD_LIMITS = {
  content: 2000,
  embedTitle: 256,
  embedDescription: 4096,
  fieldName: 256,
  fieldValue: 1024,
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

const escapeDiscordMarkdown = (input: string) => {
  return input.replace(/[\\`*_{}[\]()#+\-.!|>~]/g, '\\$&');
};

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
};

const getItemKey = (item: TopItem) => {
  const assetId = (item.assetId || '').replace(/[^\d]/g, '');
  if (assetId) return `asset:${assetId}`;
  return `name:${(item.name || '').toLowerCase().trim()}`;
};

const toSafeField = (name: string, value: string, inline = false) => ({
  name: truncate(name, DISCORD_LIMITS.fieldName),
  value: truncate(value || '—', DISCORD_LIMITS.fieldValue),
  inline,
});

const getSeverityBadge = (sales: number, topSales: number) => {
  if (sales <= 0) return '⚪';
  const ratio = topSales > 0 ? sales / topSales : 0;
  if (ratio >= 0.75) return '🟢';
  if (ratio >= 0.4) return '🟡';
  return '🔴';
};

const getTrendBadge = (current: TopItem, previous?: TopItem) => {
  if (!previous) return { emoji: '🆕', label: 'new' };

  const salesDelta = (current.sales || 0) - (previous.sales || 0);
  if (salesDelta > 0) return { emoji: '⬆️', label: `+${formatNumber(salesDelta)} sales` };
  if (salesDelta < 0) return { emoji: '⬇️', label: `${formatNumber(salesDelta)} sales` };

  const revenueDelta = Math.round((current.revenue || 0) - (previous.revenue || 0));
  if (revenueDelta > 0) return { emoji: '📈', label: `+${formatNumber(revenueDelta)} R$` };
  if (revenueDelta < 0) return { emoji: '📉', label: `${formatNumber(revenueDelta)} R$` };

  return { emoji: '➖', label: 'steady' };
};

const toTimestamp = (value?: string) => {
  if (!value) return Math.floor(Date.now() / 1000);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return Math.floor(Date.now() / 1000);
  return Math.floor(parsed.getTime() / 1000);
};

const normalizeStats = (statsData: StatsData) => {
  const totalRevenue = Number(statsData.totalRevenue) || 0;
  const totalSales = Number(statsData.totalSales) || 0;
  const growthPercentage = Number(statsData.growthPercentage) || 0;
  const dataPeriod = (statsData.dataPeriod || 'Current Period').toString();
  const uploadType = (statsData.uploadType || 'single').toString();
  const lastUpdated = (statsData.lastUpdated || new Date().toISOString()).toString();
  const topItems = Array.isArray(statsData.topItems)
    ? statsData.topItems
        .map((item) => ({
          name: (item.name || 'Unknown Item').toString(),
          sales: Number(item.sales) || 0,
          revenue: Number(item.revenue) || 0,
          price: Number(item.price) || 0,
          assetId: (item.assetId || '').toString(),
          thumbnail: item.thumbnail?.toString() || '',
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 6)
    : [];

  return {
    totalRevenue,
    totalSales,
    growthPercentage,
    dataPeriod,
    uploadType,
    lastUpdated,
    topItems,
  };
};

const buildDiscordPayload = (statsData: StatsData, roleId?: string, previousStats?: StatsData) => {
  const normalized = normalizeStats(statsData);
  const previousNormalized = previousStats ? normalizeStats(previousStats) : null;
  const {
    totalRevenue,
    totalSales,
    growthPercentage,
    dataPeriod,
    uploadType,
    lastUpdated,
    topItems,
  } = normalized;

  const color =
    growthPercentage >= 20
      ? 0x22c55e
      : growthPercentage >= 5
      ? 0x0ea5e9
      : growthPercentage < 0
      ? 0xef4444
      : 0xf59e0b;

  const growthLabel =
    growthPercentage > 0
      ? `+${growthPercentage}%`
      : growthPercentage < 0
      ? `${growthPercentage}%`
      : '0%';

  const growthEmoji = growthPercentage > 0 ? '📈' : growthPercentage < 0 ? '📉' : '📊';
  const uploadLabel = uploadType === 'growth' ? 'Monthly Growth Report' : 'Monthly Stats Update';
  const timestamp = toTimestamp(lastUpdated);
  const topSeller = topItems[0];
  const topSellerName = topSeller
    ? truncate(escapeDiscordMarkdown(topSeller.name), 80)
    : 'No item data';

  const previousByItem = new Map<string, TopItem>();
  if (previousNormalized) {
    for (const previousItem of previousNormalized.topItems) {
      previousByItem.set(getItemKey(previousItem), previousItem);
    }
  }

  const topSalesLeader = topItems[0]?.sales || 0;
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
  const topSellerLines = topItems.map((item, index) => {
    const safeName = truncate(escapeDiscordMarkdown(item.name), 72);
    const assetId = item.assetId.replace(/[^\d]/g, '');
    const itemLink = assetId ? `https://www.roblox.com/catalog/${assetId}` : '';
    const itemLabel = itemLink ? `[${safeName}](${itemLink})` : `**${safeName}**`;
    const trend = getTrendBadge(item, previousByItem.get(getItemKey(item)));
    const severity = getSeverityBadge(item.sales, topSalesLeader);

    return truncate(
      `${medals[index] || `#${index + 1}`} ${severity} ${trend.emoji} ${itemLabel}\n\`Sales ${formatNumber(
        item.sales
      )}\` • \`Revenue ${formatNumber(Math.round(item.revenue))} R$\` • \`Price ${formatNumber(
        Math.round(item.price)
      )} R$\` • \`Trend ${trend.label}\``,
      560
    );
  });

  const topSellerAssetId = (topSeller?.assetId || '').replace(/[^\d]/g, '');
  const topSellerLink = topSellerAssetId
    ? `https://www.roblox.com/catalog/${topSellerAssetId}`
    : '';

  const quickLinks = topSellerLink
    ? '[Website](https://www.itscoreye.com) • [Roblox Profile](https://www.roblox.com/users/3504185/profile)\n[Top Item](https://www.roblox.com/catalog/' +
      `${topSellerAssetId})`
    : '[Website](https://www.itscoreye.com) • [Roblox Profile](https://www.roblox.com/users/3504185/profile)';

  const summaryEmbed = {
    title: truncate(`📊 ${uploadLabel}`, DISCORD_LIMITS.embedTitle),
    description: truncate(
      uploadType === 'growth'
        ? `Performance window: **${escapeDiscordMarkdown(dataPeriod)}**`
        : `Fresh sales snapshot for **${escapeDiscordMarkdown(dataPeriod)}**`,
      DISCORD_LIMITS.embedDescription
    ),
    color,
    fields: [
      toSafeField('💰 Total Revenue', `\`${formatNumber(Math.round(totalRevenue))} R$\``, true),
      toSafeField('🛍️ Total Sales', `\`${formatNumber(totalSales)}\``, true),
      toSafeField(`${growthEmoji} Growth`, `\`${growthLabel}\``, true),
      toSafeField(
        '🏆 Top Seller',
        topSeller
          ? `**${topSellerName}**\n\`${formatNumber(topSeller.sales)} sales • ${formatNumber(Math.round(topSeller.revenue))} R$\``
          : '`No top sellers detected`'
      ),
      toSafeField('🕒 Updated', `<t:${timestamp}:R> • <t:${timestamp}:F>`),
      toSafeField('🔗 Quick Links', quickLinks),
    ],
    footer: {
      text: 'ItsCoreyE Monthly Analytics',
    },
    url: 'https://www.itscoreye.com',
  };

  const topSellersEmbed = {
    title: truncate('🔥 Top 6 Best Sellers', DISCORD_LIMITS.embedTitle),
    description: truncate(
      topSellerLines.length > 0
        ? `Legend: 🟢 strong • 🟡 medium • 🔴 watchlist • ⚪ low • 🆕 new\n\n${topSellerLines.join(
            '\n\n'
          )}`
        : 'No featured items were detected in this upload.',
      DISCORD_LIMITS.embedDescription
    ),
    color,
    footer: {
      text: 'ItsCoreyE Featured Sellers',
    },
    thumbnail: topSeller?.thumbnail ? { url: topSeller.thumbnail } : undefined,
  };

  const pingRoleId = WEBHOOK_PINGS_ENABLED ? roleId : undefined;
  const contentPrefix = pingRoleId ? `<@&${pingRoleId}> ` : '';
  const headline =
    uploadType === 'growth'
      ? `${contentPrefix}🚀 **Monthly Growth Report is live**`
      : `${contentPrefix}⭐ **Monthly stats update is live**`;
  const snapshotLine = `\`R$ ${formatNumber(Math.round(totalRevenue))}\` • \`${formatNumber(
    totalSales
  )} sales\` • \`${growthLabel}\``;
  const content = truncate(`${headline}\n${snapshotLine}`, DISCORD_LIMITS.content);

  return {
    payload: {
      content,
      embeds: [summaryEmbed, topSellersEmbed],
      allowed_mentions: pingRoleId ? { roles: [pingRoleId] } : { parse: [] as string[] },
    },
    normalized,
  };
};

const sendDirectDiscordWebhook = async (
  webhookUrl: string,
  statsData: StatsData,
  roleId?: string,
  previousStats?: StatsData
) => {
  const { payload, normalized } = buildDiscordPayload(statsData, roleId, previousStats);

  const response = await fetchWithRetry(
    webhookUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    { timeoutMs: 10000, retries: 2, retryDelayMs: 500 }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Discord webhook failed (${response.status}): ${errorText}`);
  }

  return normalized;
};

const loadPreviousStatsSnapshot = async () => {
  try {
    const previousData = await redis.get<StatsData>('ugc-sales-data-previous');
    if (!previousData || typeof previousData !== 'object') {
      return undefined;
    }
    return previousData;
  } catch (error) {
    console.error('⚠️ Unable to load previous sales snapshot for trend analysis:', error);
    return undefined;
  }
};

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequestAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { statsData } = (await request.json()) as { statsData?: StatsData };

    if (!statsData) {
      return NextResponse.json(
        { success: false, error: 'Missing stats data' },
        { status: 400 }
      );
    }

    console.log('📊 Sending monthly stats notification...');
    console.log('💰 Revenue:', statsData.totalRevenue);
    console.log('🛍️ Sales:', statsData.totalSales);
    console.log('📈 Growth:', `${statsData.growthPercentage}%`);
    console.log('📅 Period:', statsData.dataPeriod);

    const discordWebhookUrl =
      process.env.DISCORD_CSV_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
    const roleId = process.env.DISCORD_CSV_PING_ROLE_ID || process.env.DISCORD_PING_ROLE_ID;
    if (!discordWebhookUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing DISCORD_CSV_WEBHOOK_URL (or DISCORD_WEBHOOK_URL) environment variable',
        },
        { status: 500 }
      );
    }

    try {
      const previousStats = await loadPreviousStatsSnapshot();
      const normalizedStats = await sendDirectDiscordWebhook(
        discordWebhookUrl,
        statsData,
        roleId,
        previousStats
      );

      console.log('✅ Monthly stats notification sent directly to Discord');

      return NextResponse.json({
        success: true,
        message: 'Monthly stats notification sent to Discord',
        revenue: normalizedStats.totalRevenue,
        sales: normalizedStats.totalSales,
        period: normalizedStats.dataPeriod,
        topItemsCount: normalizedStats.topItems.length,
        delivery: 'direct-discord',
      });
    } catch (sendError: unknown) {
      const details = sendError instanceof Error ? sendError.message : 'Unknown error occurred';

      console.error('❌ Monthly stats webhook send failed:', details);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send monthly stats notification',
          details,
          revenue: Number(statsData.totalRevenue) || 0,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ CSV stats webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
