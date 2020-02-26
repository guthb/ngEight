import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject, BehaviorSubject } from "rxjs";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Config } from '../config';
import { environment } from '../../environments/environment'
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


//const config = require('../config.ts') as Config;

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registerd?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {

  url = new Config
  //user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }



  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        //'signUp URL',
        'https://identitytoolkit.googleapis.com/v1/accounts:signUP?key=' + environment.firebaseApiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(catchError(this.handleError), tap(responseData => {
        this.handleAuth(responseData.email, responseData.localId, responseData.refreshToken, +responseData.expiresIn);
      })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      //'login Url',
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError),
      tap(responseData => {
        this.handleAuth(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      }));
  }

  autologin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData._token, userData.id, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      //this.user.next(loadedUser);
      this.store.dispatch(new AuthActions.Login({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }))
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration);
    }

  }

  logout() {
    //this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration); //2000
  }


  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate); //temporary
    //this.user.next(user)
    this.store.dispatch(new AuthActions.Login({ email: email, userId: userId, token: token, expirationDate: expirationDate }))
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS": {
        errorMessage = "this email exists already";
        break;
      }
      case "OPERATION_NOT_ALLOWED": {
        errorMessage = "Password sign-in is disabled for this project";
        break;
      }
      case "TOO_MANY_ATTEMPTS_TRY_LATER": {
        errorMessage =
          "All requests blocked from this device due to unusual activity. Try again later";
        break;
      }
      case "EMAIL_NOT_FOUND": {
        errorMessage =
          "There is no user record corresponding to this identifier. The user may have been deleted.";
        break;
      }
      case "INVALID_PASSWORD": {
        errorMessage =
          "The password is invalid or the user does not have a password.";
        break;
      }
      case "USER_DISABLED": {
        errorMessage =
          "The user account has been disabled by an administrator.";
        break;
      }
      default: {
        errorMessage = errorMessage;
        break;
      }
    }
    return throwError(errorMessage);
  }

}
