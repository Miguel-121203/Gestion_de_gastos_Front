// Modelos de datos para la aplicación
export interface Gasto {
  id?: number;
  fecha: Date;
  categoria: string;
  descripcion: string;
  monto: number;
  metodoPago: string;
  notas?: string;
  fechaCreacion?: Date;
}

export interface CategoriaGasto {
  id: number;
  nombre: string;
  icono: string;
  descripcion?: string;
  color?: string;
  fechaCreacion?: Date;
  activa?: boolean;
}

export interface MetodoPago {
  id: number;
  nombre: string;
  icono: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  fechaCreacion?: Date;
}

// Enums para valores constantes
export enum CategoriasGasto {
  ALIMENTACION = 'alimentacion',
  TRANSPORTE = 'transporte',
  VIVIENDA = 'vivienda',
  SALUD = 'salud',
  EDUCACION = 'educacion',
  ENTRETENIMIENTO = 'entretenimiento',
  ROPA = 'ropa',
  TECNOLOGIA = 'tecnologia',
  OTROS = 'otros'
}

export enum MetodosPago {
  EFECTIVO = 'efectivo',
  TARJETA_CREDITO = 'tarjeta_credito',
  TARJETA_DEBITO = 'tarjeta_debito',
  TRANSFERENCIA = 'transferencia',
  OTRO = 'otro'
}
