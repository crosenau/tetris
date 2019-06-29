'use strict';

import chai from 'chai';

import { getNextPieces } from '../src/js/randomTetromino';

const expect = chai.expect;

describe('getNextPiece()', function() {
  context('with no arguments', function() {
    it('should return an array with single random tetromino with correct initial position', function() {
      const piece = getNextPieces();
  
      expect(piece).to.be.an('array');
      expect(piece[0]).to.be.an('object');
      expect(piece[0]).to.have.property('topLeft');
      expect(piece[0].topLeft.x).to.equal(3);
      expect(piece[0].topLeft.y).to.equal(0);
  
      expect(piece[0]).to.have.property('rotation');
      expect(piece[0]).to.have.property('rotations');
    });
  });

  context('with argument 7', function() {
    it('should return 7 tetrominoes', function() {
      const pieces = getNextPieces(7);

      expect(pieces).to.be.an('array');
      expect(pieces).to.have.lengthOf(7);

      for (let piece of pieces) {
        expect(piece).to.be.an('object');
        expect(piece).to.have.property('topLeft');
        expect(piece.topLeft.x).to.equal(3);
        expect(piece.topLeft.y).to.equal(0);
    
        expect(piece).to.have.property('rotation');
        expect(piece).to.have.property('rotations');
      }
    });
  });

  context('large number of random tetrominoes', function() {
    it('should return an even distribution of pieces overtime', function() {
      const pieces = getNextPieces(700);
      const pieceCounts = {
        S: 0,
        Z: 0,
        T: 0,
        L: 0,
        J: 0,
        I: 0,
        O: 0
      };
    
      for (let piece of pieces) {
        pieceCounts[piece.label]++
      }
  
      for (let value of Object.values(pieceCounts)) {
        expect(value).to.be.greaterThan(98);
      }
    });
  });
});