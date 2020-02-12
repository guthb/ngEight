import { Ingredient } from '../shared/ingredient.model';

const intitialState = {

  ingredients: [
    new Ingredient('Apples', 2),
    new Ingredient('Tomatoes', 8),
  ]

};

export function shoppingListReducer(state = intitialState, action) {

}
