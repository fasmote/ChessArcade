/**
 * ============================================
 * MemoryMatrixGame - Orquestador Principal
 * ============================================
 *
 * Este es el "cerebro" del juego Memory Matrix.
 * Conecta todos los componentes y maneja el flujo del juego.
 *
 * FLUJO DEL JUEGO:
 * 1. Usuario hace click en "Comenzar"
 * 2. Estado: waiting → memorizing
 * 3. Mostrar posición X segundos
 * 4. Estado: memorizing → placing
 * 5. Ocultar piezas, mostrar banco
 * 6. Usuario arrastra piezas del banco al tablero
 * 7. Verificar si posición es correcta
 * 8. Estado: placing → complete (si ganó)
 *
 * COMPONENTES QUE MANEJA:
 * - StateManager: Estados del juego
 * - BoardManager: Tablero de ajedrez
 * - PieceBank: Banco de piezas draggables
 */
class MemoryMatrixGame {
    constructor(config = {}) {
        // ==========================================
        // CONFIGURACIÓN
        // Valores por defecto que pueden ser sobrescritos
        // ==========================================
        this.config = {
            boardContainerId: 'chessboard',          // ID del div del tablero
            pieceBankContainerId: 'piece-bank',      // ID del div del banco de piezas
            statusContainerId: 'status-text',        // ID del párrafo de estado
            startButtonId: 'startBtn',               // ID del botón "Comenzar"
            memorizeTime: 3000,                      // Tiempo para memorizar (3 segundos)
            ...config                                // Sobrescribir con config personalizada
        };

        // ==========================================
        // COMPONENTES PRINCIPALES
        // Instancias de las clases que gestionan diferentes partes del juego
        // ==========================================

        // StateManager: Gestiona estados (waiting, memorizing, placing, complete)
        this.stateManager = new StateManager();

        // BoardManager: Maneja el tablero de ajedrez (wrapper de ChessBoard2)
        this.boardManager = new BoardManager(this.config.boardContainerId);

        // PieceBank: Gestiona el banco lateral de piezas draggables
        this.pieceBank = new PieceBank(this.config.pieceBankContainerId);

        // ==========================================
        // ESTADO DEL JUEGO
        // Variables que rastrean el estado actual
        // ==========================================

        // targetPosition: Posición objetivo que el jugador debe recrear
        // Ejemplo: { e1: 'wK', e8: 'bK' }
        this.targetPosition = null;

        // currentLevel: Nivel actual que se está jugando (1-30)
        this.currentLevel = null;

        // ==========================================
        // CONFIGURAR EVENT LISTENERS
        // Escuchar eventos del sistema
        // ==========================================
        this.setupEventListeners();
    }

    /**
     * ============================================
     * CONFIGURAR EVENT LISTENERS
     * ============================================
     * Conectar eventos del sistema con acciones del juego
     */
    setupEventListeners() {
        // ==========================================
        // 1. ESCUCHAR CAMBIOS DE ESTADO
        // ==========================================
        // Cuando StateManager cambia de estado (waiting → memorizing, etc.)
        // se dispara este evento y llamamos a handleStateChange()
        ChessGameEventBus.on('stateChange', (data) => {
            this.handleStateChange(data);
        });

        // ==========================================
        // 2. BOTÓN "COMENZAR" / "JUGAR DE NUEVO"
        // ==========================================
        const startBtn = document.getElementById(this.config.startButtonId);
        if (startBtn) {
            // Cuando el usuario hace click, iniciar el juego
            startBtn.addEventListener('click', () => this.startGame());
        }

        // ==========================================
        // 3. DRAG & DROP DESDE BANCO AL TABLERO
        // ==========================================
        // Configurar zona de drop en el tablero para recibir piezas del banco
        this.setupBoardDropZone();
    }

    /**
     * ============================================
     * INICIALIZAR JUEGO
     * ============================================
     * Se llama UNA VEZ al cargar la página
     * Prepara todos los componentes para jugar
     *
     * @returns {boolean} true si inicializó correctamente, false si hubo error
     */
    initialize() {
        console.log('🎮 MemoryMatrixGame: Inicializando...');

        // ==========================================
        // 1. INICIALIZAR TABLERO
        // ==========================================
        // BoardManager crea el tablero usando ChessBoard2.js
        if (!this.boardManager.initialize()) {
            // Si falla (ej: ChessBoard2 no cargado), mostrar error
            this.updateStatus('Error: No se pudo inicializar el tablero');
            return false;
        }

        // ==========================================
        // 2. ESTABLECER ESTADO INICIAL
        // ==========================================
        // Estado 'waiting' = esperando que el usuario haga click en "Comenzar"
        this.stateManager.setState('waiting');
        this.updateStatus('Haz clic en "Comenzar" para empezar');

        console.log('✅ MemoryMatrixGame: Inicializado correctamente');
        return true;
    }

    // Comenzar juego
    startGame() {
        console.log('🚀 MemoryMatrixGame: Iniciando juego...');

        // Nivel simple: solo dos reyes
        const initialPosition = {
            e1: 'wK', // Rey blanco en e1
            e8: 'bK'  // Rey negro en e8
        };

        this.targetPosition = { ...initialPosition };
        this.stateManager.setState('memorizing', { targetPosition: this.targetPosition });

        // Mostrar posición para memorizar
        this.boardManager.setPosition(initialPosition);
        this.updateStatus('¡Memoriza la posición de los reyes! (3 segundos)');

        // Después del tiempo de memorización, comenzar fase de colocación
        setTimeout(() => {
            this.startPlacingPhase();
        }, this.config.memorizeTime);
    }

    // Fase de colocación de piezas
    startPlacingPhase() {
        console.log('🎯 MemoryMatrixGame: Iniciando fase de colocación...');

        this.stateManager.setState('placing');

        // Limpiar tablero y crear banco de piezas
        this.boardManager.clear();
        this.pieceBank.createBank(['wK', 'bK']);

        this.updateStatus('Arrastra las piezas del banco al tablero para recrear la posición');
    }

    // Manejar cambios de estado
    handleStateChange(data) {
        const { current, previous } = data;

        switch (current) {
            case 'memorizing':
                this.boardManager.disableDrag();
                break;

            case 'placing':
                this.boardManager.enableDrag(
                    (source, target, piece) => this.handleDrop(source, target, piece),
                    (source, piece) => this.handleDragStart(source, piece)
                );
                break;

            case 'complete':
                this.boardManager.disableDrag();
                this.handleGameComplete();
                break;
        }
    }

    // Manejar drop en el tablero
    handleDrop(source, target, piece) {
        console.log(`🎯 MemoryMatrixGame: Drop ${piece} de ${source} a ${target}`);

        // Verificar condición de victoria después del drop
        setTimeout(() => this.checkWinCondition(), 100);
        return true;
    }

    // Manejar inicio de drag
    handleDragStart(source, piece) {
        console.log(`🎯 MemoryMatrixGame: Drag start ${piece} desde ${source}`);
        return true;
    }

    // Verificar condición de victoria
    checkWinCondition() {
        if (!this.stateManager.isState('placing')) return;

        const currentPosition = this.boardManager.getPosition();
        console.log('🔍 MemoryMatrixGame: Verificando posición...');

        let matches = 0;
        const targetKeys = Object.keys(this.targetPosition);

        for (let square of targetKeys) {
            if (currentPosition[square] === this.targetPosition[square]) {
                matches++;
            }
        }

        console.log(`✅ Coincidencias: ${matches}/${targetKeys.length}`);

        if (matches === targetKeys.length) {
            this.stateManager.setState('complete');
        } else {
            this.updateStatus(`Bien, sigue colocando... (${matches}/${targetKeys.length} correctas)`);
        }
    }

    // Manejar finalización del juego
    handleGameComplete() {
        this.updateStatus('¡Excelente! ¡Has recreado la posición correctamente! 🎉');

        // Cambiar botón para reiniciar
        const startBtn = document.getElementById(this.config.startButtonId);
        if (startBtn) {
            startBtn.textContent = 'Jugar de nuevo';
        }

        console.log('🎉 MemoryMatrixGame: ¡VICTORIA!');
    }

    // Actualizar mensaje de estado
    updateStatus(message) {
        const statusElement = document.getElementById(this.config.statusContainerId);
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log(`📢 Status: ${message}`);
    }

    /**
     * ============================================
     * CONFIGURAR ZONA DE DROP EN EL TABLERO
     * ============================================
     * Permite arrastrar piezas del banco y soltarlas en el tablero
     *
     * IMPORTANTE: Este es el FIX del drag & drop que teníamos roto.
     * Antes colocaba en "primera casilla vacía", ahora detecta la casilla exacta.
     */
    setupBoardDropZone() {
        // ==========================================
        // 1. EVENTO DRAGOVER
        // ==========================================
        // Se dispara continuamente mientras se arrastra sobre el tablero
        // Necesitamos preventDefault() para permitir el drop
        document.addEventListener('dragover', (e) => {
            if (e.target.closest(`#${this.config.boardContainerId}`)) {
                e.preventDefault(); // SIN esto, el drop no funciona
            }
        });

        // ==========================================
        // 2. EVENTO DROP
        // ==========================================
        // Se dispara cuando el usuario suelta la pieza
        document.addEventListener('drop', (e) => {
            if (e.target.closest(`#${this.config.boardContainerId}`)) {
                e.preventDefault(); // Prevenir comportamiento por defecto del navegador

                // Obtener qué pieza se está arrastrando (ej: 'wK', 'bP')
                // PieceBank.js guardó esto en dataTransfer al iniciar el drag
                const piece = e.dataTransfer.getData('text/plain');
                console.log(`🎯 MemoryMatrixGame: Drop desde banco: ${piece}`);

                // ==========================================
                // CALCULAR CASILLA EXACTA
                // ==========================================
                // Esta es la clave del fix: usar coordenadas del mouse (clientX, clientY)
                // para calcular en qué casilla del tablero se hizo drop
                const targetSquare = this.getSquareFromCoordinates(e.clientX, e.clientY);

                if (targetSquare) {
                    console.log(`📍 Casilla detectada: ${targetSquare}`);
                    // Colocar la pieza en la casilla exacta
                    this.placePieceOnSquare(piece, targetSquare);
                } else {
                    console.warn('⚠️ No se pudo detectar casilla del tablero');
                }
            }
        });
    }

    /**
     * ============================================
     * CALCULAR CASILLA DESDE COORDENADAS DEL MOUSE
     * ============================================
     * Convierte coordenadas de pantalla (x, y) a notación algebraica ('e4', 'a1', etc.)
     *
     * MATEMÁTICA:
     * 1. Obtener rectángulo del tablero (getBoundingClientRect)
     * 2. Calcular posición relativa: mouse - esquina del tablero
     * 3. Dividir tablero en 8x8: ancho/8 = tamaño de casilla
     * 4. Calcular en qué columna (file) y fila (rank) cayó
     * 5. Convertir a notación: columna 0 = 'a', fila 8 = última fila
     *
     * @param {number} clientX - Coordenada X del mouse en pantalla
     * @param {number} clientY - Coordenada Y del mouse en pantalla
     * @returns {string|null} - Notación algebraica ('e4') o null si inválido
     */
    getSquareFromCoordinates(clientX, clientY) {
        // ==========================================
        // 1. OBTENER ELEMENTO DEL TABLERO
        // ==========================================
        const boardElement = document.getElementById(this.config.boardContainerId);
        if (!boardElement) {
            console.error('❌ Elemento del tablero no encontrado');
            return null;
        }

        // ==========================================
        // 2. OBTENER RECTÁNGULO DEL TABLERO
        // ==========================================
        // getBoundingClientRect() nos da:
        // - left, top: esquina superior izquierda
        // - right, bottom: esquina inferior derecha
        // - width, height: tamaño del tablero
        const rect = boardElement.getBoundingClientRect();

        // ==========================================
        // 3. VERIFICAR QUE EL MOUSE ESTÁ DENTRO
        // ==========================================
        if (clientX < rect.left || clientX > rect.right ||
            clientY < rect.top || clientY > rect.bottom) {
            return null; // Click fuera del tablero
        }

        // ==========================================
        // 4. CALCULAR POSICIÓN RELATIVA
        // ==========================================
        // relX, relY = distancia desde esquina superior izquierda del tablero
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        // ==========================================
        // 5. CALCULAR TAMAÑO DE CADA CASILLA
        // ==========================================
        // Si el tablero mide 400px de ancho: 400 / 8 = 50px por casilla
        const squareWidth = rect.width / 8;
        const squareHeight = rect.height / 8;

        // ==========================================
        // 6. CALCULAR FILA Y COLUMNA (0-7)
        // ==========================================
        // file (columna): 0 = 'a', 1 = 'b', ..., 7 = 'h'
        const file = Math.floor(relX / squareWidth);  // 0-7

        // rank (fila): INVERTIDO porque Y crece hacia abajo en pantalla
        // Y=0 (arriba) = fila 8 del ajedrez
        // Y=max (abajo) = fila 1 del ajedrez
        const rank = 8 - Math.floor(relY / squareHeight); // 8-1

        // ==========================================
        // 7. VALIDAR RANGO
        // ==========================================
        if (file < 0 || file > 7 || rank < 1 || rank > 8) {
            return null; // Fuera de rango válido
        }

        // ==========================================
        // 8. CONVERTIR A NOTACIÓN ALGEBRAICA
        // ==========================================
        // file 0 → 'a', file 1 → 'b', etc.
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const square = files[file] + rank; // Ejemplo: 'e4', 'a1', 'h8'

        return square;
    }

    /**
     * ============================================
     * COLOCAR PIEZA EN CASILLA ESPECÍFICA
     * ============================================
     * Coloca una pieza en la casilla indicada del tablero
     *
     * @param {string} piece - Código de la pieza ('wK', 'bP', etc.)
     * @param {string} targetSquare - Casilla destino ('e4', 'a1', etc.)
     */
    placePieceOnSquare(piece, targetSquare) {
        if (!targetSquare) {
            console.error('❌ Casilla inválida');
            return;
        }

        // ==========================================
        // 1. OBTENER POSICIÓN ACTUAL DEL TABLERO
        // ==========================================
        const position = this.boardManager.getPosition();
        // Ejemplo: { e1: 'wK', d4: 'wP' }

        // ==========================================
        // 2. AGREGAR PIEZA A LA POSICIÓN
        // ==========================================
        position[targetSquare] = piece;
        // Ahora: { e1: 'wK', d4: 'wP', e4: 'bK' }

        // ==========================================
        // 3. ACTUALIZAR TABLERO VISUAL
        // ==========================================
        this.boardManager.setPosition(position);
        console.log(`✅ Pieza ${piece} colocada en ${targetSquare}`);

        // ==========================================
        // 4. REMOVER PIEZA DEL BANCO
        // ==========================================
        // La pieza ya fue colocada, eliminarla del banco lateral
        this.pieceBank.removePiece(piece);

        // ==========================================
        // 5. VERIFICAR SI GANÓ
        // ==========================================
        // Comparar posición actual con posición objetivo
        this.checkWinCondition();
    }

    // Reiniciar juego
    restart() {
        this.stateManager.reset();
        this.boardManager.clear();
        this.pieceBank.clear();
        this.targetPosition = null;

        const startBtn = document.getElementById(this.config.startButtonId);
        if (startBtn) {
            startBtn.textContent = 'Comenzar';
        }

        this.updateStatus('Haz clic en "Comenzar" para empezar');
    }
}