/**
 * ============================================
 * CHESS GAME LIBRARY - UTILITIES
 * ============================================
 * Funciones utilitarias para juegos de ajedrez
 * Reutilizable para cualquier juego de ajedrez
 *
 * @version 1.0.0
 * @author ChessArcade Team
 * @license MIT
 */

// ============================================
// NOMBRES DE PIEZAS
// ============================================

/**
 * Convierte código de pieza a nombre legible en español
 * @param {string} piece - Código de pieza (ej: 'wK', 'bQ')
 * @returns {string} Nombre legible (ej: 'Rey Blanco', 'Dama Negra')
 *
 * @example
 * getPieceName('wK') // 'Rey Blanco'
 * getPieceName('bQ') // 'Dama Negra'
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
 * Convierte código de pieza a nombre legible en inglés
 * @param {string} piece - Código de pieza (ej: 'wK', 'bQ')
 * @returns {string} Nombre en inglés (ej: 'White King', 'Black Queen')
 */
function getPieceNameEN(piece) {
    if (!piece || piece.length !== 2) return piece;

    const color = piece[0] === 'w' ? 'White' : 'Black';
    const typeMap = {
        'K': 'King',
        'Q': 'Queen',
        'R': 'Rook',
        'B': 'Bishop',
        'N': 'Knight',
        'P': 'Pawn'
    };

    const type = typeMap[piece[1]] || piece[1];
    return `${color} ${type}`;
}

/**
 * Obtiene el símbolo Unicode de una pieza
 * @param {string} piece - Código de pieza (ej: 'wK', 'bQ')
 * @returns {string} Símbolo Unicode (ej: '♔', '♛')
 */
function getPieceSymbol(piece) {
    if (!piece || piece.length !== 2) return '';

    const symbols = {
        'wK': '♔',
        'wQ': '♕',
        'wR': '♖',
        'wB': '♗',
        'wN': '♘',
        'wP': '♙',
        'bK': '♚',
        'bQ': '♛',
        'bR': '♜',
        'bB': '♝',
        'bN': '♞',
        'bP': '♟'
    };

    return symbols[piece] || '';
}

/**
 * Obtiene solo el tipo de pieza (sin color)
 * @param {string} piece - Código de pieza (ej: 'wK', 'bQ')
 * @returns {string} Tipo de pieza (ej: 'Rey', 'Dama')
 */
function getPieceType(piece) {
    if (!piece || piece.length !== 2) return piece;

    const typeMap = {
        'K': 'Rey',
        'Q': 'Dama',
        'R': 'Torre',
        'B': 'Alfil',
        'N': 'Caballo',
        'P': 'Peón'
    };

    return typeMap[piece[1]] || piece[1];
}

/**
 * Obtiene solo el color de la pieza
 * @param {string} piece - Código de pieza (ej: 'wK', 'bQ')
 * @returns {string} Color ('Blanco' o 'Negro')
 */
function getPieceColor(piece) {
    if (!piece || piece.length < 1) return '';
    return piece[0] === 'w' ? 'Blanco' : 'Negro';
}

// ============================================
// COORDENADAS DE AJEDREZ
// ============================================

/**
 * Convierte notación algebraica a índice numérico
 * @param {string} square - Coordenada algebraica (ej: 'e4')
 * @returns {number} Índice (0-63 para tablero 8x8)
 */
function squareToIndex(square) {
    if (!square || square.length !== 2) return -1;

    const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // 0-7
    const rank = parseInt(square[1]) - 1; // 0-7

    if (file < 0 || file > 7 || rank < 0 || rank > 7) return -1;

    return rank * 8 + file;
}

/**
 * Convierte índice numérico a notación algebraica
 * @param {number} index - Índice (0-63)
 * @returns {string} Coordenada algebraica (ej: 'e4')
 */
function indexToSquare(index) {
    if (index < 0 || index > 63) return '';

    const file = String.fromCharCode('a'.charCodeAt(0) + (index % 8));
    const rank = Math.floor(index / 8) + 1;

    return file + rank;
}

/**
 * Obtiene la fila (rank) de una casilla
 * @param {string} square - Coordenada algebraica (ej: 'e4')
 * @returns {number} Número de fila (1-8)
 */
function getRank(square) {
    if (!square || square.length !== 2) return -1;
    return parseInt(square[1]);
}

/**
 * Obtiene la columna (file) de una casilla
 * @param {string} square - Coordenada algebraica (ej: 'e4')
 * @returns {string} Letra de columna ('a'-'h')
 */
function getFile(square) {
    if (!square || square.length !== 2) return '';
    return square[0];
}

// ============================================
// VALIDACIONES
// ============================================

/**
 * Verifica si una casilla es válida
 * @param {string} square - Coordenada algebraica
 * @returns {boolean}
 */
function isValidSquare(square) {
    if (!square || square.length !== 2) return false;

    const file = square[0];
    const rank = square[1];

    return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
}

/**
 * Verifica si un código de pieza es válido
 * @param {string} piece - Código de pieza
 * @returns {boolean}
 */
function isValidPiece(piece) {
    if (!piece || piece.length !== 2) return false;

    const validColors = ['w', 'b'];
    const validTypes = ['K', 'Q', 'R', 'B', 'N', 'P'];

    return validColors.includes(piece[0]) && validTypes.includes(piece[1]);
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

// Para uso como módulo ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getPieceName,
        getPieceNameEN,
        getPieceSymbol,
        getPieceType,
        getPieceColor,
        squareToIndex,
        indexToSquare,
        getRank,
        getFile,
        isValidSquare,
        isValidPiece
    };
}

// Para uso global en navegador
if (typeof window !== 'undefined') {
    window.ChessGameLibrary = window.ChessGameLibrary || {};
    window.ChessGameLibrary.Utils = {
        getPieceName,
        getPieceNameEN,
        getPieceSymbol,
        getPieceType,
        getPieceColor,
        squareToIndex,
        indexToSquare,
        getRank,
        getFile,
        isValidSquare,
        isValidPiece
    };
}

console.log('📦 ChessGameLibrary.Utils cargado');
