import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GastosService } from '../../services/gastos.service';
import { GastoResponse } from '../../interface/gasto.interface';

@Component({
  selector: 'app-consulta-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consulta-gastos.html',
  styleUrls: ['./consulta-gastos.css']
})
export class ConsultaGastos implements OnInit {
  // Datos
  gastos: GastoResponse[] = [];
  gastosFiltrados: GastoResponse[] = [];

  // Estados
  loading: boolean = false;
  error: string = '';

  // Filtros
  descripcionFiltro: string = '';
  fechaFiltro: string = '';

  constructor(private gastosService: GastosService) {}

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.loading = true;
    this.error = '';

    this.gastosService.getGastos().subscribe({
      next: (data: GastoResponse[]) => {
        console.log('Gastos cargados:', data);
        this.gastos = data;
        this.gastosFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar gastos:', err);
        this.error = 'Error al cargar los gastos. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }



  aplicarFiltros(): void {
    this.gastosFiltrados = this.gastos.filter(gasto => {
      // Filtro por fecha
      if (this.fechaFiltro) {
        const gastoFecha = new Date(gasto.expenseDate).toISOString().split('T')[0];
        if (gastoFecha !== this.fechaFiltro) {
          return false;
        }
      }


      return true;
    });
  }

  limpiarFiltros(): void {
    this.fechaFiltro = '';
    this.gastosFiltrados = this.gastos;
  }

  limpiarFecha(): void {
    this.fechaFiltro = '';
    this.aplicarFiltros();
  }

  calcularTotal(): number {
    return this.gastosFiltrados
      .filter(gasto => gasto.active)
      .reduce((sum, gasto) => sum + gasto.amount, 0);
  }

  calcularPromedio(): number {
    const gastosActivos = this.gastosFiltrados.filter(g => g.active);
    if (gastosActivos.length === 0) return 0;
    return this.calcularTotal() / gastosActivos.length;
  }
}
