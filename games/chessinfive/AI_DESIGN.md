# 🤖 ChessInFive AI Opponent - Design Document

## 📋 Overview

Diseño de un oponente de IA para ChessInFive que funcione en ambas fases del juego. La IA debe ser **simple pero efectiva**, proporcionando un desafío razonable sin ser invencible.

---

## 🎯 Objetivos

1. **Simple**: Código limpio y mantenible (~300-400 líneas)
2. **Efectivo**: Proporciona desafío real al jugador
3. **Rápido**: Respuesta en <500ms para buena UX
4. **Escalable**: Fácil agregar niveles de dificultad después

---

## 🎮 Dos Fases = Dos Estrategias

### Fase 1: Gravity Phase (Drop Phase)
**Inspiración**: Connect Four + Posicionamiento estratégico

**Objetivo de la IA**:
- Colocar piezas en posiciones que sean ventajosas para la Fase 2
- Bloquear formaciones peligrosas del oponente durante el drop

**Estrategia**:
```javascript
evaluateDropPosition(col, pieceType) {
    score = 0

    // 1. ¿Esta columna ayuda a formar 5 en línea?
    score += countPotentialLines(col, AI_PLAYER)

    // 2. ¿Bloquea una línea peligrosa del oponente?
    score += blockOpponentLines(col, HUMAN_PLAYER)

    // 3. ¿La pieza tendrá movilidad en Fase 2?
    score += evaluateMobility(col, pieceType)

    // 4. Preferir centro del tablero
    score += centerBonus(col)

    return score
}
```

**Decisión de qué pieza dropear**:
```javascript
choosePieceType() {
    // Prioridad:
    // 1. Queen primero (máxima movilidad en Fase 2)
    // 2. Rook/Bishop (movilidad lineal)
    // 3. Knight (útil pero más limitado en Fase 2)
    // 4. King al final (menos móvil)
}
```

---

### Fase 2: Chess Move Phase
**Inspiración**: Gomoku + Movimiento restringido de ajedrez

Esta es la fase MÁS IMPORTANTE para la IA. Aquí aplicamos estrategia tipo Gomoku.

**Conceptos Clave de Gomoku**:

1. **Threat Detection (Detección de Amenazas)**
   - **Cinco abierto** (Open Five): ⚪⚪⚪⚪⚪ = VICTORIA INMEDIATA
   - **Cuatro abierto** (Open Four): _⚪⚪⚪⚪_ = AMENAZA MORTAL (debe bloquearse)
   - **Cuatro semi-abierto**: ⚪⚪⚪⚪_ = Peligroso
   - **Tres abierto** (Open Three): _⚪⚪⚪_ = Construir hacia cuatro
   - **Dos abierto** (Open Two): _⚪⚪_ = Potencial

2. **Forking (Horquillas)**
   - Crear DOS amenazas de 4 en línea al mismo tiempo
   - Oponente solo puede bloquear UNA → Victoria garantizada

3. **VCT (Victory by Continuous Threats)**
   - Secuencia forzada de amenazas que llevan a victoria
   - Similar a "mate forzado" en ajedrez

**Estrategia de Evaluación**:

```javascript
evaluateMove(fromPos, toPos) {
    score = 0

    // FASE 1: ¿Gano inmediatamente?
    if (createsWinningLine(toPos)) {
        return INFINITY  // ¡Jugar este movimiento!
    }

    // FASE 2: ¿Debo bloquear victoria del oponente?
    if (opponentHasWinningThreat()) {
        if (blocksWinningThreat(toPos)) {
            return INFINITY - 1  // Bloqueo obligatorio
        } else {
            return -INFINITY  // No sirve, vamos a perder
        }
    }

    // FASE 3: Evaluación heurística
    score += evaluateThreats(toPos, AI_PLAYER)
    score += evaluateMobility(toPos)
    score += evaluateCenter(toPos)
    score -= evaluateThreats(toPos, HUMAN_PLAYER)  // Penalizar mover y dejar amenazas

    return score
}
```

**Evaluación de Amenazas (Núcleo del Sistema)**:

```javascript
evaluateThreats(position, player) {
    threats = {
        five: 0,      // Líneas de 5 (victoria)
        openFour: 0,  // Cuatro abierto (_XXXX_)
        four: 0,      // Cuatro (_XXXX o XXXX_)
        openThree: 0, // Tres abierto (_XXX_)
        three: 0,     // Tres (_XXX o XXX_)
        openTwo: 0    // Dos abierto (_XX_)
    }

    // Escanear 8 direcciones desde position
    for direction in [horizontal, vertical, diagonal1, diagonal2]:
        pattern = getLinePattern(position, direction, player)
        classifyPattern(pattern, threats)

    // Scoring (valores inspirados en Gomoku)
    score = 0
    score += threats.five * 100000        // Victoria
    score += threats.openFour * 10000     // Amenaza mortal
    score += threats.four * 1000          // Amenaza fuerte
    score += threats.openThree * 500      // Construir
    score += threats.three * 100
    score += threats.openTwo * 10

    return score
}
```

**Pattern Matching (Reconocimiento de Patrones)**:

```javascript
function classifyPattern(line, threats) {
    // line es un string como "___XX_XX__" donde:
    // X = mi pieza
    // O = pieza enemiga
    // _ = vacío

    // Regex patterns (inspirado en motores de Gomoku)
    patterns = {
        five:      /XXXXX/,
        openFour:  /_XXXX_/,
        four:      /XXXX_|_XXXX/,
        openThree: /_XXX_/,
        three:     /XXX_|_XXX/,
        openTwo:   /_XX_/
    }

    for (patternType, regex) in patterns:
        if (regex.test(line)):
            threats[patternType]++
}
```

---

## 🧠 Algoritmo de Decisión (Minimax Simplificado)

No necesitamos un Minimax completo. Para ChessInFive, una evaluación de 1 nivel es suficiente:

```javascript
function findBestMove() {
    allPossibleMoves = getAllLegalMoves(AI_PLAYER)

    bestMove = null
    bestScore = -Infinity

    for move in allPossibleMoves:
        // Simular el movimiento
        makeMove(move)

        // Evaluar posición resultante
        score = evaluatePosition()

        // Deshacer simulación
        undoMove(move)

        // Actualizar mejor movimiento
        if (score > bestScore):
            bestScore = score
            bestMove = move

    return bestMove
}
```

**Optimización**: En Fase 2, limitar búsqueda a:
1. Movimientos que crean amenazas (extend existing lines)
2. Movimientos que bloquean amenazas del oponente
3. Movimientos de piezas cercanas a líneas existentes

---

## 🎯 Priority System (Sistema de Prioridades)

En cada turno, la IA ejecuta en orden:

### Gravity Phase:
```
1. ¿Puedo formar 5 en línea con este drop? → DROP
2. ¿El oponente forma 5 en su próximo drop? → BLOCK
3. ¿Puedo crear un "cuatro" con este drop? → DROP
4. ¿Dónde tengo más movilidad para Fase 2? → DROP mejhor opción
```

### Chess Phase:
```
1. ¿Puedo ganar en 1 movimiento? → MOVER
2. ¿El oponente gana en su próximo turno? → BLOQUEAR
3. ¿Puedo crear doble amenaza (fork)? → MOVER
4. ¿Puedo crear amenaza de 4 en línea? → MOVER
5. ¿Puedo crear amenaza de 3 en línea? → MOVER
6. ¿Puedo mejorar mi posición? → MOVER mejor opción
```

---

## 📊 Scoring Weights (Valores de Evaluación)

Inspirado en motores de Gomoku profesionales:

```javascript
const WEIGHTS = {
    // Gravity Phase
    POTENTIAL_FIVE: 50,
    BLOCK_OPPONENT_FIVE: 100,
    MOBILITY: 20,
    CENTER_BONUS: 10,

    // Chess Phase (valores Gomoku)
    WIN_NOW: 1000000,
    BLOCK_OPPONENT_WIN: 500000,
    OPEN_FOUR: 50000,       // _XXXX_
    FOUR: 10000,            // XXXX_ o _XXXX
    OPEN_THREE: 5000,       // _XXX_
    THREE: 1000,            // XXX_ o _XXX
    OPEN_TWO: 500,          // _XX_
    TWO: 100,               // XX_ o _XX

    // Modifiers
    MOBILITY_BONUS: 50,     // Más casillas accesibles = mejor
    CENTER_BONUS: 20,       // Piezas en centro = mejor
    OPPONENT_THREAT: -200   // Penalizar dejar amenazas abiertas
}
```

---

## 🚀 Implementation Plan

### Fase 1: Core AI Module
**Archivo**: `games/chessinfive/js/ai-player.js`

```javascript
const ChessInFiveAI = {
    // Config
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    thinkingTime: 500,    // ms (simular "pensamiento")

    // Main entry point
    async makeMove(gameState) {
        // Add thinking delay for UX
        await delay(this.thinkingTime)

        if (gameState.phase === 'gravity') {
            return this.makeGravityMove(gameState)
        } else {
            return this.makeChessMove(gameState)
        }
    },

    // Gravity Phase AI
    makeGravityMove(state) {
        // ...
    },

    // Chess Phase AI
    makeChessMove(state) {
        // ...
    },

    // Evaluation functions
    evaluatePosition(state, player) {
        // ...
    },

    // Pattern detection
    detectThreats(state, player) {
        // ...
    },

    // Line scanning
    scanLine(board, pos, direction, player) {
        // ...
    }
}
```

### Fase 2: Integration
**Modificar**: `games/chessinfive/js/main.js`

```javascript
// Add AI toggle
let vsAI = false;
let aiPlayer = 'magenta'; // AI plays as magenta

// Modify turn flow
async function handleTurn() {
    if (vsAI && GameState.currentPlayer === aiPlayer) {
        // AI's turn
        const aiMove = await ChessInFiveAI.makeMove(GameState)
        executeMove(aiMove)
    } else {
        // Human's turn (existing code)
    }
}
```

### Fase 3: UI Enhancements
**Agregar en index.html**:
- Toggle "vs AI" / "vs Human"
- Difficulty selector (futuro)
- "AI is thinking..." indicator

---

## 🧪 Testing Strategy

1. **Unit Tests**:
   - Pattern detection correcta
   - Threat evaluation precisa
   - Move generation completa

2. **Integration Tests**:
   - AI detecta victorias en 1 movimiento
   - AI bloquea victorias del oponente
   - AI crea amenazas progresivamente

3. **Playtesting**:
   - ¿Es divertido jugar contra la IA?
   - ¿Es muy fácil/difícil?
   - ¿Responde rápido?

---

## 📚 Referencias

**Gomoku AI Papers & Resources**:
- [Gomoku AI Wikipedia](https://en.wikipedia.org/wiki/Gomoku)
- [Threat-Space Search in Gomoku](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.92.2964)
- Pattern databases for Connect-5 games

**Similar Projects**:
- Gomoku.js implementations on GitHub
- Connect 4 AI with Alpha-Beta pruning
- Minimax tutorials for board games

---

## 🎯 Success Criteria

✅ IA funciona en ambas fases
✅ Detecta victorias y derrotas en 1 movimiento
✅ Crea amenazas progresivamente (2→3→4 en línea)
✅ Respuesta en <500ms
✅ Código <500 líneas, bien documentado
✅ Jugadores reportan que es "desafiante pero no frustrante"

---

## 🔮 Future Enhancements (v2.0)

1. **Difficulty Levels**:
   - Easy: Solo detecta victorias inmediatas
   - Medium: Evalúa amenazas de 3-4 en línea
   - Hard: Full threat detection + 2-ply search

2. **Opening Book**:
   - Database de aperturas óptimas para Gravity Phase

3. **Machine Learning**:
   - Neural network entrenada con partidas humanas
   - Reinforcement learning (self-play)

4. **Analytics**:
   - Heatmap de movimientos de IA
   - Win rate statistics

---

## ✅ Implemented Features (v1.0 - Production Ready)

### Core AI Features
✅ **Two-Phase AI Strategy** - Separate evaluation for Gravity and Chess phases
✅ **Gomoku-Inspired Threat Detection** - Pattern matching for 2-5 in-a-row formations
✅ **Unstoppable Threat Detection** - Recognizes 4-in-a-row with multiple open ends
✅ **Enhanced Blocking** - Detects and blocks 3-in-a-row and 4-in-a-row threats in Phase 1
✅ **Per-Player AI Toggle** - Individual AI controls for Cyan and Magenta players
✅ **AI vs AI Mode** - Two AIs can play against each other automatically
✅ **Mid-Game AI Switching** - Enable/disable AI during active gameplay

### UX Enhancements
✅ **Last Move Highlighting** - Visual feedback showing piece origin (subtle) and destination (brighter)
✅ **Winning Line Highlight** - Golden glow animation on winning 5-in-a-row
✅ **Closeable Victory Modal** - X button allows game analysis after victory
✅ **AI Thinking Indicator** - Visual feedback during AI decision-making
✅ **Auto-Piece Selection** - Smooth piece selector updates after each move

### Technical Improvements
✅ **Race Condition Fix** - Resolved AI vs AI blocking in Phase 2 with setTimeout delays
✅ **Null-Safe UI Updates** - Defensive programming for DOM element access
✅ **Persistent Win Highlights** - Winning lines remain visible during game analysis

### Bug Fixes
- Fixed: AI not detecting 3-in-a-row threats in Gravity Phase
- Fixed: Winning line not highlighting in Phase 1 (gameOver flag check)
- Fixed: AI blocking when both players are AI-controlled
- Fixed: SELECT PIECE panel sync issues after AI moves
- Fixed: Modal close button positioning (relative positioning)

---

## 🔮 Planned Features (v2.0)

### Priority: High
🎯 **Game Notation System** - Record moves in algebraic notation
🎯 **Game Replay** - Replay past games move-by-move with controls
🎯 **Smooth Animations** - Piece movement transitions (CSS animations)

### Priority: Medium
- **Difficulty Levels** - Easy, Medium, Hard AI settings
- **Game History** - Save games to localStorage
- **Undo/Redo** - Take back moves during gameplay
- **Sound Effects** - Enhanced audio feedback

### Priority: Low
- **Opening Book** - Pre-computed optimal Gravity Phase drops
- **AI Personality** - Aggressive vs Defensive play styles
- **Statistics Dashboard** - Win/loss records, average game time
- **Online Multiplayer** - WebSocket-based real-time play

---

*Documento creado: 2025-11-01*
*Última actualización: 2025-11-01*
*Versión: 1.0 - Production Ready*
*Autor: Claude & Clau*
