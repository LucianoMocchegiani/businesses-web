# Firebase Authentication Integration

## Configuración Completada

### Frontend (businesses-web)

#### 1. Configuración Firebase
- **Archivo**: `src/config/firebase.ts`
- **Configuración**: Inicialización de Firebase con variables de entorno

#### 2. Servicio de Autenticación  
- **Archivo**: `src/services/authService.ts`
- **Funcionalidades**:
  - Login con email/password
  - Registro de nuevos usuarios
  - Logout
  - Manejo de tokens
  - Integración con backend

#### 3. Hook de Autenticación
- **Archivo**: `src/hooks/useBusinessAuth.tsx`
- **Funcionalidades**:
  - Login/logout
  - Registro de usuarios
  - Monitoreo del estado de autenticación
  - Selección de business

#### 4. Componentes de UI
- **LoginScreen**: `src/screens/auth/LoginScreen.tsx`
- **RegisterScreen**: `src/screens/auth/RegisterScreen.tsx`
- Ambos con manejo de errores y validaciones

#### 5. API Client con Fetch
- **Archivo**: `src/services/apiService.ts`
- **Migración**: De axios a fetch nativo
- **Headers**: Automático con token Firebase
- **Error handling**: Manejo centralizado de errores

### Backend (businesses-server)

#### 1. Firebase Admin
- **Archivo**: `src/firebase/firebase-admin.ts`
- **Configuración**: Firebase Admin SDK

#### 2. Middleware de Autenticación
- **Archivo**: `src/common/middlewares/auth.middleware.ts`
- **Funcionalidad**: Verificación de tokens Firebase en todas las rutas

#### 3. Endpoint de Usuario
- **Controller**: `src/users/users.controller.ts`
- **Service**: `src/users/users.service.ts`
- **Nuevo endpoint**: `GET /api/users/firebase/:uid`

#### 4. CORS Configurado
- **Archivo**: `src/main.ts`
- **Configuración**: Permite acceso desde frontend (puerto 3000)

## Variables de Entorno Requeridas

### Frontend (.env.local)
```bash
# API Configuration
VITE_API_URL=http://localhost:8080/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```bash
# Server
PORT=8080

# Database
DATABASE_URL="your_postgresql_connection_string"

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Flujo de Autenticación

1. **Usuario inicia sesión** en el frontend
2. **Firebase autentica** al usuario y devuelve un token
3. **Frontend guarda** el token en localStorage
4. **Todas las peticiones** al backend incluyen el token en el header
5. **Middleware del backend** verifica el token con Firebase
6. **Backend busca** el usuario en la BD usando firebase_uid
7. **Request continúa** si el usuario existe

## Próximos Pasos

1. **Configurar Firebase Project** con las credenciales reales
2. **Configurar variables de entorno** en ambos proyectos
3. **Probar autenticación** end-to-end
4. **Crear usuarios de prueba** en Firebase
5. **Verificar middleware** de permisos

## Comandos para Desarrollo

### Backend
```bash
cd businesses-server
npm run start:dev
```

### Frontend  
```bash
cd businesses-web
npm run dev
```

El backend correrá en `http://localhost:8080` y el frontend en `http://localhost:3000`.
