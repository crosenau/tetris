import drawBlock from './drawBlock';

export default function drawGrid(blocks, rows, columns, canvas) {
  const { width, height } = canvas;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);
  
  const blockWidth = Math.floor(width / columns);
  const blockHeight = Math.floor(height / rows);

  for (let block of blocks) {
    drawBlock(block, blockWidth, blockHeight, ctx);
  }
}