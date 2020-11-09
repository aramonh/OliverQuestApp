import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NPCMainPagePageRoutingModule } from './npcmain-page-routing.module';

import { NPCMainPagePage } from './npcmain-page.page';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NPCMainPagePageRoutingModule,
    CommonsModule
  ],
  declarations: [NPCMainPagePage]
})
export class NPCMainPagePageModule {}
