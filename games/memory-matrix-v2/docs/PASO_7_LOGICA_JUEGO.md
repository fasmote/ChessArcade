# PASO 7: Lógica Completa del Juego

## 📅 Fecha: 2025-01-03

## 🎯 Objetivo
Implementar el flujo completo del juego Memory Matrix con sistema de niveles progresivos desde niños de 4 años hasta adultos expertos.

## 📊 Sistema de Niveles

### Configuración de 8 Niveles

| Nivel | Nombre | Edad | Piezas | Tiempo | Tipos Permitidos |
|-------|--------|------|--------|--------|------------------|
| 1 | Principiante | 4-5 años | 2 | 8s | K, Q |
| 2 | Explorador | 6-7 años | 3 | 10s | K, Q, R |
| 3 | Aventurero | 8-10 años | 4 | 12s | K, Q, R, B |
| 4 | Estratega | 11-14 años | 5 | 14s | K, Q, R, B, N |
| 5 | Maestro | 15+ años | 6 | 15s | Todas |
| 6 | Gran Maestro | Experto | 7 | 16s | Todas |
| 7 | Súper GM | Élite | 8 | 18s | Todas |
| 8 | Leyenda | Leyenda | 10 | 20s | Todas |

### 🎲 Posiciones Aleatorias

**Cada vez que inicias un nivel, la posición es DIFERENTE**

```javascript
// Genera posición aleatoria según nivel
generateRandomPosition(levelNumber)
// Ejemplo Nivel 1: ['wK en e4', 'bQ en d5']
// Ejemplo Nivel 2: ['wK en a1', 'bQ en h8', 'wR en c3']
```

#### Variantes de Generación:

1. **Random Normal** (default)
   - Piezas en cualquier casilla del tablero
   - Nunca repite casillas

2. **Clustered** (avanzado)
   - Piezas agrupadas en un cuadrante
   - Más difícil de memorizar

3. **Symmetric** (intermedio)
   - Piezas en posición simétrica
   - Bonito visualmente

## 🎮 Flujo del Juego

### Fase 1: Memorización
```javascript
showMemorizationPhase(levelConfig)
```

1. Genera posición aleatoria con N piezas
2. Muestra piezas en el tablero
3. Mensaje: "Nivel X: Nombre - ¡Memoriza las piezas!"
4. Temporizador de X segundos

**Estado**: `gameState = 'memorizing'`

---

### Fase 2: Ocultar Piezas
```javascript
hidePiecesPhase(levelConfig)
```

1. Las piezas vuelan al banco con animación
2. Efecto stagger (una tras otra)
3. Banco se llena con las piezas exactas

**Estado**: Transición a `solving`

---

### Fase 3: Reconstrucción
```javascript
startSolvingPhase()
```

1. Jugador arrastra piezas del banco al tablero
2. Cada pieza colocada:
   - Se registra en `placedPieces[]`
   - Mensaje: "✓ Rey Blanco en E4 - Faltan 3 piezas"

**Estado**: `gameState = 'solving'`

---

### Fase 4: Validación
```javascript
validatePosition()
```

**Automática cuando se colocan todas las piezas**

1. Compara `placedPieces` vs `currentPosition`
2. Verifica: **misma pieza** en **misma casilla**
3. Si todo correcto → `onLevelComplete()`

---

### Fase 5: Nivel Completado
```javascript
onLevelComplete()
```

1. Mensaje: "🎉 ¡Nivel X completado en Y.Ys!"
2. Espera 2 segundos
3. Avanza al siguiente nivel
4. Botón cambia a "Siguiente Nivel"
5. Si completó nivel 8 → "🏆 ¡FELICIDADES! Completaste todos los niveles"

**Estado**: `gameState = 'completed'` → `idle`

## 📂 Archivos Creados/Modificados

### 1. `levels.js` (NUEVO)
Sistema completo de configuración de niveles.

**Funciones principales:**
```javascript
generateRandomPosition(levelNumber)      // Genera posición aleatoria
getLevelConfig(levelNumber)              // Obtiene config del nivel
getTotalLevels()                         // Retorna 8
isValidLevel(levelNumber)                // Valida 1-8
generateClusteredPosition(levelNumber)   // Variante difícil
generateSymmetricPosition(levelNumber)   // Variante bonita
```

**Configuración de nivel:**
```javascript
{
    level: 1,
    name: 'Principiante',
    description: 'Perfecto para comenzar',
    ageRange: '4-5 años',
    pieceCount: 2,
    memorizationTime: 8000,
    difficulty: 'easy',
    pieceTypes: ['K', 'Q'],
    allowedColors: ['w', 'b']
}
```

### 2. `game.js` (MODIFICADO)

**Variables de estado agregadas:**
```javascript
let currentLevel = 1;
let currentPosition = [];  // [{square: 'e4', piece: 'wK'}]
let placedPieces = [];     // Piezas que colocó el jugador
let startTime = null;      // Para medir tiempo
```

**Funciones agregadas:**
```javascript
startGame()              // Ahora usa sistema de niveles
showMemorizationPhase()  // Fase 1
hidePiecesPhase()        // Fase 2
startSolvingPhase()      // Fase 3
validatePosition()       // Fase 4
onLevelComplete()        // Fase 5
```

**Modificaciones en drag & drop:**
- Registra cada pieza colocada
- Muestra contador: "Faltan X piezas"
- Valida automáticamente al completar
- Solo permite drag durante `solving`

### 3. `index.html` (MODIFICADO)

Agregado script de niveles:
```html
<script src="levels.js"></script>
```

## 🎨 Experiencia de Usuario

### Mensajes de Estado

| Fase | Mensaje |
|------|---------|
| Inicio | "Bienvenido a Memory Matrix" |
| Memorizar | "Nivel 1: Principiante - ¡Memoriza las piezas!" |
| Ocultar | "¡Piezas al banco! Ahora reconstruye la posición..." |
| Resolver | "Arrastra las 2 piezas del banco al tablero" |
| Colocar | "✓ Rey Blanco en E4 - Faltan 1 pieza" |
| Validar | "✓ Dama Negra en D5 - ¡Validando...!" |
| Éxito | "🎉 ¡Nivel 1 completado en 12.3s!" |
| Siguiente | "Siguiente: Nivel 2. Presiona COMENZAR" |
| Victoria | "🏆 ¡FELICIDADES! Completaste todos los niveles" |

### Cambios en Botón

| Estado | Texto | Habilitado |
|--------|-------|------------|
| Inicial | "Comenzar" | ✅ |
| Jugando | "Comenzar" | ❌ (opacidad 0.5) |
| Completado | "Siguiente Nivel" | ✅ |
| Final | "Jugar de Nuevo" | ✅ |

## 🧪 Cómo Probar

1. Abrir `index.html`
2. Presionar **"Comenzar"**
3. **Memorizar** las 2 piezas (8 segundos)
4. Ver piezas **volar al banco**
5. **Arrastrar** piezas del banco al tablero
6. Ver validación automática
7. Si correcto → avanza a Nivel 2

### Test en Consola

```javascript
// Ver configuración de nivel
MemoryMatrixLevels.getLevelConfig(1)

// Generar posición manual
MemoryMatrixLevels.generateRandomPosition(3)

// Ver posición actual
console.log(currentPosition)

// Ver piezas colocadas
console.log(placedPieces)

// Validar manualmente
validatePosition()
```

## 🔄 Progresión de Dificultad

### Nivel 1-2: Niños Pequeños (4-7 años)
- ✅ Solo 2-3 piezas
- ✅ Tiempo generoso (8-10s)
- ✅ Solo piezas fáciles de reconocer (Rey, Dama, Torre)
- ✅ Posiciones aleatorias pero dispersas

### Nivel 3-4: Niños (8-14 años)
- ⬆️ 4-5 piezas
- ⬆️ 12-14 segundos
- ⬆️ Agregan Alfil y Caballo
- ⬆️ Más variedad de posiciones

### Nivel 5-6: Adultos (15+ años)
- ⬆️ 6-7 piezas
- ⬆️ 15-16 segundos
- ⬆️ Todas las piezas (incluye Peón)
- ⬆️ Posiciones más complejas

### Nivel 7-8: Expertos
- ⬆️ 8-10 piezas
- ⬆️ 18-20 segundos
- ⬆️ Todas las piezas
- ⬆️ Posiciones agrupadas (más difícil)

## ✅ Características Implementadas

- [x] 8 niveles progresivos
- [x] Posiciones **completamente aleatorias** cada partida
- [x] Tiempos adaptados por edad
- [x] Piezas permitidas según nivel
- [x] Flujo completo: Memorizar → Ocultar → Resolver → Validar
- [x] Validación automática al completar
- [x] Contador de piezas faltantes
- [x] Avance automático de nivel
- [x] Mensaje de victoria al completar todos
- [x] Nombres legibles de piezas
- [x] Medición de tiempo

## 🔜 Próximas Mejoras (Opcional)

1. **Timer visual** durante memorización
2. **Feedback visual** de piezas correctas/incorrectas
3. **Sistema de estrellas** (1-3 según tiempo)
4. **Highscores** por nivel
5. **Sonidos** de victoria/error
6. **Selector de nivel** manual
7. **Modo práctica** sin límite de tiempo
8. **Estadísticas** (% acierto, mejor tiempo)

---

**Documentado por**: Claude Code
**Próximo paso**: PASO 8 - Polish y mejoras UX
