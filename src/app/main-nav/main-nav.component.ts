import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  isLoggedIn$!: Observable<boolean>;
  // showToolbar: boolean = true;
  // @Input() showToolbar: boolean = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public authService: AuthenticationService,
    private router: Router,) {}
      fun(drawer?: any){
        console.log(drawer);
        drawer?.toggle();
      }

      ngOnInit(): void {
        this.isLoggedIn$ = this.authService.isLoggedIn();

      }
      logout(){
        this.authService.logout().subscribe(()=>{
          this.router.navigate(['']);
        })
      }
}
