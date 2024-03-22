import { Board } from "../modules/board.js"; 
import pkg from 'mocha';
const { assert } = pkg;

// var assert = require('assert');
describe('Board', function () {
  describe('initialization', function () {
    it('should create a grid', function () {
      let board = new Board(20);      
      assert.equal(board.rows.length, 20);
    });
  });
});