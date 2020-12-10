import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Sabio } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SabiosService {
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

  async deleteSabio(id: any) {
    try {
      await this.firestore.firestore
        .collection("DialogsSabio")
        .where("sabio.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });

      await this.firestore.firestore
        .collection("DialogSabio")
        .where("accionCausa.npcConsecuencia.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });

      await this.firestore.firestore
        .collection("DialogsSabio")
        .where("accionConsecuencia.npcCausa.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });

      await this.firestore.firestore
        .collection("DialogsSabio")
        .where("accionCausa.npcCausa.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });

      await this.firestore.firestore
        .collection("DialogsSabio")
        .where("accionConsecuencia.npcConsecuencia.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
      await this.firestore.firestore
        .collection("accionCausaConsecuencias")
        .where("npcCausa.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
      await this.firestore.firestore
        .collection("accionCausaConsecuencias")
        .where("npcConsecuencia.id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });

      await this.firestore.collection("Sabios").doc(id).delete();
    } catch (error) {}
  }

  async createSabio(data: Sabio) {
    try {
      await this.firestore
        .collection("Sabios")
        .add(data)
        .then((res) => {
          console.log("Sabio", res.id);

          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async updateSabio(id: any, data: Sabio) {
    try {
      return await this.firestore
        .collection("Sabios")
        .doc(id)
        .update(data)
        .then((res) => {
          console.log("updated Sabio", res);

          this.firestore.firestore
            .collection("DialogsSabio")
            .where("sabio.id", "==", id)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  sabio: {
                    id: id,
                    name: data.name,
                    town: data.town,
                  },
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
                  npcCausa: {
                    id: id,
                    tipo: "Sabio",
                    name: data.name,
                  },
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
                    id: id,
                    tipo: "Sabio",
                    name: data.name,
                  },
                });
              });
            });

          this.firestore.firestore
            .collection("DialogsSabio")

            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                if (doc.data()["accionCausa"] != null) {
                  if (
                    doc.data()["accionCausa"]["npcConsecuencia"]["id"] == id
                  ) {
                    doc.ref.update({
                      accionCausa: {
                        id: doc.data()["accionCausa"]["id"],
                        name: doc.data()["accionCausa"]["name"],
                        boolConvCausa: doc.data()["accionCausa"][
                          "boolConvCausa"
                        ],
                        npcCausa: doc.data()["accionCausa"]["npcCausa"],
                        boolConvConsecuencia: doc.data()["accionCausa"][
                          "boolConvConsecuencia"
                        ],
                        description: doc.data()["accionCausa"]["description"],
                        npcConsecuencia: {
                          id: id,
                          tipo: "Sabio",
                          name: data.name,
                        },
                      },
                    });
                  }
                }
              });
            });
          this.firestore.firestore
            .collection("DialogsSabio")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                if (doc.data()["accionConsecuencia"] != "Ninguno") {
                  if (
                    doc.data()["accionConsecuencia"]["npcConsecuencia"]["id"] ==
                    id
                  ) {
                    doc.ref.update({
                      accionConsecuencia: {
                        id: doc.data()["accionConsecuencia"]["id"],
                        name: doc.data()["accionConsecuencia"]["name"],
                        boolConvCausa: doc.data()["accionConsecuencia"][
                          "boolConvCausa"
                        ],
                        npcCausa: doc.data()["accionConsecuencia"]["npcCausa"],
                        boolConvConsecuencia: doc.data()["accionConsecuencia"][
                          "boolConvConsecuencia"
                        ],
                        description: doc.data()["accionConsecuencia"][
                          "description"
                        ],
                        npcConsecuencia: {
                          id: id,
                          tipo: "Sabio",
                          name: data.name,
                        },
                      },
                    });
                  }
                }
              });
            });
          this.firestore.firestore
            .collection("DialogsSabio")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                if (doc.data()["accionCausa"] != null) {
                  if (doc.data()["accionCausa"]["npcCausa"]["id"] == id) {
                    doc.ref.update({
                      accionCausa: {
                        id: doc.data()["accionCausa"]["id"],
                        name: doc.data()["accionCausa"]["name"],
                        boolConvCausa: doc.data()["accionCausa"][
                          "boolConvCausa"
                        ],
                        npcConsecuencia: doc.data()["accionCausa"][
                          "npcConsecuencia"
                        ],
                        boolConvConsecuencia: doc.data()["accionCausa"][
                          "boolConvConsecuencia"
                        ],
                        description: doc.data()["accionCausa"]["description"],
                        npcCausa: {
                          id: id,
                          tipo: "Sabio",
                          name: data.name,
                        },
                      },
                    });
                  }
                }
              });
            });
          this.firestore.firestore
            .collection("DialogsSabio")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                if (doc.data()["accionConsecuencia"] != "Ninguno") {
                  if (
                    doc.data()["accionConsecuencia"]["npcCausa"]["id"] == id
                  ) {
                    doc.ref.update({
                      accionConsecuencia: {
                        id: doc.data()["accionConsecuencia"]["id"],
                        name: doc.data()["accionConsecuencia"]["name"],
                        boolConvCausa: doc.data()["accionConsecuencia"][
                          "boolConvCausa"
                        ],
                        npcConsecuencia: doc.data()["accionConsecuencia"][
                          "npcConsecuencia"
                        ],
                        boolConvConsecuencia: doc.data()["accionConsecuencia"][
                          "boolConvConsecuencia"
                        ],
                        description: doc.data()["accionConsecuencia"][
                          "description"
                        ],
                        npcCausa: {
                          id: id,
                          tipo: "Sabio",
                          name: data.name,
                        },
                      },
                    });
                  }
                }
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
