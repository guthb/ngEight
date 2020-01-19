import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailValidator } from '@angular/forms';
import { config } from '../config';

interface AuthResponseData {
  kind: string;
  idtoken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  myKey = config.myKey;
  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.myKey,
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.myKey,
      {
        email,
        password,
        returnSecureToken: true
      }
    );
  }
}