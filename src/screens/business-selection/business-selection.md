# Business Selection Module Documentation

## 📋 Overview

El módulo de Business Selection es el punto de entrada principal después del login/registro. Permite a los usuarios crear sus propios negocios (como owners) o seleccionar negocios existentes donde tienen perfiles asignados por otros administradores.

## 🏗️ Module Structure

```
src/screens/business-selection/
├── components/
│   ├── BusinessCard.tsx          # Tarjeta para negocio existente
│   ├── CreateBusinessDialog.tsx  # Dialog para crear nuevo negocio
│   ├── ProfileCard.tsx           # Tarjeta de perfil (legacy)
│   ├── ProfileDialog.tsx         # Dialog de perfil (legacy)
│   ├── ProfileForm.tsx           # Formulario de perfil (legacy)
│   └── index.ts                  # Barrel exports
├── hooks/
│   ├── useBusinessSelection.tsx  # Hook principal del módulo
│   └── index.ts                  # Barrel exports
├── types/
│   ├── ProfileFormData.ts        # Tipos para formularios
│   └── index.ts                  # Barrel exports
├── BusinessSelectionScreen.tsx   # Pantalla principal
├── index.ts                      # Barrel exports del módulo
└── README.md                     # Esta documentación
```

## 🎯 Main Functionality

### Two Main Paths
1. **Create Own Business**: Usuario se convierte en owner con permisos completos
2. **Select Existing Business**: Usuario accede a negocios donde tiene perfiles asignados

### Business Creation Flow
- ✅ **Business creation**: Formulario completo para crear negocio
- ✅ **Auto admin profile**: Se crea automáticamente perfil de administrador 
- ✅ **Full permissions**: Owner obtiene todos los permisos por defecto
- ✅ **Auto-navigation**: Navegación automática al dashboard tras creación
- ✅ **First-time UX**: Experiencia especial para primer negocio

### Business Selection Flow  
- ✅ **Business listing**: Lista de negocios donde el usuario tiene acceso
- ✅ **Profile context**: Cada negocio muestra el perfil y permisos del usuario
- ✅ **Quick access**: Selección directa para acceder al dashboard
- ✅ **Visual feedback**: Cards informativas con detalles del negocio

## 🔧 Technical Implementation

### Core Hook: `useBusinessSelection`

```typescript
interface UseBusinessSelectionReturn {
  // State Management
  businessesWithProfiles: BusinessWithProfile[];
  loading: boolean;
  createBusinessDialogOpen: boolean;
  searchBusinessDialogOpen: boolean;
  dialogMode: BusinessDialogMode;
  error: string | null;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadUserBusinesses: () => Promise<void>;
  handleSelectBusiness: (businessWithProfile: BusinessWithProfile) => Promise<void>;
  handleCreateBusiness: () => void;
  handleSearchBusiness: () => void;
  handleCloseDialog: () => void;
  handleSubmitNewBusiness: (data: CreateBusinessFormData) => Promise<void>;
  clearError: () => void;
}
```

### Data Flow
1. **Component mounts** → `useProfiles` hook loads user profiles
### Data Flow
1. **Component mounts** → `useBusinessSelection` hook loads user businesses
2. **Auto-dialog** → Si no hay negocios, abre dialog de creación automáticamente
3. **Business selection** → Usuario selecciona negocio y navega al dashboard
4. **Business creation** → Formulario completo, creación de negocio + perfil admin
5. **State sync** → Business ID y Profile ID se guardan en localStorage y AuthContext

## 📱 User Interface Components

### BusinessSelectionScreen
- **Dual layout**: Diferentes UIs para usuarios sin/con negocios
- **Empty state**: Cards especiales para crear o buscar negocios
- **Grid layout**: Layout responsivo con negocios disponibles
- **Loading states**: CircularProgress durante operaciones
- **Error alerts**: Manejo visual de errores con posibilidad de cerrar

### BusinessCard
- **Material Design Card**: Diseño moderno con efectos hover
- **Business info**: Nombre, dirección, teléfono del negocio
- **Profile context**: Muestra perfil del usuario y cantidad de permisos
- **Avatar**: Iniciales del negocio como representación visual
- **Responsive**: Adaptable a diferentes tamaños de pantalla

### CreateBusinessDialog
- **Full-screen mobile**: Responsivo para dispositivos móviles
- **Two sections**: Información del negocio + perfil del owner
- **Form validation**: Validación en tiempo real de campos requeridos
- **Owner permissions**: Explicación clara de permisos completos
- **Visual feedback**: Estados de carga y confirmación

## 🔄 State Management

### Dialog States
- `create-business`: Dialog para crear nuevo negocio
- `search-business`: Dialog para buscar negocios (futuro)

### Data Validation
```typescript
interface CreateBusinessFormData {
  businessName: string;        // Required, nombre del negocio
  address?: string;            // Optional, dirección física
  phone?: string;              // Optional, teléfono de contacto
  ownerProfileName: string;    // Required, nombre del perfil del owner
}
```

## 🔌 Backend Integration

### Service Layer: `businessService`
- **GET** `/businesses/user/:userId` - Negocios donde el usuario tiene perfiles
- **POST** `/businesses/with-owner` - Crear negocio con perfil de owner automático
- **GET** `/businesses/:id` - Negocio específico

### Business Creation Flow
```typescript
// Endpoint creates business + admin profile + assigns to user in one transaction
const createBusinessData = {
  name: "Mi Restaurante",
  address: "Calle 123, Ciudad",
  phone: "+54 9 11 1234-5678",
  owner_profile_name: "Administrador",
  owner_user_id: userId
};

// Returns: { business, profile } with full permissions
```

## 🎨 Design Patterns

### Modular Architecture
- **Separation of concerns**: UI, logic, data separados
- **Single responsibility**: Cada componente tiene un propósito específico  
- **Custom hooks**: Toda la lógica encapsulada en useBusinessSelection
- **Reusable components**: Componentes que siguen patrones MUI establecidos

### Error Handling
- **Try-catch blocks**: En todas las operaciones async
- **User-friendly messages**: Mensajes en español para usuarios
- **Error state management**: Estado centralizado con posibilidad de limpiar
- **Loading states**: Feedback visual durante operaciones largas

### Navigation Logic
- **AuthContext integration**: Para setSelectedBusinessId
- **localStorage persistence**: Para selectedBusinessId y selectedProfileId
- **Automatic redirect**: Al dashboard tras selección/creación
- **Route protection**: Redirección automática desde login

## 🚀 Performance Features

### Optimizations
- **Lazy loading**: Negocios se cargan solo cuando es necesario
- **Auto-dialog**: Inteligente solo si no hay negocios
- **Optimistic navigation**: Navegación inmediata tras creación
- **State cleanup**: Limpieza apropiada al cerrar modales

### Memory Management
- **useEffect cleanup**: Con dependencias apropiadas
- **Event listener removal**: En unmount de componentes
- **State reset**: Al cerrar dialogs y cambiar contexto

## 🔒 Security & Permissions

### Owner Creation
- **Full permissions**: El owner automáticamente obtiene todos los permisos
- **All services**: Acceso completo a customers, products, sales, etc.
- **Admin profile**: Perfil con privilegios máximos

### Business Access Control
- **Profile validation**: Solo usuarios con perfiles pueden acceder
- **Business context**: Cada sesión está asociada a un negocio específico
- **Route protection**: Middleware valida permisos por business_id

## 🧪 Testing Considerations

### User Flow Tests
- First-time user experience (crear primer negocio)
- Business creation and auto-selection
- Business selection and navigation
- Error handling scenarios
- Empty states and loading states

### Backend Integration Tests
- Business creation with owner profile
- Permission assignment validation
- Transaction rollback scenarios
- User business listing accuracy

## 📈 Future Enhancements

### Planned Features
- **Business search**: Búsqueda por código de invitación
- **Business templates**: Plantillas por tipo de negocio (restaurante, tienda, etc.)
- **Team invitations**: Sistema de invitaciones para empleados
- **Business switching**: Cambio rápido entre negocios
- **Business analytics**: Estadísticas de uso por negocio

### UX Improvements
- **Onboarding tour**: Guía paso a paso para nuevos users
- **Business avatars**: Logos personalizados para negocios
- **Recent businesses**: Acceso rápido a negocios utilizados recientemente
- **Quick actions**: Atajos para acciones comunes

## 🔗 Dependencies

### Main Dependencies
- **@mui/material** - UI components
- **@mui/icons-material** - Icons
- **React Router** - Navigation
- **AuthContext** - User and business state
- **businessService** - Para operaciones de negocio
- **Custom hooks** - useSnackbar for feedback

### Integration Points
- **AuthContext** - Para setSelectedBusinessId
- **localStorage** - Para persistir selectedBusinessId y selectedProfileId
- **businessService** - Para operaciones CRUD de negocios
- **Business Dashboard** - Destino tras selección

*Esta documentación se actualiza regularmente. Última actualización: ${new Date().toLocaleDateString()}*

### ProfileForm
- **Two-step form**: Información básica + Permisos
- **Business name field** para contexto
- **Permission switches** organizados por categoría:
  - **Modify permissions**: Create, update operations
  - **Access permissions**: Read-only access to modules
- **Real-time validation** con mensajes de error
- **Responsive layout** con grid MUI

### ProfileDialog
- **Modal responsive** que se adapta a móvil (fullscreen)
- **Dynamic title** según modo (Create/Edit/View)
- **Form integration** completa con ProfileForm
- **Special handling** para primer perfil del usuario
- **Keyboard navigation** y accessibility

## 🔄 State Management

### Dialog States
- `create`: Formulario vacío para nuevo perfil
- `edit`: Formulario pre-poblado para edición (futuro)
- `view`: Datos en modo solo lectura (futuro)

### Data Validation
```typescript
interface ProfileFormData {
  profileName: string;        // Required, min 2 chars
  businessName: string;       // Required, business context
  permissions: {
    modifyProducts: boolean;     // Can create/edit products
    modifyClients: boolean;      // Can create/edit customers
    modifyProviders: boolean;    // Can create/edit suppliers
    modifySales: boolean;        // Can create/edit sales
    modifyBuys: boolean;         // Can create/edit purchases
    accessToStatistics: boolean; // Can view reports
    accessToBuys: boolean;       // Can view purchases
    accessToProviders: boolean;  // Can view suppliers
  };
}
```

## 🔌 Backend Integration

### Service Layer: `profileService`
- **GET** `/profiles/user/:userId` - Perfiles del usuario actual
- **GET** `/profiles/:id` - Perfil específico
- **GET** `/profiles/:id/permissions` - Permisos del perfil
- **POST** `/profiles` - Crear nuevo perfil con permisos
- **PUT** `/profiles/:id` - Actualizar perfil (futuro)
- **DELETE** `/profiles/:id` - Eliminar perfil (futuro)

### Permission System Integration
```typescript
// Mapeo de permisos del formulario a la estructura del backend
const profileData = {
  business_id: 1, // Fixed for now, dynamic in future
  profile_name: data.profileName,
  permissions: [
    {
      service_id: 1, // customers
      can_get: true,
      can_post: data.permissions.modifyClients,
      can_put: data.permissions.modifyClients,
      can_delete: false
    },
    // ... más servicios
  ]
};
```

## 🎨 Design Patterns

### Modular Architecture
- **Separation of concerns**: UI, logic, data separados
- **Single responsibility**: Cada componente tiene un propósito específico  
- **Custom hooks**: Toda la lógica encapsulada en useProfiles
- **Reusable components**: Componentes que siguen patrones MUI

### Error Handling
- **Try-catch blocks** en todas las operaciones async
- **User-friendly messages** en español para errores
- **Error state management** con posibilidad de limpiar errores
- **Loading states** para mejor UX durante operaciones

### Navigation Logic
- **AuthContext integration** para business_id selection
- **localStorage persistence** para selectedProfileId
- **Automatic redirect** al dashboard tras selección
- **Route protection** basada en perfiles

## 🚀 Performance Features

### Optimizations
- **Lazy loading** de perfiles solo cuando es necesario
- **Auto-dialog** inteligente solo si no hay perfiles
- **Optimistic navigation** tras creación de perfil
- **State cleanup** al cerrar modales

### Memory Management
- **useEffect cleanup** con dependencias apropiadas
- **Event listener removal** en unmount
- **State reset** al cerrar dialog

## 🔒 Security & Permissions

### Permission Levels
- **Read permissions** (can_get): Ver datos del módulo
- **Write permissions** (can_post/can_put): Crear/editar datos
- **Delete permissions** (can_delete): Eliminar datos (actualmente false)

### Service Integration
El sistema mapea permisos a servicios específicos:
1. **customers** (service_id: 1) - Gestión de clientes
2. **products** (service_id: 2) - Gestión de productos
3. **sales** (service_id: 3) - Gestión de ventas

## 🧪 Testing Considerations

### Unit Tests
- Hook testing con `@testing-library/react-hooks`
- Component testing con `@testing-library/react`
- Service testing con mock API calls
- Permission validation testing

### User Flow Tests
- First-time user experience (no profiles)
- Profile creation and auto-selection
- Profile selection and navigation
- Error handling scenarios

## 📈 Future Enhancements

### Planned Features
- **Profile editing**: Actualizar perfiles existentes
- **Profile deletion**: Eliminar perfiles no utilizados
- **Profile switching**: Cambiar de perfil sin re-login
- **Business creation**: Crear negocios dentro del flujo
- **Permission templates**: Plantillas pre-configuradas
- **Role-based permissions**: Roles predefinidos (Admin, Manager, Employee)

### UX Improvements
- **Profile avatars**: Imágenes personalizadas para perfiles
- **Recent profiles**: Acceso rápido a perfiles utilizados recientemente
- **Profile analytics**: Estadísticas de uso por perfil
- **Onboarding tour**: Guía paso a paso para nuevos usuarios

## 🔗 Dependencies

### Main Dependencies
- **@mui/material** - UI components
- **@mui/icons-material** - Icons
- **React Router** - Navigation
- **AuthContext** - User and business state
- **Custom hooks** - useSnackbar for feedback

### Integration Points
- **AuthContext** - Para setSelectedBusinessId
- **localStorage** - Para persistir selectedProfileId
- **profileService** - Para operaciones CRUD
- **Business Dashboard** - Destino tras selección

*Esta documentación se actualiza regularmente. Última actualización: ${new Date().toLocaleDateString()}*
