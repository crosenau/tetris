'use strict';

import chai from 'chai';

import Vector from '../src/js/Vector';

const expect = chai.expect;

describe('Vector object', function() {
  let vec = new Vector(0, 1);
  
  context('Created Vector object with coordinates (0, 1)', function() {
    it('should have properties (x, y) equal to (0, 1)', function() {
      expect(vec.x).to.equal(0);
      expect(vec.y).to.equal(1);
    });
  });

  context('Add vector with coordinates (5, 6)', function() {
    it('should return new vector with properties (x, y) equal to (5, 7)', function() {
      vec = vec.add(new Vector(5, 6));
      
      expect(vec.x).to.equal(5);
      expect(vec.y).to.equal(7);
    });
  });

  context('Add vector with coordinates (-10, 0)', function() {
    it('should return new vector with properties (x, y) equal to (-5, 7)', function() {
      vec = vec.add(new Vector(-10, 0));
      
      expect(vec.x).to.equal(-5);
      expect(vec.y).to.equal(7);
    });
  });

  context('Subtract vector with coordinates (5, 7)', function() {
    it('should return new vector with properties (x, y) equal to (-10, 0)', function() {
      vec = vec.sub(new Vector(5, 7));
      
      expect(vec.x).to.equal(-10);
      expect(vec.y).to.equal(0);
    });
  });

  context('Subtract vector with coordinates (-15, 0)', function() {
    it('should return new vector with properties (x, y) equal to (0, 0)', function() {
      vec = vec.sub(new Vector(-10, 0));
      
      expect(vec.x).to.equal(0);
      expect(vec.y).to.equal(0);
    });
  });
});