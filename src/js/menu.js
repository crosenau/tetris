import keycode from 'keycode';
import { 
  LEFT,
  RIGHT,
  UP,
  DOWN,
  ROTATE_LEFT,
  ROTATE_RIGHT,
  HOLD
} from './constants';

export default class Menu {
  constructor(game) {
    this.game = game;
    this.keyMap = this.game.inputHandler.keyMap;

    this.screen = this.main;
    this.selection = 0;
  }

  main() {
    return {
      title: 'Tetris',
      from: null,
      options: [
        { name: 'New Game', to: this.newGame },
        { name: 'Controls', to: this.controls }
      ]
    };
  }

  newGame() {
    return {
      title: 'New Game',
      from: this.main,
      options: [
        { name: 'Marathon', func: () => this.game.startCountdown() },
        { name: '40 Line Sprint', func: () => this.game.startCountdown(40) },
      ]
    };
  }

  controls() {
    return {
      title: 'Controls',
      from: this.main,
      options: [
        {
          name: `Up / Hard Drop: ${keycode(this.keyMap[UP])}`,
          func: () => this.game.inputHandler.bindCommand(UP)
        },
        {
          name: `Down / Soft Drop: ${keycode(this.keyMap[DOWN])}`,
          func: () => this.game.inputHandler.bindCommand(DOWN)
        },
        {
          name: `Left: ${keycode(this.keyMap[LEFT])}`,
          func: () => this.game.inputHandler.bindCommand(LEFT)
        },
        {
          name: `Right: ${keycode(this.keyMap[RIGHT])}`,
          func: () => this.game.inputHandler.bindCommand(RIGHT)
        },
        {
          name: `Rotate Left: ${keycode(this.keyMap[ROTATE_LEFT])}`,
          func: () => this.game.inputHandler.bindCommand(ROTATE_LEFT)
        },
        {
          name: `Rotate Right: ${keycode(this.keyMap[ROTATE_RIGHT])}`,
          func: () => this.game.inputHandler.bindCommand(ROTATE_RIGHT)
        },
        {
          name: `Hold Piece: ${keycode(this.keyMap[HOLD])}`,
          func: () => this.game.inputHandler.bindCommand(HOLD)
        },
      ]
    };
  }

  enter() {
    const screen = this.screen();
    const currentSelection = screen.options[this.selection];
    
    if (currentSelection.to) {
      this.screen = currentSelection.to;
      this.selection = 0;
    }

    if (currentSelection.func) {
      currentSelection.func();
    }
  }
  
  exit() {
    const screen = this.screen();

    if (screen.from) {
      this.screen = screen.from;
      this.selection = 0;
    }
  }

  up() {
    const screen = this.screen();

    this.selection = this.selection === 0
      ? screen.options.length - 1
      : this.selection - 1;
  }

  down() {
    const screen = this.screen();

    this.selection = this.selection === screen.options.length - 1
      ? 0
      : this.selection + 1;
  }
  
  get currentScreen() {
    const screen = this.screen();
    
    return {
      title: screen.title,
      options: screen.options.map((opt, i) => {
        return { name: opt.name, selected: i === this.selection };
      })
    };
  }
}