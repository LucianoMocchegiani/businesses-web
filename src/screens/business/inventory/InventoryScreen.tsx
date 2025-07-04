import React from 'react';
import { Typography, Box } from '@mui/material';
import { ScreenContainer } from '@/components';

export const InventoryScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Inventory
        </Typography>
      </Box>
      <Typography variant="body1">
        Inventory management functionality coming soon...
      </Typography>
    </ScreenContainer>
  );
};
