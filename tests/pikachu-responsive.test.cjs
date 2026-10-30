const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'TetrisApp/www/css/mobile-fix.css'),'utf8');
const html = fs.readFileSync(path.join(root, 'TetrisApp/www/index.html'),'utf8');
const config = fs.readFileSync(path.join(root, 'TetrisApp/config.xml'),'utf8');

test('Pikachu remains visible in narrow Safari widths',()=>{
 assert.doesNotMatch(css,/html\.pokemon-theme-active #pokemon-side-slot\s*\{\s*display:\s*none/);
 assert.match(css, /@media \(max-width: 1050px\)/);
 assert.match(css, /html\.pokemon-theme-active #pokemon-side-slot\s*\{\s*display:\s*flex/);
});
test('portrait uses identical widths for board, level and HUD, no gutter',()=>{
 const final=css.split('/* v0.7.4')[1];
 assert.ok(final);
 assert.match(final,/--board-fit-width: min\(calc\(100vw - 24px\)/);
 assert.match(final,/#game-area\s*\{[^}]*width: var\(--board-fit-width\)/);
 assert.match(final,/#side-panel\s*\{[^}]*width: var\(--board-fit-width\)/);
 assert.match(final,/#level-header-display,\s*html\.pokemon-theme-active #tetris-canvas\s*\{\s*width: 100%/);
});
test('Pikachu and speech bubble overlay top-left board but do not capture touches',()=>{
 const final=css.split('/* v0.7.4')[1];
 assert.match(final,/#pokemon-side-slot\s*\{[^}]*position: absolute/);
 assert.match(final,/#pokemon-side-slot\s*\{[^}]*top: 128px/);
 assert.match(final,/#pokemon-side-slot\s*\{[^}]*pointer-events: none/);
 assert.match(final,/#pokemon-side-slot \.pikachu-speech\s*\{[^}]*position: absolute/);
});
test('single mobile wallpaper and no body tint or panel layer',()=>{
 const final=css.split('/* v0.7.4')[1];
 assert.match(final,/body::before \{ display: none !important/);
 assert.match(final,/pokemon_bg_mobile\.jpg/);
 assert.match(final,/#main-container\s*\{\s*background: transparent !important/);
});
test('version and Safari CSS cache token align',()=>{
 assert.match(config,/version="0\.7\.5" android-versionCode="705"/);
 assert.match(html,/class="game-version" aria-label="Game version">v0\.7\.5/);
 assert.match(html,/mobile-fix\.css\?v=0\.7\.5/);
});