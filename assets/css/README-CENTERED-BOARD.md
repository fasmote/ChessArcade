# 🎯 Centered Board Layout Library

Biblioteca CSS reutilizable para centrar tableros de ajedrez con sidebar flotante en ChessArcade.

---

## 📖 Descripción

Esta biblioteca proporciona un sistema de layout **responsive** que:

✅ **Mobile (< 900px)**: Layout vertical con controles arriba, tablero abajo
✅ **Desktop (≥ 900px)**: Tablero perfectamente centrado con sidebar flotante a la derecha
✅ **Sidebar neón**: Borde púrpura con efecto glow
✅ **Espacio lateral**: Preparado para publicidad/menus futuros
✅ **Sin JavaScript**: CSS puro, sin dependencias

---

## 🚀 Instalación

### 1. Importar en tu HTML

```html
<head>
    <link rel="stylesheet" href="../../assets/css/centered-board-layout.css">
</head>
```

### 2. Estructura HTML requerida

```html
<div class="centered-board-wrapper">
    <div class="centered-board-main">
        <!-- Tu tablero de ajedrez aquí -->
        <div class="chessboard" id="chessboard">
            <!-- 64 casillas generadas por JS -->
        </div>
    </div>
    <div class="centered-board-sidebar">
        <!-- Controles, botones, estadísticas -->
        <button id="btnCoordinates">SHOW COORDINATES</button>
        <button id="btnReset">RESET GAME</button>
    </div>
</div>
```

---

## 🎨 Variantes de Uso

### Sidebar a la Izquierda

Para usuarios zurdos o preferencias específicas:

```html
<div class="centered-board-wrapper sidebar-left">
    <!-- contenido -->
</div>
```

### Cambiar Color del Sidebar

Disponibles: `sidebar-cyan`, `sidebar-orange`, `sidebar-green`, `sidebar-magenta`

```html
<div class="centered-board-wrapper sidebar-cyan">
    <!-- contenido -->
</div>
```

### Sin Sidebar

Para juegos que no necesitan controles laterales:

```html
<div class="centered-board-wrapper no-sidebar">
    <!-- solo tablero -->
</div>
```

---

## 📱 Responsive Behavior

| Breakpoint | Layout | Sidebar Position | Order |
|------------|--------|------------------|-------|
| < 900px | Vertical | Arriba del tablero | Controls → Board |
| ≥ 900px | Horizontal | Absoluta a la derecha | Board (center) + Sidebar (right) |
| ≥ 1400px | Horizontal | Más separada del borde | Same + more padding |

---

## 🎯 Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Juego - ChessArcade</title>

    <!-- Biblioteca de layout centrado -->
    <link rel="stylesheet" href="../../assets/css/centered-board-layout.css">

    <!-- Estilos específicos del juego -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <div class="game-container">

        <!-- Header con botones (no afectado por la biblioteca) -->
        <header class="header">
            <button id="btnHome">HOME</button>
            <button id="btnStart">COMENZAR</button>
            <button id="btnSound">SONIDO</button>
        </header>

        <!-- Layout centrado con sidebar -->
        <div class="centered-board-wrapper">

            <!-- Tablero (centrado en desktop) -->
            <div class="centered-board-main">
                <div class="chessboard" id="chessboard">
                    <!-- Casillas generadas por JS -->
                </div>
            </div>

            <!-- Sidebar (flotante derecha en desktop) -->
            <div class="centered-board-sidebar">
                <button class="btn-coordinates" id="btnCoordinates">
                    SHOW COORDINATES
                </button>
                <div class="sidebar-stats">
                    <p>Score: <span id="score">0</span></p>
                    <p>Level: <span id="level">1</span></p>
                </div>
            </div>

        </div>

    </div>

    <script src="game.js"></script>
</body>
</html>
```

---

## 🛠️ Personalización

### Cambiar Variables de Color

Puedes sobrescribir las variables CSS en tu archivo `styles.css`:

```css
:root {
    --neon-purple: #9000ff; /* Tu color personalizado */
    --spacing-xl: 3rem; /* Más separación lateral */
}
```

### Cambiar Ancho del Sidebar

```css
@media (min-width: 900px) {
    .centered-board-sidebar {
        width: 350px; /* Ancho personalizado */
    }
}
```

### Cambiar Breakpoint Responsive

```css
/* Cambiar 900px por tu valor deseado */
@media (min-width: 1024px) {
    .centered-board-wrapper {
        /* tus estilos desktop */
    }
}
```

---

## ⚙️ CSS Variables Incluidas

```css
:root {
    --neon-purple: #8000ff;
    --neon-cyan: #00ffff;
    --neon-magenta: #ff0080;
    --neon-orange: #ff8000;
    --neon-green: #00ff80;
    --neon-yellow: #ffff00;

    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    --border-radius: 12px;
}
```

---

## 📊 Juegos que Usan Esta Biblioteca

✅ **Master Sequence** - Primer juego en implementar este patrón
⏳ **Futuros juegos** - Se recomienda usar esta biblioteca para consistencia

---

## 🐛 Troubleshooting

### El tablero no se centra

**Solución**: Asegúrate de usar la estructura HTML exacta:
- Wrapper con clase `centered-board-wrapper`
- Main con clase `centered-board-main`
- Sidebar con clase `centered-board-sidebar`

### Sidebar aparece abajo en desktop

**Solución**: Verifica que el wrapper tenga `min-height` suficiente:

```css
.centered-board-wrapper {
    min-height: 500px; /* O la altura de tu tablero */
}
```

### Los estilos no se aplican

**Solución**: Verifica la ruta de importación:

```html
<!-- Desde games/tu-juego/index.html -->
<link rel="stylesheet" href="../../assets/css/centered-board-layout.css">

<!-- Desde index.html raíz -->
<link rel="stylesheet" href="./assets/css/centered-board-layout.css">
```

---

## 📝 Changelog

### v1.0 (Octubre 2025)
- ✨ Versión inicial
- ✅ Layout responsive mobile/desktop
- ✅ Sidebar flotante con efectos neón
- ✅ Variantes de color y posición
- ✅ Documentación completa

---

## 🤝 Contribuir

Para mejorar esta biblioteca:

1. Testear en diferentes tamaños de pantalla
2. Agregar nuevas variantes de color si son necesarias
3. Optimizar performance si se detectan issues
4. Actualizar documentación con nuevos casos de uso

---

## 📄 Licencia

MIT License - Parte del proyecto ChessArcade

---

**Made with ⚡ by ChessArcade Team**
