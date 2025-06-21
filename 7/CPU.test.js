import CPU from "./CPU.js";
import Board from "./Board.js";

describe("CPU", () => {
  it("makes valid guesses and does not repeat", () => {
    const cpu = new CPU(5);
    const guesses = new Set();
    for (let i = 0; i < 10; i++) {
      const guess = cpu.getRandomGuess();
      expect(guesses.has(guess)).toBe(false);
      guesses.add(guess);
      cpu.guesses.add(guess);
    }
  });

  it("switches to target mode after a hit and back to hunt after sinking", () => {
    const cpu = new CPU(5);
    const board = new Board(5);
    board.placeShipRandomly(2);
    const ship = board.ships[0];
    // Force CPU to guess a ship location
    cpu.targetQueue = [];
    cpu.mode = "hunt";
    cpu.guesses.clear();
    const result = cpu.makeMove({
      receiveAttack: (loc) => {
        if (loc === ship.locations[0]) {
          return { hit: true, sunk: false };
        }
        return { hit: false };
      },
    });
    expect(cpu.mode).toBe("target");
    // Now simulate sinking
    cpu.targetQueue = [];
    const result2 = cpu.makeMove({
      receiveAttack: () => ({ hit: true, sunk: true }),
    });
    expect(cpu.mode).toBe("hunt");
  });
});
