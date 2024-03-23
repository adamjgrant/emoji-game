import { Board } from './modules/board.js';
import { GAMES } from './games.js';

const GRID_SIZE = 20;

[
  "keyboard", 
  "board"
].forEach((class_name) => {
  const id_name = class_name.replace(/\-/g, '_');
  window[id_name] = document.getElementById(id_name);
});
window.addEventListener('DOMContentLoaded', (event) => {

  // Get today's date in YYYY-MM-DD format
  let today = new Date();
  let today_string = today.toISOString().split('T')[0];
  let todays_game = GAMES[today_string];
  if (!todays_game) {
    throw new Error(`No game found for ${today_string}`);
  }

  let _board = new Board(GRID_SIZE);
  _board.register_game(todays_game);

  // Create a grid of cells
  for(let row_number=0;row_number<GRID_SIZE;row_number++) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.id = 'row-' + row;
    for(let column_number=0;column_number<GRID_SIZE;column_number++) {
      // Clone cell in template with id of "cell"
      const cell_template = document.getElementById('cell');
      const cell = cell_template.content.cloneNode(true);
      const cell_element = cell.firstElementChild;
      const _cell = _board.cell_at_row_and_column(row_number, column_number);
      cell_element.setAttribute("data-row", row);
      cell_element.setAttribute("data-column", column_number);
      if (_cell.type !== null) {
        cell_element.innerHTML = _cell.value;
      }
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
});