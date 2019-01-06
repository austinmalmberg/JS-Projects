const canvasSize = 600;

let v1, v2, v3;
let seg1, seg2, seg3;

let segments = [];

function setup() {
  createCanvas(canvasSize, canvasSize);

  stroke(255);
  strokeWeight(2);

  let len = canvasSize * 0.8;
  v1 = createVector(canvasSize * 0.1, canvasSize * 0.27);
  v2 = createVector(v1.x + len, v1.y);
  v3 = p5.Vector.add(v1, p5.Vector.fromAngle(PI / 3, len));

  seg1 = new Segment(v1, v2);
  seg2 = new Segment(v2, v3);
  seg3 = new Segment(v3, v1);

  segments.push(seg1, seg2, seg3);
}

function draw() {
  background(0);

  segments.forEach(seg => seg.draw());
  noLoop();
}

function mousePressed() {
  segments.forEach(seg => seg.addChildren());
  redraw();
}

function drawLine(vect1, vect2) {
  line(vect1.x, vect1.y, vect2.x, vect2.y);
}
