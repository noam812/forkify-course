/**
 * * This is the "model mudule" in our MVC architecture for this app
 * in here we will implement all the functions and object that process and store the data in our app
 */

import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

/**
 *@const {Object} state where all the data will be stored after process, Exported to controller like everything inn model.
 * @property {} query -  for search query default as empty string.
 * @property {} page - default starts at page 1.
 * @property {}resultsPerPage: RES_PER_PAGE is a config module variable. the ALL CAPS is a convention for these variables.
 */

export const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Deconstruct API data object that recieved
 * @param {*} data The object block that recieved from the API (e.g recipe)
 * @returns  the data with var names that we define
 * @property {} recipe.key - is written using short - circuit, if there is a key then a property will be created
 * if there is no key then the code line will be short circuit and nothing will happen -
 */

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * request and load a recipe by ID
 * @async
 * @param {Object}  the URL ID that will be given to this function
 * @const {Object} data - will be the parsed information from API request
 * @property {}state.recipe is the data now renamed & stored in @const {object} state.
 */
export const loadRecipe = async function (id) {
  try {
    //Get data
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // Store Renamed data
    state.recipe = createRecipeObject(data);

    // Checks if the recipe is already in the bookmark array
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(`${err}💥😘💥`);
    throw err;
  }
};

/**
 * @async Loads recipe from API by search query
 * 
 * @param {string} query - query recieved from the controller module - which gets it from SearchView.
 * *This is the publisher subscriber solution in use.
 * @property {property} state.search.query - takes the @param query and replace with default
 * @const data - will be an array of results from the API
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    //storing the data as a new array in state object -
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // making sure that after every search query the the pagination will reset as page 1.
    state.search.page = 1;
  } catch (err) {
    console.log(`${err}💥😘💥`);
    throw err;
  }
};
/**
 * Calculate results per page
 * @param {*} page - by default is 1 unless this function recieves otherwise.
 * @returns  a sliced array of results relevant to page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  // Setting new page
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // page is 1 by default - hence 0 ;
  const end = page * state.search.resultsPerPage; // RES_PER_PAGE is 15 in config module.

  //if we are in page 2 - we will get from 15 to 30 and etc.
  // here the results are sliced to 15 per page  =

  return state.search.results.slice(start, end);
};
/**
 * Calculate the new amounts of ingredients according to serving request.
 * @param {number} newServing - the amount of servings -
 * @property {} state.recipe.ingredients is being modified by the  @method forEach
 */
export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity * newServing) / state.recipe.servings;
  });
  //Setting the new servings.
  state.recipe.servings = newServing;
};

/**
 * Set bookmarked items in local storage.
 */

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * adds a bookmark to bookmark array with checking if it already exists.
 * @param {Object} recipe
 */
export const addBookmark = function (recipe) {
  //Add to bookmarks array
  state.bookmarks.push(recipe);

  //Mark as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //Delete
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark as NOT bookmark

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/**
 * Gets bookmarked recipes from local storage every reload
 * If there is data recieved from local storage then it is parsed.
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
//calling the function
init();

/**
 * call this @function to clear all Bookmarks
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

/**
 * Uploads new recipe to API
 * @async
 * @param {Object} newRecipe
 * @const ingredients  - an array of entries,filtered entries values & mapped
 *  @const ingredients @returns an array of objects describing each ingredient.
 * @const recipe converts the new recipe format back to how we recieved it from the API.
 * @const data - The send request to the API
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Wrong Format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
