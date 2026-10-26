# Game Design — PkmnBlockPuzzle / Tetris

Canonical repository: https://github.com/kimloor/PkmnBlockPuzzle

## Purpose
A responsive falling-block puzzle game for browser and Android (via Apache Cordova). This document describes the currently documented experience, not an assertion that every behavior has passed QA.

## Core gameplay loop
1. Start a game and control the active falling tetromino.
2. Move or rotate the piece to fill horizontal rows.
3. Clearing rows grants points; leveling up raises challenge through drop speed.
4. Continue until the board reaches game-over conditions.

## Controls (documented in README)
| Action | Desktop | Mobile |
| --- | --- | --- |
| Move horizontally | Left/Right or A/D | Horizontal drag |
| Rotate | Up, W or X | Tap game area |
| Soft drop | Down or S | Verify mobile equivalent |
| Hard drop | Space | Swipe down |
| Pause/resume | P | Swipe up |
| Swap current/next | Verify keyboard equivalent | Tap Next Piece, once per new piece |

README specifies lock delay on landing. Exact timing/rotation and swap semantics must be verified against source before writing strict gameplay tests.

## Player feedback & presentation
- Responsive layouts for desktop/mobile, including portrait and landscape.
- Multiple visual themes and theme-dependent styling.
- Score and level display, with progressive line-clear scoring and increased falling speed.
- Multiple UI languages; **Thai should be the default** under the project working agreement.
- Background music and sound effects with separate mute options.

## Architecture and packaging
- Web application: HTML, CSS and vanilla JavaScript in `TetrisApp/www/`.
- Android packaging: Apache Cordova configured in `TetrisApp/config.xml`.
- Build policy: APK workflow is manual, not automatic.
- Definitive file/module ownership and persistence mechanisms require code review.

## Acceptance checklist (not yet verified)
- [ ] Core controls and lock behavior match design on keyboard and touch.
- [ ] Score, levels and speed remain consistent across pause/resume.
- [ ] Mobile UI fits small screens in portrait and landscape.
- [ ] Themes, Thai default and other languages display correctly.
- [ ] Separate audio settings behave as expected.
- [ ] Android package and web build use the same visible version.

## Assets and rights
Preserve upstream MIT license and applicable third-party notices. Review ownership/licensing for all themed graphics and audio before redistribution.
