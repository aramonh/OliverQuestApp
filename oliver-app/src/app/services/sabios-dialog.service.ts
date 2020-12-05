import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SabiosDialogService {
  data: any;
  constructor(private firestore: AngularFirestore) {}
}
