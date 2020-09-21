import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Difficulty } from '../interfaces/interfaces';

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
}
