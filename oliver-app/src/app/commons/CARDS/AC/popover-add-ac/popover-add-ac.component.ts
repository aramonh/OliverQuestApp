import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { AccionCausaConsecuencia, NPC, Sabio } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-add-ac',
  templateUrl: './popover-add-ac.component.html',
  styleUrls: ['./popover-add-ac.component.scss'],
})
export class PopoverAddACComponent implements OnInit {
  accionCausaConsecuencia : AccionCausaConsecuencia = {
    name:"",
    npcCausa:"",
    npcConsecuencia:"",
    description:""
  }; 

  NPCSAndSabios:{
    tipo:string;
    name:string;
  }[]=[];
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

  ) { }

  ngOnInit() {

    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{

      this.getNPCAndSabios();

    }
  }

  

 async getNPCAndSabios(){
   try {
     
    await this.firestore.firestore.collection("NPC")
    .onSnapshot(querysnap=>{
      var names:any[]=[];
      querysnap.forEach(doc=>{
        
        
        var name = {
          id:"",
          tipo:"NPC",
          name:""
        };
        name.id = doc.id;
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
          id:"",
          tipo:"Sabio",
          name:""
        };
        name.id = doc.id;
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



  async CreateData(data: AccionCausaConsecuencia) {

    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.dataSvc.createData("accionCausaConsecuencias", data);
    
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
