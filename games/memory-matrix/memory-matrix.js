/**
 * Memory Matrix - Controlador Principal
 * ChessArcade - Conecta el motor del juego con la interfaz de usuario
 * 
 * Responsabilidades:
 * - Inicializar el engine y configurar eventos
 * - Manejar interacciones de usuario (botones, keyboard)
 * - Actualizar UI en respuesta a cambios del engine
 * - Gestionar transiciones entre pantallas
 */

class MemoryMatrixGame {
    constructor() {
        // Referencia al motor del juego
        this.engine = null;
        
        // Referencias a elementos DOM principales
        this.elements = {};
        
        // Estado de la UI
        this.uiState = {
            gameStarted: false,
            isPaused: false,
            showingFeedback: false
        };
        
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    // ========================================
    // INICIALIZACIÓN
    // ========================================
    
    init() {
        console.log('🎮 Memory Matrix Game iniciando...');
        
        try {
            // Verificar dependencias
            this.checkDependencies();
            
            // Cachear elementos DOM
            this.cacheElements();
            
            // Inicializar motor del juego
            this.initEngine();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Configurar UI inicial
            this.setupInitialUI();
            
            // Analytics
            this.trackEvent('game_init', {
                timestamp: Date.now(),
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`
            });
            
            console.log('✅ Memory Matrix Game listo');
            
        } catch (error) {
            console.error('❌ Error inicializando Memory Matrix:', error);
            this.showError('Error al cargar el juego. Por favor, recarga la página.');
        }
    }
    
    checkDependencies() {
        // Verificar que las bibliotecas estén cargadas
        console.log('Checking dependencies...');
        console.log('Chessground:', typeof Chessground !== 'undefined');
        console.log('Chess.js:', typeof Chess !== 'undefined');
        console.log('Howler.js:', typeof Howl !== 'undefined');
        console.log('MemoryMatrixEngine:', typeof MemoryMatrixEngine !== 'undefined');

        if (typeof Chessground === 'undefined') {
            throw new Error('Chessground no está cargado');
        }

        if (typeof Chess === 'undefined') {
            console.warn('⚠️ Chess.js no está cargado - funcionalidad limitada');
        }

        if (typeof Howl === 'undefined') {
            console.warn('⚠️ Howler.js no está cargado - sin audio');
        }

        if (typeof MemoryMatrixEngine === 'undefined') {
            throw new Error('Memory Matrix Engine no está cargado');
        }

        console.log('✅ Dependencias críticas están disponibles');
    }
    
    cacheElements() {
        // Elementos principales
        this.elements = {
            // Controles
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            hintBtn: document.getElementById('hintBtn'),
            nextPhaseBtn: document.getElementById('nextPhaseBtn'),
            
            // Botones flotantes
            homeBtn: document.getElementById('homeBtn'),
            soundToggle: document.getElementById('soundToggle'),
            
            // Pantallas
            levelCompleteScreen: document.getElementById('levelCompleteScreen'),
            feedbackDisplay: document.getElementById('feedbackDisplay'),
            
            // Botones de pantallas
            nextLevelBtn: document.getElementById('nextLevelBtn'),
            repeatLevelBtn: document.getElementById('repeatLevelBtn'),
            mainMenuBtn: document.getElementById('mainMenuBtn'),
            
            // Información del juego
            levelNumber: document.getElementById('levelNumber'),
            levelName: document.getElementById('levelName'),
            levelPhase: document.getElementById('levelPhase'),
            score: document.getElementById('score'),
            accuracy: document.getElementById('accuracy'),
            currentLevel: document.getElementById('currentLevel'),
            
            // Estadísticas de memoria
            piecesTotal: document.getElementById('piecesTotal'),
            piecesHidden: document.getElementById('piecesHidden'),
            viewTime: document.getElementById('viewTime'),
            
            // Pantalla de completado
            completeTitle: document.getElementById('completeTitle'),
            finalScore: document.getElementById('finalScore'),
            accuracyFinal: document.getElementById('accuracyFinal'),
            timeTotal: document.getElementById('timeTotal'),
            lessonContent: document.getElementById('lessonContent'),
            
            // Feedback
            feedbackIcon: document.getElementById('feedbackIcon'),
            feedbackText: document.getElementById('feedbackText'),
            feedbackExplanation: document.getElementById('feedbackExplanation'),
            
            // Overlay del tablero
            boardOverlay: document.getElementById('boardOverlay'),
            overlayText: document.getElementById('overlayText'),
            overlayCountdown: document.getElementById('overlayCountdown'),
            phaseIndicator: document.getElementById('phaseIndicator')
        };
        
        // Verificar que elementos críticos existen
        const criticalElements = ['startBtn', 'homeBtn', 'soundToggle'];
        criticalElements.forEach(elementId => {
            if (!this.elements[elementId]) {
                throw new Error(`Elemento crítico #${elementId} no encontrado`);
            }
        });
        
        console.log('✅ Elementos DOM cacheados');
    }
    
    initEngine() {
        // Crear instancia del motor
        this.engine = new MemoryMatrixEngine();

        // Verificar que se inicializó correctamente
        if (!this.engine || !this.engine.gameState) {
            throw new Error('Error inicializando Memory Matrix Engine');
        }

        // Test directo del tablero
        console.log('Testing direct board creation...');
        const boardElement = document.getElementById('chessboard');
        if (boardElement && typeof Chessground !== 'undefined') {
            const testBoard = Chessground(boardElement, {
                fen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
                orientation: 'white'
            });
            console.log('✅ Tablero test creado correctamente');
        }

        console.log('✅ Motor del juego inicializado');
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    setupEventListeners() {
        // Botones de control principales
        this.elements.startBtn.addEventListener('click', () => this.handleStartGame());
        this.elements.pauseBtn.addEventListener('click', () => this.handlePauseGame());
        this.elements.hintBtn.addEventListener('click', () => this.handleShowHint());
        this.elements.nextPhaseBtn.addEventListener('click', () => this.handleNextPhase());
        
        // Botones flotantes (ChessArcade standard)
        this.elements.homeBtn.addEventListener('click', () => this.handleGoHome());
        this.elements.soundToggle.addEventListener('click', () => this.handleToggleSound());
        
        // Botones de pantallas de completado
        if (this.elements.nextLevelBtn) {
            this.elements.nextLevelBtn.addEventListener('click', () => this.handleNextLevel());
        }
        if (this.elements.repeatLevelBtn) {
            this.elements.repeatLevelBtn.addEventListener('click', () => this.handleRepeatLevel());
        }
        if (this.elements.mainMenuBtn) {
            this.elements.mainMenuBtn.addEventListener('click', () => this.handleGoHome());
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Window events
        window.addEventListener('blur', () => this.handleWindowBlur());
        window.addEventListener('beforeunload', () => this.handleWindowUnload());
        
        // Prevent context menu en mobile
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        console.log('✅ Event listeners configurados');
    }
    
    // ========================================
    // MANEJADORES DE EVENTOS
    // ========================================
    
    async handleStartGame() {
        console.log('🎯 Iniciando juego...');
        
        try {
            // Deshabilitar botón durante inicio
            this.elements.startBtn.disabled = true;
            this.elements.startBtn.textContent = 'INICIANDO...';
            
            // Iniciar nivel actual del engine
            const success = await this.engine.startLevel(this.engine.getCurrentLevel());
            
            if (success) {
                // Actualizar estado UI
                this.uiState.gameStarted = true;
                this.updateControlButtons('playing');
                
                // Actualizar información en pantalla
                this.updateGameInfo();
                
                console.log('✅ Juego iniciado exitosamente');
            } else {
                throw new Error('No se pudo iniciar el nivel');
            }
            
        } catch (error) {
            console.error('❌ Error al iniciar juego:', error);
            this.showError('No se pudo iniciar el juego. Inténtalo de nuevo.');
            
            // Restaurar botón
            this.elements.startBtn.disabled = false;
            this.elements.startBtn.textContent = 'EMPEZAR NIVEL';
        }
    }
    
    handlePauseGame() {
        if (!this.engine.isGameActive()) return;
        
        if (this.uiState.isPaused) {
            // Reanudar
            this.engine.resumeGame();
            this.uiState.isPaused = false;
            this.elements.pauseBtn.textContent = 'PAUSA';
            console.log('▶️ Juego reanudado');
        } else {
            // Pausar
            this.engine.pauseGame();
            this.uiState.isPaused = true;
            this.elements.pauseBtn.textContent = 'REANUDAR';
            console.log('⏸️ Juego pausado');
        }
        
        // Analytics
        this.trackEvent('game_paused', {
            paused: this.uiState.isPaused,
            level: this.engine.getCurrentLevel()
        });
    }
    
    handleShowHint() {
        if (!this.engine.isGameActive()) return;
        
        const hintUsed = this.engine.showHint();
        
        if (hintUsed) {
            // Mostrar feedback de hint
            this.showTemporaryMessage('💡 Pista mostrada en el tablero', 2000);
            
            // Actualizar UI si es necesario
            this.updateGameInfo();
        } else {
            this.showTemporaryMessage('❌ No hay más pistas disponibles', 2000);
        }
    }
    
    handleNextPhase() {
        // TODO: Implementar cuando tengamos sistema de fases A/B/C
        console.log('🔄 Siguiente fase - TODO: Implementar');
        this.showTemporaryMessage('🚧 Próximamente: Sistema de fases', 2000);
    }
    
    handleToggleSound() {
        const soundEnabled = this.engine.toggleSound();
        
        // Actualizar UI del botón
        this.elements.soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
        this.elements.soundToggle.classList.toggle('muted', !soundEnabled);
        this.elements.soundToggle.title = soundEnabled ? 'Desactivar sonido' : 'Activar sonido';
        
        // Feedback visual
        this.showTemporaryMessage(
            soundEnabled ? '🔊 Sonido activado' : '🔇 Sonido desactivado', 
            1500
        );
        
        console.log(`🔊 Sonido ${soundEnabled ? 'activado' : 'desactivado'}`);
    }
    
    handleGoHome() {
        // Confirmar si el juego está en progreso
        if (this.engine.isGameActive()) {
            if (!confirm('¿Estás seguro que quieres salir? Se perderá el progreso actual.')) {
                return;
            }
        }
        
        // Analytics antes de salir
        this.trackEvent('game_exit', {
            level: this.engine.getCurrentLevel(),
            score: this.engine.getGameState().score,
            method: 'home_button'
        });
        
        // Redirigir a página principal
        window.location.href = '../../index.html';
    }
    
    handleNextLevel() {
        this.hideLevelCompleteScreen();
        
        const success = this.engine.nextLevel();
        if (success) {
            this.updateControlButtons('idle');
            this.updateGameInfo();
        } else {
            // Todos los niveles completados
            this.showGameCompleteMessage();
        }
    }
    
    handleRepeatLevel() {
        this.hideLevelCompleteScreen();
        
        this.engine.restartLevel();
        this.updateControlButtons('idle');
        this.updateGameInfo();
    }
    
    handleKeyboard(e) {
        // Solo procesar si no estamos escribiendo en un input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (!this.uiState.gameStarted) {
                    this.handleStartGame();
                }
                break;
                
            case 'p':
            case 'P':
                if (this.uiState.gameStarted) {
                    this.handlePauseGame();
                }
                break;
                
            case 'h':
            case 'H':
                this.handleShowHint();
                break;
                
            case 's':
            case 'S':
                this.handleToggleSound();
                break;
                
            case 'Escape':
                this.handleGoHome();
                break;
        }
    }
    
    handleWindowBlur() {
        // Auto-pausar cuando se pierde el foco
        if (this.engine.isGameActive() && !this.uiState.isPaused) {
            this.handlePauseGame();
            this.showTemporaryMessage('⏸️ Juego pausado automáticamente', 2000);
        }
    }
    
    handleWindowUnload() {
        // Guardar progreso antes de cerrar
        if (this.engine) {
            this.engine.saveProgress();
        }
    }
    
    // ========================================
    // GESTIÓN DE UI
    // ========================================
    
    setupInitialUI() {
        // Configurar estado inicial de botones
        this.updateControlButtons('idle');
        
        // Configurar botón de sonido según preferencias
        const soundEnabled = this.engine.getGameState().soundEnabled;
        this.elements.soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
        this.elements.soundToggle.classList.toggle('muted', !soundEnabled);
        
        // Ocultar pantallas modales
        this.hideLevelCompleteScreen();
        this.hideFeedback();
        
        // Actualizar información inicial
        this.updateGameInfo();
        
        console.log('✅ UI inicial configurada');
    }
    
    updateControlButtons(gamePhase) {
        switch(gamePhase) {
            case 'idle':
                this.elements.startBtn.disabled = false;
                this.elements.startBtn.textContent = 'EMPEZAR NIVEL';
                this.elements.pauseBtn.disabled = true;
                this.elements.pauseBtn.textContent = 'PAUSA';
                this.elements.hintBtn.disabled = true;
                this.elements.nextPhaseBtn.disabled = true;
                break;
                
            case 'playing':
                this.elements.startBtn.disabled = true;
                this.elements.pauseBtn.disabled = false;
                this.elements.hintBtn.disabled = false;
                this.elements.nextPhaseBtn.disabled = false;
                break;
                
            case 'paused':
                this.elements.pauseBtn.textContent = 'REANUDAR';
                this.elements.hintBtn.disabled = true;
                break;
        }
    }
    
    updateGameInfo() {
        const gameState = this.engine.getGameState();
        const currentLevel = this.engine.getCurrentLevel();
        
        // Información básica del nivel
        if (this.elements.levelNumber) {
            this.elements.levelNumber.textContent = currentLevel;
        }
        if (this.elements.currentLevel) {
            this.elements.currentLevel.textContent = currentLevel;
        }
        
        // Estadísticas del juego
        if (this.elements.score) {
            this.elements.score.textContent = gameState.score;
        }
        if (this.elements.accuracy) {
            this.elements.accuracy.textContent = gameState.accuracy + '%';
        }
        
        // Información específica del nivel actual
        if (gameState.currentPosition) {
            const levelConfig = gameState.currentPosition;
            
            if (this.elements.levelName) {
                this.elements.levelName.textContent = levelConfig.name;
            }
            if (this.elements.piecesTotal) {
                this.elements.piecesTotal.textContent = levelConfig.pieces_total;
            }
            if (this.elements.piecesHidden) {
                this.elements.piecesHidden.textContent = levelConfig.pieces_hidden.length;
            }
            if (this.elements.viewTime) {
                this.elements.viewTime.textContent = (levelConfig.view_time / 1000).toFixed(1) + 's';
            }
        }
    }
    
    // ========================================
    // FEEDBACK Y MENSAJES
    // ========================================
    
    showTemporaryMessage(message, duration = 3000) {
        // Crear elemento de mensaje temporal
        const messageDiv = document.createElement('div');
        messageDiv.className = 'temp-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: var(--neon-cyan);
            padding: 20px 30px;
            border-radius: 10px;
            border: 2px solid var(--neon-cyan);
            z-index: 2500;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            animation: messageAppear 0.3s ease-out;
        `;
        
        // Agregar CSS de animación si no existe
        if (!document.getElementById('temp-message-styles')) {
            const style = document.createElement('style');
            style.id = 'temp-message-styles';
            style.textContent = `
                @keyframes messageAppear {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageDiv);
        
        // Remover después del tiempo especificado
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, duration);
    }
    
    showError(message) {
        console.error('💥 Error:', message);
        
        this.showTemporaryMessage(`❌ ${message}`, 5000);
        
        // Analytics
        this.trackEvent('error_shown', {
            error_message: message,
            timestamp: Date.now()
        });
    }
    
    showFeedback(isCorrect, message, explanation = '') {
        if (!this.elements.feedbackDisplay) return;
        
        this.uiState.showingFeedback = true;
        
        // Configurar contenido
        this.elements.feedbackIcon.textContent = isCorrect ? '✅' : '❌';
        this.elements.feedbackText.textContent = message;
        this.elements.feedbackExplanation.textContent = explanation;
        
        // Aplicar clases de estilo
        this.elements.feedbackDisplay.classList.toggle('wrong', !isCorrect);
        
        // Mostrar
        this.elements.feedbackDisplay.style.display = 'block';
        
        // Ocultar automáticamente después de 3 segundos
        setTimeout(() => {
            this.hideFeedback();
        }, 3000);
    }
    
    hideFeedback() {
        if (this.elements.feedbackDisplay) {
            this.elements.feedbackDisplay.style.display = 'none';
            this.uiState.showingFeedback = false;
        }
    }
    
    // ========================================
    // PANTALLAS MODALES
    // ========================================
    
    showLevelCompleteScreen() {
        if (this.elements.levelCompleteScreen) {
            this.elements.levelCompleteScreen.style.display = 'flex';
        }
    }
    
    hideLevelCompleteScreen() {
        if (this.elements.levelCompleteScreen) {
            this.elements.levelCompleteScreen.style.display = 'none';
        }
    }
    
    showGameCompleteMessage() {
        // Mensaje especial cuando se completan todos los niveles
        const completeDiv = document.createElement('div');
        completeDiv.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.95); display: flex; align-items: center; 
                        justify-content: center; z-index: 3000;">
                <div style="text-align: center; color: var(--neon-green); 
                           font-family: 'Orbitron', monospace; padding: 40px;
                           background: rgba(0,0,0,0.9); border: 3px solid var(--neon-green);
                           border-radius: 20px; box-shadow: 0 0 50px rgba(0, 255, 128, 0.5);">
                    <h1 style="font-size: 3rem; margin-bottom: 20px; font-weight: 900;">
                        🧠 ¡MAESTRÍA ABSOLUTA!
                    </h1>
                    <p style="font-size: 1.5rem; margin-bottom: 20px;">
                        Has completado todos los niveles de Memory Matrix
                    </p>
                    <p style="font-size: 1.2rem; margin-bottom: 30px; color: var(--gold);">
                        Puntuación Final: ${this.engine.getGameState().score}
                    </p>
                    <button onclick="window.location.href='../../index.html'" 
                            style="padding: 15px 30px; font-size: 1.2rem; 
                                   background: var(--neon-green); color: black; 
                                   border: none; border-radius: 25px; cursor: pointer;
                                   font-family: 'Orbitron', monospace; font-weight: 700;">
                        VOLVER AL MENÚ
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(completeDiv);
        
        // Analytics
        this.trackEvent('all_levels_complete', {
            final_score: this.engine.getGameState().score,
            total_time: Date.now() - this.engine.getGameState().sessionStartTime
        });
    }
    
    // ========================================
    // ANALYTICS
    // ========================================
    
    trackEvent(eventName, data = {}) {
        // Usar el sistema de analytics del engine
        if (this.engine && typeof this.engine.trackEvent === 'function') {
            this.engine.trackEvent(eventName, data);
        } else {
            // Fallback directo a gtag
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    'game': 'memory_matrix',
                    'timestamp': Date.now(),
                    ...data
                });
            }
        }
        
        console.log(`📊 Event: ${eventName}`, data);
    }
    
    // ========================================
    // API PÚBLICA
    // ========================================
    
    getEngine() {
        return this.engine;
    }
    
    getUIState() {
        return { ...this.uiState };
    }
    
    isGameActive() {
        return this.engine && this.engine.isGameActive();
    }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

// Crear instancia global cuando se cargue la página
let memoryMatrixGame = null;

// Función de inicialización
function initMemoryMatrix() {
    try {
        memoryMatrixGame = new MemoryMatrixGame();
        
        // Hacer disponible globalmente para debugging
        window.memoryMatrixGame = memoryMatrixGame;
        
        console.log('🎮 Memory Matrix completamente inicializado');
        
    } catch (error) {
        console.error('💥 Error fatal inicializando Memory Matrix:', error);
        
        // Mostrar mensaje de error al usuario
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; 
                        min-height: 100vh; background: #0a0a0a; color: #ff0040; 
                        font-family: 'Orbitron', monospace; text-align: center; padding: 20px;">
                <div>
                    <h1 style="font-size: 2rem; margin-bottom: 20px;">❌ Error de Carga</h1>
                    <p style="margin-bottom: 20px;">No se pudo inicializar Memory Matrix</p>
                    <p style="font-size: 0.9rem; color: #666;">
                        Error: ${error.message}
                    </p>
                    <button onclick="window.location.reload()" 
                            style="margin-top: 20px; padding: 10px 20px; 
                                   background: #ff0040; color: white; border: none; 
                                   border-radius: 5px; cursor: pointer;">
                        Recargar Página
                    </button>
                </div>
            </div>
        `;
    }
}

// Inicializar cuando todo esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMemoryMatrix);
} else {
    initMemoryMatrix();
}

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    if (memoryMatrixGame && memoryMatrixGame.engine) {
        memoryMatrixGame.engine.saveProgress();
    }
});

console.log('🧠 Memory Matrix controlador cargado correctamente');
