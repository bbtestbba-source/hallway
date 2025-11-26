const canvas = document.getElementById('sceneCanvas');
const statusOverlay = document.getElementById('statusOverlay');
const statusText = document.getElementById('statusText');
const startButton = document.getElementById('startButton');

const speedXInput = document.getElementById('speedX');
const speedYInput = document.getElementById('speedY');
const bounceInput = document.getElementById('bounce');
const gravityInput = document.getElementById('gravity');

const speedXValue = document.getElementById('speedXValue');
const speedYValue = document.getElementById('speedYValue');
const bounceValue = document.getElementById('bounceValue');
const gravityValue = document.getElementById('gravityValue');

const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let running = false;
let lastTimestamp = 0;

const ball = {
  x: 120,
  y: 120,
  radius: 18,
  vx: 150,
  vy: -120,
  bounce: 0.85,
  gravity: 250,
};

function resizeCanvas() {
  const parent = canvas.parentElement;
  if (!parent) return;
  const nextWidth = parent.clientWidth;
  const nextHeight = parent.clientHeight;

  if (nextWidth !== width || nextHeight !== height) {
    width = nextWidth;
    height = nextHeight;
    canvas.width = width;
    canvas.height = height;
    // Re-center the ball if it was outside the new bounds.
    ball.x = Math.min(Math.max(ball.radius, ball.x), width - ball.radius);
    ball.y = Math.min(Math.max(ball.radius, ball.y), height - ball.radius);
  }
}

function drawBox() {
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0f172a');
  bgGradient.addColorStop(1, '#0b1021');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, width - 12, height - 12);
}

function drawBall() {
  const glow = ctx.createRadialGradient(ball.x, ball.y, ball.radius * 0.2, ball.x, ball.y, ball.radius * 1.4);
  glow.addColorStop(0, 'rgba(110, 231, 255, 0.95)');
  glow.addColorStop(1, 'rgba(79, 70, 229, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  const fill = ctx.createRadialGradient(ball.x - ball.radius * 0.4, ball.y - ball.radius * 0.4, 6, ball.x, ball.y, ball.radius);
  fill.addColorStop(0, '#e7ff6b');
  fill.addColorStop(1, '#7f9728');
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function updateValuesDisplay() {
  speedXValue.textContent = Math.round(ball.vx);
  speedYValue.textContent = Math.round(ball.vy);
  bounceValue.textContent = ball.bounce.toFixed(2);
  gravityValue.textContent = Math.round(ball.gravity);
}

function updateFromControls() {
  ball.vx = parseFloat(speedXInput.value);
  ball.vy = parseFloat(speedYInput.value);
  ball.bounce = parseFloat(bounceInput.value);
  ball.gravity = parseFloat(gravityInput.value);
  updateValuesDisplay();
}

function step(timestamp) {
  if (!running) return;

  const delta = (timestamp - lastTimestamp) / 1000 || 0;
  lastTimestamp = timestamp;

  resizeCanvas();
  drawBox();

  // Apply physics.
  ball.vy += ball.gravity * delta;
  ball.x += ball.vx * delta;
  ball.y += ball.vy * delta;

  // Collisions.
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

function start() {
  if (running) return;
  running = true;
  lastTimestamp = performance.now();
  statusOverlay.classList.add('hidden');
  resizeCanvas();
  requestAnimationFrame(step);
}

function init() {
  updateFromControls();
  speedXInput.addEventListener('input', updateFromControls);
  speedYInput.addEventListener('input', updateFromControls);
  bounceInput.addEventListener('input', updateFromControls);
  gravityInput.addEventListener('input', updateFromControls);

  startButton?.addEventListener('click', start);
  statusText.textContent = 'Press start to see the ball bounce inside the box.';

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawBox();
  drawBall();
}

init();
