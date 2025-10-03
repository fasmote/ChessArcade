/**
 * ============================================
 * JAVASCRIPT DE PRUEBA: SOLUCION ALTURA BANCO PIEZAS
 * ============================================
 *
 * PROBLEMA:
 * - Banco de piezas lateral no tiene misma altura que tablero
 * - CSS con !important está sobreescribiendo JavaScript
 * - Necesitamos probar diferentes enfoques
 *
 * ESTE ARCHIVO CONTIENE:
 * - 3 soluciones diferentes para probar
 * - Funciones de debugging visual
 * - Instrucciones claras para testing
 *
 * AUTOR: Claude Code - Memory Matrix Project
 * FECHA: Septiembre 2025
 */

// ============================================
// VARIABLES GLOBALES PARA DEBUGGING
// ============================================

let debugInterval = null;

// ============================================
// SOLUCION 1: FORZAR CON setProperty + important
// ============================================

/**
 * Solución más directa: usar setProperty con 'important'
 * para superar cualquier CSS existente
 */
function solucion1_ForzarConImportant() {
    console.log('🧪 PROBANDO SOLUCION 1: Forzar con !important');

    try {
        const chessboardElement = document.getElementById('chessboard');
        const pieceBankContainer = document.querySelector('.piece-bank-container');
        const pieceBank = document.querySelector('.piece-bank');

        if (!chessboardElement || !pieceBankContainer || !pieceBank) {
            console.error('❌ Elementos no encontrados');
            return false;
        }

        // Obtener altura real del tablero
        const boardRect = chessboardElement.getBoundingClientRect();
        const boardHeight = boardRect.height;

        console.log(`📐 Altura del tablero: ${boardHeight}px`);

        // Solo aplicar en desktop
        if (window.innerWidth >= 768) {
            // FORZAR altura con máxima prioridad CSS
            pieceBankContainer.style.setProperty('height', `${boardHeight}px`, 'important');
            pieceBankContainer.style.setProperty('min-height', `${boardHeight}px`, 'important');
            pieceBankContainer.style.setProperty('max-height', `${boardHeight}px`, 'important');
            pieceBankContainer.style.setProperty('width', '150px', 'important');
            pieceBankContainer.style.setProperty('flex-shrink', '0', 'important');

            pieceBank.style.setProperty('height', `${boardHeight}px`, 'important');
            pieceBank.style.setProperty('min-height', `${boardHeight}px`, 'important');
            pieceBank.style.setProperty('max-height', `${boardHeight}px`, 'important');
            pieceBank.style.setProperty('width', '150px', 'important');
            pieceBank.style.setProperty('overflow-y', 'auto', 'important');
            pieceBank.style.setProperty('flex-direction', 'column', 'important');

            console.log(`✅ SOLUCION 1: Altura forzada a ${boardHeight}px`);
            return true;
        } else {
            console.log('📱 Mobile: no aplicar solución 1');
            return false;
        }
    } catch (error) {
        console.error('❌ Error en solución 1:', error);
        return false;
    }
}

// ============================================
// SOLUCION 2: CSS VARIABLES DINAMICAS
// ============================================

/**
 * Usar CSS custom properties que se actualizan dinámicamente
 * Requiere CSS complementario en DEBUG_altura_banco.css
 */
function solucion2_CSSVariables() {
    console.log('🧪 PROBANDO SOLUCION 2: CSS Variables');

    try {
        const chessboardElement = document.getElementById('chessboard');
        const pieceBankContainer = document.querySelector('.piece-bank-container');
        const pieceBank = document.querySelector('.piece-bank');

        if (!chessboardElement || !pieceBankContainer || !pieceBank) {
            console.error('❌ Elementos no encontrados');
            return false;
        }

        // Obtener altura real del tablero
        const boardRect = chessboardElement.getBoundingClientRect();
        const boardHeight = boardRect.height;

        console.log(`📐 Altura del tablero: ${boardHeight}px`);

        // Actualizar CSS variable
        document.documentElement.style.setProperty('--tablero-altura-real', `${boardHeight}px`);

        // Agregar clases de control (requiere CSS complementario)
        pieceBankContainer.classList.add('js-controlled');
        pieceBank.classList.add('js-controlled');

        console.log(`✅ SOLUCION 2: CSS Variable actualizada a ${boardHeight}px`);
        console.log('📋 IMPORTANTE: Requiere que DEBUG_altura_banco.css esté cargado');
        return true;

    } catch (error) {
        console.error('❌ Error en solución 2:', error);
        return false;
    }
}

// ============================================
// SOLUCION 3: FLEXBOX SINCRONIZADO
// ============================================

/**
 * Usar flexbox con align-items: stretch para sincronizar alturas
 * Requiere CSS complementario en DEBUG_altura_banco.css
 */
function solucion3_FlexboxSync() {
    console.log('🧪 PROBANDO SOLUCION 3: Flexbox Sincronizado');

    try {
        const chessBoardContainer = document.querySelector('.chess-board-container');
        const chessBoard = document.querySelector('.chess-board');
        const pieceBankContainer = document.querySelector('.piece-bank-container');
        const pieceBank = document.querySelector('.piece-bank');

        if (!chessBoardContainer || !chessBoard || !pieceBankContainer || !pieceBank) {
            console.error('❌ Elementos no encontrados');
            return false;
        }

        // Agregar clases de flexbox (requiere CSS complementario)
        chessBoardContainer.classList.add('flex-sync');
        chessBoard.classList.add('flex-item');
        pieceBankContainer.classList.add('flex-item');
        pieceBank.classList.add('flex-item');

        console.log('✅ SOLUCION 3: Clases flexbox agregadas');
        console.log('📋 IMPORTANTE: Requiere que DEBUG_altura_banco.css esté cargado');
        return true;

    } catch (error) {
        console.error('❌ Error en solución 3:', error);
        return false;
    }
}

// ============================================
// DEBUGGING Y VISUALIZACION
// ============================================

/**
 * Agregar clases de debug para visualizar alturas y bordes
 */
function agregarDebugVisual() {
    console.log('🎨 Agregando debug visual...');

    try {
        const chessBoard = document.querySelector('.chess-board');
        const pieceBankContainer = document.querySelector('.piece-bank-container');
        const pieceBank = document.querySelector('.piece-bank');

        if (chessBoard && pieceBankContainer && pieceBank) {
            // Agregar clases debug
            chessBoard.classList.add('debug-tablero');
            pieceBankContainer.classList.add('debug-banco-container');
            pieceBank.classList.add('debug-banco');

            // Mostrar alturas en atributos data
            const boardHeight = chessBoard.getBoundingClientRect().height;
            const bankHeight = pieceBankContainer.getBoundingClientRect().height;

            chessBoard.setAttribute('data-height', Math.round(boardHeight));
            pieceBankContainer.setAttribute('data-height', Math.round(bankHeight));

            console.log(`🎨 Debug visual agregado:`);
            console.log(`   - Tablero: ${boardHeight}px`);
            console.log(`   - Banco: ${bankHeight}px`);
            console.log(`   - Diferencia: ${Math.abs(boardHeight - bankHeight)}px`);
        }
    } catch (error) {
        console.error('❌ Error en debug visual:', error);
    }
}

/**
 * Remover todas las clases debug
 */
function removerDebugVisual() {
    console.log('🧹 Removiendo debug visual...');

    const elements = document.querySelectorAll('.debug-tablero, .debug-banco-container, .debug-banco');
    elements.forEach(el => {
        el.classList.remove('debug-tablero', 'debug-banco-container', 'debug-banco');
        el.removeAttribute('data-height');
    });
}

/**
 * Monitorear alturas en tiempo real
 */
function iniciarMonitoreoAlturas() {
    console.log('📊 Iniciando monitoreo de alturas...');

    debugInterval = setInterval(() => {
        const chessBoard = document.querySelector('.chess-board');
        const pieceBankContainer = document.querySelector('.piece-bank-container');

        if (chessBoard && pieceBankContainer) {
            const boardHeight = Math.round(chessBoard.getBoundingClientRect().height);
            const bankHeight = Math.round(pieceBankContainer.getBoundingClientRect().height);
            const diferencia = Math.abs(boardHeight - bankHeight);

            console.log(`📊 Tablero: ${boardHeight}px | Banco: ${bankHeight}px | Diff: ${diferencia}px`);

            // Actualizar atributos para CSS pseudo-elementos
            chessBoard.setAttribute('data-height', boardHeight);
            pieceBankContainer.setAttribute('data-height', bankHeight);
        }
    }, 2000); // Cada 2 segundos
}

/**
 * Detener monitoreo de alturas
 */
function detenerMonitoreoAlturas() {
    if (debugInterval) {
        clearInterval(debugInterval);
        debugInterval = null;
        console.log('⏹️ Monitoreo de alturas detenido');
    }
}

// ============================================
// FUNCIONES DE TESTING COMPLETO
// ============================================

/**
 * Probar todas las soluciones en secuencia
 */
async function probarTodasLasSoluciones() {
    console.log('🚀 INICIANDO PRUEBAS DE TODAS LAS SOLUCIONES');

    // Limpiar estado previo
    limpiarTodasLasSoluciones();

    // Agregar debug visual
    agregarDebugVisual();
    iniciarMonitoreoAlturas();

    console.log('\n⏳ Esperando 3 segundos antes de comenzar...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Probar solución 1
    console.log('\n=== PROBANDO SOLUCION 1 ===');
    solucion1_ForzarConImportant();
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Limpiar y probar solución 2
    console.log('\n=== PROBANDO SOLUCION 2 ===');
    limpiarTodasLasSoluciones();
    solucion2_CSSVariables();
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Limpiar y probar solución 3
    console.log('\n=== PROBANDO SOLUCION 3 ===');
    limpiarTodasLasSoluciones();
    solucion3_FlexboxSync();
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n✅ PRUEBAS COMPLETADAS - Revisa la consola y el visual');
}

/**
 * Limpiar todos los estilos y clases aplicados por las soluciones
 */
function limpiarTodasLasSoluciones() {
    console.log('🧹 Limpiando todas las soluciones...');

    try {
        // Limpiar estilos inline
        const elements = [
            document.querySelector('.piece-bank-container'),
            document.querySelector('.piece-bank'),
            document.querySelector('.chess-board-container'),
            document.querySelector('.chess-board')
        ];

        elements.forEach(el => {
            if (el) {
                // Remover estilos inline específicos
                el.style.removeProperty('height');
                el.style.removeProperty('min-height');
                el.style.removeProperty('max-height');
                el.style.removeProperty('width');
                el.style.removeProperty('flex-shrink');
                el.style.removeProperty('overflow-y');
                el.style.removeProperty('flex-direction');

                // Remover clases de testing
                el.classList.remove('js-controlled', 'flex-sync', 'flex-item');
            }
        });

        // Limpiar CSS variables
        document.documentElement.style.removeProperty('--tablero-altura-real');

        console.log('✅ Estado limpiado');

    } catch (error) {
        console.error('❌ Error limpiando:', error);
    }
}

// ============================================
// FUNCIONES PARA CONSOLA DEL NAVEGADOR
// ============================================

/**
 * Función helper para usar desde la consola del navegador
 */
window.debugAlturasBanco = {
    // Probar soluciones individuales
    solucion1: solucion1_ForzarConImportant,
    solucion2: solucion2_CSSVariables,
    solucion3: solucion3_FlexboxSync,

    // Debug visual
    debug: agregarDebugVisual,
    limpiarDebug: removerDebugVisual,

    // Monitoreo
    monitorear: iniciarMonitoreoAlturas,
    detenerMonitoreo: detenerMonitoreoAlturas,

    // Testing completo
    probarTodas: probarTodasLasSoluciones,
    limpiar: limpiarTodasLasSoluciones,

    // Info de ayuda
    ayuda: function() {
        console.log(`
🔧 DEBUG ALTURA BANCO DE PIEZAS - FUNCIONES DISPONIBLES:

PROBAR SOLUCIONES:
- debugAlturasBanco.solucion1()  // Forzar con !important
- debugAlturasBanco.solucion2()  // CSS variables (requiere CSS)
- debugAlturasBanco.solucion3()  // Flexbox sync (requiere CSS)

DEBUG VISUAL:
- debugAlturasBanco.debug()      // Agregar bordes y info
- debugAlturasBanco.limpiarDebug() // Quitar debug visual

MONITOREO:
- debugAlturasBanco.monitorear() // Ver alturas cada 2s
- debugAlturasBanco.detenerMonitoreo() // Parar monitoreo

TESTING COMPLETO:
- debugAlturasBanco.probarTodas() // Probar todas las soluciones
- debugAlturasBanco.limpiar()    // Reset completo

PASOS RECOMENDADOS:
1. debugAlturasBanco.debug()     // Ver estado actual
2. debugAlturasBanco.solucion1() // Probar solución más directa
3. Si no funciona, probar solucion2() o solucion3()

IMPORTANTE: Las soluciones 2 y 3 requieren DEBUG_altura_banco.css cargado
        `);
    }
};

// ============================================
// INICIALIZACION AUTOMATICA
// ============================================

// Hacer funciones disponibles en consola al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Debug Altura Banco cargado');
    console.log('💡 Usa debugAlturasBanco.ayuda() para ver todas las funciones');

    // Mostrar estado inicial
    setTimeout(() => {
        console.log('\n📊 ESTADO INICIAL:');
        agregarDebugVisual();
    }, 1000);
});

console.log('🚀 DEBUG_altura_banco.js cargado - Funciones disponibles en debugAlturasBanco.*');