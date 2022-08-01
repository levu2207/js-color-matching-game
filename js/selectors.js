export function getColorElementList() {
  return document.querySelectorAll('#colorList > li');
}

export function getColorListElement() {
  return document.getElementById('colorList');
}

export function getTimerElement() {
  return document.querySelector('.game .game__timer');
}

export function getPlayAgainButton() {
  return document.querySelector('.game .game__button-replay');
}

export function getStartButton() {
  return document.querySelector('.game .game__button-start');
}

export function getShowStartButton() {
  return document.querySelector('.game .game__button-start.show');
}

export function getColorBackground() {
  return document.querySelector('.color-background');
}
export function getInActiveColorList() {
  return document.querySelectorAll('#colorList > li:not(.active)');
}
