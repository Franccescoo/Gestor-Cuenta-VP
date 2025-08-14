import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CarruselComponent } from 'src/app/components/carrusel/carrusel.component';
import { HeaderUsuarioComponent } from './header-usuario/header-usuario.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    CarruselComponent,
    HeaderUsuarioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    CarruselComponent,
    HeaderUsuarioComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
