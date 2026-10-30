const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const css = fs.readFileSync(path.join(root,'TetrisApp/www/css/mobile-fix.css'),'utf8');
const html = fs.readFileSync(path.join(root,'TetrisApp/www/index.html'),'utf8');
const config = fs.readFileSync(path.join(root,'TetrisApp/config.xml'),'utf8');

test('narrow Safari viewports do not force-hide the Pokemon companion',()=>{
  assert.doesNotMatch(css, /html\.pokemon-theme-active #pokemon-side-slot\s*\{\s*display:\s*none/);
  assert.match(css, /@media \(max-width: 1050px\)/);
  assert.match(css, /html\.pokemon-theme-active #pokemon-side-slot\s*\{\s*display:\s*flex/);
});
test('portrait board, header and HUD share one width without the old gutter',()=>{
  const final=css.split('/* v0.7.4')[1];
  assert.match(final,/--board-fit-width: min\(calc\(100vw - 24px\)/);
  assert.match(final,/#game-area\s*\{[^}]*width: var\(--board-fit-width\)/);
  assert.match(final,/#side-panel\s*\{[^}]*width: var\(--board-fit-width\)/);
  assert.match(final,/#level-header-display,\s*html\.pokemon-theme-active #tetris-canvas\s*\{\s*width: 100%/);
  assert.match(final,/#pokemon-side-slot\s*\{[^}]*position: absolute/);
  assert.match(final,/pointer-events: none/);
});
test('landscape and tablet keep companion inside a nonabsolute column',()=>{
  const layout=css.split('/* v0.7.4:')[1];
  assert.match(layout, /@media \(min-width: 769px\) and \(max-width: 1050px\)/);
  assert.match(layout, /@media \(max-width: 768px\) and \(orientation: landscape\)/);
  assert.match(layout, /position:\s*relative/);
  assert.match(layout, /right:\s*auto/);
  assert.match(layout, /\.pikachu-speech\s*\{[^}]*width:\s*100%/);
});
test('Safari CSS cache key and source version are aligned',()=>{
  assert.match(config,/version="0\.7\.4" android-versionCode="703"/);
  assert.match(html,/class="game-version" aria-label="Game version">v0\.7\.4/);
  assert.match(html,/mobile-fix\.css\?v=0\.7\.4/);
});