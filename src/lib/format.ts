export const formatNumber = (value: number) => value.toLocaleString('en-GB');

// "HairAccessory" becomes "Hair Accessory"
export const formatAssetType = (assetType: string) => assetType.replace(/([A-Z])/g, ' $1').trim();

export const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const MONTH_PATTERN =
  /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/g;

// Sales figures come from a single monthly Roblox report, never an all-time
// total. dataPeriod can read "October 2026", "September 2026 - October 2026" or
// "<previous> → <current>" after a growth calculation; the report month is the
// last month named. Returns null when no month can be found.
export const reportMonth = (dataPeriod?: string) => {
  if (!dataPeriod) return null;
  const matches = [...dataPeriod.matchAll(MONTH_PATTERN)];
  const last = matches[matches.length - 1];
  if (!last) return null;
  return { full: `${last[1]} ${last[2]}`, short: `${last[1].slice(0, 3)} ${last[2]}` };
};
