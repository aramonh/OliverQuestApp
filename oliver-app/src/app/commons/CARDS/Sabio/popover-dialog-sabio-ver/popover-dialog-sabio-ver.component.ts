import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { NPCSabioDialogAnswer } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { SabiosDialogService } from 'src/app/services/sabios-dialog.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';
import { PopoverDialogSabioEditComponent } from '../popover-dialog-sabio-edit/popover-dialog-sabio-edit.component';

@Component({
  selector: 'app-popover-dialog-sabio-ver',
  templateUrl: './popover-dialog-sabio-ver.component.html',
  styleUrls: ['./popover-dialog-sabio-ver.component.scss'],
})
export class PopoverDialogSabioVerComponent implements OnInit {

  razon = null;
  id: any;
  dialogs: NPCSabioDialogAnswer[] = [];
  totaldialogs: any = 0;
  constructor(
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private DialogSabioSvc:SabiosDialogService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController,
    private actRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    public navParams: NavParams
  ) {
    let razon = this.navParams.get("razon");

    console.log(this.navParams.data);
    let idAC = this.navParams.get("idAC");
    if (idAC) {
      this.id = idAC;
      this.razon = razon;
      this.getDialogsByAC(this.id, razon);
    }
    console.log(this.navParams.data);
    let id = this.navParams.get("id");
    if (id) {
      this.id = id;
      this.getDialogsByOrigin(this.id);
    }
  }

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
    }
  }

  async getDialogsByAC(id: any, razon) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      if (razon == "accionCausa") {
        await this.firestore.firestore
          .collection("DialogsSabio")
          .where("accionCausa.id", "==", id)
          .onSnapshot((querysnap) => {
            var dialogs: NPCSabioDialogAnswer[] = [];
            querysnap.forEach((doc) => {
              var dialog;
              dialog = doc.data();
              dialog.id = doc.id;
              dialogs.push(dialog);
            });
            console.log("TAMAÑO dialogs", querysnap.size);
            console.log("FIN CAT dialogs", dialogs);
            this.dialogs = dialogs;
            this.totaldialogs = querysnap.size;

            if (this.totaldialogs == 0) {
              this.firestore.firestore
                .collection("accionCausaConsecuencias")
                .doc(id)
                .get()
                .then(function (doc) {
                  doc.ref.update({
                    boolConvConsecuencia: "false",
                  });
                });
              this.close();
            }
          });
      }
      if (razon == "accionConsecuencia") {
        await this.firestore.firestore
          .collection("DialogsSabio")
          .where("accionConsecuencia.id", "==", id)
          .onSnapshot((querysnap) => {
            var dialogs: NPCSabioDialogAnswer[] = [];
            querysnap.forEach((doc) => {
              var dialog;
              dialog = doc.data();
              dialog.id = doc.id;
              dialogs.push(dialog);
            });
            console.log("TAMAÑO dialogs", querysnap.size);
            console.log("FIN CAT dialogs", dialogs);
            this.dialogs = dialogs;
            this.totaldialogs = querysnap.size;
            if (this.totaldialogs == 0) {
              this.firestore.firestore
                .collection("accionCausaConsecuencias")
                .doc(id)
                .get()
                .then(function (doc) {
                  doc.ref.update({
                    boolConvCausa: "false",
                  });
                });
              this.close();
            }
          });
      }
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async getDialogsByOrigin(id: any) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      await this.firestore.firestore
        .collection("DialogsSabio")
        .where("idOriginal", "==", id)
        .onSnapshot((querysnap) => {
          var dialogs: NPCSabioDialogAnswer[] = [];
          querysnap.forEach((doc) => {
            var dialog;
            dialog = doc.data();
            dialog.id = doc.id;
            dialogs.push(dialog);
          });
          console.log("TAMAÑO dialogs", querysnap.size);
          console.log("FIN CAT dialogs", dialogs);
          this.dialogs = dialogs;
          this.totaldialogs = querysnap.size;
          if (this.totaldialogs == 0) {
            this.firestore.firestore
              .collection("DialogsSabio")
              .doc(id)
              .get()
              .then(function (doc) {
                doc.ref.update({
                  boolPlus: "false",
                });
              });
            this.close();
          }
        });
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async presentPopoverupdateDialogNPCPLUS(idPlus: any) {
    await this.popoverCtrl.dismiss();
    const popover = await this.popoverCtrl.create({
      component: PopoverDialogSabioEditComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        idPlus: idPlus,
      },
    });
    return await popover.present();
  }

  async close() {
    await this.popoverCtrl.dismiss();
    this.totaldialogs = 0;
  }

  async presentAlertConfirmDeleteDialogPlus(dialog: any) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "¿Confirmar Eliminacion?",
      message:
        "Seguro que quieres eliminar este <strong>NPC Dialog PLUS</strong>",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "dark",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          cssClass: "dark",
          handler: () => {
            console.log("Confirm Okay");
            this.deleteDialogNPCPLus(dialog);
          },
        },
      ],
    });

    await alert.present();
  }
  async deleteDialogNPCPLus(dialog) {
    // show loader
    console.log("Delete", dialog);
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      // await this.firestore.doc('aerolines' + id).delete();
      await this.DialogSabioSvc.deleteDialogPlus(dialog);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
    await this.popoverCtrl.dismiss();
  }

}
