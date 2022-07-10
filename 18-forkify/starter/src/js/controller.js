// https://forkify-api.herokuapp.com/v2

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './view/recipeView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) {
      return;
    }
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    const recipe = model.state.recipe;
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

controlRecipes();

const init = function () {
  recipeView.addRenderHandler(controlRecipes);
};

init();
