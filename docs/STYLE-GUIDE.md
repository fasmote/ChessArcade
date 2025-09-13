# 🎨 NeonChess - Guía de Estilo

## 🌈 **Sistema de Colores**

### **Paleta Principal**
```css
--neon-cyan: #00ffff      /* Cian brillante */
--neon-magenta: #ff0080   /* Magenta vibrante */
--neon-green: #00ff80     /* Verde neón */
--neon-orange: #ff8000    /* Naranja eléctrico */
--neon-blue: #0080ff      /* Azul neón */
--neon-purple: #8000ff    /* Púrpura futurista */
--neon-yellow: #ffff00    /* Amarillo intenso */
--neon-pink: #ff0040      /* Rosa neón */
```

### **Paleta de Fondo**
```css
--dark-bg: #0a0a0a           /* Negro profundo */
--dark-secondary: #1a0033    /* Púrpura oscuro */
--dark-accent: #330066       /* Púrpura medio */
--dark-surface: rgba(0, 0, 0, 0.8)      /* Negro translúcido */
--dark-surface-glass: rgba(26, 0, 51, 0.6)  /* Efecto glass */
```

### **Uso de Colores**

| Color | Uso Principal | Casos de Uso |
|-------|---------------|--------------|
| **Cyan** | Texto principal, bordes | Títulos, enlaces, bordes principales |
| **Magenta** | Botones primarios | CTA, elementos destacados |
| **Green** | Éxito, confirmaciones | Notificaciones positivas, power-ups |
| **Orange** | Alertas, energía | Botones secundarios, elementos activos |
| **Blue** | Información | Botones informativos, elementos secundarios |
| **Purple** | Elementos especiales | Efectos únicos, elementos premium |
| **Yellow** | Atención, monedas | Contador de monedas, alertas importantes |
| **Pink** | Elementos femeninos | Variaciones de magenta, elementos suaves |

## ✍️ **Tipografía**

### **Fuente Principal: Orbitron**
- **Familia**: `'Orbitron', monospace`
- **Pesos disponibles**: 400, 700, 900
- **Características**: Futurista, tecnológica, legible

### **Jerarquía Tipográfica**
```css
.neon-title        /* 4.5rem - 900 weight - Gradiente animado */
.neon-subtitle     /* 1.4rem - 400 weight - Cyan con pulse */
.neon-heading      /* 1.5rem - 700 weight - Cyan con glow */
.neon-text         /* 1rem - 400 weight - Texto secundario */
```

### **Efectos de Texto**
- **Gradient Shift**: Animación de gradiente en títulos principales
- **Neon Pulse**: Efecto de pulso en subtítulos
- **Text Shadow**: Glow sutil en headings
- **Letter Spacing**: Espaciado amplio para look futurista

## 🎭 **Efectos Visuales**

### **Glow System**
```css
--glow-small: 0 0 10px    /* Elementos pequeños */
--glow-medium: 0 0 20px   /* Elementos medianos */
--glow-large: 0 0 30px    /* Elementos grandes */
--glow-extra: 0 0 40px    /* Efectos especiales */
```

### **Gradientes Característicos**
```css
/* Gradiente principal (botones, fondos) */
linear-gradient(45deg, var(--neon-magenta), var(--neon-orange))

/* Gradiente de título */
linear-gradient(45deg, var(--neon-magenta), var(--neon-green), var(--neon-blue), var(--neon-orange))

/* Gradiente de superficie */
linear-gradient(145deg, var(--dark-surface), var(--dark-surface-glass))
```

### **Sombras y Profundidad**
- **Cards**: `backdrop-filter: blur(10px)` + bordes neón
- **Buttons**: Sistema de sombras múltiples para efecto 3D
- **Elements**: Box-shadow con colores de la paleta

## 🎬 **Animaciones**

### **Timing Functions**
```css
--transition-fast: 0.2s ease     /* Interacciones rápidas */
--transition-normal: 0.4s ease   /* Transiciones estándar */
--transition-slow: 0.6s ease     /* Efectos dramáticos */
```

### **Animaciones Clave**
- **Float**: Movimiento vertical suave para elementos flotantes
- **Pulse**: Cambio de opacidad para llamar atención
- **Bounce**: Rebote sutil para elementos interactivos
- **Spin**: Rotación para loading y elementos dinámicos
- **Shimmer**: Efecto de brillo que recorre elementos

### **Performance Guidelines**
- Usar `transform` y `opacity` para animaciones suaves
- Evitar animar `width`, `height`, `top`, `left`
- Aplicar `will-change` solo cuando sea necesario
- Limitar animaciones simultáneas en móviles

## 📐 **Sistema de Espaciado**

### **Escala de Espacios**
```css
--space-xs: 0.5rem    /* 8px */
--space-sm: 1rem      /* 16px */
--space-md: 1.5rem    /* 24px */
--space-lg: 2rem      /* 32px */
--space-xl: 3rem      /* 48px */
--space-xxl: 4rem     /* 64px */
```

### **Border Radius**
```css
--radius-sm: 8px      /* Elementos pequeños */
--radius-md: 15px     /* Tarjetas, botones */
--radius-lg: 20px     /* Containers grandes */
--radius-pill: 50px   /* Botones píldora */
```

## 🎯 **Componentes Específicos**

### **Botones**
- **Arcade**: Sombras múltiples, gradientes retro, efectos de presión
- **Pills**: Border neón, efecto de llenado, hover suave
- **Play**: Gradiente dinámico, glow, escalado en hover

### **Cards**
- **Background**: Glass effect con blur
- **Border**: Border-image con gradiente
- **Hover**: Levitación + parallax + shimmer
- **Content**: Iconos grandes, texto claro, CTA visible

### **Pieces (Ajedrez)**
- **Design**: Gradientes alternos, bordes neón
- **Animation**: Flotación continua con delays
- **Interaction**: Spin dramático + shockwave al click

## 📱 **Responsive Design**

### **Breakpoints**
```css
/* Mobile First Approach */
/* Base: 320px+ (móviles) */
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large screens */ }
```

### **Adaptaciones por Pantalla**
- **Mobile**: Botones más grandes, espaciado reducido, 1 columna
- **Tablet**: Grillas 2-3 columnas, efectos reducidos
- **Desktop**: Experiencia completa, todos los efectos

## 🎪 **Efectos Interactivos**

### **JavaScript Effects**
- **Particles**: Sistema de partículas con canvas
- **Screen Shake**: Vibración sutil para impacto
- **Parallax**: Movimiento 3D en tarjetas
- **Shockwaves**: Ondas expansivas desde elementos

### **Event Triggers**
- **Click**: Partículas + efectos específicos
- **Hover**: Glow + transformaciones
- **Focus**: Bordes destacados para accesibilidad
- **Success**: Animaciones de celebración

## ♿ **Accesibilidad**

### **Guidelines**
- **Contrast**: Mínimo 4.5:1 para texto normal
- **Focus**: Indicadores visibles en todos los elementos
- **Motion**: Respetar `prefers-reduced-motion`
- **Screen Readers**: ARIA labels en elementos interactivos

### **Keyboard Navigation**
- **Tab Order**: Lógico y visible
- **Enter/Space**: Activación de botones
- **Arrow Keys**: Navegación en grids (donde aplique)
- **Escape**: Cerrar modales/overlays

## 🔧 **Best Practices**

### **CSS**
- Usar custom properties para consistencia
- Componentes modulares y reutilizables
- Evitar `!important` excepto para utilidades
- Comentar secciones complejas

### **JavaScript**
- Clases ES6+ para organización
- Event delegation para performance
- Cleanup de event listeners
- Graceful degradation sin JavaScript

### **Performance**
- Lazy loading para elementos no críticos
- Debounce en eventos frecuentes
- CSS containment para aislamiento
- Optimización de animaciones

---

## 🎨 **Ejemplo de Implementación**

```html
<div class="neon-container neon-grid-bg">
    <h1 class="neon-title">Mi Juego</h1>
    <div class="neon-card">
        <div class="neon-card-icon large">🎮</div>
        <h2 class="neon-heading">Título</h2>
        <p class="neon-text neon-mb-md">Descripción...</p>
        <button class="neon-play-btn">Jugar</button>
    </div>
</div>
```

Esta guía asegura que todos los elementos del **NeonChess System** mantengan consistencia visual y funcional en todo el proyecto ChessArcade.