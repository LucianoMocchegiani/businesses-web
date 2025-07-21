import { Routes, Route, Navigate } from 'react-router-dom'
import { useBusinessAuth } from '@/hooks/useBusinessAuth'
import { AuthLayout } from '@/screens/auth/AuthLayout'
import { LoginScreen } from '@/screens/auth/LoginScreen'
import { RegisterScreen } from '@/screens/auth/RegisterScreen'
import { BusinessLayout } from '@/screens/business/BusinessLayout'
import { DashboardScreen } from '@/screens/business/dashboard'
import { CustomersScreen } from '@/screens/business/customers'
import { ProductsScreen } from '@/screens/business/products'
import { SalesScreen } from '@/screens/business/sales'
import { PurchasesScreen } from '@/screens/business/purchases'
import { SettingsScreen } from '@/screens/business/settings'
import { SuppliersScreen } from '@/screens/business/suppliers'
import { BusinessSelectionScreen, BusinessSelectionLayout } from '@/screens/business-selection'

export const App = () => {
  const { isAuthenticated } = useBusinessAuth()

  return (
    <Routes>
      {/* Rutas de autenticación - siempre accesibles */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
      </Route>
      
      {/* Rutas para usuarios no autenticados */}
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </>
      ) : (
        <>
          {/* Rutas para usuarios autenticados */}
          <Route path="/business-selection" element={<BusinessSelectionLayout />}>
            <Route index element={<BusinessSelectionScreen />} />
          </Route>
          <Route path="/business" element={<BusinessLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="customers" element={<CustomersScreen />} />
            <Route path="products" element={<ProductsScreen />} />
            <Route path="suppliers" element={<SuppliersScreen />} />
            <Route path="sales" element={<SalesScreen />} />
            <Route path="purchases" element={<PurchasesScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
          </Route>
          <Route path="/" element={<Navigate to="/business-selection" replace />} />
          <Route path="*" element={<Navigate to="/business-selection" replace />} />
        </>
      )}
    </Routes>
  )
}
