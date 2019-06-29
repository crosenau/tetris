import Tetromino from './Tetromino';
import { J, L, T, O, I, S, Z } from './shapes';

const { floor, random } = Math;

const queue = [];

function getRandomBag() {
  const shapes = [J, L, T, O, I, S, Z];
  const bag = [];

  while (shapes.length > 0) {
    const x = 3;
    const y = 0;
    const nextShape = shapes.splice(floor(random() * shapes.length), 1)[0];

    bag.push(new Tetromino(x, y, nextShape));
  }

  return bag;
}

export function getNextPieces(num = 1) {
  while (queue.length < num) {
    queue.push(...getRandomBag());
  }

  const next = queue.splice(0, num);

  return next;
}

export function getQueue() {
  return queue;
}