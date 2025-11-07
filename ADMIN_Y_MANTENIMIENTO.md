# 🛠️ Admin y Mantenimiento - ChessArcade Leaderboard

## 🗑️ Cómo Resetear Scores

### Opción 1: SQL Directo en Supabase (Más Rápido)

**Para borrar TODOS los scores**:

1. Ir a https://supabase.com/dashboard
2. Seleccionar tu proyecto ChessArcade
3. Click en "SQL Editor" en el menú lateral
4. Ejecutar:
```sql
DELETE FROM scores;
```
5. Click "Run"

**Para borrar solo un juego**:
```sql
DELETE FROM scores WHERE game = 'square-rush';
```

**Para borrar scores de testing**:
```sql
DELETE FROM scores WHERE player_name LIKE 'TEST%';
-- O
DELETE FROM scores WHERE player_name IN ('TESTUSER', 'TEST', 'JORGE');
```

**Para borrar scores bajos (limpieza)**:
```sql
-- Ejemplo: Borrar scores < 1000 en Square Rush
DELETE FROM scores WHERE game = 'square-rush' AND score < 1000;
```

---

### Opción 2: Crear Endpoint de Admin (Más Seguro)

#### Paso 1: Crear el endpoint

**Archivo**: `api/admin/index.js`

```javascript
/**
 * ChessArcade - Admin Endpoint
 *
 * ⚠️ IMPORTANTE: Este endpoint tiene acceso privilegiado
 * Solo debe ser usado por administradores autorizados
 *
 * Acciones disponibles:
 * - reset_all: Borra TODOS los scores
 * - reset_game: Borra scores de un juego específico
 * - backup: Crea backup de todos los scores
 * - restore: Restaura desde backup
 * - stats: Obtiene estadísticas
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, admin_password, game, backup_name } = req.body;

  // ⚠️ SEGURIDAD: Verificar password de admin
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD || admin_password !== ADMIN_PASSWORD) {
    console.warn('Unauthorized admin access attempt');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // ============================================================
    // Acción: RESET ALL
    // ============================================================
    if (action === 'reset_all') {
      const result = await sql`DELETE FROM scores`;

      console.log(`[ADMIN] ALL scores deleted. Count: ${result.count}`);

      return res.json({
        success: true,
        action: 'reset_all',
        deleted: result.count,
        message: `Successfully deleted ${result.count} scores`
      });
    }

    // ============================================================
    // Acción: RESET GAME
    // ============================================================
    if (action === 'reset_game') {
      if (!game) {
        return res.status(400).json({ error: 'game parameter required' });
      }

      const result = await sql`DELETE FROM scores WHERE game = ${game}`;

      console.log(`[ADMIN] Scores deleted for ${game}. Count: ${result.count}`);

      return res.json({
        success: true,
        action: 'reset_game',
        game: game,
        deleted: result.count,
        message: `Successfully deleted ${result.count} scores for ${game}`
      });
    }

    // ============================================================
    // Acción: BACKUP
    // ============================================================
    if (action === 'backup') {
      // Obtener todos los scores
      const scores = await sql`SELECT * FROM scores ORDER BY created_at DESC`;

      // Crear backup en tabla separada
      const backupTable = backup_name || `backup_${Date.now()}`;

      // Guardar en tabla de backups
      await sql`
        INSERT INTO backups (name, data, created_at)
        VALUES (
          ${backupTable},
          ${JSON.stringify(scores)}::jsonb,
          NOW()
        )
      `;

      console.log(`[ADMIN] Backup created: ${backupTable} (${scores.length} scores)`);

      return res.json({
        success: true,
        action: 'backup',
        backup_name: backupTable,
        scores_count: scores.length,
        message: `Backup created with ${scores.length} scores`
      });
    }

    // ============================================================
    // Acción: RESTORE
    // ============================================================
    if (action === 'restore') {
      if (!backup_name) {
        return res.status(400).json({ error: 'backup_name required' });
      }

      // Obtener backup
      const backup = await sql`
        SELECT data FROM backups WHERE name = ${backup_name}
      `;

      if (!backup.length) {
        return res.status(404).json({ error: 'Backup not found' });
      }

      const scores = backup[0].data;

      // OPCIONAL: Borrar scores actuales antes de restaurar
      // await sql`DELETE FROM scores`;

      // Restaurar scores
      for (const score of scores) {
        await sql`
          INSERT INTO scores (
            game, player_name, score, level, time_ms,
            country_code, country_name, metadata, created_at
          ) VALUES (
            ${score.game}, ${score.player_name}, ${score.score},
            ${score.level}, ${score.time_ms}, ${score.country_code},
            ${score.country_name}, ${JSON.stringify(score.metadata)}::jsonb,
            ${score.created_at}
          )
        `;
      }

      console.log(`[ADMIN] Restored from backup: ${backup_name} (${scores.length} scores)`);

      return res.json({
        success: true,
        action: 'restore',
        backup_name: backup_name,
        restored: scores.length,
        message: `Restored ${scores.length} scores from ${backup_name}`
      });
    }

    // ============================================================
    // Acción: STATS
    // ============================================================
    if (action === 'stats') {
      const stats = await sql`
        SELECT
          COUNT(*) as total_scores,
          COUNT(DISTINCT player_name) as unique_players,
          COUNT(DISTINCT game) as games_with_scores,
          MIN(created_at) as first_score,
          MAX(created_at) as last_score
        FROM scores
      `;

      const gameStats = await sql`
        SELECT
          game,
          COUNT(*) as scores_count,
          COUNT(DISTINCT player_name) as players_count,
          MAX(score) as highest_score,
          AVG(score) as average_score
        FROM scores
        GROUP BY game
        ORDER BY scores_count DESC
      `;

      return res.json({
        success: true,
        action: 'stats',
        overall: stats[0],
        by_game: gameStats
      });
    }

    // ============================================================
    // Acción: LIST BACKUPS
    // ============================================================
    if (action === 'list_backups') {
      const backups = await sql`
        SELECT name, created_at,
               jsonb_array_length(data) as scores_count
        FROM backups
        ORDER BY created_at DESC
      `;

      return res.json({
        success: true,
        action: 'list_backups',
        backups: backups
      });
    }

    // Acción no reconocida
    return res.status(400).json({
      error: 'Invalid action',
      valid_actions: ['reset_all', 'reset_game', 'backup', 'restore', 'stats', 'list_backups']
    });

  } catch (error) {
    console.error('[ADMIN] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
```

#### Paso 2: Crear tabla de backups

```sql
-- Ejecutar en Supabase SQL Editor

CREATE TABLE backups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_backups_name ON backups(name);
CREATE INDEX idx_backups_created_at ON backups(created_at DESC);
```

#### Paso 3: Configurar password en Vercel

```bash
# En tu proyecto de Vercel, agregar variable de entorno:
vercel env add ADMIN_PASSWORD
# Ingresar: tu_password_super_secreto_123
```

O desde el dashboard de Vercel:
1. Project Settings → Environment Variables
2. Add: `ADMIN_PASSWORD` = `tu_password_secreto`

---

### Opción 3: Agregar Botón en test-leaderboard.html

Agregar al final de `test-leaderboard.html`:

```html
<!-- Admin Section -->
<div class="test-section" style="border-color: #ff4040;">
  <h2>🔐 ADMIN: Database Management</h2>
  <p style="color: #ff4040; font-weight: bold;">
    ⚠️ DANGER ZONE - Actions here CANNOT be undone!
  </p>

  <div class="input-group">
    <label>Admin Password:</label>
    <input type="password" id="admin-password" placeholder="Enter admin password">
  </div>

  <!-- Reset Scores -->
  <div style="margin: 20px 0; padding: 15px; background: rgba(255,64,64,0.1); border-radius: 8px;">
    <h3 style="margin-top: 0; color: #ff4040;">🗑️ Reset Scores</h3>

    <div class="input-group">
      <label>Game to Reset:</label>
      <select id="reset-game">
        <option value="">-- ALL GAMES --</option>
        <option value="square-rush">Square Rush</option>
        <option value="knight-quest">Knight Quest</option>
        <option value="memory-matrix">Memory Matrix</option>
        <option value="master-sequence">Master Sequence</option>
        <option value="chessinfive">ChessFive</option>
      </select>
    </div>

    <button class="test-btn" style="background: #ff4040; border-color: #ff4040;"
            onclick="adminResetScores()">
      🗑️ DELETE SCORES
    </button>
  </div>

  <!-- Backup & Restore -->
  <div style="margin: 20px 0; padding: 15px; background: rgba(0,255,255,0.1); border-radius: 8px;">
    <h3 style="margin-top: 0; color: #00ffff;">💾 Backup & Restore</h3>

    <div class="input-group">
      <label>Backup Name (optional):</label>
      <input type="text" id="backup-name" placeholder="e.g., before_tournament">
    </div>

    <button class="test-btn" onclick="adminBackup()">
      💾 Create Backup
    </button>

    <button class="test-btn" onclick="adminListBackups()">
      📋 List Backups
    </button>

    <button class="test-btn" onclick="adminRestore()">
      ♻️ Restore from Backup
    </button>
  </div>

  <!-- Stats -->
  <div style="margin: 20px 0; padding: 15px; background: rgba(0,255,255,0.1); border-radius: 8px;">
    <h3 style="margin-top: 0; color: #00ffff;">📊 Statistics</h3>

    <button class="test-btn" onclick="adminStats()">
      📊 Get Stats
    </button>
  </div>

  <div id="admin-output" class="test-output" style="display: none;"></div>
</div>

<script>
const ADMIN_API_URL = 'https://chessarcade-xxx.vercel.app/api/admin';

function getAdminPassword() {
  const password = document.getElementById('admin-password').value;
  if (!password) {
    alert('Please enter admin password');
    return null;
  }
  return password;
}

async function adminAction(action, extraData = {}) {
  const password = getAdminPassword();
  if (!password) return;

  const outputId = 'admin-output';
  document.getElementById(outputId).innerHTML = '';
  document.getElementById(outputId).style.display = 'block';

  log(outputId, `Executing: ${action}...`, 'info');

  try {
    const response = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        admin_password: password,
        ...extraData
      })
    });

    const result = await response.json();

    if (response.ok) {
      log(outputId, 'SUCCESS!', 'success');
      log(outputId, JSON.stringify(result, null, 2), 'success');
    } else {
      log(outputId, `ERROR: ${result.error}`, 'error');
    }

  } catch (error) {
    log(outputId, `ERROR: ${error.message}`, 'error');
  }
}

async function adminResetScores() {
  const game = document.getElementById('reset-game').value;
  const action = game ? `reset scores for ${game}` : 'DELETE ALL SCORES';

  if (!confirm(`Are you SURE you want to ${action}?`)) return;
  if (!confirm('This CANNOT be undone. Continue?')) return;

  await adminAction(
    game ? 'reset_game' : 'reset_all',
    game ? { game } : {}
  );
}

async function adminBackup() {
  const name = document.getElementById('backup-name').value;

  if (!confirm('Create backup of current scores?')) return;

  await adminAction('backup', name ? { backup_name: name } : {});
}

async function adminListBackups() {
  await adminAction('list_backups');
}

async function adminRestore() {
  const name = prompt('Enter backup name to restore:');
  if (!name) return;

  if (!confirm(`Restore from backup "${name}"? This will ADD those scores.`)) return;

  await adminAction('restore', { backup_name: name });
}

async function adminStats() {
  await adminAction('stats');
}
</script>
```

---

## 💾 Sistema de Backups

### ¿Por qué Backups?

1. **Protección contra errores**: Si borrás scores por error, podés restaurar
2. **Testing seguro**: Hacé backup antes de testear, luego restore
3. **Migraciones**: Backup antes de cambios importantes en la DB
4. **Historial**: Mantener snapshots de diferentes momentos

### Flujo Recomendado

```
Antes de hacer algo riesgoso:
1. Crear backup → "backup_before_testing"
2. Hacer cambios/tests
3. Si algo sale mal → Restore from backup
4. Si todo OK → Continuar
```

### Comandos de Backup via API

```javascript
// Crear backup
await fetch('/api/admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'backup',
    backup_name: 'before_tournament_2025',  // Opcional
    admin_password: 'tu_password'
  })
});

// Listar backups
await fetch('/api/admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'list_backups',
    admin_password: 'tu_password'
  })
});

// Restaurar
await fetch('/api/admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'restore',
    backup_name: 'backup_1699999999999',
    admin_password: 'tu_password'
  })
});
```

---

## 📊 Obtener Estadísticas

```javascript
// Via API
await fetch('/api/admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'stats',
    admin_password: 'tu_password'
  })
});

// Respuesta:
{
  "success": true,
  "overall": {
    "total_scores": 234,
    "unique_players": 45,
    "games_with_scores": 5,
    "first_score": "2025-11-06T10:30:00Z",
    "last_score": "2025-11-06T22:15:00Z"
  },
  "by_game": [
    {
      "game": "square-rush",
      "scores_count": 89,
      "players_count": 23,
      "highest_score": 98500,
      "average_score": 15234.5
    },
    // ...
  ]
}
```

---

## 🔒 Seguridad del Admin Endpoint

### ⚠️ Riesgo: Password en GitHub

**Problema**: El código del endpoint está en GitHub público, cualquiera puede ver cómo funciona.

**¿Es peligroso?**
- ❌ NO, si el password está en variable de entorno (Vercel)
- ✅ El password NUNCA debe estar en el código
- ✅ Solo debe estar en: Vercel Environment Variables

**Protección actual**:
```javascript
// ❌ MAL - Password hardcodeado:
const ADMIN_PASSWORD = 'mi_password_123';

// ✅ BIEN - Password en variable de entorno:
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
```

**Cómo funciona**:
1. Password está en Vercel (no en GitHub)
2. Vercel lo inyecta al ejecutar la función
3. Atacante ve el código pero no el password
4. Sin password correcto → `403 Unauthorized`

### Mejoras Futuras de Seguridad

#### 1. IP Whitelist
```javascript
const ALLOWED_IPS = ['tu_ip_casa', 'tu_ip_trabajo'];

if (!ALLOWED_IPS.includes(req.headers['x-forwarded-for'])) {
  return res.status(403).json({ error: 'IP not allowed' });
}
```

#### 2. Time-based Tokens (TOTP)
```javascript
// Usar Google Authenticator
const speakeasy = require('speakeasy');

const token = req.body.totp_token;
const verified = speakeasy.totp.verify({
  secret: process.env.TOTP_SECRET,
  token: token
});

if (!verified) {
  return res.status(403).json({ error: 'Invalid TOTP' });
}
```

#### 3. Rate Limiting Estricto
```javascript
// Solo 5 intentos por hora
const MAX_ADMIN_ATTEMPTS = 5;
const TIMEFRAME = 3600000; // 1 hora

// Implementar contador de intentos fallidos
```

---

## 🚀 Setup Rápido

### 1. Crear Endpoint de Admin

```bash
cd "/c/Users/clau/Documents/Multiajedrez 2025"
mkdir -p api/admin
```

Crear `api/admin/index.js` con el código de arriba.

### 2. Crear Tabla de Backups

Ejecutar en Supabase:
```sql
CREATE TABLE backups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_backups_name ON backups(name);
```

### 3. Configurar Password

```bash
# Opción A: Via CLI
vercel env add ADMIN_PASSWORD

# Opción B: Via Dashboard
# Ir a Vercel → Project → Settings → Environment Variables
```

### 4. Deploy

```bash
vercel --prod
```

### 5. Testear

Agregar sección de admin en `test-leaderboard.html` y probar:
- Reset scores
- Create backup
- List backups
- Restore
- Get stats

---

## 📋 Checklist de Mantenimiento

### Semanal
- [ ] Revisar scores sospechosos (muy altos)
- [ ] Verificar que la API responde correctamente
- [ ] Revisar logs de Vercel para errores

### Antes de Cambios Importantes
- [ ] Crear backup: `backup_before_[descripción]`
- [ ] Anotar el nombre del backup
- [ ] Verificar que el backup se creó: `list_backups`

### Después de Cambios
- [ ] Testear que todo funciona
- [ ] Si algo falló → Restore from backup
- [ ] Si todo OK → Dejar el backup por seguridad

### Mensual
- [ ] Limpiar backups viejos (>30 días)
- [ ] Revisar estadísticas de uso
- [ ] Evaluar necesidad de más anti-cheat

---

## 🎯 Plan de Migración a Servidor Propio

Cuando estés listo para un servidor propio:

### Fase 1: Backup Completo
```javascript
// Descargar todos los scores a JSON
const allScores = await fetch('/api/admin', {
  method: 'POST',
  body: JSON.stringify({
    action: 'backup',
    backup_name: 'migration_to_private_server',
    admin_password: password
  })
});

// Guardar localmente
const scores = await allScores.json();
fs.writeFileSync('scores_backup.json', JSON.stringify(scores, null, 2));
```

### Fase 2: Nuevo Servidor
- Configurar PostgreSQL/MySQL en servidor propio
- Re-crear tablas con mismo schema
- Importar scores desde backup

### Fase 3: Seguridad Mejorada
- Firewall: Solo IPs de Hostinger pueden acceder a API
- VPN: Admin endpoint solo accesible via VPN
- Autenticación real de usuarios
- Backups automáticos diarios

---

## ⚠️ Importante

1. **Nunca commitear passwords** en GitHub
2. **Siempre hacer backup** antes de borrar scores
3. **Documentar cada acción** de admin en un log
4. **Testear restore** antes de confiar en los backups
5. **Revisar regularmente** la seguridad del sistema

---

**Fecha**: 2025-11-06
**Versión**: v2.0.0
**Next**: Implementar endpoint de admin + tabla de backups

🛡️ **Remember**: Con gran poder viene gran responsabilidad. Usá el admin endpoint con cuidado.
