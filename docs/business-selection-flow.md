# Flujo de Usuario en el Frontend - Business Admin

## 📋 Overview del Flujo Principal

El usuario después del registro/login tiene dos caminos principales:
1. **Crear su propio negocio** (es dueño/admin)
2. **Acceder a negocios existentes** donde le han asignado perfiles

## 🚀 Flujo Detallado

### 1. Registro/Login Completado
- Usuario ingresa credenciales exitosamente
- AuthContext tiene la información del usuario
- Redirección automática a **ProfilesScreen** (renombrada a **BusinessSelectionScreen**)

### 2. Business Selection Screen (antes ProfilesScreen)

#### Caso A: Usuario SIN perfiles asignados
```
┌─────────────────────────────────────────┐
│          ¡Bienvenido al Sistema!        │
│                                         │
│  👤 Hola, [Nombre del Usuario]          │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │     💼 Crear Mi Negocio             │ │
│  │                                     │ │
│  │  Inicia tu propio negocio desde     │ │
│  │  cero con control total             │ │
│  │                                     │ │
│  │     [Crear Negocio] ➜              │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │     👥 Buscar Negocios              │ │
│  │                                     │ │
│  │  ¿Te invitaron a un negocio?       │ │
│  │  Busca por código de invitación    │ │
│  │                                     │ │
│  │     [Buscar] ➜                     │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Caso B: Usuario CON perfiles asignados
```
┌─────────────────────────────────────────┐
│       Selecciona un Negocio             │
│                                         │
│  📋 Negocios donde tienes acceso:       │
│                                         │
│  ┌───────┐ ┌───────┐ ┌───────┐         │
│  │ 🏪    │ │ 🏭    │ │ 🏢    │         │
│  │RestauB│ │FabriXY│ │OficiZ │         │
│  │Mesero │ │Operadr│ │Contadr│         │
│  │ [►]   │ │ [►]   │ │ [►]   │         │
│  └───────┘ └───────┘ └───────┘         │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ ➕ ¿Quieres crear tu negocio?       │ │
│  │    [Crear Mi Negocio]               │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 3. Crear Negocio Flow

#### 3.1 Business Creation Dialog
```
┌─────────────────────────────────────────┐
│          Crear Nuevo Negocio            │
│                                         │
│  📝 Información del Negocio:            │
│  ┌─────────────────────────────────────┐ │
│  │ Nombre: [________________]          │ │
│  │ Tipo:   [Restaurante ▼]            │ │
│  │ Email:  [________________]          │ │
│  │ Tel:    [________________]          │ │
│  │ Dir:    [________________]          │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  👤 Tu Perfil como Administrador:       │
│  ┌─────────────────────────────────────┐ │
│  │ Nombre Perfil: [Admin Principal]    │ │
│  │ ✅ Todos los permisos habilitados   │ │
│  └─────────────────────────────────────┘ │
│                                         │
│         [Cancelar] [Crear Negocio]      │
└─────────────────────────────────────────┘
```

#### 3.2 Success & Auto-Navigation
- Se crea el Business en el backend
- Se crea el Profile del usuario como Admin con todos los permisos
- Se hace auto-login al negocio recién creado
- Redirección al Dashboard del negocio

### 4. Profile Selection Flow (Negocios Existentes)

#### 4.1 Al seleccionar un negocio existente
- El usuario hace clic en una card de negocio
- Se valida que tenga un perfil activo en ese negocio
- Se establece el contexto del negocio seleccionado
- Redirección al Dashboard del negocio

## 🏗️ Cambios Técnicos Necesarios

### Frontend Changes

#### 1. Renombrar y Reestructurar
```
src/screens/profiles/ → src/screens/business-selection/
├── components/
│   ├── BusinessCard.tsx          # Card para negocio (antes ProfileCard)
│   ├── CreateBusinessDialog.tsx  # Dialog para crear negocio
│   ├── CreateBusinessForm.tsx    # Formulario de negocio
│   └── index.ts
├── hooks/
│   ├── useBusinessSelection.tsx  # Hook principal (antes useProfiles)
│   └── index.ts
├── types/
│   ├── BusinessFormData.ts       # Tipos para formularios
│   └── index.ts
├── BusinessSelectionScreen.tsx   # Screen principal (antes ProfilesScreen)
├── index.ts
└── README.md
```

#### 2. Nuevos Servicios
```typescript
// businessService.ts - Nuevo
interface CreateBusinessData {
  name: string;
  business_type: string;
  email?: string;
  phone?: string;
  address?: string;
  owner_profile_name: string; // Nombre del perfil del owner
}

// Modificar profileService.ts
- getByUser(userId) // Ahora retorna negocios con perfiles del usuario
+ getBusinessesWithProfiles(userId) // Más específico
```

#### 3. Hook Modificado
```typescript
interface UseBusinessSelectionReturn {
  // State
  businessesWithProfiles: BusinessWithProfile[];
  loading: boolean;
  createBusinessDialogOpen: boolean;
  searchDialogOpen: boolean;
  
  // Actions
  loadUserBusinesses: () => Promise<void>;
  handleSelectBusiness: (business: BusinessWithProfile) => Promise<void>;
  handleCreateBusiness: () => void;
  handleSearchBusiness: () => void;
  handleSubmitNewBusiness: (data: CreateBusinessData) => Promise<void>;
  // ...
}
```

### Backend Changes

#### 1. Nuevos Endpoints
```typescript
// businesses.controller.ts
POST /api/businesses           // Crear negocio + perfil admin del owner
GET  /api/businesses/user/:id  // Negocios donde el usuario tiene perfiles

// profiles.controller.ts  
GET  /api/profiles/businesses/:userId // Perfiles agrupados por negocio
```

#### 2. Nuevo Flujo de Creación
```typescript
async createBusinessWithOwner(data: CreateBusinessData, ownerId: number) {
  // 1. Crear business
  // 2. Crear profile "Admin" con todos los permisos
  // 3. Asignar profile al owner
  // 4. Retornar business + profile
}
```

## 🎯 Estados de la Interface

### Loading States
- ⏳ Cargando negocios del usuario
- ⏳ Creando nuevo negocio
- ⏳ Accediendo al negocio seleccionado

### Empty States
- 📭 Sin negocios asignados → Mostrar opciones de crear/buscar
- 🔍 Búsqueda sin resultados → Sugerir contactar admin

### Error States
- ❌ Error cargando negocios → Retry button
- ❌ Error creando negocio → Mostrar detalles del error
- ❌ Sin permisos para acceder → Contactar administrador

## 🔄 Navigation Flow Summary

```
Login/Register
      ↓
BusinessSelectionScreen
      ↓
┌─────────────┬─────────────┐
│ Crear       │ Seleccionar │
│ Negocio     │ Existente   │
│     ↓       │      ↓      │
│CreateDialog │ Validation  │
│     ↓       │      ↓      │
│ Auto-Select │ Set Context │
└─────────────┴─────────────┘
      ↓
Business Dashboard
```

## 📝 UX Considerations

### First Time User Experience
1. **Guidance**: Tooltips explicando las opciones
2. **Quick Start**: Wizard para configuración rápida de negocio
3. **Templates**: Plantillas por tipo de negocio (restaurante, tienda, etc.)

### Returning User Experience
1. **Last Used**: Recordar último negocio accedido
2. **Quick Access**: Acceso rápido a negocios frecuentes
3. **Notifications**: Notificaciones de nuevos permisos asignados

---

**¿Te parece bien este flujo? ¿Hay algo que quieras modificar antes de empezar la implementación?**
