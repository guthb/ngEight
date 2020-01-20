import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


interface AuthResponseData {
  kind: string;
  idtoken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // myKey = config.myKey;
  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'enter url here',
      {
        // tslint:disable-next-line: object-literal-shorthand
        email: email,
        // tslint:disable-next-line: object-literal-shorthand
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(errorResponse => {
      let errorMessage = 'An unknown error occured!';
      if (!errorResponse.error || !errorResponse.error.error) {
        return throwError(errorMessage);
      }
      switch (errorResponse.error.message) {
        case 'EMAIL_EXISTS': {
          errorMessage = 'this email exists already';
          break;
        }
        case 'OPERATION_NOT_ALLOWED': {
          errorMessage = 'Password sign-in is disabled for this project';
          break;
        }
        case 'EMAIL_EXISTS': {
          errorMessage = 'All requests blocked from this device due to unusual activity. Try again later';
          break;
        }
        default: {
          errorMessage = errorMessage;
          break;
        }
      }
      return throwError(errorMessage);
    }));
  }
}
