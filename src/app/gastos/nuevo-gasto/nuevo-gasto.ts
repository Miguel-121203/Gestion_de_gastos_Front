import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaGasto } from '../../models/models-module';
import { CategoriasService } from '../../services/categorias.service';

interface CalendarDay {
  day: number;
  date: Date;
  disabled: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-nuevo-gasto',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './nuevo-gasto.html',
  styleUrl: './nuevo-gasto.css'
})
export class NuevoGasto implements OnInit {
  // Servicios inyectados
  private categoriasService = inject(CategoriasService);

  // Datos de categorías dinámicas
  categoriasDisponibles: CategoriaGasto[] = [];
  categoriaSeleccionada: string = '';

  // Fecha seleccionada
  selectedDate: Date | null = null;
  selectedDateFormatted: string = '';

  // Date picker modal
  showDatePicker: boolean = false;
  currentDate: Date = new Date();
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  // Calendar data
  dayHeaders: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  calendarDays: CalendarDay[] = [];
  tempSelectedDate: Date | null = null;

  // Month names
  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor() {
    this.currentYear = new Date().getFullYear();
    this.generateCalendar();
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  // Método para cargar categorías desde el servicio
  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categoriasDisponibles = categorias;
        console.log('Categorías cargadas en nuevo-gasto:', categorias);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        // Fallback a categorías por defecto si hay error
        this.categoriasDisponibles = this.getCategoriasPorDefecto();
      }
    });
  }

  // Método para obtener categorías por defecto (fallback)
  private getCategoriasPorDefecto(): CategoriaGasto[] {
    return [
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
  }

  // Método para obtener el valor del select (formato consistente)
  getValorCategoria(categoria: CategoriaGasto): string {
    return categoria.nombre.toLowerCase().replace(/\s+/g, '_');
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
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
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
}
