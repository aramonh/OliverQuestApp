import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import {
  LoadingController,
  NavController,
  NavParams,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import {
  AccionCausaConsecuencia,
  NPCNormalDialog,
} from "src/app/interfaces/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { CRUDfirebaseService } from "src/app/services/crudfirebase.service";
import { LocalService } from "src/app/services/local.service";
import { NPCDialogService } from "src/app/services/npcdialog.service";
import { GlobalOperationsService } from "src/app/utils/global-operations.service";

@Component({
  selector: "app-popover-dialog-npcedit",
  templateUrl: "./popover-dialog-npcedit.component.html",
  styleUrls: ["./popover-dialog-npcedit.component.scss"],
})
export class PopoverDialogNPCEditComponent implements OnInit {
  NPCNormalDialog: NPCNormalDialog = {
    numInteraction: 0,
    npc: null,

    questSorprise: "false",
    questSorpriseAnsGood: null,
    questSorpriseAnsBad: null,

    numPages: 1,
    contenidoPages: [],

    accionCausa: null,
    accionConsecuencia: "Ninguno",

    boolPlus: "false",
    idOriginal: null,
  };
  OldAccionCausa: AccionCausaConsecuencia;
  OldaccionConsecuencia: AccionCausaConsecuencia;
  thisIsPlus = false;
  id: any;
  ACsCausa: AccionCausaConsecuencia[] = [];
  ACsConsecuencia: AccionCausaConsecuencia[] = [];
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authCtrl: AuthService,
    private DialogNPCSvc: NPCDialogService,
    private localSvc: LocalService,
    private globalOperation: GlobalOperationsService,
    private popoverCtrl: PopoverController,
    private actRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    public navParams: NavParams
  ) {
    console.log(this.navParams.data);
    let id = this.navParams.get("id");
    if (id) {
      this.id = id;
    }
    let npc = this.navParams.get("npc");

    if (npc) {
      this.NPCNormalDialog.npc = npc;
    }
    let idPlus = this.navParams.get("idPlus");
    if (idPlus) {
      this.id = idPlus;

      this.thisIsPlus = true;
    }
  }

  ngOnInit() {
    if (!this.authCtrl.logIn) {
      this.navCtrl.navigateRoot("login");
      this.globalOperation.showToast("Recuerda iniciar sesion...");
    } else {
      this.getNPCDialogById(this.id);
    }
  }

  async getNPCDialogById(id: string) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: "Please Wait...",
    });
    (await loader).present();

    try {
      console.log("ID PARA BUSCAR", id);

      this.firestore
        .doc("DialogsNPC/" + id)
        .valueChanges()
        .subscribe((data) => {
          this.NPCNormalDialog.numInteraction = data["numInteraction"];
          this.NPCNormalDialog.questSorprise = data["questSorprise"];
          this.NPCNormalDialog.questSorpriseAnsGood =
            data["questSorpriseAnsGood"];
          this.NPCNormalDialog.questSorpriseAnsBad =
            data["questSorpriseAnsBad"];
          this.NPCNormalDialog.numPages = data["numPages"];
          this.NPCNormalDialog.accionCausa = data["accionCausa"];
          this.OldAccionCausa = data["accionCausa"];
          this.NPCNormalDialog.accionConsecuencia = data["accionConsecuencia"];
          this.OldaccionConsecuencia = data["accionConsecuencia"];

          this.NPCNormalDialog.npc = data["npc"];
          this.NPCNormalDialog.idOriginal = data["idOriginal"];
          this.NPCNormalDialog.boolPlus = data["boolPlus"];
          for (let index = 0; index < data["contenidoPages"].length; index++) {
            const element = data["contenidoPages"][index];
            this.NPCNormalDialog.contenidoPages.push(element);
          }

          this.getAC(
            this.NPCNormalDialog.npc,
            this.NPCNormalDialog.accionConsecuencia,
            this.NPCNormalDialog.accionCausa
          );
        });

      if (this.NPCNormalDialog == undefined || this.NPCNormalDialog == null) {
        this.globalOperation.showToast("Select NPCNormalDialog Again");
        await this.popoverCtrl.dismiss();
      }
    } catch (er) {
      this.globalOperation.showToast(er);
      await this.popoverCtrl.dismiss();
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async updateData(data: NPCNormalDialog) {
    console.log("post to create", data);
    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: "Please Wait...",
      });
      (await loader).present();

      try {
        // this.dataSvc.updateDialog("DialogsNPC", this.id, data, this.OldAccionCausa, this.OldaccionConsecuencia);
        await this.DialogNPCSvc.updateDialog(
          this.id,
          data,
          this.OldAccionCausa,
          this.OldaccionConsecuencia
        );
      } catch (er) {
        this.globalOperation.showToast(er);
      }
      // dismiss loader
      (await loader).dismiss();
      // redirect to home page
      await this.popoverCtrl.dismiss();
    }
  }

  async getAC(npc, accionConsecuencia, accionCausa) {
    try {
      var cant1;
      var cant2;

      await this.firestore.firestore
        .collection("accionCausaConsecuencias")
        .onSnapshot((querysnap) => {
          var ACs1: AccionCausaConsecuencia[] = [];
          var ACs2: AccionCausaConsecuencia[] = [];
          querysnap.forEach(async (doc) => {
            console.log("GUET CATEGORY");

            var AC;
            AC = doc.data();
            AC.id = doc.id;

            if (AC.boolConvCausa == "false") {
              if (npc.id == AC.npcCausa.id) {
                await this.firestore.firestore
                  .collection("DialogsNPC")
                  .where("npc.id", "==", npc.id)
                  .where("accionConsecuencia.id", "==", AC.id)
                  .get()
                  .then(function (querySnapshot) {
                    cant1 = querySnapshot.size;
                    if (cant1 == 0) {
                      ACs1.push(AC);
                    }
                  });
              }
            }
            if (AC.id == accionConsecuencia.id) {
              ACs1.push(AC);
            }

            if (
              npc.id == AC.npcConsecuencia.id ||
              AC.npcConsecuencia == "Todos"
            ) {
              await this.firestore.firestore
                .collection("DialogsNPC")
                .where("npc.id", "==", npc.id)
                .where("accionCausa.id", "==", AC.id)
                .get()
                .then(function (querySnapshot) {
                  cant2 = querySnapshot.size;
                  if (cant2 == 0) {
                    ACs2.push(AC);
                  }
                });
            }
            if (AC.id == accionCausa.id) {
              ACs2.push(AC);
            }
          });
          console.log("TAMAÑO", querysnap.size);
          console.log("FIN CAT", ACs1, ACs2);
          this.ACsCausa = ACs2;
          this.ACsConsecuencia = ACs1;
        });
    } catch (error) {
      console.log(error);
    }
  }

  removeItemFromArr(arr, i) {
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }
  formValidation() {
    if (this.NPCNormalDialog.questSorprise == "false") {
      this.NPCNormalDialog.questSorpriseAnsGood = null;
      this.NPCNormalDialog.questSorpriseAnsBad = null;
    } else {
      if (
        this.NPCNormalDialog.questSorpriseAnsBad == null ||
        this.NPCNormalDialog.questSorpriseAnsBad == "" ||
        this.NPCNormalDialog.questSorpriseAnsGood == null ||
        this.NPCNormalDialog.questSorpriseAnsGood == ""
      ) {
        this.globalOperation.showToast("Ingresa Answers de Quests");
        return false;
      }
    }

    for (
      let index = this.NPCNormalDialog.contenidoPages.length;
      this.NPCNormalDialog.numPages < index;
      index--
    ) {
      const element = index - 1;
      this.removeItemFromArr(this.NPCNormalDialog.contenidoPages, element);
    }

    for (let index = 0; index < this.NPCNormalDialog.numPages; index++) {
      const element = this.NPCNormalDialog.contenidoPages[index];

      if (element == "" || element == null || element == undefined) {
        this.globalOperation.showToast(
          "Ingresa contenido " + (index + 1).toString()
        );
        return false;
      }
    }

    for (const key in this.NPCNormalDialog) {
      const element = this.NPCNormalDialog[key];

      if (element == "" || element == []) {
        this.globalOperation.showToast("Ingresa " + key);
        return false;
      }
    }

    if (this.thisIsPlus) {
      if (this.NPCNormalDialog.accionCausa == null) {
        this.globalOperation.showToast("Ingresa accionCausa");
        return false;
      }
    }

    return true;
  }
}
