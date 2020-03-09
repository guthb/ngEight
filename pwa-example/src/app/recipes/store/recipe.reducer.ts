import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';
import { RecipesModule } from '../recipes.module';


export interface State {
  recipes: Recipe[];
}

const intitilaState: State = {
  recipes: []
}

export function recipeReducer(
  state = intitilaState,
  action: RecipesActions.RecipesActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };

    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };

    case RecipesActions.UPDATE_RECIPES:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe
      };

      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      };

    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        })
      };

    default:
      return state;
  }
}
