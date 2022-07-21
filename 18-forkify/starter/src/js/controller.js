import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';

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

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) {
      return;
    }

    await model.loadSearchResults(query);
    controlPagination();
  } catch (err) {
    // TODO: handle error
  }
};

const controlPagination = function (page = model.state.search.page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addServingsUpdateHandler(controlServings);
  searchView.addSearchHandler(controlSearchResult);
  paginationView.addClickHandler(controlPagination);
};

init();
