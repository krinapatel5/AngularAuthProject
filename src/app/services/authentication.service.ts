import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, authState, createUserWithEmailAndPassword, updateProfile, UserInfo, UserCredential } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { from, Observable, switchMap, of, concatMap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isLoggedIn() {
    console.log(!!this.loggedIn.asObservable());
    return this.loggedIn.asObservable();
  }

  currentUser$ = authState(this.auth);

  constructor(
    private auth: Auth,
    private router: Router,
    private fireauth: AngularFireAuth
    ) { }

  login(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password));
    // this.fireauth.signInWithEmailAndPassword(username, password).then(() =>{
    //   localStorage.setItem('token', 'true');
    //   this.router.navigate(['home']);
    // }, err =>{
    //   alert('Something went wrong!' + err.message);
    //   this.router.navigate(['/login']);
    // });
  }

  signUp(name: any, email: any, password: any){
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: name}))
    );
    // this.fireauth.createUserWithEmailAndPassword(email, password).then(res=>{
    //   this.router.navigate(['/login']);
    //   this.sendEmailForVerfication(res.user);
    // }, err =>{
    //   alert(err.message);
    //   this.router.navigate(['/sign-up']);
    // })
  }

  signInWithGoogle(){
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res =>{
      this.router.navigate(['/home']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
    }, err =>{
      alert(err.message);
    })
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

  forgotPassword(email : string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }, err => {
      alert('Something went wrong');
    })
  }

  sendEmailForVerfication(user: any){
    user.sendEmailForVerfication().then((res: any) => {
      this.router.navigate(['/verify-email']);
    }, (err: any) =>{
      alert('Something went wrong');
    })
  }


  logout(){
    this.router.navigate(['/login']);
    return from(this.auth.signOut());
    // this.fireauth.signOut().then(()=>{
    //   localStorage.removeItem('token');
    //   this.router.navigate(['/login']);
    // },err =>{
    //   alert('Something went wrong' + err.message);
    // });
  }
}
