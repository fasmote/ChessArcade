/**
 * ============================================
 * CHESSGAMELIBRARY - LEVEL TRANSITION
 * ============================================
 * Sistema reutilizable de transiciones entre niveles
 * Estilo neón futurista con efectos visuales
 *
 * USO:
 * ChessGameLibrary.LevelTransition.show({
 *     levelNumber: 2,
 *     levelName: 'Explorador',
 *     onComplete: () => console.log('Transición terminada')
 * });
 */

(function(global) {
    'use strict';

    const LevelTransition = {
        /**
         * Muestra transición de nivel
         * @param {Object} options - Configuración
         * @param {number} options.levelNumber - Número del nivel
         * @param {string} options.levelName - Nombre del nivel
         * @param {string} [options.icon='🎉'] - Icono a mostrar
         * @param {number} [options.duration=2500] - Duración en ms
         * @param {Function} [options.onComplete] - Callback al terminar
         * @param {Function} [options.onShow] - Callback al mostrar
         */
        show: function(options) {
            const config = {
                levelNumber: options.levelNumber || 1,
                levelName: options.levelName || 'Nivel',
                icon: options.icon || '🎉',
                duration: options.duration || 2500,
                onComplete: options.onComplete || null,
                onShow: options.onShow || null
            };

            // Buscar overlay existente o crear uno
            let overlay = document.getElementById('levelTransition');

            if (!overlay) {
                overlay = this._createOverlay();
            }

            // Actualizar contenido
            this._updateContent(overlay, config);

            // Mostrar overlay
            overlay.classList.remove('hidden');

            // Callback onShow
            if (config.onShow) {
                config.onShow();
            }

            console.log(`🎬 LevelTransition: Nivel ${config.levelNumber} - ${config.levelName}`);

            // Ocultar después del tiempo especificado
            setTimeout(() => {
                overlay.classList.add('hidden');

                // Callback onComplete
                if (config.onComplete) {
                    config.onComplete();
                }
            }, config.duration);
        },

        /**
         * Crea el HTML del overlay
         * @private
         */
        _createOverlay: function() {
            const overlay = document.createElement('div');
            overlay.id = 'levelTransition';
            overlay.className = 'level-transition-overlay hidden';
            overlay.innerHTML = `
                <div class="level-transition-content">
                    <div class="level-icon">🎉</div>
                    <h2 class="level-title">¡Nivel Completado!</h2>
                    <div class="level-number">NIVEL 1</div>
                    <p class="level-name">Nivel</p>
                    <div class="level-progress-bar">
                        <div class="level-progress-fill"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            return overlay;
        },

        /**
         * Actualiza el contenido del overlay
         * @private
         */
        _updateContent: function(overlay, config) {
            const iconEl = overlay.querySelector('.level-icon');
            const numberEl = overlay.querySelector('.level-number');
            const nameEl = overlay.querySelector('.level-name');
            const progressFill = overlay.querySelector('.level-progress-fill');

            if (iconEl) iconEl.textContent = config.icon;
            if (numberEl) numberEl.textContent = `NIVEL ${config.levelNumber}`;
            if (nameEl) nameEl.textContent = config.levelName;

            // Reiniciar animación de progreso
            if (progressFill) {
                progressFill.style.animation = 'none';
                setTimeout(() => {
                    progressFill.style.animation = 'progressFill 2s ease-out forwards';
                }, 10);
            }
        },

        /**
         * Oculta la transición inmediatamente
         */
        hide: function() {
            const overlay = document.getElementById('levelTransition');
            if (overlay) {
                overlay.classList.add('hidden');
            }
        },

        /**
         * Inyecta los estilos CSS necesarios
         * Se debe llamar una sola vez al inicio
         */
        injectStyles: function() {
            if (document.getElementById('level-transition-styles')) {
                return; // Ya inyectado
            }

            const style = document.createElement('style');
            style.id = 'level-transition-styles';
            style.textContent = `
                /* Level Transition Overlay */
                .level-transition-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.5s ease-out;
                }

                .level-transition-overlay.hidden {
                    display: none;
                }

                .level-transition-content {
                    text-align: center;
                    animation: levelZoomIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .level-icon {
                    font-size: clamp(60px, 15vw, 120px);
                    margin-bottom: 20px;
                    animation: iconPulse 1.5s ease-in-out infinite;
                }

                .level-title {
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(24px, 6vw, 48px);
                    font-weight: 900;
                    color: #00ffff;
                    text-shadow:
                        0 0 20px #00ffff,
                        0 0 40px #00ffff,
                        0 0 60px rgba(0, 255, 255, 0.5);
                    margin-bottom: 30px;
                    animation: neonFlicker 2s ease-in-out infinite;
                }

                .level-number {
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(48px, 12vw, 96px);
                    font-weight: 900;
                    background: linear-gradient(135deg, #00ffff, #ff0080, #ff8000);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 20px 0;
                    animation: gradientShift 3s ease-in-out infinite;
                    background-size: 200% 200%;
                }

                .level-name {
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(18px, 4vw, 32px);
                    font-weight: 700;
                    color: #ffd700;
                    text-shadow:
                        0 0 15px #ffd700,
                        0 0 30px rgba(255, 215, 0, 0.5);
                    margin-bottom: 40px;
                }

                .level-progress-bar {
                    width: clamp(200px, 60vw, 400px);
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    margin: 0 auto;
                    overflow: hidden;
                    position: relative;
                }

                .level-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #00ffff, #ff0080);
                    width: 0%;
                    animation: progressFill 2s ease-out forwards;
                    box-shadow: 0 0 20px #00ffff;
                }

                /* Animaciones */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes levelZoomIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) rotate(-10deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }

                @keyframes iconPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }

                @keyframes neonFlicker {
                    0%, 100% {
                        text-shadow:
                            0 0 20px #00ffff,
                            0 0 40px #00ffff,
                            0 0 60px rgba(0, 255, 255, 0.5);
                    }
                    50% {
                        text-shadow:
                            0 0 30px #00ffff,
                            0 0 60px #00ffff,
                            0 0 90px rgba(0, 255, 255, 0.8);
                    }
                }

                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes progressFill {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Registrar en ChessGameLibrary
    if (!global.ChessGameLibrary) {
        global.ChessGameLibrary = {};
    }
    global.ChessGameLibrary.LevelTransition = LevelTransition;

    // Auto-inyectar estilos si el DOM está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            LevelTransition.injectStyles();
        });
    } else {
        LevelTransition.injectStyles();
    }

    console.log('📦 ChessGameLibrary.LevelTransition cargado');

})(window);
