import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();


  private recipes: Recipe[] = [
    new Recipe('a test recipe', 'this is a test', 'https://www.maxpixel.net/static/photo/2x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg'),

    new Recipe('another test recipe', 'this is a test', 'https://www.maxpixel.net/static/photo/2x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg')
  ];

  getRecipes() {
    return this.recipes.slice();
  }


  constructor() { }
}
