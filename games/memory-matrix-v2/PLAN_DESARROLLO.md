# 🎯 PLAN DE DESARROLLO - Memory Matrix v2
## Construcción paso a paso desde CERO

**Fecha**: 1 de Octubre de 2025
**Filosofía**: Mobile First, paso a paso, testeando cada paso

---

## 📋 PASOS DE DESARROLLO

### ✅ PASO 0: Preparación
- [x] Crear carpeta `memory-matrix-v2/`
- [x] Crear este documento de plan
- [ ] Crear documento de errores conocidos

### 🎨 PASO 1: Fondo y Estructura Básica (ChessArcade Style)
**Objetivo**: HTML + CSS base con estilo ChessArcade

**Archivos a crear:**
- `index.html` - Estructura HTML básica
- `styles.css` - Fondo neón, grid animado

**Elementos:**
- Fondo degradado oscuro (negro → morado)
- Grid animado cyan neón
- Header con título "Memory Matrix" estilo neón
- Botón HOME (esquina superior izquierda)
- Botón SONIDO (esquina superior derecha)

**Mobile First:**
- Layout vertical simple
- Padding responsive
- Fuente Orbitron

**Testing:**
- Ver fondo animado
- Botones posicionados correctamente
- Responsive en mobile (350px-600px)

---

### 🏠 PASO 2: Tablero Vacío (Center, Responsive)
**Objetivo**: Tablero de ajedrez 8x8 vacío, centrado

**Archivos a modificar:**
- `index.html` - Agregar div del tablero
- `styles.css` - Grid 8x8, colores, borde neón

**Elementos:**
- Tablero 8x8 con CSS Grid
- Colores: beige (#f0d9b5) y marrón (#b58863)
- Borde cyan neón `box-shadow: 0 0 20px #00ffff`
- Coordenadas (a-h, 1-8) en los bordes

**Mobile First:**
- Tablero ocupa 90% del ancho en mobile
- Max-width: 500px en desktop
- Centrado horizontal

**Testing:**
- Ver 64 casillas alternadas
- Borde neón visible
- Coordenadas legibles
- Responsive mobile → desktop

---

### ♟️ PASO 3: Piezas de Lichess (Solo Visualización)
**Objetivo**: Mostrar piezas SVG de Lichess en el tablero

**Archivos a crear:**
- `game.js` - JavaScript básico

**Archivos a modificar:**
- `index.html` - Import de game.js
- `styles.css` - Estilos para piezas

**Elementos:**
- Posición inicial hardcoded: 2 reyes (e1: wK, e8: bK)
- SVG desde CDN Lichess
- NO drag & drop todavía

**Código clave:**
```javascript
const LICHESS_CDN = 'https://lichess1.org/assets/piece/cburnett/';

function showPiece(square, piece) {
    const squareEl = document.querySelector(`[data-square="${square}"]`);
    const img = document.createElement('img');
    img.src = `${LICHESS_CDN}${piece}.svg`;
    img.className = 'piece';
    squareEl.appendChild(img);
}

showPiece('e1', 'wK');
showPiece('e8', 'bK');
```

**Testing:**
- Ver 2 reyes en e1 y e8
- Imágenes SVG correctas (NO texto)
- Piezas centradas en casillas
- Tamaño responsive

---

### 🎨 PASO 4: Botón Selector de Piezas
**Objetivo**: UI para cambiar estilo de piezas

**Archivos a crear:**
- `piece-selector.js` - Lógica del selector

**Archivos a modificar:**
- `index.html` - Botón y dropdown
- `styles.css` - Estilos del selector

**Elementos:**
- Botón "Piezas" (top-right, al lado de sonido)
- Dropdown con opciones:
  - Lichess (Default)
  - Chess.com
  - Wikipedia
- Preview de cada tema (imagen del rey blanco)
- localStorage para persistencia

**Mobile First:**
- Dropdown responsive
- Touch-friendly

**Testing:**
- Click abre dropdown
- Cambiar tema recarga piezas
- Persistencia funciona (refresh mantiene tema)

---

### 🎯 PASO 5: Banco Lateral de Piezas
**Objetivo**: Barra lateral con piezas draggables

**Archivos a crear:**
- `piece-bank.js` - Gestión del banco

**Archivos a modificar:**
- `index.html` - Div del banco
- `styles.css` - Layout grid (tablero + banco)
- `game.js` - Crear piezas en banco

**Elementos:**
- Barra lateral derecha (desktop)
- Barra inferior (mobile)
- Piezas draggables: wK, bK
- Fondo oscuro con borde neón naranja

**Mobile First:**
- Mobile: banco abajo del tablero
- Desktop (≥768px): banco a la derecha
- CSS Grid para layout

**Testing:**
- Layout responsive mobile ↔ desktop
- Piezas del banco se ven correctamente
- Draggable funciona (cursor grab)

---

### 🎮 PASO 6: Drag & Drop Básico
**Objetivo**: Arrastrar pieza del banco al tablero

**Archivos a modificar:**
- `game.js` - Event listeners drag & drop
- `piece-bank.js` - dragstart en piezas del banco

**Elementos:**
- dragstart en piezas del banco
- dragover + drop en tablero
- Calcular casilla exacta (ERROR #3 solucionado)
- Colocar pieza en casilla

**Código clave:**
```javascript
function getSquareFromCoordinates(x, y, boardElement) {
    const rect = boardElement.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;
    const col = Math.floor(relX / (rect.width / 8));
    const row = 8 - Math.floor(relY / (rect.height / 8));
    return ['a','b','c','d','e','f','g','h'][col] + row;
}
```

**Testing:**
- Arrastrar wK del banco
- Soltar en e4 → pieza aparece en e4
- Soltar en a1 → pieza aparece en a1
- NO en "primera casilla vacía"

---

### 🧠 PASO 7: Lógica del Juego (Nivel 1)
**Objetivo**: Flujo completo del juego nivel 1

**Archivos a crear:**
- `game-logic.js` - Estados y flujo

**Elementos:**
- Estados: waiting → memorizing → placing → complete
- Botón "Comenzar"
- Timer de memorización (3 segundos)
- Verificación de victoria
- Mensaje de estado

**Flujo:**
1. Click "Comenzar"
2. Mostrar 2 reyes (e1, e8) por 3 segundos
3. Ocultar reyes, mostrar banco
4. Usuario arrastra reyes del banco
5. Verificar si están en posición correcta
6. Si correcto: "¡Ganaste!"

**Testing:**
- Flujo completo funciona
- Timer visible
- Victoria detectada correctamente

---

### 📊 PASO 8: Sistema de Niveles
**Objetivo**: Cargar niveles desde archivo JSON

**Archivos a crear:**
- `levels.json` - 30 niveles con FENs

**Archivos a modificar:**
- `game-logic.js` - Cargar nivel dinámicamente

**Elementos:**
- Selector de nivel (dropdown)
- Cargar FEN desde levels.json
- Metadatos: tiempo, piezas a memorizar
- Progresión: desbloquear siguiente nivel

**Testing:**
- Cambiar nivel recarga correctamente
- Diferentes tiempos de memorización
- Diferentes cantidades de piezas

---

### 🎵 PASO 9: Sistema de Audio
**Objetivo**: Sonidos y música

**Archivos a crear:**
- `audio.js` - Gestión de audio

**Elementos:**
- Botón mute/unmute
- Sonido: pieza colocada
- Sonido: victoria
- Música de fondo (opcional, off por defecto)

**Testing:**
- Click mute/unmute funciona
- Sonidos se reproducen
- Volumen ajustable

---

### ✨ PASO 10: Pulido Final
**Objetivo**: Animaciones y detalles

**Elementos:**
- Fade in/out de piezas
- Shake en error
- Partículas en victoria
- Transiciones suaves

---

## 📝 REGLAS DE ORO

1. **UN PASO A LA VEZ** - No pasar al siguiente hasta que el actual funcione 100%
2. **MOBILE FIRST** - Siempre diseñar para mobile primero
3. **TESTEAR CADA CAMBIO** - Hard refresh + incognito
4. **COMENTAR CÓDIGO** - Explicar qué hace cada función
5. **DOCUMENTAR ERRORES** - Agregar a ERRORES_CONOCIDOS.md
6. **CDN SIEMPRE** - No usar SVG locales
7. **FUNCIÓN, NO STRING** - pieceTheme debe ser función

---

## 🎯 ESTADO ACTUAL

**Paso actual**: PASO 1 - Fondo y estructura básica

**Próximo**: Crear index.html con fondo ChessArcade

---

**¿Listo para empezar con PASO 1?**
