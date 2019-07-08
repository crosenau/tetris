import Grid from './Grid';
import { getNextPieces } from './randomTetromino';
import handleKeys from './inputs';
import Vector from './Vector';
import { drawField, drawNextPreview } from './render/render';

import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  NEXT_COLUMNS,
  NEXT_ROWS,
  FPS
} from './constants';

import '../styles/index.css';

const debug = document.querySelector('#debug');

const field = new Grid(FIELD_COLUMNS, FIELD_ROWS);
const nextPreview = new Grid(NEXT_COLUMNS, NEXT_ROWS);

const nextPieces = getNextPieces(3);

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
  const blocks = field.blocks;

  let rowsCleared = 0;

  for (let y = FIELD_ROWS - 1; y >= 0; y--) {
    const row = blocks.filter(block => block.location.y === y);

    if (rowsCleared) {
      field.remove(row);
      for (let block of row) {
        block.location = block.location.add(new Vector(0, rowsCleared));
      }

      field.add(row);
    }
    
    if (row.length > 9) {
      field.remove(row);
      rowsCleared++;
    }
  }
}

function pieceIsLanded() {
  field.remove(piece.blocks);
  piece.move(0, 1);
  
  let landed = field.willCollide(piece.blocks);
  
  piece.move(0, -1);
  field.add(piece.blocks);
  return landed;
}

function nextPiece() {
  piece = nextPieces.shift();
  piece.moveTo(3, 2);
  nextPieces.push(...getNextPieces(1));
  nextPreview.clearCells();
  
  for (let i = 0; i < nextPieces.length; i++) {
    nextPieces[i].moveTo(0, i * 3);
    nextPreview.add(nextPieces[i].blocks);
    
    //alert(JSON.stringify(nextPreview.blocks));
  }
  
  drawNextPreview(nextPreview.blocks);
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
      gameOver = field.willCollide(piece.blocks);
      framesSinceFall = 0;
      field.add(piece.blocks);
      return;
    } else {
      lockDelay -= frameInterval;
    }
  } else {
    if (framesSinceFall >= fallSpeed) {
      framesSinceFall = -1;
  
      field.remove(piece.blocks);
      piece.move(0, 1);

      field.add(piece.blocks);
    }
  }

  handleKeys(field, piece, frameLapse);

  drawField(field.blocks
    .map(block => {
      block.location.y -= HIDDEN_ROWS;
      return block;
    })
    .filter(block => block.location.y > -1)
  );

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