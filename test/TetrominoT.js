'use strict';

import chai from 'chai';

import Tetromino from '../src/js/Tetromino';
import { T } from '../src/js/shapes';

const expect = chai.expect;

describe('Tetromino - T', function() {
  let t;

  context('Creation with coordinates (0, 0)', function() {
    t = new Tetromino(0, 0, T);

    it('should have correct initial properties', function() {
      expect(t).to.have.property('topLeft');
      expect(t.topLeft.x).to.equal(0);
      expect(t.topLeft.y).to.equal(0);
      
      expect(t).to.have.property('rotation');
      expect(t.rotation).to.equal(0);

      expect(t).to.have.property('rotations');
      expect(t.rotations).to.have.lengthOf(4);
    });
  });

  context('rotateLeft()', function() {
    it('loops though available rotations correctly', function() {
      t.rotateLeft();
      expect(t.rotation).to.equal(3);

      t.rotateLeft();
      expect(t.rotation).to.equal(2);

      t.rotateLeft();
      expect(t.rotation).to.equal(1);

      t.rotateLeft();
      expect(t.rotation).to.equal(0);
    });
  });

  context('rotateRight()', function() {
    it('loops though available rotations correctly', function() {
      t.rotateRight();
      expect(t.rotation).to.equal(1);

      t.rotateRight();
      expect(t.rotation).to.equal(2);

      t.rotateRight();
      expect(t.rotation).to.equal(3);

      t.rotateRight();
      expect(t.rotation).to.equal(0);
    });
  });

  context('move(1, 2)', function() {
    it('should update topLeft property correctly', function() {
      t.move(1, 2);

      expect(t.topLeft.x).to.equal(1);
      expect(t.topLeft.y).to.equal(2);

      t.move(-1, -2);
    });
  });

  context('get blocks', function() {
    it('should return array of objects with location and block label', function() {
      const blocks = t.blocks;
      
      expect(blocks).to.be.an('array');

      expect(blocks[0].location.x).to.equal(0);
      expect(blocks[0].location.y).to.equal(1);
      expect(blocks[0].label).to.equal('T');

      expect(blocks[1].location.x).to.equal(1);
      expect(blocks[1].location.y).to.equal(0);
      expect(blocks[1].label).to.equal('T');

      expect(blocks[2].location.x).to.equal(1);
      expect(blocks[2].location.y).to.equal(1);
      expect(blocks[2].label).to.equal('T');

      expect(blocks[3].location.x).to.equal(2);
      expect(blocks[3].location.y).to.equal(1);
      expect(blocks[3].label).to.equal('T');
    })
  });
});