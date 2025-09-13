// ========================================
// CHESSARCADE - SHARED UTILITIES
// Funciones comunes para todos los juegos
// Versión: 1.0.0
// ========================================

// ========================================
// CONFIGURACIÓN GLOBAL
// ========================================
const CHESSARCADE = {
    version: '1.0.0',
    apiBase: 'https://chessarcade-api.vercel.app',
    isOnline: false,
    soundEnabled: true,
    theme: 'arcade', // arcade, retro, neon
    language: 'es'
};

// ========================================
// SISTEMA DE SONIDO
// ========================================
const SOUNDS = {
    move: null,
    success: null,
    error: null,
    victory: null,
    click: null
};

// Inicializar sonidos (Web Audio API)
function initializeSounds() {
    // Crear sonidos programáticamente para evitar archivos
    SOUNDS.move = createBeepSound(440, 0.1, 'square');
    SOUNDS.success = createBeepSound(660, 0.2, 'square');
    SOUNDS.error = createBeepSound(220, 0.3, 'sawtooth');
    SOUNDS.victory = createMelody([523, 659, 784, 1047], 0.5);
    SOUNDS.click = createBeepSound(800, 0.05, 'square');
}

function createBeepSound(frequency, duration, waveType = 'square') {
    return {
        frequency: frequency,
        duration: duration,
        waveType: waveType,
        volume: 0.1
    };
}

function createMelody(frequencies, noteDuration) {
    return {
        type: 'melody',
        frequencies: frequencies,
        noteDuration: noteDuration,
        volume: 0.1
    };
}

function playSound(soundName) {
    if (!CHESSARCADE.soundEnabled || !SOUNDS[soundName]) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sound = SOUNDS[soundName];
    
    if (sound.type === 'melody') {
        playMelody(audioContext, sound);
    } else {
        playBeep(audioContext, sound);
    }
}

function playBeep(audioContext, sound) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
    oscillator.type = sound.waveType;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(sound.volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + sound.duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + sound.duration);
}

function playMelody(audioContext, melody) {
    melody.frequencies.forEach((frequency, index) => {
        const startTime = audioContext.currentTime + (index * melody.noteDuration);
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(melody.volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + melody.noteDuration - 0.01);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + melody.noteDuration);
    });
}

function toggleGameSound() {
    CHESSARCADE.soundEnabled = !CHESSARCADE.soundEnabled;
    
    // Actualizar UI
    const soundButtons = document.querySelectorAll('.btn-sound');
    soundButtons.forEach(btn => {
        btn.textContent = CHESSARCADE.soundEnabled ? '🔊' : '🔇';
        btn.title = CHESSARCADE.soundEnabled ? 'Silenciar' : 'Activar sonido';
    });
    
    // Guardar preferencia
    localStorage.setItem('chessarcade_sound', CHESSARCADE.soundEnabled);
    
    // Reproducir sonido de confirmación
    if (CHESSARCADE.soundEnabled) {
        playSound('click');
    }
}

// ========================================
// SISTEMA DE ALMACENAMIENTO LOCAL
// ========================================

function saveLocalData(key, data) {
    try {
        const chessArcadeData = JSON.parse(localStorage.getItem('chessarcade_data') || '{}');
        chessArcadeData[key] = data;
        localStorage.setItem('chessarcade_data', JSON.stringify(chessArcadeData));
        return true;
    } catch (error) {
        console.error('Error saving local data:', error);
        return false;
    }
}

function getLocalData(key, defaultValue = null) {
    try {
        const chessArcadeData = JSON.parse(localStorage.getItem('chessarcade_data') || '{}');
        return chessArcadeData[key] || defaultValue;
    } catch (error) {
        console.error('Error getting local data:', error);
        return defaultValue;
    }
}

function saveLocalScore(gameType, score, timeSeconds, level = 1, extraData = {}) {
    const scores = getLocalData(`${gameType}_scores`, []);
    
    const newScore = {
        score: score,
        time: timeSeconds,
        level: level,
        date: new Date().toISOString(),
        id: Date.now(),
        ...extraData
    };
    
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score); // Ordenar por puntuación descendente
    scores.splice(20); // Mantener solo top 20
    
    saveLocalData(`${gameType}_scores`, scores);
    
    // Verificar si es record personal
    const isNewRecord = scores[0].id === newScore.id;
    if (isNewRecord) {
        showNotification('🏆 ¡NUEVO RECORD PERSONAL!', 'success');
        playSound('victory');
    }
    
    return { isNewRecord, position: scores.findIndex(s => s.id === newScore.id) + 1 };
}

function getLocalLeaderboard(gameType, limit = 10) {
    return getLocalData(`${gameType}_scores`, []).slice(0, limit);
}

// ========================================
// SISTEMA DE LOGROS
// ========================================

const ACHIEVEMENTS = {
    'first_game': {
        id: 'first_game',
        name: 'Primer Paso',
        description: 'Completa tu primer juego',
        icon: '🎮',
        condition: (stats) => stats.gamesPlayed >= 1
    },
    'speed_demon': {
        id: 'speed_demon',
        name: 'Demonio de Velocidad',
        description: 'Completa un juego en menos de 30 segundos',
        icon: '⚡',
        condition: (stats) => stats.bestTime <= 30
    },
    'perfectionist': {
        id: 'perfectionist',
        name: 'Perfeccionista',
        description: 'Completa un juego sin errores',
        icon: '💎',
        condition: (stats) => stats.perfectGames >= 1
    },
    'persistent': {
        id: 'persistent',
        name: 'Perseverante',
        description: 'Juega 10 partidas',
        icon: '🔥',
        condition: (stats) => stats.gamesPlayed >= 10
    },
    'high_scorer': {
        id: 'high_scorer',
        name: 'Puntuador Elite',
        description: 'Alcanza 1000 puntos en cualquier juego',
        icon: '🌟',
        condition: (stats) => stats.bestScore >= 1000
    }
};

function checkAchievements(gameType, gameStats) {
    const unlockedAchievements = getLocalData('unlocked_achievements', []);
    const playerStats = getLocalData(`${gameType}_stats`, {
        gamesPlayed: 0,
        bestScore: 0,
        bestTime: Infinity,
        perfectGames: 0
    });
    
    // Actualizar estadísticas
    playerStats.gamesPlayed++;
    playerStats.bestScore = Math.max(playerStats.bestScore, gameStats.score || 0);
    playerStats.bestTime = Math.min(playerStats.bestTime, gameStats.time || Infinity);
    if (gameStats.perfect) playerStats.perfectGames++;
    
    saveLocalData(`${gameType}_stats`, playerStats);
    
    // Verificar logros
    const newAchievements = [];
    Object.values(ACHIEVEMENTS).forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id) && 
            achievement.condition(playerStats)) {
            unlockedAchievements.push(achievement.id);
            newAchievements.push(achievement);
        }
    });
    
    if (newAchievements.length > 0) {
        saveLocalData('unlocked_achievements', unlockedAchievements);
        newAchievements.forEach(achievement => {
            showAchievementNotification(achievement);
        });
    }
    
    return newAchievements;
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">¡LOGRO DESBLOQUEADO!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 4000);
    
    playSound('success');
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => document.body.removeChild(notification), 500);
    }, duration);
    
    // Reproducir sonido apropiado
    const soundMap = {
        'success': 'success',
        'error': 'error',
        'info': 'click'
    };
    playSound(soundMap[type] || 'click');
}

// ========================================
// UTILIDADES DE TIEMPO
// ========================================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatScore(score) {
    return score.toLocaleString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
    });
}

// ========================================
// UTILIDADES DE UI
// ========================================

function createButton(text, onClick, className = 'btn btn-primary') {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
            <div class="modal-buttons">
                ${buttons.map(btn => `<button class="btn ${btn.class || 'btn-secondary'}" onclick="${btn.onClick}">${btn.text}</button>`).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    
    return modal;
}

function closeModal(element) {
    const modal = element.closest('.modal-overlay');
    modal.classList.add('hide');
    setTimeout(() => document.body.removeChild(modal), 300);
}

// ========================================
// UTILIDADES DE ANIMACIÓN
// ========================================

function animateElement(element, animationClass, duration = 500) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

function shakeElement(element) {
    animateElement(element, 'shake', 500);
}

function pulseElement(element) {
    animateElement(element, 'pulse', 1000);
}

function glowElement(element) {
    animateElement(element, 'glow', 2000);
}

// ========================================
// UTILIDADES DE AJEDREZ
// ========================================

function positionToCoords(position) {
    const row = Math.floor(position / 8);
    const col = position % 8;
    return { row, col };
}

function coordsToPosition(row, col) {
    return row * 8 + col;
}

function positionToAlgebraic(position) {
    const { row, col } = positionToCoords(position);
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // 1-8
    return file + rank;
}

function algebraicToPosition(algebraic) {
    const file = algebraic.charCodeAt(0) - 97; // a=0, b=1, etc.
    const rank = parseInt(algebraic[1]) - 1; // 1=0, 2=1, etc.
    const row = 8 - rank - 1;
    return coordsToPosition(row, file);
}

function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getRandomPosition() {
    return Math.floor(Math.random() * 64);
}

// ========================================
// SISTEMA DE CONFIGURACIÓN
// ========================================

function saveSettings(settings) {
    const currentSettings = getLocalData('settings', {});
    const newSettings = { ...currentSettings, ...settings };
    saveLocalData('settings', newSettings);
    applySettings(newSettings);
}

function getSettings() {
    return getLocalData('settings', {
        soundEnabled: true,
        theme: 'arcade',
        difficulty: 'medium',
        language: 'es'
    });
}

function applySettings(settings) {
    CHESSARCADE.soundEnabled = settings.soundEnabled;
    CHESSARCADE.theme = settings.theme;
    CHESSARCADE.language = settings.language;
    
    // Aplicar tema CSS
    document.body.className = `theme-${settings.theme}`;
    
    // Actualizar botones de sonido
    const soundButtons = document.querySelectorAll('.btn-sound');
    soundButtons.forEach(btn => {
        btn.textContent = settings.soundEnabled ? '🔊' : '🔇';
    });
}

// ========================================
// INICIALIZACIÓN
// ========================================

function initializeSharedUtils() {
    console.log('ChessArcade Shared Utils v' + CHESSARCADE.version);
    
    // Cargar configuración guardada
    const settings = getSettings();
    applySettings(settings);
    
    // Inicializar sonidos
    initializeSounds();
    
    // Agregar event listeners globales
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => {
                if (!modal.classList.contains('hide')) {
                    closeModal(modal.querySelector('.modal-close'));
                }
            });
        }
    });
    
    // Verificar modo online (opcional)
    checkOnlineStatus();
}

async function checkOnlineStatus() {
    try {
        const response = await fetch(CHESSARCADE.apiBase + '/api/health', {
            method: 'GET',
            timeout: 3000
        });
        CHESSARCADE.isOnline = response.ok;
    } catch (error) {
        CHESSARCADE.isOnline = false;
    }
    
    // Actualizar indicador de modo
    const modeIndicator = document.getElementById('mode-indicator');
    if (modeIndicator) {
        modeIndicator.textContent = CHESSARCADE.isOnline ? '🌐 ONLINE' : '💾 LOCAL';
        modeIndicator.className = CHESSARCADE.isOnline ? 'online-mode' : 'local-mode';
    }
}

// ========================================
// NAVEGACIÓN
// ========================================

function goHome() {
    // Calcular ruta relativa al index principal
    const currentPath = window.location.pathname;
    const depth = (currentPath.match(/\//g) || []).length - 1;
    const homePath = '../'.repeat(Math.max(0, depth - 1)) + 'index.html';
    window.location.href = homePath;
}

function goToGame(gameName) {
    window.location.href = `games/${gameName}/index.html`;
}

// ========================================
// EXPORTAR FUNCIONES PARA USO GLOBAL
// ========================================

// Hacer funciones disponibles globalmente
window.ChessArcade = {
    ...CHESSARCADE,
    playSound,
    toggleGameSound,
    saveLocalScore,
    getLocalLeaderboard,
    checkAchievements,
    showNotification,
    formatTime,
    formatScore,
    formatDate,
    createButton,
    createModal,
    closeModal,
    animateElement,
    shakeElement,
    pulseElement,
    glowElement,
    positionToCoords,
    coordsToPosition,
    positionToAlgebraic,
    algebraicToPosition,
    isValidPosition,
    getRandomPosition,
    saveSettings,
    getSettings,
    goHome,
    goToGame
};

// Auto-inicializar cuando el script se carga
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSharedUtils);
    } else {
        initializeSharedUtils();
    }
}
