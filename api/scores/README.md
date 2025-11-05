# ChessArcade Leaderboard Backend

Sistema de leaderboard serverless con Vercel Functions + Postgres + KV (Redis).

## 📋 Setup Inicial

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Instalar Dependencias del Proyecto

```bash
cd "C:\Users\clau\Documents\Multiajedrez 2025"
npm install
```

### 3. Login en Vercel

```bash
vercel login
```

Se abrirá tu navegador para autenticarte con GitHub/GitLab/Bitbucket.

## 🗄️ Configurar Vercel Postgres

### 1. Crear Database desde Vercel Dashboard

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto ChessArcade (o créalo si no existe)
3. Ve a la tab **Storage**
4. Click en **Create Database**
5. Selecciona **Postgres**
6. Configuración:
   - **Name**: `chessarcade-scores`
   - **Region**: `Washington D.C. (us-east-1)` (más cercano a usuarios)
   - **Plan**: Hobby (Free)

### 2. Conectar Database al Proyecto

Vercel automáticamente inyectará estas variables de entorno:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` (con pgBouncer para pooling)
- `POSTGRES_URL_NON_POOLING`

### 3. Ejecutar Schema SQL

#### Opción A: Desde Vercel Dashboard

1. En Storage → Postgres → Data tab
2. Pega el contenido de `schema.sql`
3. Click en **Run Query**

#### Opción B: Desde CLI

```bash
# Descargar env vars localmente
vercel env pull .env.local

# Ejecutar schema (requiere psql instalado)
psql $POSTGRES_URL < api/scores/schema.sql
```

#### Opción C: Desde Node.js Script

Crea un archivo `setup-db.js`:

```javascript
import { sql } from '@vercel/postgres';
import fs from 'fs';

const schema = fs.readFileSync('./api/scores/schema.sql', 'utf8');
await sql.query(schema);
console.log('✅ Database schema created successfully!');
```

Ejecuta:
```bash
node setup-db.js
```

## 🔴 Configurar Vercel KV (Redis)

### 1. Crear KV Store desde Vercel Dashboard

1. En tu proyecto → tab **Storage**
2. Click en **Create Database**
3. Selecciona **KV** (Redis)
4. Configuración:
   - **Name**: `chessarcade-ratelimit`
   - **Region**: `Washington D.C. (us-east-1)`
   - **Plan**: Hobby (Free)

### 2. Conectar KV al Proyecto

Vercel automáticamente inyectará estas variables de entorno:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## 🧪 Verificar Setup

### Test de Conexión a Postgres

Crea `test-postgres.js`:

```javascript
import { sql } from '@vercel/postgres';

const result = await sql`SELECT NOW()`;
console.log('✅ Postgres connected:', result.rows[0]);

const count = await sql`SELECT COUNT(*) as total FROM scores`;
console.log(`📊 Total scores in DB: ${count.rows[0].total}`);
```

Ejecuta:
```bash
node test-postgres.js
```

### Test de Conexión a KV

Crea `test-kv.js`:

```javascript
import { kv } from '@vercel/kv';

await kv.set('test', 'Hello from KV!');
const value = await kv.get('test');
console.log('✅ KV connected:', value);
```

Ejecuta:
```bash
node test-kv.js
```

## 🚀 Deploy a Producción

### 1. Deploy Inicial

```bash
vercel --prod
```

Esto:
1. Hace build del proyecto
2. Sube los archivos a Vercel
3. Conecta las databases (Postgres + KV)
4. Genera la URL de producción

### 2. Deploys Siguientes

Cada push a `main` branch en GitHub hará deploy automático si conectaste el repo.

O manualmente:
```bash
vercel --prod
```

## 🔗 Variables de Entorno Locales

Para desarrollo local:

```bash
# Descargar todas las env vars de Vercel
vercel env pull .env.local
```

Esto crea un archivo `.env.local` con:
```
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

**Importante:** `.env.local` ya está en `.gitignore`, nunca lo subas a GitHub.

## 🧪 Desarrollo Local

Inicia el servidor de desarrollo de Vercel:

```bash
vercel dev
```

Esto levanta:
- `http://localhost:3000` - Tu sitio
- `http://localhost:3000/api/scores` - Tus endpoints

Puedes hacer requests con curl o Postman:

```bash
# Test POST score
curl -X POST http://localhost:3000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "game": "square-rush",
    "player_name": "TEST PLAYER",
    "score": 12500,
    "level": "MASTER"
  }'

# Test GET leaderboard
curl http://localhost:3000/api/scores/leaderboard?game=square-rush&limit=10
```

## 📊 Free Tier Limits

### Vercel Postgres (Hobby Plan)
- ✅ 256 MB storage
- ✅ 60 compute hours/month
- ✅ 256 MB RAM
- ✅ 1 GB data transfer/month

### Vercel KV (Hobby Plan)
- ✅ 256 MB storage
- ✅ 100,000 commands/day
- ✅ 30 day retention

### Vercel Functions (Hobby Plan)
- ✅ 100 GB-hours/month
- ✅ 12 concurrent functions
- ✅ 1 million invocations/month

**Nota:** Estos límites son más que suficientes para empezar. Puedes escalar a Pro cuando necesites más.

## 🆘 Troubleshooting

### Error: "POSTGRES_URL is not defined"

**Solución:**
```bash
vercel env pull .env.local
```

### Error: "Connection timeout"

**Causas:**
1. Database no creada en Vercel Dashboard
2. Database no conectada al proyecto
3. Firewall bloqueando conexión

**Solución:**
1. Verifica que el database existe en Storage tab
2. Asegúrate de que esté conectado a tu proyecto
3. Usa `POSTGRES_PRISMA_URL` con pgBouncer

### Error: "KV_REST_API_TOKEN is not defined"

**Solución:**
1. Crea KV store en Vercel Dashboard
2. Conéctalo a tu proyecto
3. Ejecuta `vercel env pull .env.local`

## 📚 Próximos Pasos

Una vez configurado:

1. ✅ Implementar endpoints de API (Sprint 2)
2. ✅ Integrar frontend en juegos (Sprint 3)
3. ✅ Testing y deploy final (Sprint 4)

## 🔗 Links Útiles

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Functions API](https://vercel.com/docs/functions/serverless-functions)
- [ChessArcade Backend Design Doc](../../docs/BACKEND_LEADERBOARD_DESIGN.md)
