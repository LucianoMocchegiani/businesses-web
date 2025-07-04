import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { RecentActivity } from '../types';

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

const getActivityIcon = (iconType: string, color: string) => {
  const iconProps = { color: color as any };
  
  switch (iconType) {
    case 'cart':
      return <CartIcon {...iconProps} />;
    case 'people':
      return <PeopleIcon {...iconProps} />;
    case 'inventory':
      return <InventoryIcon {...iconProps} />;
    case 'money':
      return <MoneyIcon {...iconProps} />;
    case 'warning':
      return <WarningIcon {...iconProps} />;
    default:
      return <CartIcon {...iconProps} />;
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
};

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ 
  activities
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activities.map((activity) => (
            <Box 
              key={activity.id}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              {getActivityIcon(activity.icon, activity.color)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {activity.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatTimeAgo(activity.timestamp)}
                </Typography>
              </Box>
            </Box>
          ))}
          {activities.length === 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              No recent activity
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
