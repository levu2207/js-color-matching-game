import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js';
import {
  getRandomColorPairs,
  showPlayAgainButton,
  setTimeText,
  hidePlayAgainButton,
  createTimer,
  showStartButton,
  hideStartButton,
} from './utils.js';
import {
  getColorElementList,
  getColorListElement,
  getColorBackground,
  getInActiveColorList,
  getPlayAgainButton,
  getStartButton,
  getShowStartButton,
} from './selectors.js';
// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(seconds) {
  // show timer text
  const fullSeconds = `0${seconds}s`.slice(-3);
  setTimeText(fullSeconds);
}
function handleTimerFinish() {
  // end game
  gameStatus = GAME_STATUS.FINISHED;

  setTimeText('GAME OVER');

  showPlayAgainButton();
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function startGame() {
  hideStartButton();
  timer.start();
}

function resetGame() {
  // reset global variables
  gameStatus = GAME_STATUS.PLAYING;
  selections = [];

  // reset DOM elements
  // - remove active class from li
  // - hide play again button
  // - clear you win/ timeout text
  const colorElementList = getColorElementList();
  if (!colorList) throw new Error('Code Error');
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active');
  }

  hidePlayAgainButton();

  showStartButton();

  setTimeText('WELCOME');
  // re-generate new color
  initColor();
}

function attachEventForStartButton() {
  const startButton = getStartButton();
  if (!startButton) throw new Error('Code Error');
  startButton.addEventListener('click', () => {
    startGame();
  });
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (!playAgainButton) throw new Error('Code Error');
  playAgainButton.addEventListener('click', () => {
    resetGame();
  });
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
  const isClicked = liElement.classList.contains('active');
  if (!liElement || isClicked || shouldBlockClick) return;

  // setTimeText('PLAYING');

  liElement.classList.add('active');

  // save click cell to selections
  selections.push(liElement);
  if (selections.length < 2) return;

  // check match
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;

  if (isMatch) {
    // check win
    const isWin = getInActiveColorList().length === 0;

    if (isWin) {
      // show replay button
      showPlayAgainButton();

      // show YOU WIN
      setTimeText('YOU WIN!');

      // update game status
      gameStatus = GAME_STATUS.FINISHED;
      // clear timer
      timer.clear();
    }
    // change background color
    const changeColor = getColorBackground();
    if (!changeColor) throw new Error('Code Error');

    changeColor.style.backgroundColor = firstColor;

    selections = [];
    return;
  }

  // in case of not match
  // remove active class for 2 li element
  // block click
  gameStatus = GAME_STATUS.BLOCKING;

  setTimeout(() => {
    selections[0].classList.remove('active');
    selections[1].classList.remove('active');

    // reset selections for the next turn
    selections = [];
    // update game status
    gameStatus = GAME_STATUS.PLAYING;
  }, 500);
}

function initColor() {
  // random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT);

  // bind to li > div.overlay
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    // dataset color to li element
    liElement.dataset.color = colorList[index];

    const overlayElement = liElement.querySelector('.overlay');
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  });
}

function attachEventForColorlist() {
  const ulElement = getColorListElement();
  const showStartButton = getShowStartButton();
  if (!ulElement) return;

  // event delegation
  ulElement.addEventListener('click', (event) => {
    const showStartButton = getShowStartButton();
    if (event.target.tagName !== 'LI' || showStartButton) return;

    handleColorClick(event.target);
  });
}

// main
(() => {
  initColor();

  attachEventForColorlist();

  attachEventForStartButton();

  attachEventForPlayAgainButton();
})();
