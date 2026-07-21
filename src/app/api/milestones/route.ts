import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';
import { getMilestones, getStoredMilestones, saveMilestones, HOME_DATA_TAG } from '@/lib/server/store';
import { calculateProgress } from '@/lib/milestones';
import { sendMilestoneNotification } from '@/lib/server/discordNotifications';
import type { Milestone } from '@/types/ugc';

// GET - Fetch milestones, reconciled with the current default schema.
// Read-only: the merged view is persisted on the next admin save.
export async function GET() {
  try {
    const { milestones, migrated } = await getMilestones();

    return NextResponse.json({
      success: true,
      milestones,
      lastUpdated: new Date().toISOString(),
      ...(migrated ? { migrated: true } : {}),
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

// POST - Save milestones (admin only) and notify Discord about newly
// completed ones.
export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequestAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { milestones } = (await request.json()) as { milestones?: Milestone[] };

    if (!milestones || !Array.isArray(milestones)) {
      return NextResponse.json(
        { success: false, error: 'Invalid milestones data' },
        { status: 400 }
      );
    }

    for (const milestone of milestones) {
      if (!milestone.id || !milestone.category || !milestone.description) {
        return NextResponse.json(
          { success: false, error: 'Invalid milestone structure' },
          { status: 400 }
        );
      }
    }

    // Compare with stored milestones to find newly completed ones
    const existingMilestones = await getStoredMilestones();
    const newlyCompletedMilestones: Milestone[] = [];

    if (existingMilestones) {
      for (const newMilestone of milestones) {
        const existingMilestone = existingMilestones.find((m) => m.id === newMilestone.id);
        if (existingMilestone && !existingMilestone.isCompleted && newMilestone.isCompleted) {
          newlyCompletedMilestones.push(newMilestone);
        }
      }
    }

    await saveMilestones(milestones);
    revalidateTag(HOME_DATA_TAG);
    revalidatePath('/');

    const discordNotifications: Array<{
      milestone: string;
      success: boolean;
      message?: string;
      error?: string;
    }> = [];

    if (newlyCompletedMilestones.length > 0) {
      const progressStats = calculateProgress(milestones);

      for (const milestone of newlyCompletedMilestones) {
        try {
          await sendMilestoneNotification(milestone, progressStats);
          discordNotifications.push({
            milestone: milestone.description,
            success: true,
            message: 'Milestone notification sent to Discord',
          });
        } catch (discordError) {
          console.error(`Discord notification failed for ${milestone.description}:`, discordError);
          discordNotifications.push({
            milestone: milestone.description,
            success: false,
            error:
              discordError instanceof Error
                ? discordError.message
                : 'Failed to send milestone notification',
          });
        }
      }
    }

    const response = {
      success: true,
      message: 'Milestones updated successfully',
      lastUpdated: new Date().toISOString(),
      newlyCompleted: newlyCompletedMilestones.length,
      discordNotifications,
    };

    if (newlyCompletedMilestones.length > 0) {
      response.message += ` (${newlyCompletedMilestones.length} new milestone${newlyCompletedMilestones.length > 1 ? 's' : ''} completed!)`;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update milestones' },
      { status: 500 }
    );
  }
}
