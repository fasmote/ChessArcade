# Piezas Monsters - MAG Design

Esta carpeta contiene las piezas de ajedrez con diseño de monstruos creadas por MAG.

## 📦 Archivos Requeridos

Necesitas exportar **12 archivos SVG** (o PNG) desde CorelDRAW:

### Piezas Blancas (Amarillas):
- `wK.svg` - Rey (Vampiro amarillo)
- `wQ.svg` - Dama (Dama amarilla)
- `wR.svg` - Torre (Frankenstein amarillo)
- `wB.svg` - Alfil (Momia amarilla)
- `wN.svg` - Caballo (Hombre lobo amarillo)
- `wP.svg` - Peón (Momia pequeña amarilla)

### Piezas Negras (Azules):
- `bK.svg` - Rey (Vampiro azul)
- `bQ.svg` - Dama (Dama azul)
- `bR.svg` - Torre (Frankenstein azul)
- `bB.svg` - Alfil (Gorila azul)
- `bN.svg` - Caballo (Hombre lobo azul)
- `bP.svg` - Peón (Alien azul)

## 🎨 Cómo Exportar desde CorelDRAW

1. **Abrir archivo:** `C:\Users\clau\Documents\ChessArcade_backup\piezas y tableros\todas monstruo 2015 2.cdr`

2. **Para cada pieza:**
   - Seleccionar la pieza
   - File → Export → Export As...
   - Formato: **SVG** (recomendado) o **PNG** (si prefieres bitmap)
   - Nombre: usar nomenclatura exacta (`wK.svg`, `bQ.svg`, etc.)
   - Guardar en esta carpeta

3. **Configuración de exportación SVG:**
   - Version: SVG 1.1
   - Text: Convert to curves
   - Bitmaps: Embedded
   - Size: Keep original proportions

4. **Configuración de exportación PNG (alternativa):**
   - Resolution: 300 DPI mínimo
   - Tamaño: 200x200px recomendado
   - Background: Transparent
   - Anti-aliasing: ON

## ✅ Habilitar el Tema

Una vez que hayas exportado las 12 piezas:

1. Abre `ChessGameLibrary/Config/PieceThemes.js`
2. Busca la sección `monsters`
3. Cambia `enabled: false` a `enabled: true`
4. Si usaste PNG en lugar de SVG, cambia también `extension: 'svg'` a `extension: 'png'`

## 🎮 Usar el Tema

1. Recarga la página
2. Click en el botón "Piezas" (esquina superior derecha)
3. Selecciona "Monsters (MAG)"
4. Confirma para recargar con las nuevas piezas

¡Disfruta tus piezas personalizadas!
