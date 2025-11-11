import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { IngresosService } from '../../services/ingresos.service';
import { CategoriasService } from '../../services/categorias.service';
import { AuthService } from '../../services/auth.service';
import { income } from '../../interface/income.interface';
import { CategoriaAPI } from '../../interface/categories.interface';

@Component({
  selector: 'app-nuevo-ingreso',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './nuevo-ingreso.html',
  styleUrl: './nuevo-ingreso.css'
})
export class NuevoIngreso implements OnInit {

  nuevoIngreso: income = {
    amount: 0,
    incomeCategoryId: 0,
    incomeDate: new Date(),
    description: '',
    userId: 0 // Se establecerá en ngOnInit
  };

  categorias: CategoriaAPI[] = [];
  categoriasIngreso: CategoriaAPI[] = []; // Solo categorías de tipo INCOME

  isLoading: boolean = false;
  isLoadingCategorias: boolean = false;
  errorMessage: string = '';

  private ingresosService = inject(IngresosService);
  private categoriasService = inject(CategoriasService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Obtener userId del usuario autenticado
    const userId = this.authService.getUserId();
    if (userId) {
      this.nuevoIngreso.userId = userId;
      console.log('✅ Usuario ID cargado:', userId);
    } else {
      console.error('❌ No se pudo obtener el userId');
      this.errorMessage = 'Error: No se pudo identificar el usuario';
    }

    this.cargarCategorias();
  }

  cargarCategorias() {
  this.isLoadingCategorias = true;

  // Cargar solo categorías de tipo INCOME
  this.categoriasService.obtenerCategoriasPorTipo('INCOME').subscribe({
    next: (categorias) => {
      this.categoriasIngreso = categorias.filter(cat => cat.type); // Quita el && cat.active
      console.log('Categorías de ingreso cargadas:', this.categoriasIngreso);
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
        // Filtrar solo categorías activas de tipo INCOME
        this.categoriasIngreso = categorias.filter(cat =>
          cat.type === 'INCOME' && cat.active
        );
        console.log('Categorías de ingreso cargadas:', this.categoriasIngreso);
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

  createIngreso() {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.validarIngreso()) {
      this.isLoading = false;
      return;
    }

    console.log('Datos a enviar:', this.nuevoIngreso);

    this.ingresosService.createIngreso(this.nuevoIngreso).subscribe({
      next: (ingresoCreado) => {
        console.log('Ingreso creado exitosamente:', ingresoCreado);
        this.isLoading = false;
        alert('¡Ingreso creado exitosamente!');
        this.router.navigate(['/ingresos']);
      },
      error: (error) => {
        console.error('Error completo:', error);
        if (error.error && typeof error.error === 'object') {
          console.error('Detalles del error:', error.error);
          this.errorMessage = error.error.message || 'Error al crear el ingreso';
        } else {
          this.errorMessage = 'Error al crear el ingreso. Por favor intenta nuevamente.';
        }
        this.isLoading = false;
      }
    });
  }

  validarIngreso(): boolean {
    if (!this.nuevoIngreso.amount || this.nuevoIngreso.amount <= 0) {
      this.errorMessage = 'El monto debe ser mayor a 0';
      return false;
    }
    if (!this.nuevoIngreso.incomeCategoryId || this.nuevoIngreso.incomeCategoryId === 0) {
      this.errorMessage = 'Debe seleccionar una categoría';
      return false;
    }
    if (!this.nuevoIngreso.incomeDate) {
      this.errorMessage = 'Debe seleccionar una fecha';
      return false;
    }
    if (!this.nuevoIngreso.description || !this.nuevoIngreso.description.trim()) {
      this.errorMessage = 'La descripción es obligatoria';
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.nuevoIngreso = {
      amount: 0,
      incomeCategoryId: 0,
      incomeDate: new Date(),
      description: '',
      userId: 1
    };
    this.errorMessage = '';
  }

  // Método auxiliar para obtener el nombre de una categoría
  getNombreCategoria(categoryId: number): string {
    const categoria = this.categoriasIngreso.find(cat => cat.categoryId === categoryId);
    return categoria ? categoria.name : 'Sin categoría';
  }
}
