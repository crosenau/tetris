import { DAS, FIELD_ROWS, GAMESTATE } from './constants';


export default class InputHandler {
  constructor(game) {
    this.game = game;

    this.keyMap = {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      rotateLeft: 90, // z
      rotateRight: 88, // x
      hold: 65, // a
      start: 13 // enter
    };  
    this.keyState = {
      [this.keyMap.left]: { pressed: false, time: 0 },
      [this.keyMap.up]: { pressed: false, time: 0 },
      [this.keyMap.right]: { pressed: false, time: 0 },
      [this.keyMap.down]: { pressed: false, time: 0 },
      [this.keyMap.rotateLeft]: { pressed: false, time: 0 },
      [this.keyMap.rotateRight]: { pressed: false, time: 0 },
      [this.keyMap.hold]: { pressed: false, time: 0 },
      [this.keyMap.start]: { pressed: false, time: 0 }
    };
    this.rotationTests = {
      I: {
        '0To1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
        '1To0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
        '1To2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
        '2To1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
        '2To3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, -2]],
        '3To2': [[0, 0], [-2, 0], [1, 0],	[-2, 1], [1, -2]],
        '3To0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
        '0To3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
      },
      others: {
        '0To1': [[0, 0], [-1, 0], [-1, -1], [ 0, 2], [-1, 2]],
        '1To0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        '1To2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        '2To1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        '2To3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        '3To2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        '3To0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        '0To3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
      },
    };
    
    window.addEventListener('keydown', event => this.updateKeyState(event));
    window.addEventListener('keyup', event => this.updateKeyState(event));
  }

  updateKeyState(event) {
    const { type, keyCode } = event;
  
    if (
      type === 'keydown' 
      && keyCode in this.keyState 
      && this.keyState[keyCode].pressed === false
    ) {
      this.keyState[keyCode].pressed = true;
      this.keyState[keyCode].time = 0;
    } else if (type ==='keyup' && keyCode in this.keyState) {
      this.keyState[keyCode].pressed = false;
    }
  }

  testRotation(fromRotation, toRotation) {
    // In case rotation occurs right when next piece spawns
    if (fromRotation === toRotation) return;
    
    const { field, piece } = this.game;
    const initX = piece.topLeft.x;
    const initY = piece.topLeft.y;
  
    const tests = piece.label === 'I' 
      ? this.rotationTests.I
      : this.rotationTests.others;
    
      const key = `${fromRotation}To${toRotation}`;
  
    for (let test of tests[key]) {
      piece.move(test[0], test[1]);
      if (field.intersects(piece.blocks)) {
        piece.moveTo(initX, initY);
      } else {
        return true;
      }
    }
  
    return false;
  }

  handleKeys(dt) {
    const { up, down, left, right, rotateLeft, rotateRight, hold, start } = this.keyMap;
    const { keyState } = this;
    const { field, piece } = this.game;
  
    switch (this.game.gameState) {
      case GAMESTATE.MENU: {
        if (keyState[start].pressed && keyState[start].time === 0) {
          this.game.startCountdown();
        }

        break;
      };
      case GAMESTATE.RUNNING: {
        if (keyState[start].pressed && keyState[start].time === 0) {
          this.game.togglePause();
        }

        if (keyState[up].pressed && keyState[up].time === 0) {
          this.game.drop(piece, FIELD_ROWS);
          this.game.lockPiece();
        }
      
        if (
          keyState[down].pressed 
          && keyState[down].time === 0 
          && this.game.gravity < 0.75
        ) {
          this.game.setGravity(0.75);
        }
        
        if (
          keyState[left].pressed 
          && (keyState[left].time === 0 || keyState[left].time >= DAS)
        ) {
          piece.move(-1, 0);
          if (field.intersects(piece.blocks)) {
            piece.move(1, 0);
          } else {
            this.game.resetLockDelay();
          }
        }
      
        if (
          keyState[right].pressed 
          && (keyState[right].time === 0 || keyState[right].time >= DAS)
        ) {
          piece.move(1, 0);
          if (field.intersects(piece.blocks)) {
            piece.move(-1, 0);
          } else {
            this.game.resetLockDelay();
          }
        }
      
        if (keyState[rotateLeft].pressed && keyState[rotateLeft].time === 0) {
          const fromRotation = piece.rotation;
    
          piece.rotateLeft();
          if (!this.testRotation(fromRotation, piece.rotation)) {
            piece.rotateRight();
          } else {
            this.game.resetLockDelay();
          }
        }
      
        if (keyState[rotateRight].pressed && keyState[rotateRight].time === 0) {
          const fromRotation = piece.rotation;
    
          piece.rotateRight();
          if (!this.testRotation(fromRotation, piece.rotation)) {
            piece.rotateLeft();
          } else {
            this.game.resetLockDelay();
          }
        }
      
        if (keyState[hold].pressed && keyState[hold].time === 0) {
          this.game.holdPiece();
        }
    
        if (!keyState[down].pressed && keyState[down].time > 0) {
          this.game.setGravity();
          keyState[down].time = 0;
        }
        
        break;
      };
      case GAMESTATE.PAUSED: {
        if (keyState[start].pressed && keyState[start].time === 0) {
          this.game.togglePause();
        }

        break;
      };
      case GAMESTATE.GAMEOVER: {
        if (keyState[start].pressed && keyState[start].time === 0) {
          this.game.menu();
        }

        break;
      };
    }

    for (let key in keyState) {
      if (keyState[key].pressed) {
        keyState[key].time += dt;
      }
    }
  }
}