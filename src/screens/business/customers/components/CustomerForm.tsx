import React from 'react';
import { Box, TextField } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CustomerFormData } from '../types';

interface CustomerFormProps {
  control: Control<CustomerFormData>;
  errors: FieldErrors<CustomerFormData>;
  isReadOnly?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  control,
  errors,
  isReadOnly = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Customer Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
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
        rules={{ required: 'Phone is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Phone Number"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Controller
        name="address"
        control={control}
        rules={{ required: 'Address is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Address"
            error={!!errors.address}
            helperText={errors.address?.message}
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
            label="Tax ID (Optional)"
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
            label="Notes (Optional)"
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
