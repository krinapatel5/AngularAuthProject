import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing-container mat-elevation-z2">
      <mat-icon>home</mat-icon>
      <p>Welcome to Angular Auth Project</p>
      <div class="entry-buttons">
        <button type="button"><a routerLink="/login">Log in</a></button>
        <button type="button"><a routerLink="/sign-up">Sign Up </a></button>
      </div>
  </div>
  `,
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

}
