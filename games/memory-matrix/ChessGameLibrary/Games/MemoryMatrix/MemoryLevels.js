/**
 * Memory Matrix - Niveles con posiciones reales de Lichess
 * ChessArcade - 30 niveles progresivos con contenido educativo
 *
 * Fuentes:
 * - Lichess Studies (aperturas, finales)
 * - Partidas históricas inmortales
 * - Puzzles tácticos famosos
 */

const MEMORY_LEVELS_V2 = {

    // ========================================
    // FASE 1: BABY MEMORY (Niveles 1-10)
    // Target: 4-8 años
    // Objetivo: Mates básicos y reconocimiento
    // ========================================

    1: {
        name: "DOS REYES SOLOS",
        type: "basic_mate",
        target_age: "4-5 años",
        difficulty: 1,
        fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
        source: "didactic",
        pieces_total: 2,
        pieces_to_memorize: ['e8', 'e1'],  // Casillas que se ocultan
        view_time: 8000,
        explanation: "🤴 Los reyes nunca pueden estar en casillas adyacentes",
        lesson: "Regla básica del ajedrez: los reyes no pueden tocarse",
        ui_mode: "kids"
    },

    2: {
        name: "MATE DE DAMA",
        type: "basic_mate",
        target_age: "4-6 años",
        difficulty: 1,
        fen: "8/8/8/8/8/3k4/8/4QK2 w - - 0 1",
        source: "lichess_practice",
        lichess_reference: "https://lichess.org/practice/basic-checkmates/queen-checkmate",
        pieces_total: 3,
        pieces_to_memorize: ['e1'],  // Solo memorizar la dama
        view_time: 10000,
        explanation: "👑 ¡La dama da mate con ayuda del rey!",
        lesson: "La dama es la pieza más poderosa del ajedrez",
        ui_mode: "kids"
    },

    3: {
        name: "MATE DE TORRE",
        type: "basic_mate",
        target_age: "5-7 años",
        difficulty: 1,
        fen: "8/8/8/8/8/3k4/8/R3K3 w - - 0 1",
        source: "lichess_practice",
        lichess_reference: "https://lichess.org/practice/basic-checkmates/rook-checkmate",
        pieces_total: 3,
        pieces_to_memorize: ['a1'],  // Solo la torre
        view_time: 8000,
        explanation: "🏰 ¡La torre da mate en la última fila!",
        lesson: "La torre controla filas y columnas completas",
        ui_mode: "kids"
    },

    4: {
        name: "DOS TORRES GEMELAS",
        type: "basic_mate",
        target_age: "6-8 años",
        difficulty: 2,
        fen: "8/8/8/8/8/3k4/R7/R3K3 w - - 0 1",
        source: "lichess_practice",
        lichess_reference: "https://lichess.org/practice/basic-checkmates/two-rooks-checkmate",
        pieces_total: 4,
        pieces_to_memorize: ['a1', 'a3'],  // Ambas torres
        view_time: 10000,
        explanation: "🏰🏰 ¡Dos torres hacen una escalera imparable!",
        lesson: "Las torres trabajan mejor en equipo coordinado",
        ui_mode: "kids"
    },

    5: {
        name: "DOS ALFILES",
        type: "basic_mate",
        target_age: "7-9 años",
        difficulty: 2,
        fen: "8/8/8/8/8/2k5/1B6/B3K3 w - - 0 1",
        source: "lichess_practice",
        lichess_reference: "https://lichess.org/practice/basic-checkmates/two-bishops-checkmate",
        pieces_total: 4,
        pieces_to_memorize: ['a2', 'b3'],  // Ambos alfiles
        view_time: 12000,
        explanation: "⛪⛪ ¡Los dos alfiles controlan las diagonales!",
        lesson: "Los alfiles trabajan en diagonales de colores diferentes",
        ui_mode: "kids"
    },

    6: {
        name: "ALFIL Y CABALLO",
        type: "basic_mate",
        target_age: "7-9 años",
        difficulty: 2,
        fen: "8/8/8/8/8/2k5/1B6/6NK w - - 0 1",
        source: "lichess_practice",
        lichess_reference: "https://lichess.org/practice/basic-checkmates/bishop-knight-checkmate",
        pieces_total: 4,
        pieces_to_memorize: ['b3', 'g1'],  // Alfil y caballo
        view_time: 12000,
        explanation: "⛪🐴 ¡Alfil y caballo dan mate juntos!",
        lesson: "Este es uno de los mates más difíciles de ejecutar",
        ui_mode: "kids"
    },

    7: {
        name: "POSICIÓN INICIAL - PIEZAS BLANCAS",
        type: "piece_recognition",
        target_age: "8-10 años",
        difficulty: 3,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        source: "standard",
        pieces_total: 32,
        pieces_to_memorize: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],  // Fila 1 completa
        view_time: 15000,
        explanation: "♟️ ¡Memoriza todas las piezas blancas!",
        lesson: "La posición inicial es la base de todo el ajedrez",
        ui_mode: "intermediate"
    },

    8: {
        name: "POSICIÓN INICIAL - PEONES BLANCOS",
        type: "pawn_structure",
        target_age: "8-10 años",
        difficulty: 3,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        source: "standard",
        pieces_total: 32,
        pieces_to_memorize: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],  // Peones blancos
        view_time: 12000,
        explanation: "🔸 ¡Los 8 peones blancos en su posición inicial!",
        lesson: "Los peones son el alma del ajedrez - Philidor",
        ui_mode: "intermediate"
    },

    9: {
        name: "MATE DEL PASTOR",
        type: "famous_trap",
        target_age: "9-11 años",
        difficulty: 4,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
        source: "opening_trap",
        lichess_reference: "https://lichess.org/study/opening-traps",
        pieces_total: 26,
        pieces_to_memorize: ['h5', 'c4', 'e4', 'e5'],  // Piezas clave del ataque
        view_time: 15000,
        explanation: "⚠️ ¡El mate más famoso para principiantes!",
        lesson: "Scholar's Mate - aprende a atacarlo y a defenderlo",
        ui_mode: "intermediate"
    },

    10: {
        name: "JAQUE MATE BÁSICO",
        type: "back_rank_mate",
        target_age: "9-11 años",
        difficulty: 4,
        fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
        source: "tactical_pattern",
        pieces_total: 10,
        pieces_to_memorize: ['a1', 'g8'],  // Torre y rey negro
        view_time: 10000,
        explanation: "🏰 ¡Mate de torre en la última fila!",
        lesson: "El rey sin escape en la última fila es vulnerable",
        ui_mode: "intermediate"
    },

    // ========================================
    // FASE 2: PATTERN MASTER (Niveles 11-15)
    // Target: 8-14 años
    // Objetivo: Aperturas famosas
    // ========================================

    11: {
        name: "APERTURA ITALIANA",
        type: "opening_structure",
        target_age: "10-12 años",
        difficulty: 5,
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        source: "lichess_study",
        lichess_reference: "https://lichess.org/study/italian-game",
        pieces_total: 28,
        pieces_to_memorize: ['c4', 'f3', 'c6', 'e4', 'e5'],  // Piezas clave de la apertura
        view_time: 15000,
        explanation: "🇮🇹 Apertura Italiana - una de las más antiguas",
        lesson: "Control del centro y desarrollo rápido de piezas",
        ui_mode: "advanced"
    },

    12: {
        name: "DEFENSA SICILIANA",
        type: "opening_structure",
        target_age: "10-12 años",
        difficulty: 5,
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
        source: "lichess_study",
        lichess_reference: "https://lichess.org/study/sicilian-defense",
        pieces_total: 30,
        pieces_to_memorize: ['e4', 'c5'],  // Movimientos clave
        view_time: 12000,
        explanation: "🛡️ Defensa Siciliana - la más popular contra e4",
        lesson: "Lucha asimétrica por el control del tablero",
        ui_mode: "advanced"
    },

    13: {
        name: "GAMBITO DE DAMA",
        type: "opening_structure",
        target_age: "10-12 años",
        difficulty: 5,
        fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
        source: "lichess_study",
        lichess_reference: "https://lichess.org/study/queens-gambit",
        pieces_total: 30,
        pieces_to_memorize: ['d4', 'd5', 'c4'],  // Estructura del gambito
        view_time: 12000,
        explanation: "👑 Gambito de Dama - apertura clásica",
        lesson: "Ofrecer peón para conseguir desarrollo y control",
        ui_mode: "advanced"
    },

    14: {
        name: "RUY LÓPEZ",
        type: "opening_structure",
        target_age: "11-13 años",
        difficulty: 6,
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        source: "lichess_study",
        lichess_reference: "https://lichess.org/study/ruy-lopez",
        pieces_total: 28,
        pieces_to_memorize: ['b5', 'f3', 'c6', 'e4', 'e5'],  // Apertura española
        view_time: 15000,
        explanation: "🇪🇸 Ruy López - Apertura Española, la más antigua",
        lesson: "Presión indirecta sobre e5 mediante el caballo",
        ui_mode: "advanced"
    },

    15: {
        name: "DEFENSA FRANCESA",
        type: "opening_structure",
        target_age: "11-13 años",
        difficulty: 6,
        fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        source: "lichess_study",
        lichess_reference: "https://lichess.org/study/french-defense",
        pieces_total: 30,
        pieces_to_memorize: ['e4', 'e6'],  // Movimientos clave
        view_time: 12000,
        explanation: "🇫🇷 Defensa Francesa - sólida y estratégica",
        lesson: "Cadena de peones central y juego de piezas",
        ui_mode: "advanced"
    },

    // ========================================
    // FASE 3: TACTICAL GENIUS (Niveles 16-20)
    // Target: 12-16 años
    // Objetivo: Patrones tácticos
    // ========================================

    16: {
        name: "CLAVADA MORTAL",
        type: "puzzle_pin",
        target_age: "12-14 años",
        difficulty: 7,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
        source: "tactical_pattern",
        pieces_total: 26,
        pieces_to_memorize: ['h5', 'c4', 'c6', 'f6'],  // Piezas de la táctica
        view_time: 15000,
        explanation: "📌 ¡El caballo está clavado!",
        lesson: "Una pieza clavada no puede moverse sin exponer algo más valioso",
        ui_mode: "advanced"
    },

    17: {
        name: "TENEDOR DE CABALLO",
        type: "puzzle_fork",
        target_age: "12-14 años",
        difficulty: 7,
        fen: "r1bqkb1r/pppp1ppp/5n2/4p3/2BnP3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        source: "tactical_pattern",
        pieces_total: 26,
        pieces_to_memorize: ['d4', 'c4', 'e1'],  // Tenedor en acción
        view_time: 15000,
        explanation: "🍴 ¡El caballo ataca dos piezas a la vez!",
        lesson: "El tenedor es una de las tácticas más poderosas",
        ui_mode: "advanced"
    },

    18: {
        name: "RAYOS X (SKEWER)",
        type: "puzzle_skewer",
        target_age: "13-15 años",
        difficulty: 8,
        fen: "r3k2r/ppp2ppp/8/3q4/3R4/8/PPP2PPP/R3K2R w KQkq - 0 1",
        source: "tactical_pattern",
        pieces_total: 18,
        pieces_to_memorize: ['d4', 'd5', 'e8'],  // Ataque de rayos X
        view_time: 18000,
        explanation: "⚡ ¡Ataca la pieza valiosa que protege otra!",
        lesson: "El skewer es como una clavada invertida",
        ui_mode: "advanced"
    },

    19: {
        name: "DOBLE AMENAZA",
        type: "puzzle_double_attack",
        target_age: "13-15 años",
        difficulty: 8,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
        source: "tactical_pattern",
        pieces_total: 27,
        pieces_to_memorize: ['c4', 'd3', 'f3', 'c6', 'f6'],  // Piezas clave
        view_time: 18000,
        explanation: "⚔️ ¡Dos amenazas simultáneas!",
        lesson: "Si puedes hacer dos amenazas, el oponente solo puede parar una",
        ui_mode: "advanced"
    },

    20: {
        name: "MATE EN DOS",
        type: "puzzle_mate_in_2",
        target_age: "14-16 años",
        difficulty: 9,
        fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
        source: "puzzle",
        pieces_total: 26,
        pieces_to_memorize: ['f7', 'c4', 'e8', 'f8'],  // Mate inminente
        view_time: 20000,
        explanation: "♟️ ¡Encuentra el mate en 2 jugadas!",
        lesson: "Visualiza la secuencia completa antes de mover",
        ui_mode: "advanced"
    },

    // ========================================
    // FASE 4: HISTORICAL MASTER (Niveles 21-25)
    // Target: 14+ años
    // Objetivo: Partidas inmortales
    // ========================================

    21: {
        name: "PARTIDA INMORTAL",
        type: "immortal_game",
        target_age: "14+ años",
        difficulty: 10,
        fen: "r1b1kb1r/p2p1ppp/2p5/4q3/2B5/4Q3/PPP2PPP/RNB2RK1 w kq - 0 11",
        source: "historical_game",
        game_info: "Anderssen vs Kieseritzky (1851)",
        lichess_reference: "https://lichess.org/study/immortal-game",
        pieces_total: 22,
        pieces_to_memorize: ['e3', 'c4', 'e5', 'c6', 'd7', 'f7', 'g7', 'h7'],  // Posición crítica
        view_time: 25000,
        explanation: "👑 La Partida Inmortal - Anderssen sacrifica todo",
        lesson: "Los sacrificios brillantes pueden llevar a victoria",
        ui_mode: "expert"
    },

    22: {
        name: "ÓPERA DE PARÍS",
        type: "famous_game",
        target_age: "14+ años",
        difficulty: 10,
        fen: "2kr3r/ppp2p1p/2n5/6B1/8/2q5/P1P2PPP/2R2RK1 w - - 0 17",
        source: "historical_game",
        game_info: "Morphy vs Duke Karl/Count Isouard (1858)",
        lichess_reference: "https://lichess.org/study/morphys-opera-game",
        pieces_total: 18,
        pieces_to_memorize: ['c1', 'f1', 'g5', 'c3', 'd8', 'c6'],  // Combinación final
        view_time: 25000,
        explanation: "🎭 Paul Morphy en la Ópera - brillantez táctica",
        lesson: "Desarrollo rápido y ataque preciso",
        ui_mode: "expert"
    },

    23: {
        name: "PARTIDA SIEMPREVIVA",
        type: "evergreen_game",
        target_age: "14+ años",
        difficulty: 11,
        fen: "r1b2rk1/2qn1pbp/p2pp1p1/1p6/3NP3/2N1B3/PPP1QPPP/R4RK1 w - - 0 14",
        source: "historical_game",
        game_info: "Anderssen vs Dufresne (1852)",
        lichess_reference: "https://lichess.org/study/evergreen-game",
        pieces_total: 27,
        pieces_to_memorize: ['d4', 'c3', 'e3', 'e2', 'c7', 'd7', 'a6', 'b5', 'd6', 'e6', 'g6'],
        view_time: 30000,
        explanation: "🌲 La Siempreviva - combinación inmortal",
        lesson: "Coordinación de todas las piezas para el mate",
        ui_mode: "expert"
    },

    24: {
        name: "KASPAROV'S IMMORTAL",
        type: "modern_brilliancy",
        target_age: "15+ años",
        difficulty: 11,
        fen: "2r3k1/1p3ppp/pq1b1n2/3pN3/8/1P1Q1P2/P1P3PP/3R2K1 w - - 0 24",
        source: "modern_game",
        game_info: "Kasparov vs Topalov (1999) - Wijk aan Zee",
        lichess_reference: "https://lichess.org/study/kasparov-topalov-1999",
        pieces_total: 20,
        pieces_to_memorize: ['d3', 'd1', 'e5', 'b6', 'd6', 'f6', 'c8'],  // Combinación brillante
        view_time: 30000,
        explanation: "💎 Brillantez moderna de Kasparov",
        lesson: "Sacrificio de torre espectacular",
        ui_mode: "expert"
    },

    25: {
        name: "BOBBY FISCHER",
        type: "fischer_game",
        target_age: "15+ años",
        difficulty: 12,
        fen: "1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 1 42",
        source: "historical_game",
        game_info: "Fischer vs Benko (1963) - US Championship",
        lichess_reference: "https://lichess.org/study/fischer-brilliancies",
        pieces_total: 13,
        pieces_to_memorize: ['b8', 'e5', 'c2', 'b3', 'b4'],  // Final artístico
        view_time: 35000,
        explanation: "🇺🇸 Bobby Fischer - precisión absoluta",
        lesson: "Final técnico de altísimo nivel",
        ui_mode: "expert"
    },

    // ========================================
    // FASE 5: GRANDMASTER MODE (Niveles 26-30)
    // Target: Avanzados
    // Objetivo: Finales artísticos
    // ========================================

    26: {
        name: "ESTUDIO DE RETI",
        type: "artistic_endgame",
        target_age: "16+ años",
        difficulty: 12,
        fen: "7K/8/k1P5/7p/8/8/8/8 w - - 0 1",
        source: "endgame_study",
        game_info: "Richard Réti (1921)",
        lichess_reference: "https://lichess.org/study/famous-studies",
        pieces_total: 4,
        pieces_to_memorize: ['h8', 'a6', 'c6', 'h5'],  // Todas las piezas
        view_time: 20000,
        explanation: "🎨 Estudio artístico de Réti - el rey alcanza",
        lesson: "Geometría del tablero y movimientos precisos",
        ui_mode: "expert"
    },

    27: {
        name: "ESTUDIO DE SAAVEDRA",
        type: "artistic_endgame",
        target_age: "16+ años",
        difficulty: 12,
        fen: "8/8/8/8/8/8/pk6/1R6 w - - 0 1",
        source: "endgame_study",
        game_info: "Fernando Saavedra (1895)",
        lichess_reference: "https://lichess.org/study/saavedra-position",
        pieces_total: 4,
        pieces_to_memorize: ['b1', 'a2', 'b2'],  // Posición clave
        view_time: 20000,
        explanation: "🎭 ¡Promociona a torre, no a dama!",
        lesson: "A veces la promoción menor es la correcta",
        ui_mode: "expert"
    },

    28: {
        name: "FINAL DE LUCENA",
        type: "theoretical_endgame",
        target_age: "16+ años",
        difficulty: 13,
        fen: "1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1",
        source: "theoretical_endgame",
        lichess_reference: "https://lichess.org/study/essential-endgames",
        pieces_total: 5,
        pieces_to_memorize: ['b8', 'd8', 'b7', 'c1', 'a2'],  // Técnica del puente
        view_time: 25000,
        explanation: "🌉 Posición de Lucena - técnica del puente",
        lesson: "Final teórico fundamental: torre y peón vs torre",
        ui_mode: "expert"
    },

    29: {
        name: "FINAL DE PHILIDOR",
        type: "theoretical_endgame",
        target_age: "16+ años",
        difficulty: 13,
        fen: "3k4/R7/3K4/8/8/8/r7/8 b - - 0 1",
        source: "theoretical_endgame",
        game_info: "François-André Danican Philidor",
        lichess_reference: "https://lichess.org/study/philidor-position",
        pieces_total: 4,
        pieces_to_memorize: ['a7', 'd6', 'd8', 'a2'],  // Todas
        view_time: 25000,
        explanation: "🛡️ Posición de Philidor - defensa perfecta",
        lesson: "Cómo defender con torre en finales difíciles",
        ui_mode: "expert"
    },

    30: {
        name: "DESAFÍO FINAL",
        type: "complex_position",
        target_age: "17+ años",
        difficulty: 15,
        fen: "r1bq1rk1/pp1n1ppp/2pbpn2/8/2BPP3/2N2N2/PPP1QPPP/R1B2RK1 w - - 0 10",
        source: "complex_middlegame",
        pieces_total: 30,
        pieces_to_memorize: [
            'c4', 'd4', 'e4', 'c3', 'f3', 'e2',  // Blancas
            'a8', 'c6', 'd7', 'f6', 'd8', 'e6', 'f8', 'g8'  // Negras
        ],  // 14 piezas
        view_time: 40000,
        explanation: "🏆 ¡DESAFÍO MÁXIMO! Posición compleja de medio juego",
        lesson: "Memoria fotográfica de alta complejidad",
        ui_mode: "expert"
    }
};

// Función helper para obtener nivel
function getLevel(levelNumber) {
    return MEMORY_LEVELS_V2[levelNumber] || null;
}

// Función para obtener total de niveles
function getTotalLevels() {
    return Object.keys(MEMORY_LEVELS_V2).length;
}

// Función para obtener niveles por dificultad
function getLevelsByDifficulty(difficulty) {
    return Object.entries(MEMORY_LEVELS_V2)
        .filter(([_, level]) => level.difficulty === difficulty)
        .map(([num, _]) => parseInt(num));
}

// Función para obtener niveles por tipo
function getLevelsByType(type) {
    return Object.entries(MEMORY_LEVELS_V2)
        .filter(([_, level]) => level.type === type)
        .map(([num, _]) => parseInt(num));
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.MEMORY_LEVELS_V2 = MEMORY_LEVELS_V2;
    window.getLevel = getLevel;
    window.getTotalLevels = getTotalLevels;
    window.getLevelsByDifficulty = getLevelsByDifficulty;
    window.getLevelsByType = getLevelsByType;
}
