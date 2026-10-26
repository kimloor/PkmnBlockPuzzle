# QA Baseline — PkmnBlockPuzzle (Tetris)

**Audit date:** 2026-10-26  
**Repository:** https://github.com/kimloor/PkmnBlockPuzzle  
**Audited branch:** `master`  
**Frozen baseline commit:** [`ab26e63da36058043532ceb3281478d4ecfcc82b`](https://github.com/kimloor/PkmnBlockPuzzle/commit/ab26e63da36058043532ceb3281478d4ecfcc82b)  
**Audited game version:** **0.1.3** in `TetrisApp/config.xml` and `.game-version` in `TetrisApp/www/index.html`.  
**Documentation publication version:** **0.1.4**, a metadata/docs-only bump; game logic was audited at 0.1.3.

## Executive summary

**Phase 2 readiness: CONDITIONAL** (not release-ready). Source review found two independently traceable gameplay logic defects, missing BGM source, and insufficient automated test coverage. Browser and Android functional correctness remain **NOT TESTED**, not PASS. No gameplay source was modified and no APK build was requested or triggered.

**Evidence hierarchy:** `FAIL (static)` means a deterministic error path is evident in source, not a claimed observed browser failure. `WARNING` is a credible risk requiring runtime reproduction. `PASS` is reserved for checks directly verifiable through repository configuration or version text. `NOT TESTED` means runtime proof is unavailable.

## Test environment / limitations

- Read-only GitHub connector inspection of frozen master commit, repository tree, documentation, HTML, JavaScript, stylesheets and Actions workflow YAML.
- Source files: `TetrisApp/www/js/core/{constants,main}.js`, `game/{board,piece}.js`, `controls/controls.js`, `services/{scoreLevelManager,storage,localization,theme,audio}.js`, `ui/menu.js`, `TetrisApp/www/index.html`, `css/{responsive,mobile-fix}.css`.
- No browser automation, Android emulator, physical Android device, DOM/runtime console traces, screenshot evidence, or executable test harness available during this audit. Attempted environment-side Git clone failed because DNS/network access was unavailable.
- `TetrisApp/package.json` has Cordova Android dependency but no `test` or `lint` script. No automated gameplay test suite or gameplay-test workflow exists in the inspected repository tree. Thus **automated tests executed: 0**; no unit-test pass/fail count is claimed.
- No APK build and no workflow dispatch. Actions configuration inspected statically, not executed.

## Audit checklist (outcome / evidence)

| Area | Check | Result | Evidence or limit |
|---|---|---|---|
| Preparation | Master HEAD baseline | PASS | GitHub branch API reports `ab26e63da36058043532ceb3281478d4ecfcc82b` |
| Preparation | Version synchronisation at baseline | PASS | `config.xml` and `index.html` show 0.1.3 |
| Preparation | README, AGENTS, ROADMAP, GAME_DESIGN, CHANGELOG reviewed | PASS | Files present and read at frozen SHA |
| Preparation | Source layout and workflows enumerated | PASS | Recursive tree contains `TetrisApp/www` modules and three workflow YAML files |
| Core | Piece spawn/randomization, collision, board/line clear implementation | WARNING | Logic present; no executed deterministic regression or gameplay test |
| Core | Rotation near walls/stacks, simultaneous inputs | NOT TESTED | `piece.js` uses horizontal kick offsets only; no edge-case runtime tests |
| Core | Keyboard soft/hard drop vs lock delay | FAIL (static) | `controls.js` directly fixes/spawns on landing, bypassing lock-delay path |
| Core | Pause/resume with active lock delay | FAIL (static) | Pause handler does not clear lock timeout; callback has no paused-state guard |
| Core | Swap once per spawned piece | WARNING | `canSwapPiece` gate exists, but touch click/touchend double interaction and edge cases untested |
| Score | Multi-line clear scoring / level thresholds / drop speed | WARNING | `scoreLevelManager.js` implementation reviewed; no runtime assertions |
| Score | High score and restart/persistence | WARNING | Local storage and reset code reviewed; corrupted/unavailable storage scenario not run |
| Touch | Tap / drag / swipe and scroll prevention | NOT TESTED | Touch handlers exist; orientation/gesture accuracy not measured |
| Android | Small screens, portrait, landscape and rotation | NOT TESTED | CSS media queries exist; no device or emulator session |
| Web UI | Menu, board, pause, game-over, settings, tutorial, touch-to-close | NOT TESTED | DOM/layout structure read, but not exercised in browser |
| Web UI | Overflow, clipping, scaling | WARNING | Multiple responsive styles and fixed canvas dimensions require device matrix; historical clipping concern unresolved |
| Languages | Thai default configured | PASS | `DEFAULT_LANGUAGE = 'th'` and HTML `lang="th"` |
| Languages | Translations, Thai glyph display, switching | NOT TESTED | Translation objects exist; visual font/browser verification unavailable |
| Themes | Theme assets and switching | WARNING | Six WebP backgrounds in tree; runtime load and selected theme checks outstanding |
| Audio | SFX asset files in repo | PASS | Five MP3 SFX entries in repository tree |
| Audio | Background music playback | FAIL (static) | `backgroundMusicPlayer` has no `src` or `source`; music cannot play a file |
| Audio | SFX playback and mute persistence | WARNING | Service code reviewed, but no audio device/browser execution |
| Technical | Offline support | NOT TESTED | Static relative files present; no airplane-mode/Android smoke test |
| Technical | Listeners/timers/leaks, browser exceptions | WARNING | Multiple global listeners/timeout paths; no profiler/console execution |
| Technical | GitHub Pages configuration | PASS | `deploy-pages.yml` automatically runs on web-file pushes; deployment success unverified |
| Technical | APK workflow safety | PASS | `android-apk.yml` declares only `workflow_dispatch` |
| Technical | CI version gate | PASS | `version-check.yml` checks config vs HTML on PR; direct master commits bypass PR gate |
| Technical | Executed automated tests / gameplay smoke test | NOT TESTED | No runnable suite, browser runner or emulator in this audit |

## Defects and reproducible scenarios

### QA-001 — Keyboard landing bypasses lock delay (P1, FAIL static)

- **Files:** `TetrisApp/www/js/controls/controls.js`, keyboard `arrowdown/s` and Space cases; `TetrisApp/www/js/core/main.js`, `pieceHasLanded`, `pieceDroppedToBottom`.
- **Steps:** Start game; bring a piece onto another block/floor; press Down when it cannot descend; repeat with Space. Compare touch downward swipe.
- **Expected:** On landing the piece remains adjustable for configured `LOCK_DELAY_DURATION` (200 ms).
- **Actual by code path:** Keyboard Down and Space call `fixPieceOnBoard`, `checkAndClearLines` and `spawnNewPieceInternalLogic` synchronously, while touch uses `pieceDroppedToBottom` and timeout. Browser reproduction pending.
- **Fix recommendation (Phase 2):** Route keyboard landing through shared landing/lock-delay state machine; add fake-timer tests covering soft/hard drop.

### QA-002 — Lock timer continues during pause or menu navigation (P1, FAIL static)

- **Files:** `TetrisApp/www/js/core/main.js` (`pieceHasLanded`, `lockPieceAndContinue`, menu actions); `TetrisApp/www/js/controls/controls.js` (P key and swipe-up pause).
- **Steps:** Let a piece land and start 200 ms lock delay; immediately press P/swipe up to pause or navigate to menu; wait more than 200 ms; resume.
- **Expected:** No game-board mutation while paused or in menu; resume preserves pending lock time or safely resets it.
- **Actual by code path:** Pause/menu paths do not clear `lockDelayTimerId`; timeout calls `lockPieceAndContinue` without checking `gameState`, and can change board and spawn a piece while paused.
- **Fix recommendation (Phase 2):** Own timers under lifecycle transitions, guard all lock callbacks by active state and game epoch; test pause/restart/menu races.

### QA-003 — Music button has no audio source (P2, FAIL static)

- **Files:** `TetrisApp/www/index.html`, `backgroundMusicPlayer`; `TetrisApp/www/js/services/audio.js`.
- **Steps:** Open game; unmute music; start playing; check `backgroundMusicPlayer.currentSrc`.
- **Expected:** If the Music control is offered, BGM playback has a valid source, or the intentionally removed feature is clearly disabled/removed.
- **Actual by HTML configuration:** Audio element has neither `src` nor `<source>`, while button and playback API remain active.
- **Fix recommendation (Phase 2):** Clarify owner intent (BGM previously removed); remove/disable obsolete music control and update README/design docs, or add properly licensed audio only on owner request.

### QA-004 — Direct master commits bypass PR-only version CI (P2, WARNING)

- **Files:** `AGENTS.md`, `.github/workflows/version-check.yml`.
- **Steps:** Make an authorized docs-only direct commit to master without a version bump.
- **Expected:** Every change is version-synchronized and validated.
- **Actual workflow configuration:** Version check triggers only for `pull_request` against master; no automatic validation on direct master pushes.
- **Fix recommendation:** Add non-build version consistency validation on master pushes, preserving direct-docs policy, or document an explicit manual pre-commit version check.

## Technical debt

1. No declared unit/integration scripts for collision, rotation, timer, score or persistence logic; no gameplay CI coverage.
2. Global mutable state, globals coupled to loading order, and DOM-focused dependencies complicate isolated tests.
3. Touch vs keyboard input diverges into different locking workflows.
4. `requestAnimationFrame` and `setTimeout` lifecycles lack centralized pause/resume/exit ownership.
5. `loadMuteSettings` reads `localStorage` without exception handling, unlike other storage functions.
6. README mentions BGM despite no BGM source in index.
7. Browser/mobile viewport, accessibility, offline and Android acceptance require measured evidence.
8. Version CI runs on PRs only, while approved docs workflow uses direct master writes.

## Risk register / recommendations

**Immediate P1 gate:** Fix QA-001 and QA-002 on gameplay branch/PR **after** separate authorization; write deterministic collision, landing and fake-clock regression tests first. Do not modify gameplay in this audit.

**Next:** Validate QA-003 product expectation; resolve stale audio UX; add JS lint/unit tests and CI checks; test high score restart and storage failure.

**Manual evidence matrix:** Chrome desktop, Chrome Android small portrait (e.g. 360x640), 390x844 portrait, 800x360 landscape and WebView; measure element bounding boxes and viewport overflow; test tap/swipe, scroll prevention, orientation changes, tutorial dismissal and language/font layout; capture video/screenshots and JS console errors.

**Deployment:** Check GitHub Pages live URL and offline network-disabled reload; inspect actual Actions run status. Do not infer success from workflow presence.

## Documentation policy conflict noted before write

`AGENTS.md` prescribes reviewable PRs, version bumps and owner approval to merge. The Project Lead's current instruction explicitly authorizes direct `.md` commits to master without PR; this exception was reported in the audit conversation before writing. The same instruction requires version bump on every change. This publication synchronizes 0.1.4 metadata in config and index but changes no gameplay logic. Future source-code fixes require branch and PR. No APK workflow triggered.

## Phase 2 readiness assessment

**CONDITIONAL / not release-ready:** Code ownership and baseline are identified, but gameplay regressions (QA-001/002) and lack of runtime/device evidence block a readiness claim. Start Phase 2 with automated tests and P1 fixes, then complete browser/mobile smoke tests. The audited baseline remains v0.1.3.

**Counts:** Automated test cases executed: **0**; automated pass: **0**; automated failed: **0**; static defects: **2 P1 + 1 P2**; risk item: **1 P2 WARNING**; **0 P0**, **0 P3**. Checklist classifications describe review outcomes, not separate executed test cases.

## Post-audit corrective update — 2026-10-26 (v0.1.5)

The **frozen v0.1.3 audit above is preserved**. The owner subsequently authorized direct-master work and remediation of the identified P1 issues.

| Item | Change | Verification | Outcome |
|---|---|---|---|
| QA-001 | Keyboard Down/Space route landed pieces through `pieceDroppedToBottom()`; left/right/rotation of landed pieces invokes landing-state recalculation | Source-diff assertions: direct keyboard `fixPieceOnBoard` and `spawnNewPieceInternalLogic` calls removed, both controls share landing path | **PASS — static verification only**; **NOT TESTED — runtime** |
| QA-002 | Pause cancels lock timeout, resume rearms it, menu cancels it, lock callback guards `PLAYING` and landed state | Source-diff assertions: timeout cancellation and guards present in `main.js` | **PASS — static verification only**; **NOT TESTED — runtime** |
| QA-003 | No music-source change (owner deliberately removed BGM previously) | HTML still has no BGM source | **WARNING — awaiting explicit owner decision before UI change** |
| QA-004 | AGENTS.md documents direct-master version validation expectation | config.xml 0.1.5 and visible menu v0.1.5 checked before commit | **PASS — version consistency**; automated direct-push gate not yet implemented |

**Test execution:** 0 browser gameplay runs; 0 Android/device tests; 0 unit suites. Git clone attempt could not resolve `github.com` in the available execution environment. Static verification does **not** establish real-game PASS. Required manual regression cases: land/press Down/Space, move/rotate during 200ms delay, rapid key repeat, pause within 200ms of landing and wait, resume and verify rearmed timeout, exit to menu during delay, restart during delay, drag/swipe parity, game-over/high score.

**Residual risks:** P1 code patches require actual browser and device smoke tests before marking functional fixes fully verified. No new gameplay defects were authorized for speculative remediation. No APK build was triggered.

## Mobile width improvement — v0.1.6 (2026-10-26)

**Owner-reported evidence:** iPhone Safari screenshot showed narrow playable board despite free horizontal space. Root cause from static cascade: `responsive.css` imposed `max-width: 65vw` for portrait canvas, while later `mobile-fix.css` only declared `width: min(100%, 300px)`; the earlier maximum remained effective.

**Correction:** The last-loaded `mobile-fix.css` now overrides that maximum explicitly, caps the portrait board at the lesser of available container width, viewport minus 24px, and 390px, matches the level header and aligns the score/next strip. Native canvas dimensions remain 300x600 so gameplay coordinates and 10:20 aspect are unchanged.

**Static verification: PASS** — stylesheet order has mobile-fix last; portrait rule explicitly sets `max-width:100%`; both board and level display use the same cap; native canvas and JS untouched. **Visual regression: NOT TESTED** — open iOS Safari at 375/390px and Android at 360px, verify no x-overflow or clipping; rotate to landscape and check fit; verify tap/drag/swipe correctness; test short viewport vertical scroll. No APK build triggered.

## Portrait Auto-Fit refinement — v0.1.7 (2026-10-26)

Owner reports v0.1.6 board requires vertical scrolling on iPhone Safari. Revised portrait CSS computes canvas width as `min(100vw - 24px, (100dvh - 185px)/2, 390px)`, reserving space for compact HUD, header and gaps. `100dvh` follows the browser's visible viewport. Width/height remain 1:2 and canvas intrinsic dimensions are untouched. For viewports at or below 390px tall, scrolling remains available rather than clipping.

**Static assertions: PASS** for viewport-height bound, dimension pairing, version sync and unchanged gameplay JS. **Browser / iOS Safari / Android display: NOT TESTED**, must verify actual visible area and dynamic toolbar collapse, rotations and no clipping on device. No APK build triggered.
