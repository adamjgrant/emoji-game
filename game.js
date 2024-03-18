import { disk } from "./disk.js";

const TIME_TO_CELEBRATE = 2000;
const MAX_NUMBER_OF_TRIES = 5;

export class Game {
  constructor(game) {
    this.game = game;
    this.clue = game.clue;
    this.date = game.date;
    this.active_round = 1;
    this.number_of_tries_in_round = 0;
    this.text_message_object = {
      "round-1": [],
      "round-2": [],
      "round-3": [],
      "round-4": [],
      "round-5": [],
    };
    this.history = "";
  }

  increment_round() {
    this.active_round += 1;
    disk.save_for_prop("active_round", this.active_round);
  }

  get game_emojis () {
    return this.game.game;
  }

  get first () {
    return this.game_emojis[this.active_round - 1][0];
  }

  get second () {
    return this.game_emojis[this.active_round - 1][1];
  }

  get emoji_answer () {
    return this.game_emojis[this.active_round - 1][2];
  }

  get word_answer () {
    let answer = this.game_emojis[this.active_round - 1][3];
    answer = answer.replace(/\s/g, ""); // For now removing spaces but would be fun to do a version with them.
    return answer;
  }

  set_up_round() {
    this.show_history();
    if (this.active_round > this.game_emojis.length) {
      return this.show_curtain();
    }
    document.getElementById("clue-first").innerText = this.first;
    document.getElementById("clue-second").innerText = this.second;
    this.set_up_round_spacers();
    this.blinking_cursor = 0;
    this.number_of_tries_in_round = 0;
    this.auto_cheat();
  }

  get spacers() {
    return Array.from(document.querySelectorAll(".entry-zone.main .spacer"));
  }

  set entry(entry) {
    if (entry.length > this.spacers.length) return;
    const entry_as_array = entry.split("");
    this.spacers.forEach((spacer, index) => {
      if (index < entry.length) {
        spacer.innerText = entry_as_array[index];
      } else {
        spacer.innerText = "";
      }
    });

    this.blinking_cursor = entry.length;
    this.reset_clue_equals();
  }

  set_up_round_spacers() {
    this.reset_clue_equals();
    const entry_zone = document.getElementById("entry-zone");
    entry_zone.innerHTML = "";
    const spacer_template = document.getElementById("game-entry-spacer");
    Array.from({ length: this.word_answer.length }, () => {
      const spacer = document.importNode(spacer_template.content, true);
      entry_zone.appendChild(spacer);
    });
    const entry_zone_holder = document.getElementById("entry-zone-holder");
    entry_zone_holder.innerHTML = "";
  }

  set blinking_cursor(index = 0) {
    if (index > this.spacers.length - 1) return this.spacers[this.spacers.length - 1].classList.remove("blink");
    this.spacers.forEach(spacer => spacer.classList.remove("blink"));
    this.spacers[index].classList.add("blink");
  }

  score_guess(guess) {
    const word_answer_as_array = this.word_answer.split("").map(letter => {
      return { letter: letter, score: "disabled" };
    });
    const guess_as_array = guess.split("");
    let scored_guess = [];
    guess_as_array.forEach((letter, index) => {
      let scored_letter = {
        letter: letter,
        score: "disabled"
      };
      if (letter === word_answer_as_array[index].letter) {
        word_answer_as_array[index].score = "green";
        scored_letter.score = "green";
      } else if (word_answer_as_array.map(obj => obj.letter).includes(letter)) {
        // Count the number of occurences of this letter in the word answer
        // Only mark this as yellow if there are fewer either green or yellow marked instances of this letter
        const appearances_of_this_letter = word_answer_as_array.filter(item => item.letter === letter).length;
        const green_or_yellow_appearances = word_answer_as_array.filter(item => item.letter === letter && (item.score === "green" || item.score === "yellow")).length;
        if (appearances_of_this_letter > green_or_yellow_appearances) {
          const index_of_first_non_yellow_or_green_instance_of_letter_in_word_answer_as_array = word_answer_as_array.findIndex(item => item.letter === letter && item.score === "disabled");
          word_answer_as_array[index_of_first_non_yellow_or_green_instance_of_letter_in_word_answer_as_array].score = "yellow";
          scored_letter.score = "yellow";
        }
      }
      scored_guess.push(scored_letter);
    });

    let all_correct = word_answer_as_array.every(item => item.score === "green");
    if (all_correct) {
      this.set_text_message_for_round(true);
    }
    else {
      let any_green = word_answer_as_array.some(item => item.score === "green");
      let any_yellow = word_answer_as_array.some(item => item.score === "yellow");
      this.set_text_message_for_round(false, any_green, any_yellow);
    }
    return scored_guess;
  }

  set_text_message_for_round(got_it_right, any_green=false, any_yellow=false) {
    console.log("pong");
    if (this.text_message_object[`round-${this.active_round}`].length === 0) {
      this.text_message_object[`round-${this.active_round}`].push(`+${this.second}`);
    }
    let stamp = "🟥";
    if (got_it_right) {
      stamp = "🏆";
    }
    else {
      if (any_green) {
        stamp = "🟩";
      } else if (any_yellow) {
        stamp = "🟨";
      }
    }
    this.text_message_object[`round-${this.active_round}`].push(stamp);
    disk.save_for_prop("text_message_object", this.text_message_object);
  }

  get clue_equals_element() {
    return document.getElementById("clue-equals")
  }

  reset_clue_equals() {
    this.clue_equals_element.innerText = "?";
    Array.from(document.querySelectorAll(".entry-zone")).forEach(entry_zone => {
      entry_zone.classList.remove("hide");
    });
  }

  copy_clues_to_history() {
    const history_zone = document.getElementById("history-zone");
    const equation = document.getElementById("equation");
    // Copy equation and insert it into the history zone.
    const equation_copy = equation.cloneNode(true);
    const answer_in_words = document.createElement("span");
    answer_in_words.innerText = this.word_answer;
    answer_in_words.classList.add("answer-in-words");
    equation_copy.appendChild(answer_in_words);
    equation_copy.removeAttribute("id");
    history_zone.appendChild(equation_copy);
    disk.save_for_prop("history", history_zone.innerHTML);
  }

  hide_history() {
    const history_zone = document.getElementById("history-zone");
    history_zone.classList.add("transparent");
  }
  show_history() {
    const history_zone = document.getElementById("history-zone");
    history_zone.classList.remove("transparent");
  }

  hide_entry_zones() {
    Array.from(document.querySelectorAll(".entry-zone")).forEach(entry_zone => {
      entry_zone.classList.add("hide");
    });
  }

  show_just_emoji_answer() {
    this.clue_equals_element.innerText = this.emoji_answer;
  }

  show_answer() {
    this.show_just_emoji_answer();
    this.animate_clue_equals();
    this.hide_entry_zones();
    this.hide_history();
  }

  animate_clue_equals() {
    // Create a copy of the #clue-equals element
    const clue_equals_copy = this.clue_equals_element.cloneNode(true);
    const equation = document.getElementById("equation");

    // Find out the x and y position of the original #clue-equals element
    let rect = this.clue_equals_element.getBoundingClientRect();
    let [x, y, width, height] = [rect.left, rect.top, rect.width, rect.height];

    // Create a new element with the same text content as the original #clue-equals element with the .floating_clue class
    clue_equals_copy.classList.add("floating_clue");
    clue_equals_copy.removeAttribute("id");
    document.body.appendChild(clue_equals_copy);
    const clue_equals_copy_element = document.querySelector(".floating_clue");
    clue_equals_copy_element.style.left = `${x}px`;
    clue_equals_copy_element.style.top = `${y}px`;

    // First make the element really big and move to center.
    let original_font_size = getComputedStyle(clue_equals_copy_element).fontSize;
    clue_equals_copy_element.style.left = `calc(40svw - ${width/2}px)`;
    clue_equals_copy_element.style.top = `calc(40svh - ${height/2}px)`;
    clue_equals_copy_element.style.fontSize = "150px";
    equation.classList.add("transparent");

    // Halfway in, make it the original size again and move it approximately to where it will go
    setTimeout(() => {
      clue_equals_copy_element.style.fontSize = original_font_size;
      const clue_first_element = document.getElementById("clue-first");
      const first_rect = clue_first_element.getBoundingClientRect();
      clue_equals_copy_element.style.left = `calc(0svw + ${first_rect.left + "px"})`;
      clue_equals_copy_element.style.top = `calc(0svw + ${first_rect.top + "px"})`;
      clue_equals_copy_element.style.fontSize = getComputedStyle(clue_first_element).fontSize;
    }, TIME_TO_CELEBRATE/2);
    setTimeout(() => {
      // Now that we know the position of the new first clue, move it exactly there.
      const clue_first_element = document.getElementById("clue-first");
      const first_rect = clue_first_element.getBoundingClientRect();
      clue_equals_copy_element.style.left = first_rect.left + "px";
      clue_equals_copy_element.style.top = first_rect.top + "px";
    }, TIME_TO_CELEBRATE + 100);
    setTimeout(() => {
      equation.classList.remove("transparent");
    }, TIME_TO_CELEBRATE + 200 + 500);
    setTimeout(() => {
      clue_equals_copy.parentNode.removeChild(clue_equals_copy);
    }, TIME_TO_CELEBRATE + 200 + 1000);

  }

  submit_guess(guess) {
    const scored_guess = this.score_guess(guess);
    this.number_of_tries_in_round += 1;

    if (guess === this.word_answer) {
      setTimeout(() => {
        this.copy_clues_to_history();
        this.increment_round();
        this.set_up_round();
      }, TIME_TO_CELEBRATE);
      this.show_answer();
      return false;
    }
    if (this.number_of_tries_in_round === MAX_NUMBER_OF_TRIES) {
      setTimeout(() => {
        this.copy_clues_to_history();
        this.increment_round();
        this.set_up_round();
      }, TIME_TO_CELEBRATE);
      this.show_answer();
      return false;
    }
    else {
      // Make a copy of the entry zone above the current one with green and yellow markers
      const entry_zone = document.getElementById("entry-zone");
      const entry_zone_copy = entry_zone.cloneNode(true);
      const entry_zone_holder = document.getElementById("entry-zone-holder");
      entry_zone_holder.appendChild(entry_zone_copy);
      
      // Find the entry zone we just added
      const last_added_entry_zone = Array.from(entry_zone_holder.querySelectorAll(".entry-zone")).reverse()[0];
      last_added_entry_zone.querySelectorAll(".spacer").forEach((spacer, index) => {
        spacer.classList.add(`score-${scored_guess[index].score}`);
        spacer.classList.remove("blink");
        spacer.innerText = scored_guess[index].letter;
      });
      last_added_entry_zone.removeAttribute("id");
      last_added_entry_zone.classList.remove("main");
    }
    return scored_guess;
  }

  auto_cheat() {
    let number_of_letters_to_reveal = Math.ceil(this.word_answer.length / 5.0)
    // Shadow the first and every fifth character
    let indexes = [0]; // Start with the first index

    // Start from the fifth element (index 4, since arrays are zero-indexed) and then add every fifth element.
    for (let i = 4; i < this.word_answer.length; i += 5) {
      indexes.push(i);
    }

    // Now apply a special class to each of those spacer characters to add a shadow
    // of that letter
    const entry_zone = document.getElementById("entry-zone");
    const spacers = Array.from(entry_zone.querySelectorAll(".spacer"));
    indexes.forEach(index => {
      let letter_to_reveal = this.word_answer.split("")[index].toLowerCase();
      spacers[index].classList.add(`shadow`, `shadow-${letter_to_reveal}`);
    });
  }

  show_curtain() {
    const curtain = document.getElementById("curtain");
    // Copy the contents of #history-zone into #curtain
    curtain.querySelector("#history-copy").innerHTML = document.getElementById("history-zone").innerHTML;

    // Show curtain
    curtain.classList.add("show");

    // Experimenting.
    // curtain.querySelector("#history-copy").innerHTML = `<p>${this.text_message.text.replace(/\n/g, "</p><p>")}</p>`;
  }

  get text_message() {
    const human_readable_todays_date = new Date(this.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const text = `
${this.text_message_object["round-1"].join("")}
${this.text_message_object["round-2"].join("")}
${this.text_message_object["round-3"].join("")}
${this.text_message_object["round-4"].join("")}
${this.text_message_object["round-5"].join("")}
https://everything.io for ${human_readable_todays_date}
    `.trim();
    const title = "I Played Everything";
    const url = "https://everything.io";
    return { title, text, url };
  }
}