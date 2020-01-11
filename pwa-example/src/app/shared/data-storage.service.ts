import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipesService: RecipeService) { }

  storeReciepes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://http-ng8-lab-a9882.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }



}
