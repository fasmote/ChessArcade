/**
 * ============================================
 * MEMORY MATRIX - SISTEMA DE NIVELES
 * ============================================
 * Configuración de niveles progresivos
 * Desde niños de 4 años hasta adultos expertos
 */

// ============================================
// CONFIGURACIÓN DE NIVELES
// ============================================

const LEVELS = [
    // NIVEL 1: Preescolar (4-5 años)
    {
        level: 1,
        name: 'Principiante',
        description: 'Perfecto para comenzar',
        ageRange: '4-5 años',
        pieceCount: 2,  // 2 reyes (siempre están ambos)
        memorizationTime: 10000,  // 10 segundos (más generoso)
        difficulty: 'easy',
        pieceTypes: ['K', 'Q'],
        allowedColors: ['w', 'b'],
        attemptsRequired: 10,  // 10 intentos exitosos para pasar nivel
        hidePiecesConfig: {
            // Intentos 1-8: Solo desaparece 1 pieza (el rey negro)
            // Intentos 9-10: Desaparecen ambas piezas
            progressiveHiding: [
                { attempts: [1, 2, 3, 4, 5, 6, 7, 8], hideCount: 1, hideIndices: [1] }, // Solo bK
                { attempts: [9, 10], hideCount: 2, hideIndices: [0, 1] }  // Ambos
            ]
        }
    },

    // NIVEL 2: Infantil (6-7 años)
    {
        level: 2,
        name: 'Explorador',
        description: '¡Vas mejorando!',
        ageRange: '6-7 años',
        pieceCount: 3,
        memorizationTime: 10000, // 10 segundos
        difficulty: 'easy',
        pieceTypes: ['K', 'Q', 'R'], // Agregar torres
        allowedColors: ['w', 'b']
    },

    // NIVEL 3: Junior (8-10 años)
    {
        level: 3,
        name: 'Aventurero',
        description: 'Buen trabajo',
        ageRange: '8-10 años',
        pieceCount: 4,
        memorizationTime: 12000, // 12 segundos
        difficulty: 'medium',
        pieceTypes: ['K', 'Q', 'R', 'B'], // Agregar alfiles
        allowedColors: ['w', 'b']
    },

    // NIVEL 4: Intermedio (11-14 años)
    {
        level: 4,
        name: 'Estratega',
        description: '¡Impresionante!',
        ageRange: '11-14 años',
        pieceCount: 5,
        memorizationTime: 14000, // 14 segundos
        difficulty: 'medium',
        pieceTypes: ['K', 'Q', 'R', 'B', 'N'], // Agregar caballos
        allowedColors: ['w', 'b']
    },

    // NIVEL 5: Avanzado (15+ años)
    {
        level: 5,
        name: 'Maestro',
        description: 'Nivel avanzado',
        ageRange: '15+ años',
        pieceCount: 6,
        memorizationTime: 15000, // 15 segundos
        difficulty: 'hard',
        pieceTypes: ['K', 'Q', 'R', 'B', 'N', 'P'], // Todas las piezas
        allowedColors: ['w', 'b']
    },

    // NIVEL 6: Experto
    {
        level: 6,
        name: 'Gran Maestro',
        description: '¡Extraordinario!',
        ageRange: 'Experto',
        pieceCount: 7,
        memorizationTime: 16000,
        difficulty: 'hard',
        pieceTypes: ['K', 'Q', 'R', 'B', 'N', 'P'],
        allowedColors: ['w', 'b']
    },

    // NIVEL 7: Élite
    {
        level: 7,
        name: 'Súper Gran Maestro',
        description: 'Nivel élite',
        ageRange: 'Élite',
        pieceCount: 8,
        memorizationTime: 18000,
        difficulty: 'expert',
        pieceTypes: ['K', 'Q', 'R', 'B', 'N', 'P'],
        allowedColors: ['w', 'b']
    },

    // NIVEL 8: Leyenda
    {
        level: 8,
        name: 'Leyenda',
        description: '¡Increíble memoria!',
        ageRange: 'Leyenda',
        pieceCount: 10,
        memorizationTime: 20000,
        difficulty: 'expert',
        pieceTypes: ['K', 'Q', 'R', 'B', 'N', 'P'],
        allowedColors: ['w', 'b']
    }
];

// ============================================
// GENERADOR DE POSICIONES ALEATORIAS
// ============================================

/**
 * Genera posición aleatoria para un nivel
 * IMPORTANTE: Siempre incluye ambos reyes (wK y bK) como piezas base
 * @param {number} levelNumber - Número de nivel (1-8)
 * @returns {Array} Array de objetos {square: 'e4', piece: 'wK'}
 */
function generateRandomPosition(levelNumber) {
    const level = LEVELS[levelNumber - 1];
    if (!level) {
        console.error(`❌ Nivel ${levelNumber} no existe`);
        return [];
    }

    console.log(`🎲 Generando posición aleatoria para Nivel ${levelNumber}: ${level.name}`);

    const position = [];
    const usedSquares = new Set();

    // ============================================
    // PASO 1: SIEMPRE agregar ambos reyes primero
    // ============================================

    // Rey blanco
    let wKingSquare = getRandomSquare();
    usedSquares.add(wKingSquare);
    position.push({
        square: wKingSquare,
        piece: 'wK'
    });
    console.log(`  👑 wK en ${wKingSquare} (SIEMPRE)`);

    // Rey negro
    let bKingSquare;
    do {
        bKingSquare = getRandomSquare();
    } while (usedSquares.has(bKingSquare));

    usedSquares.add(bKingSquare);
    position.push({
        square: bKingSquare,
        piece: 'bK'
    });
    console.log(`  👑 bK en ${bKingSquare} (SIEMPRE)`);

    // ============================================
    // PASO 2: Agregar piezas adicionales
    // ============================================
    // Restar 2 porque ya tenemos los 2 reyes
    const additionalPieces = level.pieceCount - 2;

    for (let i = 0; i < additionalPieces; i++) {
        // Generar casilla aleatoria única
        let square;
        do {
            square = getRandomSquare();
        } while (usedSquares.has(square));

        usedSquares.add(square);

        // Seleccionar tipo de pieza aleatorio (EXCLUYENDO rey)
        const availableTypes = level.pieceTypes.filter(type => type !== 'K');
        const pieceType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

        // Seleccionar color aleatorio
        const color = level.allowedColors[Math.floor(Math.random() * level.allowedColors.length)];

        const pieceCode = color + pieceType;

        position.push({
            square: square,
            piece: pieceCode
        });

        console.log(`  📍 ${pieceCode} en ${square}`);
    }

    return position;
}

/**
 * Genera una casilla aleatoria del tablero
 * @returns {string} Coordenada algebraica (ej: 'e4')
 */
function getRandomSquare() {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const file = files[Math.floor(Math.random() * files.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];

    return file + rank;
}

/**
 * Obtiene configuración de un nivel
 * @param {number} levelNumber - Número de nivel
 * @returns {Object} Configuración del nivel
 */
function getLevelConfig(levelNumber) {
    return LEVELS[levelNumber - 1] || LEVELS[0];
}

/**
 * Obtiene cantidad total de niveles
 * @returns {number}
 */
function getTotalLevels() {
    return LEVELS.length;
}

/**
 * Determina qué piezas ocultar según el intento actual
 * @param {number} levelNumber - Nivel actual
 * @param {number} attemptNumber - Intento actual (1-10)
 * @param {Array} position - Posición completa
 * @returns {Array} Array de objetos {square, piece} a ocultar
 */
function getPiecesToHide(levelNumber, attemptNumber, position) {
    const level = getLevelConfig(levelNumber);

    // Si no hay configuración, ocultar todas (comportamiento por defecto)
    if (!level.hidePiecesConfig || !level.hidePiecesConfig.progressiveHiding) {
        return position;
    }

    // Buscar configuración para este intento
    const config = level.hidePiecesConfig.progressiveHiding.find(cfg =>
        cfg.attempts.includes(attemptNumber)
    );

    if (!config) {
        // Si no hay config específica, ocultar todas
        return position;
    }

    // Retornar solo las piezas indicadas por hideIndices
    const piecesToHide = config.hideIndices.map(index => position[index]).filter(Boolean);

    console.log(`🎯 Intento ${attemptNumber}: Ocultando ${piecesToHide.length}/${position.length} piezas`);

    return piecesToHide;
}

/**
 * Valida si un nivel existe
 * @param {number} levelNumber
 * @returns {boolean}
 */
function isValidLevel(levelNumber) {
    return levelNumber >= 1 && levelNumber <= LEVELS.length;
}

// ============================================
// VARIANTES DE DIFICULTAD
// ============================================

/**
 * Genera posición con restricciones espaciales
 * Para niveles avanzados: piezas más juntas (más difícil)
 */
function generateClusteredPosition(levelNumber) {
    const level = getLevelConfig(levelNumber);
    const position = [];
    const usedSquares = new Set();

    // Elegir un cuadrante aleatorio del tablero
    const quadrants = [
        { files: ['a', 'b', 'c', 'd'], ranks: ['1', '2', '3', '4'] }, // Esquina inferior izquierda
        { files: ['e', 'f', 'g', 'h'], ranks: ['1', '2', '3', '4'] }, // Esquina inferior derecha
        { files: ['a', 'b', 'c', 'd'], ranks: ['5', '6', '7', '8'] }, // Esquina superior izquierda
        { files: ['e', 'f', 'g', 'h'], ranks: ['5', '6', '7', '8'] }  // Esquina superior derecha
    ];

    const quadrant = quadrants[Math.floor(Math.random() * quadrants.length)];

    for (let i = 0; i < level.pieceCount; i++) {
        let square;
        do {
            const file = quadrant.files[Math.floor(Math.random() * quadrant.files.length)];
            const rank = quadrant.ranks[Math.floor(Math.random() * quadrant.ranks.length)];
            square = file + rank;
        } while (usedSquares.has(square));

        usedSquares.add(square);

        const pieceType = level.pieceTypes[Math.floor(Math.random() * level.pieceTypes.length)];
        const color = level.allowedColors[Math.floor(Math.random() * level.allowedColors.length)];

        position.push({
            square: square,
            piece: color + pieceType
        });
    }

    return position;
}

/**
 * Genera posición simétrica (bonita visualmente)
 * Para niveles intermedios
 */
function generateSymmetricPosition(levelNumber) {
    const level = getLevelConfig(levelNumber);
    const position = [];
    const piecesPerSide = Math.floor(level.pieceCount / 2);

    // Generar piezas en un lado
    for (let i = 0; i < piecesPerSide; i++) {
        const file = ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)];
        const rank = (Math.floor(Math.random() * 8) + 1).toString();
        const square = file + rank;

        const pieceType = level.pieceTypes[Math.floor(Math.random() * level.pieceTypes.length)];
        const color = 'w';

        position.push({ square, piece: color + pieceType });

        // Pieza simétrica en el otro lado
        const mirrorFile = String.fromCharCode('h'.charCodeAt(0) - (file.charCodeAt(0) - 'a'.charCodeAt(0)));
        const mirrorSquare = mirrorFile + rank;
        position.push({ square: mirrorSquare, piece: 'b' + pieceType });
    }

    // Si quedan piezas impares, agregar una en el centro
    if (level.pieceCount % 2 !== 0) {
        const centerFiles = ['d', 'e'];
        const file = centerFiles[Math.floor(Math.random() * 2)];
        const rank = (Math.floor(Math.random() * 8) + 1).toString();
        const pieceType = level.pieceTypes[Math.floor(Math.random() * level.pieceTypes.length)];

        position.push({
            square: file + rank,
            piece: 'w' + pieceType
        });
    }

    return position;
}

// ============================================
// EXPORTAR
// ============================================

if (typeof window !== 'undefined') {
    window.MemoryMatrixLevels = {
        LEVELS,
        generateRandomPosition,
        generateClusteredPosition,
        generateSymmetricPosition,
        getLevelConfig,
        getTotalLevels,
        isValidLevel,
        getPiecesToHide
    };
}

console.log('📊 Sistema de niveles cargado:', LEVELS.length, 'niveles disponibles');
