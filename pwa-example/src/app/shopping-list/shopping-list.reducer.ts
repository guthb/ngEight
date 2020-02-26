import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const intitialState = {
  ingredients: [
    new Ingredient('Apples', 2),
    new Ingredient('Tomatoes', 8),
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(
  state: State = intitialState,
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
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updateIngredient = {
        ...ingredient, //old data
        ...action.payload //overwrite only what changes
      };

      const updateIngredients = [...state.ingredients]
      updateIngredients[state.editedIngredientIndex] = updateIngredient;

      return {
        ...state,
        ingredients: updateIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null

      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredeient, ingredeientIndex) => {
          return ingredeientIndex !== state.editedIngredientIndex;
        }),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    default:
      return state;
  }
}
