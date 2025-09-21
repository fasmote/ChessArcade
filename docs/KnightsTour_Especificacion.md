# 🐴 Knight's Tour - Especificación Técnica Detallada

## 📋 Resumen del Juego
El Salto del Caballo es un problema matemático clásico donde el jugador debe mover un caballo de ajedrez por todas las casillas del tablero exactamente una vez.

---

## 🎯 Requerimientos Funcionales

### RF-001: Tablero de Juego
- El sistema debe mostrar un tablero de ajedrez con dimensiones variables
- Tamaños soportados: 4x4, 5x5, 6x6, 8x8
- Cada casilla debe ser claramente identificable
- Casillas visitadas deben cambiar de color
- Casilla actual debe estar resaltada

### RF-002: Movimiento del Caballo
- El caballo debe moverse en forma de "L" (2+1 o 1+2 casillas)
- Solo movimientos válidos según reglas del ajedrez
- Click en casilla válida = mover caballo
- Resaltar casillas posibles antes de mover

### RF-003: Validación de Movimientos
- Sistema debe validar que el movimiento sea legal
- No permitir visitar casilla ya visitada
- Mostrar mensaje de error si movimiento inválido
- Detectar cuando no hay movimientos posibles

### RF-004: Sistema de Niveles
| Nivel | Tablero | Movimientos | Tiempo Límite | Puntos Base |
|-------|---------|-------------|---------------|-------------|
| Tutorial | 4x4 | 16 | Sin límite | 100 |
| Fácil | 5x5 | 25 | 5 min | 250 |
| Medio | 6x6 | 36 | 7 min | 500 |
| Difícil | 8x8 | 64 | 10 min | 1000 |
| Experto | 8x8 | 64 | 5 min | 2000 |

### RF-005: Sistema de Puntuación
```
Puntuación = Puntos Base × Multiplicador de Tiempo × Bonus de Eficiencia

Donde:
- Multiplicador de Tiempo = (Tiempo Límite - Tiempo Usado) / Tiempo Límite
- Bonus de Eficiencia = 1.5 si se completa en movimientos mínimos
```

### RF-006: Características Especiales
- **Deshacer**: Permitir deshacer último movimiento (máx 3 veces)
- **Pista**: Mostrar un movimiento válido (reduce puntuación 20%)
- **Reiniciar**: Comenzar el nivel desde cero
- **Solución**: Ver solución completa (no otorga puntos)

---

## 🎨 Requerimientos de UI/UX

### Diseño Visual
```
+------------------+------------------+
|                  |                  |
|   TABLERO        |   PANEL INFO     |
|   (70% ancho)    |   (30% ancho)    |
|                  |                  |
|                  | - Nivel          |
|   [Casillas      | - Movimientos    |
|    del juego]    | - Tiempo         |
|                  | - Puntuación     |
|                  |                  |
|                  | [Botones acción] |
+------------------+------------------+
```

### Paleta de Colores
- **Casillas claras**: #F0D9B5
- **Casillas oscuras**: #B58863
- **Casilla actual**: #7FFF00 (verde brillante)
- **Casillas visitadas**: Opacity 0.5
- **Movimientos posibles**: Border #FFD700 (dorado)
- **Movimiento inválido**: #FF6B6B (rojo suave)

### Animaciones
- Movimiento del caballo: 300ms ease-in-out
- Hover en casillas: Scale 1.05
- Victoria: Confetti animation
- Error: Shake animation

### Responsive Design
- **Desktop**: Layout horizontal
- **Tablet**: Layout horizontal, controles más grandes
- **Mobile**: Layout vertical, tablero arriba, controles abajo

---

## 💾 Estructura de Datos

### Estado del Juego
```javascript
const gameState = {
  level: "medium",           // tutorial | easy | medium | hard | expert
  boardSize: 6,             // 4 | 5 | 6 | 8
  currentPosition: {x: 0, y: 0},
  visitedSquares: [
    {x: 0, y: 0, moveNumber: 1}
  ],
  movesCount: 1,
  timeStarted: Date.now(),
  timeElapsed: 0,
  score: 0,
  hintsUsed: 0,
  undosUsed: 0,
  isCompleted: false,
  isPaused: false
}
```

### Configuración de Niveles
```javascript
const levelConfig = {
  tutorial: {
    boardSize: 4,
    timeLimit: null,
    baseScore: 100,
    hintsAllowed: unlimited,
    undosAllowed: unlimited
  },
  easy: {
    boardSize: 5,
    timeLimit: 300, // segundos
    baseScore: 250,
    hintsAllowed: 3,
    undosAllowed: 3
  }
  // ... más niveles
}
```

---

## 🔧 Arquitectura Técnica

### Componentes React
```
KnightsTour/
├── KnightsTourGame.jsx       // Componente principal
├── GameBoard.jsx              // Tablero de juego
├── Square.jsx                 // Casilla individual
├── Knight.jsx                 // Pieza del caballo
├── InfoPanel.jsx              // Panel de información
├── ControlButtons.jsx         // Botones de control
├── VictoryModal.jsx          // Modal de victoria
└── hooks/
    ├── useGameState.js       // Lógica del estado
    ├── useTimer.js           // Manejo del tiempo
    └── useScore.js           // Cálculo de puntuación
```

### Algoritmos Clave

#### Validación de Movimiento
```javascript
function isValidMove(from, to, visitedSquares) {
  // Verificar movimiento en L
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const isLMove = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  
  // Verificar si la casilla ya fue visitada
  const isVisited = visitedSquares.some(
    square => square.x === to.x && square.y === to.y
  );
  
  // Verificar límites del tablero
  const inBounds = to.x >= 0 && to.x < boardSize && 
                   to.y >= 0 && to.y < boardSize;
  
  return isLMove && !isVisited && inBounds;
}
```

#### Obtener Movimientos Posibles
```javascript
function getPossibleMoves(position, visitedSquares, boardSize) {
  const moves = [
    {x: 2, y: 1}, {x: 2, y: -1},
    {x: -2, y: 1}, {x: -2, y: -1},
    {x: 1, y: 2}, {x: 1, y: -2},
    {x: -1, y: 2}, {x: -1, y: -2}
  ];
  
  return moves
    .map(move => ({
      x: position.x + move.x,
      y: position.y + move.y
    }))
    .filter(pos => isValidMove(position, pos, visitedSquares));
}
```

#### Detectar Victoria
```javascript
function checkVictory(visitedSquares, boardSize) {
  return visitedSquares.length === boardSize * boardSize;
}
```

#### Algoritmo de Warnsdorff (para pistas)
```javascript
function getWarnsdorffHint(position, visitedSquares, boardSize) {
  const possibleMoves = getPossibleMoves(position, visitedSquares, boardSize);
  
  // Ordenar por accesibilidad (menos opciones futuras primero)
  return possibleMoves.sort((a, b) => {
    const aFuture = getPossibleMoves(a, [...visitedSquares, a], boardSize);
    const bFuture = getPossibleMoves(b, [...visitedSquares, b], boardSize);
    return aFuture.length - bFuture.length;
  })[0];
}
```

---

## 🧪 Plan de Testing

### Unit Tests
```javascript
describe('Knight Tour Game Logic', () => {
  test('Valid L-shaped moves', () => {
    expect(isValidMove({x:0,y:0}, {x:2,y:1}, [])).toBe(true);
    expect(isValidMove({x:0,y:0}, {x:1,y:1}, [])).toBe(false);
  });
  
  test('Cannot revisit squares', () => {
    const visited = [{x:2, y:1}];
    expect(isValidMove({x:0,y:0}, {x:2,y:1}, visited)).toBe(false);
  });
  
  test('Victory detection', () => {
    const visited = Array(16).fill().map((_, i) => ({
      x: i % 4,
      y: Math.floor(i / 4)
    }));
    expect(checkVictory(visited, 4)).toBe(true);
  });
});
```

### Integration Tests
- Flujo completo de un juego
- Sistema de puntuación
- Guardado de progreso
- Cambio entre niveles

### E2E Tests
- Tutorial completo
- Completar nivel fácil
- Usar todas las ayudas
- Responsive en diferentes dispositivos

---

## 📊 Métricas de Éxito

### KPIs del Juego
- **Tasa de completación por nivel**
  - Tutorial: >90%
  - Fácil: >70%
  - Medio: >40%
  - Difícil: >20%
  - Experto: >5%

- **Tiempo promedio de juego**: 5-10 minutos por sesión
- **Intentos promedio antes de victoria**: 2-3
- **Uso de pistas**: <30% de las partidas
- **Tasa de rage-quit**: <10%

### Métricas de Engagement
- Jugadores que prueban todos los niveles: >60%
- Jugadores que regresan al día siguiente: >40%
- Compartir victoria en redes: >20%

---

## 🚀 Mejoras Futuras (Post-MVP)

1. **Modo Competitivo**
   - Ranking global
   - Torneos semanales
   - Duelos 1v1

2. **Personalización**
   - Temas de tablero
   - Skins para el caballo
   - Efectos de sonido

3. **Modos Adicionales**
   - Contra-reloj
   - Mínimos movimientos
   - Tableros no cuadrados

4. **Features Sociales**
   - Compartir replays
   - Desafiar amigos
   - Logros desbloqueables

5. **Educativo**
   - Tutorial interactivo
   - Explicación matemática
   - Historia del problema

---

## 🐛 Casos Edge y Manejo de Errores

### Casos a Considerar
1. Usuario cierra navegador mid-game → Guardar estado en localStorage
2. Conexión lenta → Toda lógica client-side
3. Click múltiple rápido → Debounce de 300ms
4. Tablero sin solución desde posición → Detectar y avisar
5. Navegador no soporta ES6 → Mensaje de actualización

### Mensajes de Error
- "¡Movimiento inválido! El caballo se mueve en L"
- "Esta casilla ya fue visitada"
- "No hay movimientos posibles. ¿Reiniciar?"
- "¡Tiempo agotado! Intenta de nuevo"

---

*Especificación v1.0 - Knight's Tour*
*Próxima revisión: Post primera iteración de desarrollo*