# 🚀 Square Rush - Mejoras Futuras
## Ideas y Expansiones para Versiones 2.0+

---

**Proyecto:** Square Rush - ChessArcade
**Versión Actual:** 1.0 (10 niveles)
**Fecha:** Octubre 2025
**Estado:** Planificación

---

## 📑 Tabla de Contenidos

1. [Nuevos Modos de Juego](#1-nuevos-modos-de-juego)
2. [Niveles Avanzados (11-20+)](#2-niveles-avanzados-11-20)
3. [Rotaciones del Tablero](#3-rotaciones-del-tablero)
4. [Modo Patrón (Trencito)](#4-modo-patrón-trencito)
5. [Modo Blindfold](#5-modo-blindfold)
6. [Modo Competitivo](#6-modo-competitivo)
7. [Power-ups y Bonus](#7-power-ups-y-bonus)
8. [Sistema de Rankings](#8-sistema-de-rankings)
9. [Personalización Visual](#9-personalización-visual)
10. [Implementación Técnica](#10-implementación-técnica)

---

## 1. NUEVOS MODOS DE JUEGO

### 🎯 Modo Clásico (Actual)
**Estado:** ✅ Implementado
- 10 niveles progresivos
- Tiempo limitado por casilla
- Sistema de combos

---

### 🔄 Modo Rotación
**Estado:** 💡 Planificado
**Descripción:** El tablero gira pero las coordenadas siguen siendo las mismas.

**Variantes:**
- **Vista Negras (180°):** Tablero invertido
- **Vista Lateral (90°/270°):** Tablero rotado lateralmente
- **Caos Rotatorio:** Rotación aleatoria después de cada click

**Dificultad:** Alta
**Prioridad:** Alta

---

### 🚂 Modo Patrón (Trencito) ⭐ FAVORITO
**Estado:** 💡 Planificado - **ALTA PRIORIDAD**
**Descripción:** Las casillas aparecen una detrás de otra como un "trencito". Debes clickearlas en orden secuencial.

**Funcionamiento:**
```
Nivel 1: Secuencia de 3 casillas
Muestra: E4 → D6 → H2
(cada casilla se ilumina 0.5s después de la anterior)

Player debe clickear:
1. E4 ✓ (aparece D6)
2. D6 ✓ (aparece H2)
3. H2 ✓ (nivel completado!)
```

**Mecánicas:**
1. **Visualización:**
   - Primera casilla se ilumina en cyan brillante
   - Después de 0.5-1s, siguiente casilla se ilumina
   - Forma una "cola" visual (efecto trail)
   - Las casillas anteriores quedan semi-iluminadas

2. **Gameplay:**
   - Debes clickear en el orden exacto
   - Si clickeas fuera de orden → pierde 1 vida
   - Si clickeas correctamente → aparece la siguiente
   - Timer corre desde que aparece la primera casilla

3. **Progresión:**
   - Nivel 1: 3 casillas (trail corto)
   - Nivel 5: 5 casillas (trail medio)
   - Nivel 10: 8 casillas (trail largo)
   - Nivel 15: 10 casillas + rotación del tablero

**Variantes Avanzadas:**
- **Speed Trail:** Trail muy rápido (0.2s entre casillas)
- **Memory Trail:** Trail se muestra y luego desaparece, debes recordarlo
- **Random Trail:** Patrón completamente aleatorio
- **Pattern Trail:** Sigue patrones (diagonal, L de caballo, etc.)

**Implementación Estimada:** 4-6 horas

**Visual Concept:**
```
Tablero:
8 ░▓░▓░▓░▓
7 ▓░▓█░▓░▓  ← H2 (tercer click, más brillante)
6 ░▓█▓░▓░▓  ← D6 (segundo click, brillo medio)
5 ▓░▓░▓░▓░
4 ░▓░▓█▓░▓  ← E4 (primer click, brillo bajo)
3 ▓░▓░▓░▓░
2 ░▓░▓░▓░▓
1 ▓░▓░▓░▓░
  abcdefgh

Orden de clicks: E4 → D6 → H2
Trail effect: gradient de cyan a magenta
```

**Puntuación:**
- Click correcto en orden: +100 pts
- Secuencia completa sin errores: Bonus x2
- Tiempo restante: +10 pts por segundo

**Sonidos:**
- Cada casilla del trail: nota ascendente (C → E → G)
- Click correcto: "ding" armónico
- Secuencia completa: acorde victorioso

---

### 🏃 Modo Contrarreloj
**Estado:** 💡 Planificado
**Descripción:** 60 segundos para clickear TODAS las casillas del tablero en orden (A1 → A2 → ... → H8).

**Mecánica:**
- Countdown de 60 segundos
- Debes clickear las 64 casillas en orden alfabético/numérico
- Si te equivocas, pierdes 5 segundos de penalidad
- Record de tiempo guardado

**Variantes:**
- **Marathon:** Recorrer A1-H8 en el menor tiempo posible
- **Reverse Marathon:** Recorrer H8-A1
- **Diagonal Sprint:** Solo diagonales principales
- **Knight Tour Sprint:** Recorrer tablero como caballo

---

### 🎪 Modo Arcade
**Estado:** 💡 Planificado
**Descripción:** Modo infinito sin niveles, dificultad aumenta gradualmente.

**Mecánica:**
- Empieza con 10s por casilla
- Cada 10 casillas correctas, tiempo se reduce 0.5s
- Continúa hasta que falles 3 veces
- High score global

---

### 🧩 Modo Patrón Geométrico
**Estado:** 💡 Planificado
**Descripción:** Debes clickear solo casillas que forman un patrón específico.

**Patrones Posibles:**
1. **Diagonales:** Todas las casillas diagonales (A1-H8, A8-H1)
2. **Cruz:** Fila 4, columna E (forma una cruz)
3. **Perímetro:** Solo bordes del tablero
4. **Ajedrezado:** Solo casillas blancas o solo negras
5. **Cuadrado Central:** Solo casillas centrales (C3-F6)
6. **Letra L:** Patrón en forma de L
7. **Zig-Zag:** Patrón en zig-zag
8. **Espiral:** Desde afuera hacia adentro

**Gameplay:**
- Te muestran el patrón resaltado por 3 segundos
- Luego desaparece
- Debes clickear solo las casillas del patrón
- Si clickeas fuera del patrón → pierde 1 vida

---

## 2. NIVELES AVANZADOS (11-20+)

### 📊 Estructura de Niveles Expandida

#### **Niveles 11-15: Perspectiva (Rotaciones)**
```javascript
11: {
    name: "PERSPECTIVE",
    targets: 10,
    time: 5.0,
    theme: "neon",
    rotation: 180,  // Vista desde negras
    description: "See from Black's perspective"
},
12: {
    name: "PERSPECTIVE",
    targets: 12,
    time: 5.0,
    theme: "neon",
    rotation: 180
},
13: {
    name: "SIDEWAYS",
    targets: 10,
    time: 6.0,
    theme: "neon",
    rotation: 90,  // Rotación 90° horario
    description: "Board rotated 90 degrees"
},
14: {
    name: "SIDEWAYS",
    targets: 12,
    time: 6.0,
    theme: "neon",
    rotation: 270  // Rotación 270° horario
},
15: {
    name: "CHAOS MODE",
    targets: 15,
    time: 8.0,
    theme: "neon",
    rotation: "random",  // Rotación aleatoria después de cada click
    description: "Board rotates randomly!"
}
```

#### **Niveles 16-20: Blindfold (Sin Coordenadas)**
```javascript
16: {
    name: "BLINDFOLD",
    targets: 8,
    time: 8.0,
    theme: "dark",
    hideCoords: true,  // Ocultar coordenadas del tablero
    description: "No coordinates shown"
},
17: {
    name: "BLINDFOLD",
    targets: 10,
    time: 7.0,
    theme: "dark",
    hideCoords: true
},
18: {
    name: "BLINDFOLD",
    targets: 12,
    time: 6.0,
    theme: "dark",
    hideCoords: true
},
19: {
    name: "MASTER BLIND",
    targets: 15,
    time: 6.0,
    theme: "dark",
    hideCoords: true,
    rotation: 180,  // Blindfold + rotación = brutal
    description: "No coords + rotated board"
},
20: {
    name: "ULTIMATE",
    targets: 20,
    time: 8.0,
    theme: "dark",
    hideCoords: true,
    rotation: "random",
    description: "Final challenge!"
}
```

#### **Niveles 21-25: Trail Mode (Modo Patrón)**
```javascript
21: {
    name: "TRAIL BEGINNER",
    mode: "trail",
    sequenceLength: 3,  // 3 casillas en secuencia
    time: 10.0,
    theme: "neon"
},
22: {
    name: "TRAIL BEGINNER",
    mode: "trail",
    sequenceLength: 4,
    time: 12.0,
    theme: "neon"
},
23: {
    name: "TRAIL MASTER",
    mode: "trail",
    sequenceLength: 5,
    time: 15.0,
    theme: "neon"
},
24: {
    name: "TRAIL MASTER",
    mode: "trail",
    sequenceLength: 6,
    time: 18.0,
    theme: "neon",
    rotation: 180  // Trail + rotación
},
25: {
    name: "TRAIL LEGEND",
    mode: "trail",
    sequenceLength: 8,
    time: 25.0,
    theme: "neon",
    rotation: "random"  // Trail + rotación random = insano
}
```

#### **Niveles 26-30: Mixed Challenges**
```javascript
26: {
    name: "HYBRID",
    targets: 10,
    mode: "trail",
    sequenceLength: 4,
    time: 15.0,
    rotation: 90,
    description: "Mix of everything"
},
27: {
    name: "SPEED TRAIL",
    mode: "trail",
    sequenceLength: 5,
    time: 8.0,  // Trail rápido
    trailSpeed: 0.2  // 0.2s entre casillas (muy rápido)
},
28: {
    name: "MEMORY TRAIL",
    mode: "trail",
    sequenceLength: 6,
    time: 20.0,
    showTrail: false,  // Trail se muestra y desaparece
    memorizeTime: 5.0  // 5s para memorizar
},
29: {
    name: "PATTERN TRAIL",
    mode: "trail",
    pattern: "knight",  // Sigue movimientos de caballo
    sequenceLength: 8,
    time: 25.0
},
30: {
    name: "GOD MODE",
    mode: "trail",
    sequenceLength: 10,
    time: 30.0,
    rotation: "random",
    hideCoords: true,
    trailSpeed: 0.3,
    description: "Only for legends"
}
```

---

## 3. ROTACIONES DEL TABLERO

### 🔄 Implementación de Rotaciones

#### **Tipos de Rotación:**

**A) Rotación 180° - Vista Negras**
```
Normal:                  Rotado 180°:
8 ░▓░▓░▓░▓              1 ▓░▓░▓░▓░
7 ▓░▓░▓░▓░              2 ░▓░▓░▓░▓
6 ░▓░▓░▓░▓              3 ▓░▓░▓░▓░
5 ▓░▓░▓░▓░              4 ░▓░▓░▓░▓
4 ░▓░▓░▓░▓              5 ▓░▓░▓░▓░
3 ▓░▓░▓░▓░              6 ░▓░▓░▓░▓
2 ░▓░▓░▓░▓              7 ▓░▓░▓░▓░
1 ▓░▓░▓░▓░              8 ░▓░▓░▓░▓
  abcdefgh                hgfedcba
```
- **Dificultad:** Media
- **Uso:** Niveles 11-12
- **Nota:** Coordenadas siguen siendo A1-H8, pero visualmente está invertido

**B) Rotación 90° - Vista Lateral Derecha**
```
Normal:                  Rotado 90°:
8 ░▓░▓░▓░▓              h1 h2 h3 h4 h5 h6 h7 h8
7 ▓░▓░▓░▓░              g1 g2 g3 g4 g5 g6 g7 g8
...                      ...
1 ▓░▓░▓░▓░              a1 a2 a3 a4 a5 a6 a7 a8
  abcdefgh
```
- **Dificultad:** Alta
- **Uso:** Nivel 13
- **Nota:** Las columnas ahora son verticales

**C) Rotación 270° - Vista Lateral Izquierda**
- Rotación inversa a 90°
- **Dificultad:** Alta
- **Uso:** Nivel 14

**D) Rotación Random**
- Cambia aleatoriamente (0°, 90°, 180°, 270°) después de cada click
- **Dificultad:** Muy Alta (caos total)
- **Uso:** Niveles 15, 25, 30

---

### 🎨 CSS para Rotaciones

```css
/* ==========================================
   ROTACIONES DEL TABLERO
   ========================================== */

.chessboard {
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Rotación 90° horario */
.chessboard.rotate-90 {
    transform: rotate(90deg);
}

/* Rotación 180° (vista negras) */
.chessboard.rotate-180 {
    transform: rotate(180deg);
}

/* Rotación 270° horario */
.chessboard.rotate-270 {
    transform: rotate(270deg);
}

/* Contra-rotación de coordenadas para mantenerlas legibles */
.chessboard.rotate-90 .coordinate-label,
.chessboard.rotate-180 .coordinate-label,
.chessboard.rotate-270 .coordinate-label {
    /* Opcional: rotar las coordenadas de vuelta */
    /* transform: rotate(-90deg); */
}

/* Animación de rotación caótica */
@keyframes chaotic-rotation {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(90deg); }
    50% { transform: rotate(180deg); }
    75% { transform: rotate(270deg); }
    100% { transform: rotate(360deg); }
}

.chessboard.chaos-mode {
    animation: chaotic-rotation 2s infinite linear;
}
```

---

### 🔧 JavaScript para Rotaciones

```javascript
/**
 * Aplica rotación al tablero
 * @param {number|string} rotation - 0, 90, 180, 270, o "random"
 */
function applyRotation(rotation) {
    const board = document.getElementById('chessBoard');

    // Limpiar rotaciones previas
    board.classList.remove('rotate-90', 'rotate-180', 'rotate-270', 'chaos-mode');

    if (rotation === "random") {
        // Rotación aleatoria
        const rotations = [0, 90, 180, 270];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        applyRotation(randomRotation);
    } else if (rotation === 90) {
        board.classList.add('rotate-90');
    } else if (rotation === 180) {
        board.classList.add('rotate-180');
    } else if (rotation === 270) {
        board.classList.add('rotate-270');
    }
    // rotation === 0 o undefined → sin rotación
}

/**
 * Rotación aleatoria después de cada click
 */
function randomRotateAfterClick() {
    setTimeout(() => {
        const rotations = [0, 90, 180, 270];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        applyRotation(randomRotation);
    }, 300); // 300ms después del click
}

/**
 * Actualizar al iniciar nivel
 */
function startLevel() {
    const levelConfig = levels[gameState.level];

    // Aplicar rotación si existe
    if (levelConfig.rotation !== undefined) {
        applyRotation(levelConfig.rotation);
    }

    // Si es rotación random, rotar después de cada click
    if (levelConfig.rotation === "random") {
        // Agregar listener
        document.querySelectorAll('.square').forEach(square => {
            square.addEventListener('click', randomRotateAfterClick);
        });
    }
}
```

---

## 4. MODO PATRÓN (TRENCITO) - DETALLE COMPLETO

### 🚂 Concepto Visual

**Idea Principal:** Las casillas aparecen secuencialmente creando un "trail" (estela) visual, como un trencito luminoso que recorre el tablero.

---

### 🎨 Diseño Visual

#### **Efecto Trail (Estela)**
```
Estado Inicial (t=0s):
8 ░▓░▓░▓░▓
7 ▓░▓░▓░▓░
6 ░▓░▓░▓░▓
5 ▓░▓░▓░▓░
4 ░▓░▓●▓░▓  ← E4 aparece (brillo máximo)
3 ▓░▓░▓░▓░
2 ░▓░▓░▓░▓
1 ▓░▓░▓░▓░
  abcdefgh

Después de 0.5s (t=0.5s):
8 ░▓░▓░▓░▓
7 ▓░▓░▓░▓░
6 ░▓●▓░▓░▓  ← D6 aparece (brillo máximo)
5 ▓░▓░▓░▓░
4 ░▓░▓◐▓░▓  ← E4 sigue visible (brillo medio)
3 ▓░▓░▓░▓░
2 ░▓░▓░▓░▓
1 ▓░▓░▓░▓░
  abcdefgh

Después de 1s (t=1.0s):
8 ░▓░▓░▓░▓
7 ▓░▓░▓░▓●  ← H7 aparece (brillo máximo)
6 ░▓◑▓░▓░▓  ← D6 ahora brillo medio
5 ▓░▓░▓░▓░
4 ░▓░▓◯▓░▓  ← E4 ahora brillo bajo
3 ▓░▓░▓░▓░
2 ░▓░▓░▓░▓
1 ▓░▓░▓░▓░
  abcdefgh

Leyenda:
● = Casilla activa (brillo máximo) - cyan brillante
◐ = Casilla anterior (brillo medio) - cyan medio
◑ = Casilla antigua (brillo bajo) - cyan oscuro
◯ = Casilla muy antigua (brillo mínimo) - casi invisible
```

---

### 🎮 Mecánica de Juego

#### **Fase 1: Mostrar Trail**
1. Primera casilla aparece (ej: E4)
2. Después de 0.5s, segunda casilla aparece (ej: D6)
3. Después de 0.5s más, tercera casilla aparece (ej: H7)
4. El trail completo queda visible con gradient de brillo

#### **Fase 2: Input del Jugador**
1. Timer empieza a contar
2. Player debe clickear la primera casilla (E4)
3. Si correcto: ✅
   - Sonido "ding" (nota musical)
   - Casilla cambia a verde
   - Siguiente casilla se resalta más
4. Si incorrecto: ❌
   - Sonido "buzz" (error)
   - Casilla sacude (shake effect)
   - Pierde 1 vida (si hay sistema de vidas)
5. Continúa hasta completar secuencia

#### **Fase 3: Completado**
- Si completa toda la secuencia: NIVEL COMPLETO
- Bonus por tiempo restante
- Combo multiplier si no hubo errores

---

### 🎨 CSS para Trail Effect

```css
/* ==========================================
   TRAIL MODE (MODO PATRÓN)
   ========================================== */

/* Casilla del trail - estado base */
.square.trail {
    position: relative;
    overflow: visible;
}

/* Trail activo (casilla más reciente) */
.square.trail-active {
    background: radial-gradient(circle, rgba(0, 255, 255, 1) 0%, rgba(0, 255, 255, 0.3) 100%) !important;
    box-shadow:
        0 0 20px rgba(0, 255, 255, 1),
        inset 0 0 20px rgba(0, 255, 255, 0.8);
    animation: trail-pulse 0.8s ease-in-out infinite;
    z-index: 100;
}

/* Trail medio (casilla anterior) */
.square.trail-medium {
    background: radial-gradient(circle, rgba(0, 255, 255, 0.6) 0%, rgba(0, 255, 255, 0.2) 100%) !important;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
    z-index: 90;
}

/* Trail bajo (casilla antigua) */
.square.trail-low {
    background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, rgba(0, 255, 255, 0.1) 100%) !important;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    z-index: 80;
}

/* Trail mínimo (casilla muy antigua) */
.square.trail-minimal {
    background: rgba(0, 255, 255, 0.1) !important;
    z-index: 70;
}

/* Animación de pulso para casilla activa */
@keyframes trail-pulse {
    0%, 100% {
        box-shadow:
            0 0 20px rgba(0, 255, 255, 1),
            inset 0 0 20px rgba(0, 255, 255, 0.8);
    }
    50% {
        box-shadow:
            0 0 30px rgba(0, 255, 255, 1),
            inset 0 0 30px rgba(0, 255, 255, 1);
    }
}

/* Línea conectora entre casillas (opcional) */
.trail-connector {
    position: absolute;
    background: linear-gradient(90deg,
        rgba(0, 255, 255, 0.6),
        rgba(0, 255, 255, 0.3)
    );
    height: 4px;
    pointer-events: none;
    z-index: 60;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

/* Casilla correctamente clickeada */
.square.trail-correct {
    background: radial-gradient(circle, rgba(0, 255, 128, 1) 0%, rgba(0, 255, 128, 0.3) 100%) !important;
    box-shadow: 0 0 25px rgba(0, 255, 128, 1);
    animation: trail-success 0.5s ease-out;
}

@keyframes trail-success {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
}

/* Casilla incorrectamente clickeada */
.square.trail-wrong {
    background: radial-gradient(circle, rgba(255, 0, 128, 1) 0%, rgba(255, 0, 128, 0.3) 100%) !important;
    box-shadow: 0 0 25px rgba(255, 0, 128, 1);
    animation: trail-error 0.5s ease-out;
}

@keyframes trail-error {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

/* Número de secuencia en casilla */
.trail-number {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.8);
    color: #00ffff;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    border: 1px solid #00ffff;
    z-index: 110;
    pointer-events: none;
}
```

---

### 🔧 JavaScript para Trail Mode

```javascript
/**
 * ==========================================
 * TRAIL MODE - MODO PATRÓN
 * ==========================================
 */

const trailMode = {
    sequence: [],          // Array de índices de casillas
    currentStep: 0,        // Paso actual en la secuencia
    showSpeed: 500,        // ms entre cada casilla que aparece
    isShowing: false,      // Está mostrando el trail
    isPlaying: false       // Player está jugando
};

/**
 * Generar secuencia aleatoria de casillas
 * @param {number} length - Cantidad de casillas en el trail
 * @returns {Array<number>} - Array de índices
 */
function generateTrailSequence(length) {
    const sequence = [];
    let lastIndex = Math.floor(Math.random() * 64);
    sequence.push(lastIndex);

    for (let i = 1; i < length; i++) {
        // Generar siguiente casilla (puede ser adyacente o random)
        // Opción 1: Completamente random
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * 64);
        } while (sequence.includes(nextIndex)); // Evitar duplicados

        sequence.push(nextIndex);
        lastIndex = nextIndex;
    }

    return sequence;
}

/**
 * Generar secuencia siguiendo un patrón
 * @param {string} pattern - 'knight', 'rook', 'bishop', 'queen', 'random'
 * @param {number} length - Longitud de la secuencia
 */
function generatePatternSequence(pattern, length) {
    // Implementación para patrones específicos
    // Ej: movimientos de caballo, torre, etc.
    // Por ahora: random
    return generateTrailSequence(length);
}

/**
 * Mostrar trail secuencialmente
 */
async function showTrail() {
    trailMode.isShowing = true;
    trailMode.currentStep = 0;

    const squares = document.querySelectorAll('.square');

    // Limpiar trail anterior
    squares.forEach(sq => {
        sq.classList.remove('trail-active', 'trail-medium', 'trail-low', 'trail-minimal');
    });

    // Mostrar cada casilla del trail con delay
    for (let i = 0; i < trailMode.sequence.length; i++) {
        const index = trailMode.sequence[i];
        const square = squares[index];

        // Agregar clase según posición en el trail
        square.classList.add('trail-active');

        // Agregar número de secuencia
        const numberLabel = document.createElement('div');
        numberLabel.className = 'trail-number';
        numberLabel.textContent = i + 1;
        square.appendChild(numberLabel);

        // Degradar casillas anteriores
        if (i > 0) {
            const prevIndex = trailMode.sequence[i - 1];
            const prevSquare = squares[prevIndex];
            prevSquare.classList.remove('trail-active');
            prevSquare.classList.add('trail-medium');
        }
        if (i > 1) {
            const prevIndex = trailMode.sequence[i - 2];
            const prevSquare = squares[prevIndex];
            prevSquare.classList.remove('trail-medium');
            prevSquare.classList.add('trail-low');
        }
        if (i > 2) {
            const prevIndex = trailMode.sequence[i - 3];
            const prevSquare = squares[prevIndex];
            prevSquare.classList.remove('trail-low');
            prevSquare.classList.add('trail-minimal');
        }

        // Esperar antes de mostrar siguiente
        await sleep(trailMode.showSpeed);
    }

    trailMode.isShowing = false;
    trailMode.isPlaying = true;

    // Iniciar timer
    startTimer();
}

/**
 * Manejar click del jugador en trail mode
 */
function handleTrailClick(index) {
    if (!trailMode.isPlaying) return;

    const expectedIndex = trailMode.sequence[trailMode.currentStep];
    const square = document.querySelectorAll('.square')[index];

    if (index === expectedIndex) {
        // ✅ CORRECTO
        square.classList.add('trail-correct');
        playSound('correct');

        // Avanzar al siguiente paso
        trailMode.currentStep++;

        // Verificar si completó toda la secuencia
        if (trailMode.currentStep >= trailMode.sequence.length) {
            completeTrailLevel();
        }
    } else {
        // ❌ INCORRECTO
        square.classList.add('trail-wrong');
        playSound('wrong');

        // Opcional: perder vida o penalidad de tiempo
        gameState.timeLeft -= 2; // Penalidad de 2 segundos
    }
}

/**
 * Completar nivel en trail mode
 */
function completeTrailLevel() {
    trailMode.isPlaying = false;
    clearInterval(gameState.timerInterval);

    // Bonus por completar sin errores
    if (trailMode.currentStep === trailMode.sequence.length) {
        gameState.score += 500; // Bonus
    }

    playSound('levelUp');
    showLevelComplete();
}

/**
 * Iniciar nivel en trail mode
 */
function startTrailLevel() {
    const levelConfig = levels[gameState.level];

    // Generar secuencia
    if (levelConfig.pattern) {
        trailMode.sequence = generatePatternSequence(
            levelConfig.pattern,
            levelConfig.sequenceLength
        );
    } else {
        trailMode.sequence = generateTrailSequence(levelConfig.sequenceLength);
    }

    // Configurar velocidad del trail
    if (levelConfig.trailSpeed !== undefined) {
        trailMode.showSpeed = levelConfig.trailSpeed * 1000; // convertir a ms
    }

    // Mostrar trail
    showTrail();
}
```

---

### 🎵 Sonidos para Trail Mode

```javascript
/**
 * Sonidos específicos para trail mode
 */
const trailSounds = {
    // Nota ascendente para cada casilla del trail
    trailNote1: createTone(261.63, 0.2),  // C4
    trailNote2: createTone(329.63, 0.2),  // E4
    trailNote3: createTone(392.00, 0.2),  // G4
    trailNote4: createTone(523.25, 0.2),  // C5

    // Click correcto (armónico)
    trailCorrect: createChord([261.63, 329.63, 392.00], 0.3),

    // Secuencia completa (victoria)
    trailComplete: createArpeggio([261.63, 329.63, 392.00, 523.25], 0.15)
};

/**
 * Crear tono simple
 */
function createTone(frequency, duration) {
    // Usar Web Audio API
    return new Howl({
        src: [generateToneDataURL(frequency, duration)],
        volume: 0.5
    });
}

/**
 * Reproducir nota según posición en trail
 */
function playTrailNote(index) {
    const noteIndex = index % 4;
    const notes = [
        trailSounds.trailNote1,
        trailSounds.trailNote2,
        trailSounds.trailNote3,
        trailSounds.trailNote4
    ];

    notes[noteIndex].play();
}
```

---

### 🎨 Variantes Avanzadas de Trail

#### **A) Memory Trail**
- Mostrar trail completo por 5 segundos
- Luego desaparece
- Player debe recordar el orden y clickear de memoria
- **Dificultad:** Muy Alta

#### **B) Speed Trail**
- Trail aparece muy rápido (0.2s entre casillas)
- Menos tiempo para memorizar
- **Dificultad:** Alta

#### **C) Reverse Trail**
- Debes clickear en orden inverso (última → primera)
- **Dificultad:** Media-Alta

#### **D) Pattern Trail**
- Trail sigue movimientos de piezas:
  - **Knight Trail:** Solo movimientos de caballo
  - **Rook Trail:** Solo líneas rectas
  - **Bishop Trail:** Solo diagonales
- **Dificultad:** Media (educativo para ajedrez)

---

## 5. MODO BLINDFOLD

### 🙈 Concepto

**Descripción:** Jugar sin ver las coordenadas en los bordes del tablero.

---

### 🎮 Mecánica

1. **Tablero sin etiquetas:** No hay letras (a-h) ni números (1-8) visibles
2. **Solo objetivo:** Se muestra "E4" en grande arriba
3. **Player debe recordar:** Dónde está E4 de memoria
4. **Opcional:** Botón de ayuda que muestra coords por 2 segundos

---

### 🔧 Implementación

```javascript
/**
 * Ocultar coordenadas del tablero
 */
function hideCoordinates() {
    const coords = document.querySelectorAll('.coordinate-label');
    coords.forEach(coord => {
        coord.style.display = 'none';
    });
}

/**
 * Mostrar coordenadas temporalmente (ayuda)
 */
function showCoordinatesTemporarily(duration = 2000) {
    const coords = document.querySelectorAll('.coordinate-label');
    coords.forEach(coord => {
        coord.style.display = 'block';
        coord.style.opacity = '0.5'; // Semi-transparente
    });

    setTimeout(() => {
        coords.forEach(coord => {
            coord.style.display = 'none';
        });
    }, duration);
}
```

---

### 🎨 CSS para Blindfold Mode

```css
/* Tablero en modo blindfold */
.board-container.blindfold-mode .coordinate-label {
    display: none;
}

/* Ayuda temporal */
.board-container.showing-help .coordinate-label {
    display: block !important;
    opacity: 0.5;
    animation: fade-in-out 2s ease-in-out;
}

@keyframes fade-in-out {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.5; }
}
```

---

## 6. MODO COMPETITIVO

### 👥 2 Jugadores - Mismo Tablero

**Descripción:** Dos jugadores compiten por clickear la misma casilla primero.

---

### 🎮 Mecánica

1. **Setup:**
   - Jugador 1 (Cyan) vs Jugador 2 (Magenta)
   - Ambos ven el mismo objetivo (ej: "E4")

2. **Gameplay:**
   - Quien clickee primero gana el punto
   - Combo individual para cada jugador
   - Best of 10 rondas

3. **Victoria:**
   - Jugador con más puntos al final gana
   - Empate → Muerte súbita (1 casilla decide)

---

### 🔧 Implementación

```javascript
const competitiveMode = {
    player1Score: 0,
    player2Score: 0,
    player1Combo: 1,
    player2Combo: 1,
    round: 1,
    maxRounds: 10
};

/**
 * Manejar click en modo competitivo
 */
function handleCompetitiveClick(index) {
    const target = gameState.currentTarget;
    const targetIndex = coordinateToIndex(target);

    if (index === targetIndex) {
        // Determinar quién clickeó (basado en posición del mouse o teclado)
        // Placeholder: asignar al azar
        const winner = Math.random() < 0.5 ? 'player1' : 'player2';

        if (winner === 'player1') {
            competitiveMode.player1Score += 100 * competitiveMode.player1Combo;
            competitiveMode.player1Combo++;
        } else {
            competitiveMode.player2Score += 100 * competitiveMode.player2Combo;
            competitiveMode.player2Combo++;
        }

        // Siguiente ronda
        competitiveMode.round++;
        if (competitiveMode.round > competitiveMode.maxRounds) {
            endCompetitiveMode();
        } else {
            generateNewTarget();
        }
    }
}

/**
 * Finalizar modo competitivo
 */
function endCompetitiveMode() {
    const winner = competitiveMode.player1Score > competitiveMode.player2Score
        ? 'Player 1 (Cyan)'
        : 'Player 2 (Magenta)';

    showVictoryScreen(winner, competitiveMode.player1Score, competitiveMode.player2Score);
}
```

---

## 7. POWER-UPS Y BONUS

### ⚡ Power-ups Durante el Juego

#### **A) Time Freeze (Congelar Tiempo)**
- Congela el timer por 3 segundos
- Aparece aleatoriamente cada 5 casillas correctas
- **Icono:** ⏸️

#### **B) Double Points (Puntos Dobles)**
- Siguiente casilla vale 2x puntos
- **Icono:** ✖️2

#### **C) Slow Motion (Cámara Lenta)**
- Timer corre a 50% velocidad por 5 segundos
- **Icono:** 🐌

#### **D) Reveal Hint (Revelar Pista)**
- Ilumina la casilla correcta brevemente
- **Icono:** 💡

#### **E) Shield (Escudo)**
- Protege de 1 error
- **Icono:** 🛡️

---

### 🎁 Bonus al Final de Nivel

```javascript
/**
 * Calcular bonus al completar nivel
 */
function calculateBonus() {
    let bonus = 0;

    // Bonus por tiempo restante
    bonus += Math.floor(gameState.timeLeft * 10);

    // Bonus por combo perfecto
    if (gameState.combo === gameState.targetsNeeded + 1) {
        bonus += 1000; // Perfect combo
    }

    // Bonus por velocidad
    const avgTime = (levels[gameState.level].time - gameState.timeLeft) / gameState.targetsNeeded;
    if (avgTime < 1.0) {
        bonus += 500; // Speed demon bonus
    }

    return bonus;
}
```

---

## 8. SISTEMA DE RANKINGS

### 🏆 Leaderboards

#### **A) Local High Scores**
```javascript
const highScores = {
    classic: [],    // Top 10 en modo clásico
    trail: [],      // Top 10 en modo trail
    rotation: [],   // Top 10 en modo rotación
    blindfold: []   // Top 10 en modo blindfold
};

/**
 * Guardar high score
 */
function saveHighScore(mode, score) {
    if (!highScores[mode]) {
        highScores[mode] = [];
    }

    highScores[mode].push({
        score: score,
        level: gameState.level,
        date: new Date().toISOString()
    });

    // Ordenar por score descendente
    highScores[mode].sort((a, b) => b.score - a.score);

    // Mantener solo top 10
    highScores[mode] = highScores[mode].slice(0, 10);

    // Guardar en localStorage
    localStorage.setItem('squareRush-highScores', JSON.stringify(highScores));
}
```

#### **B) Global Leaderboards (Futuro - Requiere Backend)**
- Top 100 mundial
- Rankings por país
- Rankings semanales/mensuales
- Sistema de usuarios

---

### 📊 Estadísticas

```javascript
const stats = {
    totalGamesPlayed: 0,
    totalSquaresClicked: 0,
    totalTimeSpent: 0,      // segundos
    averageAccuracy: 0,     // %
    fastestLevel: {
        level: 0,
        time: Infinity
    },
    highestCombo: 0,
    favoriteDifficulty: '',  // BABY STEPS, LITTLE MASTER, etc.
    modesPlayed: {
        classic: 0,
        trail: 0,
        rotation: 0,
        blindfold: 0
    }
};
```

---

## 9. PERSONALIZACIÓN VISUAL

### 🎨 Temas Adicionales

#### **A) Tema Oscuro (Dark Mode)**
- Fondo negro puro
- Casillas gris oscuro
- Acentos en cyan brillante

#### **B) Tema Retro (Actual)**
- Estilo synthwave actual
- Gradientes neón

#### **C) Tema Minimalista**
- Blanco y negro
- Sin efectos de glow
- Tipografía simple

#### **D) Tema RGB Gaming**
- Colores RGB cambiantes
- Efectos de arcoíris
- Muy llamativo

---

### 🔧 Selector de Temas

```javascript
const themes = {
    neon: {
        background: '#0a0a0f',
        squareLight: 'rgba(255, 255, 255, 0.1)',
        squareDark: 'rgba(0, 0, 0, 0.3)',
        accent: '#00ffff'
    },
    dark: {
        background: '#000000',
        squareLight: '#1a1a1a',
        squareDark: '#0a0a0a',
        accent: '#00ffff'
    },
    minimal: {
        background: '#ffffff',
        squareLight: '#f0f0f0',
        squareDark: '#e0e0e0',
        accent: '#000000'
    },
    rgb: {
        background: '#000000',
        squareLight: 'hsl(var(--hue), 70%, 50%)',
        squareDark: 'hsl(var(--hue), 50%, 30%)',
        accent: 'hsl(var(--hue), 100%, 50%)'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--bg-color', theme.background);
    document.documentElement.style.setProperty('--square-light', theme.squareLight);
    document.documentElement.style.setProperty('--square-dark', theme.squareDark);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
}
```

---

## 10. IMPLEMENTACIÓN TÉCNICA

### 📅 Roadmap de Desarrollo

#### **Fase 1: Rotaciones (2-3 horas)**
- ✅ CSS para rotaciones
- ✅ JavaScript para aplicar rotación
- ✅ Niveles 11-15 con rotaciones
- ✅ Testing en todos los navegadores

#### **Fase 2: Trail Mode (4-6 horas)**
- ✅ Generar secuencias aleatorias
- ✅ Mostrar trail con animación
- ✅ Lógica de input del jugador
- ✅ Efectos visuales (glow, conectores)
- ✅ Sonidos armónicos
- ✅ Niveles 21-25 con trail

#### **Fase 3: Blindfold Mode (1-2 horas)**
- ✅ Ocultar coordenadas
- ✅ Botón de ayuda temporal
- ✅ Niveles 16-20 blindfold

#### **Fase 4: Modo Competitivo (3-4 horas)**
- ✅ UI para 2 jugadores
- ✅ Sistema de puntuación dual
- ✅ Detección de quién clickeó primero
- ✅ Pantalla de victoria

#### **Fase 5: Power-ups (2-3 horas)**
- ✅ Sistema de spawn aleatorio
- ✅ Efectos de cada power-up
- ✅ Animaciones e iconos

#### **Fase 6: Rankings y Stats (3-4 horas)**
- ✅ Sistema de high scores local
- ✅ Estadísticas detalladas
- ✅ Pantalla de leaderboards

#### **Fase 7: Temas y Personalización (2 horas)**
- ✅ Selector de temas
- ✅ Guardar preferencias
- ✅ Variantes visuales

---

### 🧪 Testing Checklist

- [ ] Rotaciones funcionan en todos los navegadores
- [ ] Trail se muestra correctamente
- [ ] Sonidos sincronizan con animaciones
- [ ] Responsive en móvil (trail mode)
- [ ] Power-ups no causan bugs
- [ ] High scores se guardan correctamente
- [ ] Temas cambian sin romper layout

---

### 📦 Dependencias

**Actuales:**
- Howler.js (sonidos)
- Google Analytics
- Google AdSense

**Nuevas (Futuras):**
- Socket.io (para modo multiplayer online)
- Database (MongoDB/PostgreSQL) para rankings globales
- Backend (Node.js + Express) para multiplayer

---

## 📝 NOTAS FINALES

### 🎯 Prioridades

**Alta Prioridad:**
1. ⭐ Modo Trail (Patrón) - Es el favorito del usuario
2. 🔄 Rotaciones del tablero - Agrega mucha dificultad
3. 🙈 Modo Blindfold - Desafío avanzado

**Media Prioridad:**
4. 👥 Modo Competitivo 2P - Social aspect
5. ⚡ Power-ups - Fun factor
6. 🏆 Rankings locales - Replayability

**Baja Prioridad:**
7. 🎨 Temas adicionales - Cosmético
8. 📊 Estadísticas detalladas - Nice to have
9. 🌐 Multiplayer online - Requiere backend

---

### 💡 Ideas Locas (Brainstorming)

1. **VR Mode:** Tablero en 3D con VR headset
2. **Voice Control:** Di las coordenadas en voz alta
3. **AR Mode:** Tablero en realidad aumentada
4. **Music Sync:** Trail sigue el ritmo de música
5. **Story Mode:** Campaña con niveles temáticos
6. **Boss Battles:** Niveles especiales ultra difíciles
7. **Daily Challenges:** Reto diferente cada día
8. **Achievements:** Sistema de logros (100+ achievements)
9. **Skins:** Tableros temáticos (space, underwater, medieval)
10. **Custom Levels:** Editor de niveles para usuarios

---

### 🤝 Contribuciones Futuras

Este documento está abierto a:
- ✅ Nuevas ideas de la comunidad
- ✅ Feedback de jugadores
- ✅ Sugerencias de mejora
- ✅ Balance de dificultad

---

**Última actualización:** Octubre 2025
**Autor:** ChessArcade Team
**Contacto:** contact@chessarcade.com.ar

---

**FIN DEL DOCUMENTO**

¡Estas ideas transformarán Square Rush en un juego aún más adictivo y desafiante! 🎮✨
