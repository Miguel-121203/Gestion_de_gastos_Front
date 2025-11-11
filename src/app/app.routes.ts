import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Rutas protegidas con authGuard
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'gastos',
    loadChildren: () => import('./gastos/gastos-module').then(m => m.GastosModule),
    canActivate: [authGuard]
  },
  {
    path: 'ingresos',
    loadChildren: () => import('./ingresos/ingresos-module').then(m => m.IngresosModule),
    canActivate: [authGuard]
  },
  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias-module').then(m => m.CategoriasModule),
    canActivate: [authGuard]
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion-module').then(m => m.ConfiguracionModule),
    canActivate: [authGuard]
  },

  // Redirección por defecto al login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta wildcard para páginas no encontradas
  { path: '**', redirectTo: '/login' }
];
