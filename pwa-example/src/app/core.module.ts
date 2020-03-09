import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptorService } from './auth/auth-interceptor.service';


//import { RecipeService } from './recipes/recipe.service';
// import { logging } from 'protractor';
// import { LoggingService } from './logging.service';
// import { ShoppingListService } from './shopping-list/removed-shopping-list.service';
//import { CommonModule } from '@angular/common';


@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
    //RecipeService,
    //,LoggingService, ShoppingListService,
  ]

})
export class CoreModule { }
