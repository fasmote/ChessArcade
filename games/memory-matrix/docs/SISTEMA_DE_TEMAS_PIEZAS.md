# Sistema de Temas de Piezas - ChessGameLibrary

## 📋 Resumen

Sistema modular que permite a los usuarios seleccionar diferentes estilos de piezas de ajedrez (Lichess, Chess.com, Wikipedia, Monsters MAG, etc.). Implementado el 1 de octubre de 2025.

---

## 🎯 Arquitectura del Sistema

### Componentes Principales

```
ChessGameLibrary/
├── Config/
│   └── PieceThemes.js          # Configuración centralizada de temas
├── UI/
│   ├── ThemeSelector.js        # Componente UI para selector
│   └── ThemeSelector.css       # Estilos del selector
├── Board/
│   └── BoardManager.js         # Usa temas dinámicos (modificado)
└── Pieces/
    └── PieceBank.js            # Usa temas dinámicos (modificado)
```

### Flujo de Datos

```
Usuario selecciona tema
    ↓
ThemeSelector.selectTheme()
    ↓
PieceThemes.setTheme()
    ↓
localStorage + EventBus.emit('themeChanged')
    ↓
BoardManager.reloadTheme() + PieceBank actualiza
    ↓
Tablero se recarga con nuevo tema
```

---

## 📦 PieceThemes.js - Configuración

### Estructura de un Tema

```javascript
themeName: {
    name: 'Nombre Visible',              // Mostrado en UI
    description: 'Descripción del tema', // Mostrado en UI
    type: 'cdn' | 'local',               // Origen de las piezas
    basePath: 'url-o-path/',             // Ruta base
    extension: 'svg' | 'png',            // Formato de archivo
    enabled: true | false,               // Si está disponible
    pieceTheme: (piece) => {             // Función que genera HTML
        return `<img src="..." alt="${piece}" style="width: 100%; height: 100%;">`;
    }
}
```

### Temas Disponibles

#### 1. **Lichess (Default)** ✅
- **Tipo**: CDN
- **URL**: `https://lichess1.org/assets/piece/cburnett/`
- **Formato**: SVG
- **Características**: Moderno, limpio, siempre actualizado
- **Estado**: Activo

#### 2. **Chess.com** ✅
- **Tipo**: CDN
- **URL**: `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/`
- **Formato**: PNG
- **Características**: Estilo Chess.com oficial
- **Estado**: Activo

#### 3. **Wikipedia Classic** ✅
- **Tipo**: CDN
- **URL**: `https://upload.wikimedia.org/wikipedia/commons/`
- **Formato**: SVG
- **Características**: Estilo clásico tradicional
- **Estado**: Activo

#### 4. **Monsters (MAG)** 🔒
- **Tipo**: Local
- **Path**: `libs/img/chesspieces/monsters/`
- **Formato**: SVG (o PNG)
- **Características**: Diseño personalizado de MAG
- **Estado**: Deshabilitado (pendiente exportación)
- **Mapeo de piezas**:
  - wK → Vampiro amarillo
  - wQ → Dama amarilla
  - wR → Frankenstein amarillo
  - wB → Momia amarilla
  - wN → Hombre lobo amarillo
  - wP → Momia pequeña amarilla
  - bK → Vampiro azul
  - bQ → Dama azul
  - bR → Frankenstein azul
  - bB → Gorila azul
  - bN → Hombre lobo azul
  - bP → Alien azul

#### 5. **Minimal** 🔒
- **Tipo**: Local
- **Estado**: Deshabilitado (no implementado)

### Métodos Principales

```javascript
// Obtener tema actual
PieceThemes.getCurrentTheme() // → 'lichess'

// Cambiar tema
PieceThemes.setTheme('monsters') // → true/false

// Obtener función de tema para ChessBoard2
PieceThemes.getPieceThemeFunction() // → function(piece) {...}

// Obtener path de pieza específica (para PieceBank)
PieceThemes.getPiecePath('wK') // → 'https://..../wK.svg'

// Obtener temas disponibles (enabled: true)
PieceThemes.getAvailableThemes() // → [{id, name, description, ...}, ...]

// Habilitar/deshabilitar tema
PieceThemes.enableTheme('monsters')
PieceThemes.disableTheme('monsters')
```

### Persistencia

- **localStorage key**: `chessarcade_piece_theme`
- **Auto-inicialización**: Al cargar PieceThemes.js
- **Fallback**: Si tema guardado no existe, usa 'lichess'

---

## 🎨 ThemeSelector.js - UI Component

### Configuración

```javascript
const themeSelector = new ThemeSelector('container-id', {
    position: 'top-right',        // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    showLabels: true,             // Mostrar texto "Piezas" en botón
    showDescriptions: false,      // Mostrar descripciones en opciones
    autoClose: true               // Cerrar dropdown al seleccionar
});
```

### Características

- **Botón flotante**: Gradiente morado, esquina configurable
- **Dropdown animado**: FadeIn suave, max-height con scroll
- **Preview visual**: Muestra imagen del Rey blanco de cada tema
- **Tema activo**: Marcado con checkmark verde
- **Responsive**: Se adapta a móvil (oculta label, reduce tamaño)
- **Confirm dialog**: Pregunta si recargar página al cambiar tema

### Integración en HTML

```html
<!-- CSS -->
<link rel="stylesheet" href="ChessGameLibrary/UI/ThemeSelector.css">

<!-- Container -->
<div id="theme-selector-container"></div>

<!-- JS -->
<script src="ChessGameLibrary/Config/PieceThemes.js"></script>
<script src="ChessGameLibrary/UI/ThemeSelector.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const themeSelector = new ThemeSelector('theme-selector-container', {
        position: 'top-right',
        showLabels: true,
        showDescriptions: false,
        autoClose: true
    });
    themeSelector.render();
});
</script>
```

---

## 🔧 Integración con BoardManager

### Cambios Realizados

**Antes:**
```javascript
this.config = {
    pieceTheme: (piece) => {
        return `<img src="https://lichess1.org/assets/piece/cburnett/${piece}.svg" ...>`;
    }
};
```

**Después:**
```javascript
this.config = {
    pieceTheme: PieceThemes.getPieceThemeFunction(), // Dinámico
    ...config
};
```

### Nuevo Método: `reloadTheme()`

```javascript
reloadTheme() {
    console.log('🔄 BoardManager: Recargando tema...');

    // 1. Guardar posición actual
    const currentPosition = this.board.position();

    // 2. Destruir tablero
    this.destroy();

    // 3. Actualizar tema
    this.config.pieceTheme = PieceThemes.getPieceThemeFunction();

    // 4. Re-inicializar
    this.initialize();

    // 5. Restaurar posición
    if (currentPosition && Object.keys(currentPosition).length > 0) {
        this.setPosition(currentPosition);
    }

    console.log('✅ BoardManager: Tema recargado exitosamente');
}
```

### Event Listener

```javascript
initialize() {
    // ...
    ChessGameEventBus.on('themeChanged', () => {
        this.reloadTheme();
    });
    // ...
}
```

---

## 🎲 Integración con PieceBank

### Cambios Realizados

**Antes:**
```javascript
pieceImg.src = 'libs/img/chesspieces/lichess/' + piece + '.svg'; // Hardcoded
```

**Después:**
```javascript
pieceImg.src = PieceThemes.getPiecePath(piece); // Dinámico
```

### Actualización Automática

Cuando cambia el tema:
1. `ThemeSelector` llama a `PieceThemes.setTheme()`
2. `PieceThemes` emite evento `'themeChanged'`
3. `BoardManager.reloadTheme()` recarga el tablero
4. `PieceBank.createBank()` se llama de nuevo en el juego
5. `createPieceElement()` usa `PieceThemes.getPiecePath()` → Piezas actualizadas

---

## ➕ Cómo Agregar un Nuevo Tema

### Paso 1: Agregar Configuración

Edita `ChessGameLibrary/Config/PieceThemes.js`:

```javascript
static themes = {
    // ... temas existentes ...

    miNuevoTema: {
        name: 'Mi Tema Personalizado',
        description: 'Descripción del tema',
        type: 'local',  // o 'cdn'
        basePath: 'libs/img/chesspieces/mitema/',
        extension: 'svg',
        pieceTheme: (piece) => {
            return `<img src="libs/img/chesspieces/mitema/${piece}.svg" alt="${piece}" style="width: 100%; height: 100%;">`;
        },
        enabled: true  // false si aún no están los archivos
    }
};
```

### Paso 2: Preparar Archivos

Si es **local**, crear carpeta con 12 archivos:

```
libs/img/chesspieces/mitema/
├── wK.svg  (Rey blanco)
├── wQ.svg  (Dama blanca)
├── wR.svg  (Torre blanca)
├── wB.svg  (Alfil blanco)
├── wN.svg  (Caballo blanco)
├── wP.svg  (Peón blanco)
├── bK.svg  (Rey negro)
├── bQ.svg  (Dama negra)
├── bR.svg  (Torre negra)
├── bB.svg  (Alfil negro)
├── bN.svg  (Caballo negro)
└── bP.svg  (Peón negro)
```

Si es **CDN**, verificar que la URL funcione:
```
https://ejemplo.com/pieces/{piece}.svg
```

### Paso 3: Habilitar

```javascript
enabled: true
```

### Paso 4: Probar

1. Recargar página
2. Click en botón "Piezas"
3. Seleccionar nuevo tema
4. Confirmar recarga

---

## 🎮 Guía de Usuario

### Cambiar Tema de Piezas

1. **Abrir selector**: Click en botón "Piezas" (esquina superior derecha)
2. **Ver opciones**: Se despliega menú con temas disponibles
3. **Preview**: Cada tema muestra imagen del Rey blanco
4. **Seleccionar**: Click en tema deseado
5. **Confirmar**: Acepta recarga de página
6. **Listo**: Juego se recarga con nuevo tema

### Temas Recomendados

- **Lichess** (Default): Moderno y profesional
- **Chess.com**: Familiar para usuarios de Chess.com
- **Wikipedia**: Clásico y tradicional
- **Monsters**: ¡Divertido para niños! (próximamente)

---

## 🔍 Detalles Técnicos

### ChessBoard2 Requirement

ChessBoard2.js **requiere** que `pieceTheme` sea una **función**, no un string:

```javascript
// ❌ INCORRECTO (causa que se muestren letras):
pieceTheme: 'path/{piece}.svg'

// ✅ CORRECTO:
pieceTheme: (piece) => {
    return `<img src="path/${piece}.svg" alt="${piece}" style="width: 100%; height: 100%;">`;
}
```

### Event-Driven Architecture

Sistema usa `ChessGameEventBus` para comunicación:

```javascript
// Emitir cambio de tema
ChessGameEventBus.emit('themeChanged', { theme: 'lichess' });

// Escuchar cambio de tema
ChessGameEventBus.on('themeChanged', (data) => {
    console.log('Tema cambiado a:', data.theme);
    // Actualizar componentes...
});
```

### localStorage Persistence

```javascript
// Guardar
localStorage.setItem('chessarcade_piece_theme', 'lichess');

// Leer
const savedTheme = localStorage.getItem('chessarcade_piece_theme');

// Auto-inicialización al cargar PieceThemes.js
PieceThemes.initialize();
```

### CDN vs Local

**Ventajas CDN:**
- ✅ Siempre disponible
- ✅ Actualizaciones automáticas
- ✅ No ocupa espacio local
- ✅ Caché del navegador

**Ventajas Local:**
- ✅ Funciona offline
- ✅ Piezas personalizadas
- ✅ Control total
- ✅ No depende de servicios externos

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Piezas se muestran como letras (bK, wR, etc.)

**Causas:**
1. `pieceTheme` es string en vez de función
2. Archivos SVG/PNG no existen o están corruptos
3. Cache del navegador

**Soluciones:**
1. Verificar que `pieceTheme` sea función
2. Probar URL/path directamente en navegador
3. Abrir en modo incógnito o Ctrl+Shift+R

### Problema: Tema no cambia al seleccionar

**Causas:**
1. Página no se recargó
2. localStorage bloqueado
3. EventBus no emitió evento

**Soluciones:**
1. Confirmar recarga cuando aparece prompt
2. Verificar permisos de localStorage
3. Revisar console.log para errores

### Problema: Archivos SVG corruptos

**Síntoma**: Error XML "Specification mandates value for attribute crossorigin"

**Solución**: Usar CDN en vez de archivos locales o re-exportar SVG limpio

---

## 📝 Tareas Pendientes

### Monsters Theme

1. **Exportar piezas desde CorelDRAW**:
   - Abrir: `C:\Users\clau\Documents\ChessArcade_backup\piezas y tableros\todas monstruo 2015 2.cdr`
   - Exportar 12 archivos SVG individuales
   - Guardar en: `libs/img/chesspieces/monsters/`
   - Seguir instrucciones en: `libs/img/chesspieces/monsters/README.md`

2. **Habilitar tema**:
   - Editar `PieceThemes.js`
   - Cambiar `monsters.enabled: false` a `enabled: true`

3. **Probar**:
   - Recargar página
   - Seleccionar "Monsters (MAG)"
   - Verificar que piezas se vean correctamente

### Mejoras Futuras

- [ ] Cambio de tema sin recargar página (más complejo pero UX mejor)
- [ ] Preview más grande al hacer hover
- [ ] Tema "Minimal" (piezas minimalistas)
- [ ] Más temas CDN (Maestro, Alpha, etc.)
- [ ] Exportar/importar temas personalizados
- [ ] Editor visual de temas

---

## 📚 Referencias

- **ChessBoard2.js**: [GitHub - oakmac/chessboardjs](https://github.com/oakmac/chessboard2)
- **Lichess Pieces**: [Lichess Assets](https://lichess1.org/assets/piece/cburnett/)
- **Chess.com Pieces**: [Chess.com Themes](https://images.chesscomfiles.com/chess-themes/pieces/)
- **Wikipedia SVG**: [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces)

---

## ✅ Checklist de Integración

Usa este checklist para integrar el sistema en un nuevo juego:

- [ ] Copiar `ChessGameLibrary/Config/PieceThemes.js`
- [ ] Copiar `ChessGameLibrary/UI/ThemeSelector.js`
- [ ] Copiar `ChessGameLibrary/UI/ThemeSelector.css`
- [ ] Actualizar `BoardManager.js` con `reloadTheme()`
- [ ] Actualizar `PieceBank.js` con `getPiecePath()`
- [ ] Agregar imports en `index.html`
- [ ] Agregar container `<div id="theme-selector-container"></div>`
- [ ] Inicializar ThemeSelector en DOMContentLoaded
- [ ] Probar cambio de tema
- [ ] Verificar persistencia en localStorage

---

**Documentado por**: Claude (Sonnet 4.5)
**Fecha**: 1 de Octubre de 2025
**Proyecto**: Memory Matrix - ChessArcade
**Versión**: 1.0
