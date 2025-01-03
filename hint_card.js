let HINT_CARD_INDEX = 0;
let HINT_CARDS = [];
const INTERVAL_TIMER = 60 * 1000;
let interval;

export const hint_card = {
  show() {
    this.hide_all();
    HINT_CARD_INDEX += 1;
    if (HINT_CARD_INDEX > HINT_CARDS.length) { HINT_CARD_INDEX = 1; }
    document.body.classList.add(`hint-card-${HINT_CARD_INDEX}`);
  },

  hide_all() {
    // Hide all classes that start with hint-card-
    document.body.classList.forEach(className => {
      if (className.startsWith("hint-card-")) {
        document.body.classList.remove(className);
      }
    });
    window.clearInterval(interval);
    interval = window.setInterval(() => {
      this.show();
    }, INTERVAL_TIMER);
  },

  create(options) {
    const hint_card_template = document.getElementById("hint-card");
    const hint_card = document.importNode(hint_card_template.content, true);
    hint_card.querySelector(".hint-card-title").textContent = options.title;
    hint_card.querySelector(".hint-card-image").src = `images/${options.image}`;
    hint_card.querySelector(".hint-card-text").textContent = options.text;
    document.querySelector(".game-board").appendChild(hint_card);
    const card_element = Array.from(document.querySelectorAll(".hint-card")).reverse()[0];
    card_element.dataset.hintCard = options.id;
    card_element.querySelector(".hint-card-close").addEventListener("click", () => {
      this.hide_all();
    });
    return options.title;
  }
}

HINT_CARDS = [
  hint_card.create({
    title: "Stuck?",
    image: "random-letters.jpg",
    text: "Submit random letters to see what sticks.",
    id: 1
  }),

  hint_card.create({
    title: "Use hints",
    image: "hint-letters.jpg",
    text: "Look closely. Faded letters give away missing letters.",
    id: 2
  }),
];

hint_card.hide_all();