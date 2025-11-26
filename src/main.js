const canvas = document.getElementById('playArea');
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let lastTime = performance.now();

const ball = {
  x: 160,
  y: 160,
  radius: 16,
  vx: 180,
  vy: -160,
  gravity: 480,
  bounce: 0.86,
};

function resizeCanvas() {
  const parent = canvas.parentElement;
  if (!parent) return;
  const nextWidth = parent.clientWidth;
  const nextHeight = parent.clientHeight;

  if (nextWidth === width && nextHeight === height) return;

  width = nextWidth;
  height = nextHeight;
  canvas.width = width;
  canvas.height = height;

  // Keep the ball inside the new bounds.
  ball.x = Math.min(Math.max(ball.radius, ball.x), width - ball.radius);
  ball.y = Math.min(Math.max(ball.radius, ball.y), height - ball.radius);
}

function drawBackground() {
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#0b1021');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, width - 16, height - 16);
}

function drawBall() {
  const glow = ctx.createRadialGradient(
    ball.x,
    ball.y,
    ball.radius * 0.2,
    ball.x,
    ball.y,
    ball.radius * 1.6,
  );
  glow.addColorStop(0, 'rgba(110, 231, 255, 0.95)');
  glow.addColorStop(1, 'rgba(79, 70, 229, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius * 1.6, 0, Math.PI * 2);
  ctx.fill();

  const fill = ctx.createRadialGradient(
    ball.x - ball.radius * 0.4,
    ball.y - ball.radius * 0.35,
    4,
    ball.x,
    ball.y,
    ball.radius,
  );
  fill.addColorStop(0, '#e7ff6b');
  fill.addColorStop(1, '#7f9728');
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function step(timestamp) {
  const delta = Math.min(0.05, (timestamp - lastTime) / 1000);
  lastTime = timestamp;

  resizeCanvas();
  drawBackground();

  // Physics.
  ball.vy += ball.gravity * delta;
  ball.x += ball.vx * delta;
  ball.y += ball.vy * delta;

  const left = ball.radius;
  const right = width - ball.radius;
  const top = ball.radius;
  const bottom = height - ball.radius;

  if (ball.x < left) {
    ball.x = left;
    ball.vx = Math.abs(ball.vx) * ball.bounce;
  } else if (ball.x > right) {
    ball.x = right;
    ball.vx = -Math.abs(ball.vx) * ball.bounce;
  }

  if (ball.y < top) {
    ball.y = top;
    ball.vy = Math.abs(ball.vy) * ball.bounce;
  } else if (ball.y > bottom) {
    ball.y = bottom;
    ball.vy = -Math.abs(ball.vy) * ball.bounce;
  }

  drawBall();
  requestAnimationFrame(step);
}

function init() {
  resizeCanvas();
  lastTime = performance.now();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(step);
}

init();
