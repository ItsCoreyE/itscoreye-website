export interface TopItem {
  name: string;
  sales: number;
  revenue: number;
  price: number;
  assetId?: string;
  assetType?: string;
  thumbnail?: string;
}

export interface SalesData {
  totalRevenue: number;
  totalSales: number;
  growthPercentage: number;
  lastUpdated: string;
  dataPeriod?: string;
  topItems: TopItem[];
}

export type MilestoneCategory =
  | 'revenue'
  | 'sales'
  | 'items'
  | 'collectibles'
  | 'verification';

export interface Milestone {
  id: string;
  category: MilestoneCategory;
  target: number;
  description: string;
  isCompleted: boolean;
  assetId?: string; // For Roblox items to fetch thumbnails
}

export interface MilestonesData {
  milestones: Milestone[];
  lastUpdated: string;
}

// Snake_case keys match the Discord webhook payload contract.
export interface MilestoneProgressStats {
  revenue_completed: number;
  revenue_total: number;
  sales_completed: number;
  sales_total: number;
  items_completed: number;
  items_total: number;
  collectibles_completed: number;
  collectibles_total: number;
  total_completed: number;
  total_milestones: number;
  completion_percentage: number;
}
