import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Gasto {
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

export interface FiltrosGastos {
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
export class GastosService {
  private http = inject(HttpClient);

  // BehaviorSubjects para manejo de estado
  private gastosSubject = new BehaviorSubject<Gasto[]>([]);
  private gastosFiltradosSubject = new BehaviorSubject<Gasto[]>([]);

  // Observables públicos
  public gastos$ = this.gastosSubject.asObservable();
  public gastosFiltrados$ = this.gastosFiltradosSubject.asObservable();

  // URL del microservicio de gastos (debe ser configurada según tu entorno)
  private readonly API_URL = 'http://localhost:8081/api/gastos'; // Cambiar según tu configuración

  // Datos mock para desarrollo (se eliminarán cuando se conecte con la API)
  private gastosMock: Gasto[] = [
    {
      id: 1,
      fecha: '27-05-2025',
      categoria: 'Transportes',
      monto: 350000,
      descripcion: 'transporte de cada semana',
      metodoPago: 'Efectivo',
      usuarioId: 1,
      fechaCreacion: new Date('2025-05-27'),
      fechaActualizacion: new Date('2025-05-27')
    },
    {
      id: 2,
      fecha: '27-06-2025',
      categoria: 'Comida',
      monto: 450000,
      descripcion: 'mercado del mes',
      metodoPago: 'Tarjeta',
      usuarioId: 1,
      fechaCreacion: new Date('2025-06-27'),
      fechaActualizacion: new Date('2025-06-27')
    },
    {
      id: 3,
      fecha: '27-07-2025',
      categoria: 'Servicio electrico',
      monto: 50000,
      descripcion: 'pago de la energia',
      metodoPago: 'Transferencia',
      usuarioId: 1,
      fechaCreacion: new Date('2025-07-27'),
      fechaActualizacion: new Date('2025-07-27')
    },
    {
      id: 4,
      fecha: '27-08-2025',
      categoria: 'Servicio acueducto',
      monto: 50000,
      descripcion: 'pago del agua',
      metodoPago: 'Transferencia',
      usuarioId: 1,
      fechaCreacion: new Date('2025-08-27'),
      fechaActualizacion: new Date('2025-08-27')
    },
    {
      id: 5,
      fecha: '27-08-2025',
      categoria: 'Servicio gas',
      monto: 50000,
      descripcion: 'pago del gas',
      metodoPago: 'Transferencia',
      usuarioId: 1,
      fechaCreacion: new Date('2025-08-27'),
      fechaActualizacion: new Date('2025-08-27')
    }
  ];

  constructor() {
    // Inicializar con datos mock
    this.gastosSubject.next(this.gastosMock);
    this.gastosFiltradosSubject.next(this.gastosMock);
  }

  // ===== CRUD OPERATIONS =====

  /**
   * Obtiene todos los gastos
   */
  obtenerGastos(): Observable<Gasto[]> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.get<Gasto[]>(`${this.API_URL}`).pipe(
      tap(gastos => {
        this.gastosSubject.next(gastos);
        this.gastosFiltradosSubject.next(gastos);
      })
    );
    */
    
    // Implementación temporal con datos mock
    return this.gastos$;
  }

  /**
   * Obtiene un gasto por ID
   */
  obtenerGastoPorId(id: number): Observable<Gasto> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.get<Gasto>(`${this.API_URL}/${id}`);
    */
    
    // Implementación temporal con datos mock
    const gasto = this.gastosMock.find(g => g.id === id);
    return new Observable(observer => {
      if (gasto) {
        observer.next(gasto);
      } else {
        observer.error('Gasto no encontrado');
      }
      observer.complete();
    });
  }

  /**
   * Crea un nuevo gasto
   */
  crearGasto(gasto: Omit<Gasto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Observable<Gasto> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.post<Gasto>(`${this.API_URL}`, gasto).pipe(
      tap(nuevoGasto => {
        const gastos = this.gastosSubject.value;
        this.gastosSubject.next([nuevoGasto, ...gastos]);
        this.gastosFiltradosSubject.next([nuevoGasto, ...gastos]);
      })
    );
    */
    
    // Implementación temporal con datos mock
    const nuevoGasto: Gasto = {
      ...gasto,
      id: Math.max(...this.gastosMock.map(g => g.id)) + 1,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    
    this.gastosMock.unshift(nuevoGasto);
    this.gastosSubject.next([...this.gastosMock]);
    this.gastosFiltradosSubject.next([...this.gastosMock]);
    
    return new Observable(observer => {
      observer.next(nuevoGasto);
      observer.complete();
    });
  }

  /**
   * Actualiza un gasto existente
   */
  actualizarGasto(id: number, gasto: Partial<Gasto>): Observable<Gasto> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.put<Gasto>(`${this.API_URL}/${id}`, gasto).pipe(
      tap(gastoActualizado => {
        const gastos = this.gastosSubject.value;
        const index = gastos.findIndex(g => g.id === id);
        if (index !== -1) {
          gastos[index] = gastoActualizado;
          this.gastosSubject.next([...gastos]);
          this.gastosFiltradosSubject.next([...gastos]);
        }
      })
    );
    */
    
    // Implementación temporal con datos mock
    const index = this.gastosMock.findIndex(g => g.id === id);
    if (index !== -1) {
      this.gastosMock[index] = {
        ...this.gastosMock[index],
        ...gasto,
        fechaActualizacion: new Date()
      };
      this.gastosSubject.next([...this.gastosMock]);
      this.gastosFiltradosSubject.next([...this.gastosMock]);
      
      return new Observable(observer => {
        observer.next(this.gastosMock[index]);
        observer.complete();
      });
    } else {
      return new Observable(observer => {
        observer.error('Gasto no encontrado');
        observer.complete();
      });
    }
  }

  /**
   * Elimina un gasto
   */
  eliminarGasto(id: number): Observable<boolean> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.delete<boolean>(`${this.API_URL}/${id}`).pipe(
      tap(success => {
        if (success) {
          const gastos = this.gastosSubject.value.filter(g => g.id !== id);
          this.gastosSubject.next(gastos);
          this.gastosFiltradosSubject.next(gastos);
        }
      })
    );
    */
    
    // Implementación temporal con datos mock
    const index = this.gastosMock.findIndex(g => g.id === id);
    if (index !== -1) {
      this.gastosMock.splice(index, 1);
      this.gastosSubject.next([...this.gastosMock]);
      this.gastosFiltradosSubject.next([...this.gastosMock]);
      
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
   * Aplica filtros a los gastos
   */
  aplicarFiltros(filtros: FiltrosGastos): void {
    let gastosFiltrados = [...this.gastosSubject.value];

    if (filtros.categoria) {
      gastosFiltrados = gastosFiltrados.filter(g => 
        g.categoria.toLowerCase().includes(filtros.categoria!.toLowerCase())
      );
    }

    if (filtros.montoMinimo) {
      gastosFiltrados = gastosFiltrados.filter(g => g.monto >= filtros.montoMinimo!);
    }

    if (filtros.montoMaximo) {
      gastosFiltrados = gastosFiltrados.filter(g => g.monto <= filtros.montoMaximo!);
    }

    if (filtros.fechaInicio) {
      gastosFiltrados = gastosFiltrados.filter(g => 
        new Date(g.fecha) >= filtros.fechaInicio!
      );
    }

    if (filtros.fechaFin) {
      gastosFiltrados = gastosFiltrados.filter(g => 
        new Date(g.fecha) <= filtros.fechaFin!
      );
    }

    if (filtros.metodoPago) {
      gastosFiltrados = gastosFiltrados.filter(g => 
        g.metodoPago?.toLowerCase().includes(filtros.metodoPago!.toLowerCase())
      );
    }

    this.gastosFiltradosSubject.next(gastosFiltrados);
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros(): void {
    this.gastosFiltradosSubject.next([...this.gastosSubject.value]);
  }

  /**
   * Obtiene gastos filtrados
   */
  obtenerGastosFiltrados(): Observable<Gasto[]> {
    return this.gastosFiltrados$;
  }

  // ===== STATISTICS =====

  /**
   * Obtiene estadísticas de gastos
   */
  obtenerEstadisticas(): Observable<any> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.get<any>(`${this.API_URL}/estadisticas`);
    */
    
    // Implementación temporal con datos mock
    const gastos = this.gastosSubject.value;
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    const gastosPorCategoria = gastos.reduce((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
      return acc;
    }, {} as any);

    return new Observable(observer => {
      observer.next({
        totalGastos,
        cantidadGastos: gastos.length,
        gastosPorCategoria,
        promedioGastos: totalGastos / gastos.length || 0
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
   * Obtiene el total de gastos filtrados
   */
  obtenerTotalGastosFiltrados(): number {
    return this.gastosFiltradosSubject.value.reduce((sum, g) => sum + g.monto, 0);
  }
}
