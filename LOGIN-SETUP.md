# 🔐 Sistema de Autenticación - Configuración Completa

## ✅ ¿Qué se ha implementado?

Se ha creado un sistema completo de autenticación JWT que incluye:

### 1. **Componente de Login** (`src/app/auth/login/`)
- Formulario de inicio de sesión con validaciones
- Mostrar/ocultar contraseña
- Manejo de errores específicos
- Loading states
- Diseño moderno con animaciones

### 2. **Servicio de Autenticación** (`src/app/services/auth.service.ts`)
- Login
- Registro (preparado para futuro)
- Validación de token
- Logout
- Gestión de estado con BehaviorSubjects
- Almacenamiento en localStorage

### 3. **AuthGuard** (`src/app/guards/auth.guard.ts`)
- Protege todas las rutas privadas
- Redirige al login si no está autenticado

### 4. **HTTP Interceptor** (`src/app/interceptors/auth.interceptor.ts`)
- Agrega automáticamente el token JWT a todas las peticiones HTTP
- Excepto login y register

### 5. **Interfaces TypeScript** (`src/app/interface/auth.interface.ts`)
- LoginRequest
- LoginResponse
- UserInfo
- Etc.

---

## 🚀 Cómo usar el sistema

### **Paso 1: Asegúrate de que el backend esté corriendo**

El microservicio de usuarios debe estar corriendo en:
```
http://localhost:8110
```

Verifica que el servicio esté activo antes de iniciar el frontend.

### **Paso 2: Iniciar el frontend**

```bash
cd /Users/miguel/Documents/UNIVERSIDAD/SISTEMAS\ DISTRIBUIDOS/Gestion_de_gastos_Front
ng serve
```

### **Paso 3: Crear un usuario de prueba**

Tienes dos opciones:

#### Opción A: Usar Postman
1. Abre Postman
2. Usa la colección: `MS_USER - Gestión de Usuarios y Autenticación`
3. Ejecuta el request: **Register User**
4. Body de ejemplo:
```json
{
  "email": "usuario@test.com",
  "password": "Password123!",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

#### Opción B: Usar curl
```bash
curl -X POST http://localhost:8110/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "password": "Password123!",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```

### **Paso 4: Iniciar sesión**

1. Abre el navegador en: `http://localhost:4200`
2. Serás redirigido automáticamente a `/login`
3. Ingresa las credenciales:
   - Email: `usuario@test.com`
   - Password: `Password123!`
4. Click en "Iniciar Sesión"
5. Serás redirigido al dashboard

---

## 📁 Archivos creados/modificados

### **Archivos nuevos:**
```
src/app/
├── auth/
│   └── login/
│       ├── login.component.ts
│       ├── login.component.html
│       └── login.component.css
├── guards/
│   └── auth.guard.ts
├── interceptors/
│   └── auth.interceptor.ts
├── interface/
│   └── auth.interface.ts
└── services/
    └── auth.service.ts
```

### **Archivos modificados:**
```
src/app/
├── app.routes.ts          # Agregado authGuard y ruta de login
├── app.config.ts          # Registrado authInterceptor
├── app.ts                 # Integrado AuthService
├── app.html               # Condicional de autenticación
└── styles.css             # Estilos para logout button
```

---

## 🔐 Flujo de autenticación

### **Login exitoso:**
1. Usuario ingresa credenciales
2. `AuthService.login()` envía POST a `/api/v1/auth/login`
3. Backend responde con token y userId
4. Token se guarda en `localStorage`
5. `isAuthenticated$` se actualiza a `true`
6. Usuario es redirigido a `/dashboard`
7. `authInterceptor` agrega el token a todas las peticiones siguientes

### **Protección de rutas:**
1. Usuario intenta acceder a `/dashboard`
2. `authGuard` verifica si existe token
3. Si no hay token → redirige a `/login`
4. Si hay token → permite acceso

### **Logout:**
1. Usuario click en "Cerrar Sesión"
2. `AuthService.logout()` limpia localStorage
3. `isAuthenticated$` se actualiza a `false`
4. Usuario es redirigido a `/login`
5. Sidebar desaparece

---

## 🎨 Características del Login

- ✅ **Validaciones en tiempo real**
- ✅ **Mostrar/ocultar contraseña**
- ✅ **Loading spinner durante login**
- ✅ **Mensajes de error específicos**
- ✅ **Diseño responsive**
- ✅ **Animaciones suaves**
- ✅ **Fondo decorativo con círculos animados**

---

## 🔧 Configuración del Backend

Asegúrate de que tu microservicio de usuarios tenga:

### **Endpoint de Login:**
```
POST /api/v1/auth/login
Content-Type: application/json

Request:
{
  "email": "usuario@test.com",
  "password": "Password123!"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "usuario@test.com",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

### **Endpoint de Validación (opcional):**
```
POST /api/v1/auth/validate
Authorization: Bearer {token}

Response (200 OK):
{
  "valid": true,
  "userId": 1,
  "email": "usuario@test.com"
}
```

---

## 🐛 Solución de problemas

### **Error: "No se pudo conectar con el servidor"**
- Verifica que el microservicio esté corriendo en `localhost:8110`
- Revisa los logs del backend

### **Error: "Email o contraseña incorrectos"**
- Verifica que el usuario exista en la base de datos
- Verifica que la contraseña sea correcta

### **El usuario se queda en login después de ingresar credenciales correctas**
- Abre DevTools → Console
- Revisa si hay errores
- Verifica que la respuesta del backend incluya `token` y `userId`

### **El token no se está enviando en las peticiones**
- Verifica que `authInterceptor` esté registrado en `app.config.ts`
- Abre DevTools → Network → Headers
- Busca el header `Authorization: Bearer {token}`

---

## 🔄 Próximos pasos recomendados

1. **Crear página de registro** (opcional)
2. **Agregar "Olvidé mi contraseña"**
3. **Implementar refresh token**
4. **Agregar roles y permisos**
5. **Mejorar manejo de errores con snackbar**
6. **Agregar verificación de email**

---

## 📝 Notas importantes

- El token se guarda en `localStorage` (considera usar httpOnly cookies para mayor seguridad en producción)
- Todos los datos del usuario se almacenan en `localStorage`
- El `authGuard` protege TODAS las rutas excepto `/login`
- El interceptor NO agrega el token a peticiones de login/register
- Al hacer logout, se limpia TODO el localStorage

---

## 🎯 Ejemplo de uso del AuthService en componentes

```typescript
import { AuthService } from './services/auth.service';

export class MiComponente {
  private authService = inject(AuthService);

  ngOnInit() {
    // Obtener usuario actual
    const user = this.authService.getCurrentUser();
    console.log(user);

    // Verificar si está autenticado
    if (this.authService.isLoggedIn()) {
      console.log('Usuario autenticado');
    }

    // Obtener userId
    const userId = this.authService.getUserId();

    // Escuchar cambios en autenticación
    this.authService.isAuthenticated$.subscribe(isAuth => {
      console.log('Estado de autenticación:', isAuth);
    });
  }
}
```

---

¡Todo listo! 🎉 Ahora tu aplicación tiene un sistema completo de autenticación.
