import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CompanyData } from '../shared/models/data';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private dataCollection!: AngularFirestoreCollection<CompanyData>;
  // data$!: Observable<CompanyData>[];
  // constructor(private afs: AngularFirestore) {
  //   this.dataCollection = this.afs.collection<CompanyData>('data');
  //   this.data$ = this.dataCollection.valueChanges();
  // }
  constructor(private http: HttpClient){}

  createCompany(CompanyData: CompanyData){
    console.log(CompanyData);
    const addHeaders = new HttpHeaders({'myHeader': 'companyProject'})
    this.http.post<{name: string}>('https://angular-sign-up-28c11-default-rtdb.firebaseio.com/company.json', CompanyData, {headers: addHeaders})
      .subscribe((data) =>{
        console.log(data);
        this.fetchCompanyData();
      });
  }
  fetchCompanyData(){
    return this.http.get<{[key: string]: CompanyData}>('https://angular-sign-up-28c11-default-rtdb.firebaseio.com/company.json')
      .pipe(map((data) =>{
        const company = [];
        for(const key in data){
          if(data.hasOwnProperty(key)){
            company.push({...data[key], id: key})
          }
        } return company;
      }))
  }
  deleteCompany(id: string){
    this.http.delete('https://angular-sign-up-28c11-default-rtdb.firebaseio.com/company/' + id + '.json')
    .subscribe();
  }
  updateCompany(id: string, value: CompanyData){
    this.http.put('https://angular-sign-up-28c11-default-rtdb.firebaseio.com/company/' + id + '.json', value)
    .subscribe();
  }
}
