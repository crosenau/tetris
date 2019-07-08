import Vector from './Vector';

export default class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.cells = this.generateCells();
  }

  generateCells() {
    const cells = [];

    for (let row = 0; row < this.height; row++) {
      cells.push([]);
      for (let column = 0; column < this.width; column++) {
        cells[row].push(0);
      }
    }

    return cells;
  }

  /**
   * Add an array of blocks to grid
   * @param {Array} blocks Array of objects { location: Vector, label: String }
   */
  add(blocks) {
    // Change cells coordinates to piece value
    for (let block of blocks) {
      this.cells[block.location.y][block.location.x] = block.label;
    }
  }

    /**
   * Remove an array of blocks from grid
   * @param {Array} blocks Array of objects { location: Vector, label: String }
   */
  remove(blocks) {
    // Change cells coordinates to 0
    for (let block of blocks) {
      this.cells[block.location.y][block.location.x] = 0;
    }
  }

  willCollide(blocks) {
    for (let block of blocks) {
      const { x, y } = block.location;

      if (x < 0 || x > this.width - 1) return true;
      if (y < 0 || y > this.height - 1) return true;
      if (this.cells[y][x] !== 0) return true;
    }

    return false;
  }
  
  clearCells() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = 0;
      }
    }
    
  }

  get blocks() {
    // Returns an array of block objects containing coordinates and color
    const blocks = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y][x] !== 0) {
          blocks.push({
            location: new Vector(x, y),
            label: this.cells[y][x]
          });
        }
      }
    }

    return blocks;
  }
}