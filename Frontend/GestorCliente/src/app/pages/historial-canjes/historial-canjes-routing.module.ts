import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialCanjesPage } from './historial-canjes.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialCanjesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialCanjesPageRoutingModule {}
