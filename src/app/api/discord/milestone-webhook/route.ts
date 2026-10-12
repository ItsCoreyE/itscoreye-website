import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';
import {
  sendMilestoneNotification,
  type MilestoneData,
  type ProgressData,
} from '@/lib/server/discordNotifications';

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

    try {
      await sendMilestoneNotification(milestone, progress);

      return NextResponse.json({
        success: true,
        message: 'Milestone notification queued for Ember to post',
        milestone: milestone.description || 'Unknown milestone',
        category: milestone.category || 'unknown',
        delivery: 'ember',
      });
    } catch (sendError: unknown) {

      const details = sendError instanceof Error ? sendError.message : 'Unknown error occurred';
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to queue milestone notification',
          details,
          milestone: milestone.description || 'Unknown milestone',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Milestone webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
