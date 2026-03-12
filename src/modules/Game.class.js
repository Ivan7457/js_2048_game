'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    this.hasStarted = false;

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    let change = false;

    if (this.status !== 'playing') {
      return;
    }

    for (let i = 0; i < this.board.length; i++) {
      const { newLine, gained } = this.processLineLeft(this.board[i]);

      if (JSON.stringify(newLine) !== JSON.stringify(this.board[i])) {
        this.board[i] = newLine;
        this.score += gained;
        change = true;
      }
    }
    this.afterMove(change);
  }

  moveRight() {
    let change = false;

    for (let i = 0; i < this.board.length; i++) {
      const reversed = [...this.board[i]].reverse();

      const { newLine, gained } = this.processLineLeft(reversed);

      const finalLine = newLine.reverse();

      if (JSON.stringify(finalLine) !== JSON.stringify(this.board[i])) {
        this.board[i] = finalLine;
        this.score += gained;
        change = true;
      }
    }

    this.afterMove(change);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let change = false;

    const transposed = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );

    for (let i = 0; i < transposed.length; i++) {
      const { newLine, gained } = this.processLineLeft(transposed[i]);

      if (JSON.stringify(newLine) !== JSON.stringify(transposed[i])) {
        transposed[i] = newLine;
        this.score += gained;
        change = true;
      }
    }

    this.board = transposed[0].map((_, colIndex) =>
      transposed.map((row) => row[colIndex]),
    );
    this.afterMove(change);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let change = false;

    const transposed = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );

    for (let i = 0; i < transposed.length; i++) {
      const reversed = [...transposed[i]].reverse();
      const { newLine, gained } = this.processLineLeft(reversed);
      const finalLine = newLine.reverse();

      if (JSON.stringify(finalLine) !== JSON.stringify(transposed[i])) {
        transposed[i] = finalLine;
        this.score += gained;
        change = true;
      }
    }

    this.board = transposed[0].map((_, colIndex) =>
      transposed.map((row) => row[colIndex]),
    );

    this.afterMove(change);
  }

  addRandomTile() {
    const arr = [];

    for (let a = 0; a < this.board.length; a++) {
      for (let b = 0; b < this.board[a].length; b++) {
        if (this.board[a][b] === 0) {
          arr.push([a, b]);
        }
      }
    }

    if (arr.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);

    const [r, c] = arr[randomIndex];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = value;
  }

  isMovePossible() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'won';

          return;
        }
      }
    }
  }

  processLineLeft(line) {
    const compact = line.filter((v) => v !== 0);
    let gained = 0;

    for (let i = 0; i < compact.length - 1; i++) {
      if (compact[i] === compact[i + 1]) {
        compact[i] = compact[i] * 2;
        gained += compact[i];
        compact[i + 1] = 0;
      }
    }

    const newCompact = compact.filter((v) => v !== 0);

    while (newCompact.length < 4) {
      newCompact.push(0);
    }

    return { newLine: newCompact, gained };
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => row.slice());
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';
    this.hasStarted = true;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  afterMove(didChange) {
    if (!didChange) {
      return;
    }
    this.addRandomTile();
    this.checkWin();

    if (this.status !== 'won' && !this.isMovePossible()) {
      this.status = 'lost';
    }
  }
}

module.exports = Game;
