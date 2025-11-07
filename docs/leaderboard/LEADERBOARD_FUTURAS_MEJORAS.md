# 🚀 Leaderboard - Futuras Mejoras y Ideas

## 📋 Estado Actual (Sprint 3 - v2.0.0)

### ✅ Funcionalidades Implementadas
- ✅ Sistema completo de leaderboard global
- ✅ 5 juegos integrados (Square Rush, Knight Quest, Memory Matrix, Master Sequence, ChessFive)
- ✅ Test page completo para debugging (`test-leaderboard.html`)
- ✅ Modal con tabs para cada juego
- ✅ Top 3 con medallones 🥇🥈🥉
- ✅ Paginación (50 scores por página)
- ✅ Toast notifications
- ✅ Búsqueda de jugadores
- ✅ Filtros por país (opcional)
- ✅ Filtros por nivel (NOVICE, INTERMEDIATE, ADVANCED, EXPERT, MASTER) - opcional
- ✅ Diseño NeonChess retro arcade
- ✅ Player initials destacados (primeras 3 letras)
- ✅ Anti-cheat validation (max scores, max times)
- ✅ Rate limiting
- ✅ Backend serverless en Vercel
- ✅ Database PostgreSQL en Supabase

---

## 🎯 Mejoras Futuras - Prioridad Alta

### 1. 📱 Leaderboard Local/Sesión (Idea Original de Claudio)

**Concepto**:
Tener una tabla de ranking LOCAL que muestre solo los scores de la sesión actual del dispositivo, además de la tabla global persistente.

**Casos de Uso**:
- Ver todos tus intentos de la sesión actual
- Amigos pasándose el dispositivo: "¡Ahora vos, Juan!"
- Familia jugando en el mismo celular/PC
- Competencia local sin persistencia
- Comparar tu progreso de HOY vs tu mejor histórico

**Características**:
- 🔄 **Temporal**: Se borra cuando:
  - Se cierra el navegador (sessionStorage)
  - Se apaga el dispositivo
  - Se limpia la caché
  - El usuario decide "Clear Session"
- 💾 **Almacenamiento**: localStorage/sessionStorage (no DB)
- 👥 **Multi-jugador local**: Si juegan varios en el mismo dispositivo, todos los scores aparecen
- 📊 **Dual View**: Ver tabla local Y global al mismo tiempo

**Implementación Propuesta**:

#### JavaScript - Almacenamiento Local:
```javascript
// js/local-leaderboard.js

/**
 * Guardar score en leaderboard local (sessionStorage)
 * Solo existe mientras la sesión esté activa
 */
function saveLocalScore(game, playerName, score, timeMs = null, level = null) {
  // Obtener scores locales del juego
  const storageKey = `local_scores_${game}`;
  let localScores = JSON.parse(sessionStorage.getItem(storageKey) || '[]');

  // Agregar nuevo score
  localScores.push({
    player_name: playerName,
    score: score,
    time_ms: timeMs,
    level: level,
    timestamp: new Date().toISOString(),
    device_session_id: getSessionId() // ID único de la sesión
  });

  // Ordenar por score (descendente)
  localScores.sort((a, b) => b.score - a.score);

  // Guardar
  sessionStorage.setItem(storageKey, JSON.stringify(localScores));

  return localScores;
}

/**
 * Obtener leaderboard local
 */
function getLocalLeaderboard(game) {
  const storageKey = `local_scores_${game}`;
  return JSON.parse(sessionStorage.getItem(storageKey) || '[]');
}

/**
 * Limpiar leaderboard local
 */
function clearLocalLeaderboard(game) {
  const storageKey = `local_scores_${game}`;
  sessionStorage.removeItem(storageKey);
}

/**
 * Obtener ID único de sesión (se mantiene durante la sesión)
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}
```

#### UI - Dual Leaderboard View:
```javascript
// Mostrar ambas tablas side-by-side o con tabs

function showDualLeaderboard(game) {
  const modal = createModal();

  modal.innerHTML = `
    <div class="dual-leaderboard">
      <!-- Toggle entre vistas -->
      <div class="view-toggle">
        <button class="active" data-view="local">
          📱 This Device (${getLocalLeaderboard(game).length})
        </button>
        <button data-view="global">
          🌍 Global Leaderboard
        </button>
      </div>

      <!-- Tabla Local -->
      <div class="local-board active">
        <h3>📱 Your Session Scores</h3>
        <p class="session-info">
          Session started: ${getSessionStartTime()}<br>
          <button onclick="clearLocalLeaderboard('${game}')">Clear Session</button>
        </p>
        <div id="local-scores-table"></div>
      </div>

      <!-- Tabla Global -->
      <div class="global-board">
        <h3>🌍 Global Leaderboard</h3>
        <div id="global-scores-table"></div>
      </div>
    </div>
  `;

  renderLocalScores(game);
  renderGlobalScores(game);
}
```

#### Flujo al Finalizar Partida:
```javascript
async function onGameEnd(game, playerName, score, timeMs, level) {
  // 1. Guardar en leaderboard LOCAL (inmediato)
  const localScores = saveLocalScore(game, playerName, score, timeMs, level);
  const localRank = localScores.findIndex(s =>
    s.player_name === playerName &&
    s.score === score &&
    s.timestamp === localScores[localScores.length - 1].timestamp
  ) + 1;

  // 2. Guardar en leaderboard GLOBAL (API call)
  try {
    const globalResult = await submitScore(game, playerName, score, {
      time_ms: timeMs,
      level: level
    });

    // 3. Mostrar resultado con AMBOS rankings
    showVictoryModal({
      score: score,
      localRank: localRank,
      localTotal: localScores.length,
      globalRank: globalResult.rank,
      globalTotal: globalResult.totalPlayers
    });

  } catch (error) {
    // Si falla el global, al menos mostrar el local
    showVictoryModal({
      score: score,
      localRank: localRank,
      localTotal: localScores.length,
      globalRank: null, // No disponible
      globalTotal: null,
      error: 'Could not connect to global leaderboard'
    });
  }
}
```

#### Modal de Victoria con Dual Ranking:
```html
<div class="victory-modal">
  <h2>🎉 Score Submitted!</h2>

  <div class="score-display">
    <span class="score-value">15,000</span> points
  </div>

  <!-- Local Ranking -->
  <div class="local-ranking">
    <h3>📱 This Device</h3>
    <p class="rank-display">
      Rank <span class="rank-number">#2</span>
      of <span class="total-number">5</span> attempts
    </p>
    <small>🏆 Your best today: 18,000</small>
  </div>

  <!-- Global Ranking -->
  <div class="global-ranking">
    <h3>🌍 Worldwide</h3>
    <p class="rank-display">
      Rank <span class="rank-number">#156</span>
      of <span class="total-number">2,847</span> players
    </p>
  </div>

  <button onclick="showDualLeaderboard('square-rush')">
    View Full Leaderboards
  </button>
</div>
```

**Ventajas**:
1. ✅ **Offline-first**: Funciona sin conexión
2. ✅ **Feedback inmediato**: No espera API call
3. ✅ **Contexto local**: "Soy el mejor de mis amigos aquí"
4. ✅ **Motivación**: Ver progreso de la sesión
5. ✅ **Privacy**: No persiste si no quieren
6. ✅ **Fallback**: Si falla API global, al menos hay local

**Opciones de Configuración**:
```javascript
const LOCAL_LEADERBOARD_OPTIONS = {
  storage: 'sessionStorage', // o 'localStorage' para persistir más tiempo
  maxScores: 100,            // Máximo de scores a guardar
  showBestOnly: false,       // Solo mostrar mejor score por jugador
  enableStats: true          // Calcular estadísticas de sesión
};
```

**Estadísticas de Sesión**:
```javascript
function getSessionStats(game) {
  const scores = getLocalLeaderboard(game);

  return {
    totalGames: scores.length,
    bestScore: Math.max(...scores.map(s => s.score)),
    averageScore: scores.reduce((sum, s) => sum + s.score, 0) / scores.length,
    improvement: calculateImprovement(scores),
    playersInSession: [...new Set(scores.map(s => s.player_name))].length
  };
}
```

---

### 2. 👥 Sistema de Grupos/Clanes (Idea Original de Claudio)

**Concepto**:
Permitir que varios jugadores formen un "grupo" o "clan" y tengan su propia tabla de ranking privada/compartida.

**Casos de Uso**:
- Grupo de amigos que juegan juntos
- Escuela/clase que compite entre alumnos
- Familia que quiere ver sus propios rankings
- Torneos privados entre grupos específicos

**Implementación Propuesta**:

#### Base de Datos:
```sql
-- Nueva tabla: groups
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,  -- Código para unirse (ej: "AMIGOS2025")
  created_by VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  max_members INT DEFAULT 50
);

-- Nueva tabla: group_members
CREATE TABLE group_members (
  group_id INT REFERENCES groups(id),
  player_name VARCHAR(50),
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (group_id, player_name)
);
```

#### Funcionalidades:
1. **Crear Grupo**:
   - Nombre del grupo
   - Código único para compartir (auto-generado o custom)
   - Público o privado

2. **Unirse a Grupo**:
   - Ingresar código del grupo
   - Validación de que el jugador existe

3. **Leaderboard por Grupo**:
   - Nuevo endpoint: `/api/scores/group/:groupCode`
   - Muestra solo scores de miembros del grupo
   - Rankings relativos al grupo (no globales)

4. **UI**:
   - Nuevo tab "My Groups" en el modal
   - Dropdown para seleccionar grupo activo
   - Botón "Create Group" / "Join Group"
   - Ver ranking global vs ranking de grupo side-by-side

#### Ejemplo de Flujo:
```
1. Claudio crea grupo "ChessArcade Pros"
2. Sistema genera código: "CARC-2025"
3. Claudio comparte código con amigos
4. Amigos ingresan código y se unen
5. Ahora todos ven 2 rankings:
   - Global (todos los jugadores del mundo)
   - ChessArcade Pros (solo su grupo)
```

---

### 2. 🏆 Estadísticas Personales del Jugador

**Implementar**:
- Dashboard personal con:
  - Total de partidas jugadas
  - Mejor score por juego
  - Score promedio por juego
  - Gráfico de progreso (scores a lo largo del tiempo)
  - Racha actual (streak de días jugando)
  - Comparación con promedios globales

**Endpoint**: `/api/scores/player/:playerName/stats`

---

### 3. 📊 Rankings Alternativos

**Diferentes tipos de leaderboards**:
1. **Daily/Weekly/Monthly**: Reseteo periódico
2. **All-Time**: Histórico completo (ya existe)
3. **Best Average**: Promedio de top 10 scores del jugador
4. **Most Improved**: Mayor mejora en últimos 30 días
5. **Consistency**: Menor desviación estándar entre scores

---

### 4. 🎮 Integración con los Juegos

**Actualmente**: Los juegos NO están integrados (solo test-leaderboard.html)

**Implementar en cada juego**:
```javascript
// Al finalizar partida en cualquier juego
async function onGameEnd(score, timeMs, level) {
  try {
    const result = await submitScore(
      'square-rush',  // game ID
      playerName,      // del localStorage o input
      score,
      { time_ms: timeMs, level: level }
    );

    // Mostrar modal de felicitaciones
    showVictoryModal(result.rank, result.totalPlayers);

    // Opción: "Ver Leaderboard"
    showLeaderboardModal('square-rush');

  } catch (error) {
    console.error('Error submitting score:', error);
  }
}
```

**Archivos a modificar**:
- `games/squarerush/square-rush.js`
- `games/knightquest/knight-quest.js`
- `games/memorymatrix/memory-matrix.js`
- `games/mastersequence/master-sequence.js`
- `games/chessfive/main.js`

---

### 5. 🔐 Autenticación de Jugadores (Opcional)

**Problema Actual**: Cualquiera puede enviar scores con cualquier nombre

**Soluciones**:

#### Opción A: Sistema Simple (Sin passwords)
- Generar "Player ID" único al primer score
- Guardar en localStorage
- Validar que solo ese navegador puede enviar scores con ese nombre
- Cookie/token temporal

#### Opción B: Autenticación Real
- Login con email/password
- OAuth con Google/GitHub
- Verificación de email
- Perfil de jugador editable

---

### 6. 🎨 Mejoras Visuales

1. **Animaciones**:
   - Transición suave cuando cambia de juego
   - Efecto de "subiendo ranking" cuando mejoras posición
   - Confetti cuando logras Top 3
   - Shake effect cuando rompes tu récord personal

2. **Avatares**:
   - Avatar por defecto basado en nombre (iniciales)
   - Selección de avatares pre-diseñados
   - Upload de imagen (si hay autenticación)

3. **Themes**:
   - Modo oscuro / claro
   - Themes por juego (cada juego con su paleta)

---

### 7. 📱 Mejoras Mobile

- Diseño responsive mejorado
- Swipe entre tabs de juegos
- Modal full-screen en móviles
- Touch-friendly buttons

---

### 8. 🔔 Notificaciones y Logros

**Achievements/Logros**:
- 🏅 "First Blood" - Primer score enviado
- 🥇 "King of the Hill" - Alcanzar #1 en cualquier juego
- 🔥 "Hot Streak" - 5 días seguidos jugando
- 🎯 "Perfectionist" - Alcanzar max score en un juego
- 👑 "Master of All" - Top 10 en todos los juegos

**Notificaciones**:
- "Alguien superó tu score en Knight Quest!"
- "¡Nuevo récord personal en Square Rush!"
- "Tu amigo Juan te retó en Memory Matrix"

---

## 🛠️ Mejoras Técnicas

### 9. Optimizaciones Backend

1. **Caching**:
   - Redis/Upstash para cachear leaderboards
   - Invalidación inteligente solo cuando hay nuevo Top 50
   - TTL de 5 minutos para queries frecuentes

2. **Database Optimization**:
   - Índices compuestos: `(game, score DESC)`
   - Particionado por juego
   - Archivado de scores antiguos (>6 meses)

3. **CDN**:
   - Cachear assets estáticos
   - Minimización y compresión

### 10. Testing y Monitoring

1. **Tests**:
   - Unit tests para validaciones
   - Integration tests para endpoints
   - E2E tests para flujo completo

2. **Monitoring**:
   - Vercel Analytics
   - Error tracking (Sentry)
   - Performance monitoring
   - Logs centralizados

---

## 📝 Notas Importantes

### ⚠️ NO DESTRUIR test-leaderboard.html

Este archivo es **CRÍTICO** para:
- Testing rápido de funcionalidades
- Debugging de problemas
- Verificación antes de deployments
- Desarrollo de nuevas features

**Mantener siempre actualizado con**:
- Todos los juegos disponibles
- Todas las funciones de API
- Ejemplos de valores válidos
- Documentación inline

---

## 🗓️ Roadmap Sugerido

### Sprint 4 (Próximo)
- [ ] Integrar leaderboard en los 5 juegos
- [ ] Modal de victoria con rank
- [ ] Estadísticas personales básicas

### Sprint 5
- [ ] Sistema de grupos/clanes (MVP)
- [ ] Create/Join group
- [ ] Group leaderboard

### Sprint 6
- [ ] Rankings alternativos (daily/weekly)
- [ ] Achievements básicos
- [ ] Mejoras visuales (animaciones)

### Sprint 7+
- [ ] Autenticación (opcional)
- [ ] Avatares
- [ ] Notificaciones
- [ ] Mobile app (PWA)

---

## 💡 Ideas Adicionales (Brainstorming)

1. **Modo Torneo**:
   - Torneos con fechas de inicio/fin
   - Premios/badges virtuales
   - Bracket system para eliminatorias

2. **Replays**:
   - Guardar partidas completas
   - Ver replay del mejor score
   - Aprender de los mejores

3. **Desafíos**:
   - Retar a un jugador específico
   - "Beat my score in Square Rush!"
   - Notificación al retado

4. **Social Features**:
   - Comentarios en scores
   - "Like" a jugadas increíbles
   - Compartir en redes sociales

5. **Monetización (Opcional)**:
   - Cosmetic items (avatares premium)
   - Badges especiales
   - Destacar score con color dorado
   - Sin pay-to-win (nunca!)

---

## 📚 Referencias

- **API Docs**: `ARQUITECTURA.md`
- **Backend**: `api/scores/`
- **Frontend**: `js/leaderboard-api.js`, `js/leaderboard-ui.js`
- **Test Page**: `test-leaderboard.html` ⭐ **NO BORRAR**
- **Estilos**: `css/leaderboard.css`

---

**Fecha Creación**: 2025-11-06
**Versión Actual**: v2.0.0
**Próxima Versión**: v2.1.0 (Integración con juegos)

---

🎮 **¡Happy Coding!** 🚀
