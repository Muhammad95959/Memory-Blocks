const overlayScreen = document.querySelector(".overlay-screen");
const difficultyBtns = document.querySelectorAll(".difficulty a");
const nameInput = document.querySelector(".player-name input");
const startBtn = document.querySelector(".start-btn");
const cardsBox = document.querySelector(".cards-box");

let level = 2;
let cardsCount = 20;
let cardsCountArr = [12, 20, 30];
let flippedCardsCount = 0;
let wrongTries = 0;
let duration = 1000;

fetch("database/images.json")
  .then((r) => r.json())
  .then((imagesObjArr) => {
    document.body.style.visibility = "visible";
    document.body.style.opacity = "100%";
    const randomImagesObjArr = getRandomImages(imagesObjArr);
    setupOverlayScreen(imagesObjArr);
    setupCardsBox(randomImagesObjArr);
  });

function setupOverlayScreen(imagesObjArr) {
  [...difficultyBtns].forEach((btn, index) => {
    btn.onclick = () => {
      [...difficultyBtns].forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      cardsBox.innerHTML = "";
      level = index + 1;
      cardsCount = cardsCountArr[level - 1];
      const randomImagesObjArr = getRandomImages(imagesObjArr);
      setupCardsBox(randomImagesObjArr);
    };
  });
  startBtn.onclick = () => {
    let name = nameInput.value;
    if (!(name === null || name === ""))
      document.querySelector(".top-info .name").textContent = name;
    overlayScreen.style.transition = "opacity 0.5s";
    overlayScreen.style.opacity = "0";
    setTimeout(() => overlayScreen.remove(), 500);
  };
}

function getRandomImages(imagesObjArr) {
  let randomImagesObjArr = new Array(cardsCount);
  let imagesIndexes = [...new Array(imagesObjArr.length).keys()];
  let indexes = [...new Array(cardsCount).keys()];
  for (let i = 0; i < cardsCount / 2; i++) {
    const randomImageIndex = imagesIndexes.splice(
      Math.floor(Math.random() * imagesIndexes.length),
      1,
    );
    const randomImage = imagesObjArr[randomImageIndex];
    for (let j = 0; j < 2; j++)
      randomImagesObjArr[
        indexes.splice(Math.floor(Math.random() * indexes.length), 1)
      ] = randomImage;
  }
  return randomImagesObjArr;
}

function setupCardsBox(randomImagesObjArr) {
  [...randomImagesObjArr].forEach((imageObj, index) => {
    const card = document.createElement("div");
    cardsBox.appendChild(card);
    cardsBox.classList = "";
    cardsBox.classList = `cards-box level-${level}`;
    card.classList.add(`card-${index + 1}`);
    card.setAttribute("image-id", imageObj.id);
    card.onclick = () => setupCardFlip(card);
    const back = document.createElement("div");
    card.appendChild(back);
    back.classList.add("back");
    back.textContent = "?";
    const front = document.createElement("div");
    card.appendChild(front);
    front.classList.add("front");
    const img = document.createElement("img");
    front.appendChild(img);
    img.src = imageObj.path;
  });
}

function setupCardFlip(card) {
  flippedCardsCount++;
  card.classList.add("is-flipped");
  const flippedCards = document.querySelectorAll(".is-flipped");
  if (flippedCardsCount === 2) {
    if (
      flippedCards[0].getAttribute("image-id") ===
      flippedCards[1].getAttribute("image-id")
    ) {
      flippedCards.forEach((c) => {
        c.classList.add("is-matched");
        c.classList.remove("is-flipped");
      });
    } else {
      increaseWrongTries();
      flippedCards.forEach((c) => {
        c.classList.remove("is-flipped");
        c.classList.add("is-unflipping");
      });
      setTimeout(() => {
        flippedCards.forEach((c) => c.classList.remove("is-unflipping"));
      }, duration);
    }
    flippedCardsCount = 0;
  }
}

function increaseWrongTries() {
  wrongTries++;
  document.querySelector(".wrong-tries").textContent = wrongTries;
}
