import Grid from './Grid';
import { getNextPieces } from './randomTetromino';
import handleKeys from './inputs';
import Vector from './Vector';
import { drawGameGrid, drawQueue } from './render';

import {
  GRID_WIDTH,
  GRID_HEIGHT,
  FPS
} from './constants';

import '../styles/index.css';

const queue = getNextPieces(3);

const gameGrid = new Grid(GRID_WIDTH, GRID_HEIGHT);

let piece;
let gameOver = false;
let level = 1;
let defaultLockDelay = 500;
let lockDelay = defaultLockDelay;

let fallSpeed = getFallSpeed(); // Frames between a piece's descent
let lastFrame;
let frameLapse; // Should this be scoped only in loop()? Input handling uses it
let framesSinceFall = 0;

function getFallSpeed() {
  return Math.floor(20 / level);
}

function clearLines() {
  const blocks = gameGrid.blocks;

  let rowsCleared = 0;

  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    const row = blocks.filter(block => block.location.y === y);

    if (rowsCleared) {
      gameGrid.remove(row);
      for (let block of row) {
        block.location = block.location.add(new Vector(0, rowsCleared));
      }

      gameGrid.add(row);
    }
    
    if (row.length > 9) {
      gameGrid.remove(row);
      rowsCleared++;
    }
  }
}

function pieceIsLanded() {
  let landed = false; 

  gameGrid.remove(piece.blocks);
  piece.move(0, 1);
  if (gameGrid.willCollide(piece.blocks)) {
    landed = true;
  }
  
  piece.move(0, -1);
  gameGrid.add(piece.blocks);
  return landed;
}

function nextPiece() {
  piece = queue.shift();
  queue.push(...getNextPieces(1));
}

function loop() {
  window.requestAnimationFrame(loop);
  
  const frameInterval = 1000 / FPS;
  const now = Date.now();
  
  lastFrame = lastFrame ? lastFrame : Date.now();
  frameLapse = now - lastFrame;

  if (frameLapse < frameInterval) return;
  if (gameOver) return;

  lastFrame = now - (frameLapse % frameInterval);

  if (pieceIsLanded()) {
    if (lockDelay < 1) {
      clearLines();
      nextPiece();
      lockDelay = defaultLockDelay;
      gameOver = gameGrid.willCollide(piece.blocks);
      framesSinceFall = 0;
      gameGrid.add(piece.blocks);
      return;
    } else {
      lockDelay -= frameInterval;
    }
  } else {
    if (framesSinceFall >= fallSpeed) {
      framesSinceFall = -1;
  
      gameGrid.remove(piece.blocks);
      piece.move(0, 1);

      gameGrid.add(piece.blocks);
    }
  }

  handleKeys(gameGrid, piece, frameLapse);

  drawGameGrid(gameGrid.blocks);
  drawQueue();

  framesSinceFall++;
}

window.addEventListener('softdrop', () => {
  fallSpeed = 1;
});

window.addEventListener('endsoftdrop', () => {
  fallSpeed = getFallSpeed();
});

window.addEventListener('harddrop', () => {
  lockDelay = 0;
});

nextPiece();
loop();