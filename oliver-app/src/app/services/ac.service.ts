import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AccionCausaConsecuencia } from "../interfaces/interfaces";
import { NPCDialogService } from './npcdialog.service';

@Injectable({
  providedIn: "root",
})
export class ACService {
  data: any;
  constructor(private firestore: AngularFirestore,
    private DialogSvc:NPCDialogService) {}

  async getDataAll(collection: string) {
    try {
      var res = [];
      await this.firestore.firestore
        .collection(collection)
        .onSnapshot((querySnap) => {
          querySnap.forEach((doc) => {
            console.log("Data", doc.data());
            res.push(doc.data());
          });
        });
      console.log("REs", res);
      return res;
    } catch (error) {}
  }

  getByID(colleccion: string, id: any) {
    var data: any;
    this.firestore
      .doc(colleccion + "/" + id)
      .valueChanges()
      .subscribe((data) => {
        this.data = data;
      });
    data = this.data;
    this.data = "";
    console.log("DATA", data);
    return data;
  }

  async deleteAC(id: any) {
    try {
   
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("accionCausa.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete()
          
            ///TODO DELETE DIALOG PLUS - traerlo del service de dialog 
          });
        });
      await this.firestore.firestore
        .collection("DialogsNPC")
        .where("accionConsecuencia.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {

            ///TODO UPDATE DIALOG PLUS - traerlo del service de dialog 
            doc.ref.update({
              accionConsecuencia: "Ninguno",
            });
          });
        });

      await this.firestore
        .collection("accionCausaConsecuencias")
        .doc(id)
        .delete();
    } catch (error) {}
  }

  async createAC(data: AccionCausaConsecuencia) {
    try {
     await this.firestore
        .collection("accionCausaConsecuencias")
        .add(data)
        .then((res) => {
          console.log("accionCausaConsecuencias", res.id);

          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async updateAC(id: any, data: AccionCausaConsecuencia) {
    try {
      return await this.firestore
        .collection("accionCausaConsecuencias")
        .doc(id)
        .update(data)
        .then((res) => {
          console.log("updated accionCausaConsecuencias", res);

         this.firestore.firestore
            .collection("DialogsNPC")
            .where("accionCausa.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  accionCausa: data,
                });
              });
            });
          this.firestore.firestore
            .collection("DialogsNPC")
            .where("accionConsecuencia.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  accionConsecuencia: data,
                });
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /////////////////////////// CUSTOM //////////////////////////////////////
}
