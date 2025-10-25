/**
 * ==========================================
 * GAME STATE MANAGEMENT (Gestión del Estado del Juego)
 * ==========================================
 *
 * Este módulo es el "cerebro" del juego. Maneja TODOS los datos del estado actual:
 * - En qué fase estamos (gravity o chess)
 * - De quién es el turno
 * - Qué piezas hay en el tablero
 * - Cuántas piezas tiene cada jugador
 * - Historial de movimientos
 *
 * PATRÓN DE DISEÑO: State Object Pattern
 * - Un solo objeto centralizado contiene todo el estado
 * - Otros módulos leen de aquí pero no modifican directamente
 * - Funciones helper proveen acceso controlado a los datos
 *
 * VENTAJAS:
 * - Fácil debuggear (todo está en un lugar)
 * - Fácil guardar/cargar juegos (solo serializar este objeto)
 * - Evita bugs de sincronización entre componentes
 */

const GameState = {
    // Current game phase
    phase: 'gravity', // 'gravity' or 'chess'

    // Current player ('cyan' or 'magenta')
    currentPlayer: 'cyan',

    /**
     * TABLERO (Board State)
     *
     * Estructura de datos 2D (matriz 8x8) que representa el tablero.
     *
     * IMPORTANTE: Array(8).fill(null) NO funciona para arrays 2D
     * Problema: fill() copia la REFERENCIA, creando 8 referencias al MISMO array
     * Solución: Usar .map() para crear arrays NUEVOS independientes
     *
     * Cada celda puede ser:
     * - null: casilla vacía
     * - objeto: { player: 'cyan'|'magenta', type: 'rook'|'knight'|... }
     *
     * Ejemplo de tablero:
     * board[0][0] = null              // a8 vacía
     * board[7][0] = { player: 'cyan', type: 'rook' } // a1 tiene torre cyan
     */
    board: Array(8).fill(null).map(() => Array(8).fill(null)),

    // Piece inventories for each player
    inventory: {
        cyan: {
            rook: 2,
            knight: 2,
            bishop: 2,
            queen: 1,
            king: 1
        },
        magenta: {
            rook: 2,
            knight: 2,
            bishop: 2,
            queen: 1,
            king: 1
        }
    },

    // Pieces placed count
    piecesPlaced: {
        cyan: 0,
        magenta: 0
    },

    // Selected piece (for chess phase)
    selectedPiece: null, // { row, col }

    // Selected piece type (for gravity phase)
    selectedPieceType: null, // 'rook', 'knight', 'bishop', 'queen', 'king'

    // Move history (for undo)
    moveHistory: [],

    // Game over state
    gameOver: false,
    winner: null,

    /**
     * Initialize or reset game state
     */
    init() {
        this.phase = 'gravity';
        this.currentPlayer = 'cyan';
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));

        this.inventory = {
            cyan: { rook: 2, knight: 2, bishop: 2, queen: 1, king: 1 },
            magenta: { rook: 2, knight: 2, bishop: 2, queen: 1, king: 1 }
        };

        this.piecesPlaced = { cyan: 0, magenta: 0 };
        this.selectedPiece = null;
        this.selectedPieceType = null;
        this.moveHistory = [];
        this.gameOver = false;
        this.winner = null;

        console.log('🎮 Game state initialized');
    },

    /**
     * Get total pieces remaining for a player
     */
    getTotalPieces(player) {
        const inv = this.inventory[player];
        return inv.rook + inv.knight + inv.bishop + inv.queen + inv.king;
    },

    /**
     * Get next piece type for a player (in order)
     */
    getNextPieceType(player) {
        const inv = this.inventory[player];
        if (inv.rook > 0) return 'rook';
        if (inv.knight > 0) return 'knight';
        if (inv.bishop > 0) return 'bishop';
        if (inv.queen > 0) return 'queen';
        if (inv.king > 0) return 'king';
        return null;
    },

    /**
     * Place a piece on the board (gravity phase)
     */
    placePiece(col, pieceType) {
        // Find lowest empty row in this column
        for (let row = 7; row >= 0; row--) {
            if (this.board[row][col] === null) {
                this.board[row][col] = {
                    player: this.currentPlayer,
                    type: pieceType
                };

                // Update inventory
                this.inventory[this.currentPlayer][pieceType]--;
                this.piecesPlaced[this.currentPlayer]++;

                // Record move
                this.moveHistory.push({
                    phase: 'gravity',
                    player: this.currentPlayer,
                    type: pieceType,
                    row: row,
                    col: col
                });

                console.log(`📍 ${this.currentPlayer} placed ${pieceType} at (${row}, ${col})`);
                return { row, col };
            }
        }
        return null; // Column is full
    },

    /**
     * Move a piece (chess phase)
     */
    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];

        if (!piece) return false;

        // Move piece
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Record move
        this.moveHistory.push({
            phase: 'chess',
            player: this.currentPlayer,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece.type
        });

        console.log(`♟️ ${this.currentPlayer} moved ${piece.type} from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);
        return true;
    },

    /**
     * Switch to next player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'cyan' ? 'magenta' : 'cyan';
        console.log(`🔄 Turn: ${this.currentPlayer}`);
    },

    /**
     * Switch to chess phase
     */
    switchToChessPhase() {
        this.phase = 'chess';
        console.log('♟️ Switched to CHESS PHASE');
    },

    /**
     * Check if all pieces have been placed
     */
    isGravityPhaseComplete() {
        return this.piecesPlaced.cyan === 8 && this.piecesPlaced.magenta === 8;
    },

    /**
     * Get piece at position
     */
    getPieceAt(row, col) {
        if (row < 0 || row >= 8 || col < 0 || col >= 8) return null;
        return this.board[row][col];
    },

    /**
     * Check if square is empty
     */
    isEmpty(row, col) {
        return this.getPieceAt(row, col) === null;
    },

    /**
     * Print board state (for debugging)
     */
    printBoard() {
        console.log('📋 Current Board:');
        for (let row = 0; row < 8; row++) {
            let rowStr = '';
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const symbol = piece.player === 'cyan' ? 'C' : 'M';
                    rowStr += `[${symbol}${piece.type[0].toUpperCase()}] `;
                } else {
                    rowStr += '[ ] ';
                }
            }
            console.log(rowStr);
        }
    }
};
