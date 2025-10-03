# 🎯 Sistema de Niveles Memory Matrix - Integración con Lichess

**Fecha**: 1 de Octubre de 2025
**Objetivo**: Diseñar 30 niveles con posiciones reales de Lichess y partidas famosas

---

## 🎮 ESTRUCTURA DE 30 NIVELES

### 📊 Distribución por Tipo de Contenido

```
Niveles 1-10  (Baby Memory)       → Mates básicos + Posición inicial
Niveles 11-15 (Pattern Master)    → Aperturas famosas (Lichess Studies)
Niveles 16-20 (Tactical Genius)   → Puzzles tácticos de Lichess
Niveles 21-25 (Historical Master) → Partidas inmortales (momentos clave)
Niveles 26-30 (Grandmaster Mode)  → Finales artísticos + Brillanteces modernas
```

---

## 🏗️ FASE 1: BABY MEMORY (Niveles 1-10)
**Target**: 4-8 años | **Objetivo**: Mates básicos y reconocimiento de piezas

### Nivel 1: DOS REYES SOLOS
- **Tipo**: `basic_mate`
- **Fuente**: Posición didáctica básica
- **FEN**: `4k3/8/8/8/8/8/8/4K3 w - - 0 1`
- **Piezas ocultas**: 2 (ambos reyes)
- **Tiempo**: 8 segundos
- **Lección**: Regla básica - los reyes no pueden tocarse

### Nivel 2: MATE DE DAMA
- **Tipo**: `basic_mate`
- **Fuente**: Lichess Practice - Queen Mate Drill
- **FEN**: `8/8/8/8/8/3k4/8/4QK2 w - - 0 1`
- **Piezas ocultas**: 1 (dama)
- **Tiempo**: 10 segundos
- **Lección**: La dama da mate con apoyo del rey

### Nivel 3: MATE DE TORRE
- **Tipo**: `basic_mate`
- **Fuente**: Lichess Practice - Rook Mate Drill
- **FEN**: `8/8/8/8/8/3k4/8/R3K3 w - - 0 1`
- **Piezas ocultas**: 1 (torre)
- **Tiempo**: 8 segundos
- **Lección**: Torre en última fila = mate

### Nivel 4: DOS TORRES
- **Tipo**: `basic_mate`
- **Fuente**: Lichess Practice - Two Rooks Checkmate
- **FEN**: `8/8/8/8/8/3k4/R7/R3K3 w - - 0 1`
- **Piezas ocultas**: 2 (ambas torres)
- **Tiempo**: 10 segundos
- **Lección**: Escalera con dos torres

### Nivel 5: DOS ALFILES
- **Tipo**: `basic_mate`
- **Fuente**: Lichess Practice - Bishop Pair Mate
- **FEN**: `8/8/8/8/8/2k5/1B6/B3K3 w - - 0 1`
- **Piezas ocultas**: 2 (ambos alfiles)
- **Tiempo**: 12 segundos
- **Lección**: Alfiles controlan diagonales

### Nivel 6: MATE DE CABALLO Y ALFIL
- **Tipo**: `basic_mate`
- **Fuente**: Lichess Practice - Knight and Bishop Mate
- **FEN**: `8/8/8/8/8/2k5/1B6/6NK w - - 0 1`
- **Piezas ocultas**: 2 (alfil y caballo)
- **Tiempo**: 12 segundos
- **Lección**: Mate difícil pero posible

### Nivel 7: POSICIÓN INICIAL - PIEZAS BLANCAS
- **Tipo**: `piece_recognition`
- **Fuente**: Estándar
- **FEN**: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
- **Piezas ocultas**: 8 (fila 1 completa)
- **Tiempo**: 15 segundos
- **Lección**: Memorizar posición inicial

### Nivel 8: POSICIÓN INICIAL - PEONES BLANCOS
- **Tipo**: `pawn_structure`
- **Fuente**: Estándar
- **FEN**: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
- **Piezas ocultas**: 8 (peones blancos a2-h2)
- **Tiempo**: 12 segundos
- **Lección**: Los 8 peones en posición inicial

### Nivel 9: POSICIÓN INICIAL COMPLETA
- **Tipo**: `full_board`
- **Fuente**: Estándar
- **FEN**: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
- **Piezas ocultas**: 16 (todas las blancas)
- **Tiempo**: 20 segundos
- **Lección**: Setup completo del ajedrez

### Nivel 10: MATE DEL PASTOR (Scholar's Mate)
- **Tipo**: `famous_pattern`
- **Fuente**: Lichess Opening Explorer
- **FEN**: `r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1`
- **Piezas ocultas**: 4 (Qh5, Bc4, e4, e5)
- **Tiempo**: 15 segundos
- **Lección**: Trampa clásica de apertura

---

## ⚡ FASE 2: PATTERN MASTER (Niveles 11-15)
**Target**: 8-14 años | **Objetivo**: Aperturas famosas

### Nivel 11: APERTURA ITALIANA
- **Tipo**: `opening_structure`
- **Fuente**: Lichess Study - "Italian Game Basics"
- **Lichess Study ID**: `https://lichess.org/study/xxxxx`
- **FEN**: `r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1`
- **Piezas ocultas**: 6 (Bc4, Nf3, Nc6, e4, e5)
- **Tiempo**: 15 segundos
- **Lección**: Apertura clásica con control del centro

### Nivel 12: DEFENSA SICILIANA
- **Tipo**: `opening_structure`
- **Fuente**: Lichess Study - "Sicilian Defense Introduction"
- **FEN**: `rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 1`
- **Piezas ocultas**: 2 (e4, c5)
- **Tiempo**: 12 segundos
- **Lección**: Defensa más popular contra e4

### Nivel 13: GAMBITO DE DAMA
- **Tipo**: `opening_structure`
- **Fuente**: Lichess Study - "Queen's Gambit Explained"
- **FEN**: `rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 1`
- **Piezas ocultas**: 3 (d4, d5, c4)
- **Tiempo**: 12 segundos
- **Lección**: Gambito clásico de peón

### Nivel 14: RUY LÓPEZ (Apertura Española)
- **Tipo**: `opening_structure`
- **Fuente**: Lichess Study - "Ruy Lopez Fundamentals"
- **FEN**: `r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1`
- **Piezas ocultas**: 5 (Bb5, Nf3, Nc6, e4, e5)
- **Tiempo**: 15 segundos
- **Lección**: Apertura más antigua y respetada

### Nivel 15: DEFENSA FRANCESA
- **Tipo**: `opening_structure`
- **Fuente**: Lichess Study - "French Defense Overview"
- **FEN**: `rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1`
- **Piezas ocultas**: 2 (e4, e6)
- **Tiempo**: 12 segundos
- **Lección**: Defensa sólida con e6

---

## 🧩 FASE 3: TACTICAL GENIUS (Niveles 16-20)
**Target**: 12-16 años | **Objetivo**: Puzzles tácticos de Lichess

### Nivel 16: CLAVADA SIMPLE
- **Tipo**: `puzzle_pin`
- **Fuente**: Lichess Puzzle Database (Rating: 1000-1200)
- **Método**: `GET https://lichess.org/api/puzzle/daily`
- **Patrón**: Pin tactic
- **Piezas ocultas**: 3-4 piezas clave
- **Tiempo**: 15 segundos
- **Lección**: Pieza clavada no puede moverse

### Nivel 17: TENEDOR (FORK)
- **Tipo**: `puzzle_fork`
- **Fuente**: Lichess Puzzle (Rating: 1200-1400)
- **Patrón**: Fork tactic
- **Piezas ocultas**: 4-5 piezas
- **Tiempo**: 15 segundos
- **Lección**: Caballo atacando dos piezas

### Nivel 18: RAYOS X (SKEWER)
- **Tipo**: `puzzle_skewer`
- **Fuente**: Lichess Puzzle (Rating: 1400-1600)
- **Patrón**: Skewer tactic
- **Piezas ocultas**: 4-5 piezas
- **Tiempo**: 18 segundos
- **Lección**: Atacar pieza valiosa que protege otra

### Nivel 19: DOBLE AMENAZA
- **Tipo**: `puzzle_double_attack`
- **Fuente**: Lichess Puzzle (Rating: 1600-1800)
- **Patrón**: Double attack
- **Piezas ocultas**: 5-6 piezas
- **Tiempo**: 18 segundos
- **Lección**: Dos amenazas simultáneas

### Nivel 20: MATE EN 2
- **Tipo**: `puzzle_mate_in_2`
- **Fuente**: Lichess Puzzle (Rating: 1800-2000)
- **Patrón**: Checkmate in 2 moves
- **Piezas ocultas**: 6-8 piezas
- **Tiempo**: 20 segundos
- **Lección**: Visualizar secuencia de mate

---

## 🏆 FASE 4: HISTORICAL MASTER (Niveles 21-25)
**Target**: 14+ años | **Objetivo**: Partidas inmortales

### Nivel 21: PARTIDA INMORTAL - Anderssen vs Kieseritzky (1851)
- **Tipo**: `immortal_game`
- **Fuente**: Lichess Study - "Immortal Game Analysis"
- **Momento**: Jugada 18 (sacrificio de torres)
- **FEN**: `r1b1kb1r/p2p1ppp/2p5/4q3/2B5/4Q3/PPP2PPP/RNB2RK1 w kq - 0 1`
- **Piezas ocultas**: 8-10 piezas
- **Tiempo**: 25 segundos
- **Lección**: Sacrificio brillante

### Nivel 22: OPERA DE PARÍS - Morphy vs Duke of Brunswick (1858)
- **Tipo**: `famous_game`
- **Fuente**: Lichess Study - "Morphy's Opera Game"
- **Momento**: Jugada 16 (combinación final)
- **FEN**: `2kr3r/ppp2p1p/2n5/6B1/8/2q5/P1P2PPP/2R2RK1 w - - 0 1`
- **Piezas ocultas**: 10 piezas
- **Tiempo**: 25 segundos
- **Lección**: Desarrollo y ataque preciso

### Nivel 23: PARTIDA SIEMPREVIVA - Anderssen vs Dufresne (1852)
- **Tipo**: `evergreen_game`
- **Fuente**: Lichess Study - "Evergreen Game"
- **Momento**: Jugada 21 (combinación de mate)
- **FEN**: `r1b2rk1/2qn1pbp/p2pp1p1/1p6/3NP3/2N1B3/PPP1QPPP/R4RK1 w - - 0 1`
- **Piezas ocultas**: 12 piezas
- **Tiempo**: 30 segundos
- **Lección**: Combinación compleja

### Nivel 24: KASPAROV vs TOPALOV (1999) - "Kasparov's Immortal"
- **Tipo**: `modern_brilliancy`
- **Fuente**: Lichess Database
- **Momento**: Jugada 24 (sacrificio de torre)
- **FEN**: Buscar en Lichess Games Database
- **Piezas ocultas**: 12-15 piezas
- **Tiempo**: 30 segundos
- **Lección**: Brillantez moderna

### Nivel 25: CARLSEN vs KARJAKIN (2016) - World Championship
- **Tipo**: `modern_championship`
- **Fuente**: Lichess Database
- **Momento**: Posición crítica
- **FEN**: Buscar en Lichess Games Database
- **Piezas ocultas**: 15 piezas
- **Tiempo**: 35 segundos
- **Lección**: Precisión de campeonato mundial

---

## 🎓 FASE 5: GRANDMASTER MODE (Niveles 26-30)
**Target**: Avanzados | **Objetivo**: Finales artísticos y posiciones complejas

### Nivel 26: ESTUDIO DE RETI (1921)
- **Tipo**: `artistic_endgame`
- **Fuente**: Lichess Study - "Famous Endgame Studies"
- **FEN**: `7K/8/k1P5/7p/8/8/8/8 w - - 0 1`
- **Piezas ocultas**: Todas (4 piezas)
- **Tiempo**: 20 segundos
- **Lección**: Final artístico - el rey alcanza

### Nivel 27: ESTUDIO DE SAAVEDRA (1895)
- **Tipo**: `artistic_endgame`
- **Fuente**: Lichess Study - "Classic Studies"
- **FEN**: `8/8/8/8/8/8/pk6/1R6 w - - 0 1`
- **Piezas ocultas**: Todas (4 piezas)
- **Tiempo**: 20 segundos
- **Lección**: Promoción a torre (¡no a dama!)

### Nivel 28: FINAL DE LUCENA
- **Tipo**: `theoretical_endgame`
- **Fuente**: Lichess Study - "Essential Endgames"
- **FEN**: `1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1`
- **Piezas ocultas**: 5 piezas
- **Tiempo**: 25 segundos
- **Lección**: Técnica de finales torre + peón

### Nivel 29: FINAL DE PHILIDOR
- **Tipo**: `theoretical_endgame`
- **Fuente**: Lichess Study - "Endgame Principles"
- **FEN**: `3k4/R7/3K4/8/8/8/r7/8 b - - 0 1`
- **Piezas ocultas**: 4 piezas
- **Tiempo**: 25 segundos
- **Lección**: Defensa en finales de torres

### Nivel 30: POSICIÓN DE PUZZLE EXTREMO
- **Tipo**: `puzzle_extreme`
- **Fuente**: Lichess Puzzle (Rating: 2400+)
- **Método**: Filtrar puzzles difíciles
- **Piezas ocultas**: 18-20 piezas
- **Tiempo**: 40 segundos
- **Lección**: ¡Desafío máximo!

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Opción A: Archivo Estático (Más simple)

Crear `memory-levels-v2.js` con FENs hardcoded pero traídos de Lichess:

```javascript
const MEMORY_LEVELS_V2 = {
    1: {
        name: "DOS REYES SOLOS",
        type: "basic_mate",
        fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
        source: "didactic",
        lichess_reference: null,
        pieces_hidden: ['e8', 'e1'],
        view_time: 8000
    },
    16: {
        name: "CLAVADA SIMPLE",
        type: "puzzle_pin",
        fen: "...", // FEN del puzzle de Lichess
        source: "lichess_puzzle",
        lichess_reference: "https://lichess.org/training/xxxxx",
        puzzle_rating: 1200,
        pieces_hidden: [...], // Detectar automáticamente piezas clave
        view_time: 15000
    }
};
```

### Opción B: API Dinámica (Más avanzado)

Crear servicio que consulta Lichess en tiempo real:

```javascript
class LichessPositionService {
    async getPuzzle(rating) {
        const response = await fetch('https://lichess.org/api/puzzle/daily');
        return response.json();
    }

    async getStudyChapter(studyId, chapterId) {
        const url = `https://lichess.org/api/study/${studyId}/${chapterId}.pgn`;
        const response = await fetch(url);
        return response.text();
    }

    async getGamePosition(gameId, moveNumber) {
        // Obtener partida y extraer FEN en jugada específica
    }
}
```

### Opción C: Híbrido (RECOMENDADO)

- **Niveles 1-10**: FENs estáticos (mates básicos)
- **Niveles 11-20**: FENs de estudios públicos de Lichess (aperturas + puzzles)
- **Niveles 21-30**: FENs de partidas famosas (inmortales + finales)

**Ventaja**: No depende de API (funciona offline), pero posiciones son reales y educativas.

---

## 📚 RECURSOS DE LICHESS

### Studies Públicos Útiles

1. **Aperturas**: `https://lichess.org/study/by/lichess`
2. **Finales**: `https://lichess.org/study/basics`
3. **Tácticas**: `https://lichess.org/study/tactical-patterns`

### APIs Disponibles

```
GET https://lichess.org/api/puzzle/daily
GET https://lichess.org/api/study/{studyId}
GET https://lichess.org/api/games/user/{username}
```

### Partidas Inmortales en Lichess

Buscar por jugadores históricos:
- `https://lichess.org/@/DrDrunkenstein` (partidas clásicas importadas)
- `https://lichess.org/study/search?q=immortal`

---

## 🎯 PRÓXIMO PASO

**¿Qué opción prefieres?**

**A) Archivo estático** - Crear `memory-levels-v2.js` con FENs reales de Lichess hardcoded
- ✅ Funciona offline
- ✅ Más rápido de implementar
- ✅ Control total sobre posiciones
- ❌ No se actualiza automáticamente

**B) API dinámica** - Consultar Lichess en tiempo real
- ✅ Puzzles siempre frescos
- ✅ Posiciones actualizadas
- ❌ Requiere conexión
- ❌ Más complejo
- ❌ Puede fallar si Lichess cambia API

**C) Híbrido** - Estático para niveles básicos, dinámico opcional para avanzados
- ✅ Balance perfecto
- ✅ Offline funcional
- ✅ Posibilidad de contenido fresco
- ⚠️ Complejidad media

**RECOMENDACIÓN**: **Opción A** para empezar (MVP), luego migrar a **C** cuando esté funcionando.

¿Continuamos con Opción A?
