import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarCambioPerfilPage } from './solicitar-cambio-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarCambioPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarCambioPerfilPageRoutingModule {}
