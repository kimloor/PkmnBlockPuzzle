const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'TetrisApp/www/css/mobile-fix.css'),'utf8');
const html=fs.readFileSync(path.join(root,'TetrisApp/www/index.html'),'utf8');
const config=fs.readFileSync(path.join(root,'TetrisApp/config.xml'),'utf8');

test('Pokemon companion does not inherit mobile hiding rules',()=>{
 assert.doesNotMatch(css,/html\.pokemon-theme-active #pokemon-side-slot\s*\{\s*display:\s*none/);
 assert.match(css,/@media \(max-width: 1050px\)/);
});
test('latest Safari portrait rules enlarge board based on width, HUD aligned',()=>{
 const latest=css.split('/* v0.7.6:')[1];
 assert.ok(latest,'portrait fix section exists');
 assert.match(latest,/--board-fit-width:\s*min\(calc\(100vw - 16px\), 360px\)/);
 assert.match(latest,/#side-panel,\s*html\.pokemon-theme-active #game-area\s*\{\s*width:\s*var\(--board-fit-width\)/);
 assert.match(latest,/#tetris-canvas,\s*html\.pokemon-theme-active #level-header-display\s*\{\s*width:\s*100%/);
 assert.match(latest,/overflow-y:\s*visible/);
 assert.match(latest,/touch-action:\s*none/);
});
test('Pikachu is larger, speech overlaps board without intercepting controls',()=>{
 const latest=css.split('/* v0.7.6:')[1];
 assert.match(latest,/#pokemon-side-slot\s*\{[^}]*position:\s*absolute/);
 assert.match(latest,/#pokemon-side-slot\s*\{[^}]*width:\s*clamp\(104px, 30vw, 130px\)/);
 assert.match(latest,/#pokemon-side-slot\s*\{[^}]*pointer-events:\s*none/);
 assert.match(latest,/#pokemon-side-slot \.pikachu-speech\s*\{[^}]*position:\s*absolute/);
});
test('source version, android code and Safari stylesheet cache stay aligned',()=>{
 const version=config.match(/version="([0-9]+\.[0-9]+\.[0-9]+)"/)?.[1];
 assert.ok(version);
 const code=config.match(/android-versionCode="([0-9]+)"/)?.[1];
 assert.equal(Number(code),Number(version.split('.').slice(1).join(''))*1 || Number(code));
 assert.ok(html.includes('class="game-version" aria-label="Game version">v'+version));
 assert.ok(html.includes('mobile-fix.css?v='+version));
});
