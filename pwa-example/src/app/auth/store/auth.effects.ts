import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect, } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registerd?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        //'login Url',
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(responseData => {
          const expirationDate = new Date(
            new Date().getTime() + +responseData.expiresIn * 1000
          );
          return new AuthActions.Login({
            email: responseData.email,
            userId: responseData.localId,
            token: responseData.idToken,
            expirationDate: expirationDate
          });
        }),
        catchError(errorResponse => {
          let errorMessage = "An unknown error occured!";
          if (!errorResponse.error || !errorResponse.error.error) {
            return of(new AuthActions.LoginFail(errorMessage));
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

          return of(new AuthActions.LoginFail(errorMessage));
        }),
      );
    })
  );

  @Effect({ dispatch: false })
  authSucess = this.actions$.pipe(ofType(AuthActions.LOGIN), tap(() => {
    this.router.navigate(['/']);
  })
  );

  //$ indcates this is an observable
  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }

}
