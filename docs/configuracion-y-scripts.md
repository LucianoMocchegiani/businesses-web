# 🚀 Configuración del Proyecto y Scripts - Businesses Web (Frontend)

Esta documentación cubre todo lo necesario para configurar e inicializar el proyecto frontend de Businesses Web, así como la documentación completa de todos los scripts disponibles.

## 📋 Prerrequisitos

- [Node.js](https://nodejs.org/) versión 18 o superior
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) como gestor de paquetes
- Cuenta de [Firebase](https://firebase.google.com/) configurada
- Backend (businesses-server) corriendo en `http://localhost:8080`
- Archivo `.env.local` configurado en la raíz del proyecto

## ⚙️ Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```properties
# API Configuration (Backend URL)
VITE_API_URL=http://localhost:8080/api

# Firebase Configuration (obtener de Firebase Console)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Environment
NODE_ENV=development
```

### 2. Configuración de Firebase

Para obtener las credenciales de Firebase:

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto o usar uno existente
3. Ir a **Project Settings** → **General** → **Your apps**
4. Agregar una nueva **Web App**
5. Copiar la configuración y usarla en `.env.local`

### 3. Inicialización del Proyecto

```bash
# Instalar dependencias
npm install

# Verificar configuración de TypeScript
npm run build

# Iniciar aplicación en desarrollo
npm run dev
```

## 🛠️ Scripts Disponibles

### 🚀 Scripts de Desarrollo

```bash
# Iniciar servidor de desarrollo (puerto 3000)
npm run dev
# → Inicia Vite dev server con HMR
# → URL: http://localhost:3000
# → Recarga automática al hacer cambios

# Linting y corrección automática
npm run lint
# → Ejecuta ESLint en todo el proyecto
# → Detecta errores de código y estilo
```

### 🏗️ Scripts de Build

```bash
# Build completo para producción
npm run build
# → Compila TypeScript (tsc -b)
# → Construye con Vite para producción
# → Optimiza y minifica el código
# → Output: ./dist/

# Build específico para desarrollo
npm run build:dev
# → Build con configuración de desarrollo
# → Mantiene source maps completos

# Build específico para producción
npm run build:prod
# → Build optimizado para producción
# → Minificación agresiva
# → Tree shaking

# Preview del build
npm run preview
# → Sirve el build localmente para testing
# → Simula entorno de producción
```

### 📊 Comparación de Scripts

| Script | Propósito | Optimización | Source Maps | Hot Reload |
|--------|-----------|--------------|-------------|------------|
| `dev` | Desarrollo | Mínima | Completos | ✅ |
| `build` | Producción | Máxima | Básicos | ❌ |
| `build:dev` | Testing | Mínima | Completos | ❌ |
| `build:prod` | Deploy | Máxima | Mínimos | ❌ |
| `preview` | Validación | Máxima | Según build | ❌ |

## 📋 Flujos de Trabajo

### 1. Configuración Inicial Completa

```bash
# Paso 1: Clonar/descargar proyecto
cd businesses-web

# Paso 2: Instalar dependencias
npm install

# Paso 3: Configurar variables de entorno
# Crear .env.local con las credenciales

# Paso 4: Verificar configuración
npm run lint

# Paso 5: Iniciar desarrollo
npm run dev

# Paso 6: Verificar en navegador
# → http://localhost:3000
```

### 2. Desarrollo Diario

```bash
# Iniciar desarrollo
npm run dev

# En paralelo (otra terminal):
# Verificar errores de TypeScript
npm run build

# Verificar linting periódicamente
npm run lint
```

### 3. Antes de Hacer Commit

```bash
# 1. Verificar linting
npm run lint

# 2. Verificar build completo
npm run build

# 3. Probar build localmente
npm run preview

# 4. Si todo está OK, hacer commit
git add .
git commit -m "feat: nueva funcionalidad"
```

### 4. Preparación para Despliegue

```bash
# Build para producción
npm run build:prod

# Verificar que funciona
npm run preview

# Los archivos están en ./dist/ listos para deploy
```

## 🔧 Configuración Detallada

### Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),        // @/components/...
      '@theme': path.resolve(__dirname, './src/theme'), // @theme/constants
    },
  },
  server: {
    port: 3000,        // Puerto de desarrollo
    host: true,        // Acceso desde red local
  },
  build: {
    outDir: 'dist',    // Directorio de salida
    sourcemap: true,   // Source maps para debugging
  },
})
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@theme/*": ["./src/theme/*"]
    }
  }
}
```

### Estructura de Directorios

```
src/
├── components/          # Componentes reutilizables
├── screens/            # Pantallas/páginas principales
├── contexts/           # React Contexts (Auth, etc.)
├── hooks/              # Custom hooks
├── services/           # Servicios API y lógica de negocio
├── types/              # Tipos TypeScript
├── theme/              # Configuración de Material-UI
├── config/             # Configuraciones (Firebase, etc.)
└── utils/              # Utilidades y helpers
```

## 🔌 Integración con Backend

### Variables de API

```javascript
// En .env.local
VITE_API_URL=http://localhost:8080/api

// En el código
const API_URL = import.meta.env.VITE_API_URL;
```

### Configuración de Servicios

```typescript
// src/services/apiService.ts
const BASE_URL = import.meta.env.VITE_API_URL;

export const apiService = {
  get: (endpoint: string) => fetch(`${BASE_URL}${endpoint}`),
  post: (endpoint: string, data: any) => 
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
};
```

## 🛠️ Troubleshooting

### Error "Cannot resolve module"

```bash
# Limpiar cache de node_modules package-lock.json
rm -rf node_modules package-lock.json
npm install

# O limpiar cache de Vite
rm -rf node_modules/.vite
npm run dev
```

### Puerto 3000 ya en uso

```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Cambiar puerto temporalmente
npm run dev -- --port 3001

# O configurar en vite.config.ts
server: { port: 3001 }
```

### Errores de TypeScript en build

```bash
# Verificar errores específicos
npm run build 2>&1 | grep "error TS"

# Compilar solo TypeScript
npx tsc --noEmit

# Verificar configuración
cat tsconfig.json
```

### Variables de entorno no funcionan

```bash
# Verificar archivo existe
ls -la .env.local

# Verificar formato (deben empezar con VITE_)
cat .env.local

# Reiniciar servidor de desarrollo
# Ctrl+C y luego npm run dev
```

### Errores de Firebase

```bash
# Verificar configuración
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

# Verificar que Firebase esté inicializado
# Revisar src/config/firebase.ts

# Verificar permisos en Firebase Console
# Authentication → Sign-in method
```

### Error de CORS con Backend

```bash
# Verificar URL del backend
echo $VITE_API_URL

# Verificar que backend esté corriendo
curl http://localhost:8080/api/health

# Verificar configuración CORS en backend
# businesses-server/src/main.ts
```

### Build falla en producción

```bash
# Verificar warnings como errores
npm run build 2>&1 | grep -i warning

# Build con más información
npm run build -- --debug

# Verificar tamaño de chunks
npm run build -- --bundleAnalyzer
```

## 🔍 Scripts de Debug y Análisis

### Debug del Bundle

```bash
# Analizar tamaño del bundle
npm run build && npx vite-bundle-analyzer dist

# Ver dependencias del bundle
npx webpack-bundle-analyzer dist/assets/*.js
```

### Debug de Performance

```javascript
// En el navegador (DevTools Console)
// Ver tiempos de carga
performance.getEntriesByType('navigation')

// Ver recursos cargados
performance.getEntriesByType('resource')
```

### Debug de Variables de Entorno

```javascript
// En development (navegador console)
console.log('Environment variables:', {
  API_URL: import.meta.env.VITE_API_URL,
  FIREBASE_PROJECT: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});
```

## 🚀 Configuración para Producción

### Build de Producción

```bash
# Build optimizado
npm run build:prod

# Verificar salida
ls -la dist/
du -sh dist/  # Ver tamaño total
```

### Variables de Entorno para Producción

```properties
# .env.production
VITE_API_URL=https://your-backend-domain.com/api
VITE_FIREBASE_PROJECT_ID=your-prod-project
# ... otras variables de Firebase para producción
```

### Despliegue en Netlify

```bash
# Build command
npm run build:prod

# Publish directory
dist

# Environment variables
# Configurar en Netlify dashboard
```

### Despliegue en Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Configuración de CDN

```javascript
// Para optimizar carga de assets
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
})
```

## 📊 Monitoreo y Analytics

### Performance Monitoring

```javascript
// src/utils/performance.ts
export const logPerformance = () => {
  if (import.meta.env.PROD) {
    // Medir Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};
```

### Error Monitoring

```javascript
// src/utils/errorTracking.ts
window.addEventListener('error', (event) => {
  if (import.meta.env.PROD) {
    // Enviar error a servicio de monitoreo
    console.error('Global error:', event.error);
  }
});
```

## 📝 Notas Importantes

1. **Variables de entorno**: Deben empezar con `VITE_` para ser accesibles
2. **Hot Module Replacement**: Funciona automáticamente en desarrollo
3. **TypeScript**: Verificación estricta habilitada
4. **Build**: Optimización automática para producción
5. **Source Maps**: Habilitados para debugging
6. **Aliases**: `@/` apunta a `src/`, `@theme/` a `src/theme/`
7. **Firebase**: Requiere configuración previa en Firebase Console
8. **CORS**: Backend debe permitir acceso desde puerto 3000
9. **Cache**: Vite maneja cache automáticamente en desarrollo
10. **Testing**: Configurar Jest/Vitest para tests unitarios

## 🔗 Enlaces Útiles

- **Aplicación Local**: http://localhost:3000 (development)
- **API Backend**: http://localhost:8080/api
- **Vite Docs**: https://vitejs.dev/guide/
- **React Docs**: https://react.dev/
- **Material-UI**: https://mui.com/material-ui/
- **Firebase Auth**: https://firebase.google.com/docs/auth/web/start
- **TypeScript**: https://www.typescriptlang.org/docs/

## 🤝 Para Nuevos Desarrolladores

### Primeros Pasos Recomendados

1. **Leer este documento** para entender la configuración
2. **Revisar [`patrones-de-diseño-frontend.md`](./patrones-de-diseño-frontend.md)** para estándares de código
3. **Explorar [`contexto-del-proyecto.md`](./contexto-del-proyecto.md)** para entender el negocio
4. **Configurar variables de entorno** siguiendo esta guía
5. **Ejecutar `npm run dev`** y explorar la aplicación

### Herramientas de Desarrollo Recomendadas

- **VSCode Extensions**: ES7+ React/Redux/React-Native snippets, TypeScript Importer
- **Browser Extensions**: React Developer Tools, Redux DevTools
- **Chrome DevTools**: Network, Performance, Lighthouse tabs
- **Firebase Console**: Para gestionar authentication y configuración

### Comandos Esenciales

```bash
# Desarrollo diario
npm run dev          # Iniciar desarrollo
npm run lint         # Verificar código
npm run build        # Verificar que compila

# Debugging
npm run preview      # Probar build localmente
npm run build:dev    # Build con debug info
``` 