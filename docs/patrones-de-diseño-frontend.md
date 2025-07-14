# Patrones de Diseño - Frontend (React + TypeScript)

## Tabla de Contenidos
- [Introducción](#introducción)
- [Arquitectura y Estructura](#arquitectura-y-estructura)
- [Patrones de Componentes](#patrones-de-componentes)
- [Patrones de Hooks](#patrones-de-hooks)
- [Patrones de Servicios](#patrones-de-servicios)
- [Patrones de Tipos](#patrones-de-tipos)
- [Patrones de Estado](#patrones-de-estado)
- [Patrones de Navegación](#patrones-de-navegación)
- [Patrones de Formularios](#patrones-de-formularios)
- [Patrones de Manejo de Errores](#patrones-de-manejo-de-errores)
- [Patrones de Autenticación](#patrones-de-autenticación)

## Introducción

Esta documentación establece los patrones de diseño estándar para el frontend del sistema Business Admin construido con React, TypeScript, Material-UI y Vite. Seguir estos patrones garantiza consistencia, mantenibilidad y escalabilidad del código.

## Arquitectura y Estructura

### Estructura de Directorios
```
src/
├── components/              # Componentes reutilizables
│   ├── [Component]/
│   │   ├── [Component].tsx
│   │   └── index.ts
│   └── index.ts            # Barrel exports
├── screens/                # Pantallas/Páginas principales
│   ├── [domain]/
│   │   ├── components/     # Componentes específicos del dominio
│   │   ├── hooks/         # Hooks específicos del dominio
│   │   ├── types/         # Tipos específicos del dominio
│   │   ├── [Domain]Screen.tsx
│   │   ├── index.ts
│   │   └── README.md
├── services/               # Servicios para comunicación con API
├── contexts/               # Contextos de React
├── hooks/                  # Hooks reutilizables
├── types/                  # Tipos globales
├── theme/                  # Configuración de tema
└── utils/                  # Utilidades
```

### Principios de Arquitectura
1. **Componentes funcionales** con hooks
2. **Tipado fuerte** con TypeScript
3. **Composición sobre herencia**
4. **Separación de responsabilidades**
5. **Reutilización de componentes**
6. **Estado mínimo y localizado**

## Patrones de Componentes

### Componente Base (Reutilizable)
```typescript
import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface ComponentProps extends Omit<BoxProps, 'children'> {
  // Props específicas del componente
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  subtitle,
  isLoading = false,
  onAction,
  children,
  ...boxProps
}) => {
  // Lógica del componente
  const handleAction = () => {
    if (onAction && !isLoading) {
      onAction();
    }
  };

  return (
    <Box {...boxProps}>
      {/* JSX del componente */}
      {children}
    </Box>
  );
};

// Export default para facilitar imports
export default Component;
```

### Componente de Pantalla (Screen)
```typescript
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ScreenContainer } from '@/components';
import { useComponentData } from './hooks';
import { ComponentTable, ComponentDialog } from './components';

export const ComponentScreen: React.FC = () => {
  // Hooks del dominio
  const {
    data,
    loading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    // ... otras funciones
  } = useComponentData();

  // Handlers locales
  const handleRefresh = () => {
    // Lógica de refresh
  };

  return (
    <ScreenContainer
      title="Gestión de Componentes"
      subtitle="Administra los componentes del sistema"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Contenido de la pantalla */}
        <ComponentTable
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <ComponentDialog
          open={dialogOpen}
          mode={dialogMode}
          entity={selectedEntity}
          onSave={handleSave}
          onClose={handleCloseDialog}
        />
      </Box>
    </ScreenContainer>
  );
};

export default ComponentScreen;
```

### Reglas para Componentes
1. **Usar TypeScript** con interfaces explícitas
2. **Props tipadas** con valores por defecto
3. **Forwardear props** cuando sea apropiado (`...boxProps`)
4. **Manejo de loading/error** states
5. **Exports nombrados y default**
6. **Comentarios JSDoc** para componentes complejos

## Patrones de Hooks

### Hook de Datos (Domain Hook)
```typescript
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from '@/hooks';
import { entityService } from '@/services';
import { Entity, CreateEntityRequest, UpdateEntityRequest } from '@/types';

interface UseEntityDataReturn {
  // Estados
  entities: Entity[];
  selectedEntity: Entity | null;
  loading: boolean;
  error: string | null;
  
  // Paginación
  page: number;
  totalPages: number;
  
  // Diálogo
  dialogOpen: boolean;
  dialogMode: 'create' | 'edit';
  
  // Acciones
  loadEntities: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (entity: Entity) => void;
  handleDelete: (id: string) => Promise<void>;
  handleSave: (data: CreateEntityRequest | UpdateEntityRequest) => Promise<void>;
  handleCloseDialog: () => void;
  handlePageChange: (newPage: number) => void;
}

export const useEntityData = (): UseEntityDataReturn => {
  // Estados
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  // Hook de snackbar para notificaciones
  const { showSnackbar } = useSnackbar();

  // Cargar entidades
  const loadEntities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await entityService.getAll({
        page,
        limit: 10,
        order_by: 'created_at',
        order_direction: 'desc'
      });
      
      setEntities(response.data);
      setTotalPages(response.last_page);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
      showSnackbar('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, showSnackbar]);

  // Crear entidad
  const handleCreate = useCallback(() => {
    setSelectedEntity(null);
    setDialogMode('create');
    setDialogOpen(true);
  }, []);

  // Editar entidad
  const handleEdit = useCallback((entity: Entity) => {
    setSelectedEntity(entity);
    setDialogMode('edit');
    setDialogOpen(true);
  }, []);

  // Eliminar entidad
  const handleDelete = useCallback(async (id: string) => {
    try {
      await entityService.delete(id);
      showSnackbar('Entidad eliminada exitosamente', 'success');
      await loadEntities();
    } catch (err: any) {
      showSnackbar(err.message || 'Error al eliminar', 'error');
    }
  }, [loadEntities, showSnackbar]);

  // Guardar entidad (crear o actualizar)
  const handleSave = useCallback(async (data: CreateEntityRequest | UpdateEntityRequest) => {
    try {
      if (dialogMode === 'create') {
        await entityService.create(data as CreateEntityRequest);
        showSnackbar('Entidad creada exitosamente', 'success');
      } else {
        await entityService.update(data as UpdateEntityRequest);
        showSnackbar('Entidad actualizada exitosamente', 'success');
      }
      
      setDialogOpen(false);
      await loadEntities();
    } catch (err: any) {
      showSnackbar(err.message || 'Error al guardar', 'error');
    }
  }, [dialogMode, loadEntities, showSnackbar]);

  // Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedEntity(null);
  }, []);

  // Cambiar página
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Cargar datos al montar y cuando cambie la página
  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  return {
    // Estados
    entities,
    selectedEntity,
    loading,
    error,
    page,
    totalPages,
    dialogOpen,
    dialogMode,
    
    // Acciones
    loadEntities,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseDialog,
    handlePageChange,
  };
};
```

### Hook de Formulario
```typescript
import { useState, useCallback } from 'react';
import { EntityFormData } from '../types';

interface UseEntityFormReturn {
  formData: EntityFormData;
  errors: Record<string, string>;
  isValid: boolean;
  updateField: (field: keyof EntityFormData, value: any) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setFormData: (data: EntityFormData) => void;
}

export const useEntityForm = (initialData?: Partial<EntityFormData>): UseEntityFormReturn => {
  const [formData, setFormDataState] = useState<EntityFormData>({
    name: '',
    email: '',
    phone: '',
    is_active: true,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar campo individual
  const updateField = useCallback((field: keyof EntityFormData, value: any) => {
    setFormDataState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Validar formulario
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validaciones requeridas
    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFormDataState({
      name: '',
      email: '',
      phone: '',
      is_active: true,
      ...initialData
    });
    setErrors({});
  }, [initialData]);

  // Establecer datos del formulario
  const setFormData = useCallback((data: EntityFormData) => {
    setFormDataState(data);
  }, []);

  const isValid = Object.keys(errors).length === 0 && 
                  formData.name?.trim().length > 0;

  return {
    formData,
    errors,
    isValid,
    updateField,
    validateForm,
    resetForm,
    setFormData,
  };
};
```

### Reglas para Hooks
1. **Un hook por responsabilidad**
2. **Retornar objeto con propiedades nombradas**
3. **useCallback para funciones** que se pasan como props
4. **Manejo de loading/error** states
5. **Cleanup** en useEffect cuando sea necesario
6. **Dependencias correctas** en arrays de dependencias

## Patrones de Servicios

### Servicio de Dominio
```typescript
import { apiService } from './apiService';
import { Entity, CreateEntityRequest, UpdateEntityRequest, EntityResponse } from '@/types';

export interface GetEntitiesParams {
  page?: number;
  limit?: number;
  order_by?: 'name' | 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  name?: string;
  is_active?: boolean;
}

class EntityService {
  private readonly endpoint = '/entities';

  async getAll(params?: GetEntitiesParams): Promise<EntityResponse> {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.order_by) queryParams.append('order_by', params.order_by);
      if (params?.order_direction) queryParams.append('order_direction', params.order_direction);
      if (params?.name) queryParams.append('name', params.name);
      if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      
      const queryString = queryParams.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      return apiService.get<EntityResponse>(url);
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Entity> {
    try {
      return apiService.get<Entity>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error fetching entity:', error);
      throw error;
    }
  }

  async create(data: CreateEntityRequest): Promise<Entity> {
    try {
      return apiService.post<Entity>(this.endpoint, data);
    } catch (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
  }

  async update(data: UpdateEntityRequest): Promise<Entity> {
    try {
      return apiService.put<Entity>(`${this.endpoint}/${data.id}`, data);
    } catch (error) {
      console.error('Error updating entity:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting entity:', error);
      throw error;
    }
  }
}

export const entityService = new EntityService();
```

### Reglas para Servicios
1. **Un servicio por dominio/entidad**
2. **Métodos CRUD estándar**
3. **Manejo de errores** con try-catch
4. **Tipado fuerte** en parámetros y respuestas
5. **Query parameters** construidos dinámicamente
6. **Console.error** para debugging
7. **Singleton pattern** (instancia única exportada)

## Patrones de Tipos

### Tipos de Entidad
```typescript
// Tipos base
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Entidad principal
export interface Entity extends BaseEntity {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  business_id: number;
}

// Request types
export interface CreateEntityRequest {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
}

export interface UpdateEntityRequest extends Partial<CreateEntityRequest> {
  id: string;
}

// Response types
export interface EntityResponse {
  data: Entity[];
  total: number;
  page: number;
  last_page: number;
}

// Form types
export interface EntityFormData {
  name: string;
  description: string;
  email: string;
  phone: string;
  is_active: boolean;
}

// Parámetros de filtros
export interface EntityFilters {
  name?: string;
  email?: string;
  is_active?: boolean;
}
```

### Tipos de Estado
```typescript
// Estados de UI
export interface UIState {
  loading: boolean;
  error: string | null;
  dialogOpen: boolean;
  selectedId: string | null;
}

// Estados de paginación
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  last_page: number;
}

// Estados de formulario
export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isDirty: boolean;
}
```

### Reglas para Tipos
1. **Separar tipos** por responsabilidad
2. **Herencia con extends** cuando sea apropiado
3. **Opcionales explícitos** con `?`
4. **Tipos de respuesta** separados de entidades
5. **Barrel exports** en index.ts
6. **Documentación JSDoc** para tipos complejos

## Patrones de Estado

### Context Pattern
```typescript
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Tipos del estado
interface AppState {
  user: User | null;
  selectedBusiness: Business | null;
  selectedProfile: Profile | null;
  loading: boolean;
}

// Tipos de acciones
type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_BUSINESS'; payload: Business | null }
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_BUSINESS':
      return { ...state, selectedBusiness: action.payload };
    case 'SET_PROFILE':
      return { ...state, selectedProfile: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  setUser: (user: User | null) => void;
  setBusiness: (business: Business | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    selectedBusiness: null,
    selectedProfile: null,
    loading: false,
  });

  const setUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const setBusiness = useCallback((business: Business | null) => {
    dispatch({ type: 'SET_BUSINESS', payload: business });
  }, []);

  const setProfile = useCallback((profile: Profile | null) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      setUser,
      setBusiness,
      setProfile,
      setLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};
```

## Patrones de Navegación

### Route Configuration
```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { 
  LoginScreen,
  DashboardScreen,
  EntitiesScreen,
  // ... otras pantallas
} from '@/screens';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/entities" element={<EntitiesScreen />} />
      {/* Rutas protegidas */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
```

### Protected Route Component
```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission
}) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## Patrones de Formularios

### Formulario con Validación
```typescript
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box
} from '@mui/material';
import { useEntityForm } from '../hooks';
import { EntityFormData } from '../types';

interface EntityFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: Partial<EntityFormData>;
  onSave: (data: EntityFormData) => Promise<void>;
  onClose: () => void;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  open,
  mode,
  initialData,
  onSave,
  onClose
}) => {
  const {
    formData,
    errors,
    isValid,
    updateField,
    validateForm,
    resetForm
  } = useEntityForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
      resetForm();
    } catch (error) {
      // Error manejado por el hook padre
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'create' ? 'Crear' : 'Editar'} Entidad
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
            />
            
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
            
            <TextField
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                />
              }
              label="Activo"
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={!isValid}
          >
            {mode === 'create' ? 'Crear' : 'Actualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

## Patrones de Manejo de Errores

### Error Boundary
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper sx={{ p: 4, m: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Algo salió mal
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
            </Typography>
            <Button variant="contained" onClick={this.handleReset}>
              Reintentar
            </Button>
          </Box>
        </Paper>
      );
    }

    return this.props.children;
  }
}
```

### Hook de Errores
```typescript
import { useState, useCallback } from 'react';

interface UseErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleError: (error: any) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('Error:', error);
    
    if (error?.message) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('Ha ocurrido un error inesperado');
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError,
  };
};
```

## Patrones de Autenticación

### Auth Guard Hook
```typescript
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const useAuthGuard = (requiredPermission?: string) => {
  const { isAuthenticated, hasPermission, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        navigate('/unauthorized', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, hasPermission, loading, requiredPermission, navigate, location]);

  return {
    isAuthenticated,
    loading,
    hasPermission: (permission: string) => hasPermission(permission)
  };
};
```

## Checklist de Implementación

### Para cada nuevo componente:
- [ ] Tipado fuerte con interfaces
- [ ] Props con valores por defecto
- [ ] Manejo de estados loading/error
- [ ] Exports nombrados y default
- [ ] Responsive design
- [ ] Accesibilidad (a11y)

### Para cada nueva pantalla:
- [ ] Hook de datos del dominio
- [ ] Componentes específicos en carpeta components/
- [ ] Tipos específicos en carpeta types/
- [ ] README.md documentando la funcionalidad
- [ ] Integración con el layout principal

### Para cada nuevo hook:
- [ ] Retorno de objeto con propiedades nombradas
- [ ] useCallback para funciones
- [ ] Manejo de dependencias correcto
- [ ] Cleanup cuando sea necesario
- [ ] Tipado de parámetros y retorno

### Para cada nuevo servicio:
- [ ] Métodos CRUD estándar
- [ ] Manejo de errores con try-catch
- [ ] Construcción dinámica de query params
- [ ] Tipado de requests y responses
- [ ] Documentación de la API

### Verificaciones de calidad:
- [ ] No hay errores de TypeScript
- [ ] Componentes reutilizables
- [ ] Estados mínimos y localizados
- [ ] Performance optimizado
- [ ] Código consistente con patrones existentes
- [ ] Tests unitarios (cuando aplique)

Este documento debe ser la referencia principal para cualquier desarrollo en el frontend. Mantener consistencia con estos patrones es fundamental para la calidad y mantenibilidad del código. 