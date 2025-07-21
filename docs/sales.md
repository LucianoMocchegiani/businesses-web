# Sistema de Sales - Frontend (React + TypeScript)

## Índice
1. [Flujo de la Aplicación](#flujo-de-la-aplicación)
2. [Arquitectura Frontend](#arquitectura-frontend)
3. [Componentes](#componentes)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Servicios](#servicios)
6. [Casos de Uso](#casos-de-uso)

---

## Flujo de la Aplicación

### 1. Listado de Sales
- **Pantalla**: `SalesScreen`
- **Componente**: `SaleTable`
- **Datos**: Información básica de sales (ID, customer, total, status, date)
- **Fuente**: Endpoint `GET /sales` (datos paginados)

### 2. Visualización de Detalles
- **Acción**: Clic en botón "View" de una sale
- **Flujo**:
  1. `handleView(sale)` en `useSales`
  2. Llamada a `saleService.getById(sale.sale_id)`
  3. Endpoint `GET /sales/:id` con header `x-business-id`
  4. Validación de pertenencia al negocio
  5. Retorno de datos completos incluyendo:
     - Información del customer
     - Detalles de productos con información completa
     - Datos de inventario y precios
  6. Actualización de `selectedSale` con datos completos
  7. Apertura de `SaleDialog` en modo 'view'
  8. Renderizado de `SaleForm` con datos completos

### 3. Creación de Sales
- **Acción**: Clic en botón "New Sale"
- **Flujo**:
  1. `handleCreate()` en `useSales`
  2. Apertura de `SaleDialog` en modo 'create'
  3. Formulario vacío con `SaleForm`
  4. Selección de customer (opcional)
  5. Agregado de productos (por código de barras o manual)
  6. Envío con `handleSubmit()`
  7. Validación de customer en backend
  8. Creación de sale y actualización de inventario

### 4. Edición de Sales
- **Acción**: Clic en botón "Edit"
- **Flujo**: Similar a visualización pero en modo 'edit'

### 5. Cancelación de Sales
- **Acción**: Clic en botón "Cancel"
- **Flujo**:
  1. Confirmación del usuario
  2. Llamada a `saleService.cancel(sale.sale_id)`
  3. Endpoint `DELETE /sales/:id`
  4. Reversión de inventario
  5. Actualización de estado a 'CANCELED'

---

## Arquitectura Frontend

### Estructura de Archivos
```
src/screens/business/sales/
├── SalesScreen.tsx              # Pantalla principal
├── components/
│   ├── SaleTable.tsx            # Tabla de datos
│   ├── SaleDialog.tsx           # Diálogo modal
│   └── SaleForm.tsx             # Formulario
├── hooks/
│   ├── useSales.tsx             # Estado global y acciones
│   ├── useSaleForm.tsx          # Lógica del formulario
│   ├── useProducts.tsx          # Carga de productos
│   └── useCustomers.tsx         # Carga de customers
└── types/
    ├── SaleFormData.ts          # Tipos del formulario
    └── index.ts                 # Exportaciones
```

---

## Componentes

### SalesScreen
**Archivo**: `src/screens/business/sales/SalesScreen.tsx`

**Responsabilidades**:
- Orquestar todos los componentes de sales
- Manejar el estado global de la pantalla
- Renderizar la tabla y el diálogo

**Props**: Ninguna (componente de pantalla)

**Estado**:
- `sales`: Lista de sales
- `loading`: Estado de carga
- `dialogOpen`: Control del diálogo
- `dialogMode`: Modo del diálogo (create/edit/view)
- `selectedSale`: Sale seleccionada

### SaleTable
**Archivo**: `src/screens/business/sales/components/SaleTable.tsx`

**Responsabilidades**:
- Mostrar lista paginada de sales
- Manejar acciones (View, Edit, Cancel)
- Renderizar estados y datos formateados

**Props**:
```typescript
interface SaleTableProps {
  sales: SaleEntity[];
  loading: boolean;
  onView: (sale: SaleEntity) => void;
  onEdit: (sale: SaleEntity) => void;
  onCancel: (sale: SaleEntity) => void;
}
```

**Columnas**:
- Sale ID
- Customer Name
- Total Amount
- Status (con chips de colores)
- Items Count
- Created Date
- Actions (View, Edit, Cancel)

### SaleDialog
**Archivo**: `src/screens/business/sales/components/SaleDialog.tsx`

**Responsabilidades**:
- Contenedor modal para el formulario
- Manejar responsive design
- Controlar el título según el modo

**Props**:
```typescript
interface SaleDialogProps {
  open: boolean;
  mode: DialogMode;
  sale?: SaleEntity | null;
  onClose: () => void;
  onSubmit: (data: SaleFormData) => void;
}
```

### SaleForm
**Archivo**: `src/screens/business/sales/components/SaleForm.tsx`

**Responsabilidades**:
- Formulario completo de sales
- Búsqueda de productos por código de barras
- Selección de customers
- Gestión de items de la sale

**Props**:
```typescript
interface SaleFormProps {
  mode: DialogMode;
  initialData?: SaleEntity;
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
}
```

---

## Hooks Personalizados

### useSales
**Archivo**: `src/screens/business/sales/hooks/useSales.tsx`

**Responsabilidades**:
- Estado global de sales
- Carga de datos paginados
- Acciones CRUD (Create, Read, Update, Delete)
- Manejo de errores y snackbars

**Retorna**:
```typescript
interface UseSalesReturn {
  // State
  sales: SaleEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedSale: SaleEntity | null;
  pagination: PaginationState;

  // Actions
  loadSales: (params?: Partial<GetSalesParams>) => Promise<void>;
  handleCreate: () => void;
  handleEdit: (sale: SaleEntity) => void;
  handleView: (sale: SaleEntity) => void;
  handleCancel: (sale: SaleEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: SaleFormData) => Promise<void>;
}
```

### useSaleForm
**Archivo**: `src/screens/business/sales/hooks/useSaleForm.tsx`

**Responsabilidades**:
- Estado del formulario
- Validaciones de campos
- Manejo de productos y customers
- Cálculos automáticos

**Retorna**:
```typescript
interface UseSaleFormReturn {
  formData: SaleFormData;
  newItem: Partial<SaleDetailFormData>;
  handleInputChange: (field: keyof SaleFormData, value: any) => void;
  handleProductSearch: (query: string) => Promise<ProductSearchResult[]>;
  handleProductSelect: (product: ProductSearchResult) => void;
  handleCustomerChange: (customer: any) => void;
  handleAddItem: () => void;
  handleRemoveItem: (index: number) => void;
}
```

### useProducts
**Archivo**: `src/screens/business/products/hooks/useProducts.tsx`

**Responsabilidades**:
- Carga de productos disponibles
- Filtrado y búsqueda
- Estado de carga

### useCustomers
**Archivo**: `src/screens/business/customers/hooks/useCustomers.tsx`

**Responsabilidades**:
- Carga de customers disponibles
- Filtrado y búsqueda
- Estado de carga

---

## Servicios

### saleService
**Archivo**: `src/services/saleService.ts`

**Responsabilidades**:
- Comunicación con API de sales
- Transformación de datos
- Manejo de errores

**Métodos**:
```typescript
class SaleService {
  async getAll(params: GetSalesParams): Promise<SalesResponse>
  async getById(id: string): Promise<SaleEntity>
  async create(data: CreateSaleRequest): Promise<SaleEntity>
  async update(data: UpdateSaleRequest): Promise<SaleEntity>
  async cancel(id: string): Promise<SaleEntity>
}
```

### productSearchService
**Archivo**: `src/services/productSearchService.ts`

**Responsabilidades**:
- Búsqueda de productos por código de barras
- Búsqueda por nombre
- Integración con API de productos

### apiService
**Archivo**: `src/services/apiService.ts`

**Responsabilidades**:
- Cliente HTTP base
- Manejo automático de headers (`x-business-id`, `Authorization`)
- Interceptores de errores
- Manejo de tokens expirados

---

## Casos de Uso

### 1. Sale con Customer Existente
1. Usuario selecciona customer de la lista
2. Agrega productos por código de barras o manualmente
3. Sistema valida que el customer pertenece al negocio
4. Se crea la sale y se actualiza el inventario

### 2. Sale sin Customer (Walk-in)
1. Usuario deja campo de customer vacío
2. Opcionalmente ingresa nombre personalizado
3. Sistema permite la sale sin validación de customer
4. Se crea la sale normalmente

### 3. Visualización de Detalles
1. Usuario hace clic en "View" de una sale
2. Sistema obtiene datos completos del servidor
3. Se muestran todos los detalles incluyendo productos y precios
4. Información completa y actualizada

### 4. Cancelación de Sale
1. Usuario confirma cancelación
2. Sistema revierte automáticamente el inventario
3. Se actualizan los registros correspondientes
4. Estado cambia a 'CANCELED'

---

## Tipos de Datos

### SaleEntity
```typescript
interface SaleEntity {
  sale_id: string;
  business_id?: string;
  customer_id?: string;
  customer_name?: string;
  total_amount: number;
  status: SaleStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
  saleDetails: SaleDetailEntity[];
}
```

### SaleFormData
```typescript
interface SaleFormData {
  customer_id?: string;
  customer_name?: string;
  total_amount?: number;
  status: SaleStatus;
  comments?: string;
  saleDetails: SaleDetailFormData[];
  notes?: string;
}
```

### SaleDetailFormData
```typescript
interface SaleDetailFormData {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_amount: number;
  // Campos para integración con inventario
  business_product_id?: string;
  global_product_id?: string;
  businessProduct?: any;
  globalProduct?: any;
}
```

---

## Notas Técnicas

### Optimizaciones de Rendimiento
- La tabla muestra información básica para optimizar el rendimiento
- Los detalles completos se obtienen solo cuando es necesario (getById)
- Paginación implementada para grandes volúmenes de datos

### Manejo de Estado
- Estado local en cada hook para responsabilidades específicas
- Estado global en `useSales` para datos compartidos
- `selectedSale` para datos completos de la sale actual

### Validaciones
- Validaciones de formulario en el frontend
- Validaciones de negocio en el backend
- Manejo de errores con snackbars informativos

### Responsive Design
- Diálogo adaptativo según el tamaño de pantalla
- Tabla responsive con scroll horizontal
- Formulario optimizado para móviles

### Integración con APIs
- Headers automáticos de autenticación y negocio
- Transformación de datos entre frontend y backend
- Manejo de errores de red y servidor

### Mapeo de Datos
- Manejo de campos opcionales con fallbacks
- Mapeo correcto de datos del servidor al formulario
- Soporte para datos completos de productos y customers 