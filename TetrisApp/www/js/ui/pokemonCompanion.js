/* v0.4.11 — presentation-only Pikachu pose controller.
 * Four static artwork poses animated in stepped CSS keyframes.
 * No gameplay scoring or board state is modified here.
 */
(function () {
    'use strict';
    const image = document.querySelector('#pokemon-side-slot .pokemon-side-character');
    if (!image) return;

    const root = 'images/pokemon/characters/';
    const poses = Object.freeze({
        idle: root + 'pikachu.png',
        wave: root + 'pikachu_wave.png',
        excited: root + 'pikachu_excited.png',
        celebrate: root + 'pikachu_celebrate.png'
    });
    Object.values(poses).forEach(src => {
        const preload = new Image();
        preload.src = src;
    });

    let current = 'idle';
    let reactionUntil = 0;
    let alternateAt = performance.now() + 4500;
    let rafId = null;
    const durations = { excited: 850, celebrate: 1650 };

    function setPose(pose) {
        if (pose === current) return;
        current = pose;
        image.src = poses[pose];
        image.dataset.pose = pose;
    }

    function tick(now) {
        if (now >= reactionUntil) {
            if (current === 'excited' || current === 'celebrate') {
                setPose('idle');
                alternateAt = now + 4500;
            } else if (now >= alternateAt) {
                setPose(current === 'idle' ? 'wave' : 'idle');
                alternateAt = now + 4500;
            }
        }
        rafId = requestAnimationFrame(tick);
    }

    window.pokemonCompanion = Object.freeze({
        play(pose) {
            if (!durations[pose]) return;
            const now = performance.now();
            // Never interrupt an active line-clear celebration with a lock reaction.
            if (pose === 'excited' && current === 'celebrate' && now < reactionUntil) return;
            setPose(pose);
            reactionUntil = now + durations[pose];
        },
        reset() {
            reactionUntil = 0;
            setPose('idle');
            alternateAt = performance.now() + 4500;
        }
    });
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) window.pokemonCompanion.reset();
    });
    rafId = requestAnimationFrame(tick);
})();
