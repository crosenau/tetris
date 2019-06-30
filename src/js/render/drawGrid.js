import drawBlock from './drawBlock';
import {
  GRID_COLUMNS,
  GRID_ROWS,
  HIDDEN_ROWS
} from '../constants';

const canvas = document.querySelector('#grid');

// Calculate max possible dimensions for grid to fit into container
const parent = canvas.parentElement;
const pWidth = Number(getComputedStyle(parent).width.replace('px', ''));
const pHeight = Number(getComputedStyle(parent).height.replace('px', ''))
const gridWidth = 1;
const gridHeight = 2;
const scale = Math.min(pWidth / gridWidth, pHeight / gridHeight);

canvas.width = gridWidth * scale;
canvas.height = gridHeight * scale;
canvas.style.width=`${gridWidth * scale}px`;
canvas.style.height=`${gridHeight * scale}px`;

const ctx = canvas.getContext('2d');

export default function drawGrid(blocks) {
  const { width, height } = canvas;

  ctx.clearRect(0, 0, width, height);
  
  const blockWidth = Math.ceil(width / GRID_COLUMNS);
  const blockHeight = Math.ceil(height / (GRID_ROWS - HIDDEN_ROWS));

  for (let block of blocks) {
    drawBlock(block, blockWidth, blockHeight, ctx);
  }
}