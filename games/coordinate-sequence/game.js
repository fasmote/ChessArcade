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
    lives: 5,
    maxLives: 5,

    // Secuencia MASTER acumulativa (Simon Says style)
    masterSequence: [],     // Secuencia acumulativa que crece cada nivel
    sequenceColors: [],     // Colores de cada casilla (mismo índice que masterSequence)
    squareUsageCount: {},   // Contador de apariciones: { 'e4': 2, 'd5': 1, ... }
    sequence: [],           // ['e4', 'd5', 'f3'] - copia de masterSequence para el nivel actual
    playerSequence: [],     // Lo que el jugador clickeó
    currentStep: 0,         // Índice actual en reproducción

    // Fases del juego
    phase: 'idle',          // 'idle' | 'showing' | 'playing' | 'success' | 'fail' | 'gameover'

    // Config
    soundEnabled: true,
    coordinatesEnabled: false,  // Mostrar coordenadas dentro de casillas (modo ayuda)

    // Stats
    bestLevel: 1,
    totalAttempts: 0,
    perfectLevels: 0,
    currentLevelAttempts: 0,

    // ============================================
    // SISTEMA DE PUNTUACIÓN MEJORADO
    // ============================================

    // Timing del nivel (para speed bonus)
    levelStartTime: 0,      // Timestamp cuando empieza la fase de input
    levelEndTime: 0,        // Timestamp cuando completa el nivel

    // Perfect Streak (rachas sin errores)
    perfectStreak: 0,       // Contador de niveles perfectos consecutivos

    // High Scores (persistente en localStorage)
    highScores: {
        topScore: 0,
        bestLevel: 1,
        longestStreak: 0,
        fastestLevel: { level: 1, time: 999999 },
        lastUpdated: null
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧠 Coordinate Sequence - Initializing...');

    initGame();
    setupEventListeners();
    loadSoundPreference();
    loadCoordinatesPreference();

    console.log('✅ Coordinate Sequence - Ready!');
});

/**
 * Inicializa el juego
 */
function initGame() {
    createBoard();

    // Cargar high scores desde localStorage
    gameState.highScores = loadHighScores();
    console.log('💾 High scores loaded:', gameState.highScores);

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

    // Botón PLAY OVERLAY (central en tablero)
    const btnPlayOverlay = document.getElementById('btnPlayOverlay');
    if (btnPlayOverlay) {
        btnPlayOverlay.addEventListener('click', startGame);
    }

    // Botón COORDINATES
    const btnCoordinates = document.getElementById('btnCoordinates');
    if (btnCoordinates) {
        btnCoordinates.addEventListener('click', toggleCoordinates);
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
    document.getElementById('btnRestartGame')?.addEventListener('click', backToMainScreen); // Volver a pantalla principal SIN empezar juego

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
    gameState.sequenceColors = []; // Resetear colores
    gameState.squareUsageCount = {}; // Resetear contador de uso

    hideAllOverlays();
    hidePlayButton(); // Ocultar botón play central
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

        // Inicializar contador de uso para cada casilla de la secuencia inicial
        for (const square of gameState.masterSequence) {
            gameState.squareUsageCount[square] = (gameState.squareUsageCount[square] || 0) + 1;
        }

        // Generar colores para cada casilla de la secuencia inicial
        gameState.sequenceColors = [];
        for (let i = 0; i < gameState.masterSequence.length; i++) {
            const color = config.useColors ?
                window.CoordinateSequence.Levels.getSequenceColor(i) :
                { name: 'cyan', hex: '#00ffff', shadowColor: 'rgba(0, 255, 255, 0.8)' };
            gameState.sequenceColors.push(color);
        }

        console.log('   🎬 Primera secuencia generada');
    } else {
        // Niveles siguientes: AGREGAR solo UNA casilla nueva a la master sequence
        // PATRÓN DE MOVIMIENTOS: Rey o Caballo desde la última casilla
        const lastSquare = gameState.masterSequence[gameState.masterSequence.length - 1];

        // Obtener casillas alcanzables desde la última (movimientos de rey + caballo)
        const possibleMoves = window.ChessGameLibrary.BoardUtils.getKingOrKnightMoves(lastSquare);

        // Filtrar solo las que están en el área permitida del nivel
        let availableSquares = [];
        switch (config.restrictedArea) {
            case 'ring':
                const ringSquares = window.ChessGameLibrary.BoardUtils.getRingSquares(config.areaConfig);
                availableSquares = possibleMoves.filter(sq => ringSquares.includes(sq));
                break;
            case 'quadrant':
                const quadrantSquares = window.ChessGameLibrary.BoardUtils.getQuadrantSquares(config.areaConfig);
                availableSquares = possibleMoves.filter(sq => quadrantSquares.includes(sq));
                break;
            case 'rows':
                const rowSquares = window.ChessGameLibrary.BoardUtils.getRowRangeSquares(
                    config.areaConfig.start,
                    config.areaConfig.end
                );
                availableSquares = possibleMoves.filter(sq => rowSquares.includes(sq));
                break;
            case 'full':
            default:
                availableSquares = possibleMoves;
                break;
        }

        // FILTRAR casillas que ya se usaron 2 o más veces
        availableSquares = availableSquares.filter(sq => {
            const usageCount = gameState.squareUsageCount[sq] || 0;
            return usageCount < 2;
        });

        console.log(`   📊 Casillas disponibles después de filtrar saturadas: ${availableSquares.length}`);

        // Si no hay movimientos válidos en el área, EXPANDIR búsqueda a toda el área
        if (availableSquares.length === 0) {
            console.warn(`   ⚠️ No hay movimientos válidos desde ${lastSquare} en área restringida`);

            // En vez de fallback aleatorio, buscar movimientos en TODA el área
            let allAreaSquares = [];
            switch (config.restrictedArea) {
                case 'ring':
                    allAreaSquares = window.ChessGameLibrary.BoardUtils.getRingSquares(config.areaConfig);
                    break;
                case 'quadrant':
                    allAreaSquares = window.ChessGameLibrary.BoardUtils.getQuadrantSquares(config.areaConfig);
                    break;
                case 'rows':
                    allAreaSquares = window.ChessGameLibrary.BoardUtils.getRowRangeSquares(
                        config.areaConfig.start,
                        config.areaConfig.end
                    );
                    break;
                case 'full':
                default:
                    allAreaSquares = window.ChessGameLibrary.BoardUtils.getAllSquares();
                    break;
            }

            // Buscar casillas del área que SÍ sean alcanzables por rey/caballo desde ALGUNA casilla anterior
            for (let i = gameState.masterSequence.length - 1; i >= 0; i--) {
                const previousSquare = gameState.masterSequence[i];
                const movesFromPrevious = window.ChessGameLibrary.BoardUtils.getKingOrKnightMoves(previousSquare);
                let validFromPrevious = allAreaSquares.filter(sq => movesFromPrevious.includes(sq));

                // FILTRAR casillas saturadas también en backtracking
                validFromPrevious = validFromPrevious.filter(sq => {
                    const usageCount = gameState.squareUsageCount[sq] || 0;
                    return usageCount < 2;
                });

                if (validFromPrevious.length > 0) {
                    availableSquares = validFromPrevious;
                    console.log(`   ✅ Usando movimiento desde ${previousSquare} (${i+1} casillas atrás)`);
                    break;
                }
            }

            // Último recurso: si NINGUNA casilla anterior tiene movimientos válidos, usar aleatorio
            if (availableSquares.length === 0) {
                console.warn(`   ⚠️ FALLBACK EXTREMO: usando casilla aleatoria del área`);
                availableSquares = allAreaSquares;
            }
        }

        // Elegir casilla aleatoria de las disponibles
        const newSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];

        gameState.masterSequence.push(newSquare);

        // Incrementar contador de uso de la nueva casilla
        gameState.squareUsageCount[newSquare] = (gameState.squareUsageCount[newSquare] || 0) + 1;

        // Agregar color para la nueva casilla (siguiente en la secuencia de colores)
        const newColorIndex = gameState.sequenceColors.length;
        const newColor = config.useColors ?
            window.CoordinateSequence.Levels.getSequenceColor(newColorIndex) :
            { name: 'cyan', hex: '#00ffff', shadowColor: 'rgba(0, 255, 255, 0.8)' };
        gameState.sequenceColors.push(newColor);

        console.log(`   ➕ Casilla agregada: ${newSquare} (desde ${lastSquare} con movimiento rey/caballo) - Color: ${newColor.name}`);
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

        // Usar el color guardado para esta casilla
        const color = gameState.sequenceColors[i];

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

    // Capturar timestamp de inicio para speed bonus
    gameState.levelStartTime = Date.now();

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

        // Si las coordenadas están habilitadas, asegurarse de que el label esté visible
        if (gameState.coordinatesEnabled && !squareElement.querySelector('.coordinate-label')) {
            const label = document.createElement('span');
            label.className = 'coordinate-label';
            label.textContent = squareId.toUpperCase();
            squareElement.appendChild(label);
        }

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

        // Mostrar con el MISMO COLOR que se usó en la secuencia original
        const color = gameState.sequenceColors[gameState.currentStep];
        highlightSquare(squareId, 500, color);

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

    // Capturar timestamp de finalización
    gameState.levelEndTime = Date.now();
    const timeElapsed = gameState.levelEndTime - gameState.levelStartTime;
    console.log(`⏱️ Level completed in ${(timeElapsed / 1000).toFixed(2)}s`);

    const isPerfect = gameState.currentLevelAttempts === 0;

    // Calcular puntos base
    let points = window.CoordinateSequence.Levels.calculateLevelScore(gameState.currentLevel, isPerfect);

    // Calcular speed bonus
    const speedBonus = calculateSpeedBonus(timeElapsed, gameState.currentLevel);
    if (speedBonus > 0) {
        console.log(`⚡ Speed Bonus: +${speedBonus} pts`);
    }

    // Actualizar perfect streak
    if (isPerfect) {
        gameState.perfectStreak++;
        gameState.perfectLevels++;
    } else {
        gameState.perfectStreak = 0; // Resetear racha
    }

    // Calcular multiplicador de racha
    const streakMultiplier = calculateStreakMultiplier(gameState.perfectStreak);
    if (streakMultiplier > 1.0) {
        console.log(`🔥 Perfect Streak x${gameState.perfectStreak} = Multiplier x${streakMultiplier}`);
    }

    // Calcular puntos finales
    const basePoints = points + speedBonus;
    const finalPoints = Math.round(basePoints * streakMultiplier);

    console.log(`💰 Base: ${points} + Speed: ${speedBonus} = ${basePoints} × ${streakMultiplier} = ${finalPoints} pts`);

    gameState.score += finalPoints;
    gameState.totalAttempts++;

    // Actualizar best level
    if (gameState.currentLevel > gameState.bestLevel) {
        gameState.bestLevel = gameState.currentLevel;
    }

    // Actualizar high scores y verificar si rompió algún record
    const isNewRecord = updateHighScores(timeElapsed);
    if (isNewRecord) {
        console.log('🎊 ¡NUEVO RECORD!');
        // TODO: Aquí se podría mostrar un confeti especial dorado
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
    gameState.perfectStreak = 0; // Resetear racha perfecta
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

    // IMPORTANTE: Deshabilitar tablero inmediatamente para evitar clicks prematuros
    disableBoard();

    // Resetear estado del nivel (mantener lives)
    gameState.playerSequence = [];
    gameState.currentStep = 0;
    gameState.phase = 'idle';

    // NO regenerar secuencia, usar la misma masterSequence acumulativa
    // La secuencia ya está en gameState.sequence (copia de masterSequence)
    console.log(`🔄 Retrying level ${gameState.currentLevel} with same sequence:`, gameState.sequence);

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
 * Volver a pantalla principal de Master Sequence (SIN empezar juego)
 * Cierra overlay y muestra botón PLAY para que usuario decida qué hacer
 */
function backToMainScreen() {
    // Cerrar overlay de Game Over
    hideAllOverlays();

    // Resetear estado del juego
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.lives = 5;
    gameState.masterSequence = [];
    gameState.sequenceColors = [];
    gameState.squareUsageCount = {};
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.currentStep = 0;
    gameState.phase = 'idle';
    gameState.currentLevelAttempts = 0;
    gameState.perfectStreak = 0;

    // Actualizar UI con valores reseteados
    updateUI();

    // Mostrar botón PLAY central para que usuario decida cuándo empezar
    showPlayButton();

    // Mensaje de bienvenida
    updateStatus('Presiona COMENZAR para iniciar');

    console.log('🏠 Vuelto a pantalla principal de Master Sequence');
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
    document.getElementById('scoreDisplay').textContent = gameState.score;

    // Mostrar longitud REAL de la secuencia acumulativa (no el config)
    // Esto refleja cuántas casillas realmente tiene que recordar el jugador
    const actualLength = gameState.sequence.length || 0;
    document.getElementById('sequenceDisplay').textContent = actualLength;

    // Vidas (corazones)
    const hearts = '❤️'.repeat(gameState.lives) + '🖤'.repeat(gameState.maxLives - gameState.lives);
    document.getElementById('livesDisplay').textContent = hearts;

    // Perfect Streak (solo mostrar si hay racha >= 3)
    const streakStat = document.getElementById('streakStat');
    const streakDisplay = document.getElementById('streakDisplay');
    if (gameState.perfectStreak >= 3) {
        streakStat.style.display = 'flex';
        streakDisplay.textContent = `${gameState.perfectStreak}🔥`;
    } else {
        streakStat.style.display = 'none';
    }

    // Best Score
    document.getElementById('bestDisplay').textContent = gameState.highScores.topScore;
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

/**
 * Toggle de coordenadas (modo ayuda)
 */
function toggleCoordinates() {
    gameState.coordinatesEnabled = !gameState.coordinatesEnabled;

    const btnCoordinates = document.getElementById('btnCoordinates');
    const btnText = btnCoordinates.querySelector('.btn-text');

    if (gameState.coordinatesEnabled) {
        btnCoordinates.classList.add('active');
        btnText.textContent = 'HIDE COORDINATES';
        showAllCoordinates();
        console.log('📍 Coordinates enabled');
    } else {
        btnCoordinates.classList.remove('active');
        btnText.textContent = 'SHOW COORDINATES';
        hideAllCoordinates();
        console.log('📍 Coordinates disabled');
    }

    saveCoordinatesPreference();
}

/**
 * Muestra coordenadas en todas las casillas
 */
function showAllCoordinates() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        const squareId = square.dataset.square;
        if (!square.querySelector('.coordinate-label')) {
            const label = document.createElement('span');
            label.className = 'coordinate-label';
            label.textContent = squareId.toUpperCase();
            square.appendChild(label);
        }
    });
}

/**
 * Oculta todas las coordenadas
 */
function hideAllCoordinates() {
    const labels = document.querySelectorAll('.coordinate-label');
    labels.forEach(label => label.remove());
}

/**
 * Guarda preferencia de coordenadas
 */
function saveCoordinatesPreference() {
    localStorage.setItem('coordinate_sequence_coordinates', gameState.coordinatesEnabled ? 'enabled' : 'disabled');
}

/**
 * Carga preferencia de coordenadas
 */
function loadCoordinatesPreference() {
    const saved = localStorage.getItem('coordinate_sequence_coordinates');
    if (saved === 'enabled') {
        gameState.coordinatesEnabled = true;
        const btnCoordinates = document.getElementById('btnCoordinates');
        const btnText = btnCoordinates.querySelector('.btn-text');
        btnCoordinates.classList.add('active');
        btnText.textContent = 'HIDE COORDINATES';
        showAllCoordinates();
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

/**
 * Muestra el botón play central
 */
function showPlayButton() {
    const btnPlayOverlay = document.getElementById('btnPlayOverlay');
    if (btnPlayOverlay) {
        btnPlayOverlay.classList.remove('hidden');
    }
}

/**
 * Oculta el botón play central
 */
function hidePlayButton() {
    const btnPlayOverlay = document.getElementById('btnPlayOverlay');
    if (btnPlayOverlay) {
        btnPlayOverlay.classList.add('hidden');
    }
}

// ============================================
// SISTEMA DE PUNTUACIÓN MEJORADO
// ============================================

/**
 * Calcula el speed bonus basado en el tiempo transcurrido
 * @param {number} timeElapsed - Tiempo en milisegundos
 * @param {number} level - Número de nivel
 * @returns {number} Puntos de bonus
 */
function calculateSpeedBonus(timeElapsed, level) {
    const targetTime = window.CoordinateSequence.Levels.getRecommendedTime(level);

    if (timeElapsed < targetTime * 0.5) {
        return 100; // ⚡ Super rápido!
    } else if (timeElapsed < targetTime * 0.75) {
        return 50;  // 🏃 Rápido
    } else if (timeElapsed < targetTime) {
        return 25;  // ✅ Dentro del tiempo
    }

    return 0; // Sin bonus
}

/**
 * Calcula el multiplicador de racha perfecta
 * @param {number} streak - Cantidad de niveles perfectos consecutivos
 * @returns {number} Multiplicador (1.0, 1.5, 2.0, etc.)
 */
function calculateStreakMultiplier(streak) {
    if (streak >= 10) {
        return 3.0; // 🔥🔥🔥 ¡ÉPICO!
    } else if (streak >= 5) {
        return 2.0; // 🔥🔥 ¡Increíble!
    } else if (streak >= 3) {
        return 1.5; // 🔥 ¡Genial!
    }

    return 1.0; // Sin multiplicador
}

/**
 * Carga high scores desde localStorage
 * @returns {Object} High scores o valores por defecto
 */
function loadHighScores() {
    const saved = localStorage.getItem('masterSequence_highScores');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.warn('❌ Error loading high scores:', e);
            return getDefaultHighScores();
        }
    }
    return getDefaultHighScores();
}

/**
 * Retorna high scores por defecto
 * @returns {Object} Estructura de high scores
 */
function getDefaultHighScores() {
    return {
        topScore: 0,
        bestLevel: 1,
        longestStreak: 0,
        fastestLevel: { level: 1, time: 999999 },
        lastUpdated: null
    };
}

/**
 * Guarda high scores en localStorage
 */
function saveHighScores() {
    gameState.highScores.lastUpdated = Date.now();
    localStorage.setItem('masterSequence_highScores', JSON.stringify(gameState.highScores));
    console.log('💾 High scores saved');
}

/**
 * Actualiza high scores si se rompió algún record
 * @param {number} timeElapsed - Tiempo en ms del nivel actual
 * @returns {boolean} True si se rompió algún record
 */
function updateHighScores(timeElapsed) {
    let newRecord = false;

    // Top Score
    if (gameState.score > gameState.highScores.topScore) {
        gameState.highScores.topScore = gameState.score;
        console.log(`🏆 NEW TOP SCORE: ${gameState.score}!`);
        newRecord = true;
    }

    // Best Level
    if (gameState.currentLevel > gameState.highScores.bestLevel) {
        gameState.highScores.bestLevel = gameState.currentLevel;
        console.log(`🏆 NEW BEST LEVEL: ${gameState.currentLevel}!`);
        newRecord = true;
    }

    // Longest Streak
    if (gameState.perfectStreak > gameState.highScores.longestStreak) {
        gameState.highScores.longestStreak = gameState.perfectStreak;
        console.log(`🏆 NEW LONGEST STREAK: ${gameState.perfectStreak}!`);
        newRecord = true;
    }

    // Fastest Level
    if (timeElapsed < gameState.highScores.fastestLevel.time) {
        gameState.highScores.fastestLevel = {
            level: gameState.currentLevel,
            time: timeElapsed
        };
        console.log(`🏆 NEW FASTEST LEVEL: ${gameState.currentLevel} in ${(timeElapsed / 1000).toFixed(2)}s!`);
        newRecord = true;
    }

    if (newRecord) {
        saveHighScores();
    }

    return newRecord;
}

/**
 * Resetea high scores (para botón de reset en stats)
 */
function resetHighScores() {
    gameState.highScores = getDefaultHighScores();
    saveHighScores();
    console.log('🗑️ High scores reset');
}

console.log('🎮 Coordinate Sequence - Game logic loaded');
