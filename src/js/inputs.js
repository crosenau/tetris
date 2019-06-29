window.addEventListener('keydown', event => trackKeys(event));
window.addEventListener('keyup', event => trackKeys(event));

let keyMap = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  rotateLeft: 90,
  rotateRight: 88,
  hold: 65
};

let keyState = {
  [keyMap.left]: { pressed: false, time: 0 }, // left
  [keyMap.up]: { pressed: false, time: 0 }, // up
  [keyMap.right]: { pressed: false, time: 0 }, // right
  [keyMap.down]: { pressed: false, time: 0 }, // down
  [keyMap.rotateLeft]: { pressed: false, time: 0 }, // z (rotate Left)
  [keyMap.rotateRight]: { pressed: false, time: 0 }, // x (rotate Right)
  [keyMap.hold]: { pressed: false, time: 0 }, // a (hold)
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

function tryWallKick(grid, piece) {
  piece.move(-1, 0);
  if (grid.willCollide(piece.blocks)) {
    piece.move(2, 0);
    if (grid.willCollide(piece.blocks)) {
      piece.move(-1, 0);
      return false;
    }
  }
  return true;
}

function tryFloorKick(grid, piece) {
  piece.move(0, 1);
  if (grid.willCollide(piece.blocks)) {
    piece.move(0, -2);
    if (grid.willCollide(piece.blocks)) {
      piece.move(0, 1);
      return false;
    }
  }

  return true;
}

const DAS = 250; // Piece autoshift delay

const hardDrop = new Event('harddrop');
const softDrop = new Event('softdrop');
const endSoftDrop = new Event('endsoftdrop');

export default function handleKeys(grid, piece, frameLapse) {
  const { up, down, left, right, rotateLeft, rotateRight, hold } = keyMap;

  if (keyState[up].pressed) {
    if (keyState[up].time === 0) {
      window.dispatchEvent(hardDrop);
      grid.remove(piece.blocks);
      while (!grid.willCollide(piece.blocks)) {
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
      if (grid.willCollide(piece.blocks)) {
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
      if (grid.willCollide(piece.blocks)) {
        piece.move(-1, 0);
      }

      grid.add(piece.blocks);
    }

    keyState[right].time += frameLapse;
  }

  if (keyState[rotateLeft].pressed) {
    if (keyState[rotateLeft].time === 0) {
      grid.remove(piece.blocks);
      piece.rotateLeft();
      if (grid.willCollide(piece.blocks)) {
        let success = tryWallKick(grid, piece);

        if (!success) success = tryFloorKick(grid, piece);
        if (!success) {
          piece.rotateRight(grid, piece);
        }
      }

      grid.add(piece.blocks);
    }

    keyState[rotateLeft].time += frameLapse;
  }

  if (keyState[rotateRight].pressed) {
    if (keyState[rotateRight].time === 0) {
      grid.remove(piece.blocks);
      piece.rotateRight();
      if (grid.willCollide(piece.blocks)) {
        let success = tryWallKick(grid, piece);

        if (!success) success = tryFloorKick(grid, piece);
        if (!success) {
          piece.rotateLeft();
        }
      }

      grid.add(piece.blocks);

    }
    keyState[rotateRight].time += frameLapse;
  }
}