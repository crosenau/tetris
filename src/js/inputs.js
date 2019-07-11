import { DAS } from './constants';

window.addEventListener('keydown', event => trackKeys(event));
window.addEventListener('keyup', event => trackKeys(event));

let keyMap = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  rotateLeft: 90, // z
  rotateRight: 88, // x
  hold: 65 // a
};

let keyState = {
  [keyMap.left]: { pressed: false, time: 0 },
  [keyMap.up]: { pressed: false, time: 0 },
  [keyMap.right]: { pressed: false, time: 0 },
  [keyMap.down]: { pressed: false, time: 0 },
  [keyMap.rotateLeft]: { pressed: false, time: 0 },
  [keyMap.rotateRight]: { pressed: false, time: 0 },
  [keyMap.hold]: { pressed: false, time: 0 },
};

function trackKeys(event) {
  const { type, keyCode } = event;

  if (type === 'keydown' && keyCode in keyState && keyState[keyCode].pressed === false) {
    keyState[keyCode].pressed = true;
  } else if (type ==='keyup' && keyCode in keyState) {
    keyState[keyCode].pressed = false;
    keyState[keyCode].time = 0;
    if (keyCode === keyMap.down) {
      window.dispatchEvent(endSoftDrop);
    }
  }
}

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

function testRotation(grid, piece, initRotation, toRotation) {
  // In case rotation occurs right when next piece spawns
  if (initRotation === toRotation) return;
  
  const initX = piece.topLeft.x;
  const initY = piece.topLeft.y;

  const tests = piece.label === 'I' ? rotationTests.I : rotationTests.others;
  const rotationsKey = `${initRotation}To${toRotation}`;

  for (let test of tests[rotationsKey]) {
    piece.move(test[0], test[1]);
    if (grid.intersects(piece.blocks)) {
      piece.moveTo(initX, initY);
    } else {
      return true;
    }
  }

  return false;
}

const hardDrop = new Event('harddrop');
const softDrop = new Event('softdrop');
const endSoftDrop = new Event('endsoftdrop');
const holdPiece = new Event('holdpiece');

export default function handleKeys(grid, piece, frameLapse) {
  const { up, down, left, right, rotateLeft, rotateRight, hold } = keyMap;

  if (keyState[up].pressed) {
    if (keyState[up].time === 0) {
      window.dispatchEvent(hardDrop);
      grid.remove(piece.blocks);
      while (!grid.intersects(piece.blocks)) {
        piece.move(0, 1);
      }

      piece.move(0, -1);
      grid.add(piece.blocks);
    }

    keyState[up].time += frameLapse;
  }

  if (keyState[down].pressed) {
    if (keyState[down].time === 0) {
      window.dispatchEvent(softDrop);
    }
    
    keyState[down].time += frameLapse;
  }

  if (keyState[left].pressed) {
    if (keyState[left].time === 0 || keyState[left].time >= DAS) {
      grid.remove(piece.blocks);
      piece.move(-1, 0);
      if (grid.intersects(piece.blocks)) {
        piece.move(1, 0);
      }
      
      grid.add(piece.blocks);
    }

    keyState[left].time += frameLapse;
  }

  if (keyState[right].pressed) {
    if (keyState[right].time === 0 || keyState[right].time >= DAS) {
      grid.remove(piece.blocks);
      piece.move(1, 0);
      if (grid.intersects(piece.blocks)) {
        piece.move(-1, 0);
      }

      grid.add(piece.blocks);
    }

    keyState[right].time += frameLapse;
  }

  if (keyState[rotateLeft].pressed) {
    if (keyState[rotateLeft].time === 0) {
      const initRotation = piece.rotation;

      grid.remove(piece.blocks);
      piece.rotateLeft();

      if (!testRotation(grid, piece, initRotation, piece.rotation)) {
        piece.rotateRight();
      }

      grid.add(piece.blocks);
    }

    keyState[rotateLeft].time += frameLapse;
  }

  if (keyState[rotateRight].pressed) {
    if (keyState[rotateRight].time === 0) {
      const initRotation = piece.rotation;

      grid.remove(piece.blocks);
      piece.rotateRight();

      if (!testRotation(grid, piece, initRotation, piece.rotation)) {
        piece.rotateLeft();
      }

      grid.add(piece.blocks);
    }

    keyState[rotateRight].time += frameLapse;
  }

  if(keyState[hold].pressed) {
    if (keyState[hold].time === 0) {
      window.dispatchEvent(holdPiece);
    }

    keyState[hold].time += frameLapse;
  }
}