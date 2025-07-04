import React from 'react';
import { Grid } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { StatsCard } from './StatsCard';
import { DashboardStats } from '../types';

interface StatsGridProps {
  stats: DashboardStats;
  loading?: boolean;
  formatCurrency: (amount: number) => string;
  onCardClick?: (cardType: string) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  loading = false, 
  formatCurrency,
  onCardClick 
}) => {
  return (
    <Grid container spacing={3}>
      {/* Revenue Card */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<MoneyIcon sx={{ fontSize: 40 }} />}
          color="success"
          subtitle={`+${stats.monthlyGrowth}% this month`}
          loading={loading}
          onClick={() => onCardClick?.('revenue')}
        />
      </Grid>

      {/* Customers Card */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<PeopleIcon sx={{ fontSize: 40 }} />}
          color="primary"
          subtitle={`${stats.activeCustomers} active`}
          loading={loading}
          onClick={() => onCardClick?.('customers')}
        />
      </Grid>

      {/* Products Card */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<InventoryIcon sx={{ fontSize: 40 }} />}
          color="secondary"
          subtitle={`${stats.lowStockProducts} low stock`}
          loading={loading}
          onClick={() => onCardClick?.('products')}
        />
      </Grid>

      {/* Growth Card */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
          color="success"
          subtitle="Compared to last month"
          loading={loading}
          onClick={() => onCardClick?.('growth')}
        />
      </Grid>
    </Grid>
  );
};
