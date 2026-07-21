import type { TopItem } from '@/types/ugc';

// Attaches Roblox thumbnails to top items with a single batched request to
// /api/roblox (replaces the old one-request-per-item flow with 1.5s sleeps).
export const attachThumbnails = async (items: TopItem[]): Promise<TopItem[]> => {
  const ids = items
    .map((item) => (item.assetId || '').replace(/[^\d]/g, ''))
    .filter(Boolean);
  if (ids.length === 0) return items;

  try {
    const response = await fetch(`/api/roblox?assetIds=${ids.join(',')}`);
    if (!response.ok) return items;

    const data = (await response.json()) as {
      thumbnails?: Record<string, string | null>;
    };
    const thumbnails = data.thumbnails ?? {};

    return items.map((item) => {
      const id = (item.assetId || '').replace(/[^\d]/g, '');
      return { ...item, thumbnail: (id && thumbnails[id]) || item.thumbnail || '' };
    });
  } catch (error) {
    console.error('Thumbnail fetch failed:', error);
    return items;
  }
};
