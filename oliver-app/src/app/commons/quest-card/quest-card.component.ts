import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Quest } from 'src/app/interfaces/interfaces';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';

@Component({
  selector: 'app-quest-card',
  templateUrl: './quest-card.component.html',
  styleUrls: ['./quest-card.component.scss'],
})
export class QuestCardComponent implements OnInit {
  @Input() quest: Quest;
  @Input()  userId: any ;


  constructor(
    private loadingCtrl: LoadingController,
    private actionSheetController: ActionSheetController,
    private router:Router,
    private dataSvc: CRUDfirebaseService,
    private toastCtrl: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {}


  async presentActionSheet(data?:any ) {
    console.log("setingcard", data)
    const actionSheet = await this.actionSheetController.create({
      header: 'Quest Configuration',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          //this.deleteQuest(data);
          this.presentAlertConfirmDelete(data);
        }
      }, {
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          console.log('Share clicked');
          this.router.navigateByUrl(`/edit-quest/${data}`)
        }
      },{
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

  async presentAlertConfirmDelete(data?:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Confirmar Eliminacion?',
      message: 'Seguro que quieres eliminar esta <strong>QUEST</strong>',
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
      this.dataSvc.deleteData("quest",id);
    } catch (er) {
      this.showToast(er);
    }
    (await loader).dismiss();
  }

  showToast(message: string) {
    console.log(message);
    this.toastCtrl
      .create({
        message,
        duration: 3000,
      })
      .then((toastData) => toastData.present());
  }

}
