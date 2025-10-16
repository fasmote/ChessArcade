/**
 * ============================================
 * COORDINATE SEQUENCE - GAME LOGIC
 * ============================================
 * Lógica principal del juego de secuencias
 *
 * @version 1.0.0
 * @author ChessArcade Team
 */

// ============================================
// ESTADO DEL JUEGO
// ============================================

let gameState = {
    // Progresión
    currentLevel: 1,
    score: 0,
    lives: 3,
    maxLives: 3,

    // Secuencia MASTER acumulativa (Simon Says style)
    masterSequence: [],     // Secuencia acumulativa que crece cada nivel
    sequence: [],           // ['e4', 'd5', 'f3'] - copia de masterSequence para el nivel actual
    playerSequence: [],     // Lo que el jugador clickeó
    currentStep: 0,         // Índice actual en reproducción

    // Fases del juego
    phase: 'idle',          // 'idle' | 'showing' | 'playing' | 'success' | 'fail' | 'gameover'

    // Config
    soundEnabled: true,

    // Stats
    bestLevel: 1,
    totalAttempts: 0,
    perfectLevels: 0,
    currentLevelAttempts: 0
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧠 Coordinate Sequence - Initializing...');

    initGame();
    setupEventListeners();
    loadSoundPreference();

    console.log('✅ Coordinate Sequence - Ready!');
});

/**
 * Inicializa el juego
 */
function initGame() {
    createBoard();
    updateUI();
    console.log('🎮 Game initialized');
}

/**
 * Crea el tablero de ajedrez 8x8
 */
function createBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const rank = ranks[rankIndex];
            const file = files[fileIndex];
            const square = document.createElement('div');
            const squareId = `${file}${rank}`;

            square.className = 'square';
            square.dataset.square = squareId;

            // Alternar colores
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            square.classList.add(isLight ? 'light' : 'dark');

            // Agregar coordenadas en el borde (igual que Memory Matrix)
            // Fila inferior (rank 1): mostrar letras (a-h)
            if (rank === '1') {
                const coordFile = document.createElement('span');
                coordFile.className = 'coord-file';
                coordFile.textContent = file;
                square.appendChild(coordFile);
            }

            // Columna izquierda (file a): mostrar números (8-1)
            if (file === 'a') {
                const coordRank = document.createElement('span');
                coordRank.className = 'coord-rank';
                coordRank.textContent = rank;
                square.appendChild(coordRank);
            }

            chessboard.appendChild(square);
        }
    }

    console.log('♟️ Board created with 64 squares');
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
    // Botón HOME
    const btnHome = document.getElementById('btnHome');
    if (btnHome) {
        btnHome.addEventListener('click', goHome);
    }

    // Botón COMENZAR
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
        btnStart.addEventListener('click', startGame);
    }

    // Botón SOUND
    const btnSound = document.getElementById('btnSound');
    if (btnSound) {
        btnSound.addEventListener('click', toggleSound);
    }

    // Botones de overlays
    document.getElementById('btnNextLevel')?.addEventListener('click', nextLevel);
    document.getElementById('btnRetry')?.addEventListener('click', retryLevel);
    document.getElementById('btnRestart')?.addEventListener('click', restartGame);
    document.getElementById('btnHome2')?.addEventListener('click', goHome);

    // Clicks en el tablero
    const chessboard = document.getElementById('chessboard');
    chessboard.addEventListener('click', handleSquareClick);

    console.log('🎯 Event listeners configured');
}

// ============================================
// FLUJO DEL JUEGO
// ============================================

/**
 * Inicia el juego desde nivel 1
 */
function startGame() {
    console.log('🎮 Starting game...');

    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.lives = gameState.maxLives;
    gameState.bestLevel = 1;
    gameState.totalAttempts = 0;
    gameState.perfectLevels = 0;
    gameState.masterSequence = []; // Resetear secuencia acumulativa

    hideAllOverlays();
    startLevel(1);
}

/**
 * Inicia un nivel específico
 */
function startLevel(levelNumber) {
    console.log(`📊 Starting level ${levelNumber}...`);

    gameState.currentLevel = levelNumber;
    gameState.currentLevelAttempts = 0;
    gameState.phase = 'idle';

    const config = window.CoordinateSequence.Levels.getLevelConfig(levelNumber);

    // ============================================
    // SECUENCIA ACUMULATIVA (SIMON SAYS STYLE)
    // ============================================
    // Nivel 1: Genera secuencia inicial
    // Niveles 2+: MANTIENE secuencia anterior y AGREGA UNA nueva casilla

    if (levelNumber === 1) {
        // Primer nivel: generar secuencia inicial
        gameState.masterSequence = window.CoordinateSequence.Levels.generateRandomSequence(config);
        console.log('   🎬 Primera secuencia generada');
    } else {
        // Niveles siguientes: AGREGAR solo UNA casilla nueva a la master sequence
        const newSquareArray = window.CoordinateSequence.Levels.generateRandomSequence(config);
        gameState.masterSequence.push(newSquareArray[0]); // Tomar SOLO la primera
        console.log('   ➕ Casilla agregada a secuencia acumulativa');
    }

    // La secuencia actual es una copia de la master sequence
    gameState.sequence = [...gameState.masterSequence];
    gameState.playerSequence = [];
    gameState.currentStep = 0;

    console.log(`   Sequence length: ${gameState.sequence.length} (config says ${config.sequenceLength})`);
    console.log(`   Restricted area: ${config.restrictedArea} (${config.areaConfig || 'full'})`);
    console.log(`   Sequence:`, gameState.sequence);
    console.log(`   Use colors: ${config.useColors}`);

    updateUI();
    updateStatus(`Nivel ${levelNumber} - ${config.name}`, 'info');

    // Pequeña pausa antes de mostrar la secuencia
    setTimeout(() => {
        showSequence();
    }, 1000);
}

/**
 * Muestra la secuencia al jugador (fase de memorización)
 */
async function showSequence() {
    console.log('👀 Showing sequence...');

    gameState.phase = 'showing';
    updateStatus('¡Memoriza la secuencia!', 'info');

    const config = window.CoordinateSequence.Levels.getLevelConfig(gameState.currentLevel);
    const { highlightDuration, pauseDuration } = config;

    // Deshabilitar clicks durante la visualización
    disableBoard();

    // Mostrar cada casilla de la secuencia
    for (let i = 0; i < gameState.sequence.length; i++) {
        const square = gameState.sequence[i];

        // Obtener color para esta posición (si useColors está activado)
        const color = config.useColors ?
            window.CoordinateSequence.Levels.getSequenceColor(i) :
            { name: 'cyan', hex: '#00ffff', shadowColor: 'rgba(0, 255, 255, 0.8)' };

        // Highlight la casilla con el color correspondiente
        await highlightSquare(square, highlightDuration, color);

        // Reproducir sonido (frecuencia aumenta ligeramente)
        if (gameState.soundEnabled && typeof playBeep === 'function') {
            playBeep(440 + i * 50);
        }

        // Pausa entre casillas (excepto la última)
        if (i < gameState.sequence.length - 1) {
            await sleep(pauseDuration);
        }
    }

    // Secuencia mostrada, ahora el jugador debe repetirla
    console.log('✅ Sequence shown');
    gameState.phase = 'playing';
    enableBoard();
    updateStatus('¡Ahora repite la secuencia!', 'playing');
}

/**
 * Ilumina una casilla por un tiempo determinado con un color específico
 * @param {string} squareId - ID de la casilla (ej: "e4")
 * @param {number} duration - Duración del highlight en ms
 * @param {Object} color - Objeto con hex y shadowColor
 */
function highlightSquare(squareId, duration, color = null) {
    return new Promise(resolve => {
        const squareElement = document.querySelector(`[data-square="${squareId}"]`);
        if (!squareElement) {
            console.warn(`Square ${squareId} not found`);
            resolve();
            return;
        }

        // Aplicar color personalizado si se proporciona
        if (color) {
            squareElement.style.setProperty('--highlight-color', color.hex);
            squareElement.style.setProperty('--highlight-shadow', color.shadowColor);
        }

        squareElement.classList.add('highlighting');

        setTimeout(() => {
            squareElement.classList.remove('highlighting');
            // Limpiar estilos inline
            if (color) {
                squareElement.style.removeProperty('--highlight-color');
                squareElement.style.removeProperty('--highlight-shadow');
            }
            resolve();
        }, duration);
    });
}

/**
 * Maneja el click en una casilla durante la fase de reproducción
 */
function handleSquareClick(e) {
    if (gameState.phase !== 'playing') {
        return; // No hacer nada si no estamos en fase de reproducción
    }

    const square = e.target.closest('.square');
    if (!square) return;

    const squareId = square.dataset.square;
    console.log(`🖱️ Player clicked: ${squareId}`);

    // Agregar a la secuencia del jugador
    gameState.playerSequence.push(squareId);

    // Validar si es correcto
    const expectedSquare = gameState.sequence[gameState.currentStep];
    const isCorrect = squareId === expectedSquare;

    if (isCorrect) {
        // ✅ Correcto
        console.log(`✅ Correct! (${gameState.currentStep + 1}/${gameState.sequence.length})`);

        square.classList.add('correct');
        setTimeout(() => square.classList.remove('correct'), 500);

        if (gameState.soundEnabled && typeof playCorrect === 'function') {
            playCorrect();
        }

        gameState.currentStep++;

        // ¿Completó toda la secuencia?
        if (gameState.currentStep === gameState.sequence.length) {
            onLevelComplete();
        }
    } else {
        // ❌ Incorrecto
        console.log(`❌ Incorrect! Expected ${expectedSquare}, got ${squareId}`);

        square.classList.add('incorrect');
        setTimeout(() => square.classList.remove('incorrect'), 500);

        if (gameState.soundEnabled && typeof playIncorrect === 'function') {
            playIncorrect();
        }

        onLevelFailed();
    }
}

/**
 * Nivel completado exitosamente
 */
function onLevelComplete() {
    console.log('🎉 Level complete!');

    gameState.phase = 'success';
    disableBoard();

    const isPerfect = gameState.currentLevelAttempts === 0;
    const points = window.CoordinateSequence.Levels.calculateLevelScore(gameState.currentLevel, isPerfect);
    gameState.score += points;

    if (isPerfect) {
        gameState.perfectLevels++;
    }

    gameState.totalAttempts++;

    // Actualizar best level
    if (gameState.currentLevel > gameState.bestLevel) {
        gameState.bestLevel = gameState.currentLevel;
    }

    updateUI();

    // Reproducir sonido de victoria
    if (gameState.soundEnabled && typeof playLevelComplete === 'function') {
        playLevelComplete();
    }

    // Lanzar confeti en vez de overlay disruptivo
    launchConfetti(30);

    // Avanzar al siguiente nivel después de un breve delay
    setTimeout(() => {
        nextLevel();
    }, 1500);
}

/**
 * Nivel fallado
 */
function onLevelFailed() {
    console.log('💔 Level failed');

    gameState.phase = 'fail';
    gameState.lives--;
    gameState.currentLevelAttempts++;
    disableBoard();

    updateUI();

    // ¿Game Over?
    if (gameState.lives === 0) {
        gameOver();
        return;
    }

    // Mostrar overlay de fallo
    showFailOverlay();
}

/**
 * Game Over
 */
function gameOver() {
    console.log('💀 Game Over');

    gameState.phase = 'gameover';

    if (gameState.soundEnabled && typeof playGameOver === 'function') {
        playGameOver();
    }

    updateUI();
    showGameOverOverlay();
}

/**
 * Siguiente nivel
 */
function nextLevel() {
    hideAllOverlays();
    startLevel(gameState.currentLevel + 1);
}

/**
 * Reintentar nivel actual
 */
function retryLevel() {
    hideAllOverlays();

    // Resetear estado del nivel (mantener lives)
    gameState.playerSequence = [];
    gameState.currentStep = 0;
    gameState.phase = 'idle';

    // Regenerar secuencia
    const config = window.CoordinateSequence.Levels.getLevelConfig(gameState.currentLevel);
    gameState.sequence = window.CoordinateSequence.Levels.generateRandomSequence(config.sequenceLength);

    updateUI();

    setTimeout(() => {
        showSequence();
    }, 500);
}

/**
 * Reiniciar juego completo
 */
function restartGame() {
    hideAllOverlays();
    startGame();
}

/**
 * Volver al inicio
 */
function goHome() {
    window.location.href = '../../index.html';
}

// ============================================
// UI Y VISUALES
// ============================================

/**
 * Actualiza todos los elementos de la UI
 */
function updateUI() {
    // Stats
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;
    document.getElementById('scoreDisplay').textContent = gameState.score;

    const config = window.CoordinateSequence.Levels.getLevelConfig(gameState.currentLevel);
    document.getElementById('sequenceDisplay').textContent = config.sequenceLength;

    // Vidas (corazones)
    const hearts = '❤️'.repeat(gameState.lives) + '🖤'.repeat(gameState.maxLives - gameState.lives);
    document.getElementById('livesDisplay').textContent = hearts;
}

/**
 * Actualiza el mensaje de estado
 */
function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;

    // Opcional: cambiar color según tipo
    statusElement.className = 'status-message';
    if (type === 'playing') {
        statusElement.style.borderColor = 'var(--neon-green)';
        statusElement.style.color = 'var(--neon-green)';
    } else if (type === 'error') {
        statusElement.style.borderColor = 'var(--neon-red)';
        statusElement.style.color = 'var(--neon-red)';
    } else {
        statusElement.style.borderColor = 'var(--neon-cyan)';
        statusElement.style.color = 'var(--neon-cyan)';
    }
}

/**
 * Deshabilita interacción con el tablero
 */
function disableBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(sq => {
        sq.classList.remove('clickable');
        sq.style.cursor = 'default';
    });
}

/**
 * Habilita interacción con el tablero
 */
function enableBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(sq => {
        sq.classList.add('clickable');
        sq.style.cursor = 'pointer';
    });
}

// ============================================
// OVERLAYS
// ============================================

/**
 * Muestra overlay de nivel completado
 */
function showSuccessOverlay(points) {
    const overlay = document.getElementById('successOverlay');
    document.getElementById('successLevel').textContent = gameState.currentLevel;
    document.getElementById('successPoints').textContent = `+${points}`;

    const config = window.CoordinateSequence.Levels.getLevelConfig(gameState.currentLevel);
    document.getElementById('successMessage').textContent = `${config.name} completado`;

    overlay.classList.remove('hidden');
}

/**
 * Muestra overlay de fallo
 */
function showFailOverlay() {
    const overlay = document.getElementById('failOverlay');

    const livesText = gameState.lives === 1 ? '1 intento' : `${gameState.lives} intentos`;
    document.getElementById('failMessage').textContent = `Te quedan ${livesText}`;

    // Mostrar secuencia correcta
    const sequenceText = gameState.sequence.join(' → ');
    document.getElementById('correctSequence').textContent = sequenceText;

    overlay.classList.remove('hidden');
}

/**
 * Muestra overlay de game over
 */
function showGameOverOverlay() {
    const overlay = document.getElementById('gameOverOverlay');
    document.getElementById('finalLevel').textContent = gameState.currentLevel;
    document.getElementById('finalScore').textContent = gameState.score;
    overlay.classList.remove('hidden');
}

/**
 * Oculta todos los overlays
 */
function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.classList.add('hidden');
    });
}

// ============================================
// AUDIO
// ============================================

/**
 * Toggle sonido on/off
 */
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;

    const iconOn = document.querySelector('.icon-sound-on');
    const iconOff = document.querySelector('.icon-sound-off');

    if (gameState.soundEnabled) {
        iconOn.style.display = 'block';
        iconOff.style.display = 'none';
        console.log('🔊 Sound enabled');
    } else {
        iconOn.style.display = 'none';
        iconOff.style.display = 'block';
        console.log('🔇 Sound disabled');
    }

    saveSoundPreference();
}

/**
 * Guarda preferencia de sonido
 */
function saveSoundPreference() {
    localStorage.setItem('coordinate_sequence_sound', gameState.soundEnabled ? 'enabled' : 'disabled');
}

/**
 * Carga preferencia de sonido
 */
function loadSoundPreference() {
    const saved = localStorage.getItem('coordinate_sequence_sound');
    if (saved === 'disabled') {
        gameState.soundEnabled = false;
        document.querySelector('.icon-sound-on').style.display = 'none';
        document.querySelector('.icon-sound-off').style.display = 'block';
    }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Promesa de sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene coordenada de índice
 */
function getSquareFromIndex(index) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const file = files[index % 8];
    const rank = ranks[Math.floor(index / 8)];

    return `${file}${rank}`;
}

/**
 * Lanza confeti para celebración sutil (no disruptiva)
 * @param {number} count - Cantidad de confetis a lanzar
 */
function launchConfetti(count = 30) {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const colors = ['cyan', 'pink', 'orange', 'gold', ''];
    const windowWidth = window.innerWidth;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Color aleatorio
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        if (colorClass) {
            confetti.classList.add(colorClass);
        }

        // Posición y timing aleatorio
        confetti.style.left = `${Math.random() * windowWidth}px`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.animationDuration = `${1.5 + Math.random()}s`;

        container.appendChild(confetti);

        // Auto-limpieza después de 3 segundos
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

console.log('🎮 Coordinate Sequence - Game logic loaded');
