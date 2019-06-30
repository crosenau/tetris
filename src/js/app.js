import Grid from './Grid';
import { getNextPieces } from './randomTetromino';
import handleKeys from './inputs';
import Vector from './Vector';
import drawGrid from './render/drawGrid';

import {
  GRID_COLUMNS,
  GRID_ROWS,
  HIDDEN_ROWS,
  FPS
} from './constants';

import '../styles/index.css';

const queue = getNextPieces(3);

const grid = new Grid(GRID_COLUMNS, GRID_ROWS);

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
  const blocks = grid.blocks;

  let rowsCleared = 0;

  for (let y = GRID_ROWS - 1; y >= 0; y--) {
    const row = blocks.filter(block => block.location.y === y);

    if (rowsCleared) {
      grid.remove(row);
      for (let block of row) {
        block.location = block.location.add(new Vector(0, rowsCleared));
      }

      grid.add(row);
    }
    
    if (row.length > 9) {
      grid.remove(row);
      rowsCleared++;
    }
  }
}

function pieceIsLanded() {
  let landed = false; 

  grid.remove(piece.blocks);
  piece.move(0, 1);
  if (grid.willCollide(piece.blocks)) {
    landed = true;
  }
  
  piece.move(0, -1);
  grid.add(piece.blocks);
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
      gameOver = grid.willCollide(piece.blocks);
      framesSinceFall = 0;
      grid.add(piece.blocks);
      return;
    } else {
      lockDelay -= frameInterval;
    }
  } else {
    if (framesSinceFall >= fallSpeed) {
      framesSinceFall = -1;
  
      grid.remove(piece.blocks);
      piece.move(0, 1);

      grid.add(piece.blocks);
    }
  }

  handleKeys(grid, piece, frameLapse);

  drawGrid(grid.blocks
    .map(block => {
      block.location.y -= HIDDEN_ROWS;
      return block;
    })
    .filter(block => block.location.y > -1)
  );
  //drawQueue();

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