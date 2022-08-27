import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _defaultMessage = 'Recipe uploaded successfully!';

  _addShowWindowHandler() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addCloseWindowHandler() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addFormSubmitHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)];
      handler(data);
    });
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  constructor() {
    super();
    this._addShowWindowHandler();
    this._addCloseWindowHandler();
  }
}

export default new AddRecipeView();
