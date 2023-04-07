import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, authState, createUserWithEmailAndPassword, updateProfile, UserInfo, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, switchMap, of, concatMap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  currentUser$ = authState(this.auth);

  constructor(private auth: Auth, private router: Router) { }

  login(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  signUp(name: any, email: any, password: any){
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: name}))
    );
  }

  updateProfile(profileData: Partial<UserInfo>): Observable<any>{
    const user = this.auth.currentUser;
    console.log(user);
    return of(user).pipe(
      concatMap(user => {
        if(!user){ throw new Error("Not Authenticated"); }
        return updateProfile(user, profileData)
      })
    )
  }

  logout(){
    this.router.navigate(['/login']);
    return from(this.auth.signOut());
  }
}
