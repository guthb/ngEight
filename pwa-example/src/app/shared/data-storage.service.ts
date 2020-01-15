import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService
  ) {}

  storeReciepes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put("https://http-ng8-lab-a9882.firebaseio.com/recipes.json", recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>("https://http-ng8-lab-a9882.firebaseio.com/recipes.json")
      .pipe(
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
