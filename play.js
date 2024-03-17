import { Game } from "./game.js";
import { games } from "./games.js";
import { Keyboard } from "./keyboard.js";

// Function to format date to YYYY-MM-DD
function formatDate(date) {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

const today = formatDate(new Date());
const todays_game = new Game(games.find(game => game.date === today));
const keyboard = new Keyboard();

document.addEventListener('DOMContentLoaded', () => {
  todays_game.set_up_round();

  keyboard.keys.forEach(key => {
    key.addEventListener('click', (e) => {
      const enter_key_was_pressed = keyboard.type(e, todays_game.spacers.length);
      todays_game.entry = keyboard.entry;
      if (enter_key_was_pressed) {
        let scored_guess = todays_game.submit_guess(keyboard.last_entry);
        keyboard.score_keys(scored_guess);
      }
    });
  });

  document.getElementById("theme-hint").innerHTML = `&ldquo;${todays_game.clue}&rdquo;`;

  const tooltip = document.getElementById("tooltip");
  setInterval(() => {
    tooltip.classList.add("show");
    setTimeout(() => tooltip.classList.remove("show"), 4000);
  }, 20000);

  const clue_equals = document.getElementById("clue-equals")
  clue_equals.addEventListener('click', () => {
    console.log("ping");
    todays_game.show_just_emoji_answer();
  });
});