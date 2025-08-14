import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComoSerPageRoutingModule } from './como-ser-routing.module';

import { ComoSerPage } from './como-ser.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComoSerPageRoutingModule,
    SharedModule
  ],
  declarations: [ComoSerPage]
})
export class ComoSerPageModule {}
