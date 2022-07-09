// https://forkify-api.herokuapp.com/v2

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './view/recipeView.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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
    console.error(err);
  }
};

controlRecipes();

const events = ['hashchange', 'load'];
events.forEach(ev => window.addEventListener(ev, controlRecipes));
