'use strict';

import chai from 'chai';

import Tetromino from '../src/js/Tetromino';
import { J, L, T, O, I } from '../src/js/shapes';
import Grid from '../src/js/Grid';

const expect = chai.expect;

describe('Grid', function() {
  const grid = new Grid(10, 22);

  context('new grid with width = 10, height = 22', function() {
    it('should have correct initial properties', function() {
      expect(grid.width).to.equal(10);
      expect(grid.height).to.equal(22);
      expect(grid.cells).to.be.an('array');
      expect(grid.cells).to.be.lengthOf(22);

      for (let row of grid.cells) {
        expect(row).to.be.lengthOf(10);
      }
    });
  });

  const t = new Tetromino(1, 1, T);
 
  context('add() T Tetromino with topLeft of (1,1)', function() {    
    it('should insert "t" to positions (1,2), (2,1), (2,2), (3,2)', function() {
      grid.add(t.blocks);

      expect(grid.cells[2][1]).to.equal('T');
      expect(grid.cells[1][2]).to.equal('T');
      expect(grid.cells[2][2]).to.equal('T');
      expect(grid.cells[2][3]).to.equal('T');
    });
  });

  context('remove() T Tetromino from Grid', function() {    
    it('should set grid values back to 0', function() {
      grid.remove(t.blocks);

      expect(grid.cells[2][1]).to.equal(0);
      expect(grid.cells[1][2]).to.equal(0);
      expect(grid.cells[2][2]).to.equal(0);
      expect(grid.cells[2][3]).to.equal(0);
    });
  });

  context('willCollide() for 2 overlapping T Tetrominos', function() {
    it('should return true', function() {
      grid.add(t.blocks);

      t.move(1, 0);
      
      const collision = grid.willCollide(t.blocks);

      expect(collision).to.equal(true);
    });
  });

  context('willCollide() for T Tetromino outside grid x bounds', function() {
    it('should return true', function() {
      t.move(9, 0);

      const collision = grid.willCollide(t.blocks);

      expect(collision).to.equal(true);
    });
  });

  context('willCollide() for T Tetromino outside grid y bounds', function() {
    it('should return true', function() {
      t.move(-10, 20);

      const collision = grid.willCollide(t.blocks);

      expect(collision).to.equal(true);
    });
  });

  context('willCollide() for T Tetromino within grid bounds and not overlapping exising blocks', function() {
    it('should return false', function() {
      t.move(0, -15);

      const collision = grid.willCollide(t.blocks);

      expect(collision).to.equal(false);

      // remove existing blocks
      t.move(0, -5);
      grid.remove(t.blocks);
    });
  });

  context('Add T Tetromino (0,10) and get grid blocks', function() {
    it('should return an array of objects with Vector locations and labels', function() {
      t.move(0, 10);
      grid.add(t.blocks);
      
      const blocks = grid.blocks;

      expect(blocks).to.be.an('array');
      expect(blocks).to.be.lengthOf(4);

      for (let block of blocks) {
        expect(block).to.be.an('object');
        expect(block).to.have.property('location');
        
        expect(block.location).to.be.an('object');
        expect(block.location).to.have.property('x');
        expect(block.location).to.have.property('y');
        
        expect(block.label).to.be.a('string');
        expect(block.label).to.equal('T');
      }

      expect(blocks.filter(block => {
        return block.location.x === 1 && block.location.y === 12
          || block.location.x === 2 && block.location.y === 11
          || block.location.x === 2 && block.location.y === 12
          || block.location.x === 3 && block.location.y === 12
      })).to.be.lengthOf(4);
    });
  });

});
