import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  private loginFormSubmitAttempt: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private toast: HotToastService,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login(){
    if(this.email == ''){
      alert('Please enter email address');
      return;
    }
    if(this.password == ''){
      alert('Please enter email address');
      return;
    }
    this.authService.login(this.email, this.password);
  }
  signInWithGoogle(){
    this.authService.signInWithGoogle();
  }

  submit() {
    const { email, password } = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authService
      .login(email, password)
      .subscribe(() => {
        this._snackBar.open('Login Successfully', "OK",{
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.router.navigate(['/home']);
      });
      this.loginFormSubmitAttempt = true;
      this.isLoggedIn = true;
  }
}
