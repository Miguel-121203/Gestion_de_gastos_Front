# 🔄 Guía de Migración: Local → Microservicio API

## 📋 **Pasos para Conectar con tu Microservicio**

### **Paso 1: Configurar la URL del API**

Edita el archivo `src/app/services/categorias.service.ts`:

```typescript
// CAMBIAR ESTA LÍNEA:
private readonly API_URL = 'http://localhost:8080/api/categorias'; // Cambiar según tu configuración

// POR TU URL REAL:
private readonly API_URL = 'http://tu-servidor:puerto/api/categorias';
```

**Ejemplos de URLs:**
- Local: `http://localhost:3000/api/categorias`
- Producción: `https://api.tudominio.com/categorias`
- Docker: `http://categorias-service:8080/api/categorias`

---

### **Paso 2: Actualizar Método `obtenerCategorias()`**

**ANTES (líneas 34-40):**
```typescript
obtenerCategorias(): Observable<CategoriaGasto[]> {
  // En un entorno real, harías una llamada HTTP:
  // return this.http.get<CategoriaGasto[]>(this.API_URL);
  
  // Por ahora, retornamos los datos locales
  return this.categorias$;
}
```

**DESPUÉS:**
```typescript
obtenerCategorias(): Observable<CategoriaGasto[]> {
  return this.http.get<CategoriaGasto[]>(this.API_URL).pipe(
    tap(categorias => {
      // Actualizar datos locales cuando lleguen del servidor
      this.categorias = categorias;
      this.categoriasSubject.next([...this.categorias]);
    }),
    catchError(error => {
      console.error('Error al obtener categorías:', error);
      // Fallback a datos locales en caso de error
      return this.categorias$;
    })
  );
}
```

**No olvides agregar los imports:**
```typescript
import { tap, catchError } from 'rxjs/operators';
```

---

### **Paso 3: Actualizar Método `crearCategoria()`**

**ANTES (líneas 43-60):**
```typescript
crearCategoria(categoria: Omit<CategoriaGasto, 'id'>): Observable<CategoriaGasto> {
  const nuevaCategoria: CategoriaGasto = {
    ...categoria,
    id: this.obtenerSiguienteId()
  };

  // En un entorno real, harías una llamada HTTP:
  // return this.http.post<CategoriaGasto>(this.API_URL, categoria);

  // Por ahora, agregamos localmente
  this.categorias.push(nuevaCategoria);
  this.categoriasSubject.next([...this.categorias]);
  
  // Notificar a otros servicios que las categorías han cambiado
  this.notificarCambioCategorias();
  
  return of(nuevaCategoria);
}
```

**DESPUÉS:**
```typescript
crearCategoria(categoria: Omit<CategoriaGasto, 'id'>): Observable<CategoriaGasto> {
  return this.http.post<CategoriaGasto>(this.API_URL, categoria).pipe(
    tap(nuevaCategoria => {
      // Agregar la nueva categoría a la lista local
      this.categorias.push(nuevaCategoria);
      this.categoriasSubject.next([...this.categorias]);
      
      // Notificar a otros servicios que las categorías han cambiado
      this.notificarCambioCategorias();
      
      console.log('Categoría creada exitosamente:', nuevaCategoria);
    }),
    catchError(error => {
      console.error('Error al crear categoría:', error);
      throw error; // Re-lanzar el error para que el componente lo maneje
    })
  );
}
```

---

### **Paso 4: Actualizar Método `actualizarCategoria()`**

**ANTES (líneas 63-78):**
```typescript
actualizarCategoria(id: number, categoria: Partial<CategoriaGasto>): Observable<CategoriaGasto | null> {
  const index = this.categorias.findIndex(c => c.id === id);
  if (index !== -1) {
    // En un entorno real, harías una llamada HTTP:
    // return this.http.put<CategoriaGasto>(`${this.API_URL}/${id}`, categoria);

    // Por ahora, actualizamos localmente
    this.categorias[index] = { ...this.categorias[index], ...categoria };
    this.categoriasSubject.next([...this.categorias]);
    
    // Notificar a otros servicios que las categorías han cambiado
    this.notificarCambioCategorias();
    
    return of(this.categorias[index]);
  }
  return of(null);
}
```

**DESPUÉS:**
```typescript
actualizarCategoria(id: number, categoria: Partial<CategoriaGasto>): Observable<CategoriaGasto | null> {
  return this.http.put<CategoriaGasto>(`${this.API_URL}/${id}`, categoria).pipe(
    tap(categoriaActualizada => {
      // Actualizar la categoría en la lista local
      const index = this.categorias.findIndex(c => c.id === id);
      if (index !== -1) {
        this.categorias[index] = categoriaActualizada;
        this.categoriasSubject.next([...this.categorias]);
        
        // Notificar a otros servicios que las categorías han cambiado
        this.notificarCambioCategorias();
      }
      
      console.log('Categoría actualizada exitosamente:', categoriaActualizada);
    }),
    catchError(error => {
      console.error('Error al actualizar categoría:', error);
      throw error;
    })
  );
}
```

---

### **Paso 5: Actualizar Método `eliminarCategoria()`**

**ANTES (líneas 82-95):**
```typescript
eliminarCategoria(id: number): Observable<boolean> {
  const index = this.categorias.findIndex(c => c.id === id);
  if (index !== -1) {
    // En un entorno real, harías una llamada HTTP:
    // return this.http.delete<boolean>(`${this.API_URL}/${id}`);

    // Por ahora, eliminamos localmente
    this.categorias.splice(index, 1);
    this.categoriasSubject.next([...this.categorias]);
    
    // Notificar a otros servicios que las categorías han cambiado
    this.notificarCambioCategorias();
    
    return of(true);
  }
  return of(false);
}
```

**DESPUÉS:**
```typescript
eliminarCategoria(id: number): Observable<boolean> {
  return this.http.delete<boolean>(`${this.API_URL}/${id}`).pipe(
    tap(() => {
      // Eliminar la categoría de la lista local
      const index = this.categorias.findIndex(c => c.id === id);
      if (index !== -1) {
        this.categorias.splice(index, 1);
        this.categoriasSubject.next([...this.categorias]);
        
        // Notificar a otros servicios que las categorías han cambiado
        this.notificarCambioCategorias();
      }
      
      console.log('Categoría eliminada exitosamente');
    }),
    catchError(error => {
      console.error('Error al eliminar categoría:', error);
      throw error;
    })
  );
}
```

---

### **Paso 6: Actualizar Método `obtenerCategoriaPorId()`**

**ANTES (líneas 98-102):**
```typescript
obtenerCategoriaPorId(id: number): Observable<CategoriaGasto | null> {
  const categoria = this.categorias.find(c => c.id === id);
  return of(categoria || null);
}
```

**DESPUÉS:**
```typescript
obtenerCategoriaPorId(id: number): Observable<CategoriaGasto | null> {
  return this.http.get<CategoriaGasto>(`${this.API_URL}/${id}`).pipe(
    catchError(error => {
      console.error('Error al obtener categoría por ID:', error);
      return of(null);
    })
  );
}
```

---

### **Paso 7: Actualizar Constructor**

**ANTES:**
```typescript
constructor(private http: HttpClient) {
  this.categoriasSubject.next(this.categorias);
}
```

**DESPUÉS:**
```typescript
constructor(private http: HttpClient) {
  // Cargar categorías desde el servidor al inicializar
  this.obtenerCategorias().subscribe();
}
```

---

### **Paso 8: Agregar Método de Sincronización (Opcional)**

Agrega este método al final de la clase:

```typescript
// Método para sincronizar con el backend (cuando esté disponible)
sincronizarConBackend(): Observable<CategoriaGasto[]> {
  return this.http.get<CategoriaGasto[]>(this.API_URL).pipe(
    tap(categorias => {
      this.categorias = categorias;
      this.categoriasSubject.next([...this.categorias]);
      console.log('Sincronización completada:', categorias);
    }),
    catchError(error => {
      console.error('Error en sincronización:', error);
      return of(this.categorias);
    })
  );
}
```

---

## 🧪 **Verificación Post-Migración**

### **1. Verificar Imports**
Asegúrate de tener estos imports al inicio del archivo:
```typescript
import { tap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
```

### **2. Probar Funcionalidades**
- ✅ Crear nueva categoría
- ✅ Listar categorías
- ✅ Actualizar categoría
- ✅ Eliminar categoría
- ✅ Verificar que los selects se actualizan

### **3. Verificar Consola**
- ✅ No debe haber errores de CORS
- ✅ Las peticiones HTTP deben aparecer en Network tab
- ✅ Los logs de éxito deben aparecer en consola

---

## 🚨 **Posibles Errores y Soluciones**

### **Error de CORS:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/categorias' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solución:** Configurar CORS en tu microservicio backend.

### **Error 404:**
```
GET http://localhost:3000/api/categorias 404 (Not Found)
```

**Solución:** Verificar que la URL del API sea correcta y que el endpoint exista.

### **Error de Tipos:**
```
Type 'Observable<CategoriaGasto[]>' is not assignable to type 'Observable<CategoriaGasto[]>'
```

**Solución:** Verificar que el tipo de respuesta del API coincida con la interface `CategoriaGasto`.

---

## 🎯 **Resultado Final**

Después de estos cambios:
- ✅ Las categorías se guardarán en la base de datos
- ✅ Persistirán entre sesiones
- ✅ Los selects seguirán actualizándose automáticamente
- ✅ Múltiples usuarios podrán ver las mismas categorías
- ✅ Tendrás sincronización completa con el backend

**¡La migración será transparente para los usuarios!** 🚀
