import { Row } from './row.js';

export class Board {
  constructor(grid_size) {
    this.grid_size = grid_size;
  }

  get rows() {
    for(let h=0;h<this.grid_size;h++) {
      let row = new Row(h);
      for(let w=0;w<this.grid_size;w++) {
        let cell = row.register_cell_at_position(h, w);
      }
      this.appendChild(row);
    }
    return this;
  }
}