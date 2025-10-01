import { InicioIngresos } from './inicio-ingresos/inicio-ingresos';
import { NuevoIngreso } from './nuevo-ingreso/nuevo-ingreso';
import { ConsultaIngresos } from './consulta-ingresos/consulta-ingresos';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: InicioIngresos },
  { path: 'nuevo-ingreso', component: NuevoIngreso },
  { path: 'consulta-ingresos', component: ConsultaIngresos }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosRoutingModule { }
