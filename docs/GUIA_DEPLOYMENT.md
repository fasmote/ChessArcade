# ChessArcade Backend - Guía Completa de Deployment

## 📋 Índice
1. [Estado Actual](#estado-actual)
2. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
3. [Deployment a Producción](#deployment-a-producción)
4. [Testing de Endpoints](#testing-de-endpoints)
5. [Troubleshooting](#troubleshooting)
6. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Estado Actual

### ✅ Completado:
- **Database**: Supabase Postgres configurado
  - Tabla `scores` creada
  - 8 índices optimizados
  - Connection string pooler configurado

- **Backend API**: 4 endpoints + 2 middleware implementados
  - `POST /api/scores` - Submit score
  - `GET /api/scores/leaderboard` - Top rankings
  - `GET /api/scores/search` - Búsqueda de jugadores
  - `GET /api/scores/recent` - Últimos scores

- **Vercel**: Proyecto linkeado a `chessarcade`
  - GitHub: https://github.com/fasmote/chessarcade
  - Dashboard: https://vercel.com/dashboard/claudios-projects/chessarcade

### 📦 Branch Actual:
```
feature/backend-leaderboard
```

### 🔒 Archivos Sensibles Protegidos:
- `.env.local` - Connection strings locales
- `ESTADO_BACKEND_PRIVADO.md` - Documentación con passwords
- `*049_supabase*` - Screenshots con credenciales
- `.vercel/` - Configuración de Vercel

---

## 🔐 Configuración de Variables de Entorno

### Paso 1: Acceder al Dashboard de Vercel

1. Ve a: https://vercel.com/dashboard
2. Login si es necesario
3. Busca el proyecto **chessarcade** (o click en el link directo del estado actual)
4. Click en el proyecto para abrirlo

### Paso 2: Navegar a Environment Variables

1. En el proyecto, click en **Settings** (arriba)
2. En el sidebar izquierdo, click en **Environment Variables**

### Paso 3: Agregar DATABASE_URL

1. Click en **Add New**
2. Llena el formulario:

**Name:**
```
DATABASE_URL
```

**Value:** (copiar exactamente, reemplazando `[PASSWORD]` con la password real)
```
postgresql://postgres.eyuuujpwvgmpajrjhnah:[PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

**Nota**: La password está en el archivo `ESTADO_BACKEND_PRIVADO.md` (búscala como `S_michigaN_7799`)

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

3. Click **Save**

### Paso 4: Agregar DIRECT_URL

Repetir el mismo proceso para la segunda variable:

**Name:**
```
DIRECT_URL
```

**Value:** (mismo que DATABASE_URL)
```
postgresql://postgres.eyuuujpwvgmpajrjhnah:[PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

4. Click **Save**

### ✅ Verificación

Deberías ver 2 variables en la lista:
- `DATABASE_URL` - Visible en Production, Preview, Development
- `DIRECT_URL` - Visible en Production, Preview, Development

---

## 🚀 Deployment a Producción

### Opción A: Deploy desde CLI (Recomendado)

**Desde el directorio del proyecto:**

```bash
cd "/c/Users/clau/Documents/Multiajedrez 2025"

# Verificar que estamos en la rama correcta
git branch

# Si no estás en feature/backend-leaderboard:
git checkout feature/backend-leaderboard

# Deploy a producción
vercel --prod
```

**Qué esperar:**
```
Vercel CLI 48.8.2
🔍  Inspect: https://vercel.com/claudios-projects/chessarcade/...
✅  Production: https://chessarcade.vercel.app [2s]
```

### Opción B: Deploy desde Dashboard

1. Ve al dashboard del proyecto: https://vercel.com/dashboard/claudios-projects/chessarcade
2. Tab **Deployments**
3. Click **Deploy** (botón arriba a la derecha)
4. Selecciona la rama: `feature/backend-leaderboard`
5. Click **Deploy**

### Opción C: Deploy automático con GitHub

**Si conectaste GitHub:**

```bash
# Push a GitHub
git push origin feature/backend-leaderboard
```

Vercel detectará el push y deployará automáticamente.

---

## 🧪 Testing de Endpoints

Una vez deployed, tus endpoints estarán en:
```
https://chessarcade.vercel.app/api/scores/*
```

### Test 1: Submit Score (POST)

```bash
curl -X POST https://chessarcade.vercel.app/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "game": "square-rush",
    "player_name": "TESTUSER",
    "score": 15000,
    "level": "MASTER",
    "time_ms": 180000,
    "country_code": "AR",
    "country_name": "Argentina"
  }'
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rank": 1,
    "totalPlayers": 1,
    "score": 15000,
    "player_name": "TESTUSER",
    "game": "square-rush",
    "created_at": "2025-11-06T...",
    "message": "🎉 Top 10! You're rank #1!"
  }
}
```

### Test 2: Get Leaderboard

```bash
curl "https://chessarcade.vercel.app/api/scores/leaderboard?game=square-rush&limit=10"
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": {
    "game": "square-rush",
    "scores": [
      {
        "rank": 1,
        "id": 1,
        "player_name": "TESTUSER",
        "score": 15000,
        "level": "MASTER",
        "time_ms": 180000,
        "country": {
          "code": "AR",
          "name": "Argentina"
        },
        "created_at": "2025-11-06T..."
      }
    ],
    "pagination": {
      "limit": 10,
      "offset": 0,
      "total": 1,
      "hasMore": false
    }
  }
}
```

### Test 3: Search Player

```bash
curl "https://chessarcade.vercel.app/api/scores/search?game=square-rush&player_name=TEST"
```

### Test 4: Recent Scores

```bash
curl "https://chessarcade.vercel.app/api/scores/recent?game=square-rush&limit=5"
```

### Test 5: Validación Anti-Cheat

**Score demasiado alto (debe fallar con 400):**
```bash
curl -X POST https://chessarcade.vercel.app/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "game": "square-rush",
    "player_name": "HACKER",
    "score": 999999999
  }'
```

**Respuesta esperada (400):**
```json
{
  "success": false,
  "error": "Score too high for square-rush. Max: 100000"
}
```

---

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not defined"

**Causa**: Variables de entorno no configuradas en Vercel.

**Solución**:
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Verifica que `DATABASE_URL` y `DIRECT_URL` existan
3. Si no existen, agrégalas siguiendo los pasos de arriba
4. Redeploy el proyecto

### Error: "getaddrinfo ENOTFOUND" o connection timeout

**Causa**: Connection string incorrecto o proyecto Supabase pausado.

**Solución**:
1. Verifica el connection string en Vercel Dashboard
2. Ve a Supabase Dashboard: https://supabase.com/dashboard
3. Verifica que el proyecto esté **Active** (no Paused)
4. Si está pausado, click **Resume project**

### Error: "Invalid game" al submit score

**Causa**: Usando un game name que no existe en `games-config.js`.

**Juegos válidos**:
- `square-rush`
- `knight-quest`
- `memory-matrix`
- `master-sequence`
- `chessinfive`

### Error: Rate limit (429)

**Causa**: Demasiados requests (esto es normal, significa que funciona).

**Límites**:
- Submit: 10 requests por minuto
- Query: 60 requests por minuto

**Solución**: Espera 1 minuto y vuelve a intentar.

---

## 📊 Checklist de Deployment

Usa este checklist para asegurarte de que todo está funcionando:

### Pre-Deployment
- [ ] Variables de entorno configuradas en Vercel
- [ ] Rama `feature/backend-leaderboard` actualizada
- [ ] Sin archivos sensibles en el commit (verificar con `git status`)

### Post-Deployment
- [ ] Deploy exitoso (status 200 en dashboard)
- [ ] Endpoint POST funciona (201 response)
- [ ] Endpoint GET leaderboard funciona (200 response)
- [ ] Endpoint GET search funciona (200 response)
- [ ] Endpoint GET recent funciona (200 response)
- [ ] Validación anti-cheat funciona (400 en score alto)
- [ ] Rate limiting funciona (429 después de muchos requests)

---

## 🔜 Próximos Pasos

### Después de Testing Exitoso:

1. **Merge a master**:
```bash
git checkout master
git merge feature/backend-leaderboard --no-ff -m "Backend: Leaderboard API completo - v2.0.0"
git push origin master
```

2. **Sprint 3: Integración Frontend**
   - Actualizar victory screens en juegos
   - Crear UI components para leaderboard
   - Integrar API calls
   - Testing end-to-end

3. **Optimizaciones Futuras** (Opcional):
   - Configurar Vercel KV para rate limiting persistente
   - Agregar caching de leaderboard (5 minutos)
   - Implementar webhooks para notificaciones
   - Analytics con Vercel Analytics

---

## 📚 Referencias Rápidas

### Connection String Components:
```
postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:PORT/postgres
```

- **Project Ref**: `eyuuujpwvgmpajrjhnah`
- **Password**: Ver `ESTADO_BACKEND_PRIVADO.md`
- **Region**: `aws-1-sa-east-1` (São Paulo, Brasil)
- **Port**: `6543` (pooler, recomendado para serverless)
- **Port alternativo**: `5432` (direct connection, NO usar)

### Game Limits (Anti-Cheat):

| Game | Max Score | Max Time |
|------|-----------|----------|
| square-rush | 100,000 | 1 hora |
| knight-quest | 50,000 | 30 min |
| memory-matrix | 10,000 | 30 min |
| master-sequence | 15,000 | 30 min |
| chessinfive | 50,000 | 45 min |

### Links Importantes:
- **Vercel Project**: https://vercel.com/dashboard/claudios-projects/chessarcade
- **Supabase Project**: https://supabase.com/dashboard/project/eyuuujpwvgmpajrjhnah
- **GitHub Repo**: https://github.com/fasmote/chessarcade
- **Production URL**: https://chessarcade.vercel.app

---

## 🎓 Notas de Aprendizaje

### ¿Por qué usar pooler connection?

El pooler (puerto 6543) es mejor para serverless functions porque:
- Maneja múltiples conexiones concurrentes eficientemente
- Previene "too many connections" errors
- Optimizado para conexiones cortas (como las de Vercel Functions)

### ¿Por qué separar DATABASE_URL y DIRECT_URL?

Aunque usamos el mismo valor para ambas, algunos frameworks (como Prisma) requieren ambas:
- `DATABASE_URL`: Para queries normales (usa pooler)
- `DIRECT_URL`: Para migrations (usa conexión directa en puerto 5432)

En nuestro caso, usamos el pooler para ambas porque no hacemos migrations en runtime.

### ¿Qué hace el anti-cheat?

La validación en `validate.js` verifica:
1. Score no excede el máximo del juego
2. Tiempo no excede el máximo del juego
3. Nombre de jugador es alfanumérico (previene XSS)
4. Level es uno de los válidos
5. Game existe en la configuración

Esto previene que alguien envíe scores imposibles o código malicioso.

---

**Última actualización**: 2025-11-06
**Versión**: 2.0.0
**Branch**: feature/backend-leaderboard
