/**
 * GRAVITY PHASE CONTROLLER
 * Handles piece placement with gravity mechanics
 */

const GravityPhase = {
    initialized: false,

    /**
     * Initialize gravity phase
     */
    init() {
        // Only attach listeners once
        if (!this.initialized) {
            this.attachEventListeners();
            this.initialized = true;
        }
        console.log('🪂 Gravity phase initialized');
    },

    /**
     * Attach click listeners to board squares (only called once)
     */
    attachEventListeners() {
        const squares = document.querySelectorAll('.square');

        squares.forEach(square => {
            // Click to place piece
            square.addEventListener('click', (e) => this.handleSquareClick(e));

            // Hover to show preview
            square.addEventListener('mouseenter', (e) => this.handleSquareHover(e));
            square.addEventListener('mouseleave', () => this.handleSquareLeave());
        });
    },

    /**
     * Handle square click
     */
    handleSquareClick(e) {
        if (GameState.phase !== 'gravity') return;
        if (GameState.gameOver) return;

        const square = e.currentTarget;
        const col = parseInt(square.dataset.col);

        // Get next piece type for current player
        const pieceType = GameState.getNextPieceType(GameState.currentPlayer);
        if (!pieceType) {
            console.warn('⚠️ No pieces left for', GameState.currentPlayer);
            return;
        }

        // Try to place piece
        const result = GameState.placePiece(col, pieceType);

        if (result) {
            const { row, col: placedCol } = result;

            // Render piece with animation
            BoardRenderer.renderPiece(row, placedCol, GameState.currentPlayer, pieceType, true);

            // Play sound
            SoundManager.play('place');

            // Update UI
            UIController.updatePlayerInfo();

            // Check for win
            const winResult = WinDetection.checkWin(row, placedCol);
            if (winResult) {
                this.handleWin(winResult);
                return;
            }

            // Check if gravity phase is complete
            if (GameState.isGravityPhaseComplete()) {
                setTimeout(() => {
                    this.transitionToChessPhase();
                }, 1000);
                return;
            }

            // Switch player
            GameState.switchPlayer();
            UIController.updateTurnIndicator();

        } else {
            console.warn('⚠️ Column', col, 'is full');
            SoundManager.play('invalid');
        }
    },

    /**
     * Handle square hover
     */
    handleSquareHover(e) {
        if (GameState.phase !== 'gravity') return;
        if (GameState.gameOver) return;

        const square = e.currentTarget;
        const col = parseInt(square.dataset.col);

        // Show column highlight
        BoardRenderer.highlightColumn(col);

        // Show ghost preview
        BoardRenderer.showGhostPiece(col);
    },

    /**
     * Handle square leave
     */
    handleSquareLeave() {
        if (GameState.phase !== 'gravity') return;

        BoardRenderer.clearHighlights();
        BoardRenderer.removeGhosts();
    },

    /**
     * Transition to chess phase
     */
    transitionToChessPhase() {
        console.log('♟️ Transitioning to Chess Phase...');

        GameState.switchToChessPhase();
        UIController.updatePhaseIndicator();
        BoardRenderer.clearHighlights();

        SoundManager.play('phase_change');

        // Initialize chess phase
        ChessPhase.init();
    },

    /**
     * Handle win during gravity phase
     */
    handleWin(winResult) {
        GameState.gameOver = true;
        GameState.winner = winResult.player;

        console.log('🏆', winResult.player, 'wins!');

        // Highlight winning line
        BoardRenderer.highlightWinningLine(winResult.positions);

        // Play win sound
        SoundManager.play('win');

        // Show game over modal
        setTimeout(() => {
            UIController.showGameOver(winResult.player);
        }, 1500);
    }
};
