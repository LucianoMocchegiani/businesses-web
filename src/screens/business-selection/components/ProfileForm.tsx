import React from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ProfileFormData } from '../types';

interface ProfileFormProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isReadOnly?: boolean;
  isFirstProfile?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  control,
  errors,
  isReadOnly = false,
  isFirstProfile = false
}) => {
  const permissionLabels = {
    modifyProducts: 'Modificar Productos',
    modifyClients: 'Modificar Clientes',
    modifyProviders: 'Modificar Proveedores',
    modifySales: 'Modificar Ventas',
    modifyBuys: 'Modificar Compras',
    accessToStatistics: 'Acceso a Estadísticas',
    accessToBuys: 'Acceso a Compras',
    accessToProviders: 'Acceso a Proveedores',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
      <Controller
        name="profileName"
        control={control}
        rules={{ required: 'El nombre del perfil es requerido' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombre del Perfil *"
            placeholder="Ej: Administrador Principal"
            error={!!errors.profileName}
            helperText={errors.profileName?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      {isFirstProfile && (
        <Controller
          name="businessName"
          control={control}
          rules={{ required: 'El nombre del negocio es requerido' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre del Negocio *"
              placeholder="Ej: Mi Empresa"
              error={!!errors.businessName}
              helperText={errors.businessName?.message}
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />
      )}

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Permisos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecciona los permisos que tendrá este perfil
        </Typography>

        <FormGroup>
          {(Object.entries(permissionLabels) as [keyof typeof permissionLabels, string][]).map(([key, label]) => (
            <Controller
              key={key}
              name={`permissions.${key}`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      disabled={isReadOnly}
                    />
                  }
                  label={label}
                />
              )}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
};
