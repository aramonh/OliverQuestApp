import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestPagesPage } from './quest-pages.page';

const routes: Routes = [
  {
    path: '',
    component: QuestPagesPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../quest-pages/tab-all/tab-all.module').then(m => m.TabAllPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../quest-pages/tab-category/tab-category.module').then(m => m.TabCategoryPageModule)
      },
      
      {
        path: 'tab3',
        loadChildren: () => import('../quest-pages/tab-mine/tab-mine.module').then(m => m.TabMinePageModule)
      },
      
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full'
      }
    ]
  },
      
  {
    path: '',
    redirectTo: 'tab1',
    pathMatch: 'full'
  },
  {
    path: 'tab-mine',
    loadChildren: () => import('./tab-mine/tab-mine.module').then( m => m.TabMinePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestPagesPageRoutingModule {}
