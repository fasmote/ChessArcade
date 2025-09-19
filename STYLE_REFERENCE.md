# ChessArcade - Referencia de Estilo Visual

## 🎨 Paleta de Colores EXACTA
```css
/* Colores principales neón */
#ff0080  /* Rosa neón */
#00ff80  /* Verde neón */  
#0080ff  /* Azul neón */
#00ffff  /* Cyan */
#ffd700  /* Dorado (monedas) */

/* Colores de soporte */
#0a0a0a  /* Negro profundo */
#1a0033  /* Morado oscuro */
#330066  /* Morado medio */
#ffffff  /* Blanco */
#cccccc  /* Gris claro */
```

## 📝 Fuentes
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

font-family: 'Orbitron', monospace;
```

## 🌟 Efectos CSS Clave

### Gradientes Animados
```css
background: linear-gradient(45deg, #ff0080, #00ff80, #0080ff, #ff8000);
background-size: 400% 400%;
animation: gradientShift 3s ease-in-out infinite;

@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}
```

### Grid Animado de Fondo
```css
background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
background-size: 50px 50px;
animation: gridMove 20s linear infinite;

@keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
}
```

### Efectos Glow/Sombras
```css
text-shadow: 0 0 30px rgba(255, 0, 128, 0.5);
box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
filter: drop-shadow(0 0 10px rgba(0, 255, 128, 0.3));
```

### Floating Animation
```css
@keyframes float {
    0%, 100% { transform: translateY(0px) rotateZ(0deg); }
    50% { transform: translateY(-10px) rotateZ(5deg); }
}
```

### Pulse Effect
```css
@keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
}
```

### Shine Effect
```css
@keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%) rotate(45deg); opacity: 0; }
}
```

## 🎯 Componentes Base

### Logo Principal
- Font-size: 4rem (mobile: 2.5rem)
- Font-weight: 900
- Gradient text con animación
- Letter-spacing: 0.2em

### Cards de Juego
- Fondo: rgba(0, 0, 0, 0.7)
- Border gradient animado
- Hover: translateY(-10px) + scale(1.02)
- Efecto shine en hover

### Botones CTA
- Border-radius: 50px
- Padding: 1rem 2rem
- Transform en hover: translateY(-3px)
- Gradientes: primary (#ff0080 → #ff4040), secondary (transparent + border cyan)

### Contador de Monedas
- Position: fixed top-right
- Background: rgba(0, 0, 0, 0.8)
- Border: 2px solid #ffd700
- Icono de moneda con rotateY spin

## 📱 Responsive Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
    .logo-text { font-size: 2.5rem; }
    .games-grid { grid-template-columns: 1fr; }
    .piece { width: 50px; height: 50px; }
}

/* Desktop */
@media (min-width: 769px) {
    .games-grid { 
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    }
}
```

## 🏗️ Estructura HTML Base
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChessArcade - [Título Página]</title>
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-N3EKXHPD5Y"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-N3EKXHPD5Y');
    </script>
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2472413468382197" crossorigin="anonymous"></script>
    
    <!-- Fuentes -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    
    <!-- Estilos -->
    <link rel="stylesheet" href="../css/arcade-styles.css">
</head>
<body>
    <div class="arcade-container">
        <!-- Grid de fondo automático -->
        <!-- Contenido aquí -->
    </div>
</body>
</html>
```