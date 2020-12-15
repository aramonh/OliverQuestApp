import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { AccionCausaConsecuencia, NPCSabioDialogAnswer } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { SabiosDialogService } from 'src/app/services/sabios-dialog.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-dialog-sabio-edit',
  templateUrl: './popover-dialog-sabio-edit.component.html',
  styleUrls: ['./popover-dialog-sabio-edit.component.scss'],
})
export class PopoverDialogSabioEditComponent implements OnInit {

  NPCSabioDialogAnswer: NPCSabioDialogAnswer = {
    numInteraction: null,
    sabio: null,
    tipo:"",


    numCorrectas:0,
    numErroneas:0,


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
  OldAccionCausa: AccionCausaConsecuencia;
  OldaccionConsecuencia: AccionCausaConsecuencia;
  thisIsPlus = false;
  id: any;
  ACsCausa: AccionCausaConsecuencia[] = [];
  ACsConsecuencia: AccionCausaConsecuencia[] = [];
  constructor(
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
    console.log(this.navParams.data);
    let id = this.navParams.get("id");
    if (id) {
      this.id = id;
    }
    let sabio = this.navParams.get("sabio");

    if (sabio) {
      this.NPCSabioDialogAnswer.sabio = sabio;
    }
    let idPlus = this.navParams.get("idPlus");
    if (idPlus) {
      this.id = idPlus;

      this.thisIsPlus = true;
    }
  }

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
      this.getNPCDialogById(this.id);
    }
  }

  async getNPCDialogById(id: string) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please Wait...",
    });
    (await loader).present();

    try {
      console.log("ID PARA BUSCAR", id);

      this.firestore
        .doc("DialogsSabio/" + id)
        .valueChanges()
        .subscribe((data) => {
          this.NPCSabioDialogAnswer.numInteraction = data["numInteraction"];
          this.NPCSabioDialogAnswer.boolInteractionGoAndBack = data["boolInteractionGoAndBack"];
          this.NPCSabioDialogAnswer.interactionBack =
            data["interactionBack"];
     
          this.NPCSabioDialogAnswer.numCorrectas = data["numCorrectas"];
          
          this.NPCSabioDialogAnswer.numErroneas = data["numErroneas"];
          
          this.NPCSabioDialogAnswer.idPrev = data["idPrev"];
          
          this.NPCSabioDialogAnswer.idProvCorrecta = data["idProvCorrecta"];
          
          this.NPCSabioDialogAnswer.idProvErronea = data["idProvErronea"];

          this.NPCSabioDialogAnswer.numPages = data["numPages"];
          this.NPCSabioDialogAnswer.accionCausa = data["accionCausa"];
          this.OldAccionCausa = data["accionCausa"];
          this.NPCSabioDialogAnswer.accionConsecuencia = data["accionConsecuencia"];
          this.OldaccionConsecuencia = data["accionConsecuencia"];

          this.NPCSabioDialogAnswer.tipo = data["tipo"];
          this.NPCSabioDialogAnswer.sabio = data["sabio"];
          this.NPCSabioDialogAnswer.idOriginal = data["idOriginal"];
          this.NPCSabioDialogAnswer.boolPlus = data["boolPlus"];
          for (let index = 0; index < data["contenidoPages"].length; index++) {
            const element = data["contenidoPages"][index];
            this.NPCSabioDialogAnswer.contenidoPages.push(element);
          }

          this.getAC(
            this.NPCSabioDialogAnswer.sabio,
            this.NPCSabioDialogAnswer.accionConsecuencia,
            this.NPCSabioDialogAnswer.accionCausa
          );
        });

      if (this.NPCSabioDialogAnswer == undefined || this.NPCSabioDialogAnswer == null) {
        this.globalOperation.showToast("Select NPCSabioDialogAnswer Again");
        await this.popoverCtrl.dismiss();
      }
    } catch (er) {
      this.globalOperation.showToast(er);
      await this.popoverCtrl.dismiss();
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async updateData(data: NPCSabioDialogAnswer) {
    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.create=true;
        // this.dataSvc.updateDialog("DialogsNPC", this.id, data, this.OldAccionCausa, this.OldaccionConsecuencia);
        await this.DialogSabioSvc.updateDialog(this.id,
          data,
          this.OldAccionCausa,
          this.OldaccionConsecuencia);
   
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      (await loader).dismiss();
      // redirect to home page
      await this.popoverCtrl.dismiss();
    }
  }

  async getAC(sabio, accionConsecuencia, accionCausa) {
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
                    if (cant1 == 0) {
                      ACs1.push(AC);
                    }
                  });
              }
            }
            if (AC.id == accionConsecuencia.id) {
              ACs1.push(AC);
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
            if (AC.id == accionCausa.id ) {
              ACs2.push(AC);
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

  removeItemFromArr(arr, i) {
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }

create=false;

  async verificarCorrectasErroneas(){
    try {
      await this.firestore.firestore
        .collection("DialogsSabio")
        .where("idOriginal", "==", null)
        .where("sabio.id", "==", this.NPCSabioDialogAnswer.sabio.id)
        .where("tipo", "==", this.NPCSabioDialogAnswer.tipo)
        .where("numCorrectas", "==", this.NPCSabioDialogAnswer.numCorrectas)
        .where("numErroneas", "==", this.NPCSabioDialogAnswer.numErroneas)
        .onSnapshot((querysnap) => {


       
         if(querysnap.size!=0  &&  !this.create && querysnap.docs[0].id!=this.id){
          this.globalOperation.showToast("Ya existe un dialogo con este numCorrectas y numErroneas, Por favor Cambiarlo");
          this.NPCSabioDialogAnswer.numCorrectas = -1;
          this.NPCSabioDialogAnswer.numErroneas = -1;
        
         } 
  return false;
        
        });
    } catch (error) {}
    }

  formValidation() {

    if( this.NPCSabioDialogAnswer.numInteraction==1 ){
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

      if (element == "" || element == []) {
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
