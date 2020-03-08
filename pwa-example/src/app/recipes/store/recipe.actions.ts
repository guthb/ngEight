import { Action } from '@ngrx/store';

import { Recipe } from '../recipe.model'

export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const ADD_RECIPE = '[Recipes] Add Recipe';
export const UPDATE_RECIPES = '[Recipes] Update Recipes';
export const DELETE_RECIPE = '[Recipes] Delete Recipe';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;
  constructor(public payload: Recipe[]) { }
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;
  constructor(public payload: Recipe) { }
}

export class UpdateRecipes implements Action {
  readonly type = UPDATE_RECIPES;
  constructor(public payload: { index: number; newRecipe: Recipe }) { }
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) { }
}

export type RecipesActions = SetRecipes | FetchRecipes | AddRecipe | UpdateRecipes | DeleteRecipe;
