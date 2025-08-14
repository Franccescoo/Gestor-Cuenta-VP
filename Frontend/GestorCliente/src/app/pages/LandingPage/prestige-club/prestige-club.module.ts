import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrestigeClubPageRoutingModule } from './prestige-club-routing.module';

import { PrestigeClubPage } from './prestige-club.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrestigeClubPageRoutingModule,
    SharedModule
  ],
  declarations: [PrestigeClubPage]
})
export class PrestigeClubPageModule {}
