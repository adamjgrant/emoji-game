import { Board } from "../modules/board.js"; 
import { Row } from "../modules/row.js"; 
import { Cell } from "../modules/cell.js";
import assert from 'assert';

describe('Board', function () {
  describe('initialization', function () {
    it('should create a grid', function () {
      let board = new Board(20);      
      assert.equal(board.rows.length, 20);
    });
  });
});

let game = {
  "rows": [
    { "cells": [] },
    { "cells": [] }
  ]
}

let cell00 = {
  "type": "HasValue",
  "value": "☁️",
} 

let cell01 = {
  "type": "HasValue",
  "value": "️💧",
} 

let cell02 = {
  "type": "HasValue",
  "value": "",
  "answer": "🌧️",
  "arithmetic": [
    {
      "direction": "down",
      "operation": "add",
      "operands": [
        {
          "row": 0,
          "cell": 0
        },
        {
          "row": 0,
          "cell": 1
        }
      ]
    }
  ]
} 
game.rows[0].cells.push(cell00);
game.rows[0].cells.push(cell01);
game.rows[0].cells.push(cell02);

describe("Row", function() {
  describe("adding cells", function() {
    it("should add a cell", function() {
      let board = new Board(3);
      board.register_game(game);
      assert.equal(board.rows[0].cell_at_column(0, 0).value, "☁️");
    });
  });
});

describe('Cell', function () {
  describe('validation', function () {
    it('should allow cells with HasValue, an empty value, and an answer', function () {
      assert.doesNotThrow(() => new Cell(0, 0, cell02));
    });

    it('should not allow cells with HasValue, an empty value, but no answer', function () {
      let cell02_bad = structuredClone(cell02);
      cell02_bad.answer = "";
      assert.throws(() => new Cell(0, 0, cell02_bad), Error);
    });

    it('should not allow cells with HasValue, an empty value, but no arithmetic', function () {
      let cell01_bad = structuredClone(cell01);
      cell01_bad.value = "";
      cell01_bad.answer = "☁️";
      assert.throws(() => new Cell(0, 0, cell01_bad), Error);
    });

    it('should not allow cells with null, and with arithmetic', function () {
      let cell01_bad = structuredClone(cell01);
      cell01_bad.type = null;
      cell01_bad.arithmetic = {};
      assert.throws(() => new Cell(0, 0, cell01_bad), Error);
    });

    it('should not allow cells with HasValue, an empty value, an answer, arithmetic, but no choices', function () {
      let cell02_bad = structuredClone(cell02);
      delete cell02_bad.choices;
      assert.throws(() => new Cell(0, 0, cell02_bad), Error);
    });
  });
});
