import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/interfaces';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
user: User = {
  email: '',
  password: ''
};
  constructor(private toastCtrl: ToastController,
              private navCtrl: NavController,
              private authCtrl: AuthService) { }

  ngOnInit() {
    if (this.authCtrl.logIn){
      this.navCtrl.navigateRoot('home');
    }
  }

async onLogin(user: User ){
  console.log(user);
  if (this.formValidation()){
   try {
    await this.authCtrl.login(user);
   } catch (er) {
     this.showToast(er);
   }
  }
}

async onLoginGoogle(){
  try {
    await this.authCtrl.loginGoogle();
  } catch (error) {
    this.showToast(error);
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
