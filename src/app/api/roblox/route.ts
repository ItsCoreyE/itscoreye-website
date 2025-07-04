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
      description: 'Amazing creation by ItsCoreyE',
      thumbnail: null,
      success: false,
      error: 'Invalid asset ID format'
    });
  }

  try {
    console.log(`🔍 Fetching asset details for ${cleanAssetId}`);
    
    // Add longer delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let description = 'Amazing creation by ItsCoreyE';
    let thumbnail = null;
    
    // Try multiple API endpoints for better success rate
    const endpoints = [
      `https://economy.roblox.com/v2/assets/${cleanAssetId}/details`,
      `https://api.roblox.com/marketplace/productinfo?assetId=${cleanAssetId}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🌐 Trying endpoint: ${endpoint}`);
        const assetResponse = await fetch(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
          }
        });
        
        if (assetResponse.ok) {
          const assetData = await assetResponse.json();
          // Handle different API response formats
          const desc = assetData.Description || assetData.description || assetData.Description || null;
          if (desc && desc.trim() && desc !== 'null' && desc !== '') {
            description = desc.trim();
            console.log(`✅ Got description for ${cleanAssetId}: "${description.substring(0, 50)}..."`);
            break; // Success, exit loop
          }
        } else {
          console.log(`⚠️ Endpoint failed for ${cleanAssetId}: ${assetResponse.status} - ${endpoint}`);
        }
      } catch (endpointError) {
        console.log(`❌ Endpoint error for ${cleanAssetId}: ${endpointError} - ${endpoint}`);
        continue; // Try next endpoint
      }
    }
    
    // Fetch thumbnail with retry logic
    try {
      console.log(`🖼️ Fetching thumbnail for ${cleanAssetId}`);
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
        }
      } else {
        console.log(`⚠️ Thumbnail API failed for ${cleanAssetId}: ${thumbnailResponse.status}`);
      }
    } catch (thumbnailError) {
      console.log(`❌ Thumbnail fetch error for ${cleanAssetId}:`, thumbnailError);
    }
    
    const success = description !== 'Amazing creation by ItsCoreyE' || thumbnail !== null;
    
    return NextResponse.json({
      description,
      thumbnail,
      success,
      assetId: cleanAssetId
    });
    
  } catch (error) {
    console.error(`❌ Critical error fetching asset ${cleanAssetId}:`, error);
    return NextResponse.json({
      description: 'Amazing creation by ItsCoreyE',
      thumbnail: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      assetId: cleanAssetId
    });
  }
}
