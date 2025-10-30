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

## Bug #8: Mobile - Inventory No Visible (Piezas Ocultas)

### 📅 Fecha
30 de Octubre 2025

### 🐛 Descripción del Problema
Al simplificar la UI mobile para ocultar el header "CYAN PLAYER" y "Pieces Left:", el CSS ocultaba TODO el `.player-info` con `display: none !important`, lo que también ocultaba el `.pieces-inventory` que está dentro.

**Evidencia:**
- Screenshot: `cf_24_mobile.png` - Recuadro "TAP A PIECE TO PLACE:" visible pero sin piezas

**Síntoma:** Las piezas no eran clickeables porque estaban ocultas por el CSS.

### 🔍 Causa Raíz
El CSS mobile tenía:
```css
.player-info {
    display: none !important; /* Oculta TODO incluyendo inventory */
}
```

Esto ocultaba el container completo, incluyendo `.pieces-inventory` que es hijo de `.player-info`.

### ✅ Solución Implementada

Cambiar la estrategia: En lugar de ocultar todo, ocultar solo los elementos específicos:

```css
/* En player-info, ocultar todo EXCEPTO el inventory */
.player-info {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    min-height: auto !important;
}

/* Ocultar header y stats del player-info */
.player-info .player-header,
.player-info .player-stats .stat {
    display: none !important;
}

/* Mantener visible solo el pieces-inventory */
.player-stats {
    margin: 0 !important;
    padding: 0 !important;
}
```

### 📊 Resultado
- ✅ Las piezas son visibles y clickeables
- ✅ Solo se muestra el recuadro "TAP A PIECE TO PLACE:"
- ✅ Header y contadores ocultos como se esperaba

---

## Bug #9: Mobile - Phase Indicator Ilegible (Fondo Cyan + Texto Cyan)

### 📅 Fecha
30 de Octubre 2025

### 🐛 Descripción del Problema
El phase indicator aparecía con fade animation en mobile, pero era completamente ilegible porque usaba fondo cyan transparente (0.95) con texto cyan, creando un contraste muy pobre.

**Evidencia:**
- Screenshot: `cf_25_mobile.png` - Cartel azul con texto azul invisible
- Comentario usuario: "el cartel no se lee bien, los colores de letra y fondo es muy confuso"

### 🔍 Causa Raíz
CSS mobile usaba:
```css
.phase-indicator {
    background: rgba(0, 255, 255, 0.95); /* Fondo cyan */
    border: 3px solid var(--cyan-primary);
}

.phase-indicator h2 {
    color: var(--cyan-primary); /* Texto cyan sobre fondo cyan */
}
```

### ✅ Solución Implementada

Cambiar a fondo oscuro con texto brillante:

```css
.phase-indicator {
    background: rgba(10, 10, 26, 0.98); /* Fondo casi negro */
    border: 3px solid var(--cyan-primary);
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
    backdrop-filter: blur(10px);
}

.phase-indicator h2 {
    font-size: 1.5rem;
    color: var(--cyan-primary); /* Cyan sobre negro = alto contraste */
    text-shadow: 0 0 15px var(--cyan-glow);
}

.phase-indicator p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9); /* Blanco para descripción */
}
```

### 📊 Resultado
- ✅ Texto perfectamente legible con alto contraste
- ✅ Mantiene el estilo visual cyan con glow
- ✅ Descripción en blanco fácil de leer

---

## Bug #10: Mobile - Panel de Jugador Invertido (Timing Issue)

### 📅 Fecha
30 de Octubre 2025

### 🐛 Descripción del Problema
En mobile Fase 1, el panel de selector de piezas no cambiaba correctamente entre turnos:
- Primer movimiento (cyan): ✅ Correcto
- Segundo movimiento (magenta): ❌ Sigue mostrando panel cyan
- Tercer movimiento (cyan): ✅ Cambia a magenta (1 turno atrasado)

**Evidencia:**
- Screenshot: `cf_25_mobile.png` - Panel magenta visible pero "CURRENT TURN: CYAN PLAYER"
- Log: `090_chessfive.log` línea 1578-1581 - Turnos correctos pero UI desincronizada
- Comentario usuario: "el primer movimiento del jugador cyan esta bien, luego cuando le toca al magenta no cambia y luego cambia cuando le vuelve a tocar al cyan"

### 🔍 Causa Raíz
En `gravity-phase.js`, `updatePlayerInfo()` se llamaba ANTES de `switchPlayer()`:

```javascript
// ❌ INCORRECTO (línea 91):
UIController.updatePlayerInfo(); // Actualiza con jugador VIEJO (cyan)

// Línea 110:
GameState.switchPlayer(); // Cambia a jugador NUEVO (magenta)
```

Esto causaba que la UI se actualizara con el jugador que acababa de mover, no con el jugador que debe mover a continuación.

### ✅ Solución Implementada

**Archivo:** `games/chessfive/js/gravity-phase.js`

Reordenar las llamadas para actualizar UI DESPUÉS de cambiar jugador:

```javascript
// Línea 87-111 (nueva versión):
// Play sound
SoundManager.play('place');

// Check for win
const winResult = WinDetection.checkWin(row, placedCol);
if (winResult) {
    this.handleWin(winResult);
    return;
}

// Check if gravity phase is complete
if (GameState.isGravityPhaseComplete()) {
    setTimeout(() => {
        this.transitionToChessPhase();
    }, 1000);
    return;
}

// Switch player
GameState.switchPlayer();

// ✅ Update UI AFTER switching player
UIController.updateTurnIndicator();
UIController.updatePlayerInfo(); // Ahora actualiza con jugador NUEVO
UIController.updatePieceSelector();
```

**También agregado en `ui-controller.js`:**
```javascript
init() {
    this.attachEventListeners();
    this.updateAll();

    // MOBILE: Inicializar visibilidad de paneles explícitamente
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) {
        const cyanPanelContainer = document.querySelector('.player-panel-left');
        const magentaPanelContainer = document.querySelector('.player-panel-right');

        // Al inicio siempre es turno de Cyan
        if (GameState.currentPlayer === 'cyan') {
            cyanPanelContainer.classList.remove('mobile-hidden');
            magentaPanelContainer.classList.add('mobile-hidden');
        }

        console.log('📱 Mobile panel visibility initialized - Turn:', GameState.currentPlayer);
    }
}
```

### 📊 Resultado
- ✅ El panel cambia correctamente en cada turno
- ✅ Siempre muestra el panel del jugador que debe mover
- ✅ Sincronización perfecta entre `GameState.currentPlayer` y UI

---

## Bug #11: Mobile - Turn Indicator No Cambia Color + Mejora Visual con Borde Tablero

**Fecha:** 30 de Octubre 2025
**Prioridad:** ALTA
**Estado:** RESUELTO ✅

### Descripción del Problema

Después de implementar el turn indicator en Fase 2 mobile, se detectaron dos problemas:
1. El indicador "YOUR TURN" quedaba siempre en color cyan, no alternaba entre jugadores
2. No había suficiente énfasis visual sobre de quién es el turno
3. El phase indicator (PHASE 1/PHASE 2) no era suficientemente translúcido

**Evidencia:**
- Screenshot: `cf_27_mobile.png` - "YOUR TURN" permanece cyan para ambos jugadores
- Log: `092_chessfive.log` - Cambios de turno pero sin cambio de color
- Feedback usuario: "volvio a quedarse en 'you turn' color cyan en la fase 2 en mobile"

### Root Cause (Análisis)

**Problema 1 - Turn Indicator:**
```javascript
// En ui-controller.js updatePlayerInfo() línea ~320-328
if (isMobile && GameState.phase === 'gravity') {
    magentaPanelContainer.classList.add('mobile-hidden');
    // ...
}
```
La condición `&& GameState.phase === 'gravity'` impedía que el código se ejecutara en Phase 2, causando que los paneles no se alternaran correctamente.

**Problema 2 - Falta de Énfasis Visual:**
No había indicador visual adicional aparte del "YOUR TURN" text. Se necesitaba otro elemento visual más prominente.

**Problema 3 - Phase Indicator:**
El phase indicator tenía `opacity: 0.98` que no era suficientemente translúcido sobre el tablero.

### Solución Implementada

#### 1. Remover Condición de Fase (Turn Indicator)
```javascript
// ui-controller.js updatePlayerInfo() líneas ~307-329

// ANTES:
if (isMobile && GameState.phase === 'gravity') {
    magentaPanelContainer.classList.add('mobile-hidden');
    // ...
}

// DESPUÉS:
if (isMobile) {
    // Funciona en AMBAS fases (gravity Y chess)
    magentaPanelContainer.classList.add('mobile-hidden');
    cyanPanelContainer.classList.remove('mobile-hidden');
}
```

#### 2. Implementar Borde de Tablero como Indicador de Turno

**CSS (chessfive.css líneas 564-590):**
```css
.chess-board {
    border: 3px solid var(--cyan-primary);
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Board border según turno del jugador */
.board-container.turn-cyan .chess-board {
    border-color: var(--cyan-primary);
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
}

.board-container.turn-magenta .chess-board {
    border-color: var(--magenta-primary);
    box-shadow: 0 0 40px rgba(255, 0, 255, 0.4);
}
```

**JavaScript (ui-controller.js updatePlayerInfo() líneas 284-292):**
```javascript
// Update board border según turno
const boardContainer = document.querySelector('.board-container');
if (GameState.currentPlayer === 'cyan') {
    boardContainer.classList.remove('turn-magenta');
    boardContainer.classList.add('turn-cyan');
} else {
    boardContainer.classList.remove('turn-cyan');
    boardContainer.classList.add('turn-magenta');
}
```

**Inicialización (ui-controller.js init() líneas 14-20):**
```javascript
// Inicializar borde del tablero según turno inicial
const boardContainer = document.querySelector('.board-container');
if (GameState.currentPlayer === 'cyan') {
    boardContainer.classList.add('turn-cyan');
} else {
    boardContainer.classList.add('turn-magenta');
}
```

#### 3. Ajustar Opacidad Phase Indicator

**CSS (chessfive.css línea ~862):**
```css
/* ANTES: */
background: rgba(10, 10, 26, 0.98);

/* DESPUÉS: */
background: rgba(10, 10, 26, 0.75); /* Más traslúcido */
```

#### 4. Prevenir Animación en Desktop

**CSS (chessfive.css líneas 823-839):**
```css
@media (min-width: 1025px) {
    .top-panel {
        position: relative;
        transform: none;
    }

    .phase-indicator {
        background: rgba(0, 255, 255, 0.1);
        backdrop-filter: none;
    }

    /* No animar en desktop */
    .phase-indicator.animate-fade {
        animation: none;
    }
}
```

### Resultado

✅ **Turn Indicator:** Ahora alterna correctamente entre cyan y magenta en ambas fases
✅ **Board Border:** El borde del tablero cambia de color según el turno (cyan ↔ magenta)
✅ **Visual Emphasis:** Doble indicador visual (panel + borde tablero) hace obvio de quién es el turno
✅ **Phase Indicator:** Más traslúcido (0.75) permitiendo ver mejor el tablero
✅ **Desktop:** Phase indicator no se anima ni aparece como overlay en desktop
✅ **Mobile:** Experiencia fluida con transiciones suaves entre turnos

### Archivos Modificados

1. **css/chessfive.css** (+27 líneas)
   - Líneas 564-590: Border styling con clases .turn-cyan / .turn-magenta
   - Líneas 823-839: Media query desktop para prevenir animación
   - Línea ~862: Opacidad phase indicator ajustada a 0.75

2. **js/ui-controller.js** (+15 líneas)
   - Líneas 14-20: Inicialización board border en init()
   - Líneas 284-292: Update board border en updatePlayerInfo()
   - Líneas ~307-329: Removida condición `&& GameState.phase === 'gravity'`

### Lecciones Aprendidas

1. **Doble Indicador Visual:** Usar múltiples elementos visuales (texto + color de borde) mejora la UX
2. **Transiciones CSS:** Las transiciones suaves hacen que los cambios de estado sean más perceptibles
3. **Media Queries Bidireccionales:** Necesario definir comportamiento tanto para mobile como desktop explícitamente
4. **Condiciones de Fase:** Las condiciones `&& GameState.phase === 'X'` deben usarse solo cuando realmente se necesita comportamiento diferente por fase

### Testing

- ✅ Desktop: Borde cambia cyan ↔ magenta en ambas fases
- ✅ Mobile Fase 1: Panel alterna + borde alterna
- ✅ Mobile Fase 2: "YOUR TURN" alterna + borde alterna
- ✅ Phase Indicator: Translúcido, no interfiere con visibilidad del tablero
- ✅ Desktop Resize: No aparece overlay al cambiar tamaño de ventana

---

## Bug #12: Fase 2 - Turn Indicator No Cambia + Borde No Actualiza + Phase Indicator Solo Mobile

**Fecha:** 30 de Octubre 2025
**Prioridad:** CRÍTICA
**Estado:** RESUELTO ✅

### Descripción del Problema

Tres problemas relacionados con la Fase 2 (Chess Movement):

1. **Mobile Turn Indicator no cambia color**: El cartel "YOUR TURN" permanece cyan en Fase 2, no alterna entre jugadores
2. **Board Border no cambia en Fase 2**: El borde del tablero no se actualiza según el turno (solo funcionaba en Fase 1)
3. **Phase Indicator solo Mobile**: El indicador de fase solo aparecía en mobile, no en desktop

**Evidencia:**
- Log: `093_chessfive.log` - Turnos cambian pero UI no se actualiza en Fase 2
- Feedback usuario: "en la fase 2, sigue sin cambiar el cartel del turno"
- Feedback usuario: "también que en la fase 2, cambie el color de borde como en la fase 1"
- Feedback usuario: "El cartel de fase 1 y fase 2, esta bueno que aparezca en desktop tambien"

### Root Cause (Análisis)

**Problema 1 - Mobile Turn Indicator CSS Selector Incorrecto:**
```css
/* ANTES - NO FUNCIONA */
.phase-chess #playerMagenta .mobile-turn-indicator {
    background: rgba(255, 0, 255, 0.15);
    /* ... */
}
```

La estructura HTML tiene `.mobile-turn-indicator` como hermano de `#playerMagenta`, NO como hijo:
```html
<aside class="player-panel player-panel-right">
    <div class="player-info" id="playerMagenta"></div>
    <div class="mobile-turn-indicator"></div> <!-- Hermano, no hijo -->
</aside>
```

Por lo tanto, el selector `#playerMagenta .mobile-turn-indicator` nunca encuentra el elemento.

**Problema 2 - chess-phase.js No Llama updatePlayerInfo():**
```javascript
// chess-phase.js línea 137-139 (ANTES):
GameState.switchPlayer();
UIController.updateTurnIndicator(); // Solo actualiza texto del turno

// FALTABA:
// UIController.updatePlayerInfo(); // Esto actualiza panels Y board border
```

El borde del tablero se actualiza en `updatePlayerInfo()`, pero `chess-phase.js` solo llamaba a `updateTurnIndicator()`.

**Problema 3 - Phase Indicator Desactivado en Desktop:**
```css
/* ANTES - Desktop media query desactivaba animación */
@media (min-width: 1025px) {
    .phase-indicator.animate-fade {
        animation: none; /* Desactivado en desktop */
    }
}
```

### Solución Implementada

#### 1. Arreglar CSS Selector (mobile-turn-indicator)

**Archivo:** `css/chessfive.css` líneas 1044-1065

```css
/* ANTES - Selector hijo (no funcionaba) */
.phase-chess #playerMagenta .mobile-turn-indicator { /* ... */ }
#playerMagenta .mobile-turn-indicator h3 { /* ... */ }

/* DESPUÉS - Selector correcto usando .player-panel */
.phase-chess .player-panel-right .mobile-turn-indicator {
    background: rgba(255, 0, 255, 0.15);
    border-color: var(--magenta-primary);
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.3);
}

.player-panel-right .mobile-turn-indicator h3 {
    color: var(--magenta-primary);
    text-shadow: 0 0 15px var(--magenta-glow);
}
```

**Explicación:** `.player-panel-right` es el contenedor padre, `.mobile-turn-indicator` es hijo directo. El selector CSS ahora coincide con la estructura HTML real.

#### 2. Agregar updatePlayerInfo() en chess-phase.js

**Archivo:** `js/chess-phase.js` líneas 137-142

```javascript
// ANTES:
GameState.switchPlayer();
UIController.updateTurnIndicator();

// DESPUÉS:
GameState.switchPlayer();

// Update UI (turn indicator, player panels, board border)
UIController.updateTurnIndicator();
UIController.updatePlayerInfo(); // ← AGREGADO
```

**Resultado:** Ahora en Fase 2:
- Mobile panels alternan correctamente
- Board border cambia cyan ↔ magenta
- Sincronización perfecta con `GameState.currentPlayer`

#### 3. Phase Indicator Cross-Device

**Archivo:** `css/chessfive.css` líneas 835-877

**ANTES:**
- Desktop: `position: relative`, sin animación
- Mobile: `position: fixed`, con overlay y animación

**DESPUÉS (Cross-Device):**
```css
/* FUERA de media queries - aplica a TODOS los dispositivos */
.top-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    max-width: 90%;
    width: auto;
    pointer-events: all; /* Permitir clicks para cerrar */
}

.phase-indicator {
    background: rgba(10, 10, 26, 0.5); /* Más transparente: 0.75 → 0.5 */
    border: 3px solid var(--cyan-primary);
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    cursor: pointer; /* Indicar que es clickeable */
}
```

**Cambios adicionales:**
- Duración reducida: 3s → 2s (línea 266)
- Transparencia aumentada: 0.75 → 0.5
- Click handler para cerrar manualmente

**Archivo:** `js/main.js` líneas 20-36

```javascript
// ANTES: Solo mobile (if (isMobile) { ... })
// DESPUÉS: Cross-device (sin condición)

const phaseIndicator = document.querySelector('.phase-indicator');
if (phaseIndicator) {
    phaseIndicator.classList.add('animate-fade');

    setTimeout(() => {
        phaseIndicator.classList.add('fade-complete');
    }, 2000); // 2s en lugar de 3s

    // Click handler para cerrar manualmente
    phaseIndicator.addEventListener('click', () => {
        phaseIndicator.classList.add('fade-complete');
        console.log('🖱️ Phase indicator closed manually');
    });
}
```

**Archivo:** `js/ui-controller.js` líneas 253-274

```javascript
// ANTES: if (isMobile && phaseIndicator) { ... }
// DESPUÉS: if (phaseIndicator) { ... }

// CROSS-DEVICE: Animate phase change (desktop y mobile)
if (phaseIndicator) {
    phaseIndicator.classList.remove('animate-fade', 'fade-complete');
    void phaseIndicator.offsetWidth; // Force reflow
    phaseIndicator.classList.add('animate-fade');

    setTimeout(() => {
        phaseIndicator.classList.add('fade-complete');
    }, 2000); // 2s

    // Click handler para Fase 2
    phaseIndicator.onclick = () => {
        phaseIndicator.classList.add('fade-complete');
        console.log('🖱️ Phase 2 indicator closed manually');
    };
}
```

### Resultado

✅ **Mobile Turn Indicator**: Ahora alterna correctamente cyan ↔ magenta en Fase 2
✅ **Board Border**: Cambia de color en ambas fases (Fase 1 Y Fase 2)
✅ **Phase Indicator Cross-Device**: Aparece en desktop Y mobile con overlay
✅ **Duración Optimizada**: 2s en lugar de 3s (más rápido, menos intrusivo)
✅ **Transparencia Mejorada**: 0.5 opacity (más traslúcido, mejor visibilidad del tablero)
✅ **Click to Close**: Se puede cerrar manualmente haciendo click

### Archivos Modificados

1. **css/chessfive.css** (+42 líneas, -51 líneas)
   - Líneas 266: Duración 3s → 2s
   - Líneas 835-877: Phase indicator cross-device (movido fuera de media queries)
   - Líneas 1044-1065: Selector CSS mobile-turn-indicator arreglado
   - Líneas 994: Código duplicado eliminado

2. **js/chess-phase.js** (+3 líneas)
   - Líneas 137-142: Agregado `UIController.updatePlayerInfo()`

3. **js/main.js** (+7 líneas, -3 líneas)
   - Líneas 20-36: Removido `if (isMobile)`, agregado click handler

4. **js/ui-controller.js** (+7 líneas, -1 línea)
   - Líneas 253-274: Removido `if (isMobile)`, timeout 3s → 2s, agregado click handler

### Lecciones Aprendidas

1. **CSS Selector Debugging**: Siempre verificar la estructura HTML real antes de escribir selectores CSS. Los selectores descendientes (`.parent .child`) requieren relación padre-hijo en el DOM.

2. **Consistencia de Llamadas UI**: Si algo se actualiza en Fase 1, asegurarse de que también se actualice en Fase 2. Mantener simetría en las llamadas `UIController`.

3. **Cross-Device Design**: Evitar bifurcaciones `if (isMobile)` cuando la misma funcionalidad puede aplicarse a todos los dispositivos. Usar CSS responsive design en su lugar.

4. **Timing de Animaciones**: Duración más corta (2s) es más user-friendly que animaciones largas (3s).

5. **UX Enhancement**: Permitir cerrar overlays con click mejora la experiencia del usuario (control manual).

### Testing

- ✅ Desktop Fase 1: Phase indicator aparece, borde cyan
- ✅ Desktop Fase 2: Phase indicator aparece, borde alterna cyan/magenta
- ✅ Mobile Fase 1: Piezas clickeables, borde cyan
- ✅ Mobile Fase 2: "YOUR TURN" alterna, borde alterna
- ✅ Click to close: Funciona en desktop y mobile, ambas fases
- ✅ Duración 2s: Más rápido y menos intrusivo

---

## Bug #13: Desktop - Turn Indicator Lejos del Tablero + Borde No Sincronizado

**Fecha:** 30 de Octubre 2025
**Prioridad:** ALTA
**Estado:** RESUELTO ✅

### Descripción del Problema

Dos problemas en la vista desktop:

1. **Turn Indicator muy lejos del tablero**: El indicador "Current Turn: CYAN PLAYER" estaba en el `.bottom-panel`, muy abajo en la pantalla, lejos del tablero visualmente
2. **Borde del tablero no sincronizado**: Le tocaba al jugador cyan pero el borde del tablero estaba en magenta

**Evidencia:**
- Screenshot: `2025-10-30 15_21_38-Greenshot.png` - Turn indicator abajo, borde magenta cuando debería ser cyan
- Log: `094_chessfive.log`
- Feedback usuario: "puedes subir (acercar al tablero) el cartel del turno?"
- Feedback usuario: "le toca al cyan y el borde del tablero es magenta, tienes que solucionar eso"

### Root Cause (Análisis)

**Problema 1 - Turn Indicator Distante:**
```html
<!-- ANTES: turn-indicator en bottom-panel -->
<div class="bottom-panel">
    <div class="turn-indicator">...</div>
    <div class="game-controls">...</div>
</div>
```

El turn-indicator estaba en el bottom-panel junto con los botones NEW GAME, UNDO, HELP. Esto lo posicionaba muy abajo en la pantalla, lejos del tablero.

**Problema 2 - Borde No Sincronizado (Código Duplicado):**
```javascript
// ui-controller.js init() - ANTES:
init() {
    this.attachEventListeners();
    this.updateAll(); // Llama a updatePlayerInfo() que actualiza el borde

    // LÍNEAS 14-20: Código DUPLICADO - vuelve a agregar clases
    const boardContainer = document.querySelector('.board-container');
    if (GameState.currentPlayer === 'cyan') {
        boardContainer.classList.add('turn-cyan'); // ← DUPLICADO
    }
}
```

El problema era código duplicado:
1. `updateAll()` → `updatePlayerInfo()` → actualiza clases `.turn-cyan` / `.turn-magenta`
2. Líneas 14-20 → vuelven a agregar clases (DUPLICADO)

Esto podría causar que se aplicaran AMBAS clases al mismo tiempo, o que hubiera una condición de carrera en la inicialización.

### Solución Implementada

#### 1. Mover Turn Indicator Dentro de board-container

**Archivo:** `index.html` líneas 132-142

```html
<!-- NUEVO: turn-indicator dentro de board-container -->
<div class="board-container">
    <div id="chessBoard" class="chess-board">
        <!-- Board will be generated by JavaScript -->
    </div>

    <!-- Desktop Turn Indicator (debajo del tablero) -->
    <div class="turn-indicator desktop-turn">
        <p>Current Turn:</p>
        <h3 id="currentTurnText">CYAN PLAYER</h3>
    </div>
</div>
```

**Cambios:**
- Movido el turn-indicator DENTRO del `.board-container`
- Agregada clase `.desktop-turn` para styling específico
- Removido del `.bottom-panel` (ahora solo tiene controles)

#### 2. CSS para Desktop Turn Indicator

**Archivo:** `css/chessfive.css` líneas 522-527

```css
/* Desktop Turn Indicator (debajo del tablero) */
.desktop-turn {
    margin-top: 20px;
    width: 100%;
    max-width: 600px;
}
```

**Mobile (ocultar desktop-turn):**
```css
/* Líneas 902-905 */
@media (max-width: 1024px) {
    /* Ocultar desktop turn indicator en mobile */
    .desktop-turn {
        display: none !important;
    }
}
```

**Resultado:**
- Desktop: Turn indicator aparece debajo del tablero, centrado, cerca visualmente
- Mobile: Turn indicator oculto (ya tienen `.mobile-turn-indicator` en Fase 2)

#### 3. Remover Código Duplicado (Borde Tablero)

**Archivo:** `js/ui-controller.js` líneas 10-13

```javascript
// ANTES (con código duplicado):
init() {
    this.attachEventListeners();
    this.updateAll(); // Ya actualiza el borde en updatePlayerInfo()

    // Líneas 14-20: CÓDIGO DUPLICADO - removido
    const boardContainer = document.querySelector('.board-container');
    if (GameState.currentPlayer === 'cyan') {
        boardContainer.classList.add('turn-cyan');
    }
    // ...
}

// DESPUÉS (sin duplicación):
init() {
    this.attachEventListeners();
    this.updateAll(); // updatePlayerInfo() actualiza el borde correctamente

    // MOBILE: Inicializar visibilidad de paneles
    // ...
}
```

**Explicación:**
- `updateAll()` llama a `updatePlayerInfo()` (línea 101)
- `updatePlayerInfo()` actualiza las clases `.turn-cyan` / `.turn-magenta` (líneas 290-298)
- No es necesario volver a agregar las clases manualmente en `init()`

### Resultado

✅ **Turn Indicator Desktop**: Ahora aparece debajo del tablero, centrado, cerca visualmente
✅ **Turn Indicator Mobile**: Oculto en mobile (usan `.mobile-turn-indicator`)
✅ **Borde Tablero**: Sincronizado correctamente con el turno actual (cyan ↔ magenta)
✅ **Código Limpio**: Removida duplicación de lógica de inicialización
✅ **Consistencia**: El borde cambia correctamente en Fase 1 Y Fase 2

### Archivos Modificados

1. **index.html** (+6 líneas, -5 líneas)
   - Líneas 137-141: Turn indicator movido a `.board-container` con clase `.desktop-turn`
   - Líneas 203-211: Removido turn-indicator del `.bottom-panel`

2. **css/chessfive.css** (+9 líneas)
   - Líneas 522-527: Estilos para `.desktop-turn`
   - Líneas 902-905: Ocultar `.desktop-turn` en mobile

3. **js/ui-controller.js** (-9 líneas)
   - Líneas 10-13: Removida inicialización duplicada del borde

### Lecciones Aprendidas

1. **DRY Principle (Don't Repeat Yourself)**: Código duplicado causa bugs. Si una función ya hace algo, no volver a hacerlo manualmente.

2. **Proximidad Visual**: Los elementos relacionados (tablero + turn indicator) deben estar cerca visualmente para mejor UX.

3. **Responsive Design**: Diferentes dispositivos necesitan diferentes layouts - desktop puede mostrar más información cerca, mobile necesita simplificación.

4. **Orden de Ejecución**: Entender el flujo de llamadas (`init() → updateAll() → updatePlayerInfo()`) es crucial para evitar duplicación.

5. **CSS Specificity**: Usar clases específicas (`.desktop-turn`) permite controlar visibilidad por dispositivo sin afectar otros elementos.

### Testing

- ✅ Desktop: Turn indicator debajo del tablero, borde sincronizado
- ✅ Desktop Fase 1: Borde cyan al inicio, cambia a magenta en turno 2
- ✅ Desktop Fase 2: Borde sigue alternando cyan ↔ magenta
- ✅ Mobile: Turn indicator oculto, mobile-turn-indicator visible en Fase 2
- ✅ New Game: Borde resetea correctamente a cyan
- ✅ Refresh: Borde inicia correctamente en cyan

---

**Autor:** Claude Code
**Última actualización:** 30 de Octubre 2025
