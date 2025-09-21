/**
 * Script de debugging para Memory Matrix Library Version
 * Ejecuta esto en la consola del navegador para diagnosticar problemas
 */

console.log('🔍 INICIANDO DEBUGGING...');

// 1. Verificar carga de librerías
console.log('📚 VERIFICANDO LIBRERÍAS:');
console.log('Chess.js:', typeof Chess !== 'undefined' ? '✅ Cargado' : '❌ No cargado');
console.log('Chessground:', typeof Chessground !== 'undefined' ? '✅ Cargado' : '❌ No cargado');
console.log('Howler:', typeof Howl !== 'undefined' ? '✅ Cargado' : '❌ No cargado');
console.log('Memory Levels:', typeof MEMORY_LEVELS !== 'undefined' ? '✅ Cargado' : '❌ No cargado');

// 2. Verificar elementos DOM
console.log('\n🎯 VERIFICANDO DOM:');
const boardElement = document.getElementById('chessboard');
console.log('Elemento tablero:', boardElement ? '✅ Encontrado' : '❌ No encontrado');
if (boardElement) {
    console.log('Dimensiones:', boardElement.offsetWidth + 'x' + boardElement.offsetHeight);
    console.log('Estilos computados:', window.getComputedStyle(boardElement));
}

// 3. Test básico de Chess.js
console.log('\n♛ TEST CHESS.JS:');
if (typeof Chess !== 'undefined') {
    try {
        const testChess = new Chess();
        console.log('✅ Chess.js funciona');
        console.log('FEN inicial:', testChess.fen());

        testChess.load('4k3/8/8/8/8/8/8/4K3 w - - 0 1');
        console.log('✅ Load FEN funciona');
        console.log('Board:', testChess.board());
    } catch (error) {
        console.log('❌ Chess.js error:', error);
    }
} else {
    console.log('❌ Chess.js no disponible');
}

// 4. Test básico de Chessground
console.log('\n🏁 TEST CHESSGROUND:');
if (typeof Chessground !== 'undefined' && boardElement) {
    try {
        const testConfig = {
            coordinates: true,
            viewOnly: true,
            fen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1'
        };

        const testBoard = Chessground(boardElement, testConfig);
        console.log('✅ Chessground funciona');
        console.log('Estado del tablero:', testBoard.state);

        // Verificar que se crearon las casillas
        const squares = boardElement.querySelectorAll('.cg-square');
        console.log('Casillas creadas:', squares.length);

        if (squares.length === 0) {
            console.log('❌ No se crearon casillas');
        } else {
            console.log('✅ Casillas creadas correctamente');
            console.log('Primera casilla:', squares[0]);
        }

    } catch (error) {
        console.log('❌ Chessground error:', error);
    }
} else {
    console.log('❌ Chessground no disponible o elemento no encontrado');
}

// 5. Verificar el juego principal
console.log('\n🎮 VERIFICANDO JUEGO:');
if (window.memoryGame) {
    console.log('✅ Instancia del juego encontrada');
    console.log('Estado:', window.memoryGame.gameState);
    console.log('Nivel actual:', window.memoryGame.currentLevel);
    console.log('Chess instance:', window.memoryGame.chessInstance);
    console.log('Chessground instance:', window.memoryGame.chessgroundInstance);
} else {
    console.log('❌ Instancia del juego no encontrada');
}

console.log('\n🔍 DEBUGGING COMPLETADO');

// Función helper para forzar re-inicialización
window.debugReinit = function() {
    console.log('🔄 Forzando re-inicialización...');
    if (window.memoryGame) {
        window.memoryGame.initChessground();
    } else {
        console.log('❌ No hay instancia del juego para re-inicializar');
    }
};

console.log('💡 Tip: Ejecuta debugReinit() para forzar re-inicialización del tablero');