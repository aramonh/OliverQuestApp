import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Platform } from '@ionic/angular';
import {
  NavController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { User } from '../interfaces/interfaces';
import { GooglePlus } from '@ionic-native/google-plus/ngx';



@Injectable({
  providedIn: 'root',
})
export class AuthService {


  
user:User ={
  email:"",
  name:"Aventurero",
  picture:""
}

  constructor(
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private platform : Platform,
    private googlePlus : GooglePlus
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
      localStorage.removeItem('user');
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

  /*async loginGoogle() {
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
  }*/

  loginGoogle() {
    if (this.platform.is('cordova')) {
      console.log("PLATFORM ANDROID")
      this.loginGoogleAndroid();
    } else {
      console.log("PLATFORM WEB")
      this.loginGoogleWeb();
    }
  }
  async loginGoogleAndroid() {
    const res = await this.googlePlus.login({
      'webClientId': "469177720356-ttqfhh5ep8gnhnhv37pa3h6718vlt8lg.apps.googleusercontent.com",
      'offline': true
    });
     await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(
       res=>{
        this.setTokentoHeader();

        this.navCtrl.navigateRoot('home');
       }
     ).catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.email;

      const credential = error.credential;
      this.showToast(error);
    });
    
  
  }

  async loginGoogleWeb() {
     await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      res =>{
        this.setTokentoHeader();

        this.navCtrl.navigateRoot('home');
      }
    ).catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.email;

      const credential = error.credential;
      this.showToast(error);
    });

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

     var user:User = {
        uid:"",
        name:"Aventurero",
        email:"",
        picture:null
     }
     user.uid = await  (await this.afAuth.currentUser).uid
     user.email = await  (await this.afAuth.currentUser).email
     user.name = await  (await this.afAuth.currentUser).displayName
     user.picture = await  (await this.afAuth.currentUser).photoURL
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
