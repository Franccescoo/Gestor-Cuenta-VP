import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubVipPage } from './club-vip.page';

const routes: Routes = [
  {
    path: '',
    component: ClubVipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubVipPageRoutingModule {}
