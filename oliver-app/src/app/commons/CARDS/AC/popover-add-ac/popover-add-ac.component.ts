import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { AccionCausaConsecuencia } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-add-ac',
  templateUrl: './popover-add-ac.component.html',
  styleUrls: ['./popover-add-ac.component.scss'],
})
export class PopoverAddACComponent implements OnInit {
  AccionCausaConsecuencia : AccionCausaConsecuencia = {
    name:"",
    npcCausa:"",
    npcConsecuencia:"",
  }; 
  constructor(

    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,


    private dataSvc: CRUDfirebaseService,

    private globalOperation: GlobalOperationsService
  ) { }

  ngOnInit() {}



  async createQuest(data: AccionCausaConsecuencia) {

    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.dataSvc.createData("accionCausaConsecuencia", data);
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

  formValidation() {

    for (const key in this.AccionCausaConsecuencia) {
 
        const element = this.AccionCausaConsecuencia[key];
        

        if(element==""){
          this.globalOperation.showToast("Ingresa "+ key)
          return false;
        }
     
    }


    return true;
  }



}
