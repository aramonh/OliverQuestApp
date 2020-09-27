import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuestCardComponent } from './quest-card/quest-card.component';
import { QuestListComponent } from './quest-list/quest-list.component';
import { PipesModule } from '../pipes/pipes.module';




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
    QuestListComponent
  
  ],
  exports:[
    HeaderComponent,
    QuestListComponent
   
  ]
  
})
export class CommonsModule { }
