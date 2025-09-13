// ========================================
// CHESSARCADE HUB - LÓGICA PRINCIPAL
// Maneja el hub principal y estadísticas globales
// Versión: 1.0.0
// ========================================

// ========================================
// CONFIGURACIÓN DEL HUB
// ========================================
const HUB_CONFIG = {
    version: '1.0.0',
    games: ['knight-quest', 'vision-blitz', 'square-rush', 'tactic-burst', 'checkmate-countdown', 'memory-matrix'],
    availableGames: ['knight-quest'], // Solo juegos implementados
    updateInterval: 5000 // 5 segundos para actualizar stats
};

// ========================================
// ESTADO DEL HUB
// ========================================
let hubState = {
    userStats: {
        totalGames: 0,
        bestScore: 0,
        totalTime: 0,
        totalAchievements: 0
    },
    gameStats: {},
    settings: {
        soundEnabled: true,
        theme: 'arcade',
        language: 'es'
    }
};

// ========================================
// INICIALIZACIÓN DEL HUB
// ========================================
function initHub() {
    console.log(`Inicializando ChessArcade Hub v${HUB_CONFIG.version}`);
    
    // Cargar configuración
    loadHubSettings();
    
    // Cargar estadísticas
    loadUserStats();
    
    // Actualizar UI
    updateUserStatsDisplay();
    updateGameCards();
    
    // Configurar efectos visuales
    setupVisualEffects();
    
    // Bind eventos
    bindHubEvents();
    
    console.log('Hub inicializado correctamente');
}

// ========================================
// GESTIÓN DE ESTADÍSTICAS
// ========================================
function loadUserStats() {
    // Cargar estadísticas globales del usuario
    const totalStats = {
        totalGames: 0,
        bestScore: 0,
        totalTime: 0,
        totalAchievements: 0
    };
    
    // Agregar estadísticas de cada juego
    HUB_CONFIG.games.forEach(gameName => {
        const gameScores = ChessArcade.getLocalLeaderboard(gameName, 100);
        const gameStats = getLocalData(`${gameName}_stats`, {
            gamesPlayed: 0,
            bestScore: 0,
            bestTime: Infinity,
            perfectGames: 0
        });
        
        totalStats.totalGames += gameStats.gamesPlayed;
        totalStats.bestScore = Math.max(totalStats.bestScore, gameStats.bestScore);
        
        // Sumar tiempo total de todas las partidas
        gameScores.forEach(score => {
            totalStats.totalTime += score.time || 0;
        });
        
        // Guardar stats específicos del juego
        hubState.gameStats[gameName] = {
            ...gameStats,
            recentScores: gameScores.slice(0, 5)
        };
    });
    
    // Contar logros totales
    const unlockedAchievements = getLocalData('unlocked_achievements', []);
    totalStats.totalAchievements = unlockedAchievements.length;
    
    hubState.userStats = totalStats;
}

function updateUserStatsDisplay() {
    document.getElementById('totalGames').textContent = hubState.userStats.totalGames;
    document.getElementById('bestScore').textContent = ChessArcade.formatScore(hubState.userStats.bestScore);
    document.getElementById('totalTime').textContent = ChessArcade.formatTime(hubState.userStats.totalTime);
    document.getElementById('totalAchievements').textContent = hubState.userStats.totalAchievements;
}

function updateGameCards() {
    // Actualizar Knight Quest card
    const knightStats = hubState.gameStats['knight-quest'];
    if (knightStats) {
        document.getElementById('knightBestScore').textContent = ChessArcade.formatScore(knightStats.bestScore);
        document.getElementById('knightBestTime').textContent = 
            knightStats.bestTime !== Infinity ? ChessArcade.formatTime(knightStats.bestTime) : '--:--';
    }
    
    // Agregar indicadores de progreso a juegos disponibles
    HUB_CONFIG.availableGames.forEach(gameName => {
        const card = document.getElementById(`${gameName.replace('-', '')}Card`);
        if (card) {
            card.classList.add('available');
            card.classList.remove('coming-soon');
            
            // Agregar badge de "nuevo" si nunca jugó
            const stats = hubState.gameStats[gameName];
            if (stats && stats.gamesPlayed === 0) {
                const newBadge = document.createElement('div');
                newBadge.className = 'new-badge';
                newBadge.textContent = '¡NUEVO!';
                card.appendChild(newBadge);
            }
        }
    });
}

// ========================================
// EFECTOS VISUALES
// ========================================
function setupVisualEffects() {
    // Animar piezas de ajedrez en el header
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach((piece, index) => {
        piece.addEventListener('click', () => {
            piece.style.animation = 'none';
            piece.style.transform = `scale(1.5) rotateZ(${360 + Math.random() * 360}deg)`;
            
            setTimeout(() => {
                piece.style.animation = '';
                piece.style.transform = '';
            }, 600);
            
            ChessArcade.playSound('click');
        });
        
        // Hover effects
        piece.addEventListener('mouseenter', () => {
            if (!piece.style.animation.includes('none')) {
                piece.style.animationDelay = '0s';
            }
        });
    });
    
    // Efectos de las cards de juegos
    const gameCards = document.querySelectorAll('.game-card.available');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            ChessArcade.playSound('click');
        });
    });
    
    // Efectos de las cards "coming soon"
    const comingSoonCards = document.querySelectorAll('.game-card.coming-soon');
    comingSoonCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            ChessArcade.shakeElement(card);
            ChessArcade.showNotification('🔄 ¡Este juego estará disponible pronto!', 'info', 2000);
            ChessArcade.playSound('error');
        });
    });
}

// ========================================
// CONFIGURACIÓN Y SETTINGS
// ========================================
function loadHubSettings() {
    const savedSettings = ChessArcade.getSettings();
    hubState.settings = { ...hubState.settings, ...savedSettings };
    
    // Aplicar configuración
    applyHubSettings();
}

function applyHubSettings() {
    // Aplicar tema
    document.body.className = `theme-${hubState.settings.theme}`;
    
    // Actualizar UI de configuración
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.checked = hubState.settings.soundEnabled;
    }
    
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = hubState.settings.theme;
    }
}

function showSettings() {
    const modal = document.getElementById('settingsModal');
    
    // Actualizar valores en el modal
    document.getElementById('soundToggle').checked = ChessArcade.soundEnabled;
    document.getElementById('themeSelect').value = hubState.settings.theme;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 100);
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

function toggleGlobalSound() {
    const soundToggle = document.getElementById('soundToggle');
    ChessArcade.soundEnabled = soundToggle.checked;
    
    hubState.settings.soundEnabled = soundToggle.checked;
    ChessArcade.saveSettings(hubState.settings);
    
    ChessArcade.showNotification(
        soundToggle.checked ? '🔊 Sonido activado' : '🔇 Sonido desactivado',
        'info'
    );
    
    if (soundToggle.checked) {
        ChessArcade.playSound('success');
    }
}

function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const newTheme = themeSelect.value;
    
    hubState.settings.theme = newTheme;
    ChessArcade.saveSettings(hubState.settings);
    
    // Aplicar nuevo tema
    document.body.className = `theme-${newTheme}`;
    
    const themeNames = {
        arcade: '🕹️ Arcade Clásico',
        retro: '📟 Retro 80s',
        neon: '💫 Neon Cyber'
    };
    
    ChessArcade.showNotification(`🎨 Tema cambiado a ${themeNames[newTheme]}`, 'success');
    ChessArcade.playSound('success');
}

function resetAllData() {
    if (confirm('⚠️ ¿Estás seguro de que quieres borrar TODOS los datos?\n\nEsto eliminará:\n• Todas las puntuaciones\n• Todos los logros\n• Todo el progreso\n• Configuración\n\nEsta acción NO se puede deshacer.')) {
        if (confirm('🚨 ÚLTIMA CONFIRMACIÓN\n\n¿Realmente quieres eliminar TODO tu progreso en ChessArcade?')) {
            // Limpiar localStorage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('chessarcade_') || key.startsWith('knight_') || key.includes('_scores') || key.includes('_stats'))) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // Reset estado del hub
            hubState.userStats = {
                totalGames: 0,
                bestScore: 0,
                totalTime: 0,
                totalAchievements: 0
            };
            hubState.gameStats = {};
            
            // Actualizar UI
            updateUserStatsDisplay();
            updateGameCards();
            
            ChessArcade.showNotification('🗑️ Todos los datos han sido eliminados', 'warning', 3000);
            ChessArcade.playSound('error');
            
            // Cerrar modal
            closeSettings();
        }
    }
}

// ========================================
// LEADERBOARDS GLOBALES
// ========================================
function showGlobalLeaderboard() {
    const modal = document.getElementById('globalLeaderboardModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Mostrar por defecto Knight Quest
    showGlobalTab('knight-quest');
}

function closeGlobalLeaderboard() {
    const modal = document.getElementById('globalLeaderboardModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

function showGlobalTab(tab) {
    // Actualizar tabs activos
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('globalLeaderboardContent');
    
    if (tab === 'knight-quest') {
        showKnightQuestLeaderboard(content);
    } else if (tab === 'all') {
        showAllGamesLeaderboard(content);
    } else if (tab === 'achievements') {
        showAchievementsLeaderboard(content);
    }
}

function showKnightQuestLeaderboard(container) {
    const scores = ChessArcade.getLocalLeaderboard('knight-quest', 20);
    
    if (scores.length === 0) {
        container.innerHTML = `
            <div class="empty-leaderboard">
                <div class="empty-icon">🐴</div>
                <p>¡Aún no hay puntuaciones en Knight Quest!</p>
                <p><a href="games/knight-quest/index.html" class="btn btn-primary">¡Jugar ahora!</a></p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="leaderboard-list">
            ${scores.map((score, index) => `
                <div class="leaderboard-item">
                    <div class="rank ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''}">#${index + 1}</div>
                    <div class="player-info">
                        <div class="player-name">Knight Master ${score.id.toString().slice(-4)}</div>
                        <div class="player-details">
                            ${score.difficulty} • ${score.moves || 0} movimientos
                            ${score.perfect ? ' • ⭐ Perfecto' : ''}
                            ${score.hintsUsed !== undefined ? ` • ${score.hintsUsed} pistas` : ''}
                        </div>
                    </div>
                    <div class="score-info">
                        <div class="score">${ChessArcade.formatScore(score.score)}</div>
                        <div class="time">${ChessArcade.formatTime(score.time)}</div>
                        <div class="date">${ChessArcade.formatDate(score.date)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showAllGamesLeaderboard(container) {
    const allScores = [];
    
    HUB_CONFIG.games.forEach(gameName => {
        const gameScores = ChessArcade.getLocalLeaderboard(gameName, 10);
        gameScores.forEach(score => {
            allScores.push({
                ...score,
                game: gameName,
                gameName: getGameDisplayName(gameName)
            });
        });
    });
    
    // Ordenar por puntuación
    allScores.sort((a, b) => b.score - a.score);
    allScores.splice(20); // Top 20
    
    if (allScores.length === 0) {
        container.innerHTML = `
            <div class="empty-leaderboard">
                <div class="empty-icon">🎮</div>
                <p>¡Aún no hay puntuaciones en ningún juego!</p>
                <p>¡Empieza a jugar para aparecer aquí!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="leaderboard-list">
            ${allScores.map((score, index) => `
                <div class="leaderboard-item">
                    <div class="rank ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''}">#${index + 1}</div>
                    <div class="player-info">
                        <div class="player-name">${score.gameName} Master</div>
                        <div class="player-details">
                            ${score.gameName} • ${ChessArcade.formatDate(score.date)}
                        </div>
                    </div>
                    <div class="score-info">
                        <div class="score">${ChessArcade.formatScore(score.score)}</div>
                        <div class="time">${ChessArcade.formatTime(score.time)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showAchievementsLeaderboard(container) {
    const unlockedAchievements = getLocalData('unlocked_achievements', []);
    
    if (unlockedAchievements.length === 0) {
        container.innerHTML = `
            <div class="empty-leaderboard">
                <div class="empty-icon">🏆</div>
                <p>¡Aún no has desbloqueado ningún logro!</p>
                <p>Juega para conseguir achievements épicos.</p>
            </div>
        `;
        return;
    }
    
    // Obtener información de todos los achievements disponibles
    const ACHIEVEMENTS = {
        'first_game': { name: 'Primer Paso', description: 'Completa tu primer juego', icon: '🎮' },
        'speed_demon': { name: 'Demonio de Velocidad', description: 'Completa un juego en menos de 30 segundos', icon: '⚡' },
        'perfectionist': { name: 'Perfeccionista', description: 'Completa un juego sin errores', icon: '💎' },
        'persistent': { name: 'Perseverante', description: 'Juega 10 partidas', icon: '🔥' },
        'high_scorer': { name: 'Puntuador Elite', description: 'Alcanza 1000 puntos', icon: '🌟' }
    };
    
    container.innerHTML = `
        <div class="achievements-grid">
            ${unlockedAchievements.map(achievementId => {
                const achievement = ACHIEVEMENTS[achievementId];
                if (!achievement) return '';
                
                return `
                    <div class="achievement-card unlocked">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-desc">${achievement.description}</div>
                        </div>
                        <div class="achievement-status">✅ Desbloqueado</div>
                    </div>
                `;
            }).join('')}
            
            ${Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
                if (unlockedAchievements.includes(id)) return '';
                
                return `
                    <div class="achievement-card locked">
                        <div class="achievement-icon">🔒</div>
                        <div class="achievement-info">
                            <div class="achievement-name">???</div>
                            <div class="achievement-desc">Sigue jugando para desbloquear</div>
                        </div>
                        <div class="achievement-status">🔒 Bloqueado</div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="achievements-summary">
            <p><strong>${unlockedAchievements.length}</strong> de <strong>${Object.keys(ACHIEVEMENTS).length}</strong> logros desbloqueados</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100}%"></div>
            </div>
        </div>
    `;
}

// ========================================
// UTILIDADES
// ========================================
function getGameDisplayName(gameName) {
    const names = {
        'knight-quest': 'Knight Quest',
        'vision-blitz': 'Vision Blitz',
        'square-rush': 'Square Rush',
        'tactic-burst': 'Tactic Burst',
        'checkmate-countdown': 'Checkmate Countdown',
        'memory-matrix': 'Memory Matrix'
    };
    return names[gameName] || gameName;
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

function refreshStats() {
    loadUserStats();
    updateUserStatsDisplay();
    updateGameCards();
}

// ========================================
// EVENT LISTENERS
// ========================================
function bindHubEvents() {
    // Actualizar estadísticas periódicamente
    setInterval(refreshStats, HUB_CONFIG.updateInterval);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'k':
                    e.preventDefault();
                    window.location.href = 'games/knight-quest/index.html';
                    break;
                case 'l':
                    e.preventDefault();
                    showGlobalLeaderboard();
                    break;
                case ',':
                    e.preventDefault();
                    showSettings();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            // Cerrar modales abiertos
            const modals = document.querySelectorAll('.modal-overlay.show');
            modals.forEach(modal => {
                if (modal.id === 'globalLeaderboardModal') closeGlobalLeaderboard();
                if (modal.id === 'settingsModal') closeSettings();
            });
        }
    });
    
    // Enlaces a juegos
    document.querySelectorAll('a[href*="games/"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.includes('knight-quest')) {
                ChessArcade.playSound('success');
            }
        });
    });
    
    // Efectos de click en botones
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            ChessArcade.playSound('click');
        });
    });
}

// ========================================
// FUNCIONES GLOBALES PARA HTML
// ========================================
window.showGlobalLeaderboard = showGlobalLeaderboard;
window.closeGlobalLeaderboard = closeGlobalLeaderboard;
window.showGlobalTab = showGlobalTab;
window.showSettings = showSettings;
window.closeSettings = closeSettings;
window.toggleGlobalSound = toggleGlobalSound;
window.changeTheme = changeTheme;
window.resetAllData = resetAllData;

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, inicializando Hub...');
    
    // Esperar a que shared-utils esté cargado
    if (typeof ChessArcade !== 'undefined') {
        initHub();
    } else {
        setTimeout(() => {
            if (typeof ChessArcade !== 'undefined') {
                initHub();
            } else {
                console.error('ChessArcade utilities no cargadas');
            }
        }, 500);
    }
});

// Auto-refresh stats cuando la página vuelve a tener foco
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        refreshStats();
    }
});

console.log('ChessArcade Hub Main v' + HUB_CONFIG.version + ' cargado');