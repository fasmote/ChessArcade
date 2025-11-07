/**
 * ========================================
 * CHESSINFIVE - LEADERBOARD INTEGRATION
 * ========================================
 *
 * Integración del sistema de leaderboard global en ChessInFive.
 *
 * Este módulo se encarga de:
 * 1. Cargar/guardar el nombre del jugador ganador desde localStorage
 * 2. Conectar los botones del Game Over modal con el leaderboard
 * 3. Enviar el score del ganador al leaderboard global
 * 4. Mostrar el leaderboard cuando se solicita
 *
 * NOTA: ChessInFive es un juego multiplayer local (2 jugadores)
 * Solo el jugador ganador puede enviar su score al leaderboard
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURACIÓN
    // ========================================

    const STORAGE_KEY = 'chessInFivePlayerName';
    const GAME_ID = 'chessinfive';

    // ========================================
    // CARGAR NOMBRE GUARDADO
    // ========================================

    function loadSavedName() {
        const savedName = localStorage.getItem(STORAGE_KEY);
        const playerInput = document.getElementById('gameOverPlayerNameInput');
        if (savedName && playerInput) {
            playerInput.value = savedName;
            console.log('📝 Loaded saved player name:', savedName);
        }
    }

    // Cargar nombre al inicio
    window.addEventListener('DOMContentLoaded', () => {
        loadSavedName();
    });

    // También cargar cuando se muestra el Game Over modal
    const gameOverObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const gameOverModal = document.getElementById('gameOverModal');
                if (gameOverModal && gameOverModal.style.display !== 'none') {
                    loadSavedName();
                }
            }
        });
    });

    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverObserver.observe(gameOverModal, { attributes: true });
    }

    // ========================================
    // ENVIAR SCORE AL LEADERBOARD
    // ========================================

    async function submitGameOverScore() {
        const playerInput = document.getElementById('gameOverPlayerNameInput');
        const playerName = playerInput.value.trim() || 'WINNER';

        // Save name for future sessions
        localStorage.setItem(STORAGE_KEY, playerName);

        // Get winner information from DOM
        const winnerTitleElement = document.getElementById('winnerTitle');
        const winnerTitle = winnerTitleElement.textContent;

        // Determine which player won (CYAN or MAGENTA)
        const winnerPlayer = winnerTitle.includes('CYAN') ? 'CYAN' : 'MAGENTA';

        // Get game state from global GameState if available
        const moveCount = window.GameState?.moveHistory?.length || 0;
        const currentPhase = window.GameState?.phase || 'unknown';

        // Calculate score based on moves (fewer moves = better score)
        // Formula: 10000 - (moveCount * 50)
        const finalScore = Math.max(1000, 10000 - (moveCount * 50));

        console.log('📊 Submitting score:', {
            playerName,
            finalScore,
            winnerPlayer,
            moveCount,
            currentPhase
        });

        try {
            const submitBtn = document.getElementById('gameOverSubmitScoreBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'SUBMITTING...';

            // Submit to leaderboard API
            const result = await submitScore(
                GAME_ID,
                playerName,
                finalScore,
                {
                    winner_player: winnerPlayer,
                    move_count: moveCount,
                    final_phase: currentPhase
                }
            );

            showToast(`Score submitted! Rank #${result.rank} of ${result.totalPlayers}`, 'success');

            submitBtn.disabled = false;
            submitBtn.textContent = '✅ SUBMITTED!';

            setTimeout(() => {
                submitBtn.textContent = '🏆 SUBMIT SCORE';
            }, 2000);

        } catch (error) {
            console.error('Error submitting score:', error);
            showToast(`Error: ${error.message}`, 'error');

            const submitBtn = document.getElementById('gameOverSubmitScoreBtn');
            submitBtn.disabled = false;
            submitBtn.textContent = '🏆 SUBMIT SCORE';
        }
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    // Botón "Submit Score" en Game Over modal
    const gameOverSubmitBtn = document.getElementById('gameOverSubmitScoreBtn');
    if (gameOverSubmitBtn) {
        gameOverSubmitBtn.addEventListener('click', submitGameOverScore);
        console.log('✅ Game Over Submit Score button connected');
    } else {
        console.warn('⚠️ Game Over Submit Score button not found');
    }

    // Botón "View Leaderboard" en Game Over modal
    const gameOverViewLeaderboardBtn = document.getElementById('gameOverViewLeaderboardBtn');
    if (gameOverViewLeaderboardBtn) {
        gameOverViewLeaderboardBtn.addEventListener('click', () => {
            showLeaderboardModal(GAME_ID);
        });
        console.log('✅ Game Over View Leaderboard button connected');
    } else {
        console.warn('⚠️ Game Over View Leaderboard button not found');
    }

    // Botón "Leaderboard" en header
    const btnLeaderboard = document.getElementById('btnLeaderboard');
    if (btnLeaderboard) {
        btnLeaderboard.addEventListener('click', () => {
            showLeaderboardModal(GAME_ID);
        });
        console.log('✅ Header Leaderboard button connected');
    } else {
        console.warn('⚠️ Header Leaderboard button not found');
    }

    console.log('✅ ChessInFive Leaderboard Integration loaded');

})();
