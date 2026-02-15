import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';
import { fetchWithRetry } from '@/lib/server/httpClient';
import { WEBHOOK_PINGS_ENABLED } from '@/lib/server/webhookSettings';

interface MilestoneData {
  id?: string;
  category?: 'revenue' | 'sales' | 'items' | 'collectibles' | 'verification' | string;
  target?: number;
  description?: string;
  isCompleted?: boolean;
  assetId?: string;
}

interface ProgressData {
  revenue_completed?: number;
  revenue_total?: number;
  sales_completed?: number;
  sales_total?: number;
  items_completed?: number;
  items_total?: number;
  collectibles_completed?: number;
  collectibles_total?: number;
  verification_completed?: number;
  verification_total?: number;
  total_completed?: number;
  total_milestones?: number;
  completion_percentage?: number;
}

const DISCORD_LIMITS = {
  content: 2000,
  embedTitle: 256,
  embedDescription: 4096,
  fieldName: 256,
  fieldValue: 1024,
};

const milestoneColours: Record<string, number> = {
  revenue: 0xffd700,
  sales: 0x00ff7f,
  items: 0x1e90ff,
  collectibles: 0x8a2be2,
  verification: 0x00d9ff,
};

const categoryConfig: Record<
  string,
  { emoji: string; name: string; unit: string; celebration: string }
> = {
  revenue: {
    emoji: '💰',
    name: 'Revenue Milestone',
    unit: 'Robux',
    celebration: 'Money milestone achieved!',
  },
  sales: {
    emoji: '🛍️',
    name: 'Sales Milestone',
    unit: 'Sales',
    celebration: 'Sales target smashed!',
  },
  items: {
    emoji: '🎨',
    name: 'Item Release Milestone',
    unit: 'Items',
    celebration: 'Creation milestone unlocked!',
  },
  collectibles: {
    emoji: '💎',
    name: 'Collectible Achievement',
    unit: 'Item',
    celebration: 'Limited collectible acquired!',
  },
  verification: {
    emoji: '✅',
    name: 'ROBLOX Verified Creator',
    unit: 'Verified',
    celebration: 'Main goal achieved. The blue checkmark is here!',
  },
};

const formatNumberCompact = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${value}`;
};

const buildProgressBar = (completed: number, total: number, length = 10) => {
  if (total <= 0) return '░'.repeat(length);
  const ratio = Math.max(0, Math.min(1, completed / total));
  const filled = Math.round(ratio * length);
  return `${'█'.repeat(filled)}${'░'.repeat(Math.max(0, length - filled))}`;
};

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
};

const escapeDiscordMarkdown = (input: string) =>
  input.replace(/[\\`*_{}[\]()#+\-.!|>~]/g, '\\$&');

const toSafeField = (name: string, value: string, inline = false) => ({
  name: truncate(name, DISCORD_LIMITS.fieldName),
  value: truncate(value || '—', DISCORD_LIMITS.fieldValue),
  inline,
});

const buildMilestoneEmbed = (milestone: MilestoneData, progress: ProgressData, thumbnailUrl: string | null) => {
  const category = (milestone.category || 'revenue').toString();
  const config = categoryConfig[category] || categoryConfig.revenue;
  const colour = milestoneColours[category] || milestoneColours.revenue;
  const description = milestone.description || 'Milestone achieved';
  const target = Number(milestone.target) || 0;
  const categoryCompleted = Number(progress[`${category}_completed` as keyof ProgressData]) || 0;
  const categoryTotal = Number(progress[`${category}_total` as keyof ProgressData]) || 0;
  const safeDescription = truncate(escapeDiscordMarkdown(description), 140);
  const timestamp = Math.floor(Date.now() / 1000);
  const achievementLine =
    category === 'collectibles'
      ? `💎 **Collectible:** \`${safeDescription}\``
      : category === 'verification'
      ? '✅ **Goal:** `Verified Creator`'
      : `${config.emoji} **Target:** \`${formatNumberCompact(target)} ${config.unit}\``;
  const totalCompleted = Number(progress.total_completed) || 0;
  const totalMilestones = Number(progress.total_milestones) || 0;
  const completionPercentage = Number(progress.completion_percentage) || 0;
  const categoryLeft = Math.max(0, categoryTotal - categoryCompleted);
  const categoryBar = buildProgressBar(categoryCompleted, categoryTotal);
  const overallBar = buildProgressBar(totalCompleted, totalMilestones);
  const spotlightLabel =
    category === 'collectibles'
      ? 'Collectible Added'
      : category === 'verification'
      ? 'Creator Verification'
      : `${config.name} Target Hit`;

  const quickLinksBase =
    '[Website](https://www.itscoreye.com) • [Roblox Profile](https://www.roblox.com/users/3504185/profile)';
  const collectibleAssetId = (milestone.assetId || '').replace(/[^\d]/g, '');
  const quickLinks =
    category === 'collectibles' && collectibleAssetId
      ? `${quickLinksBase}\n[View Collectible](https://www.roblox.com/catalog/${collectibleAssetId})`
      : quickLinksBase;

  const embed: Record<string, unknown> = {
    title: truncate(`${config.emoji} ${config.name} Complete`, DISCORD_LIMITS.embedTitle),
    description: truncate(
      `## ${spotlightLabel}\n**${safeDescription}**\n\n${achievementLine}\n*${config.celebration}*`,
      DISCORD_LIMITS.embedDescription
    ),
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
      toSafeField(
        '🕒 Updated',
        `<t:${timestamp}:R> • <t:${timestamp}:F>`
      ),
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

const postToDiscord = async (
  webhookUrl: string,
  roleId: string | undefined,
  milestone: MilestoneData,
  progress: ProgressData,
  thumbnailUrl: string | null
) => {
  const category = (milestone.category || 'revenue').toString();
  const isVerification = category === 'verification';
  const pingRoleId = WEBHOOK_PINGS_ENABLED ? roleId : undefined;
  const shouldPingEveryone = WEBHOOK_PINGS_ENABLED && isVerification;

  const content = truncate(
    shouldPingEveryone
      ? '🎊🎊🎊 @everyone 🎊🎊🎊\n\n**🏆 ROBLOX VERIFIED CREATOR ACHIEVED! 🏆**'
      : isVerification
      ? '🎊 **🏆 ROBLOX VERIFIED CREATOR ACHIEVED! 🏆**'
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
    const responseText = await response.text();
    throw new Error(`Discord webhook failed (${response.status}): ${responseText}`);
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

    const { milestone, progress } = (await request.json()) as {
      milestone?: MilestoneData;
      progress?: ProgressData;
    };

    if (!milestone || !progress) {
      return NextResponse.json(
        { success: false, error: 'Missing milestone or progress data' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const roleId = process.env.DISCORD_PING_ROLE_ID;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing DISCORD_WEBHOOK_URL environment variable',
        },
        { status: 500 }
      );
    }

    let thumbnailUrl: string | null = null;
    if (milestone.category === 'collectibles' && milestone.assetId) {
      try {
        const thumbnailResponse = await fetchWithRetry(
          `${request.nextUrl.origin}/api/roblox?assetId=${milestone.assetId}`,
          undefined,
          { timeoutMs: 8000, retries: 1, retryDelayMs: 400 }
        );
        if (thumbnailResponse.ok) {
          const thumbnailData = await thumbnailResponse.json();
          if (thumbnailData.success && thumbnailData.thumbnail) {
            thumbnailUrl = thumbnailData.thumbnail;
          }
        }
      } catch (thumbnailError) {
        console.error('Collectible thumbnail fetch error:', thumbnailError);
      }
    }

    try {
      await postToDiscord(webhookUrl, roleId, milestone, progress, thumbnailUrl);

      return NextResponse.json({
        success: true,
        message: 'Milestone notification sent to Discord',
        milestone: milestone.description || 'Unknown milestone',
        category: milestone.category || 'unknown',
        delivery: 'direct-discord',
      });
    } catch (sendError: unknown) {
      const details = sendError instanceof Error ? sendError.message : 'Unknown error occurred';
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send milestone notification',
          details,
          milestone: milestone.description || 'Unknown milestone',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Milestone webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
