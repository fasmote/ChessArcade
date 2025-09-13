/**
 * =================================================================
 * 🎮 NEONCHESS INTERACTIVE SYSTEM
 * Sistema de efectos interactivos para ChessArcade
 * Estilo: Synthwave/Retrowave/80s Arcade
 * =================================================================
 */

class NeonChessEffects {
    constructor() {
        this.isInitialized = false;
        this.particles = [];
        this.powerUps = [];
        this.coinCount = 1337;
        
        this.init();
    }
    
    /**
     * 🚀 Inicialización del sistema
     */
    init() {
        if (this.isInitialized) return;
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEffects());
        } else {
            this.setupEffects();
        }
        
        this.isInitialized = true;
    }
    
    /**
     * ⚙️ Configuración de todos los efectos
     */
    setupEffects() {
        this.setupPieceInteractions();
        this.setupCardEffects();
        this.setupArcadeButtonEffects();
        this.setupPillEffects();
        this.setupCoinCounter();
        this.setupPowerUps();
        this.setupParticleSystem();
        
        console.log('🎮 NeonChess Effects System Initialized');
    }
    
    /**
     * ♞ Efectos para las piezas de ajedrez
     */
    setupPieceInteractions() {
        const pieces = document.querySelectorAll('.neon-piece');
        
        pieces.forEach(piece => {
            piece.addEventListener('click', (e) => {
                this.triggerPieceEffect(piece);
                this.createClickParticles(e.clientX, e.clientY, '#00ffff');
            });
            
            piece.addEventListener('mouseenter', () => {
                piece.style.filter = 'brightness(1.3) drop-shadow(0 0 20px currentColor)';
            });
            
            piece.addEventListener('mouseleave', () => {
                piece.style.filter = '';
            });
        });
    }
    
    /**
     * ✨ Efecto especial al hacer clic en piezas
     */
    triggerPieceEffect(piece) {
        // Detener animación actual
        piece.style.animation = 'none';
        
        // Efecto de spin dramático
        piece.style.transform = 'scale(1.5) rotateZ(720deg)';
        piece.style.boxShadow = '0 0 40px currentColor';
        piece.style.filter = 'brightness(1.5) saturate(1.5)';
        
        // Restaurar después de la animación
        setTimeout(() => {
            piece.style.animation = '';
            piece.style.transform = '';
            piece.style.boxShadow = '';
            piece.style.filter = '';
        }, 800);
        
        // Crear ondas de choque
        this.createShockWave(piece);
    }
    
    /**
     * 🃏 Efectos para las tarjetas de juego
     */
    setupCardEffects() {
        const cards = document.querySelectorAll('.neon-card');
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.triggerCardEffect(card);
                this.createClickParticles(e.clientX, e.clientY, '#ff0080');
            });
            
            // Efecto parallax sutil en hover
            card.addEventListener('mousemove', (e) => {
                this.cardParallaxEffect(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    /**
     * 💫 Efecto parallax en tarjetas
     */
    cardParallaxEffect(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = y / rect.height * -10;
        const rotateY = x / rect.width * 10;
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateY(-15px) 
            scale(1.02)
        `;
    }
    
    /**
     * 🎯 Efecto de activación de tarjeta
     */
    triggerCardEffect(card) {
        // Cambio temporal de borde
        const originalBorder = card.style.borderImage;
        card.style.borderImage = 'linear-gradient(45deg, #fff, #00ffff, #fff) 1';
        card.style.transform = 'translateY(-20px) scale(1.05)';
        card.style.filter = 'brightness(1.2)';
        
        // Crear efecto de "scan"
        this.createScanEffect(card);
        
        setTimeout(() => {
            card.style.borderImage = originalBorder;
            card.style.transform = '';
            card.style.filter = '';
        }, 300);
    }
    
    /**
     * 🕹️ Efectos para botones arcade
     */
    setupArcadeButtonEffects() {
        const arcadeButtons = document.querySelectorAll('.neon-arcade-btn');
        
        arcadeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.triggerArcadeButtonEffect(btn, e);
            });
            
            // Efecto de hover mejorado
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
    
    /**
     * 💥 Efecto de botón arcade presionado
     */
    triggerArcadeButtonEffect(btn, e) {
        // Efecto visual de presión
        btn.style.transform = 'translateY(6px)';
        btn.style.boxShadow = '0 0px 0 #333, 0 2px 0 #222, 0 4px 0 #111, 0 6px 10px rgba(0,0,0,0.4)';
        
        // Crear explosión de partículas
        this.createButtonExplosion(e.clientX, e.clientY);
        
        // Efecto de screen shake sutil
        this.screenShake();
        
        // Restaurar botón
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        }, 150);
    }
    
    /**
     * 💊 Efectos para botones tipo píldora
     */
    setupPillEffects() {
        const pills = document.querySelectorAll('.neon-pill');
        
        pills.forEach(pill => {
            pill.addEventListener('mouseenter', () => {
                pill.style.letterSpacing = '0.15em';
                pill.style.textShadow = '0 0 15px currentColor';
            });
            
            pill.addEventListener('mouseleave', () => {
                pill.style.letterSpacing = '0.1em';
                pill.style.textShadow = '';
            });
            
            pill.addEventListener('click', (e) => {
                this.triggerPillEffect(pill);
                this.createClickParticles(e.clientX, e.clientY, '#00ff80');
            });
        });
    }
    
    /**
     * ✨ Efecto de píldora activada
     */
    triggerPillEffect(pill) {
        pill.style.transform = 'scale(1.1)';
        pill.style.filter = 'brightness(1.3)';
        
        setTimeout(() => {
            pill.style.transform = '';
            pill.style.filter = '';
        }, 200);
    }
    
    /**
     * 🪙 Sistema de contador de monedas
     */
    setupCoinCounter() {
        const counter = document.querySelector('.neon-coin-counter span');
        if (!counter) return;
        
        // Actualización automática cada 8 segundos
        setInterval(() => {
            this.updateCoinCounter();
        }, 8000);
        
        // Efecto de clic en el contador
        const coinCounter = document.querySelector('.neon-coin-counter');
        if (coinCounter) {
            coinCounter.addEventListener('click', () => {
                this.triggerCoinBurst();
            });
        }
    }
    
    /**
     * 💰 Actualizar contador de monedas
     */
    updateCoinCounter() {
        const counter = document.querySelector('.neon-coin-counter span');
        if (!counter) return;
        
        const increment = Math.floor(Math.random() * 50) + 10;
        this.coinCount += increment;
        
        // Efecto visual de incremento
        counter.style.transform = 'scale(1.2)';
        counter.style.color = '#00ff00';
        counter.style.textShadow = '0 0 20px #00ff00';
        counter.textContent = this.coinCount.toLocaleString();
        
        // Crear partículas de monedas
        this.createCoinParticles();
        
        setTimeout(() => {
            counter.style.transform = '';
            counter.style.color = '';
            counter.style.textShadow = '';
        }, 500);
    }
    
    /**
     * 💥 Explosión de monedas
     */
    triggerCoinBurst() {
        const coinCounter = document.querySelector('.neon-coin-counter');
        const rect = coinCounter.getBoundingClientRect();
        
        for (let i = 0; i < 12; i++) {
            this.createCoinParticle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                i * 30 // ángulo
            );
        }
    }
    
    /**
     * ⚡ Sistema de power-ups flotantes
     */
    setupPowerUps() {
        // Crear power-ups si no existen
        this.createPowerUpElements();
        
        // Configurar interactividad
        setInterval(() => {
            this.spawnRandomPowerUp();
        }, 3000);
    }
    
    /**
     * 🎨 Crear elementos de power-up
     */
    createPowerUpElements() {
        for (let i = 0; i < 5; i++) {
            const powerUp = document.createElement('div');
            powerUp.className = 'neon-power-up';
            powerUp.style.left = `${15 + i * 20}%`;
            powerUp.style.animationDelay = `${i * 1.2}s`;
            document.body.appendChild(powerUp);
            
            // Hacer clic en power-up
            powerUp.addEventListener('click', () => {
                this.collectPowerUp(powerUp);
            });
        }
    }
    
    /**
     * 🔥 Recolectar power-up
     */
    collectPowerUp(powerUp) {
        powerUp.style.animation = 'none';
        powerUp.style.transform = 'scale(2)';
        powerUp.style.opacity = '0';
        
        // Efecto de recolección
        this.createCollectionEffect(powerUp);
        
        // Bonus de monedas
        this.coinCount += 25;
        this.updateCoinDisplay();
        
        setTimeout(() => {
            powerUp.style.animation = '';
            powerUp.style.transform = '';
            powerUp.style.opacity = '';
        }, 1000);
    }
    
    /**
     * 🌟 Sistema de partículas
     */
    setupParticleSystem() {
        this.particleCanvas = this.createParticleCanvas();
        this.startParticleLoop();
    }
    
    /**
     * 🖼️ Crear canvas para partículas
     */
    createParticleCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'neon-particles';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999';
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        return canvas;
    }
    
    /**
     * 🔄 Loop principal de partículas
     */
    startParticleLoop() {
        const ctx = this.particleCanvas.getContext('2d');
        
        const animate = () => {
            ctx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
            
            // Actualizar y dibujar partículas
            this.particles = this.particles.filter(particle => {
                particle.update();
                particle.draw(ctx);
                return particle.life > 0;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * ✨ Crear partículas de clic
     */
    createClickParticles(x, y, color = '#00ffff') {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new NeonParticle(x, y, color, 'explosion'));
        }
    }
    
    /**
     * 💫 Crear partículas de monedas
     */
    createCoinParticles() {
        const coinCounter = document.querySelector('.neon-coin-counter');
        if (!coinCounter) return;
        
        const rect = coinCounter.getBoundingClientRect();
        
        for (let i = 0; i < 6; i++) {
            this.particles.push(new NeonParticle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                '#ffff00',
                'coin'
            ));
        }
    }
    
    /**
     * 💥 Crear explosión de botón
     */
    createButtonExplosion(x, y) {
        for (let i = 0; i < 12; i++) {
            this.particles.push(new NeonParticle(x, y, '#ff0080', 'explosion'));
        }
    }
    
    /**
     * 🌊 Crear onda de choque
     */
    createShockWave(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const shockWave = document.createElement('div');
        shockWave.style.position = 'fixed';
        shockWave.style.left = centerX + 'px';
        shockWave.style.top = centerY + 'px';
        shockWave.style.width = '4px';
        shockWave.style.height = '4px';
        shockWave.style.border = '2px solid #00ffff';
        shockWave.style.borderRadius = '50%';
        shockWave.style.transform = 'translate(-50%, -50%)';
        shockWave.style.pointerEvents = 'none';
        shockWave.style.zIndex = '998';
        
        document.body.appendChild(shockWave);
        
        // Animar expansión
        shockWave.animate([
            { width: '4px', height: '4px', opacity: 1 },
            { width: '200px', height: '200px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            shockWave.remove();
        };
    }
    
    /**
     * 📱 Screen shake effect
     */
    screenShake() {
        document.body.animate([
            { transform: 'translate(0)' },
            { transform: 'translate(-2px, 1px)' },
            { transform: 'translate(2px, -1px)' },
            { transform: 'translate(-1px, 2px)' },
            { transform: 'translate(1px, -2px)' },
            { transform: 'translate(0)' }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });
    }
    
    /**
     * 🔄 Actualizar display de monedas
     */
    updateCoinDisplay() {
        const counter = document.querySelector('.neon-coin-counter span');
        if (counter) {
            counter.textContent = this.coinCount.toLocaleString();
        }
    }
    
    /**
     * 🎲 Spawnar power-up aleatorio
     */
    spawnRandomPowerUp() {
        const powerUps = document.querySelectorAll('.neon-power-up');
        const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
        
        if (randomPowerUp) {
            randomPowerUp.style.background = this.getRandomNeonColor();
            randomPowerUp.style.boxShadow = `0 0 10px ${randomPowerUp.style.background}`;
        }
    }
    
    /**
     * 🎨 Obtener color neón aleatorio
     */
    getRandomNeonColor() {
        const colors = ['#00ffff', '#ff0080', '#00ff80', '#ff8000', '#8000ff', '#ffff00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

/**
 * =================================================================
 * ✨ CLASE DE PARTÍCULAS NEÓN
 * =================================================================
 */
class NeonParticle {
    constructor(x, y, color = '#00ffff', type = 'explosion') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        
        // Propiedades según el tipo
        if (type === 'explosion') {
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.life = 60;
            this.size = Math.random() * 4 + 2;
        } else if (type === 'coin') {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 2;
            this.life = 80;
            this.size = 3;
        }
        
        this.maxLife = this.life;
        this.gravity = type === 'coin' ? 0.1 : 0;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        
        // Fade out
        this.vx *= 0.98;
        this.vy *= 0.98;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/**
 * =================================================================
 * 🚀 AUTO-INICIALIZACIÓN
 * =================================================================
 */

// Instancia global del sistema
window.neonChessEffects = new NeonChessEffects();

// Funciones utilitarias globales
window.NeonChess = {
    // Crear efecto de partículas manualmente
    createParticles: (x, y, color) => {
        window.neonChessEffects.createClickParticles(x, y, color);
    },
    
    // Añadir monedas manualmente
    addCoins: (amount) => {
        window.neonChessEffects.coinCount += amount;
        window.neonChessEffects.updateCoinDisplay();
        window.neonChessEffects.createCoinParticles();
    },
    
    // Trigger screen shake
    screenShake: () => {
        window.neonChessEffects.screenShake();
    },
    
    // Cambiar color de power-ups
    setPowerUpColor: (color) => {
        document.querySelectorAll('.neon-power-up').forEach(pu => {
            pu.style.background = color;
            pu.style.boxShadow = `0 0 10px ${color}`;
        });
    }
};

// Mensajes de consola con estilo
console.log('%c🎮 NeonChess System Loaded', 'color: #00ffff; font-size: 16px; font-weight: bold;');
console.log('%cAvailable: window.NeonChess', 'color: #ff0080; font-size: 12px;');