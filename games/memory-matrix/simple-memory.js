// Memory Matrix v2 - JavaScript Simple y Limpio
// Solo un nivel: dos reyes

console.log('🧠 Memory Matrix v2 - Iniciando...');

// Estado del juego
let gameState = 'waiting'; // 'waiting', 'memorizing', 'placing', 'complete'
let board = null;
let targetPosition = null;

// Posición inicial: solo dos reyes
const INITIAL_POSITION = {
    e1: 'wK', // Rey blanco en e1
    e8: 'bK'  // Rey negro en e8
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, inicializando juego...');
    initializeGame();
});

function initializeGame() {
    console.log('🎮 Inicializando Memory Matrix v2...');

    // Verificar que las librerías estén cargadas
    const ChessboardConstructor = window.Chessboard2 || window.Chessboard;
    if (!ChessboardConstructor) {
        console.error('❌ Chessboard2 no está cargado');
        updateStatus('Error: No se pudo cargar Chessboard2');
        return;
    }

    console.log('🔧 Constructor encontrado:', typeof ChessboardConstructor);

    // Crear el tablero con la misma configuración que funcionaba
    const config = {
        position: INITIAL_POSITION,
        draggable: false, // Inicialmente no draggable
        dropOffBoard: 'trash',
        sparePieces: false,
        pieceTheme: (piece) => {
            // Función que retorna HTML con imagen SVG de Lichess desde CDN
            return `<img src="https://lichess1.org/assets/piece/cburnett/${piece}.svg" alt="${piece}" style="width: 100%; height: 100%;">`;
        }
    };

    try {
        board = ChessboardConstructor('chessboard', config);
        console.log('✅ Tablero creado correctamente');

        // Verificar que el tablero se creó
        if (!board) {
            throw new Error('Board object is null');
        }

    } catch (error) {
        console.error('❌ Error creando tablero:', error);
        updateStatus('Error: No se pudo crear el tablero');
        return;
    }

    // Event listeners
    document.getElementById('startBtn').addEventListener('click', startGame);

    // Actualizar status
    updateStatus('Haz clic en "Comenzar" para empezar');
    console.log('✅ Juego inicializado correctamente');
}

function startGame() {
    console.log('🚀 Iniciando juego...');
    gameState = 'memorizing';

    // Mostrar posición por 3 segundos
    board.position(INITIAL_POSITION);
    updateStatus('¡Memoriza la posición de los reyes! (3 segundos)');

    // Después de 3 segundos, ocultar las piezas y comenzar fase de colocación
    setTimeout(() => {
        startPlacingPhase();
    }, 3000);
}

function startPlacingPhase() {
    console.log('🎯 Iniciando fase de colocación...');
    gameState = 'placing';

    // Guardar la posición objetivo
    targetPosition = { ...INITIAL_POSITION };

    // Limpiar el tablero
    board.clear();

    // Crear banco de piezas
    createPieceBank();

    // Hacer el tablero draggable
    board.draggable = true;

    // Configurar drop en el tablero
    const boardConfig = {
        position: 'start',
        draggable: true,
        dropOffBoard: 'trash',
        onDrop: onDrop,
        onDragStart: onDragStart,
        pieceTheme: (piece) => {
            // Función que retorna HTML con imagen SVG de Lichess desde CDN
            return `<img src="https://lichess1.org/assets/piece/cburnett/${piece}.svg" alt="${piece}" style="width: 100%; height: 100%;">`;
        }
    };

    board = ChessboardConstructor('chessboard', boardConfig);
    board.clear(); // Asegurar que esté vacío

    updateStatus('Arrastra las piezas del banco al tablero para recrear la posición');
}

function createPieceBank() {
    console.log('🏦 Creando banco de piezas...');

    const bankContainer = document.getElementById('piece-bank');
    bankContainer.innerHTML = ''; // Limpiar

    // Crear piezas draggables
    const pieces = ['wK', 'bK']; // Solo los dos reyes

    pieces.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'draggable-piece';
        pieceElement.draggable = true;
        pieceElement.dataset.piece = piece;

        // Crear imagen de la pieza
        const pieceImg = document.createElement('img');
        pieceImg.src = `libs/img/chesspieces/lichess/${piece}.svg`;
        pieceImg.alt = piece;
        pieceImg.style.width = '100%';
        pieceImg.style.height = '100%';
        pieceImg.style.objectFit = 'contain';

        pieceElement.appendChild(pieceImg);

        // Event listeners para drag
        pieceElement.addEventListener('dragstart', function(e) {
            console.log(`🎯 Dragstart: ${piece}`);
            e.dataTransfer.setData('text/plain', piece);
            e.dataTransfer.effectAllowed = 'move';
        });

        bankContainer.appendChild(pieceElement);
    });

    console.log('✅ Banco de piezas creado');
}

function onDragStart(source, piece, position, orientation) {
    console.log(`🎯 Drag start: ${piece} from ${source}`);
    // Permitir drag de cualquier pieza
    return true;
}

function onDrop(source, target, piece, newPos, oldPos, orientation) {
    console.log(`🎯 Drop: ${piece} from ${source} to ${target}`);

    // Siempre permitir el drop
    checkWinCondition();
    return;
}

function checkWinCondition() {
    console.log('🔍 Verificando condición de victoria...');

    // Obtener posición actual
    const currentPosition = board.position();

    console.log('📍 Posición actual:', currentPosition);
    console.log('🎯 Posición objetivo:', targetPosition);

    // Verificar si coincide con la posición objetivo
    let matches = 0;
    const targetKeys = Object.keys(targetPosition);

    for (let square of targetKeys) {
        if (currentPosition[square] === targetPosition[square]) {
            matches++;
        }
    }

    console.log(`✅ Coincidencias: ${matches}/${targetKeys.length}`);

    if (matches === targetKeys.length) {
        // ¡Victoria!
        gameState = 'complete';
        updateStatus('¡Excelente! ¡Has recreado la posición correctamente! 🎉');
        console.log('🎉 ¡VICTORIA!');

        // Desactivar drag
        board.draggable = false;

        // Cambiar botón para reiniciar
        const startBtn = document.getElementById('startBtn');
        startBtn.textContent = 'Jugar de nuevo';
    } else {
        updateStatus(`Bien, sigue colocando... (${matches}/${targetKeys.length} correctas)`);
    }
}

function updateStatus(message) {
    document.getElementById('status-text').textContent = message;
    console.log(`📢 Status: ${message}`);
}

// Permitir drop en el tablero desde el banco
document.addEventListener('dragover', function(e) {
    if (e.target.closest('#chessboard')) {
        e.preventDefault();
    }
});

document.addEventListener('drop', function(e) {
    if (e.target.closest('#chessboard')) {
        e.preventDefault();

        const piece = e.dataTransfer.getData('text/plain');
        console.log(`🎯 Drop desde banco: ${piece}`);

        // Determinar la casilla donde se hizo drop
        // (esto es complejo con ChessBoard.js, por simplicidad usaremos una posición fija)
        // En una implementación completa, necesitaríamos calcular la casilla basada en coordenadas

        // Por ahora, permitir colocar en cualquier casilla vacía
        const position = board.position();
        const emptySquares = [];

        for (let rank = 1; rank <= 8; rank++) {
            for (let file = 'a'; file <= 'h'; file = String.fromCharCode(file.charCodeAt(0) + 1)) {
                const square = file + rank;
                if (!position[square]) {
                    emptySquares.push(square);
                }
            }
        }

        if (emptySquares.length > 0) {
            // Colocar en la primera casilla vacía (temporal)
            const targetSquare = emptySquares[0];
            position[targetSquare] = piece;
            board.position(position);

            // Remover pieza del banco
            const pieceElements = document.querySelectorAll(`[data-piece="${piece}"]`);
            if (pieceElements.length > 0) {
                pieceElements[0].remove();
            }

            checkWinCondition();
        }
    }
});

console.log('✅ Memory Matrix v2 scripts cargados');