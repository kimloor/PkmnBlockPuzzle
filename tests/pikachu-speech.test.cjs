const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'TetrisApp/www/css/mobile-fix.css'), 'utf8');
const main = fs.readFileSync(path.join(root, 'TetrisApp/www/js/core/main.js'), 'utf8');
const companion = fs.readFileSync(path.join(root, 'TetrisApp/www/js/ui/pokemonCompanion.js'), 'utf8');
const portrait = css.split('/* v0.7.11 —')[1];

function createCompanion() {
  let now = 1000;
  let timeoutCallback;
  const bubble = { className: '', hidden: true, textContent: '', setAttribute() {} };
  const image = {
    src: 'images/pokemon/characters/pikachu.png',
    dataset: { pose: 'idle' },
    parentElement: { appendChild(el) { assert.equal(el, bubble); } }
  };
  const activeScreen = { classList: { contains: cls => cls === 'active' } };
  const rewardDialog = { hidden: true };
  const document = {
    hidden: false,
    querySelector: selector => selector === '#pokemon-side-slot .pokemon-side-character' ? image : null,
    createElement: () => bubble,
    getElementById: id => id === 'game-content' ? activeScreen : id === 'reward-dialog' ? rewardDialog : null,
    addEventListener() {}
  };
  const sandbox = {
    document,
    window: {},
    Image: class { set src(value) { this.imageSrc = value; } },
    performance: { now: () => now },
    requestAnimationFrame: () => 1,
    setTimeout: cb => { timeoutCallback = cb; return 1; },
    clearTimeout() {},
    getCurrentLanguage: () => 'th'
  };
  vm.createContext(sandbox);
  vm.runInContext(companion, sandbox);
  return { api: sandbox.window.pokemonCompanion, bubble, document, rewardDialog,
    advance(ms) { now += ms; },
    expire() { timeoutCallback?.(); } };
}

test('starting a game calls speech only after PLAYING screen is active', () => {
  assert.match(main, /showScreen\('PLAYING'\);\s*speak\('start',\s*3\)/);
  const c = createCompanion();
  assert.equal(c.api.say('start', 3), true);
  assert.equal(c.bubble.hidden, false);
  assert.equal(c.bubble.textContent, 'ปิก้า! เริ่มกันเลย!');
  c.expire();
  assert.equal(c.bubble.hidden, true);
});

test('speech also displays on line clear and honors modal visibility', () => {
  const c = createCompanion();
  assert.equal(c.api.say('line1', 2), true);
  assert.equal(c.bubble.textContent, 'ดีมากเลย!');
  c.rewardDialog.hidden = false;
  assert.equal(c.api.say('combo', 3), false);
});

test('Safari portrait speech is above score HUD and around board top', () => {
  assert.ok(portrait, 'portrait speech fix must be present');
  const slot = portrait.match(/#pokemon-side-slot\s*\{([^}]*)\}/)[1];
  const speech = portrait.match(/#pokemon-side-slot \.pikachu-speech\s*\{([^}]*)\}/)[1];
  assert.match(slot, /top:\s*76px/);
  assert.match(slot, /z-index:\s*8/);
  assert.match(speech, /top:\s*24px/);
  assert.match(speech, /z-index:\s*9/);
  assert.match(speech, /visibility:\s*visible/);
  assert.match(speech, /pointer-events:\s*none/);
  assert.match(portrait, /\.pikachu-speech\[hidden\]\s*\{\s*display:\s*none !important/);
  assert.ok(76 + 24 >= 70 + 4 + 24, 'bubble should be placed below the 70px HUD and 24px level');
});

test('accepted board sizing and prior background assets remain unchanged', () => {
  assert.match(css, /--board-fit-width:\s*max\(0px,\s*min\(calc\(100vw - 20px\),\s*calc\(\(100dvh - 116px\) \/ 2\),\s*252px\)\)/);
  assert.match(css, /pokemon_bg_mobile\.jpg\?v=0\.7\.9/);
  assert.match(css, /pokemon_bg_desktop\.jpg\?v=0\.7\.9/);
  assert.doesNotMatch(portrait, /--board-fit-width|background-image|background-color|overflow-y/);
});
