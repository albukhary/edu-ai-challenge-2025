import Board from "./Board.js";

describe("Board", () => {
  it("places ships randomly without overlap", () => {
    const board = new Board(5);
    board.placeShipRandomly(3);
    board.placeShipRandomly(3);
    // Should have 2 ships, no overlap
    const allLocations = board.ships.flatMap((ship) => ship.locations);
    const uniqueLocations = new Set(allLocations);
    expect(uniqueLocations.size).toBe(allLocations.length);
  });

  it("registers hits and misses correctly", () => {
    const board = new Board(5);
    board.placeShipRandomly(2);
    const ship = board.ships[0];
    let missLoc = "44";
    // Find a location not occupied by a ship
    while (ship.locations.includes(missLoc)) {
      // Just in case, pick another
      missLoc = `${Math.floor(Math.random() * 5)}${Math.floor(
        Math.random() * 5
      )}`;
    }
    const hitResult = board.receiveAttack(ship.locations[0]);
    expect(hitResult.hit).toBe(true);
    const missResult = board.receiveAttack(missLoc);
    expect(missResult.hit).toBe(false);
  });

  it("detects when all ships are sunk", () => {
    const board = new Board(5);
    board.placeShipRandomly(2);
    const ship = board.ships[0];
    for (const loc of ship.locations) {
      board.receiveAttack(loc);
    }
    expect(ship.isSunk()).toBe(true);
    expect(board.allShipsSunk()).toBe(true);
  });
});
