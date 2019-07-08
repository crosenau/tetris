import drawGrid from './drawGrid';
import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  NEXT_COLUMNS,
  NEXT_ROWS
} from '../constants';

function setDimensions(canvas) {
  // Calculate max possible dimensions for grid to fit into container
  const container = canvas.parentElement;

  const cWidth = Number(getComputedStyle(container).width.replace('px', ''));
  const cHeight = Number(getComputedStyle(container).height.replace('px', ''))

  const gridWidth = 1;
  const gridHeight = 2;
  const scale = Math.min(cWidth / gridWidth, cHeight / gridHeight);

  canvas.width = gridWidth * scale;
  canvas.height = gridHeight * scale;
  canvas.style.width=`${gridWidth * scale}px`;
  canvas.style.height=`${gridHeight * scale}px`;
}

const fieldCanvas = document.querySelector('#field');
const nextCanvas = document.querySelector('#next');
// const holdCanvas = document.querySelector('#hold');

setDimensions(fieldCanvas);
setDimensions(nextCanvas);

export function drawField(blocks) {
  drawGrid(blocks, FIELD_ROWS - HIDDEN_ROWS, FIELD_COLUMNS, fieldCanvas);
}

export function drawNextPreview(blocks) {
  drawGrid(blocks, NEXT_ROWS, NEXT_COLUMNS, nextCanvas);
} 