import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { Difficulty, User } from '../../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { Category, Quest } from "src/app/interfaces/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { CRUDfirebaseService } from "src/app/services/crudfirebase.service";
import { LocalService } from 'src/app/services/local.service';
import { GlobalOperationsService } from 'src/app/utils/global-operations.service';

@Component({
  selector: "app-add-quest",
  templateUrl: "./add-quest.page.html",
  styleUrls: ["./add-quest.page.scss"],
})
export class AddQuestPage implements OnInit {
  titulo="Agregar Pregunta:"
  quest: Quest ={
    uid:"",
    category:"",
    difficulty:"",
    question:"",
      ansOptionsA:"",
      ansOptionsB:"",
      ansOptionsC:"",
      ansOptionsD:"",
      answer:""
  };

 user: User;
  categorys:Observable<Category[]>;
  difficultys:Observable<Difficulty[]>;
  options = [
    { val: "A" },
    { val: "B" },
    { val: "C" },
    { val: "D" },
  ];

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private dataSvc: CRUDfirebaseService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService
  ) {}

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    }else{
      this.user= this.authCtrl.user;
      this.quest.uid= this.user.uid;
      this.getCategorys();
      this.getDifficulty();
    }
  }

getDifficulty(){
  this.difficultys = this.localSvc.getDifficulty();
  console.log(this.difficultys)
}
  getCategorys(){
    this.categorys = this.localSvc.getCategorys();
    console.log(this.categorys);
  }


  salir(){
    this.authCtrl.signOut();
  }
  async createQuest(quest: Quest) {
    this.quest.uid= this.user.uid;
    console.log("post to create", quest);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        this.dataSvc.createData("quest", quest);
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      (await loader).dismiss();
      // redirect to home page
      this.navCtrl.navigateRoot("/quest-pages");
    }
  }

  formValidation() {


    var comprobar = this.quest.uid;
    if(comprobar=="" || comprobar==null){
      this.globalOperation.showToast("Ingresa Sesion, error de login")
      return false;
    }
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

    var comprobar = this.quest.difficulty;
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
