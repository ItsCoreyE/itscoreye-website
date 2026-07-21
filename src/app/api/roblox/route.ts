import { NextRequest, NextResponse } from 'next/server';
import { cleanAssetId, getAssetThumbnail, getAssetThumbnails } from '@/lib/server/roblox';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assetIdsParam = searchParams.get('assetIds');
  const assetIdParam = searchParams.get('assetId');

  // Batched mode: ?assetIds=1,2,3 → { thumbnails: { id: url | null } }
  if (assetIdsParam) {
    const ids = assetIdsParam.split(',').map(cleanAssetId).filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid asset IDs provided' },
        { status: 400 }
      );
    }

    const thumbnails = await getAssetThumbnails(ids);
    return NextResponse.json({ success: true, thumbnails });
  }

  // Single mode: ?assetId=1 → { thumbnail, success, assetId }
  if (!assetIdParam) {
    return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
  }

  const assetId = cleanAssetId(assetIdParam);
  if (!assetId) {
    return NextResponse.json({
      thumbnail: null,
      success: false,
      error: 'Invalid asset ID format'
    });
  }

  try {
    const thumbnail = await getAssetThumbnail(assetId);

    return NextResponse.json({
      thumbnail,
      success: thumbnail !== null,
      assetId
    });
  } catch (error) {
    console.error(`Error fetching thumbnail for ${assetId}:`, error);
    return NextResponse.json({
      thumbnail: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      assetId
    });
  }
}
