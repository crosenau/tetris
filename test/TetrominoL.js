'use strict';

import chai from 'chai';

import Tetromino from '../src/js/Tetromino';
import { L } from '../src/js/shapes';

const expect = chai.expect;
  
describe('Tetromino - L', function() {
  let l;

  context('Creation with coordinates (0, 0)', function() {
    l = new Tetromino(0, 0, L);

    it('should have correct initial properties', function() {
      expect(l).to.have.property('topLeft');
      expect(l.topLeft.x).to.equal(0);
      expect(l.topLeft.y).to.equal(0);
      
      expect(l).to.have.property('rotation');
      expect(l.rotation).to.equal(0);

      expect(l).to.have.property('rotations');
      expect(l.rotations).to.have.lengthOf(4);
    });
  });

  context('rotateLeft()', function() {
    it('loops though available rotations correctly', function() {
      l.rotateLeft();
      expect(l.rotation).to.equal(3);

      l.rotateLeft();
      expect(l.rotation).to.equal(2);

      l.rotateLeft();
      expect(l.rotation).to.equal(1);

      l.rotateLeft();
      expect(l.rotation).to.equal(0);
    })
  });

  context('rotateRight()', function() {
    it('loops though available rotations correctly', function() {
      l.rotateRight();
      expect(l.rotation).to.equal(1);

      l.rotateRight();
      expect(l.rotation).to.equal(2);

      l.rotateRight();
      expect(l.rotation).to.equal(3);

      l.rotateRight();
      expect(l.rotation).to.equal(0);
    })
  });

  context('move(1, 2)', function() {
    it('should update topLeft property correctly', function() {
      l.move(1, 2);

      expect(l.topLeft.x).to.equal(1);
      expect(l.topLeft.y).to.equal(2);

      l.move(-1, -2);
    });
  });

  context('get blocks', function() {
    it('should return array of objects with location and block label', function() {
      const blocks = l.blocks;

      expect(blocks).to.be.an('array');
      expect(blocks[0].location.x).to.equal(0);
      expect(blocks[0].location.y).to.equal(1);
      expect(blocks[0].label).to.equal('L');

      expect(blocks[1].location.x).to.equal(1);
      expect(blocks[1].location.y).to.equal(1);
      expect(blocks[1].label).to.equal('L');

      expect(blocks[2].location.x).to.equal(2);
      expect(blocks[2].location.y).to.equal(0);
      expect(blocks[2].label).to.equal('L');

      expect(blocks[3].location.x).to.equal(2);
      expect(blocks[3].location.y).to.equal(1);
      expect(blocks[3].label).to.equal('L');
    })
  });
});