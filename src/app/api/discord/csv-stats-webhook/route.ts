import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';
import { fetchWithRetry } from '@/lib/server/httpClient';

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

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

const escapeDiscordMarkdown = (input: string) => {
  return input.replace(/[\\`*_{}[\]()#+\-.!|>~]/g, '\\$&');
};

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
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

const buildDiscordPayload = (statsData: StatsData, roleId?: string) => {
  const normalized = normalizeStats(statsData);
  const { totalRevenue, totalSales, growthPercentage, dataPeriod, uploadType, lastUpdated, topItems } = normalized;

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
  const topSellerName = topSeller ? truncate(escapeDiscordMarkdown(topSeller.name), 80) : 'No item data';

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
  const topSellerLines = topItems.map((item, index) => {
    const safeName = truncate(escapeDiscordMarkdown(item.name), 90);
    const assetId = item.assetId.replace(/[^\d]/g, '');
    const itemLink = assetId ? `https://www.roblox.com/catalog/${assetId}` : '';
    const itemLabel = itemLink ? `[${safeName}](${itemLink})` : `**${safeName}**`;

    return `${medals[index] || `#${index + 1}`} ${itemLabel}\n\`Sales ${formatNumber(
      item.sales
    )}\` • \`Revenue ${formatNumber(Math.round(item.revenue))} R$\` • \`Price ${formatNumber(
      Math.round(item.price)
    )} R$\``;
  });

  const summaryEmbed = {
    title: `📊 ${uploadLabel}`,
    description:
      uploadType === 'growth'
        ? `Performance window: **${escapeDiscordMarkdown(dataPeriod)}**`
        : `Fresh sales snapshot for **${escapeDiscordMarkdown(dataPeriod)}**`,
    color,
    fields: [
      {
        name: '💰 Total Revenue',
        value: `\`${formatNumber(Math.round(totalRevenue))} R$\``,
        inline: true,
      },
      {
        name: '🛍️ Total Sales',
        value: `\`${formatNumber(totalSales)}\``,
        inline: true,
      },
      {
        name: `${growthEmoji} Growth`,
        value: `\`${growthLabel}\``,
        inline: true,
      },
      {
        name: '🏆 Top Seller',
        value: topSeller
          ? `**${topSellerName}**\n\`${formatNumber(topSeller.sales)} sales • ${formatNumber(Math.round(topSeller.revenue))} R$\``
          : '`No top sellers detected`',
        inline: false,
      },
      {
        name: '🕒 Updated',
        value: `<t:${timestamp}:F>`,
        inline: false,
      },
    ],
    footer: {
      text: 'ItsCoreyE Monthly Analytics',
    },
    url: 'https://www.itscoreye.com',
  };

  const topSellersEmbed = {
    title: '🔥 Top 6 Best Sellers',
    description:
      topSellerLines.length > 0
        ? `Ranked by sales from the latest CSV processing.\n\n${topSellerLines.join('\n\n')}`
        : 'No featured items were detected in this upload.',
    color,
    footer: {
      text: 'ItsCoreyE Featured Sellers',
    },
    thumbnail: topSeller?.thumbnail ? { url: topSeller.thumbnail } : undefined,
  };

  const contentPrefix = roleId ? `<@&${roleId}> ` : '';
  const content =
    uploadType === 'growth'
      ? `${contentPrefix}🚀 **Monthly Growth Report is live**`
      : `${contentPrefix}⭐ **Monthly stats update is live**`;

  return {
    payload: {
      content,
      embeds: [summaryEmbed, topSellersEmbed],
      allowed_mentions: roleId ? { roles: [roleId] } : { parse: [] as string[] },
    },
    normalized,
  };
};

const sendDirectDiscordWebhook = async (webhookUrl: string, statsData: StatsData, roleId?: string) => {
  const { payload, normalized } = buildDiscordPayload(statsData, roleId);

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
      const normalizedStats = await sendDirectDiscordWebhook(discordWebhookUrl, statsData, roleId);

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
