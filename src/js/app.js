import Grid from './Grid';
import Tetromino from './Tetromino';
import { getNextPieces } from './randomTetromino';
import handleKeys from './inputs';
import Vector from './Vector';
import { drawField, drawNextPreview, drawHoldView } from './render/render';

import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  NEXT_COLUMNS,
  NEXT_ROWS,
  HOLD_COLUMNS,
  HOLD_ROWS,
  FPS
} from './constants';

import '../styles/index.css';

const debug = document.querySelector('#debug');

const field = new Grid(FIELD_COLUMNS, FIELD_ROWS);
const nextPreview = new Grid(NEXT_COLUMNS, NEXT_ROWS);
const holdView = new Grid(HOLD_COLUMNS, HOLD_ROWS);

const nextPieces = getNextPieces(3);

let piece;
let heldPiece;
let holdUsed = false;
let gameOver = false;
let level = 1;
let defaultLockDelay = 500;
let lockDelay = defaultLockDelay;

let dropInterval = getdropInterval(); // Frames between a piece's descent
let lastFrame;
//let frameLapse; // Should this be scoped only in loop()? Input handling uses it
let framesSinceDrop = 0;

function getdropInterval() {
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
  
  let landed = field.intersects(piece.blocks);
  
  piece.move(0, -1);
  field.add(piece.blocks);
  return landed;
}

function nextPiece() {
  piece = nextPieces.shift();
  piece.moveTo(3, 2);
  nextPieces.push(...getNextPieces(1));
  nextPreview.clear();
  
  for (let i = 0; i < nextPieces.length; i++) {
    nextPieces[i].moveTo(0, i * 4);
    nextPreview.add(nextPieces[i].blocks);
  }
  
  drawNextPreview(nextPreview.blocks);
}

function holdPiece() {
  if (holdUsed) return;

  const newPiece = heldPiece;

  holdUsed = true;

  field.remove(piece.blocks);
  heldPiece = piece;
  heldPiece.moveTo(0, 0);
  heldPiece.rotation = 0;

  holdView.add(heldPiece.blocks);
  drawHoldView(heldPiece.blocks);

  if (newPiece) {
    newPiece.moveTo(3, 2);
    piece = newPiece;
  } else {
    nextPiece();
  }
}

function addGhostPiece() {
  field.clear('G');
  field.remove(piece.blocks);

  const { x, y } = piece.topLeft;

  while (!field.intersects(piece.blocks)) {
    piece.move(0, 1);
  }

  piece.move(0, -1);

  const ghostPiece = new Tetromino(
    piece.topLeft.x,
    piece.topLeft.y,
    {
      label: 'G',
      rotations: piece.rotations,
    }
  );

  ghostPiece.rotation = piece.rotation;

  field.add(ghostPiece.blocks);

  piece.moveTo(x, y);
  field.add(piece.blocks);
}



function loop() {
  window.requestAnimationFrame(loop);
  
  const frameInterval = 1000 / FPS;
  const now = Date.now();
  
  lastFrame = lastFrame ? lastFrame : Date.now();
  const frameLapse = now - lastFrame;

  if (frameLapse < frameInterval) return;
  if (gameOver) return;

  lastFrame = now - (frameLapse % frameInterval);

  if (pieceIsLanded()) {
    if (lockDelay < 1) {
      clearLines();
      nextPiece();
      lockDelay = defaultLockDelay;
      holdUsed = false;
      gameOver = field.intersects(piece.blocks);
      framesSinceDrop = 0;
      field.add(piece.blocks);
      return;
    } else {
      lockDelay -= frameInterval;
    }
  } else {
    if (framesSinceDrop >= dropInterval) {
      framesSinceDrop = -1;
      field.remove(piece.blocks);
      piece.move(0, 1);
      field.add(piece.blocks);
    }
  }

  handleKeys(field, piece, frameLapse);

  addGhostPiece();

  drawField(field.blocks
    .map(block => {
      block.location.y -= HIDDEN_ROWS;
      return block;
    })
    .filter(block => block.location.y > -1)
  );

  framesSinceDrop++;
}

window.addEventListener('softdrop', () => dropInterval = 1);
window.addEventListener('endsoftdrop', () => dropInterval = getdropInterval());
window.addEventListener('harddrop', () => lockDelay = 0);
window.addEventListener('holdpiece', holdPiece);

nextPiece();

loop();