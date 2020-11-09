import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ACMainPagePageRoutingModule } from './acmain-page-routing.module';

import { ACMainPagePage } from './acmain-page.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ACMainPagePageRoutingModule,
    CommonsModule
  ],
  declarations: [ACMainPagePage]
})
export class ACMainPagePageModule {}
