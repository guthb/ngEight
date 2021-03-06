import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from '@ngrx/store';


import { Subscription } from "rxjs";

import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive'
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private closeSubscription: Subscription;
  private storeSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;

    //let authObservable: Observable<AuthResponseData>;

    //this.isLoading = true;

    if (this.isLoginMode) {
      //authObservable = this.authService.login(email, password);
      this.store.dispatch(
        new AuthActions.LoginStart({
          email: email,
          password: password
        })
      );
    } else {
      //authObservable = this.authService.signup(email, password);
      this.store.dispatch(new AuthActions.SignupStart({
        email: email,
        password: password
      }))
    }

    this.store.select('auth').subscribe(authState => {

    })
    // authObservable.subscribe(
    //   ResponseData => {
    //     console.log(ResponseData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes'])
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  onHandleError() {
    //this.error = null;
    this.store.dispatch(new AuthActions.HandleError())
  }


  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }


  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    componentRef.instance.message = message;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

}
