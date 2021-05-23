import View from './viewParent';
import PreviewView from './previewView';
import icons from 'url:../../img/icons.svg';
/**
 * a Class that extends @class View
 * @property {const} _parentElement is the results class from index.html
 * @property {_errorMessage | _successMessage} - specific messages for this view
 * @mehtod {_generateMarkup} takes Data array and map all the results into a new array -
 * @this {class} View
 */
class resultsViews extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your search, please try again✌.`;
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(res => PreviewView.render(res, false)).join('');
  }
}

export default new resultsViews();
