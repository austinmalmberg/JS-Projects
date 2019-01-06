class QuadTree {

  constructor(bounds, maxPoints, points=[]) {
    this.bounds = bounds;
    this.maxPoints = maxPoints;
    this.points = points;

    this.isDivided = false;
    this.quadrants = [];
  }

  selectPoints(rectangle) {
    let selectedPoints = [];

    if(rectangle.intersects(this.bounds) || this.bounds.intersects(rectangle)) {
      this.points.forEach(point => {
        if(rectangle.contains(point)) {
          point.selected = true;
          selectedPoints.push(point);
        }
      });

      this.quadrants.forEach(quadrant =>
        selectedPoints.push(...quadrant.selectPoints(rectangle)));
    }

    return selectedPoints;
  }

  insert(point) {

    // adds the point if not at capacity
    if (this.points.length < this.maxPoints) {

      this.points.push(point);
      return true;

    }

    // divides the rectangle into quadrants
    if(this.quadrants.length === 0) {
      this.divide();
      this.points.forEach(point => this.insert(point));
    }

    // adds the point to the proper quadrant
    return this.getQuadrant(point).insert(point);
  }

  divide() {
    let halfWidth = this.bounds.width / 2;
    let halfHeight = this.bounds.height / 2;

    let nw = new QuadTree(
      new Rectangle(this.bounds.x, this.bounds.y, halfWidth, halfHeight),
      this.maxPoints
    );

    let ne = new QuadTree(
      new Rectangle(this.bounds.x + halfWidth, this.bounds.y, halfWidth, halfHeight),
      this.maxPoints
    );

    let sw = new QuadTree(
      new Rectangle(this.bounds.x, this.bounds.y + halfHeight, halfWidth, halfHeight),
      this.maxPoints
    );

    let se = new QuadTree(
      new Rectangle(this.bounds.x + halfWidth, this.bounds.y + halfHeight, halfWidth, halfHeight),
      this.maxPoints
    );

    this.quadrants.push(nw, ne, sw, se);
  }

  getQuadrant(point) {
    let centerPoint = new Point(
      this.bounds.x + this.bounds.width / 2,
      this.bounds.y + this.bounds.height / 2
    );

    if(point.y <= centerPoint.y) {

      if(point.x <= centerPoint.x) {
        return this.quadrants[this.NORTHWEST()];
      }

      return this.quadrants[this.NORTHEAST()];
    }

    if(point.x <= centerPoint.x) {
      return this.quadrants[this.SOUTHWEST()];
    }

    return this.quadrants[this.SOUTHEAST()];
  }

  contains(point) {
    return this.bounds.contains(point);
  }

  draw() {
    this.bounds.draw(); // draw rectangle

    // draw quadrants
    this.quadrants.forEach(quadrant => quadrant.draw());

    // draw points
    this.points.forEach(point => point.draw());
  }

  // CONSTANTS

  NORTHWEST() { return 0; }
  NORTHEAST() { return 1; }
  SOUTHWEST() { return 2; }
  SOUTHEAST() { return 3; }
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersects(other) {

    let xOverlap = other.x >= this.x && other.x < this.x + this.width ||
      other.x + other.width >= this.x && other.x + other.width < this.x + this.width;

    let yOverlap = other.y >= this.y && other.y < this.y + this.height ||
      other.y + other.height >= this.y && other.y + other.height < this.y + this.height;

    let xPassthru;
    let yPassthru;

    return xOverlap || yOverlap;
  }

  contains(obj) {
    if(obj instanceof Point) {
      return obj.x >= this.x && obj.x < this.x + this.width &&
        obj.y >= this.y && obj.y < this.y + this.height;
    }

    if(obj instanceof this) {
      let tl = new Point(obj.x, obj.y);
      let tr = new Point(obj.x + obj.width, obj.y);
      let bl = new Point(obj.x, obj.y + obj.height);
      let br = new Point(obj.x + obj.width, obj.y + obj.height);

      return this.contains(tl) && this.contains(tr) &&
        this.contains(bl) && this.contains(br);
    }

    return false;
  }

  draw() {
    noFill();
    stroke(100);
    rect(this.x, this.y, this.width, this.height);
  }

  draw(r, g, b) {
    push();
    stroke(r, g, b);
    noFill();
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.selected = false;
  }

  draw() {
    push();
    if(this.selected) {
      stroke(0, 255, 0);
      strokeWeight(6);
    } else {
      // stroke(255);
      strokeWeight(2);
    }
    point(this.x, this.y);
    pop();
  }
}
