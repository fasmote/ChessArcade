/**
 * Memory Matrix Engine - Motor principal del juego
 * ChessArcade - Sistema de memoria ajedrecística progresiva
 * 
 * Funcionalidades:
 * - Gestión de 30 niveles progresivos
 * - Sistema pedagógico por capas (A/B/C)
 * - Integración con Chessground + Chess.js
 * - Mecánicas de memoria (mostrar/ocultar/verificar)
 */

class MemoryMatrixEngine {
    constructor() {
        // Estado principal del juego
        this.gameState = {
            level: 1,
            currentPhase: 'A', // A=peones, B=fantasma, C=completo
            score: 0,
            accuracy: 100,
            correctPlacements: 0,
            totalAttempts: 0,
            gameActive: false,
            viewPhase: true, // true=viendo posición, false=colocando piezas
            soundEnabled: true,
            currentPosition: null,
            hiddenPieces: [],
            placedPieces: {},
            sessionStartTime: Date.now(),
            hintsUsed: 0,
            levelStartTime: 0
        };
        
        // Referencias a bibliotecas externas
        this.chessboard = null; // Instancia de Chessground
        this.chessLogic = null; // Instancia de Chess.js
        this.audioManager = null;
        
        // Configuración de niveles
        this.loadLevelConfiguration();
        
        // Inicializar
        this.init();
    }
    
    // ========================================
    // INICIALIZACIÓN
    // ========================================
    
    init() {
        console.log('🧠 Memory Matrix Engine iniciando...');

        // Cargar preferencias del usuario
        this.loadPreferences();

        // Configurar audio
        this.setupAudio();

        // Configurar tablero - ESTO ES CRÍTICO
        this.setupChessboard();

        // Configurar eventos
        this.setupEventListeners();

        // Test adicional
        if (this.chessboard) {
            console.log('✅ Chessboard instancia creada correctamente');
        } else {
            console.error('❌ Chessboard NO se creó');
        }

        // Analytics
        this.trackEvent('engine_init', {
            version: '1.0',
            timestamp: Date.now()
        });

        console.log('✅ Memory Matrix Engine listo');
    }
    
    setupChessboard() {
        const boardElement = document.getElementById('chessboard');
        if (!boardElement) {
            console.error('❌ Elemento #chessboard no encontrado');
            return;
        }

        // Verificar que Chessground esté disponible
        if (typeof Chessground === 'undefined') {
            console.error('❌ Chessground no está cargado');
            return;
        }

        // Configuración inicial de Chessground
        const config = {
            fen: this.LEVELS[1].fen, // Posición inicial del nivel 1
            orientation: 'white',
            coordinates: true,
            viewOnly: true, // Solo visualización al inicio
            animation: {
                enabled: true,
                duration: 300
            },
            highlight: {
                lastMove: false,
                check: false
            },
            drawable: {
                enabled: false
            },
            events: {
                move: (from, to, capturedPiece) => {
                    this.handlePiecePlacement(from, to, { capturedPiece });
                }
            }
        };

        // Crear instancia de Chessground
        this.chessboard = Chessground(boardElement, config);

        console.log('♟️ Tablero configurado correctamente');
    }
    
    setupAudio() {
        // Configurar Howler.js
        this.audioManager = {
            sounds: {
                correct: new Howl({
                    src: ['https://lichess1.org/assets/sound/standard/Move.ogg'],
                    volume: 0.6
                }),
                wrong: new Howl({
                    src: ['https://lichess1.org/assets/sound/standard/Capture.ogg'],
                    volume: 0.6
                }),
                levelUp: new Howl({
                    src: ['https://lichess1.org/assets/sound/standard/GenericNotify.ogg'],
                    volume: 0.8
                }),
                phaseComplete: new Howl({
                    src: ['https://lichess1.org/assets/sound/standard/Confirmation.ogg'],
                    volume: 0.7
                })
            },
            
            play: (soundName) => {
                if (this.gameState.soundEnabled && this.audioManager.sounds[soundName]) {
                    this.audioManager.sounds[soundName].play();
                }
            }
        };
        
        console.log('🔊 Sistema de audio configurado');
    }
    
    setupEventListeners() {
        // Los event listeners se configuran en setupChessboard
        console.log('🎮 Event listeners configurados');
    }
    
    // ========================================
    // CONFIGURACIÓN DE NIVELES
    // ========================================
    
    loadLevelConfiguration() {
        // Usar configuración externa de memory-levels.js
        if (typeof MEMORY_LEVELS !== 'undefined') {
            this.LEVELS = MEMORY_LEVELS;
            console.log(`📚 Configuración externa cargada: ${Object.keys(this.LEVELS).length} niveles`);
        } else {
            // Fallback básico si no está disponible
            this.LEVELS = {
                1: {
                    name: "DOS REYES SOLOS",
                    type: "basic_mate",
                    target_age: "4-5 años",
                    fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
                    pieces_total: 2,
                    pieces_hidden: ['e8', 'e1'],
                    view_time: 8000,
                    explanation: "🤴 Los reyes nunca pueden estar en casillas adyacentes",
                    lesson: "Regla básica: los reyes no pueden tocarse"
                }
            };
            console.warn('⚠️ Usando configuración fallback: 1 nivel básico');
        }
    }
    
    // ========================================
    // CONTROL PRINCIPAL DEL JUEGO
    // ========================================
    
    async startLevel(levelNumber) {
        console.log(`🎯 Iniciando nivel ${levelNumber}`);
        
        const levelConfig = this.LEVELS[levelNumber];
        if (!levelConfig) {
            console.error(`❌ Nivel ${levelNumber} no existe`);
            return false;
        }
        
        // Resetear estado para el nuevo nivel
        this.gameState.level = levelNumber;
        this.gameState.currentPhase = 'memory';
        this.gameState.gameActive = true;
        this.gameState.viewPhase = true;
        this.gameState.levelStartTime = Date.now();
        this.gameState.correctPlacements = 0;
        this.gameState.totalAttempts = 0;
        this.gameState.hintsUsed = 0;
        this.gameState.placedPieces = {};
        this.gameState.currentPosition = levelConfig;
        
        // Configurar UI
        this.updateUI();
        
        // Mostrar información educativa
        this.showEducationalInfo(levelConfig);
        
        // Comenzar fase de memoria
        this.startMemoryPhase(levelConfig);
        
        // Analytics
        this.trackEvent('level_start', {
            level: levelNumber,
            type: levelConfig.type,
            target_age: levelConfig.target_age
        });
        
        return true;
    }
    
    startMemoryPhase(levelConfig) {
        console.log(`👁️ Iniciando fase de memoria - ${levelConfig.view_time}ms`);
        
        // Mostrar posición completa
        this.chessboard.set({
            fen: levelConfig.fen,
            viewOnly: true,
            coordinates: true
        });
        
        // Mostrar overlay con información
        this.showMemoryOverlay(levelConfig);
        
        // Countdown timer
        this.startMemoryCountdown(levelConfig.view_time);
        
        // Después del tiempo, activar modo de colocación
        setTimeout(() => {
            this.startPlacementPhase(levelConfig);
        }, levelConfig.view_time);
    }
    
    startPlacementPhase(levelConfig) {
        console.log(`🎯 Iniciando fase de colocación`);

        this.gameState.viewPhase = false;

        // Ocultar overlay
        this.hideMemoryOverlay();

        // Ocultar piezas específicas
        this.hidePieces(levelConfig.pieces_hidden);

        // Activar modo de colocación - permitir edición libre
        this.chessboard.set({
            viewOnly: false,
            movable: {
                free: true,
                color: 'both'
            },
            draggable: {
                enabled: true,
                showGhost: true
            },
            selectable: {
                enabled: true
            }
        });

        // Agregar banco de piezas
        this.showPieceBank(levelConfig);

        // Mostrar feedback
        this.showPlacementInstructions(levelConfig);

        // Analytics
        this.trackEvent('placement_phase_start', {
            level: this.gameState.level,
            pieces_to_place: levelConfig.pieces_hidden.length
        });
    }
    
    // ========================================
    // GESTIÓN DE PIEZAS Y MEMORIA
    // ========================================
    
    hidePieces(squares) {
        console.log(`🙈 Ocultando piezas en: ${squares.join(', ')}`);

        this.gameState.hiddenPieces = squares;

        // Verificar que Chess.js esté disponible
        if (typeof Chess === 'undefined') {
            console.error('❌ Chess.js no está cargado');
            return;
        }

        // Obtener posición actual
        const currentFen = this.chessboard.getFen();
        const chess = new Chess(currentFen);

        // Crear nueva posición sin las piezas ocultas
        squares.forEach(square => {
            chess.remove(square);
        });

        // Actualizar tablero
        this.chessboard.set({
            fen: chess.fen()
        });

        // Resaltar casillas vacías donde van las piezas
        this.highlightTargetSquares(squares);
    }
    
    highlightTargetSquares(squares) {
        // Usar el sistema de highlighting de Chessground
        const shapes = {};
        squares.forEach(square => {
            shapes[square] = 'paleGreen';
        });

        this.chessboard.set({
            lastMove: null,
            selected: null,
            drawable: {
                shapes: []
            }
        });

        // Agregar círculos verdes en las casillas objetivo
        setTimeout(() => {
            this.chessboard.setShapes(squares.map(square => ({
                orig: square,
                brush: 'green'
            })));
        }, 100);
    }
    
    handlePiecePlacement(from, to, metadata) {
        console.log(`🎯 Pieza colocada: ${from} → ${to}`);
        
        if (this.gameState.viewPhase) {
            console.log('⚠️ Aún en fase de memoria, ignorando movimiento');
            return;
        }
        
        // Verificar si la colocación es correcta
        const isCorrect = this.verifyPlacement(to, metadata);
        
        this.gameState.totalAttempts++;
        
        if (isCorrect) {
            this.handleCorrectPlacement(to);
        } else {
            this.handleIncorrectPlacement(to);
        }
        
        // Actualizar UI
        this.updateAccuracy();
        this.updateUI();
        
        // Verificar si nivel completado
        this.checkLevelCompletion();
    }
    
    verifyPlacement(square, metadata) {
        // Verificar si esta casilla debería tener una pieza
        const levelConfig = this.gameState.currentPosition;

        // Simplificado: verificar si el square está en la lista de casillas ocultas
        return levelConfig.pieces_hidden.includes(square);
    }

    getExpectedPieces(fen, hiddenSquares) {
        if (typeof Chess === 'undefined') {
            console.warn('⚠️ Chess.js no disponible, usando verificación simplificada');
            return {};
        }

        const chess = new Chess(fen);
        const expectedPieces = {};

        hiddenSquares.forEach(square => {
            const piece = chess.get(square);
            if (piece) {
                expectedPieces[square] = piece;
            }
        });

        return expectedPieces;
    }
    
    handleCorrectPlacement(square) {
        console.log(`✅ Colocación correcta en ${square}`);
        
        this.gameState.correctPlacements++;
        this.gameState.placedPieces[square] = true;
        
        // Audio feedback
        this.audioManager.play('correct');
        
        // Efecto visual
        this.showCorrectPlacementEffect(square);
        
        // Puntuación
        this.addScore(100);
        
        // Analytics
        this.trackEvent('correct_placement', {
            level: this.gameState.level,
            square: square,
            attempt: this.gameState.totalAttempts
        });
    }
    
    handleIncorrectPlacement(square) {
        console.log(`❌ Colocación incorrecta en ${square}`);
        
        // Audio feedback
        this.audioManager.play('wrong');
        
        // Efecto visual
        this.showIncorrectPlacementEffect(square);
        
        // Game over en niveles básicos
        if (this.gameState.level <= 10) {
            setTimeout(() => {
                this.gameOver('incorrect_placement');
            }, 1500);
        }
        
        // Analytics
        this.trackEvent('incorrect_placement', {
            level: this.gameState.level,
            square: square,
            attempt: this.gameState.totalAttempts
        });
    }
    
    // ========================================
    // EFECTOS VISUALES Y UI
    // ========================================
    
    showMemoryOverlay(levelConfig) {
        const overlay = document.getElementById('boardOverlay');
        const overlayText = document.getElementById('overlayText');
        const countdown = document.getElementById('overlayCountdown');
        const phaseIndicator = document.getElementById('phaseIndicator');
        
        if (overlay) {
            overlayText.textContent = '¡Memoriza la posición!';
            countdown.textContent = Math.ceil(levelConfig.view_time / 1000);
            phaseIndicator.textContent = '🧠 Fase de memoria';
            overlay.classList.add('show');
        }
    }
    
    hideMemoryOverlay() {
        const overlay = document.getElementById('boardOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }
    
    startMemoryCountdown(duration) {
        const countdown = document.getElementById('overlayCountdown');
        if (!countdown) return;
        
        let timeLeft = duration;
        
        const interval = setInterval(() => {
            timeLeft -= 1000;
            countdown.textContent = Math.ceil(timeLeft / 1000);
            
            if (timeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }
    
    showEducationalInfo(levelConfig) {
        const panel = document.getElementById('educationalPanel');
        const explanation = document.getElementById('levelExplanation');
        
        if (panel && explanation) {
            explanation.textContent = levelConfig.explanation;
            panel.style.display = 'block';
        }
    }
    
    showPieceBank(levelConfig) {
        // Mostrar las piezas que necesita colocar el usuario
        const originalFen = levelConfig.fen;
        const chess = new Chess(originalFen);
        const missingPieces = [];

        levelConfig.pieces_hidden.forEach(square => {
            const piece = chess.get(square);
            if (piece) {
                missingPieces.push({ piece, square });
            }
        });

        // Usar una aproximación simplificada: permitir colocar cualquier pieza
        console.log(`💼 Banco de piezas: ${missingPieces.length} piezas necesarias`);
    }

    showPlacementInstructions(levelConfig) {
        const phaseIndicator = document.getElementById('phaseIndicator');
        if (phaseIndicator) {
            phaseIndicator.textContent = `🎯 Coloca las ${levelConfig.pieces_hidden.length} piezas en sus casillas correctas`;
        }
    }
    
    showCorrectPlacementEffect(square) {
        // Agregar clase CSS para animación
        const squareElement = document.querySelector(`[data-square="${square}"]`);
        if (squareElement) {
            squareElement.classList.add('correct-placement');
            setTimeout(() => {
                squareElement.classList.remove('correct-placement');
            }, 1000);
        }
    }
    
    showIncorrectPlacementEffect(square) {
        // Agregar clase CSS para animación
        const squareElement = document.querySelector(`[data-square="${square}"]`);
        if (squareElement) {
            squareElement.classList.add('incorrect-placement');
            setTimeout(() => {
                squareElement.classList.remove('incorrect-placement');
            }, 1000);
        }
    }
    
    updateUI() {
        // Actualizar información del nivel
        document.getElementById('levelNumber').textContent = this.gameState.level;
        document.getElementById('levelName').textContent = this.gameState.currentPosition.name;
        document.getElementById('currentLevel').textContent = this.gameState.level;
        
        // Actualizar estadísticas
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('accuracy').textContent = this.gameState.accuracy + '%';
        
        // Actualizar información de piezas
        document.getElementById('piecesTotal').textContent = this.gameState.currentPosition.pieces_total;
        document.getElementById('piecesHidden').textContent = this.gameState.currentPosition.pieces_hidden.length;
        document.getElementById('viewTime').textContent = (this.gameState.currentPosition.view_time / 1000).toFixed(1) + 's';
    }
    
    // ========================================
    // LÓGICA DE JUEGO
    // ========================================
    
    checkLevelCompletion() {
        const levelConfig = this.gameState.currentPosition;
        const requiredPlacements = levelConfig.pieces_hidden.length;
        
        if (this.gameState.correctPlacements >= requiredPlacements) {
            this.completeLevel();
        }
    }
    
    completeLevel() {
        console.log(`🏆 Nivel ${this.gameState.level} completado!`);
        
        this.gameState.gameActive = false;
        
        // Audio de éxito
        this.audioManager.play('levelUp');
        
        // Calcular estadísticas
        const completionTime = Date.now() - this.gameState.levelStartTime;
        const levelConfig = this.gameState.currentPosition;
        
        // Mostrar pantalla de éxito
        this.showLevelCompleteScreen({
            score: this.gameState.score,
            accuracy: this.gameState.accuracy,
            time: completionTime,
            lesson: levelConfig.lesson
        });
        
        // Guardar progreso
        this.saveProgress();
        
        // Analytics
        this.trackEvent('level_complete', {
            level: this.gameState.level,
            score: this.gameState.score,
            accuracy: this.gameState.accuracy,
            completion_time: completionTime,
            hints_used: this.gameState.hintsUsed
        });
    }
    
    gameOver(reason) {
        console.log(`💀 Game Over: ${reason}`);
        
        this.gameState.gameActive = false;
        
        // Mostrar pantalla de game over
        this.showGameOverScreen({
            reason: reason,
            score: this.gameState.score,
            level: this.gameState.level
        });
        
        // Analytics
        this.trackEvent('game_over', {
            level: this.gameState.level,
            reason: reason,
            score: this.gameState.score,
            placements_made: this.gameState.correctPlacements
        });
    }
    
    showLevelCompleteScreen(stats) {
        const screen = document.getElementById('levelCompleteScreen');
        const title = document.getElementById('completeTitle');
        const finalScore = document.getElementById('finalScore');
        const accuracyFinal = document.getElementById('accuracyFinal');
        const timeTotal = document.getElementById('timeTotal');
        const lessonContent = document.getElementById('lessonContent');
        
        if (screen) {
            title.textContent = '¡NIVEL COMPLETADO!';
            finalScore.textContent = stats.score;
            accuracyFinal.textContent = stats.accuracy + '%';
            timeTotal.textContent = Math.round(stats.time / 1000) + 's';
            lessonContent.textContent = stats.lesson;
            
            screen.style.display = 'flex';
        }
    }
    
    showGameOverScreen(data) {
        // Similar a showLevelCompleteScreen pero para game over
        const screen = document.getElementById('levelCompleteScreen');
        const title = document.getElementById('completeTitle');
        
        if (screen) {
            title.textContent = '¡INTÉNTALO DE NUEVO!';
            screen.style.display = 'flex';
        }
    }
    
    // ========================================
    // UTILIDADES
    // ========================================
    
    addScore(points) {
        this.gameState.score += points;
    }
    
    updateAccuracy() {
        if (this.gameState.totalAttempts > 0) {
            this.gameState.accuracy = Math.round(
                (this.gameState.correctPlacements / this.gameState.totalAttempts) * 100
            );
        }
    }
    
    // ========================================
    // PERSISTENCIA Y PREFERENCIAS
    // ========================================
    
    loadPreferences() {
        // Cargar configuración de audio
        const soundPref = localStorage.getItem('memoryMatrixSound');
        this.gameState.soundEnabled = soundPref !== 'disabled';
        
        // Cargar nivel guardado
        const savedLevel = localStorage.getItem('memoryMatrixLevel');
        if (savedLevel && parseInt(savedLevel) > 1) {
            this.gameState.level = parseInt(savedLevel);
        }
        
        console.log(`⚙️ Preferencias cargadas - Sonido: ${this.gameState.soundEnabled}, Nivel: ${this.gameState.level}`);
    }
    
    saveProgress() {
        // Guardar nivel actual
        localStorage.setItem('memoryMatrixLevel', this.gameState.level.toString());
        
        // Guardar configuración de sonido
        localStorage.setItem('memoryMatrixSound', this.gameState.soundEnabled ? 'enabled' : 'disabled');
        
        console.log(`💾 Progreso guardado - Nivel: ${this.gameState.level}`);
    }
    
    toggleSound() {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        this.saveProgress();
        
        // Analytics
        this.trackEvent('sound_toggled', {
            enabled: this.gameState.soundEnabled
        });
        
        return this.gameState.soundEnabled;
    }
    
    // ========================================
    // ANALYTICS
    // ========================================
    
    trackEvent(eventName, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'game': 'memory_matrix',
                'level': this.gameState.level,
                'score': this.gameState.score,
                'session_time': Date.now() - this.gameState.sessionStartTime,
                ...data
            });
        }
        
        console.log(`📊 Analytics: ${eventName}`, data);
    }
    
    // ========================================
    // API PÚBLICA
    // ========================================
    
    // Métodos que pueden ser llamados desde memory-matrix.js
    getCurrentLevel() {
        return this.gameState.level;
    }
    
    getGameState() {
        return { ...this.gameState }; // Copia del estado
    }
    
    isGameActive() {
        return this.gameState.gameActive;
    }
    
    pauseGame() {
        // TODO: Implementar pausa
        console.log('⏸️ Juego pausado');
    }
    
    resumeGame() {
        // TODO: Implementar reanudar
        console.log('▶️ Juego reanudado');
    }
    
    showHint() {
        if (this.gameState.hintsUsed < 3) {
            this.gameState.hintsUsed++;
            
            // Mostrar hint visual en el tablero
            this.highlightHintSquare();
            
            this.trackEvent('hint_used', {
                hint_number: this.gameState.hintsUsed
            });
            
            console.log(`💡 Hint usado (${this.gameState.hintsUsed}/3)`);
            return true;
        }
        
        console.log('❌ No hay más hints disponibles');
        return false;
    }
    
    highlightHintSquare() {
        // Resaltar una de las casillas donde falta colocar pieza
        const hiddenPieces = this.gameState.hiddenPieces;
        const placedPieces = Object.keys(this.gameState.placedPieces);
        const remainingSquares = hiddenPieces.filter(square => !placedPieces.includes(square));
        
        if (remainingSquares.length > 0) {
            const hintSquare = remainingSquares[0];
            
            // Agregar efecto visual temporal
            const shapes = [{
                orig: hintSquare,
                brush: 'yellow'
            }];
            
            this.chessboard.setShapes(shapes);
            
            // Remover hint después de 3 segundos
            setTimeout(() => {
                this.chessboard.setShapes([]);
            }, 3000);
        }
    }
    
    nextLevel() {
        if (this.gameState.level < Object.keys(this.LEVELS).length) {
            return this.startLevel(this.gameState.level + 1);
        }
        
        console.log('🏆 ¡Todos los niveles completados!');
        return false;
    }
    
    restartLevel() {
        return this.startLevel(this.gameState.level);
    }
}

// ========================================
// EXPORTAR PARA USO GLOBAL
// ========================================

// Hacer disponible globalmente
window.MemoryMatrixEngine = MemoryMatrixEngine;

console.log('🧠 Memory Matrix Engine cargado correctamente');
