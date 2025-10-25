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

**Autor:** Claude Code
**Última actualización:** 25 de Octubre 2025
