//* this module is for the search container view in general
import View from './viewParent';

/**
 * @class contains method for search view
 * @method getQuery - to recieve the query from search box
 *  @method  _clearInput() - clear method 
 */
class SearchView {
    _parentElement = document.querySelector('.search');
    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput()
        return query;
    }

    _clearInput(){
        this._parentElement.querySelector('.search__field').value =``
    }
/**
 * listen to the @event sumbit and execute a handler function in controller module.
 * @param {function} handler 
 */
    addHandlerSearch(handler){
        this._parentElement.addEventListener('submit',function(e){
            e.preventDefault();
            handler();  
         
        })
    }

}

export default new SearchView() // export a copy of the class