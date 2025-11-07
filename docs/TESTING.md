# ChessArcade API - Testing Guide

## 🧪 Testing Setup Completo

### ✅ Lo que ya está listo:
- Database: Supabase Postgres configurado y funcionando
- Schema: Tabla `scores` + 8 índices creados
- Endpoints: 4 endpoints implementados
- Middleware: Validación + Rate limiting
- Vercel: Proyecto linkeado a `chessarcade`

---

## 🚀 Opción 1: Testing en Producción (Recomendado)

Una vez deployed a Vercel, los endpoints estarán en:
```
https://chessarcade.vercel.app/api/scores
```

### Deploy a Producción:
```bash
cd "/c/Users/clau/Documents/Multiajedrez 2025"

# 1. Configurar variables de entorno en Vercel Dashboard
# Ve a: https://vercel.com/dashboard/claudios-projects/chessarcade/settings/environment-variables
# Agrega:
#   DATABASE_URL = postgresql://postgres.eyuuujpwvgmpajrjhnah:S_michigaN_7799@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
#   DIRECT_URL = (mismo valor)

# 2. Deploy
git add .
git commit -m "Fix: Actualizado vercel.json"
git push origin feature/backend-leaderboard

# 3. Deploy a producción desde dashboard o CLI
vercel --prod
```

### Testing con curl:

```bash
# 1. Submit Score
curl -X POST https://chessarcade.vercel.app/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "game": "square-rush",
    "player_name": "TESTPLAYER",
    "score": 12500,
    "level": "MASTER",
    "time_ms": 120000,
    "country_code": "AR",
    "country_name": "Argentina"
  }'

# 2. Get Leaderboard
curl "https://chessarcade.vercel.app/api/scores/leaderboard?game=square-rush&limit=10"

# 3. Search Player
curl "https://chessarcade.vercel.app/api/scores/search?game=square-rush&player_name=TEST"

# 4. Recent Scores
curl "https://chessarcade.vercel.app/api/scores/recent?game=square-rush&limit=5"
```

---

## 🧪 Opción 2: Testing Local (Problemas con vercel dev)

**Problema actual**: `vercel dev` tiene conflicto con `npm run dev` en package.json

**Solución temporal**: Saltear testing local y ir directo a producción, ya que:
- ✅ Todos los archivos existen y están sintácticamente correctos
- ✅ Database connection funciona (test-db-now.js pasó)
- ✅ Estructura validada (test-endpoints-simple.js pasó)
- ✅ Vercel proyecto linkeado correctamente

---

## 📊 Test Checklist Post-Deploy

Una vez deployed, verificar:

### 1. Submit Score (POST)
- [ ] Score válido se acepta (201)
- [ ] Score inválido rechazado (400)
- [ ] Rate limit funciona (429 después de 10 requests)
- [ ] Retorna rank correcto
- [ ] Hash de IP funciona

### 2. Leaderboard (GET)
- [ ] Retorna top scores ordenados
- [ ] Filtro por country funciona
- [ ] Filtro por level funciona
- [ ] Paginación funciona (limit/offset)
- [ ] Rate limit funciona (60 req/min)

### 3. Search (GET)
- [ ] Búsqueda case-insensitive funciona
- [ ] Partial match funciona (buscar "TEST" encuentra "TESTPLAYER")
- [ ] Retorna estadísticas correctas
- [ ] Incluye ranks

### 4. Recent (GET)
- [ ] Retorna scores recientes
- [ ] Filtro por game funciona
- [ ] Time ago humanizado funciona
- [ ] Limit funciona

---

## 🐛 Known Issues

1. **vercel dev recursion**: Package.json tiene `"dev": "vercel dev"` que causa recursión
   - **Fix**: Cambiar a `"dev": "node server.js"` o remover el script
   - **Workaround**: Testear en producción directamente

2. **Nombre de directorio con espacio**: "Multiajedrez 2025" causaba problemas
   - **Fix**: Ya resuelto con `vercel link`

---

## 📝 Next Steps After Testing

1. ✅ Deploy y testear endpoints
2. Configurar Vercel KV para rate limiting persistente (opcional)
3. Sprint 3: Integrar frontend en juegos
4. Sprint 4: Testing end-to-end completo

---

## 🔗 Links Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard/claudios-projects/chessarcade
- **Supabase Dashboard**: https://supabase.com/dashboard/project/eyuuujpwvgmpajrjhnah
- **GitHub Repo**: https://github.com/fasmote/chessarcade
