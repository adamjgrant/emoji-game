export class Row {
  constructor(row_number, row_size) {
    this.row_number = row_number;
    this.cells = new Array(row_size);
  }

  register_cell_at_column(cell, column_number) {
    this.cells[column_number] = cell;
  }

  cell_at_column(column_number) {
    if (!this.cells[column_number]) {
      return { type: null }
    }
    return this.cells[column_number];
  }
}