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
import { Business as BusinessIcon } from '@mui/icons-material';
import { BusinessWithProfile } from '@/services/businessService';

interface BusinessCardProps {
  businessWithProfile: BusinessWithProfile;
  onClick: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  businessWithProfile,
  onClick
}) => {
  const { business, profile } = businessWithProfile;
  
  // Contar permisos activos
  const activePermissions = profile.permissions.filter(p => 
    p.can_get || p.can_post || p.can_put || p.can_delete
  ).length;

  // Obtener iniciales del nombre del negocio
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
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
          {/* Avatar del negocio */}
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mb: 2, 
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            {getInitials(business.business_name)}
          </Avatar>

          {/* Nombre del negocio */}
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3rem'
            }}
          >
            {business.business_name}
          </Typography>

          {/* Perfil del usuario */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2 }}
          >
            Perfil: <strong>{profile.profile_name}</strong>
          </Typography>

          {/* Información adicional */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
            {/* Dirección si existe */}
            {business.business_address && (
              <Typography variant="caption" color="text.secondary">
                📍 {business.business_address}
              </Typography>
            )}

            {/* Teléfono si existe */}
            {business.business_phone && (
              <Typography variant="caption" color="text.secondary">
                📞 {business.business_phone}
              </Typography>
            )}

            {/* Chip de permisos */}
            <Chip
              icon={<BusinessIcon />}
              label={`${activePermissions} permisos`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
