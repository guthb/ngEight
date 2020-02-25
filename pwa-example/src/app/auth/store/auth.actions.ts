import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login'; //make sure the actions are unique across the app add prefixing!
export const LOGOUT = '[Auth] Logout';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: { email: string, userId: string, token: string, expirationDate: Date }
  ) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;
