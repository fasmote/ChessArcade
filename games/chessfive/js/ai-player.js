/**
 * ==========================================
 * CHESSFIVE AI OPPONENT
 * ==========================================
 *
 * Implementación de IA para ChessFive usando estrategia inspirada en Gomoku.
 * La IA funciona en ambas fases del juego con diferentes estrategias.
 *
 * ARQUITECTURA:
 * - Gravity Phase: Evaluación de posicionamiento estratégico
 * - Chess Phase: Detección de amenazas estilo Gomoku + evaluación táctica
 *
 * ALGORITMO: Minimax simplificado (1 nivel) con evaluación heurística
 */

const ChessFiveAI = {
    // ==========================================
    // CONFIGURATION
    // ==========================================

    player: 'magenta', // AI plays as magenta by default
    thinkingTime: 800, // ms delay to simulate "thinking" (UX)

    // Scoring weights (inspired by Gomoku engines)
    WEIGHTS: {
        // Immediate win/loss
        WIN_NOW: 1000000,
        BLOCK_WIN: 500000,

        // Threats (Gomoku-style)
        OPEN_FOUR: 50000,    // _XXXX_ = almost certain win
        FOUR: 10000,         // XXXX_ or _XXXX = strong threat
        OPEN_THREE: 5000,    // _XXX_ = build to four
        THREE: 1000,         // XXX_ or _XXX = potential
        OPEN_TWO: 500,       // _XX_ = early game
        TWO: 100,            // XX_ or _XX = foundation

        // Positional bonuses
        MOBILITY: 50,        // More moves available = better
        CENTER: 20,          // Center pieces = better position

        // Gravity phase specific
        BLOCK_OPPONENT_DROP: 100,
        POTENTIAL_LINE: 50
    },

    // ==========================================
    // MAIN ENTRY POINT
    // ==========================================

    /**
     * Make AI move based on current game state
     * Returns: Promise that resolves when move is complete
     */
    async makeMove(gameState) {
        console.log(`🤖 AI (${this.player}) is thinking...`);

        // Add thinking delay for better UX
        await this.delay(this.thinkingTime);

        if (gameState.phase === 'gravity') {
            return await this.makeGravityMove(gameState);
        } else {
            return await this.makeChessMove(gameState);
        }
    },

    /**
     * Delay helper for async thinking time
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // ==========================================
    // GRAVITY PHASE AI
    // ==========================================

    /**
     * Make move during gravity phase (drop piece)
     */
    async makeGravityMove(gameState) {
        console.log('🤖 AI: Gravity Phase - Choosing where to drop');

        // Step 1: Choose which piece type to drop
        const pieceType = this.choosePieceType(gameState);

        // Step 2: Choose which column to drop in
        const bestCol = this.chooseBestColumn(gameState, pieceType);

        console.log(`🤖 AI Decision: Drop ${pieceType} in column ${bestCol}`);

        return {
            phase: 'gravity',
            pieceType: pieceType,
            col: bestCol
        };
    },

    /**
     * Choose which piece type to drop
     * Strategy: Prioritize pieces with good mobility for Phase 2
     */
    choosePieceType(gameState) {
        const inv = gameState.inventory[this.player];

        // Priority order (best mobility first)
        const priority = ['queen', 'rook', 'bishop', 'knight', 'king'];

        for (const type of priority) {
            if (inv[type] > 0) {
                return type;
            }
        }

        return null; // No pieces left (shouldn't happen)
    },

    /**
     * Choose best column to drop piece in
     */
    chooseBestColumn(gameState, pieceType) {
        let bestCol = -1;
        let bestScore = -Infinity;

        // Evaluate each column
        for (let col = 0; col < 8; col++) {
            if (!this.canDropInColumn(gameState.board, col)) {
                continue; // Column is full
            }

            // Simulate drop
            const row = this.getDropRow(gameState.board, col);
            const score = this.evaluateDropPosition(gameState, row, col, pieceType);

            console.log(`  Column ${col}: score ${score}`);

            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
        }

        return bestCol;
    },

    /**
     * Check if can drop in column
     */
    canDropInColumn(board, col) {
        return board[0][col] === null; // Top row must be empty
    },

    /**
     * Get row where piece would land (gravity)
     */
    getDropRow(board, col) {
        for (let row = 7; row >= 0; row--) {
            if (board[row][col] === null) {
                return row;
            }
        }
        return -1; // Column full (shouldn't happen if canDropInColumn checked)
    },

    /**
     * Evaluate how good it is to drop piece at (row, col)
     */
    evaluateDropPosition(gameState, row, col, pieceType) {
        let score = 0;

        // Simulate placing piece
        const board = gameState.board;
        board[row][col] = { player: this.player, type: pieceType };

        // 1. Check if this creates 5 in a row (instant win in gravity phase)
        if (this.checkLineAt(board, row, col, this.player) >= 5) {
            score += this.WEIGHTS.WIN_NOW;
        }

        // 2. Count potential lines (sets up for Phase 2)
        score += this.countPotentialLines(board, row, col, this.player) * this.WEIGHTS.POTENTIAL_LINE;

        // 3. Check if blocks opponent's potential 5
        const opponentPlayer = (this.player === 'cyan') ? 'magenta' : 'cyan';
        const opponentThreat = this.checkOpponentThreat(board, col, opponentPlayer);
        if (opponentThreat) {
            score += this.WEIGHTS.BLOCK_OPPONENT_DROP;
        }

        // 4. Prefer center columns (better mobility in Phase 2)
        const centerBonus = this.getCenterBonus(col);
        score += centerBonus * this.WEIGHTS.CENTER;

        // 5. Evaluate mobility for Phase 2
        const mobility = this.evaluateFutureMobility(board, row, col, pieceType);
        score += mobility * this.WEIGHTS.MOBILITY;

        // Undo simulation
        board[row][col] = null;

        return score;
    },

    /**
     * Check if dropping here blocks opponent from getting 5 in a row
     */
    checkOpponentThreat(board, col, opponentPlayer) {
        const row = this.getDropRow(board, col);
        if (row === -1) return false;

        // Simulate opponent dropping
        board[row][col] = { player: opponentPlayer, type: 'queen' }; // Assume queen
        const wouldWin = this.checkLineAt(board, row, col, opponentPlayer) >= 5;
        board[row][col] = null;

        return wouldWin;
    },

    /**
     * Get center bonus (prefer center columns)
     */
    getCenterBonus(col) {
        // Center columns (3, 4) get highest bonus
        const distFromCenter = Math.abs(col - 3.5);
        return 4 - distFromCenter;
    },

    /**
     * Evaluate how mobile this piece will be in Phase 2
     */
    evaluateFutureMobility(board, row, col, pieceType) {
        // Simple heuristic: pieces near center and with space around them = more mobile
        let mobility = 0;

        // Check surrounding empty spaces
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    if (board[newRow][newCol] === null) {
                        mobility++;
                    }
                }
            }
        }

        // Queens and rooks get bonus for open lines
        if (pieceType === 'queen' || pieceType === 'rook') {
            mobility += 2;
        }

        return mobility;
    },

    // ==========================================
    // CHESS PHASE AI (Gomoku-inspired)
    // ==========================================

    /**
     * Make move during chess phase
     */
    async makeChessMove(gameState) {
        console.log('🤖 AI: Chess Phase - Finding best move');

        const bestMove = this.findBestChessMove(gameState);

        if (!bestMove) {
            console.error('🤖 AI: No valid moves available!');
            return null;
        }

        console.log(`🤖 AI Decision: Move from (${bestMove.fromRow},${bestMove.fromCol}) to (${bestMove.toRow},${bestMove.toCol})`);

        return {
            phase: 'chess',
            from: { row: bestMove.fromRow, col: bestMove.fromCol },
            to: { row: bestMove.toRow, col: bestMove.toCol }
        };
    },

    /**
     * Find best chess move using Gomoku-inspired evaluation
     */
    findBestChessMove(gameState) {
        let bestMove = null;
        let bestScore = -Infinity;

        // Get all AI pieces
        const aiPieces = this.getAllPieces(gameState.board, this.player);

        // For each piece, try all legal moves
        for (const piece of aiPieces) {
            const validMoves = PieceManager.getValidMoves(piece.row, piece.col);

            for (const move of validMoves) {
                const score = this.evaluateChessMove(
                    gameState,
                    piece.row, piece.col,
                    move.row, move.col
                );

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = {
                        fromRow: piece.row,
                        fromCol: piece.col,
                        toRow: move.row,
                        toCol: move.col,
                        score: score
                    };
                }
            }
        }

        console.log(`🤖 Best move score: ${bestScore}`);
        return bestMove;
    },

    /**
     * Evaluate a chess move (Gomoku-style)
     */
    evaluateChessMove(gameState, fromRow, fromCol, toRow, toCol) {
        let score = 0;
        const board = gameState.board;

        // Simulate move
        const piece = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;
        board[toRow][toCol] = piece;

        // PRIORITY 1: Does this win immediately?
        const myLine = this.checkLineAt(board, toRow, toCol, this.player);
        if (myLine >= 5) {
            score = this.WEIGHTS.WIN_NOW;
        } else {
            // PRIORITY 2: Does this block opponent's winning move?
            const opponentPlayer = (this.player === 'cyan') ? 'magenta' : 'cyan';
            const opponentCanWin = this.canOpponentWinNextTurn(board, opponentPlayer);

            if (opponentCanWin) {
                // Check if this move blocks it
                if (this.blocksOpponentWin(board, toRow, toCol, opponentPlayer)) {
                    score = this.WEIGHTS.BLOCK_WIN;
                } else {
                    score = -this.WEIGHTS.WIN_NOW; // Bad move, doesn't block
                }
            } else {
                // PRIORITY 3: Evaluate threats and position
                score += this.evaluateThreats(board, toRow, toCol, this.player);
                score -= this.evaluateThreats(board, toRow, toCol, opponentPlayer) * 0.5; // Penalize leaving threats
                score += this.evaluateMobility(board, toRow, toCol);
            }
        }

        // Undo simulation
        board[toRow][toCol] = null;
        board[fromRow][fromCol] = piece;

        return score;
    },

    /**
     * Check if opponent can win on next turn
     */
    canOpponentWinNextTurn(board, opponentPlayer) {
        const opponentPieces = this.getAllPieces(board, opponentPlayer);

        for (const piece of opponentPieces) {
            const moves = PieceManager.getValidMoves(piece.row, piece.col);

            for (const move of moves) {
                // Simulate opponent move
                const temp = board[piece.row][piece.col];
                board[piece.row][piece.col] = null;
                board[move.row][move.col] = temp;

                const line = this.checkLineAt(board, move.row, move.col, opponentPlayer);

                // Undo
                board[move.row][move.col] = null;
                board[piece.row][piece.col] = temp;

                if (line >= 5) {
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * Check if this position blocks opponent's win
     */
    blocksOpponentWin(board, row, col, opponentPlayer) {
        // This is a simplification - would need deeper analysis for perfect blocking
        // For now, check if this position is on opponent's longest line
        return true; // Assume any move is potentially blocking (conservative)
    },

    /**
     * Evaluate threats at position (Gomoku-style pattern detection)
     */
    evaluateThreats(board, row, col, player) {
        let score = 0;

        // Check all 4 directions: horizontal, vertical, diagonal1, diagonal2
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal \
            [1, -1]   // diagonal /
        ];

        for (const [dr, dc] of directions) {
            const pattern = this.getLinePattern(board, row, col, dr, dc, player);
            score += this.scorePattern(pattern);
        }

        return score;
    },

    /**
     * Get line pattern in a direction
     * Returns string like "__XXX_X__" where X=player, _=empty, O=opponent
     */
    getLinePattern(board, row, col, dr, dc, player) {
        let pattern = '';
        const opponentPlayer = (player === 'cyan') ? 'magenta' : 'cyan';

        // Go backwards first (5 squares)
        for (let i = -4; i <= 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;

            if (r < 0 || r >= 8 || c < 0 || c >= 8) {
                pattern += 'B'; // B = border
            } else if (board[r][c] === null) {
                pattern += '_';
            } else if (board[r][c].player === player) {
                pattern += 'X';
            } else {
                pattern += 'O';
            }
        }

        return pattern;
    },

    /**
     * Score a pattern (Gomoku pattern matching)
     */
    scorePattern(pattern) {
        let score = 0;

        // Five (win)
        if (pattern.includes('XXXXX')) {
            score += this.WEIGHTS.WIN_NOW;
        }

        // Open Four _XXXX_
        if (pattern.includes('_XXXX_')) {
            score += this.WEIGHTS.OPEN_FOUR;
        }

        // Four XXXX_ or _XXXX
        if (pattern.includes('XXXX_') || pattern.includes('_XXXX')) {
            score += this.WEIGHTS.FOUR;
        }

        // Open Three _XXX_
        if (pattern.includes('_XXX_')) {
            score += this.WEIGHTS.OPEN_THREE;
        }

        // Three XXX_ or _XXX
        if (pattern.includes('XXX_') || pattern.includes('_XXX')) {
            score += this.WEIGHTS.THREE;
        }

        // Open Two _XX_
        if (pattern.includes('_XX_')) {
            score += this.WEIGHTS.OPEN_TWO;
        }

        // Two XX_ or _XX
        if (pattern.includes('XX_') || pattern.includes('_XX')) {
            score += this.WEIGHTS.TWO;
        }

        return score;
    },

    /**
     * Evaluate mobility at position
     */
    evaluateMobility(board, row, col) {
        // Simple: count empty squares around this position
        let mobility = 0;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;

                const r = row + dr;
                const c = col + dc;

                if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === null) {
                    mobility++;
                }
            }
        }

        return mobility * this.WEIGHTS.MOBILITY;
    },

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================

    /**
     * Get all pieces of a player
     */
    getAllPieces(board, player) {
        const pieces = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.player === player) {
                    pieces.push({ row, col, type: piece.type });
                }
            }
        }

        return pieces;
    },

    /**
     * Check longest line at position
     * Returns: length of longest line through this position
     */
    checkLineAt(board, row, col, player) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal \
            [1, -1]   // diagonal /
        ];

        let maxLength = 0;

        for (const [dr, dc] of directions) {
            let length = 1; // Count the piece itself

            // Count in positive direction
            let r = row + dr;
            let c = col + dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                   board[r][c] && board[r][c].player === player) {
                length++;
                r += dr;
                c += dc;
            }

            // Count in negative direction
            r = row - dr;
            c = col - dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                   board[r][c] && board[r][c].player === player) {
                length++;
                r -= dr;
                c -= dc;
            }

            maxLength = Math.max(maxLength, length);
        }

        return maxLength;
    },

    /**
     * Count potential lines (for gravity phase evaluation)
     */
    countPotentialLines(board, row, col, player) {
        // Count how many directions have space to form 5
        let potential = 0;
        const directions = [[0,1], [1,0], [1,1], [1,-1]];

        for (const [dr, dc] of directions) {
            let space = 1;

            // Check positive direction
            for (let i = 1; i < 5; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                    (board[r][c] === null || board[r][c].player === player)) {
                    space++;
                }
            }

            // Check negative direction
            for (let i = 1; i < 5; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                    (board[r][c] === null || board[r][c].player === player)) {
                    space++;
                }
            }

            if (space >= 5) {
                potential++;
            }
        }

        return potential;
    }
};

console.log('🤖 ChessFive AI loaded');
