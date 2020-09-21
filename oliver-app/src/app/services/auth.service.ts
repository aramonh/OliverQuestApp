import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {
  NavController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { User } from '../interfaces/interfaces';



@Injectable({
  providedIn: 'root',
})
export class AuthService {


  
user:User ={
  email:"",
  name:"Aventurero"
}

  constructor(
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.setUser();
  

  }

  private setUser() {
    console.log('User', localStorage.getItem('user'));
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  public get logIn(): boolean {
    console.log('LogIN', localStorage.getItem('token'));
    return localStorage.getItem('token') !== null;
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.reload();
    } catch (err) {
      this.showToast(err);
    }
  }


  async loginFacebook() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait..',
    });
    (await loader).present();


    try {

     const provider = new firebase.auth.FacebookAuthProvider();
     await this.loginWithSocial(provider);

    }catch (er) {
      this.showToast(er);
    }

    (await loader).dismiss();
  }

  async loginGoogle() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait..',
    });
    (await loader).present();


    try {

     const provider = new firebase.auth.GoogleAuthProvider();
     await this.loginWithSocial(provider);

    }catch (er) {
      this.showToast(er);
    }

    (await loader).dismiss();
  }

  async login(user: User) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait..',
    });
    (await loader).present();

    try {
      await this.afAuth
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
          console.log('serv', data);
          this.setTokentoHeader();
          // redirect to home page
          this.navCtrl.navigateRoot('home');
        });
    } catch (er) {
      this.showToast(er);
    }

    (await loader).dismiss();
  }

  async register(user: User) {
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
      await this.afAuth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((data) => {
          console.log('service', data);
          this.setTokentoHeader();
          // --redirect to home page--
          this.navCtrl.navigateRoot('home');
        });
    } catch (er) {
      this.showToast(er);
    }
    (await loader).dismiss();
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


  private async loginWithSocial(provider: any){
   
    await this.afAuth.signInWithPopup(provider).then( result => {
      console.log(result);
      const token = result.credential["accessToken"];
      console.log('google token', token);
      // The signed-in user info.
     const user = result.user;
    // tslint:disable-next-line: align
      this.setTokentoHeader();

      this.navCtrl.navigateRoot('home');
    }).catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.email;

      const credential = error.credential;
      this.showToast(error);
    });
  }

  

  private async setTokentoHeader() {
    try {

     var user = {
        uid:"",
        name:"Aventurero",
        email:""
     }
     user.uid = await  (await this.afAuth.currentUser).uid
     user.email = await  (await this.afAuth.currentUser).email
     user.name = await  (await this.afAuth.currentUser).displayName
      console.log("USER",user)
    localStorage.setItem('user', JSON.stringify(user));





      await (await this.afAuth.currentUser)
        .getIdToken(true)
        .then((idToken) => {
          localStorage.setItem('token', idToken);
          console.log('token in storage');
          window.location.reload();
        })
        .catch((er) => {
          this.showToast(er);
        });
    } catch (err) {
      this.showToast(err);
    }
  }
}
