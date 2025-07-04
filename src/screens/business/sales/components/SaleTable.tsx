import React from 'react';
import { Card, CardContent, Chip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridPaginationModel,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { SaleEntity } from '@/types/business';

interface SaleTableProps {
  sales: SaleEntity[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onView: (sale: SaleEntity) => void;
  onEdit: (sale: SaleEntity) => void;
  onDelete: (sale: SaleEntity) => void;
  onCancel: (sale: SaleEntity) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const SaleTable: React.FC<SaleTableProps> = ({
  sales,
  loading,
  pagination,
  onView,
  onEdit,
  onDelete,
  onCancel,
  onPageChange,
  onPageSizeChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'PENDING':
        return 'Pending';
      case 'CANCELED':
        return 'Canceled';
      default:
        return status;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Sale ID',
      width: 80,
      renderCell: (params) => `#${params.value}`,
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      width: 150,
      minWidth: 120,
      renderCell: (params) => params.value || 'Walk-in Customer',
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 100,
      type: 'number',
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'saleDetails',
      headerName: 'Items',
      width: 70,
      renderCell: (params) => `${params.value?.length || 0} items`,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 100,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams) => {
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={<ViewIcon />}
            label="View"
            onClick={() => onView(params.row)}
          />,
        ];

        // Only allow edit if status is not CANCELED
        if (params.row.status !== 'CANCELED') {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={() => onEdit(params.row)}
            />
          );
        }

        // Allow cancel if status is not already CANCELED
        if (params.row.status !== 'CANCELED') {
          actions.push(
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => onCancel(params.row)}
            />
          );
        }

        // Allow delete only for PENDING sales
        if (params.row.status === 'PENDING') {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => onDelete(params.row)}
            />
          );
        }

        return actions;
      },
    },
  ];

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== pagination.page - 1) {
      onPageChange(model.page + 1);
    }
    if (model.pageSize !== pagination.limit) {
      onPageSizeChange(model.pageSize);
    }
  };

  return (
    <Card>
      <CardContent>
        <DataGrid
          rows={sales}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.limit,
          }}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={pagination.total}
          paginationMode="server"
          disableRowSelectionOnClick
          sx={{ height: 600 }}
        />
      </CardContent>
    </Card>
  );
};
