// --- References to Game DOM Elements ---
const canvas = document.getElementById('tetris-canvas');
const context = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('next-piece-canvas');
const contextNextPiece = nextPieceCanvas.getContext('2d');
const scoreValueElement = document.getElementById('score-value');
const dynamicSpeedToggle = document.getElementById('dynamic-speed-toggle');
const levelValueHeaderElement = document.getElementById('level-value-header');

// --- Canvas configuration ---
canvas.width = COLS * BLOCK_SIZE; // COLS, BLOCK_SIZE from constants.js
canvas.height = ROWS * BLOCK_SIZE; // ROWS from constants.js
const NEXT_CANVAS_SIZE_BLOCKS = 4;
nextPieceCanvas.width = NEXT_CANVAS_SIZE_BLOCKS * BLOCK_SIZE;
nextPieceCanvas.height = NEXT_CANVAS_SIZE_BLOCKS * BLOCK_SIZE;

// --- Game State Variables ---
let currentPiece = null;
let nextPiece = null;
let lastTime = 0;
let dropCounter = 0;
let score = 0;
let gameOver = false;
let gameState = 'MENU'; // Initial state
let animationFrameId = null;
let dynamicSpeedEnabled = true;
let currentDropInterval = ORIGINAL_DROP_INTERVAL; // From constants.js
let lineClearAnimations = [];
let bombExplosionEffects = [];
let gameLevel = 0;
let scoreNeededToReachNextLevel = 0;
let canSwapPiece = true;
let isPieceLanded = false;
let lockDelayTimerId = null;
let sessionRecordedScore = null;
let playElapsedMs = 0;
let playingSince = null;
let scoreRunId = null;
let companionMisses=0, companionStreak=0, companionLastClearMs=0, companionDanger=0, companionWasCritical=false, companionRecord=false, companionPreviousBest=0;
const speak = (key, priority=1, args={}) => window.pokemonCompanion?.say(key,priority,args);
function stopPlayClock(){if(playingSince!==null){playElapsedMs+=Math.max(0,performance.now()-playingSince);playingSince=null;}}
function startPlayClock(){if(!document.hidden && playingSince===null)playingSince=performance.now();}
function getPlayTimeMs(){return Math.round(playElapsedMs+(playingSince===null?0:Math.max(0,performance.now()-playingSince)));}


const rewardMilestones = Object.freeze([
    { points: 10000, label: 'ไอศกรีม Dairy Queen 1 โคน' },
    { points: 20000, label: 'กาโตะ 1 ขวด' },
    { points: 30000, label: 'กล่องการ์ดโปเกม่อน 1 กล่อง' },
    { points: 100000, label: 'Nintendo Switch 1 เครื่อง' }
]);
const earnedRewardPoints = new Set();
const pendingRewards = [];
let rewardShowing = false;
const rewardDialog = document.getElementById('reward-dialog');
const rewardMessage = document.getElementById('reward-message');
const rewardContinue = document.getElementById('reward-continue');
function resetScoreRewards() {
    earnedRewardPoints.clear();
    pendingRewards.length = 0;
    rewardShowing = false;
    if (rewardDialog) rewardDialog.hidden = true;
}
function queueScoreRewards() {
    if (gameState !== 'PLAYING') return;
    for (const reward of rewardMilestones) {
        if (score >= reward.points && !earnedRewardPoints.has(reward.points)) {
            earnedRewardPoints.add(reward.points);
            pendingRewards.push(reward);
        }
    }
    if (pendingRewards.length && !rewardShowing) showNextScoreReward();
}
function showNextScoreReward() {
    const next = pendingRewards.shift();
    if (!next) return;
    rewardShowing = true;
    stopPlayClock();
    gameState = 'REWARD_PAUSED';
    clearTimeout(lockDelayTimerId);
    lockDelayTimerId = null;
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    if (rewardMessage) rewardMessage.textContent = 'คุณได้รับ' + next.label + '!';
    const prizeVisual = document.getElementById('reward-prize-visual');
    if (prizeVisual) {
        if (next.points === 20000) {
            // Simple, offline SVG water bottle instead of a juice carton.
            prizeVisual.innerHTML = '<svg viewBox="0 0 72 110" width="78" height="118" aria-label="ขวดน้ำ" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="24" y="5" width="24" height="13" rx="3" fill="#2785d1"/><rect x="28" y="17" width="16" height="13" rx="3" fill="#89cefb"/><path d="M28 27 Q28 33 20 39 Q15 44 15 54 L15 94 Q15 103 24 103 L48 103 Q57 103 57 94 L57 54 Q57 44 52 39 Q44 33 44 27Z" fill="#c7edff" stroke="#2993d4" stroke-width="3"/><path d="M18 66 Q36 60 54 66 L54 89 Q36 84 18 89Z" fill="#72caff" opacity=".75"/><path d="M24 44 Q20 56 23 82" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>';
        } else {
            prizeVisual.textContent = ({10000:'🍦',30000:'🎴',100000:'🎮'})[next.points] || '🎁';
        }
    }
    if (rewardDialog) rewardDialog.hidden = false;
    window.pokemonCompanion?.hideSpeech();
    if (window.pokemonCompanion) window.pokemonCompanion.play('celebrate');
    if (rewardContinue) rewardContinue.focus();
}
function acknowledgeScoreReward() {
    if (!rewardShowing) return;
    if (pendingRewards.length) { showNextScoreReward(); return; }
    rewardShowing = false;
    if (rewardDialog) rewardDialog.hidden = true;
    gameState = 'PLAYING';
    startPlayClock();
    lastTime = performance.now();
    dropCounter = 0;
    if (isPieceLanded) {
        isPieceLanded = false;
        pieceHasLanded();
    }
    if (gameOver) { handleGameOver(); return; }
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(updateGame);
}
if (rewardContinue) rewardContinue.addEventListener('click', acknowledgeScoreReward);


// Save synchronously before mobile browsers suspend/close a page.
function recordCurrentSessionScore() {
    stopPlayClock();
    if (gameState !== 'PLAYING' && gameState !== 'PAUSED' && gameState !== 'GAMEOVER' && gameState !== 'REWARD_PAUSED') return false;
    if (sessionRecordedScore === null) {
        addScoreToHighScoresList(score,getPlayTimeMs(),scoreRunId);
    } else {
        updateSessionHighScore(sessionRecordedScore,score,getPlayTimeMs(),scoreRunId);
    }
    sessionRecordedScore = score;
    return true;
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') recordCurrentSessionScore();
    else if(gameState==='PLAYING'){lastTime=performance.now();startPlayClock();}
});
window.addEventListener('pagehide', recordCurrentSessionScore);


// --- Game Logic Instance for Controls.js ---
// This object will be passed to controls.js to interact with game state & functions
const gameInstance = {
    get currentPiece() { return currentPiece; },
    get gameState() { return gameState; },
    setGameState: (newState) => {
        if(newState!=='PLAYING')stopPlayClock();else startPlayClock();
        if (newState === 'PAUSED') {
            clearTimeout(lockDelayTimerId);
            lockDelayTimerId = null;
        }
        gameState = newState;
    },
    get gameOver() { return gameOver; },
    drawGame: () => drawGame(),
    handleLineClears: (info) => handleLineClears(info),
    spawnNewPieceInternalLogic: () => spawnNewPieceInternalLogic(),
    handleGameOver: () => handleGameOver(),
    isPieceLandedState: () => isPieceLanded,
    clearLockDelayTimer: () => {
        clearTimeout(lockDelayTimerId);
        lockDelayTimerId = null;
    },
    lockPieceAndContinue: () => lockPieceAndContinue(),
    resetDropCounter: () => { dropCounter = 0; }, 
    handleLandedPieceHorizontalMove: () => handleLandedPieceHorizontalMove(),
    pieceDroppedToBottom: () => pieceDroppedToBottom(),
    gameControlActions: null
};


/** ----- Initialisation and Core Set Lifecycle Functions ----- */

/**
 * @brief Initializes or resets the game to a new state.
 * This function sets up all necessary variables for a new game or a restarted game,
 * optionally keeping the score and level if continuing after a game over.
 * @returns None.
 */
function initializeNewGame(keepScore = false) {
    if (!keepScore) {
        recordCurrentSessionScore();
        sessionRecordedScore = null;
        playElapsedMs=0;playingSince=null;scoreRunId='run-'+Date.now()+'-'+Math.random().toString(36).slice(2);
        resetScoreRewards();
        companionMisses=0;companionStreak=0;companionLastClearMs=0;companionDanger=0;companionWasCritical=false;companionRecord=false;
        companionPreviousBest=getHighScores()[0]?.score || 0;
        window.pokemonCompanion?.resetSpeech();
    }
    initGameBoard();
    gameOver = false;
    isPieceLanded = false;
    bombExplosionEffects = [];

    clearTimeout(lockDelayTimerId);
    lockDelayTimerId = null;
    
    if (!keepScore) {
        score = 0;
        gameLevel = 0;
        scoreNeededToReachNextLevel = calculateTotalScoreNeededForLevel(gameLevel + 1);
    }
    canSwapPiece = true;
    clearTimeout(showBonusScoreFeedback.timeoutId);
    const bonusFeedback = document.getElementById('bonus-score-feedback');
    if (bonusFeedback) bonusFeedback.hidden = true;
    clearTimeout(showBombFeedback.timeoutId);
    const bombFeedback = document.getElementById('bomb-feedback');
    if (bombFeedback) bombFeedback.hidden = true;
    updateScoreDisplay();

    if (dynamicSpeedToggle) dynamicSpeedEnabled = dynamicSpeedToggle.checked;
    else dynamicSpeedEnabled = true;
    updateDropSpeed();

    lastTime = performance.now(); 
    dropCounter = 0; 

    nextPiece = new Piece(getRandomPieceTypeKey()); 
    spawnNewPieceInternalLogic();

    if (gameOver) {
        handleGameOver();
    } else {
        gameState = 'PLAYING';
        startPlayClock();
        playBackgroundMusic();
        if (typeof showScreen === 'function') showScreen('PLAYING');
        speak('start',3);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(updateGame);
    }
}


/**
 * @brief Handles the game over sequence.
 * This function is called when the game over condition is met.
 * It updates the game state, stops music and animations, clears timers, processes the final score,
 * plays appropriate sounds, and shows the game over screen.
 * @arguments None.
 * @returns None.
 */
function handleGameOver() {
    stopPlayClock();
    gameState = 'GAMEOVER';
    stopBackgroundMusic();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = null;

    isPieceLanded = false;
    clearTimeout(lockDelayTimerId);
    lockDelayTimerId = null;

    const currentScoreVal = score;
    const isNewHigh = sessionRecordedScore === null
        ? addScoreToHighScoresList(currentScoreVal,getPlayTimeMs(),scoreRunId)
        : updateSessionHighScore(sessionRecordedScore,currentScoreVal,getPlayTimeMs(),scoreRunId);
    sessionRecordedScore = currentScoreVal;
    const allHighScores = getHighScores();
    const globalHighScore = allHighScores.length > 0 ? allHighScores[0].score : 0;
    const currentRankIndex = allHighScores.findIndex(entry => entry.id === scoreRunId);
    const currentRank = currentRankIndex >= 0 ? currentRankIndex + 1 : null;

    if (isNewHigh) {
        playNewHighScoreSound();
    } else {
        playGameOverSound();
    }

    // Game-over bubbles cannot remain anchored when the companion board is hidden.
    window.pokemonCompanion?.hideSpeech();
    if (typeof updateGameOverScreenInfo === 'function') {
        updateGameOverScreenInfo(currentScoreVal, globalHighScore, currentRank);
    }
    if (typeof showScreen === 'function') {
        showScreen('GAMEOVER');
    }
}


/** ----- Appearance Logic and Piece Manipulation ----- */

/**
 * @brief Selects and returns a random piece type key from the defined PIECE_TYPES.
 * @arguments None.
 * @returns {string} A string representing a random piece type key.
 */
function getRandomPieceTypeKey() {
    const pool = Math.random() < BONUS_PIECE_CHANCE
        ? BONUS_PIECE_TYPES
        : Object.keys(PIECE_TYPES).filter(type => !isBonusPieceType(type));
    return pool[Math.floor(Math.random() * pool.length)];
}


/**
 * @brief Handles the internal logic for spawning a new piece.
 * This function is called after a piece locks or at the beginning of a new game.
 * It sets the previously "next" piece as the "current" piece, generates a new "next" piece,
 * resets states related to piece landing and swapping, and checks for game over if the new
 * current piece cannot be placed.
 * @arguments None.
 * @returns None.
 */
function spawnNewPieceInternalLogic() {
    isPieceLanded = false;
    clearTimeout(lockDelayTimerId);
    lockDelayTimerId = null;
    
    currentPiece = nextPiece;
    nextPiece = new Piece(getRandomPieceTypeKey());
    canSwapPiece = true;
    
    if (currentPiece && !isPositionValid(currentPiece, currentPiece.x, currentPiece.y)) {
        gameOver = true;
    }
}


/**
 * @brief Swaps the current falling piece with the next piece.
 * @arguments None.
 * @returns None.
 */
function performPieceSwap() {
    if (!currentPiece || !nextPiece || !canSwapPiece || gameState !== 'PLAYING') { return; }

    const originalCurrentPiece = currentPiece;
    currentPiece = new Piece(nextPiece.type, nextPiece.bombCell); 

    if (!isPositionValid(currentPiece, currentPiece.x, currentPiece.y)) {
        gameOver = true; 
        handleGameOver();
        return;
    }
    nextPiece = new Piece(originalCurrentPiece.type, originalCurrentPiece.bombCell);

    canSwapPiece = false; 
    dropCounter = 0;
    drawGame(); 
}


/** ----- Part Landing Logic and 'Lock Delay' ----- */

/**
 * @brief Handles the event when a piece has landed. It sets the `isPieceLanded` state to true and 
 * starts the lock delay timer. During the lock delay, the piece can be moved horizontally.
 * @arguments None.
 * @returns None.
 */
function pieceHasLanded() {
    if (gameOver || !currentPiece || gameState !== 'PLAYING' || isPieceLanded) return;

    isPieceLanded = true;
    clearTimeout(lockDelayTimerId); 
    lockDelayTimerId = setTimeout(lockPieceAndContinue, LOCK_DELAY_DURATION);
}


/**
 * @brief Handles logic when a piece that is already in a "landed" state is moved horizontally by the player.
 * It resets the lock delay timer if the piece is still landed after the move, or cancels the landed state if the piece is no longer on a surface.
 * @arguments None.
 * @returns None.
 */
function handleLandedPieceHorizontalMove() {
    if (!isPieceLanded || !currentPiece) return;

    clearTimeout(lockDelayTimerId);
    lockDelayTimerId = null;

    if (isPositionValid(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        isPieceLanded = false;
    } else {
        lockDelayTimerId = setTimeout(lockPieceAndContinue, LOCK_DELAY_DURATION);
    }
    drawGame();
}


/**
 * @brief Handles the situation when a piece has been actively dropped to the bottom by player controls.
 * It initiates the lock delay process by calling `pieceHasLanded()` and resets the `dropCounter`.
 * @arguments None.
 * @returns None.
 */
function pieceDroppedToBottom() {
    if (gameOver || !currentPiece) return;

    pieceHasLanded();
    dropCounter = 0;
}


/**
 * @brief Locks the current piece onto the board, processes line clears, spawns a new piece, and resets relevant game states.
 * This function is typically called when the lock delay timer expires or a piece is forced to lock.
 * * @arguments None.
 * @returns None.
 */
function lockPieceAndContinue() {
    if (!currentPiece || gameState !== 'PLAYING' || !isPieceLanded || gameOver) return;

    fixPieceOnBoard(currentPiece); 
    const linesClearedInfo = checkAndClearLines(); 
    handleLineClears(linesClearedInfo);
    // A completed row takes precedence over the ordinary piece-lock reaction.
    if (window.pokemonCompanion) {
        window.pokemonCompanion.play(linesClearedInfo.count > 0 ? 'celebrate' : 'excited');
    }
    if (linesClearedInfo.explosions?.length) {
        showBombFeedback(linesClearedInfo.explosions.length);
        const startTime = performance.now();
        bombExplosionEffects.push(...linesClearedInfo.explosions.map(bomb => ({ ...bomb, startTime })));
    }
    
    if (linesClearedInfo.count > 0) {
        companionMisses=0;
        companionLastClearMs=getPlayTimeMs();
        companionStreak++;
        const waves=linesClearedInfo.waves || [];
        if (linesClearedInfo.explosions?.length && waves.length>1) speak('chain',3);
        else if (waves.some(w=>(w.goldenCellsCleared||0)>=2)) speak('gold3',3);
        else if (linesClearedInfo.goldenCellsCleared>0) speak('gold',2);
        else if (companionStreak>=3) speak('combo',3);
        else speak('line'+Math.min(4,linesClearedInfo.count),2);
    } else {
        companionStreak=0;
        companionMisses++;
        if (linesClearedInfo.explosions?.length) speak('bomb',2);
        else if(companionMisses===5) speak('idle5',2);
        else if(Math.random()<.1) speak('lock',1);
    }
    if (!companionRecord && companionPreviousBest>0 && score>companionPreviousBest) {
        companionRecord=true;speak('record',3);
    }
    const highest=gameBoard.findIndex(row=>row.some(cell=>cell!==null && cell!==undefined && cell!==0));
    const ratio=highest<0?0:(ROWS-highest)/ROWS;
    if(ratio>=.9 && companionDanger<2){companionDanger=2;companionWasCritical=true;speak('danger90',4);}
    else if(ratio>=.7 && companionDanger===0){companionDanger=1;speak('danger70',3);}
    else if(ratio<.6){if(companionWasCritical)speak('recover',4);companionWasCritical=false;companionDanger=0;}
    spawnNewPieceInternalLogic();
    if (rewardShowing) { window.pokemonCompanion?.hideSpeech(); drawGame(); return; }

    if (gameOver) {
        drawGame();
        handleGameOver();
        return;
    }
    
    isPieceLanded = false;
    clearTimeout(lockDelayTimerId);
    lockDelayTimerId = null;
    dropCounter = 0;
    
    // The updateGame loop will take care of redrawing if not gameOver
    if (!gameOver) { //
        drawGame();
    }
}


/** ----- Game Event Management ----- */

/**
 * @brief Handles the events following one or more lines being cleared.
 * This includes adding to the score, playing appropriate sounds, and queuing line-clearing animations.
 * @param {object} linesClearedInfo - An object containing information about the lines cleared.
 * @returns None.
 */
function handleLineClears(linesClearedInfo) {
    if (linesClearedInfo.count > 0) {
        // Score each chain wave independently. Bomb-destroyed gold gives no bonus.
        let maxMultiplier = 1;
        for (const wave of (linesClearedInfo.waves || [linesClearedInfo])) {
            const multiplier = 1 + (wave.goldenCellsCleared || 0);
            maxMultiplier = Math.max(maxMultiplier, multiplier);
            for (let remaining = wave.count; remaining > 0; remaining -= 4) {
                addScore(Math.min(remaining, 4), multiplier);
            }
        }
        if (maxMultiplier > 1) showBonusScoreFeedback(maxMultiplier);
        queueScoreRewards();

        if (linesClearedInfo.count === 4) {
            playTetrisClearSound();
        } else {
            playLineClearSound();
        }

        lineClearAnimations.push({
            rows: linesClearedInfo.indices,
            type: linesClearedInfo.count === 4 ? 'tetris' : 'normal',
            startTime: performance.now(),
            duration: linesClearedInfo.count === 4 ? 600 : 350
        });
    }
}


function showBombFeedback(count) {
    const badge = document.getElementById('bomb-feedback');
    if (!badge) return;
    badge.textContent = count > 1 ? 'CHAIN EXPLOSION ×' + count + '!' : 'BOOM!';
    badge.hidden = false;
    clearTimeout(showBombFeedback.timeoutId);
    showBombFeedback.timeoutId = setTimeout(() => { badge.hidden = true; }, 1200);
}

function showBonusScoreFeedback(multiplier) {
    const badge = document.getElementById('bonus-score-feedback');
    if (!badge) return;
    badge.textContent = `BONUS ×${multiplier}!`;
    badge.hidden = false;
    clearTimeout(showBonusScoreFeedback.timeoutId);
    showBonusScoreFeedback.timeoutId = setTimeout(() => { badge.hidden = true; }, 1200);
}

/** ----- Rendering and UI Update Functions ----- */

/**
 * @brief Updates the score and level display elements in the UI.
 * @arguments None.
 * @returns None. (This function modifies DOM elements directly).
 */
function updateScoreDisplay() {
    if (scoreValueElement) scoreValueElement.textContent = score;

    if (levelValueHeaderElement) {
        levelValueHeaderElement.textContent = gameLevel;
    }
}


/**
 * @brief Main rendering function for the game.
 * Clears the main game canvas and redraws all active game elements based on the current game state and theme.
 * @arguments None.
 * @returns None. (This function draws directly to the canvas contexts).
 */
function drawGame() {
    const currentActiveThemeName = getCurrentThemeName();

    context.fillStyle = THEMES[currentActiveThemeName]['--board-bg'] || '#0f172a';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    drawBoardGrid(context, getCurrentGridColor()); 
    drawFixedPieces(context, currentActiveThemeName); 
    
    // --- Draw Ghost Piece ---
    if (currentPiece && !gameOver && gameState === 'PLAYING') { 
        const ghostY = getGhostPieceY(currentPiece); 
        if (typeof currentPiece.drawGhost === 'function') {
            currentPiece.drawGhost(context, ghostY, currentActiveThemeName);
        }
    }

    if (currentPiece && !gameOver) {
        currentPiece.draw(context, currentActiveThemeName);
    }
    
    lineClearAnimations = drawLineClearAnimationsFrame(context, lineClearAnimations, canvas.width);
    bombExplosionEffects = drawExplosionEffectsFrame(context, bombExplosionEffects, performance.now());
    drawNextPiecePreview(nextPiece, contextNextPiece, currentActiveThemeName, NEXT_CANVAS_SIZE_BLOCKS);
}


/** ----- Main Game Loop ----- */

/**
 * @brief The main game loop function, called repeatedly using `requestAnimationFrame`.
 * It handles game timing, piece falling logic (gravity), and redrawing the game screen.
 * @param {DOMHighResTimeStamp} [currentTime=0] - The timestamp passed by `requestAnimationFrame`, indicating the current time.
 * @returns None.
 */
function updateGame(currentTime = 0) {
    if (gameState !== 'PLAYING') {
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        return;
    }
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (!isPieceLanded) {
        dropCounter += deltaTime;
        if (dropCounter > currentDropInterval) {
            if (currentPiece) {
                const hasLandedByGravity = currentPiece.moveDown();
                if (hasLandedByGravity) {
                    pieceHasLanded();
                }
            }
            dropCounter = 0;
        }
    }
    drawGame();
    animationFrameId = requestAnimationFrame(updateGame);
}


/** ----- Callbacks for Menus and Control Actions ----- */

/**
 * @brief A collection of callback functions that define core game actions triggered by menu interactions.
 * This object is typically passed to menu initialization functions to link UI elements
 * to specific game logic defined in `main.js`. It also gets assigned to `gameInstance.gameControlActions`
 * to be accessible by other modules if needed.
 */
const gameControlActions = {
    /**
     * @brief Initiates a new game, resetting score and level.
     */
    onStartGame: () => { 
        playButtonClickSound(); 
        initializeNewGame(false); 
    },

    /**
     * @brief Resumes the game if it was previously paused.
     */
    onResumeGame: () => {
        if (rewardShowing) return;
        playButtonClickSound();
        if (gameState !== 'PAUSED') return;
        gameState = 'PLAYING';
        startPlayClock();
        if (isPieceLanded) {
            // Pause cancels the pending lock; resume starts a fresh full delay.
            isPieceLanded = false;
            pieceHasLanded();
        }
        playBackgroundMusic();
        if (typeof showScreen === 'function') showScreen('PLAYING');
        lastTime = performance.now();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(updateGame);
    },

    /**
     * @brief Restarts the current game from the beginning, resetting score and level.
     */
    onRestartGame: () => {
        recordCurrentSessionScore();
        playButtonClickSound();
        stopBackgroundMusic();
        initializeNewGame(false);
    },

    /**
     * @brief Navigates the player back to the main menu screen.
     */
    onGoToMainMenu: () => {
        recordCurrentSessionScore();
        playButtonClickSound();
        stopPlayClock();
        gameState = 'MENU';
        resetScoreRewards();
        clearTimeout(lockDelayTimerId);
        lockDelayTimerId = null;
        isPieceLanded = false;
        stopBackgroundMusic();
        if (typeof showScreen === 'function') showScreen('MENU');
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    },

    /**
     * @brief Allows the player to start a new game after a "Game Over", typically keeping the previous score and level.
     */

    /**
     * @brief Displays the high scores screen.
     */
    onShowHighScores: () => {
        playButtonClickSound();
        if (typeof displayHighScoresOnMenu === 'function') displayHighScoresOnMenu(getHighScores());
        if (typeof showScreen === 'function') showScreen('HIGH_SCORES');
    },

    /**
     * @brief Handles a request to change the game's visual theme.
     * @param {string} newThemeName - The identifier of the theme to be applied.
     */
    onThemeChange: (newThemeName) => {
        playButtonClickSound();
        applyTheme(newThemeName, () => {
            if (gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAMEOVER') {
                drawGame();
            }
        });
    },

    /**
     * @brief Handles a request to change the game's display language.
     * @param {string} newLangCode - The language code for the new language (e.g., 'es', 'en').
     */
    onLanguageChange: (newLangCode) => {
        playButtonClickSound();
        setLanguage(newLangCode, gameState, getHighScores());
    }
};
gameInstance.gameControlActions = gameControlActions;


/**
 * @brief Initializes the entire application.
 * This function is the main entry point for setting up the game when the page loads.
 * It initializes audio, loads saved preferences (mute settings, high scores, language, theme),
 * sets up menu event listeners, initializes game controls, and displays the main menu.
 * @arguments None.
 * @returns None.
 */
function initializeApp() {
    initAudioElements(); 
    if (typeof loadMuteSettings === 'function') { 
        loadMuteSettings();
    } else {
        console.error("loadMuteSettings function is not defined in audio.js");
    }

    loadHighScoresFromStorage();

    const preferredLang = loadLanguagePreference();
    setLanguage(preferredLang, gameState, getHighScores()); 

    const preferredTheme = loadThemePreference(); 
    applyTheme(preferredTheme, () => {
        if (gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAMEOVER') {
            drawGame();
        }
    });


    if (typeof initializeMenuEventListeners === 'function') {
        initializeMenuEventListeners(gameControlActions);
    } else { console.error("initializeMenuEventListeners is not defined."); }

    if (dynamicSpeedToggle) dynamicSpeedEnabled = dynamicSpeedToggle.checked;

    initControls(gameInstance);
    
    if (nextPieceCanvas) {
        nextPieceCanvas.addEventListener('click', () => {
            if (gameState === 'PLAYING') {
                performPieceSwap();
            }
        });
        nextPieceCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (gameState === 'PLAYING') {
                performPieceSwap();
            }
        });
    }
    
    if (typeof showScreen === 'function') showScreen('MENU');
    else { console.error("showScreen is not defined."); if(document.getElementById('start-menu')) document.getElementById('start-menu').classList.add('active'); }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}