# Knight Quest 🐴

Un juego de ajedrez arcade donde debes mover el caballo para visitar todas las casillas del tablero exactamente una vez. Basado en el famoso problema del "Tour del Caballo".

## Características

- **Múltiples dificultades**: Tableros de 4x4, 6x6, 8x8 y 10x10
- **Sistema de pistas**: Algoritmo de Warnsdorff para sugerir mejores movimientos
- **Sonido inmersivo**: Efectos sonoros con Web Audio API
- **Diseño responsive**: Optimizado para móvil y desktop
- **Modales interactivos**: Estadísticas detalladas que se pueden cerrar/abrir
- **Estilo neon retro**: Diseño futurista con efectos visuales

## Cómo Jugar

1. **Objetivo**: Visita todas las casillas del tablero con el caballo
2. **Movimiento**: El caballo se mueve en forma de L (como en ajedrez)
3. **Reglas**: Cada casilla solo puede visitarse una vez
4. **Victoria**: Completa todas las casillas para ganar

## Controles

- **Click**: Seleccionar casilla para mover
- **NEW GAME**: Iniciar nueva partida
- **HINT**: Obtener pista (máximo 3 por partida)
- **UNDO**: Deshacer último movimiento
- **SOUND**: Activar/desactivar sonido
- **Tamaños**: 4x4 (fácil) hasta 10x10 (experto)

## Teclas de Acceso Rápido

- `Espacio`: Obtener pista
- `R`: Nueva partida
- `U`: Deshacer movimiento
- `4/6/8/0`: Cambiar tamaño de tablero

## Características Técnicas

- **Web Audio API**: Sonidos sintéticos sin archivos externos
- **CSS Grid**: Layout responsive del tablero
- **localStorage**: Guardado de mejores puntuaciones
- **Algoritmo Warnsdorff**: IA para pistas inteligentes
- **Animaciones CSS**: Efectos visuales fluidos

## Compatibilidad

- Chrome 60+
- Firefox 55+
- Safari 14+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Instalación

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. ¡Comienza a jugar!

## Estructura del Proyecto

```
knight-quest/
├── index.html          # Archivo principal del juego
├── README.md          # Este archivo
└── assets/            # Recursos compartidos (CSS común)
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## Autor

Parte del proyecto ChessArcade - Una colección de juegos de ajedrez con estilo arcade.

---

**¿Puedes completar el Tour del Caballo?** 🏆
