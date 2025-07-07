import React from 'react';
import { Card, CardContent, Chip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Product } from '@/types/business';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => params.value != null ? `$${params.value.toFixed(2)}` : '-',
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 120,
      renderCell: (params) => params.value ? `$${params.value.toFixed(2)}` : '-',
    },
    {
      field: 'currentStock',
      headerName: 'Stock',
      width: 100,
      renderCell: (params) => {
        const stock = params.value || 0;
        const minStock = params.row.minStock || 0;
        const isLowStock = stock <= minStock && minStock > 0;
        return (
          <Chip
            label={stock}
            color={isLowStock ? 'error' : 'success'}
            size="small"
          />
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const isActive = params.value !== false; // Default to true if undefined
        return (
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="view"
          icon={<ViewIcon />}
          label="View"
          onClick={() => onView(params.row)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => onDelete(params.row)}
        />,
      ],
    },
  ];

  return (
    <Card>
      <CardContent>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{ height: 600 }}
        />
      </CardContent>
    </Card>
  );
};
