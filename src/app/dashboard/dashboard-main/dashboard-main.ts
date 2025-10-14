import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css'
})
export class DashboardMain {
  // Datos de resumen
  totalIngresos: number = 1000000;
  totalGastos: number = 500000;
  ingresosDelMes: number = 100000;
  gastosDelMes: number = 50000;

  // Datos del gráfico (ejemplo)
  chartData = [
    { mes: 'Enero', ingresos: 120000, gastos: 60000 },
    { mes: 'Febrero', ingresos: 150000, gastos: 30000 },
    { mes: 'Marzo', ingresos: 180000, gastos: 20000 },
    { mes: 'Abril', ingresos: 200000, gastos: 190000 },
    { mes: 'Mayo', ingresos: 80000, gastos: 40000 },
    { mes: 'Junio', ingresos: 160000, gastos: 70000 },
    { mes: 'Julio', ingresos: 140000, gastos: 25000 },
    { mes: 'Agosto', ingresos: 220000, gastos: 90000 },
    { mes: 'Septiembre', ingresos: 100000, gastos: 15000 },
    { mes: 'Octubre', ingresos: 130000, gastos: 110000 },
    { mes: 'Noviembre', ingresos: 170000, gastos: 20000 },
    { mes: 'Diciembre', ingresos: 190000, gastos: 80000 }
  ];

  // Valores máximos para escalar el gráfico
  maxValue: number = 1000000;

  constructor() { }

  // Formatear números con separadores de miles
  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // Calcular altura de las barras (porcentaje del máximo)
  getBarHeight(value: number): number {
    return (value / this.maxValue) * 100;
  }

  // Calcular el saldo (ingresos - gastos)
  getSaldo(): number {
    return this.totalIngresos - this.totalGastos;
  }

  // Calcular el saldo del mes
  getSaldoDelMes(): number {
    return this.ingresosDelMes - this.gastosDelMes;
  }
}
