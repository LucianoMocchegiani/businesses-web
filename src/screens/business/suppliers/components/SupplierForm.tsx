import React from 'react';
import { Box, TextField } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { SupplierFormData } from '../types';

interface SupplierFormProps {
  control: Control<SupplierFormData>;
  errors: FieldErrors<SupplierFormData>;
  isReadOnly?: boolean;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  control,
  errors,
  isReadOnly = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <Controller
        name="supplier_name"
        control={control}
        rules={{ required: 'Supplier name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Supplier Name"
            error={!!errors.supplier_name}
            helperText={errors.supplier_name?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="contact_email"
          control={control}
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contact Email"
              type="email"
              error={!!errors.contact_email}
              helperText={errors.contact_email?.message}
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />

        <Controller
          name="contact_phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contact Phone"
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />
      </Box>

      <Controller
        name="contact_location"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Contact Location"
            disabled={isReadOnly}
            multiline
            rows={2}
            fullWidth
          />
        )}
      />

      <Controller
        name="contact_description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Contact Description (Optional)"
            disabled={isReadOnly}
            multiline
            rows={3}
            fullWidth
          />
        )}
      />
    </Box>
  );
};
