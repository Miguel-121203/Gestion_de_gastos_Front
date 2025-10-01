import { InicioGastos } from './inicio-gastos/inicio-gastos';
import { NuevoGasto } from './nuevo-gasto/nuevo-gasto';
import { ConsultaGastos } from './consulta-gastos/consulta-gastos';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: InicioGastos },
  { path: 'nuevo-gasto', component: NuevoGasto },
  { path: 'consulta-gastos', component: ConsultaGastos }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosRoutingModule { }
