import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddQuestPageRoutingModule } from './add-quest-routing.module';

import { AddQuestPage } from './add-quest.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonsModule,
    AddQuestPageRoutingModule
  ],
  declarations: [AddQuestPage]
})
export class AddQuestPageModule {}
