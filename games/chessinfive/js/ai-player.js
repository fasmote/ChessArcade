/**
 * ==========================================
 * CHESSINFIVE AI OPPONENT
 * ==========================================
 *
 * Implementación de IA para ChessInFive usando estrategia inspirada en Gomoku.
 * La IA funciona en ambas fases del juego con diferentes estrategias.
 *
 * ARQUITECTURA:
 * - Gravity Phase: Evaluación de posicionamiento estratégico
 * - Chess Phase: Detección de amenazas estilo Gomoku + evaluación táctica
 *
 * ALGORITMO: Minimax simplificado (1 nivel) con evaluación heurística
 */

const ChessInFiveAI = {
    // ==========================================
    // CONFIGURATION
    // ==========================================

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
        const aiPlayer = gameState.currentPlayer; // AI plays as current player
        console.log(`🤖 AI (${aiPlayer}) is thinking...`);

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

    /**
     * Choose random element from array
     * Used to add variety when multiple moves have same score
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
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
        const inv = gameState.inventory[gameState.currentPlayer];

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
     * WITH RANDOMIZATION: If multiple columns have same score, pick randomly
     */
    chooseBestColumn(gameState, pieceType) {
        let bestCols = [];
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
                // Found better move, reset list
                bestScore = score;
                bestCols = [col];
            } else if (score === bestScore) {
                // Found equal move, add to list
                bestCols.push(col);
            }
        }

        // Pick random column from best options
        const chosenCol = this.randomChoice(bestCols);
        console.log(`  🎲 Best columns: [${bestCols}], chosen: ${chosenCol}`);
        return chosenCol;
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
        board[row][col] = { player: gameState.currentPlayer, type: pieceType };

        // 1. Check if this creates 5 in a row (instant win in gravity phase)
        if (this.checkLineAt(board, row, col, gameState.currentPlayer) >= 5) {
            score += this.WEIGHTS.WIN_NOW;
        }

        // 2. Check if this creates 4 in a row (very strong)
        if (this.checkLineAt(board, row, col, gameState.currentPlayer) === 4) {
            score += this.WEIGHTS.FOUR;
        }

        // 3. Check if this creates 3 in a row (threatening)
        if (this.checkLineAt(board, row, col, gameState.currentPlayer) === 3) {
            score += this.WEIGHTS.THREE;
        }

        // 4. Count potential lines (sets up for Phase 2)
        score += this.countPotentialLines(board, row, col, gameState.currentPlayer) * this.WEIGHTS.POTENTIAL_LINE;

        // Undo simulation temporarily to check opponent threats
        board[row][col] = null;

        // 5. Check if blocks opponent's threats (IMPROVED)
        const opponentPlayer = (gameState.currentPlayer === 'cyan') ? 'magenta' : 'cyan';

        // Simulate opponent dropping in this column
        const opponentRow = this.getDropRow(board, col);
        if (opponentRow >= 0) {
            board[opponentRow][col] = { player: opponentPlayer, type: pieceType };

            const opponentLine = this.checkLineAt(board, opponentRow, col, opponentPlayer);

            // Block 4-in-a-row (critical!)
            if (opponentLine >= 4) {
                score += this.WEIGHTS.BLOCK_WIN;
                console.log(`  🛡️ Blocking opponent's 4-in-a-row at column ${col}`);
            }
            // Block 3-in-a-row (important!)
            else if (opponentLine === 3) {
                score += this.WEIGHTS.OPEN_THREE;
                console.log(`  🛡️ Blocking opponent's 3-in-a-row at column ${col}`);
            }
            // Block 2-in-a-row (preventive)
            else if (opponentLine === 2) {
                score += this.WEIGHTS.TWO;
            }

            board[opponentRow][col] = null;
        }

        // Restore our piece for remaining evaluations
        board[row][col] = { player: gameState.currentPlayer, type: pieceType };

        // 6. Prefer center columns (better mobility in Phase 2)
        const centerBonus = this.getCenterBonus(col);
        score += centerBonus * this.WEIGHTS.CENTER;

        // 7. Evaluate mobility for Phase 2
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
     * WITH RANDOMIZATION: If multiple moves have same score, pick randomly
     */
    findBestChessMove(gameState) {
        let bestMoves = [];
        let bestScore = -Infinity;

        // Get all AI pieces
        const aiPieces = this.getAllPieces(gameState.board, gameState.currentPlayer);

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
                    // Found better move, reset list
                    bestScore = score;
                    bestMoves = [{
                        fromRow: piece.row,
                        fromCol: piece.col,
                        toRow: move.row,
                        toCol: move.col,
                        score: score
                    }];
                } else if (score === bestScore) {
                    // Found equal move, add to list
                    bestMoves.push({
                        fromRow: piece.row,
                        fromCol: piece.col,
                        toRow: move.row,
                        toCol: move.col,
                        score: score
                    });
                }
            }
        }

        // Pick random move from best options
        const chosenMove = this.randomChoice(bestMoves);
        console.log(`🤖 Best move score: ${bestScore}, ${bestMoves.length} options, chosen: (${chosenMove.fromRow},${chosenMove.fromCol})→(${chosenMove.toRow},${chosenMove.toCol})`);
        return chosenMove;
    },

    /**
     * Evaluate a chess move (Gomoku-style)
     * WITH LOOP DETECTION: Penalizes moves that create repeated positions
     */
    evaluateChessMove(gameState, fromRow, fromCol, toRow, toCol) {
        let score = 0;
        const board = gameState.board;

        // Simulate move
        const piece = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;
        board[toRow][toCol] = piece;

        // LOOP DETECTION: Check if this position has been seen before
        const positionHash = gameState.getBoardHash();
        const repetitionCount = gameState.getPositionCount(positionHash);

        if (repetitionCount >= 2) {
            // Position will occur for 3rd time - heavily penalize to break loop
            console.log(`🔁 Loop detected! Position repeated ${repetitionCount} times - PENALIZING`);
            score -= 100000; // Massive penalty to force different move
        } else if (repetitionCount === 1) {
            // Position will occur for 2nd time - small penalty to discourage
            score -= 5000;
        }

        // PRIORITY 1: Does this win immediately?
        const myLine = this.checkLineAt(board, toRow, toCol, gameState.currentPlayer);
        if (myLine >= 5) {
            score = this.WEIGHTS.WIN_NOW;
        } else {
            // PRIORITY 2: Does this block opponent's winning move?
            const opponentPlayer = (gameState.currentPlayer === 'cyan') ? 'magenta' : 'cyan';
            const opponentHasImmediateWin = this.canOpponentWinNextTurn(board, opponentPlayer);

            if (opponentHasImmediateWin) {
                // Check if threat is unstoppable
                const isUnstoppable = this.hasUnstoppableThreat(board, opponentPlayer);

                if (isUnstoppable) {
                    // Threat is unstoppable - try to win first!
                    // Prioritize moves that create our own threats
                    score = this.evaluateThreats(board, toRow, toCol, gameState.currentPlayer) * 2;
                    console.log(`⚠️ Detected unstoppable threat from ${opponentPlayer}! Going for win.`);
                } else {
                    // Threat is stoppable - try to block it
                    if (this.blocksOpponentWin(board, toRow, toCol, opponentPlayer)) {
                        score = this.WEIGHTS.BLOCK_WIN;
                    } else {
                        score = -this.WEIGHTS.WIN_NOW; // Bad move, doesn't block
                    }
                }
            } else {
                // PRIORITY 3: Evaluate threats and position
                score += this.evaluateThreats(board, toRow, toCol, gameState.currentPlayer);
                score -= this.evaluateThreats(board, toRow, toCol, opponentPlayer) * 0.5; // Penalize leaving threats
                score += this.evaluateMobility(board, toRow, toCol);

                // DEPTH 2: Look ahead - can opponent create 4-in-a-row threat after our move?
                const opponentThreatAfterMove = this.canOpponentCreate4ThreatAfterMove(board, opponentPlayer);
                if (opponentThreatAfterMove) {
                    // Opponent can create a dangerous 4-in-a-row after our move - penalize heavily
                    score -= 50000; // Heavy penalty to avoid allowing opponent setup
                    console.log(`⚠️ DEPTH 2: Move (${fromRow},${fromCol})→(${toRow},${toCol}) allows opponent 4-threat!`);
                }
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
        // First check for immediate win (5 in a row possible)
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

        // Check for unstoppable threats (4 in a row with multiple open ends)
        if (this.hasUnstoppableThreat(board, opponentPlayer)) {
            return true;
        }

        // NEW: Check for existing 4-in-a-row on the board that can become 5
        if (this.hasExisting4InARowThreat(board, opponentPlayer)) {
            return true;
        }

        return false;
    },

    /**
     * NEW: Check for existing 4-in-a-row patterns on the board
     * Detects patterns like: XXXX_ or _XXXX where opponent can move a piece to complete 5
     */
    hasExisting4InARowThreat(board, player) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal \
            [1, -1]   // diagonal /
        ];

        // Check every position on the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Check each direction from this position
                for (const [dr, dc] of directions) {
                    // Count consecutive pieces in this direction
                    let count = 0;
                    let emptySpots = [];

                    // Check 5 squares in this direction (needed for XXXX_ pattern)
                    for (let i = 0; i < 5; i++) {
                        const r = row + (dr * i);
                        const c = col + (dc * i);

                        // Out of bounds
                        if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

                        const piece = board[r][c];

                        if (piece && piece.player === player) {
                            count++;
                        } else if (piece === null) {
                            emptySpots.push({row: r, col: c});
                        } else {
                            // Hit opponent piece - line is blocked
                            break;
                        }
                    }

                    // Found 4 pieces + at least 1 empty spot = potential threat
                    if (count === 4 && emptySpots.length >= 1) {
                        // Check if any opponent piece can reach the empty spot
                        for (const emptySpot of emptySpots) {
                            if (this.canPlayerReachSquare(board, player, emptySpot.row, emptySpot.col)) {
                                console.log(`🚨 EXISTING 4-IN-A-ROW THREAT detected for ${player} at (${row},${col}) direction (${dr},${dc})`);
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    },

    /**
     * Check if a player has any piece that can move to a specific square
     */
    canPlayerReachSquare(board, player, targetRow, targetCol) {
        const playerPieces = this.getAllPieces(board, player);

        for (const piece of playerPieces) {
            const moves = PieceManager.getValidMoves(piece.row, piece.col);

            for (const move of moves) {
                if (move.row === targetRow && move.col === targetCol) {
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * Detect unstoppable threats: 4 in a row with 2+ ways to complete
     * These are threats that cannot be blocked (e.g., _XXXX_ or knight jumps)
     */
    hasUnstoppableThreat(board, player) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal \
            [1, -1]   // diagonal /
        ];

        // Check every position on the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (!piece || piece.player !== player) continue;

                // Check each direction from this piece
                for (const [dr, dc] of directions) {
                    const lineInfo = this.analyzeLineFromPosition(board, row, col, dr, dc, player);

                    // Unstoppable if: 4 pieces + 2 or more open spots
                    if (lineInfo.count === 4 && lineInfo.openEnds >= 2) {
                        return true;
                    }

                    // Also unstoppable if: 4 pieces + 1 open end + that piece can reach it (knight jump)
                    if (lineInfo.count === 4 && lineInfo.openEnds >= 1 && lineInfo.hasKnight) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    /**
     * Analyze a line from a position to count pieces and open ends
     */
    analyzeLineFromPosition(board, row, col, dr, dc, player) {
        let count = 0;
        let openEnds = 0;
        let hasKnight = false;
        let positions = [];

        // Count in positive direction
        for (let i = 0; i < 5; i++) {
            const r = row + (dr * i);
            const c = col + (dc * i);
            if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

            const piece = board[r][c];
            if (piece && piece.player === player) {
                count++;
                if (piece.type === 'knight') hasKnight = true;
                positions.push({row: r, col: c});
            } else if (piece === null) {
                openEnds++;
            } else {
                break; // Hit opponent piece
            }
        }

        // Count in negative direction (skip starting position to avoid double count)
        for (let i = 1; i < 5; i++) {
            const r = row - (dr * i);
            const c = col - (dc * i);
            if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

            const piece = board[r][c];
            if (piece && piece.player === player) {
                count++;
                if (piece.type === 'knight') hasKnight = true;
                positions.push({row: r, col: c});
            } else if (piece === null) {
                openEnds++;
            } else {
                break; // Hit opponent piece
            }
        }

        return { count, openEnds, hasKnight, positions };
    },

    /**
     * DEPTH 2 SEARCH: Check if opponent can create 4-in-a-row threat after our move
     * This looks 1 move ahead to see if opponent can set up a dangerous position
     */
    canOpponentCreate4ThreatAfterMove(board, opponentPlayer) {
        const opponentPieces = this.getAllPieces(board, opponentPlayer);

        // Try each opponent piece's possible moves
        for (const piece of opponentPieces) {
            const moves = PieceManager.getValidMoves(piece.row, piece.col);

            for (const move of moves) {
                // Simulate opponent move
                const temp = board[piece.row][piece.col];
                board[piece.row][piece.col] = null;
                board[move.row][move.col] = temp;

                // Check if this creates a 4-in-a-row threat (not yet winning, but dangerous)
                const lineLength = this.checkLineAt(board, move.row, move.col, opponentPlayer);

                // Undo simulation
                board[move.row][move.col] = null;
                board[piece.row][piece.col] = temp;

                // If opponent can create 4-in-a-row (one away from win), return true
                if (lineLength >= 4) {
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * Check if this position blocks opponent's win
     * Returns true if placing a piece at (row, col) blocks a 4-in-a-row threat
     */
    blocksOpponentWin(board, row, col, opponentPlayer) {
        // Check if this position interrupts any of opponent's dangerous lines
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal \
            [1, -1]   // diagonal /
        ];

        for (const [dr, dc] of directions) {
            // Check line in both directions from this position
            let count = 0;
            let emptySpaces = 0;

            // Count opponent pieces in positive direction
            for (let i = 1; i <= 4; i++) {
                const r = row + (dr * i);
                const c = col + (dc * i);
                if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

                const piece = board[r][c];
                if (piece && piece.player === opponentPlayer) {
                    count++;
                } else if (piece === null) {
                    emptySpaces++;
                    break;
                } else {
                    break; // Hit enemy piece
                }
            }

            // Count opponent pieces in negative direction
            for (let i = 1; i <= 4; i++) {
                const r = row - (dr * i);
                const c = col - (dc * i);
                if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

                const piece = board[r][c];
                if (piece && piece.player === opponentPlayer) {
                    count++;
                } else if (piece === null) {
                    emptySpaces++;
                    break;
                } else {
                    break; // Hit enemy piece
                }
            }

            // If opponent has 4 in a row on this line, blocking here prevents win
            if (count >= 4) {
                return true;
            }
        }

        return false;
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

console.log('🤖 ChessInFive AI loaded');
