import {
  GRID_WIDTH,
  GRID_HEIGHT
} from './constants';

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9; 

const blockStyles = {
  T: ['magenta', 'darkmagenta'],
  O: ['yellow', 'gold'],
  I: ['cyan', 'darkcyan'],
  J: ['blue', 'darkblue'],
  L: ['orange', 'darkorange'],
  S: ['green', 'darkgreen'],
  Z: ['red', 'darkred']
};

const ctx = canvas.getContext('2d');

function drawBlock(block, width, height, xOffset, yOffset) {
  const { x, y } = block.location;

  const gradient = ctx.createLinearGradient(
    x * width + xOffset,
    y * height + yOffset,
    x * width + xOffset, 
    y * height + yOffset + height
  );

  gradient.addColorStop(0, blockStyles[block.label][0]);
  gradient.addColorStop(1, blockStyles[block.label][1]);

  ctx.fillStyle = gradient;
  ctx.fillRect(
    x * width + xOffset,
    y * height + yOffset,
    width,
    height
  );

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x * width + xOffset, y * height + yOffset + height);
  ctx.lineTo(x * width + xOffset, y * height + yOffset);
  ctx.lineTo(x * width + xOffset + width, y * height + yOffset);
  ctx.stroke();
  
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(x * width + xOffset + width, y * height + yOffset);
  ctx.lineTo(x * width + xOffset + width, y * height + yOffset + height);
  ctx.lineTo(x * width + xOffset, y * height + yOffset + height);
  ctx.stroke();
}

export function drawGameGrid(blocks) {
  const margin = canvas.height / 20;
  const left = canvas.width / 2 - canvas.height / 4 + margin;
  const top = margin;
  const width = canvas.width - left * 2;
  const height = canvas.height - top * 2;
  
  ctx.clearRect(left, top, width, height);
  
  const blockWidth = width / GRID_WIDTH;
  const blockHeight = height / GRID_HEIGHT;

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.strokeRect(
    left,
    top,
    width,
    height
  );

  for (let block of blocks) {
    drawBlock(block, blockWidth, blockHeight, left, top);
  }
}

const debug = document.querySelector('#debug');

export function drawQueue() {
  const margin = canvas.height / 10;
  const left = canvas.width / 2 + canvas.height / 4;
  const top = margin;
  const width = left / 4;
  const height = canvas.height - margin * 5;

  debug.innerHTML = `${left} ${top} ${width} ${height}`

  ctx.strokeStyle ='white';
  ctx.lineWidth = 4;
  ctx.strokeRect(left, top, width, height);
}