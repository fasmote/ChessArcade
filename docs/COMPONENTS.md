# 🧩 NeonChess - Guía de Componentes

## 📖 Índice
- [Componentes de Layout](#-componentes-de-layout)
- [Tipografía](#-tipografía)
- [Botones](#-botones)
- [Tarjetas](#-tarjetas)
- [Elementos Especiales](#-elementos-especiales)
- [Utilidades](#-utilidades)
- [Animaciones](#-animaciones)

## 🏗️ Componentes de Layout

### `.neon-container`
Contenedor principal de la aplicación.
```html
<div class="neon-container neon-grid-bg">
    <!-- Contenido aquí -->
</div>
```

**Modificadores:**
- `.neon-grid-bg` - Añade fondo con grid animado

### `.neon-section`
Secciones de contenido con espaciado consistente.
```html
<section class="neon-section">
    <h2 class="neon-heading">Mi Sección</h2>
    <!-- Contenido -->
</section>
```

### Grillas
```html
<!-- Auto-fit responsive -->
<div class="neon-grid neon-grid-auto">
    <div class="neon-card">...</div>
    <div class="neon-card">...</div>
</div>

<!-- 2 columnas fijas -->
<div class="neon-grid neon-grid-2">
    <div>Columna 1</div>
    <div>Columna 2</div>
</div>

<!-- 3 columnas fijas -->
<div class="neon-grid neon-grid-3">
    <div>Col 1</div>
    <div>Col 2</div>
    <div>Col 3</div>
</div>
```

### Flexbox
```html
<div class="neon-flex">
    <button class="neon-pill">Botón 1</button>
    <button class="neon-pill">Botón 2</button>
</div>
```

## ✍️ Tipografía

### `.neon-title`
Título principal con gradiente animado.
```html
<h1 class="neon-title">ChessArcade</h1>
```

### `.neon-subtitle`
Subtítulo con efecto pulse.
```html
<p class="neon-subtitle">Level Up Your Chess Game</p>
```

### `.neon-heading`
Encabezados de sección.
```html
<h2 class="neon-heading">Knight Quest</h2>
```

### `.neon-text`
Texto normal del sistema.
```html
<p class="neon-text">
    Descripción del juego o contenido normal.
</p>
```

**Modificadores de color:**
```html
<span class="neon-cyan">Texto cian</span>
<span class="neon-magenta">Texto magenta</span>
<span class="neon-green">Texto verde</span>
<span class="neon-orange">Texto naranja</span>
<span class="neon-yellow">Texto amarillo</span>
```

## 🔘 Botones

### `.neon-pill`
Botones redondeados tipo píldora con efecto de llenado.
```html
<button class="neon-pill">Default</button>
<button class="neon-pill primary">Primary</button>
<button class="neon-pill secondary">Secondary</button>
<a href="#" class="neon-pill">Como Link</a>
```

**Estados:**
- `:hover` - Efecto de llenado con glow
- `:active` - Escalado menor

### `.neon-arcade-btn`
Botones estilo arcade años 80 con sombras múltiples.
```html
<button class="neon-arcade-btn red">▶ Start Game</button>
<button class="neon-arcade-btn blue">★ High Scores</button>
```

**Colores disponibles:**
- `.red` - Gradiente rojo
- `.blue` - Gradiente azul

**Efectos:**
- `:hover` - Levitación y glow mejorado
- `:active` - Presión física con partículas

### `.neon-play-btn`
Botón pequeño para acciones de juego.
```html
<button class="neon-play-btn">Play Now</button>
```

## 🃏 Tarjetas

### `.neon-card`
Tarjeta de contenido con efectos glass y animaciones.
```html
<article class="neon-card">
    <div class="neon-card-icon">🐴</div>
    <h2 class="neon-heading">Knight Quest</h2>
    <p class="neon-text neon-mb-md">
        Descripción del juego...
    </p>
    <button class="neon-play-btn">Play Now</button>
</article>
```

### `.neon-card-icon`
Iconos para tarjetas con efectos.
```html
<div class="neon-card-icon">⚡</div>          <!-- Normal -->
<div class="neon-card-icon large">🐴</div>    <!-- Grande con animación -->
```

**Modificadores:**
- `.large` - Icono más grande con animación de rebote

**Efectos automáticos:**
- Parallax 3D en hover
- Scan effect al hacer clic
- Shimmer animation en hover

## 🎲 Elementos Especiales

### Piezas de Ajedrez
```html
<div class="neon-pieces">
    <div class="neon-piece">♔</div>
    <div class="neon-piece">♕</div>
    <div class="neon-piece">♖</div>
    <div class="neon-piece">♗</div>
    <div class="neon-piece">♘</div>
    <div class="neon-piece">♙</div>
</div>
```

**Efectos:**
- Flotación automática alterna
- Click para spin dramático con ondas de choque
- Hover para glow mejorado

### Contador de Monedas
```html
<div class="neon-coin-counter">
    <div class="neon-coin-icon">¢</div>
    <span>1,337</span>
</div>
```

**Características:**
- Posicionado fixed (top-right)
- Auto-incremento cada 8 segundos
- Click para explosión de monedas
- Animación de spin en icono

### Power-ups
```html
<!-- Se crean automáticamente por JavaScript -->
<div class="neon-power-up"></div>
```

**Funciones automáticas:**
- Aparición desde abajo de la pantalla
- Colores aleatorios
- Click para recolectar (+25 monedas)

## 🛠️ Utilidades

### Espaciado
```html
<!-- Margins -->
<div class="neon-mt-sm">Margin top small</div>
<div class="neon-mt-md">Margin top medium</div>
<div class="neon-mt-lg">Margin top large</div>

<div class="neon-mb-sm">Margin bottom small</div>
<div class="neon-mb-md">Margin bottom medium</div>
<div class="neon-mb-lg">Margin bottom large</div>

<!-- Padding -->
<div class="neon-p-sm">Padding small</div>
<div class="neon-p-md">Padding medium</div>
<div class="neon-p-lg">Padding large</div>
```

### Alineación
```html
<div class="neon-center">Centrado</div>
<div class="neon-left">Izquierda</div>
<div class="neon-right">Derecha</div>
```

### Texto
```html
<span class="neon-uppercase">Mayúsculas</span>
<span class="neon-lowercase">minúsculas</span>
<span class="neon-bold">Negrita</span>
<span class="neon-extra-bold">Extra negrita</span>
```

## 🎬 Animaciones

### Animaciones CSS Predefinidas
```css
/* Usadas automáticamente en componentes */
@keyframes neonGradientShift { /* Gradiente en títulos */ }
@keyframes neonPulse { /* Pulse en subtítulos */ }
@keyframes neonFloat { /* Flotación en piezas */ }
@keyframes neonBounce { /* Rebote en iconos grandes */ }
@keyframes neonGridMove { /* Grid de fondo */ }
@keyframes neonCoinSpin { /* Spin de monedas */ }
@keyframes neonPowerUpFloat { /* Power-ups flotantes */ }
```

### Efectos JavaScript Disponibles

```javascript
// Partículas en coordenadas
NeonChess.createParticles(x, y, '#00ffff');

// Screen shake
NeonChess.screenShake();

// Añadir monedas
NeonChess.addCoins(50);

// Cambiar color de power-ups
NeonChess.setPowerUpColor('#ff0080');
```

## 🎯 Mejores Prácticas

### ✅ **Hacer**
- Usar las clases predefinidas como base
- Combinar modificadores para variaciones
- Aprovechar los efectos JavaScript automáticos
- Mantener la paleta de colores neón
- Usar la tipografía Orbitron del sistema

### ❌ **Evitar**
- Sobreescribir animaciones principales
- Usar colores fuera de la paleta
- Mezclar con otros sistemas de diseño
- Desactivar los efectos interactivos
- Usar fondos que compitan con el grid

## 🔧 Personalización Avanzada

### Extender Componentes
```css
/* Crear variantes de tarjetas */
.neon-card.special {
    border-image: linear-gradient(45deg, var(--neon-yellow), var(--neon-purple)) 1;
}

.neon-card.special:hover {
    box-shadow: var(--glow-large) var(--neon-yellow);
}
```

### Añadir Efectos JavaScript
```javascript
// Extender el sistema
window.addEventListener('DOMContentLoaded', function() {
    // Tu código personalizado
    document.querySelectorAll('.mi-elemento-custom').forEach(el => {
        el.addEventListener('click', () => {
            NeonChess.createParticles(
                el.offsetLeft + el.offsetWidth/2,
                el.offsetTop + el.offsetHeight/2,
                '#custom-color'
            );
        });
    });
});
```

## 📱 Responsive Breakpoints

```css
/* El sistema maneja automáticamente: */

@media (max-width: 768px) {
    /* Tablets: Grillas a 1 columna, botones más pequeños */
}

@media (max-width: 480px) {
    /* Móviles: Espaciado reducido, títulos más pequeños */
}
```

---

Esta guía cubre todos los componentes del **NeonChess System**. Para ejemplos de implementación, revisa los archivos en la carpeta `games/`.