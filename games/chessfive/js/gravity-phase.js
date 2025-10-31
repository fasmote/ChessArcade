/**
 * ==========================================
 * GRAVITY PHASE CONTROLLER (Controlador de Fase Gravedad)
 * ==========================================
 *
 * Esta fase simula el juego "Connect Four" (4 en línea).
 * Los jugadores sueltan piezas en columnas y caen por gravedad.
 *
 * MECÁNICA:
 * 1. Jugador selecciona tipo de pieza (rook, knight, etc.)
 * 2. Click en columna del tablero
 * 3. Pieza "cae" hasta el fondo o hasta chocar con otra pieza
 * 4. Se alterna el turno
 * 5. Cuando se colocan las 16 piezas → transición a Chess Phase
 *
 * PATRÓN: Event-Driven Programming
 * - Los event listeners solo se agregan UNA vez (flag initialized)
 * - Los handlers verifican estado antes de ejecutar
 * - Previene duplicación de listeners en múltiples partidas
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

        // Get selected piece type
        const pieceType = GameState.selectedPieceType;
        if (!pieceType) {
            console.warn('⚠️ Please select a piece first');
            SoundManager.play('invalid');
            return;
        }

        // Verify player has this piece available
        if (GameState.inventory[GameState.currentPlayer][pieceType] <= 0) {
            console.warn('⚠️ No pieces of this type left');
            SoundManager.play('invalid');
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

            // Update UI AFTER switching player
            UIController.updateTurnIndicator();
            UIController.updatePlayerInfo(); // Now updates with the NEW current player
            UIController.updatePieceSelector(); // Update selector for new player

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

        // Show ghost preview (if piece is selected)
        if (GameState.selectedPieceType) {
            BoardRenderer.showGhostPiece(col, GameState.selectedPieceType);
        }
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

        // ALWAYS start chess phase with Cyan player
        GameState.currentPlayer = 'cyan';

        // Update ALL UI elements (phase, turn, player panels, board border)
        UIController.updatePhaseIndicator();
        UIController.updateTurnIndicator();
        UIController.updatePlayerInfo(); // Updates board border + player panels
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
