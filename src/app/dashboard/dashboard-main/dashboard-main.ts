import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastosService } from '../../services/gastos.service';
import { GastoResponse } from '../../interface/gasto.interface';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css'
})
export class DashboardMain implements OnInit {
  private gastosService = inject(GastosService);

  // 🔹 Variables dinámicas
  gastos: GastoResponse[] = [];
  totalGastos: number = 0;
  promedioGastos: number = 0;
  totalIngresos: number = 0; // si aún no tienes ingresos del backend, se deja ejemplo
  ingresosDelMes: number = 0;
  gastosDelMes: number = 0;

  // 🔹 Datos del gráfico
  chartData: { mes: string; ingresos: number; gastos: number }[] = [];
  maxValue: number = 1000000;

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.gastosService.getGastos().subscribe({
      next: (data) => {
        this.gastos = data;
        this.calcularEstadisticas();
      },
      error: (err) => console.error('Error al cargar los gastos', err)
    });
  }

  calcularEstadisticas(): void {
    if (!this.gastos.length) return;

    // Total de gastos
    this.totalGastos = this.gastos.reduce((acc, g) => acc + g.amount, 0);

    // Promedio
    this.promedioGastos = this.totalGastos / this.gastos.length;

    // Calcular gastos del mes actual
    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    const gastosMes = this.gastos.filter(g => {
      const fecha = new Date(g.expenseDate);
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
    });

    this.gastosDelMes = gastosMes.reduce((acc, g) => acc + g.amount, 0);

    // Generar datos agrupados por mes para el gráfico
    this.chartData = this.generarDatosPorMes(this.gastos);
  }

  generarDatosPorMes(gastos: GastoResponse[]): { mes: string; ingresos: number; gastos: number }[] {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const data = meses.map((mes, index) => {
      const gastosMes = gastos.filter(g => new Date(g.expenseDate).getMonth() === index);
      const totalMes = gastosMes.reduce((acc, g) => acc + g.amount, 0);
      return { mes, ingresos: this.totalIngresos / 12, gastos: totalMes };
    });

    // Ajustar valor máximo del gráfico según el gasto más alto
    this.maxValue = Math.max(...data.map(d => d.ingresos), ...data.map(d => d.gastos)) * 1.2;

    return data;
  }

  // 🔹 Funciones auxiliares
  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(value);
  }

  getBarHeight(value: number): number {
    return (value / this.maxValue) * 100;
  }

  getSaldo(): number {
    return this.totalIngresos - this.totalGastos;
  }

  getSaldoDelMes(): number {
    return this.ingresosDelMes - this.gastosDelMes;
  }
}
