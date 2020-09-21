import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/interfaces';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
user: User = {
  email: '',
  password: ''
};
  constructor( private toastCtrl: ToastController,
               private navCtrl: NavController,
               private authCtrl: AuthService ) { }
  ngOnInit() {
    if (this.authCtrl.logIn){
      this.navCtrl.navigateRoot('home');
    }
  }

  async onRegister(user: User){
    console.log('registro', user);
    if (this.formValidation()){
      try {
        this.authCtrl.register(user);
      } catch (er) {
        this.showToast(er);
      }
    }
  }

  formValidation(){
    if (!this.user.email ){
      this.showToast('Enter Email');
      return false;
    }
    if (!this.user.password ){
      this.showToast('Enter Password');
      return false;
    }
    return true;
  }

  showToast(message: string){
    console.log(message);
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(
      toastData => toastData.present()
    );
  }

}
