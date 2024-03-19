import { CONST } from "./constants.js";

document.addEventListener('DOMContentLoaded', () => {
  // Define the rows of keys for a standard QWERTY keyboard
  const rows = [
    [CONST.ENTER_KEY, CONST.IDK_KEY],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', CONST.DELETE_KEY],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Get the template element
  const template = document.getElementById('keyboard-key-template');

  // Loop through each row
  rows.forEach((row, index) => {
    // Select the current keyboard row by constructing its ID
    const keyboardRow = document.getElementById(`keyboard-row-${index + 1}`);

    // Loop through each key in the row
    row.forEach(key => {
      // Clone the template
      const clone = document.importNode(template.content, true);
      
      // Set the button text to the current key
      clone.querySelector('button').textContent = key;
      const key_element = clone.querySelector('button')

      if (key === CONST.ENTER_KEY) {
        key_element.classList.add('enter', 'score-disabled');
        key_element.disabled = true;
        key_element.id = 'enter';
      }
      if (key === CONST.DELETE_KEY) {
        key_element.classList.add('backspace');
        key_element.id = 'backspace';
        key_element.innerHTML = '<ion-icon name="backspace-outline"></ion-icon>';
      }
      if (key === CONST.IDK_KEY) {
        key_element.classList.add("idk");
        key_element.id = "idk";
      }

      // Append the cloned template to the current keyboard row
      keyboardRow.appendChild(clone);
    });
  });
});

export class Keyboard {
  constructor() {
    this.keyboard = document.getElementById('keyboard');
    this.delete_key = document.getElementById('backspace');
    this.entry = "";
    this.last_entry = "";
  }

  type(e, limit) {
    const key = e.target.textContent;
    // Update the entry string with the key that was pressed
    if (key === CONST.IDK_KEY) { return }
    if (key === CONST.ENTER_KEY) {
      this.last_entry = this.entry;
      this.entry = "";
      this.disable_enter_key();
      return true;
    }
    if (key === "") {
      if (e.target.id === "backspace") {
        this.entry = this.entry.slice(0, -1);
      }
    }
    if (key !== CONST.ENTER_KEY && key !== CONST.DELETE_KEY) {
      if (this.entry.length < limit) this.entry = this.entry + key;
    }
    if (this.entry.length === limit) {
      this.enable_enter_key();
    } else {
      this.disable_enter_key();
    }
  }

  get enter_key() {
    return document.getElementById('enter');
  }

  disable_enter_key() {
    this.enter_key.classList.add('score-disabled');
    this.enter_key.disabled = true;
  }

  enable_enter_key() {
    this.enter_key.classList.remove('score-disabled');
    this.enter_key.disabled = false;
  }

  get keys() {
    return Array.from(document.querySelectorAll('#keyboard button'));
  }

  score_keys(scored_guess) {
    if (!scored_guess || scored_guess.every(item => item.score === "green")) return this.reset_key_scores();

    this.keys.forEach(key => {
      // Find the scored_guess item whose letter property matches the key's text content
      let score = scored_guess.find(item => item.letter === key.textContent);
      let score_color = score ? score.score : "black";
      key.classList.add(`score-${score_color}`);
    });
  }

  reset_key_scores() {
    this.keys.forEach(key => {
      key.classList.remove("score-black", "score-green", "score-yellow", "score-disabled"); 
    });
  }
}
