import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MobileBeneficiosPageRoutingModule } from './mobile-beneficios-routing.module';
import { MobileBeneficiosPage } from './mobile-beneficios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MobileBeneficiosPageRoutingModule
  ],
  declarations: [MobileBeneficiosPage]
})
export class MobileBeneficiosPageModule {}
