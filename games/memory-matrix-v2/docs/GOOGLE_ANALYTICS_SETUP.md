# Google Analytics - Configuración ChessArcade

## 📊 ID de Medición

```
G-N3EKXHPD5Y
```

## 🔧 Implementación

### Código a agregar en `<head>` de cada página:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N3EKXHPD5Y"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-N3EKXHPD5Y');
</script>
```

## ✅ Páginas Etiquetadas

- [x] `index.html` (principal) - Agregado 2025-01-03
- [x] `games/knight-quest/index.html`
- [x] `games/square-rush/index.html`
- [x] `games/memory-matrix-v2/index.html` (pendiente, agregar cuando esté listo)

## 📍 Ubicación del Código

El código de Google Analytics debe colocarse:
1. **Después** del favicon
2. **Antes** de los estilos CSS

Ejemplo de orden en `<head>`:
```html
<head>
    <!-- Meta tags -->
    <meta charset="UTF-8">

    <!-- Favicon -->
    <link rel="icon" href="...">

    <!-- Google Analytics (AQUÍ) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-N3EKXHPD5Y"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-N3EKXHPD5Y');
    </script>

    <!-- Estilos CSS -->
    <link rel="stylesheet" href="...">
</head>
```

## 🎯 Eventos Personalizados

### En Square Rush (ejemplo de implementación):

```javascript
// Evento de inicio de juego
gtag('event', 'game_start_button', {
    'event_category': 'game',
    'event_label': 'square_rush'
});

// Evento de respuesta correcta
gtag('event', 'correct_answer', {
    'event_category': 'gameplay',
    'event_label': 'square_rush',
    'value': currentLevel
});

// Evento de game over
gtag('event', 'game_over', {
    'event_category': 'game',
    'event_label': 'square_rush',
    'value': score
});
```

### Para Memory Matrix (implementar en el futuro):

```javascript
// Sugerencias de eventos a implementar:
gtag('event', 'memory_game_start', {
    'event_category': 'game',
    'event_label': 'memory_matrix',
    'value': level
});

gtag('event', 'memory_pieces_hidden', {
    'event_category': 'gameplay',
    'event_label': 'memory_matrix',
    'value': piecesCount
});

gtag('event', 'memory_piece_placed', {
    'event_category': 'gameplay',
    'event_label': 'memory_matrix',
    'correct': true/false
});

gtag('event', 'memory_level_complete', {
    'event_category': 'achievement',
    'event_label': 'memory_matrix',
    'value': level,
    'time': elapsedSeconds
});
```

## 🔍 Verificación

1. **Google Tag Manager**: Verificar cobertura en https://tagmanager.google.com
2. **Google Analytics**: Ver datos en tiempo real en https://analytics.google.com
3. **Console del navegador**: Verificar que `gtag` está definido

```javascript
// En la consola del navegador:
typeof gtag // Debería retornar "function"
```

## 📝 Notas Importantes

- **ID único**: Todos los juegos de ChessArcade usan el mismo ID `G-N3EKXHPD5Y`
- **Carga asíncrona**: Usar `async` para no bloquear la carga de la página
- **Privacy**: Google Analytics cumple con GDPR (política de privacidad pendiente)

---

**Última actualización**: 2025-01-03
**Responsable**: ChessArcade Team
