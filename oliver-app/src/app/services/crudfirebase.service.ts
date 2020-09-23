import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { error } from 'protractor';
import { Quest } from '../interfaces/interfaces';
import { QuestPagesPage } from '../pages/quest-pages/quest-pages.page';

@Injectable({
  providedIn: 'root'
})
export class CRUDfirebaseService {
data:any
  constructor(private firestore: AngularFirestore) { }


 

  getByID(colleccion:string, id:any){
    var data:any
      this.firestore.doc( colleccion+'/' + id ).valueChanges()
      .subscribe( data=>{
      
        this.data= data;
      }
    );
    data=this.data;
    this.data="";
    console.log("DATA",data)
    return data;
  }


  async deleteData(colleccion:string, id:any){
     await this.firestore.collection(colleccion).doc(id).delete();
  }

  async createData(colleccion:string, data:any ){
    await this.firestore.collection(colleccion).add(data)
          .then( data => {
            console.log('created', data);
            return data;
          }).catch(err=>{
            console.log(err)
          });;
  }

 async updateData(colleccion:string,id:any, data: any ){
    await this.firestore.collection(colleccion).doc(id).update(data)
    .then( data => {
      console.log('updated', data);
    }).catch(err=>{
      console.log(err)
    });

  }
}
