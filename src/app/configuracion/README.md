# Módulo de Configuración

Este módulo permite a los usuarios gestionar su perfil, preferencias de la aplicación y realizar copias de seguridad de sus datos.

## Estructura del Módulo

```
configuracion/
├── configuracion-module.ts          # Módulo principal
├── configuracion-routing-module.ts  # Configuración de rutas
├── inicio-configuracion/            # Página de inicio del módulo
│   ├── inicio-configuracion.ts
│   ├── inicio-configuracion.html
│   └── inicio-configuracion.css
├── perfil-usuario/                  # Gestión del perfil de usuario
│   ├── perfil-usuario.ts
│   ├── perfil-usuario.html
│   └── perfil-usuario.css
├── preferencias/                    # Configuración de preferencias
│   ├── preferencias.ts
│   ├── preferencias.html
│   └── preferencias.css
├── backup-restore/                  # Gestión de backups
│   ├── backup-restore.ts
│   ├── backup-restore.html
│   └── backup-restore.css
└── README.md                        # Este archivo
```

## Componentes

### 1. Inicio Configuración
- **Ruta**: `/configuracion`
- **Propósito**: Página de inicio que presenta las opciones disponibles
- **Características**:
  - Navegación a las diferentes secciones
  - Información sobre las funcionalidades

### 2. Perfil de Usuario
- **Ruta**: `/configuracion/perfil-usuario`
- **Propósito**: Gestión de información personal del usuario
- **Características**:
  - Edición de datos personales (nombre, email, teléfono)
  - Avatar del usuario
  - Fecha de nacimiento
  - Modo de edición/visualización
  - Validación de formularios

### 3. Preferencias
- **Ruta**: `/configuracion/preferencias`
- **Propósito**: Configuración de preferencias de la aplicación
- **Características**:
  - **Apariencia**: Tema (claro/oscuro/auto), idioma
  - **Formato**: Moneda, formato de fecha
  - **Notificaciones**: Email, push, recordatorios
  - **Privacidad**: Datos analíticos, cookies
  - Aplicación automática de cambios

### 4. Backup y Restore
- **Ruta**: `/configuracion/backup-restore`
- **Propósito**: Gestión de copias de seguridad
- **Características**:
  - Creación de backups (completo, gastos, ingresos, categorías)
  - Lista de backups existentes
  - Restauración de datos
  - Eliminación de backups
  - Información de tamaño y fecha

## Servicio de Configuración

### ConfiguracionService
Ubicado en `src/app/services/configuracion.service.ts`

#### Interfaces Principales:
- `ConfiguracionUsuario`: Datos del perfil de usuario
- `PreferenciasApp`: Preferencias de la aplicación
- `BackupData`: Información de backups

#### Funcionalidades:
- Gestión de configuración de usuario
- Manejo de preferencias con aplicación automática
- Sistema de backup y restore
- Almacenamiento local (localStorage)
- Preparado para integración con API

## Características Técnicas

### Arquitectura
- **Standalone Components**: Todos los componentes son independientes
- **Lazy Loading**: El módulo se carga bajo demanda
- **Reactive Forms**: Formularios reactivos con validación
- **Material Icons**: Iconos profesionales consistentes

### Estado y Datos
- **BehaviorSubject**: Para manejo reactivo del estado
- **LocalStorage**: Persistencia local de datos
- **Observables**: Patrón reactivo para actualizaciones en tiempo real

### Estilos
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Consistencia Visual**: Mismo estilo que otros módulos
- **Material Design**: Iconos y componentes modernos

## Integración con API

El servicio está preparado para integración con microservicios:

```typescript
// URLs configuradas para futura integración
private readonly API_URL = 'http://localhost:8080/api/configuracion';

// Métodos HTTP comentados listos para activar
// - GET /configuracion/usuario
// - PUT /configuracion/usuario
// - GET /configuracion/preferencias
// - PUT /configuracion/preferencias
// - POST /configuracion/backup
// - GET /configuracion/backups
// - POST /configuracion/restore/{id}
// - DELETE /configuracion/backup/{id}
```

## Uso

### Navegación
1. Acceder desde el sidebar: "Configuración"
2. Seleccionar la opción deseada desde la página de inicio
3. Realizar cambios y guardar

### Flujo de Trabajo
1. **Perfil**: Editar información personal
2. **Preferencias**: Configurar experiencia de usuario
3. **Backup**: Crear copias de seguridad regulares
4. **Restore**: Restaurar datos cuando sea necesario

## Consideraciones de Seguridad

- Validación de formularios en frontend y backend
- Sanitización de datos de entrada
- Manejo seguro de archivos de backup
- Autenticación y autorización (cuando se integre con API)

## Futuras Mejoras

- [ ] Integración completa con microservicio
- [ ] Subida de avatares con validación
- [ ] Exportación de datos en diferentes formatos
- [ ] Configuración de notificaciones push
- [ ] Temas personalizados
- [ ] Configuración de múltiples usuarios
- [ ] Historial de cambios en configuración
