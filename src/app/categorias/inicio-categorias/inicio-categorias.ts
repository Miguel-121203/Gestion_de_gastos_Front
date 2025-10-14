import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio-categorias.html',
  styleUrl: './inicio-categorias.css'
})
export class InicioCategorias {
  
  constructor() { }

  // Método para navegar a nueva categoría
  irANuevaCategoria() {
    // La navegación se manejará con routerLink en el template
  }

  // Método para navegar a consulta de categorías
  irAConsultaCategorias() {
    // La navegación se manejará con routerLink en el template
  }
}
