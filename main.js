const overlayScreen = document.querySelector(".overlay-screen");
const difficultyBtns = document.querySelectorAll(".difficulty a");
const nameInput = document.querySelector(".player-name input");
const startBtn = document.querySelector(".start-btn");
const cardsBox = document.querySelector(".cards-box");
const resultMessage = document.querySelector(".result-message");
const resultCloseBtn = document.querySelector(".result-message .close-btn");
const highScoresBtn = document.querySelector(".high-scores-btn");
const playAgainBtn = document.querySelector(".play-again-btn");

let playerName = "User";
let level = 2;
let cardsCount = 20;
let cardsCountArr = [12, 20, 30];
let flippedCardsCount = 0;
let wrongTries = 0;
let duration = 1000;
let score = 0;
let maxScoreArr = [25000, 50000, 100000];
let maxScore = 50000;

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.style.visibility = "visible";
    document.body.style.opacity = 1;
  }, 300);
});

fetch("database/images.json")
  .then((r) => r.json())
  .then((imagesObjArr) => {
    const randomImagesObjArr = getRandomImages(imagesObjArr);
    setupOverlayScreen(imagesObjArr);
    setupCardsBox(randomImagesObjArr);
    setupResultMessageBtns();
  });

function setupOverlayScreen(imagesObjArr) {
  [...difficultyBtns].forEach((btn, index) => {
    btn.onclick = () => {
      [...difficultyBtns].forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      cardsBox.style.opacity = 0;
      setTimeout(() => {
        cardsBox.innerHTML = "";
        level = index + 1;
        cardsCount = cardsCountArr[level - 1];
        maxScore = maxScoreArr[level - 1];
        const randomImagesObjArr = getRandomImages(imagesObjArr);
        setupCardsBox(randomImagesObjArr);
        cardsBox.style.opacity = "100%";
      }, 300);
    };
  });
  startBtn.onclick = () => {
    if (!(nameInput.value === null || nameInput.value === "")) {
      playerName = nameInput.value;
      document.querySelector(".top-info .name").textContent = playerName;
    }
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
    cardsBox.classList = `cards-box level-${level}`;
    const card = document.createElement("a");
    cardsBox.appendChild(card);
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
      checkEndGame();
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

function checkEndGame() {
  if (document.querySelectorAll(".is-matched").length === cardsCount) {
    console.log("You Win!");
    if (wrongTries <= 5) score = maxScore - Math.pow(5, wrongTries);
    else if (wrongTries <= 8)
      score = Math.floor(maxScore - Math.pow(5, 5 + (wrongTries - 5) * 0.2));
    else if (wrongTries <= 19)
      score = Math.floor(maxScore - Math.pow(5, 5.6 + (wrongTries - 8) * 0.1));
    if (score < 0) score = 0;
    document.querySelector(".result-message .score").textContent =
      Math.floor(score);
    resultMessage.style.visibility = "visible";
    resultMessage.style.opacity = "100%";
    const scoreObj = {
      level: level,
      name: playerName,
      score: score,
    };
    if (window.localStorage.getItem("score") === null)
      window.localStorage.setItem("score", "[]");
    const scoreArr = JSON.parse(window.localStorage.getItem("score"));
    scoreArr.push(scoreObj);
    window.localStorage.setItem("score", JSON.stringify(scoreArr));
  }
}

function setupResultMessageBtns() {
  resultCloseBtn.onclick = () => {
    resultMessage.style.opacity = 0;
    setTimeout(() => resultMessage.remove(), 500);
  };
  highScoresBtn.onclick = () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
      window.location.href = "high-scores.html";
    }, 300);
  };
  playAgainBtn.onclick = () => window.location.reload();
}
