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
    }
};

// Funciones de utilidad (compartidas)
function getLevelConfig(levelNumber) {
    return MEMORY_LEVELS[levelNumber] || null;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.MEMORY_LEVELS = MEMORY_LEVELS;
    window.getLevelConfig = getLevelConfig;
}

console.log('📚 Memory Levels cargado: 3 niveles configurados');