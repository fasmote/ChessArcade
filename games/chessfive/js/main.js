/**
 * MAIN ENTRY POINT
 * Initializes the ChessFive game
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚔️ ChessFive - Place. Move. Align Five. Win.');
    console.log('🎮 Initializing game...');

    // Initialize all modules
    GameState.init();
    SoundManager.init();
    BoardRenderer.init();
    UIController.init();
    GravityPhase.init();

    console.log('✅ Game ready!');

    // Track page view
    gtag('event', 'page_view', {
        'page_title': 'ChessFive',
        'page_location': window.location.href
    });
});

// Prevent context menu on mobile
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('❌ Game error:', e.message);

    // Track error in analytics
    gtag('event', 'exception', {
        'description': e.message,
        'fatal': false
    });
});

console.log('📜 ChessFive scripts loaded');
