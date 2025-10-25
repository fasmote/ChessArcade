/**
 * CHESS PHASE CONTROLLER
 * Handles piece movement according to chess rules
 */

const ChessPhase = {
    /**
     * Initialize chess phase
     */
    init() {
        this.attachEventListeners();
        console.log('♟️ Chess phase initialized');
    },

    /**
     * Attach click listeners for chess phase
     */
    attachEventListeners() {
        const squares = document.querySelectorAll('.square');

        squares.forEach(square => {
            square.addEventListener('click', (e) => this.handleSquareClick(e));
        });
    },

    /**
     * Handle square click during chess phase
     */
    handleSquareClick(e) {
        if (GameState.phase !== 'chess') return;
        if (GameState.gameOver) return;

        const square = e.currentTarget;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        const piece = GameState.getPieceAt(row, col);

        // If no piece is selected
        if (!GameState.selectedPiece) {
            // Can only select own pieces
            if (piece && piece.player === GameState.currentPlayer) {
                this.selectPiece(row, col);
            }
        } else {
            // Piece is already selected
            const selectedRow = GameState.selectedPiece.row;
            const selectedCol = GameState.selectedPiece.col;

            // If clicking same piece, deselect
            if (row === selectedRow && col === selectedCol) {
                this.deselectPiece();
                return;
            }

            // If clicking another own piece, select that one
            if (piece && piece.player === GameState.currentPlayer) {
                this.selectPiece(row, col);
                return;
            }

            // Try to move to clicked square
            if (GameState.isEmpty(row, col)) {
                this.attemptMove(selectedRow, selectedCol, row, col);
            } else {
                // Square is occupied by opponent (no capture in ChessFive)
                SoundManager.play('invalid');
                console.warn('⚠️ Cannot capture pieces in ChessFive');
            }
        }
    },

    /**
     * Select a piece
     */
    selectPiece(row, col) {
        GameState.selectedPiece = { row, col };

        // Highlight selected square
        BoardRenderer.highlightSelected(row, col);

        // Show valid moves
        const validMoves = PieceManager.getValidMoves(row, col);
        BoardRenderer.showValidMoves(validMoves);

        SoundManager.play('select');

        console.log(`✅ Selected piece at (${row}, ${col})`);
    },

    /**
     * Deselect piece
     */
    deselectPiece() {
        GameState.selectedPiece = null;
        BoardRenderer.clearHighlights();
        console.log('❌ Piece deselected');
    },

    /**
     * Attempt to move a piece
     */
    attemptMove(fromRow, fromCol, toRow, toCol) {
        // Validate move
        if (!PieceManager.isValidMove(fromRow, fromCol, toRow, toCol)) {
            SoundManager.play('invalid');
            console.warn('⚠️ Invalid move');
            return;
        }

        // Move piece in game state
        const success = GameState.movePiece(fromRow, fromCol, toRow, toCol);

        if (success) {
            // Update board visuals
            BoardRenderer.renderBoard();

            // Play sound
            SoundManager.play('move');

            // Clear selection
            this.deselectPiece();

            // Check for win
            const winResult = WinDetection.checkWin(toRow, toCol);
            if (winResult) {
                this.handleWin(winResult);
                return;
            }

            // Switch player
            GameState.switchPlayer();
            UIController.updateTurnIndicator();
        }
    },

    /**
     * Handle win during chess phase
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
