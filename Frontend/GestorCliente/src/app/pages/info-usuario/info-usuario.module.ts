import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoUsuarioPageRoutingModule } from './info-usuario-routing.module';

import { InfoUsuarioPage } from './info-usuario.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoUsuarioPageRoutingModule,
    SharedModule
  ],
  declarations: [InfoUsuarioPage]
})
export class InfoUsuarioPageModule {}
