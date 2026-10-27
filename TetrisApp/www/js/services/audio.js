// --- Module-scoped variables for HTMLAudioElements ---
let backgroundMusicElement;
let openingMusicElement;
let activeMusicScreen = "MENU";
let lineClearSoundElement, tetrisClearSoundElement;
let newHighScoreSoundElement, gameOverSoundElement, buttonClickSoundElement;

// --- Module-scoped variables for mute states ---
let isMusicMuted = false;
let areSfxMuted = false;


/**
 * @brief Initializes references to all HTMLAudioElements used in the game.
 * Retrieves elements by their IDs from the DOM and applies the initial mute state to the background music element.
 * @arguments None.
 * @returns None.
 */
function initAudioElements() {
    backgroundMusicElement = document.getElementById('backgroundMusicPlayer');
    openingMusicElement = document.getElementById('openingMusicPlayer');
    lineClearSoundElement = document.getElementById('lineClearSound');
    tetrisClearSoundElement = document.getElementById('tetrisClearSound');
    newHighScoreSoundElement = document.getElementById('newHighScoreSound');
    gameOverSoundElement = document.getElementById('gameOverSound');
    buttonClickSoundElement = document.getElementById('buttonClickSound');
    
    // Apply initial mute state to the background music HTML element
    if (backgroundMusicElement) {
        backgroundMusicElement.muted = isMusicMuted;
    }
    if (openingMusicElement) openingMusicElement.muted = isMusicMuted;
}


/**
 * @brief Loads mute settings for music and SFX from localStorage and applies them.
 * @arguments None.
 * @returns None.
 */
function loadMuteSettings() {
    if (typeof MUSIC_MUTE_STORAGE_KEY !== 'undefined') {
        const savedMusicMute = localStorage.getItem(MUSIC_MUTE_STORAGE_KEY);
        if (savedMusicMute !== null) {
            isMusicMuted = savedMusicMute === 'true';
        }
    }
    if (backgroundMusicElement) backgroundMusicElement.muted = isMusicMuted;
    if (openingMusicElement) openingMusicElement.muted = isMusicMuted;

    if (typeof SFX_MUTE_STORAGE_KEY !== 'undefined') {
        const savedSfxMute = localStorage.getItem(SFX_MUTE_STORAGE_KEY);
        if (savedSfxMute !== null) {
            areSfxMuted = savedSfxMute === 'true';
        }
    }
}


/**
 * @brief Saves the current music mute setting (`isMusicMuted`) to localStorage.
 * @arguments None.
 * @returns None.
 */
function saveMusicMuteSetting() {
    if (typeof MUSIC_MUTE_STORAGE_KEY !== 'undefined') {
        try {
            localStorage.setItem(MUSIC_MUTE_STORAGE_KEY, isMusicMuted);
        } catch (e) {
            console.error("Error saving music mute setting to localStorage:", e);
        }
    }
}


/**
 * @brief Saves the current SFX mute setting (`areSfxMuted`) to localStorage.
 * @arguments None.
 * @returns None.
 */
function saveSfxMuteSetting() {
    if (typeof SFX_MUTE_STORAGE_KEY !== 'undefined') {
        try {
            localStorage.setItem(SFX_MUTE_STORAGE_KEY, areSfxMuted);
        } catch (e) {
            console.error("Error saving SFX mute setting to localStorage:", e);
        }
    }
}


/**
 * @brief Toggles the mute state for background music.
 * Updates the `isMusicMuted` variable, applies the state to the `backgroundMusicElement`,
 * saves the setting to localStorage, and attempts to play music if unmuted and previously paused.
 * @returns {boolean} The new mute state for music (`true` if muted, `false` otherwise).
 */
function toggleMusicMute() {
    isMusicMuted = !isMusicMuted;
    if (backgroundMusicElement) backgroundMusicElement.muted = isMusicMuted;
    if (openingMusicElement) openingMusicElement.muted = isMusicMuted;
    if (isMusicMuted) {
        pauseAllMusic();
    } else {
        syncMusicForScreen(activeMusicScreen);
    }
    saveMusicMuteSetting();
    return isMusicMuted;
}


/**
 * @brief Toggles the mute state for sound effects.
 * Updates the `areSfxMuted` variable and saves the setting to localStorage.
 * @returns {boolean} The new mute state for SFX (`true` if muted, `false` otherwise).
 */
function toggleSfxMute() {
    areSfxMuted = !areSfxMuted;
    saveSfxMuteSetting();
    return areSfxMuted;
}


/**
 * @brief Gets the current mute state for background music.
 * @returns {boolean} `true` if music is muted, `false` otherwise.
 */
function getMusicMuteState() {
    return isMusicMuted;
}


/**
 * @brief Gets the current mute state for sound effects.
 * @returns {boolean} `true` if SFX are muted, `false` otherwise.
 */
function getSfxMuteState() {
    return areSfxMuted;
}


/**
 * @brief Plays a given sound effect element if SFX are not muted and the element is ready.
 * This is a generic function used by specific sound effect players.
 * @param {HTMLAudioElement} soundElement - The HTMLAudioElement to play.
 * @returns None.
 */
function playSound(soundElement) {
    if (areSfxMuted) {
        return;
    }

    if (soundElement && soundElement.currentSrc && soundElement.readyState >= 1) { 
        soundElement.currentTime = 0; 
        soundElement.play().catch(error => {
            console.warn("Error during play() for " + (soundElement.id || 'unknown element') + ":", error, "Current ReadyState:", soundElement.readyState);
        });
    } else {
        console.warn("playSound: Cannot play. Element:", soundElement ? soundElement.id : 'null',
                    soundElement ? "currentSrc: " + soundElement.currentSrc : "",
                    soundElement ? "readyState: " + soundElement.readyState : "",
                    soundElement ? "networkState: " + soundElement.networkState : "",
                    soundElement && soundElement.error ? "error: " + JSON.stringify(soundElement.error) : "error: null"
        );
    }
}

// --- Specific Sound Effect Player Functions ---
function playLineClearSound() {
    playSound(lineClearSoundElement);
}

function playTetrisClearSound() {
    playSound(tetrisClearSoundElement);
}

function playNewHighScoreSound() {
    playSound(newHighScoreSoundElement);
}

function playGameOverSound() {
    playSound(gameOverSoundElement);
}

function playButtonClickSound() {
    playSound(buttonClickSoundElement);
}


// --- Screen-dependent music routing ---
// Called on screen transitions and when the music preference changes.
// Mobile browsers can block playback before a user gesture; do not retry in a timer.
function pauseAllMusic() {
    for (const element of [backgroundMusicElement, openingMusicElement]) {
        if (element && !element.paused) element.pause();
    }
}
function syncMusicForScreen(screenName) {
    activeMusicScreen = screenName;
    const target = (screenName === 'MENU' || screenName === 'HIGH_SCORES')
        ? openingMusicElement
        : screenName === 'PLAYING' ? backgroundMusicElement : null;
    for (const element of [backgroundMusicElement, openingMusicElement]) {
        if (element && element !== target && !element.paused) element.pause();
    }
    if (target && !isMusicMuted && target.paused) {
        target.play().catch(error => {
            console.warn('Music playback blocked or unavailable:', error);
        });
    }
}

// --- Background Music Controls ---

/**
 * @brief Plays the background music if it's not muted and is currently paused.
 * @arguments None.
 * @returns None.
 */
function playBackgroundMusic() {
    syncMusicForScreen('PLAYING');
}


/**
 * @brief Pauses the background music if it is currently playing.
 * @arguments None.
 * @returns None.
 */
function pauseBackgroundMusic() {
    pauseAllMusic();
}


/**
 * @brief Stops the background music and resets its playback position to the beginning.
 * @arguments None.
 * @returns None.
 */
function stopBackgroundMusic() {
    pauseAllMusic();
    if (backgroundMusicElement) backgroundMusicElement.currentTime = 0;
}