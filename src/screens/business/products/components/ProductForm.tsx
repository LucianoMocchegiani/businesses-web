import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ProductFormData, PRODUCT_CATEGORIES } from '../types';

interface ProductFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isReadOnly?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  control,
  errors,
  isReadOnly = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Product name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Product Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            disabled={isReadOnly}
            multiline
            rows={2}
            fullWidth
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="price"
          control={control}
          rules={{ 
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Price"
              type="number"
              inputProps={{ step: 0.01, min: 0 }}
              error={!!errors.price}
              helperText={errors.price?.message}
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />

        <Controller
          name="cost"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Cost (Optional)"
              type="number"
              inputProps={{ step: 0.01, min: 0 }}
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="category"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Category"
              error={!!errors.category}
              helperText={errors.category?.message}
              disabled={isReadOnly}
              fullWidth
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="minStock"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Min Stock Level"
              type="number"
              inputProps={{ min: 0 }}
              disabled={isReadOnly}
              fullWidth
            />
          )}
        />
      </Box>

      <Controller
        name="barcode"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Barcode (Optional)"
            disabled={isReadOnly}
            fullWidth
          />
        )}
      />
    </Box>
  );
};
