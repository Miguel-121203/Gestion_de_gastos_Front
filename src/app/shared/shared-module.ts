import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipes compartidos
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
    DecimalPipe
  ]
})
export class SharedModule { }

// Utilidades compartidas
export class Utils {
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static generateId(): number {
    return Math.floor(Math.random() * 1000000) + 1;
  }
}

// Constantes de la aplicación
export const APP_CONSTANTS = {
  DEFAULT_CURRENCY: 'COP',
  DATE_FORMAT: 'dd/MM/yyyy',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  PAGINATION_SIZE: 10,
  DEBOUNCE_TIME: 300
} as const;
