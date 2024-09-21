document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.style.visibility = "visible";
    document.body.style.opacity = 1;
  }, 300);
});

const scores = JSON.parse(window.localStorage.score);
let level1Scores = [];
let level2Scores = [];
let level3Scores = [];
scores.forEach((scoreObj) => {
  switch (scoreObj.level) {
    case 1:
      level1Scores.push(scoreObj);
      break;
    case 2:
      level2Scores.push(scoreObj);
      break;
    case 3:
      level3Scores.push(scoreObj);
  }
});
level1Scores.sort((a, b) => b.score - a.score);
level2Scores.sort((a, b) => b.score - a.score);
level3Scores.sort((a, b) => b.score - a.score);

const easyTableNames = document.querySelectorAll(".easy .name");
const mediumTableNames = document.querySelectorAll(".medium .name");
const hardTableNames = document.querySelectorAll(".hard .name");
const easyTableScores = document.querySelectorAll(".easy .score");
const mediumTableScores = document.querySelectorAll(".medium .score");
const hardTableScores = document.querySelectorAll(".hard .score");

for (let i = 0; i < level1Scores.length && i < 10; i++) {
  easyTableNames[i].textContent = level1Scores[i].name;
  easyTableScores[i].textContent = level1Scores[i].score;
}
for (let i = 0; i < level2Scores.length && i < 10; i++) {
  mediumTableNames[i].textContent = level2Scores[i].name;
  mediumTableScores[i].textContent = level2Scores[i].score;
}
for (let i = 0; i < level3Scores.length && i < 10; i++) {
  hardTableNames[i].textContent = level3Scores[i].name;
  hardTableScores[i].textContent = level3Scores[i].score;
}
