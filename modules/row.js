import { Cell } from './cell.js';

export class Row {
  register_cell_at_position(h, w) {
    let cell = new Cell(h, w);
    this.appendChild(cell);
    return cell;
  }
}