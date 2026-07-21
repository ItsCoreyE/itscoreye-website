import { fetchWithRetry } from '@/lib/server/httpClient';

const THUMBNAILS_API = 'https://thumbnails.roblox.com/v1/assets';

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  Accept: 'application/json',
};

export const cleanAssetId = (assetId: string) => assetId.replace(/[^\d]/g, '');

// The Roblox thumbnails API is natively batched: one request covers all IDs.
export const getAssetThumbnails = async (
  assetIds: string[]
): Promise<Record<string, string | null>> => {
  const ids = [...new Set(assetIds.map(cleanAssetId).filter(Boolean))];
  const thumbnails: Record<string, string | null> = {};
  for (const id of ids) thumbnails[id] = null;
  if (ids.length === 0) return thumbnails;

  try {
    const response = await fetchWithRetry(
      `${THUMBNAILS_API}?assetIds=${ids.join(',')}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`,
      { headers: REQUEST_HEADERS },
      { timeoutMs: 8000, retries: 2, retryDelayMs: 400 }
    );

    if (!response.ok) return thumbnails;

    const data = (await response.json()) as {
      data?: Array<{ targetId?: number; imageUrl?: string }>;
    };

    for (const entry of data.data ?? []) {
      const id = String(entry.targetId ?? '');
      const imageUrl = entry.imageUrl;
      if (id in thumbnails && imageUrl && imageUrl !== 'null' && !imageUrl.includes('placeholder')) {
        thumbnails[id] = imageUrl;
      }
    }
  } catch (error) {
    console.error('Roblox thumbnail batch fetch failed:', error);
  }

  return thumbnails;
};

export const getAssetThumbnail = async (assetId: string): Promise<string | null> => {
  const id = cleanAssetId(assetId);
  if (!id) return null;
  const thumbnails = await getAssetThumbnails([id]);
  return thumbnails[id] ?? null;
};
