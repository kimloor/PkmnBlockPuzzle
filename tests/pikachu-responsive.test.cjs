const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root,'TetrisApp/www/css/mobile-fix.css'),'utf8');
const html = fs.readFileSync(path.join(root,'TetrisApp/www/index.html'),'utf8');
const config = fs.readFileSync(path.join(root,'TetrisApp/config.xml'),'utf8');
const latest = css.split('/* v0.7.10 —')[1];

test('Mobile Pokemon companion still visible and tap-through', () => {
  assert.ok(latest);
  assert.doesNotMatch(css, /html\.pokemon-theme-active #pokemon-side-slot\s*\{\s*display:\s*none/);
  assert.match(latest, /#pokemon-side-slot\s*\{[^}]*display: flex/);
  assert.match(latest, /#pokemon-side-slot\s*\{[^}]*pointer-events: none/);
  assert.match(latest, /#tetris-canvas\s*\{[^}]*touch-action: none/);
});
test('Portrait uses bounded viewport-height board without scroll', () => {
  assert.match(latest, /--board-fit-width:\s*max\(0px,\s*min\(calc\(100vw - 20px\),\s*calc\(\(100dvh - 116px\) \/ 2\),\s*252px\)\)/);
  assert.match(latest, /body\s*\{[^}]*height: 100dvh;[^}]*overflow: hidden !important/);
  assert.match(latest, /#game-content\.active\s*\{[^}]*height: 100dvh;[^}]*overflow: hidden/);
  assert.match(latest, /#side-panel\s*\{[^}]*height: 70px/);
  assert.match(latest, /#level-header-display\s*\{[^}]*height: 24px/);
  for (const pair of [[320,420],[375,495],[390,550],[430,620],[768,670]]) {
    const w=pair[0],h=pair[1];
    const board=Math.max(0,Math.min(w-20,(h-116)/2,252));
    const used=8+70+4+24+2*board;
    assert.ok(used<=h,'height overflows at '+w+'x'+h);
    assert.ok(board<=w-20,'width overflows at '+w+'x'+h);
  }
});
test('Board, level and HUD share width',()=>{
  assert.match(latest, /#side-panel,\s*html\.pokemon-theme-active #game-area\s*\{[^}]*width:\s*var\(--board-fit-width\)/);
  assert.match(latest, /#level-header-display,\s*html\.pokemon-theme-active #tetris-canvas\s*\{\s*width:\s*100%/);
  assert.match(latest, /#tetris-canvas\s*\{[^}]*aspect-ratio:\s*1 \/ 2/);
});
test('Do not change corrected background assets',()=>{
  assert.match(css,/pokemon_bg_mobile\.jpg\?v=0\.7\.9/);
  assert.match(css,/pokemon_bg_desktop\.jpg\?v=0\.7\.9/);
  assert.doesNotMatch(latest,/background-image:|background-color:/);
});
test('Version and Safari CSS cache align',()=>{
  assert.match(config,/version="0\.7\.10" android-versionCode="710"/);
  assert.match(html,/class="game-version" aria-label="Game version">v0\.7\.10/);
  assert.match(html,/mobile-fix\.css\?v=0\.7\.10/);
});