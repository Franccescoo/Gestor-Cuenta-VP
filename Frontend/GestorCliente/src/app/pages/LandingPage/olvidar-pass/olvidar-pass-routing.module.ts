import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlvidarPassPage } from './olvidar-pass.page';

const routes: Routes = [
  {
    path: '',
    component: OlvidarPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OlvidarPassPageRoutingModule {}
