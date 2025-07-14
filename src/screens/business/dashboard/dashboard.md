# Dashboard Module Documentation

## 📋 Overview

El módulo de Dashboard es el centro de control del sistema de administración de negocios. Proporciona una vista consolidada de métricas clave, análisis en tiempo real y actividad reciente del negocio. Es la primera pantalla que ven los usuarios al autenticarse y sirve como punto de navegación principal hacia otros módulos.

## 🏗️ Module Structure

```
src/screens/business/dashboard/
├── components/
│   ├── StatsCard.tsx             # Tarjeta de estadística individual
│   ├── StatsGrid.tsx             # Grid de tarjetas principales
│   ├── QuickInsightsCard.tsx     # Tarjeta de insights rápidos
│   ├── RecentActivityCard.tsx    # Tarjeta de actividad reciente
│   └── index.ts                  # Barrel exports
├── hooks/
│   ├── useDashboard.tsx          # Hook principal del módulo
│   └── index.ts                  # Barrel exports
├── types/
│   ├── DashboardTypes.ts         # Tipos para el dashboard
│   └── index.ts                  # Barrel exports
├── DashboardScreen.tsx           # Pantalla principal
├── index.ts                      # Barrel exports del módulo
└── README.md                     # Esta documentación
```

## 🎯 Main Functionality

### Dashboard Overview
- ✅ **Real-time metrics**: KPIs actualizados automáticamente
- ✅ **Business health monitoring**: Alertas y estado general
- ✅ **Quick navigation**: Acceso rápido a módulos específicos
- ✅ **Activity tracking**: Feed de actividad reciente
- ✅ **Performance insights**: Análisis de tendencias y métricas
- ✅ **Visual indicators**: Gráficos y chips con códigos de color
- ✅ **Auto-refresh**: Actualización automática cada 5 minutos
- ✅ **Responsive design**: Adaptado para móviles y tablets

### Key Metrics Displayed
- **Revenue metrics**: Ingresos totales, crecimiento mensual
- **Customer analytics**: Total de clientes, clientes activos, retención
- **Product insights**: Total de productos, alertas de stock bajo
- **Growth indicators**: Tendencias de crecimiento y KPIs
- **Operational metrics**: Rotación de inventario, valor promedio de órdenes

## 🔧 Technical Implementation

### Core Hook: `useDashboard`

```typescript
interface UseDashboardReturn {
  // State Management
  stats: DashboardStats;
  quickInsights: QuickInsight[];
  recentActivity: RecentActivity[];
  loading: boolean;
  filters: DashboardFilters;
  lastRefresh: Date | null;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  refresh: (options?: DashboardRefreshOptions) => void;
  updateFilters: (filters: Partial<DashboardFilters>) => void;
  formatCurrency: (amount: number) => string;
  
  // Computed Properties
  hasLowStock: boolean;
  isHealthy: boolean;
}
```

### Data Flow
1. **Module initialization** → Load aggregated data from all modules
2. **Automatic refresh** → Update data every 5 minutes
3. **Real-time calculations** → Process metrics and insights
4. **User interactions** → Navigate to specific modules
5. **Health monitoring** → Display alerts and recommendations

## 📱 User Interface Components

### StatsGrid
- **Main KPI cards** con métricas esenciales del negocio
- **Clickable navigation** hacia módulos específicos
- **Color-coded indicators** para estado visual rápido
- **Loading states** durante actualizaciones
- **Responsive layout** que se adapta a diferentes pantallas

### StatsCard
- **Individual metric display** con valor principal
- **Supporting metrics** como subtítulos y contexto
- **Interactive elements** para navegación
- **Visual hierarchy** con iconos y colores temáticos
- **Loading animations** para feedback visual

### QuickInsightsCard
- **Key business insights** presentados como chips
- **Performance indicators** con códigos de color
- **Contextual descriptions** para mejor comprensión
- **Trend analysis** con comparaciones históricas

### RecentActivityCard
- **Activity feed** con eventos recientes del sistema
- **Categorized activities** por tipo (ventas, clientes, inventario)
- **Timestamp display** con formato relativo ("2 hours ago")
- **Visual categorization** con iconos y colores

## 🔄 State Management

### Dashboard Statistics
```typescript
interface DashboardStats {
  totalCustomers: number;          // Total customers in system
  activeCustomers: number;         // Currently active customers
  totalProducts: number;           // Total products in catalog
  lowStockProducts: number;        // Products below min stock
  totalRevenue: number;           // Total revenue (current period)
  monthlyGrowth: number;          // Growth percentage vs last month
  averageOrderValue: number;      // Average sale amount
  customerRetentionRate: number;  // Customer retention percentage
  inventoryTurnover: number;      // Inventory turnover rate
}
```

### Activity Tracking
```typescript
interface RecentActivity {
  id: string;                     // Unique activity identifier
  type: 'order' | 'customer' | 'inventory' | 'payment' | 'alert';
  message: string;                // Human-readable description
  timestamp: Date;                // When the activity occurred
  icon: string;                   // Icon identifier for display
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}
```

## 🔌 Backend Integration

### Data Sources
El dashboard agrega información de múltiples servicios:

- **customerService** → Customer metrics y actividad
- **productService** → Product catalog y stock levels
- **saleService** → Revenue metrics y sale activities
- **purchaseService** → Purchase activities y cost analysis
- **inventoryService** → Stock levels y turnover metrics

### Real-time Updates
```typescript
// Auto-refresh mechanism
useEffect(() => {
  const interval = setInterval(() => {
    calculateStats();
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(interval);
}, [calculateStats]);
```

### Performance Optimization
- **Parallel data loading** para reducir tiempo de carga
- **Cached calculations** para métricas complejas
- **Debounced updates** para evitar renders excesivos
- **Lazy loading** de datos no críticos

## 🎨 Design Patterns

### Modular Component Architecture
```typescript
// Separación clara de responsabilidades
const DashboardScreen = () => {
  const dashboardData = useDashboard();
  
  return (
    <ScreenContainer>
      <StatsGrid {...dashboardData.stats} />
      <QuickInsightsCard insights={dashboardData.insights} />
      <RecentActivityCard activities={dashboardData.activities} />
    </ScreenContainer>
  );
};
```

### Smart Navigation
```typescript
const handleCardClick = (cardType: string) => {
  switch (cardType) {
    case 'revenue':
    case 'growth':
      navigate('/sales');
      break;
    case 'customers':
      navigate('/customers');
      break;
    case 'products':
      navigate('/products');
      break;
  }
};
```

## 🚀 Performance Features

### Optimization Strategies
- **Memoized calculations** para métricas costosas
- **Virtual rendering** para listas de actividad largas
- **Progressive loading** de datos secundarios
- **Background sync** para mantener datos actualizados
- **Intelligent caching** con invalidación basada en eventos

### Responsive Design
- **Mobile-first** approach con breakpoints adaptativos
- **Touch-friendly** interfaces para dispositivos táctiles
- **Flexible grids** que se reorganizan según el espacio
- **Optimized images** y assets para diferentes densidades

## 📊 Analytics & Monitoring

### Business Intelligence
```typescript
interface BusinessMetrics {
  // Financial Health
  revenueGrowth: number;
  profitMargin: number;
  cashFlow: number;
  
  // Operational Efficiency  
  inventoryTurnover: number;
  orderFulfillmentTime: number;
  customerSatisfaction: number;
  
  // Growth Indicators
  customerAcquisition: number;
  marketPenetration: number;
  productPerformance: ProductMetric[];
}
```

### Health Monitoring
```typescript
const assessBusinessHealth = (stats: DashboardStats): HealthStatus => {
  const indicators = {
    growth: stats.monthlyGrowth > 0,
    retention: stats.customerRetentionRate > 85,
    inventory: stats.lowStockProducts < stats.totalProducts * 0.1,
    revenue: stats.totalRevenue > 0
  };
  
  return {
    overall: Object.values(indicators).every(Boolean),
    details: indicators,
    recommendations: generateRecommendations(indicators)
  };
};
```

## 🔐 Security & Access Control

### Data Protection
- **Role-based visibility** de métricas sensibles
- **Aggregated data only** sin detalles específicos
- **Audit trail** para accesos al dashboard
- **Secure API calls** con autenticación

### Privacy Considerations
- **Anonymized analytics** cuando sea apropiado
- **Configurable visibility** de diferentes métricas
- **Compliance tracking** para regulaciones

## 🧪 Testing Strategy

### Component Testing
```typescript
describe('Dashboard Components', () => {
  test('StatsCard displays correct metrics', () => {
    render(<StatsCard title="Revenue" value="$1,000" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });
  
  test('Dashboard handles loading states', () => {
    const { rerender } = render(<DashboardScreen />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
```

### Integration Testing
- **End-to-end workflows** desde dashboard hasta módulos específicos
- **Data consistency** entre diferentes vistas
- **Performance testing** con grandes volúmenes de datos
- **Real-time update** testing

## 📈 Future Enhancements

### Advanced Analytics
- **Predictive analytics** con machine learning
- **Custom dashboard** creation por usuario
- **Advanced filtering** y segmentación de datos
- **Export capabilities** para reportes

### Interactive Features
- **Drill-down capabilities** desde métricas generales a detalles
- **Time-series analysis** con gráficos interactivos
- **Comparative analysis** entre períodos
- **Goal tracking** y milestone monitoring

### Personalization
- **Customizable widgets** según rol de usuario
- **Personalized alerts** y notificaciones
- **Favorite metrics** y quick access
- **Theme customization** y layout preferences

## 🔗 Integration Points

### Internal Module Integration
- **Seamless navigation** hacia módulos específicos
- **Context preservation** al navegar entre pantallas
- **Shared state management** para datos comunes
- **Unified search** across all modules

### External Services
- **Business intelligence** platforms integration
- **Accounting system** synchronization
- **CRM integration** para customer insights
- **Analytics platforms** como Google Analytics

## 📚 Usage Examples

### Basic Dashboard Usage
```typescript
import { DashboardScreen } from '@/screens/business/dashboard';

// En tu routing
<Route path="/" element={<DashboardScreen />} />
```

### Custom Dashboard Hook
```typescript
const CustomDashboard = () => {
  const {
    stats,
    loading,
    refresh,
    formatCurrency
  } = useDashboard();
  
  // Custom dashboard implementation
  return (
    <CustomLayout>
      <MetricCard value={formatCurrency(stats.totalRevenue)} />
      <RefreshButton onClick={() => refresh({ force: true })} />
    </CustomLayout>
  );
};
```

### Programmatic Navigation
```typescript
const { navigate } = useNavigate();

// Navigate to specific modules from dashboard metrics
const handleRevenueClick = () => {
  navigate('/sales', { 
    state: { 
      filter: 'completed',
      dateRange: 'current_month' 
    } 
  });
};
```

---

*Este dashboard proporciona una vista integral del estado del negocio y actúa como centro de comando para todas las operaciones. Última actualización: ${new Date().toLocaleDateString()}*
