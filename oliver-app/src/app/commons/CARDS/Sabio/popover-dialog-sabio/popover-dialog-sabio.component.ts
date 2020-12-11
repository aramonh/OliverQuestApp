import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { NPCSabioDialogAnswer,AccionCausaConsecuencia } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { SabiosDialogService } from 'src/app/services/sabios-dialog.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';
import { finished } from 'stream';

@Component({
  selector: 'app-popover-dialog-sabio',
  templateUrl: './popover-dialog-sabio.component.html',
  styleUrls: ['./popover-dialog-sabio.component.scss'],
})
export class PopoverDialogSabioComponent implements OnInit {

  NPCSabioDialogAnswer: NPCSabioDialogAnswer = {
    numInteraction: null,
    sabio: null,
    tipo:"",


    numCorrectas:-1,
    numErroneas:-1,


    numPages: 1,
    contenidoPages: [],


    idPrev:null,
    idProvCorrecta:null,
    idProvErronea:null,

    boolInteractionGoAndBack:'false',
    interactionBack:null,



    accionCausa: null,
    accionConsecuencia: "Ninguno",

    boolPlus: "false",
    idOriginal: null,
  };

  thisIsPlus = false;
  create=false;
  ACsCausa: AccionCausaConsecuencia[] = [];
  ACsConsecuencia: AccionCausaConsecuencia[] = [];

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private DialogSabioSvc: SabiosDialogService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController,
    private firestore: AngularFirestore,
    private navParams: NavParams
  ) {
    console.log(this.navParams.data);
    let tipo = this.navParams.get("tipo");
    let idOriginal = this.navParams.get("idOriginal");
    let numInt = this.navParams.get("numInt");
    let numCorrecta = this.navParams.get("numCorrecta");
    let numErronea = this.navParams.get("numErronea");
    let sabio = this.navParams.get("sabio");

    let idPrev = this.navParams.get("idPrev");
    if (idPrev) {
      this.NPCSabioDialogAnswer.idPrev = idPrev;

    }

    if (tipo) {
     
      this.NPCSabioDialogAnswer.tipo = tipo;
     
    }
 
    if (sabio) {
      this.NPCSabioDialogAnswer.sabio = sabio;

      this.getAC(sabio);
    }

    if (idOriginal) {
      this.thisIsPlus = true;

      this.NPCSabioDialogAnswer.idOriginal = idOriginal;
    } else if((this.NPCSabioDialogAnswer.tipo!="GoodAnswer" && this.NPCSabioDialogAnswer.tipo!="BadAnswer"  ) ) {
      this.getsizeInteractions();
    }
    if (numInt) {
      this.thisIsPlus = true;

      this.NPCSabioDialogAnswer.numInteraction = numInt;
    }
    if (numCorrecta || numCorrecta==0) {
     // this.thisIsPlus = true;

      this.NPCSabioDialogAnswer.numCorrectas = numCorrecta;
      console.log("PLUJS numCorrecta",numCorrecta )
    }
    if (numErronea || numErronea==0) {
     // this.thisIsPlus = true;

      this.NPCSabioDialogAnswer.numErroneas = numErronea;
      console.log("PLUJS ERRONEA",numErronea )
    }
  }

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
    }
  }

  async getAC(sabio) {
    try {
      var cant1;
      var cant2;

      await this.firestore.firestore
        .collection("accionCausaConsecuencias")
        .onSnapshot((querysnap) => {
          var ACs1: AccionCausaConsecuencia[] = [];
          var ACs2: AccionCausaConsecuencia[] = [];
          querysnap.forEach(async (doc) => {
            console.log("GUET CATEGORY");

            var AC;
            AC = doc.data();
            AC.id = doc.id;

            if (AC.boolConvCausa == "false") {
              if (sabio.id == AC.npcCausa.id) {
                await this.firestore.firestore
                  .collection("DialogsSabio")
                  .where("sabio.id", "==", sabio.id)
                  .where("accionConsecuencia.id", "==", AC.id)
                  .get()
                  .then(function (querySnapshot) {
                    cant1 = querySnapshot.size;
                    console.log("NUM", cant1)
                    if (cant1 == 0) {
                      ACs1.push(AC);
                    }
                  });
              }
            }

            if (
              sabio.id == AC.npcConsecuencia.id ||
              AC.npcConsecuencia == "Todos"
            ) {
              await this.firestore.firestore
                .collection("DialogsSabio")
                .where("sabio.id", "==", sabio.id)
                .where("accionCausa.id", "==", AC.id)
                .get()
                .then(function (querySnapshot) {
                  cant2 = querySnapshot.size;
                  if (cant2 == 0) {
                    ACs2.push(AC);
                  }
                });
            }
          });
          console.log("TAMAÑO", querysnap.size);
          console.log("FIN CAT", ACs1, ACs2);
          this.ACsCausa = ACs2;
          this.ACsConsecuencia = ACs1;
        });
    } catch (error) {
      console.log(error);
    }
  }

  async createNPCDialogPLUS() {
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.create=true;
        await this.DialogSabioSvc.createDialogPlus(this.NPCSabioDialogAnswer);
      } catch (er) {
        this.globalOperation.showToast(er);
        await this.popoverCtrl.dismiss();
      }
      // dismiss loader
      await this.popoverCtrl.dismiss();
      (await loader).dismiss();
    }
  }

  async getsizeInteractions() {
    try {
      await this.firestore.firestore
        .collection("DialogsSabio")
        .where("idOriginal", "==", null)
        .where("sabio.id", "==", this.NPCSabioDialogAnswer.sabio.id)
        .where("tipo", "==", this.NPCSabioDialogAnswer.tipo)
        .onSnapshot((querysnap) => {
          var interactions: any[] = [];
          querysnap.forEach((doc) => {
            var interaction;
            interaction = doc.data();
            interaction.id = doc.id;

            interactions.push(interaction);
          });

          this.NPCSabioDialogAnswer.numInteraction = interactions.length + 1;
        });
    } catch (error) {}
  }

  async CreateData(data: NPCSabioDialogAnswer) {
    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.create=true;
        await this.DialogSabioSvc.createDialog(data);
        console.log("CREATED", data);
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      await this.popoverCtrl.dismiss();
      (await loader).dismiss();

    }
  }
  removeItemFromArr(arr, i) {
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }

 async verificarCorrectasErroneas(){
  try {

    if(!this.thisIsPlus){
    await this.firestore.firestore
      .collection("DialogsSabio")
      .where("idOriginal", "==", null)
      .where("sabio.id", "==", this.NPCSabioDialogAnswer.sabio.id)
      .where("tipo", "==", this.NPCSabioDialogAnswer.tipo)
      .where("numCorrectas", "==", this.NPCSabioDialogAnswer.numCorrectas)
      .where("numErroneas", "==", this.NPCSabioDialogAnswer.numErroneas)
      .onSnapshot((querysnap) => {
     
       if(querysnap.size!=0  &&  !this.create ){
        this.globalOperation.showToast("Ya existe un dialogo con este numCorrectas y numErroneas, Por favor Cambiarlo");
        this.NPCSabioDialogAnswer.numCorrectas = -1;
        this.NPCSabioDialogAnswer.numErroneas = -1;
      
       } 
return false;
      
      });
    }
  } catch (error) {}
  }

  formValidation() {


    if( this.NPCSabioDialogAnswer.numInteraction==1 && (this.NPCSabioDialogAnswer.tipo!="GoodAnswer" && this.NPCSabioDialogAnswer.tipo!="BadAnswer"  ) ){
      if( this.NPCSabioDialogAnswer.numCorrectas!=0  ||  this.NPCSabioDialogAnswer.numErroneas!=0  ){
        this.globalOperation.showToast("Primer dialogo con 0-0 Correctas-Erroneas, Por favor");
        return false;
      }
    }

    if (this.NPCSabioDialogAnswer.boolInteractionGoAndBack == "false") {
      this.NPCSabioDialogAnswer.interactionBack = null;
    } else {
      if (
        this.NPCSabioDialogAnswer.interactionBack == null ||
        this.NPCSabioDialogAnswer.interactionBack == ""
      ) {
        this.globalOperation.showToast("Ingresa Answers de Go and Back");
        return false;
      }
    }

    for (
      let index = this.NPCSabioDialogAnswer.contenidoPages.length;
      this.NPCSabioDialogAnswer.numPages < index;
      index--
    ) {
      const element = index - 1;
      this.removeItemFromArr(this.NPCSabioDialogAnswer.contenidoPages, element);
    }

    for (let index = 0; index < this.NPCSabioDialogAnswer.numPages; index++) {
      const element = this.NPCSabioDialogAnswer.contenidoPages[index];

      if (element == "" || element == null || element == undefined) {
        this.globalOperation.showToast(
          "Ingresa contenido " + (index + 1).toString()
        );
        return false;
      }
    }

    for (const key in this.NPCSabioDialogAnswer) {
      const element = this.NPCSabioDialogAnswer[key];

      if (element == "" || element == [] || element == -1  ) {
        if(element != 0){

       
        this.globalOperation.showToast("Ingresa " + key);
        return false;
      }
      }
    }

    if (this.thisIsPlus) {
      if (this.NPCSabioDialogAnswer.accionCausa == null) {
        this.globalOperation.showToast("Ingresa accionCausa");
        return false;
      }
    }

    return true;
  }

}
