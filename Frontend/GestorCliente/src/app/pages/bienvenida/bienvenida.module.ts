import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BienvenidaPageRoutingModule } from './bienvenida-routing.module';

import { BienvenidaPage } from './bienvenida.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BienvenidaPageRoutingModule,
    SharedModule
  ],
  declarations: [BienvenidaPage]
})
export class BienvenidaPageModule {}
