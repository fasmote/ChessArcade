/**
 * ============================================
 * COORDINATE SEQUENCE - LEVELS
 * ============================================
 * Configuración de niveles de dificultad
 *
 * @version 1.0.0
 * @author ChessArcade Team
 */

/**
 * Configuración de niveles
 *
 * Cada nivel define:
 * - sequenceLength: Cantidad de casillas en la secuencia
 * - highlightDuration: Tiempo que cada casilla permanece iluminada (ms)
 * - pauseDuration: Pausa entre casillas (ms)
 * - baseScore: Puntos base por completar el nivel
 */
const LEVELS = [
    {
        level: 1,
        sequenceLength: 3,
        highlightDuration: 800,
        pauseDuration: 200,
        baseScore: 10,
        difficulty: '⭐ Fácil',
        name: 'Principiante'
    },
    {
        level: 2,
        sequenceLength: 4,
        highlightDuration: 750,
        pauseDuration: 200,
        baseScore: 20,
        difficulty: '⭐ Fácil',
        name: 'Aprendiz'
    },
    {
        level: 3,
        sequenceLength: 5,
        highlightDuration: 700,
        pauseDuration: 150,
        baseScore: 30,
        difficulty: '⭐⭐ Medio',
        name: 'Estudiante'
    },
    {
        level: 4,
        sequenceLength: 6,
        highlightDuration: 650,
        pauseDuration: 150,
        baseScore: 40,
        difficulty: '⭐⭐ Medio',
        name: 'Aficionado'
    },
    {
        level: 5,
        sequenceLength: 7,
        highlightDuration: 600,
        pauseDuration: 150,
        baseScore: 50,
        difficulty: '⭐⭐⭐ Difícil',
        name: 'Competente'
    },
    {
        level: 6,
        sequenceLength: 8,
        highlightDuration: 550,
        pauseDuration: 100,
        baseScore: 60,
        difficulty: '⭐⭐⭐ Difícil',
        name: 'Experto'
    },
    {
        level: 7,
        sequenceLength: 9,
        highlightDuration: 500,
        pauseDuration: 100,
        baseScore: 70,
        difficulty: '⭐⭐⭐⭐ Avanzado',
        name: 'Maestro'
    },
    {
        level: 8,
        sequenceLength: 10,
        highlightDuration: 450,
        pauseDuration: 100,
        baseScore: 80,
        difficulty: '⭐⭐⭐⭐ Avanzado',
        name: 'Gran Maestro'
    },
    {
        level: 9,
        sequenceLength: 11,
        highlightDuration: 400,
        pauseDuration: 50,
        baseScore: 90,
        difficulty: '⭐⭐⭐⭐⭐ Experto',
        name: 'Elite'
    },
    {
        level: 10,
        sequenceLength: 12,
        highlightDuration: 350,
        pauseDuration: 50,
        baseScore: 100,
        difficulty: '⭐⭐⭐⭐⭐ Experto',
        name: 'Leyenda'
    }
];

/**
 * Niveles infinitos (nivel 11+)
 * A partir del nivel 11, se usa esta configuración dinámica
 */
function getInfiniteLevel(levelNumber) {
    return {
        level: levelNumber,
        sequenceLength: 12 + (levelNumber - 10),  // 13, 14, 15, etc.
        highlightDuration: Math.max(200, 350 - (levelNumber - 10) * 10),  // Min 200ms
        pauseDuration: 50,
        baseScore: 100 + (levelNumber - 10) * 10,
        difficulty: '⭐⭐⭐⭐⭐ Supremo',
        name: `Nivel ${levelNumber}`
    };
}

/**
 * Obtiene la configuración de un nivel
 * @param {number} levelNumber - Número del nivel (1-based)
 * @returns {Object} Configuración del nivel
 */
function getLevelConfig(levelNumber) {
    // Niveles 1-10: predefinidos
    if (levelNumber <= 10) {
        return LEVELS[levelNumber - 1];
    }

    // Nivel 11+: generación dinámica
    return getInfiniteLevel(levelNumber);
}

/**
 * Genera array de todas las coordenadas posibles (a1-h8)
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
 * Genera una secuencia aleatoria de coordenadas
 * @param {number} length - Cantidad de casillas en la secuencia
 * @returns {Array<string>} Array de coordenadas aleatorias sin repetir
 */
function generateRandomSequence(length) {
    const allSquares = getAllSquares();
    const sequence = [];

    // Mezclar array (Fisher-Yates shuffle)
    const shuffled = [...allSquares];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Tomar las primeras 'length' casillas
    return shuffled.slice(0, length);
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

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CoordinateSequence = window.CoordinateSequence || {};
    window.CoordinateSequence.Levels = {
        LEVELS,
        getLevelConfig,
        getAllSquares,
        generateRandomSequence,
        calculateLevelScore,
        calculateSequenceDuration,
        getInfiniteLevel
    };
}

console.log('📊 Coordinate Sequence - Levels loaded');
console.log(`   Total predefined levels: ${LEVELS.length}`);
console.log(`   Infinite mode: Level ${LEVELS.length + 1}+`);
