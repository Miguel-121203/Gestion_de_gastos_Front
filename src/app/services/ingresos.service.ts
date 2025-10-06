import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Ingreso {
  id: number;
  fecha: string;
  categoria: string;
  monto: number;
  descripcion: string;
  metodoPago?: string;
  usuarioId?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface FiltrosIngresos {
  categoria?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  metodoPago?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  private http = inject(HttpClient);

  // BehaviorSubjects para manejo de estado
  private ingresosSubject = new BehaviorSubject<Ingreso[]>([]);
  private ingresosFiltradosSubject = new BehaviorSubject<Ingreso[]>([]);

  // Observables públicos
  public ingresos$ = this.ingresosSubject.asObservable();
  public ingresosFiltrados$ = this.ingresosFiltradosSubject.asObservable();

  // URL del microservicio de ingresos (debe ser configurada según tu entorno)
  private readonly API_URL = 'http://localhost:8082/api/ingresos'; // Cambiar según tu configuración

  // Datos mock para desarrollo (se eliminarán cuando se conecte con la API)
  private ingresosMock: Ingreso[] = [
    {
      id: 1,
      fecha: '27-05-2025',
      categoria: 'Salario',
      monto: 2500000,
      descripcion: 'Pago mensual de nómina',
      metodoPago: 'Transferencia',
      usuarioId: 1,
      fechaCreacion: new Date('2025-05-27'),
      fechaActualizacion: new Date('2025-05-27')
    },
    {
      id: 2,
      fecha: '15-06-2025',
      categoria: 'Freelance',
      monto: 800000,
      descripcion: 'Proyecto de desarrollo web',
      metodoPago: 'Transferencia',
      usuarioId: 1,
      fechaCreacion: new Date('2025-06-15'),
      fechaActualizacion: new Date('2025-06-15')
    },
    {
      id: 3,
      fecha: '10-07-2025',
      categoria: 'Inversión',
      monto: 150000,
      descripcion: 'Dividendos de acciones',
      metodoPago: 'Transferencia',
      usuarioId: 1,
      fechaCreacion: new Date('2025-07-10'),
      fechaActualizacion: new Date('2025-07-10')
    },
    {
      id: 4,
      fecha: '05-08-2025',
      categoria: 'Venta',
      monto: 300000,
      descripcion: 'Venta de productos usados',
      metodoPago: 'Efectivo',
      usuarioId: 1,
      fechaCreacion: new Date('2025-08-05'),
      fechaActualizacion: new Date('2025-08-05')
    },
    {
      id: 5,
      fecha: '20-08-2025',
      categoria: 'Regalo',
      monto: 100000,
      descripcion: 'Regalo de cumpleaños',
      metodoPago: 'Efectivo',
      usuarioId: 1,
      fechaCreacion: new Date('2025-08-20'),
      fechaActualizacion: new Date('2025-08-20')
    }
  ];

  constructor() {
    // Inicializar con datos mock
    this.ingresosSubject.next(this.ingresosMock);
    this.ingresosFiltradosSubject.next(this.ingresosMock);
  }

  // ===== CRUD OPERATIONS =====

  /**
   * Obtiene todos los ingresos
   */
  obtenerIngresos(): Observable<Ingreso[]> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.get<Ingreso[]>(`${this.API_URL}`).pipe(
      tap(ingresos => {
        this.ingresosSubject.next(ingresos);
        this.ingresosFiltradosSubject.next(ingresos);
      })
    );
    */
    
    // Implementación temporal con datos mock
    return this.ingresos$;
  }

  /**
   * Obtiene un ingreso por ID
   */
  obtenerIngresoPorId(id: number): Observable<Ingreso> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.get<Ingreso>(`${this.API_URL}/${id}`);
    */
    
    // Implementación temporal con datos mock
    const ingreso = this.ingresosMock.find(i => i.id === id);
    return new Observable(observer => {
      if (ingreso) {
        observer.next(ingreso);
      } else {
        observer.error('Ingreso no encontrado');
      }
      observer.complete();
    });
  }

  /**
   * Crea un nuevo ingreso
   */
  crearIngreso(ingreso: Omit<Ingreso, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Observable<Ingreso> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.post<Ingreso>(`${this.API_URL}`, ingreso).pipe(
      tap(nuevoIngreso => {
        const ingresos = this.ingresosSubject.value;
        this.ingresosSubject.next([nuevoIngreso, ...ingresos]);
        this.ingresosFiltradosSubject.next([nuevoIngreso, ...ingresos]);
      })
    );
    */
    
    // Implementación temporal con datos mock
    const nuevoIngreso: Ingreso = {
      ...ingreso,
      id: Math.max(...this.ingresosMock.map(i => i.id)) + 1,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    
    this.ingresosMock.unshift(nuevoIngreso);
    this.ingresosSubject.next([...this.ingresosMock]);
    this.ingresosFiltradosSubject.next([...this.ingresosMock]);
    
    return new Observable(observer => {
      observer.next(nuevoIngreso);
      observer.complete();
    });
  }

  /**
   * Actualiza un ingreso existente
   */
  actualizarIngreso(id: number, ingreso: Partial<Ingreso>): Observable<Ingreso> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.put<Ingreso>(`${this.API_URL}/${id}`, ingreso).pipe(
      tap(ingresoActualizado => {
        const ingresos = this.ingresosSubject.value;
        const index = ingresos.findIndex(i => i.id === id);
        if (index !== -1) {
          ingresos[index] = ingresoActualizado;
          this.ingresosSubject.next([...ingresos]);
          this.ingresosFiltradosSubject.next([...ingresos]);
        }
      })
    );
    */
    
    // Implementación temporal con datos mock
    const index = this.ingresosMock.findIndex(i => i.id === id);
    if (index !== -1) {
      this.ingresosMock[index] = {
        ...this.ingresosMock[index],
        ...ingreso,
        fechaActualizacion: new Date()
      };
      this.ingresosSubject.next([...this.ingresosMock]);
      this.ingresosFiltradosSubject.next([...this.ingresosMock]);
      
      return new Observable(observer => {
        observer.next(this.ingresosMock[index]);
        observer.complete();
      });
    } else {
      return new Observable(observer => {
        observer.error('Ingreso no encontrado');
        observer.complete();
      });
    }
  }

  /**
   * Elimina un ingreso
   */
  eliminarIngreso(id: number): Observable<boolean> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.delete<boolean>(`${this.API_URL}/${id}`).pipe(
      tap(success => {
        if (success) {
          const ingresos = this.ingresosSubject.value.filter(i => i.id !== id);
          this.ingresosSubject.next(ingresos);
          this.ingresosFiltradosSubject.next(ingresos);
        }
      })
    );
    */
    
    // Implementación temporal con datos mock
    const index = this.ingresosMock.findIndex(i => i.id === id);
    if (index !== -1) {
      this.ingresosMock.splice(index, 1);
      this.ingresosSubject.next([...this.ingresosMock]);
      this.ingresosFiltradosSubject.next([...this.ingresosMock]);
      
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    } else {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }
  }

  // ===== FILTERING AND SEARCH =====

  /**
   * Aplica filtros a los ingresos
   */
  aplicarFiltros(filtros: FiltrosIngresos): void {
    let ingresosFiltrados = [...this.ingresosSubject.value];

    if (filtros.categoria) {
      ingresosFiltrados = ingresosFiltrados.filter(i => 
        i.categoria.toLowerCase().includes(filtros.categoria!.toLowerCase())
      );
    }

    if (filtros.montoMinimo) {
      ingresosFiltrados = ingresosFiltrados.filter(i => i.monto >= filtros.montoMinimo!);
    }

    if (filtros.montoMaximo) {
      ingresosFiltrados = ingresosFiltrados.filter(i => i.monto <= filtros.montoMaximo!);
    }

    if (filtros.fechaInicio) {
      ingresosFiltrados = ingresosFiltrados.filter(i => 
        new Date(i.fecha) >= filtros.fechaInicio!
      );
    }

    if (filtros.fechaFin) {
      ingresosFiltrados = ingresosFiltrados.filter(i => 
        new Date(i.fecha) <= filtros.fechaFin!
      );
    }

    if (filtros.metodoPago) {
      ingresosFiltrados = ingresosFiltrados.filter(i => 
        i.metodoPago?.toLowerCase().includes(filtros.metodoPago!.toLowerCase())
      );
    }

    this.ingresosFiltradosSubject.next(ingresosFiltrados);
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros(): void {
    this.ingresosFiltradosSubject.next([...this.ingresosSubject.value]);
  }

  /**
   * Obtiene ingresos filtrados
   */
  obtenerIngresosFiltrados(): Observable<Ingreso[]> {
    return this.ingresosFiltrados$;
  }

  // ===== STATISTICS =====

  /**
   * Obtiene estadísticas de ingresos
   */
  obtenerEstadisticas(): Observable<any> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.get<any>(`${this.API_URL}/estadisticas`);
    */
    
    // Implementación temporal con datos mock
    const ingresos = this.ingresosSubject.value;
    const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
    const ingresosPorCategoria = ingresos.reduce((acc, i) => {
      acc[i.categoria] = (acc[i.categoria] || 0) + i.monto;
      return acc;
    }, {} as any);

    return new Observable(observer => {
      observer.next({
        totalIngresos,
        cantidadIngresos: ingresos.length,
        ingresosPorCategoria,
        promedioIngresos: totalIngresos / ingresos.length || 0
      });
      observer.complete();
    });
  }

  // ===== UTILITY METHODS =====

  /**
   * Formatea un monto como moneda colombiana
   */
  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(monto);
  }

  /**
   * Obtiene el total de ingresos filtrados
   */
  obtenerTotalIngresosFiltrados(): number {
    return this.ingresosFiltradosSubject.value.reduce((sum, i) => sum + i.monto, 0);
  }
}
