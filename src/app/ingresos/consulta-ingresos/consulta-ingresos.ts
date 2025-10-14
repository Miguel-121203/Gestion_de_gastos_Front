import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaGasto } from '../../models/models-module';
import { CategoriasService } from '../../services/categorias.service';
import { ExportService } from '../../services/export.service';

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
  private categoriasService = inject(CategoriasService);
  private exportService = inject(ExportService);

  // Datos de categorías dinámicas
  categoriasDisponibles: CategoriaGasto[] = [];

  // Mock data for the table
  ingresos = [
    { fecha: '27-05-2025', categoria: 'Salario', monto: '2.500.000', descripcion: 'Pago mensual de nómina' },
    { fecha: '15-06-2025', categoria: 'Freelance', monto: '800.000', descripcion: 'Proyecto de desarrollo web' },
    { fecha: '10-07-2025', categoria: 'Inversión', monto: '150.000', descripcion: 'Dividendos de acciones' },
    { fecha: '05-08-2025', categoria: 'Venta', monto: '300.000', descripcion: 'Venta de productos usados' },
    { fecha: '20-08-2025', categoria: 'Regalo', monto: '100.000', descripcion: 'Regalo de cumpleaños' },
  ];

  // Filtros
  categoriaSeleccionada: string = '';
  montoFiltro: number | null = null;

  // Ingresos filtrados
  ingresosFiltrados = [...this.ingresos];

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
    this.cargarCategorias();
  }

  // Método para cargar categorías desde el servicio
  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categoriasDisponibles = categorias;
        console.log('Categorías cargadas en consulta-ingresos:', categorias);
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
    this.ingresosFiltrados = this.ingresos.filter(ingreso => {
      // Filtro por categoría
      if (this.categoriaSeleccionada && this.categoriaSeleccionada !== 'Todas las categorías') {
        if (ingreso.categoria !== this.categoriaSeleccionada) {
          return false;
        }
      }

      // Filtro por monto
      if (this.montoFiltro && this.montoFiltro > 0) {
        const montoIngreso = parseFloat(ingreso.monto.replace(/\./g, '').replace(',', '.'));
        if (montoIngreso < this.montoFiltro) {
          return false;
        }
      }

      // Filtro por fecha (implementar cuando se conecte con servicios reales)
      // if (this.selectedDate) {
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
    this.ingresosFiltrados = [...this.ingresos];
  }

  // ===== EXPORT METHODS =====

  /**
   * Exporta los ingresos filtrados a Excel
   */
  exportarAExcel(): void {
    try {
      this.exportService.exportIngresosToExcel(this.ingresosFiltrados);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar a Excel. Por favor, inténtalo de nuevo.');
    }
  }

  /**
   * Exporta los ingresos filtrados a PDF
   */
  exportarAPDF(): void {
    try {
      this.exportService.exportIngresosToPDF(this.ingresosFiltrados);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      alert('Error al exportar a PDF. Por favor, inténtalo de nuevo.');
    }
  }
}
