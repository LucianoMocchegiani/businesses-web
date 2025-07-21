import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Validar que el usuario tenga un negocio seleccionado
  useEffect(() => {
    const businessId = localStorage.getItem('selectedBusinessId');
    const profileId = localStorage.getItem('selectedProfileId');
    
    if (!businessId || !profileId) {
      console.log('No business selected, redirecting to business selection...');
      navigate('/business-selection', { replace: true });
    }
  }, [navigate]);

  return (
    <Layout
      handleLogout={logout}
      navData={businessNavData}
      user={userData}
    />
  );
};
