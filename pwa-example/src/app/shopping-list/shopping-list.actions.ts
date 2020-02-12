export const ADD_INGREDIENT = 'ADD_INGREDIENT'
import { Action } from '@ngrx/store';
import { Ingredient } from '../shared/ingredient.model';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  payload: Ingredient;
}
