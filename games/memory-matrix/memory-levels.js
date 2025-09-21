/**
 * Memory Matrix - Configuración de Niveles
 * ChessArcade - Base de datos completa de 30 niveles progresivos
 */

const MEMORY_LEVELS = {
    // ========================================
    // FASE 1: BABY MEMORY (Niveles 1-10)
    // Edad: 4-8 años
    // ========================================
    
    1: {
        name: "DOS REYES SOLOS",
        type: "basic_mate",
        target_age: "4-5 años",
        fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
        pieces_total: 2,
        pieces_hidden: ['e8', 'e1'],
        view_time: 8000,
        explanation: "🤴 Los reyes nunca pueden estar en casillas adyacentes",
        lesson: "Regla básica: los reyes no pueden tocarse",
        ui_mode: "kids",
        difficulty: 1
    },
    
    2: {
        name: "REY Y DAMA VS REY",
        type: "basic_mate",
        target_age: "4-6 años", 
        fen: "8/8/8/8/8/3k4/8/4QK2 w - - 0 1",
        pieces_total: 3,
        pieces_hidden: ['e1'],
        view_time: 10000,
        explanation: "👑 ¡La dama da mate! El rey negro no puede moverse",
        lesson: "La dama es la pieza más poderosa",
        ui_mode: "kids",
        difficulty: 1
    },
    
    3: {
        name: "TORRE FUERTE",
        type: "basic_mate",
        target_age: "5-7 años",
        fen: "8/8/8/8/8/3k4/8/R3K3 w - - 0 1", 
        pieces_total: 3,
        pieces_hidden: ['a1'],
        view_time: 8000,
        explanation: "🏰 ¡La torre da mate en la última fila!",
        lesson: "La torre controla filas y columnas completas",
        ui_mode: "kids",
        difficulty: 1
    },
    
    4: {
        name: "DOS TORRES GEMELAS",
        type: "basic_mate",
        target_age: "6-8 años",
        fen: "8/8/8/8/8/3k4/R7/R3K3 w - - 0 1",
        pieces_total: 4,
        pieces_hidden: ['a1', 'a3'],
        view_time: 10000,
        explanation: "🏰🏰 ¡Dos torres son imparables!",
        lesson: "Las torres trabajan mejor en equipo",
        ui_mode: "kids",
        difficulty: 2
    },
    
    5: {
        name: "ALFILES AMIGOS",
        type: "basic_mate", 
        target_age: "7-9 años",
        fen: "8/8/8/8/8/2k5/1B6/B3K3 w - - 0 1",
        pieces_total: 4,
        pieces_hidden: ['a1', 'b2'],
        view_time: 12000,
        explanation: "⛪⛪ ¡Los dos alfiles trabajan en equipo!",
        lesson: "Los alfiles controlan diagonales largas",
        ui_mode: "kids",
        difficulty: 2
    },
    
    6: {
        name: "CABALLO SALTARÍN",
        type: "basic_mate",
        target_age: "7-9 años",
        fen: "8/8/8/8/8/2k5/8/6NK w - - 0 1",
        pieces_total: 3,
        pieces_hidden: ['g1'],
        view_time: 8000,
        explanation: "🐴 ¡El caballo salta y da mate!",
        lesson: "El caballo se mueve en forma de L",
        ui_mode: "kids",
        difficulty: 2
    },
    
    7: {
        name: "FAMILIA COMPLETA",
        type: "piece_recognition",
        target_age: "8-10 años",
        fen: "rnbqkbnr/8/8/8/8/8/8/RNBQKBNR w - - 0 1",
        pieces_total: 16,
        pieces_hidden: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
        view_time: 15000,
        explanation: "♟️ ¡Memoriza todas las piezas blancas!",
        lesson: "Posición inicial del ajedrez",
        ui_mode: "intermediate",
        difficulty: 3
    },
    
    8: {
        name: "PEONES VALIENTES",
        type: "pawn_structure",
        target_age: "8-10 años",
        fen: "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1",
        pieces_total: 16,
        pieces_hidden: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
        view_time: 12000,
        explanation: "🔸 ¡Los peones son el alma del ajedrez!",
        lesson: "Estructura de peones básica",
        ui_mode: "intermediate",
        difficulty: 3
    },
    
    9: {
        name: "ATAQUE COORDINADO",
        type: "tactical_pattern",
        target_age: "9-11 años",
        fen: "r1bq1rk1/ppp2ppp/2n5/3p4/3P4/2N5/PPP2PPP/R1BQKB1R w KQ - 0 1",
        pieces_total: 24,
        pieces_hidden: ['c3', 'c6', 'd4', 'd5'],
        view_time: 10000,
        explanation: "⚔️ ¡Las piezas atacan en el centro!",
        lesson: "Importancia del control central",
        ui_mode: "intermediate",
        difficulty: 4
    },
    
    10: {
        name: "CASTILLO SEGURO",
        type: "castling_pattern",
        target_age: "9-11 años",
        fen: "r3k2r/ppp2ppp/8/8/8/8/PPP2PPP/R3K2R w KQkq - 0 1",
        pieces_total: 16,
        pieces_hidden: ['e1', 'h1', 'e8', 'h8'],
        view_time: 8000,
        explanation: "🏰 ¡El enroque protege al rey!",
        lesson: "Seguridad del rey mediante enroque",
        ui_mode: "intermediate",
        difficulty: 4
    },
    
    // ========================================
    // FASE 2: PATTERN MASTER (Niveles 11-20)  
    // Edad: 8-14 años - Aperturas y mates famosos
    // ========================================
    
    11: {
        name: "APERTURA ITALIANA",
        type: "opening_structure",
        target_age: "10-12 años",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        pieces_total: 30,
        pieces_hidden: ['c4', 'f3', 'c6', 'e4', 'e5'],
        view_time: 8000,
        explanation: "🇮🇹 Apertura Italiana: desarrollo rápido y control central",
        lesson: "Principios básicos de apertura",
        opening_info: {
            moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4"],
            ideas: ["Desarrollo rápido", "Ataque a f7", "Control del centro"]
        },
        ui_mode: "intermediate",
        difficulty: 5
    },
    
    12: {
        name: "ESPAÑOLA CLÁSICA",
        type: "opening_structure", 
        target_age: "10-12 años",
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        pieces_total: 30,
        pieces_hidden: ['b5', 'f3', 'c6', 'e4', 'e5'],
        view_time: 8000,
        explanation: "🇪🇸 Apertura Española: presión sobre el centro negro",
        lesson: "Control indirecto del centro",
        opening_info: {
            moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bb5"],
            ideas: ["Presión sobre c6", "Control del centro", "Desarrollo armónico"]
        },
        ui_mode: "intermediate",
        difficulty: 5
    },
    
    13: {
        name: "DEFENSA FRANCESA",
        type: "opening_structure",
        target_age: "11-13 años", 
        fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        pieces_total: 30,
        pieces_hidden: ['e4', 'd4', 'd5', 'e6'],
        view_time: 7000,
        explanation: "🇫🇷 Defensa Francesa: estructura de peones característica",
        lesson: "Cadenas de peones y tensión central",
        opening_info: {
            moves: ["1.e4 e6", "2.d4 d5"],
            ideas: ["Lucha por el centro", "Estructura sólida", "Juego posicional"]
        },
        ui_mode: "intermediate",
        difficulty: 6
    },
    
    14: {
        name: "GAMBITO DE DAMA",
        type: "opening_structure",
        target_age: "11-13 años",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        pieces_total: 30,
        pieces_hidden: ['c4', 'd4', 'd5'],
        view_time: 7000,
        explanation: "♕ Gambito de Dama: ofrecimiento de peón por desarrollo",
        lesson: "Sacrificios posicionales estratégicos",
        opening_info: {
            moves: ["1.d4 d5", "2.c4"],
            ideas: ["Presión central", "Desarrollo rápido", "Control de casillas"]
        },
        ui_mode: "intermediate", 
        difficulty: 6
    },
    
    15: {
        name: "DEFENSA SICILIANA",
        type: "opening_structure",
        target_age: "12-14 años",
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        pieces_total: 30,
        pieces_hidden: ['e4', 'c5'],
        view_time: 6000,
        explanation: "🛡️ Defensa Siciliana: asimetría y contraataque",
        lesson: "Juego asimétrico y dinámico",
        opening_info: {
            moves: ["1.e4 c5"],
            ideas: ["Lucha asimétrica", "Contraataque", "Iniciativa"]
        },
        ui_mode: "advanced",
        difficulty: 7
    },
    
    16: {
        name: "MATE DE LEGAL",
        type: "famous_mate",
        target_age: "12-14 años",
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
        pieces_total: 28,
        pieces_hidden: ['f3', 'c4', 'c5'],
        view_time: 6000,
        explanation: "⚖️ Mate de Legal: sacrificio brillante de dama",
        lesson: "A veces hay que sacrificar lo más valioso",
        historical: {
            player: "Sire de Legal",
            year: "1750",
            sequence: ["Nxe5", "Bxd1", "Bxf7+", "Ke7", "Nd5#"]
        },
        ui_mode: "advanced",
        difficulty: 7
    },
    
    17: {
        name: "MATE AHOGADO",
        type: "famous_mate",
        target_age: "12-14 años",
        fen: "6rk/6pp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
        pieces_total: 8,
        pieces_hidden: ['e1', 'f1'],
        view_time: 5000,
        explanation: "🕳️ Mate Ahogado: el caballo da mate final",
        lesson: "Las propias piezas pueden traicionar al rey",
        historical: {
            pattern: "Smothered Mate",
            antiquity: "Conocido desde el siglo XIII"
        },
        ui_mode: "advanced",
        difficulty: 8
    },
    
    18: {
        name: "MATE DE ANASTASIA",
        type: "famous_mate",
        target_age: "13-15 años",
        fen: "2kr4/ppp5/8/8/8/8/PPP2R2/2K4N w - - 0 1",
        pieces_total: 9,
        pieces_hidden: ['f2', 'h1'],
        view_time: 5000,
        explanation: "💃 Mate de Anastasia: torre y caballo coordinados",
        lesson: "La geometría del mate en la banda",
        historical: {
            name: "Anastasia Mate",
            origin: "Novela 'Anastasia' de 1803"
        },
        ui_mode: "advanced",
        difficulty: 8
    },
    
    19: {
        name: "MATE DE BODEN",
        type: "famous_mate",
        target_age: "13-15 años",
        fen: "2kr1bnr/ppp2ppp/2n5/4q3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQ - 6 6",
        pieces_total: 26,
        pieces_hidden: ['c1', 'f1', 'e5'],
        view_time: 5000,
        explanation: "❌ Mate de Boden: dos alfiles en diagonales cruzadas",
        lesson: "Poder destructivo de los alfiles coordinados",
        historical: {
            player: "Samuel Boden",
            game: "vs Bird, Londres 1860",
            beauty: "★★★★★"
        },
        ui_mode: "advanced",
        difficulty: 9
    },
    
    20: {
        name: "MATE ÁRABE",
        type: "famous_mate", 
        target_age: "14-16 años",
        fen: "5rkr/8/8/8/8/8/8/R4NK1 w - - 0 1",
        pieces_total: 5,
        pieces_hidden: ['a1', 'f1'],
        view_time: 4000,
        explanation: "🐪 Mate Árabe: el más antiguo documentado",
        lesson: "Torre y caballo: pareja letal",
        historical: {
            antiquity: "Manuscritos árabes del siglo IX",
            significance: "Primer mate documentado en la historia"
        },
        ui_mode: "advanced",
        difficulty: 9
    },
    
    // ========================================
    // FASE 3: GRANDMASTER MEMORY (Niveles 21-30)
    // Edad: 14+ años hasta GMs
    // ========================================
    
    21: {
        name: "PARTIDA INMORTAL",
        type: "immortal_game",
        target_age: "14+ años",
        fen: "r1bq1rk1/ppp1nppp/3p1n2/2bPp3/2B1P3/2N2N2/PPP1QPPP/R1B1K2R w KQ - 0 9",
        pieces_total: 28,
        pieces_hidden: ['c3', 'f3', 'c4', 'e2', 'c5', 'f6'],
        view_time: 4000,
        explanation: "🎭 Momento crítico de la Partida Inmortal",
        lesson: "La belleza puede surgir del sacrificio",
        historical: {
            players: "Adolf Anderssen vs Lionel Kieseritzky",
            venue: "Café de la Régence, París 1851",
            significance: "Primera 'partida inmortal' de la historia"
        },
        ui_mode: "master",
        difficulty: 10
    },
    
    22: {
        name: "GAMBITO EVERGREEN",
        type: "immortal_game",
        target_age: "15+ años", 
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
        pieces_total: 28,
        pieces_hidden: ['c4', 'f3', 'd3', 'c6', 'f6', 'c5'],
        view_time: 3500,
        explanation: "🌿 Gambito Evergreen: sacrificios en cascada",
        lesson: "La iniciativa vale más que el material",
        historical: {
            players: "Adolf Anderssen vs Jean Dufresne",
            year: "Berlín 1852",
            brilliancy: "Sacrificio de ambas torres y la dama"
        },
        ui_mode: "master",
        difficulty: 10
    },
    
    23: {
        name: "PARTIDA DEL SIGLO",
        type: "modern_classic",
        target_age: "15+ años",
        fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP1NPPP/R1BQ1RK1 b - - 0 6",
        pieces_total: 28,
        pieces_hidden: ['c4', 'f3', 'e2', 'c5', 'f6', 'c6'],
        view_time: 3500,
        explanation: "🏆 Fischer vs Byrne: la partida del siglo XX",
        lesson: "Perfección táctica y estratégica combinadas",
        historical: {
            players: "Robert Fischer vs Donald Byrne",
            year: "Nueva York 1956",
            age: "Fischer tenía solo 13 años"
        },
        ui_mode: "master",
        difficulty: 11
    },
    
    24: {
        name: "KASPAROV VS TOPALOV",
        type: "modern_classic",
        target_age: "16+ años",
        fen: "r1bq1rk1/pp1n1ppp/2p1pn2/8/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 7",
        pieces_total: 28,
        pieces_hidden: ['c3', 'e3', 'f3', 'b4', 'd7', 'f6'],
        view_time: 3000,
        explanation: "👑 Kasparov vs Topalov: arte moderno",
        lesson: "La preparación profunda en aperturas",
        historical: {
            players: "Garry Kasparov vs Veselin Topalov", 
            tournament: "Wijk aan Zee 1999",
            quality: "Considerada obra maestra moderna"
        },
        ui_mode: "master",
        difficulty: 11
    },
    
    25: {
        name: "MORPHY: REY SIN CORONA",
        type: "romantic_era",
        target_age: "16+ años",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
        pieces_total: 28,
        pieces_hidden: ['c4', 'f3', 'd3', 'c6', 'f6'],
        view_time: 3000,
        explanation: "🤴 Paul Morphy: genio del romanticismo",
        lesson: "Desarrollo rápido y ataque directo",
        historical: {
            player: "Paul Morphy",
            era: "Era romántica del ajedrez (1850-1880)",
            style: "Sacrificios brillantes y ataques directos"
        },
        ui_mode: "master",
        difficulty: 12
    },
    
    26: {
        name: "CAPABLANCA: MÁQUINA PERFECTA",
        type: "positional_masterpiece",
        target_age: "17+ años",
        fen: "r1bqr1k1/pp1n1ppp/2p1pn2/8/1bPP4/2N1PN2/PP2BPPP/R1BQ1RK1 b - - 0 8",
        pieces_total: 28,
        pieces_hidden: ['c3', 'e2', 'e3', 'f3', 'b4', 'd7', 'f6'],
        view_time: 2500,
        explanation: "🎭 Capablanca: perfección posicional",
        lesson: "La simplicidad es la máxima sofisticación",
        historical: {
            player: "José Raúl Capablanca",
            style: "Juego posicional perfecto",
            nickname: "La máquina de ajedrez humana"
        },
        ui_mode: "master",
        difficulty: 12
    },
    
    27: {
        name: "TAL: MAGO DE RIGA",
        type: "tactical_symphony",
        target_age: "17+ años",
        fen: "r2q1rk1/ppp1bppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 b - - 0 6",
        pieces_total: 30,
        pieces_hidden: ['c3', 'c4', 'e2', 'f3', 'c5', 'e7', 'f6', 'c6'],
        view_time: 2500,
        explanation: "🎩 Mikhail Tal: magia táctica pura",
        lesson: "La creatividad no tiene límites",
        historical: {
            player: "Mikhail Tal",
            nickname: "El Mago de Riga",
            style: "Sacrificios especulativos brillantes"
        },
        ui_mode: "master",
        difficulty: 13
    },
    
    28: {
        name: "ALEKHINE: DINAMO TÁCTICO",
        type: "dynamic_masterpiece",
        target_age: "18+ años",
        fen: "r1bq1rk1/pp2nppp/2np4/2b1p3/2B1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 7",
        pieces_total: 30,
        pieces_hidden: ['c3', 'c4', 'e2', 'f3', 'c5', 'e7', 'c6', 'd6'],
        view_time: 2000,
        explanation: "⚡ Alekhine: dinámico y profundo",
        lesson: "La combinación de estrategia y táctica",
        historical: {
            player: "Alexander Alekhine",
            era: "Era clásica (1920-1940)",
            style: "Combinación de juego posicional y táctico"
        },
        ui_mode: "master",
        difficulty: 13
    },
    
    29: {
        name: "POSICIÓN IMPOSIBLE",
        type: "ultimate_challenge",
        target_age: "Maestros",
        fen: "r1bq1rk1/pp1nbppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 b - - 0 6",
        pieces_total: 32,
        pieces_hidden: ['c3', 'c4', 'e2', 'f3', 'd3', 'c5', 'e7', 'f6', 'c6', 'd6', 'd7', 'b7'],
        view_time: 1500,
        explanation: "🧠 Desafío supremo de memoria",
        lesson: "Solo para los elegidos",
        historical: {
            challenge: "Memoria fotográfica absoluta",
            level: "Grandes Maestros únicamente"
        },
        ui_mode: "master",
        difficulty: 14
    },
    
    30: {
        name: "MAESTRÍA ABSOLUTA",
        type: "ultimate_memory",
        target_age: "Grandes Maestros",
        fen: "rnbqkb1r/pp1ppppp/5n2/2p5/2P1P3/5N2/PP1P1PPP/RNBQKB1R w KQkq - 2 3",
        pieces_total: 30,
        pieces_hidden: ['c4', 'f3', 'e4', 'c5', 'f6', 'b1', 'c1', 'f1', 'g1', 'b8', 'c8', 'f8', 'g8'],
        view_time: 1000, // Solo 1 segundo!
        explanation: "🏆 MEMORIA FOTOGRÁFICA ABSOLUTA",
        lesson: "El pináculo de la excelencia ajedrecística",
        historical: {
            challenge: "Recrear posición completa en 1 segundo",
            requirement: "Solo para genios del ajedrez"
        },
        ui_mode: "master",
        difficulty: 15
    }
};

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Obtener configuración de un nivel específico
 */
function getLevelConfig(levelNumber) {
    return MEMORY_LEVELS[levelNumber] || null;
}

/**
 * Obtener todos los niveles de una fase específica
 */
function getLevelsByPhase(phase) {
    const phases = {
        baby: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        pattern: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 
        grandmaster: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    };
    
    return phases[phase] || [];
}

/**
 * Obtener niveles por grupo de edad
 */
function getLevelsByAge(ageGroup) {
    const levels = Object.values(MEMORY_LEVELS);
    
    return levels.filter(level => {
        if (ageGroup === 'kids' && level.ui_mode === 'kids') return true;
        if (ageGroup === 'intermediate' && level.ui_mode === 'intermediate') return true;
        if (ageGroup === 'advanced' && level.ui_mode === 'advanced') return true;
        if (ageGroup === 'master' && level.ui_mode === 'master') return true;
        return false;
    });
}

/**
 * Obtener información de progresión del jugador
 */
function getProgressionInfo(currentLevel) {
    const totalLevels = Object.keys(MEMORY_LEVELS).length;
    const progress = (currentLevel / totalLevels) * 100;
    
    let phase;
    if (currentLevel <= 10) phase = 'Baby Memory';
    else if (currentLevel <= 20) phase = 'Pattern Master';
    else phase = 'Grandmaster Memory';
    
    return {
        currentLevel,
        totalLevels,
        progress: Math.round(progress),
        phase,
        nextMilestone: getNextMilestone(currentLevel)
    };
}

function getNextMilestone(currentLevel) {
    if (currentLevel < 10) return { level: 10, description: 'Completar Baby Memory' };
    if (currentLevel < 20) return { level: 20, description: 'Completar Pattern Master' };
    if (currentLevel < 30) return { level: 30, description: 'Maestría Absoluta' };
    return { level: 30, description: 'Juego completado' };
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.MEMORY_LEVELS = MEMORY_LEVELS;
    window.getLevelConfig = getLevelConfig;
    window.getLevelsByPhase = getLevelsByPhase;
    window.getLevelsByAge = getLevelsByAge;
    window.getProgressionInfo = getProgressionInfo;
}

console.log('📚 Memory Levels cargado: 30 niveles configurados');
