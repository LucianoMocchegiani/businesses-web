# Sales Module Documentation

## 📋 Overview

El módulo de Sales (Ventas) es el núcleo del sistema de gestión comercial. Maneja todo el proceso de ventas desde la cotización hasta la facturación, incluyendo gestión de clientes, productos, descuentos, y integración con inventario y contabilidad.

## 🏗️ Module Structure

```
src/screens/business/sales/
├── components/
│   ├── SaleTable.tsx         # Tabla principal con DataGrid
│   ├── SaleForm.tsx          # Formulario de venta
│   ├── SaleDialog.tsx        # Modal para crear/editar/ver
│   └── index.ts              # Barrel exports
├── hooks/
│   ├── useSales.tsx          # Hook principal del módulo
│   └── index.ts              # Barrel exports
├── types/
│   ├── SaleFormData.ts       # Tipos para formularios
│   └── index.ts              # Barrel exports
├── SalesScreen.tsx           # Pantalla principal
├── index.ts                  # Barrel exports del módulo
└── README.md                 # Esta documentación
```

## 🎯 Main Functionality

### Sales Management
- ✅ **Complete sales workflow**: Cotización → Orden → Factura → Pago
- ✅ **Multi-item sales**: Carrito de compras con múltiples productos
- ✅ **Customer integration**: Clientes registrados y walk-in customers
- ✅ **Inventory sync**: Actualización automática de stock
- ✅ **Payment tracking**: Múltiples métodos de pago
- ✅ **Discount management**: Descuentos por ítem y totales
- ✅ **Tax calculations**: Cálculos automáticos de impuestos
- ✅ **Sales reporting**: Analytics y reportes detallados

### Sale Data Fields
- **Customer info**: Cliente registrado o información manual
- **Sale items**: Productos, cantidades, precios, descuentos
- **Pricing**: Subtotal, descuentos, impuestos, total
- **Payment**: Método de pago, estado, referencias
- **Status**: PENDING, COMPLETED, CANCELED
- **Timestamps**: Fecha de venta, última actualización
- **Notes**: Observaciones y comentarios especiales

## 🔧 Technical Implementation

### Core Hook: `useSales`

```typescript
interface UseSalesReturn {
  // State Management
  sales: SaleEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedSale: SaleEntity | null;
  pagination: PaginationState;
  
  // Filtering & Search
  searchTerm: string;
  statusFilter: SaleStatus;
  dateRange: DateRange;
  customerFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: SaleStatus) => void;
  setDateRange: (range: DateRange) => void;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadSales: (params?: Partial<GetSalesParams>) => Promise<void>;
  handleCreate: () => void;
  handleEdit: (sale: SaleEntity) => void;
  handleView: (sale: SaleEntity) => void;
  handleDelete: (sale: SaleEntity) => Promise<void>;
  handleCancel: (sale: SaleEntity) => Promise<void>;
  handleComplete: (sale: SaleEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: SaleFormData) => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  
  // Business Logic
  calculateSaleTotal: (items: SaleDetailFormData[]) => number;
  validateSaleStock: (items: SaleDetailFormData[]) => Promise<boolean>;
  generateInvoice: (saleId: string) => Promise<void>;
  duplicateSale: (sale: SaleEntity) => void;
}
```

### Data Flow
1. **Sale creation** → Product selection + customer info
2. **Inventory check** → Real-time stock validation
3. **Price calculation** → Automatic totals with discounts/taxes
4. **Payment processing** → Multiple payment methods
5. **Inventory update** → Stock reduction on completion
6. **Invoice generation** → Automatic document creation

## 📱 User Interface Components

### SaleTable
- **Advanced DataGrid** con columnas: Sale ID, Customer, Total Amount, Status, Items, Created, Actions
- **Real-time updates**: Status changes reflected immediately
- **Status indicators**: Color-coded chips (Pending=yellow, Completed=green, Canceled=red)
- **Quick actions**: View, Edit, Cancel, Complete, Generate Invoice
- **Batch operations**: Multi-select for bulk actions
- **Export options**: CSV, PDF, Excel export
- **Server-side pagination**: Efficient loading for large datasets

### SaleForm
- **Intelligent product selection**:
  - Product autocomplete with stock info
  - Real-time stock validation
  - Price auto-population from product catalog
  - Quantity validation against available stock
- **Customer management**:
  - Registered customer selection
  - Walk-in customer manual entry
  - Customer history integration
- **Dynamic calculations**:
  - Item totals (quantity × price)
  - Subtotal calculation
  - Discount application (percentage or fixed)
  - Tax calculation by jurisdiction
  - Grand total with all adjustments
- **Responsive design**: Mobile-first approach

### SaleDialog
- **Context-aware interface**: Different layouts per mode
- **Sale summary**: Clear overview of all sale components
- **Action buttons**: Status-dependent actions (Complete, Cancel, Print)
- **Payment integration**: Quick payment recording
- **History tracking**: Changes and status updates log

## 🔄 State Management

### Sale Workflow States
```typescript
type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

interface SaleWorkflow {
  PENDING: {
    allowedActions: ['edit', 'complete', 'cancel', 'delete'];
    nextStates: ['COMPLETED', 'CANCELED'];
    inventoryImpact: false;
  };
  COMPLETED: {
    allowedActions: ['view', 'cancel', 'invoice'];
    nextStates: ['CANCELED'];
    inventoryImpact: true;
  };
  CANCELED: {
    allowedActions: ['view', 'duplicate'];
    nextStates: [];
    inventoryImpact: false;
  };
}
```

### Sale Validation
```typescript
interface SaleFormData {
  // Customer Information
  customerId?: string;            // Optional, for registered customers
  customerName?: string;          // Required for walk-in customers
  customerEmail?: string;         // Optional, for receipts
  customerPhone?: string;         // Optional, for contact
  
  // Sale Details
  saleDetails: SaleDetailFormData[];  // Required, min 1 item
  
  // Pricing
  subtotal?: number;              // Auto-calculated
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;         // Optional, 0-100% or fixed amount
  taxRate?: number;               // Auto-populated by location
  totalAmount?: number;           // Auto-calculated
  
  // Status & Metadata
  status: SaleStatus;             // Required, default PENDING
  notes?: string;                 // Optional, internal notes
  paymentMethod?: PaymentMethod;  // Required for completed sales
  paymentReference?: string;      // Optional, transaction ID
}

interface SaleDetailFormData {
  productId: string;              // Required, must exist in inventory
  productName: string;            // Auto-populated from product
  quantity: number;               // Required, min 1, max available stock
  price: number;                  // Auto-populated, editable
  discount?: number;              // Optional, item-level discount
  totalAmount: number;            // Auto-calculated (qty × price - discount)
}
```

## 🔌 Backend Integration

### Service Layer: `saleService`

#### API Endpoints
- **GET** `/sales` - Lista paginada con filtros avanzados
- **GET** `/sales/:id` - Venta específica con detalles completos
- **GET** `/sales/analytics` - Métricas y analytics de ventas
- **POST** `/sales` - Crear nueva venta
- **PUT** `/sales/:id` - Actualizar venta existente (solo PENDING)
- **PATCH** `/sales/:id/complete` - Marcar venta como completada
- **PATCH** `/sales/:id/cancel` - Cancelar venta
- **DELETE** `/sales/:id` - Eliminar venta (solo PENDING)
- **POST** `/sales/:id/invoice` - Generar factura
- **GET** `/sales/:id/invoice/pdf` - Descargar factura en PDF

#### Advanced Features
- **Stock validation** en tiempo real
- **Price consistency** checks
- **Customer purchase history**
- **Automatic tax calculation** por ubicación
- **Payment integration** con múltiples procesadores
- **Invoice generation** automática

## 🎨 Design Patterns

### Shopping Cart Logic
```typescript
interface ShoppingCart {
  items: SaleDetailFormData[];
  
  addItem: (product: ProductEntity, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (type: 'percentage' | 'fixed', value: number) => void;
  
  // Calculations
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  
  // Validation
  validateStock: () => Promise<ValidationResult>;
  validatePrices: () => ValidationResult;
}
```

### Inventory Integration
```typescript
const useInventorySync = () => {
  const reserveStock = async (items: SaleDetailFormData[]) => {
    // Reserve inventory for pending sale
    for (const item of items) {
      await inventoryService.reserve(item.productId, item.quantity);
    }
  };
  
  const commitStock = async (saleId: string) => {
    // Commit reserved stock when sale completes
    await inventoryService.commit(saleId);
  };
  
  const releaseStock = async (saleId: string) => {
    // Release reserved stock when sale cancels
    await inventoryService.release(saleId);
  };
  
  return { reserveStock, commitStock, releaseStock };
};
```

## 🚀 Performance Features

### Real-time Features
- **Live stock updates**: WebSocket connection para stock changes
- **Price synchronization**: Real-time price updates
- **Customer sync**: Live customer data updates
- **Payment status**: Real-time payment confirmations

### Optimization Strategies
- **Product search debouncing**: Efficient product lookup
- **Cart persistence**: LocalStorage backup
- **Offline capability**: Queue sales for later sync
- **Background calculations**: Web Workers para cálculos complejos

## 📊 Sales Analytics

### Key Performance Indicators
```typescript
interface SalesKPIs {
  // Revenue Metrics
  totalRevenue: number;
  averageOrderValue: number;
  revenueGrowth: number;
  monthlyRecurring: number;
  
  // Volume Metrics
  totalOrders: number;
  orderGrowth: number;
  itemsPerOrder: number;
  
  // Customer Metrics
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  
  // Product Metrics
  topSellingProducts: ProductSalesData[];
  profitMargins: ProfitAnalysis[];
  slowMovingInventory: InventoryAlert[];
  
  // Time-based Analysis
  salesByHour: HourlySalesData[];
  salesByDay: DailySalesData[];
  salesByMonth: MonthlySalesData[];
  seasonalTrends: SeasonalAnalysis[];
}
```

### Reporting Features
- **Sales dashboards** con métricas en tiempo real
- **Customer analysis** y segmentación
- **Product performance** tracking
- **Profit margin** analysis por producto/categoría
- **Seasonal trends** y forecasting
- **Commission calculations** para vendedores

## 🧮 Business Logic

### Pricing Engine
```typescript
interface PricingEngine {
  calculateItemTotal: (quantity: number, unitPrice: number, discount?: number) => number;
  applyVolumeDiscount: (quantity: number, unitPrice: number, volumeRules: VolumeRule[]) => number;
  calculateTax: (subtotal: number, taxRules: TaxRule[], customerLocation: Location) => number;
  applyPromotion: (items: SaleDetailFormData[], promotion: Promotion) => SaleDetailFormData[];
  
  // Advanced Pricing
  dynamicPricing: (productId: string, quantity: number, customerId?: string) => number;
  loyaltyDiscount: (customerId: string, totalAmount: number) => number;
  bundleDiscount: (items: SaleDetailFormData[]) => number;
}
```

### Payment Processing
```typescript
interface PaymentProcessor {
  processPayment: (amount: number, method: PaymentMethod, details: PaymentDetails) => Promise<PaymentResult>;
  validatePayment: (paymentData: PaymentData) => ValidationResult;
  refundPayment: (transactionId: string, amount?: number) => Promise<RefundResult>;
  
  // Supported Methods
  processCash: (amount: number) => PaymentResult;
  processCreditCard: (cardData: CardData, amount: number) => Promise<PaymentResult>;
  processDebitCard: (cardData: CardData, amount: number) => Promise<PaymentResult>;
  processBankTransfer: (transferData: TransferData) => Promise<PaymentResult>;
  processDigitalWallet: (walletData: WalletData, amount: number) => Promise<PaymentResult>;
}
```

## 🔐 Security & Compliance

### Data Protection
- **PCI DSS compliance** para datos de tarjetas
- **Customer data** encryption en tránsito y reposo
- **Transaction audit** trail completo
- **Access control** basado en roles
- **Payment tokenization** para seguridad

### Financial Compliance
- **Tax calculation** automática por jurisdicción
- **Invoice numbering** secuencial y único
- **Financial reporting** compliance
- **Audit trail** para cambios de precios
- **Currency handling** multi-moneda

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Sales Calculations', () => {
  test('should calculate total correctly with discount', () => {
    const items = [
      { quantity: 2, price: 100, discount: 10 },
      { quantity: 1, price: 50, discount: 0 }
    ];
    expect(calculateTotal(items)).toBe(240); // (200-10) + 50
  });
  
  test('should validate stock availability', async () => {
    const result = await validateStock([
      { productId: '1', quantity: 5 }
    ]);
    expect(result.isValid).toBe(true);
  });
});
```

### Integration Tests
- **Complete sale workflow** (create → complete → invoice)
- **Inventory synchronization** testing
- **Payment processing** integration
- **Customer data** consistency
- **Tax calculation** accuracy

## 📈 Future Enhancements

### Planned Features
- **Quote management**: Convertir cotizaciones a ventas
- **Recurring sales**: Subscripciones y ventas recurrentes
- **Multi-location sales**: Ventas desde múltiples ubicaciones
- **Advanced promotions**: Buy X get Y, combo offers
- **Loyalty programs**: Points, tiers, rewards
- **Sales forecasting**: AI-powered predictions
- **Mobile POS**: Aplicación móvil para ventas
- **Voice ordering**: Integración con asistentes de voz

### Advanced Integrations
- **E-commerce platform** sync (Shopify, WooCommerce)
- **Accounting software** integration (QuickBooks, SAP)
- **CRM systems** integration (Salesforce, HubSpot)
- **Shipping providers** integration
- **Marketing automation** platforms
- **Business intelligence** tools

## 🔗 Integration Points

### Internal Modules
- **Customers module** → Customer data y history
- **Products module** → Catalog y pricing
- **Inventory module** → Stock levels y reservations
- **Accounting module** → Financial recording
- **Reports module** → Sales analytics

### External Services
- **Payment gateways** (Stripe, PayPal, Square)
- **Tax calculation** services (Avalara, TaxJar)
- **Shipping APIs** (FedEx, UPS, DHL)
- **SMS/Email** services para receipts
- **Printer APIs** para receipts físicos

---

*Esta documentación cubre el flujo completo de ventas del sistema. Última actualización: ${new Date().toLocaleDateString()}*
