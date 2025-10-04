/**
 * ============================================
 * MEMORY MATRIX - GAME LOGIC
 * ============================================
 * JavaScript del juego
 */

// ============================================
// ESTADO GLOBAL
// ============================================
let soundEnabled = true;
let currentPieceStyle = 'cburnett'; // Estilo actual de piezas

// Estado del juego (previene clicks múltiples)
let gameState = 'idle'; // Valores: 'idle', 'playing', 'memorizing', 'solving'
let isAnimating = false; // Flag para prevenir clicks durante animación

// PASO 7: Estado del nivel actual
let currentLevel = 1; // Nivel actual (1-8)
let currentAttempt = 1; // Intento actual dentro del nivel (1-10)
let successfulAttempts = 0; // Intentos exitosos en el nivel actual
let currentPosition = []; // Posición actual a memorizar
let placedPieces = []; // Piezas que el jugador ha colocado
let startTime = null; // Tiempo de inicio del intento

// ============================================
// INICIALIZACIÓN
// Esperar a que el DOM esté cargado
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Memory Matrix v2 iniciando...');

    // Inicializar botones
    initButtons();

    // Cargar preferencia de audio desde localStorage
    loadAudioPreference();

    // PASO 4: Cargar estilo de piezas preferido
    loadPieceStylePreference();

    // PASO 2: Crear tablero
    createBoard();

    // PASO 5: Crear banco de piezas
    createPieceBank();

    // PASO 6: Inicializar drag & drop
    initDragAndDrop();

    console.log('✅ Inicialización completa');
});

// ============================================
// INICIALIZAR BOTONES
// ============================================
function initButtons() {
    // Botón HOME
    const btnHome = document.getElementById('btnHome');
    if (btnHome) {
        btnHome.addEventListener('click', goHome);
    }

    // Botón SONIDO
    const btnSound = document.getElementById('btnSound');
    if (btnSound) {
        btnSound.addEventListener('click', toggleSound);
    }

    // PASO 4: Selector de estilo de piezas
    const pieceStyleSelect = document.getElementById('pieceStyleSelect');
    if (pieceStyleSelect) {
        pieceStyleSelect.addEventListener('change', onPieceStyleChange);
    }

    // Botón COMENZAR
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
        btnStart.addEventListener('click', startGame);
    }
}

// ============================================
// FUNCIÓN: Volver a HOME
// ============================================
function goHome() {
    console.log('🏠 Volviendo a ChessArcade...');

    // Ruta relativa al index principal de ChessArcade
    // Ajustar según estructura de carpetas
    window.location.href = '../../index.html';
}

// ============================================
// FUNCIÓN: Toggle Sonido
// ============================================
function toggleSound() {
    soundEnabled = !soundEnabled;

    console.log(soundEnabled ? '🔊 Audio activado' : '🔇 Audio desactivado');

    // Actualizar iconos
    updateSoundIcon();

    // Guardar preferencia en localStorage
    saveAudioPreference();
}

// ============================================
// FUNCIÓN: Actualizar icono de sonido
// ============================================
function updateSoundIcon() {
    const iconOn = document.querySelector('.icon-sound-on');
    const iconOff = document.querySelector('.icon-sound-off');

    if (soundEnabled) {
        iconOn.style.display = 'block';
        iconOff.style.display = 'none';
    } else {
        iconOn.style.display = 'none';
        iconOff.style.display = 'block';
    }
}

// ============================================
// FUNCIÓN: Guardar preferencia de audio
// ============================================
function saveAudioPreference() {
    localStorage.setItem('memory_matrix_sound', soundEnabled ? 'on' : 'off');
}

// ============================================
// FUNCIÓN: Cargar preferencia de audio
// ============================================
function loadAudioPreference() {
    const saved = localStorage.getItem('memory_matrix_sound');

    if (saved === 'off') {
        soundEnabled = false;
    }

    updateSoundIcon();
}

// ============================================
// PASO 4: SELECTOR DE ESTILO DE PIEZAS
// ============================================

/**
 * Cargar estilo de piezas guardado en localStorage
 * Se ejecuta al iniciar el juego
 */
function loadPieceStylePreference() {
    // Intentar cargar estilo guardado
    const saved = localStorage.getItem('memory_matrix_piece_style');

    // Si hay un estilo guardado, usarlo
    if (saved) {
        currentPieceStyle = saved;
    }

    // Actualizar select para reflejar el estilo actual
    const selectElement = document.getElementById('pieceStyleSelect');
    if (selectElement) {
        selectElement.value = currentPieceStyle;
    }

    console.log(`🎨 Estilo de piezas cargado: ${currentPieceStyle}`);
}

/**
 * Handler cuando el usuario cambia el estilo en el select
 * @param {Event} event - Evento change del select
 */
function onPieceStyleChange(event) {
    const newStyle = event.target.value;

    console.log(`🎨 Cambiando estilo de piezas a: ${newStyle}`);

    // Actualizar variable global
    currentPieceStyle = newStyle;

    // Guardar preferencia en localStorage
    localStorage.setItem('memory_matrix_piece_style', newStyle);

    // Re-renderizar todas las piezas existentes en el tablero
    refreshAllPieces();

    // PASO 5: También actualizar banco de piezas
    refreshBankPieces();

    // Feedback visual
    updateStatus(`Estilo de piezas cambiado a: ${getStyleDisplayName(newStyle)}`);
}

/**
 * Re-renderizar todas las piezas en el tablero con el nuevo estilo
 * Busca todas las piezas actuales y las redibuja
 */
function refreshAllPieces() {
    // Obtener todas las piezas actualmente en el tablero
    const pieceElements = document.querySelectorAll('.piece');

    // Para cada pieza, obtener su código y casilla, luego redibujarla
    pieceElements.forEach(pieceImg => {
        // Obtener código de pieza (ej: 'wK', 'bP')
        const pieceCode = pieceImg.dataset.piece;

        // Obtener casilla padre
        const square = pieceImg.closest('.square');
        if (square && pieceCode) {
            // Obtener coordenada de la casilla (ej: 'e4')
            const squareName = square.dataset.square;

            // Redibujar pieza con nuevo estilo
            showPiece(squareName, pieceCode);
        }
    });

    console.log(`🔄 ${pieceElements.length} piezas actualizadas con estilo ${currentPieceStyle}`);
}

/**
 * Obtener nombre legible del estilo
 * @param {string} style - Código del estilo
 * @returns {string} Nombre para mostrar
 */
function getStyleDisplayName(style) {
    const names = {
        'cburnett': 'Lichess',
        'merida': 'Chess.com',
        'cardinal': 'Cardinal'
    };
    return names[style] || style;
}

// ============================================
// PASO 7: FLUJO COMPLETO DEL JUEGO
// ============================================

/**
 * Inicia el juego con el nivel actual
 */
function startGame() {
    // PREVENIR CLICKS MÚLTIPLES
    if (isAnimating || gameState === 'playing') {
        console.warn('⚠️ Ya hay un juego en curso');
        updateStatus('Espera a que termine la animación...');
        return;
    }

    const levelConfig = window.MemoryMatrixLevels.getLevelConfig(currentLevel);

    console.log(`🚀 Nivel ${currentLevel} - Intento ${currentAttempt}/${levelConfig.attemptsRequired}`);
    console.log(`📊 Progreso: ${successfulAttempts}/${levelConfig.attemptsRequired} exitosos`);

    // Cambiar estado
    gameState = 'memorizing';
    isAnimating = true;
    startTime = Date.now();

    // Deshabilitar botón
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
        btnStart.classList.add('disabled');
        btnStart.style.opacity = '0.5';
        btnStart.style.cursor = 'not-allowed';
        btnStart.textContent = 'Jugando...';
    }

    // Limpiar tablero y banco
    clearBoard();
    clearBankPieces();
    placedPieces = [];

    // Generar posición aleatoria para el nivel actual
    if (!window.MemoryMatrixLevels) {
        console.error('❌ Sistema de niveles no cargado');
        return;
    }

    currentPosition = window.MemoryMatrixLevels.generateRandomPosition(currentLevel);

    console.log(`👁️ Memoriza ${levelConfig.pieceCount} piezas en ${levelConfig.memorizationTime/1000}s`);

    // Mostrar posición a memorizar
    showMemorizationPhase(levelConfig);
}

/**
 * Fase 1: Mostrar posición para memorizar
 */
function showMemorizationPhase(levelConfig) {
    console.log('👁️ FASE 1: Memorización');

    updateStatus(`Nivel ${currentLevel} (${successfulAttempts}/${levelConfig.attemptsRequired}) - Intento ${currentAttempt} - ¡Memoriza!`);

    // Colocar todas las piezas en el tablero
    currentPosition.forEach(({ square, piece }) => {
        showPiece(square, piece);
    });

    console.log(`⏰ Tienes ${levelConfig.memorizationTime/1000} segundos para memorizar`);

    // Después del tiempo de memorización, ocultar piezas
    setTimeout(() => {
        hidePiecesPhase(levelConfig);
    }, levelConfig.memorizationTime);
}

/**
 * Fase 2: Ocultar piezas (vuelan al banco)
 * Solo oculta las piezas indicadas según el intento actual
 */
function hidePiecesPhase(levelConfig) {
    console.log('✈️ FASE 2: Ocultando piezas');

    const { hidePiecesWithAnimation } = window.ChessGameLibrary.PieceAnimations;

    // Determinar qué piezas ocultar según el intento
    const piecesToHide = window.MemoryMatrixLevels.getPiecesToHide(
        currentLevel,
        currentAttempt,
        currentPosition
    );

    const hideCount = piecesToHide.length;
    const totalCount = currentPosition.length;
    const remainingPieces = totalCount - hideCount;

    if (remainingPieces > 0) {
        updateStatus(`¡${hideCount} pieza${hideCount > 1 ? 's' : ''} al banco! ${remainingPieces} pieza${remainingPieces > 1 ? 's quedan' : ' queda'} de referencia`);
    } else {
        updateStatus('¡Todas las piezas al banco! Reconstruye la posición...');
    }

    // Obtener casillas de las piezas a ocultar
    const squares = piecesToHide.map(pos => pos.square);

    // Animar piezas al banco
    hidePiecesWithAnimation(squares, {
        stagger: 150,
        duration: 600,
        onComplete: () => {
            startSolvingPhase(piecesToHide);
        }
    });
}

/**
 * Fase 3: Jugador reconstruye la posición
 * @param {Array} piecesToPlace - Piezas que debe colocar el jugador
 */
function startSolvingPhase(piecesToPlace) {
    console.log('🎮 FASE 3: Reconstrucción');

    gameState = 'solving';
    isAnimating = false;

    const pieceCount = piecesToPlace.length;
    updateStatus(`Arrastra ${pieceCount > 1 ? `las ${pieceCount} piezas` : 'la pieza'} del banco al tablero`);

    console.log('✅ Listo para drag & drop');
}

/**
 * Valida si la posición del jugador es correcta
 * Solo valida las piezas que fueron ocultadas
 */
function validatePosition() {
    console.log('🔍 Validando posición...');

    // Obtener piezas que fueron ocultadas (las que el jugador debía colocar)
    const piecesToValidate = window.MemoryMatrixLevels.getPiecesToHide(
        currentLevel,
        currentAttempt,
        currentPosition
    );

    if (placedPieces.length !== piecesToValidate.length) {
        console.log(`⚠️ Faltan piezas: ${placedPieces.length}/${piecesToValidate.length}`);
        return false;
    }

    // Convertir a Maps para comparar
    const correctMap = new Map(piecesToValidate.map(p => [p.square, p.piece]));
    const playerMap = new Map(placedPieces.map(p => [p.square, p.piece]));

    let correctCount = 0;
    const incorrectPieces = [];

    for (const [square, piece] of correctMap) {
        if (playerMap.get(square) === piece) {
            correctCount++;
        } else {
            incorrectPieces.push({
                square,
                expected: piece,
                actual: playerMap.get(square) || 'vacío'
            });
        }
    }

    const isComplete = correctCount === piecesToValidate.length;

    console.log(`✓ ${correctCount}/${piecesToValidate.length} piezas correctas`);

    if (isComplete) {
        onAttemptSuccess();
    } else {
        onAttemptFailed(incorrectPieces);
    }

    return isComplete;
}

/**
 * Intento exitoso
 */
function onAttemptSuccess() {
    console.log('✅ ¡Intento correcto!');

    successfulAttempts++;
    gameState = 'completed';

    const levelConfig = window.MemoryMatrixLevels.getLevelConfig(currentLevel);

    updateStatus(`✅ ¡Correcto! (${successfulAttempts}/${levelConfig.attemptsRequired})`);

    setTimeout(() => {
        if (successfulAttempts >= levelConfig.attemptsRequired) {
            // Nivel completado
            onLevelComplete();
        } else {
            // Siguiente intento en el mismo nivel
            currentAttempt++;
            updateStatus(`¡Bien! Presiona COMENZAR para el intento ${currentAttempt}`);

            const btnStart = document.getElementById('btnStart');
            if (btnStart) {
                btnStart.classList.remove('disabled');
                btnStart.style.opacity = '1';
                btnStart.style.cursor = 'pointer';
                btnStart.textContent = 'Siguiente Intento';
            }

            gameState = 'idle';
        }
    }, 1500);
}

/**
 * Intento fallido
 */
function onAttemptFailed(incorrectPieces) {
    console.log('❌ Intento incorrecto');

    gameState = 'failed';

    // Mostrar qué está mal
    incorrectPieces.forEach(({ square, expected, actual }) => {
        const expectedName = getPieceName(expected);
        console.log(`❌ ${square}: esperaba ${expectedName}, colocaste ${actual !== 'vacío' ? getPieceName(actual) : 'vacío'}`);
    });

    const levelConfig = window.MemoryMatrixLevels.getLevelConfig(currentLevel);

    updateStatus(`❌ Incorrecto. Intenta de nuevo (${successfulAttempts}/${levelConfig.attemptsRequired} correctos)`);

    setTimeout(() => {
        // Siguiente intento (no se incrementa successfulAttempts)
        currentAttempt++;
        updateStatus(`Intenta de nuevo. Presiona COMENZAR`);

        const btnStart = document.getElementById('btnStart');
        if (btnStart) {
            btnStart.classList.remove('disabled');
            btnStart.style.opacity = '1';
            btnStart.style.cursor = 'pointer';
            btnStart.textContent = 'Intentar de Nuevo';
        }

        gameState = 'idle';
    }, 2500);
}

/**
 * Nivel completado - avanza al siguiente
 */
function onLevelComplete() {
    console.log('🎉 ¡NIVEL COMPLETADO!');

    gameState = 'completed';

    const levelConfig = window.MemoryMatrixLevels.getLevelConfig(currentLevel);

    updateStatus(`🎉 ¡Nivel ${currentLevel}: ${levelConfig.name} COMPLETADO!`);

    // Reset para el siguiente nivel
    setTimeout(() => {
        currentLevel++;
        currentAttempt = 1;
        successfulAttempts = 0;

        const totalLevels = window.MemoryMatrixLevels.getTotalLevels();

        if (currentLevel > totalLevels) {
            // Juego completado
            updateStatus('🏆 ¡FELICIDADES! Completaste todos los niveles');
            currentLevel = 1; // Volver al nivel 1
            currentAttempt = 1;
            successfulAttempts = 0;
        } else {
            const nextLevel = window.MemoryMatrixLevels.getLevelConfig(currentLevel);
            updateStatus(`Siguiente: Nivel ${currentLevel} - ${nextLevel.name}. Presiona COMENZAR`);
        }

        // Re-habilitar botón
        const btnStart = document.getElementById('btnStart');
        if (btnStart) {
            btnStart.classList.remove('disabled');
            btnStart.style.opacity = '1';
            btnStart.style.cursor = 'pointer';
            btnStart.textContent = currentLevel <= totalLevels ? 'Siguiente Nivel' : 'Comenzar';
        }

        gameState = 'idle';
    }, 3000);
}

/**
 * Limpiar todas las piezas del banco
 */
function clearBankPieces() {
    const bankPieces = document.querySelectorAll('.bank-piece-slot .piece');
    bankPieces.forEach(piece => piece.remove());
    console.log('🗑️ Banco limpiado');
}

// ============================================
// FUNCIÓN: Actualizar mensaje de estado
// ============================================
function updateStatus(message) {
    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.textContent = message;
        console.log(`📢 Status: ${message}`);
    }
}

// ============================================
// PASO 2: CREAR TABLERO DE AJEDREZ
// ============================================

/**
 * Crear tablero 8x8 con coordenadas
 *
 * ESTRUCTURA:
 * - 64 casillas (8 filas x 8 columnas)
 * - Colores alternados: beige (light) y marrón (dark)
 * - Coordenadas: a-h (columnas), 1-8 (filas)
 *
 * NOTACIÓN ALGEBRAICA:
 * - Columnas: a, b, c, d, e, f, g, h (izquierda → derecha)
 * - Filas: 8, 7, 6, 5, 4, 3, 2, 1 (arriba → abajo)
 * - Ejemplo: a8 = esquina superior izquierda
 */
function createBoard() {
    console.log('🏗️ Creando tablero 8x8...');

    const boardElement = document.getElementById('chessboard');
    if (!boardElement) {
        console.error('❌ Elemento #chessboard no encontrado');
        return;
    }

    // Limpiar tablero si ya existe
    boardElement.innerHTML = '';

    // Arrays de coordenadas
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // Columnas
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1]; // Filas (de arriba a abajo)

    // ==========================================
    // CREAR 64 CASILLAS
    // ==========================================
    // Recorrer fila por fila (rank), columna por columna (file)
    ranks.forEach((rank, rankIndex) => {
        files.forEach((file, fileIndex) => {

            // ==========================================
            // 1. CREAR ELEMENTO DE CASILLA
            // ==========================================
            const square = document.createElement('div');
            square.className = 'square';

            // ==========================================
            // 2. DETERMINAR COLOR (light o dark)
            // ==========================================
            // Patrón de ajedrez: alternar según suma de índices
            // Si suma es par → light, si es impar → dark
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            square.classList.add(isLight ? 'light' : 'dark');

            // ==========================================
            // 3. GUARDAR COORDENADA EN data-attribute
            // ==========================================
            // Notación algebraica: file + rank (ej: 'e4', 'a8')
            const squareName = file + rank;
            square.dataset.square = squareName;

            // ==========================================
            // 4. AGREGAR COORDENADAS VISUALES
            // ==========================================

            // Coordenada horizontal (a-h) en fila 1
            if (rank === 1) {
                const coordFile = document.createElement('span');
                coordFile.className = 'coord-file';
                coordFile.textContent = file;
                square.appendChild(coordFile);
            }

            // Coordenada vertical (1-8) en columna 'a'
            if (file === 'a') {
                const coordRank = document.createElement('span');
                coordRank.className = 'coord-rank';
                coordRank.textContent = rank;
                square.appendChild(coordRank);
            }

            // ==========================================
            // 5. AGREGAR CASILLA AL TABLERO
            // ==========================================
            boardElement.appendChild(square);
        });
    });

    console.log('✅ Tablero creado: 64 casillas con coordenadas');
}

/**
 * Obtener elemento de casilla por coordenada
 * @param {string} square - Coordenada algebraica (ej: 'e4', 'a1')
 * @returns {HTMLElement|null}
 */
function getSquareElement(square) {
    return document.querySelector(`[data-square="${square}"]`);
}

// ============================================
// PASO 3: PIEZAS DE AJEDREZ
// ============================================

/**
 * CDN de Lichess para piezas SVG
 * Base URL - se concatena con el estilo y código de pieza
 *
 * CÓDIGOS DE PIEZAS:
 * - Blancas: wK (rey), wQ (dama), wR (torre), wB (alfil), wN (caballo), wP (peón)
 * - Negras: bK, bQ, bR, bB, bN, bP
 *
 * ESTILOS DISPONIBLES:
 * - cburnett (Lichess - estilo moderno)
 * - merida (Chess.com - estilo clásico)
 * - cardinal (Cardinal - estilo tradicional)
 */
const LICHESS_CDN_BASE = 'https://lichess1.org/assets/piece/';

/**
 * Mostrar pieza en una casilla
 *
 * @param {string} square - Coordenada donde colocar pieza (ej: 'e4')
 * @param {string} piece - Código de pieza (ej: 'wK', 'bP')
 *
 * IMPORTANTE: Esta función crea un <img> con la pieza
 * NO drag & drop todavía, solo visualización
 */
function showPiece(square, piece) {
    // ==========================================
    // 1. OBTENER CASILLA
    // ==========================================
    const squareElement = getSquareElement(square);
    if (!squareElement) {
        console.error(`❌ Casilla ${square} no encontrada`);
        return;
    }

    // ==========================================
    // 2. LIMPIAR PIEZAS EXISTENTES EN ESA CASILLA
    // ==========================================
    // Si ya había una pieza, eliminarla primero
    const existingPiece = squareElement.querySelector('.piece');
    if (existingPiece) {
        existingPiece.remove();
    }

    // ==========================================
    // 3. CREAR IMAGEN DE LA PIEZA
    // ==========================================
    const img = document.createElement('img');
    img.className = 'piece';

    // URL de la pieza en CDN Lichess con estilo actual
    // Ejemplo: https://lichess1.org/assets/piece/cburnett/wK.svg
    // PASO 4: Ahora usa currentPieceStyle en vez de hardcodear 'cburnett'
    img.src = `${LICHESS_CDN_BASE}${currentPieceStyle}/${piece}.svg`;

    // Alt text para accesibilidad
    img.alt = piece;

    // Data attribute para identificar qué pieza es
    img.dataset.piece = piece;

    // ==========================================
    // 4. AGREGAR PIEZA A LA CASILLA
    // ==========================================
    squareElement.appendChild(img);

    console.log(`✅ Pieza ${piece} colocada en ${square}`);
}

/**
 * Limpiar pieza de una casilla
 * @param {string} square - Coordenada de la casilla a limpiar
 */
function clearPiece(square) {
    const squareElement = getSquareElement(square);
    if (!squareElement) return;

    const piece = squareElement.querySelector('.piece');
    if (piece) {
        piece.remove();
        console.log(`🗑️ Pieza removida de ${square}`);
    }
}

/**
 * Limpiar todas las piezas del tablero
 */
function clearBoard() {
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => piece.remove());
    console.log('🗑️ Tablero limpiado');
}

// ============================================
// PASO 5: BANCO DE PIEZAS
// ============================================

/**
 * Crear banco de piezas lateral
 * PASO 5: AHORA CREA BANCO VACÍO (solo slots)
 * Las piezas llegarán desde el tablero con animación
 */
function createPieceBank() {
    console.log('🏦 Creando banco de piezas (vacío)...');

    const bankElement = document.getElementById('pieceBank');
    if (!bankElement) {
        console.error('❌ Elemento #pieceBank no encontrado');
        return;
    }

    // Limpiar banco si ya existe
    bankElement.innerHTML = '';

    // Tipos de piezas en orden: Rey, Dama, Torre, Alfil, Caballo, Peón
    const pieceTypes = [
        { code: 'K', name: 'Rey' },
        { code: 'Q', name: 'Dama' },
        { code: 'R', name: 'Torre' },
        { code: 'B', name: 'Alfil' },
        { code: 'N', name: 'Caballo' },
        { code: 'P', name: 'Peón' }
    ];

    // Colores: blancas y negras
    const colors = [
        { code: 'w', name: 'Blanca' },
        { code: 'b', name: 'Negra' }
    ];

    // ==========================================
    // CREAR SLOTS VACÍOS PARA CADA PIEZA
    // ==========================================
    // 2 filas: 6 slots cada una (total 12)
    colors.forEach(color => {
        pieceTypes.forEach(type => {
            // Código completo de la pieza (ej: 'wK', 'bP')
            const pieceCode = color.code + type.code;

            // ==========================================
            // 1. CREAR SLOT VACÍO
            // ==========================================
            const slot = document.createElement('div');
            slot.className = 'bank-piece-slot';

            // Data attributes para identificación
            slot.dataset.piece = pieceCode;
            slot.dataset.pieceName = `${color.name} ${type.name}`;

            // ==========================================
            // 2. NO AGREGAR PIEZA TODAVÍA
            // ==========================================
            // Las piezas llegarán con animación desde el tablero

            // ==========================================
            // 3. AGREGAR SLOT VACÍO AL BANCO
            // ==========================================
            bankElement.appendChild(slot);
        });
    });

    console.log('✅ Banco de piezas creado: 12 slots vacíos (6 tipos × 2 colores)');
}

/**
 * Actualizar piezas del banco al cambiar estilo
 * Similar a refreshAllPieces() pero para el banco
 */
function refreshBankPieces() {
    const bankPieces = document.querySelectorAll('.bank-piece-slot .piece');

    bankPieces.forEach(pieceImg => {
        const pieceCode = pieceImg.dataset.piece;
        if (pieceCode) {
            // Actualizar src con nuevo estilo
            pieceImg.src = `${LICHESS_CDN_BASE}${currentPieceStyle}/${pieceCode}.svg`;
        }
    });

    console.log(`🔄 Banco actualizado: ${bankPieces.length} piezas con estilo ${currentPieceStyle}`);
}

/**
 * Mostrar posición inicial para testing
 * (2 reyes: blanco en e1, negro en e8)
 */
function showTestPosition() {
    console.log('🧪 Mostrando posición de prueba: 2 reyes');

    // Rey blanco en e1
    showPiece('e1', 'wK');

    // Rey negro en e8
    showPiece('e8', 'bK');

    updateStatus('Posición de prueba: 2 reyes en e1 y e8');
}

// ============================================
// DEMO: ANIMACIÓN BANCO (PASO 5)
// Testing de la librería ChessGameLibrary
// ============================================

/**
 * Demostración de animación: piezas vuelan al banco
 * Ejecuta después de 2 segundos de mostrar posición
 */
function demoAnimationToBank() {
    console.log('🎬 Iniciando demo de animación al banco...');

    // Verificar que la librería esté cargada
    if (typeof window.ChessGameLibrary === 'undefined') {
        console.error('❌ ChessGameLibrary no está cargada');
        return;
    }

    const { animatePieceToBank, hidePiecesWithAnimation } = window.ChessGameLibrary.PieceAnimations;

    // Mostrar posición de prueba
    showTestPosition();

    // Después de 2 segundos, animar piezas al banco
    setTimeout(() => {
        updateStatus('¡Mira cómo las piezas vuelan al banco! ✨');

        // Animar ambas piezas con stagger
        hidePiecesWithAnimation(['e1', 'e8'], {
            stagger: 300,
            duration: 800,
            onComplete: () => {
                updateStatus('Piezas guardadas en el banco. ¡Memoriza la posición!');
                console.log('✅ Demo completada');

                // IMPORTANTE: Liberar estado después de animación
                isAnimating = false;
                gameState = 'idle';

                // Re-habilitar botón
                const btnStart = document.getElementById('btnStart');
                if (btnStart) {
                    btnStart.classList.remove('disabled');
                    btnStart.style.opacity = '1';
                    btnStart.style.cursor = 'pointer';
                }
            }
        });
    }, 2000);
}

/**
 * Test manual de animación individual
 * Puedes llamar esto desde consola: testSingleAnimation()
 */
function testSingleAnimation() {
    const { animatePieceToBank } = window.ChessGameLibrary.PieceAnimations;

    // Primero colocar una pieza
    showPiece('d4', 'wQ');

    // Buscar primer slot vacío
    const emptySlot = document.querySelector('.bank-piece-slot:not(:has(.piece))');

    // Animar después de 500ms
    setTimeout(() => {
        animatePieceToBank('d4', 'wQ', emptySlot, {
            duration: 600,
            onComplete: () => {
                console.log('✅ Animación individual completada');
            }
        });
    }, 500);
}

// Exponer función de test en window para debugging
window.testSingleAnimation = testSingleAnimation;
window.demoAnimationToBank = demoAnimationToBank;

// ============================================
// PASO 6: DRAG & DROP
// ============================================

/**
 * Convierte código de pieza a nombre legible
 * @param {string} piece - Código de pieza (ej: 'wK', 'bQ')
 * @returns {string} Nombre legible (ej: 'Rey Blanco', 'Dama Negra')
 */
function getPieceName(piece) {
    if (!piece || piece.length !== 2) return piece;

    const color = piece[0] === 'w' ? 'Blanco' : 'Negro';
    const typeMap = {
        'K': 'Rey',
        'Q': 'Dama',
        'R': 'Torre',
        'B': 'Alfil',
        'N': 'Caballo',
        'P': 'Peón'
    };

    const type = typeMap[piece[1]] || piece[1];
    return `${type} ${color}`;
}

/**
 * Inicializa el sistema de drag & drop
 * Permite arrastrar piezas del banco al tablero
 */
function initDragAndDrop() {
    console.log('🎯 Inicializando Drag & Drop...');

    if (!window.ChessGameLibrary?.DragDrop) {
        console.error('❌ ChessGameLibrary.DragDrop no está cargado');
        return;
    }

    const { initDragDrop } = window.ChessGameLibrary.DragDrop;

    // Configurar drag & drop
    initDragDrop({
        bankSelector: '.piece-bank',
        boardSelector: '#chessboard',

        // Callback: cuando se coloca una pieza
        onPiecePlaced: (piece, square) => {
            console.log(`✅ Pieza colocada: ${piece} en ${square}`);

            // Registrar pieza colocada
            placedPieces.push({ square, piece });

            // Calcular cuántas piezas faltan (solo las que fueron ocultadas)
            const piecesToPlace = window.MemoryMatrixLevels.getPiecesToHide(
                currentLevel,
                currentAttempt,
                currentPosition
            );

            const pieceName = getPieceName(piece);
            const remaining = piecesToPlace.length - placedPieces.length;

            if (remaining > 0) {
                updateStatus(`✓ ${pieceName} en ${square.toUpperCase()} - Faltan ${remaining} pieza${remaining > 1 ? 's' : ''}`);
            } else {
                updateStatus(`✓ ${pieceName} en ${square.toUpperCase()} - ¡Validando...!`);

                // Validar automáticamente cuando se colocan todas las piezas
                setTimeout(() => {
                    validatePosition();
                }, 500);
            }
        },

        // Validación: verificar si se puede colocar la pieza
        canPlacePiece: (piece, square) => {
            // Solo permitir durante la fase de resolución
            if (gameState !== 'solving') {
                updateStatus('⚠️ Espera a que comience la fase de resolución');
                return false;
            }

            // Verificar que no haya pieza en la casilla
            const squareElement = document.querySelector(`[data-square="${square}"]`);
            const hasPiece = squareElement?.querySelector('.piece');

            if (hasPiece) {
                console.log(`❌ Ya hay una pieza en ${square}`);
                updateStatus('⚠️ Ya hay una pieza en esa casilla');
                return false;
            }

            console.log(`✅ Se puede colocar ${piece} en ${square}`);
            return true;
        }
    });

    console.log('✅ Drag & Drop inicializado correctamente');
}

/**
 * Función de test para probar drag & drop
 * Coloca manualmente piezas en el banco para poder arrastrarlas
 * Llamar desde consola: testDragDrop()
 */
function testDragDrop() {
    console.log('🧪 Test Drag & Drop - Colocando piezas en banco...');

    // Colocar algunos reyes en el tablero primero
    showPiece('e1', 'wK');
    showPiece('e8', 'bK');

    // Esperar y animar al banco
    setTimeout(() => {
        const { hidePiecesWithAnimation } = window.ChessGameLibrary.PieceAnimations;

        hidePiecesWithAnimation(['e1', 'e8'], {
            stagger: 200,
            duration: 600,
            onComplete: () => {
                console.log('✅ Piezas en banco - Ahora puedes arrastrarlas!');
                updateStatus('¡Arrastra las piezas del banco al tablero!');

                // Verificar listeners
                setTimeout(() => {
                    const pieces = document.querySelectorAll('.bank-piece-slot .piece');
                    console.log(`🔍 Piezas en banco: ${pieces.length}`);
                    pieces.forEach((piece, i) => {
                        console.log(`  Pieza ${i}: ${piece.dataset.piece}, eventos: ${getEventListeners(piece)?.mousedown?.length || 'N/A'}`);
                        console.log(`  - pointer-events: ${getComputedStyle(piece).pointerEvents}`);
                        console.log(`  - cursor: ${getComputedStyle(piece).cursor}`);
                    });
                }, 100);
            }
        });
    }, 500);
}

// Test manual de eventos
function testEventManual() {
    const pieces = document.querySelectorAll('.bank-piece-slot .piece');
    if (pieces.length === 0) {
        console.error('❌ No hay piezas en el banco');
        return;
    }

    const piece = pieces[0];
    console.log('🧪 Test manual de evento en primera pieza:', piece.dataset.piece);
    console.log('📍 Estilo pointer-events:', getComputedStyle(piece).pointerEvents);
    console.log('📍 Cursor:', getComputedStyle(piece).cursor);

    // Simular click
    piece.click();

    // Simular mousedown
    piece.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

// Exponer para debugging
window.testDragDrop = testDragDrop;
window.testEventManual = testEventManual;
