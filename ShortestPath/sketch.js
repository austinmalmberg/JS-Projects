/**
You are given an M by N matrix consisting of booleans that represents a board.
Each True boolean represents a wall. Each False boolean represents a tile you can walk on.

Given this matrix, a start coordinate, and an end coordinate, return the minimum number
of steps required to reach the end coordinate from the start. If there is no possible path,
then return null. You can move up, left, down, and right. You cannot move through walls.
You cannot wrap around the edges of the board.

For example, given the following board:

[[f, f, f, f],
[t, t, f, t],
[f, f, f, f],
[f, f, f, f]]

and start = (3, 0) (bottom left) and end = (0, 0) (top left), the minimum number of steps
required to reach the end is 7, since we would need to go through (1, 2) because there is
a wall everywhere else on the second row.
*/

// canvas variables
const cWidth = 400;
const cHeight = 400;
let tileSize;

// example variables
const matrix = [
  [false, false, false, false],
  [true , true , false, true ],
  [false, false, false, false],
  [false, false, false, false],
];
const w = 4;
const h = 4;

let bfs = new BFS();
let shortestPath;

function setup() {
  createCanvas(cWidth+1, cHeight+1);

  tileSize = {
    w: cWidth / w,
    h: cHeight / h
  }

  shortestPath = bfs.getShortestPath(matrix, new Node(3, 0), new Node(0, 0));
}

function draw() {
  stroke(0);

  // draw matrix
  for(let row = 0; row < matrix.length; row++) {

    for(let col = 0; col < matrix[row].length; col++) {
      let tile = matrix[row][col];
      if(tile) {  // draw a wall if true
          fill(0);
      } else {
        noFill();
      }
      rect(col * tileSize.w, row * tileSize.h, tileSize.w, tileSize.h);
    }
  }

  // draw ellipse for each point along shortestPath
  shortestPath.forEach(function(node) {
    fill(0, 255, 0);
    ellipse((node.y * tileSize.w) + tileSize.w / 2,
      (node.x * tileSize.h) + tileSize.h / 2,
      min(tileSize.w, tileSize.h) / 2);
  });

  noLoop();
}
