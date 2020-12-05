import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SabiosService {
  data: any;
  constructor(private firestore: AngularFirestore) {}
}
