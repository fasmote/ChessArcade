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
        getAdjacentSquares
    };
}

console.log('♟️ ChessGameLibrary - BoardUtils loaded');
