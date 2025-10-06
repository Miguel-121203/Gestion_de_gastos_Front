# Integración con Microservicios

Este documento describe cómo integrar los servicios de gastos e ingresos con sus respectivos microservicios.

## Estructura de Microservicios

### 1. Microservicio de Gastos
- **URL Base**: `http://localhost:8081/api/gastos`
- **Puerto**: 8081
- **Responsabilidad**: Gestión completa de gastos

### 2. Microservicio de Ingresos
- **URL Base**: `http://localhost:8082/api/ingresos`
- **Puerto**: 8082
- **Responsabilidad**: Gestión completa de ingresos

### 3. Microservicio de Categorías
- **URL Base**: `http://localhost:8080/api/categorias`
- **Puerto**: 8080
- **Responsabilidad**: Gestión de categorías personalizadas

## Endpoints Requeridos

### Microservicio de Gastos (Puerto 8081)

```
GET    /api/gastos                    # Obtener todos los gastos
GET    /api/gastos/{id}               # Obtener gasto por ID
POST   /api/gastos                    # Crear nuevo gasto
PUT    /api/gastos/{id}               # Actualizar gasto
DELETE /api/gastos/{id}               # Eliminar gasto
GET    /api/gastos/estadisticas       # Obtener estadísticas
GET    /api/gastos/export/excel       # Exportar a Excel
GET    /api/gastos/export/pdf         # Exportar a PDF
```

### Microservicio de Ingresos (Puerto 8082)

```
GET    /api/ingresos                  # Obtener todos los ingresos
GET    /api/ingresos/{id}             # Obtener ingreso por ID
POST   /api/ingresos                  # Crear nuevo ingreso
PUT    /api/ingresos/{id}             # Actualizar ingreso
DELETE /api/ingresos/{id}             # Eliminar ingreso
GET    /api/ingresos/estadisticas     # Obtener estadísticas
GET    /api/ingresos/export/excel     # Exportar a Excel
GET    /api/ingresos/export/pdf       # Exportar a PDF
```

## Modelos de Datos

### Gasto
```typescript
interface Gasto {
  id: number;
  fecha: string;           // Formato: YYYY-MM-DD
  categoria: string;
  monto: number;
  descripcion: string;
  metodoPago?: string;
  usuarioId?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}
```

### Ingreso
```typescript
interface Ingreso {
  id: number;
  fecha: string;           // Formato: YYYY-MM-DD
  categoria: string;
  monto: number;
  descripcion: string;
  metodoPago?: string;
  usuarioId?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}
```

## Migración de Datos Mock a API

### Paso 1: Activar Llamadas HTTP

En cada servicio, descomenta las secciones marcadas con `TODO`:

```typescript
// En gastos.service.ts
obtenerGastos(): Observable<Gasto[]> {
  // Descomenta esta sección:
  return this.http.get<Gasto[]>(`${this.API_URL}`).pipe(
    tap(gastos => {
      this.gastosSubject.next(gastos);
      this.gastosFiltradosSubject.next(gastos);
    })
  );
  
  // Comenta esta sección:
  // return this.gastos$;
}
```

### Paso 2: Configurar URLs

Actualiza las URLs en cada servicio según tu entorno:

```typescript
// gastos.service.ts
private readonly API_URL = 'http://tu-servidor:8081/api/gastos';

// ingresos.service.ts
private readonly API_URL = 'http://tu-servidor:8082/api/ingresos';

// categorias.service.ts
private readonly API_URL = 'http://tu-servidor:8080/api/categorias';
```

### Paso 3: Manejo de Errores

Implementa manejo de errores consistente:

```typescript
obtenerGastos(): Observable<Gasto[]> {
  return this.http.get<Gasto[]>(`${this.API_URL}`).pipe(
    tap(gastos => {
      this.gastosSubject.next(gastos);
      this.gastosFiltradosSubject.next(gastos);
    }),
    catchError(error => {
      console.error('Error al obtener gastos:', error);
      // Fallback a datos mock en caso de error
      this.gastosSubject.next(this.gastosMock);
      this.gastosFiltradosSubject.next(this.gastosMock);
      return of(this.gastosMock);
    })
  );
}
```

## Funcionalidades de Exportación

### Exportación Local (Actual)
- **Excel**: Usando `xlsx` library
- **PDF**: Usando `jspdf` y `jspdf-autotable`
- **Datos**: Solo datos filtrados en el frontend

### Exportación desde API (Futuro)
- **Excel**: Endpoint `/export/excel`
- **PDF**: Endpoint `/export/pdf`
- **Datos**: Todos los datos del usuario desde el backend
- **Filtros**: Aplicados en el backend

## Configuración de CORS

Asegúrate de que tus microservicios tengan CORS configurado:

```java
// Ejemplo para Spring Boot
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/gastos")
public class GastosController {
    // ...
}
```

## Autenticación y Autorización

### Headers Requeridos
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token,
  'X-User-ID': userId.toString()
};
```

### Interceptor HTTP (Recomendado)
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const userId = this.authService.getUserId();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': userId.toString()
        }
      });
    }
    
    return next.handle(req);
  }
}
```

## Testing

### Datos de Prueba
Los servicios incluyen datos mock para desarrollo y testing:

```typescript
// gastos.service.ts
private gastosMock: Gasto[] = [
  {
    id: 1,
    fecha: '27-05-2025',
    categoria: 'Transportes',
    monto: 350000,
    descripcion: 'transporte de cada semana',
    // ...
  }
  // ...
];
```

### Modo de Desarrollo
Para alternar entre datos mock y API:

```typescript
private readonly USE_MOCK_DATA = true; // Cambiar a false para usar API

obtenerGastos(): Observable<Gasto[]> {
  if (this.USE_MOCK_DATA) {
    return this.gastos$;
  }
  
  return this.http.get<Gasto[]>(`${this.API_URL}`);
}
```

## Consideraciones de Rendimiento

### Paginación
Implementa paginación en los endpoints:

```
GET /api/gastos?page=0&size=20&sort=fecha,desc
```

### Caché
Considera implementar caché en el frontend:

```typescript
@Injectable()
export class GastosService {
  private cache = new Map<string, any>();
  
  obtenerGastos(): Observable<Gasto[]> {
    const cacheKey = 'gastos';
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    
    return this.http.get<Gasto[]>(`${this.API_URL}`).pipe(
      tap(gastos => this.cache.set(cacheKey, gastos))
    );
  }
}
```

## Monitoreo y Logs

### Logging
Implementa logging consistente:

```typescript
obtenerGastos(): Observable<Gasto[]> {
  console.log('Obteniendo gastos desde API...');
  
  return this.http.get<Gasto[]>(`${this.API_URL}`).pipe(
    tap(gastos => console.log(`Gastos obtenidos: ${gastos.length}`)),
    catchError(error => {
      console.error('Error al obtener gastos:', error);
      return throwError(error);
    })
  );
}
```

### Métricas
Considera implementar métricas de rendimiento:

```typescript
obtenerGastos(): Observable<Gasto[]> {
  const startTime = performance.now();
  
  return this.http.get<Gasto[]>(`${this.API_URL}`).pipe(
    tap(() => {
      const endTime = performance.now();
      console.log(`Tiempo de respuesta: ${endTime - startTime}ms`);
    })
  );
}
```

## Checklist de Migración

- [ ] Configurar URLs de microservicios
- [ ] Descomentar llamadas HTTP
- [ ] Implementar manejo de errores
- [ ] Configurar CORS en microservicios
- [ ] Implementar autenticación
- [ ] Agregar interceptores HTTP
- [ ] Configurar paginación
- [ ] Implementar caché
- [ ] Agregar logging
- [ ] Probar funcionalidades
- [ ] Optimizar rendimiento
- [ ] Documentar APIs
