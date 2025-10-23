import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobileDetalleBeneficioPage } from './mobile-detalle-beneficio.page';

const routes: Routes = [
  {
    path: '',
    component: MobileDetalleBeneficioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileDetalleBeneficioPageRoutingModule {}
