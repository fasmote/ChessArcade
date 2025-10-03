# 🎮 ChessGameLibrary

**Modular JavaScript library for chess-based games**

Una librería modular, ligera y reutilizable para crear juegos basados en ajedrez con efectos visuales profesionales.

---

## 🚀 Características

- ✅ **Modular**: Cada funcionalidad es independiente
- ✅ **Reutilizable**: Úsala en múltiples juegos
- ✅ **Vanilla JS**: Sin dependencias externas
- ✅ **Animaciones fluidas**: Efectos CSS3 profesionales
- ✅ **Responsive**: Mobile-first design
- ✅ **TypeScript-ready**: Tipado opcional disponible

---

## 📦 Módulos Disponibles

### 1. **Utils.js** ✨ NEW
Utilidades generales para juegos de ajedrez

**Funciones:**
- `getPieceName(piece)` - Convierte código a nombre español (ej: 'wK' → 'Rey Blanco')
- `getPieceNameEN(piece)` - Convierte código a nombre inglés (ej: 'wK' → 'White King')
- `getPieceSymbol(piece)` - Obtiene símbolo Unicode (ej: 'wK' → '♔')
- `getPieceType(piece)` - Obtiene tipo sin color (ej: 'wK' → 'Rey')
- `getPieceColor(piece)` - Obtiene color (ej: 'wK' → 'Blanco')
- `squareToIndex(square)` - Convierte notación algebraica a índice (ej: 'e4' → 28)
- `indexToSquare(index)` - Convierte índice a notación (ej: 28 → 'e4')
- `getRank(square)` - Obtiene fila (ej: 'e4' → 4)
- `getFile(square)` - Obtiene columna (ej: 'e4' → 'e')
- `isValidSquare(square)` - Valida coordenada de ajedrez
- `isValidPiece(piece)` - Valida código de pieza

### 2. **PieceAnimations.js**
Animaciones de piezas de ajedrez

**Funciones:**
- `animatePieceToBank(square, piece, bankSlot, options)` - Pieza vuela al banco
- `animatePieceFromBank(bankSlot, toSquare, piece, options)` - Pieza vuela desde banco
- `hidePiecesWithAnimation(squares, options)` - Oculta múltiples piezas con stagger

### 3. **DragDrop.js** ✨ NEW
Sistema de drag & drop para piezas

**Funciones:**
- `initDragDrop(config)` - Inicializa drag & drop
  - `bankSelector` - Selector del banco de piezas
  - `boardSelector` - Selector del tablero
  - `onPiecePlaced` - Callback cuando se coloca pieza
  - `canPlacePiece` - Función de validación
- Soporta mouse y touch (mobile)
- Ghost element que sigue al cursor
- Highlight visual de casillas
- Bounce back en colocación inválida

---

## 💡 Uso Básico

```javascript
// Importar módulos
import { animatePieceMove, animatePieceToBank } from './ChessGameLibrary/PieceAnimations.js';
import { createPieceBank, addPieceToBank } from './ChessGameLibrary/PieceBank.js';

// Crear banco vacío
const bank = createPieceBank({
    container: '#pieceBank',
    style: 'cburnett',
    orientation: 'vertical'
});

// Animar pieza del tablero al banco
animatePieceToBank('e4', 'wK', '#bank-slot-1', {
    duration: 600,
    easing: 'ease-out',
    onComplete: () => {
        console.log('¡Pieza en el banco!');
        addPieceToBank('wK');
    }
});

// Mover pieza en tablero
animatePieceMove('e2', 'e4', 'wP', {
    duration: 400,
    onComplete: () => console.log('Movimiento completo')
});
```

---

## 🎯 Ejemplo: Memory Matrix

```javascript
// 1. Mostrar posición inicial
showPosition(['wK:e1', 'bK:e8', 'wQ:d1']);

// 2. Después de 3 segundos, ocultar piezas y enviarlas al banco
setTimeout(() => {
    hidePiecesWithAnimation(['e1', 'e8', 'd1'], {
        onComplete: () => {
            // Banco ahora tiene las piezas
            console.log('Memoriza esta posición!');
        }
    });
}, 3000);

// 3. Usuario reconstruye desde banco
// (Las piezas vuelan del banco de vuelta al tablero)
```

---

## 🎨 Ejemplo: Puzzle Táctico

```javascript
// Mostrar posición del puzzle
showPosition(puzzlePosition);

// Usuario mueve pieza
animatePieceMove('e5', 'f7', 'wN', {
    duration: 500,
    onComplete: () => {
        if (isCorrectMove('e5-f7')) {
            showSuccess();
        }
    }
});
```

---

## 📁 Estructura de Archivos

```
ChessGameLibrary/
├── README.md                  # Este archivo
├── PieceAnimations.js         # Animaciones de piezas
├── BoardUtils.js              # Utilidades de tablero
├── PieceBank.js               # Sistema de banco
├── DragDrop.js                # Drag & drop
├── PositionManager.js         # Gestión de posiciones
└── examples/
    ├── memory-game.html       # Ejemplo: Memory Matrix
    ├── puzzle-game.html       # Ejemplo: Puzzle
    └── basic-usage.html       # Ejemplo básico
```

---

## 🔧 Configuración Avanzada

### Opciones de Animación

```javascript
const defaultOptions = {
    duration: 500,        // Duración en ms
    easing: 'ease-out',   // Función de easing CSS
    delay: 0,             // Delay antes de iniciar
    onStart: () => {},    // Callback al iniciar
    onComplete: () => {}, // Callback al completar
    trail: false,         // Dejar rastro visual
    sound: null          // Sonido a reproducir
};
```

### Temas de Piezas

```javascript
const pieceThemes = {
    lichess: 'cburnett',
    chesscom: 'merida',
    classic: 'cardinal',
    wikipedia: 'wikipedia'
};
```

---

## 🎯 Casos de Uso

### ✅ Juegos que puedes crear:

1. **Memory Matrix** - Memoriza posiciones
2. **Blind Chess** - Juega sin ver
3. **Puzzle Rush** - Resuelve puzzles rápido
4. **Piece Hunter** - Encuentra piezas específicas
5. **Chess Simon Says** - Replica secuencias
6. **Position Builder** - Construye posiciones FEN

---

## 🚀 Roadmap

- [ ] TypeScript definitions
- [ ] Soporte para chess960
- [ ] Animaciones 3D opcionales
- [ ] Sistema de sonidos integrado
- [ ] Temas personalizables
- [ ] Exportar/importar FEN
- [ ] Análisis de movimientos

---

## 📄 Licencia

MIT License - Libre para uso comercial y personal

---

## 🤝 Contribuciones

¡Contribuciones bienvenidas!

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👨‍💻 Autor

**ChessArcade Team**
- GitHub: [@chessarcade](https://github.com/chessarcade)
- Website: [chessarcade.com](https://chessarcade.com)

---

## 🙏 Agradecimientos

Inspirado por:
- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic library
- [chessboard2.js](https://github.com/oakmac/chessboardjs/) - Chessboard UI
- [Lichess](https://lichess.org) - Open source chess platform

---

**¡Construye increíbles juegos de ajedrez con ChessGameLibrary! ♟️**
