import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Gasto, CategoriaGasto, MetodoPago, CategoriasGasto, MetodosPago } from '../models/models-module';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private gastosSubject = new BehaviorSubject<Gasto[]>([]);
  public gastos$ = this.gastosSubject.asObservable();

  private gastos: Gasto[] = [
    // Ejemplos de gastos para testing
    {
      id: 1,
      fecha: new Date(),
      categoria: CategoriasGasto.ALIMENTACION,
      descripcion: 'Almuerzo en restaurante',
      monto: 25000,
      metodoPago: MetodosPago.TARJETA_DEBITO,
      notas: 'Comida con amigos',
      fechaCreacion: new Date()
    }
  ];

  constructor() {
    this.gastosSubject.next(this.gastos);
  }

  // Obtener todos los gastos
  getGastos(): Observable<Gasto[]> {
    return this.gastos$;
  }

  // Agregar nuevo gasto
  agregarGasto(gasto: Gasto): Observable<Gasto> {
    const nuevoGasto: Gasto = {
      ...gasto,
      id: this.gastos.length + 1,
      fechaCreacion: new Date()
    };
    
    this.gastos.push(nuevoGasto);
    this.gastosSubject.next([...this.gastos]);
    return of(nuevoGasto);
  }

  // Actualizar gasto existente
  actualizarGasto(id: number, gasto: Gasto): Observable<Gasto | null> {
    const index = this.gastos.findIndex(g => g.id === id);
    if (index !== -1) {
      this.gastos[index] = { ...gasto, id };
      this.gastosSubject.next([...this.gastos]);
      return of(this.gastos[index]);
    }
    return of(null);
  }

  // Eliminar gasto
  eliminarGasto(id: number): Observable<boolean> {
    const index = this.gastos.findIndex(g => g.id === id);
    if (index !== -1) {
      this.gastos.splice(index, 1);
      this.gastosSubject.next([...this.gastos]);
      return of(true);
    }
    return of(false);
  }

  // Obtener gasto por ID
  getGastoById(id: number): Observable<Gasto | null> {
    const gasto = this.gastos.find(g => g.id === id);
    return of(gasto || null);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private categorias: CategoriaGasto[] = [
    { id: 1, nombre: 'Alimentación', icono: '🍽️', descripcion: 'Comidas y bebidas' },
    { id: 2, nombre: 'Transporte', icono: '🚗', descripcion: 'Gasolina, transporte público' },
    { id: 3, nombre: 'Vivienda', icono: '🏠', descripcion: 'Alquiler, servicios públicos' },
    { id: 4, nombre: 'Salud', icono: '🏥', descripcion: 'Medicinas, consultas médicas' },
    { id: 5, nombre: 'Educación', icono: '📚', descripcion: 'Cursos, libros, materiales' },
    { id: 6, nombre: 'Entretenimiento', icono: '🎬', descripcion: 'Cine, juegos, hobbies' },
    { id: 7, nombre: 'Ropa', icono: '👕', descripcion: 'Vestimenta y accesorios' },
    { id: 8, nombre: 'Tecnología', icono: '💻', descripcion: 'Dispositivos, software' },
    { id: 9, nombre: 'Otros', icono: '📋', descripcion: 'Gastos diversos' }
  ];

  getCategorias(): Observable<CategoriaGasto[]> {
    return of(this.categorias);
  }

  getCategoriaPorId(id: number): Observable<CategoriaGasto | null> {
    const categoria = this.categorias.find(c => c.id === id);
    return of(categoria || null);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetodosPagoService {
  private metodosPago: MetodoPago[] = [
    { id: 1, nombre: 'Efectivo', icono: '💵' },
    { id: 2, nombre: 'Tarjeta de Crédito', icono: '💳' },
    { id: 3, nombre: 'Tarjeta de Débito', icono: '💳' },
    { id: 4, nombre: 'Transferencia', icono: '🏦' },
    { id: 5, nombre: 'Otro', icono: '🔄' }
  ];

  getMetodosPago(): Observable<MetodoPago[]> {
    return of(this.metodosPago);
  }

  getMetodoPagoPorId(id: number): Observable<MetodoPago | null> {
    const metodo = this.metodosPago.find(m => m.id === id);
    return of(metodo || null);
  }
}
