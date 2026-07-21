import type { SalesData } from '@/types/ugc';

export const normalizeSalesData = (value: unknown): SalesData | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<SalesData>;

  return {
    totalRevenue: Number(candidate.totalRevenue) || 0,
    totalSales: Number(candidate.totalSales) || 0,
    growthPercentage: Number(candidate.growthPercentage) || 0,
    lastUpdated:
      typeof candidate.lastUpdated === 'string'
        ? candidate.lastUpdated
        : new Date().toISOString(),
    dataPeriod: typeof candidate.dataPeriod === 'string' ? candidate.dataPeriod : 'Current Period',
    topItems: Array.isArray(candidate.topItems)
      ? candidate.topItems.slice(0, 6).map((item) => ({
          name: item?.name || 'Unknown Item',
          sales: Number(item?.sales) || 0,
          revenue: Number(item?.revenue) || 0,
          price: Number(item?.price) || 0,
          assetId: item?.assetId || '',
          assetType: item?.assetType || '',
          thumbnail: item?.thumbnail || '',
        }))
      : [],
  };
};

export const emptySalesData = (): SalesData => ({
  totalRevenue: 0,
  totalSales: 0,
  growthPercentage: 0,
  lastUpdated: new Date().toISOString(),
  dataPeriod: 'Awaiting Data Upload',
  topItems: [],
});
