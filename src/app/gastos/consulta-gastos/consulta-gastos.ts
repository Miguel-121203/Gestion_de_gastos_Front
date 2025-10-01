import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Gasto {
  id: number;
  fecha: string;
  categoria: string;
  monto: number;
  descripcion: string;
}

interface CalendarDay {
  day: number;
  date: Date;
  disabled: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-consulta-gastos',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consulta-gastos.html',
  styleUrl: './consulta-gastos.css'
})
export class ConsultaGastos {
  // Filtros
  categoriaSeleccionada: string = '';
  montoFiltro: number | null = null;
  
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

  // Datos de ejemplo (después se conectarán con el servicio)
  gastos: Gasto[] = [
    {
      id: 1,
      fecha: '27-05-2025',
      categoria: 'Transportes',
      monto: 350000,
      descripcion: 'transporte de cada semana'
    },
    {
      id: 2,
      fecha: '27-06-2025',
      categoria: 'Comida',
      monto: 450000,
      descripcion: 'mercado del mes'
    },
    {
      id: 3,
      fecha: '27-07-2025',
      categoria: 'Servicio electrico',
      monto: 50000,
      descripcion: 'pago de la energia'
    },
    {
      id: 4,
      fecha: '27-08-2025',
      categoria: 'Servicio acueducto',
      monto: 50000,
      descripcion: 'pago del agua'
    },
    {
      id: 5,
      fecha: '27-08-2025',
      categoria: 'Servicio gas',
      monto: 50000,
      descripcion: 'pago del gas'
    }
  ];

  // Gastos filtrados
  gastosFiltrados: Gasto[] = [...this.gastos];

  // Categorías para el filtro
  categorias = [
    'Todas las categorías',
    'Transportes',
    'Comida',
    'Servicio electrico',
    'Servicio acueducto',
    'Servicio gas',
    'Alimentación',
    'Vivienda',
    'Salud',
    'Educación',
    'Entretenimiento',
    'Ropa',
    'Tecnología',
    'Otros'
  ];

  constructor() {
    this.currentYear = new Date().getFullYear();
    this.generateCalendar();
  }

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

  // Aplicar filtros
  aplicarFiltros() {
    this.gastosFiltrados = this.gastos.filter(gasto => {
      // Filtro por categoría
      if (this.categoriaSeleccionada && this.categoriaSeleccionada !== 'Todas las categorías') {
        if (gasto.categoria !== this.categoriaSeleccionada) {
          return false;
        }
      }

      // Filtro por monto
      if (this.montoFiltro && this.montoFiltro > 0) {
        if (gasto.monto < this.montoFiltro) {
          return false;
        }
      }

      // Filtro por fecha (implementar cuando se conecte con servicios reales)
      // if (this.fechaInicio && this.fechaFin) {
      //   // Lógica de filtro por fecha
      // }

      return true;
    });
  }

  // Limpiar filtros
  limpiarFiltros() {
    this.selectedDate = null;
    this.selectedDateFormatted = '';
    this.categoriaSeleccionada = '';
    this.montoFiltro = null;
    this.gastosFiltrados = [...this.gastos];
  }

  // Formatear monto para mostrar
  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(monto);
  }
}
