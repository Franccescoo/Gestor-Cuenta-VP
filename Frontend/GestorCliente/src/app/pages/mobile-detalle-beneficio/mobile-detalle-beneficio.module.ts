import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MobileDetalleBeneficioPageRoutingModule } from './mobile-detalle-beneficio-routing.module';
import { MobileDetalleBeneficioPage } from './mobile-detalle-beneficio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MobileDetalleBeneficioPageRoutingModule
  ],
  declarations: [MobileDetalleBeneficioPage]
})
export class MobileDetalleBeneficioPageModule {}
