import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'gastos',
    loadChildren: () => import('./gastos/gastos-module').then(m => m.GastosModule)
  },
  {
    path: 'ingresos',
    loadChildren: () => import('./ingresos/ingresos-module').then(m => m.IngresosModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias-module').then(m => m.CategoriasModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion-module').then(m => m.ConfiguracionModule)
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
