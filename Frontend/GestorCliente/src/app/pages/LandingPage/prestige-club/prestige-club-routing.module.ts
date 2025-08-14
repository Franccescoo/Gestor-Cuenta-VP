import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrestigeClubPage } from './prestige-club.page';

const routes: Routes = [
  {
    path: '',
    component: PrestigeClubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrestigeClubPageRoutingModule {}
