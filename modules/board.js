import { Row } from './row.js';

export class Board {
  constructor(grid_size) {
    this.grid_size = grid_size;
    this._rows = [];
  }

  get rows() {
    for(let row_number=0;row_number<this.grid_size;row_number++) {
      let row = new Row(row_number);
      for(let column_number=0;column_number<this.grid_size;column_number++) {
        let cell = row.register_cell_at_column(row_number, column_number);
      }
      this._rows.push(row);
    }
    return this._rows;
  }
}