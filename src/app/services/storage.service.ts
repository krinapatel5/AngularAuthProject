import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  saveData(key: any,value:any) {
    localStorage.setItem(key,JSON.stringify(value));
  }

  getData (key:string) {
   return JSON.parse(localStorage.getItem(key) || '[]');
  }
}
