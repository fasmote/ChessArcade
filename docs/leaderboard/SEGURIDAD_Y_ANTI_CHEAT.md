# 🛡️ Seguridad y Anti-Cheat en ChessArcade Leaderboard

## 🔓 Estado Actual - Sistema Sin Autenticación

### ⚠️ Vulnerabilidad Conocida

**Cualquiera puede enviar scores falsos** simplemente abriendo la consola del navegador:

```javascript
// Desde la consola de Chrome/Firefox:
await submitScore('square-rush', 'HACKER', 999999999);
```

**¿Por qué funciona?**
- No hay autenticación de usuarios
- No hay verificación de que el score sea legítimo
- El frontend envía el score y el backend lo acepta (si pasa las validaciones)

**Ejemplo real**:
```javascript
// Usuario real juega y saca 15,000 puntos
await submitScore('square-rush', 'JUAN', 15000);  // ✅ Legítimo

// Hacker envía score falso
await submitScore('square-rush', 'HACKER', 99000); // ❌ Trampa (pero funciona)
```

---

## 🛡️ Protecciones Actuales (Limitadas)

### 1. Anti-Cheat Validation

**Archivo**: `api/scores/games-config.js`

```javascript
'square-rush': {
  max_score: 100000,      // Rechaza scores > 100,000
  max_time_ms: 3600000,   // Rechaza tiempos > 1 hora
}
```

**Cómo funciona**:
- Si envías `score: 9999999`, el backend responde: `400 Bad Request - Score too high`
- Previene scores obviamente imposibles

**Limitaciones**:
- ❌ No previene scores falsos pero "creíbles" (ej: 99,000 cuando tu mejor es 5,000)
- ❌ Solo valida el rango, no la legitimidad

### 2. Rate Limiting

**Archivo**: `api/scores/middleware/rate-limit.js`

```javascript
// Límites por IP:
POST /api/scores       → 10 requests por minuto
GET /api/scores/*      → 60 requests por minuto
```

**Cómo funciona**:
- Cuenta requests por IP
- Si excedes el límite: `429 Too Many Requests`

**Limitaciones**:
- ✅ Previene spam masivo
- ❌ No previene scores falsos individuales

---

## 🔐 Soluciones Anti-Cheat (De Menor a Mayor Complejidad)

### Nivel 1: Confianza Ciega (✅ ACTUAL)

**Concepto**: Confiar en que los usuarios son honestos

**Implementación**: Ninguna adicional

**Pros**:
- ✅ Simple y rápido
- ✅ Cero fricción para el usuario
- ✅ Perfecto para comunidades pequeñas

**Contras**:
- ❌ Cualquiera puede hacer trampa
- ❌ Scores falsos contaminan el leaderboard

**Uso recomendado**:
- Proyectos casuales
- Prototipos
- Juegos entre amigos/familia
- Comunidades pequeñas y honestas

---

### Nivel 2: Player ID Simple (🔜 FÁCIL DE IMPLEMENTAR)

**Concepto**: Cada dispositivo tiene un ID único. Un nombre solo puede ser usado por un ID.

#### Implementación Frontend:

```javascript
// js/player-auth.js

/**
 * Obtener o crear Player ID único
 * Se guarda en localStorage y persiste entre sesiones
 */
function getPlayerId() {
  let playerId = localStorage.getItem('player_id');

  if (!playerId) {
    // Generar ID único: "player_" + timestamp + random
    playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('player_id', playerId);
    console.log('New Player ID created:', playerId);
  }

  return playerId;
}

/**
 * Obtener nombre del jugador guardado
 */
function getPlayerName() {
  return localStorage.getItem('player_name') || '';
}

/**
 * Guardar nombre del jugador
 */
function setPlayerName(name) {
  localStorage.setItem('player_name', name);
}
```

#### Modificar submitScore:

```javascript
// js/leaderboard-api.js

async function submitScore(game, playerName, score, options = {}) {
  const payload = {
    game,
    player_name: playerName,
    score,
    player_id: getPlayerId()  // ✅ Agregar Player ID
  };

  // ... resto del código
}
```

#### Backend Validation:

```sql
-- Agregar columna a la tabla
ALTER TABLE scores ADD COLUMN player_id VARCHAR(100);

-- Índice para búsquedas rápidas
CREATE INDEX idx_player_id ON scores(player_id);
```

```javascript
// api/scores/index.js

// Al recibir un score
const { player_name, player_id } = req.body;

// Verificar si este nombre ya fue usado por OTRO player_id
const existingPlayer = await sql`
  SELECT player_id
  FROM scores
  WHERE player_name = ${player_name}
  LIMIT 1
`;

if (existingPlayer.length > 0) {
  const existingId = existingPlayer[0].player_id;

  if (existingId !== player_id) {
    return res.status(403).json({
      success: false,
      error: `Name "${player_name}" is already registered to another device`
    });
  }
}

// ✅ Si llegamos aquí, el player_id coincide o es un nombre nuevo
```

**Pros**:
- ✅ Previene suplantación de identidad desde OTRO dispositivo
- ✅ Muy fácil de implementar
- ✅ Sin fricción (automático, invisible para el usuario)

**Contras**:
- ❌ Si borrás localStorage, perdés tu identidad
- ❌ No previene scores falsos desde TU PROPIO dispositivo

**Uso recomendado**:
- Comunidades medianas
- Cuando querés "ownership" de nombres
- Balance entre seguridad y simplicidad

---

### Nivel 3: Server-Side Game Validation (🔒 MÁS SEGURO)

**Concepto**: El servidor RE-JUEGA la partida completa para calcular el score real

#### Flujo:

```
1. Usuario juega Square Rush
2. Frontend registra TODOS los movimientos:
   - timestamp de cada click
   - coordenadas clickeadas
   - secuencia completa
3. Frontend encripta los movimientos con firma digital
4. Envía al backend: movimientos + firma
5. Backend:
   a) Verifica la firma (no manipulada)
   b) RE-EJECUTA el juego con esos movimientos
   c) Calcula el score REAL
   d) Guarda el score calculado (no el enviado)
```

#### Implementación:

```javascript
// Frontend - Capturar partida completa
class GameRecorder {
  constructor() {
    this.moves = [];
    this.startTime = Date.now();
    this.seed = generateRandomSeed();
  }

  recordClick(x, y, timestamp) {
    this.moves.push({ x, y, t: timestamp - this.startTime });
  }

  async submitGame(playerName) {
    const gameData = {
      game: 'square-rush',
      seed: this.seed,
      moves: this.moves,
      duration: Date.now() - this.startTime
    };

    // Generar firma digital
    const signature = await generateSignature(gameData, SECRET_KEY);

    // Enviar al backend
    await submitGameResult(playerName, gameData, signature);
  }
}
```

```javascript
// Backend - Validar y re-jugar
async function validateGameResult(gameData, signature) {
  // 1. Verificar firma
  if (!verifySignature(gameData, signature, SECRET_KEY)) {
    throw new Error('Invalid signature - data was tampered');
  }

  // 2. Re-ejecutar el juego
  const game = new SquareRushEngine(gameData.seed);

  for (const move of gameData.moves) {
    game.processClick(move.x, move.y, move.t);
  }

  // 3. Obtener score REAL calculado por el servidor
  const realScore = game.getFinalScore();

  return realScore;
}
```

**Pros**:
- ✅ Casi imposible de hacer trampa
- ✅ El servidor calcula el score (no confía en el cliente)
- ✅ Puede detectar bots/scripts automáticos

**Contras**:
- ❌ MUCHO más complejo de implementar
- ❌ Requiere reescribir la lógica del juego en el backend
- ❌ Más procesamiento en el servidor (costo)
- ❌ Más datos transferidos (movimientos completos)

**Uso recomendado**:
- Juegos competitivos con premios
- Torneos oficiales
- Cuando la integridad es crítica

---

### Nivel 4: Autenticación Real de Usuarios (🔐 MÁXIMA SEGURIDAD)

**Concepto**: Los usuarios deben registrarse y autenticarse para enviar scores

#### Implementación con JWT:

```javascript
// Backend - Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, playerName } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar usuario
  await sql`
    INSERT INTO users (email, password_hash, player_name)
    VALUES (${email}, ${hashedPassword}, ${playerName})
  `;

  res.json({ success: true });
});

// Backend - Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (!user.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user[0].password_hash);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generar JWT token
  const token = jwt.sign(
    { userId: user[0].id, playerName: user[0].player_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, playerName: user[0].player_name });
});

// Backend - Submit Score (requiere token)
app.post('/api/scores', authenticateToken, async (req, res) => {
  const { game, score } = req.body;
  const userId = req.user.userId;  // Del token JWT

  // Guardar score asociado al userId
  await sql`
    INSERT INTO scores (game, user_id, score)
    VALUES (${game}, ${userId}, ${score})
  `;

  res.json({ success: true });
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

```javascript
// Frontend - Login flow
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const { token, playerName } = await response.json();

  // Guardar token
  localStorage.setItem('auth_token', token);
  localStorage.setItem('player_name', playerName);

  return { token, playerName };
}

// Frontend - Submit score con token
async function submitScore(game, score) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ game, score })
  });

  return await response.json();
}
```

#### OAuth (Google/GitHub):

```javascript
// Más fácil para el usuario - no necesita recordar password

// Frontend
function loginWithGoogle() {
  window.location.href = '/api/auth/google';
}

// Backend con Passport.js
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://chessarcade.com.ar/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Buscar o crear usuario
    let user = await sql`SELECT * FROM users WHERE google_id = ${profile.id}`;

    if (!user.length) {
      user = await sql`
        INSERT INTO users (google_id, email, player_name)
        VALUES (${profile.id}, ${profile.emails[0].value}, ${profile.displayName})
        RETURNING *
      `;
    }

    done(null, user[0]);
  }
));
```

**Pros**:
- ✅ Usuarios verificados
- ✅ Perfil persistente
- ✅ Recuperación de cuenta
- ✅ Previene suplantación de identidad
- ✅ OAuth = fácil para el usuario

**Contras**:
- ❌ Fricción (usuario debe registrarse)
- ❌ Complejidad de implementación
- ❌ Mantenimiento de cuentas
- ⚠️ AÚN no previene scores falsos (solo autentica al usuario)

**Uso recomendado**:
- Plataformas grandes
- Cuando necesitás perfiles de usuario
- Cuando hay contenido personalizado
- Combinado con server-side validation

---

## 🎯 Recomendación por Fase

### Fase 1 - MVP (✅ ACTUAL)
**Estado**: Confianza ciega + Anti-cheat básico

**Qué tenés**:
- `max_score` validation
- `max_time_ms` validation
- Rate limiting

**Cuándo usar**:
- Lanzamiento inicial
- Comunidad pequeña (<100 usuarios)
- Testing y feedback

**Riesgo aceptable**: Si alguien hace trampa, será obvio y fácil de moderar manualmente

---

### Fase 2 - Crecimiento (🔜 RECOMENDADO)
**Agregar**: Player ID Simple

**Cuándo implementar**:
- Cuando llegues a 100+ usuarios activos
- Cuando empiecen a aparecer nombres duplicados
- Cuando necesites "ownership" de nombres

**Esfuerzo**: 2-3 horas de desarrollo

**Beneficio**: Previene el 80% de los problemas con el 20% del esfuerzo

---

### Fase 3 - Competitivo (⏳ FUTURO)
**Agregar**: Server-Side Validation

**Cuándo implementar**:
- Cuando hagas torneos con premios
- Cuando la comunidad sea muy competitiva
- Cuando los stakes sean altos

**Esfuerzo**: 1-2 semanas de desarrollo por juego

**Beneficio**: Anti-cheat casi perfecto

---

### Fase 4 - Plataforma (⏳ LARGO PLAZO)
**Agregar**: Autenticación Real

**Cuándo implementar**:
- Cuando necesites perfiles de usuario
- Cuando agregues features sociales
- Cuando vendas contenido/items

**Esfuerzo**: 2-4 semanas

**Beneficio**: Experiencia completa de plataforma

---

## 🕵️ Detección de Anomalías (Bonus)

Podés agregar detección automática de scores sospechosos:

```javascript
// Backend - Detección de anomalías
async function checkForAnomalies(game, playerName, score) {
  // 1. Obtener estadísticas del juego
  const stats = await sql`
    SELECT
      AVG(score) as avg_score,
      MAX(score) as max_score,
      STDDEV(score) as std_dev
    FROM scores
    WHERE game = ${game}
  `;

  const { avg_score, max_score, std_dev } = stats[0];

  // 2. Score es > 10x el promedio?
  if (score > avg_score * 10) {
    await flagForReview(game, playerName, score, 'Too high vs average');
  }

  // 3. Score es > 3 desviaciones estándar?
  if (score > avg_score + (std_dev * 3)) {
    await flagForReview(game, playerName, score, 'Statistical outlier');
  }

  // 4. Jugador mejoró >500% en poco tiempo?
  const recentScores = await sql`
    SELECT score
    FROM scores
    WHERE game = ${game} AND player_name = ${playerName}
    ORDER BY created_at DESC
    LIMIT 5
  `;

  if (recentScores.length > 0) {
    const previousBest = Math.max(...recentScores.map(s => s.score));
    const improvement = (score - previousBest) / previousBest;

    if (improvement > 5) {  // 500% mejora
      await flagForReview(game, playerName, score, 'Suspicious improvement');
    }
  }
}

async function flagForReview(game, playerName, score, reason) {
  await sql`
    INSERT INTO flagged_scores (game, player_name, score, reason, status)
    VALUES (${game}, ${playerName}, ${score}, ${reason}, 'pending')
  `;

  // Enviar notificación a admin
  sendAdminNotification(`Suspicious score: ${playerName} - ${score} (${reason})`);
}
```

**Dashboard de moderación**:
```javascript
// Ver scores flagged
SELECT * FROM flagged_scores WHERE status = 'pending';

// Aprobar score
UPDATE flagged_scores SET status = 'approved' WHERE id = 123;

// Rechazar y eliminar score
DELETE FROM scores WHERE id = 456;
UPDATE flagged_scores SET status = 'rejected' WHERE id = 456;
```

---

## 📊 Comparación de Métodos

| Método | Seguridad | Complejidad | Fricción Usuario | Costo Servidor |
|--------|-----------|-------------|------------------|----------------|
| Confianza Ciega | ⭐ | ⭐ | ⭐⭐⭐⭐⭐ | $ |
| Player ID | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | $ |
| Server Validation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$$ |
| Autenticación | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | $$ |

---

## 🎓 Lecciones Importantes

### 1. **No existe seguridad perfecta en el cliente**
Todo lo que corre en el navegador puede ser manipulado. La única seguridad real es validación server-side.

### 2. **Balance seguridad vs UX**
Más seguridad = más fricción. Encontrá el balance correcto para tu caso de uso.

### 3. **Moderación humana es poderosa**
Con una comunidad pequeña, un admin mirando el leaderboard puede detectar trampa fácilmente.

### 4. **Empezá simple, mejorá gradualmente**
No necesitás autenticación desde día 1. Agregala cuando la necesites.

### 5. **La comunidad se auto-regula**
Si tenés una buena comunidad, ellos mismos reportarán cheaters.

---

## 📚 Recursos Adicionales

- **JWT Authentication**: https://jwt.io/introduction
- **bcrypt Password Hashing**: https://github.com/kelektiv/node.bcrypt.js
- **Passport.js (OAuth)**: http://www.passportjs.org/
- **Rate Limiting**: https://github.com/animir/node-rate-limiter-flexible
- **OWASP Security**: https://owasp.org/www-project-web-security-testing-guide/

---

**Fecha Creación**: 2025-11-06
**Versión Actual**: v2.0.0 - Sin autenticación
**Próxima Versión**: v2.1.0 - Player ID Simple (recomendado)

🎮 **Remember**: El mejor anti-cheat es una comunidad que juega por diversión, no por ranking. 🏆
