import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit() { }

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

    this.isLoading = true;

    if (this.isLoginMode) {
      // ...
      console.log('login mode selected but not ready in service yet');
    } else {
      console.log('Signup mode selected but not ready in service yet');
      this.authService.signup(email, password).subscribe(
        responseData => {
          console.log('response data', responseData);
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.error = 'An Error Occured';
          // this.error = errorMessage;
          this.isLoading = false;
        }

      );

    }
    form.reset();
  }
}
