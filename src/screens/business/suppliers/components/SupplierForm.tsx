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
        name="name"
        control={control}
        rules={{ required: 'Supplier name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Supplier Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Controller
        name="contactName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Contact Name"
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="email"
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
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />
      </Box>

      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Address"
            disabled={isReadOnly}
            multiline
            rows={2}
            fullWidth
          />
        )}
      />

      <Controller
        name="taxId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Tax ID"
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Notes"
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
