/**
 * WIN DETECTION
 * Checks for 5-in-a-row winning conditions
 */

const WinDetection = {
    /**
     * Check if placing/moving a piece at (row, col) creates a win
     * Returns { player, positions } if win found, null otherwise
     */
    checkWin(row, col) {
        const piece = GameState.getPieceAt(row, col);
        if (!piece) return null;

        const player = piece.player;

        // Check all 4 directions
        const directions = [
            { dr: 0, dc: 1 },   // Horizontal
            { dr: 1, dc: 0 },   // Vertical
            { dr: 1, dc: 1 },   // Diagonal \
            { dr: 1, dc: -1 }   // Diagonal /
        ];

        for (const dir of directions) {
            const result = this.checkDirection(row, col, dir.dr, dir.dc, player);
            if (result && result.positions.length >= 5) {
                return { player, positions: result.positions };
            }
        }

        return null;
    },

    /**
     * Check a specific direction for consecutive pieces
     * Returns { positions } if 5+ found
     */
    checkDirection(row, col, dr, dc, player) {
        const positions = [{ row, col }];

        // Check forward
        let r = row + dr;
        let c = col + dc;
        while (this.isInBounds(r, c)) {
            const piece = GameState.getPieceAt(r, c);
            if (piece && piece.player === player) {
                positions.push({ row: r, col: c });
                r += dr;
                c += dc;
            } else {
                break;
            }
        }

        // Check backward
        r = row - dr;
        c = col - dc;
        while (this.isInBounds(r, c)) {
            const piece = GameState.getPieceAt(r, c);
            if (piece && piece.player === player) {
                positions.push({ row: r, col: c });
                r -= dr;
                c -= dc;
            } else {
                break;
            }
        }

        return { positions };
    },

    /**
     * Check if position is within board bounds
     */
    isInBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    },

    /**
     * Check for draw condition
     * Returns true if no valid moves exist for current player
     */
    checkDraw() {
        if (GameState.phase !== 'chess') return false;

        // Check if current player has any valid moves
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = GameState.getPieceAt(row, col);
                if (piece && piece.player === GameState.currentPlayer) {
                    const validMoves = PieceManager.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        return false; // At least one valid move exists
                    }
                }
            }
        }

        // No valid moves for current player
        return true;
    }
};
