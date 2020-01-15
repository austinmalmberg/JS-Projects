let tree;

const maxPoints = 2000;
let startingPoint;
let selectionRange;
let selectedPoints = [];

function setup() {
  createCanvas(1280, 720);

  let bounds = new Rectangle(0, 0, width, height);
  tree = new QuadTree(bounds, 50);

  for(let i = 0; i < maxPoints; i++) {
    tree.insert(new Point(random(width), random(height)));
  }
}

function draw() {
  background(0);

  if(selectionRange) selectionRange.draw(0, 255, 0);

  stroke(255);
  strokeWeight(1);
  tree.draw();
}

function mousePressed() {
  if(!onCanvas(mouseX, mouseY)) return;

  selectedPoints.forEach(point => point.selected = false);

  startingPoint = new Point(mouseX, mouseY);
  selectionRange = new Rectangle(startingPoint.x, startingPoint.y, 0, 0);
}

function mouseDragged() {
  if(!onCanvas(mouseX, mouseY)) return;

  // increase width and height of selection range and update x and y depending on drag direction
  if(mouseX >= startingPoint.x) {
    selectionRange.width = mouseX - startingPoint.x;
  } else {
    selectionRange.x = mouseX;
    selectionRange.width = startingPoint.x - mouseX;
  }

  if(mouseY >= startingPoint.y) {
    selectionRange.height = mouseY - startingPoint.y;
  } else {
    selectionRange.y = mouseY;
    selectionRange.height = startingPoint.y - mouseY;
  }
}

function mouseReleased() {
  if(!onCanvas(mouseX, mouseY)) return;

  let m = new Point(mouseX, mouseY);

  // insert the point into the tree if the mouse was not dragged
  if(tree.contains(m) && startingPoint.x === m.x && startingPoint.y === m.y) {
    tree.insert(m);
  } else {

    // otherwise get the points that were selected and add them to the list
    selectedPoints = tree.selectPoints(selectionRange);
  }
}

function onCanvas(mouseX, mouseY) {
  return mouseX >= 0 && mouseX <= width &&
      mouseY >= 0 && mouseY <= height;
}
