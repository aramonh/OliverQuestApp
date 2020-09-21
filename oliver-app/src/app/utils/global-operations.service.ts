import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalOperationsService {

  constructor(
    private toastCtrl: ToastController
  ) { }






  showToast(message: string) {
    console.log(message);
    this.toastCtrl
      .create({
        position:"middle",
        message,
        duration: 3000,
      })
      .then((toastData) => toastData.present());
  }


}
