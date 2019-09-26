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
        { name: 'Options', to: this.options }
      ]
    };
  }

  newGame() {
    return {
      title: 'New Game',
      from: this.main,
      options: [
        { name: 'Marathon', to: this.selectLevel },
        { name: '40 Line Sprint', to: () => this.selectLevel(40) },
      ]
    };
  }

  selectLevel(goal) {
    return {
      title: 'Select Level',
      from: this.newGame,
      options: [
        { 
          name: `Level: ${this.game.level}`, 
          leftFunc: () => this.game.setLevel(this.game.level - 1),
          rightFunc: () => this.game.setLevel(this.game.level + 1),
          enterFunc: () => this.game.startCountdown(goal)
        }
      ]
    }
  }

  options() {
    return {
      title: 'Options',
      from: this.main,
      options: [
        { 
          name: `DAS: ${this.game.inputHandler.das} ms`, 
          leftFunc: () => this.game.inputHandler.setDas(this.game.inputHandler.das - 10),
          rightFunc: () => this.game.inputHandler.setDas(this.game.inputHandler.das + 10)
        },
        { name: 'Key Bindings', to: this.keyBindings }
      ]
    };
  }

  keyBindings() {
    return {
      title: 'Key Bindings',
      from: this.options,
      options: [
        {
          name: `Menu Up / Hard Drop: ${keycode(this.keyMap[UP])}`,
          enterFunc: () => this.game.inputHandler.bindCommand(UP)
        },
        {
          name: `Menu Down / Soft Drop: ${keycode(this.keyMap[DOWN])}`,
          enterFunc: () => this.game.inputHandler.bindCommand(DOWN)
        },
        {
          name: `Move Left: ${keycode(this.keyMap[LEFT])}`,
          enterFunc: () => this.game.inputHandler.bindCommand(LEFT)
        },
        {
          name: `Move Right: ${keycode(this.keyMap[RIGHT])}`,
          enterFunc: () => this.game.inputHandler.bindCommand(RIGHT)
        },
        {
          name: `Rotate Left: ${keycode(this.keyMap[ROTATE_LEFT])}`,
          enterFunc: () => this.game.inputHandler.bindCommand(ROTATE_LEFT)
        },
        {
          name: `Rotate Right: ${keycode(this.keyMap[ROTATE_RIGHT])}`,
          enterFunc: () => this.game.inputHandler.bindCommand(ROTATE_RIGHT)
        },
        {
          name: `Hold Piece: ${keycode(this.keyMap[HOLD])}`,
          enterFunc: () => this.game.inputHandler.bindCommand(HOLD)
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

    if (currentSelection.enterFunc) {
      currentSelection.enterFunc();
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

  left() {
    const screen = this.screen();
    const currentSelection = screen.options[this.selection];

    if (currentSelection.leftFunc) {
      currentSelection.leftFunc();
    }
  }

  right() {
    const screen = this.screen();
    const currentSelection = screen.options[this.selection];

    if (currentSelection.rightFunc) {
      currentSelection.rightFunc();
    }
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