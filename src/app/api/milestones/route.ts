import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis
const redis = Redis.fromEnv();

export interface Milestone {
  id: string;
  category: 'revenue' | 'sales' | 'items';
  target: number;
  description: string;
  isCompleted: boolean;
}

// Default milestones data
const defaultMilestones: Milestone[] = [
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
    
    // Check if we need to migrate (if existing has fewer milestones than default)
    const needsMigration = existingMilestones.length < defaultMilestones.length;
    
    if (needsMigration) {
      // Migrate: preserve existing completion status, add new milestones
      const migratedMilestones = defaultMilestones.map(defaultMilestone => {
        const existingMilestone = existingMilestones.find(m => m.id === defaultMilestone.id);
        return existingMilestone || defaultMilestone;
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

    await redis.set('ugc-milestones', milestones);

    return NextResponse.json({
      success: true,
      message: 'Milestones updated successfully',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update milestones' },
      { status: 500 }
    );
  }
}
