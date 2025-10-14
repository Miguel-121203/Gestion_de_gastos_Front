# Módulo de Categorías de Gastos

## Descripción
Este módulo permite crear y gestionar categorías personalizadas para los gastos. Las categorías creadas se integran automáticamente con los formularios de gastos existentes.

## Estructura del Módulo

```
src/app/categorias/
├── categorias-module.ts           # Módulo principal
├── categorias-routing-module.ts   # Configuración de rutas
├── inicio-categorias/             # Página de inicio del módulo
├── nueva-categoria/               # Formulario para crear categorías
├── consulta-categorias/           # Lista y gestión de categorías
└── README.md                      # Esta documentación
```

## Características

### 🎯 Funcionalidades Principales
- **Crear categorías personalizadas** con nombre, icono, descripción y color
- **Consultar todas las categorías** con filtros de búsqueda
- **Editar y eliminar categorías** existentes
- **Integración automática** con los selects de gastos
- **Diseño responsivo** consistente con el resto de la aplicación

### 🎨 Interfaz de Usuario
- **Selector de iconos** con más de 30 opciones
- **Selector de colores** personalizable
- **Vista previa** en tiempo real de la categoría
- **Validaciones** de formulario completas
- **Filtros de búsqueda** por nombre y descripción

## Integración con Gastos

### Actualización de Selects
Para que las categorías creadas aparezcan automáticamente en los selects de gastos, necesitas actualizar los componentes correspondientes:

#### 1. En `nuevo-gasto.html`:
```html
<select id="categoria" name="categoria">
  <option value="">Seleccione la categoria</option>
  <option *ngFor="let categoria of categoriasDisponibles" 
          [value]="categoria.nombre.toLowerCase().replace(/\s+/g, '_')">
    {{ categoria.icono }} {{ categoria.nombre }}
  </option>
</select>
```

#### 2. En `consulta-gastos.html`:
```html
<select id="categoria-filtro" [(ngModel)]="categoriaSeleccionada">
  <option value="">Seleccione la categoria</option>
  <option *ngFor="let categoria of categoriasDisponibles" 
          [value]="categoria.nombre.toLowerCase().replace(/\s+/g, '_')">
    {{ categoria.icono }} {{ categoria.nombre }}
  </option>
</select>
```

#### 3. En los componentes TypeScript:
```typescript
// Agregar en el constructor o ngOnInit
private categoriasService = inject(CategoriasService);
categoriasDisponibles: CategoriaGasto[] = [];

ngOnInit() {
  this.categoriasService.obtenerCategorias().subscribe(categorias => {
    this.categoriasDisponibles = categorias;
  });
}
```

## Servicio de Categorías

### Métodos Disponibles
- `obtenerCategorias()`: Obtiene todas las categorías
- `crearCategoria(categoria)`: Crea una nueva categoría
- `actualizarCategoria(id, categoria)`: Actualiza una categoría existente
- `eliminarCategoria(id)`: Elimina una categoría
- `obtenerCategoriaPorId(id)`: Obtiene una categoría específica
- `buscarCategorias(texto)`: Busca categorías por texto

### Integración con Microservicio
El servicio está preparado para conectarse con un microservicio backend. Para activar la integración:

1. **Configurar la URL del API** en `categorias.service.ts`:
```typescript
private readonly API_URL = 'http://tu-servidor:puerto/api/categorias';
```

2. **Descomentar las llamadas HTTP** en los métodos del servicio
3. **Implementar manejo de errores** específico para tu backend

## Modelo de Datos

```typescript
interface CategoriaGasto {
  id: number;
  nombre: string;
  icono: string;
  descripcion?: string;
  color?: string;
  fechaCreacion?: Date;
  activa?: boolean;
}
```

## Navegación

### Rutas Disponibles
- `/categorias` - Página de inicio del módulo
- `/categorias/nueva-categoria` - Crear nueva categoría
- `/categorias/consulta-categorias` - Gestionar categorías existentes

### Integración en Sidebar
El módulo ya está integrado en la navegación principal del sidebar con el icono 📋.

## Estilos

### Clases CSS Principales
- `.categorias-container` - Contenedor principal
- `.categoria-card` - Tarjeta de categoría individual
- `.icono-selector` - Selector de iconos
- `.color-selector` - Selector de colores
- `.preview-section` - Sección de vista previa

### Responsive Design
El módulo es completamente responsivo y se adapta a:
- **Desktop**: Grid de 3 columnas para categorías
- **Tablet**: Grid de 2 columnas
- **Mobile**: Grid de 1 columna

## Próximos Pasos

### Para Completar la Integración:
1. **Actualizar componentes de gastos** para usar el servicio de categorías
2. **Configurar el microservicio** backend
3. **Implementar edición de categorías** (modal o página separada)
4. **Agregar validaciones** adicionales (nombres únicos, etc.)
5. **Implementar categorías por usuario** (si es necesario)

### Consideraciones Técnicas:
- Las categorías se almacenan localmente por ahora
- El servicio emite cambios para sincronización en tiempo real
- Preparado para migración a backend cuando esté disponible
- Validaciones de formulario completas implementadas

## Testing
Para probar el módulo:
1. Navegar a `/categorias`
2. Crear una nueva categoría
3. Verificar que aparece en la consulta
4. Probar filtros de búsqueda
5. Verificar diseño responsivo en diferentes dispositivos
