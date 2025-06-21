export default class CPU {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.guesses = new Set();
    this.mode = "hunt";
    this.targetQueue = [];
  }

  getRandomGuess() {
    let guess;
    do {
      const row = Math.floor(Math.random() * this.boardSize);
      const col = Math.floor(Math.random() * this.boardSize);
      guess = `${row}${col}`;
    } while (this.guesses.has(guess));
    return guess;
  }

  getNextGuess() {
    if (this.mode === "target" && this.targetQueue.length > 0) {
      return this.targetQueue.shift();
    }
    return this.getRandomGuess();
  }

  addTargets(hitLocation) {
    const row = parseInt(hitLocation[0]);
    const col = parseInt(hitLocation[1]);
    const candidates = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];
    for (const [r, c] of candidates) {
      if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
        const loc = `${r}${c}`;
        if (!this.guesses.has(loc) && !this.targetQueue.includes(loc)) {
          this.targetQueue.push(loc);
        }
      }
    }
  }

  makeMove(playerBoard) {
    let guess = this.getNextGuess();
    this.guesses.add(guess);
    const result = playerBoard.receiveAttack(guess);
    if (result.hit) {
      if (result.sunk) {
        this.mode = "hunt";
        this.targetQueue = [];
      } else {
        this.mode = "target";
        this.addTargets(guess);
      }
    } else {
      if (this.mode === "target" && this.targetQueue.length === 0) {
        this.mode = "hunt";
      }
    }
    return { guess, ...result };
  }
}
