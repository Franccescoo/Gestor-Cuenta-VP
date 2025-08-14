import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanjearPuntosPageRoutingModule } from './canjear-puntos-routing.module';

import { CanjearPuntosPage } from './canjear-puntos.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanjearPuntosPageRoutingModule,
    SharedModule
  ],
  declarations: [CanjearPuntosPage]
})
export class CanjearPuntosPageModule {}
