# 📤 Guía de Deploy a Hostinger - ChessArcade Leaderboard

## 📋 Archivos a Subir via FTP

Subir estos archivos a la raíz de `www.chessarcade.com.ar`:

### 1. JavaScript - Carpeta `js/`

```
js/
├── leaderboard-api.js     ✅ SUBIR (API wrapper)
└── leaderboard-ui.js      ✅ SUBIR (Componentes UI)
```

**Importante**: Verificar que `js/` ya existe en Hostinger. Si no existe, crear la carpeta primero.

### 2. CSS - Carpeta `css/`

```
css/
└── leaderboard.css        ✅ SUBIR (Estilos NeonChess)
```

### 3. HTML - Páginas

```
/ (raíz)
├── leaderboard.html       ✅ SUBIR (Página dedicada)
└── test-leaderboard.html  ⚠️ OPCIONAL (Solo para testing, no necesario en producción)
```

**Nota sobre test-leaderboard.html**:
- Es útil tenerlo en producción para hacer tests rápidos
- Pero NO debe estar linkeado desde ninguna página pública
- Solo acceder directo via URL si necesitas testear

---

## 🔗 URLs de Producción

Una vez subidos, los archivos estarán disponibles en:

```
https://www.chessarcade.com.ar/js/leaderboard-api.js
https://www.chessarcade.com.ar/js/leaderboard-ui.js
https://www.chessarcade.com.ar/css/leaderboard.css
https://www.chessarcade.com.ar/leaderboard.html
https://www.chessarcade.com.ar/test-leaderboard.html (opcional)
```

---

## 🎮 Integración con Juegos Existentes

Para que los juegos muestren el leaderboard, cada juego debe:

### Paso 1: Incluir los scripts en cada juego

Agregar en el `<head>` o antes de `</body>` de cada juego:

```html
<!-- Leaderboard Integration -->
<link rel="stylesheet" href="/css/leaderboard.css">
<script src="/js/leaderboard-api.js"></script>
<script src="/js/leaderboard-ui.js"></script>
```

### Paso 2: Llamar al leaderboard al finalizar partida

Ejemplo para Square Rush (`games/squarerush/square-rush.js`):

```javascript
// Al finalizar la partida
async function onGameOver(finalScore, timeMs) {
  // Obtener nombre del jugador (del input o localStorage)
  const playerName = document.getElementById('player-name').value || 'PLAYER';

  try {
    // Enviar score al backend
    const result = await submitScore(
      'square-rush',  // game ID
      playerName,
      finalScore,
      { time_ms: timeMs, level: getCurrentLevel() }
    );

    // Mostrar toast de éxito
    showToast(`Score submitted! Rank #${result.rank}`, 'success');

    // Opcional: Mostrar modal de leaderboard
    setTimeout(() => {
      showLeaderboardModal('square-rush');
    }, 2000); // Esperar 2s para que vean el toast

  } catch (error) {
    console.error('Error submitting score:', error);
    showToast('Could not submit score. Try again!', 'error');
  }
}
```

### Archivos de juegos a modificar:

```
games/squarerush/index.html        → Agregar scripts
games/squarerush/square-rush.js    → Llamar submitScore() al terminar

games/knightquest/index.html       → Agregar scripts
games/knightquest/knight-quest.js  → Llamar submitScore() al terminar

games/memorymatrix/index.html      → Agregar scripts
games/memorymatrix/memory-matrix.js → Llamar submitScore() al terminar

games/mastersequence/index.html    → Agregar scripts
games/mastersequence/master-sequence.js → Llamar submitScore() al terminar

games/chessfive/index.html         → Agregar scripts
games/chessfive/main.js            → Llamar submitScore() al terminar
```

---

## ✅ Checklist de Deploy

### Pre-Deploy
- [ ] Verificar que API_BASE_URL en `js/leaderboard-api.js` apunta a producción de Vercel
- [ ] Testear localmente con `test-leaderboard.html`
- [ ] Verificar que todos los 5 juegos funcionan correctamente

### Deploy FTP
- [ ] Conectar a Hostinger via FTP (FileZilla, WinSCP, o panel de Hostinger)
- [ ] Navegar a la carpeta `public_html/` o raíz del sitio
- [ ] Subir `js/leaderboard-api.js`
- [ ] Subir `js/leaderboard-ui.js`
- [ ] Subir `css/leaderboard.css`
- [ ] Subir `leaderboard.html`
- [ ] (Opcional) Subir `test-leaderboard.html`

### Post-Deploy Testing
- [ ] Abrir https://www.chessarcade.com.ar/leaderboard.html
- [ ] Verificar que el modal se abre correctamente
- [ ] Cambiar entre tabs de juegos
- [ ] Verificar que muestra scores (si hay algunos ya guardados)
- [ ] Si subiste test page: Abrir https://www.chessarcade.com.ar/test-leaderboard.html
- [ ] Enviar un score de prueba
- [ ] Verificar que aparece en el leaderboard
- [ ] Verificar que el ranking muestra "Rank #X of Y" correctamente

---

## 🔧 Configuración de Hostinger

### Credenciales FTP

Deberías tener algo como:

```
Host: ftp.chessarcade.com.ar (o IP del servidor)
Usuario: tu_usuario_ftp
Password: tu_password_ftp
Puerto: 21 (FTP) o 22 (SFTP)
```

Si no las tienes, obtenerlas desde:
1. Panel de Hostinger
2. Ir a "Hosting" → "Manage"
3. Buscar "FTP Accounts" o "File Manager"

### Estructura de Carpetas en Hostinger

Típicamente:

```
/public_html/  (o /www/ o /htdocs/)
├── index.html
├── arcade-shared.css
├── js/
│   ├── leaderboard-api.js     ← SUBIR AQUÍ
│   └── leaderboard-ui.js      ← SUBIR AQUÍ
├── css/
│   └── leaderboard.css        ← SUBIR AQUÍ
├── games/
│   ├── squarerush/
│   ├── knightquest/
│   ├── memorymatrix/
│   ├── mastersequence/
│   └── chessfive/
├── leaderboard.html           ← SUBIR AQUÍ
└── test-leaderboard.html      ← OPCIONAL
```

---

## 🚨 Troubleshooting

### Problema: "Cannot find leaderboard-api.js"

**Solución**:
1. Verificar que la ruta en el HTML sea correcta:
   ```html
   <script src="/js/leaderboard-api.js"></script>
   ```
2. Verificar que el archivo se subió a la carpeta `js/` correctamente
3. Verificar permisos del archivo (chmod 644)

### Problema: "API Base URL not working"

**Solución**:
1. Abrir `js/leaderboard-api.js`
2. Verificar línea 31:
   ```javascript
   const API_BASE_URL = 'https://chessarcade-1ieuxlf7d-claudios-projects.vercel.app/api/scores';
   ```
3. Verificar que esa URL funciona abriendo en el navegador

### Problema: "CORS error"

**Solución**:
- El backend en Vercel ya tiene CORS habilitado para todos los orígenes (`*`)
- Si aún falla, verificar que Vercel esté online
- Probar con otra URL de deployment de Vercel

### Problema: Estilos no se aplican

**Solución**:
1. Verificar que `css/leaderboard.css` se subió correctamente
2. Verificar que el HTML tiene:
   ```html
   <link rel="stylesheet" href="/css/leaderboard.css">
   ```
3. Limpiar caché del navegador (Ctrl+Shift+R)

---

## 📊 Monitoreo Post-Deploy

### Verificar en Browser Console

1. Abrir DevTools (F12)
2. Ir a Console
3. Deberías ver:
   ```
   [leaderboard-api.js] API client loaded successfully
   [leaderboard-api.js] API Base URL: https://...
   [leaderboard-ui.js] UI components loaded successfully
   ```

### Verificar Network Requests

1. Abrir DevTools → Network tab
2. Enviar un score de prueba
3. Buscar request a `/api/scores`
4. Verificar que:
   - Status: 201 Created
   - Response contiene: `{ success: true, data: { rank, totalPlayers, ... } }`

---

## 🔄 Actualizaciones Futuras

Cuando necesites actualizar:

1. **Solo Frontend** (js/css/html):
   - Modificar archivos localmente
   - Testear con test-leaderboard.html
   - Subir via FTP (sobreescribir)
   - Limpiar caché: Ctrl+Shift+R

2. **Backend** (api/scores/):
   - Modificar en local
   - `vercel --prod --yes`
   - Actualizar API_BASE_URL en frontend si cambió la URL
   - Subir frontend actualizado via FTP

---

## 🎯 Próximos Pasos (Post-Deploy)

Después de verificar que funciona en producción:

1. **Integrar en los 5 juegos** (Sprint 4)
   - Agregar scripts en cada juego
   - Llamar submitScore() al finalizar
   - Agregar input de nombre de jugador
   - Botón "View Leaderboard"

2. **Agregar link en index.html**
   ```html
   <a href="/leaderboard.html" class="nav-link">
     🏆 Leaderboard
   </a>
   ```

3. **Promocionar en redes**
   - "ChessArcade now has global leaderboards!"
   - Compartir screenshots del leaderboard

---

## 📝 Notas Finales

- **Backup**: Antes de subir, hacer backup de cualquier archivo que vayas a sobrescribir
- **Permisos**: Si hay errores de permisos, los archivos deben tener chmod 644
- **Cache**: Usuarios pueden tener cache viejo. Considerar agregar `?v=2.0.0` a los scripts:
  ```html
  <script src="/js/leaderboard-api.js?v=2.0.0"></script>
  ```

---

**Fecha**: 2025-11-06
**Versión**: v2.0.0
**Backend**: Vercel Production
**Frontend**: Hostinger (www.chessarcade.com.ar)

¡Buena suerte con el deploy! 🚀
