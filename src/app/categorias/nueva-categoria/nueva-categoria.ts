import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaRequest } from '../../interface/categories.interface';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-nueva-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nueva-categoria.html',
  styleUrl: './nueva-categoria.css'
})
export class NuevaCategoria implements OnInit {
  categoriaForm!: FormGroup;

  guardando = false;
  mensajeError = '';
  mensajeExito = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private categoriasService = inject(CategoriasService);

  ngOnInit() {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      tipo: ['EXPENSE', [Validators.required]]
    });
  }

  guardarCategoria() {
    if (this.categoriaForm.valid) {
      this.guardando = true;
      this.mensajeError = '';
      this.mensajeExito = '';
      this.categoriaForm.disable();

      const request: CategoriaRequest = {
        name: this.categoriaForm.value.nombre.trim(),
        type: this.categoriaForm.value.tipo
      };

      this.categoriasService.crearCategoria(request).subscribe({
        next: (categoria) => {
          console.log('Categoría creada exitosamente:', categoria);
          this.mensajeExito = 'Categoría creada exitosamente';
          this.guardando = false;

          setTimeout(() => {
            this.router.navigate(['/categorias']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.mensajeError = error.message || 'Error al crear la categoría. Por favor, intenta nuevamente.';
          this.guardando = false;
          this.categoriaForm.enable();
        }
      });
    } else {
      Object.keys(this.categoriaForm.controls).forEach(key => {
        this.categoriaForm.get(key)?.markAsTouched();
      });
      this.mensajeError = 'Por favor, completa todos los campos requeridos correctamente.';
    }
  }

  regresar() {
    if (this.categoriaForm.dirty && !this.guardando) {
      if (confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.')) {
        this.router.navigate(['/categorias']);
      }
    } else {
      this.router.navigate(['/categorias']);
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.categoriaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  hasError(fieldName: string): boolean {
    const field = this.categoriaForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  limpiarMensajes() {
    this.mensajeError = '';
    this.mensajeExito = '';
  }
}
