# 🎯 Coordinate Sequence - Documento de Diseño

**Versión**: 1.0.0
**Fecha**: 15 Octubre 2025
**Estado**: En Desarrollo
**Branch**: `coordinate_sequence`

---

## 🎮 Concepto del Juego

**Coordinate Sequence** es un juego de memoria secuencial estilo "Simon Says" aplicado a coordenadas de ajedrez. Combina reconocimiento de coordenadas, memoria de secuencias y presión de tiempo.

### Elevator Pitch
> "Simon Says conoce el tablero de ajedrez: memoriza secuencias de casillas cada vez más largas y rápidas para convertirte en un maestro de las coordenadas."

---

## 🎯 Objetivos de Aprendizaje

1. **Reconocimiento instantáneo** de coordenadas (a1-h8)
2. **Memoria secuencial** de patrones
3. **Concentración** bajo presión de tiempo
4. **Velocidad** de respuesta

---

## 🎲 Mecánica del Juego

### Flujo Principal

```
INICIO
  ↓
NIVEL 1: Secuencia de 3 casillas
  ↓
FASE 1: MEMORIZACIÓN
- Tablero muestra secuencia (ej: e4 → d5 → f3)
- Cada casilla se ilumina por 800ms
- Pausa de 200ms entre casillas
- Total: ~3 segundos
  ↓
FASE 2: REPRODUCCIÓN
- Jugador debe hacer click en las casillas
- En el MISMO ORDEN
- Sin límite de tiempo (opcional: agregar timer)
  ↓
¿CORRECTO?
  ├─ SÍ → NIVEL 2 (4 casillas)
  └─ NO → Reintentar (3 intentos por nivel)
  ↓
PROGRESIÓN HASTA NIVEL 10+
```

### Fases Detalladas

#### **Fase 1: Memorización**
- Tablero vacío (solo coordenadas)
- Casillas se iluminan una por una
- Color neón cyan brillante
- Sonido "beep" por cada casilla
- No se puede interactuar

#### **Fase 2: Reproducción**
- Jugador hace click en casillas
- Feedback inmediato:
  - ✅ Correcto → Verde neón
  - ❌ Incorrecto → Rojo neón, mostrar secuencia correcta
- Al completar correctamente → Celebración + Siguiente nivel

---

## 📊 Sistema de Niveles

| Nivel | Casillas | Tiempo/Casilla | Pausa | Dificultad |
|-------|----------|----------------|-------|------------|
| 1     | 3        | 800ms          | 200ms | ⭐ Fácil   |
| 2     | 4        | 750ms          | 200ms | ⭐ Fácil   |
| 3     | 5        | 700ms          | 150ms | ⭐⭐ Medio |
| 4     | 6        | 650ms          | 150ms | ⭐⭐ Medio |
| 5     | 7        | 600ms          | 150ms | ⭐⭐⭐ Difícil |
| 6     | 8        | 550ms          | 100ms | ⭐⭐⭐ Difícil |
| 7     | 9        | 500ms          | 100ms | ⭐⭐⭐⭐ Experto |
| 8     | 10       | 450ms          | 100ms | ⭐⭐⭐⭐ Experto |
| 9     | 11       | 400ms          | 50ms  | ⭐⭐⭐⭐⭐ Maestro |
| 10+   | 12+      | 350ms          | 50ms  | ⭐⭐⭐⭐⭐ Maestro |

### Progresión
- **Nivel 1-2**: Introducción (velocidad lenta)
- **Nivel 3-4**: Intermedio (velocidad media)
- **Nivel 5-6**: Avanzado (velocidad rápida)
- **Nivel 7-8**: Experto (secuencias largas)
- **Nivel 9+**: Maestro (velocidad máxima)

### Reintentos
- 3 intentos por nivel
- Después de 3 fallos → Game Over
- Opción: "Reintentar nivel" o "Volver a nivel 1"

---

## 🎨 Diseño Visual

### Estilo ChessArcade
- **Fondo**: Gradiente oscuro (púrpura-negro)
- **Tablero**: Borde neón cyan
- **Casillas**: Alternadas claras/oscuras
- **Coordenadas**: Blanco fuerte en borde (como Memory Matrix)

### Estados de Casillas

#### Normal (no iluminada)
```css
background: #d2b48c (clara) / #8b7355 (oscura)
```

#### Iluminando (fase memorización)
```css
background: linear-gradient(45deg, cyan, lime)
box-shadow: 0 0 30px cyan
animation: pulse 800ms
```

#### Clickeada Correcta
```css
background: linear-gradient(45deg, lime, green)
box-shadow: 0 0 20px lime
```

#### Clickeada Incorrecta
```css
background: linear-gradient(45deg, red, darkred)
box-shadow: 0 0 20px red
animation: shake 500ms
```

### UI Elements

**Header:**
```
[🏠 HOME]  [▶ COMENZAR]  [🔊 SOUND]
```

**Título:**
```
🧠 Coordinate Sequence
"Memorize sequences and repeat them perfectly!"
```

**Stats (durante juego):**
```
┌─────────────────────────────────┐
│  NIVEL: 3       VIDAS: ❤️❤️❤️   │
│  SECUENCIA: 5   SCORE: 240      │
└─────────────────────────────────┘
```

**Tablero:**
```
  a   b   c   d   e   f   g   h
8 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 8
7 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 7
6 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 6
5 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 5
4 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 4
3 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 3
2 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 2
1 [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] 1
  a   b   c   d   e   f   g   h
```

---

## 🔊 Sistema de Audio

### Sonidos Necesarios

1. **Beep de Casilla** (fase memorización)
   - Frecuencia: 880 Hz (A5)
   - Duración: 200ms
   - Onda: Sine

2. **Click Correcto**
   - Frecuencia: 1046 Hz (C6)
   - Duración: 150ms
   - Onda: Sine

3. **Click Incorrecto**
   - Frecuencia: 220 Hz (A3) + ruido
   - Duración: 300ms
   - Onda: Square (sonido áspero)

4. **Nivel Completado**
   - Arpegio: C-E-G-C (523-659-783-1046 Hz)
   - Duración: 600ms

5. **Game Over**
   - Sweep descendente: 440 → 110 Hz
   - Duración: 800ms

### Web Audio API
Usar sistema similar a Memory Matrix (sonidos sintéticos, sin archivos externos).

---

## 💻 Arquitectura Técnica

### Estructura de Archivos
```
games/coordinate-sequence/
├── index.html           # HTML principal
├── styles.css           # Estilos neón
├── game.js             # Lógica del juego
├── audio.js            # Sistema de audio
├── levels.js           # Configuración de niveles
├── DESIGN.md           # Este documento
├── CHANGELOG.md        # Historial de cambios
└── README.md           # Instrucciones
```

### Estado del Juego

```javascript
let gameState = {
    // Progresión
    currentLevel: 1,
    score: 0,
    lives: 3,

    // Secuencia actual
    sequence: [],           // ['e4', 'd5', 'f3']
    playerSequence: [],     // Lo que el jugador clickeó
    currentStep: 0,         // Índice en reproducción

    // Fases
    phase: 'idle',          // 'idle' | 'showing' | 'playing' | 'success' | 'fail'

    // Config
    soundEnabled: true,

    // Stats
    bestLevel: 1,
    totalAttempts: 0,
    perfectLevels: 0
};
```

### Funciones Principales

```javascript
// Inicialización
function initGame()
function createBoard()
function setupEventListeners()

// Flujo del juego
function startLevel(levelNumber)
function generateSequence(length)
function showSequence()
function waitForPlayerInput()
function checkPlayerMove(square)
function onLevelComplete()
function onLevelFailed()
function gameOver()

// Visuales
function highlightSquare(square, color, duration)
function showSequenceAnimation()
function showFeedback(isCorrect)
function updateStats()

// Audio
function playBeep()
function playCorrect()
function playIncorrect()
function playLevelComplete()
function playGameOver()

// Utilidades
function getRandomSquare()
function areSequencesEqual(seq1, seq2)
function calculateScore(level, timeBonus)
```

---

## 🎯 Sistema de Puntuación

### Cálculo Base
```javascript
// Por nivel completado
baseScore = level * 10

// Bonus por velocidad (si se agrega timer)
timeBonus = Math.max(0, (maxTime - timeUsed) * 2)

// Bonus por perfect (sin fallos)
perfectBonus = isPerfect ? level * 5 : 0

// Total
score = baseScore + timeBonus + perfectBonus
```

### Ejemplo
- Nivel 3 completado en tiempo óptimo, sin errores:
  - Base: 3 × 10 = 30
  - Perfect: 3 × 5 = 15
  - **Total: 45 puntos**

---

## 🚀 Features Futuras (Opcional)

### Fase 1 (MVP)
- ✅ Mecánica básica (mostrar → repetir)
- ✅ 10 niveles de dificultad
- ✅ Sistema de vidas (3 intentos)
- ✅ Audio sintético
- ✅ Diseño neón ChessArcade

### Fase 2 (Mejoras)
- ⏳ Timer en fase de reproducción
- ⏳ Modo infinito (hasta fallar)
- ⏳ Leaderboard local (localStorage)
- ⏳ Estadísticas detalladas

### Fase 3 (Avanzado)
- ⏳ Patrones temáticos (solo diagonales, solo filas, etc.)
- ⏳ Modo multijugador (turnos)
- ⏳ Replay de secuencias falladas
- ⏳ Modo "Zen" (sin vidas, práctica libre)

---

## 📱 Responsive Design

### Mobile (≤767px)
- Tablero: 90% ancho viewport
- Casillas: ~40px
- Stats compactos arriba
- Botones táctiles grandes

### Tablet (768-1023px)
- Tablero: 450px
- Casillas: 50px
- Stats a los lados

### Desktop (≥1024px)
- Tablero: 500px
- Casillas: 55px
- Stats y controles espaciados

---

## ✅ Checklist de Desarrollo

### HTML
- [ ] Estructura base
- [ ] Header con botones HOME/SOUND
- [ ] Título y subtítulo
- [ ] Stats (nivel, vidas, score)
- [ ] Tablero 8x8 con coordenadas
- [ ] Overlays (success, fail, game over)
- [ ] How to Play section

### CSS
- [ ] Variables de color neón
- [ ] Estilos de tablero
- [ ] Animaciones (pulse, shake, glow)
- [ ] Estados de casillas
- [ ] Responsive mobile/tablet/desktop
- [ ] Overlays y modales

### JavaScript (game.js)
- [ ] Estado del juego
- [ ] Generación de secuencias
- [ ] Animación de mostrar secuencia
- [ ] Manejo de clicks del jugador
- [ ] Validación de secuencia
- [ ] Sistema de niveles
- [ ] Sistema de vidas
- [ ] Puntuación

### JavaScript (audio.js)
- [ ] Web Audio Context
- [ ] Sonidos sintéticos (beep, correct, incorrect)
- [ ] Control de volumen
- [ ] Toggle on/off

### JavaScript (levels.js)
- [ ] Configuración de 10+ niveles
- [ ] Parámetros (casillas, tiempos)

### Testing
- [ ] Nivel 1-3 (fácil)
- [ ] Nivel 4-6 (medio)
- [ ] Nivel 7-10 (difícil)
- [ ] Sistema de vidas
- [ ] Game Over
- [ ] Mobile responsive
- [ ] Audio on/off

### Polish
- [ ] Google Analytics
- [ ] Favicon
- [ ] Meta tags
- [ ] README.md
- [ ] CHANGELOG.md

---

## 🎨 Referencias Visuales

### Inspiración
- **Simon Says**: Mecánica de secuencias
- **Memory Matrix**: Estilo visual ChessArcade
- **Square Rush**: Velocidad y coordinadas
- **Guitar Hero**: Feedback visual de éxito/fallo

### Colores Clave
```css
--neon-cyan: #00ffff      /* Iluminación secuencia */
--neon-green: #00ff80     /* Click correcto */
--neon-red: #ff0040       /* Click incorrecto */
--neon-orange: #ff8000    /* Advertencias */
--neon-yellow: #ffff00    /* Highlights */
```

---

**Última actualización**: 15 Octubre 2025
**Próximo paso**: Crear HTML base con estructura ChessArcade
