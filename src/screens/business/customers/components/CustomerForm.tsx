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
        name="customer_name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Customer Name"
            error={!!errors.customer_name}
            helperText={errors.customer_name?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Controller
        name="contact_email"
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
        rules={{ required: 'Phone is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Contact Phone"
            error={!!errors.contact_phone}
            helperText={errors.contact_phone?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Controller
        name="contact_location"
        control={control}
        rules={{ required: 'Address is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Contact Location"
            error={!!errors.contact_location}
            helperText={errors.contact_location?.message}
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
