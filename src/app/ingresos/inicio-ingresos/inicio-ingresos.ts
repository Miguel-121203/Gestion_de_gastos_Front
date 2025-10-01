import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio-ingresos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio-ingresos.html',
  styleUrl: './inicio-ingresos.css'
})
export class InicioIngresos {
  constructor() { }
}
