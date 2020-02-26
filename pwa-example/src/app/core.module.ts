import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';


import { RecipeService } from './recipes/recipe.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
// import { logging } from 'protractor';
// import { LoggingService } from './logging.service';
// import { ShoppingListService } from './shopping-list/removed-shopping-list.service';
//import { CommonModule } from '@angular/common';


@NgModule({
  providers: [RecipeService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
    //,LoggingService, ShoppingListService,
  ]

})
export class CoreModule { }
