# 📋 ERS - Master Sequence

**Especificación de Requerimientos de Software**

---

## 📊 INFORMACIÓN DEL DOCUMENTO

| Campo | Valor |
|-------|-------|
| **Proyecto** | Master Sequence - ChessArcade |
| **Versión** | 2.0.0 |
| **Fecha** | 19 de Octubre, 2025 |
| **Autor** | ChessArcade Team |
| **Estado** | ✅ En Producción |
| **Última Actualización** | 19/10/2025 - Sistema HINT completo implementado |

---

## 📑 TABLA DE CONTENIDOS

1. [Introducción](#1-introducción)
2. [Alcance del Proyecto](#2-alcance-del-proyecto)
3. [Descripción General](#3-descripción-general)
4. [Requerimientos Funcionales](#4-requerimientos-funcionales)
5. [Requerimientos No Funcionales](#5-requerimientos-no-funcionales)
6. [Casos de Uso](#6-casos-de-uso)
7. [Reglas de Negocio](#7-reglas-de-negocio)
8. [Interfaz de Usuario](#8-interfaz-de-usuario)
9. [Modelo de Datos](#9-modelo-de-datos)
10. [Matriz de Trazabilidad](#10-matriz-de-trazabilidad)
11. [Criterios de Aceptación](#11-criterios-de-aceptación)
12. [Mejoras Futuras](#12-mejoras-futuras)
13. [Glosario](#13-glosario)

---

## 1. INTRODUCCIÓN

### 1.1 Propósito

Este documento especifica los requerimientos funcionales y no funcionales del juego **Master Sequence**, un juego de memoria basado en la mecánica de "Simon Says" aplicada sobre un tablero de ajedrez con estética neón retro-futurista.

### 1.2 Audiencia

- **Analistas Funcionales**: Entender reglas de negocio y flujos del juego
- **Desarrolladores**: Implementar funcionalidades según especificaciones
- **QA/Testers**: Validar funcionalidad y crear casos de prueba
- **Stakeholders/Cliente**: Revisar y aprobar funcionalidades
- **Diseñadores UX/UI**: Comprender experiencia esperada del usuario

### 1.3 Referencias

- Documento de Diseño: `DESIGN.md`
- Changelog: `CHANGELOG.md`
- Mejoras Planificadas: `MEJORAS_PLANIFICADAS.md`
- Código fuente: `game.js`, `levels.js`, `audio.js`

---

## 2. ALCANCE DEL PROYECTO

### 2.1 Objetivos

1. **Entrenamiento de Memoria**: Mejorar memoria secuencial y visualización espacial
2. **Aprendizaje de Coordenadas**: Familiarizar con notación algebraica del ajedrez
3. **Experiencia Gamificada**: Sistema de puntuación, rachas y records
4. **Accesibilidad**: Funcional en desktop y mobile sin instalación

### 2.2 Límites del Sistema

**Incluido:**
- ✅ Modo de juego single-player
- ✅ 10 niveles predefinidos + modo infinito
- ✅ Sistema de vidas (5 vidas)
- ✅ Sistema de puntuación avanzado (speed bonus, perfect streaks)
- ✅ Persistencia de high scores (localStorage)
- ✅ Audio sintético (Web Audio API)
- ✅ Responsive design (mobile + desktop)
- ✅ Toggle de coordenadas y sonido
- ✅ Sistema HINT visual avanzado (v2.0):
  - Coordenadas neón en casillas de secuencia
  - Flechas direccionales grandes y pulsantes
  - Líneas conectoras negras entre casillas
  - Símbolo de repetición (⟲) para casillas duplicadas
  - Borde amarillo pulsante en siguiente casilla
  - Costo: -100 pts y pérdida de racha perfecta
  - Validación: requiere score >= 100 pts

**No Incluido (fuera de alcance v2.0):**
- ❌ Multiplayer / modo competitivo
- ❌ Servidor backend / base de datos
- ❌ Sistema de cuentas de usuario
- ❌ Leaderboard global
- ❌ Monetización / compras in-app
- ❌ Modo offline con PWA

---

## 3. DESCRIPCIÓN GENERAL

### 3.1 Concepto del Juego

**Master Sequence** es un juego de memoria tipo "Simon Says" donde:
1. El sistema muestra una secuencia de casillas iluminadas en un tablero de ajedrez
2. Cada casilla tiene un color neón único
3. El jugador debe repetir la secuencia en el mismo orden
4. La secuencia es **acumulativa**: cada nivel agrega una casilla más
5. Los movimientos siguen patrones de **rey o caballo** del ajedrez

### 3.2 Flujo Principal del Juego

```
[Pantalla Principal]
      ↓
[Presiona PLAY/COMENZAR]
      ↓
[Nivel N: Mostrar Secuencia]
      ↓
[Jugador Repite Secuencia]
      ↓
   ¿Correcto?
      ├─ SÍ → [Nivel N+1] (loop)
      └─ NO → [Pierde 1 vida]
               ↓
            ¿Vidas > 0?
               ├─ SÍ → [Reintentar mismo nivel]
               └─ NO → [Game Over]
```

---

## 4. REQUERIMIENTOS FUNCIONALES

### RF-001: Generación de Secuencia Acumulativa

**Prioridad:** Alta
**Módulo:** Generación de Niveles

**Descripción:**
El sistema debe generar una secuencia acumulativa de casillas que crece en cada nivel.

**Criterios:**
- Nivel 1: 1 casilla
- Nivel 2: 2 casillas (la del nivel 1 + 1 nueva)
- Nivel N: N casillas
- Cada nueva casilla debe ser alcanzable desde la anterior mediante movimiento de **rey** (1 casilla adyacente) o **caballo** (movimiento en L)

**Reglas de Negocio:**
- RN-001: Máximo 2 usos por casilla en toda la partida
- RN-002: Movimientos válidos según patrón rey/caballo
- RN-003: Área restringida según configuración del nivel

**Tests:**
```
TC-001: Nivel 1 genera 1 casilla
TC-002: Nivel 5 genera 5 casillas acumulativas
TC-003: Nueva casilla es alcanzable desde la anterior
TC-004: Casilla no se usa más de 2 veces en toda la partida
```

---

### RF-002: Visualización de Secuencia

**Prioridad:** Alta
**Módulo:** Interfaz de Usuario

**Descripción:**
El sistema debe mostrar la secuencia de casillas con efectos visuales y auditivos.

**Criterios:**
- Cada casilla se ilumina con un color neón específico
- Duración de highlight configurable por nivel
- Pausa entre casillas configurable por nivel
- Sonido beep sincronizado con highlight
- No se permite interacción durante la visualización

**Colores Disponibles:**
1. Cyan (#00ffff)
2. Magenta (#ff0080)
3. Green (#00ff80)
4. Orange (#ff8000)
5. Purple (#8000ff)
6. Yellow (#ffff00)
7. Pink (#ff0040)
8. Lime (#80ff00)

**Tests:**
```
TC-005: Secuencia se muestra completa sin interrupciones
TC-006: Cada casilla tiene color único asignado
TC-007: Sonido se reproduce sincronizado con visual
TC-008: Tablero está deshabilitado durante visualización
```

---

### RF-003: Entrada del Jugador

**Prioridad:** Alta
**Módulo:** Interacción

**Descripción:**
El jugador debe poder hacer clic en las casillas para reproducir la secuencia.

**Criterios:**
- Click en casilla registra la entrada
- Feedback visual inmediato (highlight con mismo color)
- Validación en tiempo real contra secuencia esperada
- Contador de progreso visible (X/N completadas)

**Flujo:**
```
1. Jugador hace click en casilla
2. Sistema valida si es la casilla correcta en el orden
3. SI es correcta:
   - Ilumina con el color original
   - Reproduce sonido de éxito
   - Incrementa contador
4. SI es incorrecta:
   - Ilumina en rojo
   - Reproduce sonido de error
   - Pierde 1 vida
   - Muestra overlay de fallo
```

**Tests:**
```
TC-009: Click en casilla correcta avanza progreso
TC-010: Click en casilla incorrecta resta vida
TC-011: Completar secuencia dispara evento de nivel completado
TC-012: No se puede hacer click durante visualización
```

---

### RF-004: Sistema de Vidas

**Prioridad:** Alta
**Módulo:** Gestión de Estado

**Descripción:**
El jugador tiene 5 vidas. Al perder todas, termina el juego.

**Criterios:**
- Jugador inicia con 5 vidas (❤️❤️❤️❤️❤️)
- Cada error resta 1 vida
- Vidas se muestran como corazones en UI
- Game Over cuando vidas = 0

**Estados de Vida:**
- 5 vidas: ❤️❤️❤️❤️❤️
- 3 vidas: ❤️❤️❤️🖤🖤
- 1 vida: ❤️🖤🖤🖤🖤
- 0 vidas: 🖤🖤🖤🖤🖤 → Game Over

**Tests:**
```
TC-013: Jugador inicia con 5 vidas
TC-014: Error resta 1 vida
TC-015: Perder última vida dispara Game Over
TC-016: Vidas se actualizan en UI correctamente
```

---

### RF-005: Sistema de Puntuación Avanzado

**Prioridad:** Media
**Módulo:** Scoring

**Descripción:**
Sistema de puntuación con bonus por velocidad y rachas perfectas.

**Fórmula:**
```
Puntos Finales = (Puntos Base + Speed Bonus) × Streak Multiplier

Puntos Base:
- Nivel N perfecto: N × 15 pts
- Nivel N con errores: N × 10 pts

Speed Bonus:
- < 50% tiempo recomendado: +100 pts
- < 75% tiempo recomendado: +50 pts
- < 100% tiempo recomendado: +25 pts
- > 100%: 0 pts

Streak Multiplier:
- 3-4 perfectos: x1.5
- 5-9 perfectos: x2.0
- 10+ perfectos: x3.0
```

**Tiempo Recomendado:**
```javascript
T_rec = 2000ms + (sequenceLength × 1500ms)
```

**Tests:**
```
TC-017: Puntos base calculados correctamente
TC-018: Speed bonus aplicado según tiempo
TC-019: Streak multiplier se aplica correctamente
TC-020: Fórmula completa calcula puntos finales
```

---

### RF-006: Perfect Streak (Rachas Perfectas)

**Prioridad:** Media
**Módulo:** Scoring

**Descripción:**
Contador de niveles completados sin errores consecutivos.

**Criterios:**
- Incrementa en 1 si nivel completado sin errores (first try)
- Resetea a 0 si comete algún error
- Visible en UI solo si streak ≥ 3
- Aplica multiplicador a puntos

**Visualización:**
- 3 perfectos: "3🔥" (Multiplier x1.5)
- 5 perfectos: "5🔥" (Multiplier x2.0)
- 10 perfectos: "10🔥" (Multiplier x3.0)

**Tests:**
```
TC-021: Streak incrementa en nivel perfecto
TC-022: Streak resetea en error
TC-023: Stat visible solo si ≥ 3
TC-024: Multiplicador se aplica correctamente
```

---

### RF-007: High Scores (Persistencia)

**Prioridad:** Media
**Módulo:** Almacenamiento

**Descripción:**
Guardar mejores marcas del jugador en localStorage.

**Datos Persistidos:**
```javascript
{
  topScore: 0,              // Mejor puntuación histórica
  bestLevel: 1,             // Nivel máximo alcanzado
  longestStreak: 0,         // Racha perfecta más larga
  fastestLevel: {           // Nivel más rápido
    level: 1,
    time: 999999
  },
  lastUpdated: timestamp    // Última actualización
}
```

**Key localStorage:** `masterSequence_highScores`

**Tests:**
```
TC-025: High scores se guardan en localStorage
TC-026: High scores se cargan al iniciar
TC-027: Nuevo record actualiza y guarda
TC-028: Resetear high scores funciona
```

---

### RF-008: Toggle de Coordenadas

**Prioridad:** Baja
**Módulo:** Ayudas Visuales

**Descripción:**
Botón para mostrar/ocultar coordenadas dentro de las casillas.

**Criterios:**
- Botón "SHOW COORDINATES" / "HIDE COORDINATES"
- Mobile: Botón naranja arriba del tablero
- Desktop: En sidebar púrpura
- Estado persiste en localStorage
- Coordenadas con fondo oscuro + glow neón

**Key localStorage:** `coordinate_sequence_coordinates`

**Tests:**
```
TC-029: Toggle muestra/oculta coordenadas
TC-030: Estado persiste entre sesiones
TC-031: Botón cambia texto según estado
TC-032: Coordenadas legibles en todas las casillas
```

---

### RF-009: Toggle de Sonido

**Prioridad:** Baja
**Módulo:** Audio

**Descripción:**
Botón para activar/desactivar efectos de sonido.

**Criterios:**
- Botón en header con icono de speaker
- Estados: ON (ondas visibles) / OFF (X sobre speaker)
- Estado persiste en localStorage
- Afecta todos los sonidos del juego

**Sonidos del Sistema:**
- Beep durante secuencia
- Sonido de éxito (correct)
- Sonido de error (incorrect)
- Sonido de nivel completado
- Sonido de game over

**Key localStorage:** `coordinate_sequence_sound`

**Tests:**
```
TC-033: Toggle activa/desactiva sonidos
TC-034: Estado persiste entre sesiones
TC-035: Icono cambia según estado
TC-036: Sonidos no se reproducen cuando OFF
```

---

### RF-010: Overlays de Estado

**Prioridad:** Alta
**Módulo:** UI

**Descripción:**
Pantallas modales para comunicar estados del juego.

**Overlays Requeridos:**

#### 1. Success (Nivel Completado - No Modal)
- Sin overlay disruptivo
- Confeti neón (30 partículas)
- Sonido de victoria
- Auto-avance a siguiente nivel (1.5s)

#### 2. Fail Overlay (Error)
- Icono: ❌
- Título: "¡Secuencia Incorrecta!"
- Mensaje: "Te quedan X vidas"
- Secuencia correcta mostrada
- Botón: "🔄 Reintentar"

#### 3. Game Over Overlay
- Icono: 💀
- Título: "Game Over"
- Stats finales: Nivel alcanzado, Score total
- Botones:
  - "🔄 Jugar de Nuevo" (reinicia automáticamente)
  - "🏠 Volver al Inicio" (vuelve a pantalla principal sin empezar)

**Tests:**
```
TC-037: Confeti aparece al completar nivel
TC-038: Fail overlay muestra vidas restantes
TC-039: Game Over muestra stats finales
TC-040: Botones de overlays ejecutan acción correcta
```

---

### RF-011: Responsive Design

**Prioridad:** Alta
**Módulo:** UI/Layout

**Descripción:**
Juego funcional en diferentes tamaños de pantalla.

**Breakpoints:**
- **Mobile**: < 900px
- **Desktop**: ≥ 900px

**Layout Mobile:**
```
[Header - Botones en línea]
[Título + Logo]
[Stats: Vidas | Longitud | Score | Best]
[Botón Coordenadas (naranja)]
[Tablero Centrado]
[Status Message]
[How to Play]
```

**Layout Desktop:**
```
[Header - Botones en línea]
[Título + Logo]
[Stats: Vidas | Longitud | Score | Racha | Best]
[Wrapper Centrado]
  [Tablero (centro)] [Sidebar Púrpura (derecha)]
[Status Message]
[How to Play]
```

**Tests:**
```
TC-041: Layout mobile se muestra correctamente
TC-042: Layout desktop se muestra correctamente
TC-043: Tablero centrado en ambos tamaños
TC-044: Botones accesibles en mobile
```

---

### RF-012: Configuración de Niveles

**Prioridad:** Alta
**Módulo:** Niveles

**Descripción:**
Sistema configurable de niveles con dificultad progresiva.

**Parámetros por Nivel:**
```javascript
{
  sequenceLength: 3,        // Casillas a agregar
  restrictedArea: 'ring',   // Área permitida
  highlightDuration: 600,   // ms de highlight
  pauseDuration: 400,       // ms entre casillas
  useColors: true           // Usar colores neón
}
```

**Tipos de Áreas Restringidas:**
- `ring`: Anillo de NxN casillas desde el centro
- `quadrant`: Cuadrante del tablero
- `rows`: Filas específicas
- `files`: Columnas específicas
- `all`: Tablero completo (64 casillas)

**Niveles Predefinidos:** 10 niveles
**Modo Infinito:** Nivel 11+

**Tests:**
```
TC-045: Nivel 1 tiene configuración correcta
TC-046: Dificultad incrementa progresivamente
TC-047: Modo infinito funciona después de nivel 10
TC-048: Área restringida se aplica correctamente
```

---

## 5. REQUERIMIENTOS NO FUNCIONALES

### RNF-001: Rendimiento

**Criterio:** Animaciones a 60fps sin drops

**Métricas:**
- Tiempo de carga inicial: < 2s
- Respuesta a click: < 50ms
- Animación de highlight: smooth 60fps
- Transiciones de overlay: < 300ms

**Tests:**
```
TNF-001: Lighthouse Performance Score > 90
TNF-002: No frame drops durante animaciones
TNF-003: Click response time < 50ms
```

---

### RNF-002: Compatibilidad

**Navegadores Soportados:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Dispositivos:**
- Desktop: 1280x720 mínimo
- Tablet: 768x1024
- Mobile: 375x667 mínimo

**Tests:**
```
TNF-004: Funciona en Chrome latest
TNF-005: Funciona en Firefox latest
TNF-006: Funciona en Safari iOS
TNF-007: Funciona en mobile Android
```

---

### RNF-003: Accesibilidad

**Criterios:**
- Contraste mínimo: WCAG AA (4.5:1)
- Navegación por teclado: Soportada
- Screen readers: ARIA labels
- Colores no son única forma de información

**Tests:**
```
TNF-008: Contraste pasa WCAG AA
TNF-009: Navegable con teclado
TNF-010: ARIA labels presentes
```

---

### RNF-004: Usabilidad

**Criterios:**
- Feedback inmediato a todas las acciones
- Tiempo de aprendizaje: < 2 minutos
- Mensajes de error claros
- Ayuda contextual disponible

**Tests:**
```
TNF-011: Usuario nuevo completa nivel 1 sin ayuda
TNF-012: Mensajes de error son comprensibles
TNF-013: Tutorial es suficiente para empezar
```

---

### RNF-005: Mantenibilidad

**Criterios:**
- Código modular y documentado
- Separación de responsabilidades
- Nombres de variables descriptivos
- Funciones < 50 líneas

**Estructura:**
```
game.js       - Lógica principal
levels.js     - Configuración de niveles
audio.js      - Sistema de audio
styles.css    - Estilos y animaciones
```

---

## 6. CASOS DE USO

### CU-001: Iniciar Juego

**Actor:** Jugador
**Precondición:** Usuario está en la pantalla principal
**Postcondición:** Nivel 1 inicia y muestra primera secuencia

**Flujo Principal:**
1. Usuario hace clic en botón "COMENZAR" o botón PLAY central
2. Sistema oculta botón PLAY
3. Sistema genera secuencia inicial (1 casilla)
4. Sistema muestra secuencia con efectos visuales/sonoros
5. Sistema habilita tablero para entrada del jugador
6. Sistema actualiza mensaje de estado: "¡Ahora repite la secuencia!"

**Flujos Alternativos:**
- FA-001: Si ya hay un juego en curso, confirmar reinicio

**Criterios de Aceptación:**
- ✅ Secuencia se muestra completa
- ✅ Tablero está habilitado después de visualización
- ✅ Stats iniciales visibles (5❤️, Longitud: 1, Score: 0)

---

### CU-002: Completar Nivel Perfectamente

**Actor:** Jugador
**Precondición:** Secuencia mostrada, tablero habilitado
**Postcondición:** Avanza al siguiente nivel

**Flujo Principal:**
1. Jugador hace clic en las casillas en el orden correcto
2. Sistema valida cada casilla
3. Sistema ilumina con color original si es correcta
4. Sistema incrementa contador de progreso
5. Al completar toda la secuencia:
   - Calcula puntos (base + speed bonus)
   - Incrementa perfect streak
   - Aplica streak multiplier
   - Actualiza high scores si corresponde
   - Muestra confeti
   - Reproduce sonido de victoria
6. Después de 1.5s, avanza al siguiente nivel automáticamente

**Flujos Alternativos:**
- FA-002: Si es nuevo record, mostrar mensaje especial en consola

**Criterios de Aceptación:**
- ✅ Puntos calculados correctamente
- ✅ Perfect streak incrementado
- ✅ High scores actualizados si aplica
- ✅ Siguiente nivel se carga automáticamente

---

### CU-003: Cometer Error

**Actor:** Jugador
**Precondición:** Secuencia mostrada, tablero habilitado
**Postcondición:** Pierde 1 vida, puede reintentar

**Flujo Principal:**
1. Jugador hace clic en casilla incorrecta
2. Sistema ilumina casilla en rojo
3. Sistema reproduce sonido de error
4. Sistema resta 1 vida
5. Sistema resetea perfect streak a 0
6. Sistema deshabilita tablero
7. Sistema muestra overlay de error con:
   - Vidas restantes
   - Secuencia correcta
   - Botón "Reintentar"
8. Usuario hace clic en "Reintentar"
9. Sistema oculta overlay
10. Sistema muestra secuencia nuevamente

**Flujos Alternativos:**
- FA-003: Si vidas = 0, ir a Game Over (CU-004)

**Criterios de Aceptación:**
- ✅ Vida se resta correctamente
- ✅ Perfect streak reseteado
- ✅ Overlay muestra información correcta
- ✅ Reintentar funciona correctamente

---

### CU-004: Game Over

**Actor:** Jugador
**Precondición:** Vidas = 0
**Postcondición:** Juego termina, muestra estadísticas finales

**Flujo Principal:**
1. Sistema detecta vidas = 0
2. Sistema deshabilita tablero
3. Sistema reproduce sonido de game over
4. Sistema muestra overlay de Game Over con:
   - Nivel alcanzado
   - Score total
   - Botón "Jugar de Nuevo"
   - Botón "Volver al Inicio"
5. Usuario elige una opción

**Flujo Alternativo A - Jugar de Nuevo:**
1. Sistema oculta overlay
2. Sistema reinicia juego automáticamente (CU-001)

**Flujo Alternativo B - Volver al Inicio:**
1. Sistema oculta overlay
2. Sistema resetea estado a valores iniciales
3. Sistema muestra botón PLAY
4. Sistema NO inicia juego (usuario decide cuándo)
5. Usuario puede:
   - Leer instrucciones
   - Ver sus high scores
   - Decidir cuándo empezar nuevo juego

**Criterios de Aceptación:**
- ✅ Stats finales correctas
- ✅ Ambos botones funcionan correctamente
- ✅ "Jugar de Nuevo" reinicia automáticamente
- ✅ "Volver al Inicio" NO inicia automáticamente

---

### CU-005: Ver High Scores

**Actor:** Jugador
**Precondición:** Juego cargado
**Postcondición:** Usuario ve sus mejores marcas

**Flujo Principal (v1.2):**
1. Sistema carga high scores de localStorage al iniciar
2. "BEST" score visible en stats permanentemente
3. Perfect streak visible si ≥ 3
4. Logs en consola cuando rompe record

**Flujo Futuro (v2.0):**
1. Usuario hace clic en botón "STATS"
2. Sistema abre overlay con todos los records
3. Usuario puede ver todos sus logros
4. Usuario puede resetear stats

**Criterios de Aceptación:**
- ✅ High scores se cargan al iniciar
- ✅ BEST score visible en UI
- ✅ Records persisten entre sesiones

---

### CU-006: Toggle Coordenadas

**Actor:** Jugador
**Precondición:** Juego iniciado
**Postcondición:** Coordenadas mostradas/ocultas

**Flujo Principal:**
1. Usuario hace clic en botón "SHOW COORDINATES"
2. Sistema muestra coordenadas dentro de todas las casillas
3. Sistema cambia texto a "HIDE COORDINATES"
4. Sistema guarda preferencia en localStorage
5. Usuario hace clic nuevamente
6. Sistema oculta coordenadas
7. Sistema cambia texto a "SHOW COORDINATES"

**Criterios de Aceptación:**
- ✅ Coordenadas se muestran/ocultan correctamente
- ✅ Botón cambia texto según estado
- ✅ Preferencia persiste entre sesiones

---

### CU-007: Toggle Sonido

**Actor:** Jugador
**Precondición:** Juego cargado
**Postcondición:** Sonidos activados/desactivados

**Flujo Principal:**
1. Usuario hace clic en botón de sonido
2. Sistema cambia estado de sonido
3. Sistema actualiza icono (speaker con/sin X)
4. Sistema guarda preferencia en localStorage
5. Sonidos se reproducen o no según estado

**Criterios de Aceptación:**
- ✅ Sonidos se activan/desactivan correctamente
- ✅ Icono refleja estado actual
- ✅ Preferencia persiste entre sesiones

---

## 7. REGLAS DE NEGOCIO

### RN-001: Límite de Uso por Casilla

**Descripción:** Ninguna casilla puede aparecer más de 2 veces en toda la partida.

**Justificación:** Evitar monotonía y aprovechar todo el tablero.

**Implementación:**
```javascript
squareUsageCount[square] <= 2
```

**Excepción:** Ninguna

---

### RN-002: Movimientos Válidos

**Descripción:** Cada nueva casilla debe ser alcanzable desde la anterior mediante movimiento de rey o caballo.

**Movimiento Rey:**
- 1 casilla en cualquier dirección (8 opciones)
- Distancia Chebyshev = 1

**Movimiento Caballo:**
- Movimiento en L (8 posiciones posibles)
- (±1, ±2) o (±2, ±1)

**Implementación:**
```javascript
isKingMove(from, to) || isKnightMove(from, to)
```

---

### RN-003: Área Restringida

**Descripción:** Nuevas casillas deben estar dentro del área permitida por el nivel.

**Tipos de Área:**
- Ring: Anillo desde el centro
- Quadrant: Cuadrante específico
- Rows: Filas específicas
- Files: Columnas específicas
- All: Sin restricción

**Implementación:**
```javascript
isWithinArea(square, areaConfig)
```

---

### RN-004: Cálculo de Puntos Base

**Descripción:** Puntos dependen del nivel y si fue perfecto.

**Fórmula:**
```
Perfecto: nivel × 15
Con errores: nivel × 10
```

**Ejemplo:**
- Nivel 5 perfecto: 75 pts
- Nivel 5 con error: 50 pts

---

### RN-005: Speed Bonus

**Descripción:** Bonus por completar nivel rápido.

**Rangos:**
```
< 50% tiempo: +100 pts
< 75% tiempo: +50 pts
< 100% tiempo: +25 pts
> 100%: 0 pts
```

**Tiempo Recomendado:**
```
T = 2s + (longitud_secuencia × 1.5s)
```

---

### RN-006: Streak Multiplier

**Descripción:** Multiplicador por niveles perfectos consecutivos.

**Tabla:**
| Streak | Multiplier |
|--------|------------|
| 0-2    | x1.0       |
| 3-4    | x1.5       |
| 5-9    | x2.0       |
| 10+    | x3.0       |

**Reset:** Al cometer cualquier error

---

### RN-007: High Scores

**Descripción:** Se guarda el mejor valor de cada categoría.

**Categorías:**
1. Top Score (puntuación más alta)
2. Best Level (nivel máximo alcanzado)
3. Longest Streak (racha perfecta más larga)
4. Fastest Level (nivel completado más rápido)

**Actualización:** Solo si nuevo valor > valor guardado

---

### RN-008: Persistencia

**Descripción:** Datos que persisten entre sesiones.

**Datos Persistidos:**
- High scores (masterSequence_highScores)
- Preferencia de sonido (coordinate_sequence_sound)
- Preferencia de coordenadas (coordinate_sequence_coordinates)

**Storage:** localStorage

---

## 8. INTERFAZ DE USUARIO

### 8.1 Componentes Principales

#### Header
```
[🏠 HOME] [▶ COMENZAR] [🔊 SONIDO]
```

#### Título
```
[🟪🟨🟦 Master Sequence]
Watch, remember, repeat. Master the pattern!
```

#### Stats
```
Mobile:
[VIDAS: ❤️❤️❤️❤️❤️] [LONGITUD: 8] [SCORE: 1443] [BEST: 1443]

Desktop:
[VIDAS: ❤️❤️❤️❤️❤️] [LONGITUD: 8] [SCORE: 1443] [RACHA: 7🔥] [BEST: 1443]
```

#### Tablero
```
┌─────────────────┐
│  8x8 Chessboard │
│  64 squares     │
│  Neon colors    │
└─────────────────┘
```

#### Status Message
```
[Presiona COMENZAR para iniciar]
[¡Ahora repite la secuencia!]
```

---

### 8.2 Paleta de Colores

**Colores Primarios:**
```css
--neon-cyan: #00ffff
--neon-magenta: #ff0080
--neon-green: #00ff80
--neon-orange: #ff8000
--neon-purple: #8000ff
--neon-yellow: #ffff00
--neon-pink: #ff0040
--neon-lime: #80ff00
```

**Colores UI:**
```css
--bg-dark: #0a0a0a
--text-light: #ffffff
--border-glow: rgba(0, 255, 255, 0.5)
```

---

### 8.3 Tipografía

**Fuente Principal:** Orbitron (Google Fonts)
- Títulos: 900 weight
- Labels: 700 weight
- Texto: 400 weight

**Tamaños:**
- H1: clamp(1.5rem, 5vw, 3rem)
- Stats: clamp(1rem, 3vw, 1.5rem)
- Botones: 1rem

---

### 8.4 Animaciones

**Highlight Casilla:**
```css
Duration: 600ms (level dependent)
Effect: Scale + Glow + Color change
Easing: ease-in-out
```

**Confeti:**
```css
Particles: 30
Duration: 2s
Colors: All neon colors
Animation: Fall + rotate + fade
```

**Perfect Streak Badge:**
```css
Appearance: Slide in from top
Color: Fire gradient
Effect: Pulse on increment
```

---

## 9. MODELO DE DATOS

### 9.1 Estado del Juego (gameState)

```javascript
{
  // Progresión
  currentLevel: 1,              // Nivel actual
  score: 0,                     // Puntuación acumulada
  lives: 5,                     // Vidas restantes
  maxLives: 5,                  // Vidas máximas

  // Secuencia Acumulativa
  masterSequence: [],           // ['d4', 'd5', 'e5', ...]
  sequenceColors: [],           // [colorCyan, colorMagenta, ...]
  squareUsageCount: {},         // { 'd4': 2, 'd5': 1, ... }
  sequence: [],                 // Copia de masterSequence
  playerSequence: [],           // Input del jugador
  currentStep: 0,               // Paso actual en reproducción

  // Fase
  phase: 'idle',                // idle | showing | playing | success | fail | gameover

  // Configuración
  soundEnabled: true,           // Toggle sonido
  coordinatesEnabled: false,    // Toggle coordenadas

  // Estadísticas
  bestLevel: 1,                 // Mejor nivel en sesión actual
  totalAttempts: 0,             // Intentos totales
  perfectLevels: 0,             // Niveles perfectos totales
  currentLevelAttempts: 0,      // Intentos del nivel actual

  // Sistema de Puntuación
  levelStartTime: 0,            // Timestamp inicio nivel
  levelEndTime: 0,              // Timestamp fin nivel
  perfectStreak: 0,             // Racha perfecta actual

  // High Scores (persistido)
  highScores: {
    topScore: 0,
    bestLevel: 1,
    longestStreak: 0,
    fastestLevel: {
      level: 1,
      time: 999999
    },
    lastUpdated: null
  }
}
```

---

### 9.2 Configuración de Nivel (levelConfig)

```javascript
{
  sequenceLength: 3,            // Casillas a agregar
  restrictedArea: {             // Área permitida
    type: 'ring',               // ring | quadrant | rows | files | all
    size: 4,                    // Tamaño del área
    params: {}                  // Parámetros específicos
  },
  highlightDuration: 600,       // ms de highlight
  pauseDuration: 400,           // ms entre casillas
  useColors: true               // Usar colores neón
}
```

---

### 9.3 Estructura localStorage

**Key:** `masterSequence_highScores`

```json
{
  "topScore": 1443,
  "bestLevel": 7,
  "longestStreak": 7,
  "fastestLevel": {
    "level": 3,
    "time": 1430
  },
  "lastUpdated": 1729123456789
}
```

**Key:** `coordinate_sequence_sound`
```
Value: "enabled" | "disabled"
```

**Key:** `coordinate_sequence_coordinates`
```
Value: "enabled" | "disabled"
```

---

## 10. MATRIZ DE TRAZABILIDAD

| ID | Requerimiento | CU | RN | Tests |
|----|--------------|----|----|-------|
| RF-001 | Generación de Secuencia | CU-001, CU-002 | RN-001, RN-002, RN-003 | TC-001 a TC-004 |
| RF-002 | Visualización | CU-001, CU-002, CU-003 | - | TC-005 a TC-008 |
| RF-003 | Entrada Jugador | CU-002, CU-003 | - | TC-009 a TC-012 |
| RF-004 | Sistema Vidas | CU-003, CU-004 | - | TC-013 a TC-016 |
| RF-005 | Puntuación | CU-002 | RN-004, RN-005, RN-006 | TC-017 a TC-020 |
| RF-006 | Perfect Streak | CU-002, CU-003 | RN-006 | TC-021 a TC-024 |
| RF-007 | High Scores | CU-002, CU-005 | RN-007, RN-008 | TC-025 a TC-028 |
| RF-008 | Toggle Coords | CU-006 | RN-008 | TC-029 a TC-032 |
| RF-009 | Toggle Sonido | CU-007 | RN-008 | TC-033 a TC-036 |
| RF-010 | Overlays | CU-002, CU-003, CU-004 | - | TC-037 a TC-040 |
| RF-011 | Responsive | Todos | - | TC-041 a TC-044 |
| RF-012 | Niveles | CU-001, CU-002 | RN-003 | TC-045 a TC-048 |

---

## 11. CRITERIOS DE ACEPTACIÓN

### Criterios Generales

✅ **CA-001:** Jugador puede completar nivel 1 sin errores
✅ **CA-002:** Sistema muestra feedback visual en todas las interacciones
✅ **CA-003:** Puntuación se calcula correctamente según fórmula
✅ **CA-004:** High scores persisten entre sesiones
✅ **CA-005:** Juego es responsive en mobile y desktop
✅ **CA-006:** Animaciones son fluidas (60fps)
✅ **CA-007:** Sonidos son opcionales (toggle funciona)
✅ **CA-008:** Coordenadas son opcionales (toggle funciona)
✅ **CA-009:** Game Over muestra stats correctos
✅ **CA-010:** Modo infinito funciona después de nivel 10

### Criterios de Calidad

✅ **CC-001:** Lighthouse Performance > 90
✅ **CC-002:** Lighthouse Accessibility > 90
✅ **CC-003:** Lighthouse Best Practices > 90
✅ **CC-004:** Lighthouse SEO > 90
✅ **CC-005:** Sin errores en consola
✅ **CC-006:** Sin warnings de performance
✅ **CC-007:** Compatible con navegadores target
✅ **CC-008:** Touch funciona en mobile

---

## 12. MEJORAS FUTURAS

> 💡 **Esta sección es tu roadmap de desarrollo.** Cada mejora está priorizada y estimada. Puedes implementarlas en el orden que prefieras según las necesidades del proyecto.

### 12.1 Sistema de Puntuación - FASE 2 🏆

**Prioridad:** ⭐⭐⭐ Alta
**Estimación:** 8 horas
**Dependencias:** Sistema de scoring actual (✅ Implementado)

---

#### MF-001: Stats Overlay Completo

**Descripción:** Panel modal con estadísticas detalladas del jugador.

**Funcionalidades:**
- Botón "📊 STATS" en header (junto a HOME, COMENZAR, SONIDO)
- Overlay modal que muestra:
  - 🏆 Top Score
  - 🎯 Best Level
  - 🔥 Longest Streak
  - ⚡ Fastest Level (nivel + tiempo)
  - 🎮 Total Games Played
  - 📊 Average Level Reached
  - 🎯 Accuracy % (aciertos/intentos totales)
- Botón "🗑️ Reset Stats" con confirmación
- Botón "✖ Cerrar"

**Mockup UI:**
```
┌────────────────────────────────────┐
│  📊 Records Personales         [✖] │
├────────────────────────────────────┤
│  🏆 Mejor Puntuación      1443     │
│  🎯 Nivel Máximo           7       │
│  🔥 Racha Más Larga        7       │
│  ⚡ Nivel Más Rápido   3 (1.43s)  │
│  🎮 Partidas Jugadas       12      │
│  📊 Nivel Promedio         4.5     │
│  🎯 Precisión            87.5%     │
├────────────────────────────────────┤
│  [🗑️ Resetear Records] [Cerrar]   │
└────────────────────────────────────┘
```

**Implementación:**
```javascript
// Agregar a gameState
sessionStats: {
  gamesPlayed: 0,
  totalAttempts: 0,
  successfulAttempts: 0,
  totalLevelsReached: 0
}

// Función para mostrar overlay
function showStatsOverlay() {
  const overlay = document.getElementById('statsOverlay');

  // Poblar datos
  document.getElementById('statsTopScore').textContent =
    gameState.highScores.topScore;

  // Calcular accuracy
  const accuracy = gameState.sessionStats.totalAttempts > 0
    ? (gameState.sessionStats.successfulAttempts /
       gameState.sessionStats.totalAttempts * 100).toFixed(1)
    : 0;

  overlay.classList.remove('hidden');
}
```

**Tests:**
```
TMF-001: Botón STATS abre overlay
TMF-002: Todas las estadísticas se muestran correctamente
TMF-003: Reset stats funciona y pide confirmación
TMF-004: Accuracy se calcula correctamente
TMF-005: Overlay se cierra correctamente
```

**Archivos a modificar:**
- `index.html`: Agregar overlay HTML
- `game.js`: Funciones de stats y tracking
- `styles.css`: Estilos del overlay

---

#### MF-002: Animaciones de Bonus

**Descripción:** Feedback visual cuando se ganan speed bonus o streak multipliers.

**Funcionalidades:**
- Popup "+100 Speed Bonus!" al completar nivel rápido
- Popup "🔥 Streak x5!" cuando alcanza nueva racha
- Animación: Fade in + slide up + fade out (1s)
- Color dorado para speed bonus
- Color fuego (gradient naranja-rojo) para streak

**Mockup:**
```
     ┌──────────────────┐
     │  ⚡ +100 SPEED   │
     │     BONUS!       │
     └──────────────────┘
          ↑ slide up
```

**Implementación:**
```javascript
function showBonusPopup(type, value) {
  const popup = document.createElement('div');
  popup.className = `bonus-popup ${type}`;

  if (type === 'speed') {
    popup.textContent = `⚡ +${value} SPEED BONUS!`;
  } else if (type === 'streak') {
    popup.textContent = `🔥 STREAK x${value}!`;
  }

  document.body.appendChild(popup);

  // Auto-remove después de animación
  setTimeout(() => popup.remove(), 1000);
}

// Llamar en onLevelComplete()
if (speedBonus > 0) {
  showBonusPopup('speed', speedBonus);
}
if (streakMultiplier > 1.0) {
  showBonusPopup('streak', gameState.perfectStreak);
}
```

**CSS:**
```css
.bonus-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: 900;
  padding: 1rem 2rem;
  border-radius: 12px;
  animation: bonusAppear 1s ease-out forwards;
  z-index: 9999;
  pointer-events: none;
}

.bonus-popup.speed {
  color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  border: 3px solid #FFD700;
  box-shadow: 0 0 30px #FFD700;
}

.bonus-popup.streak {
  background: linear-gradient(135deg, #ff6b00, #ff0000);
  color: white;
  box-shadow: 0 0 40px #ff6b00;
}

@keyframes bonusAppear {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -60%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -80%) scale(0.9);
  }
}
```

**Tests:**
```
TMF-006: Popup aparece cuando hay speed bonus
TMF-007: Popup aparece cuando hay nuevo streak
TMF-008: Animación es fluida
TMF-009: Texto muestra valor correcto
TMF-010: Popup se auto-elimina después de 1s
```

---

#### MF-003: Confeti Dorado para Records

**Descripción:** Confeti especial y mensaje cuando se rompe un record.

**Funcionalidades:**
- Confeti color dorado (#FFD700)
- 50 partículas (más que el normal de 30)
- Mensaje "🏆 NEW RECORD!" prominente
- Duración: 3s
- Se activa cuando `updateHighScores()` retorna `true`

**Implementación:**
```javascript
// Modificar onLevelComplete()
const isNewRecord = updateHighScores(timeElapsed);
if (isNewRecord) {
  console.log('🎊 ¡NUEVO RECORD!');
  launchGoldenConfetti(50);
  showRecordMessage();
}

// Nueva función
function launchGoldenConfetti(count) {
  const container = document.getElementById('confettiContainer');

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti golden';
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.animationDuration = `${2 + Math.random()}s`;

    container.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}

function showRecordMessage() {
  const msg = document.createElement('div');
  msg.className = 'record-message';
  msg.textContent = '🏆 NEW RECORD!';
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);
}
```

**CSS:**
```css
.confetti.golden {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  box-shadow: 0 0 10px #FFD700;
}

.record-message {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  font-weight: 900;
  color: #FFD700;
  text-shadow:
    0 0 20px #FFD700,
    0 0 40px #FFA500,
    2px 2px 4px rgba(0,0,0,0.8);
  animation: recordPulse 2s ease-out;
  z-index: 9999;
  pointer-events: none;
}

@keyframes recordPulse {
  0%, 100% {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
  10%, 90% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.1);
  }
}
```

**Tests:**
```
TMF-011: Confeti dorado aparece en nuevo record
TMF-012: Mensaje "NEW RECORD" visible
TMF-013: Cantidad de confeti es mayor (50)
TMF-014: Duración es 3s
```

---

### 12.2 Efectos Visuales - FASE 3 ✨

**Prioridad:** ⭐⭐ Media
**Estimación:** 12 horas
**Dependencias:** Ninguna

---

#### MF-004: Trail/Camino Animado

**Descripción:** Línea neón que conecta casillas durante la visualización de la secuencia.

**Funcionalidades:**
- SVG overlay sobre el tablero
- Línea desde casilla anterior a casilla actual
- Color matching con el highlight
- Animación stroke-dasharray (efecto dibujado)
- Fade out después de 500ms

**Implementación:**
```javascript
// Agregar SVG al tablero
function createTrailSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'trailOverlay';
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.pointerEvents = 'none';
  svg.style.zIndex = '10';

  document.getElementById('chessboard').appendChild(svg);
}

// Dibujar línea entre casillas
function drawTrail(fromSquare, toSquare, color) {
  const svg = document.getElementById('trailOverlay');
  const fromEl = document.querySelector(`[data-square="${fromSquare}"]`);
  const toEl = document.querySelector(`[data-square="${toSquare}"]`);

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  const x1 = fromRect.left + fromRect.width/2 - svgRect.left;
  const y1 = fromRect.top + fromRect.height/2 - svgRect.top;
  const x2 = toRect.left + toRect.width/2 - svgRect.left;
  const y2 = toRect.top + toRect.height/2 - svgRect.top;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', color.hex);
  line.setAttribute('stroke-width', '4');
  line.classList.add('trail-line');

  svg.appendChild(line);

  // Fade out después de 500ms
  setTimeout(() => {
    line.style.opacity = '0';
    setTimeout(() => line.remove(), 300);
  }, 500);
}

// Modificar showSequence() para llamar drawTrail
for (let i = 0; i < gameState.sequence.length; i++) {
  // ... código existente ...

  if (i > 0) {
    drawTrail(
      gameState.sequence[i-1],
      gameState.sequence[i],
      gameState.sequenceColors[i]
    );
  }
}
```

**CSS:**
```css
.trail-line {
  filter: drop-shadow(0 0 10px currentColor);
  stroke-dasharray: 10;
  stroke-linecap: round;
  opacity: 0.8;
  transition: opacity 0.3s ease-out;
  animation: trailDraw 0.3s ease-out;
}

@keyframes trailDraw {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}
```

**Tests:**
```
TMF-015: Trail aparece entre casillas consecutivas
TMF-016: Color coincide con highlight
TMF-017: Animación es fluida
TMF-018: Trail desaparece después de 500ms
```

---

#### MF-005: Partículas al Acertar

**Descripción:** Mini explosión de partículas cuando el jugador hace clic correcto.

**Funcionalidades:**
- 5 partículas pequeñas
- Color igual al highlight de la casilla
- Explotan desde el centro de la casilla
- Duración: 800ms
- Direcciones aleatorias

**Implementación:**
```javascript
function spawnParticles(squareElement, color, count = 5) {
  const rect = squareElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'success-particle';
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.background = color.hex;
    particle.style.boxShadow = `0 0 10px ${color.hex}`;

    // Ángulo aleatorio
    const angle = (Math.random() * Math.PI * 2);
    const distance = 30 + Math.random() * 40;

    particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 800);
  }
}

// Llamar en handleSquareClick() cuando isCorrect
if (isCorrect) {
  const color = gameState.sequenceColors[gameState.currentStep];
  highlightSquare(squareId, 500, color);
  spawnParticles(square, color, 5); // ← NUEVO

  // ... resto del código ...
}
```

**CSS:**
```css
.success-particle {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  animation: particleExplode 0.8s ease-out forwards;
}

@keyframes particleExplode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}
```

**Tests:**
```
TMF-019: Partículas aparecen en click correcto
TMF-020: Color correcto según casilla
TMF-021: No afecta performance (60fps mantenido)
TMF-022: Partículas se auto-eliminan
```

---

#### MF-006: Tablero Celebra

**Descripción:** Animación sutil del tablero completo al completar nivel.

**Funcionalidades:**
- Vibración suave (rotate ±0.5deg)
- Scale ligero (1.02)
- Duración: 500ms
- Se activa al completar nivel perfecto

**Implementación:**
```javascript
// En onLevelComplete(), después del confeti
document.getElementById('chessboard').classList.add('celebrate');
setTimeout(() => {
  document.getElementById('chessboard').classList.remove('celebrate');
}, 500);
```

**CSS:**
```css
.chessboard.celebrate {
  animation: celebrate 0.5s ease-in-out;
}

@keyframes celebrate {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.02) rotate(0.5deg);
  }
  50% {
    transform: scale(1.02) rotate(-0.5deg);
  }
  75% {
    transform: scale(1.02) rotate(0.5deg);
  }
}
```

**Tests:**
```
TMF-023: Tablero vibra al completar nivel
TMF-024: Animación dura 500ms
TMF-025: Tablero vuelve a posición original
```

---

### 12.3 Modos de Juego - FASE 4 🎮

**Prioridad:** ⭐⭐ Media
**Estimación:** 16 horas
**Dependencias:** Ninguna

---

#### MF-007: Modo Zen

**Descripción:** Modo práctica sin presión de vidas.

**Funcionalidades:**
- Sin sistema de vidas (vidas infinitas)
- No hay game over
- Reintentos ilimitados
- Ideal para aprender y practicar
- Selector de modo en pantalla inicial

**UI del Selector:**
```
┌──────────────────────────────────────┐
│  Selecciona Modo de Juego:           │
├──────────────────────────────────────┤
│  ⚔️  [NORMAL]    (5 vidas)           │
│  🧘 [ZEN]       (Sin vidas)          │
│  ⏱️  [TIMED]     (Contra reloj)      │
│  💪 [CHALLENGE] (Experto)            │
└──────────────────────────────────────┘
```

**Implementación:**
```javascript
// Agregar a gameState
gameMode: 'normal', // 'normal' | 'zen' | 'timed' | 'challenge'

// Modificar onLevelFailed()
function onLevelFailed() {
  console.log('💔 Level failed');

  gameState.phase = 'fail';

  // En modo Zen, no restar vidas
  if (gameState.gameMode !== 'zen') {
    gameState.lives--;
  }

  gameState.currentLevelAttempts++;
  gameState.perfectStreak = 0;
  disableBoard();
  updateUI();

  // En modo Zen, nunca hay game over
  if (gameState.gameMode !== 'zen' && gameState.lives === 0) {
    gameOver();
    return;
  }

  showFailOverlay();
}

// Función para seleccionar modo
function selectGameMode(mode) {
  gameState.gameMode = mode;
  localStorage.setItem('masterSequence_gameMode', mode);

  // Ajustar UI según modo
  if (mode === 'zen') {
    document.getElementById('livesDisplay').textContent = '∞';
  }
}
```

**Tests:**
```
TMF-026: Modo Zen no resta vidas
TMF-027: No hay game over en modo Zen
TMF-028: Selector de modo funciona
TMF-029: Modo persiste en localStorage
```

---

#### MF-008: Modo Tiempo (Contra Reloj)

**Descripción:** Completar niveles antes de que se acabe el tiempo global.

**Funcionalidades:**
- Timer global: 60s iniciales
- +10s por nivel completado
- Game over cuando tiempo = 0
- Timer visible en header con animación
- Barra de progreso de tiempo
- Sonido de alerta cuando quedan <10s

**UI:**
```
[Header]
[⏱️ 45.2s] ← Timer grande y visible
[████████████░░░░░] ← Barra de progreso
```

**Implementación:**
```javascript
// Agregar a gameState
timeRemaining: 60000, // 60s en ms
timerInterval: null,

// Iniciar timer
function startTimedMode() {
  gameState.timeRemaining = 60000;

  gameState.timerInterval = setInterval(() => {
    if (gameState.phase === 'playing' && gameState.gameMode === 'timed') {
      gameState.timeRemaining -= 100;

      if (gameState.timeRemaining <= 0) {
        clearInterval(gameState.timerInterval);
        gameOver('¡Se acabó el tiempo!');
      }

      updateTimerDisplay();

      // Alerta cuando quedan <10s
      if (gameState.timeRemaining <= 10000 && gameState.timeRemaining % 1000 < 100) {
        playBeep(880); // Sonido de alerta
      }
    }
  }, 100);
}

// Actualizar UI del timer
function updateTimerDisplay() {
  const seconds = (gameState.timeRemaining / 1000).toFixed(1);
  document.getElementById('timerDisplay').textContent = `⏱️ ${seconds}s`;

  // Barra de progreso
  const percent = (gameState.timeRemaining / 60000) * 100;
  document.getElementById('timerBar').style.width = `${percent}%`;

  // Color de alerta
  if (gameState.timeRemaining < 10000) {
    document.getElementById('timerDisplay').style.color = 'var(--neon-red)';
  }
}

// Bonus de tiempo al completar nivel
function onLevelComplete() {
  // ... código existente ...

  if (gameState.gameMode === 'timed') {
    gameState.timeRemaining += 10000; // +10s
    console.log('⏱️ +10s bonus!');
  }
}
```

**CSS:**
```css
#timerDisplay {
  font-size: 2rem;
  font-weight: 900;
  color: var(--neon-cyan);
  transition: color 0.3s;
}

#timerBar {
  width: 100%;
  height: 8px;
  background: var(--neon-cyan);
  transition: width 0.1s linear;
  box-shadow: 0 0 10px var(--neon-cyan);
}
```

**Tests:**
```
TMF-030: Timer cuenta regresivo correctamente
TMF-031: Bonus +10s se suma al completar nivel
TMF-032: Game over cuando tiempo = 0
TMF-033: Alerta suena cuando quedan <10s
TMF-034: Barra de progreso se actualiza
```

---

#### MF-009: Modo Desafío (Challenge)

**Descripción:** Secuencias extra largas desde el inicio para jugadores expertos.

**Funcionalidades:**
- Nivel 1 empieza con 5 casillas
- Cada nivel +2 casillas (en vez de +1)
- Solo 1 vida
- Sin reintentos
- Records separados

**Progresión:**
```
Nivel 1: 5 casillas
Nivel 2: 7 casillas
Nivel 3: 9 casillas
Nivel 4: 11 casillas
...
```

**Implementación:**
```javascript
// Modificar startLevel()
function startLevel(level) {
  console.log(`📊 Starting level ${level}...`);

  gameState.currentLevel = level;
  gameState.playerSequence = [];
  gameState.currentStep = 0;
  gameState.currentLevelAttempts = 0;

  // Ajustar vidas según modo
  if (gameState.gameMode === 'challenge' && level === 1) {
    gameState.lives = 1;
    gameState.maxLives = 1;
  }

  // Generar secuencia según modo
  let config = window.CoordinateSequence.Levels.getLevelConfig(level);

  if (gameState.gameMode === 'challenge') {
    config = { ...config };
    config.sequenceLength = 5 + ((level - 1) * 2); // 5, 7, 9, 11...
  }

  // ... resto del código ...
}
```

**Tests:**
```
TMF-035: Nivel 1 tiene 5 casillas en modo Challenge
TMF-036: Incrementa de 2 en 2
TMF-037: Solo 1 vida
TMF-038: Game over al primer error
```

---

### 12.4 Ayudas/Power-ups - FASE 5 💡

**Prioridad:** ⭐ Baja
**Estimación:** 10 horas
**Dependencias:** Ninguna

---

#### MF-010: Hint (Mostrar Próxima Casilla)

**Descripción:** Ilumina la siguiente casilla correcta cuando estás atorado.

**Funcionalidades:**
- 3 hints por partida
- Pulsa la casilla correcta 3 veces (intervalo 400ms)
- Resta 50 puntos
- Rompe racha perfecta
- Botón en sidebar: "💡 Hint (3)"

**Implementación:**
```javascript
// Agregar a gameState
hintsRemaining: 3,

// Función de hint
function useHint() {
  if (gameState.hintsRemaining <= 0) {
    console.log('❌ No quedan hints');
    return;
  }

  if (gameState.phase !== 'playing') {
    console.log('❌ Hint solo disponible durante input');
    return;
  }

  const nextSquare = gameState.sequence[gameState.currentStep];
  const color = gameState.sequenceColors[gameState.currentStep];

  console.log(`💡 Hint: La siguiente casilla es ${nextSquare}`);

  // Pulsar 3 veces
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      highlightSquare(nextSquare, 300, color);
      if (gameState.soundEnabled) {
        playBeep(880);
      }
    }, i * 400);
  }

  // Penalizaciones
  gameState.hintsRemaining--;
  gameState.score = Math.max(0, gameState.score - 50);
  gameState.perfectStreak = 0; // Rompe racha

  updateUI();
}
```

**UI:**
```html
<button class="btn-hint" id="btnHint">
  💡 <span id="hintCount">Hint (3)</span>
</button>
```

**Tests:**
```
TMF-039: Hint ilumina casilla correcta
TMF-040: Pulsa 3 veces
TMF-041: Contador decrementa
TMF-042: Resta 50 puntos
TMF-043: Rompe perfect streak
TMF-044: Deshabilitado cuando hints = 0
```

---

#### MF-011: Replay (Ver Secuencia de Nuevo)

**Descripción:** Volver a ver la secuencia durante la fase de input.

**Funcionalidades:**
- 2 replays por partida
- Resetea progreso del nivel actual
- No resta puntos
- No rompe streak (si no has cometido error aún)
- Botón: "🔄 Replay (2)"

**Implementación:**
```javascript
// Agregar a gameState
replaysRemaining: 2,

// Función replay
function useReplay() {
  if (gameState.replaysRemaining <= 0) {
    console.log('❌ No quedan replays');
    return;
  }

  if (gameState.phase !== 'playing') {
    console.log('❌ Replay solo disponible durante input');
    return;
  }

  console.log('🔄 Replay: Mostrando secuencia de nuevo');

  // Resetear progreso del nivel
  gameState.playerSequence = [];
  gameState.currentStep = 0;
  gameState.phase = 'showing';

  gameState.replaysRemaining--;
  updateUI();

  // Mostrar secuencia
  setTimeout(() => showSequence(), 500);
}
```

**Tests:**
```
TMF-045: Replay muestra secuencia de nuevo
TMF-046: Resetea progreso del nivel
TMF-047: Contador decrementa
TMF-048: No resta puntos
TMF-049: No rompe streak si no hubo error previo
```

---

#### MF-012: Slow Motion

**Descripción:** Visualización más lenta para niveles difíciles.

**Funcionalidades:**
- 1 uso por partida
- Duplica duración de highlight y pause
- Auto-activa después de 2 fallos consecutivos en un nivel
- Botón: "🐌 Slow Motion (1)"

**Implementación:**
```javascript
// Agregar a gameState
slowMotionAvailable: true,
slowMotionActive: false,

// Función slow motion
function useSlowMotion() {
  if (!gameState.slowMotionAvailable) {
    console.log('❌ Slow motion ya usado');
    return;
  }

  console.log('🐌 Slow Motion activado');
  gameState.slowMotionActive = true;
  gameState.slowMotionAvailable = false;
  updateUI();
}

// Modificar showSequence()
async function showSequence() {
  // ... código existente ...

  let highlightDuration = config.highlightDuration;
  let pauseDuration = config.pauseDuration;

  // Duplicar tiempos en slow motion
  if (gameState.slowMotionActive) {
    highlightDuration *= 2;
    pauseDuration *= 2;
  }

  // ... resto del código con los tiempos modificados ...

  // Resetear slow motion después de mostrar
  gameState.slowMotionActive = false;
}

// Auto-activar después de 2 fallos
function onLevelFailed() {
  // ... código existente ...

  if (gameState.currentLevelAttempts >= 2 && gameState.slowMotionAvailable) {
    console.log('🐌 Auto-activando Slow Motion...');
    useSlowMotion();
  }
}
```

**Tests:**
```
TMF-050: Slow motion duplica tiempos
TMF-051: Auto-activa después de 2 fallos
TMF-052: Solo 1 uso por partida
TMF-053: Botón se deshabilita después de usar
```

---

### 12.5 Audio Mejorado - FASE 6 🔊

**Prioridad:** ⭐ Baja
**Estimación:** 6 horas
**Dependencias:** Sistema de audio actual

---

#### MF-013: Notas Musicales por Color

**Descripción:** Cada color tiene una nota musical diferente, creando melodías.

**Mapping de Notas:**
```javascript
const COLOR_NOTES = {
  cyan:    261.63,  // C4 (Do)
  magenta: 293.66,  // D4 (Re)
  green:   329.63,  // E4 (Mi)
  orange:  349.23,  // F4 (Fa)
  purple:  392.00,  // G4 (Sol)
  yellow:  440.00,  // A4 (La)
  pink:    493.88,  // B4 (Si)
  lime:    523.25   // C5 (Do alto)
};
```

**Implementación:**
```javascript
// Modificar showSequence() en game.js
for (let i = 0; i < gameState.sequence.length; i++) {
  const square = gameState.sequence[i];
  const color = gameState.sequenceColors[i];

  await highlightSquare(square, highlightDuration, color);

  // Reproducir nota según color
  if (gameState.soundEnabled && typeof playNote === 'function') {
    const frequency = COLOR_NOTES[color.name];
    playNote(frequency, highlightDuration * 0.8);
  }

  // ... resto del código ...
}

// Agregar a audio.js
function playNote(frequency, duration) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine'; // Tono suave

  // Envelope (ataque y release)
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}
```

**Resultado:**
- Cada secuencia crea una melodía única
- Ayuda a la memoria auditiva
- Más musical e interesante

**Tests:**
```
TMF-054: Cada color reproduce nota diferente
TMF-055: Notas se sincronizan con highlights
TMF-056: Melodía es agradable al oído
TMF-057: Toggle de sonido afecta las notas
```

---

#### MF-014: Melodía de Victoria

**Descripción:** Arpeggio ascendente al completar nivel.

**Implementación:**
```javascript
// Agregar a audio.js
function playVictoryJingle() {
  const notes = [
    261.63,  // C4
    329.63,  // E4
    392.00,  // G4
    523.25   // C5
  ];

  notes.forEach((freq, i) => {
    setTimeout(() => {
      playNote(freq, 200);
    }, i * 150);
  });
}

// Llamar en onLevelComplete()
if (gameState.soundEnabled && typeof playVictoryJingle === 'function') {
  playVictoryJingle();
}
```

**Tests:**
```
TMF-058: Melodía se reproduce al completar nivel
TMF-059: Notas son Do-Mi-Sol-Do
TMF-060: Timing es correcto (150ms entre notas)
```

---

#### MF-015: Sonidos Rey vs Caballo

**Descripción:** Diferentes efectos según si el movimiento es de rey o caballo.

**Implementación:**
```javascript
// En showSequence(), después de highlight
if (i > 0 && gameState.soundEnabled) {
  const prevSquare = gameState.sequence[i - 1];
  const currSquare = gameState.sequence[i];

  const isKing = window.ChessGameLibrary.BoardUtils.isKingMove(prevSquare, currSquare);
  const isKnight = window.ChessGameLibrary.BoardUtils.isKnightMove(prevSquare, currSquare);

  if (isKing) {
    playNote(440, 100); // Tono corto (La)
  } else if (isKnight) {
    playNote(880, 100); // Tono alto, doble frecuencia (La alto)
  }
}
```

**Tests:**
```
TMF-061: Movimiento rey reproduce tono bajo
TMF-062: Movimiento caballo reproduce tono alto
TMF-063: Sonidos ayudan a identificar tipo de movimiento
```

---

### 12.6 Tutorial Interactivo - FASE 7 📚

**Prioridad:** ⭐ Baja
**Estimación:** 8 horas
**Dependencias:** Ninguna

---

#### MF-016: Tutorial Paso a Paso

**Descripción:** Guía interactiva para jugadores nuevos.

**Pasos del Tutorial:**

1. **Bienvenida**
   - "¡Bienvenido a Master Sequence!"
   - Explicación breve del concepto

2. **Objetivo**
   - "Observa la secuencia iluminada"
   - "Repítela en el mismo orden"
   - Ejemplo animado

3. **Movimientos**
   - "Las secuencias siguen movimientos de ajedrez"
   - Diagrama de movimiento rey y caballo
   - "Esto hace los patrones más naturales"

4. **Colores**
   - "Cada casilla tiene su color único"
   - "¡Úsalos para ayudarte a recordar!"
   - Muestra paleta de colores

5. **Práctica Guiada**
   - Secuencia simple: e4 → e5
   - Flechas apuntando
   - "¡Ahora tú!"

6. **Listo**
   - "¡Perfecto! Ahora estás listo"
   - "¿Saltar tutorial en el futuro?"
   - [Sí] [No]

**Implementación:**
```javascript
// localStorage
tutorialCompleted: false,
skipTutorial: false,

// Al cargar juego
if (!tutorialCompleted && !skipTutorial) {
  showTutorial();
}

// Función tutorial
function showTutorial() {
  const steps = [
    {
      title: "¡Bienvenido!",
      content: "Master Sequence es un juego de memoria basado en ajedrez.",
      button: "Siguiente"
    },
    {
      title: "Objetivo",
      content: "Observa la secuencia de casillas iluminadas y repítela exactamente.",
      demo: true,
      button: "Siguiente"
    },
    // ... más pasos
  ];

  showTutorialOverlay(steps);
}
```

**Tests:**
```
TMF-064: Tutorial aparece para usuario nuevo
TMF-065: Todos los pasos se muestran
TMF-066: Práctica guiada funciona
TMF-067: Opción skip persiste
```

---

### 12.7 Estadísticas Avanzadas - FASE 8 📊

**Prioridad:** ⭐ Baja
**Estimación:** 6 horas
**Dependencias:** MF-001 (Stats Overlay)

---

#### MF-017: Tracking de Sesión

**Métricas a Agregar:**
- Tiempo total jugado (minutos)
- Niveles completados en sesión
- Intentos totales
- Precisión % en sesión

#### MF-018: Estadísticas Históricas

**Métricas:**
- Partidas jugadas totales
- Tiempo total acumulado
- Promedio de nivel alcanzado
- Tendencia de mejora (gráfica)

---

### 12.8 Mejoras de UX - FASE 9 🎨

**Prioridad:** ⭐ Baja
**Estimación:** 4 horas

---

#### MF-019: Preview de Nivel

**Descripción:** Mostrar info del siguiente nivel antes de empezar.

**Contenido:**
```
┌────────────────────────────┐
│  📊 NIVEL 5                │
│  ────────────────────────  │
│  Secuencia: 5 casillas     │
│  Área: Ring 4x4            │
│  Tiempo rec: 9.5s          │
│                            │
│  [Comenzar] [Saltar]       │
└────────────────────────────┘
```

---

#### MF-020: Pausa Durante Juego

**Descripción:** Botón de pausa durante fase de input.

**Funcionalidad:**
- Pausa timer
- Deshabilita tablero
- Overlay con opciones:
  - Continuar
  - Reintentar nivel
  - Salir al menú

---

### 12.9 Accesibilidad - FASE 10 ♿

**Prioridad:** ⭐⭐ Media
**Estimación:** 8 horas

---

#### MF-021: Navegación por Teclado

**Controles:**
- Flechas: Mover cursor en tablero
- Enter/Space: Seleccionar casilla
- ESC: Cerrar overlay
- Tab: Navegación entre botones
- P: Pausa

---

#### MF-022: Modo Alto Contraste

**Características:**
- Fondos más oscuros
- Bordes más gruesos (5px en vez de 3px)
- Texto más grande (+20%)
- Toggle en settings

---

#### MF-023: Screen Reader Support

**Implementación:**
- ARIA labels completos
- Anuncios de estado (`aria-live`)
- Descripción de secuencia en texto
- Feedback textual de todas las acciones

---

### 12.10 Social Features - FASE 11 🌐

**Prioridad:** ⭐ Baja
**Estimación:** 20 horas
**Dependencias:** Backend (fuera de alcance actual)

---

#### MF-024: Compartir Score

**Descripción:** Compartir puntuación en redes sociales.

**Plataformas:**
- Twitter
- Facebook
- WhatsApp
- Clipboard (copiar)

**Formato del Mensaje:**
```
🟦 Master Sequence - ChessArcade

🏆 Level 7 | Score: 1443
🔥 Streak: 7x perfect
⚡ ¿Puedes superarme?

[Play Now] → chessarcade.com.ar
```

**Implementación:**
```javascript
function shareScore() {
  const text = `🟦 Master Sequence - ChessArcade

🏆 Level ${gameState.currentLevel} | Score: ${gameState.score}
🔥 Streak: ${gameState.perfectStreak}x perfect
⚡ ¿Puedes superarme?

Play: https://chessarcade.com.ar`;

  // Twitter
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

  // Clipboard
  navigator.clipboard.writeText(text);
}
```

---

#### MF-025: Leaderboard Global

**Descripción:** Ranking mundial de jugadores.

**Requisitos:**
- Backend con base de datos
- Sistema de autenticación
- API para scores
- Filtros: Diario, Semanal, All-Time

**Fuera de alcance v1.x** (requiere infraestructura)

---

#### MF-026: Desafíos Diarios

**Descripción:** Secuencia específica cada día, igual para todos.

**Características:**
- Seed diario para generar misma secuencia
- 1 intento por día
- Leaderboard específico del día
- Recompensas especiales (badges)

**Fuera de alcance v1.x** (requiere backend)

---

## 13. GLOSARIO

**Términos del Juego:**

| Término | Definición |
|---------|------------|
| **Secuencia Acumulativa** | Lista de casillas que crece en cada nivel agregando una nueva |
| **Perfect Streak** | Cantidad de niveles completados sin errores consecutivos |
| **Speed Bonus** | Puntos extra por completar nivel rápido |
| **Streak Multiplier** | Multiplicador aplicado por racha perfecta |
| **High Score** | Mejor puntuación histórica del jugador |
| **Master Sequence** | Secuencia completa acumulativa de toda la partida |
| **Square Usage Count** | Contador de veces que se usó cada casilla |
| **Highlight** | Iluminación de una casilla con color neón |
| **Overlay** | Pantalla modal sobre el juego |
| **localStorage** | Almacenamiento local del navegador |
| **Power-up** | Ayuda especial (Hint, Replay, Slow Motion) |
| **Game Mode** | Variante de juego (Normal, Zen, Timed, Challenge) |

**Términos de Ajedrez:**

| Término | Definición |
|---------|------------|
| **Casilla** | Cada uno de los 64 cuadrados del tablero |
| **Notación Algebraica** | Sistema de coordenadas (a1-h8) |
| **Movimiento Rey** | 1 casilla en cualquier dirección (8 opciones) |
| **Movimiento Caballo** | Movimiento en L (2+1 o 1+2) |
| **Distancia Chebyshev** | Máxima diferencia en coordenadas X o Y |
| **Fila (Rank)** | Línea horizontal (1-8) |
| **Columna (File)** | Línea vertical (a-h) |
| **Cuadrante** | Una de las 4 secciones del tablero |
| **Ring** | Anillo de casillas desde el centro |

**Términos Técnicos:**

| Término | Definición |
|---------|------------|
| **Web Audio API** | API del navegador para audio sintético |
| **localStorage** | Almacenamiento persistente del navegador |
| **Responsive** | Adaptable a diferentes tamaños de pantalla |
| **60fps** | 60 cuadros por segundo (animación fluida) |
| **WCAG** | Web Content Accessibility Guidelines |
| **ARIA** | Accessible Rich Internet Applications |
| **Breakpoint** | Ancho de pantalla donde cambia el layout |
| **SVG** | Scalable Vector Graphics (gráficos vectoriales) |
| **Confeti** | Partículas animadas de celebración |
| **Trail** | Línea que conecta casillas en secuencia |

---

## 📝 CONTROL DE CAMBIOS

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0.0 | 2025-01-16 | Documento inicial | ChessArcade Team |
| 1.1.0 | 2025-10-17 | Sistema puntuación mejorado | ChessArcade Team |
| 1.2.0 | 2025-10-17 | Vidas a 5, UX Game Over, ERS completo | ChessArcade Team |

---

## 📧 CONTACTO Y APROBACIONES

**Stakeholder:** ChessArcade Team
**Product Owner:** [Nombre]
**Tech Lead:** Claude Code
**QA Lead:** [Nombre]

**Aprobaciones Requeridas:**
- [ ] Product Owner
- [ ] Tech Lead
- [ ] UX Designer
- [ ] QA Lead

---

## 📌 NOTAS FINALES

### Cómo Usar Este Documento

**Para Desarrolladores:**
- Sección 4 (RF) para implementar features
- Sección 6 (CU) para entender flujos
- Sección 12 (Mejoras Futuras) para planificar sprints

**Para QA:**
- Sección 11 (Criterios) para casos de prueba
- Sección 10 (Matriz) para trazabilidad
- Tests específicos en cada RF

**Para Stakeholders:**
- Sección 2 (Alcance) para entender qué está incluido
- Sección 12 (Mejoras) para roadmap
- Sección 11 (Criterios) para validar calidad

**Para Product Owners:**
- Sección 12 (Mejoras) para priorizar backlog
- Estimaciones de tiempo incluidas
- Dependencias claramente marcadas

### Mantenimiento del Documento

Este documento debe actualizarse cuando:
- Se implementa una nueva feature (mover de MF a RF)
- Cambian reglas de negocio
- Se agregan nuevos casos de uso
- Se modifican criterios de aceptación
- Se priorizan nuevas mejoras

**Responsable de Actualización:** Tech Lead

---

**Fin del Documento**

*Este documento es un artefacto vivo y debe actualizarse con cada cambio significativo en los requerimientos.*

---

**📚 Documentos Relacionados:**
- `DESIGN.md` - Especificación de diseño técnico
- `CHANGELOG.md` - Historial de cambios
- `MEJORAS_PLANIFICADAS.md` - Backlog original
- `PROGRESO_SESION_MASTER_SEQUENCE.md` - Documentación de implementación

**🔗 Enlaces Útiles:**
- Repositorio: https://github.com/fasmote/ChessArcade
- Demo: https://chessarcade.com.ar
- Documentación: `/games/coordinate-sequence/docs/`
