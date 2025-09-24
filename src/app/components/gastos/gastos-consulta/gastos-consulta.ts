import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Gasto } from '../../../models/gasto';

@Component({
  selector: 'app-gastos-consulta',
  standalone: false,
  templateUrl: './gastos-consulta.html',
  styleUrl: './gastos-consulta.css'
})
export class GastosConsulta implements OnInit {
 filtroForm: FormGroup;
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = [];
  categorias: string[] = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Servicios', 'Otros'];
  ordenarPor: string = 'fecha';
  ordenAscendente: boolean = false;

  // Paginación
  paginaActual: number = 1;
  gastosPorPagina: number = 10;
  totalPaginas: number = 1;

  constructor(private fb: FormBuilder) {
    this.filtroForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      categoria: [''],
      montoMin: [''],
      montoMax: [''],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarGastosMock();
    this.filtroForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  // Método para cargar datos de prueba
  cargarGastosMock(): void {
    const fechaActual = new Date();
    const mesAnterior = new Date();
    mesAnterior.setMonth(fechaActual.getMonth() - 1);
    const dosMesesAntes = new Date();
    dosMesesAntes.setMonth(fechaActual.getMonth() - 2);

    this.gastos = [
      {
        id: 1,
        fecha: new Date('2024-09-15'),
        categoria: 'Alimentación',
        descripcion: 'Supermercado Éxito',
        monto: 85000
      },
      {
        id: 2,
        fecha: new Date('2024-09-14'),
        categoria: 'Transporte',
        descripcion: 'Uber al trabajo',
        monto: 15000
      },
      {
        id: 3,
        fecha: new Date('2024-09-13'),
        categoria: 'Entretenimiento',
        descripcion: 'Cine con amigos',
        monto: 25000
      },
      {
        id: 4,
        fecha: new Date('2024-09-12'),
        categoria: 'Salud',
        descripcion: 'Consulta médica',
        monto: 120000
      },
      {
        id: 5,
        fecha: new Date('2024-09-11'),
        categoria: 'Servicios',
        descripcion: 'Pago internet',
        monto: 65000
      },
      {
        id: 6,
        fecha: new Date('2024-09-10'),
        categoria: 'Alimentación',
        descripcion: 'Almuerzo restaurante',
        monto: 35000
      },
      {
        id: 7,
        fecha: new Date('2024-09-09'),
        categoria: 'Educación',
        descripcion: 'Curso online',
        monto: 150000
      },
      {
        id: 8,
        fecha: new Date('2024-09-08'),
        categoria: 'Transporte',
        descripcion: 'Gasolina',
        monto: 80000
      },
      {
        id: 9,
        fecha: new Date('2024-09-07'),
        categoria: 'Otros',
        descripcion: 'Regalos',
        monto: 45000
      },
      {
        id: 10,
        fecha: new Date('2024-09-06'),
        categoria: 'Alimentación',
        descripcion: 'Pedido domicilio',
        monto: 28000
      },
      {
        id: 11,
        fecha: new Date('2024-09-05'),
        categoria: 'Entretenimiento',
        descripcion: 'Streaming Netflix',
        monto: 18000
      },
      {
        id: 12,
        fecha: new Date('2024-09-04'),
        categoria: 'Salud',
        descripcion: 'Medicamentos',
        monto: 42000
      },
      {
        id: 13,
        fecha: new Date('2024-09-03'),
        categoria: 'Servicios',
        descripcion: 'Agua y luz',
        monto: 95000
      },
      {
        id: 14,
        fecha: new Date('2024-09-02'),
        categoria: 'Transporte',
        descripcion: 'Bus intermunicipal',
        monto: 25000
      },
      {
        id: 15,
        fecha: new Date('2024-09-01'),
        categoria: 'Alimentación',
        descripcion: 'Desayuno cafetería',
        monto: 12000
      },
      // Gastos del mes anterior
      {
        id: 16,
        fecha: new Date('2024-08-28'),
        categoria: 'Educación',
        descripcion: 'Libros universitarios',
        monto: 200000
      },
      {
        id: 17,
        fecha: new Date('2024-08-25'),
        categoria: 'Entretenimiento',
        descripcion: 'Concierto',
        monto: 180000
      },
      {
        id: 18,
        fecha: new Date('2024-08-22'),
        categoria: 'Otros',
        descripcion: 'Corte de cabello',
        monto: 35000
      },
      {
        id: 19,
        fecha: new Date('2024-08-20'),
        categoria: 'Alimentación',
        descripcion: 'Cena familiar',
        monto: 150000
      },
      {
        id: 20,
        fecha: new Date('2024-08-18'),
        categoria: 'Transporte',
        descripcion: 'Mantenimiento moto',
        monto: 120000
      }
    ];

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const filtros = this.filtroForm.value;
    let gastosFiltrados = [...this.gastos];

    // Filtro por rango de fechas
    if (filtros.fechaInicio) {
      gastosFiltrados = gastosFiltrados.filter(gasto =>
        new Date(gasto.fecha) >= new Date(filtros.fechaInicio)
      );
    }

    if (filtros.fechaFin) {
      gastosFiltrados = gastosFiltrados.filter(gasto =>
        new Date(gasto.fecha) <= new Date(filtros.fechaFin)
      );
    }

    // Filtro por categoría
    if (filtros.categoria) {
      gastosFiltrados = gastosFiltrados.filter(gasto =>
        gasto.categoria === filtros.categoria
      );
    }

    // Filtro por monto
    if (filtros.montoMin) {
      gastosFiltrados = gastosFiltrados.filter(gasto =>
        gasto.monto >= filtros.montoMin
      );
    }

    if (filtros.montoMax) {
      gastosFiltrados = gastosFiltrados.filter(gasto =>
        gasto.monto <= filtros.montoMax
      );
    }

    // Filtro por descripción
    if (filtros.descripcion) {
      gastosFiltrados = gastosFiltrados.filter(gasto =>
        gasto.descripcion.toLowerCase().includes(filtros.descripcion.toLowerCase())
      );
    }

    this.gastosFiltrados = gastosFiltrados;
    this.ordenarResultados();
    this.calcularPaginacion();
  }

  ordenarResultados(): void {
    this.gastosFiltrados.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (this.ordenarPor) {
        case 'fecha':
          valorA = new Date(a.fecha);
          valorB = new Date(b.fecha);
          break;
        case 'monto':
          valorA = a.monto;
          valorB = b.monto;
          break;
        case 'categoria':
          valorA = a.categoria.toLowerCase();
          valorB = b.categoria.toLowerCase();
          break;
        case 'descripcion':
          valorA = a.descripcion.toLowerCase();
          valorB = b.descripcion.toLowerCase();
          break;
        default:
          return 0;
      }

      if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
      if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  cambiarOrden(campo: string): void {
    if (this.ordenarPor === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenarPor = campo;
      this.ordenAscendente = true;
    }
    this.ordenarResultados();
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.gastosFiltrados.length / this.gastosPorPagina);
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = 1;
    }
  }

  get gastosVisibles(): Gasto[] {
    const inicio = (this.paginaActual - 1) * this.gastosPorPagina;
    const fin = inicio + this.gastosPorPagina;
    return this.gastosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  limpiarFiltros(): void {
    this.filtroForm.reset();
    this.paginaActual = 1;
  }

  exportarCSV(): void {
    const headers = ['Fecha', 'Categoría', 'Descripción', 'Monto'];
    const csvContent = [
      headers.join(','),
      ...this.gastosFiltrados.map(gasto => [
        this.formatearFecha(gasto.fecha),
        gasto.categoria,
        `"${gasto.descripcion}"`,
        gasto.monto
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gastos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  exportarPDF(): void {
    // Implementación básica - en producción usarías jsPDF
    const contenido = this.gastosFiltrados.map(gasto =>
      `${this.formatearFecha(gasto.fecha)} | ${gasto.categoria} | ${gasto.descripcion} | $${gasto.monto.toLocaleString()}`
    ).join('\n');

    console.log('PDF Export:', contenido);
    alert('Funcionalidad PDF en desarrollo. Ver consola para contenido.');
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  }

  // Métodos adicionales para estadísticas
  get totalGastos(): number {
    return this.gastosFiltrados.reduce((total, gasto) => total + gasto.monto, 0);
  }

  get promedioGastos(): number {
    return this.gastosFiltrados.length > 0 ? this.totalGastos / this.gastosFiltrados.length : 0;
  }

  get gastoMayor(): Gasto | null {
    return this.gastosFiltrados.length > 0
      ? this.gastosFiltrados.reduce((max, gasto) => gasto.monto > max.monto ? gasto : max)
      : null;
  }

  // Métodos adicionales para el template
  trackByGasto(index: number, gasto: Gasto): number {
    return gasto.id;
  }

  trackByPagina(index: number, pagina: number): number {
    return pagina;
  }

  cambiarElementosPorPagina(): void {
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  editarGasto(gasto: Gasto): void {
    // Implementar navegación a editar
    console.log('Editar gasto:', gasto);
    // this.router.navigate(['/gastos/editar', gasto.id]);
  }

  eliminarGasto(gasto: Gasto): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el gasto "${gasto.descripcion}"?`)) {
      this.gastos = this.gastos.filter(g => g.id !== gasto.id);
      this.aplicarFiltros();
      console.log('Gasto eliminado:', gasto);
    }
  }
}
