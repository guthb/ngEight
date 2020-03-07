import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';

import * as RecipesActions from './recipe.actions'
import { Recipe } from '../recipe.model';

@Injectable()

export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>('https://http-ng8-lab-a9882.firebaseio.com/recipes.json'
        )
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
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })

  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
