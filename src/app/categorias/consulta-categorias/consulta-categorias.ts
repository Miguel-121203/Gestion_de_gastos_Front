import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriaGasto } from '../../models/models-module';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-consulta-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-categorias.html',
  styleUrl: './consulta-categorias.css'
})
export class ConsultaCategorias implements OnInit, OnDestroy {
  categorias: CategoriaGasto[] = [];
  categoriasFiltradas: CategoriaGasto[] = [];
  filtroTexto: string = '';
  private categoriasSubscription?: Subscription;

  private router = inject(Router);
  private categoriasService = inject(CategoriasService);

  constructor() {}

  ngOnInit() {
    this.cargarCategorias();
  }

  ngOnDestroy() {
    if (this.categoriasSubscription) {
      this.categoriasSubscription.unsubscribe();
    }
  }

  // Cargar todas las categorías
  cargarCategorias() {
    this.categoriasSubscription = this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.categoriasFiltradas = [...categorias];
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  // Aplicar filtros
  aplicarFiltros() {
    if (!this.filtroTexto.trim()) {
      this.categoriasFiltradas = [...this.categorias];
    } else {
      const filtro = this.filtroTexto.toLowerCase();
      this.categoriasFiltradas = this.categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(filtro) ||
        categoria.descripcion?.toLowerCase().includes(filtro)
      );
    }
  }

  // Limpiar filtros
  limpiarFiltros() {
    this.filtroTexto = '';
    this.categoriasFiltradas = [...this.categorias];
  }

  // Editar categoría
  editarCategoria(categoria: CategoriaGasto) {
    // Aquí podrías navegar a una página de edición o abrir un modal
    console.log('Editar categoría:', categoria);
    // this.router.navigate(['/categorias/editar-categoria', categoria.id]);
  }

  // Eliminar categoría
  eliminarCategoria(categoria: CategoriaGasto) {
    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`)) {
      this.categoriasService.eliminarCategoria(categoria.id).subscribe({
        next: (exito) => {
          if (exito) {
            console.log('Categoría eliminada exitosamente');
            this.cargarCategorias(); // Recargar la lista
          }
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }

  // Regresar al inicio
  regresar() {
    this.router.navigate(['/categorias']);
  }

  // Ir a nueva categoría
  irANuevaCategoria() {
    this.router.navigate(['/categorias/nueva-categoria']);
  }

  // Contar total de categorías
  getTotalCategorias(): number {
    return this.categorias.length;
  }

  // Contar categorías filtradas
  getTotalFiltradas(): number {
    return this.categoriasFiltradas.length;
  }
}
