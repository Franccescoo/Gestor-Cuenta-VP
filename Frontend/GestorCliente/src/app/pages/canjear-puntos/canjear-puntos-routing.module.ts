import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanjearPuntosPage } from './canjear-puntos.page';

const routes: Routes = [
  {
    path: '',
    component: CanjearPuntosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanjearPuntosPageRoutingModule {}
