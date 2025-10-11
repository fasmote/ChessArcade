# Changelog

## [1.1.0] - 2025-10-11

### Fixed 🐛
- **Botones HOME y SONIDO** ahora funcionan correctamente con event listeners robustos
  - Agregado `try-catch` para prevenir errores de inicialización
  - Event listeners configurados ANTES de `initGame()`
  - Agregados logs de debugging para troubleshooting
  - `preventDefault()` agregado para evitar comportamiento por defecto

### Improved 🎨
- **Layout mobile completamente rediseñado**
  - HOME y SONIDO en header separado (arriba)
  - Stats (Moves, Visited, Remaining, Time) movidos ABAJO del tablero
  - Monedero reposicionado (más pequeño, no tapa botón SONIDO)
  - "How To Play" movido al final usando CSS flexbox `order`
  - Botones de juego más compactos (40% más pequeños)

- **Subtítulo descriptivo agregado**
  - "Master the knight's L-shaped moves and visit every square!"
  - Estilo consistente con Square Rush

### Technical Changes ⚙️
- **CSS Flexbox Order System** para reordenamiento responsive
  ```css
  @media (max-width: 767px) {
    .control-header { order: 1; }
    .game-header { order: 2; }
    .size-selector { order: 3; }
    #chessboard { order: 4; }
    .game-stats { order: 5; }
    .game-controls { order: 6; }
    .neon-section { order: 99; }
  }
  ```

- **Stats separados de game-header** para mejor control de layout
- **Event listeners con error handling robusto**

### Layout Order (Mobile)
1. 🏠 HOME + 🔊 SONIDO (header separado)
2. 🐴 KNIGHT QUEST + subtítulo
3. Selectores de tamaño (4x4, 6x6, 8x8, 10x10)
4. 🟦 Tablero de ajedrez
5. 📊 Stats (Moves, Visited, Remaining, Time) ← Movido aquí
6. 🎮 Botones de juego (NEW GAME, HINT, UNDO)
7. 📖 How To Play (al final)

---

## [1.0.0] - 2025-01-14

### Added ✨
- **Juego completo Knight Quest** con 4 tamaños de tablero (4x4, 6x6, 8x8, 10x10)
- **Sistema de sonido** con Web Audio API (movimientos, errores, victoria, pistas)
- **Modales interactivos** que se pueden cerrar y volver a abrir
- **Sistema de pistas** inteligente usando algoritmo de Warnsdorff
- **Función deshacer** movimientos
- **Efectos visuales** neon con animaciones CSS
- **Diseño responsive** optimizado para móvil
- **Teclas de acceso rápido** (Espacio, R, U, números)
- **Guardado de mejores puntuaciones** en localStorage

### Visual Improvements 🎨
- **Puntos rojos** en lugar de rayos para movimientos posibles
- **Caballo mejorado** con fondo claro y borde negro para mejor visibilidad
- **Casillas amarillo flúor** para movimientos válidos
- **Estadísticas alineadas** correctamente en ambos modales
- **Modal de Game Over** más compacto y estilizado

### Controls & UX 🎮
- **Botón de cerrar (×)** en modales de victoria y game over
- **Botones "SHOW STATS/RESULT"** para reabrir modales
- **Botón "EASIER"** funcional en Game Over
- **Toggle de sonido** con iconos visuales
- **Contador de monedas** animado
- **Indicadores de progreso** visuales

### Technical Features ⚙️
- **Web Audio API** para sonidos sintéticos
- **Algoritmo Warnsdorff** para pistas óptimas
- **Sistema de estado** robusto del juego
- **Manejo de errores** y validaciones
- **Optimización móvil** con eventos touch
- **Código modular** y bien documentado

### Accessibility 🌐
- **Navegación por teclado** completa
- **Indicadores visuales** claros
- **Feedback sonoro** opcional
- **Colores de alto contraste**
- **Responsive design** para todos los dispositivos

---

*Versión inicial completa del Knight Quest con todas las características principales implementadas.*
