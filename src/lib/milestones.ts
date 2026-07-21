import type { Milestone, MilestoneCategory, MilestoneProgressStats } from '@/types/ugc';

export const defaultMilestones: Milestone[] = [
  // Verification Milestone - Main Goal
  { id: 'verify-roblox', category: 'verification', target: 1, description: 'Roblox Verified Creator (Blue Checkmark)', isCompleted: false },

  // Revenue Milestones (15 total)
  { id: 'rev-1k', category: 'revenue', target: 1000, description: 'Earned 1,000 Robux', isCompleted: false },
  { id: 'rev-5k', category: 'revenue', target: 5000, description: 'Earned 5,000 Robux', isCompleted: false },
  { id: 'rev-10k', category: 'revenue', target: 10000, description: 'Earned 10,000 Robux', isCompleted: false },
  { id: 'rev-25k', category: 'revenue', target: 25000, description: 'Earned 25,000 Robux', isCompleted: false },
  { id: 'rev-50k', category: 'revenue', target: 50000, description: 'Earned 50,000 Robux', isCompleted: false },
  { id: 'rev-75k', category: 'revenue', target: 75000, description: 'Earned 75,000 Robux', isCompleted: false },
  { id: 'rev-100k', category: 'revenue', target: 100000, description: 'Earned 100,000 Robux', isCompleted: false },
  { id: 'rev-250k', category: 'revenue', target: 250000, description: 'Earned 250,000 Robux', isCompleted: false },
  { id: 'rev-500k', category: 'revenue', target: 500000, description: 'Earned 500,000 Robux', isCompleted: false },
  { id: 'rev-1m', category: 'revenue', target: 1000000, description: 'Earned 1,000,000 Robux', isCompleted: false },
  { id: 'rev-1.5m', category: 'revenue', target: 1500000, description: 'Earned 1,500,000 Robux', isCompleted: false },
  { id: 'rev-2m', category: 'revenue', target: 2000000, description: 'Earned 2,000,000 Robux', isCompleted: false },
  { id: 'rev-3m', category: 'revenue', target: 3000000, description: 'Earned 3,000,000 Robux', isCompleted: false },
  { id: 'rev-5m', category: 'revenue', target: 5000000, description: 'Earned 5,000,000 Robux', isCompleted: false },
  { id: 'rev-10m', category: 'revenue', target: 10000000, description: 'Earned 10,000,000 Robux', isCompleted: false },

  // Sales Milestones (15 total)
  { id: 'sales-100', category: 'sales', target: 100, description: '100 total item sales', isCompleted: false },
  { id: 'sales-250', category: 'sales', target: 250, description: '250 total item sales', isCompleted: false },
  { id: 'sales-500', category: 'sales', target: 500, description: '500 total item sales', isCompleted: false },
  { id: 'sales-1k', category: 'sales', target: 1000, description: '1,000 total item sales', isCompleted: false },
  { id: 'sales-2.5k', category: 'sales', target: 2500, description: '2,500 total item sales', isCompleted: false },
  { id: 'sales-5k', category: 'sales', target: 5000, description: '5,000 total item sales', isCompleted: false },
  { id: 'sales-10k', category: 'sales', target: 10000, description: '10,000 total item sales', isCompleted: false },
  { id: 'sales-25k', category: 'sales', target: 25000, description: '25,000 total item sales', isCompleted: false },
  { id: 'sales-50k', category: 'sales', target: 50000, description: '50,000 total item sales', isCompleted: false },
  { id: 'sales-75k', category: 'sales', target: 75000, description: '75,000 total item sales', isCompleted: false },
  { id: 'sales-100k', category: 'sales', target: 100000, description: '100,000 total item sales', isCompleted: false },
  { id: 'sales-150k', category: 'sales', target: 150000, description: '150,000 total item sales', isCompleted: false },
  { id: 'sales-250k', category: 'sales', target: 250000, description: '250,000 total item sales', isCompleted: false },
  { id: 'sales-500k', category: 'sales', target: 500000, description: '500,000 total item sales', isCompleted: false },
  { id: 'sales-1m', category: 'sales', target: 1000000, description: '1,000,000 total item sales', isCompleted: false },

  // Item Release Milestones (15 total)
  { id: 'items-1', category: 'items', target: 1, description: '1st UGC item published', isCompleted: false },
  { id: 'items-5', category: 'items', target: 5, description: '5 UGC items published', isCompleted: false },
  { id: 'items-10', category: 'items', target: 10, description: '10 UGC items published', isCompleted: false },
  { id: 'items-20', category: 'items', target: 20, description: '20 UGC items published', isCompleted: false },
  { id: 'items-50', category: 'items', target: 50, description: '50 UGC items published', isCompleted: false },
  { id: 'items-100', category: 'items', target: 100, description: '100 UGC items published', isCompleted: false },
  { id: 'items-150', category: 'items', target: 150, description: '150 UGC items published', isCompleted: false },
  { id: 'items-200', category: 'items', target: 200, description: '200 UGC items published', isCompleted: false },
  { id: 'items-300', category: 'items', target: 300, description: '300 UGC items published', isCompleted: false },
  { id: 'items-500', category: 'items', target: 500, description: '500 UGC items published', isCompleted: false },
  { id: 'items-750', category: 'items', target: 750, description: '750 UGC items published', isCompleted: false },
  { id: 'items-1000', category: 'items', target: 1000, description: '1,000 UGC items published', isCompleted: false },
  { id: 'items-1500', category: 'items', target: 1500, description: '1,500 UGC items published', isCompleted: false },
  { id: 'items-2000', category: 'items', target: 2000, description: '2,000 UGC items published', isCompleted: false },
  { id: 'items-3000', category: 'items', target: 3000, description: '3,000 UGC items published', isCompleted: false },

  // Collectibles Milestones (12 total) - Personal Roblox Limited Goals
  { id: 'coll-korblox', category: 'collectibles', target: 1, description: 'Korblox Deathspeaker', isCompleted: false, assetId: '192' },
  { id: 'coll-headless', category: 'collectibles', target: 2, description: 'Headless Horseman', isCompleted: false, assetId: '201' },
  { id: 'coll-vampire', category: 'collectibles', target: 3, description: 'Playful Vampire', isCompleted: false, assetId: '2409285794' },
  { id: 'coll-helsworn-valk', category: 'collectibles', target: 4, description: 'Helsworn Valkyrie', isCompleted: false, assetId: '113598419875472' },
  { id: 'coll-violet-valk', category: 'collectibles', target: 5, description: 'Violet Valkyrie', isCompleted: false, assetId: '1402432199' },
  { id: 'coll-valk-helm', category: 'collectibles', target: 6, description: 'Valkyrie Helm', isCompleted: false, assetId: '1365767' },
  { id: 'coll-ice-valk', category: 'collectibles', target: 7, description: 'Ice Valkyrie', isCompleted: false, assetId: '4390891467' },
  { id: 'coll-sparkle-valk', category: 'collectibles', target: 8, description: 'Sparkle Time Valkyrie', isCompleted: false, assetId: '1180433861' },
  { id: 'coll-sparkle-fedora', category: 'collectibles', target: 9, description: 'Sparkle Time Fedora', isCompleted: false, assetId: '1285307' },
  { id: 'coll-white-fedora', category: 'collectibles', target: 10, description: 'White Sparkle Time Fedora', isCompleted: false, assetId: '1016143686' },
  { id: 'coll-green-fedora', category: 'collectibles', target: 11, description: 'Green Sparkle Time Fedora', isCompleted: false, assetId: '100929604' },
  { id: 'coll-midnight-fedora', category: 'collectibles', target: 12, description: 'Midnight Blue Sparkle Time Fedora', isCompleted: false, assetId: '119916949' },
];

export const PROGRESS_CATEGORIES = [
  { key: 'revenue', title: 'Revenue' },
  { key: 'sales', title: 'Sales' },
  { key: 'items', title: 'Items' },
  { key: 'collectibles', title: 'Collectibles' },
] as const satisfies ReadonlyArray<{ key: MilestoneCategory; title: string }>;

export interface MergedMilestones {
  milestones: Milestone[];
  migrated: boolean;
}

// Pure schema migration: reconciles stored milestones with the current
// defaults, preserving completion status. Never touches storage; persistence
// happens on the next admin save.
export const mergeWithDefaults = (existing: Milestone[] | null | undefined): MergedMilestones => {
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    return { milestones: defaultMilestones, migrated: false };
  }

  const defaultIds = new Set(defaultMilestones.map((m) => m.id));
  const existingIds = new Set(existing.map((m) => m.id));
  const hasMissingIds = defaultMilestones.some((m) => !existingIds.has(m.id));
  const hasRemovedIds = existing.some((m) => !defaultIds.has(m.id));
  const needsSchemaMigration =
    existing.length !== defaultMilestones.length || hasMissingIds || hasRemovedIds;

  const needsCollectibleUpdate = defaultMilestones.some((defaultMilestone) => {
    if (defaultMilestone.category !== 'collectibles') return false;
    const existingMilestone = existing.find((m) => m.id === defaultMilestone.id);
    return (
      existingMilestone &&
      (existingMilestone.description !== defaultMilestone.description ||
        existingMilestone.assetId !== defaultMilestone.assetId)
    );
  });

  if (!needsSchemaMigration && !needsCollectibleUpdate) {
    return { milestones: existing, migrated: false };
  }

  const migratedMilestones = defaultMilestones.map((defaultMilestone) => {
    const existingMilestone = existing.find((m) => m.id === defaultMilestone.id);

    if (existingMilestone) {
      // For collectibles, update names and asset IDs while preserving completion status
      if (defaultMilestone.category === 'collectibles') {
        return { ...defaultMilestone, isCompleted: existingMilestone.isCompleted };
      }
      return existingMilestone;
    }

    return defaultMilestone;
  });

  return { milestones: migratedMilestones, migrated: true };
};

export const calculateProgress = (milestones: Milestone[]): MilestoneProgressStats => {
  const countFor = (category: MilestoneCategory) => ({
    total: milestones.filter((m) => m.category === category).length,
    completed: milestones.filter((m) => m.category === category && m.isCompleted).length,
  });

  const revenue = countFor('revenue');
  const sales = countFor('sales');
  const items = countFor('items');
  const collectibles = countFor('collectibles');

  const totalCompleted = revenue.completed + sales.completed + items.completed + collectibles.completed;
  const totalMilestones = revenue.total + sales.total + items.total + collectibles.total;
  const completionPercentage =
    totalMilestones > 0 ? Math.round((totalCompleted / totalMilestones) * 100) : 0;

  return {
    revenue_completed: revenue.completed,
    revenue_total: revenue.total,
    sales_completed: sales.completed,
    sales_total: sales.total,
    items_completed: items.completed,
    items_total: items.total,
    collectibles_completed: collectibles.completed,
    collectibles_total: collectibles.total,
    total_completed: totalCompleted,
    total_milestones: totalMilestones,
    completion_percentage: completionPercentage,
  };
};

export const getCategoryProgress = (milestones: Milestone[]) =>
  PROGRESS_CATEGORIES.map(({ key, title }) => ({
    category: key,
    title,
    completed: milestones.filter((m) => m.category === key && m.isCompleted).length,
    total: milestones.filter((m) => m.category === key).length,
  }));
