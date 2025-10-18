/**
 * ============================================
 * COORDINATE SEQUENCE - AUDIO SYSTEM
 * ============================================
 * Sistema de audio sintético usando Web Audio API
 *
 * @version 1.0.0
 * @author ChessArcade Team
 */

// ============================================
// CONFIGURACIÓN DE AUDIO
// ============================================

let audioContext = null;

/**
 * Inicializa el contexto de audio (lazy loading)
 */
function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// ============================================
// FUNCIONES DE SONIDO
// ============================================

/**
 * Beep de casilla (fase memorización)
 * @param {number} frequency - Frecuencia en Hz (default: 880)
 */
function playBeep(frequency = 880) {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
}

/**
 * Click correcto
 */
function playCorrect() {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 1046; // C6
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
}

/**
 * Click incorrecto
 */
function playIncorrect() {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 220; // A3
    oscillator.type = 'square'; // Sonido áspero

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
}

/**
 * Nivel completado (arpegio ascendente)
 */
function playLevelComplete() {
    const ctx = getAudioContext();
    const notes = [523, 659, 783, 1046]; // C-E-G-C
    const duration = 0.15;

    notes.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = ctx.currentTime + index * duration;
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    });
}

/**
 * Game Over (sweep descendente)
 */
function playGameOver() {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.8);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
}

console.log('🔊 Coordinate Sequence - Audio system loaded');
