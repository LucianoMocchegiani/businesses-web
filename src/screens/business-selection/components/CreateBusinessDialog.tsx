import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { CreateBusinessFormData } from '../types/ProfileFormData';

interface CreateBusinessDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBusinessFormData) => Promise<void>;
  isFirstBusiness?: boolean;
}

export const CreateBusinessDialog: React.FC<CreateBusinessDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isFirstBusiness = false
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<CreateBusinessFormData>({
    businessName: '',
    address: '',
    phone: '',
    ownerProfileName: 'Administrador'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateBusinessFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.businessName.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        businessName: '',
        address: '',
        phone: '',
        ownerProfileName: 'Administrador'
      });
    } catch (error) {
      console.error('Error submitting business:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    setFormData({
      businessName: '',
      address: '',
      phone: '',
      ownerProfileName: 'Administrador'
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" component="h2">
          {isFirstBusiness ? '¡Crea tu Primer Negocio!' : 'Crear Nuevo Negocio'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {isFirstBusiness 
            ? 'Empecemos configurando tu negocio. Tendrás control total como administrador.'
            : 'Agrega un nuevo negocio a tu cuenta.'
          }
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Información del Negocio */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              📝 Información del Negocio
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nombre del Negocio"
                value={formData.businessName}
                onChange={handleInputChange('businessName')}
                required
                fullWidth
                placeholder="Ej: Mi Restaurante, Tienda Central, etc."
                helperText="Este será el nombre principal de tu negocio"
              />

              <TextField
                label="Dirección (Opcional)"
                value={formData.address}
                onChange={handleInputChange('address')}
                fullWidth
                placeholder="Calle 123, Ciudad, Provincia"
                helperText="Dirección física del negocio"
              />

              <TextField
                label="Teléfono (Opcional)"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                fullWidth
                placeholder="+54 9 11 1234-5678"
                helperText="Número de contacto del negocio"
              />
            </Box>
          </Box>

          {/* Tu Perfil */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              👤 Tu Perfil como Propietario
            </Typography>
            
            <TextField
              label="Nombre de tu Perfil"
              value={formData.ownerProfileName}
              onChange={handleInputChange('ownerProfileName')}
              required
              fullWidth
              placeholder="Administrador, Gerente, Propietario, etc."
              helperText="Como propietario, tendrás todos los permisos automáticamente"
            />

            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'success.50', 
              border: '1px solid', 
              borderColor: 'success.200',
              borderRadius: 1 
            }}>
              <Typography variant="body2" color="success.dark">
                ✅ <strong>Permisos completos:</strong> Como propietario del negocio, 
                tendrás acceso total a todas las funcionalidades (clientes, productos, 
                ventas, compras, reportes, etc.)
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          {isFirstBusiness ? 'Cancelar' : 'Cancelar'}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.businessName.trim() || !formData.ownerProfileName.trim() || isSubmitting}
          size="large"
        >
          {isSubmitting ? 'Creando...' : '🚀 Crear Negocio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
