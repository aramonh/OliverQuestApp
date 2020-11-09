import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverAddNPCComponent } from 'src/app/commons/CARDS/NPC/popover-add-npc/popover-add-npc.component';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';

@Component({
  selector: 'app-npcmain-page',
  templateUrl: './npcmain-page.page.html',
  styleUrls: ['./npcmain-page.page.scss'],
})
export class NPCMainPagePage implements OnInit {


  titulo="NPCs"

  constructor(
    private popoverController:PopoverController,
    private fireSvc: CRUDfirebaseService
  ) { }

 async ngOnInit() {
   var res =  await this.fireSvc.getDataAll("NPC");
   console.log("HERE HERE ", res)
  }
 

  async presentPopover() {
    const popover = await this.popoverController.create({
      component: PopoverAddNPCComponent,
      cssClass: 'popover-big',
      translucent: true
    });
    return await popover.present();
  }

}
