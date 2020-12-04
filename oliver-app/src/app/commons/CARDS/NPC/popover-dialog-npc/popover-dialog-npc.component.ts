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
import { NPCDialogService } from 'src/app/services/npcdialog.service';
import { GlobalOperationsService } from "src/app/utils/global-operations.service";

@Component({
  selector: "app-popover-dialog-npc",
  templateUrl: "./popover-dialog-npc.component.html",
  styleUrls: ["./popover-dialog-npc.component.scss"],
})
export class PopoverDialogNPCComponent implements OnInit {
  NPCNormalDialog: NPCNormalDialog = {
    numInteraction: 0,
    npc: null,

    questSorprise: "false",
    questSorpriseAnsGood: null,
    questSorpriseAnsBad: null,

    numPages: 1,
    contenidoPages: [],

    accionCausa: null,
    accionConsecuencia: "Ninguno",

    boolPlus: 'false',
    idOriginal: null,
  };

  thisIsPlus = false;

  ACsCausa: AccionCausaConsecuencia[] = [];
  ACsConsecuencia: AccionCausaConsecuencia[] = [];

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private DialogNPCSvc:NPCDialogService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController,
    private firestore: AngularFirestore,
    private navParams: NavParams
  ) {
    console.log(this.navParams.data);
    let npc = this.navParams.get("npc");
    //let idPlus = this.navParams.get("idPlus");
    let idOriginal = this.navParams.get("idOriginal");
    let numInt = this.navParams.get("numInt");
    //console.log("id nav, ", idPlus, idOriginal);
    if (npc) {
      this.NPCNormalDialog.npc = npc;
  
      this.getAC(npc);
    }
    /*if (idPlus) {
      this.NPCNormalDialog.boolPlus = idPlus;
    }*/
    if (idOriginal) {
      this.thisIsPlus = true;
    
   
      this.NPCNormalDialog.idOriginal = idOriginal;
    }else{
      this.getsizeInteractions();
    }
    if (numInt) {
      this.thisIsPlus = true;
    
   
      this.NPCNormalDialog.numInteraction = numInt;
    }
  }

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
  

 
    }
  }

  async getAC(npc) {
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
  
            if (AC.boolConvCausa == 'false'  ) {
              if (npc.id == AC.npcCausa.id) {

                await this.firestore.firestore
                .collection("DialogsNPC")
                .where('npc.id','==',npc.id)
                .where("accionConsecuencia.id", "==", AC.id)
                .get()
                .then(function (querySnapshot) {
                  cant1 = querySnapshot.size;
                  if(cant1==0){
                    ACs1.push(AC);
                  }
                
    
                });
             
              }
            }
        
   


       
              if (
                npc.id == AC.npcConsecuencia.id ||
                AC.npcConsecuencia == "Todos"
              ) {


                await this.firestore.firestore
                .collection("DialogsNPC")
                .where('npc.id','==',npc.id)
                .where("accionCausa.id", "==", AC.id)
                .get()
                .then(function (querySnapshot) {
                  cant2 = querySnapshot.size;
                  if(cant2==0){
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




  async createNPCDialogPLUS(){

      if (this.formValidation()) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    try {
   
      
  


  //this.dataSvc.createDialogPlus("DialogsNPC",this.NPCNormalDialogOriginal,  this.NPCNormalDialog);
      await this.DialogNPCSvc.createDialogPlus(this.NPCNormalDialog);
      


  } catch (er) {
    this.globalOperation.showToast(er);
    await this.popoverCtrl.dismiss();

  }
      // dismiss loader
      await this.popoverCtrl.dismiss();
      (await loader).dismiss();
}}

  async getsizeInteractions() {
    try {
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("idOriginal","==",null)
        .where("npc.id","==",this.NPCNormalDialog.npc.id)
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
        //this.dataSvc.createDialog("DialogsNPC", data);

        await this.DialogNPCSvc.createDialog(data);
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

    for (let index = 0; index < this.NPCNormalDialog.numPages ; index++) {
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
