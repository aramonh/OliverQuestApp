import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Action, NPC, Town } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-edit-npc',
  templateUrl: './popover-edit-npc.component.html',
  styleUrls: ['./popover-edit-npc.component.scss'],
})
export class PopoverEditNPCComponent implements OnInit {

  NPC: NPC = {
    name:"",
    town:"",
    actions:[]
  };
 
  id:any;
  actions:Observable< Action[]>;
  towns : Observable < Town[]>;

  constructor(

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private dataSvc: CRUDfirebaseService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController,
    private actRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    public navParams:NavParams
  ) { 

    console.log(this.navParams.data);
     this.id = this.navParams.get('id');

  }

  ngOnInit() {

    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{
      this.getNPCById(this.id);
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


    async getNPCById(id: string){
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      (await loader).present();
  
      try {
        console.log("ID PARA BUSCAR",id)
        
       
        this.firestore.doc('NPC/' + id )
        .valueChanges()
        .subscribe( data => {
    

          this.NPC.name= data["name"];
          this.NPC.town= data["town"];

          for (const key in data["actions"]) {
          
              const element = data["actions"];
              
              this.NPC.actions.push(...element );
          }

          
        });
     
    
    
        if(this.NPC==undefined || this.NPC==null){
          this.globalOperation.showToast("Select NPC Again");
          await this.popoverCtrl.dismiss();
        }
    } catch (er) {
      this.globalOperation.showToast(er);
      await this.popoverCtrl.dismiss();
  
    }
      // dismiss loader
      (await loader).dismiss();
  }
  
  
    async updateData(npc: NPC) {
      console.log("post to create", npc);
      if (this.formValidation()) {
        // show loader
        const loader = this.loadingCtrl.create({
          message: "Please Wait...",
        });
        (await loader).present();
  
        try {
          this.dataSvc.updateData("NPC",this.id,npc);
          
        } catch (er) {
          this.globalOperation.showToast(er);
        }
        // dismiss loader
        (await loader).dismiss();
        // redirect to home page
        await this.popoverCtrl.dismiss();
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


    return true;
  }

}
