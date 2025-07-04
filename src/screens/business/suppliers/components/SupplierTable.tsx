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
import { SupplierEntity } from '@/types/business';

interface SupplierTableProps {
  suppliers: SupplierEntity[];
  loading: boolean;
  onView: (supplier: SupplierEntity) => void;
  onEdit: (supplier: SupplierEntity) => void;
  onDelete: (supplier: SupplierEntity) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Supplier',
      width: 180,
      minWidth: 150,
    },
    {
      field: 'contactName',
      headerName: 'Contact',
      width: 120,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 180,
      minWidth: 150,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 120,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'taxId',
      headerName: 'Tax ID',
      width: 100,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 90,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
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
      width: 110,
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
          rows={suppliers}
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
