import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';
import { WebhookConfigError } from '@/lib/server/discord';
import {
  sendCsvStatsNotification,
  type StatsData,
} from '@/lib/server/discordNotifications';

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

    try {
      const normalizedStats = await sendCsvStatsNotification(statsData);

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
      if (sendError instanceof WebhookConfigError) {
        return NextResponse.json(
          { success: false, error: sendError.message },
          { status: 500 }
        );
      }

      const details = sendError instanceof Error ? sendError.message : 'Unknown error occurred';
      console.error('Monthly stats webhook send failed:', details);

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
    console.error('CSV stats webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
