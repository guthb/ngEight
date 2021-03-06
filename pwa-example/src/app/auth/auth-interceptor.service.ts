import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import * as fromApp from '../store/app.reducer'

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //return this.authService.user.pipe(take(1), exhaustMap(user =>
    return this.store.select('auth').pipe(take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap(user => {

        if (!user) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone({ params: new HttpParams().set('auth', user.token) });
        return next.handle(modifiedRequest);
      })
    );
  }
}
