/**
 * ThemeSelector - Componente UI para seleccionar el tema de piezas
 *
 * Permite al usuario cambiar entre diferentes sets de piezas
 */

class ThemeSelector {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.config = {
            position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline'
            showLabels: true,
            showDescriptions: false,
            autoClose: true,
            ...config
        };
        this.isOpen = false;
    }

    /**
     * Renderiza el selector de temas
     */
    render() {
        if (!this.container) {
            console.error('❌ ThemeSelector: Contenedor no encontrado:', this.containerId);
            return;
        }

        // Crear estructura del selector
        const selectorHTML = this.createSelectorHTML();
        this.container.innerHTML = selectorHTML;

        // Agregar event listeners
        this.attachEventListeners();

        console.log('✅ ThemeSelector: Renderizado');
    }

    /**
     * Crea el HTML del selector
     */
    createSelectorHTML() {
        const themes = PieceThemes.getAvailableThemes();
        const currentTheme = PieceThemes.getCurrentTheme();

        return `
            <div class="theme-selector" data-position="${this.config.position}">
                <!-- Botón para abrir el selector -->
                <button class="theme-selector-button" id="theme-selector-toggle" title="Cambiar estilo de piezas">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                    ${this.config.showLabels ? '<span class="theme-selector-label">Piezas</span>' : ''}
                </button>

                <!-- Dropdown con los temas -->
                <div class="theme-selector-dropdown" id="theme-selector-dropdown" style="display: none;">
                    <div class="theme-selector-header">
                        <h3>Estilo de Piezas</h3>
                        <button class="theme-selector-close" id="theme-selector-close">&times;</button>
                    </div>
                    <div class="theme-selector-options">
                        ${themes.map(theme => `
                            <div class="theme-option ${theme.isCurrent ? 'active' : ''}"
                                 data-theme="${theme.id}">
                                <div class="theme-option-icon">
                                    ${this.getThemeIcon(theme.id)}
                                </div>
                                <div class="theme-option-info">
                                    <div class="theme-option-name">${theme.name}</div>
                                    ${this.config.showDescriptions ?
                                        `<div class="theme-option-description">${theme.description}</div>` : ''}
                                    ${theme.type === 'cdn' ?
                                        '<span class="theme-option-badge">CDN</span>' : ''}
                                </div>
                                ${theme.isCurrent ? '<span class="theme-option-check">✓</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtiene el icono/preview de un tema
     */
    getThemeIcon(themeId) {
        // Mostrar preview de una pieza del tema (Rey blanco)
        const theme = PieceThemes.themes[themeId];
        if (theme && theme.pieceTheme) {
            return theme.pieceTheme('wK');
        }
        return '♔';
    }

    /**
     * Agrega event listeners
     */
    attachEventListeners() {
        const toggleButton = document.getElementById('theme-selector-toggle');
        const closeButton = document.getElementById('theme-selector-close');
        const dropdown = document.getElementById('theme-selector-dropdown');
        const options = document.querySelectorAll('.theme-option');

        // Toggle dropdown
        if (toggleButton) {
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }

        // Close button
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        // Click en opciones
        options.forEach(option => {
            option.addEventListener('click', () => {
                const themeId = option.dataset.theme;
                this.selectTheme(themeId);
            });
        });

        // Cerrar al hacer click fuera
        if (this.config.autoClose) {
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.container.contains(e.target)) {
                    this.close();
                }
            });
        }
    }

    /**
     * Toggle del dropdown
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Abre el dropdown
     */
    open() {
        const dropdown = document.getElementById('theme-selector-dropdown');
        if (dropdown) {
            dropdown.style.display = 'block';
            this.isOpen = true;
            console.log('🎨 ThemeSelector: Abierto');
        }
    }

    /**
     * Cierra el dropdown
     */
    close() {
        const dropdown = document.getElementById('theme-selector-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
            this.isOpen = false;
            console.log('🎨 ThemeSelector: Cerrado');
        }
    }

    /**
     * Selecciona un tema
     */
    selectTheme(themeId) {
        const success = PieceThemes.setTheme(themeId);

        if (success) {
            console.log('✅ Tema seleccionado:', themeId);

            // Actualizar UI
            this.updateActiveOption(themeId);

            // Cerrar dropdown
            if (this.config.autoClose) {
                this.close();
            }

            // Recargar página para aplicar cambios (temporal)
            // TODO: Implementar recarga dinámica de piezas
            if (confirm('¿Recargar la página para aplicar el nuevo tema de piezas?')) {
                window.location.reload();
            }
        }
    }

    /**
     * Actualiza la opción activa en el UI
     */
    updateActiveOption(themeId) {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            if (option.dataset.theme === themeId) {
                option.classList.add('active');
                option.innerHTML += '<span class="theme-option-check">✓</span>';
            } else {
                option.classList.remove('active');
                const check = option.querySelector('.theme-option-check');
                if (check) check.remove();
            }
        });
    }

    /**
     * Destruye el selector
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
