import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  onItemAdded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isSignedIn = false;

  private user;

  constructor() {
    this.user = localStorage.getItem('googleUser');
    this.isSignedIn = !!this.user;
  }

}
