import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfiguracionUsuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: Date;
  avatar?: string;
  fechaCreacion: Date;
  ultimaActualizacion: Date;
}

export interface PreferenciasApp {
  tema: 'claro' | 'oscuro' | 'auto';
  idioma: 'es' | 'en';
  moneda: 'COP' | 'USD' | 'EUR';
  formatoFecha: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  notificaciones: {
    email: boolean;
    push: boolean;
    recordatorios: boolean;
  };
  privacidad: {
    datosAnaliticos: boolean;
    cookies: boolean;
  };
}

export interface BackupData {
  id: string;
  fecha: Date;
  tipo: 'completo' | 'gastos' | 'ingresos' | 'categorias';
  tamano: number;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private http = inject(HttpClient);

  // BehaviorSubjects para manejo de estado
  private configuracionSubject = new BehaviorSubject<ConfiguracionUsuario | null>(null);
  private preferenciasSubject = new BehaviorSubject<PreferenciasApp>(this.getPreferenciasPorDefecto());
  private backupsSubject = new BehaviorSubject<BackupData[]>([]);

  // Observables públicos
  public configuracion$ = this.configuracionSubject.asObservable();
  public preferencias$ = this.preferenciasSubject.asObservable();
  public backups$ = this.backupsSubject.asObservable();

  // URL del microservicio (debe ser configurada según tu entorno)
  private readonly API_URL = 'http://localhost:8080/api/configuracion'; // Cambiar según tu configuración

  constructor() {
    this.cargarConfiguracionInicial();
  }

  // ===== CONFIGURACIÓN DE USUARIO =====
  
  obtenerConfiguracion(): Observable<ConfiguracionUsuario | null> {
    return this.configuracion$;
  }

  actualizarConfiguracion(configuracion: Partial<ConfiguracionUsuario>): Observable<ConfiguracionUsuario> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.put<ConfiguracionUsuario>(`${this.API_URL}/usuario`, configuracion).pipe(
      tap(updatedConfig => {
        this.configuracionSubject.next(updatedConfig);
        this.guardarEnLocalStorage('configuracion', updatedConfig);
      })
    );
    */
    
    // Implementación temporal con datos locales
    const configuracionActual = this.configuracionSubject.value || this.getConfiguracionPorDefecto();
    const configuracionActualizada = {
      ...configuracionActual,
      ...configuracion,
      ultimaActualizacion: new Date()
    };
    
    this.configuracionSubject.next(configuracionActualizada);
    this.guardarEnLocalStorage('configuracion', configuracionActualizada);
    
    return new Observable(observer => {
      observer.next(configuracionActualizada);
      observer.complete();
    });
  }

  // ===== PREFERENCIAS DE LA APLICACIÓN =====
  
  obtenerPreferencias(): Observable<PreferenciasApp> {
    return this.preferencias$;
  }

  actualizarPreferencias(preferencias: Partial<PreferenciasApp>): Observable<PreferenciasApp> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.put<PreferenciasApp>(`${this.API_URL}/preferencias`, preferencias).pipe(
      tap(updatedPrefs => {
        this.preferenciasSubject.next(updatedPrefs);
        this.guardarEnLocalStorage('preferencias', updatedPrefs);
        this.aplicarPreferencias(updatedPrefs);
      })
    );
    */
    
    // Implementación temporal con datos locales
    const preferenciasActuales = this.preferenciasSubject.value;
    const preferenciasActualizadas = {
      ...preferenciasActuales,
      ...preferencias
    };
    
    this.preferenciasSubject.next(preferenciasActualizadas);
    this.guardarEnLocalStorage('preferencias', preferenciasActualizadas);
    this.aplicarPreferencias(preferenciasActualizadas);
    
    return new Observable(observer => {
      observer.next(preferenciasActualizadas);
      observer.complete();
    });
  }

  // ===== BACKUP Y RESTORE =====
  
  obtenerBackups(): Observable<BackupData[]> {
    return this.backups$;
  }

  crearBackup(tipo: BackupData['tipo'], descripcion: string): Observable<BackupData> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.post<BackupData>(`${this.API_URL}/backup`, { tipo, descripcion }).pipe(
      tap(backup => {
        const backups = this.backupsSubject.value;
        this.backupsSubject.next([backup, ...backups]);
      })
    );
    */
    
    // Implementación temporal con datos locales
    const nuevoBackup: BackupData = {
      id: this.generarId(),
      fecha: new Date(),
      tipo,
      tamano: Math.floor(Math.random() * 1000000) + 100000, // Tamaño simulado
      descripcion
    };
    
    const backups = this.backupsSubject.value;
    this.backupsSubject.next([nuevoBackup, ...backups]);
    this.guardarEnLocalStorage('backups', [nuevoBackup, ...backups]);
    
    return new Observable(observer => {
      observer.next(nuevoBackup);
      observer.complete();
    });
  }

  restaurarBackup(backupId: string): Observable<boolean> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.post<boolean>(`${this.API_URL}/restore/${backupId}`, {}).pipe(
      tap(success => {
        if (success) {
          // Recargar datos después del restore
          this.cargarConfiguracionInicial();
        }
      })
    );
    */
    
    // Implementación temporal
    console.log(`Restaurando backup: ${backupId}`);
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  eliminarBackup(backupId: string): Observable<boolean> {
    // TODO: Implementar llamada HTTP cuando esté disponible el microservicio
    /*
    return this.http.delete<boolean>(`${this.API_URL}/backup/${backupId}`).pipe(
      tap(success => {
        if (success) {
          const backups = this.backupsSubject.value.filter(b => b.id !== backupId);
          this.backupsSubject.next(backups);
          this.guardarEnLocalStorage('backups', backups);
        }
      })
    );
    */
    
    // Implementación temporal
    const backups = this.backupsSubject.value.filter(b => b.id !== backupId);
    this.backupsSubject.next(backups);
    this.guardarEnLocalStorage('backups', backups);
    
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  // ===== MÉTODOS PRIVADOS =====
  
  private cargarConfiguracionInicial(): void {
    // Cargar configuración desde localStorage
    const configuracionGuardada = this.obtenerDeLocalStorage('configuracion');
    if (configuracionGuardada) {
      this.configuracionSubject.next(configuracionGuardada);
    } else {
      this.configuracionSubject.next(this.getConfiguracionPorDefecto());
    }

    // Cargar preferencias desde localStorage
    const preferenciasGuardadas = this.obtenerDeLocalStorage('preferencias');
    if (preferenciasGuardadas) {
      this.preferenciasSubject.next(preferenciasGuardadas);
      this.aplicarPreferencias(preferenciasGuardadas);
    } else {
      const preferenciasPorDefecto = this.getPreferenciasPorDefecto();
      this.preferenciasSubject.next(preferenciasPorDefecto);
      this.aplicarPreferencias(preferenciasPorDefecto);
    }

    // Cargar backups desde localStorage
    const backupsGuardados = this.obtenerDeLocalStorage('backups');
    if (backupsGuardados) {
      this.backupsSubject.next(backupsGuardados);
    }
  }

  private getConfiguracionPorDefecto(): ConfiguracionUsuario {
    return {
      id: 1,
      nombre: 'Jesus_David777',
      email: 'jesus.david@ejemplo.com',
      telefono: '+57 300 123 4567',
      fechaNacimiento: new Date('1990-01-01'),
      avatar: '',
      fechaCreacion: new Date(),
      ultimaActualizacion: new Date()
    };
  }

  private getPreferenciasPorDefecto(): PreferenciasApp {
    return {
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
  }

  private aplicarPreferencias(preferencias: PreferenciasApp): void {
    // Aplicar tema
    document.body.classList.remove('tema-claro', 'tema-oscuro');
    if (preferencias.tema === 'oscuro') {
      document.body.classList.add('tema-oscuro');
    } else if (preferencias.tema === 'claro') {
      document.body.classList.add('tema-claro');
    }
    // Si es 'auto', se puede implementar detección del tema del sistema

    // Aplicar idioma (si se implementa i18n)
    // Aplicar formato de fecha
    // etc.
  }

  private guardarEnLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  private obtenerDeLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al obtener de localStorage:', error);
      return null;
    }
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ===== MÉTODOS DE UTILIDAD =====
  
  formatearFecha(fecha: Date, formato: string = 'DD/MM/YYYY'): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    
    switch (formato) {
      case 'MM/DD/YYYY':
        return `${mes}/${dia}/${año}`;
      case 'YYYY-MM-DD':
        return `${año}-${mes}-${dia}`;
      default:
        return `${dia}/${mes}/${año}`;
    }
  }

  formatearMoneda(monto: number, moneda: string = 'COP'): string {
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda
    });
    return formatter.format(monto);
  }
}
