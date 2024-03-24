export class Cell {
  constructor(row, column, properties = {}) {
    this.row = row;
    this.column = column;
    this.properties = properties;
    this.answer = properties.answer;
    this.type = properties.type;
    this.arithmetic = properties.arithmetic;

    this.validate();
  }

  get is_fill_in_the_blank() {
    return (this.type === 'HasValue' && this.value === '');
  }

  get value() {
    if (this.type === null) {
      throw new Error(`Error at cell ${this.row}, ${this.column}: Cells of null type will not have a value`);
    }
    return this.properties.value || "";
  }

  validate() {
    if (this.is_fill_in_the_blank && this.answer === '') {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell without a value must have an answer`);
    }

    if (this.is_fill_in_the_blank && !this.arithmetic.length) {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell without a value must have an arithmetic operation`);
    }

    if (this.type === 'HasValue' && this.value !== '' && this.answer) {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell with a value cannot have an answer`);
    }

    if (this.type === null && this.arithmetic !== undefined) {
      throw new Error(`Error at cell ${this.row}, ${this.column}: A cell with a value cannot have an arithmetic operation`);
    }
  }
}