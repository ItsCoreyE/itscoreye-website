import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';

// Initialize Redis
const redis = Redis.fromEnv();

// GET - Fetch current data from Upstash
export async function GET() {
  try {
    const data = await redis.get('ugc-sales-data');
    
    if (!data) {
      return NextResponse.json({
        totalRevenue: 56799,
        totalSales: 2653,
        growthPercentage: 2579,
        lastUpdated: new Date().toISOString(),
        dataPeriod: 'All Time',
        topItems: []
      });
    }
    
    // Return data with current timestamp (live update)
    return NextResponse.json({
      ...data,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Automatically save data to Upstash
export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequestAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    console.log('💾 Saving data to Upstash...', data.totalRevenue);
    
    const previousData = await redis.get('ugc-sales-data');
    if (previousData) {
      await redis.set('ugc-sales-data-previous', previousData);
    }

    // Save latest snapshot to Upstash Redis
    await redis.set('ugc-sales-data', data);
    
    console.log('✅ Data automatically saved to Upstash');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data saved automatically to global storage!' 
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
