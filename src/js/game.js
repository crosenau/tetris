import Grid from './grid';
import Tetromino from './tetromino';
import { clearQueue, getNextPieces } from './bag';
import InputHanlder from './inputs';
import Vector from './vector';
import Renderer from './renderer';
import Menu from './menu';
import { digitalTime } from './utils';
import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  LOCK_DELAY,
  SPAWN_DELAY,
  GAMESTATE
} from './constants';

export default class Game {
  constructor(width, height) {
    this.field = new Grid(FIELD_COLUMNS, FIELD_ROWS);
    this.renderer = new Renderer(width, height);
    this.inputHandler = new InputHanlder(this);
    this.menu = new Menu(this);

    this.gameState = GAMESTATE.MENU;
    
    this.renderer.drawHoldView();
    this.renderer.drawNextPreview();
    this.renderer.drawField();

    this.level = 1;
  }

  toMenu() {
    this.gameState = GAMESTATE.MENU;
  }

  startCountdown(goal = false) {
    this.gameState = GAMESTATE.COUNTDOWN;
    
    this.countdown = 3000;
    /*
     Set game variables to initial game state
    */
    this.field.clear();
    clearQueue();
    this.nextPieces = getNextPieces(5);
    this.heldPiece = null;
    this.holdUsed = false;
    //this.level = 1;
    this.lines = 0;
    this.score = 0;
    this.lockDelay = LOCK_DELAY;
    this.lockDelayResets = 0;
    this.goal = goal;
    this.piece = null;
    this.tSpin = false;
    
    this.setGravity();
    this.updateNextPieces();
    

    // Drop piece rowsToDrop rows when rowsToDrop >= 1
    // this.gravity is added to rowsToDrop each frame
    this.rowsToDrop = 0;

    this.spawnDelay = 0;

    this.playTime = 0;
    this.renderer.drawStats({
      level: this.level,
      lines: this.lines,
      score: this.score,
      time: digitalTime(0)
    });
    this.renderer.drawHoldView();
  }

  startGame() {
    this.gameState = GAMESTATE.RUNNING;
  }

  togglePause() {
    if (this.gameState === GAMESTATE.RUNNING) {
      this.gameState = GAMESTATE.PAUSED;
    } else {
      this.gameState = GAMESTATE.RUNNING;
    }
  }

  setGravity(gravity = 2** (this.level * 0.62) / 256) {
    this.gravity = Math.min(gravity, FIELD_ROWS);
  }

  drop(piece = this.piece, rows) {
    for (let i = 0; i <= rows; i++) {
      if (!this.field.intersects(piece.blocks)) {
        piece.move(0, 1);
      }
    }

    piece.move(0, -1);
  }

  isTspin() {
    if (this.piece.label !== 'T') {
      return false;
    }

    let startPos = this.piece.topLeft;

    const moveTests = [
      [0, -1],
      [1, 0],
      [-1, 0]
    ];

    for (let move of moveTests) {
      const [x, y] = move;
      this.piece.move(x, y)
    
      if (!this.field.intersects(this.piece.blocks)) {
        this.piece.moveTo(startPos.x, startPos.y);
        return false;
      }

      this.piece.moveTo(startPos.x, startPos.y);
    }

    return true;
  }

  clearRows() {
    const { blocks } = this.field;
  
    let rowsCleared = 0;
  
    for (let y = FIELD_ROWS - 1; y >= 0; y--) {
      const row = blocks.filter(block => block.location.y === y);
  
      // Shift rows down to fill cleared space
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
    this.setGravity();
  }

  updateStats(rowsCleared) {
    this.lines += rowsCleared;

    let points;

    if (rowsCleared === 0) {
      points = 0;
    } else {
      const tSpinMultiplier = this.tSpin ? 2 : 1;
      let rowMultiplier = (rowsCleared * tSpinMultiplier) - 1;

      points = 2**rowMultiplier * 100 * this.level
    }

    this.score += points;
    this.level = Math.max(this.level, Math.floor(this.lines / 10) + 1);

    this.renderer.drawStats({
      level: this.level,
      lines: this.lines,
      score: this.score
    });
  }

  pieceIsLanded() {
    this.piece.move(0, 1);
    
    let landed = this.field.intersects(this.piece.blocks);
    
    this.piece.move(0, -1);
    return landed;
  }

  pieceSpawnPosition() {
    if (this.piece.label === 'I') {
      this.piece.moveTo(3, 1);
    } else {
      this.piece.moveTo(3, 2);
    }
  
    while (this.field.intersects(this.piece.blocks) && this.piece.topLeft.y > 0) {
      this.piece.move(0, -1);
    }
  }

  nextPiece() {
    this.piece = this.nextPieces.shift();

    this.pieceSpawnPosition();
    
    this.nextPieces.push(...getNextPieces(1));

    this.updateNextPieces();
  }

  updateNextPieces() {
    const blocks = [];
    
    for (let i = 0; i < this.nextPieces.length; i++) {
      this.nextPieces[i].moveTo(0, i * 4);
      blocks.push(...this.nextPieces[i].blocks);
    }
    
    this.renderer.drawNextPreview(blocks);
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
    
    this.renderer.drawHoldView(this.heldPiece.blocks);
  
    if (returnedPiece) {
      this.piece = returnedPiece;
      this.pieceSpawnPosition();
    } else {
      this.nextPiece();
    }
  }

  addGhostPiece() {
    this.field.clear('G');
    
    const ghostPiece = new Tetromino(
      this.piece.topLeft.x,
      this.piece.topLeft.y,
      {
        label: this.piece.label + 'G',
        rotations: this.piece.rotations,
      }
    );
  
    ghostPiece.rotation = this.piece.rotation;

    this.drop(ghostPiece, FIELD_ROWS);
  
    this.field.add(ghostPiece.blocks);
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

  menuLoop(dt) {
    this.renderer.drawMenu(this.menu.currentScreen);
    this.inputHandler.handleKeys(dt);
  }

  countDown(dt) {
    if (this.countdown > 0) {
      this.renderer.drawCountdown(Math.ceil(this.countdown / 1000));
    } else if (this.countdown > -1000) {
      this.renderer.drawCountdown('GO');
    } else {
      this.startGame();
    }

    this.countdown -= dt;
  }

  setLevel(lvl) {
    if (lvl > 0 && lvl < 21) {
      this.level = lvl;
    }
  }

  gameLoop(dt) {
    if (this.goal && this.lines >= this.goal) {
      this.gameState = GAMESTATE.GAMEOVER;
    }

    this.playTime += dt;
    this.renderer.drawStats({
      time: digitalTime(this.playTime)
    });

    if (this.spawnDelay > 0) {
      this.spawnDelay -= dt;
      return;
    }

    if (!this.piece) {
      this.nextPiece();
    }

    this.field.remove(this.piece.blocks);

    if (this.pieceIsLanded()) {
      if (this.lockDelay < 1) {
        this.tSpin = this.isTspin();
        this.field.add(this.piece.blocks);
        this.clearRows();
        this.nextPiece();
        if (this.field.intersects(this.piece.blocks)) {
          this.gameState = GAMESTATE.GAMEOVER;
        }
        
        this.resetLockDelay({ clearLockDelayResets: true });
        this.holdUsed = false;
        this.rowsToDrop = 0;
        this.spawnDelay = SPAWN_DELAY;
        this.tSpin = false;
      } else {
        this.lockDelay -= dt;
      }
    } else {
      if (this.rowsToDrop >= 1) {
        let rows = Math.floor(this.rowsToDrop)
        this.drop(this.piece, rows);
        this.rowsToDrop -= rows;
      }
    }

    if (this.spawnDelay < 1) {
      this.inputHandler.handleKeys(dt);
      this.addGhostPiece();
      this.field.add(this.piece.blocks);
    }

    this.renderer.drawField(this.field.blocks
      .map(block => {
        block.location.y -= HIDDEN_ROWS;
        return block;
      })
      .filter(block => block.location.y > -1)
    );
  
    this.rowsToDrop += this.gravity;
  }

  pauseLoop(dt) {
    this.renderer.drawField(this.field.blocks
      .map(block => {
        block.location.y -= HIDDEN_ROWS;
        return block;
      })
      .filter(block => block.location.y > -1)
    );
    this.renderer.drawPaused();

    this.inputHandler.handleKeys(dt);
  }

  gameOverLoop(dt) {
    if (this.goal && this.lines >= this.goal) {
      this.renderer.drawGameOver(digitalTime(this.playTime));
    } else {
      this.renderer.drawGameOver();
    }

    this.inputHandler.handleKeys(dt);
  }

  update(dt) {
    switch (this.gameState) {
      case GAMESTATE.MENU: {
        this.menuLoop(dt);
        break;
      };
      case GAMESTATE.COUNTDOWN: {
        this.countDown(dt);
        break;
      };
      case GAMESTATE.RUNNING: {
        this.gameLoop(dt);
        break;
      };
      case GAMESTATE.PAUSED: {
        this.pauseLoop(dt);
        break;
      };
      case GAMESTATE.GAMEOVER: {
        this.gameOverLoop(dt);
        break;
      };
    }
    
    //document.querySelector("#debug").innerHTML = dt;
  }
}