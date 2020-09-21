import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() titulo: string;
  user:any;
  constructor( private authCtrl: AuthService) { }

  ngOnInit() {
    if (!this.authCtrl.logIn){
    


    }else{
      this.user= this.authCtrl.user;
    }
  }

 
  salir(){
    this.authCtrl.signOut();
  }

}
