import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidarPassPageRoutingModule } from './olvidar-pass-routing.module';

import { OlvidarPassPage } from './olvidar-pass.page';
import { SharedModule } from 'src/app/components/components.module';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OlvidarPassPageRoutingModule,
    SharedModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  declarations: [OlvidarPassPage]
})
export class OlvidarPassPageModule { }
