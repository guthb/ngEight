import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect, } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registerd?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(
    new Date().getTime() + expiresIn * 1000
  );
  const user = new User(email, userId, token, expirationDate)
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = "An unknown error occured!";
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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

  return of(new AuthActions.AuthenticateFail(errorMessage));
};


@Injectable()
export class AuthEffects {
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(
          //'signUp URL',
          'https://identitytoolkit.googleapis.com/v1/accounts:signUP?key=' + environment.firebaseApiKey,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          map(responseData => {
            return handleAuthentication(
              +responseData.expiresIn,
              responseData.email,
              responseData.localId,
              responseData.idToken
            );
          }),
          catchError(errorResponse => {
            return handleError(errorResponse);
          })
        );
    })
  );

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
          return handleAuthentication(
            +responseData.expiresIn,
            responseData.email,
            responseData.localId,
            responseData.idToken
          );
        }),
        catchError(errorResponse => {
          return handleError(errorResponse);
        }),
      );
    })
  );

  @Effect({ dispatch: false })
  //authSucess = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap(() => {
  authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT), tap(() => {
    this.router.navigate(['/']);
  })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'NOVALUE' };
      }
      const loadedUser = new User(userData.email, userData._token, userData.id, new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        //this.user.next(loadedUser);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        });
        //    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        //    this.autoLogout(expirationDuration);
      }
      return { type: 'NOVALUE' };
    })
  );

  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
    localStorage.removeItem('userData');
  }))


  //$ indcates this is an observable
  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }

}
