# Products Module Documentation

## 📋 Overview

El módulo de Products (Productos) gestiona el catálogo completo de productos del negocio. Incluye información detallada de productos, precios, stock, categorías y toda la información necesaria para la gestión de inventario y ventas.

## 🏗️ Module Structure

```
src/screens/business/products/
├── components/
│   ├── ProductTable.tsx      # Tabla principal con DataGrid
│   ├── ProductForm.tsx       # Formulario de producto
│   ├── ProductDialog.tsx     # Modal para crear/editar/ver
│   └── index.ts              # Barrel exports
├── hooks/
│   ├── useProducts.tsx       # Hook principal del módulo
│   └── index.ts              # Barrel exports
├── types/
│   ├── ProductFormData.ts    # Tipos para formularios
│   └── index.ts              # Barrel exports
├── ProductsScreen.tsx        # Pantalla principal
├── index.ts                  # Barrel exports del módulo
└── README.md                 # Esta documentación
```

## 🎯 Main Functionality

### Product Management
- ✅ **CRUD completo**: Create, Read, Update, Delete
- ✅ **Gestión de inventario**: Stock, SKU, códigos de barras
- ✅ **Pricing management**: Precio de compra, venta, descuentos
- ✅ **Categorización**: Categorías y subcategorías
- ✅ **Estados**: Active/Inactive products
- ✅ **Búsqueda avanzada**: Por nombre, SKU, categoría
- ✅ **Batch operations**: Operaciones en lote

### Product Data Fields
- **Información básica**: Nombre, descripción, SKU
- **Pricing**: Precio de compra, precio de venta, margen
- **Inventory**: Stock actual, stock mínimo, unidad de medida
- **Categorization**: Categoría, subcategoría, tags
- **Identificación**: Código de barras, código interno
- **Estado**: Activo/Inactivo, featured product
- **Timestamps**: Fechas de creación y actualización

## 🔧 Technical Implementation

### Core Hook: `useProducts`

```typescript
interface UseProductsReturn {
  // State Management
  products: ProductEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedProduct: ProductEntity | null;
  
  // Filtering & Search
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadProducts: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (product: ProductEntity) => void;
  handleView: (product: ProductEntity) => void;
  handleDelete: (product: ProductEntity) => Promise<void>;
  handleDuplicate: (product: ProductEntity) => void;
  handleToggleStatus: (product: ProductEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: ProductFormData) => Promise<void>;
}
```

### Data Flow
1. **Component initialization** → Load products with filters
2. **User searches/filters** → Debounced API calls
3. **CRUD operations** → Optimistic updates + API sync
4. **Inventory updates** → Real-time stock management
5. **Batch operations** → Multiple product operations

## 📱 User Interface Components

### ProductTable
- **Enhanced DataGrid** con columnas: Image, Name, SKU, Category, Price, Stock, Status, Actions
- **Advanced filtering**: Search bar, category dropdown, status filter
- **Stock indicators**: Color-coded based on stock levels
- **Price formatting**: Currency display with locale support
- **Batch selection**: Multi-select for bulk operations
- **Export functionality**: CSV/Excel export

### ProductForm
- **Multi-section layout**: 
  - Basic Information
  - Pricing & Costs
  - Inventory Management
  - Categorization
  - Advanced Options
- **Image upload** con preview
- **Auto-calculations**: Margin calculation, profit analysis
- **Validation rules**: SKU uniqueness, price validation
- **Barcode scanner** integration ready
- **Rich text editor** para descripciones

### ProductDialog
- **Tabbed interface** para diferentes secciones
- **Image gallery** para múltiples fotos
- **Related products** suggestions
- **Sales history** integration
- **Quick actions**: Duplicate, Toggle status, Add to featured

## 🔄 State Management

### Advanced Filtering
```typescript
interface ProductFilters {
  search?: string;          // Buscar en nombre, SKU, descripción
  category?: string;        // Filtrar por categoría
  status?: 'active' | 'inactive' | 'all';
  stockLevel?: 'in_stock' | 'low_stock' | 'out_of_stock';
  priceRange?: { min: number; max: number };
  featured?: boolean;
}
```

### Product Validation
```typescript
interface ProductFormData {
  name: string;              // Required, min 2 chars
  description?: string;      // Optional, rich text
  sku: string;              // Required, unique
  barcode?: string;         // Optional, unique if provided
  
  // Pricing
  purchasePrice: number;    // Required, > 0
  salePrice: number;        // Required, > purchasePrice
  margin?: number;          // Auto-calculated
  
  // Inventory
  currentStock: number;     // Required, >= 0
  minStock: number;         // Required, >= 0
  unit: string;             // Required (pcs, kg, etc.)
  
  // Categorization
  categoryId?: string;      // Optional
  subcategoryId?: string;   // Optional
  tags?: string[];          // Optional
  
  // Status
  isActive: boolean;        // Required, default true
  isFeatured: boolean;      // Optional, default false
  
  // Media
  images?: string[];        // Optional, image URLs
}
```

## 🔌 Backend Integration

### Service Layer: `productService`

#### API Endpoints
- **GET** `/products` - Lista paginada con filtros avanzados
- **GET** `/products/:id` - Producto específico con detalles
- **GET** `/products/search` - Búsqueda de texto completo
- **POST** `/products` - Crear nuevo producto
- **PUT** `/products/:id` - Actualizar producto existente
- **PATCH** `/products/:id/status` - Toggle active/inactive
- **PATCH** `/products/:id/stock` - Actualización rápida de stock
- **DELETE** `/products/:id` - Soft delete (mantener historial)
- **POST** `/products/bulk` - Operaciones en lote

#### Advanced Features
- **Full-text search** en nombre, descripción, SKU
- **Faceted filtering** por múltiples criterios
- **Stock alerts** cuando llega al mínimo
- **Price history** tracking
- **Audit trail** para cambios

## 🎨 Design Patterns

### Smart Filtering Architecture
```typescript
// Debounced search with multiple filters
const useProductFilters = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const debouncedFilters = useDebounce(filters, 300);
  
  useEffect(() => {
    loadProductsWithFilters(debouncedFilters);
  }, [debouncedFilters]);
  
  return { filters, setFilters };
};
```

### Optimistic Updates
```typescript
const handleStockUpdate = async (productId: string, newStock: number) => {
  // Update UI immediately
  updateProductStock(productId, newStock);
  
  try {
    await productService.updateStock(productId, newStock);
  } catch (error) {
    // Revert on error
    revertProductStock(productId);
    showError('Stock update failed');
  }
};
```

## 🚀 Performance Features

### Advanced Optimizations
- **Virtual scrolling** para catálogos grandes (1000+ productos)
- **Image lazy loading** con progressive enhancement
- **Infinite scroll** con pagination
- **Background sync** para cambios offline
- **Prefetching** de productos relacionados
- **Memoized calculations** para pricing

### Caching Strategy
- **Product list cache** con invalidation smart
- **Image caching** con service worker
- **Search result caching** por términos frecuentes
- **Category cache** para filtros rápidos

## 🧮 Business Logic

### Price Calculations
```typescript
interface PriceCalculations {
  calculateMargin: (purchasePrice: number, salePrice: number) => number;
  calculateProfit: (purchasePrice: number, salePrice: number, quantity: number) => number;
  applyDiscount: (salePrice: number, discount: number, type: 'percentage' | 'fixed') => number;
  calculateTax: (price: number, taxRate: number) => number;
}
```

### Inventory Management
```typescript
interface InventoryRules {
  lowStockThreshold: number;
  outOfStockBehavior: 'hide' | 'show_unavailable';
  negativeStockAllowed: boolean;
  autoReorderPoint: number;
  trackSerialNumbers: boolean;
}
```

## 📊 Analytics Integration

### Product Metrics
- **Sales velocity** (productos más vendidos)
- **Profit margin analysis** por producto/categoría
- **Stock turnover** rates
- **Seasonal trends** analysis
- **ABC analysis** para categorización automática

### Reporting Features
- **Low stock alerts** automáticos
- **Profit margin reports** por período
- **Category performance** analysis
- **Price optimization** suggestions

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Product Service', () => {
  test('should calculate margin correctly', () => {
    expect(calculateMargin(100, 150)).toBe(50);
  });
  
  test('should validate SKU uniqueness', async () => {
    const result = await validateSKU('EXISTING_SKU');
    expect(result.isValid).toBe(false);
  });
});
```

### Integration Tests
- **Complete product lifecycle** (create → edit → delete)
- **Inventory updates** affecting sales
- **Category management** integration
- **Bulk operations** testing
- **Image upload** workflows

## 🔐 Security & Validation

### Data Validation
- **SKU uniqueness** across business
- **Price validation** (sale > purchase)
- **Stock validation** (non-negative)
- **Image format** validation
- **Barcode format** validation

### Access Control
- **Role-based permissions** para diferentes operaciones
- **Product category** access restrictions
- **Price modification** permissions
- **Bulk operations** admin-only

## 📈 Future Enhancements

### Planned Features
- **Variant management** (size, color, etc.)
- **Bundle products** (kits, packs)
- **Subscription products** para servicios
- **Digital products** support
- **Multi-warehouse** inventory
- **Supplier integration** automática
- **AI-powered** price optimization
- **Barcode generation** automática

### Advanced Inventory
- **Lot tracking** para productos perecederos
- **Expiration date** management
- **Serial number** tracking
- **Location tracking** dentro del almacén
- **Reserve inventory** para órdenes pendientes

## 🔗 Integration Points

### External Services
- **Barcode APIs** para validación
- **Image CDN** para almacenamiento
- **Price comparison** services
- **Supplier catalogs** import
- **E-commerce platforms** sync
- **Accounting systems** integration

### Internal Modules
- **Sales module** → Product availability
- **Purchases module** → Stock updates
- **Inventory module** → Real-time sync
- **Reports module** → Analytics data

---

*Esta documentación se actualiza con cada nueva funcionalidad. Última actualización: ${new Date().toLocaleDateString()}*
