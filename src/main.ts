import { createGame, } from './Game';
import { generateRandomLevel } from './LevelGenerator';
import { LEVELS } from './Levels';
import './style.css'

const scoreBoard = document.getElementById("score")!;

const storedScore = localStorage.getItem("tileGame:score");
let score = storedScore ? JSON.parse(storedScore) - 1 : 0;
const increaseScore = () => {
  score++;
  scoreBoard.textContent = `Score: ${score}`;
  localStorage.setItem("tileGame:score", `${score}`);
}
let size = Math.max((Math.min(Math.floor((score / 10) * 4), 16)), 4);
const playRandomGeneratedLevel = () => {
  let level;
  do {
    try {
      level = generateRandomLevel(size, size)
    } catch (e) {
      console.error(e);
    }
  } while (!level);
  createGame(document.getElementById("app")!, level, playRandomGeneratedLevel);
  increaseScore();
  if (score % 10 === 0 && size < 16) {
    size += 4;
  }
};

const tutorialCleared = localStorage.getItem("tileGame:tutorial") === "true";
let currentLevel = -1;
const nextLevel = () => {
  currentLevel++;
  if (currentLevel >= LEVELS.length || tutorialCleared) {
    playRandomGeneratedLevel();
    localStorage.setItem("tileGame:tutorial", "true");
  } else {
    createGame(document.getElementById("app")!, LEVELS[currentLevel], nextLevel);
  }
};
nextLevel();
