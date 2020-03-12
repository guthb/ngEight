import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    // private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private loggingService: LoggingService) { }



  loadedFeature = 'recipe';


  // onNavigate(feature: string) {
  //   this.loadedFeature = feature;
  // }
  ngOnInit() {
    //this.authService.autologin()
    this.store.dispatch(new AuthActions.AutoLogin())
    this.loggingService.printLog('Hello from AppComponent ngOnInit')
  }


}
