import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio-gastos',
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio-gastos.html',
  styleUrl: './inicio-gastos.css'
})
export class InicioGastos {
  
  constructor() { }

  // Método para navegar a nuevo gasto
  irANuevoGasto() {
    // La navegación se manejará con routerLink en el template
  }

  // Método para navegar a consulta de gastos
  irAConsultaGastos() {
    // La navegación se manejará con routerLink en el template
  }
}
