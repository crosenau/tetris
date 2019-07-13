import Grid from './Grid';
import Tetromino from './Tetromino';
import { getNextPieces } from './randomTetromino';
import InputHanlder from './inputs';
import Vector from './Vector';
import Renderer from './renderer';

import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  NEXT_COLUMNS,
  NEXT_ROWS,
  HOLD_COLUMNS,
  HOLD_ROWS,
  LOCK_DELAY
} from './constants';

import parseMilliseconds from 'parse-ms';

import '../styles/index.css';

function digitalTime(ms) {
  const { minutes, seconds, milliseconds } = parseMilliseconds(ms);
  let time = '';

  for (let unit of [minutes, seconds, milliseconds]) {
    if (unit < 10) {
      time += `0${unit}:`
    } else if (unit > 99) {
      time += String(Math.round(unit / 10));
    } else {
      time += `${unit}:`;
    }
  }

  return time.replace(/:$/, '');
}

const GAMESTATE = {
  MENU: 0,
  RUNNING: 1,
  PAUSED: 2,
  GAMEOVER: 3
}

const debug = document.querySelector('#debug');

export default class Game {
  constructor(width, height) {
    this.field = new Grid(FIELD_COLUMNS, FIELD_ROWS);
    this.nextPreview = new Grid(NEXT_COLUMNS, NEXT_ROWS);
    this.holdView = new Grid(HOLD_COLUMNS, HOLD_ROWS);
    this.renderer = new Renderer(width, height);
    
    this.gamestate = GAMESTATE.MENU;
    this.heldPiece = null;
    this.holdUsed = false;
    this.gameOver = false;
    this.level = 1
    this.lines = 0;
    this.score = 0;
    this.lockDelay = LOCK_DELAY;
    this.lockDelayResets = 0;

    this.framesSinceDrop = 0;
    this.dropInterval; // Frames between a piece's descent
    
    this.inputHanlder = new InputHanlder(this);

    this.renderer.drawHoldView();
    this.renderer.drawNextPreview();
    this.renderer.drawField();
    this.renderer.drawStats({
      level:this.level,
      lines: this.lines,
      score: this.score,
      time: digitalTime(0)
    });
  }

  startGame() {
    this.nextPieces = getNextPieces(3);
    this.nextPiece();
    this.setDropInterval();
    this.gamestate = GAMESTATE.RUNNING;
    this.startTime = Date.now();
  }

  setDropInterval() {
    this.dropInterval = Math.floor(20 / this.level);
  }

  clearLines() {
    const { blocks } = this.field;
  
    let rowsCleared = 0;
  
    for (let y = FIELD_ROWS - 1; y >= 0; y--) {
      const row = blocks.filter(block => block.location.y === y);
  
      if (rowsCleared) {
        this.field.remove(row);
        for (let block of row) {
          block.location = block.location.add(new Vector(0, rowsCleared));
        }
  
        this.field.add(row);
      }
      
      if (row.length > 9) {
        this.field.remove(row);
        rowsCleared++;
      }
    }
  
    this.updateStats(rowsCleared);
  }

  updateStats(rowsCleared) {
    this.lines += rowsCleared;
    this.level = Math.max(this.level, Math.floor(this.lines / 10) + 1);
    this.score = rowsCleared === 0
      ? this.score 
      : this.score + 2**(rowsCleared - 1) * 100 * this.level;

    this.renderer.drawStats({
      level: this.level,
      lines: this.lines,
      score: this.score
    });
    this.setDropInterval();
  }

  pieceIsLanded() {
    this.field.remove(this.piece.blocks);
    this.piece.move(0, 1);
    
    let landed = this.field.intersects(this.piece.blocks);
    
    this.piece.move(0, -1);
    this.field.add(this.piece.blocks);
    return landed;
  }

  nextPiece() {
    this.piece = this.nextPieces.shift();
  
    // Piece spawn position
    this.piece.label === 'I' ? this.piece.moveTo(3, 1) : this.piece.moveTo(3, 2);
  
    while (this.field.intersects(this.piece.blocks) && this.piece.topLeft.y > 0) {
      this.piece.move(0, -1);
    }
    
    this.nextPieces.push(...getNextPieces(1));
    this.nextPreview.clear();
    
    for (let i = 0; i < this.nextPieces.length; i++) {
      this.nextPieces[i].moveTo(0, i * 4);
      this.nextPreview.add(this.nextPieces[i].blocks);
    }
    
    this.renderer.drawNextPreview(this.nextPreview.blocks);
  }

  holdPiece() {
    if (this.holdUsed) return;
  
    const returnedPiece = this.heldPiece;
  
    this.holdUsed = true;
    this.lockDelay = LOCK_DELAY;
    this.field.remove(this.piece.blocks);
    this.heldPiece = this.piece;
    this.heldPiece.moveTo(0, 0);
    if (this.heldPiece.bottomRight.x < 3) this.heldPiece.move(1, 0);
    
    this.heldPiece.rotation = 0;
    this.holdView.add(this.heldPiece.blocks);
    
    this.renderer.drawHoldView(this.heldPiece.blocks);
  
    if (returnedPiece) {
      returnedPiece.moveTo(3, 2);
      this.piece = returnedPiece;
    } else {
      this.nextPiece();
    }
  }

  addGhostPiece() {
    this.field.clear('G');
    this.field.remove(this.piece.blocks);
  
    const { x, y } = this.piece.topLeft;
  
    while (!this.field.intersects(this.piece.blocks)) {
      this.piece.move(0, 1);
    }
  
    this.piece.move(0, -1);
  
    const ghostPiece = new Tetromino(
      this.piece.topLeft.x,
      this.piece.topLeft.y,
      {
        label: 'G',
        rotations: this.piece.rotations,
      }
    );
  
    ghostPiece.rotation = this.piece.rotation;
  
    this.field.add(ghostPiece.blocks);
  
    this.piece.moveTo(x, y);
    this.field.add(this.piece.blocks);
  }

  lockPiece() {
    this.lockDelay = 0;
  }

  resetLockDelay(opts = {}) {
    if (opts.clearLockDelayResets) {
      this.lockDelayResets = 0;
      this.lockDelay = LOCK_DELAY;
      return;
    }
    
    if (this.pieceIsLanded() && this.lockDelayResets < 15) {
      this.lockDelay = LOCK_DELAY;
      this.lockDelayResets++;
    }

  }

  softDrop() {
    this.dropInterval = 1;
  }

  update(dt) {
    if (this.gamestate === GAMESTATE.RUNNING) {
      if (this.gameOver) return;
  
      if (this.pieceIsLanded()) {
        if (this.lockDelay < 1) {
          this.clearLines();
          this.nextPiece();
          this.resetLockDelay({ clearLockDelayResets: true });
          this.holdUsed = false;
          this.gameOver = this.field.intersects(this.piece.blocks);
          this.framesSinceDrop = 0;
          this.field.add(this.piece.blocks);
          return;
        } else {
          this.lockDelay -= dt;
        }
      } else {
        if (this.framesSinceDrop >= this.dropInterval) {
          this.framesSinceDrop = -1;
          this.field.remove(this.piece.blocks);
          this.piece.move(0, 1);
          this.field.add(this.piece.blocks);
        }
      }
  
      this.inputHanlder.handleKeys(dt);
      this.addGhostPiece();
    
      this.renderer.drawField(this.field.blocks
        .map(block => {
          block.location.y -= HIDDEN_ROWS;
          return block;
        })
        .filter(block => block.location.y > -1)
      );

      this.renderer.drawStats({ time: digitalTime(Date.now() - this.startTime) });
    
      this.framesSinceDrop++;

      debug.innerText = JSON.stringify({
        lockDelay: this.lockDelay, 
        lockDelayResets: this.lockDelayResets
      });
    }
  }
}