// EJEMPLO COMPLETO: CategoriasService con API Backend
// Este archivo muestra cómo se verá el servicio después de conectar con el microservicio

import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { CategoriaGasto } from '../models/models-module';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private categoriasSubject = new BehaviorSubject<CategoriaGasto[]>([]);
  public categorias$ = this.categoriasSubject.asObservable();

  // URL del microservicio (CONFIGURAR SEGÚN TU ENTORNO)
  private readonly API_URL = 'http://localhost:8080/api/categorias';

  private categorias: CategoriaGasto[] = [];

  constructor(private http: HttpClient) {
    // Cargar categorías desde el servidor al inicializar
    this.obtenerCategorias().subscribe();
  }

  // Obtener todas las categorías desde el API
  obtenerCategorias(): Observable<CategoriaGasto[]> {
    return this.http.get<CategoriaGasto[]>(this.API_URL).pipe(
      tap(categorias => {
        // Actualizar datos locales cuando lleguen del servidor
        this.categorias = categorias;
        this.categoriasSubject.next([...this.categorias]);
        console.log('Categorías cargadas desde API:', categorias);
      }),
      catchError(error => {
        console.error('Error al obtener categorías:', error);
        // Fallback a datos locales en caso de error
        return this.categorias$;
      })
    );
  }

  // Crear nueva categoría en el API
  crearCategoria(categoria: Omit<CategoriaGasto, 'id'>): Observable<CategoriaGasto> {
    return this.http.post<CategoriaGasto>(this.API_URL, categoria).pipe(
      tap(nuevaCategoria => {
        // Agregar la nueva categoría a la lista local
        this.categorias.push(nuevaCategoria);
        this.categoriasSubject.next([...this.categorias]);
        
        // Notificar a otros servicios que las categorías han cambiado
        this.notificarCambioCategorias();
        
        console.log('Categoría creada exitosamente en API:', nuevaCategoria);
      }),
      catchError(error => {
        console.error('Error al crear categoría:', error);
        throw error; // Re-lanzar el error para que el componente lo maneje
      })
    );
  }

  // Actualizar categoría existente en el API
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
        
        console.log('Categoría actualizada exitosamente en API:', categoriaActualizada);
      }),
      catchError(error => {
        console.error('Error al actualizar categoría:', error);
        throw error;
      })
    );
  }

  // Eliminar categoría del API
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
        
        console.log('Categoría eliminada exitosamente del API');
      }),
      catchError(error => {
        console.error('Error al eliminar categoría:', error);
        throw error;
      })
    );
  }

  // Obtener categoría específica del API
  obtenerCategoriaPorId(id: number): Observable<CategoriaGasto | null> {
    return this.http.get<CategoriaGasto>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener categoría por ID:', error);
        return of(null);
      })
    );
  }

  // Obtener categorías para select (solo nombre y valor)
  obtenerCategoriasParaSelect(): Observable<{value: string, label: string}[]> {
    return of(
      this.categorias.map(categoria => ({
        value: categoria.nombre.toLowerCase().replace(/\s+/g, '_'),
        label: categoria.nombre
      }))
    );
  }

  // Buscar categorías por texto
  buscarCategorias(texto: string): Observable<CategoriaGasto[]> {
    if (!texto.trim()) {
      return this.obtenerCategorias();
    }
    
    // En un entorno real, podrías hacer una búsqueda en el servidor:
    // return this.http.get<CategoriaGasto[]>(`${this.API_URL}/search?q=${texto}`);
    
    // Por ahora, buscamos localmente
    const textoLower = texto.toLowerCase();
    const categoriasFiltradas = this.categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(textoLower) ||
      categoria.descripcion?.toLowerCase().includes(textoLower)
    );
    
    return of(categoriasFiltradas);
  }

  // Método para sincronizar con el backend
  sincronizarConBackend(): Observable<CategoriaGasto[]> {
    return this.http.get<CategoriaGasto[]>(this.API_URL).pipe(
      tap(categorias => {
        this.categorias = categorias;
        this.categoriasSubject.next([...this.categorias]);
        console.log('Sincronización completada con API:', categorias);
      }),
      catchError(error => {
        console.error('Error en sincronización:', error);
        return of(this.categorias);
      })
    );
  }

  // Notificar a otros servicios que las categorías han cambiado
  private notificarCambioCategorias() {
    // Aquí podrías emitir un evento global o usar un servicio de notificaciones
    // para que otros componentes se enteren de los cambios en las categorías
    console.log('Categorías actualizadas - notificando cambios:', this.categorias);
    
    // Ejemplo: podrías emitir un evento personalizado
    // window.dispatchEvent(new CustomEvent('categorias-cambiadas', { 
    //   detail: this.categorias 
    // }));
  }

  // Método para manejar errores de HTTP
  private manejarError(error: any): Observable<never> {
    console.error('Error en CategoriasService:', error);
    
    // Aquí podrías agregar lógica específica según el tipo de error
    if (error.status === 404) {
      console.error('Endpoint no encontrado - verificar URL del API');
    } else if (error.status === 500) {
      console.error('Error interno del servidor');
    } else if (error.status === 0) {
      console.error('No se puede conectar al servidor - verificar que esté ejecutándose');
    }
    
    return throwError(() => new Error('Error al comunicarse con el servidor'));
  }

  // Método para obtener estadísticas (ejemplo adicional)
  obtenerEstadisticas(): Observable<{
    total: number;
    activas: number;
    inactivas: number;
  }> {
    const total = this.categorias.length;
    const activas = this.categorias.filter(c => c.activa !== false).length;
    const inactivas = total - activas;
    
    return of({ total, activas, inactivas });
  }

  // Método para validar si una categoría existe
  categoriaExiste(nombre: string): boolean {
    return this.categorias.some(c => 
      c.nombre.toLowerCase() === nombre.toLowerCase()
    );
  }

  // Método para obtener categorías por color (ejemplo adicional)
  obtenerCategoriasPorColor(color: string): Observable<CategoriaGasto[]> {
    const categoriasFiltradas = this.categorias.filter(c => c.color === color);
    return of(categoriasFiltradas);
  }
}

/*
CONFIGURACIÓN ADICIONAL NECESARIA:

1. En tu microservicio backend, asegúrate de tener estos endpoints:
   - GET    /api/categorias           - Obtener todas las categorías
   - POST   /api/categorias           - Crear nueva categoría
   - GET    /api/categorias/:id       - Obtener categoría por ID
   - PUT    /api/categorias/:id       - Actualizar categoría
   - DELETE /api/categorias/:id       - Eliminar categoría

2. Configurar CORS en tu backend para permitir requests desde:
   - http://localhost:4200 (desarrollo)
   - https://tu-dominio.com (producción)

3. Estructura de respuesta esperada del API:
   {
     "id": 1,
     "nombre": "Alimentación",
     "icono": "🍽️",
     "descripcion": "Comidas y bebidas",
     "color": "#FF6B6B",
     "activa": true,
     "fechaCreacion": "2025-01-01T00:00:00.000Z"
   }

4. Headers recomendados para las peticiones:
   - Content-Type: application/json
   - Accept: application/json
   - Authorization: Bearer token (si usas autenticación)
*/
