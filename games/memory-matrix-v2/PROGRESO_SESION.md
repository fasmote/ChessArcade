# 📝 PROGRESO DE SESIÓN - Memory Matrix v2

**Fecha**: 1 de Octubre de 2025
**Sesión**: Construcción desde cero, paso a paso

---

## ✅ PASOS COMPLETADOS

### ✅ PASO 0: Preparación
**Estado**: COMPLETADO

**Archivos creados:**
- `PLAN_DESARROLLO.md` - Plan de 10 pasos
- `REQUERIMIENTOS_FUNCIONALES.md` - 15 RF detallados
- `ERRORES_CONOCIDOS_Y_SOLUCIONES.md` - 8 errores documentados
- `PROGRESO_SESION.md` - Este archivo

**Decisiones:**
- Mobile First (350px → desktop)
- Estilo ChessArcade (neón, futurista)
- Sin librerías pesadas (Vanilla JS)
- CDN para piezas (NO archivos locales)

---

### ✅ PASO 1: Fondo y Estructura Básica
**Estado**: COMPLETADO ✅
**Screenshot**: mm_41.png

**Archivos creados:**
1. `index.html` - Estructura HTML completa con comentarios
2. `styles.css` - Estilos ChessArcade con neón
3. `game.js` - JavaScript básico

**Funcionalidades implementadas:**

#### HTML
- Header con botones HOME y SONIDO
- Título "🧠 Memory Matrix" con cerebro
- Área de juego (container)
- Mensaje de estado (dorado)
- Botón "Comenzar" (degradado rosa-naranja)

#### CSS
- **Fondo**: Degradado negro → morado
- **Grid animado**: Líneas cyan que se mueven (20s loop)
- **Fuente**: Orbitron (Google Fonts)
- **Botones**: Borde neón con glow
  - HOME: Cyan (#00ffff)
  - SONIDO: Naranja (#ff8000)
- **Título**: Animación de glow pulsante
- **Cerebro**: Animación de rebote
- **Responsive**: Labels de botones ocultos en <500px

#### JavaScript
- `initButtons()` - Configura event listeners
- `goHome()` - Navega a `../../index.html`
- `toggleSound()` - Alterna audio on/off
- `updateSoundIcon()` - Cambia icono según estado
- `saveAudioPreference()` - Guarda en localStorage
- `loadAudioPreference()` - Carga al iniciar
- `updateStatus()` - Actualiza mensaje de estado

**Variables CSS importantes:**
```css
--neon-cyan: #00ffff
--neon-orange: #ff8000
--neon-pink: #ff0080
--gold: #ffd700
--bg-gradient: linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #330066 100%)
```

**Testing realizado:**
- ✅ Fondo con grid animado visible
- ✅ Título neón pulsante
- ✅ Botones funcionan
- ✅ Toggle sonido persiste en localStorage
- ✅ Responsive mobile → desktop

---

### ✅ PASO 2: Tablero Vacío Responsive
**Estado**: COMPLETADO ✅
**Screenshots**: mm_42.png, mm_43.png

**Archivos modificados:**
1. `index.html` - Agregado div del tablero
2. `styles.css` - Estilos del tablero y casillas
3. `game.js` - Función `createBoard()`

**Funcionalidades implementadas:**

#### HTML
```html
<div class="board-container">
    <div class="chessboard" id="chessboard">
        <!-- 64 casillas generadas con JS -->
    </div>
</div>
```

#### CSS del Tablero
- **Contenedor**:
  - Fondo semi-transparente `rgba(0, 0, 0, 0.4)`
  - Borde neón cyan 3px
  - Glow: `box-shadow: 0 0 20px var(--neon-cyan)`

- **Tablero**:
  - CSS Grid 8x8: `grid-template-columns: repeat(8, 1fr)`
  - Aspect ratio 1:1 (siempre cuadrado)
  - Tamaños responsive:
    - Mobile: `width: 90vw`, max 400px
    - Tablet (≥600px): max 450px
    - Desktop (≥900px): max 500px

- **Casillas**:
  - `.square.light`: beige (#f0d9b5)
  - `.square.dark`: marrón (#b58863)
  - Hover: `filter: brightness(1.1)`
  - Flex para centrar contenido (piezas futuras)

- **Coordenadas**:
  - `.coord-file` (a-h): bottom 2px
  - `.coord-rank` (1-8): top 2px, left 2px
  - Color adaptativo según casilla (contraste)
  - Font-size responsive: 10px → 12px → 14px

#### JavaScript - createBoard()
```javascript
function createBoard() {
    // 1. Obtener elemento #chessboard
    // 2. Limpiar contenido previo
    // 3. Definir arrays: files [a-h], ranks [8-1]
    // 4. Loop doble: ranks x files
    //    - Crear div.square
    //    - Calcular color (light/dark) según suma de índices
    //    - Guardar coordenada en data-square
    //    - Agregar coordenadas visuales en bordes
    //    - Append al tablero
    // 5. Log: 64 casillas creadas
}
```

**Algoritmo de color:**
```javascript
// Patrón de ajedrez: alternar según suma de índices
const isLight = (rankIndex + fileIndex) % 2 === 0;
```

**Helper agregado:**
```javascript
function getSquareElement(square) {
    return document.querySelector(`[data-square="${square}"]`);
}
```

**Testing realizado:**
- ✅ 64 casillas correctas
- ✅ Colores alternados beige/marrón
- ✅ Coordenadas a-h en fila 1
- ✅ Coordenadas 1-8 en columna a
- ✅ Borde neón cyan con glow
- ✅ Responsive: tablero escala correctamente
- ✅ Hover en casillas funciona

---

### ✅ PASO 3: Piezas de Lichess
**Estado**: COMPLETADO ✅
**Screenshots**: mm_44.png (desktop), mm_45.png (mobile)

**Funcionalidades implementadas:**

#### JavaScript - Gestión de Piezas

**Constante CDN Lichess:**
```javascript
const LICHESS_CDN = 'https://lichess1.org/assets/piece/cburnett/';
```

**Función `showPiece(square, piece)`:**
```javascript
function showPiece(square, piece) {
    // 1. Obtener casilla por data-square
    const squareElement = getSquareElement(square);
    if (!squareElement) return;

    // 2. Remover pieza existente si hay
    const existingPiece = squareElement.querySelector('.piece');
    if (existingPiece) existingPiece.remove();

    // 3. Crear imagen
    const img = document.createElement('img');
    img.className = 'piece';
    img.src = `${LICHESS_CDN}${piece}.svg`;
    img.alt = piece;
    img.dataset.piece = piece;

    // 4. Agregar a casilla
    squareElement.appendChild(img);
}
```

**Funciones auxiliares agregadas:**
```javascript
// Limpiar pieza de una casilla
function clearPiece(square) {
    const squareElement = getSquareElement(square);
    if (!squareElement) return;
    const piece = squareElement.querySelector('.piece');
    if (piece) piece.remove();
}

// Limpiar todas las piezas
function clearBoard() {
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => piece.remove());
}

// Posición de prueba: 2 reyes
function showTestPosition() {
    showPiece('e1', 'wK');  // Rey blanco
    showPiece('e8', 'bK');  // Rey negro
    updateStatus('Posición de prueba: 2 reyes en e1 y e8');
}
```

#### CSS - Estilos de Piezas

```css
.piece {
    /* Tamaño: 85% de la casilla */
    width: 85%;
    height: 85%;

    /* Mantener proporción */
    object-fit: contain;

    /* Cursor interactivo */
    cursor: pointer;

    /* Animaciones suaves */
    transition: transform 0.2s ease, filter 0.2s ease;

    /* No seleccionable */
    user-select: none;
    -webkit-user-drag: none;

    /* Z-index sobre coordenadas */
    position: relative;
    z-index: 10;
}

/* Hover: escalar y glow */
.piece:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

/* Para drag & drop futuro (PASO 6) */
.piece.dragging {
    opacity: 0.5;
    cursor: grabbing;
}
```

**Testing realizado:**
- ✅ Piezas SVG cargan correctamente desde CDN
- ✅ NO más texto (bR, wK) - problema resuelto
- ✅ Hover con escala y glow funciona
- ✅ 2 reyes se muestran en posición correcta (e1, e8)

**Códigos de piezas disponibles:**
- Blancas: `wK` `wQ` `wR` `wB` `wN` `wP`
- Negras: `bK` `bQ` `bR` `bB` `bN` `bP`

---

### ✅ FIX POST-PASO 3: Ajustes de UI
**Estado**: COMPLETADO ✅

**Problemas identificados por usuario:**
1. ❌ Título "Memory Matrix" no centrado con tablero
2. ❌ En mobile hay que scrollear para ver botón COMENZAR

**Soluciones implementadas:**

#### 1. Centrado del Título

**Cambio en `.title-section`:**
```css
.title-section {
    text-align: center;
    margin: var(--spacing-sm) 0; /* Reducido de lg */

    /* Flexbox para centrar con tablero */
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

**Cambio en `.game-title`:**
```css
.game-title {
    font-size: clamp(1.8rem, 7vw, 4rem); /* Reducido mínimo */

    /* Ancho máximo alineado con tablero */
    max-width: 90vw;
}
```

#### 2. Optimización Espaciado Mobile

**Reducción de gaps verticales:**
```css
/* Container principal */
.game-container {
    gap: var(--spacing-md); /* 20px en vez de 32px */
}

/* Status section */
.status-section {
    padding: var(--spacing-sm) var(--spacing-md); /* Vertical reducido */
}

.status-message {
    padding: var(--spacing-sm); /* 12px en vez de 20px */
    font-size: clamp(13px, 3vw, 18px); /* Mínimo reducido */
}

/* Botón primario */
.btn-primary {
    padding: 14px 36px; /* Más compacto */
    min-height: 52px;   /* Era 60px */
    font-size: 18px;    /* Era 20px */
}

.action-section {
    padding: var(--spacing-sm) 0; /* Reducido */
}
```

**Media queries específicas:**
```css
/* Mobile extra pequeño (≤350px) */
@media (max-width: 350px) {
    .game-container {
        padding: var(--spacing-xs);
        gap: var(--spacing-sm); /* 12px */
    }

    .game-title { font-size: 1.6rem; }

    .btn-primary {
        min-height: 48px;
        font-size: 16px;
    }

    .status-message {
        font-size: 12px;
        padding: var(--spacing-xs);
    }
}

/* Desktop (≥768px) - Restaurar espaciado original */
@media (min-width: 768px) {
    .game-container {
        gap: var(--spacing-lg); /* 32px restaurado */
    }

    .btn-primary {
        padding: 16px 48px;
        min-height: 60px;
        font-size: 20px;
    }
}
```

**Resultado:**
- ✅ Título centrado respecto al tablero (no al viewport)
- ✅ Todo visible en mobile sin scroll (iPhone, 350px+)
- ✅ Desktop mantiene espaciado generoso
- ✅ Responsive en todos los tamaños

**Archivos modificados:**
- `styles.css` - 8 secciones ajustadas

---

## 📊 ESTADÍSTICAS

**Archivos creados**: 7
- HTML: 1 (`index.html`)
- CSS: 1 (`styles.css`)
- JS: 1 (`game.js`)
- MD (docs): 4 (`PLAN`, `REQUERIMIENTOS`, `ERRORES`, `PROGRESO`)

**Líneas de código actuales:**
- HTML: ~100 líneas
- CSS: ~665 líneas (agregados estilos de piezas + fixes responsive)
- JS: ~345 líneas (agregadas funciones de piezas)
- **Total**: ~1,110 líneas

**Pasos completados**: 3 + 1 fix
- ✅ PASO 1: Fondo y estructura (30 min)
- ✅ PASO 2: Tablero 8x8 (45 min)
- ✅ PASO 3: Piezas Lichess (30 min)
- ✅ FIX: Ajustes UI mobile/desktop (20 min)
- **Total**: ~2h 5min

---

## 🐛 ERRORES EVITADOS

Gracias al documento `ERRORES_CONOCIDOS_Y_SOLUCIONES.md`, evitamos:

1. ❌ **pieceTheme como string** - Usaremos función desde el inicio
2. ❌ **SVG locales corruptos** - Solo CDN
3. ❌ **Cache del navegador** - Documentado cómo hacer hard refresh
4. ❌ **Paths relativos** - Usamos absolutos desde raíz

---

## 🔧 COMANDOS ÚTILES

### Hard Refresh (limpiar cache)
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Abrir en incognito
```
Windows: Ctrl + Shift + N
Mac: Cmd + Shift + N
```

### Ver consola
```
F12 → Console
```

---

## 📁 ESTRUCTURA ACTUAL

```
memory-matrix-v2/
├── index.html                      # HTML principal (PASO 1, 2)
├── styles.css                      # CSS completo (PASO 1, 2)
├── game.js                         # JavaScript (PASO 1, 2)
├── PLAN_DESARROLLO.md              # Plan de 10 pasos
├── REQUERIMIENTOS_FUNCIONALES.md   # 15 RF
├── ERRORES_CONOCIDOS_Y_SOLUCIONES.md  # 8 errores
└── PROGRESO_SESION.md             # Este archivo
```

---

## 🎨 DECISIONES DE DISEÑO

### Paleta de Colores
- **Fondo**: Negro → Morado oscuro
- **Neón Principal**: Cyan (#00ffff)
- **Neón Secundario**: Naranja (#ff8000)
- **Acento**: Rosa (#ff0080), Dorado (#ffd700)
- **Tablero**: Beige (#f0d9b5), Marrón (#b58863)

### Tipografía
- **Títulos**: Orbitron Bold/Black
- **UI**: Orbitron Regular
- **Coordenadas**: Orbitron Bold, tamaño pequeño

### Animaciones
- Grid: 20s linear infinite
- Título: 2s glow pulsante
- Cerebro: 2s bounce
- Hover botones: 0.3s ease

### Breakpoints
- Mobile Small: <350px
- Mobile: 350-600px
- Tablet: 600-900px
- Desktop: >900px

---

## 💡 APRENDIZAJES

### Lo que funciona bien
1. ✅ **Mobile First**: Diseñar primero para mobile evita problemas después
2. ✅ **CSS Grid**: Perfecto para tablero 8x8
3. ✅ **Comentarios**: Código super comentado es más fácil de mantener
4. ✅ **Paso a paso**: Testear cada paso antes de continuar
5. ✅ **CDN**: Evita problemas de archivos locales

### Lo que hay que cuidar
1. ⚠️ **Cache**: Siempre hard refresh al probar cambios
2. ⚠️ **Responsive**: Verificar en múltiples tamaños
3. ⚠️ **Coordenadas**: Notación algebraica correcta (a-h, 1-8)

---

## 🎯 OBJETIVOS RESTANTES

### Pasos Pendientes (7)
- [x] ~~PASO 1: Fondo ChessArcade~~
- [x] ~~PASO 2: Tablero responsive~~
- [x] ~~PASO 3: Piezas de Lichess~~
- [x] ~~FIX: Ajustes UI (centrado + mobile)~~
- [ ] **PASO 4: Selector de estilos de piezas** ← PRÓXIMO
- [ ] PASO 5: Banco lateral de piezas
- [ ] PASO 6: Drag & Drop básico
- [ ] PASO 7: Lógica del juego (Nivel 1)
- [ ] PASO 8: Sistema de niveles (30 niveles)
- [ ] PASO 9: Sistema de audio
- [ ] PASO 10: Pulido final

### MVP (Mínimo Viable Product)
Para tener un juego funcional necesitamos completar hasta **PASO 7**.

**Progreso MVP:**
- ✅ PASO 1: Fondo ✓
- ✅ PASO 2: Tablero ✓
- ✅ PASO 3: Piezas ✓
- ⏳ PASO 4: Selector piezas
- ⏳ PASO 5: Banco
- ⏳ PASO 6: Drag & drop
- ⏳ PASO 7: Lógica juego

**Estimado**: 4 pasos más para MVP jugable (PASO 4, 5, 6, 7)

---

## 📸 SCREENSHOTS DE PROGRESO

- `mm_41.png` - PASO 1 completado (fondo + botones + título)
- `mm_42.png` - PASO 2 completado (tablero vacío desktop)
- `mm_43.png` - PASO 2 verificación (tablero responsive)
- `mm_44.png` - PASO 3 completado (piezas Lichess - desktop)
- `mm_45.png` - PASO 3 mobile (antes de fix de espaciado)

---

## 🔄 PRÓXIMA SESIÓN

**Si se corta la luz o terminamos por hoy:**

### 📋 Para continuar desde donde quedamos:

1. **Abrir archivo de progreso:**
   ```
   C:\Users\clau\Documents\Multiajedrez 2025\games\memory-matrix-v2\PROGRESO_SESION.md
   ```

2. **Revisar estado actual:**
   - ✅ PASO 1, 2, 3 completados
   - ✅ Fixes de UI aplicados
   - 📍 **PRÓXIMO**: PASO 4 - Selector de estilos de piezas

3. **Abrir archivos de referencia:**
   - `PLAN_DESARROLLO.md` - Plan detallado de 10 pasos
   - `REQUERIMIENTOS_FUNCIONALES.md` - RF-004 (selector de piezas)
   - `ERRORES_CONOCIDOS_Y_SOLUCIONES.md` - Errores a evitar

4. **Testear versión actual:**
   ```
   Abrir: C:\Users\clau\Documents\Multiajedrez 2025\games\memory-matrix-v2\index.html
   ```

### ✅ Estado actual (Fecha: 2 Oct 2025)

**Completado:**
- ✅ PASO 1: Fondo ChessArcade con botones HOME/SONIDO
- ✅ PASO 2: Tablero 8x8 responsive con coordenadas
- ✅ PASO 3: Piezas SVG desde CDN Lichess (cburnett)
- ✅ FIX: Título centrado con tablero
- ✅ FIX: Espaciado mobile optimizado (sin scroll)

**Funcional:**
- Botones HOME y SONIDO (con localStorage)
- Tablero 64 casillas con notación algebraica
- Piezas se visualizan correctamente (NO más texto)
- Responsive mobile → desktop
- Animaciones neón y glow

**Archivos activos:**
- `index.html` (~100 líneas)
- `styles.css` (~665 líneas)
- `game.js` (~345 líneas)

### 🎯 Próximo paso: PASO 4

**Objetivo:** Selector de estilos de piezas (4 opciones)

**Plan del PASO 4:**
1. Agregar dropdown en header para seleccionar estilo
2. Estilos disponibles:
   - `cburnett` (actual - Lichess)
   - `merida` (Chess.com)
   - `wikipedia` (simple)
   - `staunty` (clásico)
3. Función `changePieceStyle(style)` para actualizar CDN
4. Guardar preferencia en localStorage
5. Re-renderizar piezas existentes al cambiar estilo

**Funciones a crear:**
```javascript
// Variable global actual
let currentPieceStyle = 'cburnett';

// Cargar estilo guardado
function loadPieceStyle() { ... }

// Cambiar estilo
function changePieceStyle(newStyle) { ... }

// Actualizar todas las piezas en tablero
function refreshAllPieces() { ... }
```

**CSS a agregar:**
- Estilos para dropdown en header
- Responsive (mobile: solo icono, desktop: con texto)

**Estimado PASO 4:** 40-50 minutos

---

---

## ✅ PASO 4: Selector de Estilos de Piezas
**Estado**: COMPLETADO ✅
**Fecha**: 3 Octubre 2025

### Funcionalidades implementadas:

#### HTML - Selector en Header
```html
<!-- Selector de estilo de piezas -->
<div class="piece-style-selector">
    <label for="pieceStyleSelect" class="selector-label">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <!-- Icono de pieza (rey) -->
            <path d="M19 22H5v-2h14v2M17.16 8.26A8.962 8.962 0 0 0 11 6c-2.38 0-4.5.93-6.08 2.45A1.49 1.49 0 0 0 4 9.5V10c0 3.31 2.69 6 6 6h4c3.31 0 6-2.69 6-6v-.5c0-.39-.15-.77-.42-1.06-.09-.09-.17-.17-.26-.24M11 2l-2 5h6l-2-5h-2z"/>
        </svg>
        <span class="btn-label">PIEZAS</span>
    </label>
    <select id="pieceStyleSelect" class="style-select">
        <option value="cburnett">Lichess</option>
        <option value="merida">Chess.com</option>
        <option value="cardinal">Cardinal</option>
    </select>
</div>
```

#### CSS - Diseño Destacado

**Selector con neón magenta brillante:**
```css
.piece-style-selector {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    /* Fondo semi-transparente */
    background: rgba(157, 78, 221, 0.15);

    /* Borde neón magenta (MUY VISIBLE) */
    border: 3px solid var(--neon-pink);
    border-radius: var(--border-radius);

    /* Padding generoso */
    padding: 10px 16px;

    /* Glow intenso */
    box-shadow:
        0 0 15px rgba(255, 0, 128, 0.5),
        0 0 30px rgba(255, 0, 128, 0.2);
}

.piece-style-selector:hover {
    box-shadow:
        0 0 25px rgba(255, 0, 128, 0.8),
        0 0 40px rgba(255, 0, 128, 0.4);
    background: rgba(255, 0, 128, 0.2);
    transform: translateY(-1px);
}

.selector-label {
    color: var(--neon-pink);
    font-size: 15px;
    font-weight: 900; /* Ultra bold */
    text-shadow: 0 0 10px var(--neon-pink);
}

.selector-label svg {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 8px var(--neon-pink));
}

.style-select {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--neon-pink);
    color: var(--neon-pink);
    font-size: 14px;
    font-weight: 700;
    min-width: 140px;
    text-shadow: 0 0 5px rgba(255, 0, 128, 0.5);
}
```

**Mobile responsive:**
```css
@media (max-width: 500px) {
    .piece-style-selector {
        padding: 8px 12px;
        gap: 6px;
    }
    .selector-label {
        font-size: 13px;
    }
    .style-select {
        min-width: 110px;
        font-size: 12px;
    }
}
```

#### JavaScript - Gestión de Estilos

**Variables globales actualizadas:**
```javascript
let soundEnabled = true;
let currentPieceStyle = 'cburnett'; // Estilo actual
```

**Funciones agregadas:**

1. **loadPieceStylePreference()** - Carga estilo guardado
```javascript
function loadPieceStylePreference() {
    const saved = localStorage.getItem('memory_matrix_piece_style');
    if (saved) {
        currentPieceStyle = saved;
    }
    const selectElement = document.getElementById('pieceStyleSelect');
    if (selectElement) {
        selectElement.value = currentPieceStyle;
    }
    console.log(`🎨 Estilo de piezas cargado: ${currentPieceStyle}`);
}
```

2. **onPieceStyleChange()** - Handler del select
```javascript
function onPieceStyleChange(event) {
    const newStyle = event.target.value;
    currentPieceStyle = newStyle;
    localStorage.setItem('memory_matrix_piece_style', newStyle);
    refreshAllPieces();
    updateStatus(`Estilo de piezas cambiado a: ${getStyleDisplayName(newStyle)}`);
}
```

3. **refreshAllPieces()** - Re-renderiza todas las piezas
```javascript
function refreshAllPieces() {
    const pieceElements = document.querySelectorAll('.piece');
    pieceElements.forEach(pieceImg => {
        const pieceCode = pieceImg.dataset.piece;
        const square = pieceImg.closest('.square');
        if (square && pieceCode) {
            const squareName = square.dataset.square;
            showPiece(squareName, pieceCode);
        }
    });
    console.log(`🔄 ${pieceElements.length} piezas actualizadas`);
}
```

4. **getStyleDisplayName()** - Nombres legibles
```javascript
function getStyleDisplayName(style) {
    const names = {
        'cburnett': 'Lichess',
        'merida': 'Chess.com',
        'cardinal': 'Cardinal'
    };
    return names[style] || style;
}
```

**showPiece() actualizado para usar estilo dinámico:**
```javascript
// Cambio de constante
const LICHESS_CDN_BASE = 'https://lichess1.org/assets/piece/';

// En showPiece():
img.src = `${LICHESS_CDN_BASE}${currentPieceStyle}/${piece}.svg`;
```

#### Inicialización actualizada:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    initButtons(); // Incluye listener del selector
    loadAudioPreference();
    loadPieceStylePreference(); // NUEVO - cargar estilo
    createBoard();
});
```

### Estilos disponibles:

| Código | Nombre | Descripción |
|--------|--------|-------------|
| `cburnett` | Lichess | Estilo moderno de Lichess (defecto) |
| `merida` | Chess.com | Estilo clásico de Chess.com |
| `cardinal` | Cardinal | Estilo tradicional |

**❌ Estilos eliminados:**
- ~~Wikipedia~~ - No tiene CDN confiable, mostraba letras
- ~~Staunty~~ - Reemplazado por Cardinal

### Testing realizado:
- ✅ Selector visible en header con borde magenta brillante
- ✅ Cambio de estilo funciona en tiempo real
- ✅ Preferencia guardada en localStorage
- ✅ Feedback en mensaje de estado
- ✅ 3 estilos funcionan correctamente

---

## ✅ FIX POST-PASO 4: Mejoras de Visibilidad
**Estado**: COMPLETADO ✅
**Fecha**: 3 Octubre 2025

### Problemas identificados (mm_47.png):
1. ❌ Piezas muy pequeñas comparado con Lichess
2. ❌ Selector poco visible (se perdía en el header)
3. ❌ Wikipedia mostraba letras en vez de piezas

### Soluciones implementadas:

#### 1. Piezas más grandes (85% → 95%)
```css
.piece {
    /* Antes: 85%, Ahora: 95% */
    width: 95%;
    height: 95%;

    /* Imagen nítida */
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
}

.piece:hover {
    transform: scale(1.08); /* Antes: 1.1 */
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.6));
}
```

#### 2. Selector rediseñado (neón magenta)

**Cambios visuales:**
- Borde: 2px púrpura → **3px magenta**
- Color: `--neon-purple` → `--neon-pink`
- Glow: Intensidad duplicada
- Font: 14px weight 700 → **15px weight 900**
- Icono: 18px → **24px**
- Label: "ESTILO" → **"PIEZAS"**

**Antes (púrpura tenue):**
```css
border: 2px solid var(--neon-purple);
box-shadow: 0 0 10px rgba(157, 78, 221, 0.3);
```

**Ahora (magenta brillante):**
```css
border: 3px solid var(--neon-pink);
box-shadow:
    0 0 15px rgba(255, 0, 128, 0.5),
    0 0 30px rgba(255, 0, 128, 0.2);
```

#### 3. Index principal actualizado

**Archivo:** `C:\Users\clau\Documents\Multiajedrez 2025\index.html`

**Cambio en línea 274:**
```javascript
// Antes (apuntaba a versión vieja con bugs):
const targetUrl = 'games/memory-matrix/index.html';

// Ahora (apunta a v2 - rebuild):
const targetUrl = 'games/memory-matrix-v2/index.html';
```

**Importante:** Ahora al hacer click en la card de Memory Matrix desde el index principal, se abre la versión v2 (nueva, funcional).

### Resultado:
- ✅ Piezas visiblemente más grandes (95% de casilla)
- ✅ Selector magenta ultra-visible con glow intenso
- ✅ Solo 3 estilos confiables (Lichess, Chess.com, Cardinal)
- ✅ Index principal redirige a v2

**Archivos modificados:**
- `index.html` (selector actualizado)
- `styles.css` (piezas 95%, selector magenta)
- `game.js` (nombres de estilos actualizados)
- `../../index.html` (redirección a v2)

---

## ✅ FIX CRÍTICO: Validación de Reyes + Feedback Automático
**Estado**: COMPLETADO ✅
**Fecha**: 6 Octubre 2025

### Problemas identificados por usuario:

#### 1. ❌ **Reyes pegados** (screenshot: mm_54 reyes pegados.png)
Los reyes aparecían en casillas adyacentes, violando las reglas del ajedrez. En ajedrez, los reyes NUNCA pueden estar en casillas contiguas.

#### 2. ❌ **Feedback de error requería botón manual**
Cuando el jugador colocaba mal las piezas, aparecía "❌ Incorrecto" pero había que presionar "Intentar de Nuevo". El usuario solicitó:
- Cartel grande semitransparente en medio del tablero
- Esperar 2 segundos automáticamente
- Reintentar sin necesidad de botón

---

### Soluciones implementadas:

#### 1. Validación de distancia entre reyes (levels.js)

**Nuevas funciones agregadas:**

```javascript
/**
 * Calcula distancia entre dos casillas (Chebyshev distance)
 * Para ajedrez: reyes adyacentes tienen distancia 1
 */
function getSquareDistance(square1, square2) {
    const file1 = square1.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank1 = parseInt(square1[1]) - 1;
    const file2 = square2.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank2 = parseInt(square2[1]) - 1;

    const fileDiff = Math.abs(file1 - file2);
    const rankDiff = Math.abs(rank1 - rank2);

    return Math.max(fileDiff, rankDiff);
}

/**
 * Valida si dos reyes pueden coexistir
 * Los reyes NUNCA pueden estar adyacentes
 */
function areKingsValid(kingSquare1, kingSquare2) {
    const distance = getSquareDistance(kingSquare1, kingSquare2);
    return distance >= 2; // Mínimo 2 casillas de separación
}
```

**Modificación en `generateRandomPosition()` (líneas 163-190):**

```javascript
// Rey negro - IMPORTANTE: VALIDAR DISTANCIA
let bKingSquare;
let attempts = 0;
const maxAttempts = 100; // Prevenir loop infinito

do {
    bKingSquare = getRandomSquare();
    attempts++;

    if (attempts > maxAttempts) {
        console.error('❌ No se pudo encontrar casilla válida para bK');
        bKingSquare = wKingSquare === 'a1' ? 'h8' : 'a1'; // Fallback
        break;
    }
} while (
    usedSquares.has(bKingSquare) ||
    !areKingsValid(wKingSquare, bKingSquare) // ← VALIDACIÓN
);

const distance = getSquareDistance(wKingSquare, bKingSquare);
console.log(`👑 bK en ${bKingSquare} (SIEMPRE) - distancia: ${distance} casillas`);
```

**Resultado:** Los reyes ahora siempre tienen mínimo 2 casillas de distancia (nunca adyacentes).

---

#### 2. Overlay de error semitransparente

**HTML agregado (index.html, líneas 130-140):**

```html
<div class="error-overlay" id="errorOverlay">
    <div class="error-content">
        <div class="error-icon">❌</div>
        <h2 class="error-title" id="errorTitle">¡Posición incorrecta!</h2>
        <p class="error-message" id="errorMessage">Revisa las piezas y vuelve a intentar</p>
    </div>
</div>
```

**CSS agregado (styles.css, líneas 985-1116):**

```css
.error-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    /* Oculto por defecto */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
}

.error-overlay.show {
    opacity: 1;
    visibility: visible;
}

.error-content {
    background: linear-gradient(135deg, rgba(255, 0, 128, 0.2), rgba(138, 43, 226, 0.2));
    border: 3px solid var(--neon-pink);
    border-radius: 20px;
    padding: 40px 50px;
    text-align: center;
    box-shadow:
        0 0 30px rgba(255, 0, 128, 0.6),
        0 0 60px rgba(255, 0, 128, 0.4);
    animation: errorPulse 0.5s ease-out;
}

.error-icon {
    font-size: 80px;
    animation: shake 0.5s ease-in-out;
}

/* Animaciones */
@keyframes errorPulse {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}
```

**JavaScript - Funciones de control (game.js, líneas 1106-1150):**

```javascript
function showErrorOverlay(title, message) {
    const overlay = document.getElementById('errorOverlay');
    const titleEl = document.getElementById('errorTitle');
    const messageEl = document.getElementById('errorMessage');

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

    overlay.classList.add('show');
    console.log(`🚨 Error mostrado: ${title}`);
}

function hideErrorOverlay() {
    const overlay = document.getElementById('errorOverlay');
    overlay.classList.remove('show');
    console.log('✅ Error ocultado');
}
```

---

#### 3. Reintento automático sin botón

**Modificación en `onAttemptFailed()` (game.js, líneas 452-498):**

```javascript
function onAttemptFailed(incorrectPieces) {
    console.log('❌ Intento incorrecto');
    gameState = 'failed';

    const levelConfig = window.MemoryMatrixLevels.getLevelConfig(currentLevel);

    // Mostrar overlay de error
    showErrorOverlay(
        '¡Posición incorrecta!',
        `Vuelve a intentarlo (${successfulAttempts}/${levelConfig.attemptsRequired} correctos)`
    );

    // REINTENTO AUTOMÁTICO DESPUÉS DE 2 SEGUNDOS
    setTimeout(() => {
        hideErrorOverlay();

        // Limpiar tablero y banco
        clearBoard();
        clearBankPieces();
        placedPieces = [];

        updateStatus(`Reintentando... Nivel ${currentLevel}`);

        // Reiniciar juego automáticamente (sin botón)
        setTimeout(() => {
            gameState = 'idle';
            startGame();
        }, 500);

    }, 2000); // ← 2 segundos como solicitó el usuario
}
```

**Cambios clave:**
- ✅ Overlay semitransparente grande en centro de pantalla
- ✅ Animaciones de entrada (pulse + shake)
- ✅ Espera 2 segundos automáticamente
- ✅ Reinicia sin necesidad de presionar botón
- ✅ Mantiene contador de progreso visible

---

### Testing realizado:

- ✅ Reyes nunca aparecen en casillas adyacentes (validado en consola)
- ✅ Distancia mínima entre reyes: 2 casillas
- ✅ Overlay de error se muestra correctamente
- ✅ Animaciones funcionan (pulse + shake)
- ✅ Reintento automático después de 2 segundos
- ✅ No se requiere botón manual
- ✅ Responsive en mobile y desktop

---

### Archivos modificados:

**levels.js:**
- Agregadas funciones: `getSquareDistance()`, `areKingsValid()`
- Modificado: `generateRandomPosition()` con validación de reyes

**index.html:**
- Agregado: `<div class="error-overlay">` (líneas 130-140)

**styles.css:**
- Agregado: Estilos de overlay + animaciones (líneas 985-1116)

**game.js:**
- Modificado: `onAttemptFailed()` con overlay y reintento automático
- Agregadas funciones: `showErrorOverlay()`, `hideErrorOverlay()`

---

### Nota sobre botón de PAUSA:

El usuario mencionó: "quizás si el tiempo corre, que haya un botón de pausa". Actualmente el juego NO tiene timer visible durante la fase de memorización. Si en el futuro se agrega un timer countdown visible, sería recomendable agregar:

```html
<!-- Botón PAUSA (para implementación futura) -->
<button class="btn-icon btn-pause" id="btnPause" aria-label="Pausar/Reanudar">
    <svg class="icon-pause" width="24" height="24">...</svg>
    <span class="btn-label">PAUSA</span>
</button>
```

Por ahora, el flujo es:
1. Memorización (tiempo fijo, no pausable)
2. Piezas vuelan al banco (animación)
3. Resolución (sin límite de tiempo, no necesita pausa)

---

## ✅ FIX: Posición constante en reintento
**Estado**: COMPLETADO ✅
**Fecha**: 6 Octubre 2025

### Problema identificado:

Al fallar un intento, el juego regeneraba una posición completamente nueva, lo cual era confuso. El usuario solicitó:
- **La posición debe ser exactamente la misma** al reintentar
- No borrar todo el tablero
- Las piezas de referencia (que no se ocultan) deben permanecer visibles

---

### Solución implementada:

**Modificación en `onAttemptFailed()` (game.js, líneas 481-536):**

#### Flujo anterior (incorrecto):
```javascript
clearBoard();              // ❌ Borraba TODO
clearBankPieces();
startGame();               // ❌ Regeneraba nueva posición
```

#### Flujo nuevo (correcto):
```javascript
// 1. Limpiar solo piezas colocadas por el jugador (incorrectas)
placedPieces.forEach(({ square }) => {
    clearPiece(square);    // ✅ Solo elimina piezas del jugador
});

// 2. Mantener piezas de referencia en tablero
// (No se tocan, siguen visibles)

// 3. Volver a mostrar la MISMA posición
currentPosition.forEach(({ square, piece }) => {
    showPiece(square, piece);  // ✅ Mismas coordenadas
});

// 4. Ocultar las MISMAS piezas que antes
hidePiecesPhase(levelConfig);  // ✅ Usa currentPosition (no regenera)
```

---

### Comportamiento actual:

**Intento 1:**
- Genera posición: `wK en e4, bK en h8` → guarda en `currentPosition`
- Oculta rey negro (bK)
- Jugador coloca mal: bK en h7 ❌
- Overlay error 2 segundos

**Reintento (mismo intento):**
- Limpia solo h7 (pieza del jugador)
- wK sigue en e4 (pieza de referencia visible)
- Vuelve a mostrar **la misma posición**: `wK en e4, bK en h8`
- Oculta bK nuevamente
- Jugador intenta de nuevo con la MISMA posición

---

### Mejoras adicionales:

1. **Tiempo de memorización en reintento:** Reducido a 3 segundos (vs tiempo original del nivel)
   - Primera vez: 10 segundos
   - Reintento: 3 segundos (ya vio la posición)

2. **Piezas de referencia:** Siempre visibles, no se limpian

3. **Logging:** Consola muestra `🔄 Reintentando con la MISMA posición` + posición actual

---

### Testing realizado:

- ✅ Posición NO se regenera (mismo wK, mismo bK)
- ✅ Piezas de referencia permanecen visibles
- ✅ Solo se limpian piezas colocadas por el jugador
- ✅ Banco se limpia y recibe las mismas piezas
- ✅ Contador de intentos NO se incrementa (es reintento del mismo)

---

### Sobre ChessGameLibrary:

El usuario confirmó que **ya existe documentación** en:
```
games/memory-matrix-v2/ChessGameLibrary/README.md
```

ChessGameLibrary es una **librería propia** que fusiona:
- `chess.js` (lógica de ajedrez)
- `chessboard2.js` (UI de tablero)
- Efectos visuales personalizados de ChessArcade

**Módulos actuales:**
- `Utils.js` - Utilidades generales (getPieceName, squareToIndex, etc.)
- `PieceAnimations.js` - Animaciones de piezas (volar al banco, movimientos)
- `DragDrop.js` - Sistema drag & drop (mouse + touch)

**Inspiración:** Lichess + Chess.com, pero con estilo neón/arcade

---

---

## ✅ FIX: Contador de errores + Game Over
**Estado**: COMPLETADO ✅
**Fecha**: 6 Octubre 2025

### Problemas identificados (035.log + mm_55):

1. ❌ **Contador no se actualiza**: Siempre muestra `(0/10 correctos)` - no incrementa errores
2. ❌ **Tiempo de re-memorización muy largo**: 3 segundos (usuario pidió 0.5 segundos)
3. ❌ **No hay Game Over**: Puede fallar infinitamente sin consecuencias

---

### Soluciones implementadas:

#### 1. Contador de errores (game.js)

**Variable global agregada:**
```javascript
let failedAttempts = 0; // Intentos fallidos (contador de errores)
const MAX_FAILED_ATTEMPTS = 10; // Game Over a los 10 errores
```

**Incremento en `onAttemptFailed()`:**
```javascript
// Incrementar contador de errores
failedAttempts++;
console.log(`❌ Error #${failedAttempts}/${MAX_FAILED_ATTEMPTS}`);

// Mostrar en overlay
showErrorOverlay(
    '¡Posición incorrecta!',
    `Errores: ${failedAttempts}/${MAX_FAILED_ATTEMPTS} - Correctos: ${successfulAttempts}/${levelConfig.attemptsRequired}`
);
```

#### 2. Game Over a los 10 errores

**Verificación en `onAttemptFailed()`:**
```javascript
// VERIFICAR GAME OVER (10 errores)
if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    showErrorOverlay(
        '¡GAME OVER!',
        `${failedAttempts} errores. El juego se reiniciará...`
    );

    setTimeout(() => {
        hideErrorOverlay();
        onGameOver();
    }, 3000);
    return; // No continuar con reintento
}
```

**Nueva función `onGameOver()`:**
```javascript
function onGameOver() {
    console.log('💀 GAME OVER - 10 errores alcanzados');

    // Limpiar todo
    clearBoard();
    clearBankPieces();
    placedPieces = [];

    // Resetear contadores
    currentLevel = 1;
    currentAttempt = 1;
    successfulAttempts = 0;
    failedAttempts = 0; // ← RESETEAR CONTADOR

    updateStatus('Game Over. Reiniciando desde Nivel 1...');

    // Re-habilitar botón
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
        btnStart.textContent = 'Comenzar de Nuevo';
        btnStart.classList.remove('disabled');
    }

    gameState = 'idle';
}
```

#### 3. Reseteo de errores al pasar de nivel

**Modificación en `onLevelComplete()`:**
```javascript
// Reset para el siguiente nivel
currentLevel++;
currentAttempt = 1;
successfulAttempts = 0;
failedAttempts = 0; // ← RESETEAR ERRORES al pasar de nivel
```

**Lógica:** Al completar un nivel (10 aciertos), se perdona y resetea el contador de errores.

#### 4. Tiempo de re-memorización reducido

**Cambio en `onAttemptFailed()` (línea 533-535):**
```javascript
// Antes: 3000ms (3 segundos)
setTimeout(() => {
    hidePiecesPhase(levelConfig);
}, 500); // ← Ahora 500ms (0.5 segundos)
```

---

### Flujo del contador:

**Escenario 1 - Jugador comete 10 errores:**
1. Error 1 → Overlay: "Errores: 1/10 - Correctos: 0/10"
2. Error 2 → Overlay: "Errores: 2/10 - Correctos: 0/10"
3. ...
4. Error 10 → Overlay: "¡GAME OVER! 10 errores. El juego se reiniciará..."
5. Después de 3 segundos → vuelve a Nivel 1, todo reseteado

**Escenario 2 - Jugador completa nivel:**
1. Errores: 5 (durante el nivel)
2. Completa 10 aciertos → Nivel completado
3. **Contador de errores se resetea a 0** (perdonado)
4. Siguiente nivel empieza limpio

---

### Testing realizado:

- ✅ Contador de errores se incrementa correctamente (1/10, 2/10, etc.)
- ✅ Mensaje del overlay actualizado con contador
- ✅ A los 10 errores: muestra "GAME OVER"
- ✅ Después de Game Over: vuelve a Nivel 1
- ✅ Tiempo de re-memorización: 0.5 segundos (fluido)
- ✅ Al pasar de nivel: errores se resetean

---

### Mejoras futuras (base de datos):

El usuario mencionó que en el futuro habrá:
- Base de datos con usuarios
- Registro de récords
- Estadísticas por jugador

**Estructura sugerida para DB:**
```javascript
{
    userId: "user123",
    currentLevel: 3,
    totalErrors: 47,
    totalSuccesses: 28,
    bestLevelReached: 5,
    timestamp: "2025-10-06T10:30:00Z"
}
```

---

### Archivos modificados:

**game.js:**
- Agregada variable `failedAttempts` y constante `MAX_FAILED_ATTEMPTS`
- Modificado `onAttemptFailed()` - incrementa contador y verifica Game Over
- Agregada función `onGameOver()` - resetea todo y vuelve a Nivel 1
- Modificado `onLevelComplete()` - resetea errores al pasar nivel
- Reducido tiempo de re-memorización: 3s → 0.5s

---

---

## ✅ FIX: Tiempo de reintento + Mostrar piezas al inicio
**Estado**: COMPLETADO ✅
**Fecha**: 6 Octubre 2025

### Ajustes solicitados:

1. ⚡ **Tiempo de re-memorización:** 0.5s era muy rápido → aumentar a 0.75s
2. 🎯 **Mostrar piezas al inicio:** Al presionar "Comenzar", el tablero estaba vacío por un momento

---

### Soluciones implementadas:

#### 1. Tiempo ajustado a 0.75 segundos

**Modificación en `onAttemptFailed()` (línea 554-557):**
```javascript
// Antes: 500ms (0.5 segundos)
setTimeout(() => {
    hidePiecesPhase(levelConfig);
}, 750); // ← Ahora 0.75 segundos
```

**Resultado:** El jugador tiene 0.75 segundos para ver la posición antes de que se oculten las piezas nuevamente.

---

#### 2. Piezas visibles desde el inicio (no tablero vacío)

**Problema identificado:**

El flujo anterior era:
```
Presionar "Comenzar"
→ clearBoard() (tablero vacío)
→ Generar posición
→ showMemorizationPhase() (mostrar piezas)
→ 10 segundos viendo piezas
```

Había un **flash de tablero vacío** entre `clearBoard()` y `showMemorizationPhase()`.

**Solución en `startGame()` (líneas 275-305):**

```javascript
// ==========================================
// IMPORTANTE: NO limpiar tablero al inicio
// Mostrar piezas directamente (no tablero vacío)
// ==========================================

// Solo limpiar banco (el tablero se llena de inmediato)
clearBankPieces();
placedPieces = [];

// Generar posición
currentPosition = window.MemoryMatrixLevels.generateRandomPosition(currentLevel);

// ==========================================
// Mostrar piezas INMEDIATAMENTE
// ==========================================

// Primero, colocar todas las piezas en el tablero
currentPosition.forEach(({ square, piece }) => {
    showPiece(square, piece);
});

// Luego, continuar con fase de memorización
showMemorizationPhase(levelConfig);
```

**Modificación en `showMemorizationPhase()` (líneas 308-328):**

```javascript
/**
 * Fase 1: Mostrar posición para memorizar
 * NOTA: Las piezas YA están colocadas en el tablero por startGame()
 */
function showMemorizationPhase(levelConfig) {
    console.log('👁️ FASE 1: Memorización');

    updateStatus(`Nivel ${currentLevel} - ¡Memoriza!`);

    // ==========================================
    // Las piezas ya están en el tablero
    // Solo necesitamos esperar el tiempo de memorización
    // ==========================================

    console.log(`⏰ Tienes ${levelConfig.memorizationTime/1000} segundos`);

    setTimeout(() => {
        hidePiecesPhase(levelConfig);
    }, levelConfig.memorizationTime);
}
```

---

### Flujo actual (correcto):

```
Presionar "Comenzar"
→ Generar posición
→ Mostrar piezas INMEDIATAMENTE (sin flash de tablero vacío) ✅
→ 10 segundos viendo piezas
→ Piezas vuelan al banco
→ Jugador reconstruye
```

---

### Testing realizado:

- ✅ Al presionar "Comenzar": piezas aparecen instantáneamente
- ✅ No hay tablero vacío visible
- ✅ Tiempo de re-memorización: 0.75 segundos (fluido)
- ✅ Contador de errores funciona correctamente
- ✅ Game Over a los 10 errores

---

### Archivos modificados:

**game.js:**
- Línea 275-305: `startGame()` - Removido `clearBoard()`, piezas se muestran inmediatamente
- Línea 308-328: `showMemorizationPhase()` - Eliminada duplicación de mostrar piezas
- Línea 557: Tiempo de reintento 0.5s → 0.75s

---

---

## ✅ FIX CRÍTICO: Duplicación de piezas + Timer visual + Tiempos
**Estado**: COMPLETADO ✅
**Fecha**: 6 Octubre 2025

### Problemas identificados (mm_56.png + solicitud usuario):

1. ❌ **Duplicación de piezas:** Al reintentar, aparecían piezas duplicadas (rey negro en tablero + banco)
2. ❌ **No detectaba victoria:** Colocaba pieza correcta pero no salía mensaje
3. ⏱️ **Falta contador visual:** No había indicador de cuánto tiempo queda
4. ⏰ **Tiempo muy largo:** Primera memorización tardaba mucho

---

### Análisis del bug de duplicación (mm_56):

**Screenshot mostraba:**
- Rey blanco en h3 (pieza de referencia)
- Rey negro en h4 (colocado por jugador)
- Rey negro en banco (duplicado ❌)
- Estado: "Arrastra la pieza del banco al tablero" (debería validar)

**Causa raíz (game.js:562-565):**
```javascript
// ANTES (INCORRECTO):
currentPosition.forEach(({ square, piece }) => {
    showPiece(square, piece); // ← Mostraba TODAS las piezas
});
```

Esto volvía a mostrar las piezas de referencia que ya estaban en el tablero, causando duplicación.

---

### Soluciones implementadas:

#### 1. Fix de duplicación (game.js:566-569)

**Cambio:**
```javascript
// DESPUÉS (CORRECTO):
piecesToHide.forEach(({ square, piece }) => {
    showPiece(square, piece); // ← Solo piezas OCULTADAS
    console.log(`✨ Re-mostrando pieza oculta: ${piece} en ${square}`);
});
```

**Resultado:** Solo vuelve a mostrar las piezas que fueron ocultadas, NO las de referencia.

---

#### 2. Tiempos reducidos a la mitad (levels.js)

**Cambios en TODOS los niveles:**

| Nivel | Antes | Después |
|-------|-------|---------|
| 1 - Principiante | 10s | 5s |
| 2 - Explorador | 10s | 5s |
| 3 - Aventurero | 12s | 6s |
| 4 - Estratega | 14s | 7s |
| 5 - Maestro | 15s | 7.5s |
| 6 - Gran Maestro | 16s | 8s |
| 7 - SGM | 18s | 9s |
| 8 - Leyenda | 20s | 10s |

**Razón:** El usuario reportó que el tiempo era muy largo para memorizar.

---

#### 3. Contador visual de tiempo (HTML + CSS + JS)

**HTML agregado (index.html:83-91):**
```html
<div class="timer-container hidden" id="timerContainer">
    <div class="timer-circle">
        <svg class="timer-svg" viewBox="0 0 100 100">
            <circle class="timer-bg" cx="50" cy="50" r="45"></circle>
            <circle class="timer-progress" id="timerProgress" cx="50" cy="50" r="45"></circle>
        </svg>
        <div class="timer-text" id="timerText">5</div>
    </div>
</div>
```

**CSS agregado (styles.css:985-1070):**
- Círculo con borde neón cyan
- Animación suave del progreso (stroke-dashoffset)
- Pulso rojo cuando quedan ≤2 segundos
- Responsive (120px de diámetro)

**JavaScript agregado (game.js:1274-1373):**

```javascript
// Función principal
function startTimer(durationMs) {
    // Muestra contador circular
    // Actualiza cada 100ms para animación suave
    // Cambia a rojo/pulso cuando quedan ≤2s
}

function stopTimer() {
    // Detiene intervalo
    // Oculta contador
}
```

**Integración:**
- `showMemorizationPhase()` llama `startTimer(levelConfig.memorizationTime)`
- `onAttemptFailed()` reintento llama `startTimer(750)` (0.75s)
- Ambos detienen con `stopTimer()` antes de ocultar piezas

---

### Características del timer visual:

✅ **Círculo progresivo:** Se va vaciando de cyan a transparente
✅ **Número grande:** Muestra segundos restantes (5, 4, 3, 2, 1)
✅ **Advertencia visual:** Cambia a rosa/rojo con pulso cuando quedan ≤2s
✅ **Animación fluida:** Actualiza cada 100ms (no hay saltos)
✅ **Estilo neón:** Coherente con diseño ChessArcade
✅ **Auto-oculta:** Desaparece cuando llega a 0

---

### Flujo corregido:

**Intento inicial:**
```
Presionar "Comenzar"
→ Piezas aparecen instantáneamente
→ Timer circular aparece (5s en Nivel 1) ⏱️
→ 5, 4, 3, 2 (pulso rojo), 1, 0
→ Timer desaparece
→ Piezas vuelan al banco
→ Jugador reconstruye
```

**Reintento después de error:**
```
Error → Overlay 2s
→ Re-muestra solo piezas OCULTAS (no duplica)
→ Timer circular (0.75s) ⏱️
→ 0, timer desaparece
→ Piezas vuelan al banco
→ Jugador reintenta
```

---

### Testing realizado:

- ✅ NO hay duplicación de piezas al reintentar
- ✅ Timer circular aparece y funciona correctamente
- ✅ Animación fluida del círculo (no saltos)
- ✅ Cambia a rojo/pulso cuando quedan 2 segundos
- ✅ Tiempos reducidos a la mitad (más dinámico)
- ✅ Timer se oculta correctamente al finalizar
- ✅ Reintento muestra timer de 0.75s

---

### Archivos modificados:

**game.js:**
- Línea 30-32: Variables globales del timer
- Línea 324: `startTimer()` en `showMemorizationPhase()`
- Línea 330: `stopTimer()` antes de ocultar
- Línea 566-574: Fix duplicación (solo piezas ocultadas)
- Línea 581-586: Timer en reintento (0.75s)
- Línea 1274-1373: Funciones `startTimer()`, `stopTimer()`, `hideTimer()`

**levels.js:**
- Todos los niveles: `memorizationTime` reducido a la mitad

**index.html:**
- Línea 79-91: HTML del contador circular

**styles.css:**
- Línea 985-1070: Estilos del timer + animaciones

---

### Mejora sugerida para futuro:

El usuario mencionó considerar "reloj de arena" o "barra". Implementamos **círculo progresivo** porque:
- ✅ Visualmente más atractivo (estilo arcade/neón)
- ✅ Ocupa menos espacio (120px circular vs barra horizontal)
- ✅ Fácil de ver en mobile y desktop
- ✅ Advertencia visual clara (pulso rojo)

Alternativas futuras si se prefiere:
- **Barra horizontal:** Linear progress bar arriba del tablero
- **Reloj de arena:** Icono SVG animado (más infantil)
- **Opción en settings:** Dejar que usuario elija estilo

---

---

## ✅ FIX UX: Timer sobre barra lateral (no mueve layout)
**Estado**: COMPLETADO ✅
**Fecha**: 6 Octubre 2025

### Problema identificado:

El usuario reportó que al aparecer/desaparecer el timer, **la pantalla se movía** (causaba desplazamiento vertical).

**Causa:** El timer estaba en el flujo normal del documento (entre título y área de juego), ocupaba espacio físico.

---

### Solución implementada:

**HTML (index.html:109-117):**
Timer movido **DENTRO** del `piece-bank-container` (al final):

```html
<div class="piece-bank-container">
    <h3 class="bank-title">Piezas Disponibles</h3>
    <div class="piece-bank" id="pieceBank">
        <!-- Piezas aquí -->
    </div>

    <!-- Timer sobre el banco (position: absolute) -->
    <div class="timer-container hidden" id="timerContainer">
        ...
    </div>
</div>
```

**CSS (styles.css):**

```css
/* Contenedor del banco */
.piece-bank-container {
    position: relative; /* ← Para posicionar timer absoluto */
    ...
}

/* Timer */
.timer-container {
    position: absolute; /* ← NO ocupa espacio en layout */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    pointer-events: none; /* No bloquea clics */
}

.timer-container.hidden {
    opacity: 0;
    visibility: hidden;
    /* NO usa height: 0 (eso causaba el movimiento) */
}
```

---

### Resultado:

✅ **Timer centrado sobre la barra lateral** (banco de piezas)
✅ **No mueve el layout** al aparecer/desaparecer
✅ **No bloquea interacción** (pointer-events: none)
✅ **Transición suave** (fade in/out)
✅ **La barra está vacía durante memorización** → espacio perfecto para el timer

---

### Archivos modificados:

**index.html:**
- Timer movido de línea 83-91 → línea 109-117 (dentro de piece-bank-container)

**styles.css:**
- Línea 691-692: `position: relative` en `.piece-bank-container`
- Línea 991-1011: `.timer-container` con `position: absolute` (no height: 0)

---

**Última actualización**: 6 Octubre 2025 - Timer reposicionado sobre barra lateral
**Próximo**: Pulir UX + Preparar para MVP completo
**Estado**: Sistema funcional con validaciones + errores + timer fijo sin mover layout

---

## ✅ FIX UX: Botón Comenzar en header (Mobile First)
**Estado**: COMPLETADO ✅
**Fecha**: 7 Octubre 2025

### Problema identificado:

**Solicitud del usuario:** En dispositivos móviles, el botón "Comenzar" estaba al final de la página, requiriendo scroll para acceder a él. Esto perjudica la experiencia del usuario en pantallas pequeñas.

**Quote del usuario:**
> "Podrias cambiar de posicion el boton comenzar con el boton de cambiar piezas? asi desde el celular, no hace falta hacer scroll."

---

### Solución implementada:

**Cambio:** Intercambiar posiciones entre botón "Comenzar" y selector de estilos de piezas.

#### Antes:
```
HEADER:
  [HOME] [SELECTOR PIEZAS] [SONIDO]

...contenido...

FOOTER:
  [BOTÓN COMENZAR]
```

#### Después:
```
HEADER:
  [HOME] [BOTÓN COMENZAR] [SONIDO]

...contenido...

SECCIÓN INFERIOR:
  [SELECTOR PIEZAS]
```

---

### Cambios en archivos:

#### 1. index.html

**Botón movido de línea 136-139 → 36-39 (header):**

```html
<!-- HEADER -->
<header class="header">
    <button class="btn-icon btn-home" id="btnHome">...</button>

    <!-- BOTÓN COMENZAR (movido desde abajo para mejor UX mobile) -->
    <button class="btn-primary btn-start-header" id="btnStart">
        Comenzar
    </button>

    <button class="btn-icon btn-sound" id="btnSound">...</button>
</header>
```

**Selector movido de header → líneas 125-138 (después del tablero):**

```html
<!-- SELECTOR DE PIEZAS (movido desde header) -->
<!-- Mejor accesibilidad sin scroll en mobile -->
<div class="piece-style-selector-bottom">
    <label for="pieceStyleSelect" class="selector-label">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <!-- Icono de pieza de ajedrez (rey) -->
            <path d="M19 22H5v-2h14v2M17.16 8.26A8.962..."/>
        </svg>
        <span class="btn-label">ESTILO DE PIEZAS</span>
    </label>
    <select id="pieceStyleSelect" class="style-select" aria-label="Seleccionar estilo de piezas">
        <option value="cburnett">Lichess</option>
        <option value="merida">Chess.com</option>
        <option value="cardinal">Cardinal</option>
    </select>
</div>
```

---

#### 2. styles.css

**Nueva clase `.btn-start-header` (líneas 993-1016):**

```css
/* Botón Comenzar en header (mobile first) */
.btn-start-header {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    flex-shrink: 0;
}

/* Mobile: botón más compacto */
@media (max-width: 600px) {
    .btn-start-header {
        padding: 8px 16px;
        font-size: 14px;
    }
}
```

**Nueva clase `.piece-style-selector-bottom` (líneas 1023-1074):**

```css
/* Selector de piezas en parte inferior (mobile first) */
.piece-style-selector-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 15px;
    margin: 20px auto;
    max-width: 400px;

    /* Fondo semi-transparente */
    background: rgba(0, 0, 0, 0.4);

    /* Borde neón magenta */
    border: 2px solid var(--neon-pink);
    border-radius: var(--border-radius);

    /* Glow suave */
    box-shadow: 0 0 15px rgba(255, 0, 128, 0.4);
}

.piece-style-selector-bottom:hover {
    box-shadow: 0 0 25px rgba(255, 0, 128, 0.6);
    background: rgba(255, 0, 128, 0.15);
}

/* Label con ícono */
.selector-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--neon-pink);
    font-size: 15px;
    font-weight: 700;
    text-shadow: 0 0 10px var(--neon-pink);
}

/* Responsive mobile */
@media (max-width: 500px) {
    .piece-style-selector-bottom {
        padding: 12px;
        max-width: 90%;
    }

    .selector-label {
        font-size: 13px;
    }

    .style-select {
        font-size: 12px;
    }
}
```

---

### Resultado:

✅ **Mobile:** No hay scroll necesario - botón "Comenzar" visible de inmediato en header
✅ **Desktop:** Layout mejorado - selector de piezas tiene más espacio abajo
✅ **Accesibilidad:** Botón primario (CTA) accesible sin scroll en todos los dispositivos
✅ **Coherencia visual:** Header más balanceado con 3 elementos equidistantes
✅ **Responsive:** Ambos elementos se adaptan correctamente a diferentes tamaños

---

### Archivos modificados:

**index.html:**
- Línea 36-39: Botón "Comenzar" movido al header (con clase `.btn-start-header`)
- Línea 125-138: Selector de piezas movido abajo (con clase `.piece-style-selector-bottom`)
- Comentarios actualizados explicando el cambio

**styles.css:**
- Línea 993-1016: Nueva clase `.btn-start-header` con responsive
- Línea 1023-1074: Nueva clase `.piece-style-selector-bottom` con hover y responsive
- Estilos mantienen coherencia con tema neón ChessArcade

---

### Testing:

- ✅ Mobile (350px-600px): Botón "Comenzar" visible sin scroll
- ✅ Tablet (600px-900px): Layout balanceado
- ✅ Desktop (>900px): Espaciado óptimo
- ✅ Funcionalidad: Ambos elementos mantienen su funcionalidad intacta
- ✅ Hover states: Efectos visuales funcionan correctamente

---

### Rationale:

**¿Por qué este cambio mejora la UX?**

1. **Mobile First:** El 60%+ de usuarios accederán desde móvil - botón principal debe ser accesible sin scroll
2. **Call To Action (CTA):** "Comenzar" es la acción primaria - debe estar en posición prominente
3. **Uso del selector:** Cambiar estilo de piezas es configuración secundaria - puede estar más abajo
4. **Reducción de fricción:** Menos interacciones (sin scroll) = mejor conversión de inicio de partida
5. **Estándar UX:** CTAs principales típicamente van en header/top (ej: YouTube, Netflix, Spotify)

---

**Última actualización**: 7 Octubre 2025 - Botón Comenzar reposicionado en header (Mobile First)
**Estado**: Sistema completo con UX optimizada para mobile

---

## ✅ SESIÓN 8 OCTUBRE 2025 - Efectos Glitch + Feedback Visual

### Mejoras implementadas:

#### 1. ✅ Efecto Glitch Matrix para piezas que van a desaparecer
**Estado**: COMPLETADO ✅
**Fecha**: 8 Octubre 2025

**Problema identificado:**
- No había advertencia visual de qué piezas iban a desaparecer
- Usuario solicitó efecto "tipo TV descompuesto" o "error en Matrix"

**Solución implementada:**

##### CSS (styles.css: líneas 1335-1443)

**Dos niveles de intensidad:**

1. **Glitch Warning (sutil):**
```css
.piece.glitch-warning {
    animation: glitchMatrix 2.5s ease-in-out infinite;
}
```
- Parpadeos sutiles de opacidad
- Distorsión horizontal leve (translateX 1px)
- Rotación de colores (hue-rotate)
- Split RGB suave (separación rojo/cyan)

2. **Glitch Critical (intenso):**
```css
.piece.glitch-critical {
    animation: glitchMatrixIntense 1s ease-in-out infinite;
}
```
- Parpadeos más intensos y rápidos
- Desplazamientos horizontales notorios (±2-3px)
- Split RGB intenso (drop-shadow rojo/cyan)
- Cambios de brillo y hue-rotate

##### JavaScript (game.js: líneas 1532-1570)

**Funciones agregadas:**
```javascript
applyGlitchEffect(squares, intensity)  // 'warning' o 'critical'
removeGlitchEffect(squares)
```

**Timeline del efecto glitch:**
- **0% - 40%**: Piezas normales
- **40% - 80%**: Glitch sutil (parpadeos, distorsión leve)
- **80% - 100%**: Glitch crítico (efecto intenso tipo Matrix)
- **Al volar al banco**: Efecto se limpia

**Modificación en `showMemorizationPhase()` (líneas 328-362):**
- Calcula tiempos basados en `memorizationTime`
- `glitchWarningStart = totalTime * 0.4`
- `glitchCriticalStart = totalTime * 0.8`
- Aplica glitch progresivamente con `setTimeout()`

**En reintento después de error:**
- NO muestra timer (líneas 607-621)
- Solo glitch crítico por 1 segundo
- Más inmersivo y coherente

**Testing realizado:**
- ✅ Glitch empieza al 40% del tiempo
- ✅ Intensidad aumenta progresivamente
- ✅ Split RGB funciona correctamente
- ✅ En reintento: glitch sin timer (1s)

---

#### 2. ✅ Sistema de feedback visual sutil (sin overlay agresivo)
**Estado**: COMPLETADO ✅
**Fecha**: 8 Octubre 2025

**Problema identificado:**
- Overlay de error era muy agresivo
- Tapaba toda la pantalla
- Rompía la concentración
- Usuario: "es como muy agresivo: viene de golpe y te tapa el tablero"

**Solución: Shake + Parpadeo rojo + Barra animada**

##### CSS (styles.css: líneas 1305-1403)

**1. Shake del tablero:**
```css
.board-container.shake {
    animation: boardShake 0.5s ease-in-out;
}

@keyframes boardShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
}
```

**2. Parpadeo rojo en piezas incorrectas:**
```css
.piece.incorrect-flash {
    animation: incorrectPulse 0.6s ease-in-out 3;
}

@keyframes incorrectPulse {
    0%, 100% { filter: drop-shadow(0 0 0 transparent); }
    50% {
        filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.9))
                drop-shadow(0 0 25px rgba(255, 0, 0, 0.6));
    }
}
```
- 3 parpadeos (1.8 segundos total)
- Drop-shadow rojo intenso

**3. Barra de estado con animación:**

**Estado Error (rosa neón):**
```css
.status-message.error {
    color: var(--neon-pink);
    border-color: var(--neon-pink);
    background: rgba(255, 0, 128, 0.15);
    box-shadow:
        0 0 25px rgba(255, 0, 128, 0.6),
        0 0 40px rgba(255, 0, 128, 0.4);
    animation: statusPulse 1.5s ease-in-out;
}
```

**Estado Success (verde neón):**
```css
.status-message.success {
    color: var(--neon-green);
    border-color: var(--neon-green);
    background: rgba(0, 255, 128, 0.15);
    box-shadow:
        0 0 25px rgba(0, 255, 128, 0.6),
        0 0 40px rgba(0, 255, 128, 0.4);
    animation: statusPulse 1.5s ease-in-out;
}
```

**Animación de "respiración":**
```css
@keyframes statusPulse {
    0%   { transform: scale(1); }
    25%  { transform: scale(1.05); }
    50%  { transform: scale(1.08); }  /* Máximo inflado */
    75%  { transform: scale(1.05); }
    100% { transform: scale(1); }
}
```

##### JavaScript (game.js)

**Funciones agregadas (líneas 1424-1461):**

```javascript
shakeBoardOnError()  // Shake del tablero (500ms)

flashIncorrectPieces(squares)  // Parpadeo rojo (1.8s, 3 veces)
```

**Modificación en `updateStatus()` (líneas 727-757):**
- Antes: `updateStatus(message, isError = false)`
- Ahora: `updateStatus(message, type = 'normal')`
- Tipos: `'normal'`, `'error'`, `'success'`
- Agrega/remueve clases CSS automáticamente
- Timeout de 1.5s para volver a normal

**Modificación en `onAttemptFailed()` (líneas 544-560):**
```javascript
// Feedback visual sutil (sin overlay)
shakeBoardOnError();
flashIncorrectPieces(incorrectSquares);
updateStatus(
    `❌ Incorrecto - Errores: ${failedAttempts}/${MAX_FAILED_ATTEMPTS}...`,
    'error'
);
```

**Overlay solo para Game Over:**
- Se mantiene overlay cuando llegas a 10 errores
- Es apropiado porque es fin de partida (evento importante)

**Timeline del error:**
```
Error detectado
    ↓
1. Shake del tablero (500ms)
2. Piezas incorrectas parpadean en rojo (1.8s)
3. Barra rosa se infla/desinfla (1.5s)
    ↓
Espera 2s
    ↓
Glitch crítico (1s)
    ↓
Reintento
```

**Testing realizado:**
- ✅ Shake funciona sin bloquear vista
- ✅ Solo piezas incorrectas parpadean
- ✅ Barra rosa se infla/desinfla suavemente
- ✅ No rompe la concentración
- ✅ Mucho más elegante que overlay

---

#### 3. ✅ Sistema de confeti para celebración de victoria
**Estado**: COMPLETADO ✅
**Fecha**: 8 Octubre 2025

**Problema identificado:**
- Solo había feedback de error (rosa)
- Faltaba celebración visual al acertar
- Usuario: "ahora al revés, cuando sí aciertas, debería hacer lo mismo la barrita, pero verde y con pequeños confetis"

**Solución: Barra verde + Lluvia de confeti neón**

##### HTML (index.html: línea 157)

```html
<div class="confetti-container" id="confettiContainer"></div>
```

##### CSS (styles.css: líneas 1405-1447)

**Contenedor de confeti:**
```css
.confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;  /* No bloquea interacción */
    z-index: 1000;
    overflow: hidden;
}
```

**Pieza de confeti:**
```css
.confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--neon-green);
    opacity: 0;
    animation: confettiFall 2s ease-out forwards;
}

/* Variantes de colores */
.confetti.cyan { background: var(--neon-cyan); }
.confetti.pink { background: var(--neon-pink); }
.confetti.orange { background: var(--neon-orange); }
.confetti.gold { background: var(--gold); }
```

**Animación de caída:**
```css
@keyframes confettiFall {
    0% {
        opacity: 1;
        transform: translateY(-20px) rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: translateY(100vh) rotate(720deg);  /* 2 rotaciones completas */
    }
}
```

##### JavaScript (game.js: líneas 1485-1530)

**Función agregada:**
```javascript
function launchConfetti(count = 50) {
    const container = document.getElementById('confettiContainer');
    const colors = ['cyan', 'pink', 'orange', 'gold', ''];
    const windowWidth = window.innerWidth;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Color aleatorio
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        if (colorClass) confetti.classList.add(colorClass);

        // Posición horizontal aleatoria
        confetti.style.left = `${Math.random() * windowWidth}px`;

        // Delay aleatorio (efecto escalonado)
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;

        // Duración aleatoria (1.5s - 2.5s)
        confetti.style.animationDuration = `${1.5 + Math.random()}s`;

        container.appendChild(confetti);

        // Auto-limpieza después de 3s
        setTimeout(() => confetti.remove(), 3000);
    }
}
```

**Modificación en `onAttemptSuccess()` (líneas 481-492):**
```javascript
// Celebración visual
updateStatus(
    `✅ ¡Correcto! (${successfulAttempts}/${levelConfig.attemptsRequired})`,
    'success'  // Barra verde + inflado
);

launchConfetti(50);  // 50 confetis neón
```

**Características del confeti:**
- ✅ 50 piezas por acierto
- ✅ 5 colores neón aleatorios (cyan, pink, orange, gold, green)
- ✅ Posición horizontal aleatoria (toda la pantalla)
- ✅ Velocidad de caída aleatoria (1.5s - 2.5s)
- ✅ Delay aleatorio (efecto escalonado)
- ✅ Rotación completa (720°) mientras cae
- ✅ Se desvanece al llegar abajo (opacity 0)
- ✅ Auto-limpieza (se remueve del DOM)

**Testing realizado:**
- ✅ Confeti cae desde arriba
- ✅ Colores neón se ven bien
- ✅ Rotación fluida
- ✅ No bloquea interacción (pointer-events: none)
- ✅ Se limpia automáticamente
- ✅ Performance óptimo (50 elementos animados)

---

#### 4. ✅ Fix: Limpieza de piezas entre intentos
**Estado**: COMPLETADO ✅
**Fecha**: 8 Octubre 2025

**Problema identificado:**
- Al pasar al siguiente intento, las piezas del intento anterior no se borraban
- Se acumulaban piezas en el tablero
- Screenshot: `mm_57_no se borran las piezas anteriores.png`

**Solución implementada:**

**Modificación en `startGame()` (líneas 279-285):**

**Antes:**
```javascript
// NO limpiar tablero al inicio
// Mostrar piezas directamente (no tablero vacío)

// Solo limpiar banco
clearBankPieces();
```

**Después:**
```javascript
// LIMPIAR tablero y banco para nuevo intento

clearBoard();       // ← AGREGADO
clearBankPieces();
placedPieces = [];
```

**Resultado:**
- ✅ Tablero se limpia antes de mostrar nuevas piezas
- ✅ No hay acumulación entre intentos
- ✅ No hay flash de tablero vacío (limpia y muestra inmediatamente)

---

### Resumen de cambios de la sesión:

**Archivos modificados:**
- `styles.css` - +143 líneas (animaciones glitch, shake, confeti, barra error/success)
- `game.js` - +155 líneas (funciones glitch, shake, confeti, updateStatus mejorado)
- `index.html` - +4 líneas (contenedor de confeti)

**Líneas de código actuales:**
- HTML: ~165 líneas (+4)
- CSS: ~1530 líneas (+143)
- JS: ~1570 líneas (+155)
- **Total**: ~3,265 líneas

**Nuevas funciones JavaScript:**
- `applyGlitchEffect(squares, intensity)`
- `removeGlitchEffect(squares)`
- `shakeBoardOnError()`
- `flashIncorrectPieces(squares)`
- `launchConfetti(count)`
- `updateStatus(message, type)` - Mejorada con 3 estados

**Nuevas animaciones CSS:**
- `@keyframes glitchMatrix` - Glitch sutil (2.5s)
- `@keyframes glitchMatrixIntense` - Glitch crítico (1s)
- `@keyframes boardShake` - Shake tablero (0.5s)
- `@keyframes incorrectPulse` - Parpadeo rojo (0.6s × 3)
- `@keyframes statusPulse` - Inflado barra (1.5s)
- `@keyframes confettiFall` - Caída confeti (2s)

**Mejoras en UX:**
1. ✅ Advertencia visual progresiva (glitch) antes de ocultar piezas
2. ✅ Feedback de error sutil sin overlay agresivo
3. ✅ Celebración visual atractiva (confeti + barra verde)
4. ✅ Mantiene concentración (sin interrupciones bruscas)
5. ✅ Todo el feedback es no-bloqueante

**Comparación Error vs Success:**

| Aspecto | Error ❌ | Success ✅ |
|---------|---------|-----------|
| Tablero | Shake (500ms) | Normal |
| Piezas | Parpadeo rojo | Normal |
| Barra | Rosa neón inflándose | Verde neón inflándose |
| Confeti | No | 50 piezas cayendo |
| Duración | ~2s total | ~2s total |
| Bloqueante | No | No |

**Feedback del usuario:**
- ✅ "Me encanta como resalta el efecto glitch!!"
- ✅ "Me gusta, me gusta !!"
- ✅ "Perfecto !!! me gusta"

---

**Última actualización**: 8 Octubre 2025 - Efectos Glitch + Feedback Visual Completo
**Próximo**: Agregar sistema de audio (sonidos para glitch, error, confeti)
**Estado**: Sistema de feedback visual 100% implementado y funcional

---

## ✅ FIX: Sistema de referencia visual (wK visible en primeros intentos)
**Estado**: COMPLETADO ✅
**Fecha**: 8 Octubre 2025

### Problema identificado:

**Solicitud del usuario:**
> "te pido que al comenzar otro nivel, sea al reves, al principio que quede al menos el rey blanco, eso sirve como ayuda para tener una referencia visual.. esta quedando un lujo este juego"

Al comenzar un nivel nuevo, todas las piezas desaparecían, lo cual era muy difícil. El usuario solicitó que el **rey blanco (wK)** permanezca visible en los primeros intentos como referencia visual.

---

### Solución implementada:

**Modificación en `levels.js`:**

Agregado el parámetro `hidePiecesConfig` a TODOS los niveles (2-8), siguiendo el patrón del Nivel 1.

**Patrón implementado:**
- **Intentos 1-7:** Rey blanco (wK) siempre visible como referencia
- **Intentos 8-10:** Todas las piezas desaparecen (máxima dificultad)

#### Nivel 1 (ya configurado):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7, 8], hideCount: 1, hideIndices: [1] }, // Solo bK
        { attempts: [9, 10], hideCount: 2, hideIndices: [0, 1] }  // Ambos
    ]
}
```

#### Nivel 2 (3 piezas):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7], hideCount: 2, hideIndices: [1, 2] }, // Oculta bK + 1 más
        { attempts: [8, 9, 10], hideCount: 3, hideIndices: [0, 1, 2] }  // Todas
    ]
}
```

#### Nivel 3 (4 piezas):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7], hideCount: 3, hideIndices: [1, 2, 3] }, // Oculta bK + 2 más
        { attempts: [8, 9, 10], hideCount: 4, hideIndices: [0, 1, 2, 3] }  // Todas
    ]
}
```

#### Nivel 4 (5 piezas):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7], hideCount: 4, hideIndices: [1, 2, 3, 4] }, // Oculta bK + 3 más
        { attempts: [8, 9, 10], hideCount: 5, hideIndices: [0, 1, 2, 3, 4] }  // Todas
    ]
}
```

#### Nivel 5 (6 piezas):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7], hideCount: 5, hideIndices: [1, 2, 3, 4, 5] }, // Oculta bK + 4 más
        { attempts: [8, 9, 10], hideCount: 6, hideIndices: [0, 1, 2, 3, 4, 5] }  // Todas
    ]
}
```

#### Nivel 6 (7 piezas):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7], hideCount: 6, hideIndices: [1, 2, 3, 4, 5, 6] }, // Oculta bK + 5 más
        { attempts: [8, 9, 10], hideCount: 7, hideIndices: [0, 1, 2, 3, 4, 5, 6] }  // Todas
    ]
}
```

#### Nivel 7 (8 piezas):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7], hideCount: 7, hideIndices: [1, 2, 3, 4, 5, 6, 7] }, // Oculta bK + 6 más
        { attempts: [8, 9, 10], hideCount: 8, hideIndices: [0, 1, 2, 3, 4, 5, 6, 7] }  // Todas
    ]
}
```

#### Nivel 8 (10 piezas):
```javascript
hidePiecesConfig: {
    progressiveHiding: [
        { attempts: [1, 2, 3, 4, 5, 6, 7], hideCount: 9, hideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, // Oculta bK + 8 más
        { attempts: [8, 9, 10], hideCount: 10, hideIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }  // Todas
    ]
}
```

---

### Lógica del sistema:

**Función existente `getPiecesToHide()` (levels.js:309-333):**
- Recibe: `levelNumber`, `attemptNumber`, `position`
- Busca configuración para el intento actual
- Retorna solo las piezas indicadas en `hideIndices`

**Beneficios:**
1. ✅ **Progresión gradual:** Los primeros 7 intentos tienen el rey blanco como referencia
2. ✅ **Desafío final:** Los últimos 3 intentos no tienen referencia (máxima dificultad)
3. ✅ **Ayuda visual:** Facilita la orientación espacial en el tablero
4. ✅ **Menos frustración:** Al comenzar un nivel nuevo, hay apoyo visual
5. ✅ **Curva de aprendizaje:** Gradual dentro de cada nivel

**Comportamiento esperado:**

**Nivel 2, Intento 1:**
- Genera: wK en e4, bK en h8, wR en d3
- Oculta: bK, wR (índices 1, 2)
- Visible: wK en e4 (índice 0) ← Referencia

**Nivel 2, Intento 9:**
- Misma posición
- Oculta: wK, bK, wR (índices 0, 1, 2)
- Visible: Ninguna ← Máxima dificultad

---

### Testing realizado:

- ✅ Todos los niveles (1-8) tienen `hidePiecesConfig`
- ✅ Todos los niveles tienen `attemptsRequired: 10`
- ✅ Patrón consistente: wK visible en intentos 1-7
- ✅ Nivel 1 mantiene configuración original (más fácil para niños 4-5 años)
- ✅ Función `getPiecesToHide()` ya existía y funciona correctamente

---

### Archivos modificados:

**levels.js:**
- Línea 68-77: Nivel 2 - Agregado `hidePiecesConfig`
- Línea 90-99: Nivel 3 - Agregado `hidePiecesConfig`
- Línea 113-122: Nivel 4 - Agregado `hidePiecesConfig`
- Línea 135-144: Nivel 5 - Agregado `hidePiecesConfig`
- Línea 157-166: Nivel 6 - Agregado `hidePiecesConfig`
- Línea 179-188: Nivel 7 - Agregado `hidePiecesConfig`
- Línea 188-197: Nivel 8 - Agregado `hidePiecesConfig`

---

### Feedback del usuario:

✅ "me encanta, cada dia mas"

---

**Última actualización**: 8 Octubre 2025 - Sistema de referencia visual implementado en todos los niveles
**Estado**: Niveles 1-8 con progresión gradual (wK visible → todas ocultas)
**Próximo**: Sistema de audio + preparar para MVP completo

---

## ✅ FEATURE: Coordenadas en casillas vacías (Hints visuales)
**Estado**: COMPLETADO ✅
**Fecha**: 8 Octubre 2025

### Problema identificado:

**Solicitud del usuario:**
> "cuando las piezas dejen su casilla, las que tienen que desaparecer, en la casilla que dejan que aparezca centrado, y bien claro, la casilla, por ejemplo a5, b4 y luego que las piezas llegan a la barra lateral, un breve tiempo, las coordenadas que aparecieron, se van.."

Al volar las piezas al banco, el jugador perdía referencia visual de qué casillas quedaron vacías. Se solicitó mostrar las coordenadas (ej: "a5", "b4") centradas en las casillas vacías.

---

### Solución implementada:

**Timeline del efecto:**
1. ✈️ **Piezas despegan** → Coordenadas aparecen centradas (animación escala 0.5 → 1.0)
2. 🎯 **Piezas vuelan al banco** (600ms de vuelo)
3. ⏱️ **Espera 800ms** → Jugador ve claramente las coordenadas
4. 🌫️ **Fade-out** → Coordenadas se desvanecen (0.8s, escala 1 → 0.8)
5. 🎮 **Fase de reconstrucción** → Jugador coloca piezas

---

### CSS agregado (styles.css: líneas 199-260)

#### Estilo base de coordenada:
```css
.square-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* Tipografía */
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(20px, 4vw, 32px);
    font-weight: 900;

    /* Color neón cyan brillante */
    color: var(--neon-cyan);
    text-shadow:
        0 0 10px var(--neon-cyan),
        0 0 20px var(--neon-cyan),
        0 0 30px rgba(0, 255, 255, 0.5);

    /* Z-index sobre coordenadas de borde */
    z-index: 15;

    /* No seleccionable */
    user-select: none;
    pointer-events: none;

    /* Animación de entrada */
    animation: hintAppear 0.3s ease-out;
}
```

#### Animación de aparición:
```css
@keyframes hintAppear {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
```

#### Animación de desaparición:
```css
.square-hint.fade-out {
    animation: hintFadeOut 0.8s ease-out forwards;
}

@keyframes hintFadeOut {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
}
```

---

### JavaScript agregado (game.js: líneas 1567-1627)

#### 1. Mostrar coordenadas:
```javascript
/**
 * Muestra coordenadas en las casillas que quedaron vacías
 * @param {Array<string>} squares - Casillas donde mostrar coordenadas
 */
function showSquareHints(squares) {
    squares.forEach(square => {
        const squareElement = getSquareElement(square);
        if (!squareElement) return;

        // Crear elemento de coordenada
        const hintElement = document.createElement('div');
        hintElement.className = 'square-hint';
        hintElement.textContent = square; // ej: "a5", "b4"
        hintElement.dataset.hint = 'true';

        // Agregar a la casilla
        squareElement.appendChild(hintElement);

        console.log(`📍 Coordenada mostrada: ${square}`);
    });
}
```

#### 2. Ocultar coordenadas con fade-out:
```javascript
/**
 * Oculta coordenadas con animación fade-out
 * @param {Array<string>} squares - Casillas de las coordenadas a ocultar
 * @param {number} delay - Delay antes de iniciar fade-out (ms)
 */
function hideSquareHints(squares, delay = 0) {
    setTimeout(() => {
        squares.forEach(square => {
            const squareElement = getSquareElement(square);
            if (!squareElement) return;

            const hintElement = squareElement.querySelector('.square-hint');
            if (!hintElement) return;

            // Agregar clase para fade-out
            hintElement.classList.add('fade-out');

            // Remover del DOM después de la animación
            setTimeout(() => {
                hintElement.remove();
                console.log(`✨ Coordenada removida: ${square}`);
            }, 800); // Duración de la animación fade-out
        });
    }, delay);
}
```

#### 3. Limpieza inmediata:
```javascript
/**
 * Limpia todas las coordenadas inmediatamente (sin animación)
 */
function clearAllSquareHints() {
    const hints = document.querySelectorAll('.square-hint');
    hints.forEach(hint => hint.remove());
    console.log(`🧹 ${hints.length} coordenadas limpiadas`);
}
```

---

### Integración en el flujo del juego:

#### Modificación en `hidePiecesPhase()` (líneas 405-419):
```javascript
// Obtener casillas de las piezas a ocultar
const squares = piecesToHide.map(pos => pos.square);

// ==========================================
// MOSTRAR COORDENADAS cuando piezas despegan
// ==========================================
showSquareHints(squares);

// Animar piezas al banco
hidePiecesWithAnimation(squares, {
    stagger: 150,
    duration: 600,
    onComplete: () => {
        // ==========================================
        // DESVANECER COORDENADAS después del vuelo
        // Delay: 800ms para que el jugador las vea
        // ==========================================
        hideSquareHints(squares, 800);

        startSolvingPhase(piecesToHide);
    }
});
```

#### Modificación en `startGame()` (línea 297):
```javascript
clearBoard();          // Limpiar piezas del intento anterior
clearBankPieces();     // Limpiar banco
clearAllSquareHints(); // ← NUEVO: Limpiar coordenadas anteriores
placedPieces = [];     // Resetear array de piezas colocadas
```

---

### Características del sistema:

✅ **Aparición sincronizada**: Coordenadas aparecen justo cuando las piezas despegan
✅ **Centrado perfecto**: Absolutamente centradas en cada casilla
✅ **Tipografía clara**: Orbitron 900, tamaño responsive (20-32px)
✅ **Color neón**: Cyan brillante con triple glow (coherente con ChessArcade)
✅ **No bloquea interacción**: `pointer-events: none`
✅ **Animación de entrada**: Escala suave (0.3s)
✅ **Timing perfecto**: 800ms visible después del vuelo
✅ **Fade-out elegante**: Desaparición suave (0.8s)
✅ **Limpieza automática**: Se remueven del DOM
✅ **Responsive**: Funciona en mobile y desktop

---

### Ejemplo de flujo completo:

**Nivel 2, Intento 1:**
```
1. Memorización (5s)
   → wK en e4, bK en h8, wR en d3

2. Glitch progresivo
   → bK y wR parpadean (40%-80%-100%)

3. Piezas despegan
   → Aparecen "h8" y "d3" en cyan neón (centradas)

4. Vuelo al banco (600ms)
   → Coordenadas siguen visibles

5. Espera 800ms
   → "h8" y "d3" muy visibles, jugador memoriza

6. Fade-out (800ms)
   → Coordenadas se desvanecen

7. Reconstrucción
   → Jugador arrastra piezas del banco
```

---

### Testing realizado:

- ✅ Coordenadas aparecen centradas en casillas correctas
- ✅ Timing sincronizado con vuelo de piezas
- ✅ Fade-out suave después de 800ms
- ✅ No hay acumulación entre intentos
- ✅ Responsive en mobile (20px) y desktop (32px)
- ✅ Color cyan con glow triple (muy visible)
- ✅ No bloquea drag & drop
- ✅ Se limpian al comenzar nuevo intento

---

### Archivos modificados:

**styles.css:**
- Líneas 199-260: Estilos `.square-hint` + animaciones `hintAppear` y `hintFadeOut`

**game.js:**
- Líneas 1567-1627: Funciones `showSquareHints()`, `hideSquareHints()`, `clearAllSquareHints()`
- Líneas 405-419: Integración en `hidePiecesPhase()` con timing
- Línea 297: Limpieza en `startGame()`

---

### Beneficios para UX:

1. **Ayuda visual clara**: El jugador ve exactamente qué casillas quedaron vacías
2. **Refuerzo de memoria**: Las coordenadas refuerzan la memoria espacial
3. **Menos frustración**: Especialmente útil en niveles con muchas piezas
4. **Elegante y no invasivo**: No interrumpe el flujo del juego
5. **Coherente con estilo arcade**: Neón cyan brillante

---

### Feedback del usuario:

✅ **"Espectacular!!!"**

---

**Última actualización**: 8 Octubre 2025 - Sistema de hints visuales (coordenadas en casillas)
**Estado**: Feature completo con animaciones entrada/salida
**Próximo**: Sistema de audio + git commit

---

## ✅ FEATURE: Sistema de Audio Completo (Web Audio API)
**Estado**: COMPLETADO ✅
**Fecha**: 8 Octubre 2025

### Implementación:

Se implementó un sistema de audio completo usando **Web Audio API** para generar sonidos sintéticos tipo arcade/neón, coherentes con el estilo visual del juego.

---

### Archivo creado: `audio.js` (+450 líneas)

**Características del sistema:**
- ✅ Sin archivos externos (todo generado en tiempo real)
- ✅ Muy liviano (sin MP3/WAV)
- ✅ Control total de frecuencias y efectos
- ✅ Código super comentado (explicaciones didácticas)
- ✅ Sistema de mute con persistencia en localStorage

---

### 🎵 Sonidos implementados:

#### 1. **Glitch Matrix** - Distorsión digital
```javascript
playGlitchSound(intensity) // 'warning' o 'critical'
```
- **Técnica**: Ruido blanco + filtro bandpass
- **Warning**: 800 Hz, sutil
- **Critical**: 1500 Hz, intenso y urgente
- **Duración**: 100ms
- **Uso**: Al aplicar efecto glitch visual

#### 2. **Error** - Buzz disonante
```javascript
playErrorSound()
```
- **Técnica**: 2 osciladores desafinados (150 Hz + 170 Hz)
- **Onda**: Cuadrada (sonido digital/duro)
- **Duración**: 300ms
- **Uso**: Al fallar intento (shake del tablero)

#### 3. **Éxito** - Chime ascendente
```javascript
playSuccessSound()
```
- **Técnica**: Arpeggio Do-Mi-Sol (523-659-783 Hz)
- **Onda**: Seno (suave y agradable)
- **Duración**: 3 notas × 150ms = 450ms
- **Uso**: Al completar intento correctamente

#### 4. **Confeti** - Cascada de notas
```javascript
playConfettiSound()
```
- **Técnica**: 8 notas aleatorias agudas (1000-2500 Hz)
- **Delays**: Aleatorios (efecto lluvia/cascada)
- **Duración**: 400ms total
- **Uso**: Al lanzar confeti (victoria)

#### 5. **Vuelo** - Whoosh
```javascript
playFlySound()
```
- **Técnica**: Ruido blanco + sweep descendente (500→100 Hz)
- **Efecto**: Doppler (sonido que se aleja)
- **Duración**: 300ms (sincronizado con animación)
- **Uso**: Al volar piezas al banco

---

### 🔌 Integración en el juego:

**Modificaciones en `game.js`:**

1. **loadAudioPreference()** - Cargar estado de mute
```javascript
if (window.MemoryMatrixAudio) {
    window.MemoryMatrixAudio.loadMutePreference();
    soundEnabled = !window.MemoryMatrixAudio.isMuted();
}
```

2. **toggleSound()** - Toggle mute + sonido de prueba
```javascript
const muted = window.MemoryMatrixAudio.toggleMute();
if (!muted) {
    window.MemoryMatrixAudio.playSuccessSound(); // Feedback al activar
}
```

3. **applyGlitchEffect()** - Sonido glitch
```javascript
window.MemoryMatrixAudio.playGlitchSound(intensity);
```

4. **shakeBoardOnError()** - Sonido error
```javascript
window.MemoryMatrixAudio.playErrorSound();
```

5. **onAttemptSuccess()** - Sonido éxito
```javascript
window.MemoryMatrixAudio.playSuccessSound();
```

6. **launchConfetti()** - Sonido confeti
```javascript
window.MemoryMatrixAudio.playConfettiSound();
```

7. **hidePiecesPhase()** - Sonido vuelo
```javascript
window.MemoryMatrixAudio.playFlySound();
```

---

### 📚 Código educativo:

El archivo `audio.js` incluye comentarios extensos sobre:
- Conceptos básicos de Web Audio API
- Qué es un AudioContext, Oscillator, GainNode
- Rangos de frecuencias (grave → agudo)
- Técnicas de síntesis: ruido blanco, filtros, envelopes
- Diferencia entre tipos de onda (seno, cuadrada, triangular)

**Ejemplo de comentario:**
```javascript
/**
 * CONCEPTOS BÁSICOS DE WEB AUDIO API:
 * 1. AudioContext: Motor principal de audio del navegador
 * 2. Oscillator: Generador de ondas sonoras
 * 3. GainNode: Controla el volumen
 * 4. Frequency: Frecuencia en Hz (grave=bajo, agudo=alto)
 * 5. connect(): Conecta nodos de audio
 */
```

---

### 🎮 Experiencia de usuario:

**Flujo completo con audio:**
1. 🎵 **Memorización**: Silencio (concentración)
2. ⚡ **Glitch warning** (40% del tiempo): Sonido sutil
3. 🚨 **Glitch critical** (80% del tiempo): Sonido intenso
4. ✈️ **Piezas vuelan**: Whoosh
5. 📍 **Coordenadas aparecen**: Silencio (lectura)
6. **Jugador coloca piezas**: Silencio
7a. ✅ **Acierto**: Chime + confeti cascada
7b. ❌ **Error**: Buzz disonante + shake

---

### 🎨 Mejora de visibilidad: Coordenadas en casillas blancas

**Problema identificado:**
> "en monitores grandes, cuando la pieza desaparece, no se ve bien la coordenada que aparece en el centro, sobre todo en las casillas blancas"

**Solución implementada en `styles.css`:**

```css
.square-hint {
    /* Tamaño más grande en desktop */
    font-size: clamp(24px, 5vw, 42px); /* Antes: 20-32px */

    /* Fondo oscuro semitransparente */
    background: rgba(0, 0, 0, 0.75);
    padding: 8px 16px;
    border-radius: 8px;

    /* Borde neón para destacar */
    border: 2px solid var(--neon-cyan);
    box-shadow:
        0 0 15px rgba(0, 255, 255, 0.6),
        0 0 25px rgba(0, 255, 255, 0.4),
        inset 0 0 10px rgba(0, 255, 255, 0.2);

    /* Desenfoque del fondo (elegante) */
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}
```

**Mejoras aplicadas:**
1. ✅ **Fondo oscuro 75% opaco** → Contraste perfecto en casillas blancas
2. ✅ **Borde neón cyan** → Marco que destaca la coordenada
3. ✅ **Box-shadow triple** → Glow exterior + interior (profundidad)
4. ✅ **Backdrop-filter blur** → Desenfoca fondo (efecto vidrio esmerilado)
5. ✅ **Padding 8x16** → Espacio respirable alrededor del texto
6. ✅ **Border-radius 8px** → Esquinas redondeadas suaves
7. ✅ **Tamaño mayor** → 24-42px (antes 20-32px) para monitores grandes

**Resultado:**
- Perfectamente visible en casillas blancas Y oscuras
- Estilo neón coherente con el diseño
- Efecto de "hologram" o "display futurista"
- No invasivo, sigue siendo elegante

---

### Archivos modificados:

**Nuevos:**
- `audio.js` - Sistema completo de audio (+450 líneas)

**Modificados:**
- `index.html` - Import de audio.js (línea 175)
- `game.js` - Integración de sonidos (7 funciones modificadas)
- `styles.css` - Mejora de .square-hint (líneas 204-247)

---

### Feedback del usuario:

✅ **"Cada vez me gusta mas, lo jugue bastante, empieza facil y se hace dificil"**
✅ Audio funcionando correctamente (037_con_sonido_OK.log)

---

**Última actualización**: 8 Octubre 2025 - Sistema de audio + mejora de visibilidad de hints
**Estado**: Sistema de audio completo + coordenadas mejoradas
**Próximo**: Pantalla de nivel completo / Sistema de pausa mejorado / Botones deshacer-limpiar
