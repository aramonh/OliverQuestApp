import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuestCardComponent } from './quest-card/quest-card.component';
import { QuestListComponent } from './quest-list/quest-list.component';
import { PipesModule } from '../pipes/pipes.module';
import { PopoverAddACComponent } from './CARDS/AC/popover-add-ac/popover-add-ac.component';
import { PopoverAddNPCComponent } from './CARDS/NPC/popover-add-npc/popover-add-npc.component';
import { PopoverAddSabioComponent } from './CARDS/Sabio/popover-add-sabio/popover-add-sabio.component';
import { PopoverEditACComponent } from './CARDS/AC/popover-edit-ac/popover-edit-ac.component';
import { PopoverEditNPCComponent } from './CARDS/NPC/popover-edit-npc/popover-edit-npc.component';
import { PopoverEditSabioComponent } from './CARDS/Sabio/popover-edit-sabio/popover-edit-sabio.component';
import { PopoverDialogNPCComponent } from './CARDS/popover-dialog-npc/popover-dialog-npc.component';
import { PopoverDialogSabioComponent } from './CARDS/popover-dialog-sabio/popover-dialog-sabio.component';
import { PopoverDialogNPCEditComponent } from './CARDS/popover-dialog-npcedit/popover-dialog-npcedit.component';
import { PopoverDialogSabioEditComponent } from './CARDS/popover-dialog-sabio-edit/popover-dialog-sabio-edit.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule
  ],
  declarations: [
    HeaderComponent,
    QuestCardComponent,
    QuestListComponent,
    PopoverAddACComponent,
    PopoverAddNPCComponent,
    PopoverAddSabioComponent,
    PopoverEditACComponent,
    PopoverEditNPCComponent,
    PopoverEditSabioComponent,
    PopoverDialogNPCComponent,
    PopoverDialogSabioComponent,
    PopoverDialogNPCEditComponent,
    PopoverDialogSabioEditComponent
  
  ],
  exports:[
    HeaderComponent,
    QuestListComponent,
    PopoverAddACComponent,
    PopoverAddNPCComponent,
    PopoverAddSabioComponent,
    PopoverEditACComponent,
    PopoverEditNPCComponent,
    PopoverEditSabioComponent,
    PopoverDialogNPCComponent,
    PopoverDialogSabioComponent,
    PopoverDialogNPCEditComponent,
    PopoverDialogSabioEditComponent
   
  ]
  
})
export class CommonsModule { }
