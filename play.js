import { Game } from "./game.js";
import { games } from "./games.js";
import { Keyboard } from "./keyboard.js";
import { disk } from "./disk.js";

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
  // First let's see if there is a game to load
  const saved_game = disk.saved;
  if (saved_game && saved_game.date === todays_game.date) {
    todays_game.active_round = saved_game.active_round;
    todays_game.history = saved_game.history;
    const history_zone = document.getElementById("history-zone");
    history_zone.innerHTML = saved_game.history;
    todays_game.text_message_object = saved_game.text_message_object;
  } else { 
    console.log("No saved game found for today"); 
    let game = {
      date: todays_game.date,
      active_round: todays_game.active_round,
      history: todays_game.history,
      text_message_object: todays_game.text_message_object
    }
    disk.save(game);
  }

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

  const share_button = document.getElementById("share");
  share_button.addEventListener('click', () => {
    navigator.share(todays_game.text_message);
  });
  if (!navigator.share) { 
    share_button.classList.add('hide');
  }

  const play_again = document.getElementById("play-again");
  play_again.addEventListener('click', () => {
    disk.clear();
    location.reload();
  });

  // Allow for typing on desktop
  document.addEventListener('keyup', function(event) {
    // REFACTOR NEEDED: Copies implementation from keyboard.js and elsewhere to make this work the same way.
    let e = undefined ;
    if (event.key.match(/^[a-z]$/i)) {
        e = {target: { textContent: event.key.toUpperCase() } }
    }
    if (event.key === "Backspace") {
        e = { target: { id: "backspace", textContent: "" } };
    }
    if (event.key === "Enter") {
        e = { target: { textContent: "⮐" } }
        event.preventDefault();
        keyboard.type(e, todays_game.spacers.length)
        todays_game.entry = keyboard.entry;
        let scored_guess = todays_game.submit_guess(keyboard.last_entry);
        return keyboard.score_keys(scored_guess);
    }
    if (e) {
      event.preventDefault();
      keyboard.type(e, todays_game.spacers.length)
      todays_game.entry = keyboard.entry;
    }
  });
});