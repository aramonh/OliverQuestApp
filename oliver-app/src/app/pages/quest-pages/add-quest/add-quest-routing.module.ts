import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddQuestPage } from './add-quest.page';

const routes: Routes = [
  {
    path: '',
    component: AddQuestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddQuestPageRoutingModule {}
