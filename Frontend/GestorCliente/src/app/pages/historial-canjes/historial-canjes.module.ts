import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialCanjesPageRoutingModule } from './historial-canjes-routing.module';

import { HistorialCanjesPage } from './historial-canjes.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialCanjesPageRoutingModule,
    SharedModule
  ],
  declarations: [HistorialCanjesPage]
})
export class HistorialCanjesPageModule {}
