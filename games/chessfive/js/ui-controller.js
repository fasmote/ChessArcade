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

        // Piece selector buttons
        const pieceOptions = document.querySelectorAll('.piece-option');
        pieceOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const pieceType = btn.dataset.piece;
                this.selectPiece(pieceType);
            });
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
        this.updatePieceSelector();
    },

    /**
     * Select a piece type
     */
    selectPiece(pieceType) {
        const player = GameState.currentPlayer;

        // Check if piece is available
        if (GameState.inventory[player][pieceType] <= 0) {
            SoundManager.play('invalid');
            return;
        }

        // Set selected piece
        GameState.selectedPieceType = pieceType;

        // Update visual selection
        const buttons = document.querySelectorAll('.piece-option');
        buttons.forEach(btn => {
            if (btn.dataset.piece === pieceType) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        SoundManager.play('select');
        console.log(`✅ Selected ${pieceType}`);
    },

    /**
     * Update piece selector (counts, symbols, disabled states)
     * Actualiza AMBOS selectores (cyan y magenta)
     */
    updatePieceSelector() {
        const currentPlayer = GameState.currentPlayer;
        const pieceTypes = ['rook', 'knight', 'bishop', 'queen', 'king'];

        // Show/hide both selectors based on phase
        const selectorCyan = document.getElementById('pieceSelector');
        const selectorMagenta = document.getElementById('pieceSelectorMagenta');

        if (GameState.phase === 'gravity') {
            selectorCyan.style.display = 'block';
            selectorMagenta.style.display = 'block';
        } else {
            selectorCyan.style.display = 'none';
            selectorMagenta.style.display = 'none';
            return;
        }

        // Update CYAN selector
        this.updatePlayerSelector('cyan', currentPlayer === 'cyan');

        // Update MAGENTA selector
        this.updatePlayerSelector('magenta', currentPlayer === 'magenta');

        // Auto-select first available piece if none selected
        const inventory = GameState.inventory[currentPlayer];
        if (!GameState.selectedPieceType || inventory[GameState.selectedPieceType] <= 0) {
            const firstAvailable = pieceTypes.find(type => inventory[type] > 0);
            if (firstAvailable) {
                this.selectPiece(firstAvailable);
            }
        }
    },

    /**
     * Update a specific player's selector
     * @param {string} player - 'cyan' or 'magenta'
     * @param {boolean} isActive - true if this is the current player's turn
     */
    updatePlayerSelector(player, isActive) {
        const inventory = GameState.inventory[player];
        const pieceTypes = ['rook', 'knight', 'bishop', 'queen', 'king'];
        const suffix = player === 'magenta' ? 'Magenta' : '';

        pieceTypes.forEach(type => {
            const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
            const symbolId = `selected${capitalType}${suffix}`;
            const countId = `count${capitalType}${suffix}`;

            const symbol = document.getElementById(symbolId);
            const count = document.getElementById(countId);

            if (!symbol || !count) return; // Safety check

            // Update symbol
            symbol.textContent = PieceManager.getSymbol(player, type);
            symbol.style.color = player === 'cyan' ? 'var(--cyan-primary)' : 'var(--magenta-primary)';

            // Update count
            count.textContent = inventory[type];
        });

        // Enable/disable entire selector based on turn
        const selector = player === 'cyan'
            ? document.getElementById('pieceSelector')
            : document.getElementById('pieceSelectorMagenta');

        if (isActive) {
            selector.classList.remove('disabled');
            // Enable individual buttons based on inventory
            const buttons = selector.querySelectorAll('.piece-option');
            buttons.forEach(btn => {
                const type = btn.dataset.piece;
                if (inventory[type] <= 0) {
                    btn.disabled = true;
                    btn.classList.remove('selected');
                } else {
                    btn.disabled = false;
                }
            });
        } else {
            // Disable entire selector for non-active player
            selector.classList.add('disabled');
            const buttons = selector.querySelectorAll('.piece-option');
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.classList.remove('selected');
            });
        }
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
     * Update turn indicator (Actualizar indicador de turno)
     *
     * Esta función se encarga de actualizar el indicador visual del turno actual.
     * Hace 3 cosas:
     * 1. Actualiza el texto ("CYAN PLAYER" o "MAGENTA PLAYER")
     * 2. Cambia el color del texto
     * 3. Cambia el borde y glow del contenedor
     *
     * Técnica: BEM-style modifiers con clases CSS
     * - Removemos las clases anteriores (.turn-cyan, .turn-magenta)
     * - Agregamos la clase correspondiente al jugador actual
     * - El CSS hace la transición suave automáticamente
     */
    updateTurnIndicator() {
        // 1. Obtener elementos del DOM
        const turnText = document.getElementById('currentTurnText');
        const turnContainer = document.querySelector('.turn-indicator');

        // 2. Actualizar el texto del turno
        turnText.textContent = GameState.currentPlayer.toUpperCase() + ' PLAYER';

        // 3. Cambiar color del texto según jugador
        // Operador ternario: condición ? valor_si_true : valor_si_false
        turnText.style.color = GameState.currentPlayer === 'cyan'
            ? 'var(--cyan-primary)'  // Si es cyan, usar color cyan
            : 'var(--magenta-primary)'; // Si es magenta, usar color magenta

        // 4. Cambiar el borde y glow del contenedor
        // Primero removemos ambas clases (limpieza)
        turnContainer.classList.remove('turn-cyan', 'turn-magenta');
        // Luego agregamos la clase correspondiente al jugador actual
        turnContainer.classList.add(`turn-${GameState.currentPlayer}`);
        // Ejemplo: Si currentPlayer es 'cyan', agrega clase 'turn-cyan'
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

        // Clear board highlights
        BoardRenderer.clearHighlights();

        // Re-render board (clears all pieces)
        BoardRenderer.renderBoard();

        // Update UI
        this.updateAll();

        // Note: GravityPhase listeners are already attached (done once on page load)
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
