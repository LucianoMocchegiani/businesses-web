import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { QuickInsight } from '../types';

interface QuickInsightsCardProps {
  insights: QuickInsight[];
}

export const QuickInsightsCard: React.FC<QuickInsightsCardProps> = ({ 
  insights
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Insights
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {insights.map((insight, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {insight.label}
                </Typography>
                {insight.description && (
                  <Typography variant="caption" color="textSecondary">
                    {insight.description}
                  </Typography>
                )}
              </Box>
              <Chip 
                label={insight.value} 
                color={insight.color} 
                size="small" 
                sx={{ ml: 2 }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
