import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfiguracionService, PreferenciasApp } from '../../services/configuracion.service';

@Component({
  selector: 'app-preferencias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './preferencias.html',
  styleUrl: './preferencias.css'
})
export class Preferencias implements OnInit {
  preferenciasForm: FormGroup;
  preferencias: PreferenciasApp | null = null;
  isLoading = false;
  mensajeExito = '';
  mensajeError = '';

  private fb = inject(FormBuilder);
  private configuracionService = inject(ConfiguracionService);

  constructor() {
    this.preferenciasForm = this.fb.group({
      tema: ['claro'],
      idioma: ['es'],
      moneda: ['COP'],
      formatoFecha: ['DD/MM/YYYY'],
      notificaciones: this.fb.group({
        email: [true],
        push: [true],
        recordatorios: [true]
      }),
      privacidad: this.fb.group({
        datosAnaliticos: [false],
        cookies: [true]
      })
    });
  }

  ngOnInit() {
    this.cargarPreferencias();
  }

  cargarPreferencias() {
    this.configuracionService.obtenerPreferencias().subscribe({
      next: (prefs) => {
        this.preferencias = prefs;
        this.preferenciasForm.patchValue(prefs);
      },
      error: (error) => {
        console.error('Error al cargar preferencias:', error);
        this.mensajeError = 'Error al cargar las preferencias';
      }
    });
  }

  guardarPreferencias() {
    if (this.preferenciasForm.valid) {
      this.isLoading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      const preferenciasActualizadas = this.preferenciasForm.value;

      this.configuracionService.actualizarPreferencias(preferenciasActualizadas).subscribe({
        next: (prefs) => {
          this.preferencias = prefs;
          this.isLoading = false;
          this.mensajeExito = 'Preferencias guardadas correctamente';
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (error) => {
          console.error('Error al guardar preferencias:', error);
          this.mensajeError = 'Error al guardar las preferencias';
          this.isLoading = false;
        }
      });
    }
  }

  resetearPreferencias() {
    if (confirm('¿Estás seguro de que quieres resetear todas las preferencias a los valores por defecto?')) {
      const preferenciasPorDefecto = {
        tema: 'claro',
        idioma: 'es',
        moneda: 'COP',
        formatoFecha: 'DD/MM/YYYY',
        notificaciones: {
          email: true,
          push: true,
          recordatorios: true
        },
        privacidad: {
          datosAnaliticos: false,
          cookies: true
        }
      };

      this.preferenciasForm.patchValue(preferenciasPorDefecto);
      this.guardarPreferencias();
    }
  }

  obtenerDescripcionTema(tema: string): string {
    switch (tema) {
      case 'claro': return 'Tema claro y brillante';
      case 'oscuro': return 'Tema oscuro para reducir fatiga visual';
      case 'auto': return 'Se adapta automáticamente al sistema';
      default: return '';
    }
  }

  obtenerDescripcionIdioma(idioma: string): string {
    switch (idioma) {
      case 'es': return 'Español';
      case 'en': return 'English';
      default: return '';
    }
  }

  obtenerDescripcionMoneda(moneda: string): string {
    switch (moneda) {
      case 'COP': return 'Peso Colombiano (COP)';
      case 'USD': return 'Dólar Estadounidense (USD)';
      case 'EUR': return 'Euro (EUR)';
      default: return '';
    }
  }

  obtenerDescripcionFormatoFecha(formato: string): string {
    switch (formato) {
      case 'DD/MM/YYYY': return 'Día/Mes/Año (25/12/2024)';
      case 'MM/DD/YYYY': return 'Mes/Día/Año (12/25/2024)';
      case 'YYYY-MM-DD': return 'Año-Mes-Día (2024-12-25)';
      default: return '';
    }
  }
}
