import { Injectable } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  SESSION_STORAGE_KEY = 'accessToken';

  private user: GoogleUser;

  constructor(private googleAuth: GoogleAuthService) {}

  getToken(): string {
    const token: string = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set , authentication required');
    }
    return sessionStorage.getItem(this.SESSION_STORAGE_KEY);
  }

  signIn(): void {
    this.googleAuth.getAuth().subscribe((auth) => {
      auth.signIn().then(res => this.signInSuccessHandler(res));
    });
  }

  get userId(): any {
    return this.user.getId();
  }

  private signInSuccessHandler(res: GoogleUser) {
    this.user = res;
    sessionStorage.setItem( this.SESSION_STORAGE_KEY, res.getAuthResponse().access_token );
  }
}
