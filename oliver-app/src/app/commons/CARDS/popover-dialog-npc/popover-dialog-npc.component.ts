import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { AccionCausaConsecuencia, NPCNormalDialog } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-dialog-npc',
  templateUrl: './popover-dialog-npc.component.html',
  styleUrls: ['./popover-dialog-npc.component.scss'],
})
export class PopoverDialogNPCComponent implements OnInit {

  NPCNormalDialog : NPCNormalDialog = {
   
    numInteraction :0,
    npcName:"",
    
    questSorprise:'false',
    questSorpriseAnsGood:null,
    questSorpriseAnsBad:null,

    numPages:1,
    contenidoPages:[],

    

    accionCausa:null,
    accionConsecunecia:null,
    
    idPlus:null,
    idOriginal:null


  }; 

  thisIsPlus=false;

  ACsCausa:string[]=[];
  ACsConsecuencia:string[]=[];

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
    this.NPCNormalDialog.npcName = this.navParams.get('npcName');
    let idPlus = this.navParams.get('idPlus');
    let idOriginal = this.navParams.get('idOriginal');

console.log("id nav, ",idPlus,idOriginal);
    if(idPlus){
      this.NPCNormalDialog.idPlus=idPlus;
    }
    if(idOriginal){
      this.thisIsPlus=true;
      this.NPCNormalDialog.idOriginal=idOriginal;
    }

   }

  ngOnInit() {

    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{

    this.getsizeInteractions();

    this.getAC();

    }
  }


  async getAC(){
    try {
      
      await this.firestore.firestore.collection("accionCausaConsecuencias")
      .onSnapshot(querysnap=>{
        var ACs1:string[]=[];
        var ACs2:string[]=[];
        querysnap.forEach(doc=>{
          
          console.log("GUET CATEGORY",  )
          var AC;
          AC = doc.data();
          AC.id = doc.id;
          if(this.NPCNormalDialog.npcName== AC.npcCausa   ){
          ACs1.push( AC.name );
        }
        if( this.NPCNormalDialog.npcName== AC.npcConsecuencia  || AC.npcConsecuencia == "Todos"){
          ACs2.push( AC.name );
        }
        })
        console.log("TAMAÑO", querysnap.size)
        console.log("FIN CAT", ACs1,ACs2)
       this.ACsCausa = ACs2;
       this.ACsConsecuencia = ACs1;
  
      })
  
    } catch (error) {
      console.log(error)
    }
 
   }

  async getsizeInteractions(){
    try {

      await this.firestore.firestore.collection("DialogsNPC")
        .onSnapshot(querysnap=>{
      var interactions:any[]=[];
      querysnap.forEach(doc=>{
        
        var interaction;
        interaction = doc.data();
        interaction.id = doc.id;
        interactions.push( interaction )
      })
  
  

     this.NPCNormalDialog.numInteraction = querysnap.size + 1 ;
    })
    } catch (error) {
      
    }
   
  
  
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
        this.dataSvc.createData("DialogsNPC", data);

     console.log("CREATED",data)
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

  formValidation() {

    if(this.NPCNormalDialog.questSorprise=='false'){
      this.NPCNormalDialog.questSorpriseAnsGood=null;
      this.NPCNormalDialog.questSorpriseAnsBad=null;
    }else{
      if( this.NPCNormalDialog.questSorpriseAnsBad==null || this.NPCNormalDialog.questSorpriseAnsBad==""  ||        this.NPCNormalDialog.questSorpriseAnsGood==null ||       this.NPCNormalDialog.questSorpriseAnsGood==""  ){
        this.globalOperation.showToast("Ingresa Answers de Quests")
        return false;
      }
    }

    for (const key in this.NPCNormalDialog) {
 
        const element = this.NPCNormalDialog[key];
        

        if(element==""  ||  element==[] ){
          this.globalOperation.showToast("Ingresa "+ key)
          return false;
        }
     
    }


    return true;
  }
}
