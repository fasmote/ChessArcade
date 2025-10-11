/**
 * ============================================
 * CHESS GAME LIBRARY - DRAG & DROP
 * ============================================
 * Módulo de drag & drop para piezas de ajedrez
 * Permite arrastrar piezas del banco al tablero
 *
 * @version 1.0.0
 * @author ChessArcade Team
 * @license MIT
 */

// ============================================
// ESTADO DEL DRAG & DROP
// ============================================

let dragState = {
    isDragging: false,
    draggedPiece: null,
    draggedElement: null,
    sourceSlot: null,
    ghostElement: null
};

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa el sistema de drag & drop
 * @param {Object} options - Opciones de configuración
 * @param {string} options.bankSelector - Selector del banco de piezas
 * @param {string} options.boardSelector - Selector del tablero
 * @param {Function} options.onPiecePlaced - Callback cuando se coloca una pieza
 * @param {Function} options.canPlacePiece - Función para validar si se puede colocar
 *
 * @example
 * initDragDrop({
 *     bankSelector: '.piece-bank',
 *     boardSelector: '#chessboard',
 *     onPiecePlaced: (piece, square) => console.log('Placed:', piece, square),
 *     canPlacePiece: (piece, square) => true
 * });
 */
function initDragDrop(options = {}) {
    const {
        bankSelector = '.piece-bank',
        boardSelector = '#chessboard',
        onPiecePlaced = () => {},
        canPlacePiece = () => true
    } = options;

    console.log('🎯 Inicializando Drag & Drop...');

    const bankElement = document.querySelector(bankSelector);
    const boardElement = document.querySelector(boardSelector);

    if (!bankElement || !boardElement) {
        console.error('❌ No se encontró banco o tablero para drag & drop');
        return;
    }

    // Función para agregar listeners a una pieza
    function addPieceListeners(pieceElement) {
        pieceElement.addEventListener('mousedown', handleDragStart);
        pieceElement.addEventListener('touchstart', handleDragStart, { passive: false });
        console.log('🎯 Listeners agregados a pieza:', pieceElement.dataset.piece);
    }

    // Agregar listeners a piezas existentes
    const existingPieces = bankElement.querySelectorAll('.piece');
    existingPieces.forEach(addPieceListeners);

    // Observar nuevas piezas con MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches('img.piece')) {
                    addPieceListeners(node);
                }
            });
        });
    });

    observer.observe(bankElement, {
        childList: true,
        subtree: true
    });

    // Eventos del documento para mover y soltar
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('mouseup', (e) => handleDragEnd(e, onPiecePlaced, canPlacePiece));
    document.addEventListener('touchend', (e) => handleDragEnd(e, onPiecePlaced, canPlacePiece));
    document.addEventListener('touchcancel', (e) => handleDragEnd(e, onPiecePlaced, canPlacePiece));

    // Prevenir comportamiento por defecto del navegador
    document.addEventListener('dragstart', (e) => e.preventDefault());

    console.log('✅ Drag & Drop inicializado');
}

// ============================================
// MANEJADORES DE EVENTOS
// ============================================

/**
 * Inicia el arrastre de una pieza
 */
function handleDragStart(e) {
    console.log('🔥 handleDragStart disparado!', e.target, e.target.tagName, e.target.className);

    // Verificar que el target es una IMG con clase .piece
    if (!e.target.matches('img.piece')) {
        console.warn('❌ Target no es img.piece:', e.target);
        return;
    }

    const pieceElement = e.target;

    // Verificar que está dentro de un slot del banco
    const bankSlot = pieceElement.closest('.bank-piece-slot');
    if (!bankSlot) return;

    // Prevenir comportamiento por defecto
    e.preventDefault();
    e.stopPropagation();

    // Obtener datos de la pieza (primero del img, si no del slot parent)
    const piece = pieceElement.dataset.piece || bankSlot.dataset.piece;

    if (!piece) {
        console.warn('⚠️ Pieza sin dataset.piece');
        return;
    }

    console.log(`🎯 Iniciando drag de pieza: ${piece}`);

    // Guardar estado
    dragState.isDragging = true;
    dragState.draggedPiece = piece;
    dragState.draggedElement = pieceElement;
    dragState.sourceSlot = bankSlot;

    // Crear elemento fantasma (ghost)
    const ghost = pieceElement.cloneNode(true);
    ghost.classList.add('dragging-ghost');
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.style.opacity = '0.8';
    ghost.style.transform = 'translate(-50%, -50%) scale(1.2)';
    ghost.style.transition = 'none';

    // Copiar estilos de la pieza original
    const rect = pieceElement.getBoundingClientRect();
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;

    // Posicionar ghost en el cursor/touch ANTES de agregar al DOM
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    ghost.style.left = `${clientX}px`;
    ghost.style.top = `${clientY}px`;

    console.log(`👻 Ghost creado en (${clientX}, ${clientY})`);

    document.body.appendChild(ghost);
    dragState.ghostElement = ghost;

    // Reducir opacidad de pieza original
    pieceElement.style.opacity = '0.3';

    // Cambiar cursor
    document.body.style.cursor = 'grabbing';
}

/**
 * Mueve el elemento fantasma con el cursor/touch
 */
function handleDragMove(e) {
    if (!dragState.isDragging || !dragState.ghostElement) return;

    e.preventDefault();

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    dragState.ghostElement.style.left = `${clientX}px`;
    dragState.ghostElement.style.top = `${clientY}px`;

    // Highlight de casilla debajo del cursor
    highlightSquareUnderCursor(clientX, clientY);
}

/**
 * Finaliza el arrastre y coloca la pieza
 */
function handleDragEnd(e, onPiecePlaced, canPlacePiece) {
    if (!dragState.isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    // Obtener coordenadas del cursor/touch
    let clientX, clientY;

    if (e.type === 'touchend' || e.type === 'touchcancel') {
        // Para touch, usar changedTouches
        clientX = e.changedTouches?.[0]?.clientX;
        clientY = e.changedTouches?.[0]?.clientY;
    } else {
        // Para mouse
        clientX = e.clientX;
        clientY = e.clientY;
    }

    console.log(`🎯 Drop en coordenadas: (${clientX}, ${clientY})`);

    // Encontrar casilla de destino
    const targetSquare = getSquareUnderCursor(clientX, clientY);

    if (targetSquare) {
        console.log(`✅ Casilla encontrada: ${targetSquare.dataset.square}`);
    } else {
        console.log('❌ No hay casilla bajo el cursor');
    }

    // Restaurar opacidad original
    if (dragState.draggedElement) {
        dragState.draggedElement.style.opacity = '1';
    }

    // Remover highlight
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('drag-over');
    });

    // Si hay casilla válida
    if (targetSquare) {
        const square = targetSquare.dataset.square;
        const piece = dragState.draggedPiece;

        console.log(`🎯 Intentando colocar ${piece} en ${square}`);

        // Validar con callback
        if (canPlacePiece(piece, square)) {
            console.log('✅ Colocación válida');

            // Remover pieza del banco (sin animación)
            if (dragState.draggedElement) {
                dragState.draggedElement.remove();
            }

            // Colocar pieza directamente en el tablero usando showPiece
            if (typeof showPiece === 'function') {
                showPiece(square, piece);
            }

            // Callback: pieza colocada exitosamente
            onPiecePlaced(piece, square);
            console.log(`✅ Pieza ${piece} colocada en ${square}`);
        } else {
            console.log('❌ Colocación inválida');
            // Animar de vuelta al banco (bounce back)
            animateBounceBack();
        }
    } else {
        // No hay casilla válida - volver al banco
        console.log('↩️ Sin casilla válida - volver al banco');
        animateBounceBack();
    }

    // Limpiar estado
    if (dragState.ghostElement) {
        dragState.ghostElement.remove();
    }
    dragState.isDragging = false;
    dragState.draggedPiece = null;
    dragState.draggedElement = null;
    dragState.sourceSlot = null;
    dragState.ghostElement = null;

    document.body.style.cursor = '';
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtiene la casilla del tablero debajo del cursor
 */
function getSquareUnderCursor(x, y) {
    // Validar coordenadas
    if (x == null || y == null || isNaN(x) || isNaN(y)) {
        console.warn('⚠️ Coordenadas inválidas:', x, y);
        return null;
    }

    // Ocultar ghost temporalmente para hacer hit test
    if (dragState.ghostElement) {
        dragState.ghostElement.style.display = 'none';
    }

    const element = document.elementFromPoint(x, y);
    console.log('🔍 Elemento bajo cursor:', element?.tagName, element?.className);

    const square = element?.closest('[data-square]');
    console.log('🔍 Casilla encontrada:', square?.dataset?.square);

    // Restaurar ghost
    if (dragState.ghostElement) {
        dragState.ghostElement.style.display = '';
    }

    return square;
}

/**
 * Highlight visual de la casilla debajo del cursor
 */
function highlightSquareUnderCursor(x, y) {
    const square = getSquareUnderCursor(x, y);

    // Remover highlight anterior
    document.querySelectorAll('.drag-over').forEach(sq => {
        sq.classList.remove('drag-over');
    });

    // Agregar highlight nuevo
    if (square) {
        square.classList.add('drag-over');
    }
}

/**
 * Anima pieza desde banco al tablero
 */
function animatePieceFromBankToBoard(fromSlot, toSquare, piece, onComplete) {
    // Obtener posiciones
    const fromRect = fromSlot.getBoundingClientRect();
    const toRect = toSquare.getBoundingClientRect();

    // Crear pieza voladora
    const flyingPiece = dragState.draggedElement.cloneNode(true);
    flyingPiece.classList.add('flying-piece');
    flyingPiece.style.position = 'fixed';
    flyingPiece.style.left = `${fromRect.left + fromRect.width / 2}px`;
    flyingPiece.style.top = `${fromRect.top + fromRect.height / 2}px`;
    flyingPiece.style.transform = 'translate(-50%, -50%) scale(0.8)';
    flyingPiece.style.width = `${fromRect.width}px`;
    flyingPiece.style.height = `${fromRect.height}px`;
    flyingPiece.style.zIndex = '1000';
    flyingPiece.style.transition = 'all 500ms ease-out';
    flyingPiece.style.pointerEvents = 'none';

    document.body.appendChild(flyingPiece);

    // Ocultar pieza original del banco
    if (dragState.draggedElement) {
        dragState.draggedElement.style.opacity = '0';
    }

    // Animar a posición del tablero
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flyingPiece.style.left = `${toRect.left + toRect.width / 2}px`;
            flyingPiece.style.top = `${toRect.top + toRect.height / 2}px`;
            flyingPiece.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Al terminar animación
    setTimeout(() => {
        flyingPiece.remove();

        // Remover pieza del banco
        if (dragState.draggedElement) {
            dragState.draggedElement.remove();
        }

        // Agregar pieza al tablero (usar función global si existe)
        if (typeof showPiece === 'function') {
            showPiece(toSquare.dataset.square, piece);
        }

        onComplete();
    }, 500);
}

/**
 * Anima pieza de vuelta al banco (bounce back)
 */
function animateBounceBack() {
    if (!dragState.sourceSlot || !dragState.draggedElement) return;

    const rect = dragState.sourceSlot.getBoundingClientRect();

    // Crear pieza voladora
    const flyingPiece = dragState.draggedElement.cloneNode(true);
    flyingPiece.style.position = 'fixed';
    flyingPiece.style.left = `${dragState.ghostElement.style.left}`;
    flyingPiece.style.top = `${dragState.ghostElement.style.top}`;
    flyingPiece.style.transform = 'translate(-50%, -50%)';
    flyingPiece.style.width = `${dragState.draggedElement.offsetWidth}px`;
    flyingPiece.style.height = `${dragState.draggedElement.offsetHeight}px`;
    flyingPiece.style.zIndex = '1000';
    flyingPiece.style.transition = 'all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // bounce
    flyingPiece.style.pointerEvents = 'none';

    document.body.appendChild(flyingPiece);

    // Animar de vuelta
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flyingPiece.style.left = `${rect.left + rect.width / 2}px`;
            flyingPiece.style.top = `${rect.top + rect.height / 2}px`;
            flyingPiece.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Al terminar
    setTimeout(() => {
        flyingPiece.remove();
        // Restaurar pieza en banco
        if (dragState.draggedElement) {
            dragState.draggedElement.style.opacity = '1';
        }
    }, 400);
}

// ============================================
// ESTILOS CSS INYECTADOS
// ============================================

// Inyectar estilos CSS para drag & drop
const style = document.createElement('style');
style.textContent = `
    .drag-over {
        background: rgba(0, 255, 128, 0.3) !important;
        border: 3px solid #00ff80 !important;
        box-shadow: 0 0 20px rgba(0, 255, 128, 0.6) !important;
    }

    .dragging-ghost {
        cursor: grabbing !important;
    }

    .bank-piece-slot .piece {
        cursor: grab;
    }

    .bank-piece-slot .piece:active {
        cursor: grabbing;
    }
`;
document.head.appendChild(style);

// ============================================
// SISTEMA TAP-TAP PARA MOBILE (Alternativa al drag)
// ============================================

let tapState = {
    selectedPiece: null,
    selectedPieceElement: null,
    selectedSlot: null
};

/**
 * Inicializa sistema tap-tap para mobile
 * Permite seleccionar pieza (tap 1) y luego casilla (tap 2)
 */
function initTapTap(options = {}) {
    const {
        bankSelector = '.piece-bank',
        boardSelector = '#chessboard',
        onPiecePlaced = () => {},
        canPlacePiece = () => true
    } = options;

    console.log('📱 Inicializando sistema Tap-Tap para mobile...');

    const bankElement = document.querySelector(bankSelector);
    const boardElement = document.querySelector(boardSelector);

    if (!bankElement || !boardElement) {
        console.error('❌ No se encontró banco o tablero para tap-tap');
        return;
    }

    // Listener para seleccionar pieza del banco (tap 1)
    bankElement.addEventListener('click', (e) => {
        const pieceElement = e.target.closest('img.piece');
        if (!pieceElement) return;

        const bankSlot = pieceElement.closest('.bank-piece-slot');
        if (!bankSlot) return;

        const piece = pieceElement.dataset.piece || bankSlot.dataset.piece;
        if (!piece) return;

        // Deseleccionar anterior si existe
        if (tapState.selectedPieceElement) {
            tapState.selectedPieceElement.style.filter = '';
            tapState.selectedSlot.style.background = '';
            tapState.selectedSlot.style.boxShadow = '';
        }

        // Seleccionar nueva pieza
        tapState.selectedPiece = piece;
        tapState.selectedPieceElement = pieceElement;
        tapState.selectedSlot = bankSlot;

        // Feedback visual: brillo dorado
        pieceElement.style.filter = 'drop-shadow(0 0 20px gold)';
        bankSlot.style.background = 'rgba(255, 215, 0, 0.3)';
        bankSlot.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';

        console.log(`📱 Pieza seleccionada: ${piece} - Ahora toca una casilla del tablero`);
    });

    // Listener para colocar en casilla (tap 2)
    boardElement.addEventListener('click', (e) => {
        if (!tapState.selectedPiece) {
            console.log('⚠️ No hay pieza seleccionada');
            return;
        }

        const square = e.target.closest('[data-square]');
        if (!square) return;

        const squareCoord = square.dataset.square;

        // Validar si se puede colocar
        if (!canPlacePiece(tapState.selectedPiece, squareCoord)) {
            console.log(`❌ No se puede colocar ${tapState.selectedPiece} en ${squareCoord}`);
            return;
        }

        console.log(`📱 Colocando ${tapState.selectedPiece} en ${squareCoord}`);

        // Crear imagen de la pieza en el tablero
        const pieceImg = document.createElement('img');
        pieceImg.className = 'piece';
        pieceImg.src = tapState.selectedPieceElement.src;
        pieceImg.dataset.piece = tapState.selectedPiece;
        pieceImg.alt = tapState.selectedPiece;

        // Limpiar piezas existentes en esa casilla
        const existingPieces = square.querySelectorAll('.piece');
        existingPieces.forEach(p => p.remove());

        // Agregar pieza al tablero
        square.appendChild(pieceImg);

        // Remover pieza del banco
        tapState.selectedPieceElement.remove();

        // Callback
        onPiecePlaced(tapState.selectedPiece, squareCoord);

        // Limpiar selección
        if (tapState.selectedSlot) {
            tapState.selectedSlot.style.background = '';
            tapState.selectedSlot.style.boxShadow = '';
        }

        tapState.selectedPiece = null;
        tapState.selectedPieceElement = null;
        tapState.selectedSlot = null;

        console.log(`✅ Pieza colocada con tap-tap`);
    });

    console.log('✅ Sistema Tap-Tap inicializado');
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

// Para uso como módulo ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDragDrop,
        initTapTap
    };
}

// Para uso global en navegador
if (typeof window !== 'undefined') {
    window.ChessGameLibrary = window.ChessGameLibrary || {};
    window.ChessGameLibrary.DragDrop = {
        initDragDrop,
        initTapTap
    };
}

console.log('📦 ChessGameLibrary.DragDrop cargado');
