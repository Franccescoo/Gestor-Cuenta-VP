import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambioPassPageRoutingModule } from './cambio-pass-routing.module';

import { CambioPassPage } from './cambio-pass.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambioPassPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [CambioPassPage]
})
export class CambioPassPageModule {}
