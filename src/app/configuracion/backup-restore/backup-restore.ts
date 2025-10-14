import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfiguracionService, BackupData } from '../../services/configuracion.service';

@Component({
  selector: 'app-backup-restore',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './backup-restore.html',
  styleUrl: './backup-restore.css'
})
export class BackupRestore implements OnInit {
  backupForm: FormGroup;
  backups: BackupData[] = [];
  isLoading = false;
  mensajeExito = '';
  mensajeError = '';
  backupSeleccionado: BackupData | null = null;

  private fb = inject(FormBuilder);
  private configuracionService = inject(ConfiguracionService);

  constructor() {
    this.backupForm = this.fb.group({
      tipo: ['completo', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  ngOnInit() {
    this.cargarBackups();
  }

  cargarBackups() {
    this.configuracionService.obtenerBackups().subscribe({
      next: (backups) => {
        this.backups = backups;
      },
      error: (error) => {
        console.error('Error al cargar backups:', error);
        this.mensajeError = 'Error al cargar los backups';
      }
    });
  }

  crearBackup() {
    if (this.backupForm.valid) {
      this.isLoading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      const { tipo, descripcion } = this.backupForm.value;

      this.configuracionService.crearBackup(tipo, descripcion).subscribe({
        next: (backup) => {
          this.isLoading = false;
          this.mensajeExito = `Backup "${descripcion}" creado exitosamente`;
          this.backupForm.reset({ tipo: 'completo' });
          this.cargarBackups();
          setTimeout(() => this.mensajeExito = '', 5000);
        },
        error: (error) => {
          console.error('Error al crear backup:', error);
          this.mensajeError = 'Error al crear el backup';
          this.isLoading = false;
        }
      });
    } else {
      this.mensajeError = 'Por favor, completa todos los campos requeridos';
    }
  }

  seleccionarBackup(backup: BackupData) {
    this.backupSeleccionado = backup;
  }

  restaurarBackup(backup: BackupData) {
    if (confirm(`¿Estás seguro de que quieres restaurar el backup "${backup.descripcion}"?\n\nEsta acción reemplazará todos los datos actuales.`)) {
      this.isLoading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      this.configuracionService.restaurarBackup(backup.id).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.mensajeExito = `Backup "${backup.descripcion}" restaurado exitosamente`;
            setTimeout(() => this.mensajeExito = '', 5000);
          } else {
            this.mensajeError = 'Error al restaurar el backup';
          }
        },
        error: (error) => {
          console.error('Error al restaurar backup:', error);
          this.mensajeError = 'Error al restaurar el backup';
          this.isLoading = false;
        }
      });
    }
  }

  eliminarBackup(backup: BackupData) {
    if (confirm(`¿Estás seguro de que quieres eliminar el backup "${backup.descripcion}"?\n\nEsta acción no se puede deshacer.`)) {
      this.isLoading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      this.configuracionService.eliminarBackup(backup.id).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.mensajeExito = `Backup "${backup.descripcion}" eliminado exitosamente`;
            this.cargarBackups();
            if (this.backupSeleccionado?.id === backup.id) {
              this.backupSeleccionado = null;
            }
            setTimeout(() => this.mensajeExito = '', 5000);
          } else {
            this.mensajeError = 'Error al eliminar el backup';
          }
        },
        error: (error) => {
          console.error('Error al eliminar backup:', error);
          this.mensajeError = 'Error al eliminar el backup';
          this.isLoading = false;
        }
      });
    }
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  obtenerIconoTipo(tipo: string): string {
    switch (tipo) {
      case 'completo': return 'backup';
      case 'gastos': return 'trending_down';
      case 'ingresos': return 'trending_up';
      case 'categorias': return 'category';
      default: return 'backup';
    }
  }

  obtenerDescripcionTipo(tipo: string): string {
    switch (tipo) {
      case 'completo': return 'Todos los datos (gastos, ingresos, categorías)';
      case 'gastos': return 'Solo gastos y sus categorías';
      case 'ingresos': return 'Solo ingresos y sus categorías';
      case 'categorias': return 'Solo categorías personalizadas';
      default: return '';
    }
  }

  obtenerColorTipo(tipo: string): string {
    switch (tipo) {
      case 'completo': return '#014047';
      case 'gastos': return '#dc3545';
      case 'ingresos': return '#28a745';
      case 'categorias': return '#ffc107';
      default: return '#6c757d';
    }
  }
}
