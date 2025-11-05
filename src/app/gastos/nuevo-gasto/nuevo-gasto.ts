import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { GastosService } from '../../services/gastos.service';
import { CategoriasService } from '../../services/categorias.service';
import { Gasto } from '../../interface/gasto.interface';
import { CategoriaAPI } from '../../interface/categories.interface';

@Component({
  selector: 'app-nuevo-gasto',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './nuevo-gasto.html',
  styleUrl: './nuevo-gasto.css'
})
export class NuevoGasto implements OnInit {

nuevoGasto: Gasto = {
  amount: 0,
  expenseCategoryId: 0,
  expenseDate: new Date().toISOString().split('T')[0], // ✅ Formato "YYYY-MM-DD"
  description: '',
  userId: 1
};

  categorias: CategoriaAPI[] = [];
  categoriasGasto: CategoriaAPI[] = []; // Solo categorías de tipo EXPENSE

  isLoading: boolean = false;
  isLoadingCategorias: boolean = false;
  errorMessage: string = '';

  private gastosService = inject(GastosService);
  private categoriasService = inject(CategoriasService);
  private router = inject(Router);

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.isLoadingCategorias = true;

    // Opción 1: Cargar solo categorías de tipo EXPENSE
    this.categoriasService.obtenerCategoriasPorTipo('EXPENSE').subscribe({
      next: (categorias) => {
        this.categoriasGasto = categorias.filter(cat => cat.type)
        console.log('Categorías de gasto cargadas:', this.categoriasGasto);
        this.isLoadingCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.errorMessage = 'Error al cargar las categorías';
        this.isLoadingCategorias = false;
      }
    });

    // Opción 2: Si quieres cargar todas y filtrar
    /*
    this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        // Filtrar solo categorías activas de tipo EXPENSE
        this.categoriasGasto = categorias.filter(cat =>
          cat.type === 'EXPENSE' && cat.active
        );
        console.log('Categorías de gasto cargadas:', this.categoriasGasto);
        this.isLoadingCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.errorMessage = 'Error al cargar las categorías';
        this.isLoadingCategorias = false;
      }
    });
    */
  }

  createGasto() {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.validarGasto()) {
      this.isLoading = false;
      return;
    }

    console.log('Datos a enviar:', this.nuevoGasto);

    this.gastosService.createGasto(this.nuevoGasto).subscribe({
      next: (gastoCreado) => {
        console.log('Gasto creado exitosamente:', gastoCreado);
        this.isLoading = false;
        alert('¡Gasto creado exitosamente!');
        this.router.navigate(['/gastos']);
      },
      error: (error) => {
        console.error('Error completo:', error);
        if (error.error && typeof error.error === 'object') {
          console.error('Detalles del error:', error.error);
          this.errorMessage = error.error.message || 'Error al crear el gasto';
        } else {
          this.errorMessage = 'Error al crear el gasto. Por favor intenta nuevamente.';
        }
        this.isLoading = false;
      }
    });
  }

  validarGasto(): boolean {
    if (!this.nuevoGasto.amount || this.nuevoGasto.amount <= 0) {
      this.errorMessage = 'El monto debe ser mayor a 0';
      return false;
    }
    if (!this.nuevoGasto.expenseCategoryId || this.nuevoGasto.expenseCategoryId === 0) {
      this.errorMessage = 'Debe seleccionar una categoría';
      return false;
    }
    if (!this.nuevoGasto.expenseDate) {
      this.errorMessage = 'Debe seleccionar una fecha';
      return false;
    }
    if (!this.nuevoGasto.description || !this.nuevoGasto.description.trim()) {
      this.errorMessage = 'La descripción es obligatoria';
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.nuevoGasto = {
      amount: 0,
      expenseCategoryId: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
      userId: 1
    };
    this.errorMessage = '';
  }

  // Método auxiliar para obtener el nombre de una categoría
  getNombreCategoria(categoryId: number): string {
    const categoria = this.categoriasGasto.find(cat => cat.categoryId === categoryId);
    return categoria ? categoria.name : 'Sin categoría';
  }
}
