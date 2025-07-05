import { Layout } from '@/components';
import { useBusinessAuth } from '../../hooks/useBusinessAuth';

const businessNavData = [
  {
    label: 'Dashboard',
    path: '/business/dashboard',
    icon: 'dashboard',
  },
   {
    label: 'Ventas',
    path: '/business/sales',
    icon: 'point_of_sale',
  },
  {
    label: 'Compras',
    path: '/business/purchases',
    icon: 'shopping_cart',
  },
  {
    label: 'Inventario',
    path: '/business/inventory',
    icon: 'warehouse',
  },
  {
    label: 'Productos',
    path: '/business/products',
    icon: 'inventory',
  },
  {
    label: 'Proveedores',
    path: '/business/suppliers',
    icon: 'people',
  },
    {
    label: 'Clientes',
    path: '/business/customers',
    icon: 'people',
  },
  {
    label: 'Configuración',
    path: '/business/settings',
    icon: 'settings',
  },
];

export const BusinessLayout = () => {
  const { logout, userData } = useBusinessAuth();

  return (
    <Layout
      handleLogout={logout}
      navData={businessNavData}
      user={userData}
    />
  );
};
