import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobileBeneficiosPage } from './mobile-beneficios.page';

const routes: Routes = [
  {
    path: '',
    component: MobileBeneficiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileBeneficiosPageRoutingModule {}
