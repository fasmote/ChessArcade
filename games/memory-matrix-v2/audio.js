/**
 * ============================================
 * MEMORY MATRIX - SISTEMA DE AUDIO
 * ============================================
 *
 * Sistema de audio basado en Web Audio API
 * Genera sonidos sintéticos tipo arcade/neón
 *
 * CONCEPTOS BÁSICOS DE WEB AUDIO API:
 * -----------------------------------
 * 1. AudioContext: Motor principal de audio del navegador
 * 2. Oscillator: Generador de ondas sonoras (seno, cuadrada, triangular)
 * 3. GainNode: Controla el volumen
 * 4. Frequency: Frecuencia en Hz (grave=bajo, agudo=alto)
 * 5. connect(): Conecta nodos de audio (oscillator → gain → speakers)
 *
 * FRECUENCIAS DE REFERENCIA:
 * - Muy grave: 50-100 Hz
 * - Grave: 100-250 Hz
 * - Medio: 250-2000 Hz
 * - Agudo: 2000-4000 Hz
 * - Muy agudo: 4000-8000 Hz
 */

// ==========================================
// VARIABLES GLOBALES
// ==========================================

let audioContext = null;  // Contexto de audio (se crea al primer uso)
let isMuted = false;       // Estado del mute global

// ==========================================
// INICIALIZACIÓN DEL AUDIO CONTEXT
// ==========================================

/**
 * Inicializa el AudioContext
 * IMPORTANTE: Los navegadores requieren interacción del usuario
 * antes de permitir audio (por seguridad)
 */
function initAudioContext() {
    if (!audioContext) {
        // Crear contexto de audio compatible con todos los navegadores
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('🔊 AudioContext inicializado');
    }
    return audioContext;
}

/**
 * Obtiene el estado del mute desde localStorage
 */
function loadMutePreference() {
    const saved = localStorage.getItem('memory_matrix_audio');
    isMuted = saved === 'false' ? false : true; // Por defecto: muted
    console.log(`🔇 Audio ${isMuted ? 'desactivado' : 'activado'}`);
}

/**
 * Alterna entre mute/unmute
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('memory_matrix_audio', isMuted ? 'false' : 'true');
    console.log(`🔊 Audio ${isMuted ? 'desactivado' : 'activado'}`);
    return isMuted;
}

// ==========================================
// SONIDO 1: GLITCH MATRIX
// ==========================================

/**
 * Genera sonido de glitch digital tipo Matrix
 * Usa ruido blanco + modulación aleatoria de frecuencia
 *
 * TÉCNICA:
 * - Buffer de ruido aleatorio (white noise)
 * - Filtro de frecuencia variable
 * - Envelope (envolvente) rápida
 *
 * @param {string} intensity - 'warning' (sutil) o 'critical' (intenso)
 */
function playGlitchSound(intensity = 'warning') {
    if (isMuted) return;

    const ctx = initAudioContext();

    // ==========================================
    // PASO 1: Crear buffer de ruido blanco
    // ==========================================

    const bufferSize = ctx.sampleRate * 0.1; // 0.1 segundos de ruido
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Llenar buffer con valores aleatorios (-1 a 1)
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // Ruido blanco
    }

    // Crear fuente de audio desde el buffer
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // ==========================================
    // PASO 2: Crear filtro de frecuencia
    // ==========================================

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; // Filtro de banda (solo deja pasar ciertas frecuencias)

    // Frecuencia según intensidad
    if (intensity === 'critical') {
        filter.frequency.value = 1500; // Más agudo = más urgente
        filter.Q.value = 0.5; // Q = ancho de banda (bajo = más rango)
    } else {
        filter.frequency.value = 800; // Medio-agudo
        filter.Q.value = 0.3;
    }

    // ==========================================
    // PASO 3: Controlar volumen (Gain)
    // ==========================================

    const gainNode = ctx.createGain();

    // Volumen según intensidad
    const volume = intensity === 'critical' ? 0.15 : 0.08;

    // Envelope: Fade in rápido → Fade out
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01); // Fade in 10ms
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); // Fade out

    // ==========================================
    // PASO 4: Conectar nodos y reproducir
    // ==========================================

    // Cadena: noise → filter → gain → speakers
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Reproducir
    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.1); // Duración: 100ms

    console.log(`⚡ Glitch ${intensity} reproducido`);
}

// ==========================================
// SONIDO 2: ERROR (Buzz grave)
// ==========================================

/**
 * Sonido de error tipo arcade
 * Usa dos osciladores en frecuencias disonantes (desagradables)
 *
 * TÉCNICA:
 * - Oscilador 1: 150 Hz (grave)
 * - Oscilador 2: 170 Hz (ligeramente desafinado = tensión)
 * - Onda cuadrada (harsh, digital)
 */
function playErrorSound() {
    if (isMuted) return;

    const ctx = initAudioContext();
    const now = ctx.currentTime;

    // ==========================================
    // Crear dos osciladores disonantes
    // ==========================================

    // Oscilador 1: Fundamental (150 Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'square'; // Onda cuadrada (sonido digital/duro)
    osc1.frequency.value = 150;

    // Oscilador 2: Desafinado (170 Hz) - crea "batimiento"
    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = 170;

    // ==========================================
    // Control de volumen
    // ==========================================

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01); // Fade in rápido
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // Fade out

    // ==========================================
    // Conectar y reproducir
    // ==========================================

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3); // Duración: 300ms
    osc2.stop(now + 0.3);

    console.log('❌ Sonido de error reproducido');
}

// ==========================================
// SONIDO 3: ÉXITO (Chime ascendente)
// ==========================================

/**
 * Sonido de éxito tipo arcade
 * Arpeggio ascendente (3 notas que suben)
 *
 * TÉCNICA:
 * - 3 notas musicales en secuencia
 * - Frecuencias basadas en escala mayor (Do - Mi - Sol)
 * - Onda seno (suave, agradable)
 */
function playSuccessSound() {
    if (isMuted) return;

    const ctx = initAudioContext();
    const now = ctx.currentTime;

    // ==========================================
    // Notas del arpeggio (Do mayor)
    // ==========================================

    // C5 = 523.25 Hz (Do)
    // E5 = 659.25 Hz (Mi)
    // G5 = 783.99 Hz (Sol)
    const notes = [523.25, 659.25, 783.99];
    const noteDuration = 0.15; // Duración de cada nota

    notes.forEach((freq, index) => {
        const startTime = now + (index * noteDuration);

        // Crear oscilador para esta nota
        const osc = ctx.createOscillator();
        osc.type = 'sine'; // Onda seno (suave)
        osc.frequency.value = freq;

        // Control de volumen para esta nota
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

        // Conectar
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Reproducir
        osc.start(startTime);
        osc.stop(startTime + noteDuration);
    });

    console.log('✅ Sonido de éxito reproducido');
}

// ==========================================
// SONIDO 4: CONFETI (Cascada de notas)
// ==========================================

/**
 * Sonido de celebración con confeti
 * Múltiples notas agudas aleatorias (efecto de cascada)
 *
 * TÉCNICA:
 * - 8 notas aleatorias en rango agudo
 * - Delays aleatorios (efecto de lluvia)
 * - Envelope rápida (sparkle)
 */
function playConfettiSound() {
    if (isMuted) return;

    const ctx = initAudioContext();
    const now = ctx.currentTime;

    // ==========================================
    // Generar 8 notas aleatorias agudas
    // ==========================================

    const noteCount = 8;
    const baseFreq = 1000; // Frecuencia base (aguda)

    for (let i = 0; i < noteCount; i++) {
        // Delay aleatorio (0 - 400ms)
        const delay = Math.random() * 0.4;
        const startTime = now + delay;

        // Frecuencia aleatoria entre 1000-2500 Hz (muy agudo)
        const freq = baseFreq + (Math.random() * 1500);

        // Crear oscilador
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        // Envelope corta (sparkle)
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        // Conectar
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Reproducir
        osc.start(startTime);
        osc.stop(startTime + 0.15);
    }

    console.log('🎉 Sonido de confeti reproducido');
}

// ==========================================
// SONIDO 5: VUELO DE PIEZA (Whoosh)
// ==========================================

/**
 * Sonido de pieza volando al banco
 * Sweep de frecuencia descendente (efecto Doppler)
 *
 * TÉCNICA:
 * - Frecuencia que baja rápidamente (500 Hz → 100 Hz)
 * - Ruido filtrado (viento)
 */
function playFlySound() {
    if (isMuted) return;

    const ctx = initAudioContext();
    const now = ctx.currentTime;
    const duration = 0.3; // 300ms (duración de la animación de vuelo)

    // ==========================================
    // Crear ruido blanco
    // ==========================================

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // ==========================================
    // Filtro con sweep descendente
    // ==========================================

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; // Filtro paso-bajo
    filter.Q.value = 1;

    // Sweep: 500 Hz → 100 Hz (sonido "cayendo")
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + duration);

    // ==========================================
    // Control de volumen
    // ==========================================

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.05); // Fade in
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Fade out

    // Conectar
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Reproducir
    noise.start(now);
    noise.stop(now + duration);

    console.log('✈️ Sonido de vuelo reproducido');
}

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

if (typeof window !== 'undefined') {
    window.MemoryMatrixAudio = {
        // Inicialización
        init: initAudioContext,
        loadMutePreference,
        toggleMute,

        // Sonidos del juego
        playGlitchSound,
        playErrorSound,
        playSuccessSound,
        playConfettiSound,
        playFlySound,

        // Estado
        isMuted: () => isMuted
    };
}

console.log('🎵 Sistema de audio cargado (Web Audio API)');
