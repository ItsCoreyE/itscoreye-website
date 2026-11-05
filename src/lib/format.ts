export const formatNumber = (value: number) => value.toLocaleString('en-GB');

// "HairAccessory" becomes "Hair Accessory"
export const formatAssetType = (assetType: string) => assetType.replace(/([A-Z])/g, ' $1').trim();

export const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};
