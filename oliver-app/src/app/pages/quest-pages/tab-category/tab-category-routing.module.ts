import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabCategoryPage } from './tab-category.page';

const routes: Routes = [
  {
    path: '',
    component: TabCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabCategoryPageRoutingModule {}
