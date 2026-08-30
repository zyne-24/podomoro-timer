# BOARD: pomodoro-timer

## 🎯 Active Tasks
| ID | Task | Assignee | Status | Note |
|----|------|----------|--------|------|
| T1 | Mockup UI timer (tampilan, progress bar, tombol) | designer | done | SVG mockup + tokens.css |
| T2 | Bangun UI + logic timer (Astro+Tailwind, vanilla JS) | frontend | done | countdown, start/pause/reset, session/break switch, progress bar |
| T3 | Test logic timer + edge case | qa | qa-pass | headless logic test, 7/7 pass, no blocker |
| T4 | PR ke GitHub (repo zyne-24/pomodoro-timer --private) | release | todo | setelah qa-pass |
| SEC | Security audit | security | security-pass | no secret, no XSS, static-only; added .gitignore |
| REF | Refactor cleanup | refactor | refactor-done | hapus duplikasi token warna (break/flash == leaf/terracotta); 7/7 test pass |

Status: todo | doing | blocked | done | ready-for-qa | qa-pass | pr-open


> RELEASE NOTE: project baru = repo baru. Pas T4, bikin `gh repo create zyne-24/pomodoro-timer --private` (token di /home/zeraa/dev-team/secrets/gh_token.txt), lalu push branch main. Bukan branch di repo lama.

## 🏗️ Desain (Architect)
**Stack:** Astro + Tailwind + vanilla JS (pure frontend, tanpa backend — state di client).

**Struktur folder:**
```
pomodoro-timer/
├── src/
│   ├── pages/
│   │   └── index.astro          # halaman utama timer
│   ├── components/
│   │   └── Timer.astro          # markup timer (display + tombol + progress)
│   ├── scripts/
│   │   └── timer.js             # logic vanilla JS (countdown, state machine)
│   └── styles/
│       └── tokens.css           # design tokens (warna, radius, font)
├── public/                      # asset statis (icon notif)
├── tailwind.config.js
├── astro.config.mjs
└── package.json
```

**Alur timer (state machine, client-side):**
- State: `idle → running → paused → (break) → running → …`
- Konstanta: `SESSION_MS = 25*60*1000`, `BREAK_MS = 5*60*1000`.
- `start()`: jika idle/paused → set `endTime = Date.now() + remaining`, jalanin `setInterval` 250ms update `remaining = endTime - Date.now()`.
- `pause()`: clear interval, simpan `remaining`.
- `reset()`: clear interval, `remaining = SESSION_MS`, state idle, progress 0.
- Saat `remaining <= 0`: trigger notif visual (flash background / ganti warna + teks "Waktu habis!"), switch session↔break (`mode = mode==='session' ? 'break' : 'session'`), set `remaining` ke durasi mode baru, auto-stop (tunggu user start).
- **Progress bar:** `width% = (1 - remaining/duration) * 100`, update tiap tick. CSS transition halus.
- **Notif visual:** elemen `.timer-display` dapat kelas `flash` (animasi CSS) + swap teks mode ("Fokus" / "Istirahat"). (Audio opsional, skip dulu.)
- **Display:** `MM:SS` dari `remaining`, 2 digit pad.

**Kontrak komponen (T2 <- T1):**
- Elemen wajib: `#time-display` (teks), `#progress-bar` (div width%), `#btn-start`, `#btn-pause`, `#btn-reset`, `#mode-label` (Fokus/Istirahat), `#timer-card` (target flash).
- JS expose fungsi `start/pause/reset` via `window` atau event listener tombol.

**Escalation check:** Stack Astro+Tailwind+vanilla JS sudah sesuai brief user → tidak perlu eskalasi.

## 📝 Log
- [init] brief: Web UI Pomodoro Timer interaktif: start/pause/reset, session 25 menit, break 5 menit, notif visual, progress bar. Stack Astro+Tailwind+vanilla JS.
- [architect] desain ditulis: struktur folder, state machine timer, kontrak komponen T1→T2. Task dipecah T1(designer) T2(frontend) T3(qa) T4(release).
- [frontend] T2 done. Built Astro+Tailwind+vanilla-JS timer per contract. Files: `package.json`, `astro.config.mjs`, `src/styles/global.css` (flash/break keyframes), `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/components/Timer.astro` (locked contract IDs), `src/scripts/timer.js` (state machine idle→running→paused→switch, SESSION_MS 25m / BREAK_MS 5m, setInterval 250ms, progress = (1-remaining/duration)*100, flash + mode swap FOKUS/ISTIRAHAT). `window.pomodoro` exposed for headless test. NOT installed/built (RAM 2GB) — T3 to verify.
- [qa] T3 qa-pass. Headless logic test `tests/timer.test.mjs` (no jsdom — mocked document/window/Date/setInterval globals, drove `window.pomodoro` via captured tick fn; RAM-constrained, per task). `node --check` OK. 7/7 pass: start idle→running remaining≈25m; pause→paused remaining drops; reset→idle remaining=25m mode=session; finish(remaining<=0)→break mode + interval cleared + auto-stop; finish from break→session; start-while-running no-op; pause-while-idle no-op. No blocker. T4 unblocked.
- [security] audit → security-pass. Secret scan (git ls-files n/a — not a repo yet; manual grep + file scan): no .env/token/key/password/credential in any tracked source or file. XSS scan: `timer.js` uses only `textContent` + `style.width` + `classList` — no `innerHTML`/`set:html`/`eval`/`new Function`/`fetch`/`document.write`. Pure static frontend, no user input, no backend/PocketBase → no injection/path-traversal surface. `.gitignore` missing (secret-prevention gap) → created with `.env`, `secrets/`, `node_modules/`, `dist/` (within role authority). T4 unblocked.
- [refactor] cleanup pre-release → refactor-done. Hapus duplikasi token warna: `--color-break`/`--color-flash` di `tokens.css`冗余 (hex == `--color-leaf`/`--color-terracotta`) → ganti pemakaian langsung di `global.css` + hapus 2 var; `break`/`flash` di `tailwind.config.js` tak pernah dipakai → hapus. Tidak ubah behaviour/visual (hex identik). Tidak hapus fitur. Test `node tests/timer.test.mjs` → 7/7 pass.
- [designer] T1 done. Mockup SVG `mockup-timer.svg` (timer card: #time-display 25:00, #progress-bar 70%, #btn-start terracotta / #btn-pause / #btn-reset, #mode-label FOKUS) + break-mode hint (ISTIRAHAT 05:00). Tokens `src/styles/tokens.css` (earthy palette shared w/ hello-web: cream bg, forest/leaf green, terracotta CTA, + timer state vars break/flash, fs-display, motion). `tailwind.config.js` theme.extend mirrors tokens. PNG skip: cairosvg/rsvg tidak terpasang, SVG cukup.

## 🚀 PR
- (none yet) — T4 target: repo `zyne-24/project-ais`, branch `feature/pomodoro-timer`

## ⚙️ Discord Mapping
job-<nama> → channel ID <xxx>
