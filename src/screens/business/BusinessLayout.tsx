import { Layout } from '@/components';
import { useBusinessAuth } from '../../hooks/useBusinessAuth';

const businessNavData = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'dashboard',
  },
   {
    label: 'Ventas',
    path: '/sales',
    icon: 'point_of_sale',
  },
  {
    label: 'Compras',
    path: '/purchases',
    icon: 'shopping_cart',
  },
  {
    label: 'Inventario',
    path: '/inventory',
    icon: 'warehouse',
  },
  {
    label: 'Productos',
    path: '/products',
    icon: 'inventory',
  },
  {
    label: 'Proveedores',
    path: '/suppliers',
    icon: 'people',
  },
    {
    label: 'Clientes',
    path: '/customers',
    icon: 'people',
  },
  {
    label: 'Configuración',
    path: '/settings',
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
