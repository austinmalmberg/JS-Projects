

const SIZE = 480;
const TILES_IN_ROW = 3; // 3 IS THE ONLY SUPPORTED BOARD SIZE AT THIS TIME
const TILE_SIZE = SIZE / TILES_IN_ROW;

let canvas, board;
const turnCursorSize = 20;

// P5 FUNCTIONS

function setup() {

  canvas = createCanvas(SIZE, SIZE);
  canvas.parent('tictactoe-container');

  noCursor();
  noFill();

  canvas.mousePressed(handleClick);
  newGame();
}

function draw() {
  clear();

  board.draw();

  if (board.running) {

    noCursor();
    drawTurnCursor(board.xTurn);

  } else {

    cursor(ARROW);

  }
}

function newGame() {
  board = new Board(SIZE, TILES_IN_ROW);
}


function handleClick() {

  if (board.running)
    board.takeTurn(mouseX, mouseY);
  else
    newGame();

}

function drawTurnCursor(xTurn) {

  // prevent cursor from being drawn initially
  if (mouseX === 0 && mouseY === 0)
    return false;

  push();

  fill(255);
  strokeWeight(2);

  let left = mouseX - turnCursorSize;
  let top = mouseY - turnCursorSize;
  let right = mouseX + turnCursorSize;
  let bottom = mouseY + turnCursorSize;

  if (board.xTurn) {
    line(left, top, right, bottom);
    line(right, top, left, bottom);
  } else {
    circle(mouseX, mouseY, turnCursorSize * 2);
  }

  pop();

  return true;
}

class Board {
  constructor(size, tilesInRow=3) {
    // dimensions
    this.size = size;
    this.tilesInRow = tilesInRow; // 3 IS THE ONLY SUPPORTED BOARD SIZE AT THIS TIME
    this.tileSize = this.size / this.tilesInRow;

    // init game
    this.board = [...Array(tilesInRow * tilesInRow).keys()].map(i => new Tile(i));
    this.running = true;
    this.xTurn = true;
  }

  takeTurn(mouseX, mouseY) {

    let tile = this.getTile(mouseX, mouseY);
    let placed = tile.setPiece(this.xTurn);

    if (placed) {

      // determine if there is a winner
      this.checkForWinners(this.xTurn);

      if (typeof this.xWins != 'undefined') {
        this.running = false;
        return this.xWins;
      }

      // stop when no winner
      let occupiedTiles = this.board.filter(tile => tile.hasPiece());
      if (occupiedTiles.length === this.board.length) {
        this.running = false;
        this.xWins = null;

        return this.xWins;
      }

      // change turns
      this.xTurn = !this.xTurn;
    }

    return this.xWins;
  }

  /**
   * NOTE: Currently only supports 3x3 grid.
  */
  checkForWinners(xTurn) {

    // gets an array of indexes associated with the pieces of the given turn
    let pieces = this.board
        .filter(tile => tile.xPiece === xTurn)
        .map(tile => tile.index);

    if (pieces.length < 3)
      return [];

    let winConditions = [
      // rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      // columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      // diagonals
      [0, 4, 8],
      [2, 4, 6]
    ];

    let winners = winConditions.filter(condition => condition.every(i => pieces.includes(i)));

    if (winners.length > 0) {
      this.xWins = xTurn;

      // set winning tiles
      winners.reduce((acc, arr) => acc.concat(arr), [])
        .map(i => this.board[i])
        .forEach(tile => tile.winner = true);
    }
  }

  /**
   * Takes mouse position and returns the tile associated with it
   */
  getTile(mouseX, mouseY) {
    let c = Math.floor(mouseX / TILE_SIZE);
    let r = Math.floor(mouseY / TILE_SIZE);

    let index = r * TILES_IN_ROW + c;

    return this.board[index];
  }

  draw() {
    for (let tile of this.board)
      tile.draw();

    if (!this.running)
      this.drawOutcome();
  }

  drawOutcome() {

    let outcomeText;

    if (this.xWins === null)
      outcomeText = 'Draw! Nobody wins.';
    else
      outcomeText = `${this.xWins ? 'X' : 'O'} wins!`;

    push();


    textAlign(CENTER, CENTER);
    textSize(48);

    fill(255);

    rectMode(CENTER);
    rect(SIZE / 2, SIZE / 2, SIZE - 40, 60);

    fill(0);

    text(outcomeText, SIZE / 2, SIZE / 2 + 4);

    pop();
  }
}

class Tile {
  constructor(index) {
    this.index = index;
    this.padding = TILE_SIZE * 0.2;
    this.r = Math.floor(index / TILES_IN_ROW);
    this.c = index % TILES_IN_ROW;
  }

  draw() {

    // outline the tile
    square(this.c * TILE_SIZE, this.r * TILE_SIZE, TILE_SIZE);

    // store previous draw settings
    push();

    strokeWeight(3);

    if (this.winner)
      stroke(255, 0, 0);
    else
      stroke(0);

    // draw 'X' or 'O'
    if (this.hasPiece()) {

      if (this.xPiece) {

        let left = this.c * TILE_SIZE + this.padding;
        let top = this.r * TILE_SIZE + this.padding;
        let right = (1 + this.c) * TILE_SIZE - this.padding;
        let bottom = (1 + this.r) * TILE_SIZE - this.padding;

        line(left, top, right, bottom);
        line(right, top, left, bottom);

      } else {

        let centerOffset = TILE_SIZE * 0.5;

        let x = this.c * TILE_SIZE + centerOffset;
        let y = this.r * TILE_SIZE + centerOffset;
        let r = TILE_SIZE - this.padding * 2;

        circle(x, y, r);
      }
    }

    // revert to stored draw settings
    pop();
  }

  hasPiece() {
    return (typeof this.xPiece === 'boolean');
  }

  setPiece(xTurn) {

    // do nothing if piece is already placed
    if (this.hasPiece())
      return false;

    this.xPiece = xTurn;

    console.log(`${xTurn ? 'X' : 'O'} placed on board at (${this.r}, ${this.c})`);

    return true;
  }
}
