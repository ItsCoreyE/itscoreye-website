import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export const KEYS = {
  salesData: 'ugc-sales-data',
  milestones: 'ugc-milestones',
  // Notes for Ember, the Discord bot, to post (see discordNotifications.ts)
  emberOutbox: 'ember:outbox',
} as const;
