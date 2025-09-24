
// src/app/components/gastos/gastos.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GastosConsulta } from './gastos-consulta/gastos-consulta';

@NgModule({
  declarations: [
    GastosConsulta
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    GastosConsulta  // Exporta para que pueda ser usado desde AppModule
  ]
})
export class GastosModule { }
