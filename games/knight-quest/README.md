# 🐴 Knight Quest - Retro 80s Edition

> **El clásico "Salto del Caballo" reimaginado con estilo cyberpunk retro**

[![Game Status](https://img.shields.io/badge/status-PLAYABLE-success.svg?style=for-the-badge&color=00ff41)](./index.html)
[![Version](https://img.shields.io/badge/version-2.0.0-neon.svg?style=for-the-badge&color=ff0080)](../../../CHANGELOG.md)
[![Mobile Ready](https://img.shields.io/badge/mobile-ready-neon.svg?style=for-the-badge&color=00ffff)](./index.html)

## 🎯 Descripción del Juego

**Knight Quest** es una versión épica del clásico problema del "Salto del Caballo" (Knight's Tour), donde el objetivo es mover el caballo por todo el tablero de ajedrez visitando cada casilla exactamente **una vez**.

### ✨ Características Únicas

- 🌈 **Estética Cyberpunk**: Colores neón vibrantes y efectos de glow
- ⚡ **Efectos Visuales Épicos**: Rayos, pulsos y animaciones suaves
- 🎮 **4 Niveles de Dificultad**: Desde principiante hasta experto
- 💡 **Sistema de Pistas Inteligente**: Ayuda cuando la necesites
- 📱 **Optimización Móvil Total**: Perfecta experiencia táctil
- 🏆 **Sistema de Puntuación**: Compite contigo mismo

## 🎮 Cómo Jugar

### Objetivo
Mueve el caballo por todo el tablero visitando cada casilla exactamente una vez. El caballo se mueve en forma de "L" como en el ajedrez tradicional.

### Controles
- **🖱️ Click/Tap**: Mueve el caballo a una casilla válida
- **💡 Pista**: Muestra la mejor jugada disponible
- **↩️ Deshacer**: Deshace el último movimiento
- **🔄 Reiniciar**: Comienza un nuevo juego

### Dificultades

| Nivel | Tablero | Pistas | Descripción |
|-------|---------|---------|-------------|
| 🟢 **Principiante** | 4x4 | Ilimitadas | Perfecto para aprender |
| 🟡 **Intermedio** | 6x6 | 5 pistas | Desafío moderado |
| 🟠 **Avanzado** | 8x8 | 3 pistas | Para expertos |
| 🔴 **Experto** | 8x8 | Sin pistas | Solo para maestros |

## 🎨 Elementos Visuales

### Estados del Tablero

| Estado | Apariencia | Descripción |
|--------|------------|-------------|
| **🐴 Caballo Actual** | Pulso verde/azul con ♘ | Posición actual del caballo |
| **⚡ Movimientos Posibles** | Resplandor amarillo con rayo | Casillas donde puedes mover |
| **💜 Casillas Visitadas** | Gradiente púrpura/rosa con número | Orden de visita |
| **💎 Pista Activa** | Pulso azul/púrpura intenso | Mejor movimiento sugerido |
| **❌ Error** | Shake rojo | Movimiento inválido |

### Animaciones Épicas

```css
/* Efecto del caballo actual */
@keyframes knightPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 30px #00ff41;
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 0 0 50px #00ff41, 0 0 80px #00ffff;
  }
}

/* Rayo en movimientos posibles */
.knight-possible::before {
  content: '⚡';
  animation: lightningPulse 1s ease-in-out infinite;
}
```

## 🔧 Correcciones Técnicas v2.0.0

### 🐛 Bugs Críticos Solucionados

#### 1. **Inicialización en 4x4**
```javascript
// ANTES: No inicializaba correctamente
function initGame() {
    createBoard();
    updateUI();
}

// DESPUÉS: Fuerza configuración inicial
function initGame() {
    const config = KNIGHT_CONFIG.difficulties[gameState.difficulty];
    gameState.boardSize = config.size;  // ✅ CORREGIDO
    gameState.hintsLeft = config.hints;
    
    createBoard();
    updateUI();
}
```

#### 2. **Clicks No Funcionaban**
```javascript
// ANTES: Validación insuficiente
function handleSquareClick(targetIndex) {
    if (!gameState.isPlaying) return;
    // Lógica inconsistente...
}

// DESPUÉS: Validación robusta + logging
function handleSquareClick(targetIndex) {
    console.log(`🎯 Casilla clickeada: ${targetIndex}`);
    
    if (!gameState.isPlaying || gameState.isPaused) {
        console.log('❌ Juego no está activo');
        return;
    }
    // Lógica mejorada con debugging...
}
```

#### 3. **Textos Muy Pequeños**
```css
/* ANTES: Fuentes ilegibles */
.square { font-size: 12px; }
.stat { font-size: 10px; }

/* DESPUÉS: Tamaños legibles */
.square { font-size: 20px; }
.square.knight-current { font-size: 28px; }
.stat { font-size: 16px; }

/* Responsive mejorado */
@media (max-width: 768px) {
    .square { font-size: 18px; }
    .square.knight-current { font-size: 24px; }
}
```

### 📱 Mejoras de Móvil

```css
/* Touch optimization */
.square {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px; /* Área táctil mínima */
}

/* Prevent accidental zoom */
.btn {
    touch-action: manipulation;
    min-height: 45px;
}
```

## 🎯 Sistema de Puntuación

### Cálculo de Puntos

```javascript
function calculateScore() {
    let score = gameState.visitedSquares.size * 10;  // Base points
    
    // Time bonus (faster = more points)
    const timeElapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    score += Math.max(0, (300 - timeElapsed) * 2);
    
    // Penalties
    score -= gameState.hintsUsed * 25;    // Hint penalty
    score -= gameState.undosUsed * 10;    // Undo penalty
    
    return Math.max(0, Math.floor(score));
}
```

### Factores de Puntuación

| Factor | Puntos | Descripción |
|--------|--------|-------------|
| **Casilla Visitada** | +10 | Por cada casilla completada |
| **Bonus de Velocidad** | +2/seg | Máximo 300 segundos |
| **Penalty Pista** | -25 | Por cada pista usada |
| **Penalty Deshacer** | -10 | Por cada movimiento deshecho |
| **Bonus Completar** | +1000 | Por completar el tablero |

## 🔧 Archivos del Proyecto

```
knight-quest/
├── index.html              # 🏠 Juego principal con CSS integrado
├── knight-quest.js          # 🧠 Lógica del juego (legacy)
├── knight-styles.css        # 🎨 Estilos específicos (legacy)
└── README.md               # 📚 Esta documentación
```

## 🎮 Algoritmo del Juego

### Movimientos del Caballo
```javascript
const KNIGHT_MOVES = [
    [-2, -1], [-2, 1],  // 2 arriba, 1 izq/der
    [-1, -2], [-1, 2],  // 1 arriba, 2 izq/der  
    [1, -2], [1, 2],    // 1 abajo, 2 izq/der
    [2, -1], [2, 1]     // 2 abajo, 1 izq/der
];
```

### Validación de Movimientos
```javascript
function getPossibleMoves(pos) {
    const size = gameState.boardSize;
    const row = Math.floor(pos / size);
    const col = pos % size;
    const moves = [];
    
    KNIGHT_MOVES.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;
        
        // Verificar límites del tablero
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
            const newPos = newRow * size + newCol;
            // Solo incluir casillas no visitadas
            if (!gameState.visitedSquares.has(newPos)) {
                moves.push(newPos);
            }
        }
    });
    
    return moves;
}
```

## 🎨 Personalización

### Cambiar Colores Neón
```css
:root {
    --neon-pink: #ff0080;      /* Rosa principal */
    --neon-blue: #00ffff;      /* Azul cian */
    --neon-green: #00ff41;     /* Verde neón */
    --neon-yellow: #ffff00;    /* Amarillo eléctrico */
    --neon-purple: #bf00ff;    /* Púrpura mágico */
    --neon-orange: #ff8000;    /* Naranja energético */
}
```

### Ajustar Animaciones
```css
/* Velocidad de pulso del caballo */
.square.knight-current {
    animation: knightPulse 1.5s ease-in-out infinite;
}

/* Duración de efectos de pista */
.square.knight-hint {
    animation: hintPulse 0.6s ease 5; /* 5 repeticiones */
}
```

## 🐛 Debugging

### Logs Útiles
```javascript
// Estado del juego
console.log('🎮 Estado:', gameState);

// Movimientos posibles
console.log('🎯 Movimientos:', gameState.possibleMoves);

// Verificar tablero
console.log('🔍 Tablero:', gameState.boardSize + 'x' + gameState.boardSize);
```

### Problemas Comunes

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **Clicks no funcionan** | Casillas no responden | Verificar `gameState.isPlaying === true` |
| **Tablero muy pequeño** | Difícil de tocar en móvil | Ajustar `.chessboard.size-*` en CSS |
| **Textos ilegibles** | Fuentes muy pequeñas | Incrementar `font-size` en `.square` |
| **No hay movimientos** | Juego se bloquea | Verificar algoritmo `getPossibleMoves()` |

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (Android 8+)

### Características Requeridas
- CSS Grid & Flexbox
- CSS Custom Properties
- ES6 (Arrow functions, const/let)
- Touch Events
- Local Storage

## 🚀 Performance

### Métricas Objetivo
- **First Paint**: < 0.5s
- **Interactive**: < 1.0s
- **Smooth Animations**: 60 FPS
- **Touch Response**: < 50ms

### Optimizaciones
- GPU-accelerated animations (`transform`, `opacity`)
- Efficient event delegation
- Minimal DOM manipulation
- CSS transitions over JavaScript animations

---

## 🎉 ¡Disfruta Jugando!

**Knight Quest** combina la estrategia clásica del ajedrez con la estética vibrante de los años 80. Cada partida es una aventura visual única que desafía tu mente mientras deleita tus sentidos.

¿Puedes completar el recorrido perfecto? ¡Solo hay una forma de averiguarlo! 🐴⚡

---

*"En el tablero del cyber-espacio, solo los valientes caballos brillan con luz propia"* 🌈✨