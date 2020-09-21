import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ToastController,
  NavController,
} from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  user:User
  titulo="Home"
  constructor(
    private toastCtrl: ToastController,
    private authCtrl: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit(){
    if (!this.authCtrl.logIn){
      this.navCtrl.navigateRoot('login');
      this.showToast('Recuerda iniciar sesion...');
    }else{
      this.user= this.authCtrl.user;
      this.showToast(`Oliver te da la Bienvenida, ${this.user.name || "Aventurero"}`);
    }
  }



  salir(){
    this.authCtrl.signOut();
  }




  showToast(message: string) {
    console.log(message);
    this.toastCtrl
      .create({
        position:"middle",
        message,
        duration: 3000,

      })
      .then((toastData) => toastData.present());
  }
}
