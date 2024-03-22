import { Board } from "../modules/board.js"; 
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

let Game = {
  "rows": [
    { "cells": [] },
    { "cells": [] }
  ]
}

let cell00 = {
  "type": "HasValue",
  "value": "☁️",
  "arithmetic": {
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
} 
let cell01 = {
  "type": "HasValue",
  "value": "️💧",
  "arithmetic": {
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
} 
let cell02 = {
  "type": "HasValue",
  "value": "",
  "answer": "🌧️",
  "arithmetic": {
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
} 
Game.rows[0].cells.push(cell00);
Game.rows[0].cells.push(cell01);
Game.rows[0].cells.push(cell02);

describe('Cell', function () {
  describe('validation', function () {
    it('should not allow cells with HasValue, an empty string, but no answer', function () {
      let cell02_bad = cell02;
      cell02_bad.answer = "";
      assert.throws(() => new Cell(0, 0, cell02_bad), Error);
    });
  });
});
