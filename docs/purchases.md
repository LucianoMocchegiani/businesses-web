# Sistema de Purchases - Frontend (React + TypeScript)

## Índice
1. [Flujo de la Aplicación](#flujo-de-la-aplicación)
2. [Arquitectura Frontend](#arquitectura-frontend)
3. [Componentes](#componentes)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Servicios](#servicios)
6. [Casos de Uso](#casos-de-uso)

---

## Flujo de la Aplicación

### 1. Listado de Purchases
- **Pantalla**: `PurchasesScreen`
- **Componente**: `PurchaseTable`
- **Datos**: Información básica de purchases (ID, supplier, total, status, date)
- **Fuente**: Endpoint `GET /purchases` (datos paginados)

### 2. Visualización de Detalles
- **Acción**: Clic en botón "View" de una purchase
- **Flujo**:
  1. `handleView(purchase)` en `usePurchases`
  2. Llamada a `purchaseService.getById(purchase.purchase_id)`
  3. Endpoint `GET /purchases/:id` con header `x-business-id`
  4. Validación de pertenencia al negocio
  5. Retorno de datos completos incluyendo:
     - Información del supplier
     - Detalles de productos con información completa
     - Datos de lotes y fechas
  6. Actualización de `selectedPurchase` con datos completos
  7. Apertura de `PurchaseDialog` en modo 'view'
  8. Renderizado de `PurchaseForm` con datos completos

### 3. Creación de Purchases
- **Acción**: Clic en botón "New Purchase"
- **Flujo**:
  1. `handleCreate()` en `usePurchases`
  2. Apertura de `PurchaseDialog` en modo 'create'
  3. Formulario vacío con `PurchaseForm`
  4. Selección de supplier (opcional)
  5. Agregado de productos (por código de barras o manual)
  6. Envío con `handleSubmit()`
  7. Validación de supplier en backend
  8. Creación de purchase y actualización de inventario

### 4. Edición de Purchases
- **Acción**: Clic en botón "Edit" (si está implementado)
- **Flujo**: Similar a visualización pero en modo 'edit'

### 5. Cancelación de Purchases
- **Acción**: Clic en botón "Cancel"
- **Flujo**:
  1. Confirmación del usuario
  2. Llamada a `purchaseService.cancel(purchase.purchase_id)`
  3. Endpoint `DELETE /purchases/:id`
  4. Reversión de inventario y lotes
  5. Actualización de estado a 'CANCELED'

---

## Arquitectura Frontend

### Estructura de Archivos
```
src/screens/business/purchases/
├── PurchasesScreen.tsx          # Pantalla principal
├── components/
│   ├── PurchaseTable.tsx        # Tabla de datos
│   ├── PurchaseDialog.tsx       # Diálogo modal
│   └── PurchaseForm.tsx         # Formulario
├── hooks/
│   ├── usePurchases.tsx         # Estado global y acciones
│   ├── usePurchaseForm.tsx      # Lógica del formulario
│   ├── useProducts.tsx          # Carga de productos
│   └── useSuppliers.tsx         # Carga de suppliers
└── types/
    ├── PurchaseFormData.ts      # Tipos del formulario
    └── index.ts                 # Exportaciones
```

---

## Componentes

### PurchasesScreen
**Archivo**: `src/screens/business/purchases/PurchasesScreen.tsx`

**Responsabilidades**:
- Orquestar todos los componentes de purchases
- Manejar el estado global de la pantalla
- Renderizar la tabla y el diálogo

**Props**: Ninguna (componente de pantalla)

**Estado**:
- `purchases`: Lista de purchases
- `loading`: Estado de carga
- `dialogOpen`: Control del diálogo
- `dialogMode`: Modo del diálogo (create/edit/view)
- `selectedPurchase`: Purchase seleccionada

### PurchaseTable
**Archivo**: `src/screens/business/purchases/components/PurchaseTable.tsx`

**Responsabilidades**:
- Mostrar lista paginada de purchases
- Manejar acciones (View, Cancel)
- Renderizar estados y datos formateados

**Props**:
```typescript
interface PurchaseTableProps {
  purchases: PurchaseEntity[];
  loading: boolean;
  onView: (purchase: PurchaseEntity) => void;
  onCancel: (purchase: PurchaseEntity) => void;
}
```

**Columnas**:
- Purchase ID
- Supplier Name
- Total Amount
- Status (con chips de colores)
- Items Count
- Created Date
- Actions (View, Cancel)

### PurchaseDialog
**Archivo**: `src/screens/business/purchases/components/PurchaseDialog.tsx`

**Responsabilidades**:
- Contenedor modal para el formulario
- Manejar responsive design
- Controlar el título según el modo

**Props**:
```typescript
interface PurchaseDialogProps {
  open: boolean;
  mode: DialogMode;
  purchase?: PurchaseEntity | null;
  onClose: () => void;
  onSubmit: (data: PurchaseFormData) => void;
}
```

### PurchaseForm
**Archivo**: `src/screens/business/purchases/components/PurchaseForm.tsx`

**Responsabilidades**:
- Formulario completo de purchases
- Búsqueda de productos por código de barras
- Selección de suppliers
- Gestión de items de la purchase

**Props**:
```typescript
interface PurchaseFormProps {
  mode: DialogMode;
  initialData?: PurchaseEntity;
  onSubmit: (data: PurchaseFormData) => void;
  onCancel: () => void;
}
```

---

## Hooks Personalizados

### usePurchases
**Archivo**: `src/screens/business/purchases/hooks/usePurchases.tsx`

**Responsabilidades**:
- Estado global de purchases
- Carga de datos paginados
- Acciones CRUD (Create, Read, Update, Delete)
- Manejo de errores y snackbars

**Retorna**:
```typescript
interface UsePurchasesReturn {
  // State
  purchases: PurchaseEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedPurchase: PurchaseEntity | null;
  pagination: PaginationState;

  // Actions
  loadPurchases: (params?: Partial<GetPurchasesParams>) => Promise<void>;
  handleCreate: () => void;
  handleView: (purchase: PurchaseEntity) => void;
  handleCancel: (purchase: PurchaseEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: PurchaseFormData) => Promise<void>;
}
```

### usePurchaseForm
**Archivo**: `src/screens/business/purchases/hooks/usePurchaseForm.tsx`

**Responsabilidades**:
- Estado del formulario
- Validaciones de campos
- Manejo de productos y suppliers
- Cálculos automáticos

**Retorna**:
```typescript
interface UsePurchaseFormReturn {
  formData: PurchaseFormData;
  newItem: Partial<PurchaseDetailFormData>;
  handleInputChange: (field: keyof PurchaseFormData, value: any) => void;
  handleProductSearch: (query: string) => Promise<ProductSearchResult[]>;
  handleProductSelect: (product: ProductSearchResult) => void;
  handleSupplierChange: (supplier: any) => void;
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

### useSuppliers
**Archivo**: `src/screens/business/suppliers/hooks/useSuppliers.tsx`

**Responsabilidades**:
- Carga de suppliers disponibles
- Filtrado y búsqueda
- Estado de carga

---

## Servicios

### purchaseService
**Archivo**: `src/services/purchaseService.ts`

**Responsabilidades**:
- Comunicación con API de purchases
- Transformación de datos
- Manejo de errores

**Métodos**:
```typescript
class PurchaseService {
  async getAll(params: GetPurchasesParams): Promise<PurchasesResponse>
  async getById(id: string): Promise<PurchaseEntity>
  async create(data: CreatePurchaseRequest): Promise<PurchaseEntity>
  async update(data: UpdatePurchaseRequest): Promise<PurchaseEntity>
  async cancel(id: string): Promise<PurchaseEntity>
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

### 1. Purchase con Supplier Existente
1. Usuario selecciona supplier de la lista
2. Agrega productos por código de barras o manualmente
3. Sistema valida que el supplier pertenece al negocio
4. Se crea la purchase y se actualiza el inventario

### 2. Purchase sin Supplier (Walk-in)
1. Usuario deja campo de supplier vacío
2. Opcionalmente ingresa nombre personalizado
3. Sistema permite la purchase sin validación de supplier
4. Se crea la purchase normalmente

### 3. Visualización de Detalles
1. Usuario hace clic en "View" de una purchase
2. Sistema obtiene datos completos del servidor
3. Se muestran todos los detalles incluyendo productos y lotes
4. Información completa y actualizada

### 4. Cancelación de Purchase
1. Usuario confirma cancelación
2. Sistema revierte automáticamente el inventario
3. Se actualizan los lotes correspondientes
4. Estado cambia a 'CANCELED'

---

## Tipos de Datos

### PurchaseEntity
```typescript
interface PurchaseEntity {
  purchase_id: string;
  business_id?: string;
  supplier_id?: string;
  supplier_name?: string;
  total_amount: number;
  status: PurchaseStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
  purchaseDetails: PurchaseDetailEntity[];
}
```

### PurchaseFormData
```typescript
interface PurchaseFormData {
  supplier_id?: string;
  supplier_name?: string;
  total_amount?: number;
  status?: string;
  comments?: string;
  purchaseDetails: PurchaseDetailFormData[];
}
```

### PurchaseDetailFormData
```typescript
interface PurchaseDetailFormData {
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  quantity_received?: number;
  price: number;
  total_amount?: number;
  lot_number?: string;
  entry_date?: Timestamp;
  expiration_date?: Timestamp;
  business_product_id?: string;
  global_product_id?: string;
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
- Estado global en `usePurchases` para datos compartidos
- `selectedPurchase` para datos completos de la purchase actual

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