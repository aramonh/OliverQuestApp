import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController } from '@ionic/angular';
import { Quest, User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-tab-all',
  templateUrl: './tab-all.page.html',
  styleUrls: ['./tab-all.page.scss'],
})
export class TabAllPage implements OnInit {

  user:User;
  titulo="Quest All"
  quests:Quest[]=[];
  totalQuest=0;
  totalQuestAlta=0;
  totalQuestIntermedia=0;
  totalQuestBasica=0;
  textoBuscar= '';
  stateBarState=false;
  
    constructor(
      private loadingCtrl: LoadingController,
      private firestore: AngularFirestore,
      private authCtrl: AuthService,
      private navCtrl: NavController,
      private globalOperation: GlobalOperationsService
    ) {}
  
    ngOnInit(){
      if (!this.authCtrl.logIn){
        this.navCtrl.navigateRoot('login');
      
        this.globalOperation.showToast('Recuerda iniciar sesion...');
      }else{
        this.user= this.authCtrl.user;
        this.getQuests();
        console.log(this.quests)
      }
    }
  
    
  
    onSearchChange(evento){
      console.log(evento.detail.value);
      this.textoBuscar = evento.detail.value ;
    }
  
  
    changeSearchBarState(){
  
  
      if(this.stateBarState){
        this.stateBarState=false
      }else{
        this.stateBarState=true;
      }
      this.textoBuscar="";
      console.log("searchbarState", this.stateBarState)
    }
    salir(){
      this.authCtrl.signOut();
    }
  
    async getQuests() {
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please wait...',
      });
      (await loader).present();
      try {

        await this.firestore.firestore.collection("quest")
      .onSnapshot(querysnap=>{
        var quests:any[]=[];
        querysnap.forEach(doc=>{
          
          console.log("GUET CATEGORY",  )
          var quest;
          quest = doc.data();
          quest.id = doc.id;
          quests.push( quest )
        })
        console.log("TAMAÑO", querysnap.size)
        console.log("FIN CAT", quests)
       this.quests = quests;
       this.totalQuest = querysnap.size
      })

      await this.firestore.firestore.collection("quest")
      .where("difficulty","==","Alta")
      .onSnapshot(querysnap=>{
       this.totalQuestAlta = querysnap.size
      })

      await this.firestore.firestore.collection("quest")
      .where("difficulty","==","Intermedia")
      .onSnapshot(querysnap=>{
       this.totalQuestIntermedia = querysnap.size
      })


      await this.firestore.firestore.collection("quest")
      .where("difficulty","==","Basica")
      .onSnapshot(querysnap=>{
       this.totalQuestBasica = querysnap.size
      })


    
  
  
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      (await loader).dismiss();
    }
  
  
}
