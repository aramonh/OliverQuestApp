import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabCategoryPageRoutingModule } from './tab-category-routing.module';

import { TabCategoryPage } from './tab-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabCategoryPageRoutingModule
  ],
  declarations: [TabCategoryPage]
})
export class TabCategoryPageModule {}
