
import View from './viewParent';
import PreviewView from './previewView.js'
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = ` No bookmarks yet. Find a nice recipe and bookmark it 🤷‍♂️.`
    _successMessage = ''
    
    addHandlerRender(handler){
      window.addEventListener('load',handler)
    };
    
    _generateMarkup() {
      return this._data.map(res=>PreviewView.render(res, false)).join('');
    }
  
    
  }
  
  export default new BookmarksView();