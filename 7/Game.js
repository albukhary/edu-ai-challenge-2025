import Board from "./Board.js";
import CPU from "./CPU.js";
import UI from "./UI.js";

export default class Game {
  constructor({ boardSize = 10, numShips = 3, shipLength = 3 } = {}) {
    this.boardSize = boardSize;
    this.numShips = numShips;
    this.shipLength = shipLength;
    this.playerBoard = new Board(boardSize);
    this.cpuBoard = new Board(boardSize);
    this.cpu = new CPU(boardSize);
    this.ui = new UI();
    this.playerGuesses = new Set();
  }

  setupBoards() {
    for (let i = 0; i < this.numShips; i++) {
      this.playerBoard.placeShipRandomly(this.shipLength);
      this.cpuBoard.placeShipRandomly(this.shipLength);
    }
  }

  async playerTurn() {
    let valid = false;
    let guess;
    while (!valid) {
      guess = await this.ui.prompt("Enter your guess (e.g., 00): ");
      if (!/^[0-9]{2}$/.test(guess)) {
        this.ui.print("Input must be exactly two digits (e.g., 00, 34, 98).");
        continue;
      }
      if (this.playerGuesses.has(guess)) {
        this.ui.print("You already guessed that location!");
        continue;
      }
      const row = parseInt(guess[0]);
      const col = parseInt(guess[1]);
      if (
        isNaN(row) ||
        isNaN(col) ||
        row < 0 ||
        row >= this.boardSize ||
        col < 0 ||
        col >= this.boardSize
      ) {
        this.ui.print(
          `Please enter valid row and column numbers between 0 and ${
            this.boardSize - 1
          }.`
        );
        continue;
      }
      valid = true;
    }
    this.playerGuesses.add(guess);
    const result = this.cpuBoard.receiveAttack(guess);
    if (result.hit) {
      this.ui.print("PLAYER HIT!");
      if (result.sunk) {
        this.ui.print("You sunk an enemy battleship!");
      }
    } else {
      this.ui.print("PLAYER MISS.");
    }
  }

  async cpuTurn() {
    this.ui.print("\n--- CPU's Turn ---");
    const { guess, hit, sunk } = this.cpu.makeMove(this.playerBoard);
    if (hit) {
      this.ui.print(`CPU HIT at ${guess}!`);
      if (sunk) {
        this.ui.print("CPU sunk your battleship!");
      }
    } else {
      this.ui.print(`CPU MISS at ${guess}.`);
    }
  }

  printBoards() {
    const cpuView = this.cpuBoard.display(true).split("\n");
    const playerView = this.playerBoard.display(false).split("\n");
    this.ui.print("\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---");
    for (let i = 0; i < this.boardSize + 1; i++) {
      this.ui.print((cpuView[i] || "").padEnd(25) + (playerView[i] || ""));
    }
    this.ui.print("");
  }

  async play() {
    this.setupBoards();
    this.ui.print("\nLet's play Sea Battle!");
    this.ui.print(`Try to sink the ${this.numShips} enemy ships.`);
    while (true) {
      if (this.cpuBoard.allShipsSunk()) {
        this.ui.print(
          "\n*** CONGRATULATIONS! You sunk all enemy battleships! ***"
        );
        this.printBoards();
        this.ui.close();
        break;
      }
      if (this.playerBoard.allShipsSunk()) {
        this.ui.print(
          "\n*** GAME OVER! The CPU sunk all your battleships! ***"
        );
        this.printBoards();
        this.ui.close();
        break;
      }
      this.printBoards();
      await this.playerTurn();
      if (this.cpuBoard.allShipsSunk()) continue;
      await this.cpuTurn();
    }
  }
}
