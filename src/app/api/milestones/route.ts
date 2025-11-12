import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis
const redis = Redis.fromEnv();

export interface Milestone {
  id: string;
  category: 'revenue' | 'sales' | 'items' | 'collectibles' | 'verification';
  target: number;
  description: string;
  isCompleted: boolean;
  assetId?: string; // For Roblox items to fetch thumbnails
}

// Default milestones data
const defaultMilestones: Milestone[] = [
  // Verification Milestone - Main Goal
  { id: 'verify-roblox', category: 'verification', target: 1, description: 'Roblox Verified Creator (Blue Checkmark)', isCompleted: false },

  // Revenue Milestones (15 total)
  { id: 'rev-1k', category: 'revenue', target: 1000, description: 'Earned 1,000 Robux', isCompleted: false },
  { id: 'rev-5k', category: 'revenue', target: 5000, description: 'Earned 5,000 Robux', isCompleted: false },
  { id: 'rev-10k', category: 'revenue', target: 10000, description: 'Earned 10,000 Robux', isCompleted: false },
  { id: 'rev-25k', category: 'revenue', target: 25000, description: 'Earned 25,000 Robux', isCompleted: false },
  { id: 'rev-50k', category: 'revenue', target: 50000, description: 'Earned 50,000 Robux', isCompleted: false },
  { id: 'rev-75k', category: 'revenue', target: 75000, description: 'Earned 75,000 Robux', isCompleted: false },
  { id: 'rev-100k', category: 'revenue', target: 100000, description: 'Earned 100,000 Robux', isCompleted: false },
  { id: 'rev-250k', category: 'revenue', target: 250000, description: 'Earned 250,000 Robux', isCompleted: false },
  { id: 'rev-500k', category: 'revenue', target: 500000, description: 'Earned 500,000 Robux', isCompleted: false },
  { id: 'rev-1m', category: 'revenue', target: 1000000, description: 'Earned 1,000,000 Robux', isCompleted: false },
  { id: 'rev-1.5m', category: 'revenue', target: 1500000, description: 'Earned 1,500,000 Robux', isCompleted: false },
  { id: 'rev-2m', category: 'revenue', target: 2000000, description: 'Earned 2,000,000 Robux', isCompleted: false },
  { id: 'rev-3m', category: 'revenue', target: 3000000, description: 'Earned 3,000,000 Robux', isCompleted: false },
  { id: 'rev-5m', category: 'revenue', target: 5000000, description: 'Earned 5,000,000 Robux', isCompleted: false },
  { id: 'rev-10m', category: 'revenue', target: 10000000, description: 'Earned 10,000,000 Robux', isCompleted: false },

  // Sales Milestones (15 total)
  { id: 'sales-100', category: 'sales', target: 100, description: '100 total item sales', isCompleted: false },
  { id: 'sales-250', category: 'sales', target: 250, description: '250 total item sales', isCompleted: false },
  { id: 'sales-500', category: 'sales', target: 500, description: '500 total item sales', isCompleted: false },
  { id: 'sales-1k', category: 'sales', target: 1000, description: '1,000 total item sales', isCompleted: false },
  { id: 'sales-2.5k', category: 'sales', target: 2500, description: '2,500 total item sales', isCompleted: false },
  { id: 'sales-5k', category: 'sales', target: 5000, description: '5,000 total item sales', isCompleted: false },
  { id: 'sales-10k', category: 'sales', target: 10000, description: '10,000 total item sales', isCompleted: false },
  { id: 'sales-25k', category: 'sales', target: 25000, description: '25,000 total item sales', isCompleted: false },
  { id: 'sales-50k', category: 'sales', target: 50000, description: '50,000 total item sales', isCompleted: false },
  { id: 'sales-75k', category: 'sales', target: 75000, description: '75,000 total item sales', isCompleted: false },
  { id: 'sales-100k', category: 'sales', target: 100000, description: '100,000 total item sales', isCompleted: false },
  { id: 'sales-150k', category: 'sales', target: 150000, description: '150,000 total item sales', isCompleted: false },
  { id: 'sales-250k', category: 'sales', target: 250000, description: '250,000 total item sales', isCompleted: false },
  { id: 'sales-500k', category: 'sales', target: 500000, description: '500,000 total item sales', isCompleted: false },
  { id: 'sales-1m', category: 'sales', target: 1000000, description: '1,000,000 total item sales', isCompleted: false },

  // Item Release Milestones (15 total)
  { id: 'items-1', category: 'items', target: 1, description: '1st UGC item published', isCompleted: false },
  { id: 'items-5', category: 'items', target: 5, description: '5 UGC items published', isCompleted: false },
  { id: 'items-10', category: 'items', target: 10, description: '10 UGC items published', isCompleted: false },
  { id: 'items-20', category: 'items', target: 20, description: '20 UGC items published', isCompleted: false },
  { id: 'items-50', category: 'items', target: 50, description: '50 UGC items published', isCompleted: false },
  { id: 'items-100', category: 'items', target: 100, description: '100 UGC items published', isCompleted: false },
  { id: 'items-150', category: 'items', target: 150, description: '150 UGC items published', isCompleted: false },
  { id: 'items-200', category: 'items', target: 200, description: '200 UGC items published', isCompleted: false },
  { id: 'items-300', category: 'items', target: 300, description: '300 UGC items published', isCompleted: false },
  { id: 'items-500', category: 'items', target: 500, description: '500 UGC items published', isCompleted: false },
  { id: 'items-750', category: 'items', target: 750, description: '750 UGC items published', isCompleted: false },
  { id: 'items-1000', category: 'items', target: 1000, description: '1,000 UGC items published', isCompleted: false },
  { id: 'items-1500', category: 'items', target: 1500, description: '1,500 UGC items published', isCompleted: false },
  { id: 'items-2000', category: 'items', target: 2000, description: '2,000 UGC items published', isCompleted: false },
  { id: 'items-3000', category: 'items', target: 3000, description: '3,000 UGC items published', isCompleted: false },

  // Collectibles Milestones (12 total) - Personal Roblox Limited Goals
  { id: 'coll-korblox', category: 'collectibles', target: 1, description: 'Korblox Deathspeaker', isCompleted: false, assetId: '192' },
  { id: 'coll-headless', category: 'collectibles', target: 2, description: 'Headless Horseman', isCompleted: false, assetId: '201' },
  { id: 'coll-vampire', category: 'collectibles', target: 3, description: 'Playful Vampire', isCompleted: false, assetId: '2409285794' },
  { id: 'coll-helsworn-valk', category: 'collectibles', target: 4, description: 'Helsworn Valkyrie', isCompleted: false, assetId: '113598419875472' },
  { id: 'coll-violet-valk', category: 'collectibles', target: 5, description: 'Violet Valkyrie', isCompleted: false, assetId: '1402432199' },
  { id: 'coll-valk-helm', category: 'collectibles', target: 6, description: 'Valkyrie Helm', isCompleted: false, assetId: '1365767' },
  { id: 'coll-ice-valk', category: 'collectibles', target: 7, description: 'Ice Valkyrie', isCompleted: false, assetId: '4390891467' },
  { id: 'coll-sparkle-valk', category: 'collectibles', target: 8, description: 'Sparkle Time Valkyrie', isCompleted: false, assetId: '1180433861' },
  { id: 'coll-sparkle-fedora', category: 'collectibles', target: 9, description: 'Sparkle Time Fedora', isCompleted: false, assetId: '1285307' },
  { id: 'coll-white-fedora', category: 'collectibles', target: 10, description: 'White Sparkle Time Fedora', isCompleted: false, assetId: '1016143686' },
  { id: 'coll-green-fedora', category: 'collectibles', target: 11, description: 'Green Sparkle Time Fedora', isCompleted: false, assetId: '100929604' },
  { id: 'coll-midnight-fedora', category: 'collectibles', target: 12, description: 'Midnight Blue Sparkle Time Fedora', isCompleted: false, assetId: '119916949' },
];

export async function GET() {
  try {
    const existingMilestones = await redis.get('ugc-milestones') as Milestone[] | null;
    
    if (!existingMilestones) {
      // No existing data, return defaults
      return NextResponse.json({
        success: true,
        milestones: defaultMilestones,
        lastUpdated: new Date().toISOString()
      });
    }
    
    // Check if we need to migrate (add new milestones or update collectible names)
    const needsCountMigration = existingMilestones.length < defaultMilestones.length;
    
    // Check if collectible names/asset IDs need updating
    const needsCollectibleUpdate = defaultMilestones.some(defaultMilestone => {
      if (defaultMilestone.category === 'collectibles') {
        const existingMilestone = existingMilestones.find(m => m.id === defaultMilestone.id);
        return existingMilestone && (
          existingMilestone.description !== defaultMilestone.description ||
          existingMilestone.assetId !== defaultMilestone.assetId
        );
      }
      return false;
    });
    
    if (needsCountMigration || needsCollectibleUpdate) {
      // Migrate: preserve existing completion status, add new milestones, update collectible names
      const migratedMilestones = defaultMilestones.map(defaultMilestone => {
        const existingMilestone = existingMilestones.find(m => m.id === defaultMilestone.id);
        
        if (existingMilestone) {
          // For collectibles, update names and asset IDs while preserving completion status
          if (defaultMilestone.category === 'collectibles') {
            return {
              ...defaultMilestone,
              isCompleted: existingMilestone.isCompleted
            };
          }
          // For other categories, keep existing data
          return existingMilestone;
        }
        
        // New milestone, use default
        return defaultMilestone;
      });
      
      // Save the migrated data
      await redis.set('ugc-milestones', migratedMilestones);
      
      return NextResponse.json({
        success: true,
        milestones: migratedMilestones,
        lastUpdated: new Date().toISOString(),
        migrated: true
      });
    }
    
    return NextResponse.json({
      success: true,
      milestones: existingMilestones,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { milestones } = await request.json();

    if (!milestones || !Array.isArray(milestones)) {
      return NextResponse.json(
        { success: false, error: 'Invalid milestones data' },
        { status: 400 }
      );
    }

    // Validate milestone structure
    for (const milestone of milestones) {
      if (!milestone.id || !milestone.category || !milestone.description) {
        return NextResponse.json(
          { success: false, error: 'Invalid milestone structure' },
          { status: 400 }
        );
      }
    }

    // Get existing milestones to detect newly completed ones
    const existingMilestones = await redis.get('ugc-milestones') as Milestone[] | null;
    const newlyCompletedMilestones: Milestone[] = [];

    if (existingMilestones) {
      // Compare with existing milestones to find newly completed ones
      for (const newMilestone of milestones) {
        const existingMilestone = existingMilestones.find(m => m.id === newMilestone.id);
        
        // If milestone was not completed before but is now completed
        if (existingMilestone && !existingMilestone.isCompleted && newMilestone.isCompleted) {
          newlyCompletedMilestones.push(newMilestone);
        }
      }
    }

    // Save updated milestones
    await redis.set('ugc-milestones', milestones);

    // Calculate progress statistics for Discord notifications
    const calculateProgress = () => {
      const revenueTotal = milestones.filter(m => m.category === 'revenue').length;
      const salesTotal = milestones.filter(m => m.category === 'sales').length;
      const itemsTotal = milestones.filter(m => m.category === 'items').length;
      const collectiblesTotal = milestones.filter(m => m.category === 'collectibles').length;
      
      const revenueCompleted = milestones.filter(m => m.category === 'revenue' && m.isCompleted).length;
      const salesCompleted = milestones.filter(m => m.category === 'sales' && m.isCompleted).length;
      const itemsCompleted = milestones.filter(m => m.category === 'items' && m.isCompleted).length;
      const collectiblesCompleted = milestones.filter(m => m.category === 'collectibles' && m.isCompleted).length;
      
      const totalCompleted = revenueCompleted + salesCompleted + itemsCompleted + collectiblesCompleted;
      const totalMilestones = revenueTotal + salesTotal + itemsTotal + collectiblesTotal;
      const completionPercentage = totalMilestones > 0 ? Math.round((totalCompleted / totalMilestones) * 100) : 0;

      return {
        revenue_completed: revenueCompleted,
        revenue_total: revenueTotal,
        sales_completed: salesCompleted,
        sales_total: salesTotal,
        items_completed: itemsCompleted,
        items_total: itemsTotal,
        collectibles_completed: collectiblesCompleted,
        collectibles_total: collectiblesTotal,
        total_completed: totalCompleted,
        total_milestones: totalMilestones,
        completion_percentage: completionPercentage
      };
    };

    // Send Discord notifications for newly completed milestones
    const discordNotifications = [];
    if (newlyCompletedMilestones.length > 0) {
      const progressStats = calculateProgress();
      
      for (const milestone of newlyCompletedMilestones) {
        try {
          console.log(`🎉 Sending Discord notification for milestone: ${milestone.description}`);
          
          const discordResponse = await fetch(`${request.nextUrl.origin}/api/discord/milestone-webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              milestone,
              progress: progressStats
            })
          });

          if (discordResponse.ok) {
            const discordResult = await discordResponse.json();
            discordNotifications.push({
              milestone: milestone.description,
              success: true,
              message: discordResult.message
            });
            console.log(`✅ Discord notification sent for: ${milestone.description}`);
          } else {
            const errorResult = await discordResponse.json();
            discordNotifications.push({
              milestone: milestone.description,
              success: false,
              error: errorResult.error
            });
            console.error(`❌ Discord notification failed for: ${milestone.description}`, errorResult);
          }
        } catch (discordError) {
          console.error(`❌ Discord notification error for ${milestone.description}:`, discordError);
          discordNotifications.push({
            milestone: milestone.description,
            success: false,
            error: 'Network error'
          });
        }
      }
    }

    const response = {
      success: true,
      message: 'Milestones updated successfully',
      lastUpdated: new Date().toISOString(),
      newlyCompleted: newlyCompletedMilestones.length,
      discordNotifications
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
