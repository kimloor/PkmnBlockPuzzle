# Game Design — PkmnBlockPuzzle / Tetris

Canonical repository: https://github.com/kimloor/PkmnBlockPuzzle

## Purpose
A responsive falling-block puzzle game for browser and Android (via Apache Cordova). This document describes the currently documented experience, not an assertion that every behavior has passed QA.

## Bomb Block V1 (v0.3.0)
- On creating a standard four-cell piece, 5% chance to assign one bomb to a randomly selected occupied cell; Next swap and rotations preserve the bomb's actual cell location.
- Clearing a completed row containing a bomb triggers a 3×3 blast centered on it. A blast contacting another bomb triggers a chain explosion; edge blasts clip to the 10×20 board.
- The rows that were complete before explosion are cleared and scored once. Explosion-cleared cells give no additional score; gold destroyed by an explosion is excluded from golden multiplier.
- Bombs remain on the board until a row containing them is cleared or another bomb detonates them. No gravity is applied to leftover board cells.

## Golden Glow scoring (v0.2.1)
- Every golden cell removed in a line clear contributes +1 to the score multiplier. The aggregate over all simultaneously cleared lines is applied to the existing line-clear award and level multiplier.
- Golden cells may be placed earlier and remain on the board until eventually cleared by any piece. A zero-gold clear receives ×1.
- Golden cells glow in active piece, next piece and locked board states; only eliminated cells count.

## Bonus Block ×2 (v0.2.0)
- 90% normal pieces, 10% special five-cell pieces: PLUS, U-SHAPE, LONG-L (uniform choice inside the special pool).
- Bonus pieces move, rotate, ghost, and swap via the existing controls; gold distinguishes them across themes.
- Superseded by v0.2.1: bonus scoring now depends on golden cells actually cleared, not the last piece locked.
- No line clear means no bonus. The full score counts toward leveling and High Scores. APK build remains manual.

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
