import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificarCuentaPageRoutingModule } from './verificar-cuenta-routing.module';

import { VerificarCuentaPage } from './verificar-cuenta.page';
import { SharedModule } from 'src/app/components/components.module';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificarCuentaPageRoutingModule,
    SharedModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  declarations: [VerificarCuentaPage]
})
export class VerificarCuentaPageModule { }
