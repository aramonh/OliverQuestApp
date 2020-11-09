import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GlobalDialogPagePageRoutingModule } from './global-dialog-page-routing.module';

import { GlobalDialogPagePage } from './global-dialog-page.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GlobalDialogPagePageRoutingModule,
    CommonsModule
  ],
  declarations: [GlobalDialogPagePage]
})
export class GlobalDialogPagePageModule {}
