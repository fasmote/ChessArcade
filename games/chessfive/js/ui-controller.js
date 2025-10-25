/**
 * UI CONTROLLER
 * Handles all user interface updates
 */

const UIController = {
    /**
     * Initialize UI controller
     */
    init() {
        this.attachEventListeners();
        this.updateAll();
        console.log('🎮 UI controller initialized');
    },

    /**
     * Attach event listeners to UI elements
     */
    attachEventListeners() {
        // Home button
        document.getElementById('btnHome').addEventListener('click', () => {
            window.location.href = '../../index.html';
        });

        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => {
            this.toggleSound();
        });

        // New game button
        document.getElementById('btnNewGame').addEventListener('click', () => {
            this.newGame();
        });

        // Help button
        document.getElementById('btnHelp').addEventListener('click', () => {
            this.showHelp();
        });

        // Close help button
        document.getElementById('btnCloseHelp').addEventListener('click', () => {
            this.hideHelp();
        });

        // Game over modal buttons
        document.getElementById('btnPlayAgain').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('btnBackHome').addEventListener('click', () => {
            window.location.href = '../../index.html';
        });

        // Undo button (future implementation)
        document.getElementById('btnUndo').addEventListener('click', () => {
            console.log('⏮️ Undo not implemented yet');
        });
    },

    /**
     * Update all UI elements
     */
    updateAll() {
        this.updatePhaseIndicator();
        this.updatePlayerInfo();
        this.updateTurnIndicator();
        this.updateSoundButton();
    },

    /**
     * Update phase indicator
     */
    updatePhaseIndicator() {
        const phaseTitle = document.getElementById('phaseTitle');
        const phaseDescription = document.getElementById('phaseDescription');

        if (GameState.phase === 'gravity') {
            phaseTitle.textContent = 'PHASE 1: GRAVITY PLACEMENT';
            phaseDescription.textContent = 'Click on a column to drop your piece';
        } else {
            phaseTitle.textContent = 'PHASE 2: CHESS MOVEMENT';
            phaseDescription.textContent = 'Move your pieces to align 5 in a row';
        }
    },

    /**
     * Update player information panels
     */
    updatePlayerInfo() {
        // Update pieces left
        document.getElementById('cyanPiecesLeft').textContent = GameState.getTotalPieces('cyan');
        document.getElementById('magentaPiecesLeft').textContent = GameState.getTotalPieces('magenta');

        // Update inventories
        this.updateInventory('cyan');
        this.updateInventory('magenta');

        // Update active player highlight
        const cyanPanel = document.getElementById('playerCyan');
        const magentaPanel = document.getElementById('playerMagenta');

        if (GameState.currentPlayer === 'cyan') {
            cyanPanel.classList.add('active');
            magentaPanel.classList.remove('active');
        } else {
            magentaPanel.classList.add('active');
            cyanPanel.classList.remove('active');
        }
    },

    /**
     * Update piece inventory display
     */
    updateInventory(player) {
        const inventoryEl = document.getElementById(`${player}Inventory`);
        inventoryEl.innerHTML = '';

        const inventory = GameState.inventory[player];
        const pieceTypes = ['rook', 'knight', 'bishop', 'queen', 'king'];

        for (const type of pieceTypes) {
            const count = inventory[type];
            const total = type === 'queen' || type === 'king' ? 1 : 2;

            for (let i = 0; i < total; i++) {
                const piece = document.createElement('span');
                piece.className = 'inventory-piece';
                piece.textContent = PieceManager.getSymbol(player, type);

                if (i >= count) {
                    piece.classList.add('used');
                }

                inventoryEl.appendChild(piece);
            }
        }
    },

    /**
     * Update turn indicator
     */
    updateTurnIndicator() {
        const turnText = document.getElementById('currentTurnText');
        turnText.textContent = GameState.currentPlayer.toUpperCase() + ' PLAYER';
        turnText.style.color = GameState.currentPlayer === 'cyan' ? 'var(--cyan-primary)' : 'var(--magenta-primary)';
    },

    /**
     * Update sound button state
     */
    updateSoundButton() {
        const soundBtn = document.getElementById('soundToggle');
        const iconOn = soundBtn.querySelector('.icon-sound-on');
        const iconOff = soundBtn.querySelector('.icon-sound-off');

        if (SoundManager.isEnabled()) {
            iconOn.style.display = 'inline';
            iconOff.style.display = 'none';
        } else {
            iconOn.style.display = 'none';
            iconOff.style.display = 'inline';
        }
    },

    /**
     * Toggle sound
     */
    toggleSound() {
        SoundManager.toggle();
        this.updateSoundButton();
    },

    /**
     * Start new game
     */
    newGame() {
        // Hide game over modal
        document.getElementById('gameOverModal').style.display = 'none';

        // Reset game state
        GameState.init();

        // Re-render board
        BoardRenderer.renderBoard();

        // Update UI
        this.updateAll();

        // Re-initialize gravity phase
        GravityPhase.init();

        console.log('🆕 New game started');

        // Track in analytics
        gtag('event', 'new_game', {
            'game_name': 'chessfive'
        });
    },

    /**
     * Show game over modal
     */
    showGameOver(winner) {
        const modal = document.getElementById('gameOverModal');
        const title = document.getElementById('winnerTitle');
        const message = document.getElementById('winnerMessage');

        title.textContent = winner.toUpperCase() + ' PLAYER WINS!';
        title.style.color = winner === 'cyan' ? 'var(--cyan-primary)' : 'var(--magenta-primary)';
        message.textContent = 'Five pieces aligned!';

        modal.style.display = 'flex';

        // Track in analytics
        gtag('event', 'game_complete', {
            'game_name': 'chessfive',
            'winner': winner,
            'phase': GameState.phase
        });
    },

    /**
     * Show help modal
     */
    showHelp() {
        document.getElementById('helpModal').style.display = 'flex';
    },

    /**
     * Hide help modal
     */
    hideHelp() {
        document.getElementById('helpModal').style.display = 'none';
    }
};
