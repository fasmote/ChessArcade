# ChessArcade - Proyecto Context

## 🎮 Descripción del Proyecto
ChessArcade es una plataforma web de minijuegos de ajedrez con estética arcade retro-futurista (synthwave/cyberpunk). Transforma el aprendizaje del ajedrez en una experiencia gamificada.

## 🎯 Stack Técnico ACORDADO
- **Frontend**: HTML + CSS + JavaScript vanilla (Deploy: Hostinger Premium)
- **Backend**: Vercel Functions + PostgreSQL (Deploy: Vercel)
- **CDN**: Librerías externas (Howler.js para sonidos, etc.)

## 📁 Estructura de Carpetas EXACTA
```
ChessArcade/
├── frontend/                    # → Hostinger Premium
│   ├── index.html              # Landing page arcade
│   ├── games/
│   │   ├── knight-quest.html
│   │   ├── vision-blitz.html
│   │   ├── square-rush.html
│   │   ├── tactic-burst.html
│   │   ├── checkmate-countdown.html
│   │   └── memory-matrix.html
│   ├── css/
│   │   ├── arcade-styles.css   # Estilos principales
│   │   └── game-styles.css     # Estilos específicos juegos
│   ├── js/
│   │   ├── game-engine.js      # Lógica común juegos
│   │   ├── api-client.js       # Conexión con backend
│   │   ├── knight-quest.js
│   │   ├── vision-blitz.js
│   │   ├── square-rush.js
│   │   ├── tactic-burst.js
│   │   ├── checkmate-countdown.js
│   │   └── memory-matrix.js
│   └── assets/
│       ├── sounds/
│       ├── images/
│       └── icons/
└── backend/                     # → Vercel Functions
    ├── api/
    │   ├── users.js            # /api/users
    │   ├── games.js            # /api/games  
    │   ├── scores.js           # /api/scores
    │   └── leaderboard.js      # /api/leaderboard
    ├── package.json
    └── vercel.json

## 🎨 Estética Visual DEFINIDA
- **Fuente Principal**: 'Orbitron' (Google Fonts)
- **Colores Neón**: #ff0080 (rosa), #00ff80 (verde), #0080ff (azul), #00ffff (cyan)
- **Fondo**: Gradiente oscuro + grid animado con líneas cyan
- **Efectos**: Gradientes animados, glow, shadows, floating, pulse, shine
- **Tema**: Synthwave/Cyberpunk/Retro-futurista

## 🕹️ Minijuegos Planeados (6 total)
1. **Knight Quest** (🐴) - Dominar el tour del caballo
2. **Vision Blitz** (⚡) - Reconocimiento táctico rápido
3. **Square Rush** (🎯) - Navegación coordenadas A1-H8
4. **Tactic Burst** (💥) - Cadenas patrones tácticos
5. **Checkmate Countdown** (🏆) - Mate en X movimientos
6. **Memory Matrix** (🧠) - Memorización posiciones

## 🚀 Prioridades CRÍTICAS (SIEMPRE incluir)
1. **Mobile First**: Diseñar primero para móvil
2. **Google AdSense**: `ca-pub-2472413468382197`
3. **Google Analytics**: `G-N3EKXHPD5Y` 
4. **Accesibilidad**: ARIA labels, keyboard navigation
5. **Performance**: Lazy loading, code splitting
6. **SEO**: Meta tags, structured data
7. **Seguridad**: Sanitizar inputs, HTTPS only

## 📊 Scripts OBLIGATORIOS (incluir en TODAS las páginas HTML)

### Google AdSense
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2472413468382197" crossorigin="anonymous"></script>
```

### Google Analytics
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N3EKXHPD5Y"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-N3EKXHPD5Y');
</script>
```

## 🎯 Funcionalidades Core
- Sistema usuarios y autenticación
- Puntuaciones y leaderboards globales
- Sistema monedas/recompensas
- Sonidos arcade (Howler.js)
- Animaciones suaves y responsive
- Guardado local + sincronización server

## 🔗 Enlaces Importantes
- **Repositorio**: https://github.com/fasmote/ChessArcade
- **Hostinger Referral**: https://hostinger.com.ar?REFERRALCODE=KHYCLAUDI5C6