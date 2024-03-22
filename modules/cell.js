export class Cell {
  constructor(row, column, properties = {}) {
    this.row = row;
    this.column = column;
    this.properties = properties;
    this.validate();
  }

  validate() {
    if (this.properties.type === 'HasValue' && this.properties.value === '' && this.properties.answer === '') {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell without a value must have an answer`);
    }
  }
}