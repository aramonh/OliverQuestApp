import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NPC } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NPCService {

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

  async deleteNPC(id: any) {
    try {
   await   this.firestore.firestore
      .collection("DialogsNPC")
      .where("npc.id", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });

      await   this.firestore.firestore
      .collection("DialogsNPC")
      .where("accionCausa.npcConsecuencia.id", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });

      await   this.firestore.firestore
      .collection("DialogsNPC")
      .where("accionConsecuencia.npcCausa.id", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });


      await   this.firestore.firestore
      .collection("DialogsNPC")
      .where("accionCausa.npcCausa.id", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });

      await   this.firestore.firestore
      .collection("DialogsNPC")
      .where("accionConsecuencia.npcConsecuencia.id", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
  await  this.firestore.firestore
      .collection("accionCausaConsecuencias")
      .where("npcCausa.id", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
    await  this.firestore.firestore
      .collection("accionCausaConsecuencias")
      .where("npcConsecuencia.id", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });

      await this.firestore
        .collection("NPC")
        .doc(id)
        .delete();
    } catch (error) {}
  }

  async createNPC(data: NPC) {
    try {
    await  this.firestore
        .collection("NPC")
        .add(data)
        .then((res) => {
          console.log("NPC", res.id);

          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async updateNPC(id: any, data: NPC) {
    try {
      return await this.firestore
        .collection("NPC")
        .doc(id)
        .update(data)
        .then((res) => {
          console.log("updated NPC", res);

          this.firestore.firestore
            .collection("DialogsNPC")
            .where("npc.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  npc: data,
                });
              });
            });
          this.firestore.firestore
            .collection("accionCausaConsecuencias")
            .where("npcCausa.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  npcCausa:{
                    id:id,
                    tipo:"NPC",
                    name:data.name
                  }
                });
              });
            });
            this.firestore.firestore
            .collection("accionCausaConsecuencias")
            .where("npcConsecuencia.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  npcConsecuencia: {
                    id:id,
                    tipo:"NPC",
                    name:data.name
                  }
                });
              });
            });

            this.firestore.firestore
            .collection("DialogsNPC")
            .where("accionCausa.npcConsecuencia.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  npcConsecuencia: {
                    id:id,
                    tipo:"NPC",
                    name:data.name
                  }
                });
              });
            });
            this.firestore.firestore
            .collection("DialogsNPC")
            .where("accionConsecuencia.npcConsecuencia.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  npcConsecuencia: {
                    id:id,
                    tipo:"NPC",
                    name:data.name
                  }
                });
              });
            });
            this.firestore.firestore
            .collection("DialogsNPC")
            .where("accionCausa.npcCausa.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  npcCausa: {
                    id:id,
                    tipo:"NPC",
                    name:data.name
                  }
                });
              });
            });
            this.firestore.firestore
            .collection("DialogsNPC")
            .where("accionConsecuencia.npcCausa.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  npcCausa: {
                    id:id,
                    tipo:"NPC",
                    name:data.name
                  }
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
}
