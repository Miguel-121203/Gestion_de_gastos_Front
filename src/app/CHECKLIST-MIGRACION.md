# ✅ Checklist: Migración a Microservicio API

## 🎯 **Cuando tengas tu microservicio listo, sigue estos pasos:**

### **📋 Pre-requisitos**
- [ ] Microservicio ejecutándose y accesible
- [ ] Endpoints del API funcionando correctamente
- [ ] CORS configurado en el backend
- [ ] Estructura de respuesta del API definida

---

### **🔧 Cambios en el Código**

#### **1. Configurar URL del API**
- [ ] Abrir `src/app/services/categorias.service.ts`
- [ ] Cambiar línea 16: `private readonly API_URL = 'http://tu-servidor:puerto/api/categorias';`
- [ ] Verificar que la URL sea correcta

#### **2. Actualizar Imports**
- [ ] Agregar `import { tap, catchError } from 'rxjs/operators';`
- [ ] Verificar que `HttpClient` esté importado

#### **3. Método `obtenerCategorias()`**
- [ ] Comentar líneas 36-39 (código local)
- [ ] Descomentar y actualizar líneas 35-40 (código API)
- [ ] Agregar manejo de errores con `catchError`

#### **4. Método `crearCategoria()`**
- [ ] Comentar líneas 49-59 (código local)
- [ ] Descomentar y actualizar líneas 50-59 (código API)
- [ ] Agregar manejo de errores

#### **5. Método `actualizarCategoria()`**
- [ ] Comentar líneas 66-77 (código local)
- [ ] Descomentar y actualizar líneas 67-77 (código API)
- [ ] Agregar manejo de errores

#### **6. Método `eliminarCategoria()`**
- [ ] Comentar líneas 82-94 (código local)
- [ ] Descomentar y actualizar líneas 83-94 (código API)
- [ ] Agregar manejo de errores

#### **7. Método `obtenerCategoriaPorId()`**
- [ ] Reemplazar implementación local por llamada HTTP
- [ ] Agregar manejo de errores

#### **8. Constructor**
- [ ] Cambiar inicialización local por llamada a `obtenerCategorias()`

---

### **🧪 Verificación**

#### **Compilación**
- [ ] Ejecutar `ng build` sin errores
- [ ] Verificar que no hay errores de TypeScript
- [ ] Verificar que no hay errores de linting

#### **Funcionalidad**
- [ ] Crear nueva categoría → debe aparecer en todos los selects
- [ ] Listar categorías → debe cargar desde el API
- [ ] Actualizar categoría → debe reflejarse en el backend
- [ ] Eliminar categoría → debe eliminarse del backend
- [ ] Verificar que los selects se actualizan automáticamente

#### **Network Tab (F12)**
- [ ] Ver peticiones HTTP a tu API
- [ ] Verificar que las respuestas tienen el formato correcto
- [ ] No debe haber errores 404, 500, etc.

#### **Consola del Navegador**
- [ ] Ver logs de éxito: "Categorías cargadas desde API"
- [ ] Ver logs de éxito: "Categoría creada exitosamente en API"
- [ ] No debe haber errores de CORS
- [ ] No debe haber errores de red

---

### **🚨 Solución de Problemas Comunes**

#### **Error de CORS**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución:** Configurar CORS en tu backend para permitir `http://localhost:4200`

#### **Error 404**
```
GET http://localhost:3000/api/categorias 404 (Not Found)
```
**Solución:** Verificar que la URL del API sea correcta y el endpoint exista

#### **Error de Conexión**
```
net::ERR_CONNECTION_REFUSED
```
**Solución:** Verificar que tu microservicio esté ejecutándose y sea accesible

#### **Error de Tipos**
```
Type 'Observable<CategoriaGasto[]>' is not assignable
```
**Solución:** Verificar que la respuesta del API coincida con la interface `CategoriaGasto`

---

### **📊 Comparación: Antes vs Después**

| Funcionalidad | Antes (Local) | Después (API) |
|---------------|---------------|---------------|
| **Persistencia** | ❌ Solo memoria | ✅ Base de datos |
| **Recarga página** | ❌ Se pierden datos | ✅ Datos persistentes |
| **Múltiples usuarios** | ❌ No sincronizado | ✅ Sincronizado |
| **Actualización selects** | ✅ Instantánea | ✅ Instantánea |
| **Funcionamiento** | ✅ Completo | ✅ Completo |

---

### **🎉 Resultado Final**

Después de completar este checklist:

- ✅ **Las categorías se guardarán permanentemente** en tu base de datos
- ✅ **Los selects seguirán actualizándose automáticamente**
- ✅ **Múltiples usuarios verán las mismas categorías**
- ✅ **La experiencia del usuario será idéntica**
- ✅ **Tendrás sincronización completa con el backend**

---

### **📞 Soporte**

Si tienes problemas durante la migración:

1. **Revisa la consola del navegador** para errores
2. **Verifica el Network tab** para ver las peticiones HTTP
3. **Comprueba que tu microservicio esté ejecutándose**
4. **Verifica que los endpoints del API funcionen** con Postman/Insomnia
5. **Confirma que CORS esté configurado** correctamente

**¡La migración será transparente para los usuarios!** 🚀
