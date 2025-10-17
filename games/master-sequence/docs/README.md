# 🧠 Coordinate Sequence

**Memoriza secuencias de coordenadas y repítelas perfectamente**

Juego de memoria tipo Simon Says pero con coordenadas de ajedrez. Mira la secuencia de casillas iluminadas, memorízalas y repítelas en el mismo orden.

---

## 🎮 Características

- **10+ niveles progresivos** con dificultad creciente
- **Sistema de vidas** (3 intentos por partida)
- **Scoring dinámico** con bonos por niveles perfectos
- **Sistema de audio** sintético (Web Audio API)
- **Diseño neón futurista** estilo ChessArcade
- **Responsive** para mobile, tablet y desktop
- **Google Analytics** integrado

---

## 📊 Mecánicas del Juego

### Fase 1: Memorización
El juego te muestra una secuencia de casillas iluminadas. Cada casilla se ilumina brevemente con un efecto neón cyan y reproduce un beep.

### Fase 2: Reproducción
Debes hacer click en las casillas **en el mismo orden** que se te mostró.

- ✅ **Correcto**: La casilla parpadea en verde y avanzas al siguiente paso
- ❌ **Incorrecto**: La casilla parpadea en rojo y pierdes una vida

### Progresión de Niveles

| Nivel | Nombre | Secuencia | Highlight | Pausa | Dificultad |
|-------|--------|-----------|-----------|-------|------------|
| 1 | Principiante | 3 casillas | 800ms | 200ms | ⭐ Fácil |
| 2 | Aprendiz | 4 casillas | 750ms | 200ms | ⭐ Fácil |
| 3 | Estudiante | 5 casillas | 700ms | 150ms | ⭐⭐ Medio |
| 4 | Aficionado | 6 casillas | 650ms | 150ms | ⭐⭐ Medio |
| 5 | Competente | 7 casillas | 600ms | 150ms | ⭐⭐⭐ Difícil |
| 6 | Experto | 8 casillas | 550ms | 100ms | ⭐⭐⭐ Difícil |
| 7 | Maestro | 9 casillas | 500ms | 100ms | ⭐⭐⭐⭐ Avanzado |
| 8 | Gran Maestro | 10 casillas | 450ms | 100ms | ⭐⭐⭐⭐ Avanzado |
| 9 | Elite | 11 casillas | 400ms | 50ms | ⭐⭐⭐⭐⭐ Experto |
| 10 | Leyenda | 12 casillas | 350ms | 50ms | ⭐⭐⭐⭐⭐ Experto |
| 11+ | Supremo | 13+ casillas | 200ms min | 50ms | ⭐⭐⭐⭐⭐ Supremo |

---

## 🎵 Sistema de Audio

Todos los sonidos se generan sintéticamente usando **Web Audio API** (sin archivos externos):

- **Beep** - Cada casilla durante memorización (frecuencia aumenta)
- **Correcto** - Nota aguda (C6 - 1046 Hz)
- **Incorrecto** - Buzz áspero (A3 - 220 Hz)
- **Nivel Completado** - Arpegio C-E-G-C ascendente
- **Game Over** - Sweep descendente (440 → 110 Hz)

---

## 🎯 Sistema de Puntuación

- **Puntos base** por nivel: 10, 20, 30... hasta 100
- **Bonus perfect**: +5 puntos por nivel si completas sin errores
- **Ejemplo nivel 5 perfect**: 50 (base) + 25 (bonus) = 75 puntos

---

## 📱 Controles

- **Botón COMENZAR** - Inicia el juego
- **Click/Tap en casillas** - Selecciona casilla durante reproducción
- **Botón SONIDO** - Activa/desactiva audio (preferencia guardada)
- **Botón HOME** - Volver a página principal de ChessArcade

---

## 🏗️ Arquitectura Técnica

### Archivos

```
coordinate-sequence/
├── index.html          # Estructura HTML del juego
├── styles.css          # Estilos neón ChessArcade (755 líneas)
├── game.js             # Lógica principal (535 líneas)
├── levels.js           # Sistema de niveles (175 líneas)
├── audio.js            # Sistema de audio Web API (120 líneas)
├── DESIGN.md           # Documento de diseño completo (450 líneas)
└── README.md           # Este archivo
```

### Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Grid, Flexbox, Animations, Media Queries
- **JavaScript ES6+** - Async/await, Promises, Classes
- **Web Audio API** - Generación sintética de sonidos
- **localStorage** - Persistencia de preferencias
- **Google Analytics** - Tracking de uso

### Estado del Juego

El juego utiliza una máquina de estados:

```javascript
gameState = {
    currentLevel: 1,
    score: 0,
    lives: 3,
    sequence: ['e4', 'd5', 'f3'],
    playerSequence: [],
    currentStep: 0,
    phase: 'idle' // 'idle' | 'showing' | 'playing' | 'success' | 'fail' | 'gameover'
}
```

---

## 🎨 Estilo Visual

- **Paleta neón**: Cyan (#00ffff), Magenta (#ff00ff), Verde (#00ff00), Rojo (#ff0066)
- **Fuente**: Orbitron (Google Fonts) - Estilo futurista
- **Animaciones**: Pulse, Shake, Flash, Glow
- **Gradientes**: Diagonales 45°
- **Sombras**: Box-shadow neón multicapa

---

## 🧪 Testing

### Desktop
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Edge 120+

### Mobile
- ✅ Android Chrome
- ✅ iOS Safari

### Features Testeadas
- ✅ Secuencia de iluminación
- ✅ Validación de clicks
- ✅ Sonidos (beep, correct, incorrect, complete, gameover)
- ✅ Overlays (success, fail, gameover)
- ✅ Sistema de vidas
- ✅ Cálculo de score
- ✅ Progresión de niveles
- ✅ Responsive mobile
- ✅ Persistencia de preferencias

---

## 📈 Próximas Mejoras (v2.0)

- [ ] Modo entrenamiento (sin límite de vidas)
- [ ] Leaderboard local (top 10 scores)
- [ ] Replay de secuencia (botón "Ver de nuevo")
- [ ] Modo hardcore (sin sonidos de ayuda)
- [ ] Estadísticas detalladas (accuracy, tiempo promedio)
- [ ] Logros/badges (10 perfect, nivel 20, etc.)
- [ ] Modo multiplayer (turnos)

---

## 📝 Créditos

**Desarrollo**: ChessArcade Team
**Versión**: 1.0.0
**Fecha**: Octubre 2025
**Branch**: `coordinate_sequence`

---

## 📄 Licencia

© 2025 ChessArcade - Todos los derechos reservados
