import { Cell } from './cell.js';

export class Row {
  constructor(row_number) {
    this.row_number = row_number;
    this.cells = [];
  }

  register_cell_at_column(column) {
    const cell = new Cell(this.row_number, column);
    this.cells.push(cell);
  }
}