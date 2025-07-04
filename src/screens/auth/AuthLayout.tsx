import { Outlet } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';

export const AuthLayout = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Business Admin
        </Typography>
        <Outlet />
      </Box>
    </Container>
  );
};
