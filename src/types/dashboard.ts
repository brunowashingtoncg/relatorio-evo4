export interface CustomMetric {
  id: string;
  name: string;
  value: number;
  type: 'sum' | 'average' | 'percentage';
}

export interface Ad {
  id: string;
  name: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  metrics: CustomMetric[];
  isExpanded?: boolean;
}

export interface AdSet {
  id: string;
  name: string;
  ads: Ad[];
  metrics: CustomMetric[];
  isExpanded?: boolean;
  dailyBudget?: number; // Para ABO
}

export interface Campaign {
  id: string;
  name: string;
  adSets: AdSet[];
  metrics: CustomMetric[];
  isExpanded?: boolean;
  iconData?: { name: string; icon: any; color: string };
  budgetType: 'CBO' | 'ABO';
  dailyBudget?: number; // Para CBO
}

export interface DashboardData {
  campaigns: Campaign[];
  overviewMetrics: CustomMetric[];
  selectedMetricIds: string[];
  totalDailyBudget?: number;
}