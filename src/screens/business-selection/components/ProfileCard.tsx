import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActionArea,
  Typography, 
  Avatar, 
  Box,
  Chip
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { Profile } from '@/types/profile';

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        }
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          p: 3
        }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mb: 2,
              bgcolor: 'primary.main'
            }}
          >
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
          
          <Typography variant="h6" component="h3" gutterBottom>
            {profile.profile_name}
          </Typography>
          
          {profile.business && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              de: {profile.business.business_name}
            </Typography>
          )}
          
          <Box sx={{ mt: 'auto' }}>
            <Chip 
              label={`${profile.permissions?.length || 0} permisos`}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
