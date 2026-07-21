import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export const KEYS = {
  salesData: 'ugc-sales-data',
  milestones: 'ugc-milestones',
  rolimonsLatest: 'rolimons:latest',
  rolimonsHistory: 'rolimons:history',
} as const;
