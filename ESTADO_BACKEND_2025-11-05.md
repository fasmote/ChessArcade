# Estado del Backend ChessArcade - 2025-11-05

## 🎯 Contexto General

Estamos implementando el sistema de **leaderboard backend** para ChessArcade usando:
- **Database**: Supabase Postgres (mejor free tier que Vercel Postgres)
- **Rate Limiting**: Vercel KV (Redis) - pendiente de configurar
- **Backend**: Vercel Serverless Functions
- **Library**: postgres.js (v3.4.3)

## 📍 Estado Actual

### Branch Actual
```
feature/backend-leaderboard
```
(Creada hoy para este desarrollo grande)

### ✅ Completado Hasta Ahora

#### Sprint 1 - Infraestructura Inicial (Completado)
1. **Estructura de carpetas** creada:
   ```
   api/
   └── scores/
       ├── schema.sql          ✅ Tabla scores + 8 índices optimizados
       ├── games-config.js     ✅ Límites anti-cheat por juego
       ├── db.js               ✅ Utility de conexión Supabase
       ├── README.md           ✅ Guía inicial (Vercel Postgres)
       └── SETUP_SUPABASE.md   ✅ Guía adaptada a Supabase
   ```

2. **Archivos de configuración**:
   - `package.json` ✅ - Dependencias: postgres@3.4.3, @vercel/kv@1.0.1
   - `vercel.json` ✅ - Rutas API configuradas
   - `test-db.js` ✅ - Script para probar conexión Supabase
   - `.gitignore` ✅ - Actualizado con patrones de screenshots sensibles
   - `.env.local` ✅ - Connection string con credenciales Supabase

3. **Git commits realizados**:
   - Commit inicial de Sprint 1 (schema, config, docs)
   - Commit de adaptación a Supabase (db.js, SETUP_SUPABASE.md, test-db.js)

### 🔐 Credenciales Configuradas

**Supabase Database**:
- Host: `db.eyuuujpwgpmajrjhnah.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: `S_michigaN_7799`

**Connection String** (ya en `.env.local`):
```
postgresql://postgres:S_michigaN_7799@db.eyuuujpwgpmajrjhnah.supabase.co:5432/postgres
```

**Archivos sensibles protegidos en .gitignore**:
- `*049_supabase*` (screenshots con credenciales)
- `.env.local` (ya estaba protegido)

---

## 📋 Próximos Pasos (Para Mañana)

### Paso 1: Instalar Dependencias
```bash
cd "C:\Users\clau\Documents\Multiajedrez 2025"
npm install
```

Esto instalará:
- `postgres@3.4.3` - Librería para conectar a Supabase
- `@vercel/kv@1.0.1` - Librería para Redis/rate limiting

### Paso 2: Ejecutar Schema SQL en Supabase

**Opción A: Desde Supabase Dashboard (Recomendado)**
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto (el que tiene el host `db.eyuuujpwgpmajrjhnah`)
3. Click en **SQL Editor** (ícono de base de datos en sidebar izquierdo)
4. Click en **New query**
5. Copia y pega el contenido completo de `api/scores/schema.sql`
6. Click en **Run** (o Ctrl+Enter)
7. Deberías ver: `Success. No rows returned`

**Opción B: Desde test-db.js**
El script `test-db.js` ya existe y probará la conexión cuando ejecutes:
```bash
node test-db.js
```

### Paso 3: Probar Conexión
```bash
node test-db.js
```

**Salida esperada**:
```
🔄 Testing Supabase connection...

✅ Test 1: Connection successful
   Current time: 2025-11-05T...

✅ Test 2: Table "scores" exists

✅ Test 3: Query successful
   Total scores in database: 0

✅ Test 4: Found 8 indexes on scores table
   - scores_pkey
   - idx_game_score_desc
   - idx_game_date
   - idx_game_name
   - idx_game_country
   - idx_player_search
   - idx_created_at
   - idx_metadata_gin

🎉 All tests passed!
```

### Paso 4: Configurar Vercel KV (Redis)

**Desde Vercel Dashboard**:
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto ChessArcade
3. Tab **Storage**
4. Click **Create Database**
5. Selecciona **KV** (Redis)
6. Configuración:
   - Name: `chessarcade-ratelimit`
   - Region: `us-east-1` (Washington D.C.)
   - Plan: Hobby (Free)
7. Click **Create**
8. Click en el KV creado → **Settings** → **Connect to Project**
9. Selecciona tu proyecto → **Connect**

Vercel automáticamente agregará estas env vars:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

**Actualizar .env.local**:
```bash
vercel env pull .env.local
```

Esto descargará las nuevas variables KV a tu `.env.local`.

### Paso 5: Commit de Cambios
```bash
git status
git add .gitignore .env.local
git commit -m "Setup: Configuración inicial Supabase + .env.local

- Actualizado .gitignore para excluir screenshots sensibles
- Creado .env.local con connection string de Supabase
- Protegidos archivos 049_supabase* con credenciales

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🗂️ Estructura del Schema (Referencia Rápida)

### Tabla `scores`
```sql
- id (SERIAL PRIMARY KEY)
- game (VARCHAR 50) - 'square-rush', 'knight-quest', etc.
- player_name (VARCHAR 15) - Nombre del jugador
- country_code (VARCHAR 2) - 'US', 'AR', etc.
- country_name (VARCHAR 100) - 'United States', 'Argentina'
- score (INTEGER) - Puntaje
- level (VARCHAR 20) - 'NOVICE', 'MASTER', etc.
- time_ms (INTEGER) - Tiempo en milisegundos
- metadata (JSONB) - Datos extra en JSON
- created_at (TIMESTAMP) - Fecha de creación
- ip_hash (VARCHAR 64) - Hash de IP para anti-spam
```

### 8 Índices Optimizados
1. `idx_game_score_desc` - Leaderboard por juego y puntaje
2. `idx_game_date` - Scores recientes por juego
3. `idx_game_name` - Búsqueda por jugador en un juego
4. `idx_game_country` - Rankings por país
5. `idx_player_search` - Búsqueda de jugadores
6. `idx_created_at` - Ordenamiento temporal
7. `idx_metadata_gin` - Búsqueda en metadata JSON
8. `scores_pkey` - Primary key automática

### Límites Anti-Cheat (games-config.js)

| Juego | Max Score | Max Time |
|-------|-----------|----------|
| Square Rush | 100,000 | 1 hora |
| Knight Quest | 50,000 | 30 min |
| Memory Matrix | 10,000 | 30 min |
| Master Sequence | 15,000 | 30 min |
| ChessFive | 50,000 | 45 min |

---

## 🚀 Siguientes Sprints (Después del Setup)

### Sprint 2: Middleware y Endpoints API
- Crear `api/scores/middleware/rate-limit.js`
- Crear `api/scores/middleware/validate.js`
- Implementar `POST /api/scores` (submit score)
- Implementar `GET /api/scores/leaderboard`
- Implementar `GET /api/scores/search`
- Implementar `GET /api/scores/recent`

### Sprint 3: Integración Frontend
- Actualizar `game-state.js` en cada juego
- Crear `leaderboard-ui.js` para mostrar rankings
- Integrar API calls en victory screens
- Testing end-to-end

### Sprint 4: Deploy y Testing
- Deploy a Vercel production
- Configurar env vars en Vercel Dashboard
- Testing de carga
- Documentación final

---

## 📚 Archivos de Referencia

### Para Continuar Setup
- `api/scores/SETUP_SUPABASE.md` - Guía completa paso a paso
- `test-db.js` - Script de testing de conexión
- `.env.local` - Credenciales locales (NO commitear)

### Para Implementar API
- `api/scores/schema.sql` - Estructura de la base de datos
- `api/scores/games-config.js` - Límites y validaciones
- `api/scores/db.js` - Utility de conexión

### Documentación Técnica
- `api/scores/README.md` - Setup inicial (Vercel Postgres - legacy)
- `BACKEND_LEADERBOARD_DESIGN.md` - Diseño completo del sistema

---

## 🔗 Links Útiles

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Docs**: https://supabase.com/docs/guides/database
- **Vercel KV Docs**: https://vercel.com/docs/storage/vercel-kv
- **postgres.js Docs**: https://github.com/porsager/postgres

---

## 🆘 Troubleshooting

### Error: "DATABASE_URL is not defined"
**Solución**: Asegúrate de estar en el directorio correcto y que `.env.local` existe
```bash
cd "C:\Users\clau\Documents\Multiajedrez 2025"
ls -la .env.local
```

### Error: "Connection timeout"
**Solución**: Verifica el connection string en `.env.local`
- Host: `db.eyuuujpwgpmajrjhnah.supabase.co`
- Puerto: `5432`
- Password: `S_michigaN_7799`

### Error: "relation 'scores' does not exist"
**Solución**: Ejecuta el schema.sql en Supabase SQL Editor (ver Paso 2)

### Error: "node: not found" o "npm: not found"
**Solución**: Asegúrate de tener Node.js instalado
```bash
node --version  # Debe mostrar v18 o superior
npm --version
```

---

## 📝 Notas Importantes

1. **NO commitear** archivos sensibles:
   - `.env.local` (ya protegido)
   - `*049_supabase*` (screenshots, ya protegidos)

2. **Branch actual**: `feature/backend-leaderboard`
   - Mergeará a `master` cuando esté completo y testeado

3. **Free Tier Limits**:
   - Supabase: 500 MB storage, 5 GB/mes transfer
   - Vercel KV: 256 MB storage, 100K commands/día
   - Más que suficiente para empezar

4. **Testing local**:
   - Usa `vercel dev` para probar serverless functions localmente
   - Puerto: `http://localhost:3000`

---

## ✅ Checklist de Continuación

Para mañana, seguir este orden:

- [ ] 1. `npm install` - Instalar dependencias
- [ ] 2. Ejecutar `schema.sql` en Supabase SQL Editor
- [ ] 3. `node test-db.js` - Verificar conexión
- [ ] 4. Crear Vercel KV store en dashboard
- [ ] 5. `vercel env pull .env.local` - Descargar env vars de KV
- [ ] 6. Commit de cambios: `.gitignore` y setup
- [ ] 7. Comenzar Sprint 2: Implementar endpoints API

---

**Última actualización**: 2025-11-05 - Setup inicial completado, listo para npm install
**Branch**: feature/backend-leaderboard
**Directorio**: C:\Users\clau\Documents\Multiajedrez 2025
