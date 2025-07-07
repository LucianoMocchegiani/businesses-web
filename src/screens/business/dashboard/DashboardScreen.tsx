import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { ScreenContainer } from '@/components';
import { useDashboard } from './hooks';
import {
  StatsGrid,
  QuickInsightsCard,
  RecentActivityCard
} from './components';

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();

  const {
    stats,
    quickInsights,
    recentActivity,
    loading,
    lastRefresh,
    snackbar,
    hideSnackbar,
    refresh,
    formatCurrency,
    hasLowStock,
    isHealthy,
  } = useDashboard();

  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case 'revenue':
      case 'growth':
        navigate('/sales');
        break;
      case 'customers':
        navigate('/customers');
        break;
      case 'products':
        navigate('/products');
        break;
      default:
        break;
    }
  };

  const handleRefresh = () => {
    refresh({ force: true });
  };

  return (
    <ScreenContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          {lastRefresh && (
            <Typography variant="caption" color="textSecondary">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Health Alerts */}
      {hasLowStock && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => navigate('/inventory')}
            >
              View
            </IconButton>
          }
        >
          {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? 's' : ''} running low on stock
        </Alert>
      )}

      {isHealthy && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Business metrics are performing well! Keep up the great work.
        </Alert>
      )}

      {/* Main Stats Grid */}
      <Box sx={{ mb: 4 }}>
        <StatsGrid
          stats={stats}
          loading={loading}
          formatCurrency={formatCurrency}
          onCardClick={handleCardClick}
        />
      </Box>

      {/* Secondary Cards */}
      <Grid container spacing={3}>
        {/* Quick Insights */}
        <Grid item xs={12} md={6}>
          <QuickInsightsCard
            insights={quickInsights}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <RecentActivityCard
            activities={recentActivity}
          />
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ScreenContainer>
  );
};
