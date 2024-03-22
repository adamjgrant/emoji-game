export class Cell {
  constructor(row, column, properties) {
    this.row = row;
    this.column = column;
    this.properties = properties;
    this.validate();
  }

  validate() {
    // if (this.type === 'HasValue' && this.value === '' && this.answer === '') {
    //   throw new Error('Cell must have a value or an answer');
    // }
  }
}