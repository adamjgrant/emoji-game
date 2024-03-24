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
const copy_from_template = (template_id) => {
  let el = document.getElementById(template_id);
  let cloned_el = el.content.cloneNode(true)
  return cloned_el.firstElementChild; 
}

const $ = (selector) => Array.from(document.querySelectorAll(selector));

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

  let possible_answers = [];

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
      cell_element.setAttribute("data-row", row_number);
      cell_element.setAttribute("data-column", column_number);
      if (_cell.is_fill_in_the_blank) {
        cell_element.classList.add('fill-in-the-blank');
        possible_answers.push(_cell.answer);
      }
      const IDEOGRAPHIC_SPACE = "&#12288;";
      if (_cell.type !== null) {
        // Show ideographic space if cell is empty
        let value = _cell.value.length ? _cell.value : IDEOGRAPHIC_SPACE;
        cell_element.innerHTML = value;
      } else {
        cell_element.innerHTML = IDEOGRAPHIC_SPACE;
        cell_element.classList.add('null');
      }
      row.appendChild(cell);
    }
    board.appendChild(row);
  }

  const equation_element = copy_from_template('equation');
  keyboard.appendChild(equation_element);

  const choices_element = copy_from_template('choices');
  keyboard.appendChild(choices_element);
  possible_answers.forEach((answer) => {
    const choice_element = copy_from_template('choice');
    choice_element.innerHTML = answer;
    choices_element.appendChild(choice_element);
  });


  // Toggle and populate keyboard
  $('.cell.fill-in-the-blank').forEach((cell) => {
    cell.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      document.body.classList.toggle('keyboard-open');
    });
  });

  document.body.addEventListener('click', (event) => {
    document.body.classList.remove('keyboard-open');
  });
});