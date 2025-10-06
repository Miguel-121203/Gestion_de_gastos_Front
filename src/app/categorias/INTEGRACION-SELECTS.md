# Integración de Categorías con Selects Existentes

## Pasos para Integrar las Categorías Dinámicas

### 1. Actualizar el Componente `nuevo-gasto.ts`

```typescript
// Agregar imports
import { OnInit, inject } from '@angular/core';
import { CategoriaGasto } from '../../models/models-module';
import { CategoriasService } from '../../services/categorias.service';

// Agregar en la clase
export class NuevoGasto implements OnInit {
  private categoriasService = inject(CategoriasService);
  categoriasDisponibles: CategoriaGasto[] = [];
  categoriaSeleccionada: string = '';

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categoriasDisponibles = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  getValorCategoria(categoria: CategoriaGasto): string {
    return categoria.nombre.toLowerCase().replace(/\s+/g, '_');
  }
}
```

### 2. Actualizar el Template `nuevo-gasto.html`

```html
<!-- Reemplazar el select estático -->
<select id="categoria" name="categoria" [(ngModel)]="categoriaSeleccionada">
  <option value="">Seleccione la categoria</option>
  <option *ngFor="let categoria of categoriasDisponibles" 
          [value]="getValorCategoria(categoria)">
    {{ categoria.icono }} {{ categoria.nombre }}
  </option>
</select>
```

### 3. Actualizar el Componente `consulta-gastos.ts`

```typescript
// Agregar imports
import { OnInit, inject } from '@angular/core';
import { CategoriaGasto } from '../../models/models-module';
import { CategoriasService } from '../../services/categorias.service';

// Agregar en la clase
export class ConsultaGastos implements OnInit {
  private categoriasService = inject(CategoriasService);
  categoriasDisponibles: CategoriaGasto[] = [];

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categoriasDisponibles = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  getValorCategoria(categoria: CategoriaGasto): string {
    return categoria.nombre.toLowerCase().replace(/\s+/g, '_');
  }
}
```

### 4. Actualizar el Template `consulta-gastos.html`

```html
<!-- Reemplazar el select de filtro -->
<select id="categoria-filtro" [(ngModel)]="categoriaSeleccionada">
  <option value="">Seleccione la categoria</option>
  <option *ngFor="let categoria of categoriasDisponibles" 
          [value]="getValorCategoria(categoria)">
    {{ categoria.icono }} {{ categoria.nombre }}
  </option>
</select>
```

## Resultado

Una vez implementados estos cambios:

1. **Las categorías creadas** en el módulo de categorías aparecerán automáticamente en los selects
2. **Los selects se actualizarán** en tiempo real cuando se agreguen nuevas categorías
3. **Se mantendrá la consistencia** en el formato de valores (nombre en minúsculas con guiones bajos)
4. **Los iconos** de las categorías se mostrarán junto al nombre para mejor UX

## Notas Importantes

- Los valores de los selects usan el formato `nombre_categoria` (minúsculas, guiones bajos)
- Los iconos se muestran junto al nombre para mejor identificación
- El servicio maneja automáticamente la sincronización entre componentes
- Las categorías por defecto se mantienen como fallback en caso de error
