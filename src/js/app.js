import Grid from './Grid';
import Tetromino from './Tetromino';
import { J, L, T, O, I, S, Z } from './shapes';
import handleKeys from './inputs';

import Vector from './Vector';


const width = 10;
const height = 22;

// Rendering
const canvas = document.querySelector('canvas');

canvas.width = width * 30;
canvas.height = height * 30;

const blockStyles = {
  T: 'purple',
  O: 'yellow',
  I: 'cyan',
  J: 'blue',
  L: 'orange',
  S: 'green',
  Z: 'red'
};

const blockSize = canvas.width / width;
const ctx = canvas.getContext('2d');

function drawGrid(blocks) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blocks.map(block => {
    const { x, y } = block.location;

    ctx.fillStyle = blockStyles[block.label]
    ctx.fillRect(
      x * blockSize,
      y * blockSize,
      blockSize,
      blockSize
    );
  });
}


// Game Logic
const grid = new Grid(width, height);
const shapes = [J, L, T, O, I, S, Z]; 

let piece = new Tetromino(3, 0, shapes[Math.floor(Math.random() * shapes.length)]);
let gameOver = false;
let level = 1;
let defaultLockDelay = 500;
let lockDelay = defaultLockDelay;

const FPS = 60;
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

  for (let y = height - 1; y >= 0; y--) {
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

window.addEventListener('softdrop', () => {
  fallSpeed = 1;
});

window.addEventListener('endsoftdrop', () => {
  fallSpeed = getFallSpeed();
});

window.addEventListener('harddrop', () => {
  lockDelay = 0;
});

function loop() {
  window.requestAnimationFrame(() => loop());
  
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
      lockDelay = defaultLockDelay;
      piece = new Tetromino(3, 0, shapes[Math.floor(Math.random() * shapes.length)]);
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

  drawGrid(grid.blocks);

  framesSinceFall++;
}

loop();