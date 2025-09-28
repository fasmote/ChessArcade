# 📚 DICCIONARIO DE FUNCIONES - MEMORY MATRIX CHESSBOARD.JS

## 📋 Índice de Funciones por Categoría

### 🚀 [Inicialización](#inicialización)
- [`initMemoryMatrix()`](#initmemorymatrix)
- [`verifyDependencies()`](#verifydependencies)
- [`initializeChessboard()`](#initializechessboard)
- [`setupBoardDropListeners()`](#setupboarddroplisteners)

### 🎮 [Control de Juego](#control-de-juego)
- [`loadLevel(levelNumber)`](#loadlevelllevelnumber)
- [`setupBoardForLevel(levelConfig)`](#setupboardforlevellevelconfig)
- [`startGame()`](#startgame)
- [`resetGame()`](#resetgame)
- [`completeLevel()`](#completelevel)

### 🧠 [Fases de Juego](#fases-de-juego)
- [`startMemorizationPhase()`](#startmemorizationphase)
- [`startPlacementPhase()`](#startplacementphase)
- [`checkLevelComplete()`](#checklevelcomplete)

### 🎯 [Manejo de Eventos](#manejo-de-eventos)
- [`handlePiecePlacementFromBank(pieceCode, targetSquare)`](#handlepieceplacementfrombankpiececode-targetsquare)
- [`handlePiecePlacement(source, target, piece, newPos, oldPos)`](#handlepieceplacementsource-target-piece-newpos-oldpos)
- [`onDrop(source, target, piece, newPos, oldPos, orientation)`](#ondropsource-target-piece-newpos-oldpos-orientation)

### ✅ [Verificación y Validación](#verificación-y-validación)
- [`verifyPiecePlacement(square, piece)`](#verifypieceplacementsquare-piece)
- [`handleCorrectPlacement(square, piece)`](#handlecorrectplacementsquare-piece)
- [`handleIncorrectPlacement(square, piece)`](#handleincorrectplacementsquare-piece)

### 🎨 [Interfaz de Usuario](#interfaz-de-usuario)
- [`createPieceBank(hiddenPieces)`](#createpiecebankhiddenpieces)
- [`removePieceFromBank(pieceCode)`](#removepiecefrombank-piececode)
- [`showFeedback(isCorrect, title, message)`](#showfeedbackiscorrect-title-message)
- [`addSquareEffect(square, effectType)`](#addsquareeffectsquare-effecttype)

### 🔧 [Utilidades](#utilidades)
- [`parseFenToChessboardPosition(fen)`](#parsefentochessboardpositionfen)
- [`createPositionWithHiddenPieces(currentFEN, hiddenPieces)`](#createpositionwithhiddenpiecescurrentfen-hiddenpieces)
- [`determineHiddenPieces(levelConfig, currentFEN)`](#determinehiddenpieceslevelconfig-currentfen)
- [`getPieceName(pieceCode)`](#getpiecenamepiececode)

### 📊 [Sistema de Puntuación](#sistema-de-puntuación)
- [`calculatePlacementScore(isCorrect)`](#calculateplacementscoreiscorrect)
- [`addScore(points)`](#addscore-points)
- [`updatePlacementStats(isCorrect)`](#updateplacementstatsis-correct)

---

## 🚀 Inicialización

### `initMemoryMatrix()`
**📍 Línea**: ~124
**🎯 Propósito**: Función principal de inicialización del juego
**📥 Parámetros**: Ninguno
**📤 Retorna**: `void`

```javascript
function initMemoryMatrix() {
    console.log('🎮 Iniciando Memory Matrix con Chessboard.js...');
    // Verifica dependencias, inicializa tablero, configura eventos
}
```

**🔧 Funcionalidad**:
- Verifica disponibilidad de todas las librerías externas
- Inicializa el tablero ChessBoard.js con configuración específica
- Configura event listeners para drag & drop
- Carga el primer nivel del juego
- Maneja errores de inicialización gracefully

---

### `verifyDependencies()`
**📍 Línea**: ~157
**🎯 Propósito**: Verifica que todas las librerías externas estén cargadas
**📥 Parámetros**: Ninguno
**📤 Retorna**: `boolean` - true si todas las dependencias están disponibles

```javascript
function verifyDependencies() {
    console.log('🔍 Verificando dependencias disponibles...');
    // Verifica Chess, ChessBoard, Howl, MEMORY_LEVELS
    return allDependenciesLoaded;
}
```

**🔧 Funcionalidad**:
- Verifica `typeof Chess === 'function'`
- Verifica `typeof ChessBoard === 'function'`
- Verifica `typeof Howl === 'function'`
- Verifica `typeof MEMORY_LEVELS === 'object'`
- Retorna false y registra error si alguna falta

---

### `initializeChessboard()`
**📍 Línea**: ~194
**🎯 Propósito**: Configura e inicializa el tablero ChessBoard.js
**📥 Parámetros**: Ninguno
**📤 Retorna**: `ChessBoard` object

```javascript
function initializeChessboard() {
    console.log('🏁 Inicializando tablero Chessboard.js...');
    // Crea instancia ChessBoard con configuración específica
}
```

**🔧 Funcionalidad**:
- Crea instancia ChessBoard en elemento `#chessboard`
- Configura `draggable: true` para arrastrar piezas
- Establece tema de piezas desde CDN oficial
- Asigna callback `onDrop` para manejar colocaciones
- Configura drop listeners para casillas

---

### `setupBoardDropListeners()`
**📍 Línea**: ~252
**🎯 Propósito**: Configura event listeners HTML5 para drop en casillas del tablero
**📥 Parámetros**: Ninguno
**📤 Retorna**: `void`

```javascript
function setupBoardDropListeners() {
    console.log('🎯 Configurando drop listeners para tablero...');
    // Configura dragover, drop en las 64 casillas
}
```

**🔧 Funcionalidad**:
- Busca todas las casillas con clase `square-*`
- Extrae ID de casilla del className (ej: `square-e8` → `e8`)
- Configura `dragover` para permitir drop
- Configura `drop` para llamar `handlePiecePlacementFromBank`
- Maneja edge cases de extracción de IDs

---

## 🎮 Control de Juego

### `loadLevel(levelNumber)`
**📍 Línea**: ~612
**🎯 Propósito**: Carga un nivel específico del juego
**📥 Parámetros**: `levelNumber` (number) - Número de nivel a cargar
**📤 Retorna**: `void`

```javascript
function loadLevel(levelNumber) {
    console.log(`📚 Cargando nivel ${levelNumber}...`);
    // Carga configuración, reinicia estado, configura tablero
}
```

**🔧 Funcionalidad**:
- Obtiene configuración del nivel desde `MEMORY_LEVELS`
- Llama `resetGame()` para limpiar estado anterior
- Configura tablero con `setupBoardForLevel()`
- Determina piezas ocultas para el nivel
- Actualiza UI con información del nivel

---

### `setupBoardForLevel(levelConfig)`
**📍 Línea**: ~655
**🎯 Propósito**: Configura el tablero para un nivel específico
**📥 Parámetros**: `levelConfig` (object) - Configuración del nivel
**📤 Retorna**: `void`

```javascript
function setupBoardForLevel(levelConfig) {
    console.log('🎯 Configurando tablero para nivel:', levelConfig);
    // Carga FEN, configura posición, limpia tablero
}
```

**🔧 Funcionalidad**:
- Carga posición FEN del nivel
- Convierte FEN a formato ChessBoard.js
- Limpia tablero con `chessboard.position(false)`
- Establece nueva posición en tablero visual
- Maneja errores de FEN inválidos

---

### `startGame()`
**📍 Línea**: ~902
**🎯 Propósito**: Inicia el juego desde la fase de memorización
**📥 Parámetros**: Ninguno
**📤 Retorna**: `void`

```javascript
function startGame() {
    console.log('🎮 Iniciando juego...');
    // Cambia estado a memorización, oculta botón start
}
```

**🔧 Funcionalidad**:
- Verifica que el juego esté en estado `waiting`
- Oculta botón "Iniciar Juego"
- Llama `startMemorizationPhase()`
- Actualiza UI para mostrar fase activa

---

### `resetGame()`
**📍 Línea**: ~1153
**🎯 Propósito**: Reinicia el estado del juego completamente
**📥 Parámetros**: Ninguno
**📤 Retorna**: `void`

```javascript
function resetGame() {
    console.log('🔄 Reiniciando estado del juego');
    // Limpia variables globales, restaura estado inicial
}
```

**🔧 Funcionalidad**:
- Resetea `gameState` a `'waiting'`
- Limpia arrays `hiddenPieces` y `placedPieces`
- Reinicia counters de tiempo y puntuación
- Restaura UI a estado inicial
- Prepara para nuevo nivel

---

### `completeLevel()`
**📍 Línea**: ~969
**🎯 Propósito**: Maneja la completación exitosa de un nivel
**📥 Parámetros**: Ninguno
**📤 Retorna**: `void`

```javascript
function completeLevel() {
    console.log('🎉 ¡Nivel completado!');
    // Muestra feedback, calcula bonos, avanza nivel
}
```

**🔧 Funcionalidad**:
- Muestra feedback de completación exitosa
- Calcula bonificaciones por tiempo y precisión
- Incrementa `currentLevel`
- Verifica si hay más niveles disponibles
- Inicia siguiente nivel automáticamente

---

## 🧠 Fases de Juego

### `startMemorizationPhase()`
**📍 Línea**: ~908
**🎯 Propósito**: Inicia la fase donde el jugador memoriza la posición
**📥 Parámetros**: Ninguno
**📤 Retorna**: `void`

```javascript
function startMemorizationPhase() {
    console.log('🧠 Iniciando fase de memorización...');
    // Muestra posición completa por tiempo limitado
}
```

**🔧 Funcionalidad**:
- Cambia `gameState` a `'memorize'`
- Muestra posición completa en tablero
- Inicia timer basado en `memorization_time` del nivel
- Actualiza UI con countdown visual
- Transiciona automáticamente a `startPlacementPhase()`

---

### `startPlacementPhase()`
**📍 Línea**: ~934
**🎯 Propósito**: Inicia la fase donde el jugador coloca las piezas
**📥 Parámetros**: Ninguno
**📤 Retorna**: `void`

```javascript
function startPlacementPhase() {
    console.log('🎯 Iniciando fase de colocación...');
    // Limpia tablero, muestra banco de piezas
}
```

**🔧 Funcionalidad**:
- Cambia `gameState` a `'place'`
- Limpia tablero mostrando solo piezas visibles
- Crea banco de piezas lateral con `createPieceBank()`
- Habilita drag & drop desde banco
- Inicia timers de nivel

---

### `checkLevelComplete()`
**📍 Línea**: ~1395
**🎯 Propósito**: Verifica si todas las piezas han sido colocadas correctamente
**📥 Parámetros**: Ninguno
**📤 Retorna**: `boolean` - true si el nivel está completo

```javascript
function checkLevelComplete() {
    // Cuenta piezas colocadas vs piezas totales ocultas
    const placed = hiddenPieces.filter(hp => hp.placed).length;
    return placed === hiddenPieces.length;
}
```

**🔧 Funcionalidad**:
- Itera sobre array `hiddenPieces`
- Cuenta cuántas tienen `placed: true`
- Compara con total de piezas ocultas
- Retorna true solo si todas están colocadas

---

## 🎯 Manejo de Eventos

### `handlePiecePlacementFromBank(pieceCode, targetSquare)`
**📍 Línea**: ~352
**🎯 Propósito**: Maneja arrastre de piezas desde el banco hacia el tablero
**📥 Parámetros**:
- `pieceCode` (string) - Código de pieza (ej: 'wK', 'bQ')
- `targetSquare` (string) - Casilla destino (ej: 'e1', 'e8')
**📤 Retorna**: `void`

```javascript
function handlePiecePlacementFromBank(pieceCode, targetSquare) {
    console.log(`🎯 Colocación desde banco: ${pieceCode} hacia ${targetSquare}`);
    // Previene duplicados, verifica colocación, actualiza estado
}
```

**🔧 Funcionalidad**:
- Implementa sistema anti-duplicación con `window.processedDrops`
- Verifica que esté en fase `'place'`
- Llama `verifyPiecePlacement()` para validar
- Maneja colocación correcta o incorrecta
- Actualiza tablero visual y remueve pieza del banco

---

### `handlePiecePlacement(source, target, piece, newPos, oldPos)`
**📍 Línea**: ~447
**🎯 Propósito**: Callback oficial de ChessBoard.js para manejar drops
**📥 Parámetros**:
- `source` (string) - Casilla origen
- `target` (string) - Casilla destino
- `piece` (string) - Código de pieza
- `newPos` (object) - Nueva posición del tablero
- `oldPos` (object) - Posición anterior del tablero
**📤 Retorna**: `string` - 'snapback' para rechazar, cualquier otra cosa para aceptar

```javascript
function handlePiecePlacement(source, target, piece, newPos, oldPos) {
    console.log(`🎯 Colocación: ${piece} desde ${source} hacia ${target}`);
    // Verifica duplicados, valida colocación, retorna resultado
}
```

**🔧 Funcionalidad**:
- Verifica estado de juego `'place'`
- Comprueba cache de duplicados
- Valida colocación con `verifyPiecePlacement()`
- Retorna `'snapback'` para rechazar movimientos incorrectos
- Actualiza estadísticas de juego

---

### `onDrop(source, target, piece, newPos, oldPos, orientation)`
**📍 Línea**: ~214
**🎯 Propósito**: Función wrapper para el callback onDrop de ChessBoard.js
**📥 Parámetros**: Parámetros estándar de ChessBoard.js onDrop
**📤 Retorna**: Resultado de `handlePiecePlacement()`

```javascript
onDrop: function(source, target, piece, newPos, oldPos, orientation) {
    console.log('🔍 onDrop:', {source, target, piece});
    if (gameState === 'place') {
        return handlePiecePlacement(source, target, piece, newPos, oldPos);
    }
}
```

**🔧 Funcionalidad**:
- Wrapper para integración con ChessBoard.js
- Filtra eventos solo durante fase de colocación
- Delega procesamiento a `handlePiecePlacement()`

---

## ✅ Verificación y Validación

### `verifyPiecePlacement(square, piece)`
**📍 Línea**: ~528
**🎯 Propósito**: Verifica si una colocación de pieza es correcta
**📥 Parámetros**:
- `square` (string) - Casilla donde se coloca (ej: 'e1')
- `piece` (string) - Código de pieza (ej: 'wK')
**📤 Retorna**: `boolean` - true si la colocación es correcta

```javascript
function verifyPiecePlacement(square, piece) {
    // Busca en hiddenPieces si existe match de square + piece + !placed
    const hiddenPiece = hiddenPieces.find(hp =>
        hp.square === square && hp.piece === piece && !hp.placed
    );
    return !!hiddenPiece;
}
```

**🔧 Funcionalidad**:
- Busca en array `hiddenPieces`
- Verifica coincidencia exacta de casilla y pieza
- Confirma que la pieza no esté ya colocada (`!hp.placed`)
- Retorna `true` solo si encuentra match válido

---

### `handleCorrectPlacement(square, piece)`
**📍 Línea**: ~544
**🎯 Propósito**: Maneja una colocación correcta de pieza
**📥 Parámetros**:
- `square` (string) - Casilla de la colocación correcta
- `piece` (string) - Código de la pieza colocada correctamente
**📤 Retorna**: `void`

```javascript
function handleCorrectPlacement(square, piece) {
    console.log(`✅ Colocación correcta: ${piece} en ${square}`);
    // Actualiza estado, muestra feedback, añade puntuación
}
```

**🔧 Funcionalidad**:
- Marca pieza como `placed: true` en `hiddenPieces`
- Actualiza posición visual del tablero
- Remueve pieza del banco de piezas
- Muestra feedback positivo con efectos visuales
- Añade puntuación y actualiza estadísticas

---

### `handleIncorrectPlacement(square, piece)`
**📍 Línea**: ~581
**🎯 Propósito**: Maneja una colocación incorrecta de pieza
**📥 Parámetros**:
- `square` (string) - Casilla de la colocación incorrecta
- `piece` (string) - Código de la pieza colocada incorrectamente
**📤 Retorna**: `void`

```javascript
function handleIncorrectPlacement(square, piece) {
    console.log(`❌ Colocación incorrecta: ${piece} en ${square}`);
    // Muestra feedback negativo, resta puntuación
}
```

**🔧 Funcionalidad**:
- Muestra feedback negativo instantáneo
- Resta puntuación por error
- Actualiza estadísticas de errores
- Añade efecto visual de error en la casilla
- Registra intento incorrecto para análisis

---

## 🎨 Interfaz de Usuario

### `createPieceBank(hiddenPieces)`
**📍 Línea**: ~1333
**🎯 Propósito**: Crea el banco lateral de piezas para arrastrar
**📥 Parámetros**: `hiddenPieces` (array) - Array de piezas a incluir en el banco
**📤 Retorna**: `void`

```javascript
function createPieceBank(hiddenPieces) {
    console.log('🏦 Creando banco de piezas, hiddenPieces:', hiddenPieces);
    // Genera HTML dinámico con piezas arrastrables
}
```

**🔧 Funcionalidad**:
- Genera HTML dinámico para cada pieza oculta
- Configura atributos `draggable="true"` y `data-piece`
- Asigna images desde CDN de ChessBoard.js
- Configura event listeners para `dragstart`
- Añade estilos CSS para hover effects

---

### `removePieceFromBank(pieceCode)`
**📍 Línea**: ~1492
**🎯 Propósito**: Remueve una pieza del banco después de colocación correcta
**📥 Parámetros**: `pieceCode` (string) - Código de pieza a remover
**📤 Retorna**: `void`

```javascript
function removePieceFromBank(pieceCode) {
    console.log(`🏦 Removiendo ${pieceCode} del banco`);
    // Encuentra y remueve elemento del DOM
}
```

**🔧 Funcionalidad**:
- Busca elemento con `data-piece="${pieceCode}"`
- Remueve elemento del DOM con animación de fade
- Actualiza layout del banco automáticamente
- Maneja casos donde la pieza ya fue removida

---

### `showFeedback(isCorrect, title, message)`
**📍 Línea**: ~1507
**🎯 Propósito**: Muestra feedback visual al usuario
**📥 Parámetros**:
- `isCorrect` (boolean) - Si el feedback es positivo o negativo
- `title` (string) - Título del mensaje
- `message` (string) - Mensaje descriptivo
**📤 Retorna**: `void`

```javascript
function showFeedback(isCorrect, title, message) {
    // Muestra toast/modal con colores y iconos apropiados
}
```

**🔧 Funcionalidad**:
- Selecciona colores según `isCorrect` (verde/rojo)
- Muestra toast notification con animación
- Auto-oculta después de tiempo configurado
- Incluye iconos y efectos CSS apropiados

---

### `addSquareEffect(square, effectType)`
**📍 Línea**: ~1485
**🎯 Propósito**: Añade efectos visuales a casillas específicas
**📥 Parámetros**:
- `square` (string) - ID de casilla (ej: 'e1')
- `effectType` (string) - Tipo de efecto ('correct', 'incorrect', 'hint')
**📤 Retorna**: `void`

```javascript
function addSquareEffect(square, effectType) {
    console.log(`Efecto ${effectType} en casilla ${square}`);
    // Añade clases CSS temporales para efectos visuales
}
```

**🔧 Funcionalidad**:
- Encuentra elemento de casilla en el DOM
- Añade clases CSS para efectos (glow, shake, etc.)
- Configura timeout para remover efectos automáticamente
- Maneja múltiples efectos simultáneos

---

## 🔧 Utilidades

### `parseFenToChessboardPosition(fen)`
**📍 Línea**: ~842
**🎯 Propósito**: Convierte notación FEN a formato de posición de ChessBoard.js
**📥 Parámetros**: `fen` (string) - Notación FEN completa
**📤 Retorna**: `object` - Objeto posición para ChessBoard.js

```javascript
function parseFenToChessboardPosition(fen) {
    console.log('🔍 Posición FEN convertida:', position);
    // Parsea FEN y convierte a formato {square: piece}
}
```

**🔧 Funcionalidad**:
- Extrae parte de posición del FEN (antes del primer espacio)
- Parsea rank por rank (filas del tablero)
- Convierte números a casillas vacías
- Mapea caracteres de piezas a códigos ChessBoard.js
- Retorna objeto `{e1: 'wK', e8: 'bK', ...}`

---

### `createPositionWithHiddenPieces(currentFEN, hiddenPieces)`
**📍 Línea**: ~1298
**🎯 Propósito**: Crea posición del tablero ocultando piezas específicas
**📥 Parámetros**:
- `currentFEN` (string) - FEN de la posición completa
- `hiddenPieces` (array) - Array de piezas a ocultar
**📤 Retorna**: `object` - Posición con piezas ocultas removidas

```javascript
function createPositionWithHiddenPieces(currentFEN, hiddenPieces) {
    console.log('🔍 Creando posición con piezas ocultas para FEN:', currentFEN);
    // Parsea FEN, remueve piezas ocultas, retorna posición
}
```

**🔧 Funcionalidad**:
- Convierte FEN a posición completa
- Itera sobre `hiddenPieces` para identificar piezas a ocultar
- Remueve piezas ocultas de la posición
- Retorna posición solo con piezas visibles
- Mantiene integridad de casillas no afectadas

---

### `determineHiddenPieces(levelConfig, currentFEN)`
**📍 Línea**: ~740
**🎯 Propósito**: Determina qué piezas deben ocultarse para un nivel
**📥 Parámetros**:
- `levelConfig` (object) - Configuración del nivel
- `currentFEN` (string) - FEN de la posición actual
**📤 Retorna**: `array` - Array de objetos con piezas ocultas

```javascript
function determineHiddenPieces(levelConfig, currentFEN) {
    console.log('🔍 Determinando piezas ocultas SIN Chess.js');
    // Identifica piezas en casillas marcadas como hidden
}
```

**🔧 Funcionalidad**:
- Parsea FEN para obtener todas las piezas
- Cruza con `levelConfig.pieces_hidden` (array de casillas)
- Crea objetos `{square, piece, placed: false}` para cada pieza oculta
- Retorna array listo para usar en lógica de juego

---

### `getPieceName(pieceCode)`
**📍 Línea**: ~1529
**🎯 Propósito**: Convierte código de pieza a nombre legible en español
**📥 Parámetros**: `pieceCode` (string) - Código de pieza (ej: 'wK', 'bQ')
**📤 Retorna**: `string` - Nombre de la pieza en español

```javascript
function getPieceName(pieceCode) {
    const names = {
        'wK': 'Rey Blanco', 'bK': 'Rey Negro',
        'wQ': 'Dama Blanca', 'bQ': 'Dama Negra',
        // ... resto de piezas
    };
    return names[pieceCode] || pieceCode;
}
```

**🔧 Funcionalidad**:
- Mapea códigos estándar a nombres en español
- Maneja tanto piezas blancas (w) como negras (b)
- Incluye todas las piezas: Rey, Dama, Torre, Alfil, Caballo, Peón
- Retorna código original si no encuentra match

---

## 📊 Sistema de Puntuación

### `calculatePlacementScore(isCorrect)`
**📍 Línea**: ~1568
**🎯 Propósito**: Calcula puntuación por una colocación de pieza
**📥 Parámetros**: `isCorrect` (boolean) - Si la colocación fue correcta
**📤 Retorna**: `number` - Puntos a añadir o restar

```javascript
function calculatePlacementScore(isCorrect) {
    if (isCorrect) {
        return currentLevel.points_base + speedBonus + accuracyBonus;
    } else {
        return -Math.floor(currentLevel.points_base * 0.1);
    }
}
```

**🔧 Funcionalidad**:
- Colocación correcta: puntos base + bonos por velocidad/precisión
- Colocación incorrecta: penalty del 10% de puntos base
- Considera tiempo transcurrido para bonus de velocidad
- Considera ratio de aciertos para bonus de precisión

---

### `addScore(points)`
**📍 Línea**: ~1586
**🎯 Propósito**: Añade puntos al score total del jugador
**📥 Parámetros**: `points` (number) - Puntos a añadir (puede ser negativo)
**📤 Retorna**: `void`

```javascript
function addScore(points) {
    totalScore += points;
    updateScoreDisplay();
    console.log(`📊 Puntuación actualizada: +${points} = ${totalScore}`);
}
```

**🔧 Funcionalidad**:
- Actualiza variable global `totalScore`
- Actualiza display visual del score en UI
- Registra cambio en console para debugging
- Maneja puntuaciones negativas (penalties)

---

### `updatePlacementStats(isCorrect)`
**📍 Línea**: ~1598
**🎯 Propósito**: Actualiza estadísticas de colocaciones del jugador
**📥 Parámetros**: `isCorrect` (boolean) - Si la colocación fue correcta
**📤 Retorna**: `void`

```javascript
function updatePlacementStats(isCorrect) {
    if (isCorrect) {
        correctPlacements++;
    } else {
        incorrectPlacements++;
    }
    updateStatsDisplay();
}
```

**🔧 Funcionalidad**:
- Incrementa contador de colocaciones correctas/incorrectas
- Calcula ratio de precisión en tiempo real
- Actualiza displays de estadísticas en UI
- Mantiene histórico para análisis de progreso

---

## 🔗 Dependencias Entre Funciones

### 🔄 Flujo Principal de Inicialización
```
initMemoryMatrix()
├── verifyDependencies()
├── initializeChessboard()
│   └── setupBoardDropListeners()
└── loadLevel(1)
    ├── resetGame()
    └── setupBoardForLevel()
        ├── parseFenToChessboardPosition()
        └── determineHiddenPieces()
```

### 🎮 Flujo de Juego Activo
```
startGame()
└── startMemorizationPhase()
    └── startPlacementPhase()
        ├── createPieceBank()
        └── [Usuario arrastra pieza]
            └── handlePiecePlacementFromBank()
                ├── verifyPiecePlacement()
                ├── handleCorrectPlacement()
                │   ├── removePieceFromBank()
                │   ├── showFeedback()
                │   ├── addScore()
                │   └── checkLevelComplete()
                │       └── completeLevel()
                └── handleIncorrectPlacement()
                    ├── showFeedback()
                    ├── addScore()
                    └── addSquareEffect()
```

---

## 📝 Notas de Mantenimiento

### 🎯 Convenciones de Naming
- **Funciones de acción**: `verb + Noun` (ej: `loadLevel`, `createPieceBank`)
- **Funciones de verificación**: `verb + Condition` (ej: `verifyPiecePlacement`, `checkLevelComplete`)
- **Funciones de manejo**: `handle + Event` (ej: `handlePiecePlacement`, `handleCorrectPlacement`)

### 🔧 Patrones de Error Handling
- Todas las funciones verifican precondiciones antes de ejecutar
- Logging extensivo con emojis para facilitar debugging
- Graceful degradation cuando fallan dependencias externas
- Return early pattern para evitar nesting profundo

### 📊 Performance Considerations
- `window.processedDrops` Map se limpia automáticamente cada segundo
- Event listeners se configuran una sola vez durante inicialización
- DOM queries se minimizan usando referencias cacheadas
- CSS animations se manejan vía clases, no JavaScript

---

## 🏆 Resumen de Funcionalidades Clave

| Categoría | Funciones Críticas | Propósito |
|-----------|-------------------|-----------|
| **🚀 Core** | `initMemoryMatrix`, `loadLevel` | Inicialización y control principal |
| **🎮 Game Loop** | `startMemorizationPhase`, `startPlacementPhase` | Ciclo principal de juego |
| **🎯 Interaction** | `handlePiecePlacementFromBank`, `verifyPiecePlacement` | Manejo de drag & drop |
| **🎨 UI** | `createPieceBank`, `showFeedback` | Interfaz visual e interacción |
| **🔧 Utils** | `parseFenToChessboardPosition`, `getPieceName` | Conversiones y utilidades |
| **📊 Scoring** | `calculatePlacementScore`, `addScore` | Sistema de puntuación |

Este diccionario proporciona una referencia completa para entender, mantener y extender el código del proyecto Memory Matrix ChessBoard.js.