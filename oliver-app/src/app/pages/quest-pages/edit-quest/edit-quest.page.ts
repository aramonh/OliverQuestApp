import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Category, Difficulty, Quest, User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: 'app-edit-quest',
  templateUrl: './edit-quest.page.html',
  styleUrls: ['./edit-quest.page.scss'],
})
export class EditQuestPage implements OnInit{
  titulo="Editar Pregunta:"
  quest: Quest ={
    uid:"",
    difficulty:"",
    category:"",
    question:"",
      ansOptionsA:"",
      ansOptionsB:"",
      ansOptionsC:"",
      ansOptionsD:"",
      answer:""
  };
  id: any = "";
  categorys:Observable<Category[]>;
  difficultys:Observable<Difficulty[]>;
  options = [
    { val: "A" },
    { val: "B" },
    { val: "C" },
    { val: "D" },
  ];
  user: User
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private dataSvc: CRUDfirebaseService,
    private actRoute: ActivatedRoute,
    private localSvc: LocalService,
    private firestore: AngularFirestore,
    private globalOperation: GlobalOperationsService

  ) {

      // get id of home
      this.id = this.actRoute.snapshot.paramMap.get('id');

   
  }

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{

      this.user= this.authCtrl.user;
     
      this.getQuestById(this.id)
   //   this.getQuestById(this.id)
      this.getCategorys();
      this.getDifficulty();
    }
  }

getDifficulty(){
  this.difficultys = this.localSvc.getDifficulty();
  console.log(this.difficultys);
}

  getCategorys(){
    this.categorys = this.localSvc.getCategorys();
    console.log(this.categorys);
  }

  async getQuestById(id: string){
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    try {
      console.log("ID PARA BUSCAR",id)
      
     
      this.firestore.doc('quest/' + id )
      .valueChanges()
      .subscribe( data => {
        // tslint:disable-next-line: no-string-literal
        if(this.authCtrl.user.uid != data["uid"]){
          this.globalOperation.showToast("No tienes permisos para editar esta QUEST");
          this.navCtrl.navigateRoot("/quest-pages");
          return false;
        }
        this.quest.uid= data["uid"];
        this.quest.category= data["category"]
        this.quest.question = data["question"]
        this.quest.difficulty = data["difficulty"]
        this.quest.ansOptionsA = data["ansOptionsA"]
        this.quest.ansOptionsB = data["ansOptionsB"]
        this.quest.ansOptionsC = data["ansOptionsC"]
        this.quest.ansOptionsD = data["ansOptionsD"]
        this.quest.answer = data["answer"]
      });
   
  
  
      if(this.quest==undefined || this.quest==null){
        this.globalOperation.showToast("Select Quest Again");
        this.navCtrl.navigateRoot("/quest-pages");
      }
  } catch (er) {
    this.globalOperation.showToast(er);
    this.navCtrl.navigateRoot("/quest-pages");

  }
    // dismiss loader
    (await loader).dismiss();
}


  async updateQuest(quest: Quest) {
    console.log("post to create", quest);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.dataSvc.updateData("quest",this.id,quest);
        
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      (await loader).dismiss();
      // redirect to home page
      this.navCtrl.navigateRoot("/quest-pages");
    }
  }
  
  salir(){
    this.authCtrl.signOut();
  }

  formValidation() {

    var comprobar = this.quest.category;
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Categoria")
      return false;
    }

    comprobar = this.quest.question
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Pregunta")
      return false;
    }
    comprobar = this.quest.difficulty
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Dificultad")
      return false;
    }

     comprobar = this.quest.ansOptionsA
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Respuesta A")
      return false;
    }
     comprobar = this.quest.ansOptionsB;
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Respuesta B")
      return false;
    }
     comprobar = this.quest.ansOptionsC;
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Respuesta C")
      return false;
    }
     comprobar = this.quest.ansOptionsD;
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Respuesta D")
      return false;
    }
     comprobar = this.quest.answer;
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Selecciona la Respuesta Correcta")
      return false;
    }
 
    return true;
  }



}
