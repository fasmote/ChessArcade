# 🎮 COORDINATE SEQUENCE - MEJORAS PLANIFICADAS

Documento de planificación para mejoras futuras del juego.
Fecha: 2025-01-16

---

## 📋 ORDEN DE IMPLEMENTACIÓN

1. ✅ **Sistema de Puntuación Mejorado** (PRÓXIMO)
2. ⏳ Efectos Visuales
3. ⏳ Modos de Juego
4. ⏳ Ayudas/Power-ups
5. ⏳ Feedback Auditivo Mejorado
6. ⏳ Estadísticas
7. ⏳ Tutorial Interactivo

---

## 1️⃣ SISTEMA DE PUNTUACIÓN MEJORADO ⭐

### Objetivos
- Hacer el sistema de puntos más gratificante
- Incentivar velocidad y precisión
- Persistir records entre sesiones
- Competir contra uno mismo

### Componentes a Implementar

#### A. Bonus por Velocidad
**Concepto:** Completar nivel rápido = más puntos

**Implementación:**
```javascript
// En onLevelComplete()
const timeElapsed = Date.now() - gameState.levelStartTime;
const targetTime = calculateTargetTime(level); // Basado en sequence length

let speedBonus = 0;
if (timeElapsed < targetTime * 0.5) {
    speedBonus = 100; // Super rápido
} else if (timeElapsed < targetTime * 0.75) {
    speedBonus = 50; // Rápido
} else if (timeElapsed < targetTime) {
    speedBonus = 25; // Dentro del tiempo
}
```

**Variables a agregar a gameState:**
- `levelStartTime`: timestamp cuando empieza la fase de input
- `levelEndTime`: timestamp cuando completa

**UI a agregar:**
- Mostrar "Speed Bonus: +50!" al completar nivel
- Indicador de tiempo recomendado (opcional)

---

#### B. Bonus por Rachas Perfectas
**Concepto:** Completar varios niveles sin errores = multiplicador

**Implementación:**
```javascript
// En gameState
perfectStreak: 0,  // Contador de niveles perfectos consecutivos

// En onLevelComplete()
if (gameState.currentLevelAttempts === 0) {
    gameState.perfectStreak++;
} else {
    gameState.perfectStreak = 0; // Resetear racha
}

// Multiplicador de racha
let streakMultiplier = 1;
if (gameState.perfectStreak >= 5) {
    streakMultiplier = 2.0;  // x2
} else if (gameState.perfectStreak >= 3) {
    streakMultiplier = 1.5;  // x1.5
}

const finalScore = baseScore * streakMultiplier;
```

**UI a agregar:**
- Badge de "Perfect Streak: 3🔥" en header
- Animación especial al alcanzar racha de 3, 5, 10
- Mensaje motivacional: "¡RACHA PERFECTA x5!"

---

#### C. High Score Persistente (localStorage)
**Concepto:** Guardar mejores puntuaciones localmente

**Implementación:**
```javascript
// Estructura de datos
const highScores = {
    topScore: 0,
    bestLevel: 1,
    longestStreak: 0,
    fastestLevel: { level: 1, time: 999999 },
    lastUpdated: timestamp
};

// Funciones
function saveHighScore() {
    localStorage.setItem('coordinateSequence_highScores', JSON.stringify(highScores));
}

function loadHighScores() {
    const saved = localStorage.getItem('coordinateSequence_highScores');
    return saved ? JSON.parse(saved) : getDefaultHighScores();
}

function updateHighScores(gameState) {
    if (gameState.score > highScores.topScore) {
        highScores.topScore = gameState.score;
        // Mostrar "NEW RECORD!" con confeti extra
    }
    // ... otros checks
}
```

**UI a agregar:**
- "Best: 1250" en el header junto a score actual
- Indicador visual cuando rompes record
- Confeti dorado especial para nuevo record

---

#### D. Tabla de Records (Overlay)
**Concepto:** Panel que muestra todas las estadísticas

**Implementación:**
```html
<!-- Nuevo overlay -->
<div class="overlay" id="statsOverlay">
    <div class="overlay-content stats">
        <h2>🏆 Records Personales</h2>

        <div class="stat-row">
            <span class="stat-label">Mejor Puntuación</span>
            <span class="stat-value" id="statsTopScore">0</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Nivel Máximo Alcanzado</span>
            <span class="stat-value" id="statsBestLevel">1</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Racha Perfecta Más Larga</span>
            <span class="stat-value" id="statsLongestStreak">0</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Nivel Más Rápido</span>
            <span class="stat-value" id="statsFastestLevel">
                Nivel 5 - 3.2s
            </span>
        </div>

        <button class="btn-primary" id="btnCloseStats">Cerrar</button>
        <button class="btn-secondary" id="btnResetStats">Resetear Records</button>
    </div>
</div>
```

**CSS:**
```css
.stats .stat-row {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm);
    background: rgba(0, 0, 0, 0.4);
    border-left: 3px solid var(--neon-cyan);
    margin-bottom: var(--spacing-xs);
}

.stats .stat-value {
    color: var(--neon-cyan);
    font-weight: 900;
    font-size: 1.2rem;
}
```

**Botón para abrir:**
```html
<!-- Agregar al header -->
<button class="btn-icon btn-stats" id="btnStats">
    <svg>📊</svg>
    <span class="btn-label">STATS</span>
</button>
```

---

### Archivos a Modificar

**game.js:**
- Agregar a `gameState`:
  - `levelStartTime`
  - `levelEndTime`
  - `perfectStreak`
  - `highScores`
- Modificar `onLevelComplete()`:
  - Calcular speedBonus
  - Calcular streakMultiplier
  - Actualizar highScores
- Agregar funciones:
  - `calculateSpeedBonus(timeElapsed, level)`
  - `calculateStreakMultiplier(streak)`
  - `saveHighScores()`
  - `loadHighScores()`
  - `updateHighScores()`
  - `showStatsOverlay()`
  - `resetHighScores()`

**index.html:**
- Agregar overlay de estadísticas
- Agregar botón de stats en header
- Agregar elementos para mostrar bonus en UI

**styles.css:**
- Estilos para overlay de stats
- Animaciones para "NEW RECORD!"
- Estilos para indicadores de racha (🔥)
- Estilos para speed bonus popup

**levels.js:**
- Agregar función `getRecommendedTime(level)` para calcular tiempo target

---

### Plan de Implementación Paso a Paso

**PASO 1: Infraestructura de Timing**
1. Agregar `levelStartTime` a gameState
2. Capturar timestamp en `startPlayingPhase()`
3. Calcular tiempo en `onLevelComplete()`
4. Mostrar tiempo en console.log para testing

**PASO 2: Speed Bonus**
1. Crear función `calculateSpeedBonus(time, level)`
2. Agregar cálculo en `onLevelComplete()`
3. Mostrar bonus en UI (popup temporal)
4. Sumar a score

**PASO 3: Perfect Streak**
1. Agregar `perfectStreak` a gameState
2. Incrementar en `onLevelComplete()` si perfect
3. Resetear en `onLevelFailed()`
4. Agregar indicador visual en UI
5. Aplicar multiplicador a score

**PASO 4: localStorage**
1. Crear estructura de datos `highScores`
2. Implementar `saveHighScores()` y `loadHighScores()`
3. Llamar `loadHighScores()` en `initGame()`
4. Actualizar en `onLevelComplete()` y `gameOver()`
5. Mostrar "NEW RECORD!" cuando aplique

**PASO 5: Stats Overlay**
1. Crear HTML del overlay
2. Agregar estilos CSS
3. Implementar `showStatsOverlay()`
4. Poblar datos desde highScores
5. Botón de reset con confirmación

**PASO 6: Polish**
1. Animaciones para bonus
2. Sonidos para nuevo record
3. Confeti dorado para records
4. Tweaks de balance en tiempos/multiplicadores

---

### Testing Checklist

- [ ] Speed bonus se calcula correctamente
- [ ] Perfect streak incrementa y resetea bien
- [ ] localStorage persiste entre reloads
- [ ] Stats overlay muestra datos correctos
- [ ] Reset stats funciona
- [ ] NEW RECORD! aparece cuando corresponde
- [ ] No hay bugs en gameOver
- [ ] Funciona en mobile
- [ ] Confeti especial para records se ve bien

---

### Valores de Balance (Ajustar con testing)

**Tiempos Recomendados por Nivel:**
```javascript
function getRecommendedTime(level) {
    const config = getLevelConfig(level);
    const baseTime = 2000; // 2s base
    const perSquare = 1500; // 1.5s por casilla
    return baseTime + (config.sequenceLength * perSquare);
}
```

**Speed Bonus:**
- < 50% tiempo: +100 pts
- < 75% tiempo: +50 pts
- < 100% tiempo: +25 pts

**Streak Multiplier:**
- 3 perfect: x1.5
- 5 perfect: x2.0
- 10 perfect: x3.0 (¡épico!)

---

## 2️⃣ EFECTOS VISUALES ✨

### A. Animación de Camino/Trail

**Concepto:** Línea que conecta casillas mientras se muestra secuencia

**Implementación:**
```javascript
// En showSequence(), después de highlight
if (i > 0) {
    drawPath(previousSquare, currentSquare);
}
```

**Técnica:**
- SVG overlay sobre el tablero
- Línea animada con `stroke-dasharray` y `stroke-dashoffset`
- Color matching con el color de la secuencia
- Fade out después de 500ms

**CSS:**
```css
.path-line {
    stroke: var(--highlight-color);
    stroke-width: 4px;
    stroke-dasharray: 10;
    animation: pathDraw 0.3s ease-out;
    opacity: 0.6;
    filter: drop-shadow(0 0 10px var(--highlight-shadow));
}

@keyframes pathDraw {
    from {
        stroke-dashoffset: 100;
    }
    to {
        stroke-dashoffset: 0;
    }
}
```

---

### B. Trail/Estela de Movimiento

**Concepto:** Partículas que siguen el patrón rey/caballo

**Implementación:**
- Sistema de partículas pequeñas
- Spawn en posición anterior
- Mueven hacia posición nueva
- Fade out gradual

---

### C. Partículas al Acertar

**Concepto:** Mini confeti cuando clickeas correcto

**Implementación:**
```javascript
// En handleSquareClick() cuando isCorrect
spawnParticles(squareElement, color, 5);
```

**Efecto:**
- 5 partículas pequeñas
- Explotan desde el centro de la casilla
- Mismo color que el highlight
- Duración 800ms

---

### D. Vibración Sutil del Tablero

**Concepto:** Tablero celebra al completar nivel

**Implementación:**
```javascript
// En onLevelComplete()
document.getElementById('chessboard').classList.add('celebrate');
setTimeout(() => {
    document.getElementById('chessboard').classList.remove('celebrate');
}, 1000);
```

**CSS:**
```css
@keyframes celebrate {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.02) rotate(0.5deg); }
    50% { transform: scale(1.02) rotate(-0.5deg); }
    75% { transform: scale(1.02) rotate(0.5deg); }
}

.chessboard.celebrate {
    animation: celebrate 0.5s ease-in-out;
}
```

---

## 3️⃣ MODOS DE JUEGO 🎯

### A. Modo Zen (Sin Vidas)

**Concepto:** Práctica sin presión, progresión infinita

**Características:**
- Sin sistema de vidas
- No hay game over
- Puedes reintentar infinitamente
- Ideal para aprender

**Implementación:**
```javascript
gameMode: 'normal' | 'zen' | 'timed' | 'challenge'

if (gameState.gameMode === 'zen') {
    // No decrementar vidas en onLevelFailed()
    // No llamar gameOver() nunca
}
```

**UI:**
- Selector de modo en pantalla de inicio
- Indicador de modo actual en header

---

### B. Modo Tiempo (Contra Reloj)

**Concepto:** Completar niveles antes de que se acabe el tiempo

**Características:**
- Timer countdown global
- +10s bonus por completar nivel
- Game over cuando tiempo = 0
- Progresión rápida

**Implementación:**
```javascript
gameState.timeRemaining = 60000; // 60s iniciales

setInterval(() => {
    if (gameState.phase === 'playing' && gameState.gameMode === 'timed') {
        gameState.timeRemaining -= 100;
        if (gameState.timeRemaining <= 0) {
            gameOver('¡Se acabó el tiempo!');
        }
        updateTimerDisplay();
    }
}, 100);
```

**UI:**
- Timer grande en header
- Barra de progreso de tiempo
- Animación cuando quedan <10s

---

### C. Modo Desafío (Secuencias Largas)

**Concepto:** Niveles con secuencias extra largas desde el inicio

**Características:**
- Nivel 1 empieza con 5 casillas
- Cada nivel +2 casillas
- Solo 1 vida
- Para expertos

**Implementación:**
```javascript
if (gameState.gameMode === 'challenge') {
    config.sequenceLength = 5 + (level - 1) * 2;
}
```

---

## 4️⃣ AYUDAS/POWER-UPS 💡

### A. Hint (Mostrar Próxima Casilla)

**Concepto:** Si estás atorado, ilumina la siguiente casilla

**Implementación:**
```javascript
function useHint() {
    if (gameState.hintsRemaining > 0 && gameState.phase === 'playing') {
        const nextSquare = gameState.sequence[gameState.currentStep];
        const color = gameState.sequenceColors[gameState.currentStep];

        // Pulsar 3 veces
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                highlightSquare(nextSquare, 300, color);
            }, i * 400);
        }

        gameState.hintsRemaining--;
        updateUI();
    }
}
```

**Limitaciones:**
- 3 hints por partida
- Resta puntos (-50)
- Rompe racha perfecta

**UI:**
- Botón "💡 Hint (3)" en header
- Se deshabilita cuando no quedan

---

### B. Replay (Ver Secuencia de Nuevo)

**Concepto:** Volver a ver la secuencia durante la fase de input

**Implementación:**
```javascript
function useReplay() {
    if (gameState.replaysRemaining > 0 && gameState.phase === 'playing') {
        gameState.phase = 'showing'; // Volver a fase de visualización
        showSequence();
        gameState.replaysRemaining--;
    }
}
```

**Limitaciones:**
- 2 replays por partida
- Resetea tu progreso actual en ese nivel
- No resta puntos

---

### C. Slow Motion

**Concepto:** La visualización va más lenta

**Implementación:**
```javascript
function useSlowMotion() {
    if (gameState.slowMotionAvailable && gameState.phase === 'showing') {
        // Duplicar tiempos de highlight y pause
        const modifiedConfig = {
            ...config,
            highlightDuration: config.highlightDuration * 2,
            pauseDuration: config.pauseDuration * 2
        };
        gameState.slowMotionAvailable = false;
    }
}
```

**Limitaciones:**
- 1 uso por partida
- Solo en el nivel actual
- Auto-activa si has fallado 2 veces

---

## 5️⃣ FEEDBACK AUDITIVO MEJORADO 🔊

### A. Notas Musicales por Color

**Concepto:** Cada color = una nota diferente

**Implementación:**
```javascript
const colorNotes = {
    'cyan': 261.63,    // C4
    'magenta': 293.66, // D4
    'green': 329.63,   // E4
    'orange': 349.23,  // F4
    'purple': 392.00,  // G4
    'yellow': 440.00,  // A4
    'pink': 493.88,    // B4
    'lime': 523.25     // C5
};

// En showSequence()
playBeep(colorNotes[color.name]);
```

**Resultado:**
- Secuencia crea una melodía
- Ayuda memoria auditiva
- Más musical

---

### B. Melodía al Completar Nivel

**Concepto:** Arpeggio ascendente celebratorio

**Implementación:**
```javascript
function playLevelCompleteJingle() {
    const notes = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C
    notes.forEach((freq, i) => {
        setTimeout(() => {
            playBeep(freq, 200);
        }, i * 150);
    });
}
```

---

### C. Sonidos Rey vs Caballo

**Concepto:** Diferentes efectos según tipo de movimiento

**Implementación:**
```javascript
function playMovementSound(fromSquare, toSquare) {
    const isKingMove = chebyshevDistance(fromSquare, toSquare) === 1;

    if (isKingMove) {
        playBeep(440, 100); // Tono corto
    } else {
        playBeep(880, 100); // Tono alto (salto de caballo)
    }
}
```

---

## 6️⃣ ESTADÍSTICAS 📊

### Métricas a Trackear

**Por Sesión:**
- Tiempo total jugado
- Niveles completados
- Intentos totales
- Precisión % (aciertos/intentos)

**Histórico (localStorage):**
- Partidas jugadas
- Tiempo total acumulado
- Mejor racha
- Promedio de nivel alcanzado

**Implementación:**
```javascript
const sessionStats = {
    startTime: Date.now(),
    levelsCompleted: 0,
    totalAttempts: 0,
    successfulAttempts: 0
};

const historicStats = {
    gamesPlayed: 0,
    totalTime: 0,
    bestStreak: 0,
    averageLevel: 0
};
```

---

## 7️⃣ TUTORIAL INTERACTIVO 📚

### Flujo del Tutorial

**Paso 1: Bienvenida**
```
"¡Bienvenido a Coordinate Sequence!
Un juego de memoria basado en ajedrez."
[Siguiente]
```

**Paso 2: Objetivo**
```
"Observa la secuencia de casillas iluminadas
y repítela en el mismo orden."
[Mostrar ejemplo con 2 casillas]
```

**Paso 3: Movimientos**
```
"Las secuencias siguen movimientos de Rey o Caballo.
Esto las hace más naturales de seguir."
[Mostrar diagrama de movimientos]
```

**Paso 4: Colores**
```
"Cada casilla tiene su propio color.
¡Úsalos para ayudarte a recordar!"
[Mostrar secuencia con colores]
```

**Paso 5: Práctica Guiada**
```
"¡Intentémoslo! Repite esta secuencia simple."
[Secuencia forzada: e4 → e5]
[Flechas apuntando a las casillas]
```

**Paso 6: ¡Listo!**
```
"¡Perfecto! Ahora estás listo.
¿Quieres saltar el tutorial en el futuro?"
[Sí] [No]
```

**Implementación:**
```javascript
// localStorage
tutorialCompleted: false,
skipTutorial: false

// Al iniciar juego
if (!tutorialCompleted && !skipTutorial) {
    showTutorial();
}
```

---

## 🎨 RESUMEN DE ARCHIVOS A CREAR/MODIFICAR

### Archivos Nuevos
- Ninguno (todo se integra en archivos existentes)

### Archivos a Modificar

**game.js:**
- Agregar sistema de scoring mejorado
- Agregar modos de juego
- Agregar power-ups
- Agregar estadísticas
- Agregar tutorial

**index.html:**
- Overlay de stats
- Overlay de tutorial
- Selector de modo
- Botones de power-ups

**styles.css:**
- Estilos de overlays nuevos
- Animaciones de efectos visuales
- Estilos de partículas
- Estilos de indicadores

**audio.js:**
- Notas musicales por color
- Melodía de nivel completado
- Sonidos de movimiento

**levels.js:**
- Función `getRecommendedTime()`
- Configs para modo desafío

---

## 📝 NOTAS FINALES

- **Prioridad:** Implementar en orden numérico (1→7)
- **Testing:** Probar cada feature antes de siguiente
- **Balance:** Ajustar valores con feedback del usuario
- **Mobile:** Todas las features deben funcionar en mobile
- **Performance:** Optimizar animaciones para 60fps
- **Accesibilidad:** Todos los overlays deben ser navegables con teclado

---

## ✅ CHECKLIST DE INICIO (Sistema de Puntuación)

Antes de empezar la sesión de código:
- [ ] Leer esta documentación completa
- [ ] Entender el flujo actual del juego
- [ ] Identificar puntos de integración
- [ ] Crear branch: `feature/scoring-system`
- [ ] Seguir pasos 1-6 de implementación
- [ ] Commitear cambios incrementalmente
- [ ] Testing exhaustivo
- [ ] Merge cuando esté completo

---

**Fecha de Creación:** 2025-01-16
**Autor:** Claude Code & Usuario
**Estado:** 📝 Documentado, listo para implementar
**Próximo Paso:** Sistema de Puntuación Mejorado (Mejora #1)
