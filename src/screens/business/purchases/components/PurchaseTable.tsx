import React from 'react';
import { Card, CardContent, Chip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { PurchaseEntity } from '@/types/business';
import { timestampToLocalDateString } from '@/utils/dateUtils';

interface PurchaseTableProps {
  purchases: PurchaseEntity[];
  loading: boolean;
  onView: (purchase: PurchaseEntity) => void;
  onCancel: (purchase: PurchaseEntity) => void;
}

export const PurchaseTable: React.FC<PurchaseTableProps> = ({
  purchases,
  loading,
  onView,
  onCancel,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'supplier_name',
      headerName: 'Supplier',
      width: 150,
      minWidth: 120,
      renderCell: (params) => params.value || 'Sin proveedor',
    },
    {
      field: 'total_amount',
      headerName: 'Total',
      width: 100,
      renderCell: (params) => {
        const value = Number(params.value);
        return isNaN(value) ? 'N/A' : `$${value.toFixed(2)}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => {
        const status = params.value;
        let color: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' = 'default';
        
        switch (status) {
          case 'PENDING':
            color = 'primary';
            break;
          case 'IN_TRANSIT':
            color = 'info';
            break;
          case 'RECEIVED':
            color = 'warning';
            break;
          case 'COMPLETED':
            color = 'success';
            break;
          case 'CANCELED':
            color = 'error';
            break;
        }
        
        return (
          <Chip
            label={status.replace('_', ' ')}
            color={color}
            size="small"
          />
        );
      },
    },
    {
      field: 'purchase_details',
      headerName: 'Items',
      width: 70,
      renderCell: (params) => {
        const itemCount = params.value?.length || 0;
        return `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
      },
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 100,
      renderCell: (params) => {
        return timestampToLocalDateString(params.value) || 'N/A';
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 130,
      getActions: (params: GridRowParams) => {
        const purchase = params.row as PurchaseEntity;
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={<ViewIcon />}
            label="View"
            onClick={() => onView(purchase)}
          />,
        ];

        // Solo mostrar cancelar si no está cancelada
        if (purchase.status !== 'CANCELED') {
          actions.push(
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => onCancel(purchase)}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <Card>
      <CardContent>
        <DataGrid
          rows={purchases}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.purchase_id}
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
