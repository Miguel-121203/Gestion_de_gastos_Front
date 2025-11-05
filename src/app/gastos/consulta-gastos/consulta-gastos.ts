import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GastosService } from '../../services/gastos.service';
import { GastoResponse, Gasto } from '../../interface/gasto.interface';

@Component({
  selector: 'app-consulta-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consulta-gastos.html',
  styleUrls: ['./consulta-gastos.css']
})
export class ConsultaGastos implements OnInit {
  gastos: GastoResponse[] = [];
  gastosFiltrados: GastoResponse[] = [];

  descripcionFiltro: string = '';
  fechaFiltro: string = '';

  loading: boolean = false;
  error: string = '';
  mensaje: string = '';

  // 🟢 Variables para el modal
  modalVisible: boolean = false;
  gastoEditando: GastoResponse | null = null;
  nuevaDescripcion: string = '';
  nuevoMonto: number = 0;

  constructor(private gastosService: GastosService) {}

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.loading = true;
    this.error = '';
    this.mensaje = '';

    this.gastosService.getGastos().subscribe({
      next: (data: GastoResponse[]) => {
        this.gastos = data;
        this.gastosFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar gastos:', err);
        this.error = 'Error al cargar los gastos. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
  this.gastosFiltrados = this.gastos.filter(gasto => {
    const coincideDescripcion = this.descripcionFiltro
      ? gasto.description.toLowerCase().includes(this.descripcionFiltro.toLowerCase())
      : true;

    const coincideFecha = this.fechaFiltro
      ? gasto.expenseDate.split('T')[0] === this.fechaFiltro  // ✅ Simplificado
      : true;

    return coincideDescripcion && coincideFecha;
  });
}

  limpiarFiltros(): void {
    this.descripcionFiltro = '';
    this.fechaFiltro = '';
    this.gastosFiltrados = this.gastos;
  }

  calcularTotal(): number {
    return this.gastosFiltrados
      .filter(gasto => gasto.active)
      .reduce((sum, gasto) => sum + gasto.amount, 0);
  }

  calcularPromedio(): number {
    const activos = this.gastosFiltrados.filter(g => g.active);
    return activos.length ? this.calcularTotal() / activos.length : 0;
  }

  // 🟢 Abrir modal
  abrirModal(gasto: GastoResponse): void {
    this.gastoEditando = { ...gasto };
    this.nuevaDescripcion = gasto.description;
    this.nuevoMonto = gasto.amount;
    this.modalVisible = true;
  }

  // 🟢 Cerrar modal
  cerrarModal(): void {
    this.modalVisible = false;
    this.gastoEditando = null;
  }

  // 🟢 Guardar cambios
// 🟢 Guardar cambios
guardarCambios(): void {
  if (!this.gastoEditando) return;

  // ✅ Enviar solo los campos que el backend espera
  const gastoActualizado: Gasto = {
    description: this.nuevaDescripcion,
    amount: this.nuevoMonto,
    expenseDate: this.gastoEditando.expenseDate,
    expenseCategoryId: this.gastoEditando.expenseCategoryId,
    userId: this.gastoEditando.userId
  };

  this.loading = true;
  this.error = '';
  this.mensaje = '';

  this.gastosService.updateGasto(this.gastoEditando.expenseId, gastoActualizado).subscribe({
    next: () => {
      this.mensaje = '✅ Gasto actualizado correctamente.';
      this.cerrarModal();
      this.cargarGastos();
    },
    error: (err) => {
      console.error('Error al actualizar gasto:', err);
      this.error = '❌ No se pudo actualizar el gasto: ' + (err.error?.message || 'Error desconocido');
      this.loading = false;
    }
  });
}
  eliminarGasto(gasto: GastoResponse): void {
    const confirmacion = confirm(`🗑️ ¿Seguro que deseas eliminar el gasto "${gasto.description}"?`);
    if (!confirmacion) return;

    this.loading = true;
    this.gastosService.deleteGasto(gasto.expenseId).subscribe({
      next: () => {
        this.mensaje = '🗑️ Gasto eliminado correctamente.';
        this.cargarGastos();
      },
      error: (err) => {
        console.error('Error al eliminar gasto:', err);
        this.error = '❌ No se pudo eliminar el gasto.';
        this.loading = false;
      }
    });
  }
}
