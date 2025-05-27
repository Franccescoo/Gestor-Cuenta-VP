import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CarruselComponent } from 'src/app/components/carrusel/carrusel.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    CarruselComponent,
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
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
