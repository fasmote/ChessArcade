/**
 * BoardManager - Gestión del tablero de ajedrez
 * Wrapper para ChessBoard2.js con funcionalidades extendidas
 */
class BoardManager {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.board = null;
        this.config = {
            pieceTheme: PieceThemes.getPieceThemeFunction(),
            draggable: false,
            dropOffBoard: 'trash',
            sparePieces: false,
            ...config
        };
        this.position = {};
    }

    // Inicializar tablero
    initialize() {
        const ChessboardConstructor = window.Chessboard2 || window.Chessboard;
        if (!ChessboardConstructor) {
            throw new Error('Chessboard2 no está cargado');
        }

        try {
            this.board = ChessboardConstructor(this.containerId, this.config);
            console.log('✅ BoardManager: Tablero inicializado');

            // Escuchar cambios de tema
            ChessGameEventBus.on('themeChanged', () => {
                this.reloadTheme();
            });

            ChessGameEventBus.emit('boardInitialized', { boardId: this.containerId });
            return true;
        } catch (error) {
            console.error('❌ BoardManager: Error inicializando tablero:', error);
            return false;
        }
    }

    // Establecer posición
    setPosition(position) {
        if (!this.board) return false;

        this.position = { ...position };
        this.board.position(position);

        ChessGameEventBus.emit('positionChanged', { position: this.position });
        return true;
    }

    // Obtener posición actual
    getPosition() {
        return this.board ? this.board.position() : {};
    }

    // Limpiar tablero
    clear() {
        if (this.board) {
            this.board.clear();
            this.position = {};
            ChessGameEventBus.emit('boardCleared');
        }
    }

    // Configurar drag and drop
    enableDrag(onDrop, onDragStart) {
        if (!this.board) return;

        this.board.draggable = true;
        if (onDrop) this.config.onDrop = onDrop;
        if (onDragStart) this.config.onDragStart = onDragStart;
    }

    // Desactivar drag and drop
    disableDrag() {
        if (this.board) {
            this.board.draggable = false;
        }
    }

    // Destruir tablero
    destroy() {
        if (this.board && this.board.destroy) {
            this.board.destroy();
        }
        this.board = null;
        this.position = {};
    }
}