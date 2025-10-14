import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoriaGasto } from '../models/models-module';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private categoriasSubject = new BehaviorSubject<CategoriaGasto[]>([]);
  public categorias$ = this.categoriasSubject.asObservable();

  // URL del microservicio (debe ser configurada según tu entorno)
  private readonly API_URL = 'http://localhost:8080/api/categorias'; // Cambiar según tu configuración

  private categorias: CategoriaGasto[] = [
    // Categorías por defecto del sistema
    { id: 1, nombre: 'Alimentación', icono: 'restaurant', descripcion: 'Comidas y bebidas', color: '#FF6B6B' },
    { id: 2, nombre: 'Transporte', icono: 'directions_car', descripcion: 'Gasolina, transporte público', color: '#4ECDC4' },
    { id: 3, nombre: 'Vivienda', icono: 'home', descripcion: 'Alquiler, servicios públicos', color: '#45B7D1' },
    { id: 4, nombre: 'Salud', icono: 'local_hospital', descripcion: 'Medicinas, consultas médicas', color: '#96CEB4' },
    { id: 5, nombre: 'Educación', icono: 'school', descripcion: 'Cursos, libros, materiales', color: '#FFEAA7' },
    { id: 6, nombre: 'Entretenimiento', icono: 'movie', descripcion: 'Cine, juegos, hobbies', color: '#DDA0DD' },
    { id: 7, nombre: 'Ropa', icono: 'checkroom', descripcion: 'Vestimenta y accesorios', color: '#FFB6C1' },
    { id: 8, nombre: 'Tecnología', icono: 'computer', descripcion: 'Dispositivos, software', color: '#98D8C8' },
    { id: 9, nombre: 'Otros', icono: 'category', descripcion: 'Gastos diversos', color: '#F7DC6F' }
  ];

  constructor(private http: HttpClient) {
    this.categoriasSubject.next(this.categorias);
  }

  // Obtener todas las categorías
  obtenerCategorias(): Observable<CategoriaGasto[]> {
    // En un entorno real, harías una llamada HTTP:
    // return this.http.get<CategoriaGasto[]>(this.API_URL);
    
    // Por ahora, retornamos los datos locales
    return this.categorias$;
  }

  // Crear nueva categoría
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

  // Actualizar categoría existente
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

  // Eliminar categoría
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

  // Obtener categoría por ID
  obtenerCategoriaPorId(id: number): Observable<CategoriaGasto | null> {
    const categoria = this.categorias.find(c => c.id === id);
    return of(categoria || null);
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
    
    const textoLower = texto.toLowerCase();
    const categoriasFiltradas = this.categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(textoLower) ||
      categoria.descripcion?.toLowerCase().includes(textoLower)
    );
    
    return of(categoriasFiltradas);
  }

  // Obtener el siguiente ID disponible
  private obtenerSiguienteId(): number {
    const maxId = Math.max(...this.categorias.map(c => c.id));
    return maxId + 1;
  }

  // Notificar a otros servicios que las categorías han cambiado
  private notificarCambioCategorias() {
    // Aquí podrías emitir un evento global o usar un servicio de notificaciones
    // para que otros componentes se enteren de los cambios en las categorías
    console.log('Categorías actualizadas:', this.categorias);
  }

  // Método para sincronizar con el backend (cuando esté disponible)
  sincronizarConBackend(): Observable<CategoriaGasto[]> {
    // Este método se usaría cuando el microservicio esté disponible
    return this.http.get<CategoriaGasto[]>(this.API_URL).pipe(
      // Manejo de errores
      // catchError(error => this.manejarError(error))
    );
  }

  // Método para manejar errores de HTTP
  private manejarError(error: any): Observable<never> {
    console.error('Error en CategoriasService:', error);
    return throwError(() => new Error('Error al comunicarse con el servidor'));
  }
}
