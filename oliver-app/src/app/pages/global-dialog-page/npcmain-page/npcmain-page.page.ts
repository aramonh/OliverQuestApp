import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActionSheetController, AlertController, LoadingController, NavController, PopoverController } from '@ionic/angular';
import { database } from 'firebase';
import { PopoverEditACComponent } from 'src/app/commons/CARDS/AC/popover-edit-ac/popover-edit-ac.component';
import { PopoverAddNPCComponent } from 'src/app/commons/CARDS/NPC/popover-add-npc/popover-add-npc.component';
import { PopoverEditNPCComponent } from 'src/app/commons/CARDS/NPC/popover-edit-npc/popover-edit-npc.component';
import { PopoverDialogNPCComponent } from 'src/app/commons/CARDS/NPC/popover-dialog-npc/popover-dialog-npc.component';

import { PopoverDialogNPCEditComponent } from 'src/app/commons/CARDS/NPC/popover-dialog-npcedit/popover-dialog-npcedit.component';
import { NPC, NPCNormalDialog } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';
import { PopoverDialogNPCVerComponent } from 'src/app/commons/CARDS/NPC/popover-dialog-npcver/popover-dialog-npcver.component';

@Component({
  selector: 'app-npcmain-page',
  templateUrl: './npcmain-page.page.html',
  styleUrls: ['./npcmain-page.page.scss'],
})
export class NPCMainPagePage implements OnInit {

  npcSelected:NPC=null;
  interactions=null;
  totalInteractions=0;
  titulo="NPCs"
  npcs:NPC[];
  totalNPCS:number=0;
  constructor(
    private popoverController:PopoverController,
    private dataSvc: CRUDfirebaseService,

    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private authCtrl: AuthService,
    private navCtrl: NavController,
    private globalOperation: GlobalOperationsService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) { }

 ngOnInit() {
  if (!this.authCtrl.logIn){  
  this.navCtrl.navigateRoot("login");
  this.globalOperation.showToast("Recuerda iniciar sesion...");
}else{ 
  this.getNPCS();
}
  
  }




  




  async presentActionSheetNPC(data?:any ) {
    console.log("setingcard", data)
    const actionSheet = await this.actionSheetController.create({
      header: 'NPC Configuration',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          //this.deleteQuest(data);
          this.presentAlertConfirmDelete(data.id);
        }
      },{
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          console.log('Share clicked');
          this.presentPopoverupdateNPC( data)
        }
      } ,{
        text: 'Volver',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheetDialogNPCWithDelete(data?:any ) {
    console.log("setingcard", data)
    const actionSheet = await this.actionSheetController.create({
      header: 'NPC Configuration',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          //this.deleteQuest(data);
          this.presentAlertConfirmDeleteDialog(data.id);
        }
      },{
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          console.log('Share clicked');
          this.presentPopoverupdateDialogNPC( data)
        }
      } ,{
        text: 'Volver',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheetDialogNPC(data?:any ) {
    console.log("setingcard", data)
    const actionSheet = await this.actionSheetController.create({
      header: 'NPC Configuration',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          console.log('Share clicked');
          this.presentPopoverupdateDialogNPC( data)
        }
      } ,{
        text: 'Volver',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

 

 async getNPCS(){
  // show loader
  const loader = this.loadingCtrl.create({
    message: 'Please wait...',
  });
  (await loader).present();
  try {

    await this.firestore.firestore.collection("NPC")
  .onSnapshot(querysnap=>{
    var npcs:any[]=[];
    querysnap.forEach(doc=>{

      var npc;
      npc = doc.data();
      npc.id = doc.id;
      npcs.push( npc )
    })
    console.log("TAMAÑO", querysnap.size)
    console.log("FIN CAT", npcs)
   this.npcs = npcs;
   this.totalNPCS = querysnap.size
  })

  
} catch (er) {
  this.globalOperation.showToast(er);
}
// dismiss loader
(await loader).dismiss();
}

async presentPopoverCreateDialogNPC() {
  const popover = await this.popoverController.create({
    component: PopoverDialogNPCComponent,
    cssClass: 'popover-dialog',
    translucent: true,
    componentProps:{
      npcName:this.npcSelected.name,
    }
  });
  return await popover.present();
};

async presentPopoverCreatePlusDialogNPC(idOriginal:any) {
  const popover = await this.popoverController.create({
    component: PopoverDialogNPCComponent,
    cssClass: 'popover-dialog',
    translucent: true,
    componentProps:{
      idOriginal:idOriginal,
    }
  });
  return await popover.present();
};


async selectNPC(data:NPC){
  try {
    this.npcSelected=data;
    await this.firestore.firestore.collection("DialogsNPC")
    .where("idOriginal","==",null)
    .where("npcName","==",this.npcSelected.name)
      .onSnapshot(querysnap=>{
    var interactions:any[]=[];
    querysnap.forEach(doc=>{
      
      var interaction;
      interaction = doc.data();
      interaction.id = doc.id;
  
        interactions.push( interaction )
      
    
    })


   this.interactions = interactions;
   this.totalInteractions = interactions.length
   console.log("DIALOGOS",this.interactions )
  })
  } catch (error) {
    
  }
 


}
cleanNPC(){
  this.npcSelected=null;
  this.interactions=null;
  this.totalInteractions=0;
}
async presentPopoverVerDialogoNPC(id:any) {
  const popover = await this.popoverController.create({
    component: PopoverDialogNPCVerComponent,
    cssClass: 'popover-dialog',
    translucent: true,
    componentProps:{
      id : id,
    
    }
  });
  return await popover.present();
}


  async presentPopoverCreateNPC() {
    const popover = await this.popoverController.create({
      component: PopoverAddNPCComponent,
      cssClass: 'popover-big',
      translucent: true
    });
    return await popover.present();
  }

  async presentPopoverupdateNPC( data: NPC) {
    const popover = await this.popoverController.create({
      component: PopoverEditNPCComponent,
      cssClass: 'popover-big',
      translucent: true,
      componentProps:{
        id : data.id,
      
      }
    });
    return await popover.present();
  }
  async presentPopoverupdateDialogNPC( data: NPCNormalDialog) {
    const popover = await this.popoverController.create({
      component: PopoverDialogNPCEditComponent,
      cssClass: 'popover-dialog',
      translucent: true,
      componentProps:{
        id : data.id,
        npcName:this.npcSelected.name,
      }
    });
    return await popover.present();
  }

  async presentPopoverupdateDialogNPCPLUS(idPlus:any) {
    const popover = await this.popoverController.create({
      component: PopoverDialogNPCEditComponent,
      cssClass: 'popover-dialog',
      translucent: true,
      componentProps:{
        idPlus : idPlus,
 
      }
    });
    return await popover.present();
  }

  async presentAlertConfirmDelete(data?:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Confirmar Eliminacion?',
      message: 'Seguro que quieres eliminar este <strong>NPC</strong>',
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
            this.deleteNPC(data);
          }
        }
      ]
    });

    await alert.present();
  }

  
  async presentAlertConfirmDeleteDialog(data?:any) {
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
            this.deleteDialogNPC(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteDialogNPC(id: string) {
    // show loader
    console.log('Delete', id);
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
     // await this.firestore.doc('aerolines' + id).delete();
      this.dataSvc.deleteData("DialogsNPC",id);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }

  async deleteNPC(id: string) {
    // show loader
    console.log('Delete', id);
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
     // await this.firestore.doc('aerolines' + id).delete();
      this.dataSvc.deleteData("NPC",id);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }


}
