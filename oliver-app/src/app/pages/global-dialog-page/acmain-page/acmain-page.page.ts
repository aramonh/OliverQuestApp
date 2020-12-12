import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { PopoverAddACComponent } from "src/app/commons/CARDS/AC/popover-add-ac/popover-add-ac.component";
import { PopoverEditACComponent } from "src/app/commons/CARDS/AC/popover-edit-ac/popover-edit-ac.component";
import { PopoverDialogNPCVerComponent } from "src/app/commons/CARDS/NPC/popover-dialog-npcver/popover-dialog-npcver.component";
import { PopoverVerDialogSabioAndNPCComponent } from 'src/app/commons/CARDS/popover-ver-dialog-sabio-and-npc/popover-ver-dialog-sabio-and-npc.component';
import { PopoverDialogSabioVerComponent } from 'src/app/commons/CARDS/Sabio/popover-dialog-sabio-ver/popover-dialog-sabio-ver.component';
import {
  AccionCausaConsecuencia,
  NPC,
  Sabio,
} from "src/app/interfaces/interfaces";
import { ACService } from "src/app/services/ac.service";
import { AuthService } from "src/app/services/auth.service";
import { CRUDfirebaseService } from "src/app/services/crudfirebase.service";
import { GlobalOperationsService } from "src/app/utils/global-operations.service";

@Component({
  selector: "app-acmain-page",
  templateUrl: "./acmain-page.page.html",
  styleUrls: ["./acmain-page.page.scss"],
})
export class ACMainPagePage implements OnInit {
  titulo = "Accion C.C.";

  ACs: AccionCausaConsecuencia[];
  totalAC: number = 0;
  constructor(
    private popoverController: PopoverController,
    private ACSvc: ACService,

    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private authCtrl: AuthService,
    private navCtrl: NavController,
    private globalOperation: GlobalOperationsService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
      this.getAccionCausaConsecuencias();
    }
  }

  async presentPopoverVerDialogoNPC(id: any, razon: string, AC:AccionCausaConsecuencia) {
    if(razon=='accionConsecuencia'){
      if(AC.npcCausa.tipo=='NPC'){
        const popover = await this.popoverController.create({
          component: PopoverDialogNPCVerComponent,
          cssClass: "popover-dialog",
          translucent: true,
          componentProps: {
            idAC: id,
            razon: razon,
          },
        });
        return await popover.present();
      }else if(AC.npcCausa.tipo=='Sabio'){
        const popover = await this.popoverController.create({
          component: PopoverDialogSabioVerComponent,
          cssClass: "popover-dialog",
          translucent: true,
          componentProps: {
            idAC: id,
            razon: razon,
          },
        });
        return await popover.present();
      }
    }else if(razon=='accionCausa'){
      if(AC.npcConsecuencia.tipo=='NPC'){
        const popover = await this.popoverController.create({
          component: PopoverDialogNPCVerComponent,
          cssClass: "popover-dialog",
          translucent: true,
          componentProps: {
            idAC: id,
            razon: razon,
          },
        });
        return await popover.present();
      }else if(AC.npcConsecuencia.tipo=='Sabio'){
        const popover = await this.popoverController.create({
          component: PopoverDialogSabioVerComponent,
          cssClass: "popover-dialog",
          translucent: true,
          componentProps: {
            idAC: id,
            razon: razon,
          },
        });
        return await popover.present();
      }else if(AC.npcConsecuencia=="Todos"){
        const popover = await this.popoverController.create({
          component: PopoverVerDialogSabioAndNPCComponent,
          cssClass: "popover-dialog",
          translucent: true,
          componentProps: {
            idAC: id,
            razon: razon,
          },
        });



         return await popover.present();

         /*await popover.onDidDismiss().then(async res=>{
          const popover = await this.popoverController.create({
            component: PopoverDialogSabioVerComponent,
            cssClass: "popover-dialog",
            translucent: true,
            componentProps: {
              idAC: id,
              razon: razon,
            },
          });
          return await popover.present();
         })*/
      }
    }
    
  }

 



 





  //#region  CUSTOM AC CRUD

  async presentActionSheetAC(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "AC Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Eliminar",
          role: "destructive",
          icon: "trash",
          handler: () => {
            console.log("Delete clicked");
            //this.deleteQuest(data);
            this.presentAlertConfirmDeleteAC(data.id);
          },
        },
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateAC(data);
          },
        },
        {
          text: "Volver",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async getAccionCausaConsecuencias() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      await this.firestore.firestore
        .collection("accionCausaConsecuencias")
        .onSnapshot((querysnap) => {
          var ACs: any[] = [];
          querysnap.forEach((doc) => {
            console.log("GUET CATEGORY");
            var AC;
            AC = doc.data();
            AC.id = doc.id;
            ACs.push(AC);
          });
          console.log("TAMAÑO", querysnap.size);
          console.log("FIN CAT", ACs);
          this.ACs = ACs;
          this.totalAC = querysnap.size;
        });
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async presentPopoverAC() {
    const popover = await this.popoverController.create({
      component: PopoverAddACComponent,
      cssClass: "popover-big",
      translucent: true,
    });
    return await popover.present();
  }

  async presentPopoverupdateAC(data: AccionCausaConsecuencia) {
    const popover = await this.popoverController.create({
      component: PopoverEditACComponent,
      cssClass: "popover-big",
      translucent: true,
      componentProps: {
        id: data.id,
      },
    });
    return await popover.present();
  }

  async presentAlertConfirmDeleteAC(data?: any) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "¿Confirmar Eliminacion?",
      message: "Seguro que quieres eliminar este <strong>Sabio</strong>",
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
            this.deleteAC(data);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteAC(id: string) {
    // show loader
    console.log("Delete", id);
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      // await this.firestore.doc('aerolines' + id).delete();
      await this.ACSvc.deleteAC(id);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }

  //#endregion


}
