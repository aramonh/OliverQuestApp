import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestPagesPageRoutingModule } from './quest-pages-routing.module';

import { QuestPagesPage } from './quest-pages.page';
import { CommonsModule } from 'src/app/commons/commons.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonsModule,
    PipesModule,
    QuestPagesPageRoutingModule
  ],
  declarations: [QuestPagesPage]
})
export class QuestPagesPageModule {}
