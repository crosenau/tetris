import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  NEXT_COLUMNS,
  NEXT_ROWS,
  HOLD_COLUMNS,
  HOLD_ROWS,
  BLOCK_STYLES
} from './constants';

const { floor } = Math;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const blockStyles = {
  T: ['magenta', 'darkmagenta'],
  O: ['yellow', 'gold'],
  I: ['cyan', 'darkcyan'],
  J: ['blue', 'darkblue'],
  L: ['orange', 'darkorange'],
  S: ['green', 'darkgreen'],
  Z: ['red', 'darkred'],
  G: ['#ccca', '#aaaa']
};

const debug = document.querySelector('#debug');

export default class Renderer {
  constructor(width, height) {
    canvas.width = width;
    canvas.height = height;

    this.cellWidth = width / 40;
    this.cellHeight = height / 30;
  }

  drawField(blocks) {
    const style = {
      top: 1 * this.cellHeight,
      left: 13 * this.cellWidth,
      bottom: 29 * this.cellHeight,
      right: 27 * this.cellWidth,
      paddingX: this.cellWidth / 2,
      paddingY: this.cellHeight / 2,
      paddingFill: '#444',
      innerFill: 'black',
    };
    
    this.drawGrid(blocks, FIELD_ROWS - HIDDEN_ROWS, FIELD_COLUMNS, style);
  }

  drawNextPreview(blocks) {
    const style = {
      top: 1 * this.cellHeight,
      left: (27 * this.cellWidth) - 1,
      bottom: 11 * this.cellHeight,
      right: 31 * this.cellWidth,
      paddingX: this.cellWidth / 2,
      paddingY: this.cellHeight / 2,
      paddingFill: '#444',
      innerFill: '#444',
    };

    this.drawGrid(blocks, NEXT_ROWS, NEXT_COLUMNS, style);
  }

  drawHoldView(blocks) {
    const style = {
      top: 1 * this.cellHeight,
      left: (9 * this.cellWidth),
      bottom: 5 * this.cellHeight,
      right: 13 * this.cellWidth,
      paddingX: this.cellWidth / 2,
      paddingY: this.cellHeight / 2,
      paddingFill: '#444',
      innerFill: '#444',
    };

    this.drawGrid(blocks, HOLD_ROWS, HOLD_COLUMNS, style);
  }

  drawStats(stats) {
    const style = {
      top: 13 * this.cellHeight,
      left: 27 * this.cellWidth,
      bottom: 17 * this.cellHeight,
      right: 32 * this.cellWidth,
      paddingX: this.cellWidth / 2,
      paddingY: this.cellHeight / 2,
      labelFont: `bold ${this.cellHeight}px Arial`,
      dataFont: `${this.cellHeight * 0.9}px Arial`,
      fill: 'white'
    };

    this.drawStat('Level', stats.level, style);
    this.drawStat('Lines', stats.lines, {
      ...style,
      top: 17 * this.cellHeight,
      bottom: 21 * this.cellHeight
    });
    this.drawStat('Score', stats.score, {
      ...style,
      top: 21 * this.cellHeight,
      bottom: 25 * this.cellHeight
    });
    this.drawStat('Time', stats.time, {
      ...style,
      top: 25 * this.cellHeight,
      bottom: 29 * this.cellHeight
    });
  }

  drawStat(label, data, style) {
    if (data === undefined) return; 
    
    ctx.clearRect(
      style.left + style.paddingX,
      style.top + style.paddingY - this.cellHeight,
      style.right - style.left - style.paddingX,
      style.bottom - style.top - style.paddingY - this.cellHeight
    );

    ctx.font = style.labelFont;
    ctx.fillStyle = style.fill;
    ctx.fillText(
      label,
      style.left + style.paddingX,
      style.top + style.paddingY
    );
    ctx.font = style.dataFont;
    ctx.fillText(
      String(data),
      style.left + style.paddingX,
      style.top + style.paddingY + style.paddingY * 2.5
    );
  }

  drawGrid(blocks, rows, columns, style) {
    const width = style.right - style.left;
    const height = style.bottom - style.top;
    
    ctx.clearRect(
      floor(style.left),
      floor(style.top),
      floor(style.width),
      floor(style.height)
    );
    ctx.fillStyle = style.paddingFill;
    ctx.fillRect(
      floor(style.left),
      floor(style.top),
      floor(width),
      floor(height)
    );
    ctx.fillStyle = style.innerFill;
    ctx.fillRect(
      floor(style.left + style.paddingX),
      floor(style.top + style.paddingY),
      floor(width - style.paddingX * 2),
      floor(height - style.paddingY * 2)
    );

    const blockWidth = width / columns - style.paddingX / columns * 2;
    const blockHeight = height / rows - style.paddingY / rows * 2;

    if (blocks) {
      for (let block of blocks) {
        this.drawBlocks(
          block,
          blockWidth,
          blockHeight,
          style.top + style.paddingY,
          style.left + style.paddingX
        );
      }
    }
  }

  drawBlocks(block, width, height, top = 0, left = 0) {
    const x = block.location.x;
    const y = block.location.y;

    const gradient = ctx.createLinearGradient(
      floor(x * width),
      floor(y * height + top),
      floor(x * width), 
      floor(y * height + height + top)
    );
  
    gradient.addColorStop(0, blockStyles[block.label][0]);
    gradient.addColorStop(1, blockStyles[block.label][1]);
  
    ctx.fillStyle = gradient;
    ctx.fillRect(
      x * width + left,
      y * height + top,
      width,
      height
    );
  
    const lineWidth = 1;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(
      floor(x * width + left + lineWidth), 
      floor(y * height + height + top + lineWidth)
    );
    ctx.lineTo(
      floor(x * width + left + lineWidth), 
      floor(y * height + top + lineWidth)
    );
    ctx.lineTo(
      floor(x * width + width + left + lineWidth), 
      floor(y * height + top + lineWidth)
    );
    ctx.stroke();
    
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(floor(x * width + width + left), floor(y * height + top));
    ctx.lineTo(floor(x * width + width + left), floor(y * height + height + top));
    ctx.lineTo(floor(x * width + left), floor(y * height + height + top));
    ctx.stroke();
  }
}