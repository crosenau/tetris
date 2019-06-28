'use strict';

import chai from 'chai';

import Tetromino from '../src/js/Tetromino';
import { I } from '../src/js/shapes';

const expect = chai.expect;

describe('Tetromino - I', function() {
  let i;

  context('Creation with coordinates (0, 0)', function() {
    i = new Tetromino(0, 0, I);

    it('should have correct initial properties', function() {
      expect(i).to.have.property('topLeft');
      expect(i.topLeft.x).to.equal(0);
      expect(i.topLeft.y).to.equal(0);
      
      expect(i).to.have.property('rotation');
      expect(i.rotation).to.equal(0);

      expect(i).to.have.property('rotations');
      expect(i.rotations).to.have.lengthOf(4);
    });
  });

  context('rotateLeft()', function() {
    it('loops though available rotations correctly', function() {
      i.rotateLeft();
      expect(i.rotation).to.equal(3);

      i.rotateLeft();
      expect(i.rotation).to.equal(2);

      i.rotateLeft();
      expect(i.rotation).to.equal(1);

      i.rotateLeft();
      expect(i.rotation).to.equal(0);
    });
  });

  context('rotateRight()', function() {
    it('loops though available rotations correctly', function() {
      i.rotateRight();
      expect(i.rotation).to.equal(1);
      
      i.rotateRight();
      expect(i.rotation).to.equal(2);

      i.rotateRight();
      expect(i.rotation).to.equal(3);

      i.rotateRight();
      expect(i.rotation).to.equal(0);
    });
  });

  context('move(1, 2)', function() {
    it('should update topLeft and bottomRight properties correctly', function() {
      i.move(1, 2);
      expect(i.topLeft.x).to.equal(1);
      expect(i.topLeft.y).to.equal(2);

      i.move(-1, -2);
    });
  });

  context('get blocks', function() {
    it('should return array of objects with location and block label', function() {
      const blocks = i.blocks;

      expect(blocks).to.be.an('array');

      expect(blocks[0].location.x).to.equal(0);
      expect(blocks[0].location.y).to.equal(1);
      expect(blocks[0].label).to.equal('I');

      expect(blocks[1].location.x).to.equal(1);
      expect(blocks[1].location.y).to.equal(1);
      expect(blocks[1].label).to.equal('I');

      expect(blocks[2].location.x).to.equal(2);
      expect(blocks[2].location.y).to.equal(1);
      expect(blocks[2].label).to.equal('I');

      expect(blocks[3].location.x).to.equal(3);
      expect(blocks[3].location.y).to.equal(1);
      expect(blocks[3].label).to.equal('I');
    })
  });
});