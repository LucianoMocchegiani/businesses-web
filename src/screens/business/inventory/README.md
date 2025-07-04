# Inventory Module Documentation

## 📋 Overview

El módulo de Inventory (Inventario) es el centro de control de stock y almacén del negocio. Proporciona visibilidad en tiempo real del inventario, gestiona movimientos de stock, alertas de reposición, y optimiza la gestión de almacenes con análisis avanzados y reportes detallados.

## 🏗️ Module Structure

```
src/screens/business/inventory/
├── components/
│   ├── InventoryTable.tsx        # Tabla principal con stock levels
│   ├── StockMovementTable.tsx    # Historial de movimientos
│   ├── InventoryForm.tsx         # Formulario de ajustes
│   ├── InventoryDialog.tsx       # Modal para ajustes y transferencias
│   ├── StockAlerts.tsx           # Alertas de stock bajo
│   ├── LocationManager.tsx       # Gestión de ubicaciones
│   └── index.ts                  # Barrel exports
├── hooks/
│   ├── useInventory.tsx          # Hook principal del módulo
│   ├── useStockMovements.tsx     # Hook para movimientos
│   ├── useStockAlerts.tsx        # Hook para alertas
│   └── index.ts                  # Barrel exports
├── types/
│   ├── InventoryTypes.ts         # Tipos de inventario
│   ├── StockMovementTypes.ts     # Tipos de movimientos
│   └── index.ts                  # Barrel exports
├── InventoryScreen.tsx           # Pantalla principal
├── index.ts                      # Barrel exports del módulo
└── README.md                     # Esta documentación
```

## 🎯 Main Functionality

### Inventory Management
- ✅ **Real-time stock levels**: Visibilidad completa del inventario actual
- ✅ **Stock movements tracking**: Historial completo de entradas y salidas
- ✅ **Multi-location support**: Gestión de múltiples almacenes/ubicaciones
- ✅ **Automatic alerts**: Notificaciones de stock bajo y crítico
- ✅ **Stock adjustments**: Correcciones manuales con justificación
- ✅ **Lot tracking**: Trazabilidad por lotes y fechas de vencimiento
- ✅ **Cycle counting**: Conteos físicos programados
- ✅ **Transfer management**: Transferencias entre ubicaciones

### Inventory Data Fields
- **Product info**: Producto, SKU, descripción, categoría
- **Stock levels**: Disponible, reservado, en tránsito, mínimo
- **Location details**: Almacén, pasillo, estante, posición
- **Movement tracking**: Tipo, cantidad, origen, destino, usuario
- **Lot information**: Número de lote, fecha de ingreso, vencimiento
- **Valuation**: Costo unitario, valor total del inventario
- **Status indicators**: Stock normal, bajo, crítico, agotado

## 🔧 Technical Implementation

### Core Hook: `useInventory`

```typescript
interface UseInventoryReturn {
  // State Management
  inventory: InventoryEntity[];
  stockMovements: StockMovementEntity[];
  stockAlerts: StockAlertEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedItem: InventoryEntity | null;
  
  // Filtering & Search
  searchTerm: string;
  locationFilter: string;
  stockLevelFilter: StockLevel;
  categoryFilter: string;
  setSearchTerm: (term: string) => void;
  setLocationFilter: (location: string) => void;
  setStockLevelFilter: (level: StockLevel) => void;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadInventory: () => Promise<void>;
  loadStockMovements: (productId?: string) => Promise<void>;
  handleStockAdjustment: (item: InventoryEntity) => void;
  handleStockTransfer: (item: InventoryEntity) => void;
  handleViewMovements: (item: InventoryEntity) => void;
  handleCloseDialog: () => void;
  handleSubmitAdjustment: (data: StockAdjustmentData) => Promise<void>;
  handleSubmitTransfer: (data: StockTransferData) => Promise<void>;
  
  // Business Logic
  calculateStockValue: (inventory: InventoryEntity[]) => number;
  getStockStatus: (current: number, minimum: number) => StockStatus;
  generateCycleCount: (locationId: string) => Promise<void>;
  exportInventoryReport: (format: 'csv' | 'excel') => Promise<void>;
  reconcilePhysicalCount: (data: PhysicalCountData[]) => Promise<void>;
}
```

### Stock Movement Hook: `useStockMovements`

```typescript
interface UseStockMovementsReturn {
  movements: StockMovementEntity[];
  loading: boolean;
  filters: MovementFilters;
  
  // Actions
  loadMovements: (filters?: MovementFilters) => Promise<void>;
  recordMovement: (data: StockMovementData) => Promise<void>;
  reverseMovement: (movementId: string, reason: string) => Promise<void>;
  
  // Analytics
  getMovementSummary: (period: DateRange) => MovementSummary;
  getTurnoverRate: (productId: string) => number;
  getFastMovingItems: (limit: number) => InventoryEntity[];
  getSlowMovingItems: (limit: number) => InventoryEntity[];
}
```

### Data Flow
1. **Real-time sync** → Inventory updates from sales/purchases
2. **Movement tracking** → Every stock change is logged
3. **Alert generation** → Automatic notifications for low stock
4. **Reconciliation** → Physical counts vs system records
5. **Reporting** → Analytics and performance metrics

## 📱 User Interface Components

### InventoryTable
- **Advanced DataGrid** con columnas: Product, SKU, Current Stock, Available, Reserved, Location, Last Movement, Status
- **Stock level indicators**: Color-coded based on stock thresholds
- **Quick actions**: Adjust, Transfer, View Movements, Physical Count
- **Multi-location view**: Switch between warehouses
- **Real-time updates**: Live stock level changes
- **Export capabilities**: CSV, Excel, PDF reports

### StockMovementTable
- **Movement history** con filtros por producto, tipo, fecha
- **Movement types**: Sale, Purchase, Adjustment, Transfer, Return
- **Detailed tracking**: User, timestamp, quantities, reasons
- **Reverse operations**: Ability to reverse incorrect movements
- **Audit trail**: Complete history for compliance

### InventoryForm
- **Stock adjustment** with reason codes
- **Transfer between locations** with validation
- **Physical count** entry and reconciliation
- **Lot management** para productos con vencimiento
- **Cost adjustment** capabilities

## 🔄 State Management

### Stock Status Types
```typescript
enum StockStatus {
  IN_STOCK = 'in_stock',           // Stock normal
  LOW_STOCK = 'low_stock',         // Por debajo del mínimo
  CRITICAL_STOCK = 'critical',     // Stock crítico
  OUT_OF_STOCK = 'out_of_stock',   // Sin stock
  EXCESS_STOCK = 'excess'          // Stock excesivo
}

enum MovementType {
  SALE = 'sale',                   // Venta
  PURCHASE = 'purchase',           // Compra
  ADJUSTMENT_POSITIVE = 'adj_pos', // Ajuste positivo
  ADJUSTMENT_NEGATIVE = 'adj_neg', // Ajuste negativo
  TRANSFER_IN = 'transfer_in',     // Transferencia entrada
  TRANSFER_OUT = 'transfer_out',   // Transferencia salida
  RETURN = 'return',               // Devolución
  DAMAGE = 'damage',               // Producto dañado
  THEFT = 'theft',                 // Pérdida/robo
  EXPIRED = 'expired'              // Producto vencido
}
```

### Inventory Validation
```typescript
interface StockAdjustmentData {
  productId: string;
  locationId: string;
  adjustmentType: 'positive' | 'negative';
  quantity: number;              // Required, > 0
  reason: string;                // Required explanation
  cost?: number;                 // Optional, for valuation
  lotNumber?: string;            // Optional, for lot tracking
  notes?: string;                // Additional notes
}
```

## 🔌 Backend Integration

### Service Layer: `inventoryService`

#### API Endpoints
- **GET** `/inventory` - Current stock levels con filtros
- **GET** `/inventory/:id/movements` - Movement history
- **GET** `/inventory/alerts` - Stock alerts and notifications
- **GET** `/inventory/locations` - Available locations/warehouses
- **POST** `/inventory/adjustment` - Stock adjustment
- **POST** `/inventory/transfer` - Transfer between locations
- **POST** `/inventory/physical-count` - Physical count reconciliation
- **GET** `/inventory/reports` - Generate inventory reports
- **GET** `/inventory/analytics` - Stock analytics and KPIs

#### Real-time Features
- **WebSocket updates** para stock changes
- **Push notifications** para critical alerts
- **Background sync** para inventory updates
- **Conflict resolution** para concurrent updates

## 🎨 Design Patterns

### Real-time Inventory Updates
```typescript
const useRealTimeInventory = () => {
  useEffect(() => {
    const socket = new WebSocket('/ws/inventory');
    
    socket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      updateInventoryState(update);
    };
    
    return () => socket.close();
  }, []);
};
```

### Stock Alert System
```typescript
const useStockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  
  useEffect(() => {
    const checkStockLevels = async () => {
      const lowStockItems = await inventoryService.getLowStockItems();
      setAlerts(lowStockItems.map(createAlert));
    };
    
    const interval = setInterval(checkStockLevels, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);
  
  return { alerts, dismissAlert, resolveAlert };
};
```

## 🚀 Performance Features

### Advanced Optimizations
- **Lazy loading** de movement history
- **Virtual scrolling** para large inventories
- **Debounced updates** para real-time search
- **Cached calculations** para stock valuations
- **Background processing** para reports
- **Optimistic updates** para better UX

### Memory Management
- **Pagination** para large datasets
- **Cleanup** de old movement data
- **Efficient filtering** con indexing
- **State normalization** para complex data

## 🧮 Business Logic

### Stock Calculations
```typescript
interface StockCalculations {
  calculateAvailableStock: (current: number, reserved: number) => number;
  calculateStockValue: (quantity: number, unitCost: number) => number;
  calculateTurnoverRate: (sold: number, avgInventory: number) => number;
  calculateReorderPoint: (demand: number, leadTime: number, safetyStock: number) => number;
  calculateABC: (items: InventoryEntity[]) => ABCAnalysis;
}
```

### Inventory Valuation Methods
- **FIFO** (First In, First Out)
- **LIFO** (Last In, First Out)
- **Average Cost** method
- **Standard Cost** method

## 📊 Analytics & Reporting

### Key Metrics
- **Stock turnover** rates por producto/categoría
- **Carrying costs** analysis
- **Stockout frequency** y impact
- **Dead stock** identification
- **Seasonal patterns** analysis
- **ABC analysis** automático

### Report Types
- **Inventory valuation** reports
- **Stock movement** summaries
- **Low stock** alerts
- **Slow/fast moving** analysis
- **Physical count** variance reports
- **Location utilization** reports

## 🔐 Security & Compliance

### Access Control
- **Role-based permissions** para stock adjustments
- **Audit trails** para compliance
- **Movement authorization** levels
- **Physical count** approvals
- **Transfer verification** workflows

### Data Integrity
- **Concurrent update** handling
- **Transaction rollback** capabilities
- **Data validation** en todos los niveles
- **Backup and recovery** procedures

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Inventory Calculations', () => {
  test('should calculate available stock correctly', () => {
    expect(calculateAvailableStock(100, 20)).toBe(80);
  });
  
  test('should identify low stock items', () => {
    const items = [
      { current: 5, minimum: 10 },
      { current: 15, minimum: 10 }
    ];
    expect(getLowStockItems(items)).toHaveLength(1);
  });
});
```

### Integration Tests
- **Stock adjustment** workflows
- **Transfer operations** between locations
- **Real-time updates** testing
- **Report generation** accuracy
- **Alert system** functionality

## 📈 Future Enhancements

### Planned Features
- **AI-powered demand** forecasting
- **Automated reordering** based on patterns
- **IoT integration** para automatic counting
- **Blockchain tracking** para high-value items
- **Mobile scanning** app for warehouse operations
- **3D warehouse** visualization
- **Predictive analytics** para stock optimization

### Advanced Inventory
- **Consignment tracking** para supplier-owned stock
- **Drop shipping** integration
- **Kitting and assembly** management
- **Quality control** integration
- **Warranty tracking** por product serial numbers

## 🔗 Integration Points

### Internal Modules
- **Sales module** → Real-time stock deduction
- **Purchases module** → Automatic stock addition
- **Products module** → Product master data sync
- **Reports module** → Inventory analytics
- **Accounting module** → Inventory valuation

### External Services
- **Barcode scanners** y mobile devices
- **WMS systems** para advanced warehousing
- **ERP integration** para enterprise environments
- **Supplier portals** para real-time inventory
- **E-commerce platforms** stock sync

## 📚 Usage Examples

### Basic Inventory Operations
```typescript
// Load current inventory
const { inventory, loading } = useInventory('business-id');

// Adjust stock level
await inventoryService.adjustStock({
  productId: 'product-123',
  locationId: 'warehouse-1',
  adjustmentType: 'positive',
  quantity: 50,
  reason: 'Physical count correction'
});

// Transfer between locations
await inventoryService.transferStock({
  productId: 'product-123',
  fromLocationId: 'warehouse-1',
  toLocationId: 'warehouse-2',
  quantity: 25,
  reason: 'Rebalancing stock'
});
```

### Advanced Analytics
```typescript
const { getStockAnalytics } = useInventory();

const analytics = await getStockAnalytics({
  period: 'last_12_months',
  includeABC: true,
  includeTurnover: true
});

console.log('Fast moving items:', analytics.fastMoving);
console.log('ABC Classification:', analytics.abcAnalysis);
```

---

*Esta documentación refleja las mejores prácticas en gestión de inventario moderno. Última actualización: ${new Date().toLocaleDateString()}*
