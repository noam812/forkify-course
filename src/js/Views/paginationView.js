import View from './viewParent';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
  // always the same name along the views modulus - to  implement inheritance 

  _parentElement = document.querySelector('.pagination');

  // another handler method that will be used in controller module - 
  // the controller method import data from the model module

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {

      const btn = e.target.closest('.btn--inline');
      if (!btn) return; // guard clause
      const goToPage = +btn.dataset.goto; 
      
      handler(goToPage);
    });
  }

  _generateMarkup() {
  
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    
   
    console.log(numPages);

//data-goto is a data set goto is the name - we basicaly set the numbet of page 
//in a dataset that we then use in handler function.
//first page and other pages exists.


    if (curPage === 1 && numPages > 1) {
      return `<button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    // last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }
    //other page - between first and last
    if (curPage < numPages) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <span>Page ${curPage - 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
             </button>
             <button data-goto="${
               curPage + 1
             }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    return ''; //this case basically is when we have no need for more pages
  };
}
export default new PaginationView();
