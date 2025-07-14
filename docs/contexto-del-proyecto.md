# Contexto del Proyecto - Business Admin System (Frontend)

## 🏢 ¿Qué es Business Admin System?

**Business Admin System** es una plataforma integral de gestión para comercios que permite a pequeñas y medianas empresas (kioscos, tiendas, restaurantes, etc.) administrar todos los aspectos de su negocio de forma digital y eficiente.

### Propósito Principal
Digitalizar y optimizar la gestión de comercios tradicionales mediante una solución moderna, escalable y fácil de usar que centralice todas las operaciones comerciales.

## 🎯 Público Objetivo

### Usuarios Primarios
- **Dueños de comercios**: Kioscos, almacenes, tiendas, restaurantes pequeños/medianos
- **Empleados**: Personal autorizado con perfiles específicos
- **Administradores**: Usuarios con acceso completo al sistema

### Casos de Uso Principales
- Gestión de inventario y stock
- Control de ventas y facturación
- Administración de compras a proveedores
- Manejo de clientes y proveedores
- Análisis de datos y reportes
- Control de personal y permisos

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico Frontend
```
┌─────────────────────────────────────────────────────────┐
│                   Frontend                              │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    React    │  │ TypeScript  │  │ Material-UI │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Vite     │  │   Context   │  │   Hooks     │    │
│  │   (Build)   │  │   (State)   │  │ (Logic)     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP REST API + Authentication
┌─────────────────────▼───────────────────────────────────┐
│                   Backend                               │
│              NestJS + TypeScript                        │
│            Prisma ORM + PostgreSQL                     │
│            Firebase Authentication                      │
└─────────────────────────────────────────────────────────┘
```

### Estructura de la Aplicación
- **Componentes Reutilizables**: UI components comunes
- **Pantallas (Screens)**: Páginas principales de cada módulo
- **Servicios**: Comunicación con la API
- **Contextos**: Gestión de estado global
- **Hooks**: Lógica de negocio reutilizable

## 👥 Flujo de Usuario

### Proceso de Onboarding
```
Usuario Nuevo
    ↓
┌─────────────────────────────────────────────────────────┐
│              Pantalla de Login                          │
│        (Firebase Authentication)                        │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│          ¿Tiene Negocios Asignados?                     │
└─────────────────────┬───────────────────────────────────┘
                      ↓
        ┌─────────────┴─────────────┐
        │                           │
       SÍ                          NO
        │                           │
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│ Selección de  │           │   Crear       │
│   Negocio     │           │  Negocio      │
└───────┬───────┘           └───────┬───────┘
        │                           │
        └─────────────┬─────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Dashboard Principal                        │
│         (Gestión del Negocio)                          │
└─────────────────────────────────────────────────────────┘
```

### Navegación Principal
- **Auth Screens**: Login, Registro
- **Business Selection**: Selección/Creación de negocio
- **Business Screens**: Módulos de gestión del negocio

## 📱 Pantallas Principales

### 1. **Autenticación** (`/auth`)
- **LoginScreen**: Acceso con Firebase
- **RegisterScreen**: Registro de nuevos usuarios
- Integración completa con Firebase Authentication

### 2. **Selección de Negocio** (`/business-selection`)
- **BusinessSelectionScreen**: Lista de negocios del usuario
- **CreateBusinessDialog**: Creación de nuevo negocio
- **ProfileCard**: Gestión de perfiles de usuario

### 3. **Dashboard** (`/dashboard`)
- **Métricas en tiempo real**: Ventas, inventario, alertas
- **Accesos rápidos**: A los módulos más utilizados
- **Resumen de actividad**: Últimas transacciones

### 4. **Gestión de Productos** (`/products`)
- **ProductsScreen**: Lista unificada de productos
- **ProductDialog**: Crear/editar productos
- **BarcodeSearchInput**: Búsqueda por código de barras
- Integración con inventario automática

### 5. **Gestión de Inventario** (`/inventory`)
- **Control de stock** en tiempo real
- **Alertas de stock bajo**
- **Gestión de lotes** y fechas de vencimiento
- **Movimientos de inventario**

### 6. **Ventas** (`/sales`)
- **SalesScreen**: Registro y gestión de ventas
- **SaleDialog**: Crear nueva venta
- **SaleForm**: Formulario inteligente con búsqueda de productos
- Descuento automático de inventario

### 7. **Compras** (`/purchases`)
- **PurchasesScreen**: Órdenes de compra
- **PurchaseDialog**: Crear/editar compras
- **ReceivePurchaseDialog**: Recepción de mercadería
- Aumento automático de inventario

### 8. **Clientes** (`/customers`)
- **CustomersScreen**: Base de datos de clientes
- **CustomerDialog**: Gestión de información de clientes
- **Historial de compras**

### 9. **Proveedores** (`/suppliers`)
- **SuppliersScreen**: Catálogo de proveedores
- **SupplierDialog**: Información de proveedores
- **Historial de compras**

## 🎨 Experiencia de Usuario (UX)

### Principios de Diseño
- **Simplicidad**: Interfaces intuitivas para usuarios no técnicos
- **Eficiencia**: Acceso rápido a funciones frecuentes
- **Consistencia**: Patrones de UI uniformes
- **Responsividad**: Adaptable a diferentes dispositivos

### Flujos Optimizados

#### Venta Rápida
```
Scan/Buscar Producto → Ver Stock → Agregar Cantidad → Procesar Venta
    (2 segundos)     (Automático)  (1 segundo)    (3 segundos)
```

#### Reposición de Stock
```
Seleccionar Proveedor → Buscar Productos → Crear Orden → Recibir Mercadería
     (5 segundos)      (10 segundos)    (15 segundos)  (20 segundos)
```

### Características UX Destacadas
- **Búsqueda inteligente**: Autocompletado y sugerencias
- **Validación en tiempo real**: Feedback inmediato
- **Estados de loading**: Indicadores visuales claros
- **Mensajes informativos**: Notificaciones de éxito/error
- **Temas**: Modo claro/oscuro

## 🔧 Arquitectura Técnica Frontend

### Estructura de Directorios
```
src/
├── components/           # Componentes reutilizables
│   ├── Layout/          # Header, Sidebar, Layout principal
│   ├── ScreenContainer/ # Container para pantallas
│   ├── SnackbarAlert/   # Sistema de notificaciones
│   └── BarcodeScanner/  # Búsqueda por código de barras
├── screens/             # Pantallas principales
│   ├── auth/            # Login, Registro
│   ├── business-selection/ # Selección de negocio
│   └── business/        # Módulos de gestión
│       ├── dashboard/
│       ├── products/
│       ├── sales/
│       ├── purchases/
│       ├── customers/
│       ├── suppliers/
│       └── settings/
├── services/            # Comunicación con API
├── contexts/            # Estado global (Auth, Theme)
├── hooks/               # Lógica reutilizable
├── types/               # Tipos TypeScript
└── theme/               # Configuración de Material-UI
```

### Patrones de Componentes

#### Pantalla Típica
```typescript
const EntityScreen: React.FC = () => {
  const {
    data,
    loading,
    handleCreate,
    handleEdit,
    handleDelete
  } = useEntityData();

  return (
    <ScreenContainer title="Gestión de Entidades">
      <EntityTable
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EntityDialog
        open={dialogOpen}
        onSave={handleSave}
      />
    </ScreenContainer>
  );
};
```

### Gestión de Estado

#### Context API para Estado Global
- **AuthContext**: Usuario, autenticación, permisos
- **ThemeContext**: Configuración de tema
- **BusinessContext**: Negocio y perfil seleccionado

#### Hooks Personalizados para Lógica Local
- **useEntityData**: CRUD operations
- **useEntityForm**: Validación de formularios
- **useSnackbar**: Notificaciones
- **useBusinessAuth**: Verificación de permisos

## 🔐 Autenticación y Seguridad

### Firebase Authentication
```typescript
// Login flow
const authService = {
  login: (email, password) => Firebase.signIn(),
  register: (userData) => Firebase.createUser(),
  logout: () => Firebase.signOut()
};
```

### Gestión de Contexto
```typescript
// Headers automáticos en todas las peticiones
const apiService = {
  headers: {
    'Authorization': `Bearer ${firebaseToken}`,
    'x-business-id': selectedBusiness.id,
    'x-profile-id': selectedProfile.id
  }
};
```

### Protección de Rutas
- **ProtectedRoute**: Verificación de autenticación
- **PermissionGuard**: Control de permisos por módulo
- **BusinessGuard**: Verificación de contexto de negocio

## 📊 Integración de Datos

### Servicios de API
Cada entidad tiene su servicio dedicado:

```typescript
// Ejemplo: ProductService
class ProductService {
  async getAll(filters): Promise<ProductsResponse>
  async getById(id): Promise<Product>
  async create(data): Promise<Product>
  async update(data): Promise<Product>
  async delete(id): Promise<void>
}
```

### Manejo de Estados
- **Loading**: Indicadores durante peticiones
- **Error**: Manejo centralizado de errores
- **Success**: Notificaciones de confirmación
- **Cache**: Optimización de datos locales

### Sincronización en Tiempo Real
- **Inventario**: Actualizaciones automáticas de stock
- **Ventas**: Reflejan cambios inmediatamente
- **Notificaciones**: Alertas de stock bajo

## 🌟 Características Distintivas

### 1. **Búsqueda Inteligente de Productos**
- Código de barras con scanner
- Autocompletado en tiempo real
- Filtros combinables
- Búsqueda unificada (globales + del negocio)

### 2. **Interfaz Adaptativa**
- Diseño responsive para móviles y desktop
- Modo claro/oscuro automático
- Componentes accesibles (a11y)

### 3. **Flujos Optimizados**
- Formularios inteligentes con validación
- Acciones rápidas (F-keys para acciones comunes)
- Navegación con teclado

### 4. **Sistema de Notificaciones**
- Snackbar para feedback inmediato
- Alertas de stock bajo automáticas
- Confirmaciones de acciones críticas

## 📱 Casos de Uso de Interfaz

### Kiosco Tradicional
- **Interfaz simple**: Enfoque en ventas rápidas
- **Productos frecuentes**: Acceso rápido a bestsellers
- **Clientes casuales**: Formularios mínimos

### Almacén de Barrio
- **Gestión completa**: Todos los módulos activos
- **Clientes registrados**: Base de datos completa
- **Múltiples usuarios**: Diferentes perfiles de acceso

### Restaurante Pequeño
- **Control de ingredientes**: Enfoque en fechas de vencimiento
- **Costos por plato**: Calculadoras integradas
- **Horarios de personal**: Gestión de turnos

## 🚀 Performance y Optimización

### Estrategias de Optimización
- **Lazy Loading**: Carga bajo demanda de pantallas
- **Memoización**: React.memo en componentes pesados
- **Debounce**: En búsquedas y filtros
- **Paginación**: Para listas grandes
- **Cache local**: Datos frecuentemente accedidos

### Métricas de Performance
- **Tiempo de carga inicial**: < 3 segundos
- **Tiempo de navegación**: < 1 segundo
- **Tiempo de búsqueda**: < 500ms
- **Actualización de inventario**: Tiempo real

## 🎯 Roadmap Frontend

### Próximas Funcionalidades
- **PWA (Progressive Web App)**: Funcionamiento offline
- **Notificaciones Push**: Alertas en tiempo real
- **Dashboard personalizable**: Widgets configurables
- **Modo offline**: Sincronización cuando se reconecte

### Mejoras de UX
- **Temas personalizados**: Branding por negocio
- **Atajos de teclado**: Navegación avanzada
- **Gestos táctiles**: Para dispositivos móviles
- **Voz**: Comandos de voz para acciones frecuentes

### Principios de Desarrollo
- **Componentización**: Crear componentes reutilizables
- **Tipado fuerte**: TypeScript en toda la aplicación
- **Responsive design**: Mobile-first approach
- **Accesibilidad**: Cumplir estándares WCAG
- **Performance**: Optimizar renders y peticiones

### Debugging
- **React DevTools**: Para inspeccionar componentes
- **Network tab**: Para peticiones API
- **Console logs**: Con niveles apropiados

## 📚 Documentación Complementaria

### 📋 Documentación Principal
- [`configuracion-y-scripts.md`](./configuracion-y-scripts.md) - **Setup completo, scripts y configuración del proyecto**

### 🎯 Patrones y Estándares de Desarrollo
- [`patrones-de-diseño-frontend.md`](./patrones-de-diseño-frontend.md) - **Patrones de código React y estándares**

### 🔧 Documentación por Módulos/Screens

#### 🏢 Business Selection
- [`business-selection-flow.md`](./business-selection-flow.md) - Flujo de selección de negocio
- [`../src/screens/business-selection/business-selection.md`](../src/screens/business-selection/business-selection.md) - Documentación específica del módulo

#### 📊 Business Management Screens
- [`../src/screens/business/dashboard/dashboard.md`](../src/screens/business/dashboard/dashboard.md) - **Panel principal y métricas**
- [`../src/screens/business/products/products.md`](../src/screens/business/products/products.md) - **Gestión de productos**
- [`../src/screens/business/sales/sales.md`](../src/screens/business/sales/sales.md) - **Sistema de ventas y facturación**
- [`../src/screens/business/purchases/purchases.md`](../src/screens/business/purchases/purchases.md) - **Gestión de compras**
- [`../src/screens/business/customers/customers.md`](../src/screens/business/customers/customers.md) - **Administración de clientes**
- [`../src/screens/business/suppliers/suppliers.md`](../src/screens/business/suppliers/suppliers.md) - **Gestión de proveedores**
- [`../src/screens/business/settings/settings.md`](../src/screens/business/settings/settings.md) - **Configuración del negocio**

### 📝 Estructura de Documentación por Módulo
Cada screen/módulo incluye su propia documentación específica con:
- **Propósito y funcionalidades**
- **Componentes principales**
- **Hooks y lógica de estado**
- **Servicios API utilizados**
- **Tipos TypeScript**
- **Casos de uso y flujos**

---

**Business Admin System Frontend** proporciona una experiencia de usuario moderna y eficiente que hace que la gestión de comercios sea simple e intuitiva, independientemente del nivel técnico del usuario. La aplicación está diseñada para ser poderosa pero accesible, profesional pero fácil de usar. 