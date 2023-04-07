import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';
import { AddCompanyComponent } from './add-company/add-company.component';


const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingComponent},
  {path: 'login', component: LoginComponent, ...canActivate(redirectToHome)},
  {path: 'sign-up', component: SignUpComponent, ...canActivate(redirectToHome)},
  {path: 'home', component: HomeComponent, ...canActivate(redirectToLogin)},
  {path: 'profile', component: ProfileComponent, ...canActivate(redirectToLogin)},
  {path: 'new-company', component: AddCompanyComponent, ...canActivate(redirectToLogin)},
  {path: 'company-list', component: HomeComponent, ...canActivate(redirectToLogin)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
