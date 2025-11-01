/**
 * BOARD RENDERER
 * Handles all DOM manipulation for the chess board
 */

const BoardRenderer = {
    boardElement: null,

    /**
     * Initialize the board renderer
     */
    init() {
        this.boardElement = document.getElementById('chessBoard');
        this.createBoard();
        console.log('🎨 Board renderer initialized');
    },

    /**
     * Create the 8x8 chess board
     */
    createBoard() {
        this.boardElement.innerHTML = '';

        // Create squares from rank 8 to rank 1 (top to bottom)
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.row = row;
                square.dataset.col = col;

                // Alternate light/dark squares
                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');

                // Add coordinate label
                const coord = this.getCoordinate(row, col);
                const label = document.createElement('span');
                label.className = 'coordinate-label';
                label.textContent = coord;
                square.appendChild(label);

                this.boardElement.appendChild(square);
            }
        }
    },

    /**
     * Get chess coordinate (e.g., "a1", "h8")
     */
    getCoordinate(row, col) {
        const file = String.fromCharCode(97 + col); // a-h
        const rank = 8 - row; // 8-1 (row 0 = rank 8)
        return file + rank;
    },

    /**
     * Get square element at position
     */
    getSquare(row, col) {
        return this.boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    },

    /**
     * Render a piece on a square
     */
    renderPiece(row, col, player, type, animate = false) {
        const square = this.getSquare(row, col);
        if (!square) return;

        // Remove ALL existing pieces (including ghosts)
        const existingPieces = square.querySelectorAll('.piece');
        existingPieces.forEach(p => p.remove());

        // Create new piece
        const piece = document.createElement('div');
        piece.className = `piece ${player}`;
        piece.textContent = PieceManager.getSymbol(player, type);

        if (animate) {
            piece.classList.add('dropping');
        }

        square.appendChild(piece);
    },

    /**
     * Remove piece from square
     */
    removePiece(row, col) {
        const square = this.getSquare(row, col);
        if (!square) return;

        const piece = square.querySelector('.piece');
        if (piece) {
            piece.remove();
        }
    },

    /**
     * Render entire board state
     */
    renderBoard() {
        // Clear all pieces AND ghosts
        this.removeGhosts();
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.removePiece(row, col);
            }
        }

        // Render pieces from game state
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = GameState.getPieceAt(row, col);
                if (piece) {
                    this.renderPiece(row, col, piece.player, piece.type);
                }
            }
        }
    },

    /**
     * Highlight column on hover (gravity phase)
     */
    highlightColumn(col) {
        this.clearHighlights();

        for (let row = 0; row < 8; row++) {
            const square = this.getSquare(row, col);
            if (square && GameState.isEmpty(row, col)) {
                square.classList.add('column-hover');
            }
        }
    },

    /**
     * Clear all highlights
     */
    clearHighlights() {
        const squares = this.boardElement.querySelectorAll('.square');
        squares.forEach(sq => {
            sq.classList.remove('column-hover', 'selected', 'valid-move', 'winning', 'from-square', 'to-square');
        });
    },

    /**
     * Highlight selected piece
     */
    highlightSelected(row, col) {
        this.clearHighlights();
        const square = this.getSquare(row, col);
        if (square) {
            square.classList.add('selected');
        }
    },

    /**
     * Show valid moves for a piece
     */
    showValidMoves(moves) {
        moves.forEach(move => {
            const square = this.getSquare(move.row, move.col);
            if (square) {
                square.classList.add('valid-move');
            }
        });
    },

    /**
     * Highlight winning line
     */
    highlightWinningLine(positions) {
        positions.forEach(pos => {
            const square = this.getSquare(pos.row, pos.col);
            if (square) {
                square.classList.add('winning');
            }
        });
    },

    /**
     * Show ghost preview of piece (gravity phase)
     */
    showGhostPiece(col, pieceType) {
        // Find lowest empty row
        for (let row = 7; row >= 0; row--) {
            if (GameState.isEmpty(row, col)) {
                const square = this.getSquare(row, col);
                if (square) {
                    const ghost = document.createElement('div');
                    ghost.className = `piece ${GameState.currentPlayer} ghost`;
                    ghost.style.opacity = '0.3';
                    if (pieceType) {
                        ghost.textContent = PieceManager.getSymbol(GameState.currentPlayer, pieceType);
                        square.appendChild(ghost);
                    }
                }
                break;
            }
        }
    },

    /**
     * Remove ghost pieces
     */
    removeGhosts() {
        const ghosts = this.boardElement.querySelectorAll('.ghost');
        ghosts.forEach(g => g.remove());
    },

    /**
     * Highlight last move (chess phase)
     * Shows where piece moved from (origin) and to (destination)
     */
    highlightLastMove() {
        // Clear previous move highlights
        const squares = this.boardElement.querySelectorAll('.square');
        squares.forEach(sq => {
            sq.classList.remove('from-square', 'to-square');
        });

        // Highlight new move if exists
        if (GameState.lastMove) {
            const { fromRow, fromCol, toRow, toCol } = GameState.lastMove;

            const fromSquare = this.getSquare(fromRow, fromCol);
            const toSquare = this.getSquare(toRow, toCol);

            if (fromSquare) {
                fromSquare.classList.add('from-square');
            }

            if (toSquare) {
                toSquare.classList.add('to-square');
            }
        }
    }
};
