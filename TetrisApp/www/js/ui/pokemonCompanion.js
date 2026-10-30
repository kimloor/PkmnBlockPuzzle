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

    const speechLines = {"start":["ปิก้า! เริ่มกันเลย!","Pika! Let's go!","¡Pika! ¡Vamos!"],"lock":["ปิก้า!","Pika!","¡Pika!"],"idle5":["อีกนิดเดียว สู้ ๆ!","Keep going!","¡Sigue así!"],"idle30":["ปิก้า... ระวังบล็อกเต็มนะ!","Watch the blocks!","¡Cuidado con los bloques!"],"pause":["พักก่อนก็ได้นะ!","Take a break!","¡Descansa!"],"resume":["ลุยต่อกันเลย!","Let's continue!","¡Continuemos!"],"line1":["ดีมากเลย!","Nice clear!","¡Bien!"],"line2":["ว้าว! สองแถวเลย!","Two lines!","¡Dos líneas!"],"line3":["สุดยอดไปเลย!","Amazing!","¡Increíble!"],"line4":["ปิก้าาา! เทพมาก!","Four lines!","¡Cuatro líneas!"],"combo":["คอมโบมาแล้ว! ⚡","Combo! ⚡","¡Combo! ⚡"],"record":["ทำลายสถิติแล้ว!","New record!","¡Nuevo récord!"],"bomb":["บูมมม! 💥","Boom! 💥","¡Bum! 💥"],"chain":["ระเบิดต่อเนื่องเลย!","Chain reaction!","¡Reacción en cadena!"],"gold":["คะแนนคูณมาแล้ว!","Score multiplier!","¡Multiplicador!"],"gold3":["ปิก้า! คะแนนพุ่งเลย!","Big multiplier!","¡Muchos puntos!"],"danger70":["ระวังนะ! ใกล้เต็มแล้ว!","Stack getting high!","¡Casi lleno!"],"danger90":["ปิก้า!! อันตรายแล้ว!","Danger!","¡Peligro!"],"recover":["รอดแล้ว! เก่งมาก!","You saved it!","¡Te salvaste!"],"end":["ไม่เป็นไรนะ ลองใหม่กัน!","Try again!","¡Otra vez!"],"rank":["เยี่ยมเลย! ได้อันดับที่ {rank}!","Rank #{rank}!","¡Puesto {rank}!"]};
    const bubble = document.createElement('div');
    bubble.className = 'pikachu-speech';
    bubble.hidden = true;
    bubble.setAttribute('role', 'status');
    bubble.setAttribute('aria-live', 'polite');
    image.parentElement.appendChild(bubble);
    let speechTimeout = null;
    let lastSpeech = '';
    let lastSpeechAt = -Infinity;
    let priority = 0;
    function hideSpeech() {
        clearTimeout(speechTimeout);
        speechTimeout = null;
        bubble.hidden = true;
        priority = 0;
    }
    function say(key, importance = 1, replacements = {}) {
        if (!speechLines[key] || document.hidden || !document.getElementById('game-content')?.classList.contains('active')) return false;
        if (document.getElementById('reward-dialog')?.hidden === false) return false;
        const now = performance.now();
        if (!bubble.hidden && importance < priority) return false;
        if (importance < 3 && now - lastSpeechAt < 8000) return false;
        const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'th';
        const index = lang === 'en' ? 1 : lang === 'es' ? 2 : 0;
        const message = speechLines[key][index].replace('{rank}', String(replacements.rank ?? ''));
        if (importance < 3 && message === lastSpeech) return false;
        bubble.textContent = message;
        bubble.hidden = false;
        lastSpeech = message;
        lastSpeechAt = now;
        priority = importance;
        clearTimeout(speechTimeout);
        speechTimeout = setTimeout(hideSpeech, 2500);
        return true;
    }
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
        say,
        hideSpeech,
        resetSpeech() { hideSpeech(); lastSpeech = ''; lastSpeechAt = -Infinity; },
        reset() {
            reactionUntil = 0;
            setPose('idle');
            alternateAt = performance.now() + 4500;
        }
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) hideSpeech();
        else window.pokemonCompanion.reset();
    });
    rafId = requestAnimationFrame(tick);
})();
