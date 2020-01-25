import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap, take, exhaustMap } from "rxjs/operators";
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService
  ) { }

  storeReciepes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put("https://http-ng8-lab-a9882.firebaseio.com/recipes.json", recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      return this.http
        .get<Recipe[]>("https://http-ng8-lab-a9882.firebaseio.com/recipes.json",
          {
            params: new HttpParams().set('auth', user.token)
          }
        );
    }),
      map(recipes => {
        // rxjs operator
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        }); // js array method
      }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes);
      })
    );
    // .subscribe(recipes => {
    //   console.log(recipes);

    // });









  }
}
