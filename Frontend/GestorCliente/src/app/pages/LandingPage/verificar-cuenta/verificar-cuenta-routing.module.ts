import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificarCuentaPage } from './verificar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: VerificarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificarCuentaPageRoutingModule {}
