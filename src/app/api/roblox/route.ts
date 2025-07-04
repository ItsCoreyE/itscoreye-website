import { get } from '@vercel/edge-config';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch current data from Edge Config
export async function GET() {
  try {
    const data = await get('ugc-sales-data');
    
    if (!data) {
      // Return default data if none exists
      return NextResponse.json({
        totalRevenue: 56799,
        totalSales: 2653,
        growthPercentage: 2579,
        lastUpdated: 'Default Data',
        dataPeriod: 'All Time',
        topItems: []
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - For now, we'll store data temporarily and you can manually update Edge Config
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Store the data format for manual Edge Config update
    console.log('Data to be added to Edge Config:', JSON.stringify(data, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data processed! Please copy the console output to Edge Config dashboard.',
      data: data
    });
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}