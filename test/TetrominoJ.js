'use strict';

import chai from 'chai';

import Tetromino from '../src/js/Tetromino';
import { J } from '../src/js/shapes';

const expect = chai.expect;
  
describe('Tetromino - J', function() {
  let j;

  context('Creation with coordinates (0, 0)', function() {
    j = new Tetromino(0, 0, J);

    it('should have correct initial properties', function() {
      expect(j).to.have.property('topLeft');
      expect(j.topLeft.x).to.equal(0);
      expect(j.topLeft.y).to.equal(0);
      
      expect(j).to.have.property('rotation');
      expect(j.rotation).to.equal(0);

      expect(j).to.have.property('rotations');
      expect(j.rotations).to.have.lengthOf(4);
    });
  });

  context('rotateLeft()', function() {
    it('loops though available rotations correctly', function() {
      j.rotateLeft();
      expect(j.rotation).to.equal(3);

      j.rotateLeft();
      expect(j.rotation).to.equal(2);

      j.rotateLeft();
      expect(j.rotation).to.equal(1);

      j.rotateLeft();
      expect(j.rotation).to.equal(0);
    })
  });

  context('rotateRight()', function() {
    it('loops though available rotations correctly', function() {
      j.rotateRight();
      expect(j.rotation).to.equal(1);

      j.rotateRight();
      expect(j.rotation).to.equal(2);

      j.rotateRight();
      expect(j.rotation).to.equal(3);

      j.rotateRight();
      expect(j.rotation).to.equal(0);
    })
  });

  context('move(1, 2)', function() {
    it('should update topLeft and bottomRight property correctly', function() {
      j.move(1, 2);

      expect(j.topLeft.x).to.equal(1);
      expect(j.topLeft.y).to.equal(2);

      j.move(-1, -2);
    });
  });

  context('get blocks', function() {
    it('should return array of objects with location and block label', function() {
      const blocks = j.blocks;

      expect(blocks).to.be.an('array');
      expect(blocks[0].location.x).to.equal(0);
      expect(blocks[0].location.y).to.equal(0);
      expect(blocks[0].label).to.equal('J');

      expect(blocks[1].location.x).to.equal(0);
      expect(blocks[1].location.y).to.equal(1);
      expect(blocks[1].label).to.equal('J');

      expect(blocks[2].location.x).to.equal(1);
      expect(blocks[2].location.y).to.equal(1);
      expect(blocks[2].label).to.equal('J');

      expect(blocks[3].location.x).to.equal(2);
      expect(blocks[3].location.y).to.equal(1);
      expect(blocks[3].label).to.equal('J');
    })
  });
});