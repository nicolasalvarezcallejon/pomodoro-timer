const WORK_MINUTES = 25;

const timeEl = document.getElementById('time');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');

let remaining = WORK_MINUTES * 60;
let endTime = null;
let intervalId = null;

function render() {
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  timeEl.textContent = `${minutes}:${seconds}`;
}

// Browsers slow down timers in background tabs, so counting ticks drifts.
// Work out the time left from the clock instead.
function tick() {
  remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  render();
  if (remaining <= 0) {
    pause();
  }
}

function start() {
  if (remaining <= 0) {
    remaining = WORK_MINUTES * 60;
  }
  endTime = Date.now() + remaining * 1000;
  intervalId = setInterval(tick, 250);
  startButton.textContent = 'Pause';
}

function pause() {
  clearInterval(intervalId);
  intervalId = null;
  startButton.textContent = 'Start';
}

function reset() {
  pause();
  remaining = WORK_MINUTES * 60;
  render();
}

startButton.addEventListener('click', () => (intervalId ? pause() : start()));
resetButton.addEventListener('click', reset);
document.addEventListener('visibilitychange', () => {
  if (intervalId && !document.hidden) {
    tick();
  }
});

render();
