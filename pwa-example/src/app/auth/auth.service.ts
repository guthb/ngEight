import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject } from "rxjs";
import { Config } from '../config';
import { User } from './user.model';

//const config = require('../config.ts') as Config;

export interface AuthResponseData {
  kind: string;
  idtoken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registerd?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  // myKey = config.myKey;
  url = new Config
  user = new Subject<User>();




  constructor(private http: HttpClient) { }

  //configUrl = config.urlAndApiKey

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'signUp URL',
        {
          // tslint:disable-next-line: object-literal-shorthand
          email: email,
          // tslint:disable-next-line: object-literal-shorthand
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
      'login Url',
      {
        // tslint:disable-next-line: object-literal-shorthand
        email: email,
        // tslint:disable-next-line: object-literal-shorthand
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError),
      tap(responseData => {
        this.handleAuth(responseData.email, responseData.localId, responseData.refreshToken, +responseData.expiresIn);
      }));
  }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user)
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
