import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { PopoverAddSabioComponent } from "src/app/commons/CARDS/Sabio/popover-add-sabio/popover-add-sabio.component";
import { PopoverDialogSabioEditComponent } from 'src/app/commons/CARDS/Sabio/popover-dialog-sabio-edit/popover-dialog-sabio-edit.component';
import { PopoverDialogSabioVerComponent } from 'src/app/commons/CARDS/Sabio/popover-dialog-sabio-ver/popover-dialog-sabio-ver.component';
import { PopoverDialogSabioComponent } from 'src/app/commons/CARDS/Sabio/popover-dialog-sabio/popover-dialog-sabio.component';
import { PopoverEditSabioComponent } from "src/app/commons/CARDS/Sabio/popover-edit-sabio/popover-edit-sabio.component";
import { NPCSabioDialogAnswer, Sabio } from "src/app/interfaces/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { CRUDfirebaseService } from "src/app/services/crudfirebase.service";
import { SabiosDialogService } from 'src/app/services/sabios-dialog.service';
import { SabiosService } from 'src/app/services/sabios.service';
import { GlobalOperationsService } from "src/app/utils/global-operations.service";

@Component({
  selector: "app-sabio-main-page",
  templateUrl: "./sabio-main-page.page.html",
  styleUrls: ["./sabio-main-page.page.scss"],
})
export class SabioMainPagePage implements OnInit {
  sabioSelected: Sabio;
  sabioState = {
    dialogQuest: false,
    interactions: false,
    badWelcome: false,
    badWelcomeTime: false,
    badWelcomeEscape: false,
  };
  titulo = "Sabios";
  sabios: Sabio[];
  totalSabios: number = 0;
  interactions = null;
  totalInteractions = 0;
  constructor(
    private popoverController: PopoverController,
    private sabioSvc:SabiosService,
    private DialogSabioSvc:SabiosDialogService,

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
      this.getSabios();
    }
  }
  async presentPopoverVerDialogoSabio(id: any) {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioVerComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        id: id,
      },
    });
    return await popover.present();
  }

  //#region  CONFIG SABIOS FLUID
  async selectSabioState(state: string) {
    try {
      for (const key in this.sabioState) {
        if (key == state) {
          this.sabioState[key] = true;
        } else {
          this.sabioState[key] = false;
        }
      }

      if(this.sabioState.badWelcomeEscape){
        this.getDialogBadWelcomeEscape()
      }
      if(this.sabioState.badWelcomeTime){
        this.getDialogBadWelcomeTime()
      }
      if(this.sabioState.interactions){
        this.getDialogInteraction()
      }


    } catch (error) {}
  }

  async selectSabio(data: Sabio) {
    try {
      this.sabioSelected = data;
    } catch (error) {}
  }
  cleanStateSabio() {
    for (const key in this.sabioState) {
      this.sabioState[key] = false;
    }
  }
  cleanSabio() {
    this.sabioSelected = null;
    this.interactions = null;
    this.totalInteractions = 0;
    for (const key in this.sabioState) {
      this.sabioState[key] = false;
    }
  }
  //#endregion

  //#region CUSTOM SABIO CRUD
  async presentActionSheetSabio(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "Sabio Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Eliminar",
          role: "destructive",
          icon: "trash",
          handler: () => {
            console.log("Delete clicked");
            //this.deleteQuest(data);
            this.presentAlertConfirmDeleteSabio(data.id);
          },
        },
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateSabio(data);
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

  async getSabios() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      await this.firestore.firestore
        .collection("Sabios")
        .onSnapshot((querysnap) => {
          var sabios: any[] = [];
          querysnap.forEach((doc) => {
            console.log("GUET CATEGORY");
            var sabio;
            sabio = doc.data();
            sabio.id = doc.id;
            sabios.push(sabio);
          });
          console.log("TAMAÑO", querysnap.size);
          console.log("FIN CAT", sabios);
          this.sabios = sabios;
          this.totalSabios = querysnap.size;
        });
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async presentPopoverSabio() {
    const popover = await this.popoverController.create({
      component: PopoverAddSabioComponent,
      cssClass: "popover-big",
      translucent: true,
    });
    return await popover.present();
  }

  async presentPopoverupdateSabio(data: Sabio) {
    const popover = await this.popoverController.create({
      component: PopoverEditSabioComponent,
      cssClass: "popover-big",
      translucent: true,
      componentProps: {
        id: data.id,
      },
    });
    return await popover.present();
  }

  async presentAlertConfirmDeleteSabio(data?: any) {
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
            this.deleteSabio(data);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteSabio(id: string) {
    // show loader
    console.log("Delete", id);
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      // await this.firestore.doc('aerolines' + id).delete();
      this.sabioSvc.deleteSabio( id);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }
  //#endregion

  //#region CUSTOM SABIO DIALOG QUEST

  async presentPopoverSabioDialogBadAnswer() {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps:{
        tipo:'BadAnswer',
        sabio:this.sabioSelected,
      }
    });
    return await popover.present();
  }
  async presentPopoverSabioDialogGoodAnswer() {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps:{
        tipo:'GoodAnswer',
        sabio:this.sabioSelected,
      }
    });
    return await popover.present();
  }

  //#endregion

  //#region CUSTOM SABIO DIALOG INTERACTION



  async presentActionSheetSabioInteractionWithDelete(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "interactions Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Eliminar",
          role: "destructive",
          icon: "trash",
          handler: () => {
            console.log("Delete clicked");
            //this.deleteQuest(data);
            this.presentAlertConfirmDeleteSabioInteraction(data);
          },
        },
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateSabioInteraction(data);
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
  async presentActionSheetSabioInteraction(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "NPC Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateSabioInteraction(data);
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

  async getDialogInteraction(){
    try {
      this.interactions = [];
      await this.firestore.firestore
      .collection("DialogsSabio")
      .where("idOriginal", "==", null)
      .where('tipo','==','interactions')
      .onSnapshot((querysnap) => {
        var interactions: any[] = [];
        querysnap.forEach((doc) => {

          var interaction;
          interaction = doc.data();
          interaction.id = doc.id;

          interactions.push(interaction);

        });

        interactions.sort((a, b) => a.numInteraction - b.numInteraction);

        this.interactions = interactions;
        this.totalInteractions = interactions.length;

      });
    } catch (error) {
      
    }
  }

  async presentPopoverSabioInteraction() {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps:{
        tipo:'interactions',
        sabio:this.sabioSelected,
      }
    });
    return await popover.present();
  }



  async presentPopoverupdateSabioInteraction(data: NPCSabioDialogAnswer ) {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioEditComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        id:data.id,
        sabio:this.sabioSelected,
        tipo:'interactions',
      },
    });
    return await popover.present();
  }

  async presentAlertConfirmDeleteSabioInteraction(data?: any) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "¿Confirmar Eliminacion?",
      message: "Seguro que quieres eliminar este <strong>Sabio Dialog</strong>",
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
            this.deleteSabioInteraction(data);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteSabioInteraction(dialog: any) {
    // show loader
    console.log("Delete", dialog);
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      this.DialogSabioSvc.deleteDialog(dialog);
      // await this.firestore.doc('aerolines' + id).delete();
      //await this.DialogNPCSvc.deleteDialog(dialog);
      // this.dataSvc.deleteDialog("DialogsNPC",dialog);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }
  //----------------

  async presentPopoverCreatePlusInteraction(numInt: any, idOriginal: any, numCorrecta:any , numErronea:any ) {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        idOriginal: idOriginal,
        sabio: this.sabioSelected,
        numInt: numInt,
        tipo:'interactions',
        numCorrecta:numCorrecta,
        numErronea:numErronea
      },
    });
    return await popover.present();
  }
  

  //#endregion

  //#region CUSTOM SABIO DIALOG BAD WELCOME TIME


  async presentActionSheetSabioBadWelcomeTimeWithDelete(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "BadWelcome Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Eliminar",
          role: "destructive",
          icon: "trash",
          handler: () => {
            console.log("Delete clicked");
            //this.deleteQuest(data);
            this.presentAlertConfirmDeleteSabioBadWelcomeTime(data);
          },
        },
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateSabioBadWelcomeTime(data);
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
  async presentActionSheetSabioBadWelcomeTime(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "NPC Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateSabioBadWelcomeTime(data);
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

  async getDialogBadWelcomeTime(){
    try {
      this.interactions = [];
      await this.firestore.firestore
      .collection("DialogsSabio")
      .where("idOriginal", "==", null)
      .where('tipo','==','badWelcomeTime')
      .onSnapshot((querysnap) => {
        var interactions: any[] = [];
        querysnap.forEach((doc) => {

          var interaction;
          interaction = doc.data();
          interaction.id = doc.id;

          interactions.push(interaction);

        });

        interactions.sort((a, b) => a.numInteraction - b.numInteraction);

        this.interactions = interactions;
        this.totalInteractions = interactions.length;

      });
    } catch (error) {
      
    }
  }

  async presentPopoverSabioBadWelcomeTime() {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps:{
        tipo:'badWelcomeTime',
        sabio:this.sabioSelected,
      }
    });
    return await popover.present();
  }



  async presentPopoverupdateSabioBadWelcomeTime(data: NPCSabioDialogAnswer ) {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioEditComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        id:data.id,
        sabio:this.sabioSelected,
        tipo:'badWelcomeTime',
      },
    });
    return await popover.present();
  }

  async presentAlertConfirmDeleteSabioBadWelcomeTime(data?: any) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "¿Confirmar Eliminacion?",
      message: "Seguro que quieres eliminar este <strong>Sabio Dialog</strong>",
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
            this.deleteSabioBadWelcomeTime(data);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteSabioBadWelcomeTime(dialog: any) {
    // show loader
    console.log("Delete", dialog);
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      this.DialogSabioSvc.deleteDialog(dialog);
      // await this.firestore.doc('aerolines' + id).delete();
      //await this.DialogNPCSvc.deleteDialog(dialog);
      // this.dataSvc.deleteDialog("DialogsNPC",dialog);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }
  //----------------
  async presentPopoverCreatePlusBadWelcomeTime(numInt: any, idOriginal: any ,numCorrecta:any , numErronea:any ) {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        idOriginal: idOriginal,
        sabio: this.sabioSelected,
        numInt: numInt,
        tipo:'badWelcomeTime',
        numCorrecta:numCorrecta,
        numErronea:numErronea
      },
    });
    return await popover.present();
  }
  
  //#endregion

  //#region CUSTOM SABIO DIALOG BAD WELCOME ESCAPE


  async presentActionSheetSabioBadWelcomeEscapeWithDelete(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "BadWelcome Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Eliminar",
          role: "destructive",
          icon: "trash",
          handler: () => {
            console.log("Delete clicked");
            //this.deleteQuest(data);
            this.presentAlertConfirmDeleteSabioBadWelcomeEscape(data);
          },
        },
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateSabioBadWelcomeEscape(data);
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
  async presentActionSheetSabioBadWelcomeEscape(data?: any) {
    console.log("setingcard", data);
    const actionSheet = await this.actionSheetController.create({
      header: "NPC Configuration",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Editar",
          icon: "pencil",
          handler: () => {
            console.log("Share clicked");
            this.presentPopoverupdateSabioBadWelcomeEscape(data);
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

  async getDialogBadWelcomeEscape(){
    try {
      this.interactions = [];
      await this.firestore.firestore
      .collection("DialogsSabio")
      .where("idOriginal", "==", null)
      .where('tipo','==','badWelcomeEscape')
      .onSnapshot((querysnap) => {
        var interactions: any[] = [];
        querysnap.forEach((doc) => {

          var interaction;
          interaction = doc.data();
          interaction.id = doc.id;

          interactions.push(interaction);

        });

        interactions.sort((a, b) => a.numInteraction - b.numInteraction);

        this.interactions = interactions;
        this.totalInteractions = interactions.length;

      });
    } catch (error) {
      
    }
  }

  async presentPopoverSabioBadWelcomeEscape() {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps:{
        tipo:'badWelcomeEscape',
        sabio:this.sabioSelected,
      }
    });
    return await popover.present();
  }



  async presentPopoverupdateSabioBadWelcomeEscape(data: NPCSabioDialogAnswer ) {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioEditComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        id:data.id,
        sabio:this.sabioSelected,
        tipo:'badWelcomeEscape',
      },
    });
    return await popover.present();
  }

  async presentAlertConfirmDeleteSabioBadWelcomeEscape(data?: any) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "¿Confirmar Eliminacion?",
      message: "Seguro que quieres eliminar este <strong>Sabio Dialog</strong>",
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
            this.deleteSabioBadWelcomeEscape(data);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteSabioBadWelcomeEscape(dialog: any) {
    // show loader
    console.log("Delete", dialog);
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {
      this.DialogSabioSvc.deleteDialog(dialog);
      // await this.firestore.doc('aerolines' + id).delete();
      //await this.DialogNPCSvc.deleteDialog(dialog);
      // this.dataSvc.deleteDialog("DialogsNPC",dialog);
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    (await loader).dismiss();
  }
  //----------------
  async presentPopoverCreatePlusBadWelcomeEscape(numInt: any, idOriginal: any , numCorrecta:any , numErronea:any ) {
    const popover = await this.popoverController.create({
      component: PopoverDialogSabioComponent,
      cssClass: "popover-dialog",
      translucent: true,
      componentProps: {
        idOriginal: idOriginal,
        sabio: this.sabioSelected,
        numInt: numInt,
        tipo:'badWelcomeEscape',
        numCorrecta:numCorrecta,
        numErronea:numErronea
      },
    });
    return await popover.present();
  }


  //#endregion
}
