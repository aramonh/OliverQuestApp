import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Category, Sabio, Town } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { SabiosService } from 'src/app/services/sabios.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-edit-sabio',
  templateUrl: './popover-edit-sabio.component.html',
  styleUrls: ['./popover-edit-sabio.component.scss'],
})
export class PopoverEditSabioComponent implements OnInit {



  sabio: Sabio = {
    name:"",
    town:"",
    category:""
  };
 

  categorys:Observable< Category[]>;
  towns : Observable < Town[]>;
  id:any;
  constructor(

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private sabioSvc:SabiosService,
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
      this.getSabiosById(this.id);
      this.getTown();
      this.getCategorys();
    }
  }

  getTown(){
    this.towns = this.localSvc.getTowns();
    console.log(this.towns );
  }
  getCategorys(){
    this.categorys = this.localSvc.getCategorys();
    console.log(this.categorys);
  }


  async getSabiosById(id: string){
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    try {
      console.log("ID PARA BUSCAR",id)
      
     
      this.firestore.doc('Sabios/' + id )
      .valueChanges()
      .subscribe( data => {
  

        this.sabio.name= data["name"];
        this.sabio.town= data["town"];
        this.sabio.category= data["category"];
      

        
      });
   
  
  
      if(this.sabio==undefined || this.sabio==null){
        this.globalOperation.showToast("Select sabio Again");
        await this.popoverCtrl.dismiss();
      }
  } catch (er) {
    this.globalOperation.showToast(er);
    await this.popoverCtrl.dismiss();

  }
    // dismiss loader
    (await loader).dismiss();
}


  async updateData(sabio: Sabio) {
    console.log("post to create", sabio);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        await this.sabioSvc.updateSabio(this.id,sabio);
      
        
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

    for (const key in this.sabio) {
 
        const element = this.sabio[key];
        

        if(element==""){
          this.globalOperation.showToast("Ingresa "+ key)
          return false;
        }
     
    }


    return true;
  }


}
