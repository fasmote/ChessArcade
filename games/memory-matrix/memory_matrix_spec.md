# 🧠 MEMORY MATRIX - Documento de Desarrollo Completo
## ChessArcade Game #3 - Especificación Técnica Final

---

## 📋 **INFORMACIÓN DEL PROYECTO**

- **Nombre**: Memory Matrix
- **Plataforma**: ChessArcade  
- **Tipo**: Juego de memoria táctica progresiva
- **Target**: Desde 4 años hasta Grandes Maestros
- **Repositorio**: https://github.com/fasmote/ChessArcade
- **Carpeta**: `C:\Users\clau\Documents\Multiajedrez 2025`
- **Fecha**: Septiembre 2025
- **Estado**: 📋 Listo para desarrollo

---

## 🎯 **CONCEPTO CENTRAL DEL JUEGO**

**Memory Matrix** es un juego de memoria ajedrecística que enseña:
1. 🏗️ **Estructuras de Aperturas** (desaparecer peones)
2. ⚡ **Mates Famosos** (Anastasia, Legal, Boden, etc.)
3. 🧠 **Memoria Táctica** progresiva (2 piezas → 32 piezas)

### 🎮 **Mecánica Principal**
1. **Mostrar posición** de ajedrez (1-10 segundos según nivel)
2. **Ocultar piezas específicas** (desde 2 hasta 30 piezas)
3. **Jugador debe recordar** y colocar las piezas correctas via drag & drop
4. **Sistema pedagógico por capas**: Peones → Piezas fantasma → Posición completa
5. **Progresión educativa**: Mates básicos → Aperturas → Partidas inmortales

---

## 🏆 **SISTEMA DE 30 NIVELES COMPLETO**

### 👶 **FASE 1: BABY MEMORY (Niveles 1-10) - Edad 4-8 años**
**Objetivo**: Mates básicos con pocas piezas

```javascript
const BABY_LEVELS = {
    1: {
        name: "DOS REYES SOLOS",
        pieces_shown: 2,
        hidden_pieces: ["both_kings"],
        time_view: 8000,
        fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
        explanation: "🤴 Los reyes nunca pueden estar juntos",
        ui_mode: "giant_pieces",
        target_age: "4-5 años"
    },
    2: {
        name: "REY Y DAMA VS REY", 
        pieces_shown: 3,
        hidden_pieces: ["queen"],
        time_view: 10000,
        fen: "8/8/8/8/8/3k4/8/4QK2 w - - 0 1",
        mate_type: "queen_mate",
        explanation: "👑 ¡La dama da mate! El rey negro no puede moverse"
    },
    3: {
        name: "TORRE FUERTE",
        pieces_shown: 3, 
        hidden_pieces: ["rook"],
        time_view: 8000,
        fen: "8/8/8/8/8/3k4/8/R3K3 w - - 0 1",
        mate_type: "back_rank_mate",
        explanation: "🏰 ¡La torre da mate en la última fila!"
    },
    4: {
        name: "DOS TORRES",
        pieces_shown: 4,
        hidden_pieces: ["both_rooks"],
        time_view: 10000,
        fen: "8/8/8/8/8/3k4/R7/R3K3 w - - 0 1",
        mate_type: "two_rooks_mate",
        explanation: "🏰🏰 ¡Dos torres son imparables!"
    },
    5: {
        name: "ALFILES AMIGOS",
        pieces_shown: 4,
        hidden_pieces: ["both_bishops"],
        time_view: 12000,
        fen: "8/8/8/8/8/2k5/1B6/B3K3 w - - 0 1",
        mate_type: "two_bishops_mate",
        explanation: "⛪⛪ ¡Los dos alfiles trabajan en equipo!"
    }
    // ... continúa hasta nivel 10
};
```

### ⚡ **FASE 2: PATTERN MASTER (Niveles 11-20) - Edad 8-14 años**
**Objetivo**: Aperturas famosas + mates clásicos con sistema pedagógico por capas

```javascript
const PATTERN_LEVELS = {
    11: {
        name: "APERTURA ITALIANA",
        type: "opening_structure",
        phases: {
            A: { // FASE 1: Solo peones
                title: "🔸 ITALIANA - ESTRUCTURA BASE",
                fen: "8/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/8 w - - 0 1",
                hidden: ["all_pawns"],
                time_view: 10000,
                focus: "Centro e4-e5, base de la apertura clásica",
                moves: ["1.e4 e5"],
                explanation: "🏗️ Los peones son el ALMA de la posición"
            },
            B: { // FASE 2: Piezas fantasma (semi-transparentes)
                title: "👻 ITALIANA - CON DESARROLLO",
                fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
                translucent: ["Bc4", "Nf3", "Nc6"], // 50% opacidad
                hidden: ["some_pawns"],
                time_view: 8000,
                moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4"],
                focus: "Alfil a c4 ataca f7, caballo controla centro",
                explanation: "👻 Ve cómo las PIEZAS apoyan la estructura"
            },
            C: { // FASE 3: Posición completa
                title: "♟️ ITALIANA - MAESTRÍA TOTAL",
                fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
                hidden: ["random_selection"],
                time_view: 5000,
                moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4"],
                explanation: "🏆 Domina la posición COMPLETA",
                variations: ["Defensa Húngara", "Dos Caballos", "Gambito Italiano"]
            }
        },
        opening_info: {
            name: "Apertura Italiana",
            eco_code: "C50-C59",
            popularity: "Muy popular en todos los niveles",
            key_ideas: ["Desarrollo rápido", "Ataque a f7", "Control central"]
        }
    },
    
    16: {
        name: "MATE DE LEGAL",
        type: "famous_mate",
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
        hidden_pieces: ["white_queen", "bishop_c4", "knight_f3"],
        time_view: 6000,
        mate_pattern: "Sacrificio de dama + alfil + caballo",
        historical: {
            game: "Sire de Legal vs Saint Brie",
            year: "París 1750",
            story: "El maestro Legal sacrifica su dama por un mate brillante"
        },
        key_moves: ["Nxe5", "Bxd1", "Bxf7+", "Ke7", "Nd5#"],
        explanation: "⚖️ MATE DE LEGAL: ¡Sacrifica la dama por mate!",
        lesson: "A veces hay que sacrificar lo más valioso"
    }
    
    // ... más niveles con mates famosos
};
```

### 🏆 **FASE 3: GRANDMASTER MEMORY (Niveles 21-30) - Edad 14+ hasta GMs**
**Objetivo**: Partidas inmortales + posiciones ultra-complejas

```javascript
const GRANDMASTER_LEVELS = {
    21: {
        name: "PARTIDA INMORTAL",
        type: "immortal_game",
        game: "Anderssen vs Kieseritzky",
        year: "Berlín 1851",
        position: "critical_moment",
        fen: "r1bq1rk1/ppp1nppp/3p1n2/2bPp3/2B1P3/2N2N2/PPP1QPPP/R1B1K2R w KQ - 0 9",
        hidden_pieces: ["attacking_pieces"],
        pieces_shown: 25,
        time_view: 3000,
        story: "La partida más famosa de la historia del ajedrez",
        brilliancy: "Anderssen sacrifica todo por un mate artístico"
    },
    
    30: {
        name: "DESAFÍO IMPOSIBLE",
        type: "ultimate_memory",
        pieces_shown: 32,
        hidden_pieces: 30,
        time_view: 1000, // Solo 1 segundo!
        challenge: "Recrear partida completa de memoria",
        explanation: "🧠 Solo para genios: memoria fotográfica absoluta",
        target: "Grandes Maestros únicamente"
    }
};
```

---

## 📚 **BASE DE DATOS DE CONTENIDO**

### 🏰 **Aperturas con Variantes**
```javascript
const OPENING_DATABASE = {
    italian_game: {
        main_line: {
            name: "Italiana Clásica",
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
            moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4"]
        },
        variations: [
            {
                name: "Defensa Húngara",
                fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
                moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4 Nf6"],
                focus: "Negro defiende con Nf6"
            },
            {
                name: "Defensa de los Dos Caballos",
                fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
                continuation: "4.Ng5",
                focus: "Ataque directo a f7"
            }
        ]
    },
    
    ruy_lopez: {
        main_line: {
            name: "Española Clásica",
            fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
            moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bb5"]
        },
        variations: [
            {
                name: "Defensa Berlinesa",
                fen: "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
                moves: ["3...Nf6"],
                reputation: "Defensa sólida favorita de Kramnik"
            }
        ]
    }
};
```

### ⚡ **Mates Famosos Completos**
```javascript
const FAMOUS_MATES_DATABASE = {
    legals_mate: {
        name: "Mate de Legal",
        pattern: "Sacrificio de dama",
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
        sequence: ["Nxe5", "Bxd1", "Bxf7+", "Ke7", "Nd5#"],
        historical: "Legal vs Saint Brie, París 1750",
        lesson: "Sacrificio táctico brillante"
    },
    
    anastasias_mate: {
        name: "Mate de Anastasia",
        pattern: "Torre + Caballo",
        fen: "2kr4/ppp5/8/8/8/8/PPP2R2/2K4N w - - 0 1", 
        key_pieces: ["Rf2", "Nh1"],
        historical: "Llamado por novela 'Anastasia' 1803",
        geometry: "Torre en fila + caballo en esquina"
    },
    
    boden_mate: {
        name: "Mate de Boden",
        pattern: "Dos alfiles cruzados",
        fen: "2kr1bnr/ppp2ppp/2n5/4q3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQ - 6 6",
        geometry: "Diagonales cruzadas forman X",
        historical: "Boden vs Bird, Londres 1860",
        beauty: "★★★★★"
    },
    
    smothered_mate: {
        name: "Mate Ahogado",
        pattern: "Caballo + rey ahogado",
        fen: "6rk/6pp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
        irony: "Las propias piezas traicionan al rey",
        classical: "Patrón desde siglo XIII"
    },
    
    arabian_mate: {
        name: "Mate Árabe", 
        pattern: "Torre + Caballo",
        fen: "5rkr/8/8/8/8/8/8/R4NK1 w - - 0 1",
        historical: "Manuscritos árabes siglo IX",
        significance: "El más antiguo documentado"
    },
    
    blackburne_mate: {
        name: "Mate de Blackburne",
        pattern: "Dos alfiles + caballo",
        diagonal_attack: "h7-g7-f6",
        master: "Joseph Henry Blackburne",
        complexity: "Requiere cálculo preciso"
    },
    
    greco_mate: {
        name: "Mate de Greco",
        pattern: "Ataque a f7",
        weakness: "f7 solo defendido por rey",
        historical: "Gioachino Greco s.XVII",
        opening_context: "Común en Italiana"
    }
};
```

---

## 🔌 **INTEGRACIÓN LICHESS API**

### 📡 **Endpoints Específicos**
```javascript
const LICHESS_API_CONFIG = {
    base_url: "https://lichess.org/api",
    
    endpoints: {
        // Puzzles por tema
        mate_puzzles: "/puzzle?themes=mate,mateIn1,mateIn2",
        opening_puzzles: "/puzzle?themes=opening,trap", 
        
        // Aperturas
        opening_explorer: "/opening?variant=standard&speeds=blitz,rapid,classical",
        
        // Partidas famosas
        master_games: "/games/search?players=morphy,capablanca,kasparov",
        
        // Estudios
        compositions: "/study?category=composition",
        
        // Puzzle diario
        daily_puzzle: "/puzzle/daily"
    },
    
    fallback_strategy: "usar base de datos local si API falla",
    rate_limit: "respetar límites de Lichess"
};

// Función para obtener contenido dinámico
async function getLichessContent(level) {
    const levelConfig = MEMORY_LEVELS[level];
    
    try {
        let endpoint;
        if (levelConfig.type === "opening_structure") {
            endpoint = `${LICHESS_API_CONFIG.base_url}/opening?name=${levelConfig.opening_name}`;
        } else if (levelConfig.type === "famous_mate") {
            endpoint = `${LICHESS_API_CONFIG.base_url}/puzzle?themes=${levelConfig.mate_theme}`;
        }
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        return adaptLichessData(data, levelConfig);
        
    } catch (error) {
        console.log('Usando base de datos local como fallback');
        return LOCAL_DATABASE[levelConfig.content_type];
    }
}
```

### 🎨 **Uso de Piezas de Lichess**
```javascript
// EXCEPCIÓN PERMITIDA: Usar piezas de Lichess para coherencia
const LICHESS_PIECES_CONFIG = {
    piece_set: "cburnett", // Set por defecto de Lichess
    base_url: "https://lichess1.org/assets/piece/cburnett/",
    
    pieces: {
        "white_king": "wK.svg",
        "white_queen": "wQ.svg", 
        "white_rook": "wR.svg",
        "white_bishop": "wB.svg",
        "white_knight": "wN.svg",
        "white_pawn": "wP.svg",
        "black_king": "bK.svg",
        "black_queen": "bQ.svg",
        "black_rook": "bR.svg", 
        "black_bishop": "bB.svg",
        "black_knight": "bN.svg",
        "black_pawn": "bP.svg"
    },
    
    // Alternativa: Usar Unicode si no se pueden cargar SVGs
    unicode_fallback: {
        "K": "♔", "Q": "♕", "R": "♖", "B": "♗", "N": "♘", "P": "♙",
        "k": "♚", "q": "♛", "r": "♜", "b": "♝", "n": "♞", "p": "♟"
    }
};
```

---

## 🎮 **ESPECIFICACIONES TÉCNICAS**

### 📁 **Estructura de Archivos**
```
ChessArcade/
├── games/
│   ├── knight-quest/           # ✅ Existente
│   ├── square-rush/            # ✅ Existente  
│   └── memory-matrix/          # 🚧 NUEVO
│       ├── index.html          # Juego principal
│       ├── memory-matrix.css   # Estilos específicos
│       ├── memory-matrix.js    # Lógica principal
│       ├── memory-engine.js    # Motor del juego
│       ├── drag-drop.js        # Sistema drag & drop
│       ├── opening-database.js # Base de aperturas
│       ├── mates-database.js   # Base de mates famosos
│       └── lichess-api.js      # Integración API
├── assets/
│   ├── css/
│   │   └── chessarcade-shared.css # Estilos compartidos
│   ├── js/
│   │   ├── chess-engine.js     # Motor compartido
│   │   └── audio-manager.js    # Control de audio
│   └── sounds/
│       ├── correct.wav
│       ├── wrong.wav
│       └── level-up.wav
```

### 🎨 **Coherencia Visual ChessArcade**

#### **OBLIGATORIO: Elementos Compartidos**
```css
/* Paleta de colores unificada */
:root {
    --neon-cyan: #00ffff;      /* Primario */
    --neon-green: #00ff80;     /* Success/Correct */
    --neon-pink: #ff0080;      /* Branding/Error */
    --neon-blue: #0080ff;      /* Secondary */
    --neon-orange: #ff8000;    /* Combo/Special */
    --gold: #ffd700;           /* Score */
    --dark-bg: linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #330066 100%);
}

/* Grid background animado (OBLIGATORIO) */
.chess-arcade-bg::before {
    content: '';
    position: fixed;
    background-image: 
        linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
}

/* Botón de sonido flotante (OBLIGATORIO) */
.sound-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid var(--neon-cyan);
    border-radius: 50%;
    z-index: 1000;
}

/* Botón HOME flotante (OBLIGATORIO) */
.home-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid var(--neon-green);
    border-radius: 50%;
    z-index: 1000;
}
```

#### **Elementos Específicos de Memory Matrix**
```css
/* Piezas fantasma (semi-transparentes) */
.piece.translucent {
    opacity: 0.4;
    filter: blur(1px);
    border: 2px dashed var(--neon-cyan);
    animation: ghostly 3s ease-in-out infinite;
}

/* Banco de piezas para drag & drop */
.piece-bank {
    display: flex;
    gap: 10px;
    padding: 20px;
    background: rgba(0,0,0,0.8);
    border: 2px solid var(--neon-cyan);
    border-radius: 15px;
}

.draggable-piece {
    width: 50px;
    height: 50px;
    cursor: grab;
    transition: all 0.3s ease;
}

/* Highlighting para estructuras */
.pawn-structure-highlight {
    background: linear-gradient(45deg, 
        rgba(0, 255, 128, 0.3), 
        rgba(0, 255, 255, 0.3)
    );
    border: 2px solid var(--neon-green);
    animation: structurePulse 2s ease-in-out infinite;
}

/* Panel de información histórica */
.historical-panel {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--neon-orange);
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}

.mate-story {
    background: rgba(255, 0, 128, 0.1);
    border-left: 4px solid var(--neon-pink);
    padding: 15px;
    margin: 15px 0;
}
```

### 🎮 **Sistema de Drag & Drop**
```javascript
class DragDropSystem {
    constructor() {
        this.draggedPiece = null;
        this.validDropZones = [];
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Touch y mouse support
        document.addEventListener('mousedown', this.handleDragStart.bind(this));
        document.addEventListener('touchstart', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('touchmove', this.handleDragMove.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));
        document.addEventListener('touchend', this.handleDragEnd.bind(this));
    }
    
    handleDragStart(e) {
        const piece = e.target.closest('.draggable-piece');
        if (!piece) return;
        
        this.draggedPiece = piece;
        piece.classList.add('dragging');
        
        // Highlight valid drop zones
        this.highlightValidDrops(piece.dataset.pieceType);
    }
    
    handleDragEnd(e) {
        if (!this.draggedPiece) return;
        
        const dropZone = this.getDropZoneAt(e.clientX, e.clientY);
        
        if (dropZone && this.isValidDrop(dropZone)) {
            this.placePiece(this.draggedPiece, dropZone);
            this.checkPlacement(dropZone);
        }
        
        this.cleanup();
    }
    
    isValidDrop(dropZone) {
        return this.validDropZones.includes(dropZone.id);
    }
    
    checkPlacement(dropZone) {
        const correctPiece = dropZone.dataset.expectedPiece;
        const placedPiece = this.draggedPiece.dataset.pieceType;
        
        if (correctPiece === placedPiece) {
            this.handleCorrectPlacement(dropZone);
        } else {
            this.handleIncorrectPlacement(dropZone);
        }
    }
}
```

---

## 🎯 **CONFIGURACIÓN OBLIGATORIA**

### 📊 **Analytics (OBLIGATORIO)**
```javascript
// Google Analytics ID
const GA_TRACKING_ID = 'G-N3EKXHPD5Y';

// Eventos a trackear
const ANALYTICS_EVENTS = {
    game_init: 'Memory Matrix iniciado',
    level_start: 'Nivel comenzado', 
    phase_complete: 'Fase completada (peones/fantasma/completo)',
    piece_placed: 'Pieza colocada',
    level_complete: 'Nivel completado',
    opening_learned: 'Apertura aprendida',
    mate_memorized: 'Mate famoso memorizado',
    game_exit: 'Salida del juego'
};

// Implementación
function trackEvent(event, data) {
    gtag('event', event, {
        'game': 'memory_matrix',
        'level': gameState.level,
        'phase': gameState.currentPhase,
        ...data
    });
}
```

### 💰 **AdSense (OBLIGATORIO)**
```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2472413468382197" crossorigin="anonymous"></script>

<!-- Placement estratégico -->
<div class="ad-banner-top">
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="1234567890"></ins>
</div>

<div class="ad-banner-bottom">
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="5555555555"></ins>
</div>
```

### 🔊 **Audio System (OBLIGATORIO)**
```javascript
// Howler.js para audio
const AUDIO_CONFIG = {
    sounds: {
        correct: 'correct.wav',
        wrong: 'wrong.wav', 
        level_up: 'level-up.wav',
        piece_place: 'piece-place.wav',
        phase_complete: 'phase-complete.wav'
    },
    
    volume: 0.6,
    storage_key: 'memoryMatrixSound'
};

// Integración con botón flotante
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    localStorage.setItem('memoryMatrixSound', gameState.soundEnabled ? 'enabled' : 'disabled');
    updateSoundButton();
}
```

---

## 🚀 **PLAN DE DESARROLLO**

### 📅 **Sprint 1 (Semana 1): Fundamentos**
- [ ] Setup estructura de archivos
- [ ] Engine básico con sistema por capas
- [ ] Niveles 1-5 (mates básicos)
- [ ] Sistema drag & drop básico
- [ ] UI coherente con ChessArcade

### 📅 **Sprint 2 (Semana 2): Aperturas**
- [ ] Niveles 11-15 (aperturas básicas)
- [ ] Sistema de piezas fantasma
- [ ] Base de datos de aperturas
- [ ] Integración Lichess API inicial

### 📅 **Sprint 3 (Semana 3): Mates Famosos**
- [ ] Niveles 16-20 (mates clásicos)
- [ ] Base de datos de mates famosos
- [ ] Paneles históricos e informativos
- [ ] Sistema de variantes

### 📅 **Sprint 4 (Semana 4): Polish y Launch**
- [ ] Niveles 21-30 (maestría)
- [ ] Testing completo
- [ ] Optimización mobile
- [ ] Deploy y monitoring

---

## 🎯 **CRITERIOS DE ÉXITO**

### ✅ **Funcionalidad Completa**
- 30 niveles completamente jugables
- Sistema pedagógico por capas funcionando
- Drag & drop fluido en móvil y desktop
- Integración Lichess API operativa
- Base de datos local como fallback

### 🎨 **UI/UX Perfecta**
- Coherencia 100% con ChessArcade
- Piezas fantasma semi-transparentes
- Highlighting de estructuras de peones
- Paneles informativos históricos
- Responsive perfecto

### 🔧 **Técnico**
- Performance Lighthouse >85
- Cross-browser compatible
- Memoria eficiente (sin leaks)
- AdSense integration ready
- Analytics tracking completo

---

## 🎮 **MECÁNICAS DE JUEGO ESPECÍFICAS**

### 🏗️ **Sistema Pedagógico por Capas**

#### **CAPA 1: Solo Estructura de Peones** 🔸
```javascript
function playPawnStructurePhase(opening) {
    // 1. Mostrar solo los peones de la apertura
    const pawnOnlyFEN = extractPawnsFromFEN(opening.fen);
    
    showPosition({
        title: `🔸 ${opening.name} - ESTRUCTURA BASE`,
        fen: pawnOnlyFEN,
        viewTime: 10000, // Más tiempo para estudiar
        background: "highlight_center",
        explanation: opening.pawn_explanation,
        moves_shown: opening.initial_moves
    });
    
    // 2. Ocultar peones específicos
    hidePieces(opening.key_pawns);
    
    // 3. Player coloca peones
    activatePawnPlacement({
        pieces: opening.missing_pawns,
        hint: "¿Dónde van los peones centrales?",
        success_message: "🎯 ¡Perfecto! Esta es la base de la apertura"
    });
}
```

#### **CAPA 2: Piezas Semi-transparentes** 👻
```javascript
function playTranslucentPhase(opening) {
    // 1. Mostrar posición con piezas fantasma
    showPosition({
        title: `👻 ${opening.name} - CON DESARROLLO`,
        fen: opening.fen,
        viewTime: 8000,
        special_effects: {
            translucent: opening.key_pieces, // 40% opacidad
            highlight: opening.key_squares,
            arrows: opening.piece_relationships
        }
    });
    
    // 2. Ocultar algunas piezas clave
    hidePieces(opening.hidden_pieces);
    
    // 3. Player coloca piezas sólidas
    activatePiecePlacement({
        challenge: "¿Dónde van las piezas que apoyan los peones?",
        hint: opening.development_hint,
        ghosted_pieces: opening.translucent_pieces
    });
}
```

#### **CAPA 3: Posición Completa** ♟️
```javascript
function playCompletePhase(opening) {
    // 1. Mostrar apertura completa con variantes
    showPosition({
        title: `♟️ ${opening.name} - MAESTRÍA TOTAL`,
        fen: opening.fen,
        viewTime: 5000,
        extras: {
            show_variations: true,
            move_sequence: opening.moves,
            strategic_arrows: opening.plans
        }
    });
    
    // 2. Test final de memoria
    const randomHidden = selectRandomPieces(opening.fen, difficulty);
    hidePieces(randomHidden);
    
    // 3. Recrear posición completa
    activateCompleteMemory({
        challenge: "Recrea la posición magistral completa",
        time_limit: 60000,
        perfection_required: true
    });
}
```

### ⚡ **Sistema de Mates Famosos**
```javascript
function playFamousMateMemo ry(mate) {
    // 1. Mostrar contexto histórico
    showHistoricalContext({
        title: mate.name,
        story: mate.historical.story,
        players: mate.historical.players,
        year: mate.historical.year,
        significance: mate.significance
    });
    
    // 2. Mostrar posición crítica
    showPosition({
        fen: mate.fen,
        viewTime: mate.view_time,
        highlight: mate.key_squares,
        pattern_explanation: mate.pattern_description
    });
    
    // 3. Ocultar piezas del mate
    hidePieces(mate.mating_pieces);
    
    // 4. Challenge de memoria
    activateMateReconstruction({
        pieces_to_place: mate.mating_pieces,
        hint: mate.pattern_hint,
        sequence_to_show: mate.mating_sequence
    });
    
    // 5. Mostrar la secuencia completa si es correcto
    if (correct) {
        playMateSequence(mate.move_sequence);
        showLessonLearned(mate.tactical_lesson);
    }
}
```

---

## 📊 **ESTRUCTURA HTML PRINCIPAL**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Matrix - ChessArcade</title>
    <meta name="description" content="Entrena tu memoria ajedrecística con Memory Matrix. Aprende estructuras de aperturas y mates famosos desde nivel principiante hasta Gran Maestro.">
    
    <!-- OBLIGATORIOS: Google AdSense + Analytics -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2472413468382197" crossorigin="anonymous"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-N3EKXHPD5Y"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-N3EKXHPD5Y');
    </script>
    
    <!-- Fuentes y estilos -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../assets/css/chessarcade-shared.css">
    <link rel="stylesheet" href="memory-matrix.css">
</head>

<body>
    <div class="game-container chess-arcade-bg">
        
        <!-- OBLIGATORIOS: Botones flotantes -->
        <div class="home-toggle" id="homeBtn" title="Volver al inicio">🏠</div>
        <div class="sound-toggle" id="soundToggle" title="Toggle Sound">🔊</div>
        
        <!-- Header del juego -->
        <div class="game-header">
            <div class="game-title">🧠 MEMORY MATRIX</div>
            <div class="game-subtitle">Master chess patterns through memory!</div>
        </div>
        
        <!-- UI de estado del juego -->
        <div class="game-ui">
            <div class="level-info">
                <div class="level-number" id="levelNumber">1</div>
                <div class="level-name" id="levelName">DOS REYES SOLOS</div>
                <div class="level-phase" id="levelPhase">🔸 Estructura Base</div>
                <div class="level-description" id="levelDescription">Los reyes nunca pueden estar juntos</div>
            </div>
            
            <div class="memory-stats">
                <div class="pieces-total">Piezas: <span id="piecesTotal">2</span></div>
                <div class="pieces-hidden">Ocultas: <span id="piecesHidden">2</span></div>
                <div class="view-time">Vista: <span id="viewTime">8.0s</span></div>
            </div>
            
            <div class="score-info">
                <div class="score">Score: <span id="score">0</span></div>
                <div class="accuracy">Precisión: <span id="accuracy">100%</span></div>
                <div class="progress">
                    Nivel <span id="currentLevel">1</span>/30
                </div>
            </div>
        </div>
        
        <!-- Panel de información histórica/educativa -->
        <div class="educational-panel" id="educationalPanel">
            <div class="panel-title" id="panelTitle">🏰 Información de Apertura</div>
            <div class="panel-content" id="panelContent">
                <div class="opening-info" id="openingInfo" style="display:none;">
                    <div class="opening-name" id="openingName"></div>
                    <div class="opening-moves" id="openingMoves"></div>
                    <div class="opening-ideas" id="openingIdeas"></div>
                </div>
                <div class="mate-info" id="mateInfo" style="display:none;">
                    <div class="mate-name" id="mateName"></div>
                    <div class="historical-context" id="historicalContext"></div>
                    <div class="mate-pattern" id="matePattern"></div>
                </div>
            </div>
        </div>
        
        <!-- Banner Ad Superior -->
        <div class="ad-banner-top">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="1111111111" data-ad-format="auto"></ins>
        </div>
        
        <!-- Área de visualización de posición -->
        <div class="position-display" id="positionDisplay">
            <div class="chess-board" id="chessBoard">
                <!-- Tablero generado por JS -->
            </div>
            <div class="position-overlay" id="positionOverlay">
                <div class="overlay-text" id="overlayText">¡Memoriza la posición!</div>
                <div class="overlay-countdown" id="overlayCountdown">8</div>
                <div class="phase-indicator" id="phaseIndicator">🔸 Solo Peones</div>
            </div>
        </div>
        
        <!-- Banco de piezas para drag & drop -->
        <div class="piece-bank-container" id="pieceBankContainer" style="display:none;">
            <div class="bank-title">Arrastra las piezas al tablero:</div>
            <div class="piece-bank" id="pieceBank">
                <!-- Piezas generadas dinámicamente -->
            </div>
        </div>
        
        <!-- Controles del juego -->
        <div class="game-controls">
            <button class="btn btn-primary" id="startBtn">EMPEZAR NIVEL</button>
            <button class="btn btn-secondary" id="pauseBtn" disabled>PAUSA</button>
            <button class="btn btn-secondary" id="hintBtn">PISTA</button>
            <button class="btn btn-secondary" id="skipPhaseBtn">SALTAR FASE</button>
        </div>
        
        <!-- Feedback de colocación -->
        <div class="feedback-display" id="feedbackDisplay" style="display:none;">
            <div class="feedback-icon" id="feedbackIcon">✅</div>
            <div class="feedback-text" id="feedbackText">¡Correcto!</div>
            <div class="feedback-explanation" id="feedbackExplanation">Has colocado la pieza en el lugar correcto</div>
        </div>
        
        <!-- Pantalla de completar nivel -->
        <div class="level-complete" id="levelCompleteScreen">
            <div class="level-complete-content">
                <div class="complete-title" id="completeTitle">¡NIVEL COMPLETADO!</div>
                <div class="complete-stats">
                    <div class="final-score">Puntuación: <span id="finalScore">0</span></div>
                    <div class="accuracy-final">Precisión: <span id="accuracyFinal">100%</span></div>
                    <div class="time-total">Tiempo total: <span id="timeTotal">45s</span></div>
                    <div class="phase-summary" id="phaseSummary">3/3 fases completadas</div>
                </div>
                
                <!-- Información educativa -->
                <div class="lesson-learned" id="lessonLearned">
                    <div class="lesson-title">📚 Has aprendido:</div>
                    <div class="lesson-content" id="lessonContent"></div>
                </div>
                
                <!-- Banner Ad Interstitial -->
                <div class="ad-interstitial">
                    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="2222222222" data-ad-format="auto"></ins>
                </div>
                
                <div class="level-complete-actions">
                    <button class="btn btn-primary" id="nextLevelBtn">SIGUIENTE NIVEL</button>
                    <button class="btn btn-secondary" id="repeatLevelBtn">REPETIR NIVEL</button>
                    <button class="btn btn-secondary" id="mainMenuBtn">MENÚ PRINCIPAL</button>
                </div>
            </div>
        </div>
        
        <!-- Banner Ad Inferior -->
        <div class="ad-banner-bottom">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2472413468382197" data-ad-slot="3333333333" data-ad-format="auto"></ins>
        </div>
        
    </div>
    
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
    <script src="../../assets/js/chess-engine.js"></script>
    <script src="../../assets/js/audio-manager.js"></script>
    <script src="opening-database.js"></script>
    <script src="mates-database.js"></script>
    <script src="lichess-api.js"></script>
    <script src="drag-drop.js"></script>
    <script src="memory-engine.js"></script>
    <script src="memory-matrix.js"></script>
    
    <!-- AdSense Initialization -->
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
        (adsbygoogle = window.adsbygoogle || []).push({});
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>
```

---

## 🔧 **MOTOR DEL JUEGO (memory-engine.js)**

```javascript
class MemoryMatrixEngine {
    constructor() {
        this.gameState = {
            level: 1,
            currentPhase: 'A', // A=peones, B=fantasma, C=completo
            score: 0,
            accuracy: 100,
            correctPlacements: 0,
            totalAttempts: 0,
            gameActive: false,
            viewPhase: true,
            soundEnabled: true,
            currentPosition: null,
            hiddenPieces: [],
            placedPieces: {},
            sessionStartTime: Date.now()
        };
        
        this.dragDropSystem = new DragDropSystem();
        this.audioManager = new AudioManager();
        this.lichessAPI = new LichessAPI();
        
        this.loadPreferences();
    }
    
    // 🎮 Control principal del juego
    async startLevel(levelNumber) {
        const levelConfig = MEMORY_LEVELS[levelNumber];
        if (!levelConfig) {
            console.error(`Nivel ${levelNumber} no existe`);
            return;
        }
        
        this.gameState.level = levelNumber;
        this.gameState.currentPhase = 'A';
        this.gameState.gameActive = true;
        
        // Cargar contenido del nivel
        await this.loadLevelContent(levelConfig);
        
        // Comenzar con la primera fase
        this.startPhase(this.gameState.currentPhase);
        
        // Analytics
        this.trackEvent('level_start', {
            level: levelNumber,
            type: levelConfig.type,
            target_age: levelConfig.target_age
        });
    }
    
    async loadLevelContent(levelConfig) {
        // Intentar cargar desde Lichess API primero
        try {
            if (levelConfig.type === 'opening_structure') {
                this.gameState.currentPosition = await this.lichessAPI.getOpeningPosition(levelConfig.opening_name);
            } else if (levelConfig.type === 'famous_mate') {
                this.gameState.currentPosition = await this.lichessAPI.getMatePosition(levelConfig.mate_pattern);
            }
        } catch (error) {
            console.log('Usando base de datos local');
            this.gameState.currentPosition = this.getLocalContent(levelConfig);
        }
    }
    
    startPhase(phase) {
        const levelConfig = MEMORY_LEVELS[this.gameState.level];
        const phaseConfig = levelConfig.phases[phase];
        
        if (!phaseConfig) {
            this.completeLevel();
            return;
        }
        
        this.gameState.currentPhase = phase;
        this.updatePhaseUI(phaseConfig);
        
        // Lógica específica por fase
        switch(phase) {
            case 'A': // Solo peones
                this.startPawnPhase(phaseConfig);
                break;
            case 'B': // Piezas fantasma
                this.startTranslucentPhase(phaseConfig);
                break;
            case 'C': // Posición completa
                this.startCompletePhase(phaseConfig);
                break;
        }
    }
    
    startPawnPhase(phaseConfig) {
        // Extraer solo los peones del FEN
        const pawnOnlyFEN = this.extractPawnsFromFEN(phaseConfig.fen);
        
        // Mostrar posición con solo peones
        this.showPosition({
            fen: pawnOnlyFEN,
            viewTime: phaseConfig.time_view,
            title: phaseConfig.title,
            explanation: phaseConfig.explanation,
            highlight: 'center_squares'
        });
        
        // Programar ocultación de peones
        setTimeout(() => {
            this.hidePieces(phaseConfig.hidden);
            this.activateMemoryMode('pawn_placement');
        }, phaseConfig.time_view);
    }
    
    startTranslucentPhase(phaseConfig) {
        // Mostrar posición completa con algunas piezas semi-transparentes
        this.showPosition({
            fen: phaseConfig.fen,
            viewTime: phaseConfig.time_view,
            title: phaseConfig.title,
            explanation: phaseConfig.explanation,
            translucent: phaseConfig.translucent // Piezas fantasma
        });
        
        setTimeout(() => {
            this.hidePieces(phaseConfig.hidden);
            this.activateMemoryMode('piece_placement');
        }, phaseConfig.time_view);
    }
    
    startCompletePhase(phaseConfig) {
        // Mostrar posición completa
        this.showPosition({
            fen: phaseConfig.fen,
            viewTime: phaseConfig.time_view,
            title: phaseConfig.title,
            explanation: phaseConfig.explanation,
            show_variations: true
        });
        
        setTimeout(() => {
            const randomPieces = this.selectRandomHiddenPieces(phaseConfig.fen, this.gameState.level);
            this.hidePieces(randomPieces);
            this.activateMemoryMode('complete_reconstruction');
        }, phaseConfig.time_view);
    }
    
    // 🎯 Sistema de colocación de piezas
    activateMemoryMode(mode) {
        this.gameState.viewPhase = false;
        this.hidePositionOverlay();
        this.showPieceBank(mode);
        this.enableDragDrop();
        
        // Timer para la fase de memoria
        this.startMemoryTimer();
    }
    
    handlePiecePlacement(piece, square) {
        const expectedPiece = this.getExpectedPiece(square);
        const placedPiece = piece.dataset.pieceType;
        
        this.gameState.totalAttempts++;
        
        if (expectedPiece === placedPiece) {
            this.handleCorrectPlacement(piece, square);
        } else {
            this.handleIncorrectPlacement(piece, square);
        }
        
        this.updateAccuracy();
        this.checkPhaseCompletion();
    }
    
    handleCorrectPlacement(piece, square) {
        this.gameState.correctPlacements++;
        this.gameState.score += this.calculatePlacementScore();
        
        // Efecto visual
        square.classList.add('correct-placement');
        this.playSound('correct');
        
        // Guardar colocación
        this.gameState.placedPieces[square.id] = piece.dataset.pieceType;
        
        // Feedback
        this.showFeedback(true, 'Colocación correcta');
        
        // Analytics
        this.trackEvent('piece_placed', {
            correct: true,
            square: square.id,
            piece: piece.dataset.pieceType,
            phase: this.gameState.currentPhase
        });
    }
    
    handleIncorrectPlacement(piece, square) {
        // Efecto visual de error
        square.classList.add('incorrect-placement');
        this.playSound('wrong');
        
        // Retornar pieza al banco
        this.returnPieceToBank(piece);
        
        // Feedback
        this.showFeedback(false, 'Pieza incorrecta');
        
        // Analytics
        this.trackEvent('piece_placed', {
            correct: false,
            square: square.id,
            piece: piece.dataset.pieceType,
            expected: this.getExpectedPiece(square),
            phase: this.gameState.currentPhase
        });
    }
    
    checkPhaseCompletion() {
        if (this.allPiecesPlaced()) {
            this.completePhase();
        }
    }
    
    completePhase() {
        this.playSound('phase_complete');
        
        // Mostrar todas las piezas correctas brevemente
        this.revealAllPieces();
        
        setTimeout(() => {
            const nextPhase = this.getNextPhase();
            if (nextPhase) {
                this.startPhase(nextPhase);
            } else {
                this.completeLevel();
            }
        }, 2000);
        
        // Analytics
        this.trackEvent('phase_complete', {
            phase: this.gameState.currentPhase,
            accuracy: this.calculatePhaseAccuracy(),
            time_taken: this.getPhaseTime()
        });
    }
    
    completeLevel() {
        this.gameState.gameActive = false;
        this.playSound('level_up');
        
        const levelStats = this.calculateLevelStats();
        this.showLevelComplete(levelStats);
        
        // Guardar progreso
        this.saveProgress();
        
        // Analytics
        this.trackEvent('level_complete', {
            level: this.gameState.level,
            total_score: this.gameState.score,
            accuracy: this.gameState.accuracy,
            phases_completed: this.getPhasesCompleted(),
            session_time: Date.now() - this.gameState.sessionStartTime
        });
    }
    
    // 🎨 Renderizado y efectos visuales
    showPosition(config) {
        const board = document.getElementById('chessBoard');
        board.innerHTML = '';
        
        const position = this.parseFEN(config.fen);
        
        // Crear tablero
        for (let rank = 8; rank >= 1; rank--) {
            for (let file = 1; file <= 8; file++) {
                const square = this.createSquare(file, rank, position);
                
                // Aplicar efectos especiales
                if (config.translucent && this.isPieceTranslucent(square, config.translucent)) {
                    square.classList.add('translucent');
                }
                
                if (config.highlight === 'center_squares' && this.isCenterSquare(square)) {
                    square.classList.add('center-highlight');
                }
                
                board.appendChild(square);
            }
        }
        
        // Mostrar overlay de tiempo
        this.showPositionOverlay(config);
        
        // Programar countdown
        this.startViewCountdown(config.viewTime);
    }
    
    createSquare(file, rank, position) {
        const square = document.createElement('div');
        const coordinate = String.fromCharCode(96 + file) + rank;
        
        square.className = `square ${(file + rank) % 2 === 0 ? 'light' : 'dark'}`;
        square.id = coordinate;
        square.dataset.coordinate = coordinate;
        
        // Agregar pieza si existe
        const piece = position[coordinate];
        if (piece) {
            const pieceElement = this.createPieceElement(piece);
            square.appendChild(pieceElement);
        }
        
        return square;
    }
    
    // 📊 Utilidades y cálculos
    calculatePlacementScore() {
        const baseScore = 100;
        const phaseMultiplier = { 'A': 1, 'B': 1.5, 'C': 2 };
        const levelMultiplier = Math.floor(this.gameState.level / 5) + 1;
        
        return baseScore * phaseMultiplier[this.gameState.currentPhase] * levelMultiplier;
    }
    
    updateAccuracy() {
        if (this.gameState.totalAttempts > 0) {
            this.gameState.accuracy = Math.round(
                (this.gameState.correctPlacements / this.gameState.totalAttempts) * 100
            );
        }
    }
    
    extractPawnsFromFEN(fen) {
        // Extraer solo los peones del FEN, reemplazar otras piezas con vacío
        const parts = fen.split(' ');
        const position = parts[0];
        
        const pawnOnlyPosition = position.replace(/[KQRBNkqrbn]/g, '1');
        
        return pawnOnlyPosition + ' ' + parts.slice(1).join(' ');
    }
    
    // 🔊 Audio y preferencias
    playSound(soundName) {
        if (this.gameState.soundEnabled) {
            this.audioManager.playSound(soundName);
        }
    }
    
    toggleSound() {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        this.updateSoundButton();
        this.savePreferences();
        
        this.trackEvent('sound_toggled', {
            enabled: this.gameState.soundEnabled
        });
    }
    
    loadPreferences() {
        const soundPref = localStorage.getItem('memoryMatrixSound');
        this.gameState.soundEnabled = soundPref !== 'disabled';
        
        const savedLevel = localStorage.getItem('memoryMatrixLevel');
        if (savedLevel) {
            this.gameState.level = parseInt(savedLevel);
        }
    }
    
    savePreferences() {
        localStorage.setItem('memoryMatrixSound', this.gameState.soundEnabled ? 'enabled' : 'disabled');
        localStorage.setItem('memoryMatrixLevel', this.gameState.level.toString());
    }
    
    // 📈 Analytics
    trackEvent(event, data = {}) {
        gtag('event', event, {
            'game': 'memory_matrix',
            'level': this.gameState.level,
            'phase': this.gameState.currentPhase,
            'score': this.gameState.score,
            'accuracy': this.gameState.accuracy,
            ...data
        });
    }
}
```

---

## 📝 **CONFIGURACIÓN DE NIVELES COMPLETA**

```javascript
const MEMORY_LEVELS = {
    // FASE 1: BABY MEMORY (1-10)
    1: {
        name: "DOS REYES SOLOS",
        type: "basic_mate",
        target_age: "4-5 años",
        phases: {
            A: {
                title: "🔸 ENCUENTRA LOS REYES",
                fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
                hidden: ["both_kings"],
                time_view: 8000,
                explanation: "🤴 Los reyes nunca pueden estar muy cerca"
            }
        }
    },
    
    // FASE 2: PATTERN MASTER (11-20)
    11: {
        name: "APERTURA ITALIANA",
        type: "opening_structure",
        target_age: "8-12 años",
        opening_name: "Italian Game",
        phases: {
            A: {
                title: "🔸 ITALIANA - ESTRUCTURA BASE",
                fen: "8/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/8 w - - 0 1",
                hidden: ["e4", "e5"],
                time_view: 10000,
                explanation: "🏗️ Centro clásico e4-e5, base de la apertura",
                focus: "Los peones centrales controlan el juego"
            },
            B: {
                title: "👻 ITALIANA - CON DESARROLLO",
                fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
                translucent: ["Bc4", "Nf3", "Nc6"],
                hidden: ["f7_pawn", "d7_pawn"],
                time_view: 8000,
                explanation: "👻 Las piezas apoyan la estructura de peones"
            },
            C: {
                title: "♟️ ITALIANA - MAESTRÍA TOTAL",
                fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
                hidden: ["random_selection"],
                time_view: 5000,
                explanation: "🏆 Domina la posición completa de la Italiana"
            }
        },
        opening_info: {
            moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4"],
            ideas: ["Desarrollo rápido", "Ataque a f7", "Control del centro"],
            variations: ["Defensa Húngara", "Dos Caballos", "Gambito Italiano"]
        }
    },
    
    16: {
        name: "MATE DE LEGAL",
        type: "famous_mate",
        target_age: "10+ años",
        mate_pattern: "queen_sacrifice",
        phases: {
            A: {
                title: "⚖️ HISTORIA DEL MATE DE LEGAL",
                fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
                hidden: ["white_queen", "bishop_c4"],
                time_view: 8000,
                explanation: "⚖️ Sire de Legal sacrifica la dama por mate brillante"
            }
        },
        historical: {
            players: "Sire de Legal vs Saint Brie",
            year: "París 1750",
            story: "Primera partida documentada de este sacrificio",
            sequence: ["Nxe5", "Bxd1", "Bxf7+", "Ke7", "Nd5#"]
        },
        lesson: "A veces hay que sacrificar lo más valioso por la victoria"
    },
    
    // FASE 3: GRANDMASTER MEMORY (21-30)
    21: {
        name: "PARTIDA INMORTAL",
        type: "immortal_game",
        target_age: "14+ años",
        game_reference: "anderssen_kieseritzky_1851",
        phases: {
            A: {
                title: "🏆 MOMENTO CRÍTICO - PARTIDA INMORTAL",
                fen: "r1bq1rk1/ppp1nppp/3p1n2/2bPp3/2B1P3/2N2N2/PPP1QPPP/R1B1K2R w KQ - 0 9",
                hidden: ["attacking_pieces"],
                time_view: 3000,
                explanation: "🎭 Berlín 1851 - La combinación más bella del ajedrez"
            }
        },
        historical: {
            players: "Adolf Anderssen vs Lionel Kieseritzky",
            venue: "Café de la Régence, París",
            significance: "Primera 'partida inmortal' de la historia",
            brilliancy: "Sacrificio de ambas torres y la dama"
        }
    },
    
    30: {
        name: "DESAFÍO IMPOSIBLE",
        type: "ultimate_memory",
        target_age: "Grandes Maestros",
        phases: {
            A: {
                title: "🧠 MEMORIA FOTOGRÁFICA ABSOLUTA",
                fen: "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R1BQKR2 w Qkq - 0 8",
                hidden: "almost_everything", // 28 de 30 piezas
                time_view: 1000, // Solo 1 segundo
                explanation: "🏆 Solo para los elegidos: recrear de memoria total"
            }
        }
    }
};
```

---

## 🎯 **SISTEMA DE HINTS PROGRESIVOS**

```javascript
const HINT_SYSTEM = {
    // Hints por nivel de edad
    baby_mode: {
        hints: [
            "🔍 Mira dónde brillan las piezas importantes",
            "👑 ¿Dónde estaba el rey?",
            "✨ La pieza más grande da mate"
        ],
        visual_aids: true,
        time_extension: 5000 // +5 segundos extra
    },
    
    intermediate_mode: {
        hints: [
            "📖 Este es un patrón de mate clásico",
            "🎯 ¿Cuál era la pieza atacante principal?",
            "⚡ Busca la línea de ataque"
        ],
        visual_aids: "subtle",
        time_extension: 3000
    },
    
    master_mode: {
        hints: [
            "🏆 Esta posición es de una partida famosa",
            "🧠 Visualiza el patrón geométrico",
            "♟️ Las piezas trabajan en coordinación perfecta"
        ],
        visual_aids: false,
        time_extension: 0 // Sin tiempo extra
    }
};

function showHint(level, hintNumber) {
    const ageGroup = determineAgeGroup(level);
    const hintConfig = HINT_SYSTEM[ageGroup];
    const hint = hintConfig.hints[hintNumber - 1];
    
    if (hint) {
        showHintDisplay(hint, hintConfig.visual_aids);
        
        if (hintConfig.time_extension > 0) {
            extendTimer(hintConfig.time_extension);
        }
        
        // Analytics
        trackEvent('hint_used', {
            level: level,
            hint_number: hintNumber,
            age_group: ageGroup
        });
    }
}
```

---

## 🎨 **ESTILOS CSS ESPECÍFICOS**

```css
/* memory-matrix.css - Estilos específicos del juego */

/* Hereda todos los estilos base de ChessArcade */
@import "../../assets/css/chessarcade-shared.css";

/* === ELEMENTOS ESPECÍFICOS DE MEMORY MATRIX === */

/* Fases del juego */
.level-phase {
    font-size: 0.9rem;
    color: var(--neon-orange);
    text-align: center;
    margin: 0.2rem 0;
    font-weight: 700;
}

/* Piezas fantasma (semi-transparentes) */
.piece.translucent {
    opacity: 0.4;
    filter: blur(1px);
    border: 2px dashed var(--neon-cyan);
    animation: ghostly 3s ease-in-out infinite;
    position: relative;
}

.piece.translucent::after {
    content: '👻';
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 0.7rem;
    background: var(--neon-pink);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

@keyframes ghostly {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
}

/* Highlighting para estructuras de peones */
.center-highlight {
    background: linear-gradient(45deg, 
        rgba(0, 255, 128, 0.3), 
        rgba(0, 255, 255, 0.3)
    ) !important;
    border: 2px solid var(--neon-green);
    animation: structurePulse 2s ease-in-out infinite;
}

@keyframes structurePulse {
    0%, 100% { box-shadow: 0 0 10px var(--neon-green); }
    50% { box-shadow: 0 0 25px var(--neon-green); }
}

/* Banco de piezas para drag & drop */
.piece-bank-container {
    margin: 20px 0;
    text-align: center;
}

.bank-title {
    color: var(--neon-cyan);
    font-size: 1.1rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.piece-bank {
    display: flex;
    gap: 15px;
    padding: 20px;
    background: rgba(0,0,0,0.8);
    border: 2px solid var(--neon-cyan);
    border-radius: 15px;
    justify-content: center;
    flex-wrap: wrap;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

.draggable-piece {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid var(--neon-orange);
    border-radius: 10px;
    cursor: grab;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    position: relative;
}

.draggable-piece:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px var(--neon-orange);
    border-color: var(--neon-pink);
}

.draggable-piece.dragging {
    opacity: 0.7;
    transform: scale(1.2);
    z-index: 1000;
    cursor: grabbing;
}

/* Indicadores de colocación */
.square.drop-zone {
    background: rgba(0, 255, 128, 0.2) !important;
    border: 2px dashed var(--neon-green);
    animation: dropZonePulse 1.5s ease-in-out infinite;
}

@keyframes dropZonePulse {
    0%, 100% { border-color: var(--neon-green); }
    50% { border-color: var(--neon-pink); }
}

.square.correct-placement {
    animation: correctFlash 1s ease-out;
}

.square.incorrect-placement {
    animation: wrongFlash 1s ease-out;
}

@keyframes correctFlash {
    0% { background: var(--neon-green); transform: scale(1); }
    50% { background: var(--neon-green); transform: scale(1.15); }
    100% { transform: scale(1); }
}

@keyframes wrongFlash {
    0% { background: var(--neon-pink); transform: scale(1); }
    50% { background: var(--neon-pink); transform: scale(1.15); }
    100% { transform: scale(1); }
}

/* Panel educativo */
.educational-panel {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--neon-orange);
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    max-width: 600px;
    width: 100%;
}

.panel-title {
    font-size: 1.2rem;
    color: var(--neon-orange);
    text-align: center;
    margin-bottom: 15px;
    font-weight: 900;
}

.opening-name {
    font-size: 1.4rem;
    color: var(--neon-green);
    text-align: center;
    margin-bottom: 10px;
    font-weight: 900;
}

.opening-moves {
    font-family: 'Courier New', monospace;
    color: var(--neon-cyan);
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 10px;
    background: rgba(0, 255, 255, 0.1);
    padding: 10px;
    border-radius: 5px;
}

.opening-ideas {
    color: #cccccc;
    text-align: center;
    font-size: 0.9rem;
    line-height: 1.4;
}

/* Info de mates famosos */
.mate-name {
    font-size: 1.4rem;
    color: var(--neon-pink);
    text-align: center;
    margin-bottom: 10px;
    font-weight: 900;
}

.historical-context {
    color: var(--neon-orange);
    text-align: center;
    font-style: italic;
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.mate-pattern {
    color: #cccccc;
    text-align: center;
    font-size: 0.9rem;
    background: rgba(255, 0, 128, 0.1);
    padding: 10px;
    border-radius: 5px;
}

/* Feedback de colocación */
.feedback-display {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    border: 3px solid var(--neon-green);
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    z-index: 1500;
    animation: feedbackAppear 0.5s ease-out;
}

.feedback-display.wrong {
    border-color: var(--neon-pink);
}

@keyframes feedbackAppear {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.feedback-icon {
    font-size: 3rem;
    margin-bottom: 10px;
}

.feedback-text {
    font-size: 1.2rem;
    color: var(--neon-green);
    font-weight: 700;
    margin-bottom: 10px;
}

.feedback-display.wrong .feedback-text {
    color: var(--neon-pink);
}

.feedback-explanation {
    font-size: 0.9rem;
    color: #cccccc;
    line-height: 1.4;
}

/* Pantalla de completar nivel */
.level-complete {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.level-complete-content {
    background: rgba(0, 0, 0, 0.9);
    border: 3px solid var(--neon-green);
    border-radius: 20px;
    padding: 30px;
    text-align: center;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 0 50px rgba(0, 255, 128, 0.5);
}

.complete-title {
    font-size: 2.5rem;
    color: var(--neon-green);
    font-weight: 900;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(0, 255, 128, 0.8);
}

.complete-stats {
    margin: 20px 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.complete-stats > div {
    background: rgba(0, 255, 255, 0.1);
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--neon-cyan);
}

.lesson-learned {
    background: rgba(255, 128, 0, 0.1);
    border: 2px solid var(--neon-orange);
    border-radius: 10px;
    padding: 15px;
    margin: 20px 0;
}

.lesson-title {
    color: var(--neon-orange);
    font-weight: 900;
    margin-bottom: 8px;
}

.lesson-content {
    color: #cccccc;
    font-size: 0.9rem;
    line-height: 1.4;
}

/* Estados UI por edad */
.ui-baby .chess-board {
    grid-template-columns: repeat(8, 70px);
    grid-template-rows: repeat(8, 70px);
    border-width: 4px;
}

.ui-baby .draggable-piece {
    width: 70px;
    height: 70px;
    font-size: 2.5rem;
}

.ui-baby .square {
    font-size: 16px;
}

.ui-intermediate .chess-board {
    grid-template-columns: repeat(8, 55px);
    grid-template-rows: repeat(8, 55px);
}

.ui-master .chess-board {
    grid-template-columns: repeat(8, 45px);
    grid-template-rows: repeat(8, 45px);
    border: 1px solid rgba(0, 255, 255, 0.3);
}

.ui-master .educational-panel {
    opacity: 0.8;
    font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
    .chess-board {
        grid-template-columns: repeat(8, 45px);
        grid-template-rows: repeat(8, 45px);
    }
    
    .draggable-piece {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
    }
    
    .piece-bank {
        gap: 10px;
        padding: 15px;
    }
    
    .educational-panel {
        padding: 15px;
        margin: 15px 0;
    }
    
    .complete-stats {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .chess-board {
        grid-template-columns: repeat(8, 35px);
        grid-template-rows: repeat(8, 35px);
    }
    
    .draggable-piece {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
    
    .game-title {
        font-size: 2rem;
    }
    
    .complete-title {
        font-size: 2rem;
    }
}
```

---

## 🔌 **INTEGRACIÓN LICHESS API (lichess-api.js)**

```javascript
class LichessAPI {
    constructor() {
        this.baseUrl = 'https://lichess.org/api';
        this.rateLimitDelay = 1000; // 1 segundo entre requests
        this.lastRequest = 0;
    }
    
    async makeRequest(endpoint) {
        // Respetar rate limits
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        if (timeSinceLastRequest < this.rateLimitDelay) {
            await new Promise(resolve => 
                setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
            );
        }
        
        this.lastRequest = Date.now();
        
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Lichess API Error:', error);
            throw error;
        }
    }
    
    async getOpeningPosition(openingName) {
        try {
            const endpoint = `/opening?variant=standard&name=${encodeURIComponent(openingName)}`;
            const data = await this.makeRequest(endpoint);
            
            return {
                fen: data.fen,
                moves: data.moves,
                name: data.name,
                popularity: data.frequency
            };
        } catch (error) {
            console.log('Fallback a base de datos local para apertura');
            return null;
        }
    }
    
    async getMatePosition(mateTheme) {
        try {
            const endpoint = `/puzzle?themes=${mateTheme}&rating=1000-1800&max=10`;
            const puzzles = await this.makeRequest(endpoint);
            
            if (puzzles && puzzles.length > 0) {
                const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
                return {
                    fen: randomPuzzle.fen,
                    solution: randomPuzzle.solution,
                    themes: randomPuzzle.themes,
                    rating: randomPuzzle.rating
                };
            }
            return null;
        } catch (error) {
            console.log('Fallback a base de datos local para mate');
            return null;
        }
    }
    
    async getDailyPuzzle() {
        try {
            const data = await this.makeRequest('/puzzle/daily');
            return {
                fen: data.game.fen,
                solution: data.puzzle.solution,
                themes: data.puzzle.themes,
                rating: data.puzzle.rating
            };
        } catch (error) {
            console.log('No se pudo obtener puzzle diario');
            return null;
        }
    }
    
    async getMasterGames(player1, player2) {
        try {
            const endpoint = `/games/search?players=${player1},${player2}&max=5`;
            const games = await this.makeRequest(endpoint);
            
            return games.map(game => ({
                pgn: game.pgn,
                players: `${game.players.white.name} vs ${game.players.black.name}`,
                result: game.status,
                url: `https://lichess.org/${game.id}`
            }));
        } catch (error) {
            console.log('No se pudieron obtener partidas de maestros');
            return [];
        }
    }
}
```

---

## 🎮 **SCRIPT PRINCIPAL (memory-matrix.js)**

```javascript
// memory-matrix.js - Controlador principal del juego

class MemoryMatrixGame {
    constructor() {
        this.engine = new MemoryMatrixEngine();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.engine.loadPreferences();
        this.updateUI();
        
        // Analytics de inicialización
        gtag('event', 'game_init', {
            'game': 'memory_matrix',
            'version': '1.0',
            'load_time': performance.now()
        });
    }
    
    setupEventListeners() {
        // Botones principales
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('skipPhaseBtn').addEventListener('click', () => this.skipPhase());
        
        // Botones de nivel completado
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('repeatLevelBtn').addEventListener('click', () => this.repeatLevel());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.goHome());
        
        // Botones flotantes (ChessArcade standard)
        document.getElementById('homeBtn').addEventListener('click', () => this.goHome());
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // Window focus/blur para pausar automáticamente
        window.addEventListener('blur', () => {
            if (this.engine.gameState.gameActive) {
                this.autoPause();
            }
        });
    }
    
    async startGame() {
        const level = this.engine.gameState.level;
        
        try {
            await this.engine.startLevel(level);
            this.updateControlButtons('playing');
            
            // Analytics
            gtag('event', 'game_start', {
                'game': 'memory_matrix',
                'level': level,
                'method': 'button'
            });
        } catch (error) {
            console.error('Error al iniciar nivel:', error);
            this.showError('No se pudo cargar el nivel. Inténtalo de nuevo.');
        }
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
        const level = this.engine.gameState.level;
        const hintsUsed = this.engine.gameState.hintsUsed || 0;
        
        if (hintsUsed < 3) { // Máximo 3 hints por nivel
            this.engine.showHint(hintsUsed + 1);
            this.engine.gameState.hintsUsed = hintsUsed + 1;
            
            // Analytics
            gtag('event', 'hint_used', {
                'game': 'memory_matrix',
                'level': level,
                'hint_number': hintsUsed + 1,
                'phase': this.engine.gameState.currentPhase
            });
        } else {
            this.showMessage('Ya has usado todos los hints disponibles');
        }
    }
    
    skipPhase() {
        if (this.engine.gameState.currentPhase !== 'C') {
            const nextPhase = this.engine.getNextPhase();
            if (nextPhase) {
                this.engine.startPhase(nextPhase);
                
                // Analytics
                gtag('event', 'phase_skipped', {
                    'game': 'memory_matrix',
                    'level': this.engine.gameState.level,
                    'skipped_phase': this.engine.gameState.currentPhase
                });
            }
        }
    }
    
    toggleSound() {
        this.engine.toggleSound();
        const btn = document.getElementById('soundToggle');
        btn.textContent = this.engine.gameState.soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !this.engine.gameState.soundEnabled);
    }
    
    updateUI() {
        const state = this.engine.gameState;
        const levelConfig = MEMORY_LEVELS[state.level];
        
        // Información del nivel
        document.getElementById('levelNumber').textContent = state.level;
        document.getElementById('levelName').textContent = levelConfig.name;
        document.getElementById('currentLevel').textContent = state.level;
        
        // Stats del juego
        document.getElementById('score').textContent = state.score;
        document.getElementById('accuracy').textContent = state.accuracy + '%';
        
        // Información específica del nivel
        this.updateEducationalPanel(levelConfig);
        
        // Adaptar UI según edad
        this.adaptUIForAge(state.level);
    }
    
    updateEducationalPanel(levelConfig) {
        const panel = document.getElementById('educationalPanel');
        const openingInfo = document.getElementById('openingInfo');
        const mateInfo = document.getElementById('mateInfo');
        
        if (levelConfig.type === 'opening_structure') {
            // Mostrar información de apertura
            openingInfo.style.display = 'block';
            mateInfo.style.display = 'none';
            
            document.getElementById('openingName').textContent = levelConfig.opening_info.name || levelConfig.name;
            document.getElementById('openingMoves').textContent = levelConfig.opening_info.moves.join(' ');
            document.getElementById('openingIdeas').textContent = levelConfig.opening_info.ideas.join(' • ');
            
        } else if (levelConfig.type === 'famous_mate') {
            // Mostrar información de mate
            openingInfo.style.display = 'none';
            mateInfo.style.display = 'block';
            
            document.getElementById('mateName').textContent = levelConfig.name;
            document.getElementById('historicalContext').textContent = 
                `${levelConfig.historical.players} - ${levelConfig.historical.year}`;
            document.getElementById('matePattern').textContent = levelConfig.lesson;
        } else {
            // Otros tipos de nivel
            openingInfo.style.display = 'none';
            mateInfo.style.display = 'none';
        }
    }
    
    adaptUIForAge(level) {
        const container = document.querySelector('.game-container');
        
        // Remover clases previas
        container.classList.remove('ui-baby', 'ui-intermediate', 'ui-master');
        
        if (level <= 10) {
            container.classList.add('ui-baby');
        } else if (level <= 20) {
            container.classList.add('ui-intermediate');
        } else {
            container.classList.add('ui-master');
        }
    }
    
    nextLevel() {
        if (this.engine.gameState.level < 30) {
            this.engine.gameState.level++;
            this.engine.resetGameState();
            this.hideLevelCompleteScreen();
            this.updateUI();
            this.updateControlButtons('idle');
            
            // Analytics
            gtag('event', 'level_advance', {
                'game': 'memory_matrix',
                'new_level': this.engine.gameState.level
            });
        } else {
            this.showGameComplete();
        }
    }
    
    repeatLevel() {
        this.engine.resetGameState();
        this.hideLevelCompleteScreen();
        this.updateUI();
        this.updateControlButtons('idle');
    }
    
    goHome() {
        // Analytics antes de salir
        gtag('event', 'game_exit', {
            'game': 'memory_matrix',
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
        const skipPhaseBtn = document.getElementById('skipPhaseBtn');
        
        switch(gamePhase) {
            case 'idle':
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                hintBtn.disabled = true;
                skipPhaseBtn.disabled = true;
                break;
            case 'playing':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                hintBtn.disabled = false;
                skipPhaseBtn.disabled = false;
                break;
        }
    }
    
    showLevelCompleteScreen() {
        document.getElementById('levelCompleteScreen').style.display = 'flex';
    }
    
    hideLevelCompleteScreen() {
        document.getElementById('levelCompleteScreen').style.display = 'none';
    }
    
    showMessage(message) {
        // Mostrar mensaje temporal al usuario
        const messageDiv = document.createElement('div');
        messageDiv.className = 'temp-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: var(--neon-cyan);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid var(--neon-cyan);
            z-index: 1000;
            font-family: 'Orbitron', monospace;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
    
    showError(error) {
        this.showMessage(`❌ Error: ${error}`);
    }
    
    autoPause() {
        if (this.engine.gameState.gameActive) {
            this.pauseGame();
            this.showMessage('⏸️ Juego pausado automáticamente');
        }
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
                if (this.engine.gameState.gameStarted) {
                    this.pauseGame();
                }
                break;
            case 'h':
            case 'H':
                this.showHint();
                break;
            case 's':
            case 'S':
                this.skipPhase();
                break;
            case 'Escape':
                this.goHome();
                break;
        }
    }
    
    showGameComplete() {
        // Mostrar pantalla de juego completado (30 niveles)
        const completeDiv = document.createElement('div');
        completeDiv.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.95); display: flex; align-items: center; 
                        justify-content: center; z-index: 3000;">
                <div style="text-align: center; color: var(--neon-green); 
                           font-family: 'Orbitron', monospace;">
                    <h1 style="font-size: 3rem; margin-bottom: 20px;">🧠 ¡MAESTRÍA ABSOLUTA!</h1>
                    <p style="font-size: 1.5rem; margin-bottom: 20px;">
                        Has completado los 30 niveles de Memory Matrix
                    </p>
                    <p style="font-size: 1.2rem; margin-bottom: 30px;">
                        Puntuación Final: ${this.engine.gameState.score}
                    </p>
                    <button onclick="window.location.href='../../index.html'" 
                            style="padding: 15px 30px; font-size: 1.2rem; 
                                   background: var(--neon-green); color: black; 
                                   border: none; border-radius: 25px; cursor: pointer;
                                   font-family: 'Orbitron', monospace; font-weight: 700;">
                        VOLVER AL MENÚ
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(completeDiv);
        
        // Analytics de juego completado
        gtag('event', 'game_complete', {
            'game': 'memory_matrix',
            'final_score': this.engine.gameState.score,
            'total_time': Date.now() - this.engine.gameState.sessionStartTime
        });
    }
}

// Inicializar juego cuando la página carga
window.addEventListener('load', () => {
    const game = new MemoryMatrixGame();
    
    // Hacer disponible globalmente para debugging
    window.memoryMatrixGame = game;
    
    // Tracking de carga completa
    gtag('event', 'page_loaded', {
        'game': 'memory_matrix',
        'load_time': performance.now()
    });
});

// Manejo de errores globales
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
    gtag('event', 'javascript_error', {
        'game': 'memory_matrix',
        'error_message': e.error.message,
        'error_stack': e.error.stack
    });
});
```

---

## 🚀 **PLAN DE IMPLEMENTACIÓN PASO A PASO**

### 📅 **Sprint 1: Fundamentos (Semana 1)**

#### **Día 1-2: Setup Inicial**
- [ ] Crear estructura de archivos en `games/memory-matrix/`
- [ ] Setup HTML base con elementos obligatorios (botones flotantes, AdSense)
- [ ] Implementar CSS base coherente con ChessArcade
- [ ] Configurar Google Analytics tracking

#### **Día 3-4: Motor Base**
- [ ] Implementar `MemoryMatrixEngine` clase base
- [ ] Sistema de estados de juego
- [ ] Funciones básicas de FEN parsing
- [ ] Sistema de niveles configurables

#### **Día 5-7: Niveles Básicos**
- [ ] Implementar niveles 1-5 (Baby Memory)
- [ ] Sistema básico de drag & drop
- [ ] Feedback visual básico (correcto/incorrecto)
- [ ] Audio integration con Howler.js

### 📅 **Sprint 2: Sistema Pedagógico (Semana 2)**

#### **Día 8-10: Fases por Capas**
- [ ] Implementar fase A (solo peones)
- [ ] Implementar fase B (piezas fantasma)
- [ ] Implementar fase C (posición completa)
- [ ] Transiciones suaves entre fases

#### **Día 11-12: Aperturas**
- [ ] Base de datos de aperturas (niveles 11-15)
- [ ] Extractor de peones desde FEN
- [ ] Highlighting de estructuras
- [ ] Paneles educativos

#### **Día 13-14: Testing y Polish**
- [ ] Testing cross-browser básico
- [ ] Optimización mobile
- [ ] Ajuste de dificultad
- [ ] Feedback de usuarios

### 📅 **Sprint 3: Contenido Avanzado (Semana 3)**

#### **Día 15-17: Mates Famosos**
- [ ] Base de datos de mates famosos (niveles 16-20)
- [ ] Paneles históricos con contexto
- [ ] Secuencias de mate animadas
- [ ] Sistema de lecciones aprendidas

#### **Día 18-19: Integración Lichess**
- [ ] Implementar `LichessAPI` clase
- [ ] Fallback a base de datos local
- [ ] Rate limiting y error handling
- [ ] Testing de conectividad

#### **Día 20-21: Niveles Maestros**
- [ ] Implementar niveles 21-30
- [ ] Posiciones ultra-complejas
- [ ] Partidas inmortales
- [ ] Desafío final (nivel 30)

### 📅 **Sprint 4: Launch (Semana 4)**

#### **Día 22-24: Testing Completo**
- [ ] Testing en todos los dispositivos
- [ ] Performance optimization
- [ ] Memory leak testing
- [ ] Analytics verification

#### **Día 25-26: Polish Final**
- [ ] Ajustes de UI/UX
- [ ] Optimización de carga
- [ ] SEO meta tags
- [ ] Error handling robusto

#### **Día 27-28: Deploy y Monitoring**
- [ ] Deploy a producción
- [ ] Monitoring de errores
- [ ] Analytics dashboard
- [ ] Feedback collection

---

## ✅ **CRITERIOS DE ACEPTACIÓN FINAL**

### 🎮 **Funcionalidad Completa**
- [ ] 30 niveles completamente jugables y balanceados
- [ ] Sistema pedagógico por capas funcionando perfectamente
- [ ] Drag & drop fluido en móvil, tablet y desktop
- [ ] Integración Lichess API operativa con fallback local
- [ ] Base de datos local completa (100+ posiciones)
- [ ] Transiciones suaves entre fases y niveles

### 🎨 **UI/UX Perfecta**
- [ ] Coherencia visual 100% con ChessArcade (colores, fuentes, efectos)
- [ ] Piezas fantasma con efectos semi-transparentes
- [ ] Highlighting efectivo de estructuras de peones
- [ ] Paneles educativos informativos y atractivos
- [ ] Responsive design perfecto (320px - 2560px)
- [ ] Adaptación UI por grupos de edad

### 🔧 **Calidad Técnica**
- [ ] Performance Lighthouse >85 en todas las métricas
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- [ ] Gestión eficiente de memoria (sin leaks)
- [ ] Manejo robusto de errores y conectividad
- [ ] Carga rápida (<3 segundos en 3G)

### 📊 **Business Requirements**
- [ ] Google AdSense integration funcional
- [ ] Google Analytics tracking completo
- [ ] SEO optimization (meta tags, structured data)
- [ ] Coherencia con branding ChessArcade
- [ ] Preparado para monetización

### 🎯 **User Experience**
- [ ] Curva de aprendizaje suave (4 años → GMs)
- [ ] Feedback educativo valioso en cada nivel
- [ ] Sistema de hints progresivo útil
- [ ] Controles intuitivos y responsive
- [ ] Audio cohesivo y no intrusivo
- [ ] Mensajes de error claros y actionables

---

## 🎯 **TESTING CHECKLIST DETALLADO**

### ✅ **Testing Funcional**
- [ ] **Niveles 1-10**: Completar todos sin errores
- [ ] **Niveles 11-20**: Probar todas las fases (A/B/C)
- [ ] **Niveles 21-30**: Verificar dificultad progresiva
- [ ] **Drag & Drop**: Funciona en touch y mouse
- [ ] **Sistema de Hints**: 3 hints por nivel máximo
- [ ] **Persistence**: Progreso guardado correctamente
- [ ] **Audio Toggle**: Funciona en todos los browsers

### ✅ **Testing de Contenido**
- [ ] **Aperturas**: Todas las posiciones son correctas
- [ ] **Mates Famosos**: Información histórica precisa
- [ ] **FEN Parsing**: No errores en posiciones complejas
- [ ] **Piezas Fantasma**: Efectos visuales coherentes
- [ ] **Educación**: Paneles informativos útiles

### ✅ **Testing Técnico**
- [ ] **API Lichess**: Manejo de timeouts y errores
- [ ] **Fallback Local**: Funciona cuando API falla
- [ ] **Memory Usage**: <100MB en sesiones largas
- [ ] **Performance**: 60fps en animaciones
- [ ] **Network**: Funciona con conexión lenta

### ✅ **Testing UX**
- [ ] **Niños 4-6**: UI giant mode usable
- [ ] **Intermedios**: Transiciones claras
- [ ] **Maestros**: UI minimalista efectiva
- [ ] **Mobile**: Touch targets >44px
- [ ] **Accessibility**: Contraste WCAG AA

---

## 📋 **ENTREGABLES FINALES**

### 📁 **Archivos de Código**
1. **index.html** - Estructura HTML completa
2. **memory-matrix.css** - Estilos específicos
3. **memory-matrix.js** - Controlador principal
4. **memory-engine.js** - Motor del juego
5. **drag-drop.js** - Sistema drag & drop
6. **opening-database.js** - Base de aperturas
7. **mates-database.js** - Base de mates famosos
8. **lichess-api.js** - Integración API

### 📊 **Documentación**
1. **README.md** - Instrucciones de setup
2. **API-Documentation.md** - Documentación técnica
3. **Level-Design-Guide.md** - Guía de niveles
4. **Testing-Results.md** - Resultados de testing

### 🎯 **Assets**
1. **Sonidos** - correct.wav, wrong.wav, level-up.wav
2. **Íconos** - Elementos UI específicos si necesarios
3. **Datos** - JSONs de posiciones y configuración

---

## 🚀 **INSTRUCCIONES DE DEPLOYMENT**

### 📦 **Preparación**
1. Verificar que todos los archivos estén en `games/memory-matrix/`
2. Confirmar que enlaces relativos funcionan (`../../assets/`)
3. Testear que botón HOME redirige a `../../index.html`
4. Validar que AdSense y Analytics están configurados

### 🌐 **Subida a Hostinger**
1. Subir carpeta completa `memory-matrix/` al directorio `games/`
2. Verificar permisos de archivos
3. Testear acceso directo vía URL
4. Confirmar que se carga desde página principal

### 📊 **Monitoring Post-Launch**
1. Verificar eventos de Analytics llegan correctamente
2. Monitorear errores JavaScript en consola
3. Revisar performance en dispositivos reales
4. Recopilar feedback de usuarios iniciales

---

## 🎯 **CONCLUSIÓN**

Este documento contiene **TODA la información necesaria** para implementar Memory Matrix como el tercer juego de ChessArcade. La especificación incluye:

✅ **Diseño completo** - 30 niveles con progresión pedagógica  
✅ **Arquitectura técnica** - Clases, funciones y estructura  
✅ **Coherencia visual** - 100% compatible con ChessArcade  
✅ **Contenido educativo** - Aperturas y mates famosos  
✅ **Integración APIs** - Lichess + fallback local  
✅ **Plan de desarrollo** - 4 sprints detallados  
✅ **Testing strategy** - Checklist completo  
✅ **Requirements** - Analytics, AdSense, responsive  

**El desarrollador que tome este documento tendrá todo lo necesario para crear Memory Matrix exitosamente, manteniendo la coherencia con ChessArcade y cumpliendo todos los objetivos educativos y técnicos.**

**¡Memory Matrix será el juego de memoria ajedrecística más completo jamás creado! 🧠⚡🏆**