import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NPCMainPagePage } from './npcmain-page.page';

const routes: Routes = [
  {
    path: '',
    component: NPCMainPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NPCMainPagePageRoutingModule {}
