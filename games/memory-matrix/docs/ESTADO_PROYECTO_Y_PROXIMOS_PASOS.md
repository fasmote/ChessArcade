# 🧠 Memory Matrix - Estado del Proyecto y Próximos Pasos

**Fecha**: 1 de Octubre de 2025
**Claude**: Sonnet 4.5
**Usuario**: Claudio (MAG)

---

## 📊 RESUMEN EJECUTIVO

Memory Matrix está **parcialmente funcional** pero **NO listo para publicación**. Hay dos versiones del código coexistiendo, el sistema de drag & drop NO funciona correctamente, y falta implementar 28 de los 30 niveles diseñados.

---

## 🎯 QUÉ SE LOGRÓ HOY (1 Oct 2025)

### ✅ Sistema de Temas de Piezas (COMPLETADO)

Se implementó un sistema modular completo para que los usuarios puedan cambiar el estilo visual de las piezas de ajedrez:

**Archivos Creados:**
- `ChessGameLibrary/Config/PieceThemes.js` - Configuración centralizada de temas
- `ChessGameLibrary/UI/ThemeSelector.js` - Componente UI para selector
- `ChessGameLibrary/UI/ThemeSelector.css` - Estilos del selector
- `libs/img/chesspieces/monsters/README.md` - Instrucciones para exportar piezas MAG
- `docs/SISTEMA_DE_TEMAS_PIEZAS.md` - Documentación completa del sistema

**Archivos Modificados:**
- `ChessGameLibrary/Board/BoardManager.js` - Soporte para temas dinámicos
- `ChessGameLibrary/Pieces/PieceBank.js` - Soporte para temas dinámicos
- `index.html` - Integración del sistema de temas

**Temas Disponibles:**
1. ✅ **Lichess** (CDN) - Moderno, limpio (DEFAULT)
2. ✅ **Chess.com** (CDN) - Estilo Chess.com oficial
3. ✅ **Wikipedia Classic** (CDN) - Tradicional
4. 🔒 **Monsters (MAG)** (Local) - Pendiente exportación desde CorelDRAW
5. 🔒 **Minimal** (Local) - No implementado

**Funcionalidades:**
- Selector visual tipo dropdown con preview de piezas
- Persistencia en localStorage
- Recarga automática al cambiar tema
- Sistema extensible para agregar nuevos temas fácilmente

**Objetivo**: Cambiar de piezas Wikipedia viejas a Lichess modernas, y preparar sistema para piezas personalizadas MAG.

---

## 🚨 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **Dos Versiones del Código Coexistiendo**

Hay **DOS implementaciones diferentes** del Memory Matrix en el mismo proyecto:

#### Versión A: `simple-memory.js` + `simple-memory.css`
- **Usado en**: `index.html` (actual)
- **Estado**: MVP super simplificado
- **Características**:
  - Solo 1 nivel (2 reyes: e1 y e8)
  - Drag & drop parcialmente implementado
  - NO usa ChessGameLibrary completamente
  - Hardcoded a Lichess CDN en múltiples lugares
  - **Línea 137**: `pieceImg.src = 'libs/img/chesspieces/lichess/${piece}.svg'` (path LOCAL que NO existe)

#### Versión B: `memory-matrix.js` + `memory-matrix.css` + `memory-levels.js`
- **Usado en**: Aparentemente obsoleto o no conectado
- **Estado**: Más completo pero no integrado
- **Características**:
  - 30 niveles configurados (solo 2 jugables según README)
  - Sistema de pausa/reanudar
  - Responsive design completo
  - Más robusto pero más complejo

**CONSECUENCIA**: El `index.html` actual usa la versión simple que NO aprovecha el trabajo previo de los 30 niveles ni la arquitectura completa.

---

### 2. **Drag & Drop NO Funciona Correctamente**

#### En `simple-memory.js` (línea 229-261):

El código intenta implementar drag & drop desde el banco de piezas al tablero, pero tiene problemas fundamentales:

```javascript
// PROBLEMA: No detecta la casilla exacta del tablero
// Solo coloca en "primera casilla vacía"
const targetSquare = emptySquares[0]; // ❌ SIEMPRE la primera
position[targetSquare] = piece;
```

**Comentario del código mismo** (línea 230-232):
> "Determinar la casilla donde se hizo drop (esto es complejo con ChessBoard.js, por simplicidad usaremos una posición fija). En una implementación completa, necesitaríamos calcular la casilla basada en coordenadas"

**CONSECUENCIA**: El usuario NO puede colocar piezas en casillas específicas, solo se colocan automáticamente en la primera vacía. Esto **rompe la mecánica del juego** donde el usuario debe recordar la posición exacta.

---

### 3. **ChessGameLibrary Parcialmente Implementado**

La librería modular `ChessGameLibrary` está en desarrollo pero:

- ✅ **EventBus** - Implementado
- ✅ **StateManager** - Implementado
- ✅ **BoardManager** - Implementado (con soporte de temas)
- ✅ **PieceBank** - Implementado (con soporte de temas)
- ✅ **PieceThemes** - Implementado (HOY)
- ✅ **ThemeSelector** - Implementado (HOY)
- ⚠️ **MemoryMatrixGame** - Parcialmente implementado
  - Tiene la estructura correcta
  - Usa todos los componentes
  - Pero `setupBoardDropZone()` (línea 183-230) tiene el mismo problema de drag & drop
  - `placePieceOnBoard()` (línea 204-230) coloca en primera casilla vacía, no en la correcta

---

### 4. **Inconsistencias de Paths**

- `simple-memory.js` línea 137: Path LOCAL `libs/img/chesspieces/lichess/${piece}.svg`
  - **Este path NO existe** (archivos SVG locales están corruptos, por eso cambiamos a CDN)
  - Debería usar `PieceThemes.getPiecePath(piece)` como hace `PieceBank.js`

- `simple-memory.js` línea 44 y 110: Usa CDN correctamente
  - Duplicación de código entre fase inicial y fase de colocación

---

### 5. **30 Niveles Diseñados pero Solo 2 Implementados**

Según `memory_matrix_spec.md` y README:

**Especificados:**
- 👶 **Niveles 1-10**: Baby Memory (4-8 años) - Mates básicos
- ⚡ **Niveles 11-20**: Pattern Master (8-14 años) - Aperturas famosas
- 🏆 **Niveles 21-30**: Grandmaster Mode (14+ años) - Partidas inmortales

**Implementados:**
- ✅ Nivel 1: Dos reyes
- ✅ Nivel 2: ??? (mencionado en README pero no visible en código simple actual)
- ❌ Niveles 3-30: Especificados pero NO implementados

---

## 🎯 OBJETIVO DEL PROYECTO

Según las especificaciones y conversaciones:

### Concepto del Juego

**Memory Matrix** es un juego educativo de memoria ajedrecística con progresión de dificultad:

1. **Mostrar posición** de ajedrez (1-10 segundos según nivel)
2. **Ocultar piezas específicas** (desde 2 hasta 30 piezas)
3. **Jugador arrastra piezas del banco al tablero** para recrear la posición
4. **Verificación automática** de si la posición es correcta
5. **Progresión pedagógica**: Mates básicos → Aperturas → Partidas inmortales

### Target

- **Edad**: 4 años hasta Grandes Maestros
- **Plataforma**: Web (ChessArcade)
- **Propósito**: Educativo, mejora memoria táctica y visual

---

## 📋 TAREAS PENDIENTES PARA PUBLICACIÓN

### 🔴 CRÍTICO (Bloquean publicación)

#### 1. **Decidir Arquitectura Final**

**Opciones:**

**A) Continuar con `simple-memory.js` (MVP rápido)**
- ✅ Más fácil de mantener
- ✅ Menos código
- ❌ Pierde trabajo de 30 niveles diseñados
- ❌ Menos modular
- ❌ No aprovecha ChessGameLibrary

**B) Migrar a `memory-matrix.js` + ChessGameLibrary (Completo)**
- ✅ Aprovechar 30 niveles diseñados
- ✅ Arquitectura modular reutilizable
- ✅ Mejor para futuro
- ❌ Más complejo
- ❌ Requiere más tiempo

**RECOMENDACIÓN**: **Opción B** - El trabajo de diseño de 30 niveles es valioso, la arquitectura modular beneficia todo ChessArcade.

---

#### 2. **Arreglar Drag & Drop COMPLETAMENTE**

**Problema Actual**: No se detecta la casilla exacta del tablero donde se hace drop.

**Soluciones Posibles:**

**A) Usar ChessBoard2.js API correctamente**
- Investigar cómo ChessBoard2.js maneja drops desde elementos externos
- Posiblemente necesita configuración específica en `onDrop` callback

**B) Calcular casilla manualmente desde coordenadas**
```javascript
function getBoardSquareFromCoordinates(x, y, boardElement) {
    const rect = boardElement.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    const squareWidth = rect.width / 8;
    const squareHeight = rect.height / 8;

    const file = Math.floor(relX / squareWidth); // 0-7
    const rank = 8 - Math.floor(relY / squareHeight); // 1-8

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return files[file] + rank; // ej: 'e4'
}
```

**C) Alternativa: Click en banco + Click en tablero**
- Menos intuitivo pero más fácil de implementar
- Usuario hace click en pieza del banco
- Usuario hace click en casilla del tablero
- Se coloca la pieza

**RECOMENDACIÓN**: Intentar **B** primero (calcular casilla), fallback a **C** si es muy complejo.

---

#### 3. **Implementar Niveles 3-10 Mínimo**

Para considerarse "publicable", necesita al menos los niveles básicos (Baby Memory):

**Niveles a Implementar:**
1. ✅ Nivel 1: Dos reyes (e1, e8)
2. ⚠️ Nivel 2: Rey y Dama vs Rey (implementado en versión vieja?)
3. ❌ Nivel 3: Torre fuerte
4. ❌ Nivel 4: Dos torres
5. ❌ Nivel 5: Alfiles amigos
6. ❌ Nivel 6-10: Según spec

**Archivo de Referencia**: `memory_matrix_spec.md` tiene FENs y configuraciones completas.

---

#### 4. **Integrar PieceThemes en Todo el Código**

Actualmente:
- ✅ `BoardManager.js` usa `PieceThemes`
- ✅ `PieceBank.js` usa `PieceThemes`
- ❌ `simple-memory.js` NO usa `PieceThemes` (hardcoded CDN + path local incorrecto)

**Cambios Necesarios:**

En `simple-memory.js`:

```javascript
// ELIMINAR línea 137:
pieceImg.src = `libs/img/chesspieces/lichess/${piece}.svg`;

// REEMPLAZAR con:
pieceImg.src = PieceThemes.getPiecePath(piece);
```

```javascript
// ELIMINAR líneas 42-44 y 108-110 (duplicadas):
pieceTheme: (piece) => {
    return `<img src="https://lichess1.org/assets/piece/cburnett/${piece}.svg" ...>`;
}

// REEMPLAZAR con:
pieceTheme: PieceThemes.getPieceThemeFunction()
```

**O MEJOR**: Si se elige Opción B (arquitectura completa), `simple-memory.js` se elimina y solo se usa `MemoryMatrixGame` que YA usa `PieceThemes` correctamente.

---

### 🟡 IMPORTANTE (Mejoran experiencia)

#### 5. **Sistema de Progresión de Niveles**

Actualmente el juego solo tiene 1 nivel hardcoded. Necesita:

- **Selector de Nivel**: UI para elegir nivel actual
- **Progresión Automática**: Al completar nivel, ofrecer siguiente
- **Persistencia**: Guardar progreso en localStorage
- **Desbloqueables**: Niveles bloqueados hasta completar anteriores (opcional)

**Ubicación de Implementación**: `MemoryMatrixGame.js` método `loadLevel(levelNumber)`

---

#### 6. **Feedback Visual Mejorado**

- **Pieza correcta**: Borde verde, sonido success
- **Pieza incorrecta**: Shake animation, sonido error
- **Progreso**: Mostrar "3/5 piezas colocadas correctamente"
- **Victoria**: Animación de celebración

---

#### 7. **Sistema de Hints (Pistas)**

Para jugadores atascados:

- **Botón "Pista"**: Muestra temporalmente una pieza correcta
- **Costo**: Reduce puntuación o añade tiempo
- **Limitado**: 1-3 pistas por nivel

---

#### 8. **Sistema de Audio**

Según código, Howler.js está preparado pero deshabilitado:

- **Sonidos de colocación**: Pieza colocada correctamente/incorrectamente
- **Música de fondo**: Opcional, deshabilitada por defecto
- **Efectos de victoria**: Fanfare al completar nivel

---

### 🟢 DESEABLE (Pulido final)

#### 9. **Modo de Práctica**

- Ver piezas originales en cualquier momento (sin penalización)
- Útil para aprendizaje, no para competición

---

#### 10. **Sistema de Puntuación**

- **Tiempo**: Menos tiempo = más puntos
- **Intentos**: Menos errores = más puntos
- **Pistas**: Usar pistas reduce puntos
- **Leaderboard**: Top 10 por nivel (localStorage)

---

#### 11. **Animaciones Avanzadas**

- **Transición entrada**: Piezas aparecen con fade-in
- **Transición salida**: Piezas desaparecen con fade-out
- **Drag**: Shadow/ghost durante drag
- **Drop**: Bounce al colocar

---

#### 12. **Tutorial Interactivo**

Para nuevos jugadores:
- Overlay explicativo en primer nivel
- "Memoriza estas piezas... Ahora arrástralas aquí..."
- Skip opcional para jugadores experimentados

---

#### 13. **Exportar Piezas Monsters MAG**

**Tareas para Claudio:**
1. Abrir: `C:\Users\clau\Documents\ChessArcade_backup\piezas y tableros\todas monstruo 2015 2.cdr`
2. Exportar 12 archivos SVG individuales (wK, wQ, wR, wB, wN, wP, bK, bQ, bR, bB, bN, bP)
3. Guardar en: `libs/img/chesspieces/monsters/`
4. Seguir instrucciones en: `libs/img/chesspieces/monsters/README.md`
5. Habilitar tema: `PieceThemes.js` cambiar `monsters.enabled: true`

**Mapeo de Piezas:**
- wK → Vampiro amarillo
- wQ → Dama amarilla
- wR → Frankenstein amarillo
- wB → Momia amarilla
- wN → Hombre lobo amarillo
- wP → Momia pequeña amarilla
- bK → Vampiro azul
- bQ → Dama azul
- bR → Frankenstein azul
- bB → Gorila azul
- bN → Hombre lobo azul
- bP → Alien azul

---

## 🗂️ ESTRUCTURA DE ARCHIVOS RECOMENDADA

Si se elige arquitectura completa (Opción B):

```
memory-matrix/
├── index.html                          # Entry point
├── ChessGameLibrary/                   # Librería modular reutilizable
│   ├── Core/
│   │   ├── EventBus.js                 # ✅ Completo
│   │   └── StateManager.js             # ✅ Completo
│   ├── Config/
│   │   └── PieceThemes.js              # ✅ Completo (HOY)
│   ├── Board/
│   │   └── BoardManager.js             # ✅ Completo
│   ├── Pieces/
│   │   └── PieceBank.js                # ✅ Completo
│   ├── UI/
│   │   ├── ThemeSelector.js            # ✅ Completo (HOY)
│   │   └── ThemeSelector.css           # ✅ Completo (HOY)
│   └── Games/
│       └── MemoryMatrix/
│           ├── MemoryMatrixGame.js     # ⚠️ Parcial (arreglar drag & drop)
│           ├── MemoryLevels.js         # ⚠️ Parcial (solo ~2 niveles implementados)
│           └── MemoryMatrixUI.js       # ❌ Crear (selector niveles, feedback visual)
│
├── memory-matrix.css                   # Estilos principales
├── libs/                               # Dependencias externas
│   ├── chess.min.js                    # ✅
│   ├── chessboard2.min.js              # ✅
│   ├── chessboard2.css                 # ✅
│   ├── howler.min.js                   # ✅ (opcional)
│   └── img/chesspieces/
│       ├── lichess/                    # ❌ Corruptos (usar CDN)
│       └── monsters/                   # 🔒 Pendiente exportación
│
├── docs/                               # Documentación
│   ├── SISTEMA_DE_TEMAS_PIEZAS.md     # ✅ Completo (HOY)
│   ├── SESION_OCTUBRE_01_CAMBIO_PIEZAS_LICHESS.md  # ✅ Completo (HOY)
│   ├── ESTADO_PROYECTO_Y_PROXIMOS_PASOS.md  # ✅ ESTE DOCUMENTO
│   └── memory_matrix_spec.md           # ✅ Especificación completa
│
├── README.md                           # ⚠️ Actualizar con estado real
├── simple-memory.js                    # ❌ ELIMINAR (o renombrar a .backup)
└── simple-memory.css                   # ❌ ELIMINAR (o renombrar a .backup)
```

---

## 🎯 PLAN DE ACCIÓN SUGERIDO

### Fase 1: Fundamentos (CRÍTICO) - 2-3 días

1. **Decidir arquitectura** (Opción A vs B)
2. **Arreglar drag & drop** (calcular casilla exacta desde coordenadas)
3. **Integrar PieceThemes** en todo el código
4. **Testear nivel 1** hasta que funcione perfectamente

### Fase 2: Contenido Básico (IMPORTANTE) - 3-5 días

5. **Implementar niveles 2-10** (Baby Memory)
6. **Sistema de progresión** (selector de nivel, persistencia)
7. **Feedback visual básico** (correcto/incorrecto, contador)
8. **Testear niveles 1-10** exhaustivamente

### Fase 3: Pulido (DESEABLE) - 2-4 días

9. **Sistema de audio** (opcional)
10. **Animaciones** (transiciones, drag visual)
11. **Sistema de pistas** (hints)
12. **Tutorial interactivo** (primer nivel)

### Fase 4: Contenido Avanzado (POST-PUBLICACIÓN)

13. **Implementar niveles 11-20** (Pattern Master)
14. **Implementar niveles 21-30** (Grandmaster)
15. **Sistema de puntuación/leaderboard**
16. **Piezas Monsters MAG** (cuando Claudio exporte)

---

## 🧪 TESTING NECESARIO

### Test de Funcionalidad Core

- [ ] Nivel 1 se carga correctamente
- [ ] Piezas se muestran durante tiempo de memorización
- [ ] Piezas se ocultan al terminar tiempo
- [ ] Banco de piezas se crea con piezas correctas
- [ ] Drag & drop funciona desde banco al tablero
- [ ] Pieza se coloca en casilla correcta (la que el usuario eligió)
- [ ] Sistema detecta cuando todas las piezas están correctas
- [ ] Mensaje de victoria aparece
- [ ] Botón "Jugar de nuevo" funciona

### Test de Sistema de Temas

- [ ] Selector de temas aparece en esquina superior derecha
- [ ] Dropdown muestra todos los temas disponibles
- [ ] Preview de pieza (wK) se muestra para cada tema
- [ ] Al seleccionar tema, aparece confirm dialog
- [ ] Al confirmar, página se recarga
- [ ] Tema nuevo se aplica correctamente (tablero + banco)
- [ ] Tema se persiste en localStorage
- [ ] Al recargar página, tema se mantiene

### Test Responsive

- [ ] Mobile (<600px): Layout vertical, banco abajo
- [ ] Tablet (600-899px): Layout vertical, banco más ancho
- [ ] Desktop (900px+): Layout horizontal, banco lateral
- [ ] Tablero se escala correctamente en todos los tamaños
- [ ] Banco de piezas se escala correctamente
- [ ] Selector de temas accesible en móvil

### Test de Edge Cases

- [ ] Intentar colocar pieza en casilla ya ocupada
- [ ] Intentar colocar pieza fuera del tablero
- [ ] Cambiar tema en medio de un nivel
- [ ] Recargar página en medio de un nivel
- [ ] Minimizar/maximizar ventana del navegador
- [ ] Probar en diferentes navegadores (Chrome, Firefox, Safari, Edge)

---

## 💬 PREGUNTAS PARA CLAUDIO

1. **¿Qué arquitectura prefieres?**
   - A) Continuar con `simple-memory.js` (más rápido, menos completo)
   - B) Migrar a `memory-matrix.js` + ChessGameLibrary (más trabajo, más completo)

2. **¿Cuál es la prioridad?**
   - Publicar rápido con pocos niveles (1-3)
   - Publicar cuando estén niveles 1-10 completos
   - Esperar a tener los 30 niveles

3. **¿Audio es importante?**
   - Sí, crítico para la experiencia
   - Sí, pero puede agregarse después
   - No es prioritario

4. **¿Cuándo puedes exportar las piezas Monsters?**
   - Esta semana
   - Próxima semana
   - No es urgente

5. **¿Testeo en móvil es prioritario?**
   - Sí, muchos usuarios móviles
   - Desktop primero, móvil después

---

## 📝 NOTAS PARA "CLAUDE DEL FUTURO"

### Contexto Importante

Este proyecto es parte de **ChessArcade**, una colección de juegos educativos de ajedrez modulares para edades 4 a adulto. El usuario (Claudio/MAG) es el creador y diseñador de las piezas personalizadas "Monsters".

### Problemas Resueltos Hoy

1. ✅ Cambio de piezas Wikipedia → Lichess CDN (problema: archivos locales corruptos)
2. ✅ ChessBoard2.js requiere `pieceTheme` como **función**, no string
3. ✅ Sistema de temas completo implementado y documentado
4. ✅ Arquitectura modular ChessGameLibrary iniciada

### Problemas NO Resueltos (CRÍTICOS)

1. ❌ **Drag & drop NO detecta casilla exacta** - Solo coloca en "primera casilla vacía"
2. ❌ **Dos versiones del código** - `simple-memory.js` vs `memory-matrix.js`
3. ❌ **Solo 1-2 niveles implementados** de 30 diseñados
4. ❌ **PieceThemes no integrado** en `simple-memory.js`

### Archivos Clave

- **Especificación completa**: `memory_matrix_spec.md` (30 niveles con FENs)
- **Estado del proyecto**: `README.md` (dice "2 niveles jugables")
- **Sistema de temas**: `docs/SISTEMA_DE_TEMAS_PIEZAS.md`
- **Código actual**: `index.html` usa `simple-memory.js` (MVP incompleto)
- **Código complejo**: `memory-matrix.js` (más robusto pero no conectado)

### Decisión Pendiente

**¿Continuar con simple-memory.js o migrar a memory-matrix.js?**

Esta decisión afecta TODO el trabajo futuro. Necesita input de Claudio antes de continuar.

### Drag & Drop Challenge

El mayor desafío técnico actual es detectar **en qué casilla del tablero** el usuario hizo drop de la pieza desde el banco. ChessBoard2.js no lo hace automáticamente para elementos externos.

**Solución propuesta**: Calcular casilla desde coordenadas (x, y) del evento drop relativas al tablero.

---

## 🔗 Referencias Útiles

- **ChessBoard2.js Docs**: https://github.com/oakmac/chessboard2
- **Chess.js Docs**: https://github.com/jhlywa/chess.js
- **Howler.js Docs**: https://howlerjs.com/
- **Lichess Piece CDN**: `https://lichess1.org/assets/piece/cburnett/{piece}.svg`

---

**Documentado por**: Claude (Sonnet 4.5)
**Fecha**: 1 de Octubre de 2025
**Versión**: 1.0
**Estado**: Memory Matrix NO listo para publicación - Requiere trabajo en drag & drop y niveles

---

## ✅ CHECKLIST FINAL PARA PUBLICACIÓN

### Mínimo Viable Product (MVP)

- [ ] Drag & drop funciona correctamente (casilla exacta)
- [ ] Niveles 1-5 implementados y jugables
- [ ] Sistema de temas funciona
- [ ] Responsive en desktop y móvil
- [ ] Testing completo sin bugs críticos
- [ ] README actualizado con estado real

### Publicación Completa

- [ ] 30 niveles implementados
- [ ] Sistema de progresión con persistencia
- [ ] Audio implementado
- [ ] Animaciones pulidas
- [ ] Sistema de puntuación
- [ ] Tutorial interactivo
- [ ] Piezas Monsters MAG disponibles
- [ ] Testing exhaustivo en múltiples dispositivos

**Estimación de Tiempo: 10-15 días de desarrollo** (Mínimo 2-3 días para MVP)
