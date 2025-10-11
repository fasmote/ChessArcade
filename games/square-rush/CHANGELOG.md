# 📝 CHANGELOG - Square Rush

## 🎨 Versión 6 - Tablero estilo Memory Matrix (11 Octubre 2025)

### Cambio principal: Tablero responsivo y consistente

**Problema:**
- Tablero fijo de 480px (60px × 8 casillas)
- No ocupaba pantalla completa en mobile
- Estilo arcade diferente a Memory Matrix
- Casillas pequeñas difíciles de tocar en celular

**Solución:**
Adoptar el sistema de tablero de Memory Matrix para consistencia visual y mejor UX mobile.

---

### 🔧 Cambios técnicos:

#### **Antes (v5):**
```css
.chess-board {
    grid-template-columns: repeat(8, 60px);  /* Tamaño fijo */
    grid-template-rows: repeat(8, 60px);
    gap: 2px;
    border: 4px solid #00ffff;
}

.square {
    font-size: 12px;  /* Fijo */
}
```

#### **Después (v6):**
```css
.chess-board {
    grid-template-columns: repeat(8, 1fr);  /* Responsivo */
    grid-template-rows: repeat(8, 1fr);

    /* Ocupa 90% del viewport */
    width: 90vw;
    max-width: 400px;  /* Mobile */
    aspect-ratio: 1;   /* Siempre cuadrado */
}

/* Tablet */
@media (min-width: 600px) {
    .chess-board { max-width: 450px; }
}

/* Desktop */
@media (min-width: 900px) {
    .chess-board { max-width: 500px; }
}

.square {
    width: 100%;  /* Definido por grid */
    height: 100%;
    font-size: clamp(10px, 2.5vw, 14px);  /* Responsivo */
}
```

---

### 📐 Tamaños del tablero:

| Dispositivo | Ancho pantalla | Tamaño tablero | Tamaño casilla |
|-------------|----------------|----------------|----------------|
| Mobile pequeño | 360px | 324px (90vw) | ~40px |
| Mobile grande | 414px | 373px (90vw) | ~46px |
| Tablet | 768px | 450px (max) | ~56px |
| Desktop | 1440px | 500px (max) | ~62px |

**Antes:** 480px fijo (60px/casilla) - no cabía completo en mobile

---

### ✨ Mejoras visuales:

#### 1. **Board Container:**
- Padding aumentado: `1rem` (antes implícito)
- Borde neón más grueso: `3px` (antes 4px)
- Glow neón mejorado: 3 capas de sombra
- Fondo semi-transparente: `rgba(0, 0, 0, 0.4)`

#### 2. **Casillas:**
- Hover mejorado: `brightness(1.15)` + `scale(1.05)`
- Transición más rápida: `0.2s` (antes 0.3s)
- Colores sólidos (sin gradiente para mejor rendimiento)

#### 3. **Coordenadas:**
- Fuente responsiva: `clamp(10px, 2.5vw, 14px)`
- Se adapta automáticamente al tamaño de casilla

---

### 🎯 Beneficios:

✅ **Mobile:** Tablero ocupa toda la pantalla disponible
✅ **Touch:** Casillas más grandes = más fácil tocar
✅ **Consistencia:** Mismo look & feel que Memory Matrix
✅ **Responsivo:** Se adapta a cualquier tamaño de pantalla
✅ **Performance:** Usa `aspect-ratio` nativo (no JS)
✅ **Accesibilidad:** Tamaño mínimo 40px en mobile (recomendado: 44px)

---

### 📦 Archivos modificados:

**square-rush.css:**
- Líneas 270-367: Reescritura completa de `.board-container`, `.chess-board`, `.square`
- +97 líneas (media queries + propiedades responsivas)
- Línea 1: Comentario de versión actualizado a v6

**index.html:**
- Línea 8: Cache buster actualizado: `?v=5` → `?v=6`

---

### 🧪 Testing:

**Probado en:**
- [ ] Mobile 360px (Galaxy S8)
- [ ] Mobile 414px (iPhone 12)
- [ ] Tablet 768px (iPad)
- [ ] Desktop 1440px

**Verificar:**
- [ ] Tablero ocupa ~90% del ancho en mobile
- [ ] Casillas son cuadradas (aspect-ratio funciona)
- [ ] Coordenadas visibles en todos los tamaños
- [ ] Animaciones correctas (correct/wrong flash)
- [ ] Hover funciona en desktop

---

### 🔄 Migración desde v5:

No se requiere cambio en JavaScript - el grid sigue siendo 8×8 con las mismas clases CSS.

**Compatible con:**
- Sistema de coordenadas existente
- Animaciones `.correct` y `.wrong`
- Lógica de juego sin cambios

---

**Última actualización:** 11 Octubre 2025
**Versión CSS:** 6
**Próximo:** Feedback de usuarios + ajustes mobile si necesario
