# 🐛 ERRORES CONOCIDOS Y SOLUCIONES - Memory Matrix

**Fecha creación**: 1 de Octubre de 2025
**Propósito**: Evitar repetir los mismos errores

---

## ❌ ERROR #1: Piezas se ven como texto (bR, wK, bP)

### Síntoma:
En vez de ver imágenes SVG de piezas, se ven códigos como "bR", "wK", "bP"

### Causa:
ChessBoard2.js requiere que `pieceTheme` sea una **FUNCIÓN** que retorna HTML, NO un string path.

### ❌ INCORRECTO:
```javascript
pieceTheme: 'libs/img/chesspieces/lichess/{piece}.svg'
```

### ✅ CORRECTO:
```javascript
pieceTheme: (piece) => {
    return `<img src="https://lichess1.org/assets/piece/cburnett/${piece}.svg"
                 alt="${piece}"
                 style="width: 100%; height: 100%;">`;
}
```

### Solución definitiva:
Usar `PieceThemes.getPieceThemeFunction()` que ya retorna la función correcta.

---

## ❌ ERROR #2: Banco de piezas desplazado hacia abajo

### Síntoma:
En desktop (≥900px), el banco lateral aparece más abajo que el tablero

### Causa:
Conflicto entre CSS `!important` y valores calculados por JavaScript

### Solución (probada y funcionando):
```css
/* En memory-matrix.css */
.chess-board-container {
    padding: 0 !important;
    margin: 0 !important;
    align-items: flex-start !important;  /* NO center */
}

.piece-bank-container {
    align-self: flex-start !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
}
```

### Archivos clave:
- `test-alignment.css` - CSS que funciona
- `STATUS_FINAL_ALINEACION.md` - Documentación completa
- `MIGRACION_CSS_COMPLETADA.md` - Migración al CSS principal

---

## ❌ ERROR #3: Drag & Drop coloca en "primera casilla vacía"

### Síntoma:
Al arrastrar pieza del banco al tablero, se coloca en cualquier casilla, no donde el usuario la soltó

### Causa:
No se calculaba la casilla exacta desde coordenadas del mouse

### ❌ CÓDIGO INCORRECTO:
```javascript
const targetSquare = emptySquares[0]; // Siempre la primera
```

### ✅ SOLUCIÓN:
```javascript
function getSquareFromCoordinates(clientX, clientY) {
    const rect = boardElement.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    const squareWidth = rect.width / 8;
    const squareHeight = rect.height / 8;
    const file = Math.floor(relX / squareWidth);
    const rank = 8 - Math.floor(relY / squareHeight);
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return files[file] + rank;
}
```

### Archivos:
- `MemoryMatrixGame.js` líneas 310-394 (comentado)

---

## ❌ ERROR #4: SVG locales corruptos

### Síntoma:
Error XML: "Specification mandates value for attribute crossorigin"

### Causa:
Archivos SVG descargados de Lichess estaban malformados

### Solución:
**SIEMPRE usar CDN en vez de archivos locales**

```javascript
// ✅ USAR CDN
src: 'https://lichess1.org/assets/piece/cburnett/${piece}.svg'

// ❌ NO USAR archivos locales (están corruptos)
src: 'libs/img/chesspieces/lichess/${piece}.svg'
```

### Referencia:
- `SESION_OCTUBRE_01_CAMBIO_PIEZAS_LICHESS.md`

---

## ❌ ERROR #5: Cache del navegador no muestra cambios

### Síntoma:
Modificas JavaScript pero los cambios no se ven en el navegador

### Causa:
El navegador usa versión cacheada del archivo

### Soluciones:
1. **Hard refresh**: Ctrl + Shift + R (Windows) o Cmd + Shift + R (Mac)
2. **Incognito**: Abrir en ventana privada
3. **Versioning**: Agregar `?v=X` a los imports
   ```html
   <script src="game.js?v=2"></script>
   ```
4. **DevTools**: Abrir DevTools → Network → Disable cache

---

## ❌ ERROR #6: Dos versiones del código coexistiendo

### Síntoma:
Hay `simple-memory.js` Y `memory-matrix.js` con lógica diferente

### Causa:
`simple-memory.js` fue creado como MVP mientras se arreglaba el problema del banco

### Solución:
**USAR SOLO UNA VERSIÓN**

### Decisión tomada:
- **Usar**: `MemoryMatrixGame.js` (ChessGameLibrary completa)
- **Eliminar/Archivar**: `simple-memory.js` y `simple-memory.css`

---

## ❌ ERROR #7: Paths relativos incorrectos

### Síntoma:
Archivos no se cargan, error 404 en consola

### Causa:
Usar paths relativos desde ubicación incorrecta

### Solución:
**SIEMPRE usar paths desde la raíz del proyecto**

```html
<!-- ✅ CORRECTO -->
<script src="ChessGameLibrary/Core/EventBus.js"></script>

<!-- ❌ INCORRECTO -->
<script src="../Core/EventBus.js"></script>
```

---

## ❌ ERROR #8: ChessBoard2 no define función pieceTheme

### Síntoma:
Error: "pieceTheme is not a function"

### Causa:
Se pasó un string en vez de una función

### Solución:
Ver ERROR #1

---

## 🔧 CHECKLIST ANTES DE PROBAR

Antes de decir "está listo", verificar:

- [ ] **Hard refresh** (Ctrl + Shift + R)
- [ ] **Abrir en incognito** para evitar cache
- [ ] **Revisar consola** (F12) - NO debe haber errores rojos
- [ ] **Verificar Network tab** - archivos se cargan correctamente (status 200)
- [ ] **pieceTheme es función**, no string
- [ ] **Paths son absolutos** desde raíz del proyecto
- [ ] **Solo UNA versión** del código activa

---

## 📝 TEMPLATE PARA REPORTAR NUEVO ERROR

```markdown
## ❌ ERROR #X: [Nombre descriptivo]

### Síntoma:
[Qué se ve en pantalla / qué error aparece]

### Causa:
[Por qué pasó esto]

### ❌ CÓDIGO INCORRECTO:
[código que NO funciona]

### ✅ SOLUCIÓN:
[código que SÍ funciona]

### Archivos afectados:
- [lista de archivos]

### Cómo verificar que está arreglado:
[pasos para confirmar]
```

---

**Mantener este documento actualizado cada vez que encontremos un nuevo error**
