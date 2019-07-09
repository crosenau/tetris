import drawGrid from './drawGrid';
import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  NEXT_COLUMNS,
  NEXT_ROWS,
  HOLD_COLUMNS,
  HOLD_ROWS
} from '../constants';

function setDimensions(canvas) {
  // Calculate max possible dimensions for grid to fit into container
  const container = canvas.parentElement;
  const cWidth = Number(getComputedStyle(container).width.replace('px', ''));
  const cHeight = Number(getComputedStyle(container).height.replace('px', ''));
  canvas.width = cWidth;
  canvas.height = cHeight;
  canvas.style.width=`${cWidth}px`;
  canvas.style.height=`${cHeight}px`;
  
}

const fieldCanvas = document.querySelector('#field');
const nextCanvas = document.querySelector('#next');
const holdCanvas = document.querySelector('#hold');

setDimensions(fieldCanvas);
setDimensions(nextCanvas);
setDimensions(holdCanvas);

export function drawField(blocks) {
  drawGrid(blocks, FIELD_ROWS - HIDDEN_ROWS, FIELD_COLUMNS, fieldCanvas);
}

export function drawNextPreview(blocks) {
  drawGrid(blocks, NEXT_ROWS, NEXT_COLUMNS, nextCanvas);
} 

export function drawHoldView(blocks) {
  drawGrid(blocks, HOLD_ROWS, HOLD_COLUMNS, holdCanvas);
}