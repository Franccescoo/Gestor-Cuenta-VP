import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MisSolicitudesPageRoutingModule } from './mis-solicitudes-routing.module';
import { MisSolicitudesPage } from './mis-solicitudes.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisSolicitudesPageRoutingModule,
    SharedModule
  ],
  declarations: [MisSolicitudesPage]
})
export class MisSolicitudesPageModule {}
