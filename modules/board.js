import { Row } from './row.js';
import { Cell } from './cell.js';

export class Board {
  constructor(grid_size) {
    this.grid_size = grid_size;
    this.rows = new Array(grid_size);
    this.initiate();
  }

  register_game(game) {
    game.rows.forEach((row, row_number) => {
      row.cells.forEach((cell_properties, column_number) => {
        let cell = new Cell(row_number, column_number, cell_properties);
        this.register_cell_at_row_and_column(cell, row_number, column_number);
      });
    });
  }

  register_cell_at_row_and_column(cell, row_number, column_number) {
    let row = this.rows[row_number]
    if (!row) {
      throw new Error(`Row ${row_number} does not exist`);
    }
    row.register_cell_at_column(cell, column_number);
  }

  cell_at_row_and_column(row_number, column_number) {
    const null_cell = new Cell(row_number, column_number, { type: null });
    if (!this.rows[row_number]) { return null_cell; }
    return this.rows[row_number].cell_at_column(column_number);
  }

  initiate() {
    for(let row_number=0;row_number<this.grid_size;row_number++) {
      this.rows[row_number] = new Row(row_number, this.grid_size);
    }
  }
}