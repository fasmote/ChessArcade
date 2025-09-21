# 🎮 ChessArcade - Vision Blitz MVP
## Proyecto de Desarrollo Completo

---

## 📋 **INFORMACIÓN DEL PROYECTO**

- **Nombre**: Vision Blitz MVP  
- **Plataforma**: ChessArcade
- **Tipo**: Juego arcade de reconocimiento táctico
- **Target**: Desde niños de 4 años hasta Grandes Maestros
- **Repositorio**: https://github.com/fasmote/ChessArcade
- **Carpeta**: `C:\Users\clau\Documents\Multiajedrez 2025`
- **Fecha inicio**: Septiembre 2025
- **Estado**: 📋 En planificación

---

## 🎯 **OBJETIVO DEL PROYECTO**

Desarrollar **Vision Blitz**, el tercer juego de ChessArcade, enfocado en **reconocimiento táctico ultra-rápido**. El jugador ve una posición de ajedrez brevemente y debe identificar la mejor jugada táctica entre opciones múltiples.

### 🎮 **Concepto de Juego**
1. **Mostrar posición** de ajedrez (2-10 segundos según nivel)
2. **Posición desaparece** (pantalla en negro con efecto neon)
3. **Aparecen 4 opciones** de jugadas en notación algebraica
4. **Jugador elige** la correcta haciendo click
5. **Feedback inmediato** (correcto/incorrecto con efectos)
6. **Nueva posición** más difícil

---

## 👥 **AUDIENCIA OBJETIVO EXPANDIDA**

### 🧒 **NIÑOS PEQUEÑOS (4-6 años)**
- **UI**: Coordenadas GIGANTES, colores súper brillantes
- **Contenido**: Solo 3 piezas (2 reyes + 1 pieza atacante)
- **Tiempo**: 10 segundos de visualización
- **Ayudas**: Iconos de piezas + flechas de movimiento
- **Tablero**: Siempre blancas abajo, coordenadas visibles

### 👦 **NIÑOS (7-10 años)**
- **UI**: Interfaz colorida, animaciones divertidas
- **Contenido**: 4-6 piezas, mates en 1 básicos
- **Tiempo**: 6-8 segundos de visualización
- **Ayudas**: Coordenadas opcionales, hints visuales
- **Tablero**: Blancas abajo, toggle coordenadas

### 🌟 **INTERMEDIOS (11-16 años)**
- **UI**: Interfaz balanceada, efectos arcade
- **Contenido**: Horquillas, clavadas, ataques dobles
- **Tiempo**: 4-5 segundos de visualización
- **Ayudas**: Solo coordenadas en bordes
- **Tablero**: Ocasionalmente rotado, toggle coordenadas

### 🏆 **AVANZADOS (17+ años y GMs)**
- **UI**: Interfaz limpia, minimalista
- **Contenido**: Combinaciones complejas, sacrificios
- **Tiempo**: 2-3 segundos de visualización
- **Ayudas**: Sin ayudas visuales
- **Tablero**: Rotación aleatoria, sin coordenadas

---

## 🏗️ **ARQUITECTURA DEL PROYECTO**

### 📁 **Estructura de Archivos**
```
ChessArcade/
├── games/
│   ├── knight-quest/           # ✅ Ya existe
│   ├── square-rush/            # ✅ Ya existe  
│   └── vision-blitz/           # 🚧 Nuevo
│       ├── index.html          # Juego principal
│       ├── vision-blitz.css    # Estilos específicos
│       ├── vision-blitz.js     # Lógica del juego
│       ├── tactics-database.js # Posiciones tácticas
│       └── vision-blitz-engine.js # Motor de juego
├── assets/
│   ├── css/
│   │   └── chessarcade-shared.css # Estilos compartidos
│   ├── js/
│   │   ├── chess-engine.js     # Motor compartido
│   │   ├── ui-components.js    # Componentes UI
│   │   └── audio-manager.js    # Control de audio
│   └── sounds/
│       ├── correct.wav
│       ├── wrong.wav
│       └── level-up.wav
└── index.html                  # Landing page
```

### 🎨 **Coherencia Visual (ChessArcade System)**

#### **Elementos Compartidos OBLIGATORIOS**
```css
/* 🎨 Paleta de colores unificada */
:root {
    --neon-cyan: #00ffff;      /* Primario */
    --neon-green: #00ff80;     /* Success/Correct */
    --neon-pink: #ff0080;      /* Branding/Error */
    --neon-blue: #0080ff;      /* Secondary */
    --neon-orange: #ff8000;    /* Combo/Special */
    --gold: #ffd700;           /* Score */
    --dark-bg: linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #330066 100%);
}

/* 🎯 Grid background animado */
.chess-arcade-bg::before {
    background-image: 
        linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
}

/* 🔊 Botón de sonido flotante (OBLIGATORIO) */
.sound-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid var(--neon-cyan);
    border-radius: 50%;
    font-size: 1.5rem;
    color: var(--neon-cyan);
    z-index: 1000;
}

/* 🏠 Botón HOME flotante (NUEVO - OBLIGATORIO) */
.home-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid var(--neon-green);
    border-radius: 50%;
    font-size: 1.5rem;
    color: var(--neon-green);
    z-index: 1000;
}
```

---

## 🎮 **ESPECIFICACIONES DEL JUEGO - 10 NIVELES**

### 🏆 **Sistema de Niveles MVP Expandido**

```javascript
const VISION_BLITZ_LEVELS = {
    1: {
        name: "FIRST STEPS",
        description: "Solo 3 piezas: encuentra el mate",
        viewTime: 10000,       // 10 segundos para niños pequeños
        puzzleCount: 3,
        difficulty: "mate_3_pieces",
        pieceCount: 3,         // 2 reyes + 1 pieza
        targetAge: "4-5 años",
        boardRotation: false,
        coordinatesDefault: true,
        coordinatesToggle: false
    },
    2: {
        name: "BABY STEPS",
        description: "Mates simples con pocas piezas",
        viewTime: 8000,        // 8 segundos
        puzzleCount: 4,
        difficulty: "mate_few_pieces",
        pieceCount: "4-5",
        targetAge: "5-6 años",
        boardRotation: false,
        coordinatesDefault: true,
        coordinatesToggle: true
    },
    3: {
        name: "PATTERN ROOKIE",
        description: "Mates en 1 básicos",
        viewTime: 6000,        // 6 segundos
        puzzleCount: 5,
        difficulty: "mate_in_1_basic",
        pieceCount: "6-8",
        targetAge: "6-8 años",
        boardRotation: false,
        coordinatesDefault: true,
        coordinatesToggle: true
    },
    4: {
        name: "QUICK EYES", 
        description: "Reconoce clavadas simples",
        viewTime: 5000,        // 5 segundos
        puzzleCount: 6,
        difficulty: "pin_basic",
        pieceCount: "8-10",
        targetAge: "8-10 años",
        boardRotation: false,
        coordinatesDefault: true,
        coordinatesToggle: true
    },
    5: {
        name: "SPEED VISION",
        description: "Identifica horquillas",
        viewTime: 4000,        // 4 segundos
        puzzleCount: 8,
        difficulty: "fork_intermediate",
        pieceCount: "10-12",
        targetAge: "10-12 años",
        boardRotation: false,
        coordinatesDefault: false,
        coordinatesToggle: true
    },
    6: {
        name: "PATTERN SCOUT",
        description: "Ataques dobles y descubiertos",
        viewTime: 3500,        // 3.5 segundos
        puzzleCount: 10,
        difficulty: "double_attack",
        pieceCount: "12-15",
        targetAge: "12-14 años",
        boardRotation: true,   // ¡Empieza rotación!
        coordinatesDefault: false,
        coordinatesToggle: true
    },
    7: {
        name: "TACTICAL NINJA",
        description: "Rayos X y clavadas complejas",
        viewTime: 3000,        // 3 segundos
        puzzleCount: 12,
        difficulty: "xray_advanced",
        pieceCount: "15-18",
        targetAge: "14-16 años",
        boardRotation: true,
        coordinatesDefault: false,
        coordinatesToggle: true
    },
    8: {
        name: "VISION MASTER",
        description: "Combinaciones tácticas",
        viewTime: 2500,        // 2.5 segundos
        puzzleCount: 15,
        difficulty: "combination_intermediate",
        pieceCount: "18-22",
        targetAge: "16+ años",
        boardRotation: true,
        coordinatesDefault: false,
        coordinatesToggle: true
    },
    9: {
        name: "GRANDMASTER SIGHT",
        description: "Sacrificios y ataques complejos",
        viewTime: 2000,        // 2 segundos
        puzzleCount: 18,
        difficulty: "sacrifice_advanced",
        pieceCount: "20-25",
        targetAge: "Avanzados",
        boardRotation: true,
        coordinatesDefault: false,
        coordinatesToggle: false  // Sin coordenadas
    },
    10: {
        name: "QUANTUM VISION",
        description: "Nivel Maestro Internacional",
        viewTime: 1500,        // 1.5 segundos - extremo
        puzzleCount: 20,
        difficulty: "master_level",
        pieceCount: "25-32",
        targetAge: "Maestros/GMs",
        boardRotation: true,
        coordinatesDefault: false,
        coordinatesToggle: false
    }
}
```

---

## 🎮 **ESTRUCTURA HTML COMPLETA**

### 📄 **vision-blitz/index.html**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vision Blitz - ChessArcade</title>
    <meta name="description" content="Entrena tu visión táctica con Vision Blitz. Reconoce patrones de ajedrez en segundos desde nivel principiante hasta Gran Maestro.">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    
    <!-- OBLIGATORIOS: Google AdSense + Analytics -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2472413468382197" crossorigin="anonymous"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-N3EKXHPD5Y"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-N3EKXHPD5Y');
    </script>
    
    <!-- Estilos -->
    <link rel="stylesheet" href="../../assets/css/chessarcade-shared.css">
    <link rel="stylesheet" href="vision-blitz.css">
</head>
<body>
    <div class="game-container chess-arcade-bg">
        
        <!-- OBLIGATORIOS: Botones flotantes -->
        <div class="home-toggle" id="homeBtn" title="Volver al inicio">🏠</div>
        <div class="sound-toggle" id="soundToggle" title="Toggle Sound">🔊</div>
        
        <!-- Header del juego -->
        <div class="game-header">
            <div class="game-title">⚡ VISION BLITZ</div>
            <div class="game-subtitle">Lightning-fast tactical recognition!</div>
        </div>
        
        <!-- UI de estado del juego -->
        <div class="game-ui">
            <div class="level-info">
                <div class="level-number" id="levelNumber">1</div>
                <div class="level-name" id="levelName">FIRST STEPS</div>
                <div class="level-description" id="levelDescription">Solo 3 piezas: encuentra el mate</div>
            </div>
            
            <div class="timer-display">
                <div class="timer-label">Tiempo de vista:</div>
                <div class="timer" id="viewTimer">10.0s</div>
            </div>
            
            <div class="score-info">
                <div class="score">Score: <span id="score">0</span></div>
                <div class="streak">Racha: <span id="streak">0</span></div>
                <div class="progress">
                    <span id="puzzleProgress">1</span>/<span id="totalPuzzles">3</span>
                </div>
            </div>
        </div>
        
        <!-- Banner Ad Superior -->
        <div class="ad-banner-top">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="1234567890" data-ad-format="auto"></ins>
        </div>
        
        <!-- Área de visualización de posición -->
        <div class="position-display" id="positionDisplay">
            <div class="chess-board" id="chessBoard">
                <!-- Tablero generado por JS -->
            </div>
            <div class="position-overlay" id="positionOverlay">
                <div class="overlay-text">¡Memoriza la posición!</div>
                <div class="overlay-countdown" id="overlayCountdown">10</div>
            </div>
            <div class="rotation-indicator" id="rotationIndicator" style="display: none;">🔄</div>
        </div>
        
        <!-- Control de coordenadas -->
        <div class="coordinates-toggle" id="coordinatesToggle">
            <button class="coordinates-btn" id="coordinatesBtn">OCULTAR COORDENADAS</button>
        </div>
        
        <!-- Opciones de respuesta -->
        <div class="answer-options" id="answerOptions" style="display: none;">
            <div class="options-header">¿Cuál es la mejor jugada?</div>
            <div class="options-grid" id="optionsGrid">
                <!-- Opciones generadas dinámicamente por JS -->
            </div>
        </div>
        
        <!-- Feedback de respuesta -->
        <div class="feedback-display" id="feedbackDisplay" style="display: none;">
            <div class="feedback-icon" id="feedbackIcon">✅</div>
            <div class="feedback-text" id="feedbackText">¡Correcto!</div>
            <div class="feedback-explanation" id="feedbackExplanation">La torre da mate en la última fila</div>
            <div class="feedback-hint" id="feedbackHint">El rey no puede escapar</div>
        </div>
        
        <!-- Controles del juego -->
        <div class="game-controls">
            <button class="btn btn-primary" id="startBtn">EMPEZAR JUEGO</button>
            <button class="btn btn-secondary" id="pauseBtn" disabled>PAUSA</button>
            <button class="btn btn-secondary" id="hintBtn" disabled>PISTA</button>
            <button class="btn btn-secondary" id="skipBtn" disabled>SALTAR PUZZLE</button>
        </div>
        
        <!-- Pantalla de Game Over -->
        <div class="game-over" id="gameOverScreen">
            <div class="game-over-content">
                <div class="game-over-title" id="gameOverTitle">¡NIVEL COMPLETADO!</div>
                <div class="final-stats">
                    <div class="final-score">Puntuación: <span id="finalScore">0</span></div>
                    <div class="accuracy-stats">Precisión: <span id="accuracyStats">0%</span></div>
                    <div class="time-stats">Tiempo promedio: <span id="timeStats">0s</span></div>
                    <div class="level-badge" id="levelBadge">🏆 Primer Nivel Completado</div>
                </div>
                
                <!-- Banner Ad Interstitial -->
                <div class="ad-interstitial">
                    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="9876543210" data-ad-format="auto"></ins>
                </div>
                
                <div class="game-over-actions">
                    <button class="btn btn-primary" id="nextLevelBtn">SIGUIENTE NIVEL</button>
                    <button class="btn btn-secondary" id="playAgainBtn">JUGAR DE NUEVO</button>
                    <button class="btn btn-secondary" id="mainMenuBtn">MENÚ PRINCIPAL</button>
                </div>
            </div>
        </div>
        
        <!-- Banner Ad Inferior -->
        <div class="ad-banner-bottom">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="5555555555" data-ad-format="auto"></ins>
        </div>
        
    </div>
    
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
    <script src="../../assets/js/chess-engine.js"></script>
    <script src="../../assets/js/audio-manager.js"></script>
    <script src="tactics-database.js"></script>
    <script src="vision-blitz-engine.js"></script>
    <script src="vision-blitz.js"></script>
    
    <!-- AdSense Script -->
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
        (adsbygoogle = window.adsbygoogle || []).push({});
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>
```

---

## 🔧 **IMPLEMENTACIÓN TÉCNICA COMPLETA**

### 🎮 **Main Game Logic (vision-blitz.js)**

```javascript
// vision-blitz.js - Lógica principal del juego

class VisionBlitzGame {
    constructor() {
        this.engine = new VisionBlitzEngine();
        this.init();
    }
    
    init() {
        // Setup inicial
        this.setupEventListeners();
        this.engine.loadPreferences();
        this.updateUI();
        
        // Inicializar Google Analytics
        gtag('event', 'game_init', {
            'game': 'vision_blitz',
            'version': '1.0'
        });
    }
    
    setupEventListeners() {
        // Botones principales
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipPuzzle());
        
        // Botones de game over
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.goHome());
        
        // Botones flotantes (ChessArcade standard)
        document.getElementById('homeBtn').addEventListener('click', () => this.goHome());
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        
        // Control de coordenadas
        document.getElementById('coordinatesBtn').addEventListener('click', () => this.toggleCoordinates());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    startGame() {
        const level = this.engine.gameState.level;
        this.engine.startLevel(level);
        this.updateControlButtons('playing');
        
        // Analytics
        gtag('event', 'game_start', {
            'game': 'vision_blitz',
            'level': level,
            'method': 'button'
        });
    }
    
    pauseGame() {
        if (this.engine.gameState.gameActive) {
            this.engine.pauseGame();
            document.getElementById('pauseBtn').textContent = 'REANUDAR';
        } else {
            this.engine.resumeGame();
            document.getElementById('pauseBtn').textContent = 'PAUSA';
        }
    }
    
    showHint() {
        if (this.engine.gameState.level <= 5) {
            this.engine.showVisualHint();
            
            // Analytics
            gtag('event', 'hint_used', {
                'game': 'vision_blitz',
                'level': this.engine.gameState.level,
                'puzzle_id': this.engine.gameState.currentPuzzle?.id
            });
        }
    }
    
    skipPuzzle() {
        if (this.engine.gameState.streak >= 3) {
            this.engine.skipCurrentPuzzle();
            
            // Analytics
            gtag('event', 'puzzle_skipped', {
                'game': 'vision_blitz',
                'level': this.engine.gameState.level,
                'streak': this.engine.gameState.streak
            });
        }
    }
    
    toggleCoordinates() {
        this.engine.toggleCoordinates();
        const btn = document.getElementById('coordinatesBtn');
        btn.textContent = this.engine.gameState.showCoordinates ? 'OCULTAR COORDENADAS' : 'MOSTRAR COORDENADAS';
    }
    
    toggleSound() {
        this.engine.toggleSound();
        const btn = document.getElementById('soundToggle');
        btn.textContent = this.engine.gameState.soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !this.engine.gameState.soundEnabled);
    }
    
    handleOptionClick(optionIndex) {
        if (!this.engine.gameState.gameActive || this.engine.gameState.viewPhase) return;
        
        const startTime = this.engine.answerStartTime;
        const responseTime = Date.now() - startTime;
        
        this.engine.submitAnswer(optionIndex, responseTime);
        
        // Analytics
        gtag('event', 'answer_submitted', {
            'game': 'vision_blitz',
            'level': this.engine.gameState.level,
            'response_time': responseTime,
            'option_selected': optionIndex
        });
    }
    
    updateUI() {
        const state = this.engine.gameState;
        const levelConfig = VISION_BLITZ_LEVELS[state.level];
        
        // Información del nivel
        document.getElementById('levelNumber').textContent = state.level;
        document.getElementById('levelName').textContent = levelConfig.name;
        document.getElementById('levelDescription').textContent = levelConfig.description;
        
        // Stats del juego
        document.getElementById('score').textContent = state.score;
        document.getElementById('streak').textContent = state.streak;
        document.getElementById('viewTimer').textContent = (levelConfig.viewTime / 1000).toFixed(1) + 's';
        
        // Progreso del nivel
        document.getElementById('puzzleProgress').textContent = state.puzzleIndex + 1;
        document.getElementById('totalPuzzles').textContent = levelConfig.puzzleCount;
        
        // Adaptar UI según edad
        this.engine.adaptUIForAge(state.level);
    }
    
    nextLevel() {
        if (this.engine.gameState.level < 10) {
            this.engine.gameState.level++;
            this.engine.gameState.puzzleIndex = 0;
            this.engine.gameState.streak = 0;
            this.hideGameOverScreen();
            this.updateUI();
            this.updateControlButtons('idle');
            
            // Analytics
            gtag('event', 'level_advance', {
                'game': 'vision_blitz',
                'new_level': this.engine.gameState.level
            });
        } else {
            this.showGameComplete();
        }
    }
    
    playAgain() {
        this.engine.gameState.puzzleIndex = 0;
        this.engine.gameState.score = 0;
        this.engine.gameState.streak = 0;
        this.hideGameOverScreen();
        this.updateUI();
        this.updateControlButtons('idle');
    }
    
    goHome() {
        // Analytics antes de salir
        gtag('event', 'game_exit', {
            'game': 'vision_blitz',
            'level': this.engine.gameState.level,
            'score': this.engine.gameState.score,
            'method': 'home_button'
        });
        
        window.location.href = '../../index.html';
    }
    
    updateControlButtons(gamePhase) {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const hintBtn = document.getElementById('hintBtn');
        const skipBtn = document.getElementById('skipBtn');
        
        switch(gamePhase) {
            case 'idle':
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                hintBtn.disabled = true;
                skipBtn.disabled = true;
                break;
            case 'playing':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                hintBtn.disabled = this.engine.gameState.level > 5;
                skipBtn.disabled = this.engine.gameState.streak < 3;
                break;
        }
    }
    
    showGameOverScreen() {
        document.getElementById('gameOverScreen').style.display = 'flex';
    }
    
    hideGameOverScreen() {
        document.getElementById('gameOverScreen').style.display = 'none';
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (!this.engine.gameState.gameActive) {
                    this.startGame();
                }
                break;
            case 'p':
            case 'P':
                if (this.engine.gameState.gameActive) {
                    this.pauseGame();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                if (!this.engine.gameState.viewPhase && this.engine.gameState.gameActive) {
                    this.handleOptionClick(parseInt(e.key) - 1);
                }
                break;
            case 'h':
            case 'H':
                this.showHint();
                break;
            case 'c':
            case 'C':
                this.toggleCoordinates();
                break;
        }
    }
}

// Inicializar juego cuando la página carga
window.addEventListener('load', () => {
    const game = new VisionBlitzGame();
    
    // Hacer disponible globalmente para debugging
    window.visionBlitzGame = game;
    
    // Tracking de carga completa
    gtag('event', 'page_loaded', {
        'game': 'vision_blitz',
        'load_time': performance.now()
    });
});
```

---

## 📊 **PLAN DE DESARROLLO EXPANDIDO**

### 📅 **Sprint 1 (Semana 1): Fundamentos**
- [ ] Setup de estructura de archivos
- [ ] Engine básico con 10 niveles
- [ ] Sistema de rotación de tablero
- [ ] Base de datos con 100 posiciones (10 por nivel)
- [ ] UI adaptativa por edad

### 📅 **Sprint 2 (Semana 1): UI Avanzada**
- [ ] Sistema de coordenadas inteligente
- [ ] Botones flotantes HOME y SOUND
- [ ] Responsive design para todos los dispositivos
- [ ] Efectos visuales por nivel
- [ ] Testing inicial

### 📅 **Sprint 3 (Semana 2): Polish y Contenido**
- [ ] Todas las 100 posiciones validadas
- [ ] Sistema de hints para niños
- [ ] Audio integration completa
- [ ] Analytics tracking
- [ ] AdSense integration

### 📅 **Sprint 4 (Semana 2): Testing y Launch**
- [ ] Testing cross-browser extensivo
- [ ] Optimización de performance
- [ ] SEO optimization
- [ ] Deploy a producción
- [ ] Monitoring inicial

---

## 🎯 **CRITERIOS DE ÉXITO EXPANDIDOS**

### 📊 **KPIs Específicos por Nivel**

```javascript
const SUCCESS_METRICS = {
    level_1_3: {
        completion_rate: ">80%",  // Niños pequeños
        average_time: "<15min",
        return_rate: ">60%"
    },
    level_4_6: {
        completion_rate: ">70%",  // Intermedios
        average_time: "<12min", 
        progression_rate: ">50%"
    },
    level_7_8: {
        completion_rate: ">60%",  // Avanzados
        average_accuracy: ">75%",
        session_length: ">20min"
    },
    level_9_10: {
        completion_rate: ">40%",  // Maestros
        average_accuracy: ">85%",
        master_retention: ">30%"
    }
};
```

### 🎮 **Cross-Game Metrics**
- **Flow between games**: >35% juegan otro juego
- **ChessArcade session time**: >25 minutos total
- **Return to platform**: >40% vuelven en 7 días

---

## 🚀 **ROADMAP POST-LAUNCH**

### 🔄 **Vision Blitz 2.0 (3-6 meses)**
- [ ] **AI-Generated Puzzles**: Infinite content
- [ ] **Multiplayer Mode**: Duelos en tiempo real
- [ ] **Daily Challenges**: Puzzle del día
- [ ] **Achievement System**: 20+ logros desbloqueables
- [ ] **Custom Difficulty**: Ajuste dinámico por IA

### 🌐 **Vision Blitz 3.0 (6-12 meses)**
- [ ] **Tournament Mode**: Competencias regulares
- [ ] **Coach Mode**: IA que adapta el entrenamiento
- [ ] **Social Features**: Compartir logros
- [ ] **Advanced Analytics**: Heatmaps de debilidades
- [ ] **VR Support**: Tableros en realidad virtual

---

## 💰 **STRATEGY FOR ADSENSE APPROVAL**

### 📈 **Content Volume Strategy**
```
✅ Knight Quest (Existente)
✅ Square Rush (Existente)  
🚧 Vision Blitz (En desarrollo) = 3 juegos
🎯 Objetivo: 6 juegos para aprobación AdSense

Después de Vision Blitz:
🔜 Tactic Burst
🔜 Checkmate Countdown  
🔜 Memory Matrix
```

### 📄 **Additional Pages for SEO**
- `/about.html` - Historia de ChessArcade
- `/how-to-play.html` - Guías de cada juego
- `/privacy-policy.html` - Política de privacidad
- `/terms-of-service.html` - Términos de uso
- `/contact.html` - Formulario de contacto
- `/blog/` - Artículos sobre ajedrez y táctica

### 🎯 **Ad Placement Strategy**
```css
/* Posiciones optimizadas para CTR */
.ad-banner-top: Above game area (728x90)
.ad-banner-bottom: Below controls (728x90)  
.ad-sidebar: Desktop only (300x250)
.ad-interstitial: Between levels (full screen)
.ad-reward: Optional for hints (video ads)
```

---

## ✅ **DEFINITION OF DONE FINAL**

### 🎮 **Funcionalidad Completa**
- [ ] 10 niveles completamente jugables
- [ ] 100 posiciones tácticas validadas
- [ ] Sistema de rotación funcionando
- [ ] UI adaptativa por edad
- [ ] Coordinadas toggle según nivel

### 🎨 **UI/UX Perfecta**
- [ ] Coherencia 100% con ChessArcade
- [ ] Responsive en todos los dispositivos
- [ ] Botones flotantes estándar
- [ ] Efectos visuales por nivel
- [ ] Accesibilidad WCAG AA

### 🔧 **Técnico**
- [ ] Performance Lighthouse >85
- [ ] No memory leaks
- [ ] Cross-browser compatible
- [ ] AdSense integration ready
- [ ] Analytics tracking completo

### 📊 **Business**
- [ ] SEO optimizado
- [ ] Meta tags completos
- [ ] Social sharing ready
- [ ] Privacy policy compliant
- [ ] AdSense approval ready

---

**🎯 ¿LISTO PARA COMENZAR EL DESARROLLO?**

**Este documento único contiene TODO lo necesario para:**
✅ Implementar Vision Blitz completo  
✅ Mantener coherencia con ChessArcade  
✅ Maximizar chances de AdSense approval  
✅ Escalar de 4 años hasta Grandes Maestros  
✅ Preparar para futuras expansiones  

**¿Empezamos con el Sprint 1? 🚀⚡**

---

## 🛠️ **IMPLEMENTACIÓN TÉCNICA DETALLADA**

### 📊 **Gestión de Estado Completa (vision-blitz-engine.js)**

```javascript
// vision-blitz-engine.js - Motor completo del juego

class VisionBlitzEngine {
    constructor() {
        this.gameState = {
            level: 1,
            score: 0,
            streak: 0,
            currentPuzzle: null,
            puzzleIndex: 0,
            gameActive: false,
            gameStarted: false,
            viewPhase: true,
            soundEnabled: true,
            showCoordinates: null,
            boardRotated: false,
            timerInterval: null,
            answerStartTime: 0,
            totalCorrect: 0,
            totalAttempts: 0,
            averageResponseTime: 0,
            sessionStartTime: Date.now(),
            hintsUsed: 0,
            puzzlesSkipped: 0
        };
        
        this.audioManager = new AudioManager();
        this.loadAllPreferences();
        this.setupEventTracking();
    }
    
    // 🔧 Inicialización y configuración
    loadAllPreferences() {
        // Cargar sonido
        const soundPref = localStorage.getItem('visionBlitzSound');
        this.gameState.soundEnabled = soundPref !== 'disabled';
        
        // Cargar nivel guardado
        const savedLevel = localStorage.getItem('visionBlitzLevel');
        if (savedLevel && parseInt(savedLevel) > 1) {
            this.gameState.level = parseInt(savedLevel);
        }
        
        // Cargar preferencia de coordenadas
        const coordPref = localStorage.getItem('visionBlitzCoordinates');
        if (coordPref !== null) {
            this.gameState.showCoordinates = coordPref === 'true';
        }
        
        this.updateSoundButton();
    }
    
    savePreferences() {
        localStorage.setItem('visionBlitzSound', this.gameState.soundEnabled ? 'enabled' : 'disabled');
        localStorage.setItem('visionBlitzLevel', this.gameState.level.toString());
        if (this.gameState.showCoordinates !== null) {
            localStorage.setItem('visionBlitzCoordinates', this.gameState.showCoordinates.toString());
        }
    }
    
    // 🎮 Gestión de niveles
    startLevel(levelNumber) {
        const levelConfig = VISION_BLITZ_LEVELS[levelNumber];
        if (!levelConfig) {
            console.error(`Nivel ${levelNumber} no existe`);
            return;
        }
        
        // Reset estado del nivel
        this.gameState.level = levelNumber;
        this.gameState.puzzleIndex = 0;
        this.gameState.gameActive = true;
        this.gameState.gameStarted = true;
        this.gameState.totalCorrect = 0;
        this.gameState.totalAttempts = 0;
        this.gameState.hintsUsed = 0;
        this.gameState.puzzlesSkipped = 0;
        this.gameState.sessionStartTime = Date.now();
        
        // Configurar UI según nivel
        this.setupLevelUI(levelNumber);
        this.setupBoardRotation(levelNumber);
        this.setupCoordinates(levelNumber);
        this.adaptUIForAge(levelNumber);
        
        // Cargar primer puzzle
        this.loadNextPuzzle();
        
        // Analytics
        gtag('event', 'level_start', {
            'game': 'vision_blitz',
            'level': levelNumber,
            'target_age': levelConfig.targetAge,
            'piece_count': levelConfig.pieceCount
        });
    }
    
    loadNextPuzzle() {
        const levelConfig = VISION_BLITZ_LEVELS[this.gameState.level];
        const puzzles = TACTICS_DATABASE[levelConfig.difficulty];
        
        if (!puzzles || puzzles.length === 0) {
            console.error(`No hay puzzles para dificultad ${levelConfig.difficulty}`);
            this.gameOver('No puzzles available');
            return;
        }
        
        // Verificar si nivel completado
        if (this.gameState.puzzleIndex >= levelConfig.puzzleCount) {
            this.completeLevel();
            return;
        }
        
        // Seleccionar puzzle (aleatorio o secuencial según nivel)
        let puzzleIndex;
        if (this.gameState.level <= 3) {
            // Niveles de niños: secuencial para consistencia
            puzzleIndex = this.gameState.puzzleIndex % puzzles.length;
        } else {
            // Niveles avanzados: aleatorio para variedad
            puzzleIndex = Math.floor(Math.random() * puzzles.length);
        }
        
        this.gameState.currentPuzzle = puzzles[puzzleIndex];
        this.startViewPhase();
    }
    
    // 👁️ Fase de visualización
    startViewPhase() {
        this.gameState.viewPhase = true;
        const levelConfig = VISION_BLITZ_LEVELS[this.gameState.level];
        
        // Renderizar posición
        this.renderPosition(this.gameState.currentPuzzle.fen);
        
        // Mostrar overlay con countdown
        this.showPositionOverlay(levelConfig.viewTime);
        
        // Timer de visualización
        let timeLeft = levelConfig.viewTime;
        const countdownElement = document.getElementById('overlayCountdown');
        
        this.gameState.timerInterval = setInterval(() => {
            timeLeft -= 100;
            if (countdownElement) {
                countdownElement.textContent = Math.ceil(timeLeft / 1000);
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.gameState.timerInterval);
                this.startAnswerPhase();
            }
        }, 100);
        
        // Analytics de visualización
        gtag('event', 'puzzle_viewed', {
            'game': 'vision_blitz',
            'level': this.gameState.level,
            'puzzle_id': this.gameState.currentPuzzle.id,
            'view_time': levelConfig.viewTime,
            'board_rotated': this.gameState.boardRotated
        });
    }
    
    startAnswerPhase() {
        this.gameState.viewPhase = false;
        this.gameState.answerStartTime = Date.now();
        
        // Ocultar posición
        this.hidePosition();
        
        // Mostrar opciones
        this.showAnswerOptions(this.gameState.currentPuzzle.options);
        
        // Timer de respuesta (opcional - para presión adicional)
        if (this.gameState.level >= 7) {
            this.startAnswerTimer(30000); // 30 segundos máximo para niveles avanzados
        }
    }
    
    // 📝 Gestión de respuestas
    submitAnswer(selectedIndex, responseTime) {
        if (!this.gameState.gameActive || this.gameState.viewPhase) return;
        
        const puzzle = this.gameState.currentPuzzle;
        const selectedMove = puzzle.options[selectedIndex].move;
        const isCorrect = selectedMove === puzzle.solution;
        
        // Actualizar estadísticas
        this.gameState.totalAttempts++;
        this.updateAverageResponseTime(responseTime);
        
        if (isCorrect) {
            this.handleCorrectAnswer(responseTime);
        } else {
            this.handleWrongAnswer(selectedIndex, responseTime);
        }
        
        // Mostrar feedback
        this.showFeedback(isCorrect, puzzle.explanation, puzzle.visualHint);
        
        // Analytics detallado
        gtag('event', 'answer_submitted', {
            'game': 'vision_blitz',
            'level': this.gameState.level,
            'puzzle_id': puzzle.id,
            'correct': isCorrect,
            'selected_move': selectedMove,
            'correct_move': puzzle.solution,
            'response_time': responseTime,
            'streak': this.gameState.streak,
            'attempt_number': this.gameState.totalAttempts
        });
        
        // Continuar o terminar
        setTimeout(() => {
            if (isCorrect) {
                this.gameState.puzzleIndex++;
                this.loadNextPuzzle();
            } else {
                this.gameOver('wrong_answer');
            }
        }, 3000); // 3 segundos para leer feedback
    }
    
    handleCorrectAnswer(responseTime) {
        this.gameState.totalCorrect++;
        this.gameState.streak++;
        
        // Cálculo de puntos
        let basePoints = 100;
        const levelMultiplier = this.gameState.level;
        const speedBonus = Math.max(0, 50 - Math.floor(responseTime / 100));
        const streakMultiplier = Math.min(3, 1 + (this.gameState.streak - 1) * 0.2);
        
        const points = Math.floor((basePoints + speedBonus) * levelMultiplier * streakMultiplier);
        this.gameState.score += points;
        
        // Audio feedback
        this.playSound('correct');
        
        // Efecto visual
        this.showScorePopup(points);
        
        // Guardar progreso
        this.savePreferences();
    }
    
    handleWrongAnswer(selectedIndex, responseTime) {
        this.gameState.streak = 0;
        
        // Audio feedback
        this.playSound('wrong');
        
        // Analytics de error
        gtag('event', 'wrong_answer_analysis', {
            'game': 'vision_blitz',
            'level': this.gameState.level,
            'puzzle_theme': this.gameState.currentPuzzle.theme,
            'selected_option': selectedIndex,
            'response_time': responseTime,
            'hints_used': this.gameState.hintsUsed
        });
    }
    
    // 🎨 Renderizado y UI
    renderPosition(fen) {
        const position = this.parseFEN(fen);
        const board = document.getElementById('chessBoard');
        board.innerHTML = '';
        
        // Determinar orientación
        const whiteBottom = !this.gameState.boardRotated;
        
        for (let rank = (whiteBottom ? 8 : 1); whiteBottom ? rank >= 1 : rank <= 8; whiteBottom ? rank-- : rank++) {
            for (let file = (whiteBottom ? 1 : 8); whiteBottom ? file <= 8 : file >= 1; whiteBottom ? file++ : file--) {
                const square = document.createElement('div');
                const coordinate = String.fromCharCode(96 + file) + rank; // a1-h8
                
                square.className = `square ${(file + rank) % 2 === 0 ? 'light' : 'dark'}`;
                square.id = coordinate;
                square.dataset.coordinate = coordinate;
                
                // Agregar pieza si existe
                const piece = this.getPieceAt(position, coordinate);
                if (piece) {
                    const pieceElement = document.createElement('span');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = piece;
                    square.appendChild(pieceElement);
                }
                
                // Agregar coordenadas si está habilitado
                if (this.gameState.showCoordinates) {
                    const coordLabel = document.createElement('span');
                    coordLabel.className = 'coordinate-label';
                    coordLabel.textContent = coordinate.toUpperCase();
                    square.appendChild(coordLabel);
                }
                
                board.appendChild(square);
            }
        }
        
        // Mostrar indicador de rotación si aplica
        if (this.gameState.boardRotated) {
            this.showRotationIndicator();
        } else {
            this.hideRotationIndicator();
        }
    }
    
    showAnswerOptions(options) {
        const optionsGrid = document.getElementById('optionsGrid');
        optionsGrid.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.dataset.option = index;
            
            // Contenido del botón según nivel
            if (this.gameState.level <= 3 && option.kidFriendly) {
                // Modo niños: texto amigable
                optionBtn.innerHTML = `
                    <div class="option-kid-friendly">
                        <span class="option-notation">${option.notation}</span>
                        <span class="option-icon">${option.icon}</span>
                        <span class="kid-friendly-text">${option.kidFriendly}</span>
                    </div>
                `;
            } else {
                // Modo normal
                optionBtn.innerHTML = `
                    <span class="option-notation">${option.notation}</span>
                    <span class="option-icon">${option.icon || ''}</span>
                `;
            }
            
            // Event listener
            optionBtn.addEventListener('click', () => {
                const responseTime = Date.now() - this.gameState.answerStartTime;
                this.submitAnswer(index, responseTime);
            });
            
            optionsGrid.appendChild(optionBtn);
        });
        
        // Mostrar contenedor de opciones
        document.getElementById('answerOptions').style.display = 'block';
        
        // Ocultar overlay de posición
        document.getElementById('positionOverlay').classList.remove('show');
    }
    
    // 🔄 Sistema de rotación
    setupBoardRotation(level) {
        const levelConfig = VISION_BLITZ_LEVELS[level];
        
        if (levelConfig.boardRotation) {
            // Rotar aleatoriamente en niveles avanzados
            this.gameState.boardRotated = Math.random() < 0.5;
        } else {
            this.gameState.boardRotated = false;
        }
    }
    
    showRotationIndicator() {
        const indicator = document.getElementById('rotationIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
            indicator.title = this.gameState.boardRotated ? 'Tablero rotado (negras abajo)' : 'Tablero normal (blancas abajo)';
        }
    }
    
    hideRotationIndicator() {
        const indicator = document.getElementById('rotationIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    // 📍 Sistema de coordenadas
    setupCoordinates(level) {
        const levelConfig = VISION_BLITZ_LEVELS[level];
        const toggleContainer = document.getElementById('coordinatesToggle');
        const toggleBtn = document.getElementById('coordinatesBtn');
        
        if (!levelConfig.coordinatesToggle) {
            // Nivel sin toggle - usar default y ocultar botón
            this.gameState.showCoordinates = levelConfig.coordinatesDefault;
            toggleContainer.style.display = 'none';
        } else {
            // Nivel con toggle - mostrar botón
            if (this.gameState.showCoordinates === null) {
                this.gameState.showCoordinates = levelConfig.coordinatesDefault;
            }
            toggleContainer.style.display = 'block';
            this.updateCoordinatesButton();
        }
    }
    
    toggleCoordinates() {
        const levelConfig = VISION_BLITZ_LEVELS[this.gameState.level];
        
        if (levelConfig.coordinatesToggle) {
            this.gameState.showCoordinates = !this.gameState.showCoordinates;
            this.updateCoordinatesButton();
            this.savePreferences();
            
            // Re-renderizar tablero si está visible
            if (this.gameState.currentPuzzle && this.gameState.viewPhase) {
                this.renderPosition(this.gameState.currentPuzzle.fen);
            }
            
            // Analytics
            gtag('event', 'coordinates_toggled', {
                'game': 'vision_blitz',
                'level': this.gameState.level,
                'coordinates_shown': this.gameState.showCoordinates
            });
        }
    }
    
    updateCoordinatesButton() {
        const btn = document.getElementById('coordinatesBtn');
        if (btn) {
            btn.textContent = this.gameState.showCoordinates ? 'OCULTAR COORDENADAS' : 'MOSTRAR COORDENADAS';
            btn.classList.toggle('active', this.gameState.showCoordinates);
        }
    }
    
    // 🎵 Sistema de audio
    playSound(soundName) {
        if (this.gameState.soundEnabled && this.audioManager) {
            this.audioManager.playSound(soundName);
        }
    }
    
    toggleSound() {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        this.updateSoundButton();
        this.savePreferences();
        
        // Analytics
        gtag('event', 'sound_toggled', {
            'game': 'vision_blitz',
            'sound_enabled': this.gameState.soundEnabled
        });
    }
    
    updateSoundButton() {
        const btn = document.getElementById('soundToggle');
        if (btn) {
            btn.textContent = this.gameState.soundEnabled ? '🔊' : '🔇';
            btn.classList.toggle('muted', !this.gameState.soundEnabled);
            btn.title = this.gameState.soundEnabled ? 'Desactivar sonido' : 'Activar sonido';
        }
    }
    
    // 🏆 Completar nivel y game over
    completeLevel() {
        clearInterval(this.gameState.timerInterval);
        this.gameState.gameActive = false;
        
        // Calcular estadísticas finales
        const accuracy = this.calculateAccuracy();
        const averageTime = this.gameState.averageResponseTime;
        const sessionTime = Date.now() - this.gameState.sessionStartTime;
        
        // Audio y efectos
        this.playSound('levelUp');
        this.showLevelCompleteEffects();
        
        // Guardar progreso
        if (this.gameState.level < 10) {
            localStorage.setItem('visionBlitzLevel', (this.gameState.level + 1).toString());
        }
        
        // Mostrar pantalla de éxito
        this.showLevelComplete(accuracy, averageTime, sessionTime);
        
        // Analytics completo
        gtag('event', 'level_complete', {
            'game': 'vision_blitz',
            'level': this.gameState.level,
            'score': this.gameState.score,
            'accuracy': accuracy,
            'average_response_time': averageTime,
            'session_time': sessionTime,
            'hints_used': this.gameState.hintsUsed,
            'puzzles_skipped': this.gameState.puzzlesSkipped,
            'max_streak': this.getMaxStreak()
        });
    }
    
    gameOver(reason = 'unknown') {
        clearInterval(this.gameState.timerInterval);
        this.gameState.gameActive = false;
        
        // Calcular estadísticas
        const accuracy = this.calculateAccuracy();
        const sessionTime = Date.now() - this.gameState.sessionStartTime;
        
        // Mostrar pantalla de game over
        this.showGameOver(reason, accuracy, sessionTime);
        
        // Analytics
        gtag('event', 'game_over', {
            'game': 'vision_blitz',
            'level': this.gameState.level,
            'reason': reason,
            'puzzles_completed': this.gameState.puzzleIndex,
            'accuracy': accuracy,
            'score': this.gameState.score,
            'session_time': sessionTime
        });
    }
    
    // 📊 Cálculos y estadísticas
    calculateAccuracy() {
        if (this.gameState.totalAttempts === 0) return 0;
        return Math.round((this.gameState.totalCorrect / this.gameState.totalAttempts) * 100);
    }
    
    updateAverageResponseTime(newTime) {
        const count = this.gameState.totalAttempts;
        this.gameState.averageResponseTime = ((this.gameState.averageResponseTime * (count - 1)) + newTime) / count;
    }
    
    getMaxStreak() {
        // Esta sería una estadística guardada durante la sesión
        return this.gameState.streak; // Simplificado para MVP
    }
    
    // 🔧 Utilities
    parseFEN(fen) {
        // Parser básico de FEN - implementación completa necesaria
        const parts = fen.split(' ');
        const position = parts[0];
        
        const board = {};
        const ranks = position.split('/');
        
        for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
            const rank = 8 - rankIndex;
            const rankString = ranks[rankIndex];
            let file = 1;
            
            for (let char of rankString) {
                if (isNaN(char)) {
                    // Es una pieza
                    const coordinate = String.fromCharCode(96 + file) + rank;
                    board[coordinate] = this.fenCharToPiece(char);
                    file++;
                } else {
                    // Es un número (casillas vacías)
                    file += parseInt(char);
                }
            }
        }
        
        return board;
    }
    
    fenCharToPiece(char) {
        const pieces = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        return pieces[char] || '';
    }
    
    getPieceAt(position, coordinate) {
        return position[coordinate] || null;
    }
}

// Audio Manager compartido
class AudioManager {
    constructor() {
        this.sounds = {
            correct: new Howl({ 
                src: ['../../assets/sounds/correct.wav'],
                volume: 0.6
            }),
            wrong: new Howl({ 
                src: ['../../assets/sounds/wrong.wav'],
                volume: 0.6
            }),
            levelUp: new Howl({ 
                src: ['../../assets/sounds/level-up.wav'],
                volume: 0.8
            })
        };
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
}
```

---

## 📁 **ARCHIVO DE CONFIGURACIÓN (config.js)**

```javascript
// config.js - Configuración centralizada

const VISION_BLITZ_CONFIG = {
    // Configuración general
    VERSION: '1.0.0',
    GAME_NAME: 'vision_blitz',
    MIN_AGE: 4,
    MAX_LEVEL: 10,
    
    // Analytics
    GA_TRACKING_ID: 'G-N3EKXHPD5Y',
    ADSENSE_PUBLISHER_ID: 'ca-pub-2472413468382197',
    
    // Performance
    MAX_RESPONSE_TIME: 60000, // 60 segundos máximo
    FEEDBACK_DURATION: 3000,   // 3 segundos de feedback
    AUTOSAVE_INTERVAL: 30000,  // Guardar cada 30 segundos
    
    // UI Breakpoints
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    
    // Scoring
    BASE_POINTS: 100,
    MAX_SPEED_BONUS: 50,
    MAX_STREAK_MULTIPLIER: 3,
    
    // Audio
    DEFAULT_VOLUME: 0.6,
    SOUND_FORMATS: ['wav', 'mp3', 'ogg'],
    
    // Storage keys
    STORAGE_KEYS: {
        SOUND: 'visionBlitzSound',
        LEVEL: 'visionBlitzLevel', 
        COORDINATES: 'visionBlitzCoordinates',
        HIGH_SCORE: 'visionBlitzHighScore',
        STATISTICS: 'visionBlitzStats'
    },
    
    // Error messages
    ERRORS: {
        NO_PUZZLES: 'No hay puzzles disponibles para este nivel',
        INVALID_LEVEL: 'Nivel no válido',
        AUDIO_FAILED: 'Error al reproducir audio',
        SAVE_FAILED: 'Error al guardar progreso'
    }
};

// Export para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VISION_BLITZ_CONFIG;
} else {
    window.VISION_BLITZ_CONFIG = VISION_BLITZ_CONFIG;
}
```

---

## 🎯 **TESTING STRATEGY COMPLETA**

### 🧪 **Plan de Testing Manual**

```javascript
// testing-checklist.js - Lista de verificación

const TESTING_CHECKLIST = {
    
    // 🎮 Funcionalidad básica
    basic_functionality: [
        "✅ Juego inicia correctamente",
        "✅ Los 10 niveles cargan sin errores", 
        "✅ Progresión entre niveles funciona",
        "✅ Sistema de puntuación exacto",
        "✅ Audio toggle funciona",
        "✅ Botón HOME redirige correctamente"
    ],
    
    // 🎨 UI por nivel
    ui_progression: [
        "✅ Nivel 1-3: UI para niños (grande, colorido)",
        "✅ Nivel 4-6: UI intermedia",
        "✅ Nivel 7-8: UI adultos", 
        "✅ Nivel 9-10: UI maestros (minimalista)",
        "✅ Transiciones suaves entre modos"
    ],
    
    // 🔄 Sistema de rotación
    board_rotation: [
        "✅ Niveles 1-5: Sin rotación",
        "✅ Niveles 6-10: Rotación aleatoria",
        "✅ Indicador de rotación visible",
        "✅ Coordenadas correctas con rotación"
    ],
    
    // 📍 Sistema de coordenadas
    coordinates_system: [
        "✅ Nivel 1: Coordenadas siempre on, sin toggle",
        "✅ Nivel 2-8: Toggle funcional",
        "✅ Nivel 9-10: Sin coordenadas, sin toggle",
        "✅ Persistencia de preferencia"
    ],
    
    // 📱 Responsive
    responsive_design: [
        "✅ iPhone SE (375x667)",
        "✅ iPhone 12 (390x844)",
        "✅ iPad (768x1024)", 
        "✅ iPad landscape (1024x768)",
        "✅ Desktop 1920x1080",
        "✅ Ultra-wide 2560x1440"
    ],
    
    // 🌐 Cross-browser
    browser_compatibility: [
        "✅ Chrome 90+",
        "✅ Firefox 88+",
        "✅ Safari 14+",
        "✅ Edge 90+",
        "✅ Samsung Internet",
        "✅ Chrome Android"
    ],
    
    // 📊 Analytics
    analytics_tracking: [
        "✅ game_init event",
        "✅ level_start event", 
        "✅ puzzle_viewed event",
        "✅ answer_submitted event",
        "✅ level_complete event",
        "✅ game_over event"
    ],
    
    // 🎵 Audio
    audio_system: [
        "✅ Sonidos cargan correctamente",
        "✅ Toggle funciona en todos los browsers",
        "✅ Volumen apropiado",
        "✅ Sin delays perceptibles",
        "✅ Fallback si audio falla"
    ],
    
    // 💾 Persistencia
    data_persistence: [
        "✅ Progreso de nivel guardado",
        "✅ Preferencia de sonido guardada",
        "✅ Preferencia de coordenadas guardada",
        "✅ High score guardado",
        "✅ Datos sobreviven refresh"
    ]
};
```

### 🔍 **Testing Automatizado (Futuro)**

```javascript
// automated-tests.js - Para futuras implementaciones

class VisionBlitzTests {
    static runAllTests() {
        this.testGameEngine();
        this.testUIAdaptation(); 
        this.testScoring();
        this.testDataPersistence();
    }
    
    static testGameEngine() {
        console.log('🧪 Testing Game Engine...');
        
        // Test nivel loading
        const engine = new VisionBlitzEngine();
        assert(engine.gameState.level === 1, 'Default level should be 1');
        
        // Test puzzle loading
        engine.startLevel(1);
        assert(engine.gameState.currentPuzzle !== null, 'Puzzle should load');
        
        console.log('✅ Game Engine tests passed');
    }
    
    static testScoring() {
        console.log('🧪 Testing Scoring System...');
        
        const engine = new VisionBlitzEngine();
        const initialScore = engine.gameState.score;
        
        // Simular respuesta correcta
        engine.handleCorrectAnswer(2000); // 2 segundos
        
        assert(engine.gameState.score > initialScore, 'Score should increase');
        assert(engine.gameState.streak === 1, 'Streak should increment');
        
        console.log('✅ Scoring tests passed');
    }
}

// Utilidades de testing
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Test failed: ${message}`);
    }
}
```

---

## 🚀 **DEPLOYMENT STRATEGY**

### 📦 **Build Process**

```javascript
// build.js - Script de construcción

const BUILD_CONFIG = {
    // Minificación
    minify: {
        html: true,
        css: true, 
        js: true
    },
    
    // Optimización de imágenes
    images: {
        quality: 85,
        formats: ['webp', 'jpg', 'png']
    },
    
    // Cache busting;
```

### 🎯 **Base de Datos de Tácticas Expandida**

```javascript
// tactics-database.js
export const TACTICS_DATABASE = {
    
    // 👶 NIVEL 1: Solo 3 piezas (2 reyes + 1 atacante)
    mate_3_pieces: [
        {
            id: 1,
            fen: "8/8/8/8/8/3k4/8/R3K3 w - - 0 1",
            solution: "Ra3#",
            options: [
                { move: "Ra3#", notation: "Ra3#", icon: "♖→a3 ✅", kidFriendly: "Torre mata al rey negro" },
                { move: "Ra1", notation: "Ra1", icon: "♖→a1", kidFriendly: "Torre a la esquina" },
                { move: "Kd2", notation: "Kd2", icon: "♔→d2", kidFriendly: "Rey blanco se mueve" },
                { move: "Rb1", notation: "Rb1", icon: "♖→b1", kidFriendly: "Torre abajo" }
            ],
            explanation: "🏆 ¡La torre blanca da mate al rey negro!",
            visualHint: "El rey negro no puede escapar de la torre",
            difficulty: 1,
            theme: "back_rank_mate",
            pieceCount: 3,
            boardRotation: false
        },
        {
            id: 2,
            fen: "8/8/8/8/8/8/3k4/4Q1K1 w - - 0 1",
            solution: "Qe2#",
            options: [
                { move: "Qe2#", notation: "Qe2#", icon: "♕→e2 ✅", kidFriendly: "Dama mata al rey" },
                { move: "Qd1", notation: "Qd1", icon: "♕→d1", kidFriendly: "Dama abajo" },
                { move: "Qf1", notation: "Qf1", icon: "♕→f1", kidFriendly: "Dama a la esquina" },
                { move: "Kh2", notation: "Kh2", icon: "♔→h2", kidFriendly: "Rey blanco se mueve" }
            ],
            explanation: "👑 ¡La dama da mate! El rey negro no puede moverse",
            visualHint: "La dama controla todas las casillas del rey negro",
            difficulty: 1,
            theme: "queen_mate",
            pieceCount: 3,
            boardRotation: false
        }
        // ... 8 posiciones más de 3 piezas
    ],
    
    // 🌱 NIVEL 2: 4-5 piezas
    mate_few_pieces: [
        {
            id: 11,
            fen: "8/8/8/8/8/1k6/1p6/1R2K3 w - - 0 1",
            solution: "Ra1#",
            options: [
                { move: "Ra1#", notation: "Ra1#", icon: "♖→a1 ✅" },
                { move: "Rb2+", notation: "Rb2+", icon: "♖→b2 ⚠️" },
                { move: "Kd2", notation: "Kd2", icon: "♔→d2" },
                { move: "Rf1", notation: "Rf1", icon: "♖→f1" }
            ],
            explanation: "🎯 ¡La torre da mate en la primera fila!",
            visualHint: "El peón negro bloquea la escape del rey",
            difficulty: 2,
            theme: "back_rank_mate",
            pieceCount: 4,
            boardRotation: false
        }
        // ... más posiciones 4-5 piezas
    ],
    
    // ⚡ NIVEL 3: Mates en 1 básicos (6-8 piezas)
    mate_in_1_basic: [
        {
            id: 21,
            fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
            solution: "Mate inevitable",
            options: [
                { move: "Qxf7#", notation: "Qxf7#", icon: "♕×f7 ✅" },
                { move: "Qe6+", notation: "Qe6+", icon: "♕→e6 ⚠️" },
                { move: "Qg7", notation: "Qg7", icon: "♕→g7" },
                { move: "Qd5", notation: "Qd5", icon: "♕→d5" }
            ],
            explanation: "⚡ ¡Mate del académico! La dama ataca f7",
            visualHint: "La casilla f7 está débil, solo defendida por el rey",
            difficulty: 3,
            theme: "scholars_mate",
            pieceCount: 8,
            boardRotation: false
        }
        // ... más posiciones nivel 3
    ],
    
    // 📌 NIVEL 4: Clavadas básicas
    pin_basic: [
        {
            id: 31,
            fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP1NPPP/R1BQK2R b KQkq - 0 5",
            solution: "Bg4",
            options: [
                { move: "Bg4", notation: "Bg4", icon: "♗→g4 📌" },
                { move: "Be7", notation: "Be7", icon: "♗→e7" },
                { move: "Nd4", notation: "Nd4", icon: "♘→d4" },
                { move: "h6", notation: "h6", icon: "♙→h6" }
            ],
            explanation: "📌 El alfil clava el caballo a la dama",
            visualHint: "Busca piezas en línea que no pueden moverse",
            difficulty: 4,
            theme: "pin",
            pieceCount: 10,
            boardRotation: false
        }
        // ... más posiciones nivel 4
    ],
    
    // 🍴 NIVEL 5: Horquillas intermedias
    fork_intermediate: [
        {
            id: 41,
            fen: "r1bqkb1r/ppp2ppp/2n5/3np3/2B1P3/3P1N2/PPP1NPPP/R1BQK2R w KQkq - 0 6",
            solution: "Nd4",
            options: [
                { move: "Nd4", notation: "Nd4", icon: "♘→d4 🍴" },
                { move: "Ng5", notation: "Ng5", icon: "♘→g5" },
                { move: "Nh4", notation: "Nh4", icon: "♘→h4" },
                { move: "Ne1", notation: "Ne1", icon: "♘→e1" }
            ],
            explanation: "🍴 ¡El caballo hace horquilla al rey y alfil!",
            visualHint: "Los caballos atacan en forma de L",
            difficulty: 5,
            theme: "fork",
            pieceCount: 12,
            boardRotation: false
        }
        // ... más posiciones nivel 5
    ],
    
    // 🔄 NIVEL 6: Ataques dobles + ROTACIÓN
    double_attack: [
        {
            id: 51,
            fen: "r2qkb1r/ppp2ppp/2n1bn2/3p4/3P4/2N1P3/PPP1NPPP/R1BQKB1R w KQkq - 0 7",
            solution: "Nd5",
            options: [
                { move: "Nd5", notation: "Nd5", icon: "♘→d5 ⚡" },
                { move: "Ne4", notation: "Ne4", icon: "♘→e4" },
                { move: "Nb5", notation: "Nb5", icon: "♘→b5" },
                { move: "Na4", notation: "Na4", icon: "♘→a4" }
            ],
            explanation: "⚡ ¡Ataque doble: caballo ataca dama y alfil!",
            visualHint: "Una pieza puede atacar dos objetivos a la vez",
            difficulty: 6,
            theme: "double_attack",
            pieceCount: 15,
            boardRotation: true  // ¡Primera vez con rotación!
        }
        // ... más posiciones nivel 6
    ],
    
    // 🎯 NIVEL 7-10: Progresivamente más complejos...
    // ... (continuar con el patrón)
    
    // 🏆 NIVEL 10: Nivel Maestro (25-32 piezas)
    master_level: [
        {
            id: 91,
            fen: "r1bq1rk1/ppp1nppp/3p1n2/2bPp3/2B1P3/2N2N2/PPP1QPPP/R1B1K2R w KQ - 0 9",
            solution: "Nxf7",
            options: [
                { move: "Nxf7", notation: "Nxf7", icon: "♘×f7 💥" },
                { move: "Qe4", notation: "Qe4", icon: "♕→e4" },
                { move: "Bd3", notation: "Bd3", icon: "♗→d3" },
                { move: "h3", notation: "h3", icon: "♙→h3" }
            ],
            explanation: "💥 Sacrificio de caballo destruye la estructura defensiva",
            visualHint: "A veces hay que sacrificar para ganar",
            difficulty: 10,
            theme: "knight_sacrifice",
            pieceCount: 28,
            boardRotation: true
        }
        // ... más posiciones nivel 10
    ]
};
```

---

## 🔧 **COMPONENTES TÉCNICOS AVANZADOS**

### 🎮 **Game Engine Expandido (vision-blitz-engine.js)**

```javascript
class VisionBlitzEngine {
    constructor() {
        this.gameState = {
            level: 1,
            score: 0,
            streak: 0,
            currentPuzzle: null,
            puzzleIndex: 0,
            gameActive: false,
            viewPhase: true,
            soundEnabled: true,
            showCoordinates: null, // null = usar default del nivel
            boardRotated: false
        };
        
        this.audioManager = new AudioManager();
        this.loadSoundPreference();
        this.loadCoordinatePreference();
    }
    
    // 🔄 Sistema de rotación de tablero
    setupBoardRotation(level) {
        const levelConfig = VISION_BLITZ_LEVELS[level];
        
        if (levelConfig.boardRotation) {
            // 50% chance de rotar en niveles avanzados
            this.gameState.boardRotated = Math.random() < 0.5;
        } else {
            this.gameState.boardRotated = false;
        }
        
        this.renderBoardWithRotation();
    }
    
    // 📍 Sistema de coordenadas inteligente
    setupCoordinates(level) {
        const levelConfig = VISION_BLITZ_LEVELS[level];
        
        // Si el nivel no permite toggle, usar default
        if (!levelConfig.coordinatesToggle) {
            this.gameState.showCoordinates = levelConfig.coordinatesDefault;
            this.hideCoordinatesButton();
        } else {
            // Usar preferencia del usuario o default del nivel
            if (this.gameState.showCoordinates === null) {
                this.gameState.showCoordinates = levelConfig.coordinatesDefault;
            }
            this.showCoordinatesButton();
        }
        
        this.updateCoordinatesDisplay();
    }
    
    // 🎯 Renderizado de posición con rotación
    renderPosition(fen) {
        const position = this.parseFEN(fen);
        const board = document.getElementById('chessBoard');
        board.innerHTML = '';
        
        // Determinar orientación
        const whiteBottom = !this.gameState.boardRotated;
        
        for (let rank = (whiteBottom ? 8 : 1); whiteBottom ? rank >= 1 : rank <= 8; whiteBottom ? rank-- : rank++) {
            for (let file = (whiteBottom ? 1 : 8); whiteBottom ? file <= 8 : file >= 1; whiteBottom ? file++ : file--) {
                const square = document.createElement('div');
                const coordinate = String.fromCharCode(96 + file) + rank; // a1-h8
                
                square.className = `square ${(file + rank) % 2 === 0 ? 'light' : 'dark'}`;
                square.id = coordinate;
                
                // Agregar pieza si existe
                const piece = this.getPieceAt(position, coordinate);
                if (piece) {
                    square.innerHTML = `<span class="piece">${piece}</span>`;
                }
                
                // Agregar coordenadas si está habilitado
                if (this.gameState.showCoordinates) {
                    const coordLabel = document.createElement('span');
                    coordLabel.className = 'coordinate-label';
                    coordLabel.textContent = coordinate.toUpperCase();
                    square.appendChild(coordLabel);
                }
                
                board.appendChild(square);
            }
        }
        
        // Indicador de orientación para niveles rotados
        if (this.gameState.boardRotated) {
            this.showRotationIndicator();
        }
    }
    
    // 🎨 Adaptación UI según edad
    adaptUIForAge(level) {
        const levelConfig = VISION_BLITZ_LEVELS[level];
        const container = document.querySelector('.game-container');
        
        // Remover clases previas
        container.classList.remove('ui-kids', 'ui-teens', 'ui-adults', 'ui-masters');
        
        if (level <= 3) {
            // Niveles para niños pequeños
            container.classList.add('ui-kids');
            this.enableKidsMode();
        } else if (level <= 6) {
            // Niveles para adolescentes
            container.classList.add('ui-teens');
        } else if (level <= 8) {
            // Niveles para adultos
            container.classList.add('ui-adults');
        } else {
            // Niveles para maestros
            container.classList.add('ui-masters');
            this.enableMasterMode();
        }
    }
    
    // 👶 Modo especial para niños
    enableKidsMode() {
        // Tablero más grande
        const board = document.getElementById('chessBoard');
        board.style.gridTemplateColumns = 'repeat(8, 70px)';
        board.style.gridTemplateRows = 'repeat(8, 70px)';
        
        // Botones más grandes
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.style.minHeight = '80px';
            btn.style.fontSize = '1.2rem';
        });
        
        // Mostrar iconos kid-friendly en opciones
        this.showKidFriendlyIcons = true;
    }
    
    // 🏆 Modo especial para maestros
    enableMasterMode() {
        // Tablero más pequeño y limpio
        const board = document.getElementById('chessBoard');
        board.style.gridTemplateColumns = 'repeat(8, 40px)';
        board.style.gridTemplateRows = 'repeat(8, 40px)';
        
        // UI minimalista
        document.querySelector('.game-ui').style.opacity = '0.8';
        
        // Sin ayudas visuales
        this.hideAllHints();
    }
    
    // 📊 Sistema de progresión adaptativo
    calculateNextLevel() {
        const currentLevel = this.gameState.level;
        const accuracy = this.calculateAccuracy();
        const averageTime = this.calculateAverageResponseTime();
        
        // Si la precisión es muy alta y responde rápido, puede saltar nivel
        if (accuracy > 90 && averageTime < 2000 && currentLevel < 8) {
            this.offerLevelSkip();
        }
        
        // Si está luchando, ofrecer práctica extra
        if (accuracy < 60) {
            this.offerExtraPractice();
        }
    }
    
    // 🎯 Analytics expandido
    trackAdvancedMetrics() {
        const puzzle = this.gameState.currentPuzzle;
        const level = this.gameState.level;
        
        gtag('event', 'puzzle_analysis', {
            'level': level,
            'puzzle_theme': puzzle.theme,
            'piece_count': puzzle.pieceCount,
            'board_rotated': this.gameState.boardRotated,
            'coordinates_shown': this.gameState.showCoordinates,
            'view_time': VISION_BLITZ_LEVELS[level].viewTime,
            'user_age_group': this.detectAgeGroup(level)
        });
    }
}
```

### 🎨 **Estilos Adaptativos (vision-blitz.css)**

```css
/* Estilos base y específicos de Vision Blitz */

/* 👶 Modo niños (niveles 1-3) */
.game-container.ui-kids {
    font-size: 1.2rem;
}

.ui-kids .chess-board {
    grid-template-columns: repeat(8, 70px);
    grid-template-rows: repeat(8, 70px);
    border: 4px solid var(--neon-green);
    box-shadow: 0 0 40px var(--neon-green);
}

.ui-kids .option-btn {
    min-height: 80px;
    font-size: 1.2rem;
    border-width: 3px;
}

.ui-kids .option-icon {
    font-size: 1.1rem;
    display: block; /* Siempre visible para niños */
}

.ui-kids .coordinate-label {
    font-size: 18px;
    font-weight: 900;
    text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
}

.ui-kids .feedback-display {
    border-width: 4px;
    font-size: 1.3rem;
}

/* 🌟 Modo adolescentes (niveles 4-6) */
.game-container.ui-teens {
    font-size: 1.1rem;
}

.ui-teens .chess-board {
    grid-template-columns: repeat(8, 55px);
    grid-template-rows: repeat(8, 55px);
}

.ui-teens .option-btn {
    min-height: 60px;
    font-size: 1rem;
}

/* 🏆 Modo adultos (niveles 7-8) */
.game-container.ui-adults {
    font-size: 1rem;
}

.ui-adults .chess-board {
    grid-template-columns: repeat(8, 50px);
    grid-template-rows: repeat(8, 50px);
}

/* 👑 Modo maestros (niveles 9-10) */
.game-container.ui-masters {
    font-size: 0.9rem;
}

.ui-masters .chess-board {
    grid-template-columns: repeat(8, 40px);
    grid-template-rows: repeat(8, 40px);
    border: 1px solid rgba(0, 255, 255, 0.3);
}

.ui-masters .game-ui {
    opacity: 0.8;
    background: rgba(0, 0, 0, 0.5);
}

.ui-masters .coordinate-label {
    display: none; /* Sin coordenadas para maestros */
}

/* 🔄 Indicador de rotación de tablero */
.rotation-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    background: var(--neon-orange);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: black;
    font-weight: 900;
    animation: rotateIndicator 2s ease-in-out infinite;
}

@keyframes rotateIndicator {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
}

/* 📍 Sistema de coordenadas adaptativo */
.coordinates-toggle {
    margin: 1rem 0;
    text-align: center;
}

.coordinates-btn {
    background: transparent;
    border: 2px solid var(--neon-cyan);
    color: var(--neon-cyan);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-family: 'Orbitron', monospace;
    cursor: pointer;
    transition: all 0.3s ease;
}

.coordinates-btn:hover {
    background: rgba(0, 255, 255, 0.1);
}

.coordinates-btn.hidden {
    display: none;
}

/* 🎯 Opciones con iconos kid-friendly */
.option-kid-friendly {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
}

.kid-friendly-text {
    font-size: 0.8rem;
    color: var(--neon-green);
    text-align: center;
    opacity: 0.9;
}

/* ⚡ Efectos especiales por nivel */
.level-effect-basic {
    /* Niveles 1-3: Efectos suaves */
    filter: brightness(1.1);
}

.level-effect-intermediate {
    /* Niveles 4-6: Efectos moderados */
    filter: brightness(1.2) contrast(1.1);
}

.level-effect-advanced {
    /* Niveles 7-8: Efectos intensos */
    filter: brightness(1.3) contrast(1.2) hue-rotate(10deg);
}

.level-effect-master {
    /* Niveles 9-10: Efectos extremos */
    filter: brightness(1.4) contrast(1.3) hue-rotate(20deg) saturate(1.2);
}

/* 📱 Responsive expandido */
@media (max-width: 768px) {
    .ui-kids .chess-board {
        grid-template-columns: repeat(8, 50px);
        grid-template-rows: repeat(8, 50px);
    }
    
    .ui-teens .chess-board {
        grid-template-columns: repeat(8, 45px);
        grid-template-rows: repeat(8, 45px);
    }
    
    .ui-adults .chess-board {
        grid-template-columns: repeat(8, 40px);
        grid-template-rows: repeat(8, 40px);
    }
    
    .ui-masters .chess-board {
        grid-template-columns: repeat(8, 35px);
        grid-template-rows: repeat(8, 35px);
    }
    
    .options-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
}

@media (max-width: 480px) {
    .ui-kids .chess-board {
        grid-template-columns: repeat(8, 40px);
        grid-template-rows: repeat(8, 40px);
    }
    
    .ui-teens .chess-board {
        grid-template-columns: repeat(8, 38px);
        grid-template-rows: repeat(8, 38px);
    }
    
    .ui-adults .chess-board {
        grid-template-columns: repeat(8, 35px);
        grid-template-rows: repeat(8, 35px);
    }
    
    .ui-masters .chess-board {
        grid-template-columns: repeat(8, 32px);
        grid-template-rows: repeat(8, 32px);
    }
}