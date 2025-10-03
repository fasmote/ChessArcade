/**
 * PieceThemes - Configuración de todos los sets de piezas disponibles
 *
 * Sistema modular para gestionar diferentes estilos de piezas.
 * Fácil de extender agregando nuevos temas.
 */

class PieceThemes {
    static themes = {
        // Tema por defecto - Lichess CDN
        lichess: {
            name: 'Lichess (Moderno)',
            description: 'Piezas estilo Lichess - Diseño moderno y limpio',
            type: 'cdn',
            basePath: 'https://lichess1.org/assets/piece/cburnett/',
            extension: 'svg',
            pieceTheme: (piece) => {
                return `<img src="https://lichess1.org/assets/piece/cburnett/${piece}.svg" alt="${piece}" style="width: 100%; height: 100%;">`;
            }
        },

        // Tema Chess.com
        chesscom: {
            name: 'Chess.com',
            description: 'Piezas estilo Chess.com',
            type: 'cdn',
            basePath: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/',
            extension: 'png',
            pieceTheme: (piece) => {
                // Chess.com usa nomenclatura diferente: wk.png, bq.png, etc.
                const pieceLower = piece.toLowerCase();
                return `<img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${pieceLower}.png" alt="${piece}" style="width: 100%; height: 100%;">`;
            }
        },

        // Tema Wikipedia (clásico)
        wikipedia: {
            name: 'Wikipedia (Clásico)',
            description: 'Piezas clásicas estilo Wikipedia',
            type: 'local',
            basePath: 'libs/img/chesspieces/wikipedia/',
            extension: 'png',
            pieceTheme: (piece) => {
                return `<img src="libs/img/chesspieces/wikipedia/${piece}.png" alt="${piece}" style="width: 100%; height: 100%;">`;
            }
        },

        // Tema Monsters (personalizado - pendiente piezas individuales)
        monsters: {
            name: 'Monsters (MAG)',
            description: 'Piezas monsters diseñadas por MAG - ¡Diversión para niños!',
            type: 'local',
            basePath: 'libs/img/chesspieces/monsters/',
            extension: 'svg', // Cambiar a 'png' si usas PNG
            pieceTheme: (piece) => {
                return `<img src="libs/img/chesspieces/monsters/${piece}.svg" alt="${piece}" style="width: 100%; height: 100%;">`;
            },
            // Mapeo de piezas a monstruos (documentación)
            pieceMapping: {
                wK: 'Vampiro amarillo (Rey blanco)',
                wQ: 'Dama amarilla',
                wR: 'Frankenstein amarillo (Torre blanca)',
                wB: 'Momia amarilla (Alfil blanco)',
                wN: 'Hombre lobo amarillo (Caballo blanco)',
                wP: 'Momia pequeña amarilla (Peón blanco)',
                bK: 'Vampiro azul (Rey negro)',
                bQ: 'Dama azul',
                bR: 'Frankenstein azul (Torre negra)',
                bB: 'Gorila azul (Alfil negro)',
                bN: 'Hombre lobo azul (Caballo negro)',
                bP: 'Alien azul (Peón negro)'
            },
            enabled: false // Deshabilitado hasta tener las piezas individuales
        },

        // Tema minimalista (futuro)
        minimal: {
            name: 'Minimalista',
            description: 'Diseño simple y moderno',
            type: 'local',
            basePath: 'libs/img/chesspieces/minimal/',
            extension: 'svg',
            pieceTheme: (piece) => {
                return `<img src="libs/img/chesspieces/minimal/${piece}.svg" alt="${piece}" style="width: 100%; height: 100%;">`;
            },
            enabled: false // Tema futuro
        }
    };

    // Tema por defecto
    static defaultTheme = 'lichess';

    // Tema actual (se carga de localStorage)
    static currentTheme = null;

    /**
     * Inicializa el sistema de temas
     */
    static initialize() {
        // Cargar tema guardado o usar default
        const savedTheme = localStorage.getItem('chessarcade_piece_theme');
        this.currentTheme = savedTheme || this.defaultTheme;

        // Verificar que el tema existe y está habilitado
        if (!this.themes[this.currentTheme] || this.themes[this.currentTheme].enabled === false) {
            console.warn(`⚠️ Tema '${this.currentTheme}' no disponible, usando '${this.defaultTheme}'`);
            this.currentTheme = this.defaultTheme;
        }

        console.log('🎨 PieceThemes inicializado. Tema actual:', this.currentTheme);
        return this.currentTheme;
    }

    /**
     * Obtiene el tema actual
     */
    static getCurrentTheme() {
        if (!this.currentTheme) {
            this.initialize();
        }
        return this.themes[this.currentTheme];
    }

    /**
     * Obtiene la función pieceTheme del tema actual
     */
    static getPieceThemeFunction() {
        const theme = this.getCurrentTheme();
        return theme.pieceTheme;
    }

    /**
     * Cambia el tema actual
     */
    static setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error('❌ Tema no encontrado:', themeName);
            return false;
        }

        if (this.themes[themeName].enabled === false) {
            console.warn('⚠️ Tema deshabilitado:', themeName);
            return false;
        }

        this.currentTheme = themeName;
        localStorage.setItem('chessarcade_piece_theme', themeName);

        console.log('✅ Tema cambiado a:', themeName);

        // Emitir evento para que los componentes se actualicen
        if (typeof ChessGameEventBus !== 'undefined') {
            ChessGameEventBus.emit('themeChanged', { theme: themeName });
        }

        return true;
    }

    /**
     * Obtiene lista de temas disponibles (solo habilitados)
     */
    static getAvailableThemes() {
        return Object.entries(this.themes)
            .filter(([key, theme]) => theme.enabled !== false)
            .map(([key, theme]) => ({
                id: key,
                name: theme.name,
                description: theme.description,
                type: theme.type,
                isCurrent: key === this.currentTheme
            }));
    }

    /**
     * Obtiene path de una pieza específica
     */
    static getPiecePath(piece) {
        const theme = this.getCurrentTheme();
        return `${theme.basePath}${piece}.${theme.extension}`;
    }

    /**
     * Verifica si un tema está disponible
     */
    static isThemeAvailable(themeName) {
        return this.themes[themeName] && this.themes[themeName].enabled !== false;
    }

    /**
     * Habilita un tema (útil cuando se agregan piezas monsters)
     */
    static enableTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error('❌ Tema no encontrado:', themeName);
            return false;
        }

        this.themes[themeName].enabled = true;
        console.log('✅ Tema habilitado:', themeName);
        return true;
    }

    /**
     * Deshabilita un tema
     */
    static disableTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error('❌ Tema no encontrado:', themeName);
            return false;
        }

        this.themes[themeName].enabled = false;

        // Si es el tema actual, cambiar al default
        if (this.currentTheme === themeName) {
            this.setTheme(this.defaultTheme);
        }

        console.log('⚠️ Tema deshabilitado:', themeName);
        return true;
    }
}

// Auto-inicializar cuando se carga el archivo
PieceThemes.initialize();
