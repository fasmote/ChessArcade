# 📱 Sistema Tap vs Drag - Documentación Técnica

**Versión**: 2.0.0
**Fecha**: 15 Octubre 2025
**Archivo**: `ChessGameLibrary/DragDrop.js`
**Autor**: ChessArcade Team

---

## 🎯 Resumen Ejecutivo

Sistema inteligente de detección que permite **dos métodos** de colocación de piezas en dispositivos táctiles:
1. **Tap-Tap**: Tocar pieza → Tocar casilla (método rápido)
2. **Drag**: Arrastrar pieza hasta casilla (método visual)

El sistema **detecta automáticamente** la intención del usuario según su comportamiento, sin necesidad de configuración.

---

## 🔍 Problema Original

### Síntomas
- En mobile, solo funcionaba drag (arrastrar piezas)
- Tap-tap (tocar pieza → tocar casilla) NO funcionaba
- Sistema tap-tap existía pero era **inaccesible**

### Causa Raíz
```javascript
// En handleDragStart (línea 126)
e.preventDefault();  // ❌ Bloqueaba TODOS los eventos

// Secuencia en mobile:
// 1. touchstart → llama handleDragStart()
// 2. preventDefault() → cancela evento 'click'
// 3. Sistema tap-tap espera 'click' → NUNCA llega ❌
```

El evento `touchstart` con `preventDefault()` **bloqueaba** la propagación del evento `click` necesario para tap-tap.

---

## ✅ Solución Implementada

### Concepto: Detección Inteligente

**No prevenir eventos inmediatamente**. Esperar a ver si el usuario:
- **Mueve el dedo** >10px → Es DRAG
- **NO mueve** el dedo → Es TAP

### Umbral de Movimiento
```javascript
const MOVE_THRESHOLD = 10; // píxeles

// Movimiento < 10px = TAP (toque rápido)
// Movimiento ≥ 10px = DRAG (arrastre)
```

---

## 🏗️ Arquitectura del Sistema

### 1. Estado Extendido

```javascript
let dragState = {
    // ... estado anterior ...

    // NUEVO: Para detección tap vs drag
    touchStartTime: 0,    // Timestamp del inicio del touch
    touchStartX: 0,       // Posición X inicial
    touchStartY: 0,       // Posición Y inicial
    isTap: false          // Flag: ¿es un tap sin movimiento?
};
```

### 2. Flujo de Eventos

#### **Fase 1: Touch Start** (`handleDragStart`)

```javascript
function handleDragStart(e) {
    // Para TOUCH: NO iniciar drag todavía
    if (e.type === 'touchstart') {
        const touch = e.touches[0];

        // Guardar posición inicial
        dragState.touchStartTime = Date.now();
        dragState.touchStartX = touch.clientX;
        dragState.touchStartY = touch.clientY;
        dragState.isTap = true;  // Asumir tap por defecto

        // Guardar pieza temporalmente
        dragState.draggedPiece = piece;
        dragState.draggedElement = pieceElement;
        dragState.sourceSlot = bankSlot;

        return;  // ⚠️ NO prevenir default - esperar
    }

    // Para MOUSE: Comportamiento normal
    e.preventDefault();
    // ... iniciar drag inmediatamente
}
```

**Clave**: NO llamar `e.preventDefault()` para touch. Dejar que el evento fluya.

#### **Fase 2: Touch Move** (`handleDragMove`)

```javascript
function handleDragMove(e) {
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    // ¿El usuario está moviendo el dedo?
    if (e.type === 'touchmove' && dragState.isTap && !dragState.isDragging) {
        const deltaX = Math.abs(clientX - dragState.touchStartX);
        const deltaY = Math.abs(clientY - dragState.touchStartY);

        // Si movió >10px, es DRAG
        if (deltaX > 10 || deltaY > 10) {
            console.log('🎯 Movimiento detectado - ES DRAG');

            dragState.isTap = false;  // Ya no es tap
            e.preventDefault();        // Ahora SÍ prevenir

            // Iniciar drag con ghost
            startDragFromTouch(clientX, clientY);
        }
        return;
    }

    // Si ya está dragging, mover ghost
    if (dragState.isDragging) {
        dragState.ghostElement.style.left = `${clientX}px`;
        dragState.ghostElement.style.top = `${clientY}px`;
    }
}
```

**Clave**: Solo llamar `e.preventDefault()` cuando se confirma que es drag.

#### **Fase 3: Touch End** (`handleDragEnd`)

```javascript
function handleDragEnd(e, onPiecePlaced, canPlacePiece) {
    // ¿Fue un TAP sin movimiento?
    if (e.type.startsWith('touch') && dragState.isTap && !dragState.isDragging) {
        console.log('📱 TAP detectado - dejar que tap-tap lo maneje');

        // Limpiar estado temporal
        dragState.draggedPiece = null;
        dragState.draggedElement = null;
        dragState.sourceSlot = null;
        dragState.isTap = false;

        // ⚠️ NO prevenir default
        // → Evento 'click' se dispara
        // → Sistema tap-tap lo captura
        return;
    }

    // Si fue DRAG, colocar pieza normalmente
    if (dragState.isDragging) {
        e.preventDefault();
        // ... lógica de colocación
    }
}
```

**Clave**: Si fue tap, NO prevenir default para que `click` se dispare.

---

## 🔄 Diagramas de Flujo

### Flujo TAP (sin movimiento)

```
Usuario toca pieza
       ↓
touchstart → handleDragStart()
       ↓
Guarda posición inicial
NO previene default
       ↓
touchend → handleDragEnd()
       ↓
isTap=true && !isDragging
NO previene default
       ↓
Evento 'click' se dispara ✅
       ↓
Sistema tap-tap lo captura
Pieza seleccionada con glow dorado
       ↓
Usuario toca casilla
       ↓
click en tablero → initTapTap listener
       ↓
Pieza colocada ✅
```

### Flujo DRAG (con movimiento)

```
Usuario toca pieza
       ↓
touchstart → handleDragStart()
       ↓
Guarda posición inicial
NO previene default (todavía)
       ↓
Usuario mueve dedo >10px
       ↓
touchmove → handleDragMove()
       ↓
Detecta movimiento >10px
Previene default AHORA ✅
       ↓
Crea ghost element
Inicia drag visual
       ↓
Usuario mueve dedo
       ↓
touchmove → Ghost sigue al dedo
       ↓
touchend → handleDragEnd()
       ↓
isDragging=true
Previene default
       ↓
Coloca pieza en casilla de destino ✅
```

---

## 🧪 Casos de Prueba

### Caso 1: Tap Rápido (< 200ms, < 10px)
```
✅ Comportamiento esperado: Sistema tap-tap
- Touch start
- Touch end (sin mover)
- Pieza seleccionada con glow
- Click en casilla → Pieza colocada
```

### Caso 2: Drag Corto (movimiento 15px)
```
✅ Comportamiento esperado: Drag con ghost
- Touch start
- Touch move (15px)
- Ghost aparece
- Touch end
- Pieza colocada directamente
```

### Caso 3: Touch Accidental (tap sin intención)
```
✅ Comportamiento esperado: Pieza seleccionada
- Touch start
- Touch end rápido
- Pieza queda seleccionada (glow)
- Usuario puede:
  - Tocar otra pieza (cambiar selección)
  - Tocar casilla (colocar)
  - Ignorar (no pasa nada)
```

### Caso 4: Drag Cancelado (vuelta al banco)
```
✅ Comportamiento esperado: Bounce back
- Touch start
- Touch move (drag iniciado)
- Touch end fuera del tablero
- Pieza vuelve al banco con animación
```

---

## 📊 Ventajas del Sistema

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Métodos disponibles** | Solo drag | Drag Y tap-tap |
| **UX Mobile** | Difícil para usuarios nuevos | Múltiples opciones |
| **Velocidad** | Lenta (siempre drag) | Rápida (tap si prefieres) |
| **Precisión** | Media (dedos grandes) | Alta (tap en casilla exacta) |
| **Accesibilidad** | Limitada | Mejorada (más opciones) |
| **Conflictos de eventos** | Bloqueaba click | Sin conflictos |

---

## 🔧 Parámetros Configurables

### Umbral de Movimiento
```javascript
// En handleDragMove (línea 212)
const moveThreshold = 10; // píxeles
```

**Ajustar si**:
- Usuarios reportan drag accidental → **Aumentar** (ej: 15px)
- Tap-tap difícil de activar → **Disminuir** (ej: 8px)

### Tiempo de Tap (opcional)
```javascript
// Actualmente NO implementado, pero posible:
const TAP_MAX_DURATION = 300; // ms

const tapDuration = Date.now() - dragState.touchStartTime;
if (tapDuration > TAP_MAX_DURATION) {
    // Considerar como drag lento, no tap
}
```

---

## 🎨 Feedback Visual

### Tap-Tap
```css
/* Pieza seleccionada */
.bank-piece-slot.selected img {
    filter: drop-shadow(0 0 20px gold);
}

.bank-piece-slot.selected {
    background: rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}
```

### Drag
```css
/* Ghost element */
.dragging-ghost {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
    cursor: grabbing;
}

/* Casilla bajo cursor */
.drag-over {
    background: rgba(0, 255, 128, 0.3) !important;
    border: 3px solid #00ff80 !important;
    box-shadow: 0 0 20px rgba(0, 255, 128, 0.6) !important;
}
```

---

## 🚀 Uso en Otros Juegos

### Integración Simple

```javascript
// En cualquier juego de ChessArcade
import { initDragDrop, initTapTap } from './ChessGameLibrary/DragDrop.js';

// Callbacks compartidos
const callbacks = {
    bankSelector: '.piece-bank',
    boardSelector: '#chessboard',
    onPiecePlaced: (piece, square) => {
        console.log(`Pieza ${piece} colocada en ${square}`);
        // Lógica del juego
    },
    canPlacePiece: (piece, square) => {
        // Validación del juego
        return true; // o false
    }
};

// Inicializar AMBOS sistemas
initDragDrop(callbacks);   // Drag + Detección inteligente
initTapTap(callbacks);      // Tap-tap
```

### Requisitos HTML

```html
<!-- Banco de piezas -->
<div class="piece-bank">
    <div class="bank-piece-slot" data-piece="wK">
        <img class="piece"
             data-piece="wK"
             src="pieza.svg"
             alt="White King">
    </div>
</div>

<!-- Tablero -->
<div id="chessboard">
    <div class="square" data-square="e4">
        <!-- Casilla vacía o con pieza -->
    </div>
</div>
```

---

## 📝 Notas Importantes

### 1. Passive Event Listeners
```javascript
// NO usar { passive: true } en touchstart/touchmove
pieceElement.addEventListener('touchstart', handleDragStart,
    { passive: false }  // ← Importante para preventDefault()
);
```

### 2. Orden de Inicialización
```javascript
// Ambos sistemas deben inicializarse
initDragDrop(options);  // Primero
initTapTap(options);    // Segundo
```

### 3. Compatibilidad
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Firefox Mobile
- ✅ Chrome Desktop (con mouse)
- ✅ Firefox Desktop (con mouse)
- ✅ Safari Desktop (con mouse)

### 4. Depuración
```javascript
// Habilitar logs detallados
console.log('🔥 handleDragStart');
console.log('🎯 Movimiento detectado');
console.log('📱 Tap detectado');
console.log('👻 Ghost creado');
```

---

## 🔮 Futuras Mejoras

### Posibles Features
1. **Timeout de tap**: Si usuario tarda >500ms, cancelar selección
2. **Vibración háptica**: Al seleccionar pieza (mobile)
3. **Doble tap**: Para deshacer última colocación
4. **Gestos**: Swipe para descartar pieza
5. **Multi-touch**: Seleccionar múltiples piezas (modo especial)

### Métricas a Trackear
- Ratio tap vs drag por usuario
- Tiempo promedio de colocación
- Errores de colocación por método
- Preferencia según dispositivo

---

## 📚 Referencias

### Archivos Relacionados
- `ChessGameLibrary/DragDrop.js` - Implementación principal
- `games/memory-matrix-v2/game.js` - Integración ejemplo
- `games/memory-matrix-v2/styles.css` - Estilos visuales

### Documentación
- [Touch Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [Event.preventDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)

---

**Última actualización**: 15 Octubre 2025
**Versión del documento**: 1.0
**Mantenido por**: ChessArcade Team
