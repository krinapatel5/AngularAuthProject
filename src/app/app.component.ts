import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
// import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn: boolean = false;

  title = 'firebaseAuth';
  constructor(
    public authService: AuthenticationService,
    private router: Router,
    // private dataService: DataService
    ){}

    ngOnInit(): void {
      this.authService.isLoggedIn().subscribe(() =>{
        this.isLoggedIn = true;
      })
    }


  logout(){
    this.authService.logout().subscribe(()=>{
      this.router.navigate(['']);
    })
  }
}
