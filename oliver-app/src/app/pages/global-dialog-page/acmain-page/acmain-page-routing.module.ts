import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ACMainPagePage } from './acmain-page.page';

const routes: Routes = [
  {
    path: '',
    component: ACMainPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ACMainPagePageRoutingModule {}
