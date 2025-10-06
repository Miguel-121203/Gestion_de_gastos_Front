import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio-configuracion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio-configuracion.html',
  styleUrl: './inicio-configuracion.css'
})
export class InicioConfiguracion {
  constructor() {}
}
