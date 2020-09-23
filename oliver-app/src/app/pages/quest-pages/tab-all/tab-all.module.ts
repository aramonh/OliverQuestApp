import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabAllPageRoutingModule } from './tab-all-routing.module';

import { TabAllPage } from './tab-all.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabAllPageRoutingModule,
    CommonsModule
  ],
  declarations: [TabAllPage]
})
export class TabAllPageModule {}
