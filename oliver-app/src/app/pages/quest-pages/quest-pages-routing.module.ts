import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestPagesPage } from './quest-pages.page';

const routes: Routes = [
  {
    path: '',
    component: QuestPagesPage
  },
  {
    path: 'tab-all',
    loadChildren: () => import('./tab-all/tab-all.module').then( m => m.TabAllPageModule)
  },
  {
    path: 'tab-category',
    loadChildren: () => import('./tab-category/tab-category.module').then( m => m.TabCategoryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestPagesPageRoutingModule {}
