# ERS - Especificación de Requerimientos del Sistema
## ChessInFive - "Place. Move. Align Five. Win."

---

**Proyecto:** ChessInFive
**Versión:** 1.0.6
**Fecha:** Noviembre 2025
**Autor:** ChessArcade Team
**Estado:** Producción

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento
Este documento especifica los requerimientos funcionales y no funcionales para el desarrollo del juego **ChessInFive**, un híbrido innovador entre Connect Four (4 en línea) y ajedrez estratégico.

### 1.2 Alcance del Proyecto
ChessInFive es un juego web de estrategia para dos jugadores que combina:
- Mecánica de **gravedad** (estilo Connect Four) en la fase de colocación
- Movimiento de **piezas de ajedrez** en la fase táctica
- Objetivo de **alinear 5 piezas** en línea para ganar

### 1.3 Público Objetivo
- Jugadores de ajedrez (nivel principiante a avanzado)
- Entusiastas de juegos de estrategia
- Usuarios que buscan entrenamiento cerebral
- Edades: 8+ años

### 1.4 Definiciones y Acrónimos
- **ERS:** Especificación de Requerimientos del Sistema
- **MVP:** Minimum Viable Product (Producto Mínimo Viable)
- **UI/UX:** User Interface / User Experience
- **IA:** Inteligencia Artificial
- **Fase Gravity:** Fase de colocación de piezas con gravedad
- **Fase Chess:** Fase de movimiento con reglas de ajedrez

---

## 2. DESCRIPCIÓN GENERAL

### 2.1 Perspectiva del Producto
ChessInFive es parte del ecosistema **ChessArcade**, una colección de juegos de entrenamiento de ajedrez con estética retro-futurista neón.

**Integración con:**
- Sistema de diseño NeonChess
- Paleta de colores consistente (cyan/magenta)
- Sistema de sonido synthwave
- Arquitectura modular de ChessGameLibrary

### 2.2 Funcionalidades Principales

#### Fase 1: Gravity Placement
1. Los jugadores alternan turnos colocando piezas
2. Las piezas **caen por gravedad** en la columna seleccionada
3. Continúa hasta que ambos jugadores agoten sus piezas (8 cada uno)

#### Fase 2: Chess Movement
1. Las piezas se mueven según reglas estándar de ajedrez
2. **No hay captura** de piezas (solo desplazamiento)
3. **No hay jaque** (concepto inexistente en este juego)
4. Objetivo: Alinear 5 piezas propias en línea

#### Condición de Victoria
- Primero en alinear **5 o más piezas** (vertical/horizontal/diagonal) gana
- Las 5 piezas pueden ser de cualquier tipo

### 2.3 Características de Usuario

| Tipo de Usuario | Descripción | Nivel de Acceso |
|-----------------|-------------|-----------------|
| Jugador Local 1 | Usuario que controla piezas Cyan | Control total de piezas propias |
| Jugador Local 2 | Usuario que controla piezas Magenta | Control total de piezas propias |
| Espectador | Usuario observando partida | Solo lectura |

### 2.4 Restricciones

**Técnicas:**
- Navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript ES6+ requerido
- Resolución mínima: 320x568 (móviles pequeños)

**Operativas:**
- Juego completamente client-side (sin backend en MVP)
- Almacenamiento local limitado a localStorage
- Sin autenticación en v1.0

**De Negocio:**
- Proyecto open-source bajo licencia MIT
- Sin monetización directa en MVP
- Compatible con Google AdSense

---

## 3. REQUERIMIENTOS FUNCIONALES

### RF-001: Inicialización del Juego
**Prioridad:** Alta
**Descripción:** El sistema debe inicializar un tablero 8x8 vacío al comenzar nueva partida.

**Criterios de Aceptación:**
- Tablero renderizado con 64 casillas
- Casillas alternas en colores claro/oscuro
- Coordenadas tipo "taxi" visibles (a-h, 1-8)
- Panel de estado mostrando "Fase: Gravity Placement"
- Jugador Cyan inicia siempre

---

### RF-002: Asignación de Piezas
**Prioridad:** Alta
**Descripción:** Cada jugador debe recibir un set inicial de 8 piezas.

**Detalle de Piezas:**
| Pieza | Cantidad | Símbolo | Movimiento |
|-------|----------|---------|------------|
| Torre | 2 | ♖ | Horizontal/Vertical sin límite |
| Caballo | 2 | ♘ | Forma L, salta piezas |
| Alfil | 2 | ♗ | Diagonal sin límite |
| Dama | 1 | ♕ | Cualquier dirección sin límite |
| Rey | 1 | ♔ | 1 casilla en cualquier dirección |

**Criterios de Aceptación:**
- Panel muestra piezas disponibles de cada jugador
- Contador descendente actualizado: "Piezas restantes: X/8"
- Piezas visualmente diferenciadas por color (Cyan vs Magenta)

---

### RF-003: Fase de Gravity Placement
**Prioridad:** Alta
**Descripción:** Implementar mecánica de caída por gravedad estilo Connect Four.

**Flujo:**
1. Jugador hace **hover sobre columna** → columna brilla
2. Sistema muestra **ghost preview** de dónde caerá la pieza
3. Jugador hace **click en columna**
4. Pieza cae con **animación de gravedad** (0.3-0.5s)
5. Pieza impacta con **bounce effect** y **partículas**
6. Sistema verifica si quedan piezas
7. Si quedan: Cambio de turno automático
8. Si no quedan: Transición a Fase Chess

**Criterios de Aceptación:**
- ✅ Animación suave de caída (ease-in)
- ✅ Pieza se apila sobre otras piezas existentes
- ✅ No se puede colocar en columna llena (las 8 casillas ocupadas)
- ✅ Visual feedback claro (highlight de columna)
- ✅ Contador de piezas actualizado en tiempo real

---

### RF-004: Transición de Fases
**Prioridad:** Alta
**Descripción:** Cuando ambos jugadores agoten sus 8 piezas, el sistema debe cambiar a Fase Chess.

**Criterios de Aceptación:**
- ✅ Mensaje de transición: "⚡ GRAVITY COMPLETE ⚡ / Pieces awaken... / Move with chess rules!"
- ✅ Efecto visual "glitch" en todo el tablero
- ✅ Piezas "despiertan" con glow pulsante
- ✅ Panel de estado cambia a "Fase: Chess Movement"
- ✅ Sound effect de phase shift (synth ascendente)

---

### RF-005: Fase de Chess Movement
**Prioridad:** Alta
**Descripción:** Implementar movimiento de piezas según reglas de ajedrez, sin captura.

**Flujo:**
1. Jugador hace **click en pieza propia**
2. Sistema resalta **casillas válidas** (movimientos permitidos)
3. Sistema atenúa **casillas bloqueadas** (ocupadas por otras piezas)
4. Jugador hace **click en casilla válida**
5. Pieza se mueve con **animación suave**
6. Sistema detecta si se formó línea de 5
7. Si NO: Cambio de turno
8. Si SÍ: Victoria

**Reglas de Movimiento:**

| Pieza | Regla | Bloqueo |
|-------|-------|---------|
| ♖ Torre | Líneas rectas (H/V) | Bloqueada por cualquier pieza |
| ♘ Caballo | Forma "L" (2+1) | **Salta sobre piezas** |
| ♗ Alfil | Diagonales | Bloqueada por cualquier pieza |
| ♕ Dama | Cualquier dirección | Bloqueada por cualquier pieza |
| ♔ Rey | 1 casilla | Bloqueada por cualquier pieza |

**IMPORTANTE:**
- ❌ No hay captura (casillas ocupadas = bloqueadas)
- ❌ No hay jaque/jaque mate
- ❌ No hay enroque, peón, promoción

**Criterios de Aceptación:**
- ✅ Movimientos válidos calculados correctamente
- ✅ Caballo puede saltar sobre piezas
- ✅ Otras piezas bloqueadas por obstáculos
- ✅ No se puede mover a casilla ocupada
- ✅ Solo se pueden mover piezas del jugador actual

---

### RF-006: Detección de Victoria
**Prioridad:** Alta
**Descripción:** El sistema debe detectar automáticamente cuando un jugador forma 5 piezas en línea.

**Algoritmo:**
Después de cada movimiento, escanear:
1. **8 filas horizontales** (A-H en cada fila 1-8)
2. **8 columnas verticales** (columnas a-h de arriba a abajo)
3. **Diagonales ↗** (de longitud ≥5)
4. **Diagonales ↘** (de longitud ≥5)

**Criterios de Aceptación:**
- ✅ Detecta 5 en línea horizontal
- ✅ Detecta 5 en línea vertical
- ✅ Detecta 5 en línea diagonal (ambas direcciones)
- ✅ Solo cuenta piezas del mismo color
- ✅ Acepta 5 o más (no tiene que ser exactamente 5)
- ✅ Victoria inmediata al detectar línea

---

### RF-007: Pantalla de Victoria
**Prioridad:** Alta
**Descripción:** Mostrar pantalla de victoria al finalizar partida.

**Elementos:**
- 🏆 Título "VICTORY" con efecto neón
- 🎨 Nombre del ganador (Cyan Player / Magenta Player)
- ✨ Línea ganadora resaltada en el tablero (glow dorado)
- 🎵 Sound effect de victoria (arpeggio C-E-G-C)
- 🔄 Botón "Play Again"
- 🏠 Botón "Menu"

**Criterios de Aceptación:**
- ✅ Tablero congelado (no se puede seguir jugando)
- ✅ Línea ganadora claramente visible
- ✅ Animación de victoria smooth
- ✅ Botones funcionales

---

### RF-008: Interfaz de Usuario (UI)
**Prioridad:** Alta
**Descripción:** Diseñar UI completa con estilo NeonChess.

**ACTUALIZADO 25/10/2025 - Layout Final Implementado:**

#### Estructura Desktop (3 Paneles):
```
┌─────────────────────────────────────────────────┐
│  🏠 HOME    ⚔️ CHESSINFIVE              🔊       │
│             Place. Move. Align Five. Win.       │
├─────────────────────────────────────────────────┤
│                                                 │
│    ┌─────────────────────────────────┐          │
│    │ PHASE 1: GRAVITY PLACEMENT      │          │
│    │ Click on a column to drop       │          │
│    └─────────────────────────────────┘          │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ CYAN     │  │          │  │ MAGENTA  │     │
│  │ PLAYER   │  │          │  │ PLAYER   │     │
│  │          │  │          │  │          │     │
│  │Pieces: 8 │  │  BOARD   │  │Pieces: 8 │     │
│  │♜♜♞♞♝♝♛♚│  │   8x8    │  │♖♖♘♘♗♗♕♔│     │
│  │          │  │          │  │          │     │
│  │┌────────┐│  │          │  │┌────────┐│     │
│  ││ SELECT ││  │          │  ││ SELECT ││     │
│  ││ PIECE  ││  │          │  ││ PIECE  ││     │
│  ││        ││  │          │  ││        ││     │
│  ││♜ ROOK 2││  │          │  ││♖ ROOK 2││     │
│  ││♞KNIGHT2││  │          │  ││♘KNIGHT2││     │
│  ││♝BISHOP2││  │          │  ││♗BISHOP2││     │
│  ││♛QUEEN 1││  │          │  ││♕QUEEN 1││     │
│  ││♚ KING 1││  │          │  ││♔ KING 1││     │
│  │└────────┘│  │          │  │└────────┘│     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│         ┌─────────────────────────┐            │
│         │ CURRENT TURN:           │            │
│         │ CYAN PLAYER             │            │
│         └─────────────────────────┘            │
│         ┌─────────────────────────┐            │
│         │ NEW GAME │ UNDO │ HELP  │            │
│         └─────────────────────────┘            │
└─────────────────────────────────────────────────┘
```

**Componentes Implementados:**

#### Top Panel:
- Phase Indicator (PHASE 1: GRAVITY PLACEMENT / PHASE 2: CHESS MOVEMENT)
- Descripción contextual según fase

#### Middle Row (3 columnas):
1. **Player Panel Left (Cyan):**
   - Player Info Box (header + pieces left + inventory)
   - SELECT PIECE (visible solo en turno del jugador)

2. **Board Container (Centro):**
   - Tablero 8x8 con CSS Grid
   - Coordenadas tipo "taxi"
   - Responsive sizing

3. **Player Panel Right (Magenta):**
   - Player Info Box (header + pieces left + inventory)
   - SELECT PIECE (visible solo en turno del jugador)

#### Bottom Panel:
- Turn Indicator (con borde brillante según jugador activo)
- Game Controls (NEW GAME, UNDO, HELP)

#### Header:
- CSS Grid con 3 columnas simétricas (100px | 1fr | 100px)
- Botón HOME (izquierda)
- Título + Subtitle (centro)
- Botón SOUND (derecha)

**Características UX Implementadas:**
- ✅ Dual Piece Selectors (uno por jugador con IDs únicos)
- ✅ Solo jugador activo puede interactuar (selector inactivo oculto)
- ✅ Indicador visual de turno en Fase 2 (borde brillante + box-shadow)
- ✅ Paneles alineados verticalmente (min-height: 150px)
- ✅ SELECT PIECE separado de player-info (elementos hermanos)
- ✅ Header perfectamente centrado

**Criterios de Aceptación:**
- ✅ UI responsive en móvil (320px+) y desktop (1920px)
- ✅ Layout de 3 paneles (top/middle/bottom)
- ✅ Tablero centrado horizontalmente
- ✅ Todos los elementos visibles sin scroll horizontal
- ✅ Fuentes legibles (mínimo 12px en móvil)
- ✅ Contraste suficiente (WCAG AA)
- ✅ Indicador visual claro de turno en ambas fases

---

### RF-009: Sistema de Sonido
**Prioridad:** Media
**Descripción:** Implementar efectos de sonido synthwave para mejorar experiencia.

**Sonidos Requeridos:**

| Evento | Sonido | Descripción |
|--------|--------|-------------|
| Drop piece | "Whoosh + Thud" | Descendente + impacto |
| Heavy piece (Torre/Dama) | "Bass Thud" | Thud con bass boost |
| Column hover | "Blip" | Sutil beep electrónico |
| Phase complete | "Chord Progression" | Transición musical |
| Select piece | "Synth Click" | C note |
| Move piece | "Glide" | Synth sound suave |
| Invalid move | "Error Buzz" | Buzz corto y suave |
| 3-in-line | "Warning Beep" | E note |
| 4-in-line | "Urgent Beep" | G note rápido |
| 5-in-line (Victory) | "Arpeggio" | C-E-G-C ascendente + reverb |

**Criterios de Aceptación:**
- ✅ Toggle on/off funcional
- ✅ Volumen ajustable (opcional)
- ✅ Preferencia guardada en localStorage
- ✅ Sonidos sincronizados con animaciones

---

### RF-010: Detección de Empate
**Prioridad:** Media
**Descripción:** Detectar situaciones de empate y finalizar partida.

**Condiciones de Empate:**
1. **Tablero bloqueado:** Ningún jugador puede mover ninguna pieza
2. **50 movimientos sin progreso:** (opcional, regla de seguridad)
3. **Acuerdo mutuo:** Botón "Offer Draw" (v1.1)

**Criterios de Aceptación:**
- ✅ Mensaje: "Draw - No valid moves remaining"
- ✅ Botón "Play Again"
- ✅ No se declara ganador

---

### RF-011: Historial de Movimientos
**Prioridad:** Baja (v1.1)
**Descripción:** Registro de todos los movimientos de la partida.

**Formato:**
```
1. Cyan: Torre → e1 (gravity)
2. Magenta: Caballo → c2 (gravity)
3. Cyan: Alfil → g1 (gravity)
...
17. Cyan: Torre e1 → e5 (move)
18. Magenta: Caballo c2 → d4 (move)
```

**Criterios de Aceptación:**
- ✅ Notación clara y legible
- ✅ Scroll vertical si excede espacio
- ✅ Exportable como texto (v1.2)

---

### RF-012: Sistema de Undo
**Prioridad:** Baja (v1.1)
**Descripción:** Permitir deshacer último movimiento.

**Limitaciones:**
- Solo en Fase Chess (no en Gravity)
- Solo 1 undo por turno
- Ambos jugadores deben aprobar (modo competitivo)

**Criterios de Aceptación:**
- ✅ Botón "↩️ Undo" habilitado solo cuando aplica
- ✅ Estado del tablero restaurado correctamente
- ✅ Historial actualizado

---

## 4. REQUERIMIENTOS NO FUNCIONALES

### RNF-001: Rendimiento
**Descripción:** El juego debe ser fluido y responsivo.

**Métricas:**
- Tiempo de carga inicial: < 2 segundos
- FPS animaciones: 60 fps constante
- Respuesta a click: < 100ms
- Detección de línea: < 50ms

---

### RNF-002: Compatibilidad
**Descripción:** Soporte multi-navegador y multi-dispositivo.

**Navegadores:**
- ✅ Chrome 90+ (Desktop + Mobile)
- ✅ Firefox 88+ (Desktop + Mobile)
- ✅ Safari 14+ (Desktop + iOS)
- ✅ Edge 90+

**Dispositivos:**
- ✅ Desktop: 1920x1080, 1366x768
- ✅ Tablet: 768x1024 (iPad)
- ✅ Mobile: 375x667 (iPhone), 360x640 (Android)

---

### RNF-003: Usabilidad
**Descripción:** Juego intuitivo y fácil de aprender.

**Criterios:**
- Tutorial interactivo en primer uso
- Tooltips en elementos clave
- Feedback visual inmediato
- Mensajes de error claros

---

### RNF-004: Accesibilidad
**Descripción:** Cumplir estándares WCAG 2.1 AA.

**Requisitos:**
- ✅ Contraste mínimo 4.5:1
- ✅ Navegación por teclado completa
- ✅ ARIA labels en elementos interactivos
- ✅ Alt text en íconos importantes

---

### RNF-005: Seguridad
**Descripción:** Protección básica client-side.

**Medidas:**
- Validación de movimientos en cliente
- Sanitización de inputs
- No exposición de lógica crítica
- localStorage con encriptación básica (opcional)

---

### RNF-006: Mantenibilidad
**Descripción:** Código limpio y documentado.

**Estándares:**
- JavaScript ES6+ modular
- Comentarios en funciones clave
- Arquitectura MVC o similar
- README con instrucciones de desarrollo

---

### RNF-007: Escalabilidad
**Descripción:** Diseño preparado para futuras expansiones.

**Consideraciones:**
- Arquitectura modular (fácil agregar modos)
- Configuración externalizada
- Sistema de plugins para IA
- API interna para estadísticas

---

## 5. CASOS DE USO

### CU-001: Iniciar Nueva Partida
**Actor:** Jugador
**Flujo Principal:**
1. Usuario navega a ChessInFive
2. Sistema muestra pantalla principal
3. Usuario click "Play Now"
4. Sistema inicializa tablero 8x8 vacío
5. Sistema asigna 8 piezas a Jugador Cyan
6. Sistema asigna 8 piezas a Jugador Magenta
7. Sistema marca turno de Jugador Cyan
8. Sistema muestra instrucción "Click column to drop"

**Postcondición:** Partida iniciada en Fase Gravity

---

### CU-002: Colocar Pieza con Gravedad
**Actor:** Jugador en turno
**Precondición:** Fase Gravity activa, jugador tiene piezas restantes
**Flujo Principal:**
1. Usuario hace hover sobre columna D
2. Sistema resalta columna D
3. Sistema muestra ghost preview en D1 (donde caerá)
4. Usuario hace click en columna D
5. Sistema anima caída de pieza desde arriba
6. Pieza aterriza en D1 con bounce effect
7. Sistema decrementa contador: "Piezas restantes: 7/8"
8. Sistema cambia turno a Jugador Magenta
9. Sistema actualiza instrucción

**Postcondición:** Pieza colocada, turno cambiado

**Flujo Alternativo 4a:** Columna llena
- 4a1. Sistema muestra mensaje "Column full!"
- 4a2. Sistema vibra columna (shake effect)
- 4a3. Retorna a paso 1

---

### CU-003: Completar Fase Gravity
**Actor:** Sistema
**Precondición:** Ambos jugadores colocaron 8 piezas (16 total)
**Flujo Principal:**
1. Sistema detecta última pieza colocada
2. Sistema muestra overlay "⚡ GRAVITY COMPLETE ⚡"
3. Sistema aplica efecto glitch al tablero
4. Sistema hace "despertar" piezas (glow pulsante)
5. Sistema reproduce sound effect de transición
6. Sistema cambia panel a "Fase: Chess Movement"
7. Sistema espera 2 segundos
8. Sistema oculta overlay
9. Sistema habilita selección de piezas

**Postcondición:** Fase Chess iniciada

---

### CU-004: Mover Pieza con Reglas de Ajedrez
**Actor:** Jugador en turno
**Precondición:** Fase Chess activa
**Flujo Principal:**
1. Usuario click en Torre propia en e1
2. Sistema resalta Torre con glow
3. Sistema calcula movimientos válidos (e2-e8, a1-d1, f1-h1)
4. Sistema resalta casillas válidas (verde)
5. Sistema atenúa casillas bloqueadas (rojo)
6. Usuario click en e5 (casilla válida)
7. Sistema anima movimiento de e1 → e5 con trail effect
8. Sistema actualiza posición de Torre
9. Sistema verifica si hay 5 en línea
10. No hay línea → Sistema cambia turno

**Postcondición:** Pieza movida, turno cambiado

**Flujo Alternativo 6a:** Click en casilla inválida
- 6a1. Sistema reproduce "error buzz"
- 6a2. Sistema vibra casilla inválida
- 6a3. Retorna a paso 5

---

### CU-005: Ganar Partida
**Actor:** Sistema
**Precondición:** Jugador Cyan formó 5 piezas en línea
**Flujo Principal:**
1. Sistema detecta 5 en línea en fila 3 (a3-e3)
2. Sistema congela tablero (desactiva clicks)
3. Sistema resalta línea ganadora (glow dorado animado)
4. Sistema reproduce victory arpeggio
5. Sistema muestra overlay de victoria
6. Sistema muestra "🏆 CYAN PLAYER WINS! 🏆"
7. Sistema muestra línea ganadora visualmente
8. Sistema muestra botones "Play Again" y "Menu"
9. Usuario click "Play Again"
10. Sistema reinicia partida (retorna a CU-001)

**Postcondición:** Partida finalizada, pantalla de victoria mostrada

---

## 6. MODELO DE DATOS

### 6.1 Estructura de Datos en Memoria

#### GameState Object
```javascript
{
    phase: 'gravity' | 'chess',          // Fase actual
    currentPlayer: 'cyan' | 'magenta',   // Turno actual
    board: Array(64),                     // Tablero [0-63]
    cyanPieces: {
        available: Array,                 // Piezas no colocadas
        placed: Array                     // Piezas en tablero
    },
    magentaPieces: {
        available: Array,
        placed: Array
    },
    moveHistory: Array,                   // Historial de movimientos
    winner: null | 'cyan' | 'magenta',   // Ganador
    winningLine: null | Array             // Casillas de línea ganadora
}
```

#### Piece Object
```javascript
{
    type: 'rook' | 'knight' | 'bishop' | 'queen' | 'king',
    color: 'cyan' | 'magenta',
    position: 0-63 | null,                // Índice en tablero o null
    symbol: '♖' | '♘' | '♗' | '♕' | '♔'
}
```

#### Move Object
```javascript
{
    player: 'cyan' | 'magenta',
    piece: Piece,
    from: 0-63 | null,                    // null en gravity phase
    to: 0-63,
    phase: 'gravity' | 'chess',
    timestamp: Date
}
```

---

### 6.2 LocalStorage Schema

```javascript
{
    'chessinfive-settings': {
        soundEnabled: boolean,
        volume: 0-100,
        showTutorial: boolean
    },
    'chessinfive-stats': {
        gamesPlayed: number,
        cyanWins: number,
        magentaWins: number,
        draws: number,
        longestGame: number             // Cantidad de movimientos
    }
}
```

---

## 7. ARQUITECTURA DEL SISTEMA

### 7.1 Stack Tecnológico

**Frontend:**
- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+ (Vanilla, sin frameworks)

**Diseño:**
- NeonChess Design System
- Responsive design (mobile-first)

**Audio:**
- Web Audio API (generación de sonidos sintéticos)

**Almacenamiento:**
- localStorage (persistencia client-side)

---

### 7.2 Arquitectura de Módulos

```
chessinfive/
├── index.html                 # Página principal
├── assets/
│   ├── css/
│   │   ├── chessinfive-style.css      # Estilos específicos
│   │   └── neonchess-base.css       # Sistema de diseño compartido
│   ├── js/
│   │   ├── game-state.js            # Gestión de estado
│   │   ├── gravity-phase.js         # Lógica de gravedad
│   │   ├── chess-phase.js           # Lógica de movimiento
│   │   ├── win-detection.js         # Detección de victoria
│   │   ├── ui-controller.js         # Control de UI
│   │   ├── sound-manager.js         # Sistema de audio
│   │   └── main.js                  # Inicialización
│   └── sounds/
│       └── (generados dinámicamente con Web Audio API)
└── docs/
    ├── ERS_REQUERIMIENTOS.md       # Este documento
    ├── DISEÑO_TECNICO.md           # Diseño detallado
    └── SESION_RESUMEN.md           # Resumen para próxima sesión
```

---

### 7.3 Flujo de Datos

```
User Input (Click/Hover)
    ↓
UI Controller
    ↓
Game State Manager
    ↓
Phase-specific Logic (Gravity/Chess)
    ↓
Board Update
    ↓
Win Detection
    ↓
UI Update + Sound Effects
```

---

## 8. ROADMAP DE DESARROLLO

### Versión 1.0 - MVP (4-6 semanas)
**Objetivo:** Juego funcional 2 jugadores local

**Características:**
- ✅ Tablero 8x8 responsive
- ✅ Fase Gravity completa
- ✅ Fase Chess completa
- ✅ Detección de 5 en línea
- ✅ UI básica funcional
- ✅ Sistema de sonido

**Criterio de Éxito:**
- Partida completa jugable de inicio a fin
- Sin bugs críticos
- Funcionamiento en Chrome/Firefox/Safari

---

### Versión 1.1 - Polish (2-3 semanas)
**Objetivo:** Mejoras de UX y efectos

**Características:**
- ✅ Animaciones mejoradas (partículas, trails)
- ✅ Tutorial interactivo
- ✅ Sistema de Undo
- ✅ Historial de movimientos
- ✅ Estadísticas locales
- ✅ Mejoras visuales (glows, transitions)

---

### Versión 2.0 - IA (4-5 semanas)
**Objetivo:** Modo single-player vs CPU

**Características:**
- ✅ Bot Level 1 (Easy): Movimientos random + bloqueo básico
- ✅ Bot Level 2 (Medium): Detecta amenazas 3-4 en línea
- ✅ Bot Level 3 (Hard): Minimax con evaluación heurística
- ✅ Selector de dificultad
- ✅ Estadísticas vs IA

---

### Versión 3.0 - Modos Alternativos (3-4 semanas)
**Objetivo:** Variantes del juego

**Características:**
- ✅ Speed Mode: 6x6 board, 5 pieces, 4-in-line
- ✅ Classic Mode: 10x10 board, 10 pieces, 6-in-line
- ✅ Chaos Mode: Piezas caen en columna aleatoria
- ✅ Time Attack: Partidas con reloj de ajedrez

---

### Versión 4.0 - Multiplayer Online (8-10 semanas)
**Objetivo:** Juego en línea con backend

**Características:**
- ✅ Backend Node.js + Socket.io
- ✅ Matchmaking
- ✅ Rankings globales
- ✅ Sistema de usuarios (auth)
- ✅ Chat en partida
- ✅ Replay system

---

## 9. CRITERIOS DE ACEPTACIÓN DEL MVP

### Funcionales:
- [x] Usuario puede iniciar nueva partida
- [x] Piezas caen por gravedad correctamente
- [x] Transición automática a Fase Chess
- [x] Piezas se mueven según reglas de ajedrez
- [x] Caballo puede saltar, otras piezas bloqueadas
- [x] Detección correcta de 5 en línea (H/V/D)
- [x] Pantalla de victoria funcional
- [x] Botón "Play Again" reinicia partida
- [x] Sonidos sincronizados con acciones
- [x] UI responsive en móvil y desktop

### No Funcionales:
- [x] Carga en < 2 segundos
- [x] 60 fps en animaciones
- [x] Sin bugs críticos
- [x] Funciona en Chrome, Firefox, Safari
- [x] Código comentado y documentado

---

## 10. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Algoritmo de detección lento en diagonales | Media | Alto | Optimizar con índices precalculados |
| Animaciones lag en móviles antiguos | Alta | Medio | Reducir efectos en dispositivos lentos |
| Complejidad de IA excede tiempo | Media | Medio | Limitar profundidad de minimax |
| Gravedad no intuitiva para usuarios | Baja | Alto | Tutorial obligatorio en primer uso |
| Bugs en lógica de movimiento | Media | Crítico | Tests unitarios exhaustivos |

---

## 11. GLOSARIO TÉCNICO

| Término | Definición |
|---------|------------|
| **Gravity Phase** | Primera fase donde piezas caen por gravedad |
| **Chess Phase** | Segunda fase con movimiento estilo ajedrez |
| **5-in-line** | Condición de victoria (5 piezas alineadas) |
| **Ghost Preview** | Silueta transparente mostrando dónde caerá pieza |
| **Trail Effect** | Rastro visual detrás de pieza en movimiento |
| **Glow Effect** | Brillo neón alrededor de elemento |
| **Minimax** | Algoritmo de IA para juegos de suma cero |
| **Heurística** | Función de evaluación para estimar valor de posición |
| **Synthwave** | Estilo musical/visual retro-futurista de los 80s |
| **NeonChess** | Sistema de diseño de ChessArcade |

---

## 12. APÉNDICES

### Apéndice A: Wireframes
Ver archivo: `wireframes/chessinfive-mockups.png`

### Apéndice B: Paleta de Colores
```css
--cyan: #00ffff
--magenta: #ff00ff
--yellow: #ffff00
--orange: #ff8000
--green: #00ff80
--purple: #8000ff
--background: #0a0a0f
--text-primary: #ffffff
--text-secondary: #b0b0c0
```

### Apéndice C: Referencias
- Chess.com - Inspiración de UI
- Connect Four - Mecánica de gravedad
- Synthwave Aesthetics - Estilo visual
- Web Audio API Docs - Sistema de sonido

---

**Fin del Documento ERS**

---

**Control de Versiones:**

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0.0 | 2025-10-20 | ChessArcade Team | Versión inicial completa |
| 1.0.1 | 2025-10-25 | ChessArcade Team | Actualización RF-008: Layout final implementado con dual piece selectors, 3 paneles (top/middle/bottom), header centrado con CSS Grid, indicador visual de turno en Fase 2 |
| 1.0.4 | 2025-11-03 | ChessArcade Team | IA Depth-2: Algoritmo de búsqueda profunda que simula respuesta del oponente. Detecta amenazas futuras de 4-en-línea. UX: Hourglass en paneles laterales, botón NEW GAME estabilizado |
| 1.0.5 | 2025-11-03 | ChessArcade Team | Bug fix: Añadida función hasExisting4InARowThreat() para detectar 4-en-línea existentes. Integrada en canOpponentWinNextTurn() |
| 1.0.6 | 2025-11-03 | ChessArcade Team | Detección Proactiva: Escaneo de tablero ANTES de cada movimiento. findCritical4InRowThreat() identifica amenazas críticas. findMoveToSquare() encuentra bloqueos. IA bloquea 4-en-línea inmediatamente. Gameplay significativamente más difícil |

---

**Aprobaciones:**

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Product Owner | - | - | - |
| Tech Lead | - | - | - |
| QA Lead | - | - | - |
