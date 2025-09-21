/**
 * Memory Matrix - Versión con Chess.js + Chessground
 * ChessArcade - Controlador principal del juego usando librerías
 */

class MemoryMatrixLib {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 30;
        this.gameState = 'ready'; // ready, viewing, placing, completed
        this.score = 0;
        this.accuracy = 100;
        this.totalMoves = 0;
        this.correctMoves = 0;
        this.startTime = null;
        this.viewTimer = null;
        this.chessInstance = null;
        this.chessgroundInstance = null;

        // Cache de elementos DOM
        this.elements = {};
        this.sounds = {};
        this.currentLevelConfig = null;
        this.hiddenPieces = [];
        this.originalPosition = null;
        this.userPlacedPieces = [];

        this.init();
    }

    init() {
        console.log('🧠 Memory Matrix Library iniciado');
        this.cacheElements();
        this.initChessJs();
        this.initChessground();
        this.initSounds();
        this.bindEvents();
        this.loadLevel(this.currentLevel);
    }

    cacheElements() {
        this.elements = {
            // UI elements
            levelNumber: document.getElementById('levelNumber'),
            levelName: document.getElementById('levelName'),
            levelPhase: document.getElementById('levelPhase'),
            levelDescription: document.getElementById('levelDescription'),
            piecesTotal: document.getElementById('piecesTotal'),
            piecesHidden: document.getElementById('piecesHidden'),
            viewTime: document.getElementById('viewTime'),
            score: document.getElementById('score'),
            accuracy: document.getElementById('accuracy'),
            currentLevel: document.getElementById('currentLevel'),

            // Educational panel
            educationalPanel: document.getElementById('educationalPanel'),
            panelTitle: document.getElementById('panelTitle'),
            levelExplanation: document.getElementById('levelExplanation'),

            // Game board
            chessboard: document.getElementById('chessboard'),
            boardOverlay: document.getElementById('boardOverlay'),
            overlayText: document.getElementById('overlayText'),
            overlayCountdown: document.getElementById('overlayCountdown'),
            phaseIndicator: document.getElementById('phaseIndicator'),

            // Piece bank
            pieceBankContainer: document.getElementById('pieceBankContainer'),
            pieceBank: document.getElementById('pieceBank'),

            // Controls
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            hintBtn: document.getElementById('hintBtn'),
            skipPhaseBtn: document.getElementById('skipPhaseBtn'),

            // Feedback and completion
            feedbackDisplay: document.getElementById('feedbackDisplay'),
            feedbackIcon: document.getElementById('feedbackIcon'),
            feedbackText: document.getElementById('feedbackText'),
            feedbackExplanation: document.getElementById('feedbackExplanation'),
            levelCompleteScreen: document.getElementById('levelCompleteScreen'),
            completeTitle: document.getElementById('completeTitle'),
            finalScore: document.getElementById('finalScore'),
            accuracyFinal: document.getElementById('accuracyFinal'),
            timeTotal: document.getElementById('timeTotal'),
            lessonContent: document.getElementById('lessonContent'),
            nextLevelBtn: document.getElementById('nextLevelBtn'),
            repeatLevelBtn: document.getElementById('repeatLevelBtn'),
            mainMenuBtn: document.getElementById('mainMenuBtn'),

            // Navigation
            homeBtn: document.getElementById('homeBtn'),
            soundToggle: document.getElementById('soundToggle')
        };
    }

    initChessJs() {
        // Crear instancia de Chess.js
        try {
            this.chessInstance = new Chess();
            console.log('♛ Chess.js inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Chess.js:', error);
            // Crear instancia sin parámetros como fallback
            try {
                this.chessInstance = new Chess();
                console.log('♛ Chess.js inicializado con fallback');
            } catch (fallbackError) {
                console.error('❌ Error crítico con Chess.js:', fallbackError);
                throw fallbackError;
            }
        }
    }

    initChessground() {
        // Configurar Chessground
        const config = {
            coordinates: true,
            viewOnly: true,
            orientation: 'white',
            fen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1', // FEN inicial para mostrar algo
            movable: {
                free: false,
                color: 'both'
            },
            draggable: {
                enabled: true,
                distance: 3,
                autoDistance: true
            },
            events: {
                click: this.onSquareClick.bind(this),
                drop: this.onPieceDrop.bind(this),
                dragStart: this.onDragStart.bind(this)
            }
        };

        try {
            this.chessgroundInstance = Chessground(this.elements.chessboard, config);
            console.log('🏁 Chessground inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Chessground:', error);
        }
    }

    initSounds() {
        if (typeof Howl !== 'undefined') {
            this.sounds = {
                correct: new Howl({
                    src: ['../../../assets/sounds/correct.mp3'],
                    volume: 0.5
                }),
                wrong: new Howl({
                    src: ['../../../assets/sounds/wrong.mp3'],
                    volume: 0.5
                }),
                complete: new Howl({
                    src: ['../../../assets/sounds/complete.mp3'],
                    volume: 0.7
                }),
                tick: new Howl({
                    src: ['../../../assets/sounds/tick.mp3'],
                    volume: 0.3
                })
            };
        }
        console.log('🔊 Sonidos inicializados');
    }

    bindEvents() {
        // Controles principales
        this.elements.startBtn.addEventListener('click', () => this.startLevel());
        this.elements.pauseBtn.addEventListener('click', () => this.pauseGame());
        this.elements.hintBtn.addEventListener('click', () => this.showHint());
        this.elements.skipPhaseBtn.addEventListener('click', () => this.skipPhase());

        // Pantalla de completar nivel
        this.elements.nextLevelBtn.addEventListener('click', () => this.nextLevel());
        this.elements.repeatLevelBtn.addEventListener('click', () => this.repeatLevel());
        this.elements.mainMenuBtn.addEventListener('click', () => this.goToMainMenu());

        // Navegación
        this.elements.homeBtn.addEventListener('click', () => this.goToMainMenu());
        this.elements.soundToggle.addEventListener('click', () => this.toggleSound());

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    loadLevel(levelNumber) {
        this.currentLevelConfig = getLevelConfig(levelNumber);

        if (!this.currentLevelConfig) {
            console.error(`❌ Nivel ${levelNumber} no encontrado`);
            return;
        }

        console.log(`📖 Cargando nivel ${levelNumber}: ${this.currentLevelConfig.name}`);

        // Actualizar UI
        this.updateLevelUI();
        this.updateStatsUI();
        this.updateEducationalPanel();

        // Cargar posición en Chess.js
        this.chessInstance.load(this.currentLevelConfig.fen);

        // Mostrar posición en Chessground
        this.chessgroundInstance.set({
            fen: this.currentLevelConfig.fen,
            viewOnly: true
        });

        // Reset estado
        this.gameState = 'ready';
        this.hiddenPieces = [...this.currentLevelConfig.pieces_hidden];
        this.userPlacedPieces = [];
        this.originalPosition = this.chessInstance.board();

        // Ocultar elementos de juego
        this.elements.pieceBankContainer.style.display = 'none';
        this.elements.boardOverlay.style.display = 'none';

        // Habilitar botón de inicio
        this.elements.startBtn.disabled = false;
        this.elements.startBtn.textContent = 'EMPEZAR NIVEL';
    }

    updateLevelUI() {
        const config = this.currentLevelConfig;
        this.elements.levelNumber.textContent = this.currentLevel;
        this.elements.levelName.textContent = config.name;
        this.elements.levelDescription.textContent = config.explanation;

        // Determinar fase basada en el nivel
        let phase = '🔸 Estructura Base';
        if (this.currentLevel <= 3) phase = '🔸 Estructura Base';
        else if (this.currentLevel <= 10) phase = '🟡 Baby Memory';
        else if (this.currentLevel <= 20) phase = '🔵 Memoria Avanzada';
        else phase = '🔴 Grandmaster';

        this.elements.levelPhase.textContent = phase;
        this.elements.currentLevel.textContent = this.currentLevel;
    }

    updateStatsUI() {
        const config = this.currentLevelConfig;
        this.elements.piecesTotal.textContent = config.pieces_total;
        this.elements.piecesHidden.textContent = config.pieces_hidden.length;
        this.elements.viewTime.textContent = (config.view_time / 1000).toFixed(1) + 's';
        this.elements.score.textContent = this.score;
        this.elements.accuracy.textContent = this.accuracy + '%';
    }

    updateEducationalPanel() {
        const config = this.currentLevelConfig;
        this.elements.panelTitle.textContent = '🏰 ' + config.name;
        this.elements.levelExplanation.textContent = config.explanation;
    }

    startLevel() {
        if (this.gameState !== 'ready') return;

        this.gameState = 'viewing';
        this.startTime = Date.now();

        console.log(`🎯 Iniciando nivel ${this.currentLevel}`);

        // Deshabilitar controles
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;

        // Mostrar overlay de memorización
        this.showMemorizationPhase();
    }

    showMemorizationPhase() {
        const viewTime = this.currentLevelConfig.view_time;
        let countdown = Math.ceil(viewTime / 1000);

        this.elements.overlayText.textContent = '¡Memoriza la posición!';
        this.elements.overlayCountdown.textContent = countdown;
        this.elements.phaseIndicator.textContent = '🧠 Fase de memoria';
        this.elements.boardOverlay.style.display = 'flex';
        this.elements.boardOverlay.classList.add('show');

        // Timer de cuenta regresiva
        this.viewTimer = setInterval(() => {
            countdown--;
            this.elements.overlayCountdown.textContent = countdown;

            if (this.sounds.tick) {
                this.sounds.tick.play();
            }

            if (countdown <= 0) {
                clearInterval(this.viewTimer);
                this.startPlacementPhase();
            }
        }, 1000);
    }

    startPlacementPhase() {
        this.gameState = 'placing';
        console.log('🎯 Iniciando fase de colocación');

        // Ocultar overlay
        this.elements.boardOverlay.classList.remove('show');
        setTimeout(() => {
            this.elements.boardOverlay.style.display = 'none';
        }, 300);

        // Ocultar piezas especificadas del tablero
        this.hidePieces();

        // Crear banco de piezas
        this.createPieceBank();

        // Habilitar interacción con Chessground
        this.chessgroundInstance.set({
            viewOnly: false,
            movable: {
                free: true,
                color: 'both'
            }
        });
    }

    hidePieces() {
        // Obtener posición actual
        const currentPieces = {};
        const board = this.chessInstance.board();

        console.log('🎯 Ocultando piezas. Piezas ocultas:', this.hiddenPieces);

        // Convertir tablero de Chess.js a formato Chessground
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = board[rank][file];
                if (piece) {
                    const square = String.fromCharCode(97 + file) + (8 - rank);

                    // Solo mostrar si no está en la lista de ocultas
                    if (!this.hiddenPieces.includes(square)) {
                        currentPieces[square] = {
                            color: piece.color === 'w' ? 'white' : 'black',
                            role: piece.type === 'p' ? 'pawn' : piece.type === 'r' ? 'rook' :
                                  piece.type === 'n' ? 'knight' : piece.type === 'b' ? 'bishop' :
                                  piece.type === 'q' ? 'queen' : 'king'
                        };
                        console.log(`✅ Mostrando pieza en ${square}:`, currentPieces[square]);
                    } else {
                        console.log(`❌ Ocultando pieza en ${square}`);
                    }
                }
            }
        }

        console.log('🎯 Piezas visibles finales:', currentPieces);
        this.chessgroundInstance.setPieces(currentPieces);
    }

    createPieceBank() {
        const bankElement = this.elements.pieceBank;
        bankElement.innerHTML = '';

        // Obtener piezas ocultas
        const board = this.chessInstance.board();
        const hiddenPiecesData = [];

        this.hiddenPieces.forEach(square => {
            const file = square.charCodeAt(0) - 97;
            const rank = 8 - parseInt(square[1]);
            const piece = board[rank][file];

            if (piece) {
                hiddenPiecesData.push({
                    square: square,
                    color: piece.color === 'w' ? 'white' : 'black',
                    role: piece.type === 'p' ? 'pawn' : piece.type === 'r' ? 'rook' :
                          piece.type === 'n' ? 'knight' : piece.type === 'b' ? 'bishop' :
                          piece.type === 'q' ? 'queen' : 'king',
                    type: piece.type
                });
            }
        });

        // Crear elementos drag and drop para el banco
        hiddenPiecesData.forEach((pieceData, index) => {
            const pieceElement = document.createElement('div');
            pieceElement.className = `draggable-piece ${pieceData.color} ${pieceData.role}`;
            pieceElement.draggable = true;
            pieceElement.dataset.piece = JSON.stringify(pieceData);
            pieceElement.dataset.originalSquare = pieceData.square;

            // Eventos de drag
            pieceElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(pieceData));
                e.dataTransfer.effectAllowed = 'move';
                pieceElement.style.opacity = '0.5';
            });

            pieceElement.addEventListener('dragend', (e) => {
                pieceElement.style.opacity = '1';
            });

            bankElement.appendChild(pieceElement);
        });

        // Mostrar banco de piezas
        this.elements.pieceBankContainer.style.display = 'flex';
    }

    onSquareClick(square) {
        if (this.gameState !== 'placing') return;
        console.log(`🎯 Click en ${square}`);
    }

    onDragStart(square) {
        if (this.gameState !== 'placing') return;
        console.log(`🎯 Drag start en ${square}`);
    }

    onPieceDrop(square) {
        if (this.gameState !== 'placing') return;
        console.log(`🎯 Drop en ${square}`);

        // Esta función se llamará cuando se suelte una pieza en el tablero
        // La lógica de verificación se manejará en los eventos del banco de piezas
    }

    placePiece(pieceData, targetSquare) {
        console.log(`🎯 Colocando ${pieceData.role} en ${targetSquare}`);

        // Verificar si la colocación es correcta
        const isCorrect = pieceData.square === targetSquare;

        if (isCorrect) {
            // Colocación correcta
            this.handleCorrectPlacement(pieceData, targetSquare);
        } else {
            // Colocación incorrecta
            this.handleIncorrectPlacement(pieceData, targetSquare);
        }

        // Actualizar estadísticas
        this.totalMoves++;
        if (isCorrect) {
            this.correctMoves++;
            this.userPlacedPieces.push(targetSquare);
        }

        this.updateAccuracy();
        this.updateStatsUI();

        // Verificar si el nivel está completo
        if (this.userPlacedPieces.length === this.hiddenPieces.length) {
            this.completeLevel();
        }
    }

    handleCorrectPlacement(pieceData, square) {
        console.log(`✅ Colocación correcta: ${pieceData.role} en ${square}`);

        // Colocar pieza en Chessground
        const currentPieces = this.chessgroundInstance.state.pieces;
        currentPieces.set(square, {
            color: pieceData.color,
            role: pieceData.role
        });
        this.chessgroundInstance.setPieces(Object.fromEntries(currentPieces));

        // Remover del banco
        this.removePieceFromBank(pieceData.square);

        // Mostrar feedback
        this.showFeedback(true, '¡Correcto!', `Has colocado la ${pieceData.role} en el lugar correcto`);

        // Sonido
        if (this.sounds.correct) {
            this.sounds.correct.play();
        }

        // Actualizar puntuación
        this.score += 100;
    }

    handleIncorrectPlacement(pieceData, square) {
        console.log(`❌ Colocación incorrecta: ${pieceData.role} en ${square} (debería ser ${pieceData.square})`);

        // Mostrar feedback
        this.showFeedback(false, 'Incorrecto', `La ${pieceData.role} va en ${pieceData.square}, no en ${square}`);

        // Sonido
        if (this.sounds.wrong) {
            this.sounds.wrong.play();
        }

        // Penalización
        this.score = Math.max(0, this.score - 25);
    }

    removePieceFromBank(originalSquare) {
        const bankPieces = this.elements.pieceBank.querySelectorAll('.draggable-piece');
        bankPieces.forEach(piece => {
            if (piece.dataset.originalSquare === originalSquare) {
                piece.remove();
            }
        });
    }

    showFeedback(isCorrect, title, message) {
        this.elements.feedbackIcon.textContent = isCorrect ? '✅' : '❌';
        this.elements.feedbackText.textContent = title;
        this.elements.feedbackExplanation.textContent = message;

        this.elements.feedbackDisplay.style.display = 'block';

        setTimeout(() => {
            this.elements.feedbackDisplay.style.display = 'none';
        }, 2000);
    }

    updateAccuracy() {
        this.accuracy = this.totalMoves > 0 ? Math.round((this.correctMoves / this.totalMoves) * 100) : 100;
    }

    completeLevel() {
        this.gameState = 'completed';
        const endTime = Date.now();
        const totalTime = Math.round((endTime - this.startTime) / 1000);

        console.log(`🎉 ¡Nivel ${this.currentLevel} completado!`);

        // Sonido de completar
        if (this.sounds.complete) {
            this.sounds.complete.play();
        }

        // Mostrar pantalla de completar
        this.showLevelCompleteScreen(totalTime);
    }

    showLevelCompleteScreen(totalTime) {
        this.elements.completeTitle.textContent = `¡NIVEL ${this.currentLevel} COMPLETADO!`;
        this.elements.finalScore.textContent = this.score;
        this.elements.accuracyFinal.textContent = this.accuracy + '%';
        this.elements.timeTotal.textContent = totalTime + 's';
        this.elements.lessonContent.textContent = this.currentLevelConfig.lesson;

        this.elements.levelCompleteScreen.style.display = 'flex';
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
            this.elements.levelCompleteScreen.style.display = 'none';
        } else {
            alert('🎉 ¡Has completado todos los niveles!');
        }
    }

    repeatLevel() {
        this.loadLevel(this.currentLevel);
        this.elements.levelCompleteScreen.style.display = 'none';
    }

    goToMainMenu() {
        window.location.href = '../../../index.html';
    }

    pauseGame() {
        // Implementar pausa si es necesario
        console.log('⏸️ Juego pausado');
    }

    showHint() {
        if (this.gameState !== 'placing') return;

        // Mostrar una pista resaltando una casilla correcta
        if (this.hiddenPieces.length > 0 && this.userPlacedPieces.length < this.hiddenPieces.length) {
            const remainingPieces = this.hiddenPieces.filter(square => !this.userPlacedPieces.includes(square));
            const hintSquare = remainingPieces[0];

            // Resaltar casilla con Chessground
            this.chessgroundInstance.setShapes([{
                orig: hintSquare,
                brush: 'yellow'
            }]);

            // Remover resaltado después de 3 segundos
            setTimeout(() => {
                this.chessgroundInstance.setShapes([]);
            }, 3000);

            console.log(`💡 Pista: una pieza va en ${hintSquare}`);
        }
    }

    skipPhase() {
        if (this.gameState === 'viewing') {
            clearInterval(this.viewTimer);
            this.startPlacementPhase();
        }
    }

    toggleSound() {
        // Implementar toggle de sonido
        const toggle = this.elements.soundToggle;
        if (toggle.classList.contains('muted')) {
            toggle.classList.remove('muted');
            toggle.textContent = '🔊';
            Howler.mute(false);
        } else {
            toggle.classList.add('muted');
            toggle.textContent = '🔇';
            Howler.mute(true);
        }
    }

    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (this.gameState === 'ready') {
                    this.startLevel();
                }
                break;
            case 'h':
                this.showHint();
                break;
            case 'r':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.repeatLevel();
                }
                break;
            case 'n':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.nextLevel();
                }
                break;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM cargado, verificando librerías...');

    // Verificar que las librerías estén cargadas
    if (typeof Chess === 'undefined') {
        console.error('❌ Chess.js no está cargado');
        alert('Error: Chess.js no se pudo cargar. Verifica la conexión o archivos locales.');
        return;
    }

    if (typeof Chessground === 'undefined') {
        console.error('❌ Chessground no está cargado');
        alert('Error: Chessground no se pudo cargar. Verifica la conexión o archivos locales.');
        return;
    }

    if (typeof MEMORY_LEVELS === 'undefined') {
        console.error('❌ Memory Levels no está cargado');
        alert('Error: Memory Levels no se pudo cargar.');
        return;
    }

    console.log('✅ Todas las librerías cargadas correctamente');
    console.log('♛ Chess.js disponible:', typeof Chess);
    console.log('🏁 Chessground disponible:', typeof Chessground);
    console.log('📚 Memory Levels disponible:', typeof MEMORY_LEVELS);

    // Inicializar el juego
    try {
        window.memoryGame = new MemoryMatrixLib();
        console.log('🎮 Juego inicializado correctamente');
    } catch (error) {
        console.error('❌ Error inicializando el juego:', error);
        alert('Error inicializando el juego: ' + error.message);
    }
});

// Manejar eventos de drag and drop desde el banco al tablero
document.addEventListener('DOMContentLoaded', () => {
    // Configurar eventos de drop en el tablero - función mejorada
    function setupDropEvents() {
        const squares = document.querySelectorAll('.cg-square');
        console.log('🎯 Configurando eventos de drop en', squares.length, 'casillas');

        squares.forEach(square => {
            // Remover listeners existentes
            square.removeEventListener('dragover', handleDragOver);
            square.removeEventListener('drop', handleDrop);

            // Agregar nuevos listeners
            square.addEventListener('dragover', handleDragOver);
            square.addEventListener('drop', handleDrop);
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.target.style.backgroundColor = 'rgba(0, 255, 255, 0.3)'; // Highlight visual
    }

    function handleDrop(e) {
        e.preventDefault();
        e.target.style.backgroundColor = ''; // Remover highlight

        try {
            const pieceData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const targetSquare = e.target.dataset.square;

            console.log('🎯 Drop event:', { pieceData, targetSquare });

            if (window.memoryGame && targetSquare) {
                window.memoryGame.placePiece(pieceData, targetSquare);
            }
        } catch (error) {
            console.error('❌ Error en drop event:', error);
        }
    }

    // Configurar eventos después de que se cree el tablero
    setTimeout(setupDropEvents, 1500);

    // Re-configurar cuando se actualice el tablero
    if (window.memoryGame) {
        const originalHidePieces = window.memoryGame.hidePieces;
        window.memoryGame.hidePieces = function() {
            originalHidePieces.call(this);
            setTimeout(setupDropEvents, 100);
        };
    }
});

console.log('🧠 Memory Matrix Library Script cargado');