import Grid from './grid';
import Tetromino from './tetromino';
import { getNextPieces } from './bag';
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
    this.nextPieces = getNextPieces(3);
    this.heldPiece = null;
    this.holdUsed = false;
    this.level = 1;
    this.lines = 0;
    this.score = 0;
    this.lockDelay = LOCK_DELAY;
    this.lockDelayResets = 0;
    this.goal = goal;
    
    this.setGravity();
    this.nextPiece();
    this.piece = null;

    // Drop piece g rows when g >= 1
    // this.gravity is added to g each frame
    this.g = 0;

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

  clearRows() {
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
    this.setGravity();
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
  
    const { x, y } = this.piece.topLeft;

    this.drop(this.piece, FIELD_ROWS);
  
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

  gameLoop(dt) {
    if (this.goal && this.lines >= this.goal) {
      this.gameState = GAMESTATE.GAMEOVER;
    }

    if (this.spawnDelay > 0) {
      this.spawnDelay -= dt;
      return;
    }

    if (!this.piece) this.nextPiece();

    this.field.remove(this.piece.blocks);

    if (this.pieceIsLanded()) {
      if (this.lockDelay < 1) {
        this.field.add(this.piece.blocks);
        this.clearRows();
        this.nextPiece();
        if (this.field.intersects(this.piece.blocks)) {
          this.gameState = GAMESTATE.GAMEOVER;
        }
        
        this.resetLockDelay({ clearLockDelayResets: true });
        this.holdUsed = false;
        this.g = 0;
        this.spawnDelay = SPAWN_DELAY;
      } else {
        this.lockDelay -= dt;
      }
    } else {
      if (this.g >= 1) {
        this.drop(this.piece, Math.floor(this.g));
        this.g = 0;
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

    this.playTime += dt;
    this.renderer.drawStats({
      time: digitalTime(this.playTime)
    });
  
    this.g += this.gravity;
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
      this.renderer.drawGameOver('Excellent!');          
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
  }
}