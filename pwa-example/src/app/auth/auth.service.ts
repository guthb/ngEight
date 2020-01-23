import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

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
  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'enter url',
        {
          // tslint:disable-next-line: object-literal-shorthand
          email: email,
          // tslint:disable-next-line: object-literal-shorthand
          password: password,
          returnSecureToken: true
        }
      ).pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'enter url',
      {
        // tslint:disable-next-line: object-literal-shorthand
        email: email,
        // tslint:disable-next-line: object-literal-shorthand
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError));
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
