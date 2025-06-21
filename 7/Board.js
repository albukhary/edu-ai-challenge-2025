import Ship from "./Ship.js";

export default class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill("~"));
    this.ships = [];
  }

  placeShipRandomly(shipLength) {
    let placed = false;
    while (!placed) {
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
      let startRow, startCol;
      if (orientation === "horizontal") {
        startRow = Math.floor(Math.random() * this.size);
        startCol = Math.floor(Math.random() * (this.size - shipLength + 1));
      } else {
        startRow = Math.floor(Math.random() * (this.size - shipLength + 1));
        startCol = Math.floor(Math.random() * this.size);
      }
      const locations = [];
      let collision = false;
      for (let i = 0; i < shipLength; i++) {
        const row = orientation === "horizontal" ? startRow : startRow + i;
        const col = orientation === "horizontal" ? startCol + i : startCol;
        if (this.grid[row][col] !== "~") {
          collision = true;
          break;
        }
        locations.push(`${row}${col}`);
      }
      if (!collision) {
        const ship = new Ship(locations);
        this.ships.push(ship);
        for (const loc of locations) {
          const row = parseInt(loc[0]);
          const col = parseInt(loc[1]);
          this.grid[row][col] = "S";
        }
        placed = true;
      }
    }
  }

  receiveAttack(location) {
    const row = parseInt(location[0]);
    const col = parseInt(location[1]);
    for (const ship of this.ships) {
      if (ship.hit(location)) {
        this.grid[row][col] = "X";
        return { hit: true, sunk: ship.isSunk() };
      }
    }
    this.grid[row][col] = "O";
    return { hit: false };
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  display(hideShips = true) {
    let str = "  " + [...Array(this.size).keys()].join(" ") + "\n";
    for (let i = 0; i < this.size; i++) {
      str += i + " ";
      for (let j = 0; j < this.size; j++) {
        let cell = this.grid[i][j];
        if (hideShips && cell === "S") cell = "~";
        str += cell + " ";
      }
      str += "\n";
    }
    return str;
  }
}
