import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Action, NPC, Town } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { NPCService } from 'src/app/services/npc.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-add-npc',
  templateUrl: './popover-add-npc.component.html',
  styleUrls: ['./popover-add-npc.component.scss'],
})
export class PopoverAddNPCComponent implements OnInit {


  NPC: NPC = {
    name:"",
    town:"",
    actions:[]
  };
 

  actions:Observable< Action[]>;
  towns : Observable < Town[]>;

  constructor(

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private NPCSvc:NPCService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {

    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{

      this.getAction();
      this.getTown();
    }
  }


  getAction(){
    this.actions = this.localSvc.getActions();
    console.log(this.actions)
  }
    getTown(){
      this.towns = this.localSvc.getTowns();
      console.log(this.towns );
    }


  async CreateData(data: NPC) {

    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
 
        await this.NPCSvc.createNPC(data);
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      await this.popoverCtrl.dismiss();
      (await loader).dismiss();
      // redirect to home page
    //  this.navCtrl.navigateRoot("/quest-pages");
    }
  }
  removeItemFromArr(arr, i) {
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }
  formValidation() {

    for (const key in this.NPC) {
 
        const element = this.NPC[key];
        

        if(element==""){
          this.globalOperation.showToast("Ingresa "+ key)
          return false;
        }
     
    }
    for (
      let index = this.NPC["actions"].length;
      4 < index;
      index--
    ) {
      const element = index - 1;
       this.removeItemFromArr(this.NPC["actions"],element)
        
    }
    return true;
  }

}
