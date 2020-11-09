import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabMinePage } from './tab-mine.page';

const routes: Routes = [
  {
    path: '',
    component: TabMinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabMinePageRoutingModule {}
