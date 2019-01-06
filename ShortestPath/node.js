class Node {
  constructor(x, y, next) {
    this.x = x;
    this.y = y;
    this.next = next;
  }

  equals(other) {
    return this.x === other.x &&
      this.y === other.y &&
      this.next === other.next;
  }
}
