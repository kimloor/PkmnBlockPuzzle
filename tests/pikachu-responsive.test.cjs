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
test('portrait reserves distinct avatar, HUD and board grid cells',()=>{
  const portrait=css.split('/* Portrait phones:')[1].split('/* Narrow landscape:')[0];
  assert.match(portrait, /grid-template-columns:\s*var\(--companion-gutter\) minmax\(0, 1fr\)/);
  assert.match(portrait, /#side-panel\s*\{\s*grid-column:\s*1 \/ -1/);
  assert.match(portrait, /#pokemon-side-slot\s*\{\s*grid-column:\s*1/);
  assert.match(portrait, /#game-area\s*\{\s*grid-column:\s*2/);
  assert.match(portrait, /--board-fit-width:\s*min\(/);
});
test('landscape and tablet keep companion inside a nonabsolute column',()=>{
  const layout=css.split('/* v0.7.3:')[1];
  assert.match(layout, /@media \(min-width: 769px\) and \(max-width: 1050px\)/);
  assert.match(layout, /@media \(max-width: 768px\) and \(orientation: landscape\)/);
  assert.match(layout, /position:\s*relative/);
  assert.match(layout, /right:\s*auto/);
  assert.match(layout, /\.pikachu-speech\s*\{[^}]*width:\s*100%/);
});
test('Safari CSS cache key and source version are aligned',()=>{
  assert.match(config,/version="0\.7\.3" android-versionCode="703"/);
  assert.match(html,/class="game-version" aria-label="Game version">v0\.7\.3/);
  assert.match(html,/mobile-fix\.css\?v=0\.7\.3/);
});