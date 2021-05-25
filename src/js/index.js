import Game from './game';
import { FPS, FPStolerance } from './constants';

import '../styles/index.css';

const gameWidth = window.innerHeight * 1.33;
const gameHeight = window.innerHeight;

let game = new Game(gameWidth, gameHeight);

const frameInterval = 1000 / FPS - FPStolerance;

let lastUpdate = 0;
function loop(timestamp) {
  requestAnimationFrame(loop);

  let dt = timestamp - lastUpdate;

  if (dt < frameInterval) {
    return;
  }
  
  lastUpdate = timestamp;
  game.update(dt);
}

requestAnimationFrame(loop);