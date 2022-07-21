import View from './View';
import previewView from './previewView';
import { LOAD_EVENTS } from '../config';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'You have no bookmarks yet.';
  _defaultMessage = '';

  addRenderHandler(handler) {
    LOAD_EVENTS.forEach(event => window.addEventListener(event, handler));
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
