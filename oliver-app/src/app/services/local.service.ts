import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Category, Difficulty, Town } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private http: HttpClient) { }


  getDifficulty(){
    return  this.http.get<Difficulty[]>('/assets/data/difficulty.json');
  }

  getCategorys(){
    return  this.http.get<Category[]>('/assets/data/categorys.json');
  }

  getActions(){
    return  this.http.get<Action[]>('/assets/data/actions.json');
  }

  getTowns(){
    return  this.http.get<Town[]>('/assets/data/towns.json');
  }

}
