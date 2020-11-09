import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { LoadingController, NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import { Category, Quest, User } from "src/app/interfaces/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { CRUDfirebaseService } from 'src/app/services/crudfirebase.service';
import { LocalService } from "src/app/services/local.service";
import { GlobalOperationsService } from "src/app/utils/global-operations.service";

@Component({
  selector: "app-tab-category",
  templateUrl: "./tab-category.page.html",
  styleUrls: ["./tab-category.page.scss"],
})
export class TabCategoryPage implements OnInit {
  user: User;
  titulo = "Quest Category";
  quests: Quest[] = [];
  totalQuest:number=0;
  totalQuestAlta=0;
  totalQuestIntermedia=0;
  totalQuestBasica=0;
  categorys: Observable<Category[]>;
  textoBuscar = "";
  stateBarState = false;
  categorySelected="videojuegos&Anime";
  constructor(
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private authCtrl: AuthService,
    private navCtrl: NavController,
    private globalOperation: GlobalOperationsService,
    private localSvc: LocalService,
    private dataSvc: CRUDfirebaseService
  ) {}

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");

      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
      this.user = this.authCtrl.user;
      this.getCategorys();
      this.getQuestsCategory();
      console.log(this.quests);
    }
  }

  onSearchChange(evento) {
    console.log(evento.detail.value);
    this.textoBuscar = evento.detail.value;
  }

  changeSearchBarState() {
    if (this.stateBarState) {
      this.stateBarState = false;
    } else {
      this.stateBarState = true;
    }
    this.textoBuscar="";
    console.log("searchbarState", this.stateBarState);
  }
  salir() {
    this.authCtrl.signOut();
  }

  getCategorys() {
    this.categorys = this.localSvc.getCategorys();
    console.log(this.categorys);
  }

  cambioCategoria(event) {
    console.log("cambio categoria", event.detail.value);
    this.categorySelected = event.detail.value;
    this.getQuestsCategory();
  }


  clickAll(){
    this.getQuestsCategory();
  }
  clickDificultad(dificultad){
    this.getQuestsCategoryWithDificultad(dificultad) ;
  }

  async getQuestsCategoryWithDificultad(dificultad) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {

      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
      .where("difficulty","==",dificultad)
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
    //   this.totalQuest = querysnap.size
      })

      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
      .onSnapshot(querysnap=>{
        this.totalQuest = querysnap.size
      })

      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
      .where("difficulty","==","Alta")
      .onSnapshot(querysnap=>{
       this.totalQuestAlta = querysnap.size
      })

      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
      .where("difficulty","==","Intermedia")
      .onSnapshot(querysnap=>{
       this.totalQuestIntermedia = querysnap.size
      })


      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
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


  async getQuestsCategory() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {

      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
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
      .where("category","==",this.categorySelected)
      .where("difficulty","==","Alta")
      .onSnapshot(querysnap=>{
       this.totalQuestAlta = querysnap.size
      })

      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
      .where("difficulty","==","Intermedia")
      .onSnapshot(querysnap=>{
       this.totalQuestIntermedia = querysnap.size
      })


      await this.firestore.firestore.collection("quest")
      .where("category","==",this.categorySelected)
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
