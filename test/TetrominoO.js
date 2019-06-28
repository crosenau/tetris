'use strict';

import chai from 'chai';

import Tetromino from '../src/js/Tetromino';
import { O } from '../src/js/shapes';

const expect = chai.expect;

describe('Tetromino - O', function() {
  let o;

  context('Creation with coordinates (0, 0)', function() {
    o = new Tetromino(0, 0, O);

    it('should have correct initial properties', function() {
      expect(o).to.have.property('topLeft');
      expect(o.topLeft.x).to.equal(0);
      expect(o.topLeft.y).to.equal(0);

      expect(o).to.have.property('rotation');
      expect(o.rotation).to.equal(0);

      expect(o).to.have.property('rotations');
      expect(o.rotations).to.have.lengthOf(1);
    });
  });

  context('rotateLeft()', function() {
    it('loops though available rotations correctly', function() {
      o.rotateLeft();
      expect(o.rotation).to.equal(0);
    });
  });

  context('rotateRight()', function() {
    it('loops though available rotations correctly', function() {
      o.rotateRight();
      expect(o.rotation).to.equal(0);
    });
  });

  context('move(1, 2)', function() {
    it('should update topLeft and bottomRight property correctly', function() {
      o.move(1, 2);

      expect(o.topLeft.x).to.equal(1);
      expect(o.topLeft.y).to.equal(2);

      o.move(-1, -2);
    });
  });

  context('get blocks', function() {
    it('should return array of objects with location and block label', function() {
      const blocks = o.blocks;
      
      expect(blocks).to.be.an('array');

      expect(blocks[0].location.x).to.equal(1);
      expect(blocks[0].location.y).to.equal(0);
      expect(blocks[0].label).to.equal('O');

      expect(blocks[1].location.x).to.equal(1);
      expect(blocks[1].location.y).to.equal(1);
      expect(blocks[1].label).to.equal('O');

      expect(blocks[2].location.x).to.equal(2);
      expect(blocks[2].location.y).to.equal(0);
      expect(blocks[2].label).to.equal('O');

      expect(blocks[3].location.x).to.equal(2);
      expect(blocks[3].location.y).to.equal(1);
      expect(blocks[3].label).to.equal('O');
    })
  });
});