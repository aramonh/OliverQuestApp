import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActionSheetController, AlertController, LoadingController, NavController, PopoverController } from '@ionic/angular';
import { PopoverAddACComponent } from 'src/app/commons/CARDS/AC/popover-add-ac/popover-add-ac.component';
import { PopoverEditACComponent } from 'src/app/commons/CARDS/AC/popover-edit-ac/popover-edit-ac.component';
import { AccionCausaConsecuencia, NPC, Sabio } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-acmain-page',
  templateUrl: './acmain-page.page.html',
  styleUrls: ['./acmain-page.page.scss'],
})
export class ACMainPagePage implements OnInit {


  titulo="AC"

  ACs:AccionCausaConsecuencia[];
  totalAC:number=0;
  constructor(
    private popoverController:PopoverController,
    private dataSvc: CRUDfirebaseService,

    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private authCtrl: AuthService,
    private navCtrl: NavController,
    private globalOperation: GlobalOperationsService,
    private alertController: AlertController,
    private actionSheetController : ActionSheetController
  ) { }

 ngOnInit() {
  if (!this.authCtrl.logIn){  
  this.navCtrl.navigateRoot("login");
  this.globalOperation.showToast("Recuerda iniciar sesion...");
}else{ 
  this.getAccionCausaConsecuencias();
}

  
  }


  async presentActionSheetAC(data?:any ) {
    console.log("setingcard", data)
    const actionSheet = await this.actionSheetController.create({
      header: 'AC Configuration',
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
          this.presentPopoverupdate( data)
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



 async  getNameNPCByID( id: any) {
    var data: any;
        await    this.firestore
.doc( "NPC/" + id)
.valueChanges()
.subscribe((res)=>{
  data = res;
});
console.log("DATA", data)
  return data
  }

 async getAccionCausaConsecuencias(){
  // show loader
  const loader = this.loadingCtrl.create({
    message: 'Please wait...',
  });
  (await loader).present();
  try {

    await this.firestore.firestore.collection("accionCausaConsecuencias")
  .onSnapshot(querysnap=>{
    var ACs:any[]=[];
    querysnap.forEach(doc=>{
      
      console.log("GUET CATEGORY",  )
      var AC;
      AC = doc.data();
      AC.id = doc.id;
      ACs.push( AC )
    })
    console.log("TAMAÑO", querysnap.size)
    console.log("FIN CAT", ACs)
   this.ACs = ACs;
   this.totalAC = querysnap.size
  })

  
} catch (er) {
  this.globalOperation.showToast(er);
}
// dismiss loader
(await loader).dismiss();
}

  





  async presentPopoverAC() {
    const popover = await this.popoverController.create({
      component: PopoverAddACComponent,
      cssClass: 'popover-big',
      translucent: true
    });
    return await popover.present();
  }

  async presentPopoverupdate( data: AccionCausaConsecuencia) {
    const popover = await this.popoverController.create({
      component: PopoverEditACComponent,
      cssClass: 'popover-big',
      translucent: true,
      componentProps:{
        id : data.id,
      }
    });
    return await popover.present();
  }

  async presentAlertConfirmDelete(data?:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Confirmar Eliminacion?',
      message: 'Seguro que quieres eliminar este <strong>Sabio</strong>',
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
            this.deleteQuest(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteQuest(id: string) {
    // show loader
    console.log('Delete', id);
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
     // await this.firestore.doc('aerolines' + id).delete();
      this.dataSvc.deleteData("accionCausaConsecuencias",id);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }


}
