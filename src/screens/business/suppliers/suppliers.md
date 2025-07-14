# Suppliers Module Documentation

## 📋 Overview

El módulo de Suppliers (Proveedores) gestiona la información completa de proveedores del negocio. Es fundamental para la gestión de compras, control de costos y mantenimiento de relaciones comerciales estratégicas.

## 🏗️ Module Structure

```
src/screens/business/suppliers/
├── components/
│   ├── SupplierTable.tsx     # Tabla principal con DataGrid
│   ├── SupplierForm.tsx      # Formulario de proveedor
│   ├── SupplierDialog.tsx    # Modal para crear/editar/ver
│   └── index.ts              # Barrel exports
├── hooks/
│   ├── useSuppliers.tsx      # Hook principal del módulo
│   └── index.ts              # Barrel exports
├── types/
│   ├── SupplierFormData.ts   # Tipos para formularios
│   └── index.ts              # Barrel exports
├── SuppliersScreen.tsx       # Pantalla principal
├── index.ts                  # Barrel exports del módulo
└── README.md                 # Esta documentación
```

## 🎯 Main Functionality

### Supplier Management
- ✅ **CRUD completo**: Create, Read, Update, Delete
- ✅ **Contact management**: Múltiples contactos por proveedor
- ✅ **Financial info**: Términos de pago, crédito, cuentas bancarias
- ✅ **Purchase history**: Historial de compras y evaluación
- ✅ **Document management**: Contratos, certificados, documentos fiscales
- ✅ **Rating system**: Evaluación de desempeño
- ✅ **Status tracking**: Active/Inactive, preferred suppliers

### Supplier Data Fields
- **Información básica**: Nombre comercial, razón social, RUC/Tax ID
- **Contacto**: Persona de contacto, email, teléfono, dirección
- **Información fiscal**: RUC, condición tributaria, categoría
- **Términos comerciales**: Condiciones de pago, descuentos, moneda
- **Información bancaria**: Cuentas, SWIFT, datos de transferencia
- **Evaluación**: Rating, notas, historial de desempeño
- **Estado**: Activo/Inactivo, proveedor preferido

## 🔧 Technical Implementation

### Core Hook: `useSuppliers`

```typescript
interface UseSuppliersReturn {
  // State Management
  suppliers: SupplierEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedSupplier: SupplierEntity | null;
  
  // Filtering & Search
  searchTerm: string;
  statusFilter: string;
  ratingFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setRatingFilter: (rating: string) => void;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadSuppliers: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (supplier: SupplierEntity) => void;
  handleView: (supplier: SupplierEntity) => void;
  handleDelete: (supplier: SupplierEntity) => Promise<void>;
  handleToggleStatus: (supplier: SupplierEntity) => Promise<void>;
  handleTogglePreferred: (supplier: SupplierEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: SupplierFormData) => Promise<void>;
  
  // Business Logic
  generatePurchaseReport: (supplierId: string) => Promise<void>;
  evaluateSupplier: (supplierId: string, rating: number, notes: string) => Promise<void>;
}
```

### Data Flow
1. **Module initialization** → Load suppliers with business context
2. **Search & filtering** → Real-time supplier discovery
3. **Supplier evaluation** → Performance tracking and rating
4. **Purchase integration** → Link with purchase orders
5. **Document management** → File uploads and organization

## 📱 User Interface Components

### SupplierTable
- **Comprehensive DataGrid** con columnas: Name, Contact, Tax ID, Status, Rating, Created, Actions
- **Advanced search**: Por nombre, contacto, tax ID
- **Status indicators**: Active/Inactive, Preferred supplier badges
- **Rating display**: Star rating system
- **Quick actions**: Toggle status, view purchases, contact
- **Export capabilities**: Supplier list, contact info

### SupplierForm
- **Multi-tab interface**:
  - **General Info**: Basic company information
  - **Contact Details**: Contact persons and information
  - **Financial Info**: Payment terms, banking details
  - **Documents**: File uploads and document management
  - **Evaluation**: Rating, notes, performance metrics
- **Dynamic validation**: Different rules per country/region
- **Address autocomplete**: Integration with maps API
- **Tax ID validation**: Real-time fiscal validation
- **Contact management**: Multiple contacts per supplier

### SupplierDialog
- **Responsive modal** adaptable a diferentes tamaños
- **Action buttons**: Context-aware based on supplier status
- **Quick view**: Essential info at a glance
- **Related data**: Purchase history, pending orders
- **Communication log**: Interaction history

## 🔄 State Management

### Supplier Classification
```typescript
interface SupplierCategories {
  type: 'goods' | 'services' | 'both';
  priority: 'strategic' | 'preferred' | 'standard' | 'backup';
  riskLevel: 'low' | 'medium' | 'high';
  paymentTerms: 'cash' | 'credit' | 'credit_card' | 'bank_transfer';
}
```

### Supplier Validation
```typescript
interface SupplierFormData {
  // Basic Information
  name: string;                    // Required, business name
  legalName?: string;             // Optional, legal entity name
  taxId: string;                  // Required, unique business tax ID
  
  // Contact Information
  contactName?: string;           // Primary contact person
  email?: string;                 // Valid email format
  phone?: string;                 // Phone with country code
  address?: string;               // Complete address
  website?: string;               // Company website URL
  
  // Business Terms
  paymentTerms?: string;          // Net 30, Net 60, etc.
  currency?: string;              // Preferred currency
  creditLimit?: number;           // Maximum credit allowed
  discount?: number;              // Standard discount percentage
  
  // Internal Management
  isActive: boolean;              // Required, default true
  isPreferred: boolean;           // Preferred supplier flag
  rating?: number;                // 1-5 star rating
  notes?: string;                 // Internal notes
  
  // Documents & Compliance
  documents?: SupplierDocument[]; // Uploaded documents
  certifications?: string[];      // Certifications held
  
  // Financial Information
  bankDetails?: BankDetails;      // Banking information
  taxCategory?: string;           // Tax category/regime
}
```

## 🔌 Backend Integration

### Service Layer: `supplierService`

#### API Endpoints
- **GET** `/suppliers` - Lista paginada con filtros
- **GET** `/suppliers/:id` - Proveedor específico con detalles
- **GET** `/suppliers/:id/purchases` - Historial de compras
- **GET** `/suppliers/:id/documents` - Documentos del proveedor
- **POST** `/suppliers` - Crear nuevo proveedor
- **PUT** `/suppliers/:id` - Actualizar proveedor existente
- **PATCH** `/suppliers/:id/status` - Toggle active/inactive
- **PATCH** `/suppliers/:id/rating` - Actualizar calificación
- **DELETE** `/suppliers/:id` - Soft delete
- **POST** `/suppliers/:id/documents` - Upload documents

#### Advanced Features
- **Duplicate detection** por tax ID y nombre
- **Performance analytics** automáticas
- **Payment term tracking** y alertas
- **Document expiration** notifications
- **Purchase pattern** analysis

## 🎨 Design Patterns

### Supplier Evaluation System
```typescript
interface SupplierEvaluation {
  deliveryScore: number;          // 1-5, on-time delivery
  qualityScore: number;           // 1-5, product/service quality
  serviceScore: number;           // 1-5, customer service
  priceCompetitiveness: number;   // 1-5, price comparison
  overallRating: number;          // Calculated average
  
  // Performance Metrics
  onTimeDeliveryRate: number;     // Percentage
  defectRate: number;             // Quality issues percentage
  responseTime: number;           // Average response in hours
  
  // Historical Data
  evaluations: EvaluationHistory[];
  lastEvaluated: string;
  evaluatedBy: string;
}
```

### Smart Supplier Recommendations
```typescript
const useSupplierRecommendations = (productCategory: string) => {
  const [recommendations, setRecommendations] = useState<SupplierEntity[]>([]);
  
  useEffect(() => {
    // Algorithm based on:
    // 1. Product category match
    // 2. Historical performance
    // 3. Current capacity
    // 4. Geographic proximity
    // 5. Price competitiveness
    generateRecommendations(productCategory);
  }, [productCategory]);
  
  return recommendations;
};
```

## 🚀 Performance Features

### Advanced Analytics
- **Spend analysis** por proveedor y categoría
- **Delivery performance** tracking
- **Quality metrics** monitoring
- **Cost savings** identification
- **Risk assessment** automático

### Automated Workflows
- **New supplier onboarding** checklist
- **Document expiration** alerts
- **Performance review** scheduling
- **Payment reminder** system
- **Contract renewal** notifications

## 📊 Business Intelligence

### Supplier Analytics Dashboard
```typescript
interface SupplierAnalytics {
  // Financial Metrics
  totalSpend: number;
  averageOrderValue: number;
  paymentTermsCompliance: number;
  costSavings: number;
  
  // Operational Metrics
  onTimeDeliveryRate: number;
  qualityScore: number;
  leadTimeAverage: number;
  orderAccuracy: number;
  
  // Strategic Metrics
  supplierDiversity: number;
  riskDistribution: RiskAnalysis;
  dependencyFactors: DependencyMetrics;
  
  // Trend Analysis
  performanceTrends: TrendData[];
  spendTrends: SpendAnalysis[];
  riskTrends: RiskTrendData[];
}
```

### Reporting Features
- **Supplier scorecards** automáticos
- **Spend analysis** por categoría y período
- **Performance benchmarking** entre proveedores
- **Risk assessment** reports
- **Compliance status** tracking

## 🔐 Security & Compliance

### Document Management
- **Secure file upload** con virus scanning
- **Document versioning** y control de cambios
- **Access control** por rol y proveedor
- **Audit trail** completo
- **Retention policies** automáticas

### Data Protection
- **PII protection** para datos de contacto
- **Financial data** encryption
- **GDPR compliance** para datos europeos
- **Access logging** y monitoring
- **Data backup** y recovery

## 🧪 Testing Strategy

### Integration Tests
```typescript
describe('Supplier Management', () => {
  test('should create supplier with complete workflow', async () => {
    const supplier = await createSupplier(mockSupplierData);
    expect(supplier.id).toBeDefined();
    
    // Test document upload
    const document = await uploadDocument(supplier.id, mockDocument);
    expect(document.status).toBe('uploaded');
    
    // Test evaluation
    const evaluation = await evaluateSupplier(supplier.id, 4.5, 'Excellent service');
    expect(evaluation.overallRating).toBe(4.5);
  });
});
```

### Performance Tests
- **Large supplier list** rendering (500+ suppliers)
- **Document upload** performance
- **Search and filtering** response times
- **Analytics calculation** speed
- **Concurrent user** access

## 📈 Future Enhancements

### Planned Features
- **AI-powered supplier discovery** y matching
- **Blockchain integration** para supply chain transparency
- **IoT integration** para real-time tracking
- **Predictive analytics** para supplier risk
- **Automated contract management**
- **EDI integration** para órdenes automáticas
- **Supplier portal** para self-service
- **Mobile app** para supplier communication

### Advanced Integrations
- **ERP systems** synchronization
- **Banking APIs** para payment automation
- **Government databases** para compliance checking
- **Credit rating** services integration
- **Market intelligence** platforms
- **Sustainability tracking** y reporting

## 🔗 Integration Points

### Internal Modules
- **Purchases module** → Supplier selection y evaluation
- **Inventory module** → Stock levels y reorder points
- **Accounting module** → Payment terms y financial tracking
- **Reports module** → Supplier analytics y KPIs

### External Services
- **Tax validation** APIs
- **Credit checking** services
- **Bank verification** systems
- **Document signing** platforms
- **Communication** tools (email, SMS)
- **Maps and logistics** APIs

---

*Esta documentación refleja las mejores prácticas en gestión de proveedores. Última actualización: ${new Date().toLocaleDateString()}*
