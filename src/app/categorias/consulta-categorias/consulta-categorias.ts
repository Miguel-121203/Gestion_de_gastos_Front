import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CategoriasService } from '../../services/categorias.service';
import { CategoriaAPI } from '../../interface/categories.interface';

@Component({
  selector: 'app-consulta-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-categorias.html',
  styleUrl: './consulta-categorias.css'
})
export class ConsultaCategorias implements OnInit, OnDestroy {
  categorias: CategoriaAPI[] = [];
  categoriasFiltradas: CategoriaAPI[] = [];
  filtroTexto: string = '';
  filtroTipo: 'ALL' | 'INCOME' | 'EXPENSE' = 'ALL';
  filtroEstado: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';

  isLoading: boolean = false;
  errorMessage: string = '';

  // Variables para el modal de edición
  showEditModal: boolean = false;
  categoriaEditando: CategoriaAPI | null = null;
  isLoadingModal: boolean = false;
  errorMessageModal: string = '';

  private categoriasSubscription?: Subscription;

  private router = inject(Router);
  private categoriasService = inject(CategoriasService);

  ngOnInit() {
    this.cargarCategorias();
  }

  ngOnDestroy() {
    if (this.categoriasSubscription) {
      this.categoriasSubscription.unsubscribe();
    }
  }

  cargarCategorias() {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoriasSubscription = this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.aplicarFiltros();
        this.isLoading = false;
        console.log('Categorías cargadas:', categorias);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.errorMessage = 'Error al cargar las categorías. Por favor intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.categorias];

    if (this.filtroTexto.trim()) {
      const textoLower = this.filtroTexto.toLowerCase().trim();
      resultado = resultado.filter(cat =>
        cat.name.toLowerCase().includes(textoLower) ||
        (cat.description && cat.description.toLowerCase().includes(textoLower))
      );
    }

    if (this.filtroTipo !== 'ALL') {
      resultado = resultado.filter(cat => cat.type === this.filtroTipo);
    }

    if (this.filtroEstado === 'ACTIVE') {
      resultado = resultado.filter(cat => cat.active);
    } else if (this.filtroEstado === 'INACTIVE') {
      resultado = resultado.filter(cat => !cat.active);
    }

    this.categoriasFiltradas = resultado;
  }

  onFiltroTextoChange() {
    this.aplicarFiltros();
  }

  onFiltroTipoChange() {
    this.aplicarFiltros();
  }

  onFiltroEstadoChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtroTexto = '';
    this.filtroTipo = 'ALL';
    this.filtroEstado = 'ALL';
    this.aplicarFiltros();
  }

  // Abrir modal de edición
  editarCategoria(categoria: CategoriaAPI) {
    this.categoriaEditando = { ...categoria }; // Clonar para no modificar el original
    this.showEditModal = true;
    this.errorMessageModal = '';
    console.log('Editando categoría:', this.categoriaEditando);
  }

  // Cerrar modal
  cerrarModal() {
    if (this.isLoadingModal) {
      return; // No permitir cerrar mientras se guarda
    }
    this.showEditModal = false;
    this.categoriaEditando = null;
    this.errorMessageModal = '';
  }

  // Guardar cambios
  guardarCambios() {
    if (!this.categoriaEditando) return;

    if (!this.validarCategoria()) {
      return;
    }

    this.isLoadingModal = true;
    this.errorMessageModal = '';

    this.categoriasService.actualizarCategoria(this.categoriaEditando.categoryId, this.categoriaEditando).subscribe({
      next: (categoriaActualizada) => {
        console.log('Categoría actualizada:', categoriaActualizada);
        this.isLoadingModal = false;
        alert('¡Categoría actualizada exitosamente!');
        this.cerrarModal();
        this.cargarCategorias(); // Recargar lista
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.errorMessageModal = error.error?.message || 'Error al actualizar la categoría';
        this.isLoadingModal = false;
      }
    });
  }

  // Validar categoría en el modal
  validarCategoria(): boolean {
    if (!this.categoriaEditando) return false;

    if (!this.categoriaEditando.name || !this.categoriaEditando.name.trim()) {
      this.errorMessageModal = 'El nombre es obligatorio';
      return false;
    }
    if (this.categoriaEditando.name.length < 3) {
      this.errorMessageModal = 'El nombre debe tener al menos 3 caracteres';
      return false;
    }
    if (this.categoriaEditando.name.length > 50) {
      this.errorMessageModal = 'El nombre no puede exceder 50 caracteres';
      return false;
    }
    if (!this.categoriaEditando.type) {
      this.errorMessageModal = 'Debe seleccionar un tipo';
      return false;
    }
    if (this.categoriaEditando.description && this.categoriaEditando.description.length > 200) {
      this.errorMessageModal = 'La descripción no puede exceder 200 caracteres';
      return false;
    }
    return true;
  }

  eliminarCategoria(categoria: CategoriaAPI) {
    if (confirm(`¿Estás seguro de eliminar la categoría "${categoria.name}"?`)) {
      this.categoriasService.eliminarCategoria(categoria.categoryId).subscribe({
        next: () => {
          console.log('Categoría eliminada exitosamente');
          this.cargarCategorias();
          alert('Categoría eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          alert('Error al eliminar la categoría. Puede estar en uso.');
        }
      });
    }
  }

  toggleEstado(categoria: CategoriaAPI) {
    const nuevoEstado = !categoria.active;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    if (confirm(`¿Deseas ${accion} la categoría "${categoria.name}"?`)) {
      const categoriaActualizada = { ...categoria, active: nuevoEstado };

      this.categoriasService.actualizarCategoria(categoria.categoryId, categoriaActualizada).subscribe({
        next: () => {
          console.log(`Categoría ${accion}da exitosamente`);
          this.cargarCategorias();
          alert(`Categoría ${accion}da exitosamente`);
        },
        error: (error) => {
          console.error(`Error al ${accion} categoría:`, error);
          alert(`Error al ${accion} la categoría.`);
        }
      });
    }
  }

  crearNuevaCategoria() {
    this.router.navigate(['/categorias/nueva']);
  }

  verDetalles(categoria: CategoriaAPI) {
    console.log('Detalles de categoría:', categoria);
  }

  getTipoTexto(tipo: 'INCOME' | 'EXPENSE'): string {
    return tipo === 'INCOME' ? 'Ingreso' : 'Gasto';
  }

  getTipoClase(tipo: 'INCOME' | 'EXPENSE'): string {
    return tipo === 'INCOME' ? 'badge-income' : 'badge-expense';
  }

  getEstadoTexto(activo: boolean): string {
    return activo ? 'Activa' : 'Inactiva';
  }

  getEstadoClase(activo: boolean): string {
    return activo ? 'badge-active' : 'badge-inactive';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTotalCategorias(): number {
    return this.categorias.length;
  }

  getTotalIngresos(): number {
    return this.categorias.filter(cat => cat.type === 'INCOME').length;
  }

  getTotalGastos(): number {
    return this.categorias.filter(cat => cat.type === 'EXPENSE').length;
  }

  getTotalActivas(): number {
    return this.categorias.filter(cat => cat.active).length;
  }

  getTotalInactivas(): number {
    return this.categorias.filter(cat => !cat.active).length;
  }
}
