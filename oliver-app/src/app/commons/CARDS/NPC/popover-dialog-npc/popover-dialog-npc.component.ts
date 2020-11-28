import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  LoadingController,
  NavController,
  NavParams,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import {
  AccionCausaConsecuencia,
  NPCNormalDialog,
} from "src/app/interfaces/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { CRUDfirebaseService } from "src/app/services/crudfirebase.service";
import { LocalService } from "src/app/services/local.service";
import { GlobalOperationsService } from "src/app/utils/global-operations.service";

@Component({
  selector: "app-popover-dialog-npc",
  templateUrl: "./popover-dialog-npc.component.html",
  styleUrls: ["./popover-dialog-npc.component.scss"],
})
export class PopoverDialogNPCComponent implements OnInit {
  NPCNormalDialog: NPCNormalDialog = {
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

  thisIsPlus = false;
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
  ACsCausa: AccionCausaConsecuencia[] = [];
  ACsConsecuencia: AccionCausaConsecuencia[] = [];

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private dataSvc: CRUDfirebaseService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController,
    private firestore: AngularFirestore,
    private navParams: NavParams
  ) {
    console.log(this.navParams.data);
    let npcName = this.navParams.get("npcName");
    let idPlus = this.navParams.get("idPlus");
    let idOriginal = this.navParams.get("idOriginal");

    console.log("id nav, ", idPlus, idOriginal);
    if (npcName) {
      this.NPCNormalDialog.npcName = npcName;
      this.getsizeInteractions();
      this.getAC();
    }
    if (idPlus) {
      this.NPCNormalDialog.idPlus = idPlus;
    }
    if (idOriginal) {
      this.thisIsPlus = true;
      this.getDialogOriginal(idOriginal);
   
      this.NPCNormalDialog.idOriginal = idOriginal;
    }
  }

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
  

 
    }
  }

  async getAC() {
    try {
      await this.firestore.firestore
        .collection("accionCausaConsecuencias")
        .onSnapshot((querysnap) => {
          var ACs1: AccionCausaConsecuencia[] = [];
          var ACs2: AccionCausaConsecuencia[] = [];
          querysnap.forEach((doc) => {
            console.log("GUET CATEGORY");
            var AC;
            AC = doc.data();
            AC.id = doc.id;
            if(AC.idconvCausa==null){
            if (this.NPCNormalDialog.npcName == AC.npcCausa) {
              ACs1.push(AC);
            }}
            if(AC.idconvConsecuencia == null ){
            if (
              this.NPCNormalDialog.npcName == AC.npcConsecuencia ||
              AC.npcConsecuencia == "Todos"
            ) {
              ACs2.push(AC);
            }}
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

  async getACPlus() {
    try {
      await this.firestore.firestore
        .collection("accionCausaConsecuencias")
        .onSnapshot((querysnap) => {
          var ACs1: AccionCausaConsecuencia[] = [];
          var ACs2: AccionCausaConsecuencia[] = [];
          querysnap.forEach((doc) => {
            console.log("GUET CATEGORY");
            var AC;
            AC = doc.data();
            AC.id = doc.id;
            if(AC.idconvCausa==null){
            if (this.NPCNormalDialogOriginal.npcName == AC.npcCausa) {
              ACs1.push(AC);
            }}
            if(AC.idconvConsecuencia == null ){
            if (
              this.NPCNormalDialogOriginal.npcName == AC.npcConsecuencia ||
              AC.npcConsecuencia == "Todos"
            ) {
              ACs2.push(AC);
            }}
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

      this.NPCNormalDialog.npcName=this.NPCNormalDialogOriginal.npcName;
      for (const key in data["contenidoPages"]) {
      
          const element = data["contenidoPages"];
          
          this.NPCNormalDialogOriginal.contenidoPages.push(...element );
      }
      this.getACPlus();
      
    });
 


    if(this.NPCNormalDialogOriginal==undefined || this.NPCNormalDialogOriginal==null){
      this.globalOperation.showToast("Select NPCNormalDialog Again");
      await this.popoverCtrl.dismiss();
      return false;
    }

  } catch (error) {
    
  }
}

  async createNPCDialogPLUS(){
    if (this.formValidationOriginal()) {
      if (this.formValidation()) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    try {
   
      
  


  this.dataSvc.createDialogPlus("DialogsNPC",this.NPCNormalDialogOriginal,  this.NPCNormalDialog);

      


  } catch (er) {
    this.globalOperation.showToast(er);
    await this.popoverCtrl.dismiss();

  }
      // dismiss loader
      await this.popoverCtrl.dismiss();
      (await loader).dismiss();
}}}

  async getsizeInteractions() {
    try {
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("idOriginal","==",null)
        .where("npcName","==",this.NPCNormalDialog.npcName)
        .onSnapshot((querysnap) => {
          var interactions: any[] = [];
          querysnap.forEach((doc) => {
            var interaction;
            interaction = doc.data();
            interaction.id = doc.id;
            
              interactions.push( interaction )
            
          });

          this.NPCNormalDialog.numInteraction = interactions.length + 1;
        });
    } catch (error) {}
  }

  async CreateData(data: NPCNormalDialog) {
    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.dataSvc.createDialog("DialogsNPC", data);


        console.log("CREATED", data);
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      await this.popoverCtrl.dismiss();
      (await loader).dismiss();
      // redirect to home page
      //  this.navCtrl.navigateRoot("/quest-pages");
    }
  }
  removeItemFromArr(arr, i) {
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }


  formValidationOriginal() {
    if (this.NPCNormalDialogOriginal.questSorprise == "false") {
      this.NPCNormalDialogOriginal.questSorpriseAnsGood = null;
      this.NPCNormalDialogOriginal.questSorpriseAnsBad = null;
    } else {
      if (
        this.NPCNormalDialogOriginal.questSorpriseAnsBad == null ||
        this.NPCNormalDialogOriginal.questSorpriseAnsBad == "" ||
        this.NPCNormalDialogOriginal.questSorpriseAnsGood == null ||
        this.NPCNormalDialogOriginal.questSorpriseAnsGood == ""
      ) {
        this.globalOperation.showToast("Ingresa Answers de Quests");
        return false;
      }
    }

    for (
      let index = this.NPCNormalDialogOriginal.contenidoPages.length;
      this.NPCNormalDialogOriginal.numPages < index;
      index--
    ) {
      const element = index - 1;
      this.removeItemFromArr(this.NPCNormalDialogOriginal.contenidoPages, element);
    }

    for (let index = 0; index < this.NPCNormalDialogOriginal.numPages - 1; index++) {
      const element = this.NPCNormalDialogOriginal.contenidoPages[index];

      if (element == "" || element == null || element == undefined) {
        this.globalOperation.showToast(
          "Ingresa contenido " + (index + 1).toString()
        );
        return false;
      }
    }

    for (const key in this.NPCNormalDialogOriginal) {
      const element = this.NPCNormalDialogOriginal[key];

      if (element == "" || element == []) {
        this.globalOperation.showToast("Ingresa " + key);
        return false;
      }
    }

    return true;
  }

  formValidation() {
    if (this.NPCNormalDialog.questSorprise == "false") {
      this.NPCNormalDialog.questSorpriseAnsGood = null;
      this.NPCNormalDialog.questSorpriseAnsBad = null;
    } else {
      if (
        this.NPCNormalDialog.questSorpriseAnsBad == null ||
        this.NPCNormalDialog.questSorpriseAnsBad == "" ||
        this.NPCNormalDialog.questSorpriseAnsGood == null ||
        this.NPCNormalDialog.questSorpriseAnsGood == ""
      ) {
        this.globalOperation.showToast("Ingresa Answers de Quests");
        return false;
      }
    }

    for (
      let index = this.NPCNormalDialog.contenidoPages.length;
      this.NPCNormalDialog.numPages < index;
      index--
    ) {
      const element = index - 1;
      this.removeItemFromArr(this.NPCNormalDialog.contenidoPages, element);
    }

    for (let index = 0; index < this.NPCNormalDialog.numPages - 1; index++) {
      const element = this.NPCNormalDialog.contenidoPages[index];

      if (element == "" || element == null || element == undefined) {
        this.globalOperation.showToast(
          "Ingresa contenido " + (index + 1).toString()
        );
        return false;
      }
    }

    for (const key in this.NPCNormalDialog) {
      const element = this.NPCNormalDialog[key];

      if (element == "" || element == []) {
        this.globalOperation.showToast("Ingresa " + key);
        return false;
      }
    }

    if(this.thisIsPlus){
    if(this.NPCNormalDialog.accionCausa==null){
      this.globalOperation.showToast("Ingresa accionCausa" );
      return false;
    }}

    return true;
  }
}
