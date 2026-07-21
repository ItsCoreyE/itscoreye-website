import type { SalesData, TopItem } from '@/types/ugc';

// Roblox sales CSV column layout (0-indexed): 2 = sale date, 7 = asset ID,
// 8 = asset name, 9 = asset type, 11 = revenue, 12 = price.
const MIN_COLUMNS = 13;

export const parseCsvRows = (csvText: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentField += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      currentRow.push(currentField);
      currentField = '';

      if (currentRow.some((field) => field.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((field) => field.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const formatPeriod = (earliest: Date | null, latest: Date | null, fallback: string) => {
  if (!earliest || !latest) return fallback;
  const earliestMonth = earliest.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const latestMonth = latest.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  return earliestMonth === latestMonth ? earliestMonth : `${earliestMonth} - ${latestMonth}`;
};

// Totals-only pass, used for the previous-month side of growth calculations.
export const summarizeSalesCsv = (csvText: string, fallbackPeriod = 'CSV Data'): SalesData => {
  const rows = parseCsvRows(csvText);
  let totalRevenue = 0;
  let totalSales = 0;
  let earliestDate: Date | null = null;
  let latestDate: Date | null = null;

  for (let i = 1; i < rows.length; i += 1) {
    const columns = rows[i];
    if (columns.length < MIN_COLUMNS) continue;

    const revenue = parseFloat((columns[11] || '').trim());
    const saleDate = new Date((columns[2] || '').trim());

    if (!isNaN(saleDate.getTime())) {
      if (!earliestDate || saleDate < earliestDate) earliestDate = saleDate;
      if (!latestDate || saleDate > latestDate) latestDate = saleDate;
    }

    if (!isNaN(revenue) && revenue > 0) {
      totalRevenue += revenue;
      totalSales += 1;
    }
  }

  return {
    totalRevenue: Math.round(totalRevenue),
    totalSales,
    growthPercentage: 0,
    lastUpdated: new Date().toISOString(),
    dataPeriod: formatPeriod(earliestDate, latestDate, fallbackPeriod),
    topItems: [],
  };
};

// Full pass: totals plus the top 6 selling items. Thumbnails are attached by
// the caller (one batched /api/roblox request) so this function stays pure.
export const processSalesCsv = (csvText: string): SalesData => {
  const rows = parseCsvRows(csvText);
  let totalRevenue = 0;
  let totalSales = 0;
  const itemSales: Record<
    string,
    { sales: number; revenue: number; price: number; assetId: string; assetType: string }
  > = {};
  let earliestDate: Date | null = null;
  let latestDate: Date | null = null;

  for (let i = 1; i < rows.length; i += 1) {
    const columns = rows[i];
    if (columns.length < MIN_COLUMNS) continue;

    const revenue = parseFloat((columns[11] || '').trim());
    const price = parseFloat((columns[12] || '').trim());
    const assetId = (columns[7] || '').trim();
    const assetName = (columns[8] || '').trim();
    const assetType = (columns[9] || '').trim();
    const saleDate = new Date((columns[2] || '').trim());

    if (!isNaN(saleDate.getTime())) {
      if (!earliestDate || saleDate < earliestDate) earliestDate = saleDate;
      if (!latestDate || saleDate > latestDate) latestDate = saleDate;
    }

    if (!isNaN(revenue) && revenue > 0) {
      totalRevenue += revenue;
      totalSales += 1;

      if (!itemSales[assetName]) {
        itemSales[assetName] = {
          sales: 0,
          revenue: 0,
          price: price || 0,
          assetId,
          assetType,
        };
      }
      itemSales[assetName].sales += 1;
      itemSales[assetName].revenue += revenue;
    }
  }

  const topItems: TopItem[] = Object.entries(itemSales)
    .map(([name, data]) => ({
      name,
      sales: data.sales,
      revenue: data.revenue,
      price: data.price,
      assetId: data.assetId,
      assetType: data.assetType,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  return {
    totalRevenue: Math.round(totalRevenue),
    totalSales,
    growthPercentage: 0,
    lastUpdated: new Date().toISOString(),
    dataPeriod: formatPeriod(earliestDate, latestDate, 'CSV Data'),
    topItems,
  };
};
