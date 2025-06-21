export default class Ship {
  constructor(locations) {
    this.locations = locations; // Array of coordinate strings, e.g., ['00', '01', '02']
    this.hits = Array(locations.length).fill(false);
  }

  hit(location) {
    const idx = this.locations.indexOf(location);
    if (idx !== -1 && !this.hits[idx]) {
      this.hits[idx] = true;
      return true;
    }
    return false;
  }

  isSunk() {
    return this.hits.every(Boolean);
  }
}
