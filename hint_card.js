let HINT_CARD_INDEX = 0;
const HINT_CARDS = ["random-letters"];

export const hint_card = {
  show() {
    HINT_CARD_INDEX += 1;
    if (HINT_CARD_INDEX > HINT_CARDS.length - 1) { HINT_CARD_INDEX = 1; }
    document.body.classList.add(`hint-card-${HINT_CARD_INDEX}`);
  },

  hide_all() {
    // Hide all classes that start with hint-card-
    document.body.classList.forEach(className => {
      if (className.startsWith("hint-card-")) {
        document.body.classList.remove(className);
      }
    });
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
  }
}

hint_card.create({
  title: "Stuck?",
  image: "random-letters.jpg",
  text: "Submit random letters to see what sticks.",
  id: 1
});