import React from 'react';
import { Card, CardContent } from '@mui/material';
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
import { Customer } from '@/types/business';
import { timestampToLocalDateString } from '@/utils/dateUtils';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'customer_name',
      headerName: 'Customer Name',
      width: 150,
      minWidth: 120,
    },
    {
      field: 'contact_email',
      headerName: 'Contact Email',
      width: 180,
      minWidth: 150,
    },
    {
      field: 'contact_phone',
      headerName: 'Contact Phone',
      width: 120,
    },
    {
      field: 'contact_location',
      headerName: 'Contact Location',
      width: 200,
      minWidth: 150,
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
      width: 100,
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
          rows={customers}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.customer_id}
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
