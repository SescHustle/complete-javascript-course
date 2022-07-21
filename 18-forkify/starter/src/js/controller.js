import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) {
      return;
    }
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    const recipe = model.state.recipe;
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
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
    searchView.renderError();
    console.error(err);
  }
};

const controlPagination = function (page = model.state.search.page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);
  recipeView.update(model.state.recipe);
};

const controlBookmarksUpdate = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addServingsUpdateHandler(controlServings);
  recipeView.addBookmarkHandler(controlBookmarksUpdate);
  bookmarksView.addRenderHandler(controlBookmarks);
  searchView.addSearchHandler(controlSearchResult);
  paginationView.addClickHandler(controlPagination);
};

init();
