import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { AccionCausaConsecuencia } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-edit-ac',
  templateUrl: './popover-edit-ac.component.html',
  styleUrls: ['./popover-edit-ac.component.scss'],
})
export class PopoverEditACComponent implements OnInit {
  accionCausaConsecuencia : AccionCausaConsecuencia = {
    name:"",
    npcCausa:"",
    npcConsecuencia:"",
    description:"",
    idconvCausa:null,
    idconvConsecuencia:null,
  }; 

  NPCSAndSabios:{
    tipo:string;
    name:string;
  }[]=[];


  id:any;

  constructor(

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private dataSvc: CRUDfirebaseService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController,
    private actRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    public navParams:NavParams
  ) { 

    console.log(this.navParams.data);
     this.id = this.navParams.get('id');

  }


  ngOnInit() {

    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{

      this.getNPCAndSabios();
      this.getACById(this.id);
    }
  }


 async getNPCAndSabios(){
   try {
     
    await this.firestore.firestore.collection("NPC")
    .onSnapshot(querysnap=>{
      var names:any[]=[];
      querysnap.forEach(doc=>{
        
        
        var name = {
          tipo:"NPC",
          name:""
        };
        name.name = doc.data().name;
        console.log("GUET CATEGORY", name )
        names.push( name )
      })
      this.NPCSAndSabios.push(...names);
    })
    await this.firestore.firestore.collection("Sabios")
    .onSnapshot(querysnap=>{
      var names:any[]=[];
      querysnap.forEach(doc=>{
        
       
        var name = {
          tipo:"Sabio",
          name:""
        };
        name.name = doc.data().name;
        console.log("GUET CATEGORY", name )
        names.push( name )
      })
      this.NPCSAndSabios.push(...names);
    })
 
 

  console.log(this.NPCSAndSabios)
   } catch (error) {
     console.log(error)
   }

  }



  async getACById(id: string){
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    try {
      console.log("ID PARA BUSCAR",id)
      
     
      this.firestore.doc('accionCausaConsecuencias/' + id )
      .valueChanges()
      .subscribe( data => {
  

        this.accionCausaConsecuencia.name= data["name"];
        this.accionCausaConsecuencia.npcCausa= data["npcCausa"];
        this.accionCausaConsecuencia.npcConsecuencia= data["npcConsecuencia"];
        this.accionCausaConsecuencia.description= data["description"];


        
      });
   
  
  
      if(this.accionCausaConsecuencia==undefined || this.accionCausaConsecuencia==null){
        this.globalOperation.showToast("Select accionCausaConsecuencia Again");
        await this.popoverCtrl.dismiss();
      }
  } catch (er) {
    this.globalOperation.showToast(er);
    await this.popoverCtrl.dismiss();

  }
    // dismiss loader
    (await loader).dismiss();
}


  async updateData(accionCausaConsecuencias: AccionCausaConsecuencia) {
    console.log("post to create", accionCausaConsecuencias);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.dataSvc.updateData("accionCausaConsecuencias",this.id,accionCausaConsecuencias);
        
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      (await loader).dismiss();
      // redirect to home page
      await this.popoverCtrl.dismiss();
    }
  }

  formValidation() {

    for (const key in this.accionCausaConsecuencia) {
 
        const element = this.accionCausaConsecuencia[key];
        

        if(element==""){
          this.globalOperation.showToast("Ingresa "+ key)
          return false;
        }
     
    }


    return true;
  }



}
