import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect, } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';

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
          return of(new AuthActions.Login({
            email: responseData.email,
            userId: responseData.localId,
            token: responseData.idToken,
            expirationDate: expirationDate
          }));
        }),
        catchError(error => {
          return of();
        }),
      );
    })
  );


  //$ indcates this is an observable
  constructor(private actions$: Actions, private http: HttpClient) { }

}
