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

  onSwtichMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;

    this.isLoginMode = true;

    if (this.isLoginMode) {
      // ...
      console.log('log in mode selected but not ready in service yet');
    } else {

      this.authService.signup(email, password).subscribe(
        responseData => {
          console.log('response data', responseData);
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.error = 'An Error Occured';
          this.isLoginMode = false;
        }

      );

    }
    form.reset();
  }
}
