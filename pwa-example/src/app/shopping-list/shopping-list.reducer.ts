import { Ingredient } from '../shared/ingredient.model';
import { Action } from '@ngrx/store';
import { ADD_INGREDIENT } from './shopping-list.actions'

const intitialState = {
  ingredients: [
    new Ingredient('Apples', 2),
    new Ingredient('Tomatoes', 8),
  ]
};

export function shoppingListReducer(state = intitialState, action: Action) {
  switch (action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action]
      };
  }
}
