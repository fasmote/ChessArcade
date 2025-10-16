/**
 * ============================================
 * CHESS GAME LIBRARY - BOARD UTILITIES
 * ============================================
 * Utilidades para manipulación de tablero de ajedrez
 *
 * @version 1.0.0
 * @author ChessArcade Team
 */

/**
 * Convierte coordenada de ajedrez (ej: "e4") a índice 0-63
 * @param {string} square - Coordenada en notación algebraica (ej: "e4")
 * @returns {number} Índice del 0 al 63
 */
function squareToIndex(square) {
    const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0); // 0-7
    const rank = 8 - parseInt(square[1]); // 0-7 (invertido)
    return rank * 8 + file;
}

/**
 * Convierte índice 0-63 a coordenada de ajedrez
 * @param {number} index - Índice del 0 al 63
 * @returns {string} Coordenada en notación algebraica (ej: "e4")
 */
function indexToSquare(index) {
    const file = String.fromCharCode('a'.charCodeAt(0) + (index % 8));
    const rank = 8 - Math.floor(index / 8);
    return `${file}${rank}`;
}

/**
 * Obtiene todas las coordenadas del tablero (a1-h8)
 * @returns {Array<string>} Array de 64 coordenadas
 */
function getAllSquares() {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

    for (const file of files) {
        for (const rank of ranks) {
            squares.push(`${file}${rank}`);
        }
    }

    return squares;
}

/**
 * Verifica si una coordenada es válida
 * @param {string} square - Coordenada a validar
 * @returns {boolean} True si es válida (a1-h8)
 */
function isValidSquare(square) {
    if (typeof square !== 'string' || square.length !== 2) return false;
    const file = square[0];
    const rank = square[1];
    return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
}

/**
 * Calcula la distancia Manhattan entre dos casillas
 * @param {string} sq1 - Primera casilla (ej: "e4")
 * @param {string} sq2 - Segunda casilla (ej: "d5")
 * @returns {number} Distancia Manhattan (suma de diferencias absolutas)
 */
function manhattanDistance(sq1, sq2) {
    const file1 = sq1[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank1 = parseInt(sq1[1]);
    const file2 = sq2[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank2 = parseInt(sq2[1]);

    return Math.abs(file1 - file2) + Math.abs(rank1 - rank2);
}

/**
 * Calcula la distancia Chebyshev entre dos casillas (distancia de rey)
 * @param {string} sq1 - Primera casilla
 * @param {string} sq2 - Segunda casilla
 * @returns {number} Distancia Chebyshev (máximo de diferencias absolutas)
 */
function chebyshevDistance(sq1, sq2) {
    const file1 = sq1[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank1 = parseInt(sq1[1]);
    const file2 = sq2[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank2 = parseInt(sq2[1]);

    return Math.max(Math.abs(file1 - file2), Math.abs(rank1 - rank2));
}

/**
 * Obtiene el color de una casilla (light o dark)
 * @param {string} square - Coordenada (ej: "e4")
 * @returns {string} 'light' o 'dark'
 */
function getSquareColor(square) {
    const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square[1]);
    return (file + rank) % 2 === 0 ? 'dark' : 'light';
}

/**
 * Obtiene las casillas adyacentes (8 direcciones)
 * @param {string} square - Coordenada central
 * @returns {Array<string>} Array de casillas adyacentes válidas
 */
function getAdjacentSquares(square) {
    const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square[1]);
    const adjacent = [];

    const deltas = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [df, dr] of deltas) {
        const newFile = String.fromCharCode('a'.charCodeAt(0) + file + df);
        const newRank = rank + dr;
        const newSquare = `${newFile}${newRank}`;

        if (isValidSquare(newSquare)) {
            adjacent.push(newSquare);
        }
    }

    return adjacent;
}

/**
 * Obtiene casillas de un anillo concéntrico
 * @param {string} size - Tamaño: '2x2' (centro), '4x4', '6x6', '8x8' (completo)
 * @returns {Array<string>} Array de casillas del anillo
 */
function getRingSquares(size) {
    const rings = {
        '2x2': ['d4', 'd5', 'e4', 'e5'], // Centro 4 casillas
        '4x4': [ // Anillo 4x4 (16 casillas)
            'c3', 'd3', 'e3', 'f3',
            'c4', 'd4', 'e4', 'f4',
            'c5', 'd5', 'e5', 'f5',
            'c6', 'd6', 'e6', 'f6'
        ],
        '6x6': [ // Anillo 6x6 (36 casillas)
            'b2', 'c2', 'd2', 'e2', 'f2', 'g2',
            'b3', 'c3', 'd3', 'e3', 'f3', 'g3',
            'b4', 'c4', 'd4', 'e4', 'f4', 'g4',
            'b5', 'c5', 'd5', 'e5', 'f5', 'g5',
            'b6', 'c6', 'd6', 'e6', 'f6', 'g6',
            'b7', 'c7', 'd7', 'e7', 'f7', 'g7'
        ],
        '8x8': getAllSquares() // Tablero completo (64)
    };

    return rings[size] || getAllSquares();
}

/**
 * Obtiene casillas de un cuadrante
 * @param {string} quadrant - 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 * @returns {Array<string>} Array de casillas del cuadrante
 */
function getQuadrantSquares(quadrant) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const squares = [];

    let fileRange, rankRange;

    switch (quadrant) {
        case 'top-left':
            fileRange = files.slice(0, 4); // a-d
            rankRange = ranks.slice(0, 4); // 8-5
            break;
        case 'top-right':
            fileRange = files.slice(4, 8); // e-h
            rankRange = ranks.slice(0, 4); // 8-5
            break;
        case 'bottom-left':
            fileRange = files.slice(0, 4); // a-d
            rankRange = ranks.slice(4, 8); // 4-1
            break;
        case 'bottom-right':
            fileRange = files.slice(4, 8); // e-h
            rankRange = ranks.slice(4, 8); // 4-1
            break;
        default:
            return getAllSquares();
    }

    for (const file of fileRange) {
        for (const rank of rankRange) {
            squares.push(`${file}${rank}`);
        }
    }

    return squares;
}

/**
 * Obtiene casillas de filas específicas
 * @param {number} startRank - Fila inicial (1-8)
 * @param {number} endRank - Fila final (1-8)
 * @returns {Array<string>} Array de casillas en ese rango de filas
 */
function getRowRangeSquares(startRank, endRank) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const squares = [];
    const minRank = Math.min(startRank, endRank);
    const maxRank = Math.max(startRank, endRank);

    for (const file of files) {
        for (let rank = minRank; rank <= maxRank; rank++) {
            squares.push(`${file}${rank}`);
        }
    }

    return squares;
}

/**
 * Obtiene casillas alcanzables por movimiento de caballo
 * @param {string} square - Coordenada origen (ej: "e4")
 * @returns {Array<string>} Array de casillas alcanzables por el caballo
 */
function getKnightMoves(square) {
    const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square[1]);
    const moves = [];

    // 8 posibles movimientos del caballo (L-shape)
    const deltas = [
        [-2, -1], [-2, 1],  // 2 izq, 1 arriba/abajo
        [-1, -2], [-1, 2],  // 1 izq, 2 arriba/abajo
        [1, -2],  [1, 2],   // 1 der, 2 arriba/abajo
        [2, -1],  [2, 1]    // 2 der, 1 arriba/abajo
    ];

    for (const [df, dr] of deltas) {
        const newFile = String.fromCharCode('a'.charCodeAt(0) + file + df);
        const newRank = rank + dr;
        const newSquare = `${newFile}${newRank}`;

        if (isValidSquare(newSquare)) {
            moves.push(newSquare);
        }
    }

    return moves;
}

/**
 * Obtiene casillas alcanzables por movimiento de rey O caballo
 * @param {string} square - Coordenada origen
 * @returns {Array<string>} Array de casillas alcanzables (rey + caballo sin duplicados)
 */
function getKingOrKnightMoves(square) {
    const kingMoves = getAdjacentSquares(square);
    const knightMoves = getKnightMoves(square);

    // Combinar y eliminar duplicados
    const allMoves = [...new Set([...kingMoves, ...knightMoves])];
    return allMoves;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ChessGameLibrary = window.ChessGameLibrary || {};
    window.ChessGameLibrary.BoardUtils = {
        squareToIndex,
        indexToSquare,
        getAllSquares,
        isValidSquare,
        manhattanDistance,
        chebyshevDistance,
        getSquareColor,
        getAdjacentSquares,
        getKnightMoves,
        getKingOrKnightMoves,
        getRingSquares,
        getQuadrantSquares,
        getRowRangeSquares
    };
}

console.log('♟️ ChessGameLibrary - BoardUtils loaded');
