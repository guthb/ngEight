import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const intitialState = {
  ingredients: [
    new Ingredient('Apples', 2),
    new Ingredient('Tomatoes', 8),
  ]
};

export function shoppingListReducer(state = intitialState, action: ShoppingListActions.AddIngredient) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    default:
      return state;
  }
}
