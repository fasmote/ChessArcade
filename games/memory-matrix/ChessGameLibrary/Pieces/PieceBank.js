/**
 * PieceBank - Gestión del banco de piezas draggables
 */
class PieceBank {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.pieces = [];
        this.config = {
            ...config
        };
    }

    // Crear banco con piezas específicas
    createBank(pieces) {
        if (!this.container) {
            console.error('❌ PieceBank: Contenedor no encontrado:', this.containerId);
            return;
        }

        this.clear();
        this.pieces = [...pieces];

        pieces.forEach(piece => {
            this.createPieceElement(piece);
        });

        console.log('✅ PieceBank: Banco creado con', pieces.length, 'piezas');
        ChessGameEventBus.emit('pieceBankCreated', { pieces: this.pieces });
    }

    // Crear elemento de pieza individual
    createPieceElement(piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'draggable-piece';
        pieceElement.draggable = true;
        pieceElement.dataset.piece = piece;

        // Crear imagen de la pieza usando el tema actual
        const pieceImg = document.createElement('img');
        pieceImg.src = PieceThemes.getPiecePath(piece);
        pieceImg.alt = piece;
        pieceImg.style.width = '100%';
        pieceImg.style.height = '100%';
        pieceImg.style.objectFit = 'contain';

        pieceElement.appendChild(pieceImg);

        // Event listeners para drag
        pieceElement.addEventListener('dragstart', (e) => {
            console.log(`🎯 PieceBank: Dragstart ${piece}`);
            e.dataTransfer.setData('text/plain', piece);
            e.dataTransfer.effectAllowed = 'move';

            ChessGameEventBus.emit('pieceDragStart', { piece, element: pieceElement });
        });

        this.container.appendChild(pieceElement);
        return pieceElement;
    }

    // Remover pieza del banco
    removePiece(piece) {
        const pieceElement = this.container.querySelector(`[data-piece="${piece}"]`);
        if (pieceElement) {
            pieceElement.remove();
            this.pieces = this.pieces.filter(p => p !== piece);

            ChessGameEventBus.emit('pieceRemovedFromBank', { piece });
            console.log(`🗑️ PieceBank: Pieza ${piece} removida del banco`);
        }
    }

    // Limpiar banco
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
            this.pieces = [];
        }
    }

    // Obtener piezas disponibles
    getAvailablePieces() {
        return [...this.pieces];
    }

    // Verificar si una pieza está disponible
    hasPiece(piece) {
        return this.pieces.includes(piece);
    }
}