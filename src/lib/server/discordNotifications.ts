import {
  DISCORD_LIMITS,
  WebhookConfigError,
  buildProgressBar,
  escapeDiscordMarkdown,
  formatNumber,
  postDiscordWebhook,
  toSafeField,
  truncate,
} from '@/lib/server/discord';
import { getAssetThumbnail } from '@/lib/server/roblox';

// Loose input shapes: webhook payloads arrive from HTTP so every field is
// treated as optional/untrusted.
export interface MilestoneData {
  id?: string;
  category?: 'revenue' | 'sales' | 'items' | 'collectibles' | 'verification' | string;
  target?: number;
  description?: string;
  isCompleted?: boolean;
  assetId?: string;
}

export interface ProgressData {
  revenue_completed?: number;
  revenue_total?: number;
  sales_completed?: number;
  sales_total?: number;
  items_completed?: number;
  items_total?: number;
  collectibles_completed?: number;
  collectibles_total?: number;
  total_completed?: number;
  total_milestones?: number;
  completion_percentage?: number;
}

export interface TopItemData {
  name?: string;
  sales?: number;
  revenue?: number;
  price?: number;
  assetId?: string;
  assetType?: string;
  thumbnail?: string;
}

export interface StatsData {
  totalRevenue?: number;
  totalSales?: number;
  growthPercentage?: number;
  dataPeriod?: string;
  lastUpdated?: string;
  topItems?: TopItemData[];
  uploadType?: 'single' | 'growth' | string;
}

// ---------------------------------------------------------------------------
// Milestone notifications
// ---------------------------------------------------------------------------

// Embed accent colours follow the site's brand palette
const milestoneColours: Record<string, number> = {
  revenue: 0x7c3aed,
  sales: 0x2563eb,
  items: 0x06b6d4,
  collectibles: 0x059669,
  verification: 0x3b82f6,
};

const categoryConfig: Record<string, { emoji: string; name: string }> = {
  revenue: { emoji: '💰', name: 'Revenue Milestone' },
  sales: { emoji: '🛍️', name: 'Sales Milestone' },
  items: { emoji: '🎨', name: 'Item Release Milestone' },
  collectibles: { emoji: '💎', name: 'Collectible Achievement' },
  verification: { emoji: '✅', name: 'ROBLOX Verified Creator' },
};

const buildMilestoneEmbed = (
  milestone: MilestoneData,
  progress: ProgressData,
  thumbnailUrl: string | null
) => {
  const category = (milestone.category || 'revenue').toString();
  const config = categoryConfig[category] || categoryConfig.revenue;
  const colour = milestoneColours[category] || milestoneColours.revenue;
  const description = milestone.description || 'Milestone achieved';
  const categoryCompleted = Number(progress[`${category}_completed` as keyof ProgressData]) || 0;
  const categoryTotal = Number(progress[`${category}_total` as keyof ProgressData]) || 0;
  const safeDescription = truncate(escapeDiscordMarkdown(description), 140);
  const timestamp = Math.floor(Date.now() / 1000);
  const totalCompleted = Number(progress.total_completed) || 0;
  const totalMilestones = Number(progress.total_milestones) || 0;
  const completionPercentage = Number(progress.completion_percentage) || 0;
  const categoryLeft = Math.max(0, categoryTotal - categoryCompleted);
  const categoryBar = buildProgressBar(categoryCompleted, categoryTotal);
  const overallBar = buildProgressBar(totalCompleted, totalMilestones);

  const quickLinksBase =
    '[Website](https://www.itscoreye.com) • [Roblox Profile](https://www.roblox.com/users/3504185/profile)';
  const collectibleAssetId = (milestone.assetId || '').replace(/[^\d]/g, '');
  const quickLinks =
    category === 'collectibles' && collectibleAssetId
      ? `${quickLinksBase}\n[View Collectible](https://www.roblox.com/catalog/${collectibleAssetId})`
      : quickLinksBase;

  const embed: Record<string, unknown> = {
    title: truncate(`${config.emoji} ${config.name} Complete`, DISCORD_LIMITS.embedTitle),
    description: truncate(`**${safeDescription}**`, DISCORD_LIMITS.embedDescription),
    color: colour,
    fields: [
      toSafeField(
        '🧩 Category Progress',
        `\`${categoryCompleted}/${categoryTotal}\` (${categoryLeft} left)\n\`${categoryBar}\``,
        true
      ),
      toSafeField(
        '🏁 Overall Progress',
        `\`${totalCompleted}/${totalMilestones}\` milestones (\`${completionPercentage}%\`)\n\`${overallBar}\``,
        true
      ),
      toSafeField('🕒 Updated', `<t:${timestamp}:R> • <t:${timestamp}:F>`),
      toSafeField('🔗 Quick Links', quickLinks),
    ],
    footer: {
      text: 'Milestone Tracker',
    },
    author: {
      name: 'ItsCoreyE (3504185)',
      url: 'https://www.roblox.com/users/3504185/profile',
    },
  };

  if (category === 'collectibles' && thumbnailUrl) {
    embed.thumbnail = { url: thumbnailUrl };
  }

  return embed;
};

export const sendMilestoneNotification = async (
  milestone: MilestoneData,
  progress: ProgressData
) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const roleId = process.env.DISCORD_PING_ROLE_ID;

  if (!webhookUrl) {
    throw new WebhookConfigError('Missing DISCORD_WEBHOOK_URL environment variable');
  }

  let thumbnailUrl: string | null = null;
  if (milestone.category === 'collectibles' && milestone.assetId) {
    try {
      thumbnailUrl = await getAssetThumbnail(milestone.assetId);
    } catch (thumbnailError) {
      console.error('Collectible thumbnail fetch error:', thumbnailError);
    }
  }

  const category = (milestone.category || 'revenue').toString();
  const isVerification = category === 'verification';
  const pingRoleId = roleId;
  const shouldPingEveryone = isVerification;

  const content = truncate(
    shouldPingEveryone
      ? '🎊🎊🎊 @everyone 🎊🎊🎊\n\n**🏆 ROBLOX VERIFIED CREATOR ACHIEVED! 🏆**'
      : pingRoleId
      ? `<@&${pingRoleId}> ✨ **Milestone Unlocked**`
      : '✨ **Milestone Unlocked**',
    DISCORD_LIMITS.content
  );

  const payload = {
    content,
    embeds: [buildMilestoneEmbed(milestone, progress, thumbnailUrl)],
    allowed_mentions: shouldPingEveryone
      ? { parse: ['everyone'] }
      : pingRoleId
      ? { roles: [pingRoleId] }
      : { parse: [] as string[] },
  };

  await postDiscordWebhook(webhookUrl, payload);
};

// ---------------------------------------------------------------------------
// Monthly CSV stats notifications
// ---------------------------------------------------------------------------

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

const buildCsvStatsPayload = (statsData: StatsData, roleId?: string) => {
  const normalized = normalizeStats(statsData);
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
      ? 0x059669
      : growthPercentage >= 5
      ? 0x2563eb
      : growthPercentage < 0
      ? 0xdc2626
      : 0xd97706;

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
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
  const topSellerLines = topItems.map((item, index) => {
    const safeName = truncate(escapeDiscordMarkdown(item.name), 72);
    const assetId = item.assetId.replace(/[^\d]/g, '');
    const itemLink = assetId ? `https://www.roblox.com/catalog/${assetId}` : '';
    const itemLabel = itemLink ? `[${safeName}](${itemLink})` : `**${safeName}**`;

    return truncate(
      `${medals[index] || `#${index + 1}`} ${itemLabel}\n\`Sales ${formatNumber(
        item.sales
      )}\` • \`Revenue ${formatNumber(Math.round(item.revenue))} R$\` • \`Price ${formatNumber(
        Math.round(item.price)
      )} R$\``,
      560
    );
  });

  const quickLinks =
    '[Website](https://www.itscoreye.com) • [Roblox Profile](https://www.roblox.com/users/3504185/profile)';

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
      text: 'Monthly Analytics',
    },
    author: {
      name: 'ItsCoreyE (3504185)',
      url: 'https://www.roblox.com/users/3504185/profile',
    },
    url: 'https://www.itscoreye.com',
  };

  const topSellersEmbed = {
    title: truncate('🔥 Top 6 Best Sellers', DISCORD_LIMITS.embedTitle),
    description: truncate(
      topSellerLines.length > 0
        ? topSellerLines.join('\n\n')
        : 'No featured items were detected in this upload.',
      DISCORD_LIMITS.embedDescription
    ),
    color,
    footer: {
      text: 'Featured Sellers',
    },
    thumbnail: topSeller?.thumbnail ? { url: topSeller.thumbnail } : undefined,
  };

  const pingRoleId = roleId;
  const contentPrefix = pingRoleId ? `<@&${pingRoleId}> ` : '';
  const headline =
    uploadType === 'growth'
      ? `${contentPrefix}🚀 **Monthly Growth Report is live**`
      : `${contentPrefix}⭐ **Monthly stats update is live**`;
  const content = truncate(headline, DISCORD_LIMITS.content);

  return {
    payload: {
      content,
      embeds: [summaryEmbed, topSellersEmbed],
      allowed_mentions: pingRoleId ? { roles: [pingRoleId] } : { parse: [] as string[] },
    },
    normalized,
  };
};

export const sendCsvStatsNotification = async (statsData: StatsData) => {
  const webhookUrl = process.env.DISCORD_CSV_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  const roleId = process.env.DISCORD_CSV_PING_ROLE_ID || process.env.DISCORD_PING_ROLE_ID;

  if (!webhookUrl) {
    throw new WebhookConfigError(
      'Missing DISCORD_CSV_WEBHOOK_URL (or DISCORD_WEBHOOK_URL) environment variable'
    );
  }

  const { payload, normalized } = buildCsvStatsPayload(statsData, roleId);
  await postDiscordWebhook(webhookUrl, payload);
  return normalized;
};
