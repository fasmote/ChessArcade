/**
 * EventBus - Sistema de comunicación entre módulos
 * Patrón Observer para desacoplar componentes
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    // Suscribirse a un evento
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    // Desuscribirse de un evento
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }

    // Emitir evento
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    // Limpiar todos los eventos
    clear() {
        this.events = {};
    }
}

// Instancia global del EventBus
window.ChessGameEventBus = new EventBus();