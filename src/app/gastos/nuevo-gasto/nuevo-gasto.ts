import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { GastosService } from '../../services/gastos.service';
import { CategoriaGasto, Gasto } from '../../interface/gasto.interface';


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
    expenseDate: new Date(),
    description: '',
    userId: 1 // Cambia esto por el ID del usuario logueado
  };

  // Categorías precargadas
  categorias: CategoriaGasto[] = [
    { id: 1, nombre: 'Alimentación', description: 'Gastos de comida y bebidas' },
    { id: 2, nombre: 'Transporte', description: 'Gastos de movilidad' },
    { id: 3, nombre: 'Entretenimiento', description: 'Gastos de ocio' },
    { id: 4, nombre: 'Salud', description: 'Gastos médicos' },
    { id: 5, nombre: 'Educación', description: 'Gastos educativos' },
    { id: 6, nombre: 'Servicios', description: 'Servicios públicos y privados' },
    { id: 7, nombre: 'Vivienda', description: 'Gastos del hogar' },
    { id: 8, nombre: 'Ropa', description: 'Vestimenta y accesorios' },
    { id: 9, nombre: 'Tecnología', description: 'Dispositivos y software' },
    { id: 10, nombre: 'Otros', description: 'Gastos varios' }
  ];

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private gastosService: GastosService,
    private router: Router
  ) {}

  ngOnInit() {

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
    const today = new Date().toISOString().split('T')[0];
    this.nuevoGasto = {
      amount: 0,
      expenseCategoryId: 0,
      expenseDate: new Date(),
      description: '',
      userId: 1
    };
    this.errorMessage = '';
  }
}
