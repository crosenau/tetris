const blockStyles = {
  T: ['magenta', 'darkmagenta'],
  O: ['yellow', 'gold'],
  I: ['cyan', 'darkcyan'],
  J: ['blue', 'darkblue'],
  L: ['orange', 'darkorange'],
  S: ['green', 'darkgreen'],
  Z: ['red', 'darkred'],
  G: ['#0000', '#0000']
};

export default function drawBlock(block, width, height, ctx) {
  const { x, y } = block.location;

  const gradient = ctx.createLinearGradient(
    x * width,
    y * height,
    x * width, 
    y * height + height
  );

  gradient.addColorStop(0, blockStyles[block.label][0]);
  gradient.addColorStop(1, blockStyles[block.label][1]);

  ctx.fillStyle = gradient;
  ctx.fillRect(
    x * width,
    y * height,
    width,
    height
  );

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x * width, y * height + height);
  ctx.lineTo(x * width, y * height);
  ctx.lineTo(x * width + width, y * height);
  ctx.stroke();
  
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(x * width + width, y * height);
  ctx.lineTo(x * width + width, y * height + height);
  ctx.lineTo(x * width, y * height + height);
  ctx.stroke();
}