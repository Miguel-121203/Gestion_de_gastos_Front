import { InicioCategorias } from './inicio-categorias/inicio-categorias';
import { NuevaCategoria } from './nueva-categoria/nueva-categoria';
import { ConsultaCategorias } from './consulta-categorias/consulta-categorias';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: InicioCategorias },
  { path: 'nueva-categoria', component: NuevaCategoria },
  { path: 'consulta-categorias', component: ConsultaCategorias }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
