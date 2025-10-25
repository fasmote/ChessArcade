# ChessFive - Bug Fixes Documentation

Este documento registra los problemas encontrados durante las pruebas y cómo se resolvieron.

---

## Bug #1: Ghost Pieces Duplicadas Permanentes

### 📅 Fecha
25 de Octubre 2025

### 🐛 Descripción del Problema
Al jugar múltiples partidas consecutivas (usando NEW GAME), aparecían piezas "fantasma" superpuestas con las piezas reales en el tablero. Las ghost pieces (preview de hover) no se estaban eliminando correctamente antes de renderizar las piezas reales.

**Evidencia:**
- Screenshot: `cf_06.png` - Muestra una torre cyan duplicada (ghost + real)
- **Síntoma:** Las ghost pieces quedaban permanentemente en el tablero después de colocar una pieza

### 🔍 Causa Raíz
El método `renderPiece()` en `board-renderer.js` solo eliminaba **una** pieza existente usando `querySelector('.piece')`, pero cuando había múltiples elementos con clase `.piece` (incluyendo ghosts), solo eliminaba el primero.

**Código problemático:**
```javascript
// board-renderer.js línea 67-75 (versión anterior)
renderPiece(row, col, player, type, animate = false) {
    const square = this.getSquare(row, col);
    if (!square) return;

    // Remove existing piece (SOLO UNA!)
    const existingPiece = square.querySelector('.piece');
    if (existingPiece) {
        existingPiece.remove();
    }
    // ...
}
```

### ✅ Solución Implementada

**1. Cambiar `querySelector` a `querySelectorAll`** en `renderPiece()`:
```javascript
// board-renderer.js línea 71-73 (nueva versión)
// Remove ALL existing pieces (including ghosts)
const existingPieces = square.querySelectorAll('.piece');
existingPieces.forEach(p => p.remove());
```

**2. Limpiar ghosts explícitamente** en `renderBoard()`:
```javascript
// board-renderer.js línea 104-105 (nueva versión)
renderBoard() {
    // Clear all pieces AND ghosts
    this.removeGhosts();
    // ...
}
```

### 📊 Resultado
- ✅ Las ghost pieces ya no quedan en el tablero
- ✅ Solo se muestra la pieza real después de colocarla
- ✅ El preview funciona correctamente sin dejar residuos

---

## Bug #2: Turno Incorrecto al Iniciar Chess Phase

### 📅 Fecha
25 de Octubre 2025

### 🐛 Descripción del Problema
Al terminar la fase de gravedad (después de colocar las 16 piezas), el turno en la fase de ajedrez no siempre empezaba con el jugador Cyan.

**Comportamiento esperado:**
- Fase Gravity: Cyan coloca pieza → Magenta coloca pieza → ... (alternando)
- Al terminar Gravity Phase (16 piezas): Magenta coloca la última pieza
- **Fase Chess SIEMPRE debe empezar con Cyan**

**Comportamiento real:**
- Si Magenta colocaba la última pieza en Gravity Phase, Magenta jugaba primero en Chess Phase ❌

**Evidencia:**
- Screenshot: `cf_07.png` - Console log muestra "Turn: magenta" al inicio de Chess Phase
- Log: `084_chessfive.log` - Confirma que Magenta juega primero incorrectamente

### 🔍 Causa Raíz
En `gravity-phase.js`, cuando se detectaba que la fase de gravedad estaba completa, se hacía `return` sin cambiar de jugador:

```javascript
// gravity-phase.js línea 86-90 (versión anterior)
if (GameState.isGravityPhaseComplete()) {
    setTimeout(() => {
        this.transitionToChessPhase();
    }, 1000);
    return; // ← Sale aquí sin cambiar turno
}

// Switch player (esta línea nunca se ejecutaba)
GameState.switchPlayer();
```

Luego, en `transitionToChessPhase()`, NO se establecía quién debería jugar primero, manteniendo el jugador actual (Magenta si colocó la última pieza).

### ✅ Solución Implementada

Modificar `transitionToChessPhase()` para **forzar que Cyan siempre empiece** la fase de ajedrez:

```javascript
// gravity-phase.js línea 136-152 (nueva versión)
transitionToChessPhase() {
    console.log('♟️ Transitioning to Chess Phase...');

    GameState.switchToChessPhase();

    // ALWAYS start chess phase with Cyan player
    GameState.currentPlayer = 'cyan';

    UIController.updatePhaseIndicator();
    UIController.updateTurnIndicator(); // ← Actualizar UI con turno correcto
    BoardRenderer.clearHighlights();

    SoundManager.play('phase_change');

    ChessPhase.init();
}
```

### 📊 Resultado
- ✅ Cyan siempre juega primero en Chess Phase
- ✅ El indicador de turno muestra "CYAN PLAYER" correctamente
- ✅ El orden de turnos es consistente y predecible

---

## Archivos Modificados

### Bug #1 (Ghost Pieces)
- `games/chessfive/js/board-renderer.js`
  - `renderPiece()`: Cambiar `querySelector` a `querySelectorAll`
  - `renderBoard()`: Agregar `removeGhosts()` antes de limpiar piezas

### Bug #2 (Orden de Turnos)
- `games/chessfive/js/gravity-phase.js`
  - `transitionToChessPhase()`: Forzar `currentPlayer = 'cyan'`
  - `transitionToChessPhase()`: Agregar `updateTurnIndicator()`

---

## Testing Realizado

### Casos de Prueba
1. ✅ Jugar 1 partida completa → Verificar que no hay ghosts
2. ✅ Jugar 3 partidas consecutivas → Verificar que no se acumulan ghosts
3. ✅ Completar Gravity Phase con Cyan última pieza → Cyan juega en Chess
4. ✅ Completar Gravity Phase con Magenta última pieza → Cyan juega en Chess
5. ✅ Verificar que el selector de piezas se oculta en Chess Phase
6. ✅ Verificar que el indicador de turno se actualiza correctamente

### Comandos Git
```bash
git add games/chessfive/js/board-renderer.js
git add games/chessfive/js/gravity-phase.js
git add games/chessfive/docs/BUGFIXES.md
git commit -m "fix(chessfive): Ghost pieces duplicadas y turno incorrecto"
```

---

## Lecciones Aprendidas

1. **Siempre usar `querySelectorAll` cuando puede haber múltiples elementos**
   - `querySelector` solo devuelve el primero, causando bugs sutiles

2. **Documentar el orden de turnos explícitamente**
   - No asumir que el estado se mantiene correctamente entre fases

3. **Limpiar estado visual en transiciones**
   - Ghost pieces, highlights, y otros efectos deben limpiarse explícitamente

4. **Testing de múltiples partidas es crítico**
   - Los bugs de acumulación solo aparecen en segunda/tercera partida

---

## Bug #3: Layout Desktop - Reorganización de Paneles

### 📅 Fecha
25 de Octubre 2025

### 🐛 Descripción del Problema
El layout inicial tenía el info-panel a la derecha del tablero, pero el usuario solicitó una reorganización específica según cf_13_desktop.png:
- **ARRIBA**: Solo Phase Indicator
- **MEDIO**: Cyan Player (izq) | Tablero (centro) | Magenta Player (der)
- **ABAJO**: Turn Indicator + Botones de control

Además, el SELECT PIECE debía estar dentro de cada panel de jugador, no centralizado.

**Evidencia:**
- Screenshot: `cf_13_desktop.png` - Muestra el layout deseado con flechas de colores

### ✅ Solución Implementada

**1. Reorganización HTML (games/chessfive/index.html):**
```html
<main class="game-container">
    <!-- Top Panel: Solo Phase Indicator -->
    <div class="top-panel">
        <div class="phase-indicator">...</div>
    </div>

    <!-- Middle Row: 3 columnas -->
    <div class="middle-row">
        <aside class="player-panel player-panel-left">
            <div class="player-info" id="playerCyan">...</div>
            <div class="piece-selector" id="pieceSelector">...</div>
        </aside>

        <div class="board-container">...</div>

        <aside class="player-panel player-panel-right">
            <div class="player-info" id="playerMagenta">...</div>
            <div class="piece-selector piece-selector-magenta">...</div>
        </aside>
    </div>

    <!-- Bottom Panel: Turn + Controls -->
    <div class="bottom-panel">
        <div class="turn-indicator">...</div>
        <div class="game-controls">...</div>
    </div>
</main>
```

**2. CSS Layout (games/chessfive/css/chessfive.css):**
```css
.game-container {
    display: flex;
    flex-direction: column; /* Vertical: top, middle, bottom */
    gap: 20px;
    align-items: center;
}

.middle-row {
    display: flex;
    flex-direction: row; /* 3 columnas horizontales */
    gap: 20px;
    align-items: flex-start;
}
```

### 📊 Resultado
- ✅ Layout organizado según especificación del usuario
- ✅ Cada jugador tiene su propio SELECT PIECE
- ✅ Tablero centrado con jugadores a los lados

---

## Bug #4: Selectores de Piezas se Pisan (IDs Duplicados)

### 📅 Fecha
25 de Octubre 2025

### 🐛 Descripción del Problema
Al tener dos SELECT PIECE (uno para Cyan y otro para Magenta), compartían los mismos IDs:
- `selectedRook`, `countRook`, etc. → Ambos usaban los mismos IDs
- Los event listeners se duplicaban
- Ambos jugadores podían clickear en cualquier selector

**Evidencia:**
- Screenshot: `cf_16_desktop.png` - Muestra selectores superpuestos
- Log: `086_chessfive.log` - Errores de IDs duplicados

### ✅ Solución Implementada

**1. IDs Únicos en HTML:**
- **Cyan**: `selectedRook`, `selectedKnight`, `countRook`, etc.
- **Magenta**: `selectedRookMagenta`, `selectedKnightMagenta`, `countRookMagenta`, etc.

**2. JavaScript Actualizado (ui-controller.js):**
```javascript
updatePieceSelector() {
    // Update BOTH selectors
    this.updatePlayerSelector('cyan', currentPlayer === 'cyan');
    this.updatePlayerSelector('magenta', currentPlayer === 'magenta');
}

updatePlayerSelector(player, isActive) {
    const suffix = player === 'magenta' ? 'Magenta' : '';
    // Update symbols and counts with unique IDs

    if (isActive) {
        selector.classList.remove('disabled');
    } else {
        selector.classList.add('disabled'); // Deshabilitar
    }
}
```

**3. CSS para Deshabilitar:**
```css
.piece-selector.disabled {
    display: none; /* Ocultar completamente cuando no es el turno */
}
```

### 📊 Resultado
- ✅ Cada selector tiene IDs únicos
- ✅ Solo el jugador activo puede usar su selector
- ✅ El selector inactivo desaparece completamente

---

## Bug #5: Desalineación Visual de Paneles

### 📅 Fecha
25 de Octubre 2025

### 🐛 Descripción del Problema
Los paneles de Cyan y Magenta no estaban alineados verticalmente porque:
- En Fase 1: Un jugador tiene SELECT PIECE visible, el otro no
- En Fase 2: Los inventarios tienen diferentes cantidades de piezas

**Evidencia:**
- Screenshot: `cf_19_desktop.png`, `cf_20_desktop.png` - Paneles desalineados

### ✅ Solución Implementada

**1. Altura Mínima para player-info:**
```css
.player-info {
    min-height: 150px; /* Altura mínima para mantener alineación */
}
```

**2. SELECT PIECE como Hermano (no hijo) de player-info:**
```html
<!-- ANTES (incorrecto) -->
<div class="player-info">
    <div class="piece-selector">...</div> <!-- Dentro -->
</div>

<!-- AHORA (correcto) -->
<div class="player-info">...</div>
<div class="piece-selector">...</div> <!-- Hermano -->
```

**3. Indicador Visual de Turno en Fase 2:**
```css
.player-info.active {
    border-color: var(--cyan-primary);
    border-width: 3px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
}

#playerMagenta.active {
    border-color: var(--magenta-primary);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
}
```

### 📊 Resultado
- ✅ Paneles alineados verticalmente
- ✅ Fácil distinguir el turno en Fase 2 (borde brillante)
- ✅ SELECT PIECE separado visualmente del player-info

---

## Bug #6: Header Descentrado

### 📅 Fecha
25 de Octubre 2025

### 🐛 Descripción del Problema
El título "ChessFive" no estaba perfectamente centrado porque los botones HOME y SOUND tenían anchos diferentes.

### ✅ Solución Implementada

**CSS Grid con Columnas Simétricas:**
```css
.game-header {
    display: grid;
    grid-template-columns: 100px 1fr 100px; /* Simétricas */
}

.btn-home, .btn-icon {
    width: 100%; /* Ocupan toda su columna */
}
```

### 📊 Resultado
- ✅ Título perfectamente centrado
- ✅ Botones simétricos

---

## Bug #7: Línea Decorativa Debajo del Header

### 📅 Fecha
25 de Octubre 2025

### 🐛 Descripción del Problema
El usuario solicitó eliminar la línea cyan debajo del header (border-bottom).

### ✅ Solución Implementada
```css
.game-header {
    /* Removed border-bottom line */
}
```

---

## Archivos Modificados (Sesión Completa)

### HTML
- `games/chessfive/index.html`
  - Reorganización completa del layout (top/middle/bottom)
  - Duplicación de SELECT PIECE con IDs únicos
  - Separación de player-info y piece-selector

### CSS
- `games/chessfive/css/chessfive.css`
  - Layout de 3 paneles (top-panel, middle-row, bottom-panel)
  - Grid para header simétrico
  - Estilos para .disabled, .active
  - min-height para alineación
  - Borde brillante para turno activo

### JavaScript
- `games/chessfive/js/ui-controller.js`
  - `updatePieceSelector()`: Actualiza ambos selectores
  - `updatePlayerSelector()`: Nueva función para manejar cada selector
  - Lógica para habilitar/deshabilitar según turno

---

**Autor:** Claude Code
**Última actualización:** 25 de Octubre 2025
