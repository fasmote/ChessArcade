/**
 * MEMORY MATRIX - CONTROLADOR PRINCIPAL CON CHESSBOARD2.JS
 *
 * Este archivo contiene toda la lógica del juego Memory Matrix usando:
 * - Chess.js para la lógica de ajedrez y validación de posiciones
 * - Chessboard2.js para el renderizado del tablero y drag & drop
 * - Howler.js para el manejo de sonidos
 *
 * FLUJO DEL JUEGO:
 * 1. Mostrar posición inicial (fase de memorización)
 * 2. Ocultar piezas después del tiempo de vista
 * 3. Usuario coloca piezas desde el banco al tablero
 * 4. Verificar cada colocación contra la posición original
 * 5. Completar nivel cuando todas las piezas estén correctas
 *
 * ESTRUCTURA DE DATOS:
 * - currentLevel: número del nivel actual (1-30)
 * - gameState: fase actual del juego (memorize, place, complete)
 * - targetPosition: posición FEN que el usuario debe recrear
 * - userPosition: posición actual colocada por el usuario
 * - hiddenPieces: array de piezas que el usuario debe colocar
 */

// ============================================
// VARIABLES GLOBALES DEL JUEGO
// ============================================

/**
 * Estado principal del juego
 * Controla en qué fase estamos y qué acciones están permitidas
 */
let gameState = 'waiting'; // waiting, memorize, place, complete, paused

/**
 * Nivel actual del juego (1-30)
 * Se usa para obtener la configuración del nivel desde MEMORY_LEVELS
 */
let currentLevel = 1;

/**
 * Variables para manejo de pausa
 */
let memorizationTimer = null; // Timer del countdown de memorización
let pausedTimeLeft = 0; // Tiempo restante cuando se pausó
let gameStatePaused = null; // Estado anterior antes de pausar

/**
 * Limpiar todos los timers activos
 */
function clearAllTimers() {
    if (memorizationTimer) {
        clearInterval(memorizationTimer);
        memorizationTimer = null;
        console.log('⏰ Timer de memorización limpiado');
    }
}

/**
 * Instancia del tablero Chessboard2.js
 * Se inicializa una vez y se reutiliza durante todo el juego
 */
let chessboard = null;

/**
 * Instancia de Chess.js para lógica de ajedrez
 * Se usa para validar posiciones y manejar FEN
 */
let chess = null;

/**
 * Posición objetivo que el usuario debe recrear
 * Se almacena como string FEN para fácil comparación
 */
let targetPosition = '';

/**
 * Posición actual colocada por el usuario
 * Se actualiza cada vez que el usuario coloca/mueve una pieza
 */
let userPosition = '';

/**
 * FEN del nivel actual para crear posiciones con piezas ocultas
 */
let currentFEN = '';

/**
 * Array de piezas que el usuario debe colocar
 * Cada elemento contiene: {piece: 'wK', square: 'e1', placed: false}
 */
let hiddenPieces = [];

/**
 * Estadísticas del nivel actual
 * Se actualizan en tiempo real y se muestran en la UI
 */
let levelStats = {
    score: 0,           // Puntuación total del nivel
    accuracy: 100,      // Porcentaje de aciertos
    totalPlacements: 0, // Total de colocaciones realizadas
    correctPlacements: 0, // Colocaciones correctas
    startTime: null,    // Momento de inicio del nivel
    viewTime: 0         // Tiempo de visualización configurado
};

/**
 * Configuración de sonidos del juego
 * Se inicializa al cargar la página
 */
let gameSounds = {
    correct: null,      // Sonido para colocación correcta
    incorrect: null,    // Sonido para colocación incorrecta
    levelComplete: null, // Sonido para completar nivel
    background: null    // Música de fondo (opcional)
};

/**
 * Estados de configuración del usuario
 * Se mantienen durante toda la sesión
 */
let gameConfig = {
    soundEnabled: true, // Si los sonidos están activados
    debugMode: false    // Si el modo debug está activo
};

// ============================================
// INICIALIZACIÓN DEL JUEGO
// ============================================

/**
 * Función principal de inicialización
 * Se ejecuta cuando el DOM está completamente cargado
 *
 * PASOS DE INICIALIZACIÓN:
 * 1. Verificar que todas las librerías estén cargadas
 * 2. Inicializar el tablero Chessboard2.js
 * 3. Configurar event listeners para botones
 * 4. Cargar sonidos del juego
 * 5. Mostrar el primer nivel
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Iniciando Memory Matrix con Chessboard2.js...');

    try {
        // Verificar que todas las dependencias estén cargadas
        if (!verifyDependencies()) {
            throw new Error('No se pudieron cargar todas las librerías necesarias');
        }

        // Inicializar componentes del juego
        if (!initializeChessboard()) {
            throw new Error('Error inicializando tablero');
        }

        initializeEventListeners();
        initializeSounds();
        initializeUI();

        // Cargar el primer nivel
        loadLevel(1);

        console.log('✅ Memory Matrix inicializado correctamente');

        // Test adicional: verificar que el tablero esté visible
        setTimeout(() => {
            const boardElement = document.getElementById('chessboard');
            console.log('🔎 Test post-inicialización:');
            console.log('- Elemento #chessboard:', boardElement);
            console.log('- InnerHTML length:', boardElement?.innerHTML?.length || 0);
            console.log('- Tiene hijos:', boardElement?.children?.length || 0);
            if (chessboard) {
                console.log('- Objeto chessboard:', typeof chessboard, chessboard);
                if (chessboard.position) {
                    console.log('- Posición actual:', chessboard.position());
                }
            }
        }, 1000);
    } catch (error) {
        console.error('❌ Error fatal durante la inicialización:', error);
        showError(`Error inicializando el juego: ${error.message}`);
    }
});

/**
 * Verifica que todas las librerías necesarias estén cargadas
 *
 * @returns {boolean} true si todas las dependencias están disponibles
 */
function verifyDependencies() {
    console.log('🔍 Verificando dependencias disponibles...');

    // Debug adicional para ChessBoard
    console.log('🔎 Debugging ChessBoard globals:');
    console.log('window object keys con \"chess\":', Object.keys(window).filter(k => k.toLowerCase().includes('chess')));
    console.log('Chess:', typeof Chess);
    console.log('ChessBoard:', typeof ChessBoard);
    console.log('window.ChessBoard:', typeof window.ChessBoard);
    console.log('Howl:', typeof Howl);
    console.log('MEMORY_LEVELS:', typeof MEMORY_LEVELS);

    const dependencies = [
        { name: 'Chess.js', check: typeof Chess !== 'undefined' },
        { name: 'Chessboard.js', check: typeof Chessboard !== 'undefined' || typeof window.Chessboard !== 'undefined' },
        { name: 'Howler.js', check: typeof Howl !== 'undefined' },
        { name: 'Memory Levels', check: typeof MEMORY_LEVELS !== 'undefined' }
    ];

    let allLoaded = true;
    dependencies.forEach(dep => {
        if (!dep.check) {
            console.error(`❌ ${dep.name} no está cargado`);
            allLoaded = false;
        } else {
            console.log(`✅ ${dep.name} cargado correctamente`);
        }
    });

    return allLoaded;
}

/**
 * Inicializa el tablero Chessboard2.js con la configuración base
 *
 * CONFIGURACIÓN DEL TABLERO:
 * - Posición inicial vacía (se carga dinámicamente por nivel)
 * - Drag & drop habilitado para colocación de piezas
 * - Orientación blanca (se puede cambiar por nivel)
 * - Callbacks para manejar eventos de movimiento
 */
function initializeChessboard() {
    console.log('🏁 Inicializando tablero Chessboard2.js...');

    try {
        // Verificar que el contenedor del tablero existe
        const boardElement = document.getElementById('chessboard');
        if (!boardElement) {
            throw new Error('Elemento #chessboard no encontrado');
        }

        // Verificar que Chessboard.js está disponible
        if (typeof Chessboard === 'undefined' && typeof window.Chessboard === 'undefined') {
            throw new Error('Chessboard.js no está cargado');
        }

        // Configuración del tablero con tema de piezas funcionante
        const boardConfig = {
            position: 'start',
            draggable: true,
            // Usar sprites de piezas de ChessBoard.js (funciona desde CDN)
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
            onDrop: function(source, target, piece, newPos, oldPos, orientation) {
                console.log('🔍 onDrop:', {source, target, piece});
                if (gameState === 'place') {
                    return handlePiecePlacement(source, target, piece, newPos, oldPos);
                }
                return 'snapback';
            }
        };

        // Crear instancia del tablero oficial
        const ChessboardConstructor = window.Chessboard || Chessboard;
        if (!ChessboardConstructor) {
            throw new Error('Constructor Chessboard no encontrado');
        }

        console.log('🔧 Creando tablero con constructor:', typeof ChessboardConstructor);
        console.log('🔧 Elemento objetivo:', document.getElementById('chessboard'));

        // Intentar crear el tablero
        try {
            chessboard = ChessboardConstructor('chessboard', boardConfig);
            console.log('🎉 Tablero creado:', chessboard);
        } catch (error) {
            console.error('❌ Error creando tablero:', error);
            throw error;
        }

        // IMPORTANTE: Configurar drop listeners para drag & drop desde banco
        setupBoardDropListeners();

        // Inicializar Chess.js para validación de posiciones
        if (typeof Chess === 'undefined') {
            throw new Error('Chess.js no está cargado');
        }

        // Crear nueva instancia de Chess.js con posición inicial estándar
        chess = new Chess();

        console.log('✅ Tablero inicializado correctamente');

        // IMPORTANTE: Sincronizar altura del banco después de que el tablero esté listo
        // Usamos setTimeout para asegurar que el DOM esté completamente renderizado
        setTimeout(() => {
            syncPieceBankHeight();
        }, 100);

        return true;
    } catch (error) {
        console.error('❌ Error inicializando tablero:', error);
        showError(`Error inicializando tablero: ${error.message}`);
        return false;
    }
}

/**
 * Configura listeners para drag & drop desde el banco de piezas
 * ChessBoard.js solo maneja drag interno, necesitamos HTML5 drag & drop
 * para elementos externos como el banco de piezas
 */
function setupBoardDropListeners() {
    console.log('🎯 Configurando drop listeners para tablero...');

    // Esperar a que ChessBoard.js renderice las casillas
    setTimeout(() => {
        const boardElement = document.getElementById('chessboard');

        // DEBUGGING: Inspeccionar estructura real del DOM
        console.log('🔍 Estructura del tablero:', boardElement);
        console.log('🔍 Hijos directos:', boardElement.children);

        // ChessBoard.js crea divs para cada casilla con clase .square-*
        const squares = boardElement.querySelectorAll('[class*="square-"]');
        console.log(`🎯 Encontradas ${squares.length} casillas con clase 'square-'`);

        // Si no encuentra casillas con square-, intentar otros selectores
        if (squares.length === 0) {
            console.log('⚠️ No se encontraron casillas con clase square-, intentando otros selectores...');
            const allDivs = boardElement.querySelectorAll('div');
            console.log(`🔍 Total divs en tablero: ${allDivs.length}`);
            allDivs.forEach((div, index) => {
                if (index < 10) { // Solo mostrar los primeros 10 para debugging
                    console.log(`🔍 Div ${index}: clase="${div.className}", id="${div.id}"`);
                }
            });
        }

        squares.forEach(square => {
            // ChessBoard.js usa clases como 'square-11', 'square-12', etc.
            // Necesitamos convertir a notación algebraica (a1, b1, etc.)

            // Método 1: Intentar obtener desde atributo data-square
            let squareId = square.getAttribute('data-square');

            // Método 2: Si no hay data-square, calcularlo desde posición
            if (!squareId) {
                const squareClasses = square.className.split(' ');
                console.log('🔍 Clases de casilla:', squareClasses);

                // ChessBoard.js puede usar diferentes sistemas de ID
                // Intentar encontrar la casilla por posición relativa
                const boardElement = document.getElementById('chessboard');
                const allSquares = Array.from(boardElement.children);
                const squareIndex = allSquares.indexOf(square);

                if (squareIndex >= 0 && squareIndex < 64) {
                    // Convertir índice (0-63) a notación algebraica
                    const file = String.fromCharCode(97 + (squareIndex % 8)); // a-h
                    const rank = Math.floor(squareIndex / 8) + 1; // 1-8
                    squareId = file + rank;
                    console.log(`🔍 Calculado squareId desde índice ${squareIndex}: ${squareId}`);
                }
            }

            if (!squareId) {
                console.log('⚠️ No se pudo determinar ID de casilla para:', square.className);
                return;
            }

            console.log(`🎯 Configurando drop listener para casilla: ${squareId}`);

            // Permitir que la casilla reciba drops
            square.addEventListener('dragover', function(e) {
                e.preventDefault(); // Necesario para permitir drop
                e.dataTransfer.dropEffect = 'move';
                square.style.backgroundColor = 'rgba(0, 255, 255, 0.3)'; // Highlight visual
            });

            // Limpiar highlight cuando drag sale de la casilla
            square.addEventListener('dragleave', function(e) {
                square.style.backgroundColor = ''; // Quitar highlight
            });

            // Manejar el drop real
            square.addEventListener('drop', function(e) {
                e.preventDefault();
                square.style.backgroundColor = ''; // Quitar highlight

                const pieceCode = e.dataTransfer.getData('text/plain');
                console.log(`🎯 Drop detectado: ${pieceCode} en ${squareId}`);

                // Llamar al handler de colocación con formato ChessBoard.js
                handlePiecePlacementFromBank(pieceCode, squareId);
            });
        });

        console.log('✅ Drop listeners configurados en todas las casillas');
    }, 500); // Dar tiempo a ChessBoard.js para renderizar
}

// ============================================
// MANEJO DE EVENTOS DEL TABLERO
// ============================================

/**
 * Maneja la colocación de una pieza desde el banco de piezas
 * Esta función es específica para drops desde elementos externos
 *
 * @param {string} pieceCode - Código de la pieza (ej: 'wK', 'bQ')
 * @param {string} targetSquare - Casilla objetivo (ej: 'e1', 'e8')
 */
function handlePiecePlacementFromBank(pieceCode, targetSquare) {
    console.log(`🎯 Colocación desde banco: ${pieceCode} hacia ${targetSquare}`);

    if (gameState === 'paused') {
        console.log('⏸️ Colocación rechazada: juego pausado');
        return;
    }
    if (gameState !== 'place') {
        console.log('⚠️ No estamos en fase de colocación');
        return;
    }

    // IMPORTANTE: Crear una clave única para esta colocación específica
    // Esto previene que el mismo drop se procese múltiples veces
    const dropKey = `${pieceCode}-${targetSquare}-${Date.now()}`;

    // Verificar si ya procesamos esta colocación exacta recientemente
    if (!window.processedDrops) window.processedDrops = new Map();

    if (window.processedDrops.has(`${pieceCode}-${targetSquare}`)) {
        console.log(`🔄 Colocación ${pieceCode} en ${targetSquare} ya procesada, omitiendo...`);
        return;
    }

    // Marcar esta colocación como procesada
    window.processedDrops.set(`${pieceCode}-${targetSquare}`, Date.now());

    // Limpiar entradas antiguas (mayores a 1 segundo)
    const now = Date.now();
    for (const [key, timestamp] of window.processedDrops.entries()) {
        if (now - timestamp > 1000) {
            window.processedDrops.delete(key);
        }
    }

    // Verificar si la colocación es correcta
    const isCorrect = verifyPiecePlacement(targetSquare, pieceCode);

    if (isCorrect) {
        console.log(`✅ Colocación correcta: ${pieceCode} en ${targetSquare}`);

        // Colocar la pieza en el tablero visualmente
        const newPosition = {};
        newPosition[targetSquare] = pieceCode;
        chessboard.position(chessboard.position(), false); // Mantener posición actual

        // Agregar la nueva pieza
        const currentPos = chessboard.position();
        currentPos[targetSquare] = pieceCode;
        chessboard.position(currentPos);

        // Marcar la pieza como colocada en hiddenPieces
        const hiddenPiece = hiddenPieces.find(hp => hp.piece === pieceCode && hp.square === targetSquare);
        if (hiddenPiece) {
            hiddenPiece.placed = true;
        }

        // Remover la pieza del banco
        removePieceFromBank(pieceCode);

        // Mostrar feedback positivo
        showFeedback(true, '¡Correcto!', `${getPieceName(pieceCode)} colocado en ${targetSquare.toUpperCase()}`);

        // Añadir puntuación
        addScore(calculatePlacementScore(true));
        updatePlacementStats(true);

        // Verificar si el nivel está completo
        if (checkLevelComplete()) {
            setTimeout(() => {
                completLevel();
            }, 1000);
        }

    } else {
        console.log(`❌ Colocación incorrecta: ${pieceCode} en ${targetSquare}`);

        // Mostrar feedback negativo
        showFeedback(false, '¡Incorrecto!', `${getPieceName(pieceCode)} no va en ${targetSquare.toUpperCase()}`);

        // Restar puntuación
        addScore(calculatePlacementScore(false));
        updatePlacementStats(false);

        // Efecto visual en la casilla incorrecta
        addSquareEffect(targetSquare, 'incorrect');
    }
}

/**
 * Maneja cuando el usuario coloca una pieza en el tablero (versión original)
 * Esta función maneja movimientos internos de ChessBoard.js
 *
 * @param {string} source - Casilla de origen (puede ser 'offboard' para piezas del banco)
 * @param {string} target - Casilla de destino en el tablero
 * @param {string} piece - Código de la pieza (ej: 'wK', 'bq')
 * @param {object} newPos - Nueva posición completa del tablero
 * @param {object} oldPos - Posición anterior del tablero
 * @returns {string} 'snapback' para rechazar el movimiento, cualquier otra cosa para aceptar
 */
function handlePiecePlacement(source, target, piece, newPos, oldPos) {
    console.log(`🎯 Colocación: ${piece} desde ${source} hacia ${target}`);

    // Solo permitir colocaciones durante la fase de colocación
    if (gameState === 'paused') {
        console.log('⏸️ Colocación rechazada: juego pausado');
        return 'snapback';
    }
    if (gameState !== 'place') {
        console.log('❌ Colocación rechazada: no estamos en fase de colocación');
        return 'snapback';
    }

    // IMPORTANTE: Verificar si ya procesamos esta colocación exacta recientemente
    // Esto previene procesamiento doble cuando se usa HTML5 drag & drop desde banco
    if (!window.processedDrops) window.processedDrops = new Map();

    if (window.processedDrops.has(`${piece}-${target}`)) {
        console.log(`🔄 Colocación ${piece} en ${target} ya procesada por drag desde banco, omitiendo...`);
        return; // Permitir la colocación sin procesamiento adicional
    }

    // Verificar si la colocación es correcta
    const isCorrect = verifyPiecePlacement(target, piece);

    if (isCorrect) {
        handleCorrectPlacement(target, piece);
    } else {
        handleIncorrectPlacement(target, piece);
        return 'snapback'; // Rechazar colocación incorrecta
    }

    // Actualizar estadísticas
    updatePlacementStats(isCorrect);

    // Verificar si el nivel está completo
    if (checkLevelComplete()) {
        setTimeout(() => {
            completLevel();
        }, 500); // Pequeño delay para que se vea la última pieza colocada
    }

    return 'accept'; // Aceptar la colocación
}

/**
 * Maneja el inicio de un drag de pieza
 *
 * @param {string} source - Casilla de origen
 * @param {string} piece - Código de la pieza
 * @param {object} position - Posición actual del tablero
 * @returns {boolean} true para permitir el drag, false para cancelar
 */
function handleDragStart(source, piece, position) {
    // Solo permitir drag durante la fase de colocación
    if (gameState !== 'place') {
        return false;
    }

    // Marcar visualmente las casillas donde se puede colocar esta pieza
    highlightValidSquares(piece);

    return true;
}

/**
 * Maneja el movimiento de una pieza durante el drag
 *
 * @param {string} newLocation - Nueva ubicación del cursor
 * @param {string} oldLocation - Ubicación anterior del cursor
 * @param {string} source - Casilla de origen del drag
 * @param {string} piece - Código de la pieza siendo arrastrada
 */
function handleDragMove(newLocation, oldLocation, source, piece) {
    // Actualizar highlight de casilla bajo el cursor
    updateSquareHighlight(newLocation, oldLocation);
}

/**
 * Maneja cuando termina el drag (exitoso o cancelado)
 */
function handleSnapEnd() {
    // Limpiar todos los highlights visuales
    clearSquareHighlights();

    // Actualizar la posición del usuario
    updateUserPosition();
}

// ============================================
// LÓGICA DE VERIFICACIÓN DE COLOCACIONES
// ============================================

/**
 * Verifica si una pieza fue colocada en la posición correcta
 *
 * @param {string} square - Casilla donde se colocó la pieza (ej: 'e4')
 * @param {string} piece - Código de la pieza colocada (ej: 'wK')
 * @returns {boolean} true si la colocación es correcta
 */
function verifyPiecePlacement(square, piece) {
    // Buscar en las piezas ocultas si esta colocación es correcta
    const hiddenPiece = hiddenPieces.find(hp =>
        hp.square === square && hp.piece === piece && !hp.placed
    );

    if (hiddenPiece) {
        console.log(`✅ Colocación correcta: ${piece} en ${square}`);
        return true;
    } else {
        console.log(`❌ Colocación incorrecta: ${piece} en ${square}`);
        return false;
    }
}

/**
 * Maneja una colocación correcta de pieza
 *
 * @param {string} square - Casilla de la colocación correcta
 * @param {string} piece - Código de la pieza colocada correctamente
 */
function handleCorrectPlacement(square, piece) {
    console.log(`🎉 ¡Correcto! ${piece} colocado en ${square}`);

    // Marcar la pieza como colocada
    const hiddenPiece = hiddenPieces.find(hp =>
        hp.square === square && hp.piece === piece && !hp.placed
    );

    if (hiddenPiece) {
        hiddenPiece.placed = true;
    }

    // Reproducir sonido de éxito
    playSound('correct');

    // Mostrar feedback visual positivo
    showFeedback(true, `¡Correcto! ${getPieceName(piece)} en ${square.toUpperCase()}`,
        'Has colocado la pieza en su posición correcta');

    // Agregar puntos por colocación correcta
    addScore(calculatePlacementScore(true));

    // Efecto visual en la casilla
    addSquareEffect(square, 'correct');

    // Remover la pieza del banco
    removePieceFromBank(piece);
}

/**
 * Maneja una colocación incorrecta de pieza
 *
 * @param {string} square - Casilla de la colocación incorrecta
 * @param {string} piece - Código de la pieza colocada incorrectamente
 */
function handleIncorrectPlacement(square, piece) {
    console.log(`💥 ¡Incorrecto! ${piece} no va en ${square}`);

    // Reproducir sonido de error
    playSound('incorrect');

    // Mostrar feedback visual negativo
    showFeedback(false, `¡Incorrecto! ${getPieceName(piece)} no va aquí`,
        `La pieza ${getPieceName(piece)} no pertenece a la casilla ${square.toUpperCase()}`);

    // Restar puntos por colocación incorrecta
    subtractScore(calculatePlacementScore(false));

    // Efecto visual en la casilla
    addSquareEffect(square, 'incorrect');
}

// ============================================
// GESTIÓN DE NIVELES
// ============================================

/**
 * Carga un nivel específico del juego
 *
 * @param {number} levelNumber - Número del nivel a cargar (1-30)
 */
function loadLevel(levelNumber) {
    console.log(`📚 Cargando nivel ${levelNumber}...`);

    // Verificar que el nivel existe
    if (!MEMORY_LEVELS[levelNumber]) {
        console.error(`❌ Nivel ${levelNumber} no existe`);
        return;
    }

    // Obtener configuración del nivel
    const levelConfig = MEMORY_LEVELS[levelNumber];
    currentLevel = levelNumber;

    // Reiniciar estado del juego
    resetGameState();

    // Configurar estadísticas del nivel
    levelStats = {
        score: 0,
        accuracy: 100,
        totalPlacements: 0,
        correctPlacements: 0,
        startTime: null,
        viewTime: (levelConfig.view_time || 8000) / 1000 // Convertir ms a segundos
    };

    // Actualizar UI con información del nivel
    updateLevelUI(levelConfig);

    // Preparar el tablero para este nivel
    setupBoardForLevel(levelConfig);

    // IMPORTANTE: Sincronizar altura del banco después de configurar el tablero
    setTimeout(() => {
        syncPieceBankHeight();
    }, 100);

    // Configurar panel educativo
    updateEducationalPanel(levelConfig);

    // Actualizar controles para reflejar el nuevo nivel
    updateGameControls();

    console.log(`✅ Nivel ${levelNumber} cargado: ${levelConfig.name}`);
}

/**
 * Configura el tablero para un nivel específico
 *
 * @param {object} levelConfig - Configuración del nivel desde MEMORY_LEVELS
 */
function setupBoardForLevel(levelConfig) {
    console.log('🎯 Configurando tablero para nivel:', levelConfig);

    try {
        // Establecer orientación del tablero (si la función existe)
        if (chessboard && typeof chessboard.orientation === 'function') {
            chessboard.orientation(levelConfig.orientation || 'white');
        }

        // Configurar Chess.js con la posición del nivel
        if (chess && levelConfig.fen) {
            console.log('🔍 Cargando FEN:', levelConfig.fen, 'tipo:', typeof levelConfig.fen);
            console.log('🔍 FEN length:', levelConfig.fen.length);
            console.log('🔍 FEN first 20 chars:', levelConfig.fen.substring(0, 20));
            console.log('🔍 Chess instance before load:', chess.fen());

            // Verificar que levelConfig.fen sea realmente un string
            if (typeof levelConfig.fen === 'string') {
                try {
                    console.log('🔄 Saltando Chess.js - usando Chessboard2.js directamente');

                    // NO usar Chess.js para cargar FEN - está buggy
                    // En su lugar, usamos nuestra propia lógica para determinar piezas
                    targetPosition = levelConfig.fen;
                    currentFEN = levelConfig.fen; // Para usar en createPositionWithHiddenPieces

                    console.log('✅ FEN asignado directamente:', targetPosition);

                } catch (error) {
                    console.error('❌ Error asignando FEN:', error);
                }
            } else {
                console.error('❌ Error: FEN no es string, es:', typeof levelConfig.fen, levelConfig.fen);
                return;
            }
        } else {
            console.error('❌ Error: Chess.js no inicializado o FEN inválido');
            return;
        }

        // Determinar qué piezas se van a ocultar
        hiddenPieces = determineHiddenPieces(levelConfig);
        console.log(`🔍 Resultado determineHiddenPieces:`, hiddenPieces);
        console.log(`🔍 pieces_hidden del nivel:`, levelConfig.pieces_hidden);

        // Mostrar posición inicial completa (fase de memorización)
        if (chessboard && typeof chessboard.position === 'function') {
            console.log('🎯 Configurando tablero con FEN:', levelConfig.fen);

            // PASO 1: Limpiar completamente el tablero
            console.log('🧹 Limpiando tablero...');
            // En ChessBoard.js, clear() no funciona bien, usar position(false)
            chessboard.position(false);
            console.log('🧹 Tablero limpiado, posición actual:', chessboard.position());

            // PASO 2: Configurar manualmente la posición
            const manualPosition = parseFenToChessboardPosition(levelConfig.fen);
            console.log('🎯 Posición manual para Chessboard2:', manualPosition);

            // PASO 3: Establecer la nueva posición
            chessboard.position(manualPosition);
            console.log('🎯 Posición establecida, verificando:', chessboard.position());

            console.log('✅ Tablero configurado y limpio');
        }

        // Actualizar UI
        updateMemoryStats();

        console.log(`✅ Tablero configurado para nivel ${currentLevel}`);
        console.log(`📍 FEN: ${levelConfig.fen}`);
        console.log(`🎭 Piezas a ocultar: ${hiddenPieces.length}`);
    } catch (error) {
        console.error('❌ Error configurando tablero:', error);
    }
}

/**
 * Determina qué piezas se van a ocultar según la configuración del nivel
 *
 * @param {object} levelConfig - Configuración del nivel
 * @returns {array} Array de objetos con las piezas a ocultar
 */
function determineHiddenPieces(levelConfig) {
    const pieces = [];

    console.log('🔍 Determinando piezas ocultas SIN Chess.js');
    console.log('🔍 Level config:', levelConfig);

    try {
        // NO usar Chess.js - parsear FEN directamente
        const fenPosition = levelConfig.fen.split(' ')[0]; // Solo la parte de posición
        console.log('🔍 FEN position part:', fenPosition);

        const fenBoard = parseFenToBoard(fenPosition);
        console.log('🔍 Parsed FEN board:', fenBoard);

        // Para cada pieza en el tablero, verificar si debe ocultarse
        for (const square in fenBoard) {
            const piece = fenBoard[square];
            console.log(`🔍 Piece found: ${piece} at ${square}`);

            // Verificar si esta casilla está en pieces_hidden
            if (levelConfig.pieces_hidden && levelConfig.pieces_hidden.includes(square)) {
                console.log(`🔍 Hiding piece ${piece} at ${square}`);
                pieces.push({
                    piece: piece,
                    square: square,
                    placed: false,
                    pieceObj: { piece: piece, square: square }
                });
            }
        }

    } catch (error) {
        console.error('❌ Error determinando piezas ocultas:', error);

        // Fallback: usar configuración directa del nivel
        if (levelConfig.pieces_hidden) {
            levelConfig.pieces_hidden.forEach(square => {
                // Para el nivel 1: e8=bK, e1=wK
                let piece = '';
                if (square === 'e8') piece = 'bK';
                if (square === 'e1') piece = 'wK';

                if (piece) {
                    pieces.push({
                        piece: piece,
                        square: square,
                        placed: false,
                        pieceObj: { piece: piece, square: square }
                    });
                }
            });
        }
    }

    return pieces;
}

/**
 * Parsea un FEN a un objeto tablero simplificado
 */
function parseFenToBoard(fenPosition) {
    const board = {};
    const ranks = fenPosition.split('/');

    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
        const rank = ranks[rankIndex];
        let fileIndex = 0;

        for (let charIndex = 0; charIndex < rank.length; charIndex++) {
            const char = rank[charIndex];

            if (isNaN(char)) {
                // Es una pieza
                const file = String.fromCharCode(97 + fileIndex); // a-h
                const rankNum = 8 - rankIndex; // 8-1
                const square = file + rankNum;

                // Convertir a nuestro formato: color + tipo
                const pieceCode = char === char.toUpperCase() ? 'w' + char : 'b' + char.toUpperCase();
                board[square] = pieceCode;
                fileIndex++;
            } else {
                // Es un número (casillas vacías)
                fileIndex += parseInt(char);
            }
        }
    }

    return board;
}

/**
 * Convierte un FEN al formato de posición que espera Chessboard2.js
 */
function parseFenToChessboardPosition(fen) {
    const position = {};
    const fenPosition = fen.split(' ')[0]; // Solo la parte de posición
    const ranks = fenPosition.split('/');

    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
        const rank = ranks[rankIndex];
        let fileIndex = 0;

        for (let charIndex = 0; charIndex < rank.length; charIndex++) {
            const char = rank[charIndex];

            if (isNaN(char)) {
                // Es una pieza
                const file = String.fromCharCode(97 + fileIndex); // a-h
                const rankNum = 8 - rankIndex; // 8-1
                const square = file + rankNum;

                // Convertir al formato de Chessboard2.js (mantener mayúsculas/minúsculas)
                position[square] = char === char.toUpperCase() ? 'w' + char : 'b' + char.toUpperCase();
                fileIndex++;
            } else {
                // Es un número (casillas vacías)
                fileIndex += parseInt(char);
            }
        }
    }

    console.log('🔍 Posición FEN convertida:', position);
    console.log('🔍 Piezas encontradas en FEN:', Object.keys(position).map(sq => `${sq}:${position[sq]}`).join(', '));
    return position;
}

/**
 * Determina si una pieza específica debe ser ocultada según las reglas del nivel
 *
 * @param {object} piece - Objeto pieza de Chess.js
 * @param {string} square - Casilla de la pieza
 * @param {object} levelConfig - Configuración del nivel
 * @returns {boolean} true si la pieza debe ser ocultada
 */
function shouldHidePiece(piece, square, levelConfig) {
    // Si el nivel especifica casillas específicas a ocultar (formato memory-levels.js)
    if (levelConfig.pieces_hidden && Array.isArray(levelConfig.pieces_hidden)) {
        return levelConfig.pieces_hidden.includes(square);
    }

    // Si el nivel especifica piezas específicas a ocultar
    if (levelConfig.hiddenPieces) {
        return levelConfig.hiddenPieces.some(hp =>
            hp.square === square || hp.piece === piece.color + piece.type.toUpperCase()
        );
    }

    // Si el nivel especifica tipos de piezas a ocultar
    if (levelConfig.hiddenTypes) {
        return levelConfig.hiddenTypes.includes(piece.type);
    }

    // Si el nivel especifica colores a ocultar
    if (levelConfig.hiddenColors) {
        return levelConfig.hiddenColors.includes(piece.color);
    }

    // Por defecto, ocultar todas las piezas excepto peones (para niveles básicos)
    return piece.type !== 'p';
}

// ============================================
// GESTIÓN DE FASES DEL JUEGO
// ============================================

/**
 * Inicia la fase de memorización del nivel actual
 * Se muestra la posición completa por el tiempo configurado
 */
function startMemorizationPhase() {
    console.log('🧠 Iniciando fase de memorización...');

    gameState = 'memorize';
    levelStats.startTime = Date.now();

    // Mostrar posición completa en el tablero
    chessboard.position(targetPosition);

    // Deshabilitar interacción con el tablero
    setChessboardInteraction(false);

    // Mostrar overlay de memorización
    showMemorizationOverlay();

    // Iniciar countdown
    startMemorizationCountdown();

    // Actualizar botones
    updateGameControls();
}

/**
 * Inicia la fase de colocación de piezas
 * Se ocultan las piezas y se permite al usuario colocarlas
 */
function startPlacementPhase() {
    // Evitar llamadas múltiples o cuando ya estamos en fase de colocación
    if (gameState === 'place' || gameState === 'complete') {
        console.log('⚠️ startPlacementPhase ignorado: ya en estado', gameState);
        return;
    }

    console.log('🎯 Iniciando fase de colocación...');

    gameState = 'place';

    // Ocultar el overlay de memorización
    hideMemorizationOverlay();

    // Crear posición con piezas ocultas
    console.log('🧹 Limpiando tablero para fase de colocación...');
    // En ChessBoard.js, clear() no funciona bien, usar position(false)
    chessboard.position(false);

    const positionWithHiddenPieces = createPositionWithHiddenPieces();
    console.log('🎯 Posición con piezas ocultas:', positionWithHiddenPieces);
    chessboard.position(positionWithHiddenPieces);

    console.log('✅ Tablero configurado para colocación');

    // Habilitar interacción con el tablero
    setChessboardInteraction(true);

    // Mostrar banco de piezas con animación desde el tablero (solo en PC)
    if (window.innerWidth >= 768) {
        createPieceBankWithAnimation();
    } else {
        createPieceBank();
    }

    // Reconfigurar drop listeners para esta fase
    setupBoardDropListeners();

    // Actualizar botones
    updateGameControls();

    console.log('✅ Fase de colocación iniciada');
}

/**
 * Completa el nivel actual
 * Se ejecuta cuando todas las piezas han sido colocadas correctamente
 */
function completLevel() {
    console.log('🎉 ¡Nivel completado!');

    gameState = 'complete';

    // Calcular estadísticas finales
    calculateFinalStats();

    // Reproducir sonido de victoria
    playSound('levelComplete');

    // Mostrar pantalla de nivel completado
    showLevelCompleteScreen();

    // Deshabilitar interacción con el tablero
    setChessboardInteraction(false);

    // Actualizar botones
    updateGameControls();
}

// ============================================
// MANEJO DE LA UI Y CONTROLES
// ============================================

/**
 * Sincronizar altura de banco de piezas con el tablero
 * SOLUCIÓN DEFINITIVA: El banco debe tener EXACTAMENTE la misma altura que el tablero
 */
function syncPieceBankHeight() {
    console.log('📏 Sincronizando altura de banco de piezas con tablero...');

    try {
        const chessboardElement = document.getElementById('chessboard');
        const pieceBankContainer = document.querySelector('.piece-bank-container');
        const pieceBank = document.querySelector('.piece-bank');

        if (!chessboardElement || !pieceBankContainer || !pieceBank) {
            console.warn('⚠️ Elementos no encontrados para sincronización de altura');
            return;
        }

        // Obtener altura REAL del tablero (incluyendo border, padding, etc.)
        const boardRect = chessboardElement.getBoundingClientRect();
        const boardHeight = boardRect.height;

        console.log(`📐 Altura real del tablero: ${boardHeight}px`);

        // Verificar si estamos en layout horizontal (banco lateral)
        // En modo desktop (900px+) el banco debe estar al lado del tablero
        const isDesktop = window.matchMedia('(min-width: 900px)').matches;
        const windowWidth = window.innerWidth;

        // Verificar también el layout actual del contenedor
        const chessBoardContainer = document.querySelector('.chess-board-container');
        const computedStyle = chessBoardContainer ? window.getComputedStyle(chessBoardContainer) : null;
        const isHorizontalLayout = computedStyle && computedStyle.flexDirection === 'row';

        console.log(`🖥️ Verificación responsive: windowWidth=${windowWidth}px, isDesktop=${isDesktop}, layout=${computedStyle?.flexDirection}`);

        // AGREGAR INFORMACIÓN VISUAL EN PANTALLA PARA DEBUGGING
        let debugInfo = document.querySelector('#debug-responsive-info');
        if (!debugInfo) {
            debugInfo = document.createElement('div');
            debugInfo.id = 'debug-responsive-info';
            debugInfo.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: #00ff00;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
                border: 1px solid #00ff00;
            `;
            document.body.appendChild(debugInfo);
        }

        // Verificar si está aplicada la clase exitosa
        const hasTestClass = chessBoardContainer && chessBoardContainer.classList.contains('test-lateral-fix');

        debugInfo.innerHTML = `
            <strong>🔧 DEBUG MODE</strong><br>
            Ventana: ${windowWidth}px<br>
            Desktop: ${isDesktop ? '✅' : '❌'}<br>
            Layout: ${computedStyle?.flexDirection}<br>
            Tablero: ${boardHeight}px<br>
            CSS Exitoso: ${hasTestClass ? '✅' : '❌'}<br>
            Modo: ${isHorizontalLayout ? (isDesktop ? 'LATERAL' : 'LATERAL FORZADO') : 'VERTICAL'}<br>
            <button onclick="window.forceLateralMode()" style="margin-top:5px;background:#ff6600;border:none;color:white;padding:5px;border-radius:3px;cursor:pointer;display:block;width:100%;">FORZAR LATERAL</button>
            <button onclick="window.testAlignmentCSS()" style="margin-top:3px;background:#9900ff;border:none;color:white;padding:5px;border-radius:3px;cursor:pointer;display:block;width:100%;">TEST CSS</button>
            <button onclick="window.debugElements()" style="margin-top:3px;background:#00aa00;border:none;color:white;padding:5px;border-radius:3px;cursor:pointer;display:block;width:100%;">DEBUG</button>
        `;

        // AUTO-APLICAR CSS exitoso en modo desktop
        if (isDesktop && chessBoardContainer) {
            // Primero asegurar que el CSS experimental esté cargado
            let testCSS = document.querySelector('#test-alignment-css');
            if (!testCSS) {
                testCSS = document.createElement('link');
                testCSS.id = 'test-alignment-css';
                testCSS.rel = 'stylesheet';
                testCSS.href = 'test-alignment.css';
                document.head.appendChild(testCSS);
                console.log('🔗 AUTO-CARGANDO CSS experimental');
            }

            // Luego aplicar la clase
            if (!chessBoardContainer.classList.contains('test-lateral-fix')) {
                chessBoardContainer.classList.add('test-lateral-fix');
                console.log('🔧 AUTO-APLICANDO CSS exitoso en modo desktop');
            }
        } else if (chessBoardContainer && chessBoardContainer.classList.contains('test-lateral-fix')) {
            chessBoardContainer.classList.remove('test-lateral-fix');
            console.log('🔧 REMOVIENDO CSS exitoso en modo mobile/tablet');
        }

        // Sincronizar siempre que el layout sea horizontal (natural o forzado)
        if (isHorizontalLayout) {
            // ESTRATEGIA ROBUSTA: Forzar posicionamiento con múltiples métodos
            pieceBankContainer.style.setProperty('height', `${boardHeight}px`, 'important');
            pieceBankContainer.style.setProperty('min-height', `${boardHeight}px`, 'important');
            pieceBankContainer.style.setProperty('max-height', `${boardHeight}px`, 'important');
            pieceBankContainer.style.setProperty('align-self', 'flex-start', 'important');
            pieceBankContainer.style.setProperty('justify-self', 'center', 'important');

            // FORZAR posición absoluta si hay problemas de alineación
            pieceBankContainer.style.setProperty('position', 'relative', 'important');
            pieceBankContainer.style.setProperty('top', '0', 'important');
            pieceBankContainer.style.setProperty('transform', 'translateY(0)', 'important');

            // Establecer altura exacta del banco con !important
            pieceBank.style.setProperty('height', `${boardHeight}px`, 'important');
            pieceBank.style.setProperty('min-height', `${boardHeight}px`, 'important');
            pieceBank.style.setProperty('max-height', `${boardHeight}px`, 'important');

            // NUEVA ESTRATEGIA: Alinear primera pieza con primera fila del tablero
            // Calcular altura de una casilla (tablero / 8)
            const squareHeight = boardHeight / 8;
            const firstSquareTop = squareHeight * 0.5; // Centro de la primera casilla

            // Forzar alineación superior de piezas con offset calculado
            pieceBank.style.setProperty('justify-content', 'flex-start', 'important');
            pieceBank.style.setProperty('align-items', 'center', 'important');
            pieceBank.style.setProperty('padding-top', `${Math.max(0, firstSquareTop - 35)}px`, 'important'); // 35px = aprox mitad de pieza

            console.log(`✅ Banco sincronizado: ${boardHeight}px de altura (layout horizontal ${isDesktop ? 'natural' : 'forzado'})`);
            console.log(`🎯 Offset calculado: squareHeight=${squareHeight}px, padding-top=${Math.max(0, firstSquareTop - 35)}px`);
        } else {
            // En mobile/tablet/layout vertical, remover restricciones de altura forzadas
            pieceBankContainer.style.removeProperty('height');
            pieceBankContainer.style.removeProperty('min-height');
            pieceBankContainer.style.removeProperty('max-height');
            pieceBankContainer.style.removeProperty('align-self');
            pieceBankContainer.style.removeProperty('justify-self');
            pieceBankContainer.style.removeProperty('position');
            pieceBankContainer.style.removeProperty('top');
            pieceBankContainer.style.removeProperty('transform');

            pieceBank.style.removeProperty('height');
            pieceBank.style.removeProperty('min-height');
            pieceBank.style.removeProperty('max-height');
            pieceBank.style.removeProperty('justify-content');
            pieceBank.style.removeProperty('align-items');
            pieceBank.style.removeProperty('padding-top');

            console.log(`📱 Layout vertical: altura automática del banco (isDesktop=${isDesktop}, horizontal=${isHorizontalLayout})`);

            // Mostrar mensaje informativo si el usuario está en una ventana pequeña
            if (windowWidth < 900) {
                console.log(`💡 INFORMACIÓN: Para ver el banco lateral sincronizado, amplía la ventana a 900px+ (actual: ${windowWidth}px)`);
            }
        }

    } catch (error) {
        console.error('❌ Error sincronizando altura:', error);
    }
}

/**
 * Función global para forzar modo lateral independientemente del responsive
 */
window.forceLateralMode = function() {
    console.log('🔧 FORZANDO modo lateral por solicitud del usuario...');

    const chessBoardContainer = document.querySelector('.chess-board-container');
    const pieceBankContainer = document.querySelector('.piece-bank-container');
    const chessboardElement = document.getElementById('chessboard');

    if (chessBoardContainer && pieceBankContainer && chessboardElement) {
        // Forzar layout horizontal
        chessBoardContainer.style.setProperty('flex-direction', 'row', 'important');
        chessBoardContainer.style.setProperty('align-items', 'flex-start', 'important');

        // Obtener altura del tablero y aplicar sincronización
        const boardHeight = chessboardElement.getBoundingClientRect().height;

        // Forzar sincronización lateral
        pieceBankContainer.style.setProperty('height', `${boardHeight}px`, 'important');
        pieceBankContainer.style.setProperty('min-height', `${boardHeight}px`, 'important');
        pieceBankContainer.style.setProperty('max-height', `${boardHeight}px`, 'important');
        pieceBankContainer.style.setProperty('align-self', 'flex-start', 'important');
        pieceBankContainer.style.setProperty('position', 'relative', 'important');
        pieceBankContainer.style.setProperty('top', '0', 'important');
        pieceBankContainer.style.setProperty('transform', 'translateY(0)', 'important');

        console.log(`✅ MODO LATERAL FORZADO: ${boardHeight}px de altura`);

        // Actualizar info debug
        const debugInfo = document.querySelector('#debug-responsive-info');
        if (debugInfo) {
            const currentContent = debugInfo.innerHTML;
            debugInfo.innerHTML = currentContent.replace('VERTICAL', '<span style="color:#ff6600;">LATERAL FORZADO</span>');
        }
    } else {
        console.error('❌ No se pudieron encontrar los elementos necesarios para forzar modo lateral');
    }
};

/**
 * FUNCIÓN DE DEBUG: Inspeccionar estado actual de elementos
 */
window.debugElements = function() {
    console.log('🔍 === DEBUG ELEMENTOS ===');

    const container = document.querySelector('.chess-board-container');
    const bankContainer = document.querySelector('.piece-bank-container');
    const bank = document.querySelector('.piece-bank');
    const board = document.querySelector('.chess-board');

    if (container) {
        const computed = window.getComputedStyle(container);
        console.log('📦 .chess-board-container:');
        console.log(`  - className: "${container.className}"`);
        console.log(`  - flexDirection: ${computed.flexDirection}`);
        console.log(`  - alignItems: ${computed.alignItems}`);
        console.log(`  - padding: ${computed.padding}`);
        console.log(`  - margin: ${computed.margin}`);
    }

    if (bankContainer) {
        const computed = window.getComputedStyle(bankContainer);
        console.log('🏛️ .piece-bank-container:');
        console.log(`  - className: "${bankContainer.className}"`);
        console.log(`  - alignSelf: ${computed.alignSelf}`);
        console.log(`  - position: ${computed.position}`);
        console.log(`  - top: ${computed.top}`);
        console.log(`  - marginTop: ${computed.marginTop}`);
        console.log(`  - paddingTop: ${computed.paddingTop}`);
    }

    if (bank) {
        const computed = window.getComputedStyle(bank);
        console.log('🏦 .piece-bank:');
        console.log(`  - className: "${bank.className}"`);
        console.log(`  - justifyContent: ${computed.justifyContent}`);
        console.log(`  - padding: ${computed.padding}`);
        console.log(`  - margin: ${computed.margin}`);
    }

    // Verificar CSS cargados
    const testCSS = document.querySelector('#test-alignment-css');
    console.log(`🎨 CSS experimental: ${testCSS ? 'CARGADO' : 'NO CARGADO'}`);

    // Verificar clases aplicadas
    console.log(`✅ Clase .test-lateral-fix: ${container && container.classList.contains('test-lateral-fix') ? 'APLICADA' : 'NO APLICADA'}`);

    console.log('🔍 === FIN DEBUG ===');
};

/**
 * FUNCIÓN DE PRUEBA: Activar CSS experimental para alineación
 */
window.testAlignmentCSS = function() {
    console.log('🧪 ACTIVANDO CSS de prueba para alineación...');

    // Cargar CSS de prueba si no está cargado
    let testCSS = document.querySelector('#test-alignment-css');
    if (!testCSS) {
        testCSS = document.createElement('link');
        testCSS.id = 'test-alignment-css';
        testCSS.rel = 'stylesheet';
        testCSS.href = 'test-alignment.css';
        document.head.appendChild(testCSS);
        console.log('🔗 CSS de prueba cargado');
    }

    // Aplicar clase de prueba al contenedor principal
    const chessBoardContainer = document.querySelector('.chess-board-container');
    if (chessBoardContainer) {
        if (chessBoardContainer.classList.contains('test-lateral-fix')) {
            // Desactivar modo prueba
            chessBoardContainer.classList.remove('test-lateral-fix');
            console.log('❌ CSS de prueba DESACTIVADO');
            return '❌ Modo prueba desactivado';
        } else {
            // Activar modo prueba
            chessBoardContainer.classList.add('test-lateral-fix');
            console.log('✅ CSS de prueba ACTIVADO');
            return '✅ Modo prueba activado';
        }
    } else {
        console.error('❌ No se encontró .chess-board-container');
        return '❌ Error: contenedor no encontrado';
    }
};

/**
 * Inicializa todos los event listeners de los botones y controles
 */
function initializeEventListeners() {
    console.log('🎛️ Configurando event listeners...');

    // Botón principal de iniciar nivel
    document.getElementById('startBtn').addEventListener('click', function() {
        if (gameState === 'waiting') {
            startMemorizationPhase();
        } else if (gameState === 'complete') {
            loadLevel(currentLevel + 1);
        }
    });

    // Botón de pausa
    document.getElementById('pauseBtn').addEventListener('click', function() {
        togglePause();
    });

    // Botón de pista
    document.getElementById('hintBtn').addEventListener('click', function() {
        showHint();
    });

    // Botón de saltar fase
    document.getElementById('skipPhaseBtn').addEventListener('click', function() {
        skipCurrentPhase();
    });

    // Botones de la pantalla de nivel completado
    document.getElementById('nextLevelBtn').addEventListener('click', function() {
        loadLevel(currentLevel + 1);
    });

    document.getElementById('repeatLevelBtn').addEventListener('click', function() {
        loadLevel(currentLevel);
    });

    document.getElementById('mainMenuBtn').addEventListener('click', function() {
        goToMainMenu();
    });

    // Botón de toggle de sonido
    document.getElementById('soundToggle').addEventListener('click', function() {
        toggleSound();
    });

    // Botón de home
    document.getElementById('homeBtn').addEventListener('click', function() {
        goToMainMenu();
    });

    // Event listeners para feedback clickeable
    const feedbackDisplay = document.getElementById('feedbackDisplay');
    const feedbackClose = document.getElementById('feedbackClose');

    // Cerrar feedback al hacer click en la X
    feedbackClose.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevenir que se propague al feedback completo
        hideFeedback();
    });

    // Cerrar feedback al hacer click en cualquier parte del feedback
    feedbackDisplay.addEventListener('click', function() {
        hideFeedback();
    });

    // Listener para redimensionar ventana - RE-SINCRONIZAR altura del banco
    window.addEventListener('resize', function() {
        console.log('📐 Ventana redimensionada - re-sincronizando banco...');
        // Usar setTimeout para esperar que termine la animación de resize
        setTimeout(() => {
            syncPieceBankHeight();
        }, 200);
    });

    console.log('✅ Event listeners configurados');
}

/**
 * Actualiza la UI con la información del nivel actual
 *
 * @param {object} levelConfig - Configuración del nivel
 */
function updateLevelUI(levelConfig) {
    // Información básica del nivel
    document.getElementById('levelNumber').textContent = currentLevel;
    document.getElementById('levelName').textContent = levelConfig.name;
    document.getElementById('levelPhase').textContent = levelConfig.phase;
    document.getElementById('levelDescription').textContent = levelConfig.description;

    // Estadísticas del nivel
    document.getElementById('piecesTotal').textContent = levelConfig.pieces_total || 'N/A';
    const viewTimeSeconds = (levelConfig.view_time || 8000) / 1000;
    document.getElementById('viewTime').textContent = `${viewTimeSeconds}s`;

    // Progreso general
    document.getElementById('currentLevel').textContent = currentLevel;

    // Reset de estadísticas
    updateScoreDisplay();
    updateAccuracyDisplay();
}

/**
 * Actualiza las estadísticas de memoria en la UI
 */
function updateMemoryStats() {
    document.getElementById('piecesHidden').textContent = hiddenPieces.length;
}

/**
 * Actualiza la visualización de la puntuación
 */
function updateScoreDisplay() {
    document.getElementById('score').textContent = levelStats.score;
}

/**
 * Actualiza la visualización de la precisión
 */
function updateAccuracyDisplay() {
    document.getElementById('accuracy').textContent = `${levelStats.accuracy}%`;
}

/**
 * Actualiza el estado de los botones de control según la fase del juego
 */
function updateGameControls() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const hintBtn = document.getElementById('hintBtn');
    const skipPhaseBtn = document.getElementById('skipPhaseBtn');

    switch (gameState) {
        case 'waiting':
            // Personalizar texto del botón según el nivel
            if (currentLevel === 1) {
                startBtn.textContent = '🎮 COMENZAR';
            } else {
                startBtn.textContent = `🚀 START NIVEL ${currentLevel}`;
            }
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            hintBtn.disabled = true;
            skipPhaseBtn.disabled = true;
            break;

        case 'memorize':
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            hintBtn.disabled = true;
            skipPhaseBtn.disabled = false;
            skipPhaseBtn.textContent = 'SALTAR MEMORIZACIÓN';
            break;

        case 'place':
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            hintBtn.disabled = false;
            skipPhaseBtn.disabled = false;
            skipPhaseBtn.textContent = 'SALTAR NIVEL';
            break;

        case 'complete':
            // Personalizar texto según el próximo nivel
            const nextLevel = currentLevel + 1;
            if (nextLevel <= Object.keys(MEMORY_LEVELS).length) {
                startBtn.textContent = `🚀 START NIVEL ${nextLevel}`;
            } else {
                startBtn.textContent = '🏆 COMPLETADO';
            }
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            hintBtn.disabled = true;
            skipPhaseBtn.disabled = true;
            break;

        case 'paused':
            pauseBtn.textContent = 'REANUDAR';
            break;
    }
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Reinicia el estado del juego para cargar un nuevo nivel
 */
function resetGameState() {
    console.log('🔄 Reiniciando estado del juego');

    // Limpiar timers activos
    clearAllTimers();

    // Reset variables de pausa
    pausedTimeLeft = 0;
    gameStatePaused = null;

    gameState = 'waiting';
    targetPosition = '';
    currentFEN = '';
    userPosition = '';
    hiddenPieces = [];

    // Limpiar UI
    hideLevelCompleteScreen();
    hideFeedback();
    clearPieceBank();

    // Limpiar overlay de pausa si existe
    hideOverlay('pause');

    console.log('✅ Estado reiniciado, gameState:', gameState);
}

/**
 * Obtiene el nombre descriptivo de una pieza
 *
 * @param {string} pieceCode - Código de la pieza (ej: 'wK', 'bq')
 * @returns {string} Nombre descriptivo de la pieza
 */
function getPieceName(pieceCode) {
    const pieces = {
        'wK': 'Rey Blanco', 'wQ': 'Dama Blanca', 'wR': 'Torre Blanca',
        'wB': 'Alfil Blanco', 'wN': 'Caballo Blanco', 'wP': 'Peón Blanco',
        'bK': 'Rey Negro', 'bQ': 'Dama Negra', 'bR': 'Torre Negra',
        'bB': 'Alfil Negro', 'bN': 'Caballo Negro', 'bP': 'Peón Negro'
    };

    return pieces[pieceCode] || pieceCode;
}

/**
 * Muestra un mensaje de error al usuario
 *
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    console.error('❌ Error:', message);
    // Aquí se podría mostrar un modal o notificación de error
    alert(message); // Implementación simple por ahora
}

/**
 * Función de debugging para verificar el estado del juego
 */
function debugGameState() {
    console.log('🔍 DEBUG - Estado actual del juego:');
    console.log('Estado:', gameState);
    console.log('Nivel:', currentLevel);
    console.log('Posición objetivo:', targetPosition);
    console.log('Piezas ocultas:', hiddenPieces);
    console.log('Estadísticas:', levelStats);
}

// ============================================
// FUNCIONES FALTANTES - IMPLEMENTACIÓN COMPLETA
// ============================================

/**
 * Inicializa el sistema de sonidos del juego
 */
function initializeSounds() {
    console.log('🔊 Inicializando sonidos...');

    try {
        // Deshabilitar sonidos temporalmente para evitar errores CORS
        console.log('⚠️ Sonidos deshabilitados temporalmente (archivo local)');
        gameConfig.soundEnabled = false;

        /*
        gameSounds.correct = new Howl({
            src: ['../../../assets/sounds/correct.mp3', '../../../assets/sounds/correct.wav'],
            volume: 0.5
        });

        gameSounds.incorrect = new Howl({
            src: ['../../../assets/sounds/incorrect.mp3', '../../../assets/sounds/incorrect.wav'],
            volume: 0.5
        });

        gameSounds.levelComplete = new Howl({
            src: ['../../../assets/sounds/victory.mp3', '../../../assets/sounds/victory.wav'],
            volume: 0.7
        });
        */
    } catch (error) {
        console.log('⚠️ Sonidos no disponibles, continuando sin audio');
    }
}

/**
 * Inicializa elementos de la UI
 */
function initializeUI() {
    console.log('🎨 Inicializando UI...');

    // Ocultar elementos que no se necesitan al inicio
    document.getElementById('levelCompleteScreen').style.display = 'none';
    document.getElementById('feedbackDisplay').style.display = 'none';
    document.getElementById('pieceBankContainer').style.display = 'none';
    document.getElementById('boardOverlay').style.display = 'none';
}

/**
 * Muestra el overlay de memorización con countdown
 */
function showMemorizationOverlay() {
    const overlay = document.getElementById('boardOverlay');
    overlay.style.display = 'flex';

    document.getElementById('overlayText').textContent = '¡Memoriza la posición!';
    document.getElementById('phaseIndicator').textContent = '🧠 Fase de memoria';
}

/**
 * Oculta el overlay de memorización
 */
function hideMemorizationOverlay() {
    document.getElementById('boardOverlay').style.display = 'none';
}

/**
 * Inicia el countdown de memorización
 */
function startMemorizationCountdown() {
    let timeLeft = levelStats.viewTime;
    pausedTimeLeft = timeLeft; // Guardar tiempo inicial para pausa
    const countdownElement = document.getElementById('overlayCountdown');

    // IMPORTANTE: Mostrar el tiempo inicial inmediatamente
    // Esto previene que aparezca "0" o un valor incorrecto durante el primer segundo
    countdownElement.textContent = timeLeft.toString();

    // Guardar timer globalmente para poder pausarlo
    memorizationTimer = setInterval(() => {
        // Verificar si el juego está pausado
        if (gameState === 'paused') {
            return; // No hacer nada si está pausado
        }

        timeLeft--;
        pausedTimeLeft = timeLeft; // Actualizar tiempo para pausa

        if (timeLeft < 0) {
            clearInterval(memorizationTimer);
            memorizationTimer = null;
            startPlacementPhase();
        } else {
            // Actualizar display solo si hay tiempo restante
            countdownElement.textContent = timeLeft.toString();
        }
    }, 1000);
}

/**
 * Crea una posición con las piezas especificadas ocultas
 */
function createPositionWithHiddenPieces() {
    console.log('🔍 Creando posición con piezas ocultas para FEN:', currentFEN);
    console.log('🔍 Piezas a ocultar:', hiddenPieces.map(hp => `${hp.square}:${hp.piece}`).join(', '));

    const position = {};

    try {
        // NO usar Chess.js - usar la posición FEN del nivel directamente
        const fullPosition = parseFenToChessboardPosition(currentFEN);
        console.log('🔍 Posición completa del FEN:', Object.keys(fullPosition).map(sq => `${sq}:${fullPosition[sq]}`).join(', '));

        // Copiar todas las piezas excepto las que deben estar ocultas
        for (const square in fullPosition) {
            const pieceCode = fullPosition[square];
            // Solo mostrar la pieza si NO está en la lista de piezas ocultas
            const isHidden = hiddenPieces.some(hp => hp.square === square);
            console.log(`🔍 Verificando pieza ${pieceCode} en ${square}: ${isHidden ? 'OCULTA' : 'VISIBLE'}`);
            if (!isHidden) {
                position[square] = pieceCode;
            }
        }

        console.log('🔍 Posición final (solo piezas visibles):', Object.keys(position).map(sq => `${sq}:${position[sq]}`).join(', '));
    } catch (error) {
        console.error('❌ Error creando posición con piezas ocultas:', error);
        // Fallback: posición vacía
        return {};
    }

    return position;
}

/**
 * Crea el banco de piezas para drag & drop
 */
function createPieceBank() {
    console.log('🏦 Creando banco de piezas, hiddenPieces:', hiddenPieces);

    const bankContainer = document.getElementById('pieceBankContainer');
    const pieceBank = document.getElementById('pieceBank');

    if (!bankContainer || !pieceBank) {
        console.error('❌ Elementos del banco no encontrados');
        return;
    }

    // Limpiar banco anterior
    pieceBank.innerHTML = '';

    // Crear una pieza draggable para cada pieza oculta
    hiddenPieces.forEach((hiddenPiece, index) => {
        if (!hiddenPiece.placed) {
            const pieceElement = createPieceImageElement(hiddenPiece.piece, index);
            pieceBank.appendChild(pieceElement);
        }
    });

    // Mostrar el banco
    bankContainer.style.display = 'block';
}

/**
 * Crea un elemento de pieza usando imágenes PNG como en el tablero
 * Esta función reemplaza el uso de símbolos Unicode para unificar la apariencia
 */
function createPieceImageElement(pieceCode, bankIndex) {
    console.log('\ud83c\udfa8 Creando pieza con imagen para banco:', pieceCode);

    const pieceElement = document.createElement('div');
    pieceElement.className = `draggable-piece piece-${pieceCode.toLowerCase()}`;
    pieceElement.draggable = true;
    pieceElement.dataset.piece = pieceCode;
    pieceElement.dataset.bankIndex = bankIndex;

    // Crear imagen usando la misma URL que ChessBoard.js
    const pieceImg = document.createElement('img');
    pieceImg.src = getPieceImageUrl(pieceCode);
    pieceImg.alt = getPieceName(pieceCode);
    pieceImg.draggable = false; // Evitar conflictos de drag
    pieceImg.style.width = '100%';
    pieceImg.style.height = '100%';
    pieceImg.style.pointerEvents = 'none'; // Click pasa al contenedor

    pieceElement.appendChild(pieceImg);

    // Event listeners para drag & drop
    pieceElement.addEventListener('dragstart', function(e) {
        console.log('\ud83c\udfaf Drag start from bank:', pieceCode);
        e.dataTransfer.setData('text/plain', pieceCode);
        e.dataTransfer.effectAllowed = 'move';
        // Añadir efecto visual de drag
        pieceElement.style.opacity = '0.5';
    });

    pieceElement.addEventListener('dragend', function(e) {
        // Restaurar opacidad después del drag
        pieceElement.style.opacity = '1';
    });

    return pieceElement;
}

/**
 * Crea el banco de piezas con animación desde el tablero (solo PC)
 * Las piezas se deslizan visualmente desde sus posiciones en el tablero al banco
 */
function createPieceBankWithAnimation() {
    console.log('\ud83c\udfac Creando banco de piezas con animación para PC');

    const bankContainer = document.getElementById('pieceBankContainer');
    const pieceBank = document.getElementById('pieceBank');

    if (!bankContainer || !pieceBank) {
        console.error('❌ Elementos del banco no encontrados');
        return;
    }

    // Limpiar banco anterior
    pieceBank.innerHTML = '';

    // Mostrar el contenedor del banco inmediatamente
    bankContainer.style.display = 'block';

    // Obtener posiciones del tablero para animación
    const boardElement = document.querySelector('.chess-board');
    const boardRect = boardElement.getBoundingClientRect();
    const bankRect = pieceBank.getBoundingClientRect();

    // Animar cada pieza oculta
    hiddenPieces.forEach((hiddenPiece, index) => {
        if (!hiddenPiece.placed) {
            setTimeout(() => {
                animatePieceToBank(hiddenPiece, index, boardRect, bankRect);
            }, index * 200); // Stagger de 200ms entre piezas
        }
    });
}

/**
 * Anima una pieza individual desde el tablero hacia el banco
 */
function animatePieceToBank(hiddenPiece, index, boardRect, bankRect) {
    console.log('\ud83c\udfaf Animando pieza al banco:', hiddenPiece.piece, 'desde', hiddenPiece.square);

    // Calcular posición de la casilla en el tablero
    const squarePosition = getSquarePosition(hiddenPiece.square, boardRect);

    // Crear elemento de pieza temporal para animación
    const animPiece = document.createElement('div');
    animPiece.style.position = 'fixed';
    animPiece.style.left = squarePosition.x + 'px';
    animPiece.style.top = squarePosition.y + 'px';
    animPiece.style.width = '50px';
    animPiece.style.height = '50px';
    animPiece.style.zIndex = '1000';
    animPiece.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    animPiece.style.pointerEvents = 'none';

    // Añadir la imagen de la pieza
    const pieceImg = document.createElement('img');
    pieceImg.src = getPieceImageUrl(hiddenPiece.piece);
    pieceImg.style.width = '100%';
    pieceImg.style.height = '100%';
    pieceImg.style.filter = 'drop-shadow(0 4px 8px rgba(0, 255, 255, 0.5))';
    animPiece.appendChild(pieceImg);

    document.body.appendChild(animPiece);

    // Calcular posición final en el banco
    const bankPosition = {
        x: bankRect.left + (index * 60) + 30, // Distribuir horizontalmente
        y: bankRect.top + bankRect.height / 2 - 25
    };

    // Iniciar animación después de un frame
    requestAnimationFrame(() => {
        animPiece.style.left = bankPosition.x + 'px';
        animPiece.style.top = bankPosition.y + 'px';
        animPiece.style.transform = 'scale(1.1)';
    });

    // Al terminar la animación, crear la pieza real en el banco
    setTimeout(() => {
        // Remover pieza temporal
        document.body.removeChild(animPiece);

        // Crear pieza real en el banco
        const pieceElement = createPieceImageElement(hiddenPiece.piece, index);
        pieceElement.style.opacity = '0';
        document.getElementById('pieceBank').appendChild(pieceElement);

        // Fade in de la pieza real
        requestAnimationFrame(() => {
            pieceElement.style.transition = 'opacity 0.3s ease';
            pieceElement.style.opacity = '1';
        });

    }, 800); // Duración de la animación
}

/**
 * Calcula la posición de una casilla en coordenadas de pantalla
 */
function getSquarePosition(square, boardRect) {
    // Convertir notación de ajedrez (e4) a coordenadas de tablero
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // 0-7
    const rank = parseInt(square[1]) - 1; // 0-7

    // Tamaño de casilla (tablero dividido en 8x8)
    const squareSize = Math.min(boardRect.width, boardRect.height) / 8;

    // Posición relativa al tablero (desde perspectiva blanca)
    const x = boardRect.left + (file * squareSize) + (squareSize / 2) - 25;
    const y = boardRect.top + ((7 - rank) * squareSize) + (squareSize / 2) - 25;

    return { x, y };
}

/**
 * Obtiene la URL de la imagen de una pieza (misma que usa ChessBoard.js)
 */
function getPieceImageUrl(pieceCode) {
    // Formato usado por ChessBoard.js: https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png
    const baseUrl = 'https://chessboardjs.com/img/chesspieces/wikipedia/';
    const pieceMapping = {
        'wK': 'wK', 'wQ': 'wQ', 'wR': 'wR', 'wB': 'wB', 'wN': 'wN', 'wP': 'wP',
        'bK': 'bK', 'bQ': 'bQ', 'bR': 'bR', 'bB': 'bB', 'bN': 'bN', 'bP': 'bP'
    };

    const pieceFile = pieceMapping[pieceCode] || 'wK';
    return baseUrl + pieceFile + '.png';
}

/**
 * Obtiene el símbolo Unicode para una pieza (DEPRECADO - usar createPieceImageElement)
 */
function getPieceSymbol(pieceCode) {
    const symbols = {
        'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
        'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
    };
    return symbols[pieceCode] || '?';
}

/**
 * Habilita o deshabilita la interacción con el tablero
 */
function setChessboardInteraction(enabled) {
    // Esta función se maneja automáticamente por los callbacks de Chessboard2.js
    // El estado 'gameState' controla si los movimientos son válidos
}

/**
 * Verifica si el nivel está completo
 */
function checkLevelComplete() {
    const isComplete = hiddenPieces.every(piece => piece.placed);
    console.log(`🔍 Verificando nivel completo:`, {
        hiddenPieces: hiddenPieces.length,
        placed: hiddenPieces.filter(p => p.placed).length,
        isComplete
    });
    return isComplete;
}

/**
 * Actualiza las estadísticas después de una colocación
 */
function updatePlacementStats(isCorrect) {
    levelStats.totalPlacements++;
    if (isCorrect) {
        levelStats.correctPlacements++;
    }

    levelStats.accuracy = Math.round((levelStats.correctPlacements / levelStats.totalPlacements) * 100);
    updateAccuracyDisplay();
}

/**
 * Calcula la puntuación para una colocación
 */
function calculatePlacementScore(isCorrect) {
    const baseScore = 100;
    const timeBonus = Math.max(0, 50 - Math.floor((Date.now() - levelStats.startTime) / 1000));

    return isCorrect ? baseScore + timeBonus : -25;
}

/**
 * Añade puntuación al total
 */
function addScore(points) {
    levelStats.score += points;
    updateScoreDisplay();
}

/**
 * Resta puntuación del total
 */
function subtractScore(points) {
    levelStats.score = Math.max(0, levelStats.score - points);
    updateScoreDisplay();
}

/**
 * Reproduce un sonido del juego
 */
function playSound(soundName) {
    if (gameConfig.soundEnabled && gameSounds[soundName]) {
        gameSounds[soundName].play();
    }
}

// Variable global para el timeout del feedback
let feedbackTimeout = null;

/**
 * Muestra feedback visual al usuario con cierre inmediato disponible
 *
 * @param {boolean} isCorrect - Si el feedback es positivo o negativo
 * @param {string} title - Título del mensaje
 * @param {string} explanation - Explicación detallada
 */
function showFeedback(isCorrect, title, explanation) {
    const feedbackDisplay = document.getElementById('feedbackDisplay');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackExplanation = document.getElementById('feedbackExplanation');

    // Limpiar timeout anterior si existe
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
        feedbackTimeout = null;
    }

    feedbackIcon.textContent = isCorrect ? '✅' : '❌';
    feedbackText.textContent = title;
    feedbackExplanation.textContent = explanation;

    feedbackDisplay.style.display = 'block';
    feedbackDisplay.className = `feedback-display ${isCorrect ? 'correct' : 'incorrect'}`;

    // Auto-ocultar con timeouts diferentes para correcto vs incorrecto
    const autoHideDelay = isCorrect ? 1500 : 2500; // Correcto: 1.5s, Incorrecto: 2.5s
    feedbackTimeout = setTimeout(() => {
        hideFeedback();
    }, autoHideDelay);
}

/**
 * Oculta el feedback visual y limpia timeouts
 */
function hideFeedback() {
    // Limpiar timeout si existe
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
        feedbackTimeout = null;
    }

    document.getElementById('feedbackDisplay').style.display = 'none';
}

/**
 * Añade efecto visual a una casilla
 */
function addSquareEffect(square, effectType) {
    // Esta función se implementaría con CSS animations
    console.log(`Efecto ${effectType} en casilla ${square}`);
}

/**
 * Remueve una pieza del banco después de colocación correcta
 */
function removePieceFromBank(pieceCode) {
    console.log(`🏦 Removiendo ${pieceCode} del banco`);
    const bankElements = document.querySelectorAll(`[data-piece="${pieceCode}"]`);
    bankElements.forEach(element => {
        // Remover visualmente con animación
        element.style.opacity = '0.3';
        element.style.transform = 'scale(0.5)';
        element.draggable = false;
        element.style.pointerEvents = 'none';

        // Remover del DOM después de la animación
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    });
}

/**
 * Resalta casillas válidas para una pieza
 */
function highlightValidSquares(piece) {
    // Implementar highlight visual de casillas válidas
    console.log(`Highlighting valid squares for ${piece}`);
}

/**
 * Actualiza highlight de casilla durante drag
 */
function updateSquareHighlight(newLocation, oldLocation) {
    // Implementar actualización de highlight
}

/**
 * Limpia todos los highlights visuales
 */
function clearSquareHighlights() {
    // Implementar limpieza de highlights
}

/**
 * Actualiza la posición del usuario
 */
function updateUserPosition() {
    userPosition = chessboard.position();
}

/**
 * Actualiza el panel educativo con información del nivel
 */
function updateEducationalPanel(levelConfig) {
    document.getElementById('panelTitle').textContent = `🏰 ${levelConfig.category || 'Información de Apertura'}`;
    document.getElementById('levelExplanation').textContent = levelConfig.explanation || levelConfig.description;
}

/**
 * Limpia el banco de piezas
 */
function clearPieceBank() {
    document.getElementById('pieceBank').innerHTML = '';
    document.getElementById('pieceBankContainer').style.display = 'none';
}

/**
 * Calcula estadísticas finales del nivel
 */
function calculateFinalStats() {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - levelStats.startTime) / 1000);

    document.getElementById('finalScore').textContent = levelStats.score;
    document.getElementById('accuracyFinal').textContent = `${levelStats.accuracy}%`;
    document.getElementById('timeTotal').textContent = `${totalTime}s`;
}

/**
 * Muestra la pantalla de nivel completado con información personalizada
 *
 * Personaliza los textos y botones según el nivel actual y el progreso
 * del jugador en el juego
 */
function showLevelCompleteScreen() {
    // Mostrar la pantalla modal
    document.getElementById('levelCompleteScreen').style.display = 'flex';

    // Personalizar el botón del próximo nivel
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const nextLevel = currentLevel + 1;

    if (nextLevel <= Object.keys(MEMORY_LEVELS).length) {
        // Hay más niveles disponibles
        nextLevelBtn.textContent = `🚀 NIVEL ${nextLevel}`;
        nextLevelBtn.disabled = false;
    } else {
        // Se completaron todos los niveles
        nextLevelBtn.textContent = '🏆 JUEGO COMPLETADO';
        nextLevelBtn.disabled = true;
    }

    // Personalizar el botón de repetir nivel
    const repeatLevelBtn = document.getElementById('repeatLevelBtn');
    repeatLevelBtn.textContent = `🔄 REPETIR NIVEL ${currentLevel}`;

    // Personalizar el título según el logro
    const completeTitle = document.getElementById('completeTitle');
    if (currentLevel === 1) {
        completeTitle.textContent = '🎉 ¡PRIMER NIVEL SUPERADO!';
    } else if (currentLevel % 5 === 0) {
        // Cada 5 niveles es un hito especial
        completeTitle.textContent = `🌟 ¡HITO ALCANZADO! - NIVEL ${currentLevel}`;
    } else {
        completeTitle.textContent = `✨ ¡NIVEL ${currentLevel} COMPLETADO!`;
    }
}

/**
 * Oculta la pantalla de nivel completado
 */
function hideLevelCompleteScreen() {
    document.getElementById('levelCompleteScreen').style.display = 'none';
}

/**
 * Funciones de botones que faltan
 */
function togglePause() {
    console.log('⏸️ Toggling pause, current state:', gameState);

    if (gameState === 'paused') {
        // REANUDAR JUEGO
        console.log('▶️ Reanudando juego...');

        // Restaurar estado anterior
        if (gameStatePaused) {
            gameState = gameStatePaused;
        } else {
            gameState = 'place'; // Default fallback
        }

        // Reanudar timer si estaba en memorización
        if (gameState === 'memorize' && pausedTimeLeft > 0) {
            console.log(`⏰ Reanudando countdown con ${pausedTimeLeft} segundos`);
            // Actualizar display con tiempo actual
            const countdownElement = document.getElementById('overlayCountdown');
            if (countdownElement) {
                countdownElement.textContent = pausedTimeLeft.toString();
            }
            // El timer ya está configurado para ignorar cuando gameState === 'paused'
        }

        // Habilitar interacciones
        enableGameInteractions();

        // Ocultar overlay de pausa si existe
        hideOverlay('pause');

        // Actualizar botón
        document.getElementById('pauseBtn').textContent = 'PAUSA';

        console.log('✅ Juego reanudado, nuevo estado:', gameState);

    } else {
        // PAUSAR JUEGO
        console.log('⏸️ Pausando juego...');

        // Guardar estado actual antes de pausar
        gameStatePaused = gameState;
        gameState = 'paused';

        // Deshabilitar interacciones
        disableGameInteractions();

        // Mostrar overlay de pausa
        showOverlay('pause');

        // Actualizar botón
        document.getElementById('pauseBtn').textContent = 'REANUDAR';

        console.log('⏸️ Juego pausado, estado anterior:', gameStatePaused);
    }

    // Actualizar controles UI
    updateGameControls();
}

/**
 * Funciones auxiliares para el sistema de pausa
 */
function enableGameInteractions() {
    console.log('🎮 Habilitando interacciones del juego');
    // Habilitar drag & drop en banco de piezas
    const pieceBankElements = document.querySelectorAll('.draggable-piece');
    pieceBankElements.forEach(piece => {
        piece.style.pointerEvents = 'auto';
        piece.style.opacity = '1';
    });

    // Habilitar drop en tablero (ya manejado por gameState en handleDrop)
    // Los listeners ya verifican el gameState
}

function disableGameInteractions() {
    console.log('🚫 Deshabilitando interacciones del juego');
    // Deshabilitar drag & drop en banco de piezas
    const pieceBankElements = document.querySelectorAll('.draggable-piece');
    pieceBankElements.forEach(piece => {
        piece.style.pointerEvents = 'none';
        piece.style.opacity = '0.5';
    });

    // Drop en tablero se deshabilita automáticamente por gameState
}

function showOverlay(type) {
    console.log('👁️ Mostrando overlay:', type);
    if (type === 'pause') {
        // Crear o mostrar overlay de pausa
        let pauseOverlay = document.getElementById('pauseOverlay');
        if (!pauseOverlay) {
            pauseOverlay = document.createElement('div');
            pauseOverlay.id = 'pauseOverlay';
            pauseOverlay.className = 'position-overlay';
            pauseOverlay.innerHTML = `
                <div class="overlay-text">⏸️ JUEGO PAUSADO</div>
                <div class="phase-indicator">Presiona REANUDAR para continuar</div>
            `;
            document.querySelector('.position-display').appendChild(pauseOverlay);
        }
        pauseOverlay.classList.add('show');
    }
}

function hideOverlay(type) {
    console.log('🙈 Ocultando overlay:', type);
    if (type === 'pause') {
        const pauseOverlay = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.classList.remove('show');
        }
    }
}

function showHint() {
    const nextPiece = hiddenPieces.find(p => !p.placed);
    if (nextPiece) {
        showFeedback(true, 'Pista', `Coloca ${getPieceName(nextPiece.piece)} en ${nextPiece.square.toUpperCase()}`);
    }
}

function skipCurrentPhase() {
    if (gameState === 'memorize') {
        startPlacementPhase();
    } else if (gameState === 'place') {
        completLevel();
    }
}

function toggleSound() {
    gameConfig.soundEnabled = !gameConfig.soundEnabled;
    document.getElementById('soundToggle').textContent = gameConfig.soundEnabled ? '🔊' : '🔇';
}

function goToMainMenu() {
    window.location.href = '../../../index.html';
}

// Exportar función de debug para uso en consola
window.debugMemoryMatrix = debugGameState;

console.log('📝 Controlador Memory Matrix cargado - Listo para jugar!');