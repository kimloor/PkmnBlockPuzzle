/** Highlight one golden cell, while keeping ordinary piece bevels unchanged. */
function drawGoldenGlow(ctx, x, y) {
    ctx.save();
    ctx.shadowColor = '#ff9c00';
    ctx.shadowBlur = 17;
    ctx.fillStyle = '#ffd261';
    ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fff8cb';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 3, y + 3, BLOCK_SIZE - 6, BLOCK_SIZE - 6);
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.fillRect(x + 6, y + 5, BLOCK_SIZE - 12, 4);
    ctx.restore();
}

/** Flash, expanding rings and particles over the resolved board (no external assets). */
function drawExplosionEffectsFrame(ctx, effects, now) {
    return effects.filter(effect => {
        const progress = Math.max(0, (now - effect.startTime) / 300);
        if (progress >= 1) return false;
        ctx.save();
        const x = (effect.c + 0.5) * BLOCK_SIZE;
        const y = (effect.r + 0.5) * BLOCK_SIZE;
        ctx.globalAlpha = 1 - progress;
        ctx.fillStyle = 'rgba(255,223,107,0.65)';
        ctx.beginPath();
        ctx.arc(x, y, BLOCK_SIZE * (0.35 + progress * 0.9), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff792e';
        ctx.lineWidth = 4 * (1 - progress) + 1;
        ctx.beginPath();
        ctx.arc(x, y, BLOCK_SIZE * (0.4 + progress * 1.3), 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 10; i++) {
            const angle = i * Math.PI / 5;
            const distance = BLOCK_SIZE * (0.2 + progress * 1.7);
            ctx.fillStyle = i % 2 ? '#fff0a7' : '#ff8638';
            ctx.fillRect(x + Math.cos(angle) * distance - 2, y + Math.sin(angle) * distance - 2, 4, 4);
        }
        ctx.restore();
        return true;
    });
}

/** Simple canvas bomb icon, independent of third-party artwork. */
function drawBombCell(ctx, x, y) {
    ctx.save();
    ctx.shadowColor = '#ff6b36';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#181d32';
    ctx.beginPath();
    ctx.arc(x + BLOCK_SIZE / 2, y + BLOCK_SIZE / 2 + 2, BLOCK_SIZE * 0.29, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff8558';
    ctx.stroke();
    ctx.strokeStyle = '#ffe8a3';
    ctx.beginPath();
    ctx.moveTo(x + BLOCK_SIZE * 0.55, y + BLOCK_SIZE * 0.25);
    ctx.lineTo(x + BLOCK_SIZE * 0.70, y + BLOCK_SIZE * 0.13);
    ctx.stroke();
    ctx.fillStyle = '#fff09a';
    ctx.fillRect(x + BLOCK_SIZE * 0.68, y + BLOCK_SIZE * 0.09, 4, 4);
    ctx.restore();
}

/**
 * @brief Draws the preview of the next Tetris piece in its designated canvas.
 * The piece is drawn centered within the preview area and styled with a bevel effect
 * according to the current theme.
 * @param {object} nextPieceToDraw - The piece object to be drawn in the preview.
 * Expected to have `type` (string) and `shape` (2D array) properties.
 * @param {CanvasRenderingContext2D} canvasCtx - The 2D rendering context of the "next piece" preview canvas.
 * @param {string} currentTheme - The key/name of the currently active theme, used to fetch colors.
 * @param {number} nextCanvasSizeInBlocks - The size of the preview canvas in terms of blocks.
 * @returns {void} (Draws directly to the `canvasCtx`).
 */
function drawNextPiecePreview(nextPieceToDraw, canvasCtx, currentTheme, nextCanvasSizeInBlocks) {
    if (!nextPieceToDraw) return;

    const themePieceColors = THEMES[currentTheme].pieceColors;
    const baseColor = getPieceColor(nextPieceToDraw.type, currentTheme);
    if (!baseColor) {
        console.error(`Colour not defined for piece type ${nextPieceToDraw.type} in theme ${currentTheme}`);
        return;
    }

    const light = lightenColor(baseColor, HIGHLIGHT_PERCENT);
    const dark = darkenColor(baseColor, SHADOW_PERCENT);
    const bs = BEVEL_SIZE;

    canvasCtx.fillStyle = THEMES[currentTheme]['--body-bg'] || '#1e293b';
    canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

    const shape = nextPieceToDraw.shape;
    const pieceWidthBlocks = shape[0].length;
    const pieceHeightBlocks = shape.length;
    const offsetX_canvas = (nextCanvasSizeInBlocks - pieceWidthBlocks) / 2;
    const offsetY_canvas = (nextCanvasSizeInBlocks - pieceHeightBlocks) / 2;

    shape.forEach((row, r_local) => {
        row.forEach((value, c_local) => {
            if (value === 1) {
                const x = (offsetX_canvas + c_local) * BLOCK_SIZE;
                const y = (offsetY_canvas + r_local) * BLOCK_SIZE;

                canvasCtx.fillStyle = dark;
                canvasCtx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                canvasCtx.fillStyle = light;
                canvasCtx.beginPath();
                canvasCtx.moveTo(x, y + BLOCK_SIZE - bs);
                canvasCtx.lineTo(x, y);
                canvasCtx.lineTo(x + BLOCK_SIZE - bs, y);
                canvasCtx.lineTo(x + BLOCK_SIZE - bs, y + bs);
                canvasCtx.lineTo(x + bs, y + bs);
                canvasCtx.lineTo(x + bs, y + BLOCK_SIZE - bs);
                canvasCtx.closePath();
                canvasCtx.fill();
                canvasCtx.fillStyle = baseColor;
                canvasCtx.fillRect(x + bs, y + bs, BLOCK_SIZE - 2 * bs, BLOCK_SIZE - 2 * bs);
                if (isBonusPieceType(nextPieceToDraw.type)) drawGoldenGlow(canvasCtx, x, y);
                if (nextPieceToDraw.bombCell && nextPieceToDraw.bombCell.r === r_local && nextPieceToDraw.bombCell.c === c_local) drawBombCell(canvasCtx, x, y);
            }
        });
    });
}


/**
 * @brief Renders one frame of all active line-clearing animations and filters out completed ones.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the main game canvas.
 * @param {Array<object>} animationsArray - An array of active line clear animation objects.
 * Each animation object is expected to have:
 * - `rows`: {Array<number>} Indices of the rows being animated.
 * - `type`: {string} Type of animation ('tetris' for 4 lines, 'normal' otherwise).
 * - `startTime`: {DOMHighResTimeStamp} Timestamp when the animation started.
 * - `duration`: {number} Total duration of the animation in milliseconds.
 * @param {number} mainCanvasWidth - The width of the main game canvas, used for drawing the full-width clearing effect.
 * @returns
 * */
function drawLineClearAnimationsFrame(ctx, animationsArray, mainCanvasWidth) {
    const now = performance.now();
    let activeAnimations = animationsArray.filter(anim => {
        const elapsedTime = now - anim.startTime;
        if (elapsedTime >= anim.duration) {
            return false;
        }

        const progress = elapsedTime / anim.duration;

        anim.rows.forEach(rowIndex => {
            const yPos = rowIndex * BLOCK_SIZE;
            let alpha, color;

            if (anim.type === 'tetris') {
                alpha = 0.8 * (1 - Math.abs(0.5 - progress) * 2);
                color = `rgba(255, 223, 0, ${Math.max(0, alpha)})`;
                ctx.fillStyle = color;
                ctx.fillRect(0, yPos, mainCanvasWidth, BLOCK_SIZE);
                if (progress < 0.5) {
                    for(let i=0; i < 5; i++) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * (1-progress*2)})`;
                        ctx.fillRect(Math.random() * mainCanvasWidth, yPos + Math.random() * BLOCK_SIZE - BLOCK_SIZE/2, 3, 3);
                    }
                }
            } else {
                alpha = 0.6 * (1 - progress);
                color = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
                ctx.fillStyle = color;
                ctx.fillRect(0, yPos, mainCanvasWidth, BLOCK_SIZE);
            }
        });
        return true;
    });
    return activeAnimations;
}