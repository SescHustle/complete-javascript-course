import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addClickHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) {
        return;
      }
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (currentPage === 1) {
      return totalPages > 1
        ? this.#generateNextPageButton(currentPage + 1)
        : '';
    }
    if (currentPage === totalPages) {
      return this.#generatePrevPageButton(currentPage - 1);
    }

    return (
      this.#generatePrevPageButton(currentPage - 1) +
      this.#generateNextPageButton(currentPage + 1)
    );
  }

  #generatePrevPageButton(page) {
    return `
    <button data-goto="${page}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page}</span>
    </button>
    `;
  }

  #generateNextPageButton(page) {
    return `
    <button data-goto="${page}" class="btn--inline pagination__btn--next">
        <span>Page ${page}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;
  }
}

export default new PaginationView();
