class Segment {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;

    this.children = [];

    this.hasChildren = false;
  }

  addChildren() {
    if(this.hasChildren) {

      this.children.forEach(child => child.addChildren());

    } else {

      this.hasChildren = true;

      let line = p5.Vector.sub(this.v2, this.v1);
      let aThird = p5.Vector.div(line, 3);

      // if this = ____ , create _/\_
      let lBase = p5.Vector.add(this.v1, aThird);
      let rBase = p5.Vector.sub(this.v2, aThird);

      aThird.rotate(-PI / 3);
      let apex = p5.Vector.add(lBase, aThird);

      aThird.rotate(PI / 3);
      let straight = p5.Vector.add(lBase, aThird);

      aThird.rotate(PI / 3);
      let invApex = p5.Vector.add(lBase, aThird);

      let c1 = new Segment(this.v1, lBase);
      let c2 = new Segment(lBase, apex);
      let c3 = new Segment(apex, rBase);
      let c4 = new Segment(rBase, this.v2);

      // just for fun
      let c5 = new Segment(lBase, invApex);
      let c6 = new Segment(invApex, rBase);
      
      let c7 = new Segment(lBase, straight);

      this.children.push(c1, c2, c3, c4, c5, c6, c7);
    }
  }

  draw() {
    if(this.hasChildren) {

      this.children.forEach(child => child.draw());

    } else {
      line(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
    }
  }
}
