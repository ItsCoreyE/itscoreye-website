import { unstable_cache } from 'next/cache';
import { redis, KEYS } from '@/lib/server/redis';
import { normalizeSalesData, emptySalesData } from '@/lib/salesData';
import { mergeWithDefaults, type MergedMilestones } from '@/lib/milestones';
import type { Milestone, SalesData } from '@/types/ugc';

export const getSalesData = async (): Promise<SalesData> => {
  const raw = await redis.get(KEYS.salesData);
  return normalizeSalesData(raw) ?? emptySalesData();
};

export const saveSalesData = async (data: SalesData) => {
  await redis.set(KEYS.salesData, data);
};

export const getStoredMilestones = async (): Promise<Milestone[] | null> => {
  return (await redis.get<Milestone[]>(KEYS.milestones)) ?? null;
};

// Always returns the current-schema view of the milestones (pure merge with
// defaults); the merged result is persisted on the next admin save.
export const getMilestones = async (): Promise<MergedMilestones> => {
  const existing = await getStoredMilestones();
  return mergeWithDefaults(existing);
};

export const saveMilestones = async (milestones: Milestone[]) => {
  await redis.set(KEYS.milestones, milestones);
};

// Cached read used by the homepage so it can render statically; the admin
// POST routes bust this via revalidateTag(HOME_DATA_TAG).
export const HOME_DATA_TAG = 'home-data';

export const getHomeData = unstable_cache(
  async () => {
    const [sales, merged] = await Promise.all([getSalesData(), getMilestones()]);
    return { sales, milestones: merged.milestones };
  },
  [HOME_DATA_TAG],
  { revalidate: 300, tags: [HOME_DATA_TAG] }
);
