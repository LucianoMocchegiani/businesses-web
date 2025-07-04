# Business Admin - Frontend

Sistema de administración para negocios construido con **Vite + React + TypeScript + Material-UI**.

## 🚀 Tecnologías Utilizadas

- ⚡ **Vite** - Build tool ultra-rápido
- ⚛️ **React 18** + **TypeScript** - Framework y type safety
- 🎨 **Material-UI v6** - Design system y componentes
- 🛣️ **React Router v6** - Client-side routing
- 🎣 **React Hook Form** - Gestión de formularios
- 🔥 **Firebase** - Autenticación (pendiente implementar)
- 📊 **Axios** - Cliente HTTP para API

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Layout/          # Layout principal
│   ├── HeaderBar/       # Barra superior
│   ├── Sidebar/         # Menú lateral
│   └── ScreenContainer/ # Container de pantallas
├── screens/             # Pantallas principales
│   ├── auth/           # Autenticación (Login/Register)
│   └── business/       # Módulos del negocio
├── contexts/            # React Contexts (Auth)
├── hooks/               # Custom hooks
├── services/            # API services
├── types/               # TypeScript types
├── theme/               # Configuración MUI
└── utils/               # Utilidades
```

## 🔧 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar desarrollo:**
   ```bash
   npm run dev
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

## 📋 Módulos Implementados

### ✅ **Implementado**
- 🏗️ **Arquitectura base** - Layout, routing, contextos
- 🔐 **Autenticación** - Context y hooks (mock)
- 🎨 **Design System** - Componentes MUI consistentes
- 📱 **Responsive** - Adaptado a mobile y desktop

### 🚧 **En Desarrollo**
- 👥 **Gestión de Clientes**
- 📦 **Gestión de Productos** 
- 💰 **Punto de Venta**
- 🛒 **Gestión de Compras**
- 📊 **Control de Inventario**
- ⚙️ **Configuración**

## 🌐 Integración con Backend

El frontend está diseñado para integrarse con la API de NestJS existente:

### Endpoints esperados:
- `GET /customers` - Lista de clientes
- `POST /customers` - Crear cliente
- `PUT /customers/:id` - Actualizar cliente
- `DELETE /customers/:id` - Eliminar cliente
- Similar para productos, ventas, compras, etc.

### Configuración API:
```typescript
// En .env
VITE_API_URL=http://localhost:3001
```

## 🎨 Patrones de Diseño

### **Arquitectura basada en `aubilities-fmc-frontend`:**
- **Context API** para estado global
- **Custom hooks** para lógica reutilizable  
- **Componentes modulares** siguiendo principios DRY
- **TypeScript strict** para type safety
- **Material-UI theming** consistente

### **Estructura de componentes:**
```typescript
// Ejemplo: Layout con navegación
<Layout navData={businessNavData} logout={logout} userData={user}>
  <Outlet /> // Pantallas específicas
</Layout>
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción  
npm run build:dev    # Build para desarrollo
npm run lint         # Linting con ESLint
npm run preview      # Preview del build
```

## 📝 Próximos Pasos

### **Corto Plazo (1-2 semanas):**
1. **Implementar Firebase Auth** - Login/logout real
2. **Conectar con API** - Servicios reales de customers
3. **DataGrid avanzado** - Tablas con paginación y filtros
4. **Formularios dinámicos** - CRUD completo de clientes

### **Mediano Plazo (3-4 semanas):**
1. **Módulo de Productos** - Catálogo completo
2. **Punto de Venta** - Interface de cobro
3. **Dashboard Analytics** - Gráficos y métricas
4. **Sistema de permisos** - Roles y accesos

### **Largo Plazo (1-2 meses):**
1. **Reportes avanzados** - Exportación PDF/Excel
2. **Modo offline** - PWA con cache
3. **Notificaciones push** - Alertas en tiempo real
4. **Multi-tenant** - Múltiples negocios

## 👥 Contribución

El proyecto sigue los patrones establecidos en `aubilities-fmc-frontend`:

1. **Componentes** en `src/components/`
2. **Pantallas** en `src/screens/`
3. **Hooks personalizados** en `src/hooks/`
4. **Tipos TypeScript** en `src/types/`
5. **Servicios API** en `src/services/`

## 🐛 Problemas Conocidos

- Los errores de TypeScript se resolverán al instalar las dependencias
- La autenticación actualmente es mock (desarrollo)
- Faltan validaciones de formularios
- No hay manejo de errores de API

---

**Desarrollado siguiendo los patrones de aubilities-fmc-frontend**
