import icons from 'url:../../img/icons.svg';

/**
 * @class View is the parent view to all other views
 * contains all the shared method  for all Views modules.
 * @const _data @const _data @func _generateMarkup will have the same name for all views
 * ! That way we can control which property will be read on a specific view
 */

export default class View {
  _data;
  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data the data to be rendered.
   * @param {boolean} [render=true] if false create markup string instead of rendering to DOM
   * @returns {undefined | string} a markup string return  if render is false
   * @this  {class} View Object
   */

  render(data,render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data; // Setting recieved data to View property _data
    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    //* We use _parentElement which exists only on other views.
    this._parentElement.insertAdjacentHTML('afterbegin', markup); 
  }
  /**
   * Updates nessaccery DOM attributes without reloading Attributes that stays the same.
   * @param {Object} data 
   * @const newDOM - @method document.createRange -Range interface represents a fragment of a document that can contain nodes and parts of text nodes
   * @const newDOM - @method createContextualFragment - creates a document fragment which is a lightweight version of Document that does not affect the document.
   *
   */
  update(data) {
 
    this._data = data;
    const newMarkup = this._generateMarkup();

    //? Need help here
    
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll(`*`));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // if the node elements are the same and the node elements have a string as text - then change the element.
      // also optional chaining
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl))
      //console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  /**
   * Clears the HTML markup
   */
  _clear() {
    
    this._parentElement.innerHTML = '';
  }
  
/**
 * Render spinner while loading
 */
  renderSpinner() {
    const markup = 
    `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
     </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Render a message inside the View 
   * @param {String} message -  by default it will be a property inside a class
   */
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  /**
   * Render a success massage
   * @param {string} message  -  by default it will be a property inside a class
   */
  renderMessage(message = this._successMessage) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
