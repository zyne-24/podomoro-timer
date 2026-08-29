// Headless logic test for src/scripts/timer.js
// No jsdom (RAM-constrained, per task). We mock document/window/Date/Interval
// as globals, import the ESM module, then drive window.pomodoro via the
// captured interval callback — so we never wait 25 real minutes.
import assert from 'node:assert';

const SESSION_MS = 25 * 60 * 1000;
const BREAK_MS = 5 * 60 * 1000;

// --- Mocks ---------------------------------------------------------------
const BASE = 1_700_000_000_000;
let now = BASE;
globalThis.Date.now = () => now;

// Capture the tick callback instead of firing on a real timer.
let tickFn = null;
let intervalActive = false;
globalThis.setInterval = (fn) => { tickFn = fn; intervalActive = true; return 1; };
globalThis.clearInterval = () => { tickFn = null; intervalActive = false; };

function makeEl() {
  return {
    textContent: '',
    style: {},
    offsetWidth: 0,
    classList: { toggle() {}, remove() {}, add() {} },
    addEventListener() {},
  };
}
const els = {
  'timer-card': makeEl(), 'time-display': makeEl(), 'progress-bar': makeEl(),
  'mode-label': makeEl(), 'btn-start': makeEl(), 'btn-pause': makeEl(), 'btn-reset': makeEl(),
};
globalThis.document = { getElementById: (id) => els[id] ?? makeEl() };
globalThis.window = {};

// Import AFTER globals are installed (ESM top-level touches document/window).
const mod = await import('../src/scripts/timer.js');
const pomodoro = globalThis.window.pomodoro;

// --- Tiny harness --------------------------------------------------------
let passed = 0;
const cases = [];
function test(name, fn) { cases.push([name, fn]); }

test('start() from idle -> running, remaining ~= SESSION_MS', () => {
  now = BASE;
  pomodoro.reset();
  pomodoro.start();
  const s = pomodoro.getState();
  assert.equal(s.state, 'running');
  assert.equal(s.mode, 'session');
  assert.ok(Math.abs(s.remaining - SESSION_MS) < 100, `remaining=${s.remaining}`);
  assert.equal(intervalActive, true);
});

test('pause() -> paused, remaining decreases from start', () => {
  now = BASE;
  pomodoro.reset();
  pomodoro.start();
  const before = pomodoro.getState().remaining;
  now = BASE + 5000; // advance 5s of (fake) time
  pomodoro.pause();
  const s = pomodoro.getState();
  assert.equal(s.state, 'paused');
  assert.ok(s.remaining < before, `remaining should drop (before=${before}, after=${s.remaining})`);
  assert.ok(Math.abs(s.remaining - (SESSION_MS - 5000)) < 100, `remaining=${s.remaining}`);
});

test('reset() -> idle, remaining=SESSION_MS, mode=session', () => {
  pomodoro.reset();
  const s = pomodoro.getState();
  assert.equal(s.state, 'idle');
  assert.equal(s.mode, 'session');
  assert.equal(s.remaining, SESSION_MS);
});

test('finish() (remaining<=0) -> switch to break mode', () => {
  now = BASE;
  pomodoro.reset();
  pomodoro.start();
  now = BASE + SESSION_MS + 1000; // past end
  tickFn(); // emulate interval firing the tick
  const s = pomodoro.getState();
  assert.equal(s.state, 'idle'); // auto-stop, waits for user
  assert.equal(s.mode, 'break');
  assert.equal(s.remaining, BREAK_MS);
  assert.equal(intervalActive, false); // interval cleared on finish
});

test('finish() from break -> switches back to session', () => {
  now = BASE;
  pomodoro.reset();
  pomodoro.start();
  now = BASE + SESSION_MS + 1000;
  tickFn(); // -> break
  assert.equal(pomodoro.getState().mode, 'break');
  pomodoro.start();
  now = BASE + SESSION_MS + 1000 + BREAK_MS + 1000;
  tickFn(); // -> session again
  const s = pomodoro.getState();
  assert.equal(s.mode, 'session');
  assert.equal(s.remaining, SESSION_MS);
});

test('start() while running is a no-op (idempotent)', () => {
  now = BASE;
  pomodoro.reset();
  pomodoro.start();
  const before = pomodoro.getState();
  now = BASE + 2000;
  pomodoro.start(); // should do nothing
  const after = pomodoro.getState();
  assert.equal(after.state, 'running');
  assert.equal(after.remaining, before.remaining); // endTime unchanged
});

test('pause() while not running is a no-op', () => {
  pomodoro.reset();
  const before = pomodoro.getState().remaining;
  pomodoro.pause(); // idle -> no-op
  assert.equal(pomodoro.getState().remaining, before);
});

// --- Run -----------------------------------------------------------------
let failed = 0;
for (const [name, fn] of cases) {
  try { fn(); passed++; console.log(`  PASS  ${name}`); }
  catch (e) { failed++; console.log(`  FAIL  ${name}\n        ${e.message}`); }
}
console.log(`\n${passed}/${cases.length} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
