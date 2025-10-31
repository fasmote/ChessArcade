# 🔧 Diseño Técnico - ChessFive
## Arquitectura y Especificaciones de Implementación

---

**Proyecto:** ChessFive
**Versión:** 1.0.0
**Fecha:** Octubre 2025
**Autor:** ChessArcade Team

---

## 📑 Tabla de Contenidos

1. [Arquitectura General](#1-arquitectura-general)
2. [Módulos del Sistema](#2-módulos-del-sistema)
3. [Estructura de Datos](#3-estructura-de-datos)
4. [Algoritmos Clave](#4-algoritmos-clave)
5. [Sistema de UI](#5-sistema-de-ui)
6. [Sistema de Audio](#6-sistema-de-audio)
7. [Gestión de Estado](#7-gestión-de-estado)
8. [Flujo de Eventos](#8-flujo-de-eventos)
9. [Optimizaciones](#9-optimizaciones)
10. [Testing](#10-testing)

---

## 1. ARQUITECTURA GENERAL

### 1.1 Patrón de Diseño

**Patrón Principal:** MVC (Model-View-Controller) Adaptado

```
┌─────────────────────────────────────────────┐
│              USER INTERFACE                 │
│         (HTML + CSS + DOM Events)           │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│           UI CONTROLLER                     │
│  - Captura eventos (click, hover)           │
│  - Valida acciones del usuario              │
│  - Actualiza vista                          │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│          GAME STATE MANAGER                 │
│  - Estado centralizado (single source)      │
│  - Lógica de negocio                        │
│  - Transiciones de fase                     │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────┴─────────┐
         ↓                  ↓
┌──────────────────┐  ┌──────────────────┐
│  GRAVITY PHASE   │  │   CHESS PHASE    │
│  - Drop logic    │  │  - Move logic    │
│  - Animation     │  │  - Validation    │
└──────────────────┘  └──────────────────┘
         │                  │
         └────────┬─────────┘
                  ↓
┌─────────────────────────────────────────────┐
│         WIN DETECTION ENGINE                │
│  - Algoritmo de escaneo                     │
│  - Detección de líneas                      │
└─────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────┐
│       SOUND MANAGER + EFFECTS               │
│  - Web Audio API                            │
│  - Particle system                          │
└─────────────────────────────────────────────┘
```

---

### 1.2 Estructura de Archivos

```
games/chessfive/
│
├── index.html                          # Página principal
│
├── assets/
│   ├── css/
│   │   ├── chessfive-style.css         # Estilos específicos del juego
│   │   └── animations.css              # Animaciones separadas
│   │
│   └── js/
│       ├── core/
│       │   ├── game-state.js           # Gestión de estado (singleton)
│       │   ├── constants.js            # Constantes globales
│       │   └── utils.js                # Funciones auxiliares
│       │
│       ├── phases/
│       │   ├── gravity-phase.js        # Lógica de gravedad
│       │   └── chess-phase.js          # Lógica de movimiento
│       │
│       ├── engines/
│       │   ├── win-detection.js        # Detección de victoria
│       │   └── move-validator.js       # Validación de movimientos
│       │
│       ├── ui/
│       │   ├── ui-controller.js        # Control general de UI
│       │   ├── board-renderer.js       # Renderizado del tablero
│       │   └── panel-controller.js     # Panel de estado
│       │
│       ├── effects/
│       │   ├── sound-manager.js        # Sistema de audio
│       │   ├── particle-system.js      # Sistema de partículas
│       │   └── animations.js           # Animaciones programáticas
│       │
│       └── main.js                     # Entry point (inicialización)
│
└── docs/
    ├── ERS_REQUERIMIENTOS.md           # Especificación de requerimientos
    ├── SESION_RESUMEN.md               # Resumen para continuidad
    └── DISEÑO_TECNICO.md               # Este documento
```

---

## 2. MÓDULOS DEL SISTEMA

### 2.1 Core Modules

#### 2.1.1 `game-state.js` - Game State Manager

**Responsabilidad:** Gestión centralizada del estado del juego.

**Patrón:** Singleton

```javascript
/**
 * ============================================
 * GAME STATE MANAGER (Singleton)
 * ============================================
 * Gestiona el estado global del juego
 * Single source of truth para toda la aplicación
 */

const GameState = (function() {
    // Estado privado
    let state = {
        phase: 'gravity',              // 'gravity' | 'chess' | 'ended'
        currentPlayer: 'cyan',         // 'cyan' | 'magenta'
        board: Array(64).fill(null),   // Tablero [0-63]

        cyanPieces: {
            available: [],             // Piezas no colocadas
            placed: []                 // Piezas en tablero con posición
        },

        magentaPieces: {
            available: [],
            placed: []
        },

        moveHistory: [],               // Historial de movimientos
        winner: null,                  // null | 'cyan' | 'magenta' | 'draw'
        winningLine: null,             // Array de índices [a, b, c, d, e]

        selectedPiece: null,           // Pieza seleccionada en chess phase
        validMoves: []                 // Movimientos válidos para pieza seleccionada
    };

    // API pública
    return {
        // Getters
        getState: () => ({ ...state }),
        getPhase: () => state.phase,
        getCurrentPlayer: () => state.currentPlayer,
        getBoard: () => [...state.board],
        getPiece: (index) => state.board[index],

        // Setters
        setPhase: (phase) => { state.phase = phase; },
        setCurrentPlayer: (player) => { state.currentPlayer = player; },
        setPiece: (index, piece) => { state.board[index] = piece; },

        // Actions
        switchPlayer: () => {
            state.currentPlayer = state.currentPlayer === 'cyan' ? 'magenta' : 'cyan';
        },

        addMove: (move) => {
            state.moveHistory.push(move);
        },

        setWinner: (winner, line) => {
            state.winner = winner;
            state.winningLine = line;
            state.phase = 'ended';
        },

        reset: () => {
            state = initializeState();
        },

        // Piece management
        getAvailablePieces: (player) => {
            return player === 'cyan'
                ? [...state.cyanPieces.available]
                : [...state.magentaPieces.available];
        },

        removePieceFromAvailable: (player) => {
            const pieces = player === 'cyan'
                ? state.cyanPieces.available
                : state.magentaPieces.available;

            return pieces.shift(); // Devuelve y elimina la primera
        },

        addPlacedPiece: (player, piece) => {
            if (player === 'cyan') {
                state.cyanPieces.placed.push(piece);
            } else {
                state.magentaPieces.placed.push(piece);
            }
        }
    };
})();

/**
 * Inicializa el estado del juego
 */
function initializeState() {
    return {
        phase: 'gravity',
        currentPlayer: 'cyan',
        board: Array(64).fill(null),
        cyanPieces: {
            available: createPieceSet('cyan'),
            placed: []
        },
        magentaPieces: {
            available: createPieceSet('magenta'),
            placed: []
        },
        moveHistory: [],
        winner: null,
        winningLine: null,
        selectedPiece: null,
        validMoves: []
    };
}

/**
 * Crea un set de 8 piezas para un jugador
 */
function createPieceSet(color) {
    return [
        { type: 'rook', color, symbol: '♖', position: null },
        { type: 'rook', color, symbol: '♖', position: null },
        { type: 'knight', color, symbol: '♘', position: null },
        { type: 'knight', color, symbol: '♘', position: null },
        { type: 'bishop', color, symbol: '♗', position: null },
        { type: 'bishop', color, symbol: '♗', position: null },
        { type: 'queen', color, symbol: '♕', position: null },
        { type: 'king', color, symbol: '♔', position: null }
    ];
}
```

---

#### 2.1.2 `constants.js` - Constantes Globales

```javascript
/**
 * ============================================
 * CONSTANTES GLOBALES
 * ============================================
 */

// Dimensiones del tablero
export const BOARD = {
    ROWS: 8,
    COLS: 8,
    TOTAL_SQUARES: 64
};

// Índices de conversión
export const COORD = {
    // Convierte índice a fila/columna
    toRow: (index) => Math.floor(index / BOARD.COLS),
    toCol: (index) => index % BOARD.COLS,

    // Convierte fila/columna a índice
    toIndex: (row, col) => row * BOARD.COLS + col,

    // Convierte a notación algebraica
    toAlgebraic: (index) => {
        const col = COORD.toCol(index);
        const row = COORD.toRow(index);
        return String.fromCharCode(97 + col) + (row + 1);
    }
};

// Direcciones para detección de líneas
export const DIRECTIONS = {
    HORIZONTAL: [0, 1],      // →
    VERTICAL: [1, 0],        // ↓
    DIAGONAL_DOWN: [1, 1],   // ↘
    DIAGONAL_UP: [1, -1]     // ↗
};

// Movimientos de piezas (deltas relativos)
export const PIECE_MOVES = {
    rook: [
        [-1, 0], [1, 0], [0, -1], [0, 1]  // Arriba, Abajo, Izq, Der
    ],
    bishop: [
        [-1, -1], [-1, 1], [1, -1], [1, 1]  // 4 diagonales
    ],
    queen: [
        [-1, 0], [1, 0], [0, -1], [0, 1],   // Como torre
        [-1, -1], [-1, 1], [1, -1], [1, 1]  // Como alfil
    ],
    king: [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ],
    knight: [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ]
};

// Configuración de animaciones
export const ANIMATION = {
    GRAVITY_DURATION: 400,    // ms - caída de pieza
    MOVE_DURATION: 300,       // ms - movimiento chess
    BOUNCE_DURATION: 200,     // ms - efecto bounce
    TRANSITION_DURATION: 2000 // ms - transición de fase
};

// Configuración de audio
export const AUDIO = {
    ENABLED: true,
    VOLUME: 0.5,
    FREQUENCIES: {
        DROP: 200,           // Hz - pieza cae
        MOVE: 300,           // Hz - movimiento
        SELECT: 400,         // Hz - selección
        WARNING: 500,        // Hz - 3-4 en línea
        VICTORY: [261, 329, 392, 523]  // C-E-G-C
    }
};

// Colores NeonChess
export const COLORS = {
    CYAN: '#00ffff',
    MAGENTA: '#ff00ff',
    YELLOW: '#ffff00',
    ORANGE: '#ff8000',
    GREEN: '#00ff80',
    PURPLE: '#8000ff',
    WHITE: '#ffffff',
    BLACK: '#000000'
};
```

---

#### 2.1.3 `utils.js` - Funciones Auxiliares

```javascript
/**
 * ============================================
 * UTILIDADES GENERALES
 * ============================================
 */

/**
 * Verifica si un índice está dentro del tablero
 */
export function isValidIndex(index) {
    return index >= 0 && index < 64;
}

/**
 * Verifica si una fila/columna está dentro del tablero
 */
export function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Clona un objeto profundamente
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Pausa la ejecución (para animaciones)
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Genera un ID único
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Logging condicional (solo en desarrollo)
 */
export const logger = {
    log: (msg, ...args) => {
        if (window.DEBUG) console.log(`[ChessFive] ${msg}`, ...args);
    },
    error: (msg, ...args) => {
        console.error(`[ChessFive ERROR] ${msg}`, ...args);
    },
    warn: (msg, ...args) => {
        console.warn(`[ChessFive WARN] ${msg}`, ...args);
    }
};
```

---

### 2.2 Phase Modules

#### 2.2.1 `gravity-phase.js`

**Responsabilidad:** Lógica de la fase de gravedad (colocación de piezas).

```javascript
/**
 * ============================================
 * GRAVITY PHASE MODULE
 * ============================================
 * Maneja la colocación de piezas con gravedad
 */

import { GameState } from '../core/game-state.js';
import { COORD, ANIMATION } from '../core/constants.js';
import { BoardRenderer } from '../ui/board-renderer.js';
import { SoundManager } from '../effects/sound-manager.js';

export const GravityPhase = {

    /**
     * Maneja el click en una columna
     */
    handleColumnClick(columnIndex) {
        const player = GameState.getCurrentPlayer();
        const availablePieces = GameState.getAvailablePieces(player);

        // Validar que quedan piezas
        if (availablePieces.length === 0) {
            logger.error('No pieces available');
            return;
        }

        // Calcular dónde cae la pieza
        const targetIndex = this.calculateDropPosition(columnIndex);

        if (targetIndex === null) {
            // Columna llena
            SoundManager.playError();
            BoardRenderer.shakeColumn(columnIndex);
            return;
        }

        // Obtener la siguiente pieza
        const piece = GameState.removePieceFromAvailable(player);
        piece.position = targetIndex;

        // Animar caída
        this.animateDrop(piece, columnIndex, targetIndex);
    },

    /**
     * Calcula dónde caerá la pieza en una columna
     * @returns {number|null} - Índice destino o null si columna llena
     */
    calculateDropPosition(columnIndex) {
        const board = GameState.getBoard();

        // Buscar desde abajo hacia arriba (fila 7 → 0)
        for (let row = 7; row >= 0; row--) {
            const index = COORD.toIndex(row, columnIndex);

            if (board[index] === null) {
                return index; // Primera casilla vacía
            }
        }

        return null; // Columna llena
    },

    /**
     * Anima la caída de una pieza
     */
    async animateDrop(piece, columnIndex, targetIndex) {
        const player = GameState.getCurrentPlayer();

        // 1. Mostrar pieza en la parte superior
        BoardRenderer.showGhostPiece(piece, columnIndex, 0);

        // 2. Animar caída con ease-in
        await BoardRenderer.animateFall(piece, targetIndex, ANIMATION.GRAVITY_DURATION);

        // 3. Bounce effect
        SoundManager.playDrop(piece.type);
        await BoardRenderer.bounceEffect(targetIndex, ANIMATION.BOUNCE_DURATION);

        // 4. Actualizar estado
        GameState.setPiece(targetIndex, piece);
        GameState.addPlacedPiece(player, piece);
        GameState.addMove({
            player,
            piece,
            from: null,
            to: targetIndex,
            phase: 'gravity',
            timestamp: new Date()
        });

        // 5. Actualizar UI
        BoardRenderer.renderBoard();
        PanelController.updatePieceCounter(player);

        // 6. Verificar si se completó la fase
        if (this.isPhaseComplete()) {
            await this.transitionToChessPhase();
        } else {
            // Cambiar turno
            GameState.switchPlayer();
            PanelController.updateTurn();
        }
    },

    /**
     * Verifica si la fase gravity está completa
     */
    isPhaseComplete() {
        const cyanRemaining = GameState.getAvailablePieces('cyan').length;
        const magentaRemaining = GameState.getAvailablePieces('magenta').length;

        return cyanRemaining === 0 && magentaRemaining === 0;
    },

    /**
     * Transición a fase de ajedrez
     */
    async transitionToChessPhase() {
        // 1. Mostrar overlay de transición
        UIController.showTransitionOverlay();

        // 2. Efecto glitch
        await BoardRenderer.glitchEffect();

        // 3. Despertar piezas
        await BoardRenderer.awakenPieces();

        // 4. Sound effect
        SoundManager.playPhaseTransition();

        // 5. Esperar 2 segundos
        await sleep(2000);

        // 6. Cambiar fase
        GameState.setPhase('chess');

        // 7. Actualizar UI
        UIController.hideTransitionOverlay();
        PanelController.updatePhaseDisplay('chess');

        // 8. Habilitar controles de chess
        ChessPhase.enable();
    }
};
```

---

#### 2.2.2 `chess-phase.js`

**Responsabilidad:** Lógica de movimiento de piezas con reglas de ajedrez.

```javascript
/**
 * ============================================
 * CHESS PHASE MODULE
 * ============================================
 * Maneja el movimiento de piezas según reglas de ajedrez
 */

import { GameState } from '../core/game-state.js';
import { MoveValidator } from '../engines/move-validator.js';
import { WinDetection } from '../engines/win-detection.js';

export const ChessPhase = {

    selectedPiece: null,
    validMoves: [],

    /**
     * Habilita la fase de chess
     */
    enable() {
        BoardRenderer.enablePieceSelection();
    },

    /**
     * Maneja el click en una pieza
     */
    handlePieceClick(index) {
        const piece = GameState.getPiece(index);
        const player = GameState.getCurrentPlayer();

        // Validar que es pieza del jugador actual
        if (!piece || piece.color !== player) {
            SoundManager.playError();
            return;
        }

        // Si ya había una pieza seleccionada, deseleccionar
        if (this.selectedPiece !== null) {
            BoardRenderer.deselectPiece(this.selectedPiece);
        }

        // Seleccionar nueva pieza
        this.selectedPiece = index;
        BoardRenderer.selectPiece(index);
        SoundManager.playSelect();

        // Calcular movimientos válidos
        this.validMoves = MoveValidator.getValidMoves(piece, index);
        BoardRenderer.highlightValidMoves(this.validMoves);
    },

    /**
     * Maneja el click en una casilla destino
     */
    async handleSquareClick(targetIndex) {
        // Validar que hay pieza seleccionada
        if (this.selectedPiece === null) {
            return;
        }

        // Validar que el movimiento es válido
        if (!this.validMoves.includes(targetIndex)) {
            SoundManager.playError();
            BoardRenderer.shakeSquare(targetIndex);
            return;
        }

        // Ejecutar movimiento
        await this.executeMove(this.selectedPiece, targetIndex);
    },

    /**
     * Ejecuta un movimiento
     */
    async executeMove(fromIndex, toIndex) {
        const piece = GameState.getPiece(fromIndex);
        const player = GameState.getCurrentPlayer();

        // 1. Animar movimiento
        await BoardRenderer.animateMove(fromIndex, toIndex, ANIMATION.MOVE_DURATION);
        SoundManager.playMove();

        // 2. Actualizar estado
        GameState.setPiece(fromIndex, null);  // Limpiar origen
        GameState.setPiece(toIndex, piece);   // Colocar en destino
        piece.position = toIndex;

        GameState.addMove({
            player,
            piece,
            from: fromIndex,
            to: toIndex,
            phase: 'chess',
            timestamp: new Date()
        });

        // 3. Limpiar selección
        BoardRenderer.deselectPiece(fromIndex);
        BoardRenderer.clearHighlights();
        this.selectedPiece = null;
        this.validMoves = [];

        // 4. Renderizar tablero
        BoardRenderer.renderBoard();

        // 5. Detectar victoria
        const winResult = WinDetection.checkWin(toIndex, piece.color);

        if (winResult.win) {
            await this.handleVictory(player, winResult.line);
            return;
        }

        // 6. Detectar líneas de advertencia (3-4 en línea)
        const warningLines = WinDetection.detectWarningLines(piece.color);
        if (warningLines.length > 0) {
            SoundManager.playWarning(warningLines.length);
            BoardRenderer.highlightWarningLines(warningLines);
        }

        // 7. Cambiar turno
        GameState.switchPlayer();
        PanelController.updateTurn();
    },

    /**
     * Maneja la victoria
     */
    async handleVictory(winner, line) {
        // 1. Guardar estado
        GameState.setWinner(winner, line);

        // 2. Congelar tablero
        BoardRenderer.freeze();

        // 3. Resaltar línea ganadora
        await BoardRenderer.highlightWinningLine(line);

        // 4. Sound de victoria
        SoundManager.playVictory();

        // 5. Mostrar pantalla de victoria
        UIController.showVictoryScreen(winner, line);
    }
};
```

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Piece Object (Detallado)

```javascript
{
    type: 'rook' | 'knight' | 'bishop' | 'queen' | 'king',
    color: 'cyan' | 'magenta',
    position: 0-63 | null,       // null si no está colocada
    symbol: '♖' | '♘' | '♗' | '♕' | '♔',
    id: 'unique-id',             // Para tracking
    moveCount: 0                 // Cantidad de veces que se movió
}
```

### 3.2 Move Object (Detallado)

```javascript
{
    player: 'cyan' | 'magenta',
    piece: Piece,                // Referencia al objeto pieza
    from: 0-63 | null,           // null en gravity phase
    to: 0-63,                    // Índice destino
    phase: 'gravity' | 'chess',
    timestamp: Date,
    notation: 'e4' | 'Nf3',     // Notación algebraica (opcional)
    capturedPiece: null          // Siempre null (no hay captura)
}
```

---

## 4. ALGORITMOS CLAVE

### 4.1 Detección de 5 en Línea

**Archivo:** `win-detection.js`

```javascript
/**
 * ============================================
 * WIN DETECTION ENGINE
 * ============================================
 * Detecta si un jugador formó 5 en línea
 */

import { COORD, DIRECTIONS } from '../core/constants.js';
import { GameState } from '../core/game-state.js';

export const WinDetection = {

    /**
     * Verifica si el último movimiento generó una victoria
     * @param {number} lastMoveIndex - Índice de la última pieza colocada/movida
     * @param {string} color - 'cyan' | 'magenta'
     * @returns {Object} - { win: boolean, line: Array|null }
     */
    checkWin(lastMoveIndex, color) {
        const directions = [
            DIRECTIONS.HORIZONTAL,
            DIRECTIONS.VERTICAL,
            DIRECTIONS.DIAGONAL_DOWN,
            DIRECTIONS.DIAGONAL_UP
        ];

        for (let direction of directions) {
            const result = this.checkDirection(lastMoveIndex, color, direction);

            if (result.count >= 5) {
                return {
                    win: true,
                    line: result.line
                };
            }
        }

        return { win: false, line: null };
    },

    /**
     * Cuenta piezas consecutivas en una dirección
     */
    checkDirection(startIndex, color, [dRow, dCol]) {
        const board = GameState.getBoard();
        const startRow = COORD.toRow(startIndex);
        const startCol = COORD.toCol(startIndex);

        let line = [startIndex];
        let count = 1;

        // Contar hacia adelante
        count += this.countInDirection(
            board, color, startRow, startCol, dRow, dCol, line
        );

        // Contar hacia atrás
        count += this.countInDirection(
            board, color, startRow, startCol, -dRow, -dCol, line
        );

        return { count, line };
    },

    /**
     * Cuenta en una dirección específica
     */
    countInDirection(board, color, startRow, startCol, dRow, dCol, line) {
        let count = 0;
        let row = startRow + dRow;
        let col = startCol + dCol;

        while (isValidPosition(row, col)) {
            const index = COORD.toIndex(row, col);
            const piece = board[index];

            if (piece && piece.color === color) {
                count++;
                line.push(index);
                row += dRow;
                col += dCol;
            } else {
                break; // Casilla vacía o pieza del rival
            }
        }

        return count;
    },

    /**
     * Detecta líneas de advertencia (3-4 piezas)
     * Útil para mostrar al usuario que está cerca de ganar
     */
    detectWarningLines(color) {
        // Similar a checkWin pero detecta líneas de 3-4
        // Retorna array de líneas encontradas
        // Implementación análoga...
    }
};
```

---

### 4.2 Validación de Movimientos

**Archivo:** `move-validator.js`

```javascript
/**
 * ============================================
 * MOVE VALIDATOR
 * ============================================
 * Valida movimientos según reglas de ajedrez
 */

import { PIECE_MOVES, COORD } from '../core/constants.js';
import { GameState } from '../core/game-state.js';
import { isValidPosition } from '../core/utils.js';

export const MoveValidator = {

    /**
     * Obtiene todos los movimientos válidos para una pieza
     * @param {Piece} piece - Pieza a mover
     * @param {number} fromIndex - Posición actual
     * @returns {Array<number>} - Índices de casillas válidas
     */
    getValidMoves(piece, fromIndex) {
        const type = piece.type;

        switch (type) {
            case 'knight':
                return this.getKnightMoves(fromIndex);
            case 'rook':
                return this.getSlidingMoves(fromIndex, PIECE_MOVES.rook);
            case 'bishop':
                return this.getSlidingMoves(fromIndex, PIECE_MOVES.bishop);
            case 'queen':
                return this.getSlidingMoves(fromIndex, PIECE_MOVES.queen);
            case 'king':
                return this.getKingMoves(fromIndex);
            default:
                return [];
        }
    },

    /**
     * Movimientos del caballo (puede saltar)
     */
    getKnightMoves(fromIndex) {
        const board = GameState.getBoard();
        const fromRow = COORD.toRow(fromIndex);
        const fromCol = COORD.toCol(fromIndex);
        const validMoves = [];

        for (let [dRow, dCol] of PIECE_MOVES.knight) {
            const toRow = fromRow + dRow;
            const toCol = fromCol + dCol;

            if (isValidPosition(toRow, toCol)) {
                const toIndex = COORD.toIndex(toRow, toCol);

                // Casilla debe estar vacía (no hay captura)
                if (board[toIndex] === null) {
                    validMoves.push(toIndex);
                }
            }
        }

        return validMoves;
    },

    /**
     * Movimientos de piezas que se deslizan (torre, alfil, dama)
     */
    getSlidingMoves(fromIndex, directions) {
        const board = GameState.getBoard();
        const fromRow = COORD.toRow(fromIndex);
        const fromCol = COORD.toCol(fromIndex);
        const validMoves = [];

        for (let [dRow, dCol] of directions) {
            let row = fromRow + dRow;
            let col = fromCol + dCol;

            // Deslizar en esta dirección hasta encontrar obstáculo
            while (isValidPosition(row, col)) {
                const index = COORD.toIndex(row, col);

                if (board[index] === null) {
                    // Casilla vacía - válida
                    validMoves.push(index);
                    row += dRow;
                    col += dCol;
                } else {
                    // Casilla ocupada - BLOQUEADA (no hay captura)
                    break;
                }
            }
        }

        return validMoves;
    },

    /**
     * Movimientos del rey (1 casilla)
     */
    getKingMoves(fromIndex) {
        const board = GameState.getBoard();
        const fromRow = COORD.toRow(fromIndex);
        const fromCol = COORD.toCol(fromIndex);
        const validMoves = [];

        for (let [dRow, dCol] of PIECE_MOVES.king) {
            const toRow = fromRow + dRow;
            const toCol = fromCol + dCol;

            if (isValidPosition(toRow, toCol)) {
                const toIndex = COORD.toIndex(toRow, toCol);

                if (board[toIndex] === null) {
                    validMoves.push(toIndex);
                }
            }
        }

        return validMoves;
    }
};
```

---

## 5. SISTEMA DE UI

### 5.1 Renderizado del Tablero

**Archivo:** `board-renderer.js`

```javascript
/**
 * ============================================
 * BOARD RENDERER
 * ============================================
 * Renderiza y actualiza el tablero visualmente
 */

import { GameState } from '../core/game-state.js';
import { COORD } from '../core/constants.js';

export const BoardRenderer = {

    boardElement: null,
    squares: [],

    /**
     * Inicializa el tablero HTML
     */
    init() {
        this.boardElement = document.getElementById('chessboard');
        this.createBoard();
        this.addCoordinates();
    },

    /**
     * Crea las 64 casillas del tablero
     */
    createBoard() {
        this.boardElement.innerHTML = '';
        this.squares = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                const index = COORD.toIndex(row, col);

                square.className = 'square';
                square.dataset.index = index;
                square.dataset.row = row;
                square.dataset.col = col;

                // Alternar colores
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                this.boardElement.appendChild(square);
                this.squares[index] = square;
            }
        }
    },

    /**
     * Agrega coordenadas tipo "taxi"
     */
    addCoordinates() {
        // Usar ChessGameLibrary.BoardCoordinates
        if (window.ChessGameLibrary && window.ChessGameLibrary.BoardCoordinates) {
            window.ChessGameLibrary.BoardCoordinates.addTaxiCoordinates({
                rows: 8,
                cols: 8,
                boardSelector: '#chessboard',
                useLetters: true
            });
        }
    },

    /**
     * Renderiza el estado actual del tablero
     */
    renderBoard() {
        const board = GameState.getBoard();

        board.forEach((piece, index) => {
            const square = this.squares[index];

            // Limpiar contenido preservando coordenadas
            if (window.ChessGameLibrary && window.ChessGameLibrary.BoardCoordinates) {
                window.ChessGameLibrary.BoardCoordinates.clearSquareContent(square);
            } else {
                square.innerHTML = '';
            }

            // Renderizar pieza si existe
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece piece-${piece.color}`;
                pieceElement.textContent = piece.symbol;
                pieceElement.dataset.type = piece.type;

                square.appendChild(pieceElement);
            }
        });
    },

    /**
     * Anima la caída de una pieza (gravity phase)
     */
    async animateFall(piece, targetIndex, duration) {
        const targetSquare = this.squares[targetIndex];
        const rect = targetSquare.getBoundingClientRect();

        // Crear elemento temporal para animación
        const tempPiece = document.createElement('div');
        tempPiece.className = `piece piece-${piece.color} piece-falling`;
        tempPiece.textContent = piece.symbol;
        tempPiece.style.position = 'fixed';
        tempPiece.style.left = rect.left + 'px';
        tempPiece.style.top = '0px';
        tempPiece.style.transition = `top ${duration}ms ease-in`;

        document.body.appendChild(tempPiece);

        // Forzar reflow
        tempPiece.offsetHeight;

        // Animar caída
        tempPiece.style.top = rect.top + 'px';

        // Esperar animación
        await sleep(duration);

        // Remover elemento temporal
        tempPiece.remove();
    },

    /**
     * Efecto bounce al impactar
     */
    async bounceEffect(index, duration) {
        const square = this.squares[index];
        square.classList.add('bounce');

        await sleep(duration);

        square.classList.remove('bounce');
    },

    /**
     * Resalta casillas válidas
     */
    highlightValidMoves(indices) {
        indices.forEach(index => {
            this.squares[index].classList.add('valid-move');
        });
    },

    /**
     * Limpia resaltados
     */
    clearHighlights() {
        this.squares.forEach(square => {
            square.classList.remove('valid-move', 'invalid-move', 'selected');
        });
    },

    /**
     * Resalta línea ganadora
     */
    async highlightWinningLine(lineIndices) {
        for (let index of lineIndices) {
            this.squares[index].classList.add('winning-square');
        }

        // Animación pulsante
        // (CSS se encarga con keyframes)
    }
};
```

---

### 5.2 CSS Estructura

**Archivo:** `chessfive-style.css`

```css
/**
 * ============================================
 * CHESSFIVE STYLES
 * ============================================
 */

/* Tablero principal */
#chessboard {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    gap: 2px;
    width: min(90vw, 600px);
    height: min(90vw, 600px);
    margin: 2rem auto;
    padding: 25px 20px;
    background: rgba(10, 10, 15, 0.8);
    border: 2px solid var(--neon-cyan);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    position: relative;
}

/* Casillas */
.square {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    cursor: pointer;
    transition: all 0.2s ease;
}

.square.light {
    background: rgba(255, 255, 255, 0.1);
}

.square.dark {
    background: rgba(0, 0, 0, 0.3);
}

.square:hover {
    background: rgba(0, 255, 255, 0.2);
    box-shadow: inset 0 0 15px rgba(0, 255, 255, 0.5);
}

/* Piezas */
.piece {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s ease;
    filter: drop-shadow(0 0 8px currentColor);
}

.piece-cyan {
    color: var(--neon-cyan);
}

.piece-magenta {
    color: var(--neon-magenta);
}

.piece:hover {
    transform: scale(1.1);
}

/* Estados de casillas */
.square.selected {
    background: rgba(255, 255, 0, 0.3) !important;
    box-shadow: inset 0 0 20px rgba(255, 255, 0, 0.6);
}

.square.valid-move {
    background: rgba(0, 255, 128, 0.3) !important;
    cursor: pointer;
}

.square.valid-move::after {
    content: '';
    position: absolute;
    width: 30%;
    height: 30%;
    background: rgba(0, 255, 128, 0.6);
    border-radius: 50%;
}

.square.winning-square {
    background: linear-gradient(45deg, #ffff00, #ff8000) !important;
    animation: winning-pulse 1s ease-in-out infinite;
}

/* Animaciones */
@keyframes winning-pulse {
    0%, 100% {
        box-shadow: inset 0 0 30px rgba(255, 215, 0, 1);
    }
    50% {
        box-shadow: inset 0 0 50px rgba(255, 215, 0, 0.5);
    }
}

.square.bounce {
    animation: bounce 0.2s ease;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

/* Responsive */
@media (max-width: 768px) {
    #chessboard {
        padding: 20px 15px;
        width: 95vw;
        height: 95vw;
    }

    .piece {
        font-size: 2rem;
    }
}
```

---

## 6. SISTEMA DE AUDIO

**Archivo:** `sound-manager.js`

```javascript
/**
 * ============================================
 * SOUND MANAGER
 * ============================================
 * Genera sonidos usando Web Audio API
 */

export const SoundManager = {

    audioContext: null,
    enabled: true,
    volume: 0.5,

    /**
     * Inicializa Web Audio API
     */
    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.loadSettings();
    },

    /**
     * Carga configuración desde localStorage
     */
    loadSettings() {
        const settings = localStorage.getItem('chessfive-audio');
        if (settings) {
            const { enabled, volume } = JSON.parse(settings);
            this.enabled = enabled;
            this.volume = volume;
        }
    },

    /**
     * Reproduce sonido de drop
     */
    playDrop(pieceType) {
        if (!this.enabled) return;

        const frequency = pieceType === 'rook' || pieceType === 'queen' ? 150 : 200;
        this.playTone(frequency, 0.1, 'sine');
    },

    /**
     * Reproduce sonido de movimiento
     */
    playMove() {
        if (!this.enabled) return;

        this.playTone(300, 0.08, 'triangle');
    },

    /**
     * Reproduce sonido de selección
     */
    playSelect() {
        if (!this.enabled) return;

        this.playTone(400, 0.05, 'square');
    },

    /**
     * Reproduce sonido de error
     */
    playError() {
        if (!this.enabled) return;

        this.playTone(100, 0.15, 'sawtooth');
    },

    /**
     * Reproduce sonido de victoria (arpeggio)
     */
    playVictory() {
        if (!this.enabled) return;

        const notes = [261, 329, 392, 523]; // C-E-G-C
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'sine');
            }, i * 150);
        });
    },

    /**
     * Genera un tono sintético
     */
    playTone(frequency, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    /**
     * Toggle sonido on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();
    },

    /**
     * Guarda configuración
     */
    saveSettings() {
        localStorage.setItem('chessfive-audio', JSON.stringify({
            enabled: this.enabled,
            volume: this.volume
        }));
    }
};
```

---

## 7. GESTIÓN DE ESTADO

### 7.1 Patrón de Flujo de Datos

```
User Action (Click)
    ↓
Event Handler (UIController)
    ↓
Validation (Phase-specific)
    ↓
State Update (GameState)
    ↓
Side Effects (Sound, Animation)
    ↓
UI Update (BoardRenderer, PanelController)
    ↓
Check Win Condition
    ↓
Next Player / End Game
```

### 7.2 Persistencia

**localStorage Schema:**

```javascript
{
    // Configuración
    'chessfive-settings': {
        soundEnabled: true,
        volume: 0.5,
        showTutorial: true,
        theme: 'neon' // futuro
    },

    // Estadísticas
    'chessfive-stats': {
        gamesPlayed: 0,
        cyanWins: 0,
        magentaWins: 0,
        draws: 0,
        longestGame: 0,
        fastestWin: Infinity
    },

    // Última partida (opcional - para resume game)
    'chessfive-last-game': {
        gameState: { /* estado completo */ },
        timestamp: Date
    }
}
```

---

## 8. FLUJO DE EVENTOS

### 8.1 Inicialización

```
1. DOM Content Loaded
    ↓
2. Import all modules
    ↓
3. Initialize GameState
    ↓
4. Initialize BoardRenderer
    ↓
5. Initialize SoundManager
    ↓
6. Initialize UIController
    ↓
7. Attach event listeners
    ↓
8. Show welcome screen / tutorial
    ↓
9. Wait for "Start Game"
```

### 8.2 Gravity Phase Loop

```
1. Player clicks column
    ↓
2. Validate column not full
    ↓
3. Calculate drop position
    ↓
4. Get next piece from available
    ↓
5. Animate drop
    ↓
6. Update GameState
    ↓
7. Play sound
    ↓
8. Update UI (counter, board)
    ↓
9. Check if phase complete
    ↓
10a. If yes → Transition to Chess
10b. If no → Switch player, repeat
```

### 8.3 Chess Phase Loop

```
1. Player clicks own piece
    ↓
2. Highlight piece + valid moves
    ↓
3. Player clicks destination
    ↓
4. Validate move
    ↓
5. Animate movement
    ↓
6. Update GameState
    ↓
7. Check for 5-in-line
    ↓
8a. If win → Victory screen
8b. If no win → Switch player, repeat
```

---

## 9. OPTIMIZACIONES

### 9.1 Renderizado

- **Usar requestAnimationFrame** para animaciones suaves
- **Evitar layout thrashing:** batch DOM reads/writes
- **CSS transforms** en lugar de top/left para animaciones
- **will-change** en elementos que se animan frecuentemente

### 9.2 Detección de Victoria

- **Early exit:** Si no hay 5 piezas colocadas, skip check
- **Solo verificar desde última pieza movida** (no escanear todo el tablero)
- **Cache de líneas detectadas** (opcional)

### 9.3 Memoria

- **Reuso de objetos:** Pool de piezas en lugar de crear/destruir
- **Weak references** para event listeners
- **Cleanup** al destruir partida

---

## 10. TESTING

### 10.1 Unit Tests (Futuro)

```javascript
// Ejemplo con Jest
describe('WinDetection', () => {
    test('detecta 5 horizontal', () => {
        // Setup board
        const board = createMockBoard([
            [0, 'cyan'],
            [1, 'cyan'],
            [2, 'cyan'],
            [3, 'cyan'],
            [4, 'cyan']
        ]);

        const result = WinDetection.checkWin(2, 'cyan');

        expect(result.win).toBe(true);
        expect(result.line).toEqual([0, 1, 2, 3, 4]);
    });
});
```

### 10.2 Manual Testing Checklist

- [ ] Gravity: Piezas caen correctamente
- [ ] Gravity: Columna llena muestra error
- [ ] Chess: Caballo puede saltar
- [ ] Chess: Torre bloqueada por piezas
- [ ] Chess: No se puede mover pieza del rival
- [ ] Win: Detecta 5 horizontal
- [ ] Win: Detecta 5 vertical
- [ ] Win: Detecta 5 diagonal ↗
- [ ] Win: Detecta 5 diagonal ↘
- [ ] Win: No detecta 4 como victoria
- [ ] Sound: Todos los efectos funcionan
- [ ] UI: Responsive en móvil
- [ ] UI: Funciona sin coordenadas taxi

---

## 11. DEPLOYMENT

### 11.1 Build Process

```bash
# 1. Minificar CSS
npx csso chessfive-style.css -o chessfive-style.min.css

# 2. Minificar JS (opcional, solo en producción)
npx terser main.js -o main.min.js

# 3. Copiar archivos a carpeta dist/
cp index.html dist/
cp -r assets/ dist/assets/

# 4. Subir a Hostinger vía FTP
```

### 11.2 Hosting en Hostinger

- Subir carpeta `games/chessfive/` completa
- Verificar permisos: 644 para archivos, 755 para carpetas
- Probar en: `https://chessarcade.com.ar/games/chessfive/index.html`
- Actualizar card en homepage para quitar "PRÓXIMAMENTE"

---

## 12. ROADMAP TÉCNICO

### v1.0 - MVP
- ✅ Arquitectura modular completa
- ✅ Gravity + Chess phases
- ✅ Win detection
- ✅ Sonidos básicos
- ✅ UI responsive

### v1.1 - Polish
- ✅ Particle system mejorado
- ✅ Tutorial interactivo
- ✅ Undo system
- ✅ Historial de movimientos

### v2.0 - IA
- ✅ Minimax algorithm
- ✅ Heurística de evaluación
- ✅ 3 niveles de dificultad

### v3.0 - Online
- ✅ WebSocket server (Node.js + Socket.io)
- ✅ Matchmaking
- ✅ Database (PostgreSQL)
- ✅ User authentication

---

**FIN DEL DOCUMENTO TÉCNICO**

---

**Última actualización:** 20 de Octubre 2025
**Autor:** ChessArcade Team
**Próximo paso:** Implementación de `main.js` y setup inicial
