import { randomUUID } from 'node:crypto';
import { redis, KEYS } from '@/lib/server/redis';

// Discord posts for milestones and monthly stats are made by Ember, the Coreys Cave Discord bot. The website
// adds a note to the Ember outbox (a Redis list); Ember checks it every minute, builds the embeds and posts
// them as itself, so no webhook or bot token lives here. Note shapes are a contract with Ember's
// src/feeds/website.js: { id, createdAt, type: 'milestone', milestone, progress } and
// { id, createdAt, type: 'monthly-stats', stats }.

// Loose input shapes: payloads arrive from HTTP so every field is treated as optional/untrusted.
export interface MilestoneData {
  id?: string;
  category?: 'revenue' | 'sales' | 'items' | 'collectibles' | 'verification' | string;
  target?: number;
  description?: string;
  isCompleted?: boolean;
  assetId?: string;
}

export interface ProgressData {
  revenue_completed?: number;
  revenue_total?: number;
  sales_completed?: number;
  sales_total?: number;
  items_completed?: number;
  items_total?: number;
  collectibles_completed?: number;
  collectibles_total?: number;
  total_completed?: number;
  total_milestones?: number;
  completion_percentage?: number;
}

export interface TopItemData {
  name?: string;
  sales?: number;
  revenue?: number;
  price?: number;
  assetId?: string;
  assetType?: string;
  thumbnail?: string;
}

export interface StatsData {
  totalRevenue?: number;
  totalSales?: number;
  growthPercentage?: number;
  dataPeriod?: string;
  lastUpdated?: string;
  topItems?: TopItemData[];
  uploadType?: 'single' | 'growth' | string;
}

const queueForEmber = async (note: Record<string, unknown>) => {
  await redis.rpush(KEYS.emberOutbox, { id: randomUUID(), createdAt: new Date().toISOString(), ...note });
};

export const sendMilestoneNotification = async (milestone: MilestoneData, progress: ProgressData) => {
  await queueForEmber({ type: 'milestone', milestone, progress });
};

const normalizeStats = (statsData: StatsData) => ({
  totalRevenue: Number(statsData.totalRevenue) || 0,
  totalSales: Number(statsData.totalSales) || 0,
  growthPercentage: Number(statsData.growthPercentage) || 0,
  dataPeriod: (statsData.dataPeriod || 'Current Period').toString(),
  uploadType: (statsData.uploadType || 'single').toString(),
  lastUpdated: (statsData.lastUpdated || new Date().toISOString()).toString(),
  topItems: Array.isArray(statsData.topItems)
    ? statsData.topItems
        .map((item) => ({
          name: (item.name || 'Unknown Item').toString(),
          sales: Number(item.sales) || 0,
          revenue: Number(item.revenue) || 0,
          price: Number(item.price) || 0,
          assetId: (item.assetId || '').toString(),
          thumbnail: item.thumbnail?.toString() || '',
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 6)
    : [],
});

export const sendCsvStatsNotification = async (statsData: StatsData) => {
  const normalized = normalizeStats(statsData);
  await queueForEmber({ type: 'monthly-stats', stats: normalized });
  return normalized;
};
