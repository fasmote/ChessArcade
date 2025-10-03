# 📋 REQUERIMIENTOS FUNCIONALES - Memory Matrix

**Proyecto**: ChessArcade - Memory Matrix
**Versión**: 2.0
**Fecha**: 1 de Octubre de 2025
**Target**: Edades 4-17+ años

---

## 🎯 DESCRIPCIÓN GENERAL

Memory Matrix es un juego educativo de memoria visual ajedrecística con progresión de dificultad en 30 niveles. El jugador observa una posición de ajedrez por tiempo limitado, luego debe recrearla arrastrando piezas de un banco lateral al tablero.

---

## 👥 USUARIOS

### Perfil de Usuario
- **Edad**: 4-17+ años
- **Nivel ajedrez**: Desde principiante absoluto hasta avanzado
- **Dispositivos**: Mobile (prioritario), Tablet, Desktop
- **Acceso**: Web browser, sin instalación

### Necesidades del Usuario
1. Aprender reconocimiento de piezas
2. Mejorar memoria visual
3. Memorizar patrones tácticos
4. Conocer partidas históricas
5. Entrenar de forma divertida

---

## ⚙️ REQUERIMIENTOS FUNCIONALES

### RF-001: Visualización del Tablero
**Prioridad**: ALTA | **Estado**: Pendiente

#### Descripción
Mostrar tablero de ajedrez 8x8 con notación algebraica

#### Criterios de Aceptación
- [ ] Tablero con 64 casillas alternadas (beige/marrón)
- [ ] Coordenadas visibles: a-h (horizontal), 1-8 (vertical)
- [ ] Borde neón cyan `box-shadow: 0 0 20px #00ffff`
- [ ] Responsive: 90% ancho en mobile, max 500px en desktop
- [ ] Centrado horizontal en todas las resoluciones

#### Diseño Mobile First
- Mobile (<600px): Tablero ocupa 90% ancho pantalla
- Tablet (600-900px): Tablero max 450px
- Desktop (>900px): Tablero max 500px

---

### RF-002: Sistema de Piezas
**Prioridad**: ALTA | **Estado**: Pendiente

#### Descripción
Mostrar piezas de ajedrez usando SVG desde CDN

#### Criterios de Aceptación
- [ ] Piezas se cargan desde CDN Lichess por defecto
- [ ] Formato SVG (escalable, sin pérdida de calidad)
- [ ] Código de piezas: wK, wQ, wR, wB, wN, wP, bK, bQ, bR, bB, bN, bP
- [ ] Imágenes centradas en casillas
- [ ] Tamaño responsive (escala con tablero)

#### Fuentes de Piezas (CDN)
- **Lichess**: `https://lichess1.org/assets/piece/cburnett/{piece}.svg`
- **Chess.com**: `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/{piece}.png`
- **Wikipedia**: `https://upload.wikimedia.org/wikipedia/commons/...`

#### Regla Técnica Crítica
```javascript
// ✅ CORRECTO - pieceTheme debe ser FUNCIÓN
pieceTheme: (piece) => {
    return `<img src="https://lichess1.org/assets/piece/cburnett/${piece}.svg">`;
}

// ❌ INCORRECTO - NO usar string
pieceTheme: 'path/to/{piece}.svg'
```

---

### RF-003: Selector de Estilo de Piezas
**Prioridad**: MEDIA | **Estado**: Pendiente

#### Descripción
Permitir al usuario elegir diferentes estilos visuales de piezas

#### Criterios de Aceptación
- [ ] Botón "Piezas" en esquina superior derecha
- [ ] Dropdown con opciones: Lichess, Chess.com, Wikipedia, Monsters (MAG)
- [ ] Preview visual de cada tema (imagen del rey blanco)
- [ ] Selección se guarda en localStorage
- [ ] Cambio de tema recarga piezas inmediatamente
- [ ] Touch-friendly en mobile

#### Temas Disponibles
| Tema | Tipo | Estado | Fuente |
|------|------|--------|--------|
| Lichess | CDN | ✅ Activo | Default |
| Chess.com | CDN | ✅ Activo | Opcional |
| Wikipedia | CDN | ✅ Activo | Opcional |
| Monsters (MAG) | Local | 🔒 Futuro | Diseño MAG |

---

### RF-004: Banco de Piezas Draggables
**Prioridad**: ALTA | **Estado**: Pendiente

#### Descripción
Barra lateral/inferior con piezas que el usuario puede arrastrar al tablero

#### Criterios de Aceptación
- [ ] Muestra solo las piezas necesarias para el nivel actual
- [ ] Piezas son draggables (cursor: grab)
- [ ] Borde neón naranja para distinguir del tablero
- [ ] Fondo oscuro semi-transparente
- [ ] Responsive: lateral derecha (desktop), inferior (mobile)

#### Layout Responsive
- **Mobile (<768px)**:
  - Banco abajo del tablero
  - Piezas en fila horizontal
  - Scroll horizontal si no caben

- **Desktop (≥768px)**:
  - Banco a la derecha del tablero
  - Piezas en columna vertical
  - Altura sincronizada con tablero

#### Sincronización de Altura (Desktop)
```javascript
// Banco debe tener misma altura que tablero
bankHeight = boardHeight;
```

---

### RF-005: Drag & Drop
**Prioridad**: ALTA | **Estado**: Pendiente

#### Descripción
Arrastrar piezas del banco y soltarlas en casillas específicas del tablero

#### Criterios de Aceptación
- [ ] Drag inicia en pieza del banco
- [ ] Visual feedback durante drag (cursor grabbing)
- [ ] Drop detecta casilla EXACTA donde se soltó
- [ ] Pieza se coloca en esa casilla
- [ ] Pieza desaparece del banco al colocarla
- [ ] Si se suelta fuera del tablero, no hace nada

#### Algoritmo de Detección de Casilla
```javascript
function getSquareFromCoordinates(mouseX, mouseY) {
    // 1. Obtener rectángulo del tablero
    const rect = board.getBoundingClientRect();

    // 2. Calcular posición relativa
    const relX = mouseX - rect.left;
    const relY = mouseY - rect.top;

    // 3. Dividir en 8x8
    const col = Math.floor(relX / (rect.width / 8));
    const row = 8 - Math.floor(relY / (rect.height / 8));

    // 4. Convertir a notación algebraica
    const files = ['a','b','c','d','e','f','g','h'];
    return files[col] + row; // Ej: 'e4'
}
```

---

### RF-006: Estados del Juego
**Prioridad**: ALTA | **Estado**: Pendiente

#### Descripción
Gestionar diferentes estados del flujo del juego

#### Estados Definidos
1. **waiting**: Esperando que usuario haga click en "Comenzar"
2. **memorizing**: Mostrando posición por X segundos
3. **placing**: Usuario colocando piezas del banco
4. **complete**: Posición correcta, nivel completado

#### Transiciones de Estado
```
waiting → [click "Comenzar"] → memorizing
memorizing → [timer termina] → placing
placing → [posición correcta] → complete
complete → [click "Siguiente"] → waiting (nivel+1)
```

#### Criterios de Aceptación
- [ ] Cada estado tiene UI diferente
- [ ] Transiciones son claras para el usuario
- [ ] No se puede hacer trampa (ej: colocar piezas durante memorizing)
- [ ] Logs en consola para debugging

---

### RF-007: Sistema de Niveles
**Prioridad**: ALTA | **Estado**: Pendiente

#### Descripción
30 niveles progresivos con posiciones de Lichess y partidas históricas

#### Estructura de Nivel
```javascript
{
    levelNumber: 1,
    name: "DOS REYES SOLOS",
    type: "basic_mate",
    difficulty: 1,
    target_age: "4-5 años",
    fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
    pieces_to_memorize: ['e1', 'e8'],  // Casillas a ocultar
    view_time: 8000,  // Milisegundos
    explanation: "Los reyes nunca pueden estar juntos",
    source: "didactic"
}
```

#### Distribución de Niveles
| Niveles | Nombre | Target | Tipo de Contenido |
|---------|--------|--------|-------------------|
| 1-10 | Baby Memory | 4-10 años | Mates básicos, posición inicial |
| 11-15 | Pattern Master | 10-14 años | Aperturas famosas (Italiana, Siciliana, etc.) |
| 16-20 | Tactical Genius | 12-16 años | Puzzles tácticos (clavada, tenedor, etc.) |
| 21-25 | Historical Master | 14+ años | Partidas inmortales (Anderssen, Morphy, etc.) |
| 26-30 | Grandmaster Mode | 16+ años | Finales artísticos (Réti, Saavedra, etc.) |

#### Criterios de Aceptación
- [ ] Selector de nivel en UI
- [ ] Cargar FEN correcta al seleccionar nivel
- [ ] Tiempo de memorización variable por nivel
- [ ] Explicación pedagógica visible
- [ ] Progresión: desbloquear siguiente nivel al completar

---

### RF-008: Verificación de Victoria
**Prioridad**: ALTA | **Estado**: Pendiente

#### Descripción
Detectar cuando el usuario recreó correctamente la posición

#### Algoritmo
```javascript
function checkWin(targetPosition, currentPosition) {
    for (let square in targetPosition) {
        if (currentPosition[square] !== targetPosition[square]) {
            return false; // Pieza incorrecta o faltante
        }
    }
    return true; // Todas las piezas correctas
}
```

#### Criterios de Aceptación
- [ ] Verificación automática al colocar cada pieza
- [ ] Feedback inmediato si está mal (opcional: shake)
- [ ] Mensaje de victoria cuando está correcto
- [ ] Confeti/animación de celebración
- [ ] Opción "Siguiente Nivel" aparece

---

### RF-009: Interfaz de Usuario
**Prioridad**: ALTA | **Estado**: Pendiente

#### Componentes UI Requeridos

##### Header
- Título: "🧠 Memory Matrix" estilo neón cyan
- Botón HOME (top-left): Volver a ChessArcade principal
- Botón SONIDO (top-right): Mute/Unmute
- Botón PIEZAS (top-right): Selector de temas

##### Área de Juego
- Tablero centrado
- Banco de piezas (lateral/inferior)
- Mensaje de estado debajo del tablero

##### Botones de Acción
- "Comenzar" / "Jugar de Nuevo"
- "Siguiente Nivel" (después de ganar)
- Selector de Nivel (dropdown)

##### Mensajes de Estado
- "Haz clic en Comenzar para empezar"
- "¡Memoriza la posición! (X segundos)"
- "Arrastra las piezas del banco al tablero"
- "¡Excelente! ¡Posición correcta! 🎉"

#### Criterios de Aceptación
- [ ] UI minimalista, no distrae del juego
- [ ] Botones grandes y touch-friendly
- [ ] Fuente Orbitron para títulos
- [ ] Efectos neón en bordes y textos importantes
- [ ] Responsive en todos los tamaños

---

### RF-010: Sistema de Audio
**Prioridad**: BAJA | **Estado**: Futuro

#### Descripción
Sonidos y música de fondo opcionales

#### Sonidos Requeridos
- Pieza colocada (click suave)
- Pieza incorrecta (buzzer)
- Victoria (fanfare corto)
- Música de fondo (loop, off por defecto)

#### Criterios de Aceptación
- [ ] Botón mute/unmute visible
- [ ] Estado mute persiste en localStorage
- [ ] Volumen ajustable
- [ ] Música no interfiere con sonidos de acción

---

### RF-011: Animaciones y Transiciones
**Prioridad**: BAJA | **Estado**: Futuro

#### Animaciones Deseadas
- Fade in de piezas al mostrar posición
- Fade out de piezas al ocultarlas
- Shake de pieza si está en casilla incorrecta
- Confeti/partículas al completar nivel
- Glow pulse en timer de memorización

#### Criterios de Aceptación
- [ ] Animaciones suaves (300-500ms)
- [ ] No afectan performance
- [ ] Pueden desactivarse (accesibilidad)

---

### RF-012: Persistencia de Datos
**Prioridad**: MEDIA | **Estado**: Pendiente

#### Datos a Guardar (localStorage)
- Tema de piezas seleccionado
- Nivel actual desbloqueado
- Estado de audio (mute/unmute)
- Estadísticas (opcional):
  - Niveles completados
  - Mejor tiempo por nivel
  - Intentos por nivel

#### Criterios de Aceptación
- [ ] Datos se guardan automáticamente
- [ ] Recuperar al recargar página
- [ ] Botón "Reset" para limpiar progreso

---

### RF-013: Responsive Design
**Prioridad**: ALTA | **Estado**: Pendiente

#### Breakpoints Definidos
| Dispositivo | Ancho | Layout |
|-------------|-------|--------|
| Mobile Small | 350-600px | Vertical, banco abajo |
| Mobile Large | 600-768px | Vertical, banco abajo más ancho |
| Tablet | 768-1024px | Horizontal, banco lateral |
| Desktop | >1024px | Horizontal, banco lateral |

#### Criterios de Aceptación Mobile First
- [ ] Diseño inicial para 350px (iPhone SE)
- [ ] Testear en Chrome DevTools mobile
- [ ] Touch targets mínimo 44x44px
- [ ] Texto legible sin zoom
- [ ] No scroll horizontal

---

### RF-014: Accesibilidad
**Prioridad**: MEDIA | **Estado**: Futuro

#### Criterios de Aceptación
- [ ] Contraste suficiente (WCAG AA)
- [ ] Alt text en imágenes de piezas
- [ ] Navegación por teclado (Tab)
- [ ] Screen reader friendly
- [ ] Opción reducir animaciones

---

### RF-015: Performance
**Prioridad**: MEDIA | **Estado**: Pendiente

#### Métricas Objetivo
- Carga inicial: <2 segundos
- Drag & drop: 60fps
- Tamaño total: <500KB (sin contar CDN)

#### Criterios de Aceptación
- [ ] CDN para piezas (no assets locales)
- [ ] CSS/JS minificados en producción
- [ ] Imágenes optimizadas
- [ ] No memory leaks (testear con DevTools)

---

## 🚫 REQUERIMIENTOS NO FUNCIONALES

### RNF-001: Compatibilidad de Navegadores
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile: iOS Safari, Chrome Android

### RNF-002: Sin Instalación
- 100% web, no requiere app
- No requiere registro/login
- Funciona offline (PWA futuro)

### RNF-003: Gratuito
- Sin publicidad
- Sin compras in-app
- Contenido educativo libre

---

## ✅ CRITERIOS DE ACEPTACIÓN GENERAL

### Definición de "Terminado" (DoD)
Un feature está terminado cuando:
1. ✅ Funciona en mobile (350px+)
2. ✅ Funciona en desktop (1920px)
3. ✅ Código comentado
4. ✅ Testeado en incognito (sin cache)
5. ✅ No errores en consola (F12)
6. ✅ Documentado en PLAN_DESARROLLO.md
7. ✅ Screenshot de evidencia

---

## 📊 PRIORIDADES

### MVP (Mínimo Producto Viable)
**Objetivo**: Nivel 1 jugable end-to-end

Incluye:
- RF-001: Tablero
- RF-002: Piezas (solo Lichess)
- RF-004: Banco de piezas
- RF-005: Drag & drop
- RF-006: Estados del juego
- RF-008: Verificación de victoria
- RF-009: UI básica

### Fase 2: Contenido
- RF-007: Sistema de 30 niveles
- RF-012: Persistencia
- RF-003: Selector de piezas

### Fase 3: Pulido
- RF-010: Audio
- RF-011: Animaciones
- RF-014: Accesibilidad

---

## 📝 NOTAS TÉCNICAS

### Tecnologías Utilizadas
- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript Vanilla (ES6+)
- localStorage API
- Drag & Drop API

### Librerías Externas (Opcionales)
- **ChessBoard2.js**: Renderizado de tablero (evaluar si necesario)
- **Chess.js**: Validación de movimientos (solo para validar FENs)
- **Howler.js**: Audio (solo si RF-010 se implementa)

### Sin Librerías Pesadas
- ❌ NO React/Vue/Angular (overhead innecesario)
- ❌ NO jQuery (nativo es suficiente)
- ❌ NO Bootstrap (CSS custom es mejor)

---

## 🔗 REFERENCIAS

- **Lichess API**: https://lichess.org/api
- **FEN Notation**: https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
- **Drag & Drop API**: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- **Mobile First**: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

---

**Aprobado por**: Claudio (MAG)
**Fecha**: 1 de Octubre de 2025
**Versión**: 1.0
