/**
 * * Import section for the controller, which basically commands our functionality.
 */
import * as model from './model.js'; //* importing everything from model mudule
import recipeView from './Views/recipeView.js'; // importing a new class from recipeView mudule
import SearchView from './Views/SearchView.js';
import resultsViews from './Views/resultsViews.js';
import paginationView from './Views/paginationView.js';
import BookmarksView from './Views/bookmarksView.js';
import AddRecipeView from './Views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

// importing WEBpackages libraries
import 'core-js/stable';
import 'regenerator-runtime';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView';

//! this is a parcel command - not JS -
//Accept updates for the given dependencies and fire a callback to react to those updates
if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe'); // the recipe container in HTML

/**
 * control recipes - load,render & update for recipe view - also bookmarks and results.
 * @async 
 * @constant id the sliced id number for the url
 * 
 */
const controlRecipes = async function () {
  try {
    // window is the global - location is the URL - hash is # and everything the comes after
    const id = window.location.hash.slice(1); 
    
    // Guard
    if (!id) return;

    //update results view to mark selected search result
    resultsViews.update(model.getSearchResultsPage());

    //* LOADING recipe
    recipeView.renderSpinner(); // calling first when loading 
    
    BookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id); //! calling await from the model mudule we imported -

    //*2 RENDERING 
    recipeView.render(model.state.recipe);

   
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//Taking input from search field and get the neccassery data from the model.
const controlSearchResults = async function () {
  try {
    resultsViews.renderSpinner(); // a good method while we await -very good for UX
    const query = SearchView.getQuery(); //456 setting up the value
    if (!query) return; //guard clause
    await model.loadSearchResults(query); // access to API

    //render results
    resultsViews.render(model.getSearchResultsPage());

    //render initial page button.
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//*  render results by page -

const controlPagination = function (goToPage) {
  //render new results
  resultsViews.render(model.getSearchResultsPage(goToPage));

  //render new page button.
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings  (in state)
  model.updateServings(newServings);
  // update the view
  //recipeView.render(model.state.recipe); //here everything is rendered - to much stress
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add or remove BM
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipe
  recipeView.update(model.state.recipe);
  // render bookmarks
  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);
    // success message
    addRecipeView.renderMessage();
    //render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // change id url

    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    // close form window

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`😘🤷‍♀️`, err);
    addRecipeView.renderError(err);
  }
};

//* the init function here recieves functions to the handle on different events.
//* Click -load - hashChange.
/**
 * Handles all the data from model to views methods.
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
