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

    if (this.properties.type === 'HasValue' && this.properties.value === '' && !this.properties.arithmetic) {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell without a value must have an arithmetic operation`);
    }

    if (this.properties.type === 'HasValue' && this.properties.value !== '' && this.properties.answer !== '') {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell with a value cannot have an answer`);
    }

    if (this.properties.type === null && this.properties.value !== undefined) {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell with a value cannot have an arithmetic operation`);
    }
  }
}