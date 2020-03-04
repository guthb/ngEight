import { Recipe } from '../recipe.model';
import * as RecipiesActions from './recipe.actions';
import { RecipesModule } from '../recipes.module';

export interface State {
  recipes: Recipe[];
}

const intitilaState: State = {
  recipes: []
}

export function recipeReducer(state = intitilaState, action: RecipiesActions.RecipesActions) {
  switch (action.type) {
    case RecipiesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    default:
      return state;
  }
}
