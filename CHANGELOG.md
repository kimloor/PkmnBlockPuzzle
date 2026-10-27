# Changelog — PkmnBlockPuzzle (Tetris)

Repository: https://github.com/kimloor/PkmnBlockPuzzle

This file tracks verified releases. Historical release details should be filled from Git tags and commits, not guessed.

## [Unreleased]
- Pending runtime/browser/Android confirmation and Phase 2 fixes.

## [0.1.15] — Android APK artifact filename (2026-10-27)
- Rename the generated Android debug APK to `PkmnBlockPuzzle.apk` before uploading the artifact.
- Set the Actions artifact bundle name to `PkmnBlockPuzzle-apk`, keeping the debug signing/build behavior and manual-only dispatch unchanged.
- Source-level workflow and version checks PASS; actual GitHub Actions APK build NOT TESTED (not triggered).

## [0.1.14] — Main Menu alignment and icon branding (2026-10-27)
- Reused the existing local app icon above the PkmnBlockPuzzle title without changing the source asset.
- Unified Start/Settings/High Scores button width and Theme/Language/Speed control alignment with a shared 260px column and fixed label grid.
- Scoped responsive overrides to the start menu, retained compact buttons, offline font fallbacks and bottom pill version badge.
- Added menu scrolling and safe-area padding for short/rotated viewports.
- Static HTML/CSS/version assertions PASS; browser/iOS Safari/Android Chrome visual and interaction tests NOT TESTED. APK NOT TRIGGERED.

## [0.1.13] — Main hub polish and Pokemon theme placeholder (2026-10-27)
- Standardized localized title to PkmnBlockPuzzle and styled brand text with offline-safe font fallbacks.
- Restored compact main menu button sizes; moved version to the bottom as a small badge.
- Added Pokemon Theme as default for new visitors (saved user theme preference remains respected), with a self-contained blue/yellow placeholder palette until theme assets are approved.
- Static source validation only; visual/mobile smoke test pending. No APK build.

## [0.1.12] — Settings navigation hardening and Main Menu ordering (2026-10-27)
- Ordered main menu: Start, Settings, High Scores, Theme, Language, Dynamic Speed.
- Open settings panel before synchronizing audio controls; guard missing DOM components and report initialization errors to console.
- Cache-bust updated JS and CSS resources so cached v0.1.11 scripts do not mismatch the HTML.
- Verified source structure and version alignment; runtime/browser smoke test remains NOT TESTED; no APK build.

## [0.1.11] — Audio Settings UI (2026-10-27)
- Added Settings access from main menu and pause screen; moved BGM/SFX controls into dedicated panel with independent volume sliders (0–100%) and mute checkboxes.
- Persist music and effects volume locally; preserve existing mute keys and local offline audio sources.
- Static source review completed; actual Safari/Android/UI smoke test outstanding; no APK build.

## [0.1.10] — Offline menu/game music routing (2026-10-27)
- Connect existing `audio/Opening.mp3` to MENU/HIGH_SCORES and `audio/BGM.mp3` to PLAYING; both loop locally.
- Stop music on PAUSED/GAMEOVER and switch tracks without overlap; preserve a shared persistent Music mute toggle and independent SFX.
- Browser autoplay may require an initial user gesture; playback errors are handled without crashing.
- Static source checks only; iOS Safari/Android audio smoke test pending. No APK build.

## [0.1.9] — Home Screen app name (2026-10-26)
- Changed HTML document title and Apple Home Screen application title to PkmnBlockPuzzle, aligning with the Cordova app name.
- Added standard application-name metadata. No BGM or gameplay changes; no APK build.
- Source verification only; re-add to iOS Home Screen to confirm displayed default name.

## [0.1.8] — Game icon integration (2026-10-26)
- Added user-provided Pikachu-with-block artwork as a compact local PNG icon, referenced for web favicon and iOS Home Screen.
- Declared icon resource in Cordova config for a future Android build; no APK build triggered.
- Original full-resolution artwork retained in conversation, not committed; visual verification and Android packaging remain pending.

## [0.1.7] — Mobile portrait Auto-Fit (2026-10-26)
- Fit board to the lesser of screen width and available dynamic viewport height; reserve 185px for HUD, level header and spacing.
- Compact portrait HUD and align its width with the 10×20 board; prevent gameplay viewport vertical overflow on typical mobile screens.
- Keep a short-screen scroll fallback, no gameplay or APK changes. Static source checks pass; real-device layout remains NOT TESTED.

## [0.1.6] — Wider mobile portrait game board (2026-10-26)
- Override the older portrait 65vw canvas cap and 300px mobile cap; enlarge board and level header to use available phone width up to 390px.
- Keep 10:20 board aspect ratio, fit within viewport, and preserve vertical scrolling on short mobile screens.
- Align score/next-piece strip with board width; no gameplay/audio/APK changes.
- Static CSS checks completed; live iOS Safari, Android and landscape visual checks remain NOT TESTED.

## [0.1.5] — Authorized P1 lock-delay fixes and workflow policy (2026-10-26)
- Updated AGENTS.md: direct master commits allowed; ask owner before fixing any newly found future issues.
- Unified keyboard soft/hard-drop landing with the touch lock-delay lifecycle.
- Cancel pending piece-lock timeout on pause/menu; rearm on resume and protect timeout callbacks from inactive states.
- Added static QA verification notes in docs/QA-BASELINE.md; browser/Android smoke tests remain NOT TESTED.
- Music controls unchanged pending owner decision; no APK build.

## [0.1.4] — Phase 1 source audit documentation (2026-10-26)
- Added `docs/QA-BASELINE.md` with frozen v0.1.3 audit evidence, identified defects, risks, and Phase 2 readiness.
- Updated roadmap only for documented source-review findings; gameplay smoke and regression tests remain outstanding.
- Synchronized Cordova and visible version to 0.1.4; **no gameplay changes or APK build**.
- Future changes go here before release.

## [0.1.3] — Documentation foundation (proposed)
- Added project documentation: changelog, roadmap and game design.
- Linked the canonical repository in README and AGENTS.
- Synchronized Cordova and visible app versions (documentation-only change).

## [0.1.2] — Previous baseline
- Version observed in `TetrisApp/config.xml` and `TetrisApp/www/index.html` before the documentation update.
- Detailed contents of this version have not been audited.

## Versioning rules
Follow `AGENTS.md`: patch for fixes/docs, minor for compatible features, major for breaking changes. Update both the Cordova version and `.game-version` in the UI.
