# 🎮 ChessArcade - NeonChess System

## ✨ Sistema de Diseño Synthwave/Retrowave

Un sistema de diseño modular completo para crear juegos de ajedrez con estética **neon** inspirada en los **años 80**.

## 🗂️ Estructura del Proyecto

```
📁 Multiajedrez 2025/
├── 📄 index.html                    # Página principal
├── 📁 assets/
│   ├── 📁 css/
│   │   └── neonchess-style.css      # Sistema de estilos completo
│   ├── 📁 js/
│   │   └── neonchess-effects.js     # Sistema de efectos interactivos
│   └── 📁 images/
├── 📁 games/
│   ├── knight-quest/
│   ├── vision-blitz/
│   ├── square-rush/
│   ├── tactic-burst/
│   ├── checkmate-countdown/
│   └── memory-matrix/
└── 📁 docs/
    ├── README.md
    ├── STYLE-GUIDE.md
    └── COMPONENTS.md
```

## 🚀 Inicio Rápido

### 1. **Incluir el Sistema NeonChess**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- NeonChess System Styles -->
    <link rel="stylesheet" href="assets/css/neonchess-style.css">
</head>
<body>
    <!-- Tu contenido aquí usando clases NeonChess -->
    
    <!-- NeonChess Interactive System -->
    <script src="assets/js/neonchess-effects.js"></script>
</body>
</html>
```

### 2. **Usar Componentes Básicos**

```html
<!-- Contenedor principal -->
<div class="neon-container neon-grid-bg">
    
    <!-- Título principal -->
    <h1 class="neon-title">Mi Juego de Ajedrez</h1>
    <p class="neon-subtitle">Subtítulo épico</p>
    
    <!-- Botones -->
    <button class="neon-arcade-btn red">Jugar</button>
    <a href="#" class="neon-pill primary">Opciones</a>
    
    <!-- Tarjeta de juego -->
    <div class="neon-card">
        <div class="neon-card-icon large">🐴</div>
        <h2 class="neon-heading">Knight Quest</h2>
        <p class="neon-text">Descripción del juego...</p>
        <button class="neon-play-btn">Jugar</button>
    </div>
    
</div>
```

## 🎨 **Paleta de Colores NeonChess**

```css
:root {
    --neon-cyan: #00ffff;        /* Cian neón */
    --neon-magenta: #ff0080;     /* Magenta neón */
    --neon-green: #00ff80;       /* Verde neón */
    --neon-orange: #ff8000;      /* Naranja neón */
    --neon-blue: #0080ff;        /* Azul neón */
    --neon-purple: #8000ff;      /* Púrpura neón */
    --neon-yellow: #ffff00;      /* Amarillo neón */
}
```

## 🧩 **Componentes Principales**

### **Botones**
- `.neon-pill` - Botones redondeados tipo píldora
- `.neon-arcade-btn` - Botones arcade retro con sombras 3D
- `.neon-play-btn` - Botones pequeños de juego

### **Tarjetas**
- `.neon-card` - Tarjetas de contenido con efectos glass
- `.neon-card-icon` - Iconos para tarjetas (`.large` para más grande)

### **Tipografía**
- `.neon-title` - Títulos principales con gradiente animado
- `.neon-subtitle` - Subtítulos con efecto pulse
- `.neon-heading` - Encabezados de sección
- `.neon-text` - Texto normal

### **Layout**
- `.neon-container` - Contenedor principal
- `.neon-section` - Secciones de contenido
- `.neon-grid` / `.neon-grid-auto` - Sistemas de grilla
- `.neon-flex` - Flexbox con gap

### **Elementos Especiales**
- `.neon-pieces` - Contenedor para piezas de ajedrez
- `.neon-piece` - Piezas interactivas flotantes
- `.neon-coin-counter` - Contador de monedas flotante

## ⚡ **Sistema de Efectos JavaScript**

### **API Global: `window.NeonChess`**

```javascript
// Crear partículas manualmente
NeonChess.createParticles(x, y, color);

// Añadir monedas
NeonChess.addCoins(100);

// Screen shake
NeonChess.screenShake();

// Cambiar color de power-ups
NeonChess.setPowerUpColor('#ff0080');
```

### **Efectos Automáticos**
- ✨ **Partículas de clic** en elementos interactivos
- 🌊 **Ondas de choque** en piezas de ajedrez
- 💥 **Explosiones** en botones arcade
- 🎭 **Parallax** en tarjetas
- 🪙 **Sistema de monedas** automático
- ⚡ **Power-ups** flotantes aleatorios

## 📱 **Responsive Design**

El sistema es completamente responsive:
- **Desktop**: Experiencia completa con todos los efectos
- **Tablet**: Adaptación automática de grillas
- **Mobile**: Optimización táctil y reducción de animaciones

## 🎯 **Casos de Uso**

### **Para Crear un Juego Nuevo**

1. Crea carpeta en `games/mi-juego/`
2. Crea `index.html` con el sistema NeonChess
3. Añade tu lógica de juego específica
4. Usa los componentes y efectos predefinidos

### **Para Personalizar Colores**

```css
/* En tu CSS personalizado */
:root {
    --neon-cyan: #ff00ff;  /* Cambiar cian por magenta */
}
```

### **Para Añadir Nuevos Efectos**

```javascript
// Extender el sistema
window.neonChessEffects.setupCustomEffect = function() {
    // Tu efecto personalizado
};
```

## 🔧 **Configuración y Personalización**

### **Variables CSS Principales**
```css
:root {
    /* Colores (ver paleta arriba) */
    
    /* Spacing */
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    
    /* Transiciones */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.4s ease;
    --transition-slow: 0.6s ease;
    
    /* Efectos glow */
    --glow-small: 0 0 10px;
    --glow-medium: 0 0 20px;
    --glow-large: 0 0 30px;
}
```

## 🎮 **Lista de Juegos Planificados**

1. **🐴 Knight Quest** - Tour del caballo
2. **⚡ Vision Blitz** - Reconocimiento táctico
3. **🎯 Square Rush** - Navegación por coordenadas
4. **💥 Tactic Burst** - Patrones tácticos en cadena
5. **🏆 Checkmate Countdown** - Mate en X jugadas
6. **🧠 Memory Matrix** - Memorización de posiciones

## 🚀 **Próximos Pasos**

1. ✅ Crear sistema modular CSS/JS
2. ✅ Implementar efectos interactivos
3. ✅ Documentar componentes
4. 🔄 Crear juego Knight Quest
5. ⏳ Implementar sistema de puntuaciones
6. ⏳ Añadir PWA capabilities
7. ⏳ Crear más juegos
8. ⏳ Sistema de usuarios y rankings

## 📞 **Soporte**

Para preguntas sobre el sistema NeonChess:
- 📧 Email: [tu-email]
- 🐙 GitHub: [tu-repo]
- 📖 Docs: Ver carpeta `docs/`

---

**🎮 ¡Que comience el juego neón!**