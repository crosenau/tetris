import keycode from 'keycode';
import { 
  DELAYED_AUTO_SHIFT,
  AUTO_REPEAT_RATE,
  SOFT_DROP_RATE,
  FIELD_ROWS,
  LEFT,
  RIGHT,
  UP,
  DOWN,
  ROTATE_LEFT,
  ROTATE_RIGHT,
  HOLD,
  ENTER,
  ESCAPE,
  GAMESTATE,
} from './constants';

const rotationTests = {
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

export default class InputHandler {
  constructor(game) {
    this.game = game;

    this.keyMap = {
      [LEFT]: 37,
      [RIGHT]: 39,
      [UP]: 38,
      [DOWN]: 40,
      [ROTATE_LEFT]: 88, // x
      [ROTATE_RIGHT]: 67, // c
      [HOLD]: 90, // z
      [ENTER]: 13, // enter
      [ESCAPE]: 27
    };

    this.das = DELAYED_AUTO_SHIFT;
    this.arr = AUTO_REPEAT_RATE;
    this.sdr = SOFT_DROP_RATE;

    this.keyState = this.createKeyState();

    this.unboundKey = { keyCode: null, pressed: false, time: 0 }
    this.commandToBind = null;

    // Used to track how many times lateral movement has fired during a keypress
    this.ARtick = 0;
    
    window.addEventListener('keydown', event => this.updateKeyState(event));
    window.addEventListener('keyup', event => this.updateKeyState(event));
  }

  createKeyState() {
    return {
      [this.keyMap[LEFT]]: { pressed: false, time: 0 },
      [this.keyMap[RIGHT]]: { pressed: false, time: 0 },
      [this.keyMap[UP]]: { pressed: false, time: 0 },
      [this.keyMap[DOWN]]: { pressed: false, time: 0 },
      [this.keyMap[ROTATE_LEFT]]: { pressed: false, time: 0 },
      [this.keyMap[ROTATE_RIGHT]]: { pressed: false, time: 0 },
      [this.keyMap[HOLD]]: { pressed: false, time: 0 },
      [this.keyMap[ENTER]]: { pressed: false, time: 0 },
      [this.keyMap[ESCAPE]]: { pressed: false, time: 0 },
    };
  }

  updateKeyState(event) {
    const { type, keyCode } = event;
  
    switch (type) {
      case 'keydown': {
        if (keyCode in this.keyState && !this.keyState[keyCode].pressed) {
          this.keyState[keyCode].pressed = true;
          this.keyState[keyCode].time = 0;          
        } else if (!(keyCode in this.keyState) && !this.unboundKey.pressed) {
          this.unboundKey.keyCode = keyCode;
          this.unboundKey.pressed = true;
          this.unboundKey.time = 0;
        }

        break;
      };
      case 'keyup': {
        if (keyCode in this.keyState) {
          this.keyState[keyCode].pressed = false;
          if (
            keyCode === this.keyMap[LEFT] 
            || keyCode === this.keyMap[RIGHT]
          ) {
            this.ARtick = 0;
          }
        } else {
          this.unboundKey.pressed = false;
        }
      };
    }
  }

  testRotation(fromRotation, toRotation) {
    // In case rotation occurs right when next piece spawns
    if (fromRotation === toRotation) return;
    
    const { field, piece } = this.game;
    const initX = piece.topLeft.x;
    const initY = piece.topLeft.y;
  
    const tests = piece.label === 'I' 
      ? rotationTests.I
      : rotationTests.others;
    
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

  horizontalMove(direction) {
    const { field, piece } = this.game;

    piece.move(direction, 0);
    if (field.intersects(piece.blocks)) {
      piece.move(-direction, 0);
    } else {
      this.game.resetLockDelay();
    }
  }

  handleKeys(dt) {
    const {
      UP: up, 
      DOWN: down, 
      LEFT: left, 
      RIGHT: right, 
      ROTATE_LEFT: rotateLeft, 
      ROTATE_RIGHT: rotateRight, 
      HOLD: hold, 
      ENTER: enter, 
      ESCAPE: escape
    } = this.keyMap;
    
    const { keyState, unboundKey, commandToBind } = this;
    const { field, piece, menu, gameState } = this.game;
  
    switch (gameState) {
      case GAMESTATE.MENU: {
        if (keyState[enter].pressed && keyState[enter].time === 0) {
          menu.enter();
        }

        if (keyState[escape].pressed && keyState[escape].time === 0) {
          menu.exit();
        }

        if (
          keyState[up].pressed 
          && (keyState[up].time === 0 || keyState[up].time >= this.das * 2)
        ) {
          menu.up();
        }

        if (
          keyState[down].pressed 
          && (keyState[down].time === 0 || keyState[down].time >= this.das * 2)
        ) {
          menu.down();
        }

        if (
          keyState[left].pressed
          && (keyState[left].time === 0 || keyState[left].time >= this.das )
        ) {
          menu.left();
        }

        if (
          keyState[right].pressed
          && (keyState[right].time === 0 || keyState[right].time >= this.das )
        ) {
          menu.right();
        }

        if (commandToBind && unboundKey.pressed && unboundKey.time === 0) {
          this.keyMap[commandToBind] = unboundKey.keyCode;
          this.commandToBind = null;
          this.keyState = this.createKeyState();
          this.unboundKey.pressed = false;
        }

        break;
      };
      case GAMESTATE.RUNNING: {
        if (keyState[enter].pressed && keyState[enter].time === 0) {
          this.game.togglePause();
        }

        if (keyState[up].pressed && keyState[up].time === 0) {
          this.game.drop(piece, FIELD_ROWS);
          this.game.lockPiece();
        }
      
        if (
          keyState[down].pressed 
          && keyState[down].time === 0 
          && this.game.gravity < this.sdr
        ) {
          this.game.setGravity(this.sdr);
        }
        
        /** 
         * Move piece left/right if: 
         *  key was just pressed, 
         *  pressed time is longer than DAS,
         *  or if an ARR interval has passed (not including DAS tick).
        */
        if (keyState[left].pressed) {
          if (keyState[left].time === 0) {
            this.ARtick += 1;
            this.horizontalMove(-1);
          } else if (keyState[left].time - this.das - ((this.ARtick - 1) * this.arr) >= 0) {
              const delta = keyState[left].time - (this.das + (this.ARtick - 1) * this.arr);
              const moves = Math.floor(delta / this.arr);
              
              for (let i = moves; i >= 0; i--) {
                this.ARtick += 1;
                this.horizontalMove(-1);
              }
          }
        }
      
        if (keyState[right].pressed) {
          if (keyState[right].time === 0) {
            this.ARtick += 1;
            this.horizontalMove(1);
          } else if (keyState[right].time - this.das - ((this.ARtick - 1) * this.arr) >= 0) {
            const delta = keyState[right].time - (this.das + (this.ARtick - 1) * this.arr);
            const moves = Math.floor(delta / this.arr);
            
            for (let i = moves; i >= 0; i--) {
              this.ARtick += 1;
              this.horizontalMove(1);
            }
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
        if (keyState[enter].pressed && keyState[enter].time === 0) {
          this.game.togglePause();
        }

        break;
      };
      case GAMESTATE.GAMEOVER: {
        if (
          (keyState[enter].pressed && keyState[enter].time === 0)
          || (keyState[escape].pressed && keyState[escape].time === 0)
        ) {
          this.game.toMenu();
        }

        break;
      };
    }

    for (let key in keyState) {
      if (keyState[key].pressed) {
        keyState[key].time += dt;
      }
    }

    if (unboundKey.pressed === true) unboundKey.time += dt;
  }

  bindCommand(command) {
    this.commandToBind = command;
  }

  setDas(val) {
    if (val >= 0 && val <= 1001) {
      this.das = val;
    }
  }

  setArr(val) {
    if (val > 1 && val <= 1001) {
      this.arr = val;
    }
  }

  setSdr(val) {
    if (val > 0 && val <= 20) {
      this.sdr = val;
    }
  }
}