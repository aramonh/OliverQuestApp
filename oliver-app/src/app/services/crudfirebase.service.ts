import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { rejects } from "assert";
import { resolve } from "dns";
import { send } from "process";
import { error } from "protractor";
import { NPCNormalDialog, Quest } from "../interfaces/interfaces";
import { QuestPagesPage } from "../pages/quest-pages/quest-pages.page";

@Injectable({
  providedIn: "root",
})
export class CRUDfirebaseService {
  data: any;
  constructor(private firestore: AngularFirestore) {}

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

  async deleteData(colleccion: string, id: any) {
    await this.firestore.collection(colleccion).doc(id).delete();
  }

   createData(colleccion: string, data: any) {

      this.firestore
      .collection(colleccion)
      .add(data)
      .then((data) => {
        console.log("created", data.id);
  
        return data;
      })
      .catch((err) => {
        console.log(err);
      });

  }
   async deleteDialogPlus(colleccion: string, id: any , dataOriginal: NPCNormalDialog) {
    console.log("uppp", dataOriginal)
    dataOriginal.idPlus = null;
    await this.firestore
    .collection(colleccion)
    .doc(dataOriginal.id)
    .update(dataOriginal)
    .then((data) => {
      console.log("updated", data);
    })
    
     this.firestore.collection(colleccion).doc(id).delete();

     

   
      
    
  }

  createDialogPlus(colleccion: string, dataOriginal: any,dataNEW: any) {

    this.firestore
    .collection(colleccion)
    .add(dataNEW)
    .then((data) => {



      console.log("created", data.id);
      dataOriginal.idPlus = data.id
      this.firestore
      .collection(colleccion)
      .doc(dataOriginal.id)
      .update(dataOriginal)
      .then((data) => {
        console.log("updated", data);
      })
      return data;
    })
    .catch((err) => {
      console.log(err);
    });

}

  async updateData(colleccion: string, id: any, data: any) {
   return await this.firestore
      .collection(colleccion)
      .doc(id)
      .update(data)
      .then((data) => {
        console.log("updated", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
