import Vector from './Vector';

export default class Tetromino {
  constructor(x, y, shape) {
    this.topLeft = new Vector(x, y);
    this.label = shape.label;
    this.rotation = 0;

    // this.rotations defined as sets of Vector coords relative to topLeft
    this.rotations = shape.rotations;
  }

  rotateLeft() {
    if (this.rotation === 0) {
      this.rotation = this.rotations.length - 1;
    } else {
      this.rotation--;
    }
  }

  rotateRight() {
    if (this.rotation === this.rotations.length - 1) {
      this.rotation = 0;
    } else {
      this.rotation++;
    }
  }

  move(x, y) {
    this.topLeft = this.topLeft.add(new Vector(x, y));
  }
  
  moveTo(x, y) {
    this.topLeft = new Vector(x, y);
  }

  land() {
    this.landed = true;
  }

  get blocks() {
    // Returns an array of block objects containing coordinates and color
    const blocks = [];

    for (let vector of this.rotations[this.rotation]) {
      blocks.push({
        location: this.topLeft.add(vector),
        label: this.label
      });
    }

    return blocks;
  }
}