/**
 * ==========================================
 * AI CONTROLLER
 * ==========================================
 *
 * Este módulo maneja la integración de la IA con el juego.
 * Coordina cuándo la IA debe jugar y ejecuta sus movimientos.
 */

const AIController = {
    enabled: false,          // Is AI opponent enabled?
    aiPlayer: 'magenta',     // AI plays as magenta
    isThinking: false,       // Prevent multiple simultaneous AI moves

    /**
     * Initialize AI controller
     */
    init() {
        this.attachUIListeners();
        console.log('🤖 AI Controller initialized');
    },

    /**
     * Attach event listeners for AI toggle
     */
    attachUIListeners() {
        // Toggle button for vs AI / vs Human
        const aiToggle = document.getElementById('ai-toggle');
        if (aiToggle) {
            aiToggle.addEventListener('change', (e) => {
                this.enabled = e.target.checked;
                console.log(`🤖 AI ${this.enabled ? 'enabled' : 'disabled'}`);

                // Update UI
                this.updateAIIndicator();

                // If AI is enabled and it's AI's turn, make move
                if (this.enabled && this.isAITurn()) {
                    this.makeAIMove();
                }
            });
        }
    },

    /**
     * Check if it's AI's turn
     */
    isAITurn() {
        return this.enabled &&
               GameState.currentPlayer === this.aiPlayer &&
               !GameState.gameOver;
    },

    /**
     * Check if should make AI move after player moved
     */
    checkAndMakeAIMove() {
        if (this.isAITurn() && !this.isThinking) {
            // Add small delay so player sees their move complete
            setTimeout(() => {
                this.makeAIMove();
            }, 500);
        }
    },

    /**
     * Make AI move
     */
    async makeAIMove() {
        if (!this.enabled || this.isThinking || GameState.gameOver) {
            return;
        }

        if (GameState.currentPlayer !== this.aiPlayer) {
            return;
        }

        this.isThinking = true;
        this.showThinkingIndicator(true);

        try {
            console.log('🤖 AI is making a move...');

            // Get AI decision
            const move = await ChessFiveAI.makeMove(GameState);

            if (!move) {
                console.error('🤖 AI returned no move!');
                this.isThinking = false;
                this.showThinkingIndicator(false);
                return;
            }

            // Execute the move based on phase
            if (move.phase === 'gravity') {
                this.executeGravityMove(move);
            } else if (move.phase === 'chess') {
                this.executeChessMove(move);
            }

        } catch (error) {
            console.error('🤖 AI error:', error);
        } finally {
            this.isThinking = false;
            this.showThinkingIndicator(false);
        }
    },

    /**
     * Execute gravity phase move
     */
    executeGravityMove(move) {
        const { pieceType, col } = move;

        console.log(`🤖 AI drops ${pieceType} in column ${col}`);

        // Select the piece type
        GameState.selectedPieceType = pieceType;

        // Place the piece
        const result = GameState.placePiece(col, pieceType);

        if (result) {
            const { row, col: placedCol } = result;

            // Render piece with animation
            BoardRenderer.renderPiece(row, placedCol, GameState.currentPlayer, pieceType, true);

            // Play sound
            SoundManager.play('place');

            // Check for win
            const winResult = WinDetection.checkWin(row, placedCol);
            if (winResult) {
                GravityPhase.handleWin(winResult);
                return;
            }

            // Check if gravity phase is complete
            if (GameState.isGravityPhaseComplete()) {
                setTimeout(() => {
                    GravityPhase.transitionToChessPhase();
                }, 1000);
                return;
            }

            // Switch player
            GameState.switchPlayer();

            // Update UI
            UIController.updateTurnIndicator();
            UIController.updatePlayerInfo();
            UIController.updatePieceSelector();

            // Reset piece selection
            GameState.selectedPieceType = null;

        } else {
            console.error('🤖 AI tried invalid gravity move!');
            SoundManager.play('invalid');
        }
    },

    /**
     * Execute chess phase move
     */
    executeChessMove(move) {
        const { from, to } = move;

        console.log(`🤖 AI moves from (${from.row},${from.col}) to (${to.row},${to.col})`);

        // Validate move
        if (!PieceManager.isValidMove(from.row, from.col, to.row, to.col)) {
            console.error('🤖 AI tried invalid chess move!');
            SoundManager.play('invalid');
            return;
        }

        // Move piece in game state
        const success = GameState.movePiece(from.row, from.col, to.row, to.col);

        if (success) {
            // Update board visuals
            BoardRenderer.renderBoard();

            // Play sound
            SoundManager.play('move');

            // Check for win
            const winResult = WinDetection.checkWin(to.row, to.col);
            if (winResult) {
                ChessPhase.handleWin(winResult);
                return;
            }

            // Switch player
            GameState.switchPlayer();

            // Update UI
            UIController.updateTurnIndicator();
            UIController.updatePlayerInfo();

        } else {
            console.error('🤖 AI chess move failed!');
            SoundManager.play('invalid');
        }
    },

    /**
     * Show/hide "AI is thinking..." indicator
     */
    showThinkingIndicator(show) {
        const indicator = document.getElementById('ai-thinking');
        if (indicator) {
            indicator.style.display = show ? 'block' : 'none';
        }

        // Also update turn indicator
        const turnIndicator = document.querySelector('.turn-indicator');
        if (turnIndicator && show) {
            turnIndicator.textContent = '🤖 AI is thinking...';
        }
    },

    /**
     * Update AI indicator in UI
     */
    updateAIIndicator() {
        const indicator = document.getElementById('ai-status');
        if (indicator) {
            indicator.textContent = this.enabled ? '🤖 vs AI' : '👥 vs Human';
        }
    }
};

console.log('🤖 AI Controller loaded');
