const cardsBox = document.querySelector(".cards-box");
let level = 1;
let cardsCount = 20;
let flippedCardsCount = 0;
let wrongTries = 0;
let duration = 1000;

fetch("database/images.json")
  .then((r) => r.json())
  .then((imagesObjArr) => {
    const randomImagesObjArr = getRandomImages(imagesObjArr);
    setupCardsBox(randomImagesObjArr);
  });

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
      setTimeout(() => {
        flippedCards.forEach((c) => c.classList.remove("is-flipped"));
      }, duration);
    }
    flippedCardsCount = 0;
  }
}

function increaseWrongTries() {
  wrongTries++;
  document.querySelector(".wrong-tries").textContent = wrongTries;
}
