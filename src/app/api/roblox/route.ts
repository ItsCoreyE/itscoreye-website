import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get('assetId');
  
  if (!assetId) {
    return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
  }

  // Validate asset ID format
  const cleanAssetId = assetId.replace(/[^\d]/g, '');
  if (!cleanAssetId || cleanAssetId.length < 1) {
    console.log(`❌ Invalid asset ID format: ${assetId}`);
    return NextResponse.json({
      thumbnail: null,
      success: false,
      error: 'Invalid asset ID format'
    });
  }

  try {
    console.log(`🖼️ Fetching thumbnail for ${cleanAssetId}`);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let thumbnail = null;
    
    // Fetch thumbnail from Roblox API
    const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${cleanAssetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
      }
    });
    
    if (thumbnailResponse.ok) {
      const thumbnailData = await thumbnailResponse.json();
      const imageUrl = thumbnailData.data?.[0]?.imageUrl;
      if (imageUrl && imageUrl !== 'null' && !imageUrl.includes('placeholder')) {
        thumbnail = imageUrl;
        console.log(`✅ Got thumbnail for ${cleanAssetId}`);
      } else {
        console.log(`⚠️ No valid thumbnail found for ${cleanAssetId}`);
      }
    } else {
      console.log(`⚠️ Thumbnail API failed for ${cleanAssetId}: ${thumbnailResponse.status}`);
    }
    
    const success = thumbnail !== null;
    
    return NextResponse.json({
      thumbnail,
      success,
      assetId: cleanAssetId
    });
    
  } catch (error) {
    console.error(`❌ Error fetching thumbnail for ${cleanAssetId}:`, error);
    return NextResponse.json({
      thumbnail: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      assetId: cleanAssetId
    });
  }
}
