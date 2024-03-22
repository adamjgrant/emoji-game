import { Board } from './modules/board.js';

const GRID_SIZE = 20;

[
  "keyboard", 
  "board"
].forEach((class_name) => {
  const id_name = class_name.replace(/\-/g, '_');
  window[id_name] = document.getElementById(id_name);
});
window.addEventListener('DOMContentLoaded', (event) => {
  // Create a grid of cells
  for(let h=0;h<GRID_SIZE;h++) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.id = 'row-' + h;
    for(let w=0;w<GRID_SIZE;w++) {
      // Clone cell in template with id of "cell"
      const cell_template = document.getElementById('cell');
      const cell = cell_template.content.cloneNode(true);
      const cell_element = cell.firstElementChild;
      cell_element.setAttribute("data-row", h);
      cell_element.setAttribute("data-column", w);
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
});