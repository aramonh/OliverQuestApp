import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabAllPage } from './tab-all.page';

const routes: Routes = [
  {
    path: '',
    component: TabAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabAllPageRoutingModule {}
