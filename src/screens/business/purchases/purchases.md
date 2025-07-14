# Purchases Module Documentation

## 📋 Overview

El módulo de Purchases (Compras) gestiona todo el proceso de adquisición de productos y servicios para el negocio. Integra con proveedores, maneja órdenes de compra, actualiza inventario automáticamente y proporciona análisis detallados de costos y desempeño de proveedores.

## 🏗️ Module Structure

```
src/screens/business/purchases/
├── components/
│   ├── PurchaseTable.tsx     # Tabla principal con DataGrid
│   ├── PurchaseForm.tsx      # Formulario de compra
│   ├── PurchaseDialog.tsx    # Modal para crear/editar/ver
│   └── index.ts              # Barrel exports
├── hooks/
│   ├── usePurchases.tsx      # Hook principal del módulo
│   └── index.ts              # Barrel exports
├── types/
│   ├── PurchaseFormData.ts   # Tipos para formularios
│   └── index.ts              # Barrel exports
├── PurchasesScreen.tsx       # Pantalla principal
├── index.ts                  # Barrel exports del módulo
└── README.md                 # Esta documentación
```

## 🎯 Main Functionality

### Purchase Management
- ✅ **Complete purchase workflow**: Solicitud → Orden → Recepción → Pago
- ✅ **Supplier integration**: Gestión de proveedores y términos comerciales
- ✅ **Multi-item purchases**: Órdenes de compra con múltiples productos
- ✅ **Inventory sync**: Actualización automática de stock al recibir
- ✅ **Lot tracking**: Gestión de lotes, fechas de vencimiento y trazabilidad
- ✅ **Cost management**: Control de costos y análisis de variaciones
- ✅ **Payment tracking**: Estados de pago y términos de crédito
- ✅ **Quality control**: Inspección y aprobación de productos recibidos

### Purchase Data Fields
- **Supplier info**: Proveedor, contacto, términos de pago
- **Purchase items**: Productos, cantidades, precios, totales
- **Lot management**: Números de lote, fechas de ingreso y vencimiento
- **Quality control**: Estado de inspección, notas de calidad
- **Financial**: Subtotal, impuestos, total, estado de pago
- **Status**: PENDING, COMPLETED, CANCELED
- **Logistics**: Fecha esperada, fecha de recepción, transportista
- **Timestamps**: Fechas de orden, recepción, última actualización

## 🔧 Technical Implementation

### Core Hook: `usePurchases`

```typescript
interface UsePurchasesReturn {
  // State Management
  purchases: PurchaseEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedPurchase: PurchaseEntity | null;
  
  // Filtering & Search
  searchTerm: string;
  statusFilter: PurchaseStatus;
  supplierFilter: string;
  dateRange: DateRange;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: PurchaseStatus) => void;
  setSupplierFilter: (supplier: string) => void;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadPurchases: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (purchase: PurchaseEntity) => void;
  handleView: (purchase: PurchaseEntity) => void;
  handleDelete: (purchase: PurchaseEntity) => Promise<void>;
  handleCancel: (purchase: PurchaseEntity) => Promise<void>;
  handleComplete: (purchase: PurchaseEntity) => Promise<void>;
  handleReceive: (purchase: PurchaseEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: PurchaseFormData) => Promise<void>;
  
  // Business Logic
  generatePurchaseOrder: (purchaseId: string) => Promise<void>;
  calculateTotalCost: (items: PurchaseDetailFormData[]) => number;
  validateSupplierTerms: (supplierId: string, amount: number) => Promise<boolean>;
  updateInventory: (purchaseId: string) => Promise<void>;
  trackDelivery: (purchaseId: string) => Promise<DeliveryStatus>;
}
```

### Data Flow
1. **Purchase request** → Supplier selection + product specification
2. **Cost calculation** → Automatic pricing with supplier terms
3. **Purchase order** → Generated PO with approval workflow
4. **Delivery tracking** → Monitor shipment status
5. **Goods receipt** → Quality inspection + lot registration
6. **Inventory update** → Automatic stock increase
7. **Invoice matching** → Three-way matching (PO, GR, Invoice)
8. **Payment processing** → Payment according to terms

## 📱 User Interface Components

### PurchaseTable
- **Comprehensive DataGrid** con columnas: Supplier, Total Amount, Status, Items, Created, Expected Delivery, Actions
- **Advanced filtering**: Por proveedor, estado, rango de fechas
- **Status indicators**: Color-coded chips (Pending=blue, Completed=green, Canceled=red)
- **Progress tracking**: Visual indicators for order status
- **Quick actions**: View details, Receive goods, Generate PO, Cancel
- **Batch operations**: Multi-select para operaciones en lote
- **Export capabilities**: Purchase reports, supplier analysis

### PurchaseForm
- **Supplier selection**:
  - Supplier autocomplete con términos comerciales
  - Automatic pricing from supplier catalogs
  - Credit limit validation
  - Payment terms integration
- **Product selection**:
  - Product autocomplete con supplier preferences
  - Automatic cost retrieval from supplier catalogs
  - Quantity validation against reorder points
  - Alternative product suggestions
- **Advanced features**:
  - **Lot management**: Números de lote, fechas de vencimiento
  - **Quality specs**: Especificaciones de calidad requeridas
  - **Delivery terms**: Fechas esperadas, términos de entrega
  - **Cost breakdown**: Subtotal, shipping, taxes, total
- **Dynamic calculations**: Real-time cost calculations

### PurchaseDialog
- **Multi-tab interface**:
  - **General**: Purchase overview y básicos
  - **Items**: Detailed item list con lot tracking
  - **Delivery**: Logistics y tracking information
  - **Payment**: Financial details y payment status
  - **Documents**: PO, invoices, delivery notes
- **Action workflows**: Context-aware actions based on status
- **History tracking**: Complete audit trail

## 🔄 State Management

### Purchase Workflow States
```typescript
type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

interface PurchaseWorkflow {
  PENDING: {
    allowedActions: ['edit', 'complete', 'cancel', 'generatePO'];
    nextStates: ['COMPLETED', 'CANCELED'];
    inventoryImpact: false;
    description: 'Purchase order created, waiting for goods receipt';
  };
  COMPLETED: {
    allowedActions: ['view', 'cancel', 'generateInvoice'];
    nextStates: ['CANCELED'];
    inventoryImpact: true;
    description: 'Goods received and added to inventory';
  };
  CANCELED: {
    allowedActions: ['view', 'duplicate'];
    nextStates: [];
    inventoryImpact: false;
    description: 'Purchase order canceled';
  };
}
```

### Purchase Validation
```typescript
interface PurchaseFormData {
  // Supplier Information
  supplierId?: string;            // Optional, for registered suppliers
  supplierName?: string;          // Required for walk-in suppliers
  supplierContact?: string;       // Optional, contact person
  
  // Purchase Details
  purchaseDetails: PurchaseDetailFormData[];  // Required, min 1 item
  
  // Financial
  subtotal?: number;              // Auto-calculated
  shippingCost?: number;          // Optional, shipping charges
  taxRate?: number;               // Auto-populated by supplier
  totalAmount?: number;           // Auto-calculated
  
  // Delivery & Logistics
  expectedDeliveryDate?: string;  // Optional, expected arrival
  deliveryAddress?: string;       // Optional, delivery location
  shippingMethod?: string;        // Optional, shipping method
  trackingNumber?: string;        // Optional, tracking reference
  
  // Status & Metadata
  status: PurchaseStatus;         // Required, default PENDING
  notes?: string;                 // Optional, internal notes
  paymentTerms?: string;          // Auto-populated from supplier
  paymentStatus?: PaymentStatus;  // Optional, payment tracking
}

interface PurchaseDetailFormData {
  productId: string;              // Required, must exist in catalog
  productName: string;            // Auto-populated from product
  quantity: number;               // Required, min 1
  price: number;                  // Auto-populated from supplier, editable
  totalAmount?: number;           // Auto-calculated (qty × price)
  
  // Lot Management
  lotNumber?: string;             // Optional, lot identification
  entryDate?: string;             // Auto-populated, goods receipt date
  expirationDate?: string;        // Optional, expiration date
  
  // Quality Control
  qualityStatus?: 'pending' | 'approved' | 'rejected';
  qualityNotes?: string;          // Optional, inspection notes
  
  // Specifications
  specifications?: string;        // Optional, quality specifications
  unitOfMeasure?: string;         // Optional, measurement unit
}
```

## 🔌 Backend Integration

### Service Layer: `purchaseService`

#### API Endpoints
- **GET** `/purchases` - Lista paginada con filtros avanzados
- **GET** `/purchases/:id` - Compra específica con detalles completos
- **GET** `/purchases/analytics` - Métricas y analytics de compras
- **GET** `/purchases/:id/po` - Generar Purchase Order PDF
- **POST** `/purchases` - Crear nueva compra
- **PUT** `/purchases/:id` - Actualizar compra existente (solo PENDING)
- **PATCH** `/purchases/:id/complete` - Marcar como recibida (actualiza inventario)
- **PATCH** `/purchases/:id/cancel` - Cancelar compra
- **DELETE** `/purchases/:id` - Eliminar compra (solo PENDING)
- **POST** `/purchases/:id/receive` - Registrar recepción de mercancías
- **GET** `/purchases/suppliers/:supplierId` - Historial con proveedor específico

#### Advanced Features
- **Three-way matching**: PO, Goods Receipt, Invoice
- **Automatic inventory update** al completar compra
- **Lot tracking integration** con inventory module
- **Supplier performance** tracking automático
- **Cost analysis** y variance reporting
- **Payment integration** con accounting module

## 🎨 Design Patterns

### Inventory Integration
```typescript
interface InventoryUpdate {
  updateInventoryOnReceipt: (purchase: PurchaseEntity) => Promise<void>;
  createLotEntries: (purchaseDetails: PurchaseDetailEntity[]) => Promise<LotEntry[]>;
  validateReceiptQuantities: (expected: number, received: number) => ValidationResult;
  
  // Advanced Inventory Features
  handlePartialReceipts: (purchaseId: string, receivedItems: PartialReceipt[]) => Promise<void>;
  updateCostBasis: (productId: string, newCost: number, quantity: number) => Promise<void>;
  handleQualityRejection: (lotId: string, reason: string) => Promise<void>;
}
```

### Supplier Integration
```typescript
interface SupplierIntegration {
  getSupplierCatalog: (supplierId: string) => Promise<SupplierProduct[]>;
  validateCreditLimit: (supplierId: string, amount: number) => Promise<boolean>;
  getPaymentTerms: (supplierId: string) => Promise<PaymentTerms>;
  
  // Advanced Supplier Features
  getPreferredProducts: (supplierId: string, category?: string) => Promise<ProductSuggestion[]>;
  calculateLeadTime: (supplierId: string, productId: string) => Promise<number>;
  checkSupplierCapacity: (supplierId: string, quantity: number) => Promise<CapacityCheck>;
}
```

## 🚀 Performance Features

### Real-time Features
- **Delivery tracking**: WebSocket updates para shipment status
- **Price synchronization**: Real-time supplier price updates
- **Inventory sync**: Live inventory level updates
- **Supplier notifications**: Real-time communication

### Optimization Strategies
- **Batch processing**: Efficient handling of large purchase orders
- **Background calculations**: Web Workers para cost analysis
- **Predictive ordering**: AI-powered reorder suggestions
- **Supplier consolidation**: Optimize orders by supplier

## 📊 Purchase Analytics

### Key Performance Indicators
```typescript
interface PurchaseKPIs {
  // Cost Metrics
  totalSpend: number;
  averageOrderValue: number;
  costSavings: number;
  costVariance: number;
  
  // Supplier Metrics
  supplierCount: number;
  topSuppliers: SupplierSpendData[];
  supplierPerformance: SupplierKPI[];
  paymentTermsCompliance: number;
  
  // Efficiency Metrics
  purchaseOrderCycle: number;         // Average PO processing time
  goodsReceiptCycle: number;          // Average receipt processing time
  leadTimeAccuracy: number;           // Delivery date accuracy
  orderAccuracy: number;              // Quantity/quality accuracy
  
  // Quality Metrics
  defectRate: number;                 // Percentage of rejected items
  supplierQualityScore: number;       // Overall quality rating
  returnRate: number;                 // Percentage of returned items
  
  // Financial Metrics
  cashFlowImpact: CashFlowData[];
  paymentTermsUtilization: PaymentAnalysis;
  budgetCompliance: BudgetData;
}
```

### Reporting Features
- **Purchase dashboards** con métricas en tiempo real
- **Supplier scorecards** automáticos
- **Cost analysis** por categoría y período
- **Lead time analysis** y trending
- **Quality metrics** por supplier y product
- **Budget vs actual** tracking
- **Three-way matching** exception reports

## 🧮 Business Logic

### Cost Management
```typescript
interface CostManagement {
  calculateLandedCost: (itemCost: number, shipping: number, duties: number, handling: number) => number;
  trackCostVariance: (budgetedCost: number, actualCost: number) => VarianceAnalysis;
  updateStandardCost: (productId: string, newCost: number) => Promise<void>;
  
  // Advanced Costing
  calculateTotalCostOfOwnership: (productId: string, period: number) => Promise<TCOAnalysis>;
  analyzeSpendByCategory: (dateRange: DateRange) => Promise<SpendAnalysis[]>;
  identifyCostSavingOpportunities: () => Promise<SavingOpportunity[]>;
}
```

### Quality Control
```typescript
interface QualityControl {
  inspectGoods: (purchaseId: string, inspectionData: InspectionData) => Promise<QualityResult>;
  recordDefects: (lotId: string, defects: DefectData[]) => Promise<void>;
  processReturns: (purchaseId: string, returnItems: ReturnItem[]) => Promise<ReturnResult>;
  
  // Quality Analytics
  calculateSupplierQualityScore: (supplierId: string, period: DateRange) => Promise<QualityScore>;
  generateQualityReport: (filters: QualityFilters) => Promise<QualityReport>;
  trackCorrectiveActions: (supplierId: string) => Promise<CorrectiveAction[]>;
}
```

## 🔐 Security & Compliance

### Financial Controls
- **Purchase approval** workflows por monto
- **Budget validation** automática
- **Segregation of duties** (ordering vs receiving)
- **Audit trail** completo para todas las transacciones
- **Financial reporting** compliance

### Data Protection
- **Supplier information** encryption
- **Purchase data** backup y recovery
- **Access control** basado en roles
- **Document retention** policies
- **GDPR compliance** para datos de proveedores

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Purchase Calculations', () => {
  test('should calculate total with taxes correctly', () => {
    const items = [
      { quantity: 10, price: 100, tax: 21 },
      { quantity: 5, price: 200, tax: 21 }
    ];
    expect(calculatePurchaseTotal(items)).toBe(1815); // (1000 + 1000) * 1.21
  });
  
  test('should update inventory on purchase completion', async () => {
    const result = await completePurchase(mockPurchaseId);
    expect(result.inventoryUpdated).toBe(true);
  });
});
```

### Integration Tests
- **Complete purchase workflow** (create → receive → inventory update)
- **Supplier integration** testing
- **Inventory synchronization** validation
- **Quality control** process testing
- **Financial integration** accuracy

## 📈 Future Enhancements

### Planned Features
- **Electronic data interchange** (EDI) con proveedores
- **Automatic reordering** basado en min/max levels
- **Blanket purchase orders** para contratos anuales
- **Drop shipping** integration
- **Request for quotation** (RFQ) automation
- **Contract management** integration
- **Spend analysis** con AI
- **Predictive analytics** para demand planning

### Advanced Integrations
- **ERP systems** synchronization (SAP, Oracle)
- **Supplier portals** integration
- **E-procurement** platforms
- **Logistics providers** APIs
- **Quality management** systems
- **Regulatory compliance** tools

## 🔗 Integration Points

### Internal Modules
- **Suppliers module** → Supplier data y performance
- **Products module** → Product catalog y specifications
- **Inventory module** → Stock levels y lot tracking
- **Accounting module** → Financial recording y payments
- **Reports module** → Purchase analytics y KPIs

### External Services
- **Supplier catalogs** y pricing APIs
- **Shipping providers** (FedEx, UPS, DHL)
- **Payment processors** para supplier payments
- **Tax calculation** services
- **Currency exchange** rate services
- **Quality certification** bodies

---

*Esta documentación cubre el ciclo completo de compras y gestión de proveedores. Última actualización: ${new Date().toLocaleDateString()}*
