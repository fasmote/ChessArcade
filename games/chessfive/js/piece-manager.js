/**
 * PIECE MANAGER
 * Handles piece types, symbols, and validation
 */

const PieceManager = {
    // Piece unicode symbols
    symbols: {
        cyan: {
            rook: '♜',
            knight: '♞',
            bishop: '♝',
            queen: '♛',
            king: '♚'
        },
        magenta: {
            rook: '♖',
            knight: '♘',
            bishop: '♗',
            queen: '♕',
            king: '♔'
        }
    },

    /**
     * Get unicode symbol for a piece
     */
    getSymbol(player, type) {
        return this.symbols[player][type];
    },

    /**
     * Get all valid moves for a piece at (row, col)
     * Returns array of {row, col} positions
     */
    getValidMoves(row, col) {
        const piece = GameState.getPieceAt(row, col);
        if (!piece) return [];

        const moves = [];

        switch (piece.type) {
            case 'rook':
                this.addRookMoves(row, col, moves);
                break;
            case 'knight':
                this.addKnightMoves(row, col, moves);
                break;
            case 'bishop':
                this.addBishopMoves(row, col, moves);
                break;
            case 'queen':
                this.addQueenMoves(row, col, moves);
                break;
            case 'king':
                this.addKingMoves(row, col, moves);
                break;
        }

        return moves;
    },

    /**
     * Add rook moves (horizontal + vertical)
     */
    addRookMoves(row, col, moves) {
        const directions = [
            [-1, 0], // up
            [1, 0],  // down
            [0, -1], // left
            [0, 1]   // right
        ];

        for (const [dr, dc] of directions) {
            this.addDirectionalMoves(row, col, dr, dc, moves);
        }
    },

    /**
     * Add bishop moves (diagonal)
     */
    addBishopMoves(row, col, moves) {
        const directions = [
            [-1, -1], // up-left
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [1, 1]    // down-right
        ];

        for (const [dr, dc] of directions) {
            this.addDirectionalMoves(row, col, dr, dc, moves);
        }
    },

    /**
     * Add queen moves (rook + bishop)
     */
    addQueenMoves(row, col, moves) {
        this.addRookMoves(row, col, moves);
        this.addBishopMoves(row, col, moves);
    },

    /**
     * Add king moves (1 square in any direction)
     */
    addKingMoves(row, col, moves) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (this.isValidPosition(newRow, newCol) && GameState.isEmpty(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    },

    /**
     * Add knight moves (L-shape, can jump)
     */
    addKnightMoves(row, col, moves) {
        const offsets = [
            [-2, -1], [-2, 1],
            [-1, -2], [-1, 2],
            [1, -2],  [1, 2],
            [2, -1],  [2, 1]
        ];

        for (const [dr, dc] of offsets) {
            const newRow = row + dr;
            const newCol = col + dc;

            // Knight can jump, only check if destination is empty and in bounds
            if (this.isValidPosition(newRow, newCol) && GameState.isEmpty(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    },

    /**
     * Add moves in a specific direction (for rook, bishop, queen)
     * Stops when hitting a piece or board edge
     */
    addDirectionalMoves(row, col, dr, dc, moves) {
        let newRow = row + dr;
        let newCol = col + dc;

        while (this.isValidPosition(newRow, newCol)) {
            if (GameState.isEmpty(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
                newRow += dr;
                newCol += dc;
            } else {
                // Blocked by a piece (no capture in ChessFive)
                break;
            }
        }
    },

    /**
     * Check if position is within board bounds
     */
    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    },

    /**
     * Check if a move is valid
     */
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const validMoves = this.getValidMoves(fromRow, fromCol);
        return validMoves.some(move => move.row === toRow && move.col === toCol);
    }
};
