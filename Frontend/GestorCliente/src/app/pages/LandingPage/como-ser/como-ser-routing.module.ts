import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComoSerPage } from './como-ser.page';

const routes: Routes = [
  {
    path: '',
    component: ComoSerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComoSerPageRoutingModule {}
