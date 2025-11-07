/**
 * ========================================
 * MEMORY MATRIX - LEADERBOARD INTEGRATION
 * ========================================
 *
 * Integración del sistema de leaderboard global en Memory Matrix.
 *
 * Este módulo se encarga de:
 * 1. Cargar/guardar el nombre del jugador desde localStorage
 * 2. Detectar cuándo se completa el juego (todos los niveles)
 * 3. Mostrar modal de victoria con input de nombre
 * 4. Enviar el score al leaderboard global
 * 5. Mostrar el leaderboard cuando se solicita
 */

(function() {
    'use strict';

    // ========================================
    // VARIABLES GLOBALES
    // ========================================

    let victoryModalShown = false;
    const STORAGE_KEY = 'memoryMatrixPlayerName';

    // ========================================
    // CREAR MODAL DE VICTORIA
    // ========================================

    function createVictoryModal() {
        // Check if modal already exists
        if (document.getElementById('leaderboardVictoryModal')) {
            return;
        }

        const modalHTML = `
            <div id="leaderboardVictoryModal" class="victory-modal" style="display: none;">
                <div class="victory-modal-content" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(145deg, rgba(0,0,0,0.95), rgba(26,0,51,0.9));
                    padding: 3rem;
                    border-radius: 20px;
                    text-align: center;
                    z-index: 10000;
                    backdrop-filter: blur(20px);
                    border: 4px solid var(--neon-yellow, #ffd700);
                    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow-y: auto;
                ">
                    <button class="modal-close" onclick="closeLeaderboardVictoryModal()" style="
                        position: absolute;
                        top: 15px;
                        right: 20px;
                        background: none;
                        border: none;
                        color: white;
                        font-size: 2rem;
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    ">&times;</button>

                    <div style="font-size: 2.5rem; margin-bottom: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: var(--neon-yellow, #ffd700); animation: victoryGlow 1s ease-in-out infinite alternate;">
                        🏆 ALL LEVELS COMPLETED! 🏆
                    </div>

                    <div id="victoryStats" style="font-size: 1.2rem; color: #e0e0e0; line-height: 1.8; margin-bottom: 2rem; background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);"></div>

                    <div style="margin: 20px 0;">
                        <label for="victoryPlayerNameInput" style="display: block; margin-bottom: 8px; color: var(--neon-cyan, #00ffff); font-weight: bold;">Enter Your Name:</label>
                        <input type="text" id="victoryPlayerNameInput" maxlength="20" placeholder="Your Name"
                               style="width: 100%; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 2px solid var(--neon-cyan, #00ffff); border-radius: 8px; color: white; font-family: 'Orbitron', monospace; font-size: 16px; text-align: center;">
                    </div>

                    <button id="victorySubmitScoreBtn" class="btn btn-primary" style="margin-bottom: 10px; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 700; border: none; border-radius: 25px; cursor: pointer; font-family: 'Orbitron', monospace; text-transform: uppercase; letter-spacing: 0.1em; background: linear-gradient(to bottom, #ff8a80 0%, #ff6b6b 30%, #ff5252 70%, #d32f2f 100%); color: white;">🏆 SUBMIT SCORE</button>

                    <button id="victoryViewLeaderboardBtn" class="btn btn-secondary" style="margin-bottom: 10px; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 700; border-radius: 25px; cursor: pointer; font-family: 'Orbitron', monospace; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(0, 255, 255, 0.1); border: 2px solid var(--neon-cyan, #00ffff); color: var(--neon-cyan, #00ffff);">👁️ VIEW LEADERBOARD</button>

                    <button onclick="closeLeaderboardVictoryModal()" class="btn btn-primary" style="margin-top: 1rem; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 700; border: none; border-radius: 25px; cursor: pointer; font-family: 'Orbitron', monospace; text-transform: uppercase; letter-spacing: 0.1em; background: linear-gradient(to bottom, #ff8a80 0%, #ff6b6b 30%, #ff5252 70%, #d32f2f 100%); color: white;">🎮 CONTINUE</button>
                </div>

                <div class="victory-modal-backdrop" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 9999;
                " onclick="closeLeaderboardVictoryModal()"></div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listeners
        document.getElementById('victorySubmitScoreBtn').addEventListener('click', submitVictoryScore);
        document.getElementById('victoryViewLeaderboardBtn').addEventListener('click', () => {
            showLeaderboardModal('memory-matrix');
        });
    }

    // ========================================
    // MOSTRAR MODAL DE VICTORIA
    // ========================================

    function showVictoryModal(stats) {
        console.log('🏆 Showing victory modal with stats:', stats);

        createVictoryModal();

        const modal = document.getElementById('leaderboardVictoryModal');
        const statsDiv = document.getElementById('victoryStats');
        const playerInput = document.getElementById('victoryPlayerNameInput');

        // Load saved name
        const savedName = localStorage.getItem(STORAGE_KEY);
        if (savedName && playerInput) {
            playerInput.value = savedName;
        }

        // Display stats
        if (statsDiv && stats) {
            statsDiv.innerHTML = `
                <p><span style="color: #e0e0e0;">🎯 Total Levels:</span> <span style="color: var(--neon-cyan, #00ffff); font-weight: 900;">${stats.totalLevels || 8}</span></p>
                <p><span style="color: #e0e0e0;">✅ Successful Attempts:</span> <span style="color: var(--neon-cyan, #00ffff); font-weight: 900;">${stats.successfulAttempts || 0}</span></p>
                <p><span style="color: #e0e0e0;">❌ Failed Attempts:</span> <span style="color: var(--neon-cyan, #00ffff); font-weight: 900;">${stats.failedAttempts || 0}</span></p>
                <p><span style="color: #e0e0e0;">💡 Hints Used:</span> <span style="color: var(--neon-cyan, #00ffff); font-weight: 900;">${stats.hintsUsed || 0}</span></p>
                <p style="color: var(--neon-green, #00ff80); margin-top: 1rem; font-size: 1.3rem; text-align: center;">
                    <strong>🧠 You are a Memory Master! ✨</strong>
                </p>
            `;
        }

        modal.style.display = 'block';
        victoryModalShown = true;
    }

    // ========================================
    // CERRAR MODAL DE VICTORIA
    // ========================================

    window.closeLeaderboardVictoryModal = function() {
        const modal = document.getElementById('leaderboardVictoryModal');
        if (modal) {
            modal.style.display = 'none';
        }
        victoryModalShown = false;
    };

    // ========================================
    // ENVIAR SCORE AL LEADERBOARD
    // ========================================

    async function submitVictoryScore() {
        const playerInput = document.getElementById('victoryPlayerNameInput');
        const playerName = playerInput.value.trim() || 'MEMORY';

        // Save name for future sessions
        localStorage.setItem(STORAGE_KEY, playerName);

        // Get game stats from global variables (defined in game.js)
        const totalSuccessful = window.successfulAttempts || 0;
        const totalFailed = window.failedAttempts || 0;
        const totalHintsUsed = (window.HINTS_PER_LEVEL * 8) - (window.hintsLeft || 0);

        // Calculate score: more successes and fewer failures = better score
        // Formula: (successful * 1000) - (failed * 100) - (hints * 50)
        const finalScore = Math.max(0, (totalSuccessful * 1000) - (totalFailed * 100) - (totalHintsUsed * 50));

        console.log('📊 Submitting score:', {
            playerName,
            finalScore,
            totalSuccessful,
            totalFailed,
            totalHintsUsed
        });

        try {
            const submitBtn = document.getElementById('victorySubmitScoreBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'SUBMITTING...';

            // Submit to leaderboard API
            const result = await submitScore(
                'memory-matrix',
                playerName,
                finalScore,
                {
                    successful_attempts: totalSuccessful,
                    failed_attempts: totalFailed,
                    hints_used: totalHintsUsed,
                    levels_completed: 8
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

            const submitBtn = document.getElementById('victorySubmitScoreBtn');
            submitBtn.disabled = false;
            submitBtn.textContent = '🏆 SUBMIT SCORE';
        }
    }

    // ========================================
    // BOTÓN DE LEADERBOARD EN HEADER
    // ========================================

    const btnLeaderboard = document.getElementById('btnLeaderboard');
    if (btnLeaderboard) {
        btnLeaderboard.addEventListener('click', () => {
            showLeaderboardModal('memory-matrix');
        });
        console.log('✅ Leaderboard button connected');
    } else {
        console.warn('⚠️ Leaderboard button not found');
    }

    // ========================================
    // DETECTAR VICTORIA (TODOS LOS NIVELES COMPLETADOS)
    // ========================================

    // Override the onLevelComplete function to detect when all levels are done
    // We need to hook into the game's completion logic

    // Store original updateStatus function
    const originalUpdateStatus = window.updateStatus;

    // Override to detect victory message
    window.updateStatus = function(message, type) {
        // Call original function
        if (originalUpdateStatus) {
            originalUpdateStatus(message, type);
        }

        // Check if this is the "all levels completed" message
        if (message.includes('FELICIDADES') && message.includes('Completaste todos los niveles')) {
            console.log('🎉 Detected all levels completed!');

            // Wait a bit for confetti and celebration, then show our modal
            setTimeout(() => {
                if (!victoryModalShown) {
                    const stats = {
                        totalLevels: window.MemoryMatrixLevels?.getTotalLevels() || 8,
                        successfulAttempts: window.successfulAttempts || 0,
                        failedAttempts: window.failedAttempts || 0,
                        hintsUsed: (window.HINTS_PER_LEVEL * 8) - (window.hintsLeft || 0)
                    };
                    showVictoryModal(stats);
                }
            }, 2000);
        }
    };

    console.log('✅ Memory Matrix Leaderboard Integration loaded');

})();
