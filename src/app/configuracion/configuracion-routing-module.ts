import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioConfiguracion } from './inicio-configuracion/inicio-configuracion';
import { PerfilUsuario } from './perfil-usuario/perfil-usuario';
import { Preferencias } from './preferencias/preferencias';
import { BackupRestore } from './backup-restore/backup-restore';

const routes: Routes = [
  { path: '', component: InicioConfiguracion },
  { path: 'perfil-usuario', component: PerfilUsuario },
  { path: 'preferencias', component: Preferencias },
  { path: 'backup-restore', component: BackupRestore }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
