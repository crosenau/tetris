import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  HIDDEN_ROWS,
  NEXT_COLUMNS,
  NEXT_ROWS,
  HOLD_COLUMNS,
  HOLD_ROWS
} from './constants';

const { floor } = Math;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const blockStyles = {
  T: ['#800080', '#400040'],
  O: ['#ffff00', '#808000'],
  I: ['#00ffff', '#008080'],
  J: ['#0000ff', '#000080'],
  L: ['#ff7f00', '#803f00'],
  S: ['#00ff00', '#008000'],
  Z: ['#ff0000', '#800000'],
  TG: ['#80008040', '#40004040'],
  OG: ['#ffff0040', '#80800040'],
  IG: ['#00ffff40', '#00808040'],
  JG: ['#0000ff40', '#00008040'],
  LG: ['#ff7f0040', '#803f0040'],
  SG: ['#00ff0040', '#00800040'],
  ZG: ['#ff000040', '#80000040'],
};

const fontFamily = 'Orbitron';

export default class Renderer {
  constructor(width, height) {
    canvas.width = width;
    canvas.height = height;

    // Divide canvas into grid for positioning of elements
    this.cellWidth = width / 40;
    this.cellHeight = height / 30;

    // Positioning and style for game field. Used in several draw methods
    this.fieldStyle = {
      top: 1 * this.cellHeight,
      left: 13 * this.cellWidth,
      bottom: 29 * this.cellHeight,
      right: 27 * this.cellWidth,
      padLeft: this.cellWidth / 2,
      padRight: this.cellWidth / 2,
      padTop: this.cellHeight / 2,
      padBottom: this.cellHeight / 2,
      padFill: '#444',
      fill: 'black',
    };
  }

  drawStats(stats) {
    const style = {
      top: 14 * this.cellHeight,
      left: 27 * this.cellWidth,
      bottom: 18 * this.cellHeight,
      right: 33 * this.cellWidth,
      padLeft: this.cellWidth / 2,
      padTop: this.cellHeight / 2,
      font: `bold ${this.cellHeight}px ${fontFamily}`,
      dataFont: `${this.cellHeight * 0.8}px ${fontFamily}`,
      textAlign: 'left',
      textFill: 'white'
    };

    this.drawStat('Level', stats.level, {
      ...style,
      left: 7 * this.cellWidth,
      right: 12.9 * this.cellWidth,
      top: 22 * this.cellHeight,
      bottom: 26 * this.cellHeight,
      textAlign: 'right'
    });

    this.drawStat('Score', stats.score, {
      ...style,
      left: 7 * this.cellWidth,
      right: 12.9 * this.cellWidth,
      top: 26 * this.cellHeight,
      bottom: 30 * this.cellHeight,
      textAlign: 'right'
    });

    this.drawStat('Lines', stats.lines, {
      ...style,
      top: 22 * this.cellHeight,
      bottom: 26 * this.cellHeight
    });

    this.drawStat('Time', stats.time, {
      ...style,
      top: 26 * this.cellHeight,
      bottom: 30 * this.cellHeight
    });
  }

  drawStat(label, data, style) {
    if (data === undefined) return; 
    
    ctx.clearRect(
      style.left + 1,
      style.top - this.cellHeight + 1,
      style.right - style.left,
      style.bottom - style.top - this.cellHeight
    );

    ctx.textAlign = style.textAlign;
    ctx.font = style.font;
    ctx.fillStyle = style.textFill;

    let textStart;

    if (style.textAlign === 'left') {
      textStart = style.left + style.padLeft;
    } else {
      textStart = style.right - style.padLeft;
    }

    ctx.fillText(
      label,
      textStart,
      style.top + style.padTop
    );

    ctx.font = style.dataFont;
    ctx.fillText(
      String(data),
      textStart,
      style.top + style.padTop + style.padTop * 2.5
    );
  }

  drawMenu(screen) {
    this.fieldOverlay();

    const style = this.fieldStyle;
    const width = style.right - style.left - style.padLeft - style.padRight;
    const height = style.bottom - style.top - style.padTop - style.padBottom;

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    ctx.font = `${this.cellHeight * 1.5}px ${fontFamily}`;
    ctx.fillText(
      screen.title,
      style.left + style.padLeft + width / 2,
      style.top + style.padTop + this.cellHeight * 3,
    );

    let y = 
      style.top + style.padTop + height / 2 
      - floor(screen.options.length / 2) * (this.cellHeight + style.padTop);

    ctx.font = `${this.cellHeight * 0.75}px ${fontFamily}`;
      
    for (let opt of screen.options) {
      ctx.fillStyle = opt.selected ? 'white' : '#aaa'
      ctx.fillText(
        opt.name,
        style.left + style.padLeft + width / 2,
        y
      );

      y += this.cellHeight + style.padTop;
    }
  }

  drawGameOver(text = 'Game Over') {
    this.fieldOverlay('#00000003');

    const style = this.fieldStyle;
    const width = style.right - style.left - style.padLeft - style.padRight;
    const height = style.bottom - style.top - style.padTop - style.padBottom;

    ctx.fillStyle = 'white';
    ctx.font = `${this.cellHeight * 0.9}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      text,
      style.left + style.padLeft + width / 2,
      style.top + style.padTop + height / 2,
    );
  }

  drawPaused() {
    this.fieldOverlay('#000a');

    const style = this.fieldStyle;
    const width = style.right - style.left - style.padLeft - style.padRight;
    const height = style.bottom - style.top - style.padTop - style.padBottom;

    ctx.fillStyle = 'white';
    ctx.font = `${this.cellHeight * 0.9}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'Paused',
      style.left + style.padLeft + width / 2,
      style.top + style.padTop + height / 2,
    );
  }

  drawCountdown(text) {
    this.fieldOverlay();

    const style = this.fieldStyle;
    const width = style.right - style.left - style.padLeft - style.padRight;
    const height = style.bottom - style.top - style.padTop - style.padBottom;
    
    ctx.fillStyle = 'white';
    ctx.font = `${this.cellHeight * 1.5}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      text,
      style.left + style.padLeft + width / 2,
      style.top + style.padTop + height / 2,
    );
  }

  fieldOverlay(color = 'black') {
    const width = 
      this.fieldStyle.right - this.fieldStyle.left 
      - this.fieldStyle.padLeft - this.fieldStyle.padRight;
    const height = 
      this.fieldStyle.bottom - this.fieldStyle.top 
      - this.fieldStyle.padTop - this.fieldStyle.padBottom;

    ctx.fillStyle = color;
    ctx.fillRect(
      this.fieldStyle.left + this.fieldStyle.padLeft - 1,
      this.fieldStyle.top + this.fieldStyle.padTop - 1,
      width + 1,
      height + 1
    );
  } 

  drawField(blocks) {
    const style = this.fieldStyle;

    this.drawGrid(blocks, FIELD_ROWS - HIDDEN_ROWS, FIELD_COLUMNS, style);
  }

  drawNextPreview(blocks) {
    const style = {
      top: 1 * this.cellHeight,
      left: (27 * this.cellWidth) - 1,
      bottom: 21 * this.cellHeight,
      right: 31 * this.cellWidth,
      padLeft: this.cellWidth / 2,
      padRight: this.cellWidth / 2,
      padTop: this.cellHeight * 2.5,
      padBottom: this.cellHeight / 2,
      padFill: '#444',
      fill: '#444',
      font: `bold ${this.cellHeight / 1.5}px ${fontFamily}`,
      textAlign: 'center',
      textFill: 'white'
    };

    this.drawGrid(blocks, NEXT_ROWS, NEXT_COLUMNS, style, 'Next');
  }

  drawHoldView(blocks) {
    const style = {
      top: 1 * this.cellHeight,
      left: 9 * this.cellWidth,
      bottom: 7 * this.cellHeight,
      right: 13 * this.cellWidth + 1,
      padLeft: this.cellWidth / 2,
      padRight: this.cellWidth / 2,
      padTop: this.cellHeight * 2.5,
      padBottom: this.cellHeight / 2,
      padFill: '#444',
      fill: '#444',
      font: `bold ${this.cellHeight / 1.5}px ${fontFamily}`,
      textAlign: 'center',
      textFill: 'white'
    };

    this.drawGrid(blocks, HOLD_ROWS, HOLD_COLUMNS, style , 'Hold');
  }

  drawGrid(blocks, rows, columns, style, label) {
    const width = style.right - style.left;
    const height = style.bottom - style.top;
    
    ctx.clearRect(
      floor(style.left),
      floor(style.top),
      floor(style.width),
      floor(style.height)
    );
    ctx.fillStyle = style.padFill;
    ctx.fillRect(
      floor(style.left),
      floor(style.top),
      floor(width),
      floor(height)
    );

    if (label) {
      ctx.fillStyle = style.textFill;
      ctx.font = style.font;
      ctx.textAlign = style.textAlign;
      ctx.fillText(
        label,
        style.left + width / 2,
        style.top + style.padTop / 2,
      );
    }

    ctx.fillStyle = style.fill;
    ctx.fillRect(
      floor(style.left + style.padLeft),
      floor(style.top + style.padTop),
      floor(width - style.padLeft - style.padRight),
      floor(height - style.padTop - style.padBottom)
    );

    const blockWidth = width / columns - (style.padLeft + style.padRight) / columns;
    const blockHeight = height / rows - (style.padTop + style.padBottom) / rows;

    if (blocks) {
      for (let block of blocks) {
        this.drawBlocks(
          block,
          blockWidth,
          blockHeight,
          style.top + style.padTop,
          style.left + style.padLeft
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