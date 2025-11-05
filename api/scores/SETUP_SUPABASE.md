# ChessArcade Leaderboard Backend - Setup con Supabase

Sistema de leaderboard con **Supabase (Postgres)** + **Vercel KV (Redis)**.

## 🎯 Stack Final

- **Database**: Supabase Postgres (mejor free tier que Vercel)
- **Rate Limiting**: Vercel KV (Redis)
- **Backend**: Vercel Serverless Functions

---

## 📋 Setup Paso a Paso

### 1. Tu Proyecto Supabase (Ya Creado ✅)

Ya creaste el proyecto desde Vercel Marketplace. Ahora necesitas:

#### 1.1 Obtener la Connection String

1. Ve a tu proyecto en https://supabase.com/dashboard
2. Click en **Settings** (engranaje abajo a la izquierda)
3. Click en **Database**
4. Busca la sección **Connection string**
5. Selecciona **URI** mode
6. Copia el string que dice:
   ```
   postgres://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

**Importante:** Reemplaza `[YOUR-PASSWORD]` con la contraseña que elegiste al crear el proyecto.

#### 1.2 Ejecutar el Schema SQL

**Opción A: Desde Supabase Dashboard (Recomendado)**

1. En tu proyecto Supabase → **SQL Editor** (ícono de base de datos)
2. Click en **New query**
3. Pega el contenido completo de `api/scores/schema.sql`
4. Click en **Run** (o Ctrl+Enter)
5. Deberías ver: `Success. No rows returned`

**Opción B: Desde tu código local**

Usa el connection string de Supabase:

```javascript
// test-supabase.js
import postgres from 'postgres';
import fs from 'fs';

const sql = postgres('TU_CONNECTION_STRING_AQUI');

const schema = fs.readFileSync('./api/scores/schema.sql', 'utf8');
await sql.unsafe(schema);
console.log('✅ Schema creado exitosamente!');
```

---

### 2. Configurar Vercel KV (Redis)

Vercel KV SÍ está disponible directamente en Vercel (no necesita marketplace).

#### 2.1 Crear KV Store

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto ChessArcade
3. Tab **Storage**
4. Click **Create Database**
5. Selecciona **KV** (con el logo de Redis)
6. Configuración:
   - **Name**: `chessarcade-ratelimit`
   - **Region**: Elige la más cercana (ej: `us-east-1`)
   - **Plan**: Hobby (Free)
7. Click **Create**

#### 2.2 Conectar KV al Proyecto

1. Después de crear, verás el KV store listado
2. Click en él
3. Tab **Settings**
4. Click en **Connect to Project**
5. Selecciona tu proyecto ChessArcade
6. Click **Connect**

Vercel automáticamente agregará estas variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

---

### 3. Configurar Variables de Entorno en Vercel

Ahora necesitas agregar la connection string de Supabase a Vercel.

#### 3.1 Desde Vercel Dashboard

1. Tu proyecto → **Settings**
2. Tab **Environment Variables**
3. Agregar cada una:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgres://postgres.[ref]:[password]@...` | Production, Preview, Development |
| `DIRECT_URL` | Mismo que DATABASE_URL | Production, Preview, Development |

**Nota:** Usa el connection string de Supabase que copiaste antes.

#### 3.2 Desde CLI (Alternativa)

```bash
vercel env add DATABASE_URL
# Pega tu connection string cuando te lo pida
# Selecciona: Production, Preview, Development (todos)

vercel env add DIRECT_URL
# Pega el mismo connection string
# Selecciona: Production, Preview, Development
```

---

### 4. Actualizar el Código para Usar Supabase

Necesitamos cambiar de `@vercel/postgres` a una librería compatible con Supabase.

#### 4.1 Instalar `postgres` (mejor para Supabase)

```bash
npm install postgres
npm uninstall @vercel/postgres
```

#### 4.2 Actualizar package.json

```json
{
  "dependencies": {
    "postgres": "^3.4.3",
    "@vercel/kv": "^1.0.1"
  }
}
```

#### 4.3 Crear Utility para Conexión

Crea `api/scores/db.js`:

```javascript
import postgres from 'postgres';

// Connection string desde env var
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL not found in environment variables');
}

// Crear conexión con pooling
export const sql = postgres(connectionString, {
  max: 10,              // 10 conexiones máximo
  idle_timeout: 20,     // Cerrar conexiones idle después de 20s
  connect_timeout: 10,  // Timeout de conexión 10s
});

export default sql;
```

---

### 5. Verificar Setup

#### 5.1 Test Local (Desarrollo)

Crea `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
DIRECT_URL=postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Estas las obtienes después de crear KV
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

#### 5.2 Test de Conexión a Supabase

Crea `test-db.js`:

```javascript
import sql from './api/scores/db.js';

try {
  // Test 1: Conexión básica
  const result = await sql`SELECT NOW()`;
  console.log('✅ Supabase conectado:', result[0]);

  // Test 2: Contar scores
  const count = await sql`SELECT COUNT(*) as total FROM scores`;
  console.log(`📊 Total scores en DB: ${count[0].total}`);

  // Test 3: Verificar estructura
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  console.log('📋 Tablas existentes:', tables.map(t => t.table_name));

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
```

Ejecuta:
```bash
node test-db.js
```

Deberías ver:
```
✅ Supabase conectado: { now: 2025-11-04T... }
📊 Total scores en DB: 0
📋 Tablas existentes: [ 'scores' ]
```

#### 5.3 Test de Conexión a KV

```javascript
import { kv } from '@vercel/kv';

try {
  await kv.set('test', 'Hello from KV!');
  const value = await kv.get('test');
  console.log('✅ Vercel KV conectado:', value);

  await kv.del('test');
  process.exit(0);
} catch (error) {
  console.error('❌ Error KV:', error.message);
  process.exit(1);
}
```

---

### 6. Desplegar a Vercel

```bash
# Asegúrate de estar en el proyecto correcto
vercel link

# Deploy a producción
vercel --prod
```

Vercel automáticamente:
1. Lee las env vars que configuraste
2. Conecta con Supabase
3. Conecta con KV
4. Deploy exitoso ✅

---

## 🆓 Free Tier Comparison

### Supabase (Free Tier) - MEJOR QUE VERCEL POSTGRES

| Feature | Supabase | Vercel Postgres |
|---------|----------|-----------------|
| **Storage** | 500 MB | 256 MB |
| **Data Transfer** | 5 GB/mes | 1 GB/mes |
| **Concurrent Connections** | 60 | ~10 |
| **Pauses after inactivity** | Sí (7 días) | No |
| **Dashboard UI** | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐ Bueno |
| **Backups** | No (en free) | No |
| **Extra features** | Auth, Storage, Realtime | - |

**Conclusión:** Supabase tiene el doble de storage y 5x más data transfer. Es mejor opción para el free tier.

### Vercel KV (Free Tier)

- ✅ 256 MB storage
- ✅ 100,000 comandos/día
- ✅ 30 day retention

---

## 🔧 Troubleshooting

### Error: "getaddrinfo ENOTFOUND"

**Causa:** Connection string mal copiado o password incorrecta.

**Solución:**
1. Ve a Supabase → Settings → Database
2. Copia de nuevo el connection string
3. Asegúrate de reemplazar `[YOUR-PASSWORD]` con tu password real
4. Verifica que no haya espacios extra al pegar

### Error: "password authentication failed"

**Causa:** Password incorrecta en el connection string.

**Solución:**
1. Ve a Supabase → Settings → Database
2. Sección **Reset database password**
3. Genera nueva password
4. Actualiza el connection string con la nueva password

### Error: "relation 'scores' does not exist"

**Causa:** Schema SQL no ejecutado.

**Solución:**
1. Ve a Supabase → SQL Editor
2. Pega y ejecuta `schema.sql` completo
3. Verifica con:
   ```sql
   SELECT * FROM scores LIMIT 1;
   ```

### KV no conecta

**Causa:** KV no conectado al proyecto Vercel.

**Solución:**
1. Vercel Dashboard → Storage → KV store
2. Settings → Connect to Project
3. Selecciona ChessArcade
4. Redeploy: `vercel --prod`

---

## 📚 Próximos Pasos

Una vez que tengas:
- ✅ Supabase conectado y schema ejecutado
- ✅ Vercel KV creado y conectado
- ✅ Variables de entorno configuradas
- ✅ Tests pasando (`node test-db.js`)

Continuamos con:
- **Sprint 2**: Implementar middleware y endpoints API

---

## 🔗 Links Útiles

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs - Postgres](https://supabase.com/docs/guides/database)
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [postgres.js Docs](https://github.com/porsager/postgres)
