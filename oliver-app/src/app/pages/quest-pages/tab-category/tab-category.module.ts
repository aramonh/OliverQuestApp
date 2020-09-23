import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabCategoryPageRoutingModule } from './tab-category-routing.module';

import { TabCategoryPage } from './tab-category.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabCategoryPageRoutingModule,
    CommonsModule
  ],
  declarations: [TabCategoryPage]
})
export class TabCategoryPageModule {}
