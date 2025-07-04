import { get } from '@vercel/edge-config';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch current data from Edge Config or asset details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    
    // If assetId is provided, fetch asset details from ROBLOX API
    if (assetId) {
      return await fetchAssetDetails(assetId);
    }
    
    // Otherwise, fetch sales data from Edge Config
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

// POST - Process data for Edge Config update
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Log the data in the format needed for Edge Config
    console.log('=== EDGE CONFIG UPDATE DATA ===');
    console.log('Key: ugc-sales-data');
    console.log('Value:', JSON.stringify(data, null, 2));
    console.log('=== END EDGE CONFIG DATA ===');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data processed! Check server logs for Edge Config update data. You can also manually update Edge Config dashboard with this data.',
      data: data,
      edgeConfigKey: 'ugc-sales-data'
    });
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}

// Helper function to fetch asset details from ROBLOX API
async function fetchAssetDetails(assetId: string) {
  try {
    console.log(`Fetching details for asset ${assetId}...`);
    
    // Fetch asset details from ROBLOX API
    const assetResponse = await fetch(`https://catalog.roblox.com/v1/catalog/items/${assetId}/details`);
    
    if (!assetResponse.ok) {
      throw new Error(`ROBLOX API returned ${assetResponse.status}`);
    }
    
    const assetData = await assetResponse.json();
    
    // Fetch thumbnail
    const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png&isCircular=false`);
    let thumbnail = null;
    
    if (thumbnailResponse.ok) {
      const thumbnailData = await thumbnailResponse.json();
      if (thumbnailData.data && thumbnailData.data.length > 0) {
        thumbnail = thumbnailData.data[0].imageUrl;
      }
    }
    
    return NextResponse.json({
      success: true,
      description: assetData.description || 'Amazing steampunk creation by ItsCoreyE',
      thumbnail: thumbnail
    });
    
  } catch (error) {
    console.error(`Failed to fetch details for asset ${assetId}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch asset details',
      description: 'Amazing steampunk creation by ItsCoreyE',
      thumbnail: null
    });
  }
}
