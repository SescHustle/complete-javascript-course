// https://forkify-api.herokuapp.com/v2
import { API_URL, RES_PER_PAGE } from './config';
import { getJson } from './helpers';

export const state = {
  recipe: {},
  search: {
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    data = await getJson(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    //Rethrow to handle in controller
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    data = await getJson(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
  } catch (err) {
    //Rethrow to handle in controller
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (servings / state.recipe.servings);
  });

  state.recipe.servings = servings;
};
