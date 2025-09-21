// Vision Blitz - Base de datos de posiciones tácticas
// Configuración de niveles de dificultad con posiciones FEN

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
};

// Base de datos de tácticas por nivel de dificultad
const TACTICS_DATABASE = {
    
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
        },
        {
            id: 3,
            fen: "4K3/8/8/8/8/8/6k1/5Q2 w - - 0 1",
            solution: "Qf7#",
            options: [
                { move: "Qf7#", notation: "Qf7#", icon: "♕→f7 ✅", kidFriendly: "Dama mata al rey negro" },
                { move: "Qf3+", notation: "Qf3+", icon: "♕→f3 ⚠️", kidFriendly: "Dama da jaque" },
                { move: "Qg1+", notation: "Qg1+", icon: "♕→g1 ⚠️", kidFriendly: "Dama a lado del rey" },
                { move: "Kd7", notation: "Kd7", icon: "♔→d7", kidFriendly: "Rey blanco se mueve" }
            ],
            explanation: "👑 ¡La dama da mate en f7! El rey negro está atrapado",
            visualHint: "El rey negro está en la esquina y no puede escapar",
            difficulty: 1,
            theme: "queen_mate",
            pieceCount: 3,
            boardRotation: false
        }
    ],
    
    // 🌱 NIVEL 2: 4-5 piezas
    mate_few_pieces: [
        {
            id: 4,
            fen: "8/8/8/8/8/1k6/1p6/1R2K3 w - - 0 1",
            solution: "Ra1#",
            options: [
                { move: "Ra1#", notation: "Ra1#", icon: "♖→a1 ✅", kidFriendly: "Torre da mate" },
                { move: "Rb2+", notation: "Rb2+", icon: "♖→b2 ⚠️", kidFriendly: "Torre da jaque" },
                { move: "Kd2", notation: "Kd2", icon: "♔→d2", kidFriendly: "Rey blanco se mueve" },
                { move: "Rf1", notation: "Rf1", icon: "♖→f1", kidFriendly: "Torre a la derecha" }
            ],
            explanation: "🎯 ¡La torre da mate en la primera fila!",
            visualHint: "El peón negro bloquea la escape del rey",
            difficulty: 2,
            theme: "back_rank_mate",
            pieceCount: 4,
            boardRotation: false
        },
        {
            id: 5,
            fen: "8/8/8/8/8/k7/p1p5/N3K3 w - - 0 1",
            solution: "Nb3#",
            options: [
                { move: "Nb3#", notation: "Nb3#", icon: "♘→b3 ✅", kidFriendly: "Caballo da mate" },
                { move: "Nc2", notation: "Nc2", icon: "♘→c2", kidFriendly: "Caballo al centro" },
                { move: "Kd2", notation: "Kd2", icon: "♔→d2", kidFriendly: "Rey blanco se mueve" },
                { move: "Kb1", notation: "Kb1", icon: "♔→b1", kidFriendly: "Rey blanco a la izquierda" }
            ],
            explanation: "🎯 ¡El caballo da mate con un bonito patrón!",
            visualHint: "Los peones negros bloquean al rey",
            difficulty: 2,
            theme: "knight_mate",
            pieceCount: 5,
            boardRotation: false
        },
        {
            id: 6,
            fen: "8/8/8/8/8/3k4/3p4/3BK3 w - - 0 1",
            solution: "Bb3#",
            options: [
                { move: "Bb3#", notation: "Bb3#", icon: "♗→b3 ✅", kidFriendly: "Alfil da mate" },
                { move: "Ba4", notation: "Ba4", icon: "♗→a4", kidFriendly: "Alfil a la izquierda" },
                { move: "Kd2", notation: "Kd2", icon: "♔→d2", kidFriendly: "Rey blanco se mueve" },
                { move: "Bc2", notation: "Bc2", icon: "♗→c2", kidFriendly: "Alfil abajo" }
            ],
            explanation: "🎯 ¡El alfil da mate en diagonal!",
            visualHint: "El peón negro bloquea a su propio rey",
            difficulty: 2,
            theme: "bishop_mate",
            pieceCount: 4,
            boardRotation: false
        },
        {
            id: 7,
            fen: "8/8/8/8/8/3k4/Q7/4K3 w - - 0 1",
            solution: "Qa3#",
            options: [
                { move: "Qa3#", notation: "Qa3#", icon: "♕→a3 ✅", kidFriendly: "Dama da mate" },
                { move: "Qb3+", notation: "Qb3+", icon: "♕→b3 ⚠️", kidFriendly: "Dama da jaque" },
                { move: "Qb2", notation: "Qb2", icon: "♕→b2", kidFriendly: "Dama abajo" },
                { move: "Kd2", notation: "Kd2", icon: "♔→d2", kidFriendly: "Rey blanco se mueve" }
            ],
            explanation: "👑 ¡La dama da mate en a3!",
            visualHint: "La dama controla todas las casillas del rey negro",
            difficulty: 2,
            theme: "queen_mate",
            pieceCount: 3,
            boardRotation: false
        }
    ],
    
    // ⚡ NIVEL 3: Mates en 1 básicos (6-8 piezas)
    mate_in_1_basic: [
        {
            id: 8,
            fen: "r1bqkbnr/pppp1ppp/8/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
            solution: "Qf7#",
            options: [
                { move: "Qf7#", notation: "Qf7#", icon: "♕→f7 ✅", kidFriendly: "Dama da mate" },
                { move: "Qh5", notation: "Qh5", icon: "♕→h5", kidFriendly: "Dama a la derecha" },
                { move: "Bxf7+", notation: "Bxf7+", icon: "♗×f7 ⚠️", kidFriendly: "Alfil captura con jaque" },
                { move: "Qh3", notation: "Qh3", icon: "♕→h3", kidFriendly: "Dama a la esquina" }
            ],
            explanation: "⚡ ¡Mate del pastor! La dama ataca f7",
            visualHint: "La casilla f7 está débil, solo defendida por el rey",
            difficulty: 3,
            theme: "scholars_mate",
            pieceCount: 8,
            boardRotation: false
        },
        {
            id: 9,
            fen: "r1b1kb1r/ppppqppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            solution: "Qh5#",
            options: [
                { move: "Qh5#", notation: "Qh5#", icon: "♕→h5 ✅", kidFriendly: "Dama da mate" },
                { move: "Qf3", notation: "Qf3", icon: "♕→f3", kidFriendly: "Dama al centro" },
                { move: "0-0", notation: "0-0", icon: "0-0", kidFriendly: "Rey enroca" },
                { move: "Bd5", notation: "Bd5", icon: "♗→d5", kidFriendly: "Alfil al centro" }
            ],
            explanation: "⚡ ¡Mate en h5! La dama ataca h7",
            visualHint: "El caballo en f6 está clavado y no puede defender h7",
            difficulty: 3,
            theme: "pin_mate",
            pieceCount: 8,
            boardRotation: false
        },
        {
            id: 10,
            fen: "rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
            solution: "Bxf7+",
            options: [
                { move: "Bxf7+", notation: "Bxf7+", icon: "♗×f7 ⚠️", kidFriendly: "Alfil captura con jaque" },
                { move: "Ng5", notation: "Ng5", icon: "♘→g5", kidFriendly: "Caballo ataca" },
                { move: "Qe2", notation: "Qe2", icon: "♕→e2", kidFriendly: "Dama se desarrolla" },
                { move: "0-0", notation: "0-0", icon: "0-0", kidFriendly: "Rey enroca" }
            ],
            explanation: "⚡ El alfil captura en f7 con jaque, ataque a la debilidad",
            visualHint: "La casilla f7 es un punto débil en la apertura",
            difficulty: 3,
            theme: "legal_attack",
            pieceCount: 8,
            boardRotation: false
        },
        {
            id: 11,
            fen: "r3k2r/pp1n1ppp/2p1pn2/q2p1b2/1b1P1B2/2N1PN2/PPPBQPPP/2KR3R w kq - 0 1",
            solution: "Nb5",
            options: [
                { move: "Nb5", notation: "Nb5", icon: "♘→b5 ✅", kidFriendly: "Caballo salta" },
                { move: "Na4", notation: "Na4", icon: "♘→a4", kidFriendly: "Caballo al borde" },
                { move: "Qf1", notation: "Qf1", icon: "♕→f1", kidFriendly: "Dama atrás" },
                { move: "Rhe1", notation: "Rhe1", icon: "♖→e1", kidFriendly: "Torre se mueve" }
            ],
            explanation: "⚡ ¡El caballo ataca la dama desprotegida!",
            visualHint: "La dama negra en a5 está expuesta al caballo",
            difficulty: 3,
            theme: "knight_attack",
            pieceCount: 8,
            boardRotation: false
        },
        {
            id: 12,
            fen: "r4rk1/pp1qppbp/3p1np1/2pP4/2P1P3/2N2P2/PP1QB1PP/R3KB1R w KQ - 0 1",
            solution: "Bh5",
            options: [
                { move: "Bh5", notation: "Bh5", icon: "♗→h5 ✅", kidFriendly: "Alfil ataca" },
                { move: "Bg4", notation: "Bg4", icon: "♗→g4", kidFriendly: "Alfil al lado" },
                { move: "0-0", notation: "0-0", icon: "0-0", kidFriendly: "Rey enroca" },
                { move: "f4", notation: "f4", icon: "♙→f4", kidFriendly: "Peón avanza" }
            ],
            explanation: "⚡ ¡El alfil ataca el caballo clavado!",
            visualHint: "El caballo en g6 está clavado relativamente al rey",
            difficulty: 3,
            theme: "pin",
            pieceCount: 8,
            boardRotation: false
        }
    ],
    
    // 📌 NIVEL 4: Clavadas básicas (8-10 piezas) - sólo incluimos algunas para el MVP
    pin_basic: [
        {
            id: 13,
            fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            solution: "Bg4",
            options: [
                { move: "Bg4", notation: "Bg4", icon: "♗→g4 📌", kidFriendly: "Alfil clava caballo" },
                { move: "Be7", notation: "Be7", icon: "♗→e7", kidFriendly: "Alfil se desarrolla" },
                { move: "Nd4", notation: "Nd4", icon: "♘→d4", kidFriendly: "Caballo al centro" },
                { move: "h6", notation: "h6", icon: "♙→h6", kidFriendly: "Peón avanza" }
            ],
            explanation: "📌 El alfil clava el caballo a la dama",
            visualHint: "Busca piezas en línea que no pueden moverse",
            difficulty: 4,
            theme: "pin",
            pieceCount: 10,
            boardRotation: false
        },
        {
            id: 14,
            fen: "rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
            solution: "Nxe5",
            options: [
                { move: "Nxe5", notation: "Nxe5", icon: "♘×e5 ✅", kidFriendly: "Caballo captura" },
                { move: "d4", notation: "d4", icon: "♙→d4", kidFriendly: "Peón avanza" },
                { move: "Bc4", notation: "Bc4", icon: "♗→c4", kidFriendly: "Alfil se desarrolla" },
                { move: "d3", notation: "d3", icon: "♙→d3", kidFriendly: "Peón pequeño paso" }
            ],
            explanation: "✅ El caballo captura peón gratis",
            visualHint: "El peón e5 no está defendido",
            difficulty: 4,
            theme: "undefended_piece",
            pieceCount: 10,
            boardRotation: false
        }
    ],
    
    // 🍴 NIVEL 5: Horquillas intermedias - solo incluimos un ejemplo para el MVP
    fork_intermediate: [
        {
            id: 15,
            fen: "r1bqkb1r/ppp2ppp/2n5/3np3/2B5/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            solution: "Nd4",
            options: [
                { move: "Nd4", notation: "Nd4", icon: "♘→d4 🍴", kidFriendly: "Caballo horquilla" },
                { move: "Ng5", notation: "Ng5", icon: "♘→g5", kidFriendly: "Caballo ataca f7" },
                { move: "Bxd5", notation: "Bxd5", icon: "♗×d5", kidFriendly: "Alfil captura peón" },
                { move: "0-0", notation: "0-0", icon: "0-0", kidFriendly: "Rey enroca" }
            ],
            explanation: "🍴 ¡El caballo hace horquilla al caballo y peón!",
            visualHint: "Los caballos atacan en forma de L",
            difficulty: 5,
            theme: "fork",
            pieceCount: 12,
            boardRotation: false
        }
    ]
};
