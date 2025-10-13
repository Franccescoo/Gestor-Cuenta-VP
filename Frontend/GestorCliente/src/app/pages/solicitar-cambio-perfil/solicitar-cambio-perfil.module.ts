import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SolicitarCambioPerfilPageRoutingModule } from './solicitar-cambio-perfil-routing.module';
import { SolicitarCambioPerfilPage } from './solicitar-cambio-perfil.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SolicitarCambioPerfilPageRoutingModule,
    SharedModule
  ],
  declarations: [SolicitarCambioPerfilPage]
})
export class SolicitarCambioPerfilPageModule {}
