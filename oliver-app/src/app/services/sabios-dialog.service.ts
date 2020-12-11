import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AccionCausaConsecuencia, NPCSabioDialogAnswer } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SabiosDialogService {
  data: any;
  constructor(private firestore: AngularFirestore) {}

  async deleteDialog(dialog: NPCSabioDialogAnswer) {
    var cantidad1;
    var cantidad2;
    if (dialog.accionCausa != null) {
      await this.firestore.firestore
        .collection("DialogsSabio")
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
        .collection("DialogsSabio")
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

    if (dialog.idPrev != null ) {
      if (dialog.tipo == "BadAnswer") {
    await   this.firestore.firestore
        .collection("DialogsSabio")
        .doc(dialog.idPrev)
        .get()
        .then(function (doc) {
          doc.ref.update({
            idProvErronea:null,
          });
        });
      }
      if (dialog.tipo == "GoodAnswer") {
     await   this.firestore.firestore
         .collection("DialogsSabio")
         .doc(dialog.idPrev)
         .get()
         .then(function (doc) {
           doc.ref.update({
            idProvCorrecta:null ,
           });
         });
       }
    }


    if (dialog.boolPlus == 'true'  ||  dialog.boolPlus == true ) {
      await this.firestore.firestore
      .collection("DialogsSabio")
      .where("idOriginal", "==", dialog.id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(doc=>{
          doc.ref.delete();
        })
      });
    }
    await this.firestore.collection("DialogsSabio").doc(dialog.id).delete();
  }

  async createDialog(data: NPCSabioDialogAnswer) {
    try {
      await this.firestore
        .collection("DialogsSabio")
        .add(data)
        .then((res) => {
          console.log("created", res.id );

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
          if (data.idPrev != null ) {
          if (data.tipo == "BadAnswer") {
           this.firestore.firestore
            .collection("DialogsSabio")
            .doc(data.idPrev)
            .get()
            .then(function (doc) {
              doc.ref.update({
                idProvErronea:res.id ,
              });
            });
          }
          if (data.tipo == "GoodAnswer") {
            this.firestore.firestore
             .collection("DialogsSabio")
             .doc(data.idPrev)
             .get()
             .then(function (doc) {
               doc.ref.update({
                idProvCorrecta:res.id ,
               });
             });
           }
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
    dialog: NPCSabioDialogAnswer,
    OldAccionCausa: any,
    OldAccionConse: any
  ) {
    console.log("OLD", OldAccionCausa, OldAccionConse);
    var cantidad;
    await this.firestore
      .collection("DialogsSabio")
      .doc(id)
      .update(dialog)
      .then((data) => {
        console.log("updated", data);
        //Actualiza el AC viejo a FALSE
      })
      .catch((err) => {
        console.log(err);
      });

      if(dialog.boolPlus=='true'){
        await this.firestore.firestore
        .collection("DialogsSabio")
        .where("sabio.id", "==", dialog.sabio.id)
        .where("tipo", "==", dialog.tipo)

        .where("idOriginal", "==", id)
        .get()
        .then(function (querySnapshot) {
         
          querySnapshot.forEach(doc=>{
            doc.ref.update({
              numCorrectas:dialog.numCorrectas,
              numErroneas:dialog.numErroneas
            })
          })
       
        });
      }

    if (dialog.accionCausa != null) {
      await this.firestore.firestore
        .collection("DialogsSabio")
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
          await this.firestore
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
          await this.firestore
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
          await this.firestore
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
      if (OldAccionConse != "Ninguno") {
        var mew1: AccionCausaConsecuencia;
        mew1 = OldAccionConse;
        mew1.boolConvCausa = "false";
        await this.firestore
          .collection("accionCausaConsecuencias")
          .doc(mew1.id)
          .update(mew1)
          .then((data) => {
            console.log("updated", data);
          });
      }
    }
    if (dialog.accionConsecuencia != "Ninguno") {
      var mew: AccionCausaConsecuencia;
      mew = dialog.accionConsecuencia;
      mew.boolConvCausa = "true";

      await this.firestore
        .collection("accionCausaConsecuencias")
        .doc(mew.id)
        .update(mew)
        .then((data) => {
          console.log("updated", data);
        });
    }
  }

  async deleteDialogPlus(dialog: NPCSabioDialogAnswer) {
    var cantidad1;
    var cantidad2;
    var cantDial;

    if (dialog.idOriginal != null) {
    await this.firestore.firestore
      .collection("DialogsSabio")
      .where("idOriginal", "==", dialog.idOriginal)
      .get()
      .then(function (querySnapshot) {
        cantDial = querySnapshot.size;
      });

    if (cantDial <= 1) {
      await this.firestore.firestore
        .collection("DialogsSabio")
        .doc(dialog.idOriginal)
        .get()
        .then(function (doc) {
          doc.ref.update({
            boolPlus: "false",
          });
        });
    }
  }
    if (dialog.accionCausa != null) {
      await this.firestore.firestore
        .collection("DialogsSabio")
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
        .collection("DialogsSabio")
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
    if (dialog.idPrev != null ) {
      if (dialog.tipo == "BadAnswer") {
       this.firestore.firestore
        .collection("DialogsSabio")
        .doc(dialog.idPrev)
        .get()
        .then(function (doc) {
          doc.ref.update({
            idProvErronea:null ,
          });
        });
      }
      if (dialog.tipo == "GoodAnswer") {
        this.firestore.firestore
         .collection("DialogsSabio")
         .doc(dialog.idPrev)
         .get()
         .then(function (doc) {
           doc.ref.update({
            idProvCorrecta:null ,
           });
         });
       }
    }

    await this.firestore.collection("DialogsSabio").doc(dialog.id).delete();
  }

  async createDialogPlus(dialog: NPCSabioDialogAnswer) {
    try {
      await this.firestore
        .collection("DialogsSabio")
        .add(dialog)
        .then((res) => {
          console.log("created", res.id);
          if (dialog.idPrev != null ) {
            if (dialog.tipo == "BadAnswer") {
             this.firestore.firestore
              .collection("DialogsSabio")
              .doc(dialog.idPrev)
              .get()
              .then(function (doc) {
                doc.ref.update({
                  idProvErronea:res.id ,
                });
              });
            }
            if (dialog.tipo == "GoodAnswer") {
              this.firestore.firestore
               .collection("DialogsSabio")
               .doc(dialog.idPrev)
               .get()
               .then(function (doc) {
                 doc.ref.update({
                  idProvCorrecta:res.id ,
                 });
               });
             }
          }

          this.firestore.firestore
            .collection("DialogsSabio")
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
