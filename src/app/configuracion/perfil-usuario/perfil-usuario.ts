import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfiguracionService, ConfiguracionUsuario } from '../../services/configuracion.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilUsuario implements OnInit {
  perfilForm: FormGroup;
  configuracion: ConfiguracionUsuario | null = null;
  isEditing = false;
  isLoading = false;
  mensajeExito = '';
  mensajeError = '';

  private fb = inject(FormBuilder);
  private router = inject(RouterModule);
  private configuracionService = inject(ConfiguracionService);

  constructor() {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]],
      fechaNacimiento: [''],
      avatar: ['']
    });
  }

  ngOnInit() {
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    this.configuracionService.obtenerConfiguracion().subscribe({
      next: (config) => {
        this.configuracion = config;
        if (config) {
          this.perfilForm.patchValue({
            nombre: config.nombre,
            email: config.email,
            telefono: config.telefono || '',
            fechaNacimiento: config.fechaNacimiento ? this.formatearFechaParaInput(config.fechaNacimiento) : '',
            avatar: config.avatar || ''
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar configuración:', error);
        this.mensajeError = 'Error al cargar la configuración del usuario';
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Si cancela la edición, recargar los datos originales
      this.cargarConfiguracion();
    }
  }

  guardarPerfil() {
    if (this.perfilForm.valid) {
      this.isLoading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      const datosActualizados = {
        ...this.perfilForm.value,
        fechaNacimiento: this.perfilForm.value.fechaNacimiento ? 
          new Date(this.perfilForm.value.fechaNacimiento) : undefined
      };

      this.configuracionService.actualizarConfiguracion(datosActualizados).subscribe({
        next: (configuracionActualizada) => {
          this.configuracion = configuracionActualizada;
          this.isEditing = false;
          this.isLoading = false;
          this.mensajeExito = 'Perfil actualizado correctamente';
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          this.mensajeError = 'Error al actualizar el perfil';
          this.isLoading = false;
        }
      });
    } else {
      this.mensajeError = 'Por favor, completa todos los campos requeridos correctamente';
    }
  }

  formatearFechaParaInput(fecha: Date): string {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    const año = fechaObj.getFullYear();
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return 'No especificada';
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerIniciales(nombre: string): string {
    if (!nombre) return 'U';
    return nombre.split(' ')
      .map(palabra => palabra.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getFechaActual(): Date {
    return new Date();
  }
}
