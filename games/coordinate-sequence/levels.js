/**
 * ============================================
 * COORDINATE SEQUENCE - LEVELS (V2)
 * ============================================
 * Progresión combinada:
 * - Anillos concéntricos
 * - Cuadrantes
 * - Filas progresivas
 * - Colores variados
 *
 * @version 2.0.0
 * @author ChessArcade Team
 */

/**
 * Colores para las secuencias (ciclo)
 */
const SEQUENCE_COLORS = [
    { name: 'cyan', hex: '#00ffff', shadowColor: 'rgba(0, 255, 255, 0.8)' },
    { name: 'magenta', hex: '#ff00ff', shadowColor: 'rgba(255, 0, 255, 0.8)' },
    { name: 'green', hex: '#00ff00', shadowColor: 'rgba(0, 255, 0, 0.8)' },
    { name: 'orange', hex: '#ff6600', shadowColor: 'rgba(255, 102, 0, 0.8)' },
    { name: 'purple', hex: '#8a2be2', shadowColor: 'rgba(138, 43, 226, 0.8)' },
    { name: 'yellow', hex: '#ffdd00', shadowColor: 'rgba(255, 221, 0, 0.8)' },
    { name: 'pink', hex: '#ff1493', shadowColor: 'rgba(255, 20, 147, 0.8)' },
    { name: 'lime', hex: '#00ff80', shadowColor: 'rgba(0, 255, 128, 0.8)' }
];

/**
 * Configuración de niveles con progresión variada
 *
 * Cada nivel define:
 * - sequenceLength: Cantidad de casillas en la secuencia
 * - highlightDuration: Tiempo de iluminación (ms)
 * - pauseDuration: Pausa entre casillas (ms)
 * - baseScore: Puntos base
 * - restrictedArea: Zona del tablero (ring, quadrant, rows, full)
 * - areaConfig: Configuración específica de la zona
 * - useColors: Si usa colores variados (true/false)
 */
const LEVELS = [
    // FASE 1: CENTRO 2x2 (4 casillas) - Introducción ULTRA FÁCIL
    {
        level: 1,
        sequenceLength: 1, // Una sola casilla para empezar
        highlightDuration: 1200,
        pauseDuration: 400,
        baseScore: 10,
        difficulty: '⭐ Muy Fácil',
        name: 'Primera Casilla',
        restrictedArea: 'ring',
        areaConfig: '2x2',
        useColors: true
    },
    {
        level: 2,
        sequenceLength: 2, // Dos casillas
        highlightDuration: 1000,
        pauseDuration: 300,
        baseScore: 20,
        difficulty: '⭐ Muy Fácil',
        name: 'Centro - Inicio',
        restrictedArea: 'ring',
        areaConfig: '2x2',
        useColors: true
    },
    {
        level: 3,
        sequenceLength: 3, // Tres casillas
        highlightDuration: 900,
        pauseDuration: 250,
        baseScore: 30,
        difficulty: '⭐ Muy Fácil',
        name: 'Centro - Básico',
        restrictedArea: 'ring',
        areaConfig: '2x2',
        useColors: true
    },

    // FASE 2: ANILLO 4x4 (16 casillas) - Expandir
    {
        level: 4,
        sequenceLength: 3,
        highlightDuration: 850,
        pauseDuration: 250,
        baseScore: 40,
        difficulty: '⭐ Fácil',
        name: 'Anillo Pequeño',
        restrictedArea: 'ring',
        areaConfig: '4x4',
        useColors: true
    },
    {
        level: 5,
        sequenceLength: 4,
        highlightDuration: 800,
        pauseDuration: 200,
        baseScore: 50,
        difficulty: '⭐ Fácil',
        name: 'Anillo Ampliado',
        restrictedArea: 'ring',
        areaConfig: '4x4',
        useColors: true
    },

    // FASE 3: CUADRANTE (16 casillas) - Variación
    {
        level: 6,
        sequenceLength: 4,
        highlightDuration: 750,
        pauseDuration: 200,
        baseScore: 60,
        difficulty: '⭐⭐ Medio',
        name: 'Cuadrante Derecho',
        restrictedArea: 'quadrant',
        areaConfig: 'bottom-right',
        useColors: true
    },
    {
        level: 7,
        sequenceLength: 5,
        highlightDuration: 700,
        pauseDuration: 150,
        baseScore: 70,
        difficulty: '⭐⭐ Medio',
        name: 'Mitad Inferior',
        restrictedArea: 'rows',
        areaConfig: { start: 1, end: 4 }, // Filas 1-4 (32 casillas)
        useColors: true
    },

    // FASE 4: ANILLO 6x6 (36 casillas) - Avanzado
    {
        level: 8,
        sequenceLength: 5,
        highlightDuration: 650,
        pauseDuration: 150,
        baseScore: 80,
        difficulty: '⭐⭐⭐ Difícil',
        name: 'Anillo Grande',
        restrictedArea: 'ring',
        areaConfig: '6x6',
        useColors: true
    },
    {
        level: 9,
        sequenceLength: 6,
        highlightDuration: 600,
        pauseDuration: 100,
        baseScore: 90,
        difficulty: '⭐⭐⭐ Difícil',
        name: 'Anillo Extendido',
        restrictedArea: 'ring',
        areaConfig: '6x6',
        useColors: true
    },

    // FASE 5: TABLERO COMPLETO (64 casillas) - Maestría
    {
        level: 10,
        sequenceLength: 6,
        highlightDuration: 550,
        pauseDuration: 100,
        baseScore: 100,
        difficulty: '⭐⭐⭐⭐ Avanzado',
        name: 'Tablero Completo',
        restrictedArea: 'full',
        areaConfig: null,
        useColors: true
    }
];

/**
 * Niveles infinitos (nivel 11+)
 */
function getInfiniteLevel(levelNumber) {
    return {
        level: levelNumber,
        sequenceLength: 7 + (levelNumber - 10),
        highlightDuration: Math.max(200, 500 - (levelNumber - 10) * 20),
        pauseDuration: 50,
        baseScore: 100 + (levelNumber - 10) * 10,
        difficulty: '⭐⭐⭐⭐⭐ Supremo',
        name: `Infinito ${levelNumber}`,
        restrictedArea: 'full',
        areaConfig: null,
        useColors: true
    };
}

/**
 * Obtiene la configuración de un nivel
 * @param {number} levelNumber - Número del nivel (1-based)
 * @returns {Object} Configuración del nivel
 */
function getLevelConfig(levelNumber) {
    if (levelNumber <= 10) {
        return LEVELS[levelNumber - 1];
    }
    return getInfiniteLevel(levelNumber);
}

/**
 * Obtiene array de todas las coordenadas posibles (a1-h8)
 * @returns {Array<string>} Array de coordenadas
 */
function getAllSquares() {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const squares = [];

    for (const file of files) {
        for (const rank of ranks) {
            squares.push(`${file}${rank}`);
        }
    }

    return squares;
}

/**
 * Genera una secuencia aleatoria de coordenadas según configuración del nivel
 * @param {Object} levelConfig - Configuración del nivel
 * @returns {Array<string>} Array de coordenadas aleatorias sin repetir
 */
function generateRandomSequence(levelConfig) {
    let availableSquares = [];

    // Determinar qué casillas están disponibles según restrictedArea
    switch (levelConfig.restrictedArea) {
        case 'ring':
            availableSquares = window.ChessGameLibrary.BoardUtils.getRingSquares(levelConfig.areaConfig);
            break;
        case 'quadrant':
            availableSquares = window.ChessGameLibrary.BoardUtils.getQuadrantSquares(levelConfig.areaConfig);
            break;
        case 'rows':
            availableSquares = window.ChessGameLibrary.BoardUtils.getRowRangeSquares(
                levelConfig.areaConfig.start,
                levelConfig.areaConfig.end
            );
            break;
        case 'full':
        default:
            availableSquares = getAllSquares();
            break;
    }

    // Fisher-Yates shuffle
    const shuffled = [...availableSquares];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Tomar las primeras 'sequenceLength' casillas
    return shuffled.slice(0, levelConfig.sequenceLength);
}

/**
 * Obtiene el color para una posición en la secuencia
 * @param {number} index - Índice en la secuencia (0-based)
 * @returns {Object} Objeto con name, hex, shadowColor
 */
function getSequenceColor(index) {
    return SEQUENCE_COLORS[index % SEQUENCE_COLORS.length];
}

/**
 * Calcula el score total de un nivel
 * @param {number} level - Número del nivel
 * @param {boolean} isPerfect - Si se completó sin errores
 * @returns {number} Puntos ganados
 */
function calculateLevelScore(level, isPerfect = false) {
    const config = getLevelConfig(level);
    let score = config.baseScore;

    // Bonus por perfect
    if (isPerfect) {
        score += level * 5;
    }

    return score;
}

/**
 * Calcula el tiempo total de visualización de una secuencia
 * @param {number} level - Número del nivel
 * @returns {number} Tiempo total en milisegundos
 */
function calculateSequenceDuration(level) {
    const config = getLevelConfig(level);
    const { sequenceLength, highlightDuration, pauseDuration } = config;

    // Tiempo = (highlight + pause) * cantidad - última pausa
    return (highlightDuration + pauseDuration) * sequenceLength - pauseDuration;
}

/**
 * Calcula el tiempo recomendado para completar un nivel (para speed bonus)
 * @param {number} level - Número de nivel
 * @returns {number} Tiempo recomendado en milisegundos
 */
function getRecommendedTime(level) {
    const config = getLevelConfig(level);
    const baseTime = 2000;  // 2 segundos base
    const perSquare = 1500; // 1.5 segundos por casilla adicional

    return baseTime + (config.sequenceLength * perSquare);
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CoordinateSequence = window.CoordinateSequence || {};
    window.CoordinateSequence.Levels = {
        LEVELS,
        SEQUENCE_COLORS,
        getLevelConfig,
        getAllSquares,
        generateRandomSequence,
        getSequenceColor,
        calculateLevelScore,
        calculateSequenceDuration,
        getInfiniteLevel,
        getRecommendedTime
    };
}

console.log('📊 Coordinate Sequence - Levels V2 loaded');
console.log(`   Total predefined levels: ${LEVELS.length}`);
console.log(`   Infinite mode: Level ${LEVELS.length + 1}+`);
console.log(`   Colors available: ${SEQUENCE_COLORS.length}`);
