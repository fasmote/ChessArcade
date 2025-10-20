/**
 * ============================================
 * BOARD COORDINATES MODULE
 * ============================================
 * Sistema de coordenadas para tableros de ajedrez
 *
 * Características:
 * - Coordenadas estilo "taxi" (amarillo/negro)
 * - Letras en columnas (a-h), números en filas (1-8)
 * - Adaptable a cualquier tamaño de tablero
 * - Preserva coordenadas al actualizar contenido
 * - Totalmente responsive
 *
 * @author ChessArcade Team
 * @version 1.0.0
 * @license MIT
 */

// ============================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================

/**
 * Estilos CSS para coordenadas tipo "taxi"
 * Retorna un string con todo el CSS necesario
 */
const TAXI_COORDINATES_CSS = `
/* ==========================================
   COORDENADAS TIPO "TAXI" (Amarillo/Negro)
   ==========================================
   Diseñadas para máxima visibilidad
   Inspiradas en los taxis de Nueva York
*/

/* Coordenadas horizontales (letras: a, b, c, d...) */
.coord-file {
    /* Posicionamiento */
    position: absolute;
    bottom: -18px;        /* Fuera de la casilla, hacia abajo */
    left: 50%;
    transform: translateX(-50%);

    /* Estilo del texto */
    color: #000000;       /* Negro para máximo contraste */
    font-size: 12px;
    font-weight: 900;     /* Extra bold */
    font-family: 'Orbitron', monospace;

    /* Fondo amarillo estilo taxi */
    background: linear-gradient(135deg, #ffeb3b 0%, #fdd835 100%);
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.2);

    /* Sombra para destacar */
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 0 8px rgba(255, 235, 59, 0.5);

    /* Evitar interacción */
    pointer-events: none;
    user-select: none;
    z-index: 50;
}

/* Coordenadas verticales (números: 1, 2, 3...) */
.coord-rank {
    /* Posicionamiento */
    position: absolute;
    left: -15px;          /* Fuera de la casilla, hacia la izquierda */
    top: 50%;
    transform: translateY(-50%);

    /* Estilo del texto */
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    font-family: 'Orbitron', monospace;

    /* Fondo amarillo estilo taxi */
    background: linear-gradient(135deg, #ffeb3b 0%, #fdd835 100%);
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.2);

    /* Sombra para destacar */
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 0 8px rgba(255, 235, 59, 0.5);

    /* Evitar interacción */
    pointer-events: none;
    user-select: none;
    z-index: 50;
}

/* Responsive: tamaños más grandes en pantallas grandes */
@media (min-width: 600px) {
    .coord-file { bottom: -20px; font-size: 13px; }
    .coord-rank { left: -17px; font-size: 13px; }
}

@media (min-width: 900px) {
    .coord-file { bottom: -22px; font-size: 14px; }
    .coord-rank { left: -19px; font-size: 14px; }
}
`;

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

/**
 * Inyecta los estilos CSS de coordenadas tipo taxi en el documento
 * Solo se inyecta una vez, incluso si se llama múltiples veces
 *
 * @example
 * injectTaxiCoordinatesCSS();
 */
function injectTaxiCoordinatesCSS() {
    // Verificar si ya se inyectó
    if (document.getElementById('taxi-coordinates-css')) {
        console.log('⚠️ Taxi coordinates CSS already injected');
        return;
    }

    // Crear elemento <style> e inyectar CSS
    const styleElement = document.createElement('style');
    styleElement.id = 'taxi-coordinates-css';
    styleElement.textContent = TAXI_COORDINATES_CSS;
    document.head.appendChild(styleElement);

    console.log('✅ Taxi coordinates CSS injected');
}

/**
 * Agrega coordenadas tipo "taxi" a un tablero de ajedrez
 *
 * IMPORTANTE: El tablero debe tener padding suficiente para que
 * las coordenadas quepan (mínimo 20px vertical, 15px horizontal)
 *
 * @param {Object} config - Configuración
 * @param {number} config.rows - Número de filas del tablero
 * @param {number} config.cols - Número de columnas del tablero
 * @param {string} config.boardSelector - Selector CSS del tablero
 * @param {boolean} [config.useLetters=true] - Usar letras (a-h) para columnas
 *
 * @example
 * // Tablero 8x8 estándar con letras
 * addTaxiCoordinates({
 *     rows: 8,
 *     cols: 8,
 *     boardSelector: '#chessboard'
 * });
 *
 * @example
 * // Tablero 3x4 con números en ambos ejes
 * addTaxiCoordinates({
 *     rows: 3,
 *     cols: 4,
 *     boardSelector: '#chessboard',
 *     useLetters: false
 * });
 */
function addTaxiCoordinates(config) {
    const {
        rows,
        cols,
        boardSelector,
        useLetters = true
    } = config;

    // Validación
    if (!rows || !cols || !boardSelector) {
        console.error('❌ addTaxiCoordinates: rows, cols, and boardSelector are required');
        return;
    }

    // Inyectar CSS si no está ya
    injectTaxiCoordinatesCSS();

    // Obtener todas las casillas del tablero
    const squares = document.querySelectorAll(`${boardSelector} .square`);

    if (squares.length === 0) {
        console.error(`❌ No squares found in ${boardSelector}`);
        return;
    }

    console.log(`📋 Adding taxi coordinates to ${rows}x${cols} board`);

    // Iterar por cada casilla
    squares.forEach((square, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        // ==========================================
        // COORDENADAS HORIZONTALES (columnas)
        // ==========================================
        // Se agregan en la ÚLTIMA FILA (bottom edge)
        if (row === rows - 1) {
            const coordFile = document.createElement('span');
            coordFile.className = 'coord-file';

            if (useLetters) {
                // Convertir a letra: 0→a, 1→b, 2→c...
                coordFile.textContent = String.fromCharCode(97 + col);
            } else {
                // Usar números: 1, 2, 3...
                coordFile.textContent = col + 1;
            }

            square.appendChild(coordFile);
        }

        // ==========================================
        // COORDENADAS VERTICALES (filas)
        // ==========================================
        // Se agregan en la PRIMERA COLUMNA (left edge)
        if (col === 0) {
            const coordRank = document.createElement('span');
            coordRank.className = 'coord-rank';

            // Números de arriba hacia abajo: rows, rows-1, rows-2...
            coordRank.textContent = rows - row;

            square.appendChild(coordRank);
        }
    });

    console.log(`✅ Taxi coordinates added successfully`);
}

/**
 * Preserva las coordenadas al limpiar el contenido de una casilla
 *
 * USO: En lugar de usar square.innerHTML = '', usar esta función
 *
 * @param {HTMLElement} square - Elemento de la casilla
 *
 * @example
 * // ❌ MAL: Borra TODO incluyendo coordenadas
 * square.innerHTML = '';
 *
 * // ✅ BIEN: Preserva coordenadas
 * clearSquareContent(square);
 */
function clearSquareContent(square) {
    // Guardar referencias a coordenadas antes de limpiar
    const coordFile = square.querySelector('.coord-file');
    const coordRank = square.querySelector('.coord-rank');

    // Limpiar TODO el contenido
    square.innerHTML = '';

    // Restaurar coordenadas si existían
    if (coordFile) square.appendChild(coordFile);
    if (coordRank) square.appendChild(coordRank);
}

/**
 * Agrega contenido a una casilla preservando las coordenadas
 *
 * IMPORTANTE: NO usar innerHTML para agregar contenido
 * En su lugar, crear elementos y usar esta función
 *
 * @param {HTMLElement} square - Elemento de la casilla
 * @param {...HTMLElement} elements - Elementos a agregar
 *
 * @example
 * // Crear elementos
 * const moveNumber = document.createElement('span');
 * moveNumber.className = 'move-number';
 * moveNumber.textContent = '5';
 *
 * const knight = document.createElement('span');
 * knight.className = 'knight-symbol';
 * knight.textContent = '♘';
 *
 * // Agregar preservando coordenadas
 * addContentToSquare(square, moveNumber, knight);
 */
function addContentToSquare(square, ...elements) {
    // Primero limpiar contenido antiguo preservando coordenadas
    clearSquareContent(square);

    // Agregar nuevos elementos
    elements.forEach(element => {
        if (element && element instanceof HTMLElement) {
            square.appendChild(element);
        }
    });
}

/**
 * Elimina las coordenadas de un tablero
 * Útil si se quiere cambiar de estilo o limpiar el tablero
 *
 * @param {string} boardSelector - Selector CSS del tablero
 *
 * @example
 * removeTaxiCoordinates('#chessboard');
 */
function removeTaxiCoordinates(boardSelector) {
    const coords = document.querySelectorAll(
        `${boardSelector} .coord-file, ${boardSelector} .coord-rank`
    );

    coords.forEach(coord => coord.remove());

    console.log(`🗑️ Removed ${coords.length} taxi coordinates from ${boardSelector}`);
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

// CommonJS export (para Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addTaxiCoordinates,
        injectTaxiCoordinatesCSS,
        clearSquareContent,
        addContentToSquare,
        removeTaxiCoordinates,
        TAXI_COORDINATES_CSS
    };
}

// ES6 export (para navegadores modernos)
if (typeof window !== 'undefined') {
    window.ChessGameLibrary = window.ChessGameLibrary || {};
    window.ChessGameLibrary.BoardCoordinates = {
        addTaxiCoordinates,
        injectTaxiCoordinatesCSS,
        clearSquareContent,
        addContentToSquare,
        removeTaxiCoordinates,
        TAXI_COORDINATES_CSS
    };
}

console.log('📦 BoardCoordinates module loaded');
