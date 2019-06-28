import Tetromino from './Tetromino';
import { J, L, T, O, I, S, Z } from './shapes';

const { floor, random } = Math;

const queue = [];

function getRandomBag() {
  const shapes = [J, L, T, O, I, S, Z];
  const bag = [];

  while (bag.length < 7) {
    const nextShape = shapes.splice(floor(random() * shapes.length), 1);
    bag.push(new Tetromino(3, 0, nextShape));
  }

  return bag;
}

function fillQueue() {
  while (queue.length < 14) {
    const bag = getRandomBag();
    queue.push(...bag);
  }
}

function getNextPiece() {
  const next = queue.shift();
  if (queue.length < 7) {
    fillQueue();
  }

  return next;
}

function showQueue() {
  return queue.slice(0, 8);
}

fillQueue();

console.log(queue);