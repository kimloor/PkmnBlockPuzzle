# Changelog — PkmnBlockPuzzle (Tetris)

Repository: https://github.com/kimloor/PkmnBlockPuzzle

This file tracks verified releases. Historical release details should be filled from Git tags and commits, not guessed.

## [Unreleased]
- Pending runtime/browser/Android confirmation and Phase 2 fixes.

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
