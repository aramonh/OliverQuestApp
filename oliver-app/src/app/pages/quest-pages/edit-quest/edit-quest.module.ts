import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditQuestPageRoutingModule } from './edit-quest-routing.module';

import { EditQuestPage } from './edit-quest.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonsModule,
    EditQuestPageRoutingModule
  ],
  declarations: [EditQuestPage]
})
export class EditQuestPageModule {}
