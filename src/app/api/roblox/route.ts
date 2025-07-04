import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get('assetId');
  
  if (!assetId) {
    return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
  }

  try {
    console.log(`Fetching asset details for ${assetId}`);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Fetch asset details from server-side (no CORS issues)
    const assetResponse = await fetch(`https://economy.roblox.com/v2/assets/${assetId}/details`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });
    
    let description = 'Amazing creation by ItsCoreyE';
    let thumbnail = null;
    
    if (assetResponse.ok) {
      const assetData = await assetResponse.json();
      description = assetData.Description || description;
      console.log(`✅ Got description for ${assetId}`);
    } else {
      console.log(`⚠️ Asset API failed for ${assetId}: ${assetResponse.status}`);
    }
    
    // Fetch thumbnail
    const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });
    
    if (thumbnailResponse.ok) {
      const thumbnailData = await thumbnailResponse.json();
      thumbnail = thumbnailData.data?.[0]?.imageUrl || null;
      console.log(`✅ Got thumbnail for ${assetId}`);
    } else {
      console.log(`⚠️ Thumbnail API failed for ${assetId}: ${thumbnailResponse.status}`);
    }
    
    return NextResponse.json({
      description,
      thumbnail,
      success: true
    });
    
  } catch (error) {
    console.error(`Error fetching asset ${assetId}:`, error);
    return NextResponse.json({
      description: 'Amazing creation by ItsCoreyE',
      thumbnail: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}