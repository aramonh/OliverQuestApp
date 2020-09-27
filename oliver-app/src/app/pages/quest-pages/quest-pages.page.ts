import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import {  LoadingController, NavController } from '@ionic/angular';

import {  Quest, User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';

import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-quest-pages',
  templateUrl: './quest-pages.page.html',
  styleUrls: ['./quest-pages.page.scss'],
})
export class QuestPagesPage implements OnInit {
user:User;


  constructor(
    private loadingCtrl: LoadingController,
  
    private authCtrl: AuthService,
    private navCtrl: NavController,
    private globalOperation: GlobalOperationsService,
  
  ) {}

  ngOnInit(){
    if (!this.authCtrl.logIn){
      this.navCtrl.navigateRoot('login');
    
      this.globalOperation.showToast('Recuerda iniciar sesion...');
    }else{
      this.user= this.authCtrl.user;


  
    }
  }









}
