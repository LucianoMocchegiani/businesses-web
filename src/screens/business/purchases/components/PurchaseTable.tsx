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
  Cancel as CancelIcon,
  LocalShipping as TransitIcon,
  Inventory as ReceiveIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import { PurchaseEntity } from '@/types/business';

interface PurchaseTableProps {
  purchases: PurchaseEntity[];
  loading: boolean;
  onView: (purchase: PurchaseEntity) => void;
  onEdit: (purchase: PurchaseEntity) => void;
  onDelete: (purchase: PurchaseEntity) => void;
  onCancel: (purchase: PurchaseEntity) => void;
  onMarkInTransit: (purchase: PurchaseEntity) => void;
  onReceive: (purchase: PurchaseEntity) => void;
  onComplete: (purchase: PurchaseEntity) => void;
}

export const PurchaseTable: React.FC<PurchaseTableProps> = ({
  purchases,
  loading,
  onView,
  onEdit,
  onDelete,
  onCancel,
  onMarkInTransit,
  onReceive,
  onComplete,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'supplierName',
      headerName: 'Supplier',
      width: 150,
      minWidth: 120,
      renderCell: (params) => params.value || 'Sin proveedor',
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 100,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
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
      field: 'purchaseDetails',
      headerName: 'Items',
      width: 70,
      renderCell: (params) => {
        const itemCount = params.value?.length || 0;
        return `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
      },
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

        // Only show edit and workflow actions for non-canceled purchases
        if (purchase.status !== 'CANCELED') {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={() => onEdit(purchase)}
            />
          );
          
          // Workflow actions based on status
          switch (purchase.status) {
            case 'PENDING':
              actions.push(
                <GridActionsCellItem
                  key="transit"
                  icon={<TransitIcon />}
                  label="Mark In Transit"
                  onClick={() => onMarkInTransit(purchase)}
                />,
                <GridActionsCellItem
                  key="cancel"
                  icon={<CancelIcon />}
                  label="Cancel"
                  onClick={() => onCancel(purchase)}
                />
              );
              break;
              
            case 'IN_TRANSIT':
              actions.push(
                <GridActionsCellItem
                  key="receive"
                  icon={<ReceiveIcon />}
                  label="Receive"
                  onClick={() => onReceive(purchase)}
                />
              );
              break;
              
            case 'RECEIVED':
              actions.push(
                <GridActionsCellItem
                  key="complete"
                  icon={<CompleteIcon />}
                  label="Complete"
                  onClick={() => onComplete(purchase)}
                />
              );
              break;
          }
        }

        actions.push(
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => onDelete(purchase)}
          />
        );

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
