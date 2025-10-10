# 📚 ChessGameLibrary - API Reference

Documentación completa de todas las funciones disponibles en la librería.

**Versión**: 1.0.0
**Última actualización**: 10 Octubre 2025

---

## 📋 Índice

1. [ChessGameLibrary.Utils](#chessgamelibraryutils) - Utilidades generales
2. [ChessGameLibrary.PieceAnimations](#chessgamelibrarypieceanimations) - Animaciones de piezas
3. [ChessGameLibrary.DragDrop](#chessgamelibrarydragdrop) - Sistema drag & drop
4. [ChessGameLibrary.LevelTransition](#chessgamelibrarylevetransition) - Transiciones entre niveles

---

## ChessGameLibrary.Utils

Funciones utilitarias para trabajar con piezas y coordenadas de ajedrez.

### 🎯 Nombres de Piezas

#### `getPieceName(piece)`
Convierte código de pieza a nombre legible en español.

**Parámetros:**
- `piece` (string): Código de pieza (ej: 'wK', 'bQ')

**Retorna:** (string) Nombre legible

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.getPieceName('wK')  // 'Rey Blanco'
ChessGameLibrary.Utils.getPieceName('bQ')  // 'Dama Negra'
ChessGameLibrary.Utils.getPieceName('wN')  // 'Caballo Blanco'
```

---

#### `getPieceNameEN(piece)`
Convierte código de pieza a nombre legible en inglés.

**Parámetros:**
- `piece` (string): Código de pieza

**Retorna:** (string) Nombre en inglés

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.getPieceNameEN('wK')  // 'White King'
ChessGameLibrary.Utils.getPieceNameEN('bQ')  // 'Black Queen'
```

---

#### `getPieceSymbol(piece)`
Obtiene el símbolo Unicode de una pieza.

**Parámetros:**
- `piece` (string): Código de pieza

**Retorna:** (string) Símbolo Unicode

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.getPieceSymbol('wK')  // '♔'
ChessGameLibrary.Utils.getPieceSymbol('bQ')  // '♛'
ChessGameLibrary.Utils.getPieceSymbol('wP')  // '♙'
```

---

#### `getPieceType(piece)`
Obtiene solo el tipo de pieza (sin color).

**Parámetros:**
- `piece` (string): Código de pieza

**Retorna:** (string) Tipo de pieza

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.getPieceType('wK')  // 'Rey'
ChessGameLibrary.Utils.getPieceType('bK')  // 'Rey'
```

---

#### `getPieceColor(piece)`
Obtiene solo el color de la pieza.

**Parámetros:**
- `piece` (string): Código de pieza

**Retorna:** (string) 'Blanco' o 'Negro'

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.getPieceColor('wK')  // 'Blanco'
ChessGameLibrary.Utils.getPieceColor('bQ')  // 'Negro'
```

---

### 🎯 Coordenadas de Ajedrez

#### `squareToIndex(square)`
Convierte notación algebraica a índice numérico (0-63).

**Parámetros:**
- `square` (string): Coordenada algebraica (ej: 'e4')

**Retorna:** (number) Índice (0-63) o -1 si inválido

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.squareToIndex('a1')  // 0
ChessGameLibrary.Utils.squareToIndex('h1')  // 7
ChessGameLibrary.Utils.squareToIndex('a8')  // 56
ChessGameLibrary.Utils.squareToIndex('h8')  // 63
ChessGameLibrary.Utils.squareToIndex('e4')  // 28
```

---

#### `indexToSquare(index)`
Convierte índice numérico a notación algebraica.

**Parámetros:**
- `index` (number): Índice (0-63)

**Retorna:** (string) Coordenada algebraica

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.indexToSquare(0)   // 'a1'
ChessGameLibrary.Utils.indexToSquare(63)  // 'h8'
ChessGameLibrary.Utils.indexToSquare(28)  // 'e4'
```

---

#### `getRank(square)`
Obtiene la fila (rank) de una casilla.

**Parámetros:**
- `square` (string): Coordenada algebraica

**Retorna:** (number) Número de fila (1-8)

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.getRank('e4')  // 4
ChessGameLibrary.Utils.getRank('a1')  // 1
ChessGameLibrary.Utils.getRank('h8')  // 8
```

---

#### `getFile(square)`
Obtiene la columna (file) de una casilla.

**Parámetros:**
- `square` (string): Coordenada algebraica

**Retorna:** (string) Letra de columna ('a'-'h')

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.getFile('e4')  // 'e'
ChessGameLibrary.Utils.getFile('a1')  // 'a'
ChessGameLibrary.Utils.getFile('h8')  // 'h'
```

---

### 🎯 Validaciones

#### `isValidSquare(square)`
Verifica si una casilla es válida.

**Parámetros:**
- `square` (string): Coordenada algebraica

**Retorna:** (boolean) true si es válida

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.isValidSquare('e4')    // true
ChessGameLibrary.Utils.isValidSquare('a1')    // true
ChessGameLibrary.Utils.isValidSquare('i9')    // false
ChessGameLibrary.Utils.isValidSquare('z99')   // false
```

---

#### `isValidPiece(piece)`
Verifica si un código de pieza es válido.

**Parámetros:**
- `piece` (string): Código de pieza

**Retorna:** (boolean) true si es válido

**Ejemplo:**
```javascript
ChessGameLibrary.Utils.isValidPiece('wK')   // true
ChessGameLibrary.Utils.isValidPiece('bQ')   // true
ChessGameLibrary.Utils.isValidPiece('xZ')   // false
ChessGameLibrary.Utils.isValidPiece('wk')   // false (minúscula)
```

---

## ChessGameLibrary.PieceAnimations

Módulo de animaciones de piezas con efectos visuales suaves.

### 🎯 Animaciones de Vuelo

#### `animatePieceToBank(fromSquare, piece, toBankSlot, options)`
Anima una pieza desde el tablero hacia el banco.

**Parámetros:**
- `fromSquare` (string): Casilla origen (ej: 'e4')
- `piece` (string): Código de pieza (ej: 'wK')
- `toBankSlot` (string|HTMLElement): Selector o elemento del slot destino
- `options` (Object): Opciones de animación
  - `duration` (number): Duración en ms (default: 600)
  - `easing` (string): Función CSS easing (default: 'ease-out')
  - `onComplete` (Function): Callback al completar
  - `onStart` (Function): Callback al iniciar

**Retorna:** void

**Ejemplo:**
```javascript
ChessGameLibrary.PieceAnimations.animatePieceToBank(
    'e4',           // Desde casilla e4
    'wK',           // Rey blanco
    '#bank-slot-1', // Hacia slot del banco
    {
        duration: 600,
        easing: 'ease-out',
        onComplete: () => console.log('Pieza en banco!')
    }
);
```

**Comportamiento:**
1. Crea un clon volador de la pieza
2. Anima desde casilla hacia el banco
3. Escala la pieza a 0.8 durante el vuelo
4. Coloca la pieza en el slot del banco
5. Limpia elementos temporales

---

#### `animatePieceFromBank(fromBankSlot, toSquare, piece, options)`
Anima una pieza desde el banco hacia el tablero.

**Parámetros:**
- `fromBankSlot` (string|HTMLElement): Selector o elemento del slot origen
- `toSquare` (string): Casilla destino (ej: 'e4')
- `piece` (string): Código de pieza
- `options` (Object): Opciones (igual que animatePieceToBank)

**Retorna:** void

**Ejemplo:**
```javascript
ChessGameLibrary.PieceAnimations.animatePieceFromBank(
    '#bank-slot-1', // Desde slot del banco
    'e4',           // Hacia casilla e4
    'wK',           // Rey blanco
    {
        duration: 500,
        onComplete: () => console.log('Pieza colocada!')
    }
);
```

---

#### `hidePiecesWithAnimation(squares, options)`
Oculta múltiples piezas con animación secuencial hacia el banco.

**Parámetros:**
- `squares` (Array<string>): Array de casillas (ej: ['e4', 'e5', 'd1'])
- `options` (Object):
  - `stagger` (number): Delay entre cada pieza en ms (default: 150)
  - `duration` (number): Duración de cada animación (default: 600)
  - `onComplete` (Function): Callback cuando todas terminan

**Retorna:** void

**Ejemplo:**
```javascript
ChessGameLibrary.PieceAnimations.hidePiecesWithAnimation(
    ['e1', 'e8', 'd1', 'd8'],  // 4 piezas
    {
        stagger: 100,   // 100ms entre cada una
        duration: 600,  // 600ms por pieza
        onComplete: () => console.log('Todas ocultas!')
    }
);
```

**Comportamiento:**
1. Pre-asigna slots vacíos del banco
2. Anima cada pieza con delay escalonado
3. Evita colisiones (cada pieza a un slot diferente)
4. Callback cuando todas las animaciones terminan

---

### 🎯 Utilidades de Posición

#### `getSquarePosition(square)`
Obtiene las coordenadas pixel del centro de una casilla.

**Parámetros:**
- `square` (string): Coordenada algebraica

**Retorna:** (Object) `{x, y}` coordenadas en pixels, o null si no existe

**Ejemplo:**
```javascript
const pos = ChessGameLibrary.PieceAnimations.getSquarePosition('e4');
console.log(pos);  // {x: 450, y: 300}
```

---

#### `getElementPosition(element)`
Obtiene las coordenadas pixel del centro de un elemento.

**Parámetros:**
- `element` (string|HTMLElement): Selector o elemento

**Retorna:** (Object) `{x, y}` coordenadas en pixels, o null

**Ejemplo:**
```javascript
const pos = ChessGameLibrary.PieceAnimations.getElementPosition('#bank-slot-1');
console.log(pos);  // {x: 100, y: 500}
```

---

## ChessGameLibrary.DragDrop

Sistema completo de drag & drop para piezas de ajedrez (mouse + touch).

### 🎯 Inicialización

#### `initDragDrop(options)`
Inicializa el sistema de drag & drop.

**Parámetros:**
- `options` (Object):
  - `bankSelector` (string): Selector del banco de piezas (default: '.piece-bank')
  - `boardSelector` (string): Selector del tablero (default: '#chessboard')
  - `onPiecePlaced` (Function): Callback cuando se coloca una pieza `(piece, square) => {}`
  - `canPlacePiece` (Function): Función para validar colocación `(piece, square) => boolean`

**Retorna:** void

**Ejemplo:**
```javascript
ChessGameLibrary.DragDrop.initDragDrop({
    bankSelector: '.piece-bank',
    boardSelector: '#chessboard',

    // Callback al colocar pieza
    onPiecePlaced: (piece, square) => {
        console.log(`Pieza ${piece} colocada en ${square}`);
        // Tu lógica aquí (validar, actualizar estado, etc.)
    },

    // Validación de colocación
    canPlacePiece: (piece, square) => {
        // Ejemplo: No permitir duplicados
        const squareEl = document.querySelector(`[data-square="${square}"]`);
        return !squareEl.querySelector('.piece');
    }
});
```

**Comportamiento:**
1. Observa el banco con MutationObserver
2. Agrega listeners a piezas existentes y nuevas
3. Soporte para mouse y touch
4. Validación antes de colocar
5. Feedback visual durante arrastre

**Nota importante:** Debe llamarse UNA SOLA VEZ al cargar el juego.

---

### 🎯 Eventos Internos

El módulo maneja automáticamente:
- `mousedown` / `touchstart` - Inicia arrastre
- `mousemove` / `touchmove` - Mueve pieza fantasma
- `mouseup` / `touchend` - Suelta pieza
- `touchcancel` - Cancela arrastre táctil

**No necesitas manejar estos eventos manualmente.**

---

## ChessGameLibrary.LevelTransition

Sistema de transiciones espectaculares entre niveles.

### 🎯 Mostrar Transición

#### `show(options)`
Muestra una transición de nivel con animaciones.

**Parámetros:**
- `options` (Object):
  - `levelNumber` (number): Número del nivel (ej: 2)
  - `levelName` (string): Nombre del nivel (ej: 'Explorador')
  - `icon` (string): Emoji a mostrar (default: '🎉')
  - `duration` (number): Duración en ms (default: 2500)
  - `onComplete` (Function): Callback al terminar
  - `onShow` (Function): Callback al mostrar

**Retorna:** void

**Ejemplo:**
```javascript
ChessGameLibrary.LevelTransition.show({
    levelNumber: 2,
    levelName: 'Explorador',
    icon: '🎉',
    duration: 2500,
    onShow: () => {
        // Reproducir sonido, pausar timer, etc.
        console.log('Transición mostrada');
    },
    onComplete: () => {
        // Iniciar siguiente nivel
        console.log('Transición terminada');
        startNextLevel();
    }
});
```

**Elementos visuales:**
- Overlay negro 95%
- Emoji pulsante (60-120px)
- Título cyan neón "¡Nivel Completado!"
- Número gradiente "NIVEL X" (cyan→pink→orange)
- Nombre dorado del nivel
- Barra de progreso que se llena

**Animaciones:** fadeIn, levelZoomIn, iconPulse, neonFlicker, gradientShift, progressFill

---

#### `hide()`
Oculta la transición inmediatamente.

**Parámetros:** ninguno

**Retorna:** void

**Ejemplo:**
```javascript
ChessGameLibrary.LevelTransition.hide();
```

---

#### `injectStyles()`
Inyecta los estilos CSS necesarios (se ejecuta automáticamente).

**Parámetros:** ninguno

**Retorna:** void

**Nota:** No necesitas llamar esta función manualmente. Se ejecuta automáticamente al cargar el módulo.

---

## 🎮 Ejemplos de Uso Completo

### Ejemplo 1: Memory Matrix (uso actual)

```javascript
// 1. Inicializar drag & drop
ChessGameLibrary.DragDrop.initDragDrop({
    bankSelector: '#pieceBank',
    boardSelector: '#chessboard',
    onPiecePlaced: (piece, square) => {
        if (canPlacePiece(piece, square)) {
            showPiece(square, piece);
            updateGameState();
        }
    },
    canPlacePiece: (piece, square) => {
        return validatePlacement(piece, square);
    }
});

// 2. Animar piezas volando al banco
const piecesToHide = ['e1', 'e8', 'd1', 'd8'];
ChessGameLibrary.PieceAnimations.hidePiecesWithAnimation(piecesToHide, {
    stagger: 150,
    onComplete: () => {
        console.log('Fase de colocación iniciada');
    }
});

// 3. Mostrar transición de nivel
ChessGameLibrary.LevelTransition.show({
    levelNumber: 2,
    levelName: 'Explorador',
    onComplete: () => {
        startLevel(2);
    }
});
```

---

### Ejemplo 2: Juego de Puzzle

```javascript
// Obtener información de piezas
const pieces = ['wK', 'bQ', 'wN'];
pieces.forEach(piece => {
    const name = ChessGameLibrary.Utils.getPieceName(piece);
    const symbol = ChessGameLibrary.Utils.getPieceSymbol(piece);
    console.log(`${name} ${symbol}`);
});

// Validar movimiento
function validateMove(square) {
    if (!ChessGameLibrary.Utils.isValidSquare(square)) {
        console.error('Casilla inválida');
        return false;
    }

    const rank = ChessGameLibrary.Utils.getRank(square);
    const file = ChessGameLibrary.Utils.getFile(square);

    // Tu lógica de validación aquí
    return true;
}
```

---

### Ejemplo 3: Tutorial Interactivo

```javascript
// Animar una pieza específica
async function showTutorialMove() {
    // Mover al banco
    await new Promise(resolve => {
        ChessGameLibrary.PieceAnimations.animatePieceToBank(
            'e2', 'wP', '#bank-slot-1',
            { onComplete: resolve }
        );
    });

    // Esperar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mover de vuelta
    await new Promise(resolve => {
        ChessGameLibrary.PieceAnimations.animatePieceFromBank(
            '#bank-slot-1', 'e4', 'wP',
            { onComplete: resolve }
        );
    });
}
```

---

## 📊 Códigos de Piezas

### Formato: `[color][tipo]`

**Colores:**
- `w` = Blanco (White)
- `b` = Negro (Black)

**Tipos:**
- `K` = Rey (King)
- `Q` = Dama (Queen)
- `R` = Torre (Rook)
- `B` = Alfil (Bishop)
- `N` = Caballo (Knight)
- `P` = Peón (Pawn)

### Todas las combinaciones válidas:

| Código | Español       | Inglés       | Unicode |
|--------|---------------|--------------|---------|
| wK     | Rey Blanco    | White King   | ♔       |
| wQ     | Dama Blanca   | White Queen  | ♕       |
| wR     | Torre Blanca  | White Rook   | ♖       |
| wB     | Alfil Blanco  | White Bishop | ♗       |
| wN     | Caballo Blanco| White Knight | ♘       |
| wP     | Peón Blanco   | White Pawn   | ♙       |
| bK     | Rey Negro     | Black King   | ♚       |
| bQ     | Dama Negra    | Black Queen  | ♛       |
| bR     | Torre Negra   | Black Rook   | ♜       |
| bB     | Alfil Negro   | Black Bishop | ♝       |
| bN     | Caballo Negro | Black Knight | ♞       |
| bP     | Peón Negro    | Black Pawn   | ♟       |

---

## 🔧 Requisitos Técnicos

### HTML requerido:

**Tablero:**
```html
<div id="chessboard">
    <div class="square" data-square="a1"></div>
    <div class="square" data-square="a2"></div>
    <!-- ... 64 casillas con data-square -->
</div>
```

**Banco de piezas:**
```html
<div class="piece-bank">
    <div class="bank-piece-slot">
        <img class="piece" src="..." data-piece="wK" alt="wK">
    </div>
    <!-- ... más slots -->
</div>
```

### CSS requerido:

```css
.piece {
    cursor: grab;
    user-select: none;
    -webkit-user-drag: none;
}

.dragging-ghost {
    opacity: 0.7;
    cursor: grabbing;
}

.square {
    position: relative;
}
```

---

## ⚠️ Notas Importantes

1. **Drag & Drop**: Inicializar UNA SOLA VEZ al cargar el juego
2. **Animaciones**: No interrumpir animaciones en progreso
3. **MutationObserver**: El drag & drop observa automáticamente nuevas piezas
4. **LevelTransition**: Auto-inyecta CSS, no necesita <link> externo
5. **Callbacks**: Siempre son opcionales, tienen valores por defecto
6. **Touch**: Todos los módulos soportan eventos táctiles
7. **Console logs**: La librería imprime logs útiles para debugging

---

## 🐛 Debugging

### Activar logs verbose:

Los módulos ya imprimen logs útiles:
- `📦` = Módulo cargado
- `🎯` = Evento drag & drop
- `✈️` = Animación completada
- `✅` = Operación exitosa
- `❌` = Error
- `⚠️` = Advertencia

### Verificar carga de módulos:

```javascript
console.log(window.ChessGameLibrary);
// Debe mostrar: { Utils, PieceAnimations, DragDrop, LevelTransition }
```

---

## 📝 Changelog de la API

### v1.0.0 (10 Octubre 2025)
- ✅ ChessGameLibrary.Utils - 11 funciones
- ✅ ChessGameLibrary.PieceAnimations - 5 funciones
- ✅ ChessGameLibrary.DragDrop - 1 función pública (init)
- ✅ ChessGameLibrary.LevelTransition - 3 funciones

---

## 📧 Soporte

Para reportar bugs o sugerir mejoras, documentar en:
- CHANGELOG.md (cambios día a día)
- ERRORES_CONOCIDOS_Y_SOLUCIONES.md (bugs conocidos)

---

**Última actualización**: 10 Octubre 2025
**Autor**: ChessArcade Team
**Licencia**: MIT
