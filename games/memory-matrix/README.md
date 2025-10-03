# 🧠 Memory Matrix - ChessArcade

## 📋 **Descripción**

Memory Matrix es un juego de memoria ajedrecística progresivo con 30 niveles, desde niños (4 años) hasta Grandes Maestros. El objetivo es memorizar posiciones de ajedrez y recrearlas mediante drag & drop.

## 🎮 **Cómo Jugar**

1. **Memorización:** Observa la posición por unos segundos
2. **Colocación:** Arrastra las piezas del banco lateral al tablero
3. **Verificación:** El juego valida si la posición es correcta
4. **Progresión:** Avanza por los 30 niveles disponibles

## 🚀 **Inicio Rápido**

Abre `index.html` en tu navegador y ¡comienza a jugar!

## 📁 **Estructura del Proyecto**

```
memory-matrix/
├── index.html              # Juego principal - NUEVO UBICACIÓN
├── memory-matrix.js         # Lógica del juego (antes memory-matrix-cb2.js)
├── memory-matrix.css        # Estilos del juego (antes memory-matrix-cb2.css)
├── memory-levels.js         # Configuración de 30 niveles
├── memory_matrix_spec.md    # Especificación técnica completa
├── libs/                    # Librerías externas
│   ├── chess.min.js         # Chess.js para lógica de ajedrez
│   ├── chessboard-1.0.0.min.css
│   ├── chessboard-1.0.0.min.js
│   └── howler.min.js        # Audio (Howler.js)
├── docs/                    # Documentación
│   ├── COMPARISON.md
│   ├── progress_matrix_memory.md
│   ├── SESION_TRABAJO_RESUMEN.md
│   ├── SESION_SEPTIEMBRE_29_RESUMEN_COMPLETO.md
│   ├── DOCUMENTACION_DEBUG_ALTURA_BANCO.md
│   └── index-old.html       # Backup versión anterior
└── debug/                   # Herramientas de debugging
    ├── DEBUG_altura_banco.css
    └── DEBUG_altura_banco.js
```

## ✅ **Características Implementadas**

### **Funcionalidad Core:**
- ✅ **30 Niveles configurados** (2 completamente jugables)
- ✅ **Sistema de pausa/reanudar** completo
- ✅ **Drag & Drop** desde banco lateral al tablero
- ✅ **Responsive design** (mobile, tablet, desktop)
- ✅ **Altura banco sincronizada** con tablero automáticamente
- ✅ **Integración con pantalla principal** de ChessArcade

### **Responsive Breakpoints:**
- **Mobile (<600px):** Layout vertical, banco abajo
- **Tablet (600px-899px):** Layout vertical, banco más ancho
- **Desktop (900px+):** Layout horizontal, banco lateral

### **Sistema de Pausa:**
- ⏸️ **Pausar:** Detiene countdown, deshabilita interacciones, muestra overlay
- ▶️ **Reanudar:** Restaura estado exacto, continúa donde se pausó

## 🔧 **Tecnologías Utilizadas**

- **Chess.js:** Lógica de ajedrez y validación de movimientos
- **ChessBoard.js:** Renderizado visual del tablero
- **Howler.js:** Sistema de audio (deshabilitado en local)
- **CSS Grid + Flexbox:** Layout responsive
- **JavaScript Vanilla:** Lógica del juego

## 📊 **Estado del Proyecto**

### **✅ COMPLETAMENTE FUNCIONAL:**
- Navegación desde index principal
- Responsive design en todos los dispositivos
- Sistema de pausa robusto
- Niveles 1-2 completamente jugables
- Debugging tools disponibles

### **📋 PENDIENTE PARA DESARROLLO:**
- Implementar niveles 3-30 (especificación completa disponible)
- Sistema de sonidos (código preparado)
- Animaciones avanzadas
- Sistema de puntuación/achievements

## 🛠️ **Para Desarrolladores**

### **Archivos Debug Disponibles:**
Si necesitas debuggear problemas de altura del banco lateral:

1. Incluir: `debug/DEBUG_altura_banco.css` y `debug/DEBUG_altura_banco.js`
2. En consola: `debugAlturasBanco.ayuda()`
3. Documentación: `docs/DOCUMENTACION_DEBUG_ALTURA_BANCO.md`

### **Desarrollo Local:**
```bash
# Servidor local recomendado
npx http-server -p 8000

# Acceder en: http://localhost:8000
# Mobile testing: http://[tu-ip]:8000 (misma WiFi)
```

## 📚 **Documentación Adicional**

- **Especificación completa:** `memory_matrix_spec.md`
- **Resumen de desarrollo:** `docs/SESION_SEPTIEMBRE_29_RESUMEN_COMPLETO.md`
- **Historial de progreso:** `docs/progress_matrix_memory.md`

## 🎯 **Próximos Pasos**

1. **Testing extensivo:** Todos los niveles y resoluciones
2. **Implementar niveles adicionales:** Siguiendo especificación
3. **Sistema de audio:** Habilitar feedback sonoro
4. **ChessArcade.js library:** Extraer componentes reutilizables

---

**🎮 ¡Memory Matrix está listo para jugar!** 🧠✨

*Última actualización: Septiembre 30, 2025*