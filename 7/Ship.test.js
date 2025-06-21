import Ship from "./Ship.js";

describe("Ship", () => {
  it("registers hits correctly", () => {
    const ship = new Ship(["00", "01", "02"]);
    expect(ship.hit("00")).toBe(true);
    expect(ship.hits).toEqual([true, false, false]);
    expect(ship.hit("01")).toBe(true);
    expect(ship.hits).toEqual([true, true, false]);
    expect(ship.hit("02")).toBe(true);
    expect(ship.hits).toEqual([true, true, true]);
  });

  it("does not register a hit twice on the same location", () => {
    const ship = new Ship(["00", "01", "02"]);
    expect(ship.hit("00")).toBe(true);
    expect(ship.hit("00")).toBe(false);
  });

  it("returns false for locations not part of the ship", () => {
    const ship = new Ship(["00", "01", "02"]);
    expect(ship.hit("10")).toBe(false);
  });

  it("isSunk returns true only when all parts are hit", () => {
    const ship = new Ship(["00", "01", "02"]);
    expect(ship.isSunk()).toBe(false);
    ship.hit("00");
    ship.hit("01");
    expect(ship.isSunk()).toBe(false);
    ship.hit("02");
    expect(ship.isSunk()).toBe(true);
  });
});
