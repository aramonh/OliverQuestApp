import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Category, Sabio, Town } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-popover-add-sabio',
  templateUrl: './popover-add-sabio.component.html',
  styleUrls: ['./popover-add-sabio.component.scss'],
})
export class PopoverAddSabioComponent implements OnInit {



  sabio: Sabio = {
    name:"",
    town:"",
    category:""
  };
 

  categorys:Observable< Category[]>;
  towns : Observable < Town[]>;

  constructor(

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private dataSvc: CRUDfirebaseService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {

    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{
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


  async CreateData(data: Sabio) {

    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.dataSvc.createData("Sabios", data);
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
