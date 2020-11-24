import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActionSheetController, AlertController, LoadingController, NavController, PopoverController } from '@ionic/angular';
import { PopoverAddSabioComponent } from 'src/app/commons/CARDS/Sabio/popover-add-sabio/popover-add-sabio.component';
import { PopoverEditSabioComponent } from 'src/app/commons/CARDS/Sabio/popover-edit-sabio/popover-edit-sabio.component';
import { AccionCausaConsecuencia, Sabio } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-sabio-main-page',
  templateUrl: './sabio-main-page.page.html',
  styleUrls: ['./sabio-main-page.page.scss'],
})
export class SabioMainPagePage implements OnInit {

  titulo="Sabios"
  sabios:Sabio[];
  totalSabios:number=0;
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
  this.getSabios();
}
  
  }
 

  async presentActionSheetSabio(data?:any ) {
    console.log("setingcard", data)
    const actionSheet = await this.actionSheetController.create({
      header: 'Sabio Configuration',
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

 async getSabios(){
  // show loader
  const loader = this.loadingCtrl.create({
    message: 'Please wait...',
  });
  (await loader).present();
  try {

    await this.firestore.firestore.collection("Sabios")
  .onSnapshot(querysnap=>{
    var sabios:any[]=[];
    querysnap.forEach(doc=>{
      
      console.log("GUET CATEGORY",  )
      var sabio;
      sabio = doc.data();
      sabio.id = doc.id;
      sabios.push( sabio )
    })
    console.log("TAMAÑO", querysnap.size)
    console.log("FIN CAT", sabios)
   this.sabios = sabios;
   this.totalSabios = querysnap.size
  })

  
} catch (er) {
  this.globalOperation.showToast(er);
}
// dismiss loader
(await loader).dismiss();
}

  





  async presentPopover() {
    const popover = await this.popoverController.create({
      component: PopoverAddSabioComponent,
      cssClass: 'popover-big',
      translucent: true
    });
    return await popover.present();
  }

  async presentPopoverupdate( data: Sabio) {
    const popover = await this.popoverController.create({
      component: PopoverEditSabioComponent,
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
      this.dataSvc.deleteData("Sabios",id);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }


}
