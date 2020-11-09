import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SabioMainPagePage } from './sabio-main-page.page';

const routes: Routes = [
  {
    path: '',
    component: SabioMainPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SabioMainPagePageRoutingModule {}
