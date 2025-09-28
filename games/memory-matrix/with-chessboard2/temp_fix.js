        }

        // IMPORTANTE: Configurar drop listeners para drag & drop desde banco
        setupBoardDropListeners();

        // Inicializar Chess.js para validación de posiciones
        if (typeof Chess === 'undefined') {
            throw new Error('Chess.js no está cargado');
        }

        // Crear nueva instancia de Chess.js con posición inicial estándar
        chess = new Chess();

        console.log('✅ Tablero inicializado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error inicializando tablero:', error);
        showError(`Error inicializando tablero: ${error.message}`);
        return false;
    }
}