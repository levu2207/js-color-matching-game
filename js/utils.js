import { getPlayAgainButton, getTimerElement, getStartButton } from './selectors.js';
import { GAME_STATUS, GAME_TIME } from './constants.js';
function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr;
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i); // create the number < i
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = [];
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

  // radom count color list
  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    });

    colorList.push(color);
  }
  // double current color list
  const fullColorList = [...colorList, ...colorList];

  // shuffle colors
  shuffle(fullColorList);

  return fullColorList;
};

export function showStartButton() {
  const startButton = getStartButton();
  if (!startButton) throw new Error('Code Error');
  startButton.classList.add('show');
}

export function hideStartButton() {
  const startButton = getStartButton();
  if (!startButton) throw new Error('Code Error');
  startButton.classList.remove('show');
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (!playAgainButton) throw new Error('Code Error');
  playAgainButton.classList.add('show');
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (!playAgainButton) throw new Error('Code Error');
  playAgainButton.classList.remove('show');
}

export function setTimeText(text) {
  const showYouWin = getTimerElement();
  if (!showYouWin) throw new Error('Code Error');
  showYouWin.textContent = text;
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null;
  clear();

  function start() {
    let currentSeconds = seconds;
    intervalId = setInterval(() => {
      // if(onChange) onChange(currentSeconds)
      onChange?.(currentSeconds);

      currentSeconds--;

      if (currentSeconds < 0) {
        clear();
        onFinish?.();
      }
    }, 1000);
  }

  function clear() {
    clearInterval(intervalId);
  }

  return {
    start,
    clear,
  };
}
