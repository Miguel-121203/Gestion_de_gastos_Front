import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GastosService } from '../../services/gastos.service';
import { Gasto } from '../../models/models-module';

@Component({
  selector: 'app-consulta-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consulta-gastos.html',
  styleUrls: ['./consulta-gastos.css']
})
export class ConsultaGastos implements OnInit {

  // 🔹 Variables principales
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = [];

  categoriaSeleccionada: string = '';
  montoFiltro: number | null = null;

  // 🔹 Fecha seleccionada
  selectedDateFormatted: string = '';
  showDatePicker: boolean = false;

  // 🔹 Variables del calendario
  currentDate: Date = new Date();
  currentMonthName: string = '';
  currentYear: number = 0;
  dayHeaders: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  calendarDays: any[] = [];
  selectedDate: Date | null = null;

  constructor(private gastosService: GastosService) {}

  ngOnInit(): void {
    this.obtenerGastos();
    this.updateCalendar(); // Inicializa el calendario
  }

  // 🔹 Obtener todos los gastos desde el backend
  obtenerGastos(): void {
    this.gastosService.getGastos().subscribe({
      next: (data) => {
        this.gastos = data;
        this.gastosFiltrados = [...this.gastos];
      },
      error: (err) => {
        console.error('Error al obtener los gastos:', err);
      }
    });
  }

  // 🔹 Aplicar filtros por fecha, categoría y monto
  aplicarFiltros(): void {
    this.gastosFiltrados = this.gastos.filter(g => {
      const coincideCategoria = this.categoriaSeleccionada
        ? g.categoria === this.categoriaSeleccionada
        : true;

      const coincideMonto = this.montoFiltro
        ? g.monto === this.montoFiltro
        : true;

      const coincideFecha = this.selectedDateFormatted
        ? new Date(g.fecha).toISOString().split('T')[0] === this.selectedDateFormatted
        : true;

      return coincideCategoria && coincideMonto && coincideFecha;
    });
  }

  // 🔹 Limpiar filtros
  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.montoFiltro = null;
    this.selectedDateFormatted = '';
    this.gastosFiltrados = [...this.gastos];
  }

  // 🔹 Formatear monto con separadores de miles
  formatearMonto(monto: number): string {
    return monto.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  }

  // ================================
  // 🔹 Lógica del calendario
  // ================================

  updateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentYear = year;
    this.currentMonthName = this.currentDate.toLocaleString('es-ES', { month: 'long' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: any[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        day: i,
        isToday: this.isToday(date),
        isSelected: this.selectedDate?.toDateString() === date.toDateString(),
        disabled: false
      });
    }

    this.calendarDays = days;
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
  }

selectDate(day: any): void {
  this.selectedDate = day.date;
  this.selectedDateFormatted = this.selectedDate
    ? this.selectedDate.toISOString().split('T')[0]
    : '';
  this.aplicarFiltros();
  this.showDatePicker = false;
}

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // 🔹 Métodos para abrir/cerrar el datepicker
  openDatePicker(): void {
    this.showDatePicker = true;
  }

  closeDatePicker(): void {
    this.showDatePicker = false;
  }

  confirmDate(): void {
    this.showDatePicker = false;
    this.aplicarFiltros();
  }

  preventTyping(event: KeyboardEvent): void {
    event.preventDefault();
  }
}

