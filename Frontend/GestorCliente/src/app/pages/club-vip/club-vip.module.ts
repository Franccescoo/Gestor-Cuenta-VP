import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubVipPageRoutingModule } from './club-vip-routing.module';

import { ClubVipPage } from './club-vip.page';
import { SharedModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClubVipPageRoutingModule,
    SharedModule
  ],
  declarations: [ClubVipPage]
})
export class ClubVipPageModule {}
