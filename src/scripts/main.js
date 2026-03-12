'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

function render(state) {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell) => {
    const [r, c] = cell.dataset.pos.split('-').map(Number);
    const value = state[r][c];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

const button = document.getElementsByClassName('button');

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }
  render();
});

button.addEventListener('click', (e) => {
  if (!game.hasStarted) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    render(game.getState());
  }
});
