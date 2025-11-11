# ✅ Sistema de Autenticación JWT - CONFIGURADO Y LISTO

## 🎉 ¿Qué está funcionando?

El sistema de autenticación está **100% configurado** y listo para usar con tu backend en el puerto **8110**.

---

## 🔐 Configuración actual

### **1. Respuesta del backend esperada (LOGIN):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "userId": 1,
    "email": "migueangel.br1203@gmail.com",
    "firstName": "miguel",
    "lastName": "beltran",
    "fullName": "miguel beltran",
    "provider": "LOCAL",
    "role": "USER",
    "emailVerified": false,
    "profilePictureUrl": null,
    "createdAt": "2025-11-11T03:12:19.932411",
    "updatedAt": "2025-11-11T03:12:19.932448"
  }
}
```

### **2. ¿Qué se guarda en localStorage?**
- ✅ `token`: El JWT completo
- ✅ `tokenType`: "Bearer"
- ✅ `userId`: ID del usuario (ej: "1")
- ✅ `userInfo`: Objeto JSON con firstName, lastName, fullName, email, role

### **3. ¿Cómo se envía el token?**
Todas las peticiones HTTP (excepto login/register) incluyen automáticamente:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

Esto lo hace el **HTTP Interceptor** automáticamente.

---

## 🚀 Cómo usar el sistema

### **Paso 1: Asegúrate de que el backend esté corriendo**
```bash
# El microservicio debe estar en:
http://localhost:8110/api/v1/auth
```

### **Paso 2: Crear un usuario (si no existe)**

**Con Postman/curl:**
```bash
curl -X POST http://localhost:8110/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "migueangel.br1203@gmail.com",
    "password": "Mamasita",
    "firstName": "miguel",
    "lastName": "beltran"
  }'
```

### **Paso 3: Iniciar el frontend**
```bash
cd "/Users/miguel/Documents/UNIVERSIDAD/SISTEMAS DISTRIBUIDOS/Gestion_de_gastos_Front"
ng serve
```

### **Paso 4: Abrir el navegador**
```
http://localhost:4200
```

### **Paso 5: Iniciar sesión**
- Email: `migueangel.br1203@gmail.com`
- Password: `Mamasita`

---

## 🔄 Flujo completo de autenticación

### **Login exitoso:**
1. Usuario ingresa email y contraseña
2. Frontend envía POST a `http://localhost:8110/api/v1/auth/login`
3. Backend responde con `token`, `tokenType` y datos del `user`
4. AuthService guarda todo en localStorage
5. Usuario es redirigido a `/dashboard`
6. Sidebar muestra nombre completo del usuario
7. **TODAS** las peticiones HTTP posteriores incluyen el token automáticamente

### **Ejemplo de petición con token:**
```http
GET http://localhost:8082/api/v1/expenses
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

### **Logout:**
1. Usuario click en "Cerrar Sesión"
2. Se limpia localStorage
3. Usuario redirigido a `/login`
4. Sidebar desaparece

---

## 📁 Archivos modificados/creados

### **Nuevos archivos:**
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
│   └── auth.interface.ts (actualizado con UserDetails)
└── services/
    └── auth.service.ts
```

### **Archivos actualizados:**
```
✅ app.routes.ts           # authGuard en todas las rutas
✅ app.config.ts           # authInterceptor registrado
✅ app.ts y app.html       # Sidebar condicional + logout
✅ styles.css              # Estilos de logout
✅ nuevo-gasto.ts          # userId dinámico
✅ nuevo-ingreso.ts        # userId dinámico
```

---

## 🎯 Características implementadas

### **✅ AuthService**
- `login(credentials)` - Inicia sesión
- `logout()` - Cierra sesión
- `validateToken()` - Valida token
- `getToken()` - Obtiene token
- `getUserId()` - Obtiene userId
- `getCurrentUser()` - Obtiene info del usuario
- `isLoggedIn()` - Verifica si está autenticado

### **✅ AuthGuard**
- Protege rutas automáticamente
- Redirige a `/login` si no está autenticado

### **✅ HTTP Interceptor**
- Agrega `Authorization: Bearer {token}` a todas las peticiones
- Console logs para debugging:
  - `🔐 Interceptor: Agregando token a la petición`
  - `🔓 Interceptor: Petición de autenticación, sin token`

### **✅ UserId dinámico**
- Ya no está hardcodeado como `userId: 1`
- Se obtiene automáticamente del usuario autenticado
- Componentes actualizados:
  - `nuevo-gasto.component.ts`
  - `nuevo-ingreso.component.ts`

---

## 🐛 Debugging

### **Ver si el token se está enviando:**
1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Haz una petición (ej: cargar gastos)
4. Click en la petición
5. Ve a **Headers**
6. Busca: `Authorization: Bearer eyJ...`

### **Ver console logs:**
Los siguientes mensajes aparecerán en la consola:

```
✅ Login exitoso - Token guardado: eyJhbGciOiJIUzUxMiJ9...
✅ Usuario: miguel beltran
✅ Usuario ID cargado: 1
🔐 Interceptor: Agregando token a la petición
```

### **Verificar localStorage:**
En DevTools → Application → Local Storage → localhost:4200
```
token: "eyJhbGciOiJIUzUxMiJ9..."
tokenType: "Bearer"
userId: "1"
userInfo: {"userId":1,"email":"...","firstName":"miguel",...}
```

---

## 🔧 Solución de problemas

### **❌ Error: "No se pudo conectar con el servidor"**
**Solución:** Verifica que el backend esté corriendo en `localhost:8110`

```bash
curl http://localhost:8110/api/v1/auth/login
```

### **❌ Error 401: "Unauthorized"**
**Causa:** El token expiró o es inválido

**Solución:**
1. Limpia localStorage (DevTools → Application → Clear Storage)
2. Vuelve a hacer login

### **❌ El token no se envía en las peticiones**
**Solución:** Verifica que `authInterceptor` esté en `app.config.ts`:
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

### **❌ userId es undefined en nuevo-gasto**
**Causa:** No se pudo obtener del localStorage

**Solución:**
1. Verifica que hayas iniciado sesión
2. Revisa en localStorage que exista `userId`
3. Verifica la consola por errores

---

## 📝 Credenciales de prueba

```
Email: migueangel.br1203@gmail.com
Password: Mamasita
```

---

## 🎨 UI/UX

### **Página de Login:**
- Diseño moderno con gradiente púrpura
- Validaciones en tiempo real
- Mostrar/ocultar contraseña
- Loading spinner
- Mensajes de error específicos
- Animaciones suaves
- Responsive design

### **Sidebar (cuando está autenticado):**
- Muestra el nombre completo del usuario
- Muestra el email
- Botón "Cerrar Sesión" al final

---

## ✨ Próximos pasos (opcionales)

1. **Página de registro** (opcional, si quieres que usuarios se registren desde el frontend)
2. **Refresh token** (para renovar tokens expirados automáticamente)
3. **Roles y permisos** (si necesitas admin vs user)
4. **Remember me** (mantener sesión activa)

---

## 🎉 ¡Listo!

Tu sistema de autenticación está **100% funcional** con:
- ✅ JWT guardado en localStorage
- ✅ Token enviado automáticamente en cada petición
- ✅ Header `Authorization: Bearer {token}`
- ✅ userId dinámico
- ✅ Rutas protegidas
- ✅ Login/Logout funcional

**¡Pruébalo ahora!** 🚀

```bash
ng serve
# Abre: http://localhost:4200
```
