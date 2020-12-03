import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { DomSanitizer } from "@angular/platform-browser";
import {
  AccionCausaConsecuencia,
  NPCNormalDialog,
} from "../interfaces/interfaces";

@Injectable({
  providedIn: "root",
})
export class NPCDialogService {
  data: any;
  constructor(private firestore: AngularFirestore) {}

  async deleteDialog(dialog: NPCNormalDialog) {
    var cantidad1;
    var cantidad2;
    if (dialog.accionCausa != null) {
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("accionCausa.id", "==", dialog.accionCausa.id)
        .get()
        .then(function (querySnapshot) {
          cantidad1 = querySnapshot.size;
        });
      if (cantidad1 <= 1) {
        var mew: AccionCausaConsecuencia;
        mew = dialog.accionCausa;
        mew.boolConvConsecuencia = "false";
        this.firestore
          .collection("accionCausaConsecuencias")
          .doc(mew.id)
          .update(mew)
          .then((data) => {
            console.log("updated", data);
          });
      }
    }
    if (dialog.accionConsecuencia != "Ninguno") {
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("accionConsecuencia.id", "==", dialog.accionConsecuencia.id)
        .get()
        .then(function (querySnapshot) {
          cantidad2 = querySnapshot.size;
        });

      if (cantidad2 <= 1) {
        var mew: AccionCausaConsecuencia;
        mew = dialog.accionConsecuencia;
        mew.boolConvCausa = "false";
        await this.firestore
          .collection("accionCausaConsecuencias")
          .doc(mew.id)
          .update(mew)
          .then((data) => {
            console.log("updated", data);
          });
      }
    }

    await this.firestore.collection("DialogsNPC").doc(dialog.id).delete();
  }

  async createDialog(data: NPCNormalDialog) {
    try {
      await this.firestore
        .collection("DialogsNPC")
        .add(data)
        .then((res) => {
          console.log("created", res.id);

          if (data.accionConsecuencia != "Ninguno") {
            var mew: AccionCausaConsecuencia;
            mew = data.accionConsecuencia;
            mew.boolConvCausa = "true";

            this.firestore
              .collection("accionCausaConsecuencias")
              .doc(mew.id)
              .update(mew)
              .then((data) => {
                console.log("updated", data);
              });
          }

          return data;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  }

  async updateDialog(
    id: any,
    dialog: NPCNormalDialog,
    OldAccionCausa: AccionCausaConsecuencia,
    OldAccionConse: AccionCausaConsecuencia
  ) {
    console.log("OLD",OldAccionCausa,OldAccionConse)
    var cantidad;
    return await this.firestore
      .collection("DialogsNPC")
      .doc(id)
      .update(dialog)
      .then( async (data) => {
        console.log("updated", data);
        //Actualiza el AC viejo a FALSE


        if(dialog.accionCausa!=null){
       await this.firestore.firestore
          .collection("DialogsNPC")
          .where("accionCausa.id", "==", OldAccionCausa.id)
          .get()
          .then(function (querySnapshot) {
            cantidad = querySnapshot.size;
          });

        if (OldAccionCausa.id != dialog.accionCausa.id) {
          if (cantidad > 1) {
            var mew: AccionCausaConsecuencia;
            mew = dialog.accionCausa;
            mew.boolConvConsecuencia = "true";
            this.firestore
              .collection("accionCausaConsecuencias")
              .doc(mew.id)
              .update(mew)
              .then((data) => {
                console.log("updated", data);
              });
          } else {
            //Solo tenia 1 o menos
            var mew1: AccionCausaConsecuencia;
            mew1 = OldAccionCausa;
            mew1.boolConvConsecuencia = "false";
            this.firestore
              .collection("accionCausaConsecuencias")
              .doc(mew1.id)
              .update(mew1)
              .then((data) => {
                console.log("updated", data);
                //Actualiza el AC nuevo a TRUE
              });

            var mew: AccionCausaConsecuencia;
            mew = dialog.accionCausa;
            mew.boolConvConsecuencia = "true";
        this.firestore
              .collection("accionCausaConsecuencias")
              .doc(mew.id)
              .update(mew)
              .then((data) => {
                console.log("updated", data);
              });
          }
        }
      }



        if (OldAccionConse.id != dialog.accionConsecuencia.id) {
          var mew1: AccionCausaConsecuencia;
          mew1 = OldAccionConse;
          mew1.boolConvCausa = "false";
           this.firestore
            .collection("accionCausaConsecuencias")
            .doc(mew1.id)
            .update(mew1)
            .then((data) => {
              console.log("updated", data);
            });

          if (dialog.accionConsecuencia != "Ninguno") {
            var mew: AccionCausaConsecuencia;
            mew = dialog.accionConsecuencia;
            mew.boolConvCausa = "true";

             this.firestore
              .collection("accionCausaConsecuencias")
              .doc(mew.id)
              .update(mew)
              .then((data) => {
                console.log("updated", data);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteDialogPlus(dialog: NPCNormalDialog) {
    var cantidad1;
    var cantidad2;
    var cantDial;
    await this.firestore.firestore
      .collection("DialogsNPC")
      .where("idOriginal", "==", dialog.idOriginal)
      .get()
      .then(function (querySnapshot) {
        cantDial = querySnapshot.size;
      });

    if (cantDial <= 1) {
      await this.firestore.firestore
        .collection("DialogsNPC")
        .doc(dialog.idOriginal)
        .get()
        .then(function (doc) {
          doc.ref.update({
            boolPlus: "false",
          });
        });
    }

    if (dialog.accionCausa != null) {
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("accionCausa.id", "==", dialog.accionCausa.id)
        .get()
        .then(function (querySnapshot) {
          cantidad1 = querySnapshot.size;
        });
      if (cantidad1 <= 1) {
        var mew: AccionCausaConsecuencia;
        mew = dialog.accionCausa;
        mew.boolConvConsecuencia = "false";
        await this.firestore
          .collection("accionCausaConsecuencias")
          .doc(mew.id)
          .update(mew)
          .then((data) => {
            console.log("updated", data);
          });
      }
    }
    if (dialog.accionConsecuencia != "Ninguno") {
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("accionConsecuencia.id", "==", dialog.accionConsecuencia.id)
        .get()
        .then(function (querySnapshot) {
          cantidad2 = querySnapshot.size;
        });

      if (cantidad2 <= 1) {
        var mew: AccionCausaConsecuencia;
        mew = dialog.accionConsecuencia;
        mew.boolConvCausa = "false";
        await this.firestore
          .collection("accionCausaConsecuencias")
          .doc(mew.id)
          .update(mew)
          .then((data) => {
            console.log("updated", data);
          });
      }
    }

    await this.firestore.collection("DialogsNPC").doc(dialog.id).delete();
  }

  async createDialogPlus(dialog: NPCNormalDialog) {
    try {
      await this.firestore
        .collection("DialogsNPC")
        .add(dialog)
        .then((res) => {
          console.log("created", res.id);

          this.firestore.firestore
            .collection("DialogsNPC")
            .doc(dialog.idOriginal)
            .get()
            .then(function (doc) {
              doc.ref.update({
                boolPlus: "true",
              });
            });

          if (dialog.accionConsecuencia != "Ninguno") {
            var mew: AccionCausaConsecuencia;
            mew = dialog.accionConsecuencia;
            mew.boolConvCausa = "true";

            this.firestore
              .collection("accionCausaConsecuencias")
              .doc(mew.id)
              .update(mew)
              .then((data) => {
                console.log("updated", data);
              });
          }

          var mew1: AccionCausaConsecuencia;
          mew1 = dialog.accionCausa;
          mew1.boolConvConsecuencia = "true";

          this.firestore
            .collection("accionCausaConsecuencias")
            .doc(mew1.id)
            .update(mew1)
            .then((data) => {
              console.log("updated", data);
            });

          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  }
}
