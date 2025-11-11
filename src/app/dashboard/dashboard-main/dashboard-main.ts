import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { GastosService } from '../../services/gastos.service';
import { IngresosService } from '../../services/ingresos.service';
import { GastoResponse } from '../../interface/gasto.interface';
import { IncomeResponse } from '../../interface/income.interface';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-main.html',
  styleUrl: '../dashboard.css'
})
export class DashboardMain implements OnInit {
  private gastosService = inject(GastosService);
  private ingresosService = inject(IngresosService);

  // 🔹 Variables dinámicas
  gastos: GastoResponse[] = [];
  ingresos: IncomeResponse[] = [];
  totalGastos: number = 0;
  promedioGastos: number = 0;
  totalIngresos: number = 0;
  ingresosDelMes: number = 0;
  gastosDelMes: number = 0;

  // 🔹 Datos del gráfico
  chartData: { mes: string; ingresos: number; gastos: number }[] = [];
  maxValue: number = 1000000;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar gastos e ingresos en paralelo
    forkJoin({
      gastos: this.gastosService.getGastos(),
      ingresos: this.ingresosService.getIngresos()
    }).subscribe({
      next: (data) => {
        this.gastos = data.gastos;
        this.ingresos = data.ingresos as IncomeResponse[];
        this.calcularEstadisticas();
      },
      error: (err) => console.error('Error al cargar los datos del dashboard', err)
    });
  }

  calcularEstadisticas(): void {
    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    // Total de gastos
    this.totalGastos = this.gastos
      .filter(g => g.active)
      .reduce((acc, g) => acc + g.amount, 0);

    // Total de ingresos
    this.totalIngresos = this.ingresos
      .filter(i => i.active)
      .reduce((acc, i) => acc + i.amount, 0);

    // Calcular gastos del mes actual
    const gastosMes = this.gastos.filter(g => {
      if (!g.active) return false;
      const fecha = new Date(g.expenseDate);
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
    });
    this.gastosDelMes = gastosMes.reduce((acc, g) => acc + g.amount, 0);

    // Calcular ingresos del mes actual
    const ingresosMes = this.ingresos.filter(i => {
      if (!i.active) return false;
      const fecha = new Date(i.incomeDate);
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
    });
    this.ingresosDelMes = ingresosMes.reduce((acc, i) => acc + i.amount, 0);

    // Generar datos agrupados por mes para el gráfico
    this.chartData = this.generarDatosPorMes();
  }

  generarDatosPorMes(): { mes: string; ingresos: number; gastos: number }[] {
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const anioActual = new Date().getFullYear();

    const data = meses.map((mes, index) => {
      // Filtrar gastos del mes
      const gastosMes = this.gastos.filter(g => {
        if (!g.active) return false;
        const fecha = new Date(g.expenseDate);
        return fecha.getMonth() === index && fecha.getFullYear() === anioActual;
      });
      const totalGastosMes = gastosMes.reduce((acc, g) => acc + g.amount, 0);

      // Filtrar ingresos del mes
      const ingresosMes = this.ingresos.filter(i => {
        if (!i.active) return false;
        const fecha = new Date(i.incomeDate);
        return fecha.getMonth() === index && fecha.getFullYear() === anioActual;
      });
      const totalIngresosMes = ingresosMes.reduce((acc, i) => acc + i.amount, 0);

      return { mes, ingresos: totalIngresosMes, gastos: totalGastosMes };
    });

    // Ajustar valor máximo del gráfico según el valor más alto
    const maxIngresos = Math.max(...data.map(d => d.ingresos));
    const maxGastos = Math.max(...data.map(d => d.gastos));
    this.maxValue = Math.max(maxIngresos, maxGastos) * 1.2;

    // Si no hay datos, usar un valor por defecto
    if (this.maxValue === 0) {
      this.maxValue = 1000000;
    }

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
