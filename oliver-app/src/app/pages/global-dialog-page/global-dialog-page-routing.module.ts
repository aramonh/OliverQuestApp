import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlobalDialogPagePage } from './global-dialog-page.page';

const routes: Routes = [
  {
    path: '',
    component: GlobalDialogPagePage
  },
  {
    path: 'sabio-main-page',
    loadChildren: () => import('./sabio-main-page/sabio-main-page.module').then( m => m.SabioMainPagePageModule)
  },
  {
    path: 'npcmain-page',
    loadChildren: () => import('./npcmain-page/npcmain-page.module').then( m => m.NPCMainPagePageModule)
  },
  {
    path: 'acmain-page',
    loadChildren: () => import('./acmain-page/acmain-page.module').then( m => m.ACMainPagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalDialogPagePageRoutingModule {}
