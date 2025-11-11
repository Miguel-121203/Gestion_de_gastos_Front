import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IngresosService } from '../../services/ingresos.service';
import { ExportService } from '../../services/export.service';
import { income, IncomeResponse } from '../../interface/income.interface';

interface CalendarDay {
  day: number;
  date: Date;
  disabled: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-consulta-ingresos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './consulta-ingresos.html',
  styleUrl: './consulta-ingresos.css'
})
export class ConsultaIngresos implements OnInit {
  // Servicios inyectados
  private ingresosService = inject(IngresosService);
  private exportService = inject(ExportService);

  // Datos de ingresos desde el servicio (usando IncomeResponse para obtener category)
  ingresos: IncomeResponse[] = [];
  ingresosFiltrados: IncomeResponse[] = [];

  // Filtros
  categoriaSeleccionada: string = '';
  montoFiltro: number | null = null;
  descripcionFiltro: string = '';

  // Estados de carga y mensajes
  loading: boolean = false;
  error: string = '';
  mensaje: string = '';

  // Variables para el modal de edición
  modalVisible: boolean = false;
  ingresoEditando: IncomeResponse | null = null;
  nuevaDescripcion: string = '';
  nuevoMonto: number = 0;

  // Date picker properties
  selectedDate: Date | null = null;
  selectedDateFormatted: string = '';
  showDatePicker: boolean = false;
  currentDate: Date = new Date();
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  dayHeaders: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  calendarDays: CalendarDay[] = [];
  tempSelectedDate: Date | null = null;

  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor() {
    this.currentYear = new Date().getFullYear();
    this.generateCalendar();
  }

  ngOnInit() {
    this.cargarIngresos();
  }

  // Cargar ingresos desde el servicio
  cargarIngresos(): void {
    this.loading = true;
    this.error = '';
    this.mensaje = '';

    this.ingresosService.getIngresos().subscribe({
      next: (data: any[]) => {
        this.ingresos = data;
        this.ingresosFiltrados = data;
        this.loading = false;
        console.log('Ingresos cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar ingresos:', err);
        this.error = 'Error al cargar los ingresos. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  // ===== MODAL DE EDICIÓN =====

  abrirModal(ingreso: IncomeResponse): void {
    this.ingresoEditando = { ...ingreso };
    this.nuevaDescripcion = ingreso.description;
    this.nuevoMonto = ingreso.amount;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.ingresoEditando = null;
  }

  guardarCambios(): void {
    if (!this.ingresoEditando || !this.ingresoEditando.incomeId) return;

    const ingresoActualizado: income = {
      ...this.ingresoEditando,
      description: this.nuevaDescripcion,
      amount: this.nuevoMonto
    };

    this.loading = true;
    this.ingresosService.updateIngreso(this.ingresoEditando.incomeId, ingresoActualizado).subscribe({
      next: () => {
        this.mensaje = '✅ Ingreso actualizado correctamente.';
        this.cerrarModal();
        this.cargarIngresos();
      },
      error: (err) => {
        console.error('Error al actualizar ingreso:', err);
        this.error = '❌ No se pudo actualizar el ingreso.';
        this.loading = false;
      }
    });
  }

  eliminarIngreso(ingreso: IncomeResponse): void {
    if (!ingreso.incomeId) return;

    const confirmacion = confirm(`🗑️ ¿Seguro que deseas eliminar el ingreso "${ingreso.description}"?`);
    if (!confirmacion) return;

    this.loading = true;
    this.ingresosService.deleteIngreso(ingreso.incomeId).subscribe({
      next: () => {
        this.mensaje = '🗑️ Ingreso eliminado correctamente.';
        this.cargarIngresos();
      },
      error: (err) => {
        console.error('Error al eliminar ingreso:', err);
        this.error = '❌ No se pudo eliminar el ingreso.';
        this.loading = false;
      }
    });
  }

  // ===== CÁLCULOS =====

  calcularTotal(): number {
    return this.ingresosFiltrados
      .filter(ingreso => ingreso.active !== false)
      .reduce((sum, ingreso) => sum + ingreso.amount, 0);
  }

  calcularPromedio(): number {
    const activos = this.ingresosFiltrados.filter(i => i.active !== false);
    return activos.length ? this.calcularTotal() / activos.length : 0;
  }

  // ===== FILTROS =====

  aplicarFiltros(): void {
    this.ingresosFiltrados = this.ingresos.filter(ingreso => {
      // Filtro por descripción
      const coincideDescripcion = this.descripcionFiltro
        ? ingreso.description.toLowerCase().includes(this.descripcionFiltro.toLowerCase())
        : true;

      // Filtro por categoría
      const coincideCategoria = this.categoriaSeleccionada && this.categoriaSeleccionada !== ''
        ? ingreso.incomeCategoryId === Number(this.categoriaSeleccionada)
        : true;

      // Filtro por monto
      const coincideMonto = this.montoFiltro && this.montoFiltro > 0
        ? ingreso.amount >= this.montoFiltro
        : true;

      // Filtro por fecha
      const coincideFecha = this.selectedDate
        ? new Date(ingreso.incomeDate).toISOString().split('T')[0] === this.selectedDate.toISOString().split('T')[0]
        : true;

      return coincideDescripcion && coincideCategoria && coincideMonto && coincideFecha;
    });
  }

  limpiarFiltros(): void {
    this.selectedDate = null;
    this.selectedDateFormatted = '';
    this.categoriaSeleccionada = '';
    this.montoFiltro = null;
    this.descripcionFiltro = '';
    this.ingresosFiltrados = [...this.ingresos];
  }

  // ===== CALENDARIO =====

  get currentMonthName(): string {
    return this.monthNames[this.currentMonth];
  }

  openDatePicker() {
    this.showDatePicker = true;
    this.tempSelectedDate = this.selectedDate;
    this.generateCalendar();
  }

  closeDatePicker() {
    this.showDatePicker = false;
    this.tempSelectedDate = null;
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(day: CalendarDay) {
    if (!day.disabled) {
      this.tempSelectedDate = day.date;
      this.generateCalendar();
    }
  }

  confirmDate() {
    if (this.tempSelectedDate) {
      this.selectedDate = new Date(this.tempSelectedDate);
      this.selectedDateFormatted = this.formatDate(this.selectedDate);
    }
    this.closeDatePicker();
  }

  preventTyping(event: KeyboardEvent) {
    event.preventDefault();
  }

  private generateCalendar() {
    this.calendarDays = [];
    const today = new Date();
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isToday = this.isSameDay(date, today);
      const isDisabled = date < today || date.getMonth() !== this.currentMonth;
      const isSelected = this.tempSelectedDate ? this.isSameDay(date, this.tempSelectedDate) : false;

      this.calendarDays.push({
        day: date.getDate(),
        date: new Date(date),
        disabled: isDisabled,
        isToday: isToday,
        isSelected: isSelected
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }

  // ===== EXPORT METHODS =====

  exportarAExcel(): void {
    try {
      this.exportService.exportIngresosToExcel(this.ingresosFiltrados);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar a Excel. Por favor, inténtalo de nuevo.');
    }
  }

  exportarAPDF(): void {
    try {
      this.exportService.exportIngresosToPDF(this.ingresosFiltrados);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      alert('Error al exportar a PDF. Por favor, inténtalo de nuevo.');
    }
  }
}
