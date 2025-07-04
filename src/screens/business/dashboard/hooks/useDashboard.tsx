import { useState, useEffect, useCallback } from 'react';
import { 
  DashboardStats, 
  QuickInsight, 
  RecentActivity, 
  DashboardFilters,
  DashboardRefreshOptions 
} from '../types';
import { useSnackbar } from '@/hooks/useSnackbar';
import { customerService } from '@/services/customerService';
import { productService } from '@/services/productService';
import { saleService } from '@/services/saleService';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    averageOrderValue: 0,
    customerRetentionRate: 0,
    inventoryTurnover: 0,
  });

  const [quickInsights, setQuickInsights] = useState<QuickInsight[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: 'month'
  });
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const calculateStats = useCallback(async (options?: DashboardRefreshOptions) => {
    try {
      setLoading(true);

      // Load all necessary data
      const [customers, products, salesResponse] = await Promise.all([
        customerService.getAll(),
        productService.getAll(),
        saleService.getAll({ businessId: 'business-id' }),
      ]);

      const sales = salesResponse.data;

      // Calculate customer stats
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter(c => c.isActive).length;

      // Calculate product stats
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => 
        (p.stock || 0) <= (p.minStock || 0)
      ).length;

      // Calculate financial stats
      const completedSales = sales.filter(s => s.status === 'COMPLETED');
      const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      
      // Calculate average order value
      const averageOrderValue = completedSales.length > 0 
        ? totalRevenue / completedSales.length 
        : 0;

      // Mock calculations for complex metrics
      const monthlyGrowth = 12.5; // Would calculate from historical data
      const customerRetentionRate = 94.2; // Would calculate from customer behavior
      const inventoryTurnover = 6.2; // Would calculate from sales/inventory ratio

      const newStats: DashboardStats = {
        totalCustomers,
        activeCustomers,
        totalProducts,
        lowStockProducts,
        totalRevenue,
        monthlyGrowth,
        averageOrderValue,
        customerRetentionRate,
        inventoryTurnover,
      };

      setStats(newStats);
      
      // Update quick insights
      updateQuickInsights(newStats);
      
      // Update recent activity
      updateRecentActivity(sales, customers, products);
      
      setLastRefresh(new Date());
      
      if (options?.force) {
        showSnackbar('Dashboard data refreshed successfully', 'success');
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showSnackbar('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const updateQuickInsights = (dashboardStats: DashboardStats) => {
    const insights: QuickInsight[] = [
      {
        label: 'Customer Retention Rate',
        value: `${dashboardStats.customerRetentionRate}%`,
        color: dashboardStats.customerRetentionRate > 90 ? 'success' : 'warning',
        description: 'Percentage of customers who made repeat purchases'
      },
      {
        label: 'Average Order Value',
        value: formatCurrency(dashboardStats.averageOrderValue),
        color: 'primary',
        description: 'Average value per completed sale'
      },
      {
        label: 'Inventory Turnover',
        value: `${dashboardStats.inventoryTurnover}x/year`,
        color: 'secondary',
        description: 'How often inventory is sold and replaced'
      },
      {
        label: 'Low Stock Alerts',
        value: `${dashboardStats.lowStockProducts} items`,
        color: dashboardStats.lowStockProducts > 0 ? 'warning' : 'success',
        description: 'Products below minimum stock level'
      },
    ];
    
    setQuickInsights(insights);
  };

  const updateRecentActivity = (sales: any[], customers: any[], products: any[]) => {
    const activities: RecentActivity[] = [];

    // Add recent sales
    const recentSales = sales
      .filter(s => s.status === 'COMPLETED')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2);

    recentSales.forEach(sale => {
      activities.push({
        id: `sale-${sale.id}`,
        type: 'order',
        message: `New order from ${sale.customerName}`,
        timestamp: new Date(sale.createdAt),
        icon: 'cart',
        color: 'primary'
      });
    });

    // Add recent customers
    const recentCustomers = customers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2);

    recentCustomers.forEach(customer => {
      activities.push({
        id: `customer-${customer.id}`,
        type: 'customer',
        message: `New customer: ${customer.name}`,
        timestamp: new Date(customer.createdAt),
        icon: 'people',
        color: 'success'
      });
    });

    // Add low stock alerts
    const lowStockItems = products
      .filter(p => (p.stock || 0) <= (p.minStock || 0))
      .slice(0, 2);

    lowStockItems.forEach(product => {
      activities.push({
        id: `stock-${product.id}`,
        type: 'inventory',
        message: `Low stock alert: ${product.name}`,
        timestamp: new Date(),
        icon: 'warning',
        color: 'warning'
      });
    });

    // Sort by timestamp descending
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setRecentActivity(activities.slice(0, 4));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const refresh = useCallback((options?: DashboardRefreshOptions) => {
    calculateStats(options);
  }, [calculateStats]);

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Load data on mount and when filters change
  useEffect(() => {
    calculateStats();
  }, [calculateStats, filters]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      calculateStats();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [calculateStats]);

  return {
    // State
    stats,
    quickInsights,
    recentActivity,
    loading,
    filters,
    lastRefresh,
    
    // User Feedback
    snackbar,
    showSnackbar,
    hideSnackbar,
    
    // Actions
    refresh,
    updateFilters,
    formatCurrency,
    
    // Computed
    hasLowStock: stats.lowStockProducts > 0,
    isHealthy: stats.monthlyGrowth > 0 && stats.customerRetentionRate > 85,
  };
};
