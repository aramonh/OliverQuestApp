import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { NPCNormalDialog } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';
import { PopoverDialogNPCEditComponent } from '../popover-dialog-npcedit/popover-dialog-npcedit.component';

@Component({
  selector: 'app-popover-dialog-npcver',
  templateUrl: './popover-dialog-npcver.component.html',
  styleUrls: ['./popover-dialog-npcver.component.scss'],
})
export class PopoverDialogNPCVerComponent implements OnInit {
  NPCNormalDialog : NPCNormalDialog = {
    id:null,
    numInteraction :0,
    npcName:"",
    
    questSorprise:'false',
    questSorpriseAnsGood:null,
    questSorpriseAnsBad:null,

    numPages:1,
    contenidoPages:[],

    

    accionCausa:null,
    accionConsecunecia:"Ninguno",
    
    idPlus:null,
    idOriginal:null


  }; 
  NPCNormalDialogOriginal:NPCNormalDialog = {
    numInteraction: 0,
    npcName: "",

    questSorprise: "false",
    questSorpriseAnsGood: null,
    questSorpriseAnsBad: null,

    numPages: 1,
    contenidoPages: [],

    accionCausa: null,
    accionConsecunecia: "Ninguno",

    idPlus: null,
    idOriginal: null,
  };
  id:any;
  constructor(
private alertController: AlertController,
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
    let id = this.navParams.get('id');
    if(id){
      this.id=id;

    }
  }

  ngOnInit() {

    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{
      this.getNPCDialogById(this.id);
      
    }
  }


  async presentPopoverupdateDialogNPCPLUS(idPlus:any) {
    await this.popoverCtrl.dismiss();
    const popover = await this.popoverCtrl.create({
      component: PopoverDialogNPCEditComponent,
      cssClass: 'popover-dialog',
      translucent: true,
      componentProps:{
        idPlus : idPlus,
 
      }
    });
    return await popover.present();
  }

  async getNPCDialogById(id: string){
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    try {
      console.log("ID PARA BUSCAR",id)
      
     
      this.firestore.doc('DialogsNPC/' + id )
      .valueChanges()
      .subscribe( data => {
  
        this.NPCNormalDialog.id = id;
        this.NPCNormalDialog.numInteraction= data["numInteraction"];
        this.NPCNormalDialog.questSorprise= data["questSorprise"];
        this.NPCNormalDialog.questSorpriseAnsGood= data["questSorpriseAnsGood"];
        this.NPCNormalDialog.questSorpriseAnsBad= data["questSorpriseAnsBad"];
        this.NPCNormalDialog.numPages= data["numPages"];
        this.NPCNormalDialog.accionCausa= data["accionCausa"];
        this.NPCNormalDialog.accionConsecunecia= data["accionConsecunecia"];

        this.NPCNormalDialog.npcName = data["npcName"];
        this.NPCNormalDialog.idOriginal = data["idOriginal"];
        this.NPCNormalDialog.idPlus = data["idPlus"];
        for (let index = 0; index < data["contenidoPages"].length; index++) {
          const element = data["contenidoPages"][index];
          this.NPCNormalDialog.contenidoPages.push(element );
        }
   

        this.getDialogOriginal(this.NPCNormalDialog.idOriginal);
      });
   
  
    
      console.log("dialog abrido",this.NPCNormalDialog )
      if(this.NPCNormalDialog==undefined || this.NPCNormalDialog==null){
        this.globalOperation.showToast("Select NPCNormalDialog Again");
        await this.popoverCtrl.dismiss();
      }
  } catch (er) {
    this.globalOperation.showToast(er);
    await this.popoverCtrl.dismiss();

  }
    // dismiss loader
    (await loader).dismiss();
}

async close(){
  await this.popoverCtrl.dismiss();
}
async getDialogOriginal(id){
  try {
    
     
    this.firestore.doc('DialogsNPC/' + id )
    .valueChanges()
    .subscribe( data => {

      this.NPCNormalDialogOriginal.id= id;
      this.NPCNormalDialogOriginal.numInteraction= data["numInteraction"];

      this.NPCNormalDialog.numInteraction=this.NPCNormalDialogOriginal.numInteraction;

      this.NPCNormalDialogOriginal.questSorprise= data["questSorprise"];
      this.NPCNormalDialogOriginal.questSorpriseAnsGood= data["questSorpriseAnsGood"];
      this.NPCNormalDialogOriginal.questSorpriseAnsBad= data["questSorpriseAnsBad"];
      this.NPCNormalDialogOriginal.numPages= data["numPages"];
      this.NPCNormalDialogOriginal.accionCausa= data["accionCausa"];
      this.NPCNormalDialogOriginal.accionConsecunecia= data["accionConsecunecia"];

      this.NPCNormalDialogOriginal.npcName = data["npcName"];
      this.NPCNormalDialogOriginal.idOriginal = data["idOriginal"];
      this.NPCNormalDialogOriginal.idPlus = data["idPlus"];

  
      for (let index = 0; index < data["contenidoPages"].length; index++) {
        const element = data["contenidoPages"][index];
        this.NPCNormalDialogOriginal.contenidoPages.push(element );
      }

      
    });
 


    if(this.NPCNormalDialogOriginal==undefined || this.NPCNormalDialogOriginal==null){
      this.globalOperation.showToast("Select NPCNormalDialog Again");
      await this.popoverCtrl.dismiss();
      return false;
    }

  } catch (error) {
    
  }
}

async presentAlertConfirmDeleteDialogPlus(id: string, idOriginal:string) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: '¿Confirmar Eliminacion?',
    message: 'Seguro que quieres eliminar este <strong>NPC Dialog</strong>',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'dark',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        cssClass:'dark',
        handler: () => {
          console.log('Confirm Okay');
          this.deleteDialogNPCPLus(id, this.NPCNormalDialogOriginal);
        }
      }
    ]
  });

  await alert.present();
}
async deleteDialogNPCPLus(id: string, DialogOriginal:NPCNormalDialog) {
  // show loader
  console.log('Delete', id);
  const loader = this.loadingCtrl.create({
    message: 'Please wait...',
  });
  (await loader).present();
  try {
   // await this.firestore.doc('aerolines' + id).delete();
    this.dataSvc.deleteDialogPlus('DialogsNPC',id,DialogOriginal)
  } catch (er) {
    this.globalOperation.showToast(er);
  }
  (await loader).dismiss();
  await this.popoverCtrl.dismiss();
}

}
