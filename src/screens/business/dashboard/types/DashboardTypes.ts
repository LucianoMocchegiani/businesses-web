export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalRevenue: number;
  monthlyGrowth: number;
  averageOrderValue: number;
  customerRetentionRate: number;
  inventoryTurnover: number;
}

export interface QuickInsight {
  label: string;
  value: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  description?: string;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'customer' | 'inventory' | 'payment' | 'alert';
  message: string;
  timestamp: Date;
  icon: 'cart' | 'people' | 'inventory' | 'money' | 'warning';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
}

export interface DashboardFilters {
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  businessUnit?: string;
}

export interface DashboardRefreshOptions {
  force?: boolean;
  includeCache?: boolean;
}
