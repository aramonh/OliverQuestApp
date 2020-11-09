import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SabioMainPagePageRoutingModule } from './sabio-main-page-routing.module';

import { SabioMainPagePage } from './sabio-main-page.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SabioMainPagePageRoutingModule,
    CommonsModule
  ],
  declarations: [SabioMainPagePage]
})
export class SabioMainPagePageModule {}
