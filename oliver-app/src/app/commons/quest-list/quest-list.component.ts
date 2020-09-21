import { Component, Input, OnInit } from '@angular/core';
import { Quest } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {
  @Input()  quests: Quest[] ;
  @Input()  textoBuscar: any ;
  @Input()  userId: any ;

  
  constructor() { }

  ngOnInit() {}

}
