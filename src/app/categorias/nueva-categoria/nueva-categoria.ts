import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaGasto } from '../../models/models-module';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-nueva-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nueva-categoria.html',
  styleUrl: './nueva-categoria.css'
})
export class NuevaCategoria implements OnInit {
  categoriaForm: FormGroup;
  iconosDisponibles = [
    'restaurant', 'directions_car', 'home', 'local_hospital', 'school', 'movie', 'checkroom', 'computer', 'account_balance_wallet', 'credit_card',
    'music_note', 'sports_esports', 'directions_run', 'flight', 'lunch_dining', 'local_cafe', 'shopping_cart', 'store', 'sports_soccer', 'phone_android',
    'palette', 'build', 'eco', 'festival', 'emoji_events', 'menu_book', 'theater_comedy', 'beach_access', 'music_video', 'camera_alt'
  ];
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private categoriasService = inject(CategoriasService);

  constructor() {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      icono: ['restaurant', [Validators.required]],
      descripcion: ['', [Validators.maxLength(200)]],
      color: ['#014047', [Validators.required]]
    });
  }

  ngOnInit() {
    // Inicialización adicional si es necesaria
  }

  // Método para guardar la nueva categoría
  guardarCategoria() {
    if (this.categoriaForm.valid) {
      const nuevaCategoria: CategoriaGasto = {
        id: 0, // Se asignará en el servicio
        nombre: this.categoriaForm.value.nombre.trim(),
        icono: this.categoriaForm.value.icono,
        descripcion: this.categoriaForm.value.descripcion?.trim() || '',
        color: this.categoriaForm.value.color
      };

      this.categoriasService.crearCategoria(nuevaCategoria).subscribe({
        next: (categoria) => {
          console.log('Categoría creada exitosamente:', categoria);
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.categoriaForm.controls).forEach(key => {
        this.categoriaForm.get(key)?.markAsTouched();
      });
    }
  }

  // Método para regresar
  regresar() {
    this.router.navigate(['/categorias']);
  }

  // Método para obtener el mensaje de error de un campo
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

  // Método para verificar si un campo tiene error
  hasError(fieldName: string): boolean {
    const field = this.categoriaForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}
