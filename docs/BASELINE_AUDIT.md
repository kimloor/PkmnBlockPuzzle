# PkmnBlockPuzzle — Baseline & Asset Audit

Source: https://github.com/iDerra/tetris-game (imported to this repository). Source license: MIT; preserve root LICENSE and upstream attribution.

## Current baseline (not yet validated on an Android device)

- Web game entry: `TetrisApp/www/index.html`
- JavaScript: `TetrisApp/www/js/`; CSS: `TetrisApp/www/css/`
- Android wrapper configuration: `TetrisApp/config.xml`, `TetrisApp/package.json` (cordova-android ^14.0.1)
- Local media: `TetrisApp/www/images/`, `TetrisApp/www/audio/`
- Import branch: `master`

## Licensing review

MIT license applies to code owned/licensed by upstream; it does **not** independently grant rights to external franchise art, music or trademarks.

Assets requiring provenance review or replacement before reuse:

- `images/themes/7march-hsr-bg.webp`
- `images/themes/kafka-hsr-bg.webp`
- `images/themes/topaz-hsr-bg.webp`
- `images/themes/sanrio-bg.webp`
- All `audio/*.mp3` until source and license are confirmed
- `images/logo.png`, `images/screenshots/*.png`, and other `images/themes/*.webp`: confirm whether upstream owns or has licensed them

**Important:** Do not delete linked media without updating theme/audio configuration and smoke-testing the application. Media has not been removed in this audit-only change.

## Follow-up acceptance tests

1. Replace unverified third-party assets with owned/authorized placeholders, then test theme switching, music and SFX with no 404s.
2. Verify gameplay: new game, touch controls, movement/rotation, row clear, scoring, pause, restart, high scores and local storage.
3. Run with network disabled after install and verify no remote dependencies.
4. Build installable Android APK using Cordova, test actual device orientation/responsiveness and back navigation.
5. Record exact tool versions, build commands and reproducible test results.

## Scope

Personal-use customization comes after a clean baseline. Keep this repository independent from ThornieDungeons.
