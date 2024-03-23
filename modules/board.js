import { Row } from './row.js';

export class Board {
  constructor(grid_size) {
    this.grid_size = grid_size;
    this.rows = [];
    this.initialize();
  }

  register_game(game) {
    game.rows.forEach((row, row_number) => {
      row.cells.forEach((cell, column_number) => {
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
    return this.rows[row_number].cell_at_column(column_number);
  }

  initialize() {
    for(let row_number=0;row_number<this.grid_size;row_number++) {
      let row = new Row(row_number, this.grid_size);
      this.rows.push(row);
    }
    return this.rows;
  }
}