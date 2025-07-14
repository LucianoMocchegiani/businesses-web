# Settings Module Documentation

## 📋 Overview

El módulo de Settings (Configuración) centraliza todas las opciones de configuración del negocio. Permite personalizar la aplicación, gestionar usuarios, configurar integrations, establecer políticas de negocio y administrar preferencias del sistema para optimizar la operación diaria.

## 🏗️ Module Structure

```
src/screens/business/settings/
├── components/
│   ├── SettingsNavigation.tsx    # Navegación lateral de configuraciones
│   ├── GeneralSettings.tsx       # Configuraciones generales
│   ├── UserManagement.tsx        # Gestión de usuarios y roles
│   ├── BusinessProfile.tsx       # Perfil del negocio
│   ├── IntegrationSettings.tsx   # Configuración de integraciones
│   ├── SecuritySettings.tsx      # Configuraciones de seguridad
│   ├── NotificationSettings.tsx  # Preferencias de notificaciones
│   ├── TaxSettings.tsx           # Configuración de impuestos
│   ├── PaymentSettings.tsx       # Métodos de pago
│   ├── InventorySettings.tsx     # Configuraciones de inventario
│   ├── ReportsSettings.tsx       # Configuraciones de reportes
│   └── index.ts                  # Barrel exports
├── hooks/
│   ├── useSettings.tsx           # Hook principal del módulo
│   ├── useUserManagement.tsx     # Hook para usuarios
│   ├── useBusinessProfile.tsx    # Hook para perfil del negocio
│   └── index.ts                  # Barrel exports
├── types/
│   ├── SettingsTypes.ts          # Tipos de configuraciones
│   ├── UserTypes.ts              # Tipos de usuarios y roles
│   ├── BusinessTypes.ts          # Tipos del perfil de negocio
│   └── index.ts                  # Barrel exports
├── SettingsScreen.tsx            # Pantalla principal
├── index.ts                      # Barrel exports del módulo
└── README.md                     # Esta documentación
```

## 🎯 Main Functionality

### Settings Categories

#### 🏢 Business Profile
- ✅ **Company information**: Nombre, dirección, contacto, logo
- ✅ **Legal details**: RUC/Tax ID, categoría fiscal, registros
- ✅ **Business hours**: Horarios de operación y días laborables
- ✅ **Currency settings**: Moneda principal y tasas de cambio
- ✅ **Language preferences**: Idioma del sistema y formatos

#### 👥 User Management
- ✅ **User accounts**: Crear, editar, activar/desactivar usuarios
- ✅ **Role management**: Roles predefinidos y permisos personalizados
- ✅ **Access control**: Restricciones por módulo y funcionalidad
- ✅ **Password policies**: Reglas de seguridad y expiración
- ✅ **Session management**: Timeout y múltiples sesiones

#### 🔧 System Configuration
- ✅ **General preferences**: Timezone, date formats, number formats
- ✅ **UI customization**: Tema, colores, layout preferences
- ✅ **Feature toggles**: Activar/desactivar funcionalidades
- ✅ **Data retention**: Políticas de respaldo y archivado
- ✅ **Performance settings**: Cache, sync intervals

#### 💰 Financial Settings
- ✅ **Tax configuration**: Tipos de impuestos, tasas, exenciones
- ✅ **Payment methods**: Configurar métodos de pago disponibles
- ✅ **Pricing rules**: Políticas de descuentos y promociones
- ✅ **Currency handling**: Monedas aceptadas y conversiones
- ✅ **Accounting integration**: Conexión con sistemas contables

#### 📦 Inventory Configuration
- ✅ **Stock policies**: Niveles mínimos, alertas, reorden automático
- ✅ **Valuation methods**: FIFO, LIFO, Average Cost
- ✅ **Location management**: Configurar almacenes y ubicaciones
- ✅ **Barcode settings**: Formatos y generación automática
- ✅ **Lot tracking**: Configurar trazabilidad por lotes

#### 🔔 Notifications
- ✅ **Alert preferences**: Email, SMS, push notifications
- ✅ **Event subscriptions**: Qué eventos generar notificaciones
- ✅ **Escalation rules**: Notificaciones automáticas por urgencia
- ✅ **Delivery methods**: Configurar canales de comunicación
- ✅ **Quiet hours**: Horarios sin notificaciones

### Settings Data Structure
```typescript
interface BusinessSettings {
  // General
  businessName: string;
  taxId: string;
  address: AddressEntity;
  contactInfo: ContactEntity;
  currency: string;
  timezone: string;
  language: string;
  
  // Financial
  taxSettings: TaxConfiguration;
  paymentMethods: PaymentMethodConfig[];
  pricingRules: PricingRuleConfig[];
  
  // Inventory
  inventoryConfig: InventoryConfiguration;
  stockPolicies: StockPolicyConfig;
  
  // Users & Security
  userRoles: UserRole[];
  securityPolicies: SecurityPolicyConfig;
  
  // Notifications
  notificationPreferences: NotificationConfig;
  
  // Integrations
  integrations: IntegrationConfig[];
  
  // UI/UX
  uiPreferences: UIPreferencesConfig;
}
```

## 🔧 Technical Implementation

### Core Hook: `useSettings`

```typescript
interface UseSettingsReturn {
  // State Management
  settings: BusinessSettings;
  loading: boolean;
  saving: boolean;
  activeSection: SettingsSection;
  hasUnsavedChanges: boolean;
  
  // Navigation
  setActiveSection: (section: SettingsSection) => void;
  navigateToSection: (section: SettingsSection) => void;
  
  // User Feedback
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertSeverity) => void;
  hideSnackbar: () => void;
  
  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: <T extends keyof BusinessSettings>(
    section: T,
    data: Partial<BusinessSettings[T]>
  ) => Promise<void>;
  resetSection: (section: SettingsSection) => void;
  exportSettings: () => Promise<void>;
  importSettings: (file: File) => Promise<void>;
  validateSettings: () => Promise<ValidationResult>;
  
  // Business Logic
  testIntegration: (integrationId: string) => Promise<TestResult>;
  generateBackup: () => Promise<string>;
  restoreBackup: (backupData: string) => Promise<void>;
  auditTrail: (section?: SettingsSection) => Promise<AuditEntry[]>;
}
```

### User Management Hook: `useUserManagement`

```typescript
interface UseUserManagementReturn {
  users: UserEntity[];
  roles: UserRole[];
  permissions: Permission[];
  loading: boolean;
  
  // User Actions
  createUser: (userData: CreateUserData) => Promise<UserEntity>;
  updateUser: (userId: string, userData: UpdateUserData) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  resetPassword: (userId: string) => Promise<void>;
  
  // Role Management
  createRole: (roleData: CreateRoleData) => Promise<UserRole>;
  updateRole: (roleId: string, roleData: UpdateRoleData) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  assignRole: (userId: string, roleId: string) => Promise<void>;
  
  // Permission Management
  updatePermissions: (roleId: string, permissions: string[]) => Promise<void>;
  checkPermission: (userId: string, permission: string) => boolean;
}
```

### Data Flow
1. **Settings loading** → Fetch all configuration categories
2. **Section navigation** → Load specific setting groups
3. **Real-time validation** → Validate changes before saving
4. **Batch updates** → Save multiple changes together
5. **Audit tracking** → Log all configuration changes

## 📱 User Interface Components

### SettingsNavigation
- **Sidebar navigation** con categorías de configuración
- **Progress indicators** para configuraciones incompletas
- **Search functionality** para encontrar configuraciones específicas
- **Favorites** para acceso rápido a configuraciones frecuentes
- **Collapsible sections** para mejor organización

### GeneralSettings
- **Company profile** con upload de logo
- **Business hours** con horarios flexibles
- **Regional settings** (timezone, currency, language)
- **Contact information** management
- **Legal information** y registros

### UserManagement
- **User table** con roles y estado
- **Role editor** con permissions matrix
- **User creation wizard** con validación
- **Bulk operations** para múltiples usuarios
- **Activity tracking** por usuario

### SecuritySettings
- **Password policies** configuration
- **Two-factor authentication** setup
- **Session management** rules
- **API key management** para integrations
- **Audit log** viewer

## 🔄 State Management

### Settings Sections
```typescript
enum SettingsSection {
  GENERAL = 'general',
  BUSINESS_PROFILE = 'business_profile',
  USERS = 'users',
  SECURITY = 'security',
  NOTIFICATIONS = 'notifications',
  TAX = 'tax',
  PAYMENTS = 'payments',
  INVENTORY = 'inventory',
  INTEGRATIONS = 'integrations',
  REPORTS = 'reports',
  ADVANCED = 'advanced'
}
```

### User Roles & Permissions
```typescript
interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;  // No se puede eliminar
  isActive: boolean;
}

interface Permission {
  id: string;
  module: string;     // customers, products, sales, etc.
  action: string;     // create, read, update, delete, export
  description: string;
}
```

### Configuration Validation
```typescript
interface ValidationRule {
  field: string;
  rules: ValidationRuleType[];
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
```

## 🔌 Backend Integration

### Service Layer: `settingsService`

#### API Endpoints
- **GET** `/settings` - All business settings
- **GET** `/settings/:section` - Specific section settings
- **PUT** `/settings/:section` - Update section settings
- **POST** `/settings/test/:integration` - Test integration
- **GET** `/settings/audit` - Audit trail
- **POST** `/settings/backup` - Generate backup
- **POST** `/settings/restore` - Restore from backup
- **GET** `/users` - User management
- **POST** `/users` - Create user
- **PUT** `/users/:id` - Update user
- **GET** `/roles` - Available roles
- **POST** `/roles` - Create role

#### Security Features
- **Encrypted sensitive data** (API keys, passwords)
- **Audit trail** para compliance
- **Role-based access** para settings modification
- **Change approval** workflow para critical settings
- **Backup and recovery** capabilities

## 🎨 Design Patterns

### Settings Persistence
```typescript
const useSettingsPersistence = () => {
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, any>>({});
  
  const updateSetting = (section: string, key: string, value: any) => {
    setUnsavedChanges(prev => ({
      ...prev,
      [`${section}.${key}`]: value
    }));
  };
  
  const saveChanges = async () => {
    const groupedChanges = groupChangesBySection(unsavedChanges);
    await Promise.all(
      Object.entries(groupedChanges).map(([section, changes]) =>
        settingsService.updateSection(section, changes)
      )
    );
    setUnsavedChanges({});
  };
  
  return { unsavedChanges, updateSetting, saveChanges };
};
```

### Configuration Validation
```typescript
const useSettingsValidation = () => {
  const validateSection = async (section: SettingsSection, data: any) => {
    const rules = getValidationRules(section);
    const errors: ValidationError[] = [];
    
    for (const rule of rules) {
      const isValid = await validateRule(rule, data);
      if (!isValid) {
        errors.push(createValidationError(rule));
      }
    }
    
    return { isValid: errors.length === 0, errors };
  };
  
  return { validateSection };
};
```

## 🚀 Performance Features

### Optimizations
- **Lazy loading** de settings sections
- **Debounced saving** para avoid frequent API calls
- **Cached settings** con invalidation strategy
- **Optimistic updates** para better UX
- **Background validation** para real-time feedback

### Memory Management
- **Section-based loading** to avoid loading all settings
- **Setting cleanup** on component unmount
- **Efficient caching** strategy
- **Memory leak prevention** en form handling

## 🔐 Security Considerations

### Access Control
```typescript
interface SecurityPolicy {
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorRequired: boolean;
  ipWhitelist: string[];
}
```

### Audit Trail
- **Configuration changes** tracking
- **User action** logging
- **Security events** monitoring
- **Data access** logs
- **System events** recording

### Data Protection
- **Encryption** de sensitive settings
- **Access logs** para compliance
- **Data anonymization** capabilities
- **GDPR compliance** features

## 🧮 Business Logic

### Tax Configuration
```typescript
interface TaxConfiguration {
  defaultTaxRate: number;
  taxTypes: TaxType[];
  exemptCategories: string[];
  taxInclusivePricing: boolean;
  autoCalculation: boolean;
}

interface TaxType {
  id: string;
  name: string;      // IVA, Sales Tax, etc.
  rate: number;
  isActive: boolean;
  applicableCategories: string[];
}
```

### Inventory Policies
```typescript
interface InventoryConfiguration {
  valuationMethod: 'FIFO' | 'LIFO' | 'AVERAGE';
  lowStockThreshold: number;
  autoReorderEnabled: boolean;
  negativeStockAllowed: boolean;
  lotTrackingEnabled: boolean;
  serialNumberTracking: boolean;
}
```

## 📊 Configuration Analytics

### Settings Usage Tracking
- **Most used settings** identification
- **Configuration completeness** scoring
- **User adoption** metrics
- **Performance impact** analysis
- **Error rate** tracking per setting

### Recommendations
- **Best practices** suggestions
- **Optimization opportunities** identification
- **Security improvements** recommendations
- **Integration suggestions** based on usage

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Settings Service', () => {
  test('should validate tax configuration', () => {
    const config = { defaultTaxRate: 0.21, taxTypes: [] };
    expect(validateTaxConfig(config)).toBe(true);
  });
  
  test('should encrypt sensitive settings', () => {
    const apiKey = 'sensitive-api-key';
    const encrypted = encryptSetting(apiKey);
    expect(encrypted).not.toBe(apiKey);
    expect(decryptSetting(encrypted)).toBe(apiKey);
  });
});
```

### Integration Tests
- **Settings persistence** across sessions
- **User permission** enforcement
- **Integration testing** workflows
- **Backup/restore** functionality
- **Audit trail** accuracy

## 📈 Future Enhancements

### Planned Features
- **AI-powered recommendations** para optimal settings
- **Configuration templates** para different business types
- **Multi-tenant support** para franchise operations
- **Advanced workflow** automation
- **External config** management integration
- **Mobile app** settings synchronization
- **Voice commands** para accessibility

### Advanced Configuration
- **Dynamic settings** que change based on context
- **A/B testing** para UI preferences
- **Machine learning** para automatic optimization
- **Predictive configuration** based on business patterns
- **Compliance automation** para regulatory requirements

## 🔗 Integration Points

### Internal Modules
- **All business modules** → Configuration consumption
- **User auth** → Role and permission enforcement
- **Reports module** → Configuration-based reporting
- **Audit module** → Change tracking
- **Backup module** → Configuration backup

### External Services
- **Tax services** → Tax rate updates
- **Payment gateways** → Payment method configuration
- **Email services** → Notification delivery
- **SMS providers** → Alert delivery
- **Accounting systems** → Financial settings sync
- **ERP systems** → Master data configuration

## 📚 Usage Examples

### Basic Settings Operations
```typescript
// Load all settings
const { settings, updateSettings } = useSettings();

// Update business profile
await updateSettings('businessProfile', {
  businessName: 'Mi Empresa S.A.',
  taxId: '20-12345678-9',
  currency: 'ARS'
});

// Create new user
const { createUser } = useUserManagement();
await createUser({
  name: 'Juan Pérez',
  email: 'juan@miempresa.com',
  roleId: 'sales-manager',
  isActive: true
});
```

### Advanced Configuration
```typescript
// Configure tax settings
await updateSettings('tax', {
  defaultTaxRate: 0.21,
  taxInclusivePricing: false,
  taxTypes: [
    { name: 'IVA', rate: 0.21, applicableCategories: ['general'] },
    { name: 'IVA Reducido', rate: 0.105, applicableCategories: ['food'] }
  ]
});

// Setup integration
await settingsService.configureIntegration('email', {
  provider: 'sendgrid',
  apiKey: 'encrypted-api-key',
  fromEmail: 'no-reply@miempresa.com'
});
```

---

*Esta documentación centraliza toda la gestión de configuración del sistema. Última actualización: ${new Date().toLocaleDateString()}*
