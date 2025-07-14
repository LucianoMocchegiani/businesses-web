# Customers Module Documentation

## 📋 Overview

El módulo de Customers (Clientes) es responsable de la gestión completa de clientes del negocio. Permite crear, editar, visualizar y eliminar clientes con una interfaz moderna y funcional.

## 🏗️ Module Structure

```
src/screens/business/customers/
├── components/
│   ├── CustomerTable.tsx      # Tabla principal con DataGrid
│   ├── CustomerForm.tsx       # Formulario de cliente
│   ├── CustomerDialog.tsx     # Modal para crear/editar/ver
│   └── index.ts              # Barrel exports
├── hooks/
│   ├── useCustomers.tsx      # Hook principal del módulo
│   └── index.ts              # Barrel exports
├── types/
│   ├── CustomerFormData.ts   # Tipos para formularios
│   └── index.ts              # Barrel exports
├── CustomersScreen.tsx       # Pantalla principal
├── index.ts                  # Barrel exports del módulo
└── README.md                 # Esta documentación
```

## 🎯 Main Functionality

### Customer Management
- ✅ **CRUD completo**: Create, Read, Update, Delete
- ✅ **Búsqueda y filtrado** en tiempo real
- ✅ **Paginación** con DataGrid de MUI
- ✅ **Validación** de formularios
- ✅ **Estados de cliente**: Active/Inactive
- ✅ **Feedback visual** con snackbars

### Customer Data Fields
- **Información básica**: Nombre, email, teléfono
- **Ubicación**: Dirección completa
- **Identificación**: Tax ID (RUC/CUIT/etc.)
- **Estado**: Activo/Inactivo
- **Notas**: Campo libre para observaciones
- **Timestamps**: Fechas de creación y actualización

## 🔧 Technical Implementation

### Core Hook: `useCustomers`

```typescript
interface UseCustomersReturn {
  // State Management
  customers: CustomerEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedCustomer: CustomerEntity | null;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadCustomers: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (customer: CustomerEntity) => void;
  handleView: (customer: CustomerEntity) => void;
  handleDelete: (customer: CustomerEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: CustomerFormData) => Promise<void>;
}
```

### Data Flow
1. **Component mounts** → `useCustomers` hook loads data
2. **User interactions** → Hook methods handle state changes
3. **API calls** → Service layer manages backend communication
4. **State updates** → UI re-renders with new data
5. **User feedback** → Snackbars show success/error messages

## 📱 User Interface Components

### CustomerTable
- **DataGrid** con columnas: Name, Email, Phone, Tax ID, Status, Created, Actions
- **Row actions**: View, Edit, Delete (context-aware)
- **Status chips** con colores: Active (green), Inactive (gray)
- **Responsive design** con flex columns
- **Pagination** automática

### CustomerForm
- **Responsive grid layout** (12 columns)
- **Real-time validation** con mensajes de error
- **Auto-complete** para campos comunes
- **Date pickers** para timestamps
- **Toggle switches** para estado activo/inactivo
- **Modo readonly** para visualización

### CustomerDialog
- **Modal responsive** que se adapta a móvil (fullscreen)
- **Dynamic title** según modo (Create/Edit/View)
- **Form integration** completa
- **Keyboard navigation** y accessibility

## 🔄 State Management

### Dialog States
- `create`: Formulario vacío para nuevo cliente
- `edit`: Formulario pre-poblado para edición
- `view`: Datos en modo solo lectura

### Data Validation
```typescript
interface CustomerFormData {
  name: string;           // Required, min 2 chars
  email?: string;         // Optional, valid email format
  phone?: string;         // Optional, phone format
  address?: string;       // Optional
  taxId?: string;         // Optional, business tax ID
  notes?: string;         // Optional, free text
  isActive: boolean;      // Required, default true
}
```

## 🔌 Backend Integration

### Service Layer: `customerService`
- **GET** `/customers` - Lista paginada con filtros
- **GET** `/customers/:id` - Cliente específico
- **POST** `/customers` - Crear nuevo cliente
- **PUT** `/customers/:id` - Actualizar cliente existente
- **DELETE** `/customers/:id` - Eliminar cliente

### Mock Data (Development)
El servicio incluye datos mock para desarrollo local:
- 4+ clientes de ejemplo
- Diferentes estados y tipos de datos
- Soporte para filtrado y paginación

## 🎨 Design Patterns

### Modular Architecture
- **Separation of concerns**: UI, logic, data separados
- **Single responsibility**: Cada componente tiene un propósito específico
- **Reusable components**: Componentes reutilizables entre módulos
- **Custom hooks**: Lógica encapsulada y testeable

### Error Handling
- **Try-catch blocks** en todas las operaciones async
- **User-friendly messages** en lugar de errores técnicos
- **Graceful degradation** con mock data si el backend falla
- **Loading states** para mejor UX

## 🚀 Performance Features

### Optimizations
- **Lazy loading** de datos según necesidad
- **Memoization** en componentes pesados
- **Debounced search** para filtros en tiempo real
- **Virtual scrolling** en DataGrid para listas grandes
- **Optimistic updates** para mejor UX

### Memory Management
- **Cleanup effects** en useEffect
- **Event listener removal** en unmount
- **State reset** al cerrar modales

## 🧪 Testing Considerations

### Unit Tests
- Hook testing con `@testing-library/react-hooks`
- Component testing con `@testing-library/react`
- Service testing con mock axios
- Form validation testing

### Integration Tests
- Complete user flows
- API integration testing
- Error scenario testing
- Accessibility testing

## 📈 Future Enhancements

### Planned Features
- **Bulk operations** (delete multiple, export)
- **Advanced filtering** (date ranges, multiple criteria)
- **Customer history** tracking
- **Import/Export** functionality
- **Customer categories** or tags
- **Advanced search** with Elasticsearch

### Performance Improvements
- **Infinite scrolling** para listas muy grandes
- **Background sync** para datos offline
- **Caching layer** con React Query
- **Optimistic mutations** más robustas

## 🔗 Dependencies

### Main Dependencies
- **@mui/material** - UI components
- **@mui/x-data-grid** - Table functionality
- **@mui/icons-material** - Icons
- **React Router** - Navigation
- **Custom hooks** - useSnackbar, useBusinessAuth

*Esta documentación se actualiza regularmente. Última actualización: ${new Date().toLocaleDateString()}*
