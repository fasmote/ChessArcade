/**
 * StateManager - Gestión de estados del juego
 * Estados: waiting, memorizing, placing, complete
 */
class StateManager {
    constructor() {
        this.currentState = 'waiting';
        this.previousState = null;
        this.stateData = {};
    }

    // Cambiar estado
    setState(newState, data = {}) {
        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateData = { ...this.stateData, ...data };

        console.log(`🔄 Estado: ${this.previousState} → ${this.currentState}`);

        // Emitir evento de cambio de estado
        ChessGameEventBus.emit('stateChange', {
            current: this.currentState,
            previous: this.previousState,
            data: this.stateData
        });
    }

    // Obtener estado actual
    getState() {
        return this.currentState;
    }

    // Verificar si está en un estado específico
    isState(state) {
        return this.currentState === state;
    }

    // Obtener datos del estado
    getStateData(key) {
        return key ? this.stateData[key] : this.stateData;
    }

    // Resetear estado
    reset() {
        this.setState('waiting', {});
    }
}