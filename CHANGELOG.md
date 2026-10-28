# Changelog — PkmnBlockPuzzle (Tetris)

Repository: https://github.com/kimloor/PkmnBlockPuzzle

This file tracks verified releases. Historical release details should be filled from Git tags and commits, not guessed.

## [Unreleased]

## [0.4.8] — Pokémon companion upper-right alignment (2026-10-28)
- Anchor the reserved Pokémon companion slot to the upper-right of the game viewport on supported desktop layouts, instead of vertically centering it.
- Keep existing mobile hiding and game controls unchanged. Source inspection only; device visual QA pending. No APK build.
\n\n## [0.4.5] — Background import\n- Published Desktop/Mobile JPGs and aligned Pokémon theme paths.\n

## [0.4.7] — Fix Pokémon background visibility (2026-10-28)
- Corrected theme CSS variable background URL relative to the HTML document; bust cached CSS/theme config URLs.
- Removed the heavy full-screen blur and opacity overlay from Pokémon theme menus so the landscape is actually visible, while preserving menu-card contrast.
- Source-level QA only; live browser/device visual verification pending. No APK build.

## [0.4.6] — Backup asset import runbook (2026-10-28)
- Documented validated Google Drive → GitHub Actions → master import as a fallback in docs/ASSET-IMPORT-FALLBACK.md; linked from README and AGENTS.
- Documentation-only change; no APK build.

## [0.4.4] — Chain clear and exit score persistence (2026-10-27)
- Recheck and clear rows completed by bomb-induced column gravity until stable; aggregate scores and explosions, including totals above four rows.
- Save score when leaving to menu, restarting, pagehide, or mobile visibility hidden; update an existing score snapshot after resume instead of appending a duplicate.
- Source inspection only; live browser/mobile QA not yet performed. No APK build.


## [0.4.3] — Google Drive image import (2026-10-27)
- Import workflow now supports public Google Drive single-file links using gdown, alongside direct HTTPS URLs and Base64 data.
- Destination remains configurable under the site's images/ or assets/ directories; validation, version synchronization and manual-only APK policy unchanged.
- Workflow source checks only, no live dispatch performed.


## [0.4.2] — Flexible image importer (2026-10-27)
- Manual importer accepts either direct HTTPS URL or Base64 input for small images, with a selectable path under TetrisApp/www/images/ or assets/.
- Validate image signatures and sizes; fix the previous malformed XML version replacement and handle both new and existing image changes.
- Static source verification only; live GitHub Actions workflow not dispatched. No APK build.


## [0.4.1] — Manual image import workflow (2026-10-27)
- Added workflow_dispatch importer for direct HTTPS PNG/JPEG/WebP/GIF image URLs into TetrisApp/www/assets/.
- Added validation, 15 MB size limit, automatic patch version bump for subsequent image imports, and a direct commit to master.
- Android APK build remains manual-only. Workflow execution has not yet been tested.


## [0.4.0] — Pokémon landscape theme and side companion slot (2026-10-27)
- Added landscape/mobile background asset paths for the Pokémon theme with a subtle contrast overlay and fallback color.
- Added an inactive companion illustration slot next to the desktop board; hidden on compact screens to preserve gameplay space and reserved for a later approved transparent sprite.
- Asset backgrounds remain pending binary publication to GitHub; prepared WebP files delivered separately for upload. Static source QA only; browser screenshot/device QA not run and APK not triggered.


## [0.3.1] — Bomb Gravity & Explosion FX (2026-10-27)
- Apply per-column gravity to fixed board cells after any bomb/chain explosion and the originally complete row clear, preventing suspended cells from remaining after blasts.
- Add a lightweight 300ms Canvas explosion flash, expanding ring and spark particles at each bomb position, including chain blasts.
- Preserve existing Golden Block scoring (only gold surviving blast in original cleared rows counts) and do not award extra rows from gravity.
- Source-based verification only; gameplay visual/device testing pending, no APK build.


## [0.3.0] — Bomb Block V1 (2026-10-27)
- Standard four-cell pieces have a 5% chance of carrying one bomb cell, preserved during rotation and Next swap; bonus five-cell golden pieces never have bombs.
- Completing a row containing a bomb triggers a 3×3 blast and chained bombs before removing the originally complete rows. Explosions remove occupied cells but do not grant extra line clears or scoring.
- Gold destroyed by blasts does not count toward the golden multiplier; gold remaining in completed rows counts as usual.
- Render bomb markers on active, Next and fixed blocks, with BOOM/CHAIN feedback. Browser and Android smoke tests pending; APK not triggered.


## [0.2.1] — Golden Glow & stacked clear multipliers (2026-10-27)
- Golden cells now have a bright gold/white highlight and amber glow while falling, in Next preview, and when locked on the board.
- Each golden *cell actually removed* by a completed row adds +1 to that clear's score multiplier (0=×1, 1=×2, 2=×3, etc.), regardless of which piece completed the row.
- Multiple cleared rows sum their removed golden cells before multiplying the normal combined clear award; other rows' golden cells are not counted.
- Static source checks pending; actual visual browser/emulator QA not executed. APK not triggered.


## [0.2.0] — Bonus Block ×2 (2026-10-27)
- Added three five-cell bonus shapes (PLUS, U, LONG-L), collectively spawned with 10% probability per generated piece.
- A bonus piece that directly completes one or more rows doubles that lock's line-clear score, after the existing level multiplier; earlier bonus cells left on the board do not trigger the multiplier.
- Special blocks render gold across themes and in Next preview; successful clears briefly display BONUS ×2.
- Existing swap, ghost, and lock behavior are retained. Web/mobile runtime QA pending; Android APK not triggered.

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
