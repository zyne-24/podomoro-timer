// Pomodoro timer — client-side state machine.
// States: idle -> running -> paused -> (switch) -> running ...
// Contract IDs (from BOARD T1->T2): #time-display #progress-bar #btn-start
// #btn-pause #btn-reset #mode-label #timer-card

const SESSION_MS = 25 * 60 * 1000;
const BREAK_MS = 5 * 60 * 1000;
const TICK_MS = 250;

const els = {
  card: document.getElementById('timer-card'),
  display: document.getElementById('time-display'),
  progress: document.getElementById('progress-bar'),
  modeLabel: document.getElementById('mode-label'),
  start: document.getElementById('btn-start'),
  pause: document.getElementById('btn-pause'),
  reset: document.getElementById('btn-reset'),
};

let state = 'idle'; // 'idle' | 'running' | 'paused'
let mode = 'session'; // 'session' | 'break'
let remaining = SESSION_MS; // ms left in current mode
let endTime = 0; // Date.now() + remaining when running
let intervalId = null;

const duration = () => (mode === 'session' ? SESSION_MS : BREAK_MS);

function fmt(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function render() {
  els.display.textContent = fmt(remaining);
  const pct = (1 - remaining / duration()) * 100;
  els.progress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  els.modeLabel.textContent = mode === 'session' ? 'FOKUS' : 'ISTIRAHAT';
  els.card.classList.toggle('is-break', mode === 'break');
}

function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function tick() {
  remaining = endTime - Date.now();
  if (remaining <= 0) {
    remaining = 0;
    render();
    finish();
    return;
  }
  render();
}

function flash() {
  // Restart CSS animation on each session end.
  els.card.classList.remove('flash');
  void els.card.offsetWidth; // reflow to re-trigger
  els.card.classList.add('flash');
}

function finish() {
  stopInterval();
  state = 'idle';
  flash();
  mode = mode === 'session' ? 'break' : 'session';
  remaining = duration();
  render();
}

export function start() {
  if (state === 'running') return;
  endTime = Date.now() + remaining;
  state = 'running';
  stopInterval();
  intervalId = setInterval(tick, TICK_MS);
}

export function pause() {
  if (state !== 'running') return;
  stopInterval();
  remaining = endTime - Date.now();
  state = 'paused';
  render();
}

export function reset() {
  stopInterval();
  state = 'idle';
  mode = 'session';
  remaining = SESSION_MS;
  render();
}

els.start.addEventListener('click', start);
els.pause.addEventListener('click', pause);
els.reset.addEventListener('click', reset);

// Expose for manual/headless testing (BOARD: expose via window or listeners).
window.pomodoro = { start, pause, reset, getState: () => ({ state, mode, remaining }) };

render();
