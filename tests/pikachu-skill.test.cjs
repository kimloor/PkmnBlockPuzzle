const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const www = path.resolve(__dirname, '..', 'TetrisApp', 'www');
const characters = path.join(www, 'images', 'pokemon', 'characters');

test('owner skill artwork uses the same transparent 500x500 sprite canvas as existing poses', () => {
    for (const name of ['pikachu.png', 'pikachu_wave.png', 'pikachu_excited.png', 'pikachu_celebrate.png', 'pikachu_skill.png']) {
        const buf = fs.readFileSync(path.join(characters, name));
        assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', name + ' must be a PNG');
        assert.equal(buf.readUInt32BE(16), 500, name + ' width');
        assert.equal(buf.readUInt32BE(20), 500, name + ' height');
    }
    assert.equal(fs.readFileSync(path.join(characters, 'pikachu_skill.png')).readUInt8(25), 6, 'skill uses RGBA, not an opaque canvas');
});

test('skill pose is reserved, does not interrupt gameplay and returns to idle', () => {
    let now = 0, frame;
    const image = {
        src: 'images/pokemon/characters/pikachu.png',
        dataset: {pose: 'idle'},
        parentElement: { appendChild() {} }
    };
    const bubble = {hidden: true, setAttribute() {}};
    const sandbox = {
        document: {
            querySelector: () => image,
            createElement: () => bubble,
            addEventListener() {}
        },
        window: {},
        Image: class { set src(value) { this.imageSrc = value; } },
        performance: {now: () => now},
        requestAnimationFrame(cb) { frame = cb; return 1; },
        clearTimeout() {},
        setTimeout() { return 1; }
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(www, 'js/ui/pokemonCompanion.js'), 'utf8'), sandbox);
    sandbox.window.pokemonCompanion.play('skill');
    assert.match(image.src, /pikachu_skill\.png$/);
    assert.equal(image.dataset.pose, 'skill');
    sandbox.window.pokemonCompanion.play('excited');
    assert.equal(image.dataset.pose, 'skill', 'ordinary reaction must not override skill');
    now = 1799; frame(now);
    assert.equal(image.dataset.pose, 'skill');
    now = 1800; frame(now);
    assert.equal(image.dataset.pose, 'idle');
    assert.match(image.src, /pikachu\.png$/);
});
