import Game from "./Game.js";

class MockUI {
  constructor() {
    this.messages = [];
    this.prompts = [];
    this.promptIndex = 0;
  }
  async prompt() {
    return this.prompts[this.promptIndex++];
  }
  print(msg) {
    this.messages.push(msg);
  }
  close() {}
}

describe("Game", () => {
  it("detects player win when all CPU ships are sunk", async () => {
    const game = new Game({ boardSize: 5, numShips: 1, shipLength: 1 });
    game.ui = new MockUI();
    game.cpuBoard.placeShipRandomly(1);
    const loc = game.cpuBoard.ships[0].locations[0];
    game.ui.prompts = [loc];
    // Simulate one player turn, should win
    await game.playerTurn();
    expect(game.cpuBoard.ships[0].isSunk()).toBe(true);
  });

  it("detects player loss when all player ships are sunk", async () => {
    const game = new Game({ boardSize: 5, numShips: 1, shipLength: 1 });
    game.ui = new MockUI();
    game.playerBoard.placeShipRandomly(1);
    const loc = game.playerBoard.ships[0].locations[0];
    // Simulate CPU hitting the only ship
    game.cpu.guesses.clear();
    game.cpu.targetQueue = [loc];
    game.cpu.mode = "target";
    await game.cpuTurn();
    expect(game.playerBoard.ships[0].isSunk()).toBe(true);
  });
});
