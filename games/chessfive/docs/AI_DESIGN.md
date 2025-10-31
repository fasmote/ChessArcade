# ChessFive - Diseño de Inteligencia Artificial

## 📋 Resumen

Este documento describe el diseño del sistema de IA para ChessFive, que permitirá:
1. Jugar vs CPU (single-player)
2. Diferentes niveles de dificultad
3. Base para futuro multiplayer online
4. Modo AI vs AI (testing/demo)

---

## 🎯 Objetivos

### Versión 1.0 - IA Básica
- ✅ Modo LOCAL_2P (actual, 2 humanos)
- 🔲 Modo LOCAL_VS_AI (1 humano vs CPU)
- 🔲 3 niveles de dificultad:
  - **Easy**: Movimientos aleatorios inteligentes
  - **Medium**: Minimax profundidad 2-3
  - **Hard**: Minimax profundidad 4-5 + Alpha-Beta Pruning

### Versión 2.0 - IA Avanzada
- 🔲 Apertura book (primeras 8 jugadas optimizadas)
- 🔲 Evaluación posicional avanzada
- 🔲 Detección de patrones de 3-4 en línea

### Versión 3.0 - Multiplayer
- 🔲 Modo ONLINE_2P (WebSockets)
- 🔲 Modo AI_VS_AI (demo)

---

## 🧠 Algoritmo Minimax

### Concepto

Minimax es un algoritmo de decisión para juegos de suma cero que simula todas las jugadas posibles del oponente y propias para elegir la mejor.

**Pseudocódigo básico:**
```
función minimax(posición, profundidad, esMaximizador):
    si profundidad == 0 o juego terminado:
        retornar evaluación(posición)

    si esMaximizador:
        mejorValor = -infinito
        para cada movimiento posible:
            valor = minimax(aplicarMovimiento, profundidad-1, false)
            mejorValor = max(mejorValor, valor)
        retornar mejorValor

    sino:
        mejorValor = +infinito
        para cada movimiento posible:
            valor = minimax(aplicarMovimiento, profundidad-1, true)
            mejorValor = min(mejorValor, valor)
        retornar mejorValor
```

### Aplicación a ChessFive

**Complejidad del juego:**
- **Fase Gravity**: 8 columnas × 8 piezas por jugador = ~64 posibilidades por turno
- **Fase Chess**: Promedio de 10-15 movimientos válidos por pieza × 8 piezas = ~100-120 posibilidades

**Profundidad sugerida:**
- Easy: 1-2 niveles (inmediato)
- Medium: 3-4 niveles (~1-2 segundos)
- Hard: 5-6 niveles (~5-10 segundos)

---

## 📐 Función de Evaluación

La función de evaluación es **crítica** para que la IA tome buenas decisiones.

### Factores a Evaluar

#### 1. **Detección de Líneas** (peso: 1000)
```javascript
// Puntos por cantidad de piezas alineadas
const lineScores = {
    2: 10,      // 2 en línea
    3: 100,     // 3 en línea (amenaza)
    4: 1000,    // 4 en línea (peligro crítico)
    5: 10000    // 5 en línea (victoria)
};
```

#### 2. **Control del Centro** (peso: 50)
```javascript
// Casillas centrales valen más
const centerBonus = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 3, 3, 3, 3, 2, 1],
    [1, 2, 3, 4, 4, 3, 2, 1],
    [1, 2, 3, 4, 4, 3, 2, 1],
    [1, 2, 3, 3, 3, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];
```

#### 3. **Movilidad** (peso: 30)
```javascript
// Cantidad de movimientos válidos disponibles
mobility = countValidMoves(player);
```

#### 4. **Bloqueo de Oponente** (peso: 500)
```javascript
// Detectar si el oponente tiene 3-4 en línea y bloquearlo
if (opponent has 4 in line) {
    blockBonus = 5000; // Prioridad máxima
}
```

#### 5. **Fase Gravity - Posicionamiento** (peso: 100)
```javascript
// En Gravity Phase, preferir columnas centrales
// Evitar columnas llenas
// Buscar crear amenazas múltiples
```

### Función de Evaluación Completa

```javascript
function evaluatePosition(board, player) {
    let score = 0;

    // 1. Evaluar líneas (más importante)
    score += evaluateLines(board, player) * 1000;

    // 2. Evaluar amenazas del oponente (crítico)
    score -= evaluateLines(board, opponent) * 1200; // Peso mayor

    // 3. Control del centro
    score += evaluateCenterControl(board, player) * 50;

    // 4. Movilidad
    score += countMobility(board, player) * 30;

    // 5. Bloqueo defensivo
    score += evaluateBlocking(board, player) * 500;

    return score;
}
```

---

## 🚀 Optimización: Alpha-Beta Pruning

**Problema:** Minimax explora TODAS las ramas del árbol (muy lento).

**Solución:** Alpha-Beta Pruning elimina ramas que no pueden mejorar el resultado.

### Pseudocódigo con Alpha-Beta

```javascript
function alphaBeta(position, depth, alpha, beta, isMaximizing) {
    if (depth == 0 || gameOver) {
        return evaluate(position);
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (move of possibleMoves) {
            eval = alphaBeta(applyMove(move), depth-1, alpha, beta, false);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);

            // PODA: Si beta <= alpha, no explorar más
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (move of possibleMoves) {
            eval = alphaBeta(applyMove(move), depth-1, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);

            // PODA: Si beta <= alpha, no explorar más
            if (beta <= alpha) break;
        }
        return minEval;
    }
}
```

**Mejora de rendimiento:** ~100x más rápido que Minimax puro.

---

## 🎮 Arquitectura de Módulos

### Estructura de Archivos

```
games/chessfive/js/
├── game-state.js           # Estado del juego
├── gravity-phase.js        # Fase gravedad
├── chess-phase.js          # Fase ajedrez
├── win-detection.js        # Detección de victoria
├── ui-controller.js        # UI
├── sound-manager.js        # Sonidos
├── main.js                 # Inicialización
│
├── ai/                     # NUEVO - Sistema de IA
│   ├── ai-player.js        # Controlador principal de IA
│   ├── minimax.js          # Algoritmo Minimax + Alpha-Beta
│   ├── evaluation.js       # Función de evaluación
│   ├── move-generator.js   # Generador de movimientos
│   ├── difficulty.js       # Configuración de dificultades
│   └── opening-book.js     # Libro de aperturas (v2.0)
│
└── modes/                  # NUEVO - Modos de juego
    ├── game-mode-manager.js  # Gestor de modos
    ├── local-2p.js           # Modo 2 jugadores local (actual)
    ├── local-vs-ai.js        # Modo vs IA
    ├── online-2p.js          # Modo online (futuro)
    └── ai-vs-ai.js           # Modo demo IA vs IA
```

### Módulo AIPlayer

```javascript
/**
 * AI PLAYER
 * Controlador principal de la IA
 */
class AIPlayer {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.config = DifficultyConfig[difficulty];
        this.thinkingTime = 500; // ms de "pensamiento" simulado
    }

    /**
     * Calcula el mejor movimiento
     */
    async getBestMove(gameState) {
        // Simular tiempo de pensamiento (UX)
        await this.delay(this.thinkingTime);

        if (gameState.phase === 'gravity') {
            return this.getBestGravityMove(gameState);
        } else {
            return this.getBestChessMove(gameState);
        }
    }

    /**
     * Mejor movimiento en fase Gravity
     */
    getBestGravityMove(gameState) {
        const validColumns = this.getValidColumns(gameState.board);

        if (this.difficulty === 'easy') {
            // Movimiento aleatorio
            return this.randomChoice(validColumns);
        }

        // Usar Minimax para Medium/Hard
        return Minimax.findBestMove(
            gameState,
            this.config.depth,
            this.config.useAlphaBeta
        );
    }

    /**
     * Mejor movimiento en fase Chess
     */
    getBestChessMove(gameState) {
        const allMoves = this.getAllPossibleMoves(gameState);

        if (this.difficulty === 'easy') {
            // Movimiento aleatorio con preferencia por amenazas
            return this.intelligentRandom(allMoves, gameState);
        }

        // Usar Minimax
        return Minimax.findBestMove(
            gameState,
            this.config.depth,
            this.config.useAlphaBeta
        );
    }

    /**
     * Movimiento aleatorio "inteligente"
     * Prioriza bloquear amenazas obvias
     */
    intelligentRandom(moves, gameState) {
        // Detectar si oponente tiene 4 en línea
        const blockingMoves = moves.filter(move =>
            this.blocksOpponentWin(move, gameState)
        );

        if (blockingMoves.length > 0) {
            return this.randomChoice(blockingMoves);
        }

        // Sino, movimiento aleatorio
        return this.randomChoice(moves);
    }
}
```

### Módulo Minimax

```javascript
/**
 * MINIMAX ALGORITHM
 * Implementación con Alpha-Beta Pruning
 */
const Minimax = {
    /**
     * Encuentra el mejor movimiento
     */
    findBestMove(gameState, depth, useAlphaBeta = true) {
        let bestMove = null;
        let bestValue = -Infinity;

        const moves = MoveGenerator.getAllMoves(gameState);

        for (const move of moves) {
            // Simular movimiento
            const newState = this.applyMove(gameState, move);

            // Evaluar con Minimax
            let value;
            if (useAlphaBeta) {
                value = this.alphaBeta(
                    newState,
                    depth - 1,
                    -Infinity,
                    Infinity,
                    false // Minimizar (turno del oponente)
                );
            } else {
                value = this.minimax(newState, depth - 1, false);
            }

            // Actualizar mejor movimiento
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }

            // Deshacer movimiento
            this.undoMove(gameState, move);
        }

        return bestMove;
    },

    /**
     * Minimax con Alpha-Beta Pruning
     */
    alphaBeta(state, depth, alpha, beta, isMaximizing) {
        // Caso base: profundidad 0 o juego terminado
        if (depth === 0 || this.isGameOver(state)) {
            return Evaluation.evaluate(state);
        }

        const moves = MoveGenerator.getAllMoves(state);

        if (isMaximizing) {
            let maxEval = -Infinity;

            for (const move of moves) {
                const newState = this.applyMove(state, move);
                const eval = this.alphaBeta(
                    newState,
                    depth - 1,
                    alpha,
                    beta,
                    false
                );
                this.undoMove(state, move);

                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);

                // Poda Alpha-Beta
                if (beta <= alpha) {
                    break; // Poda beta
                }
            }

            return maxEval;
        } else {
            let minEval = Infinity;

            for (const move of moves) {
                const newState = this.applyMove(state, move);
                const eval = this.alphaBeta(
                    newState,
                    depth - 1,
                    alpha,
                    beta,
                    true
                );
                this.undoMove(state, move);

                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);

                // Poda Alpha-Beta
                if (beta <= alpha) {
                    break; // Poda alpha
                }
            }

            return minEval;
        }
    },

    /**
     * Minimax básico (sin poda)
     */
    minimax(state, depth, isMaximizing) {
        if (depth === 0 || this.isGameOver(state)) {
            return Evaluation.evaluate(state);
        }

        const moves = MoveGenerator.getAllMoves(state);

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const newState = this.applyMove(state, move);
                const eval = this.minimax(newState, depth - 1, false);
                this.undoMove(state, move);
                maxEval = Math.max(maxEval, eval);
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const newState = this.applyMove(state, move);
                const eval = this.minimax(newState, depth - 1, true);
                this.undoMove(state, move);
                minEval = Math.min(minEval, eval);
            }
            return minEval;
        }
    }
};
```

### Módulo Evaluation

```javascript
/**
 * EVALUATION FUNCTION
 * Evalúa qué tan buena es una posición para el jugador
 */
const Evaluation = {
    evaluate(gameState) {
        const player = 'magenta'; // IA juega con magenta
        const opponent = 'cyan';

        let score = 0;

        // 1. Evaluar líneas propias (OFENSIVA)
        score += this.evaluateLines(gameState, player) * 1000;

        // 2. Evaluar líneas del oponente (DEFENSIVA)
        score -= this.evaluateLines(gameState, opponent) * 1200;

        // 3. Control del centro
        score += this.evaluateCenterControl(gameState, player) * 50;

        // 4. Movilidad (cantidad de movimientos válidos)
        score += this.evaluateMobility(gameState, player) * 30;

        // 5. Ventaja material (piezas en el tablero)
        score += this.evaluateMaterial(gameState, player) * 10;

        return score;
    },

    /**
     * Evaluar líneas (2, 3, 4, 5 en línea)
     */
    evaluateLines(gameState, player) {
        let score = 0;
        const lineScores = {
            2: 10,
            3: 100,
            4: 1000,
            5: 10000
        };

        // Escanear horizontal, vertical, diagonales
        const lines = this.getAllLines(gameState.board);

        for (const line of lines) {
            const count = this.countConsecutive(line, player);
            if (count >= 2) {
                score += lineScores[count] || 0;
            }
        }

        return score;
    },

    /**
     * Evaluar control del centro
     */
    evaluateCenterControl(gameState, player) {
        let score = 0;
        const centerBonus = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 3, 3, 3, 3, 2, 1],
            [1, 2, 3, 4, 4, 3, 2, 1],
            [1, 2, 3, 4, 4, 3, 2, 1],
            [1, 2, 3, 3, 3, 3, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = gameState.board[row][col];
                if (piece && piece.player === player) {
                    score += centerBonus[row][col];
                }
            }
        }

        return score;
    },

    /**
     * Evaluar movilidad
     */
    evaluateMobility(gameState, player) {
        return MoveGenerator.countValidMoves(gameState, player);
    }
};
```

---

## 🎚️ Configuración de Dificultades

```javascript
/**
 * DIFFICULTY CONFIG
 */
const DifficultyConfig = {
    easy: {
        depth: 1,
        useAlphaBeta: false,
        thinkingTime: 500,
        description: 'Random moves with basic threat detection'
    },
    medium: {
        depth: 3,
        useAlphaBeta: true,
        thinkingTime: 1000,
        description: 'Minimax depth 3 with Alpha-Beta'
    },
    hard: {
        depth: 5,
        useAlphaBeta: true,
        thinkingTime: 2000,
        description: 'Minimax depth 5 with Alpha-Beta + advanced evaluation'
    }
};
```

---

## 🔮 Futuro: Multiplayer Online

### Arquitectura para Online 2P

```javascript
/**
 * ONLINE MULTIPLAYER
 * Usando WebSockets (Socket.io)
 */

// Backend (Node.js + Socket.io)
io.on('connection', (socket) => {
    socket.on('make-move', (move) => {
        // Validar movimiento en servidor
        if (isValidMove(move)) {
            // Broadcast a todos los jugadores en la partida
            io.to(gameRoomId).emit('move-made', move);
        }
    });
});

// Frontend
socket.on('move-made', (move) => {
    // Aplicar movimiento recibido
    GameState.applyMove(move);
    UIController.updateBoard();
});
```

---

## 📊 Comparación de Complejidad

| Juego | Factor de Ramificación | Profundidad Promedio | Complejidad |
|-------|------------------------|----------------------|-------------|
| Tic-Tac-Toe | 3-5 | 9 | Baja (resuelta) |
| Connect Four | 7 | 42 | Media |
| **ChessFive** | **50-100** | **30-40** | **Media-Alta** |
| Ajedrez | 35 | 80 | Muy Alta |
| Go | 250 | 150 | Extrema |

ChessFive está entre Connect Four y Ajedrez en complejidad.

---

## 🧪 Testing de IA

### Casos de Prueba

1. **Test: Bloqueo de victoria inmediata**
   - Oponente tiene 4 en línea
   - IA debe bloquear en el único movimiento posible

2. **Test: Victoria inmediata**
   - IA tiene 4 en línea
   - IA debe completar 5 en línea

3. **Test: Crear amenaza doble**
   - IA debe crear 2 amenazas simultáneas (fork)

4. **Test: Profundidad de cálculo**
   - Medir tiempo de cálculo para profundidades 1-6

5. **Test: Apertura inteligente**
   - En Gravity Phase, preferir columnas centrales

---

## 📝 Próximos Pasos

### Fase 1: Implementación Básica (1-2 semanas)
- [ ] Crear módulo `ai-player.js`
- [ ] Implementar Minimax básico
- [ ] Función de evaluación simple
- [ ] Modo Easy (random inteligente)

### Fase 2: Optimización (1 semana)
- [ ] Implementar Alpha-Beta Pruning
- [ ] Modo Medium (depth 3)
- [ ] Modo Hard (depth 5)
- [ ] UI para seleccionar dificultad

### Fase 3: Mejoras (2 semanas)
- [ ] Opening book para Gravity Phase
- [ ] Evaluación posicional avanzada
- [ ] Detección de patrones
- [ ] Modo AI vs AI (demo)

### Fase 4: Multiplayer (4-6 semanas)
- [ ] Backend Node.js + Socket.io
- [ ] Rooms/Matchmaking
- [ ] Modo Online 2P
- [ ] Sistema de ranking

---

**Autor:** Claude Code
**Fecha:** 25 de Octubre 2025
**Versión:** 1.0
