# Development Roadmap — PkmnBlockPuzzle

Repository: https://github.com/kimloor/PkmnBlockPuzzle
Status: planning document; items are proposals until confirmed by the owner.

## Current verified baseline (26 October 2026)
- A playable Tetris-style falling-block game is described in `README.md`.
- Web source is stored in `TetrisApp/www/`, with Cordova configuration at `TetrisApp/config.xml`.
- Current version prior to this documentation PR: 0.1.2.
- Android APK build is manual (`workflow_dispatch` only), subject to owner approval.

## Phase 1 — Baseline audit
- [ ] Run desktop/mobile gameplay smoke tests: start, move, rotate, soft drop, hard drop, pause, restart, game over.
- [ ] Check scoring, level advancement, difficulty scaling and persistence against actual source.
- [ ] Check touch controls, responsive portrait/landscape layouts and accessibility.
- [ ] Check themes, language switching, music/SFX controls.
- [x] Document source-review defects with reproduction steps and priorities (see [QA baseline](docs/QA-BASELINE.md); browser/device reproduction remains pending).

## Phase 2 — Quality and reliability
- [ ] Add automated regression tests for gameplay rules and edge cases.
- [ ] Establish consistent lint/test checks and a lightweight manual QA checklist.
- [ ] Validate behavior on common Android screen sizes and browsers.
- [ ] Review offline functionality and asset-loading errors.

## Phase 3 — UI/UX and player experience
- [ ] Improve touch responsiveness, HUD readability and game-over feedback.
- [ ] Validate Thai as default language and fallback strings.
- [ ] Review settings persistence, music and SFX volume/mute behavior.
- [ ] Evaluate player-requested enhancements after audit.

## Phase 4 — Release readiness
- [ ] Verify version alignment: `TetrisApp/config.xml` and `.game-version`.
- [ ] Verify website deployment independently from Android builds.
- [ ] Build Android APK **only on explicit owner instruction**.
- [ ] Update changelog, test report and release notes before release.

## Working agreement
Use small reviewable PRs, preserve existing working gameplay, report test evidence and obey `AGENTS.md`. Roadmap checkboxes are not completion claims.
