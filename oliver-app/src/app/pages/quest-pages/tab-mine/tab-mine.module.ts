import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabMinePageRoutingModule } from './tab-mine-routing.module';

import { TabMinePage } from './tab-mine.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabMinePageRoutingModule,
    CommonsModule
  ],
  declarations: [TabMinePage]
})
export class TabMinePageModule {}
