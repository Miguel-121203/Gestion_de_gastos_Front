// src/app/components/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Aquí declararías componentes compartidos como Sidebar, Header, etc.
// import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    // SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    // SidebarComponent  // Exporta para que otros módulos puedan usarlo
  ]
})
export class SharedModule { }
