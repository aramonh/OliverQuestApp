import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { LoadingController, NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import { Category, Quest } from "src/app/interfaces/interfaces";
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
  user: any;
  titulo = "Quest List";
  quests: Quest[] = [];
  categorys: Observable<Category[]>;
  textoBuscar = "";
  stateBarState = false;
  categoriaAct;
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
      this.getQuests();
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
    this.categoriaAct = event.detail.value;
    this.getQuests();
  }

  async getQuests() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please wait...",
    });
    (await loader).present();
    try {

  
     await this.firestore
        .collection("quest")
        .snapshotChanges()
        .subscribe((data) => {
          // console.log(data);
          console.log("map data", data);
          this.quests = data.map((e) => {

           
            return {
              id: e.payload.doc.id,
              uid: e.payload.doc.data()["uid"],
              // tslint:disable-next-line: no-string-literal
              category: e.payload.doc.data()["category"],
              // tslint:disable-next-line: no-string-literal
              difficulty: e.payload.doc.data()["difficulty"],
              question: e.payload.doc.data()["question"],
              ansOptionsA: e.payload.doc.data()["ansOptionsA"],
              ansOptionsB: e.payload.doc.data()["ansOptionsB"],
              ansOptionsC: e.payload.doc.data()["ansOptionsC"],
              ansOptionsD: e.payload.doc.data()["ansOptionsD"],
              answer: e.payload.doc.data()["answer"],
            };
          
          });
        });
    } catch (er) {
      this.globalOperation.showToast(er);
    }
    // dismiss loader
    (await loader).dismiss();
  }
}
