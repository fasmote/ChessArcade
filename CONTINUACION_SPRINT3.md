# 🚀 ChessArcade - Continuación Sprint 3

**Fecha de pausa**: 2025-11-06 19:45 ART
**Estado actual**: Backend v2.0.0 completo ✅
**Próximo paso**: Sprint 3 - Integración Frontend

---

## ✅ **Lo que YA ESTÁ HECHO (Backend v2.0.0):**

### **1. Backend API - Completamente funcional** ✅
- ✅ 4 endpoints REST implementados
- ✅ Base de datos Supabase Postgres configurada
- ✅ Deployed a Vercel Production
- ✅ Todos los endpoints testeados exitosamente
- ✅ Deployment Protection desactivado
- ✅ Merged a main branch
- ✅ Pushed a GitHub

### **2. Endpoints disponibles:**
```
URL Base: https://chessarcade-ka1ycvulb-claudios-projects.vercel.app

POST   /api/scores              → Submit score
GET    /api/scores/leaderboard  → Top rankings (con filtros)
GET    /api/scores/search       → Buscar jugadores
GET    /api/scores/recent       → Últimos scores
```

### **3. Testing completado:**
```bash
# ✅ POST - Submit score
curl -k -X POST https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores \
  -H "Content-Type: application/json" \
  -d '{"game":"square-rush","player_name":"TESTUSER","score":15000}'

# Respuesta: {"success":true,"data":{"id":1,"rank":1,"message":"🎉 Top 10!"}}

# ✅ GET - Leaderboard
curl -k "https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores/leaderboard?game=square-rush&limit=10"

# ✅ GET - Search
curl -k "https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores/search?game=square-rush&player_name=TEST"

# ✅ GET - Recent
curl -k "https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores/recent?game=square-rush&limit=5"

# ✅ Anti-cheat validation
curl -k -X POST https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores \
  -H "Content-Type: application/json" \
  -d '{"game":"square-rush","player_name":"HACKER","score":999999999}'

# Respuesta: {"success":false,"error":"Score too high for square-rush. Max: 100000"}
```

### **4. Documentación completa:**
- ✅ `ARQUITECTURA.md` - Separación Frontend/Backend explicada
- ✅ `GUIA_DEPLOYMENT.md` - Tutorial deployment paso a paso
- ✅ `TESTING.md` - Guía de testing
- ✅ `RESUMEN_DEPLOYMENT.md` - Estado completo del proyecto
- ✅ `docs/BACKEND_LEADERBOARD_DESIGN.md` - Diseño original (v1.2.0)

---

## 🎯 **LO QUE FALTA (Sprint 3 - Frontend Integration):**

### **Objetivo Sprint 3:**
Conectar el frontend de Hostinger (`www.chessarcade.com.ar`) con el backend de Vercel.

### **Arquitectura clarificada:**

```
Usuario → www.chessarcade.com.ar (Hostinger)
              ↓
        Juega y gana
              ↓
        JavaScript hace fetch() a Vercel API
              ↓
        https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores
              ↓
        API guarda en Supabase y devuelve rank
              ↓
        JavaScript muestra: "¡Top 10! Rank #3!"
```

**Importante**:
- ❌ Los usuarios NO entran a Vercel
- ✅ Los usuarios solo ven www.chessarcade.com.ar
- ✅ JavaScript hace las llamadas a Vercel "detrás de escena"
- ✅ Todo es transparente para el usuario

---

## 📝 **Tareas Pendientes - Sprint 3:**

### **Fase 1: Crear módulos JavaScript reutilizables** (en Hostinger)

#### **1.1. Crear `js/leaderboard-api.js`**
Wrapper para todas las llamadas a la API de Vercel.

```javascript
// js/leaderboard-api.js

const API_BASE_URL = 'https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores';

/**
 * Envía un score al backend
 * @param {string} game - Nombre del juego ('square-rush', 'knight-quest', etc)
 * @param {string} playerName - Nombre del jugador (1-15 chars)
 * @param {number} score - Puntaje obtenido
 * @param {object} options - Opciones adicionales (level, time_ms, country)
 * @returns {Promise<object>} - Response con rank y mensaje
 */
async function submitScore(game, playerName, score, options = {}) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game,
        player_name: playerName,
        score,
        level: options.level || null,
        time_ms: options.time_ms || null,
        country_code: options.country_code || null,
        country_name: options.country_name || null
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Error al enviar score');
    }

    return data.data; // { id, rank, totalPlayers, message }
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

/**
 * Obtiene el leaderboard de un juego
 * @param {string} game - Nombre del juego
 * @param {object} options - Filtros (limit, offset, country, level)
 * @returns {Promise<object>} - Leaderboard data
 */
async function getLeaderboard(game, options = {}) {
  try {
    const params = new URLSearchParams({
      game,
      limit: options.limit || 50,
      offset: options.offset || 0
    });

    if (options.country) params.append('country', options.country);
    if (options.level) params.append('level', options.level);

    const response = await fetch(`${API_BASE_URL}/leaderboard?${params}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Error al obtener leaderboard');
    }

    return data.data; // { game, scores[], pagination, filters }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Busca jugadores por nombre
 * @param {string} game - Nombre del juego
 * @param {string} playerName - Nombre parcial o completo
 * @returns {Promise<object>} - Search results
 */
async function searchPlayer(game, playerName) {
  try {
    const params = new URLSearchParams({ game, player_name: playerName });
    const response = await fetch(`${API_BASE_URL}/search?${params}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Error al buscar jugador');
    }

    return data.data; // { game, search_term, scores[], stats, found }
  } catch (error) {
    console.error('Error searching player:', error);
    throw error;
  }
}

/**
 * Obtiene los últimos scores de un juego
 * @param {string} game - Nombre del juego
 * @param {number} limit - Cantidad de scores (default 10)
 * @returns {Promise<object>} - Recent scores
 */
async function getRecentScores(game, limit = 10) {
  try {
    const params = new URLSearchParams({ game, limit });
    const response = await fetch(`${API_BASE_URL}/recent?${params}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Error al obtener recent scores');
    }

    return data.data; // { game, scores[], count }
  } catch (error) {
    console.error('Error fetching recent scores:', error);
    throw error;
  }
}

// Exportar funciones (si usas modules) o dejar en scope global
```

#### **1.2. Crear `js/leaderboard-ui.js`**
Componentes UI para mostrar leaderboard.

```javascript
// js/leaderboard-ui.js

/**
 * Muestra un modal con el leaderboard
 * @param {string} game - Nombre del juego
 * @param {array} scores - Array de scores
 */
function showLeaderboardModal(game, scores) {
  // TODO: Crear modal overlay con estilo NeonChess
  // TODO: Tabla con rankings
  // TODO: Tabs por juego
  // TODO: Country flags usando country_code
  // TODO: Botón cerrar
}

/**
 * Renderiza una fila de score en el leaderboard
 * @param {object} score - Score object
 * @returns {string} - HTML string
 */
function renderScoreRow(score) {
  const countryFlag = score.country?.code
    ? `<img src="https://flagcdn.com/16x12/${score.country.code.toLowerCase()}.png" alt="${score.country.name}">`
    : '';

  return `
    <tr class="score-row ${score.rank <= 3 ? 'top-three' : ''}">
      <td class="rank">#${score.rank}</td>
      <td class="player-name">
        <span class="initials">${score.player_name.substring(0, 3)}</span>${score.player_name.substring(3)}
      </td>
      <td class="score">${score.score.toLocaleString()}</td>
      <td class="level">${score.level || '-'}</td>
      <td class="country">${countryFlag}</td>
    </tr>
  `;
}

/**
 * Muestra mensaje de resultado después de submit
 * @param {object} result - Result from submitScore()
 */
function showScoreResult(result) {
  const message = result.rank <= 10
    ? `🎉 ${result.message}`
    : `Score saved! Rank #${result.rank} of ${result.totalPlayers}`;

  // TODO: Toast notification o modal
  console.log(message);
}
```

---

### **Fase 2: Actualizar Victory Screens** (en cada juego)

Para cada juego, actualizar el victory screen para:

#### **2.1. Square Rush** (`games/square-rush/victory-screen.js` o similar)

```javascript
// Después de que el jugador completa el nivel

async function handleVictory(score, level, timeMs) {
  // 1. Mostrar pantalla de victoria inicial
  showVictoryScreen(score);

  // 2. Pedir nombre al jugador
  const playerName = await promptPlayerName(); // Modal con input

  // 3. Enviar score a backend
  try {
    const result = await submitScore('square-rush', playerName, score, {
      level: level,
      time_ms: timeMs
    });

    // 4. Mostrar resultado
    showScoreResult(result);

    // 5. Mostrar botón "Ver Leaderboard"
    showLeaderboardButton('square-rush');

  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar score. Intenta de nuevo.');
  }
}
```

#### **2.2. Knight Quest, Memory Matrix, Master Sequence, ChessFive**
Repetir proceso similar en cada juego.

---

### **Fase 3: Crear Leaderboard Page** (opcional pero recomendado)

Crear `leaderboard.html` en Hostinger:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ChessArcade - Leaderboard</title>
  <link rel="stylesheet" href="css/neonchess.css">
  <script src="js/leaderboard-api.js"></script>
  <script src="js/leaderboard-ui.js"></script>
</head>
<body>
  <div class="container">
    <h1>🏆 Global Leaderboard</h1>

    <!-- Tabs por juego -->
    <div class="tabs">
      <button class="tab active" data-game="square-rush">Square Rush</button>
      <button class="tab" data-game="knight-quest">Knight Quest</button>
      <button class="tab" data-game="memory-matrix">Memory Matrix</button>
      <button class="tab" data-game="master-sequence">Master Sequence</button>
      <button class="tab" data-game="chessinfive">ChessFive</button>
    </div>

    <!-- Tabla de leaderboard -->
    <div id="leaderboard-container">
      <table id="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Level</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody id="leaderboard-body">
          <!-- Rows dinamicas -->
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="pagination">
      <button id="prev-page">← Prev</button>
      <span id="page-info">Page 1</span>
      <button id="next-page">Next →</button>
    </div>
  </div>

  <script>
    // Cargar leaderboard inicial
    let currentGame = 'square-rush';
    let currentOffset = 0;
    const limit = 50;

    async function loadLeaderboard() {
      const data = await getLeaderboard(currentGame, { limit, offset: currentOffset });

      // Renderizar rows
      const tbody = document.getElementById('leaderboard-body');
      tbody.innerHTML = data.scores.map(renderScoreRow).join('');

      // Update pagination
      document.getElementById('page-info').textContent =
        `Page ${Math.floor(currentOffset / limit) + 1}`;
    }

    // Event listeners para tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', async (e) => {
        currentGame = e.target.dataset.game;
        currentOffset = 0;
        await loadLeaderboard();
      });
    });

    // Event listeners para paginación
    document.getElementById('prev-page').addEventListener('click', async () => {
      if (currentOffset > 0) {
        currentOffset -= limit;
        await loadLeaderboard();
      }
    });

    document.getElementById('next-page').addEventListener('click', async () => {
      currentOffset += limit;
      await loadLeaderboard();
    });

    // Load inicial
    loadLeaderboard();
  </script>
</body>
</html>
```

---

### **Fase 4: Styling NeonChess** (CSS)

Crear `css/leaderboard.css` con el estilo NeonChess:

```css
/* css/leaderboard.css */

.leaderboard-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.leaderboard-container {
  background: #0a0a0a;
  border: 2px solid var(--neon-cyan);
  box-shadow: 0 0 20px var(--neon-cyan);
  border-radius: 10px;
  padding: 30px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--neon-cyan);
  font-family: 'Courier New', monospace;
}

.leaderboard-table th {
  text-align: left;
  padding: 10px;
  border-bottom: 2px solid var(--neon-cyan);
  text-transform: uppercase;
  font-size: 14px;
}

.leaderboard-table td {
  padding: 8px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.score-row:hover {
  background: rgba(0, 255, 255, 0.1);
}

.score-row.top-three {
  background: rgba(255, 215, 0, 0.1);
}

.score-row.top-three .rank {
  color: gold;
  font-weight: bold;
  text-shadow: 0 0 10px gold;
}

.player-name .initials {
  font-weight: bold;
  color: var(--neon-pink);
  text-shadow: 0 0 5px var(--neon-pink);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  background: transparent;
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab:hover {
  background: rgba(0, 255, 255, 0.2);
}

.tab.active {
  background: var(--neon-cyan);
  color: black;
  font-weight: bold;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.pagination button {
  background: transparent;
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  background: var(--neon-cyan);
  color: black;
  box-shadow: 0 0 15px var(--neon-cyan);
}

.pagination button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
```

---

## 🗂️ **Estructura de Archivos Final:**

### **En Hostinger (via FTP):**
```
public_html/
├── index.html
├── leaderboard.html              ← NUEVO
├── games/
│   ├── square-rush/
│   │   ├── index.html
│   │   ├── game.js
│   │   └── victory-screen.js     ← MODIFICAR
│   ├── knight-quest/
│   │   └── victory-screen.js     ← MODIFICAR
│   ├── memory-matrix/
│   │   └── victory-screen.js     ← MODIFICAR
│   ├── master-sequence/
│   │   └── victory-screen.js     ← MODIFICAR
│   └── chessfive/
│       └── victory-screen.js     ← MODIFICAR
├── css/
│   ├── neonchess.css
│   └── leaderboard.css           ← NUEVO
└── js/
    ├── leaderboard-api.js        ← NUEVO
    └── leaderboard-ui.js         ← NUEVO
```

### **En GitHub/Vercel (ya está):**
```
Multiajedrez 2025/
├── api/scores/                   ✅ YA ESTÁ
├── ARQUITECTURA.md               ✅ YA ESTÁ
├── GUIA_DEPLOYMENT.md            ✅ YA ESTÁ
├── RESUMEN_DEPLOYMENT.md         ✅ YA ESTÁ
├── TESTING.md                    ✅ YA ESTÁ
└── CONTINUACION_SPRINT3.md       ✅ ESTE ARCHIVO
```

---

## 📋 **Checklist Sprint 3:**

### **Preparación:**
- [ ] Leer `ARQUITECTURA.md` para entender separación Frontend/Backend
- [ ] Verificar que backend sigue funcionando (curl tests)
- [ ] Crear branch nueva: `git checkout -b feature/frontend-leaderboard`

### **Desarrollo:**
- [ ] Crear `js/leaderboard-api.js` con las 4 funciones
- [ ] Crear `js/leaderboard-ui.js` con componentes UI
- [ ] Crear `css/leaderboard.css` con estilos NeonChess
- [ ] Crear `leaderboard.html` (página dedicada)
- [ ] Actualizar victory screen de Square Rush
- [ ] Actualizar victory screen de Knight Quest
- [ ] Actualizar victory screen de Memory Matrix
- [ ] Actualizar victory screen de Master Sequence
- [ ] Actualizar victory screen de ChessFive

### **Testing Local:**
- [ ] Abrir archivos HTML localmente en browser
- [ ] Testear submit score desde cada juego
- [ ] Verificar que leaderboard.html muestra datos
- [ ] Testear tabs (cambiar entre juegos)
- [ ] Testear paginación
- [ ] Testear búsqueda de jugadores

### **Upload a Hostinger:**
- [ ] Conectar via FTP a Hostinger
- [ ] Subir nuevos archivos (leaderboard-api.js, leaderboard-ui.js, leaderboard.css, leaderboard.html)
- [ ] Subir archivos modificados (victory-screen.js de cada juego)
- [ ] Testear en www.chessarcade.com.ar

### **Testing End-to-End:**
- [ ] Jugar Square Rush en producción → Submit score → Ver rank
- [ ] Jugar Knight Quest en producción → Submit score → Ver rank
- [ ] Abrir www.chessarcade.com.ar/leaderboard.html → Ver datos
- [ ] Testear desde diferentes dispositivos (mobile, desktop)
- [ ] Verificar que datos se guardan en Supabase

### **Finalización:**
- [ ] Merge a main: `git merge feature/frontend-leaderboard --no-ff`
- [ ] Push a GitHub: `git push origin main`
- [ ] Actualizar `RESUMEN_DEPLOYMENT.md` con Sprint 3 completado
- [ ] Celebrar 🎉

---

## 🔗 **Links Importantes:**

### **Production URLs:**
- **Frontend**: https://www.chessarcade.com.ar
- **Backend API**: https://chessarcade-ka1ycvulb-claudios-projects.vercel.app
- **Leaderboard Page**: https://www.chessarcade.com.ar/leaderboard.html (después de Sprint 3)

### **Dashboards:**
- **Vercel**: https://vercel.com/dashboard/claudios-projects/chessarcade
- **Supabase**: https://supabase.com/dashboard/project/eyuuujpwvgmpajrjhnah
- **GitHub**: https://github.com/fasmote/ChessArcade
- **Hostinger FTP**: (usar FileZilla o cliente FTP)

---

## 💡 **Tips para Sprint 3:**

1. **Empezar simple**: Implementar primero en Square Rush solamente, testear bien, luego replicar a los demás juegos.

2. **Testing local**: Abrir los HTML localmente en el browser (file:///) para testear, pero recordar que fetch() puede tener problemas de CORS. En ese caso, testear directo en Hostinger.

3. **Country detection**: Por ahora, dejar `country_code` y `country_name` como `null` al hacer submit. Más adelante se puede agregar detección de país con API como `https://ipapi.co/json/`.

4. **Error handling**: Siempre usar try/catch en las llamadas a la API y mostrar mensajes amigables al usuario.

5. **Rate limiting**: El backend tiene rate limiting (10 req/min para submit). Si testeas mucho, vas a recibir 429. Espera 1 minuto y continúa.

6. **CSS conflicts**: Si hay conflictos con `neonchess.css`, usar clases específicas como `.leaderboard-modal`, `.leaderboard-table`, etc.

---

## 📚 **Documentación de Referencia:**

Antes de comenzar Sprint 3, leer:
1. `ARQUITECTURA.md` - Entender separación Frontend/Backend
2. `TESTING.md` - Ver ejemplos de llamadas a la API
3. `api/scores/README.md` - Documentación de endpoints

---

**Última actualización**: 2025-11-06 19:45 ART
**Estado**: Documentación completa para Sprint 3 ✅
**Próximo paso**: Comenzar desarrollo Frontend Integration

¡Listo para continuar! 🚀
