# 🏗️ ChessArcade - Arquitectura del Sistema

## 📋 Visión General

ChessArcade usa una arquitectura **separada** con frontend estático y backend serverless:

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                              │
│                  www.chessarcade.com.ar                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Hostinger)                      │
│  • HTML/CSS/JS estáticos                                     │
│  • 5 juegos interactivos                                     │
│  • Victory screens                                           │
│  • UI components                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ fetch() desde JavaScript
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Vercel Serverless)                 │
│  URL: chessarcade-ka1ycvulb-claudios-projects.vercel.app   │
│  • POST /api/scores - Submit score                           │
│  • GET /api/scores/leaderboard - Top rankings                │
│  • GET /api/scores/search - Búsqueda jugadores               │
│  • GET /api/scores/recent - Últimos scores                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ postgres.js
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                DATABASE (Supabase Postgres)                  │
│  • Tabla: scores                                             │
│  • 8 índices optimizados                                     │
│  • Connection pooler (puerto 6543)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 Separación Frontend/Backend

### **Frontend - Hostinger**
**URL**: `www.chessarcade.com.ar`

**Qué contiene:**
- `index.html` - Homepage
- `games/square-rush/` - Juego 1
- `games/knight-quest/` - Juego 2
- `games/memory-matrix/` - Juego 3
- `games/master-sequence/` - Juego 4
- `games/chessfive/` - Juego 5
- `css/` - Estilos NeonChess
- `js/` - Lógica de juegos
- `articulos/` - Artículos educativos

**Cómo se actualiza:**
- Via FTP a Hostinger
- No requiere rebuild
- Cambios instantáneos

**Lo que los usuarios ven:**
- ✅ www.chessarcade.com.ar (dominio principal)
- ✅ Juegos funcionan normalmente
- ✅ NO ven URLs de Vercel

---

### **Backend - Vercel**
**URL**: `https://chessarcade-ka1ycvulb-claudios-projects.vercel.app`

**Qué contiene:**
- `api/scores/index.js` - POST endpoint
- `api/scores/leaderboard.js` - GET leaderboard
- `api/scores/search.js` - GET search
- `api/scores/recent.js` - GET recent
- `api/scores/middleware/` - Validación y rate limiting
- `api/scores/db.js` - Conexión Supabase

**Cómo se actualiza:**
- `git push origin main` → auto-deploy en Vercel
- O manual: `vercel --prod`
- Vercel hace rebuild automático

**Lo que los usuarios NO ven:**
- ❌ Esta URL es solo para la API
- ❌ Usuarios nunca entran directamente aquí
- ✅ Solo JavaScript hace fetch() desde Hostinger

---

## 📞 Comunicación Frontend ↔ Backend

### **Ejemplo: Submit Score**

**1. Usuario juega y gana en Hostinger:**
```
www.chessarcade.com.ar/games/square-rush/
↓
Usuario completa nivel → Score: 15000
```

**2. JavaScript en el frontend llama a la API:**
```javascript
// En victory-screen.js (Hostinger)
async function submitScore(playerName, score) {
  try {
    // Llamada a Vercel API
    const response = await fetch('https://chessarcade-ka1ycvulb-claudios-projects.vercel.app/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game: 'square-rush',
        player_name: playerName,
        score: score,
        level: 'MASTER',
        time_ms: 180000,
        country_code: 'AR',
        country_name: 'Argentina'
      })
    });

    const data = await response.json();

    if (data.success) {
      // Mostrar resultado al usuario
      showMessage(`¡Top 10! You're rank #${data.data.rank}!`);
    }
  } catch (error) {
    console.error('Error submitting score:', error);
    showMessage('Error al guardar score. Intenta de nuevo.');
  }
}
```

**3. Vercel API procesa:**
```
Vercel recibe POST → Valida datos → Guarda en Supabase → Devuelve rank
```

**4. Frontend muestra resultado:**
```
Usuario ve: "¡Top 10! You're rank #3!" (en Hostinger)
```

---

## 🔐 CORS (Cross-Origin Resource Sharing)

**Problema**: Hostinger (`chessarcade.com.ar`) llamando a Vercel (dominio diferente)

**Solución**: Headers CORS en todos los endpoints de Vercel

```javascript
// En cada endpoint de Vercel
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

Esto permite que JavaScript desde Hostinger haga `fetch()` a Vercel sin errores.

---

## 🚀 Deployment Workflow

### **Desarrollo Local:**
```bash
# Backend (testing local con Vercel CLI)
cd "C:/Users/clau/Documents/Multiajedrez 2025"
vercel dev --yes --listen 3000
# Test en: http://localhost:3000/api/scores
```

### **Deploy a Producción:**

**Backend (Vercel):**
```bash
# Opción 1: Auto-deploy con GitHub
git add .
git commit -m "Update API"
git push origin main
# → Vercel detecta y deploya automáticamente

# Opción 2: Deploy manual
vercel --prod
```

**Frontend (Hostinger):**
```bash
# Via FTP (FileZilla u otro cliente)
# Conectar a Hostinger FTP
# Subir archivos modificados a public_html/
```

---

## 🗄️ Base de Datos (Supabase)

**Connection String:**
```
postgresql://postgres.eyuuujpwvgmpajrjhnah:[PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

**Por qué pooler (6543)?**
- Vercel Serverless Functions son efímeras
- Pooler maneja conexiones concurrentes eficientemente
- Previene "too many connections" errors

**Tabla principal:**
```sql
scores (
  id, game, player_name, score, level, time_ms,
  country_code, country_name, metadata, created_at, ip_hash
)
```

---

## 📦 Archivos Importantes

### **En Hostinger (Frontend):**
```
public_html/
├── index.html
├── games/
│   ├── square-rush/
│   │   ├── index.html
│   │   ├── game.js
│   │   └── victory-screen.js  ← Aquí agregamos API calls
│   ├── knight-quest/
│   ├── memory-matrix/
│   ├── master-sequence/
│   └── chessfive/
├── css/
│   └── neonchess.css
└── js/
    ├── leaderboard-api.js  ← NUEVO: Wrapper para API calls
    └── leaderboard-ui.js   ← NUEVO: UI components
```

### **En Vercel (Backend):**
```
Multiajedrez 2025/ (GitHub repo)
├── api/
│   └── scores/
│       ├── index.js
│       ├── leaderboard.js
│       ├── search.js
│       ├── recent.js
│       ├── middleware/
│       ├── db.js
│       └── games-config.js
├── package.json
├── vercel.json
└── .env.local (local only, no commitear)
```

---

## 🔒 Seguridad

### **Variables de Entorno (Vercel Dashboard):**
- `DATABASE_URL` - Connection string Supabase
- `DIRECT_URL` - Mismo que DATABASE_URL

### **Archivos NO comiteados (.gitignore):**
```
.env.local
*_PRIVADO.md
*049_supabase*
.vercel/
```

### **Validaciones en Backend:**
- XSS prevention en nombres de jugador
- SQL injection protection (postgres.js)
- Anti-cheat: Max score/time por juego
- Rate limiting: 10 req/min (submit), 60 req/min (queries)

---

## 🎯 Ventajas de esta Arquitectura

### **1. Separación de Responsabilidades**
- Frontend: Solo presentación y UX
- Backend: Solo lógica de negocio y datos

### **2. Escalabilidad**
- Frontend estático = ultra rápido, sin procesamiento servidor
- Backend serverless = escala automáticamente con demanda
- Database pooler = maneja miles de conexiones concurrentes

### **3. Mantenimiento**
- Actualizar juegos (HTML/CSS/JS) → Solo FTP a Hostinger
- Actualizar API/lógica → Git push, Vercel auto-deploys
- Cambios independientes, sin afectar el otro lado

### **4. Costos**
- Hostinger: Plan existente, sin cambios
- Vercel: Free tier (100GB bandwidth, 100 serverless invocations/día)
- Supabase: Free tier (500MB storage, 5GB transfer/mes)
- **Total costo adicional: $0** 💰

### **5. Performance**
- Frontend en Hostinger (servidor físico en Argentina/Brasil)
- API en Vercel (edge network, <100ms latency)
- Database en Supabase São Paulo (región cercana)

---

## 🔜 Sprint 3: Integración

**Lo que vamos a hacer:**

1. **Crear `leaderboard-api.js`** (Hostinger):
   - Wrapper functions para llamar a Vercel API
   - `submitScore()`, `getLeaderboard()`, `searchPlayer()`

2. **Crear `leaderboard-ui.js`** (Hostinger):
   - Componentes UI para mostrar leaderboard
   - Modal/overlay con tabs por juego
   - Score cards con country flags

3. **Actualizar victory screens** en cada juego:
   - Formulario para nombre de jugador
   - Botón "Submit to Leaderboard"
   - Mostrar rank obtenido

4. **Testing end-to-end**:
   - Jugar cada juego desde Hostinger
   - Verificar que scores se guardan en Supabase
   - Verificar que leaderboard muestra datos correctos

---

## 📚 Documentación Relacionada

- `GUIA_DEPLOYMENT.md` - Cómo deployar a Vercel
- `TESTING.md` - Cómo testear la API
- `RESUMEN_DEPLOYMENT.md` - Estado actual del proyecto
- `ERS.md` - Especificación de Requerimientos del Sistema

---

**Versión**: 2.0.0
**Última actualización**: 2025-11-06
**Estado**: Backend deployed ✅, Frontend integration pendiente
