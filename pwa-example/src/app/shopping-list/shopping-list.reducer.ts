import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const intitialState = {
  ingredients: [
    new Ingredient('Apples', 2),
    new Ingredient('Tomatoes', 8),
  ]
};

export function shoppingListReducer(
  state = intitialState,
  action: ShoppingListActions.ShoppingListActions) {

  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[action.payload.index];
      const updateIngredient = {
        ...ingredient, //old data
        ...action.payload.ingredient  //overwrite only what changes
      };

      const updateIngredients = [...state.ingredients]
      updateIngredients[action.payload.index] = updateIngredient;

      return {
        ...state,
        ingredients: updateIngredients

      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredeient, ingredeientIndex) => {
          return ingredeientIndex !== action.payload;
        })
      };
    default:
      return state;
  }
}
