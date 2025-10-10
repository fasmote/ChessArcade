# 📝 CHANGELOG - Memory Matrix v2

Registro cronológico de cambios día a día.

---

## [2025-10-10] - UX Mobile: Timer Global + Layout Responsive

### Cambiado
- **Layout Mobile Optimizado** (solo mobile, desktop sin cambios)
  - Timer global visible desde inicio mostrando "00:00"
  - Reordenamiento con flexbox order:
    - Mobile: Timer global arriba → Banco piezas medio → Titulo "Piezas Disponibles" abajo
    - Desktop (768px+): Orden normal (titulo arriba, banco medio, timer abajo)
  - Mejor uso del espacio vertical en pantallas pequeñas
  - Timer más visible al iniciar juego

- **Sidebar height ajustado**
  - Removido min-height/max-height que causaba barra lateral muy larga
  - Altura se ajusta automáticamente al contenido
  - Layout más compacto y natural

### Archivos modificados
- `index.html` - Removida clase `.hidden` del timer global (línea 145)
- `styles.css` - Reordenamiento con flexbox order (+18 líneas)
  - `.global-timer`: order: 1, margin-top: 0, margin-bottom: 10px
  - `.piece-bank`: order: 2
  - `.bank-title`: order: 3
  - Media query 768px: Reset orders a 0, margins normales

### Estadísticas
- 2 commits realizados
- UX mobile significativamente mejorado
- Timer global siempre visible para feedback constante

---

## [2025-10-10] - Sistema Deshacer/Limpiar (codigo) + Documentacion

### Agregado
- **Sistema de Deshacer/Limpiar** (codigo implementado pero NO usado en Memory Matrix)
  - Historial de movimientos (moveHistory stack)
  - Boton DESHACER: Quita ultima pieza colocada
  - Boton LIMPIAR: Remueve todas las piezas del tablero
  - Animacion de vuelta al banco (400ms ease-in)
  - Botones desactivados cuando no hay piezas
  - Mensajes de feedback al deshacer/limpiar
  - Solo disponibles durante fase de colocacion
  - **IMPORTANTE:** Botones comentados en HTML (no visibles)
    - Razon: Rompen la mecanica core de Memory Matrix (memorizar)
    - El codigo permanece para reutilizacion en otros juegos (puzzles, tacticas)
    - En Memory Matrix: Si te equivocas, debes reintentar (esa es la dificultad)

- **ChessGameLibrary/API_REFERENCE.md** (nuevo archivo +520 lineas)
  - Documentacion completa de todas las funciones de la libreria
  - 4 modulos documentados: Utils, PieceAnimations, DragDrop, LevelTransition
  - 20+ funciones con ejemplos de uso
  - Tabla de codigos de piezas con Unicode
  - Requisitos tecnicos HTML/CSS
  - 3 ejemplos de uso completo
  - Seccion de debugging

- **SUGERENCIAS_MEJORAS.md** (nuevo archivo +650 lineas)
  - 15 sugerencias organizadas por prioridad
  - Estimaciones de tiempo para cada mejora
  - Plan de implementacion por fases
  - Codigo de ejemplo para cada sugerencia

### Cambiado
- **Timer circular (3s)**: Revertido a posición original centrado sobre banco de piezas (tanto mobile como desktop)
- **Timer global**: Movido debajo de la barra lateral (dentro de `.piece-bank-container`)
  - Mobile: margin-top 15px
  - Desktop: margin-top 20px, padding y font más grandes

### Archivos modificados
- `game.js` - Sistema deshacer/limpiar (+140 lineas netas)
  - moveHistory stack
  - Funciones: undo(), clearBoard(), updateUndoClearButtons(), animatePieceBackToBank()
  - Integracion con drag & drop
  - Limpieza de historial en resets
- `index.html` - 2 botones nuevos en header (+16 lineas)
  - Boton DESHACER (icono flecha circular)
  - Boton LIMPIAR (icono basura)
- `styles.css` - Estilos para nuevos botones (+30 lineas)
  - .btn-undo (naranja #ff8000)
  - .btn-clear (rojo #ff0055)
  - Estados hover y disabled

### Archivos nuevos
- `ChessGameLibrary/API_REFERENCE.md` - Diccionario completo de funciones (+520 lineas)
- `SUGERENCIAS_MEJORAS.md` - 15 sugerencias organizadas por prioridad (+650 lineas)

### Estadisticas
- Total: +1356 lineas agregadas
- Tiempo estimado implementacion: 2-3h
- Mejora #1 completada de SUGERENCIAS_MEJORAS.md

---

## [2025-10-09] - Rediseño de Hints + Level Transition + UX Improvements

### Agregado
- **ChessGameLibrary.LevelTransition** (nuevo archivo +293 líneas)
  - Librería reutilizable para transiciones entre niveles
  - 6 animaciones CSS: fadeIn, levelZoomIn, iconPulse, neonFlicker, gradientShift, progressFill
  - API pública: `show()`, `hide()`, `injectStyles()`
  - Auto-crea HTML y CSS si no existe
  - Configurable: icon, duration, callbacks

- **SESION_9_OCT.md** - Documentación completa de la sesión (+317 líneas)

### Cambiado
- **Sistema de Hints rediseñado** (`game.js:895-985`)
  - Antes: 10 hints totales, mostraba 1 pieza aleatoria
  - Ahora: 3 hints por nivel (se resetean), muestra TODAS las piezas faltantes simultáneamente
  - Desintegración coordinada de todas las piezas después de 1.5s
  - Balance mejorado: útil pero limitado

- **Tiempos de memorización reducidos 32%** (todos los niveles en `levels.js`)
  - Nivel 1-2: 5s → 3s (-40%)
  - Nivel 3: 6s → 4s (-33%)
  - Nivel 4: 7s → 5s (-29%)
  - Nivel 5: 7.5s → 5s (-33%)
  - Nivel 6: 8s → 6s (-25%)
  - Nivel 7: 9s → 6s (-33%)
  - Nivel 8: 10s → 7s (-30%)

- **Botón "Comenzar Nivel X"** (`game.js:805`)
  - Antes: "Siguiente Nivel"
  - Ahora: "▶ Comenzar Nivel 2", "▶ Comenzar Nivel 3", etc.

- **Timer circular reposicionado** (`styles.css:1273-1302`)
  - Mobile: Centrado sobre banco (absolute)
  - Desktop: Debajo del banco (static + margin-top 20px)
  - *Nota: Revertido el 10 de octubre*

### Archivos modificados
- `game.js` - showHint() rediseñado, botón texto (+124 líneas netas)
- `levels.js` - Tiempos reducidos (8 líneas modificadas)
- `styles.css` - Timer responsive + transición overlay (+159 líneas)
- `index.html` - Import de LevelTransition.js (+16 líneas)

### Estadísticas
- Total: 871 líneas agregadas, 37 eliminadas
- Commit: `4b3a7c6`

---

## [2025-10-08] - Sistema de Audio + Mejora de Visibilidad de Hints

### Agregado
- **audio.js** (nuevo archivo +450 líneas)
  - Sistema completo de audio sintético con Web Audio API
  - 5 sonidos: glitch (warning/critical), error, éxito, confeti, vuelo
  - Sin archivos externos, generados en tiempo real
  - Código educativo con explicaciones de síntesis

### Cambiado
- **Coordenadas en casillas más visibles** (`styles.css`)
  - Fondo oscuro semitransparente (rgba 0,0,0,0.75)
  - Borde neón cyan con triple box-shadow
  - Backdrop-filter blur (efecto vidrio esmerilado)
  - Tamaño mayor: 24-42px (antes 20-32px)
  - Perfecta visibilidad en casillas blancas Y oscuras

### Integrado
- Sonidos en 7 funciones de `game.js`:
  - `applyGlitchEffect()` → playGlitchSound()
  - `shakeBoardOnError()` → playErrorSound()
  - `onAttemptSuccess()` → playSuccessSound()
  - `launchConfetti()` → playConfettiSound()
  - `hidePiecesPhase()` → playFlySound()
  - `toggleSound()` → feedback al activar
  - `loadAudioPreference()` → persistencia localStorage

### Archivos modificados
- `index.html` - Import de audio.js
- `game.js` - Integración de sonidos (+30 líneas)
- `styles.css` - Mejora de .square-hint (+20 líneas)

### Feedback del usuario
✅ "Cada vez me gusta mas, lo jugue bastante, empieza facil y se hace dificil"

---

## [2025-10-07] - Efectos Glitch Matrix + Feedback Visual Completo

### Agregado
- **Efecto Glitch Matrix** - Advertencia visual progresiva
  - Glitch sutil (40%-80%): parpadeos, distorsión, hue-rotate
  - Glitch crítico (80%-100%): efecto intenso tipo TV descompuesto
  - En reintento: 1s de glitch crítico
  - Funciones: `applyGlitchEffect()`, `removeGlitchEffect()`

- **Feedback de Error Sutil** (sin overlay agresivo)
  - Shake del tablero (500ms, ±8px horizontal)
  - Parpadeo rojo en piezas incorrectas (1.8s, 3x)
  - Barra de estado rosa neón que se infla/desinfla (1.5s)
  - NO bloquea vista ni rompe concentración
  - Funciones: `shakeBoardOnError()`, `flashIncorrectPieces()`

- **Celebración de Victoria con Confeti**
  - Barra de estado verde neón que se infla/desinfla
  - 50 confetis neón cayendo (cyan, pink, orange, gold, green)
  - Rotación 720° + fade out mientras cae
  - Posición, velocidad y delay aleatorios
  - Auto-limpieza del DOM
  - Función: `launchConfetti(count)`

### Cambiado
- **updateStatus()** - Parámetro tipo: 'normal'|'error'|'success'
  - Antes: `updateStatus(message, isError = false)`
  - Ahora: `updateStatus(message, type = 'normal')`
  - Aplica clases CSS automáticamente (rosa/verde)
  - Timeout de 1.5s para volver a dorado

### Arreglado
- **Limpieza de piezas entre intentos**
  - `clearBoard()` agregado en `startGame()`
  - No más acumulación de piezas

### Estadísticas
- +143 líneas CSS (6 animaciones nuevas)
- +155 líneas JS (5 funciones nuevas)
- +4 líneas HTML (contenedor confeti)
- Total: ~3,265 líneas de código

---

## [2025-10-06] - Coordenadas Neón + Sistema de Referencia Visual

### Agregado
- **Sistema de Hints Visuales** (coordenadas en casillas)
  - Al volar piezas al banco, aparecen coordenadas centradas (ej: "a5", "b4")
  - Texto neón cyan brillante con triple glow
  - Animación entrada: escala 0.5 → 1.0 (0.3s)
  - Visible 800ms después del vuelo
  - Fade-out elegante: opacidad 1 → 0 (0.8s)
  - Auto-limpieza del DOM
  - Funciones: `showSquareHints()`, `hideSquareHints()`, `clearAllSquareHints()`

- **Sistema de Referencia Visual** (wK visible)
  - Nivel 1: wK visible en intentos 1-8, ambos reyes ocultos en 9-10
  - Niveles 2-8: wK visible en intentos 1-7, todas ocultas en 8-10
  - Progresión gradual dentro de cada nivel
  - Configuración en `levels.js`: hidePiecesConfig para todos los niveles

### Estadísticas
- +62 líneas CSS (estilos + animaciones)
- +70 líneas JS (3 funciones nuevas + integración)
- Total: ~422 líneas nuevas

---

## [2025-10-05] - UX Mobile + Validaciones Críticas

### Cambiado
- **Botón "Comenzar" movido a header** (sin scroll en mobile)
- **Selector de piezas reubicado en footer** (mejor accesibilidad)
- **Timer posicionado sobre barra lateral** (no mueve layout)
- **Tiempos de memorización reducidos 50%** (niveles 1-8)

### Agregado
- **Validación de distancia entre reyes** (Chebyshev)
  - Los reyes deben estar separados al menos 2 casillas
  - Evita posiciones ilegales de ajedrez
  - Función: `validateKingDistance()` en levels.js

- **Overlay de error automático** (2s reintento)
  - Mensaje grande semitransparente
  - Desaparece automáticamente
  - No bloquea el juego

- **Contador de errores + Game Over** (10 errores)
  - Barra de estado muestra errores actuales
  - Al llegar a 10: overlay de Game Over
  - Reinicio completo del juego

- **Timer visual circular** con animación neón
  - SVG circular que se vacía
  - Animación suave con stroke-dashoffset
  - Glow cyan neón

### Arreglado
- **Fix duplicación de piezas al reintentar**
  - `clearBoard()` antes de mostrar piezas
  - No más acumulación visual

### Estadísticas
- 7 fixes documentados en PROGRESO_SESION.md
- Archivos: index.html, styles.css, game.js, levels.js

---

## [2025-10-01 a 2025-10-04] - Memory Matrix v2 - Sistema Completo

### Agregado
- **PASO 1**: Fondo y estructura básica
  - Degradado negro → morado
  - Grid animado con líneas cyan
  - Fuente Orbitron (Google Fonts)
  - Botones neón con glow

- **PASO 2**: Tablero de ajedrez 8x8
  - Generación dinámica con JavaScript
  - Coordenadas a-h y 1-8
  - Casillas oscuras/claras alternadas
  - Responsive con clamp()

- **PASO 3**: Drag & drop de piezas
  - Arrastre táctil + mouse
  - Validación de colocación
  - Animaciones suaves
  - ChessGameLibrary/DragDrop.js

- **PASO 4**: Banco de piezas
  - CDN de Lichess para SVG
  - Selector de estilo (Lichess, Chess.com, Cardinal)
  - Piezas draggables
  - ChessGameLibrary/PieceAnimations.js

- **PASO 5**: Sistema de niveles
  - 8 niveles progresivos
  - Configuración en levels.js
  - Memorización → Vuelo → Colocación
  - Intentos requeridos por nivel

- **PASO 6**: Animaciones de vuelo
  - Piezas vuelan al banco con parábola
  - Rotación durante vuelo
  - Sincronización con easing

- **PASO 7**: Validación de posición
  - Compara piezas colocadas vs esperadas
  - Feedback visual inmediato
  - Conteo de intentos correctos

- **PASO 8**: Sistema de hints
  - 10 hints totales (modificado luego a 3 por nivel)
  - Muestra una pieza con glow dorado
  - Desintegración en partículas

- **PASO 9**: Timer global
  - Cronómetro de sesión
  - Formato MM:SS
  - Persiste entre niveles

- **PASO 10**: Pantalla final de victoria
  - Overlay de celebración
  - Estadísticas de tiempo
  - Reinicio de juego

### Archivos creados
- `index.html` - Estructura HTML completa
- `styles.css` - Estilos ChessArcade neón
- `game.js` - Lógica del juego
- `levels.js` - Configuración de niveles
- `ChessGameLibrary/Utils.js` - Utilidades reutilizables
- `ChessGameLibrary/PieceAnimations.js` - Animaciones
- `ChessGameLibrary/DragDrop.js` - Sistema drag & drop
- `PLAN_DESARROLLO.md` - Plan de 10 pasos
- `REQUERIMIENTOS_FUNCIONALES.md` - 15 RF detallados
- `ERRORES_CONOCIDOS_Y_SOLUCIONES.md` - 8 errores documentados
- `PROGRESO_SESION.md` - Registro detallado de progreso

### Estadísticas iniciales
- ~2,500 líneas de código
- 13 archivos creados
- Mobile First (350px → desktop)
- Sin librerías pesadas (Vanilla JS)

---

## Formato de entrada

Cada día debe seguir este formato:

```markdown
## [YYYY-MM-DD] - Título descriptivo

### Agregado
- Nuevas funcionalidades

### Cambiado
- Modificaciones a funcionalidades existentes

### Arreglado
- Bugs corregidos

### Eliminado
- Funcionalidades removidas

### Archivos modificados
- Lista de archivos

### Estadísticas
- Líneas agregadas/eliminadas

### Feedback del usuario
- Citas del usuario sobre el progreso
```

---

**Última actualización**: 10 Octubre 2025
