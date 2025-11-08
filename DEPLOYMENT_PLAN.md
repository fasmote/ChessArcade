# 🚀 ChessArcade - Plan de Deployment y Arquitectura

## 📋 **Arquitectura Actual** (Enero 2025)

### **Frontend → Hostinger**
- **Dominio**: `chessarcade.com.ar`
- **Servidor**: Hostinger (archivos estáticos)
- **IP**: 31.170.160.184
- **Contenido**: HTML, CSS, JavaScript, assets
- **Razón**: Hosting ya pagado, quiero usar el dominio

### **Backend → Vercel**
- **Framework**: Node.js Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **API Endpoints**: `/api/scores/*`
- **URL Producción**: Ver sección de URLs más abajo
- **Razón**: Gratis, fácil deployment, integra bien con Supabase

### **Comunicación Frontend ↔ Backend**
- Frontend (Hostinger) hace requests CORS a Backend (Vercel)
- URLs hardcodeadas en `js/leaderboard-api.js`

---

## 🔮 **Plan Futuro** (Cuando haya presupuesto)

### **Servidor Privado VPS**
- **Objetivo**: Migrar TODO (frontend + backend + DB) a un servidor privado
- **Razón**: Mayor control, mejor rendimiento, un solo lugar
- **Estado**: **Pendiente** - Esperando presupuesto
- **Nota**: Aunque es barato, actualmente no hay presupuesto disponible

---

## 💰 **Monetización**

### **Google AdSense**
- **Estado**: **Pendiente Aprobación** (Enero 2025)
- **Objetivo**: Agregar publicidad al sitio
- **Acción Requerida**: Esperar aprobación de Google
- **Nota para Claude**: NO eliminar espacios reservados para ads en el HTML/CSS

---

## 🔧 **Configuración Técnica**

### **Variables de Entorno** (Vercel)
```bash
DATABASE_URL=postgresql://...          # Supabase connection string
DIRECT_URL=postgresql://...            # Supabase direct connection (optional)
```

### **URLs del Backend** (Vercel)

#### **Producción Permanente** (NO CAMBIA)
```
https://chessarcade.vercel.app
```
👆 **Usar esta URL en el código de producción**

#### **Deployment Previews** (CAMBIAN)
```
https://chessarcade-[hash]-claudios-projects.vercel.app
```
⚠️ **NO usar estas URLs en código de producción** - solo para testing

### **API Endpoints**
```
POST   /api/scores              # Submit score
GET    /api/scores/leaderboard  # Get top scores
GET    /api/scores/search       # Search by player
GET    /api/scores/recent       # Recent submissions
```

### **Admin Panel**
```
/api/admin                      # Admin UI
/api/admin/backup               # Database backup
/api/admin/scores               # Manage scores
```

---

## 📝 **Configuración del Código para Producción**

### **Archivo**: `js/leaderboard-api.js`

```javascript
// CONFIGURACIÓN PARA HOSTINGER + VERCEL
const API_BASE_URL = (window.location.hostname === 'localhost' && window.location.port === '3000')
    ? 'http://localhost:3000/api/scores'
    : 'https://chessarcade.vercel.app/api/scores';  // ← URL PERMANENTE DE VERCEL
```

### **CORS en Vercel**
Archivo: `vercel.json`
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://chessarcade.com.ar" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

---

## 🚀 **Proceso de Deployment**

### **Deploy Frontend a Hostinger**
1. Subir archivos vía FTP/SFTP o panel de Hostinger
2. Asegurarse que `js/leaderboard-api.js` apunta a Vercel
3. Verificar que archivos estén en la raíz correcta

### **Deploy Backend a Vercel**
```bash
# Desarrollo local
vercel dev

# Deploy a producción
vercel --prod

# Ver logs
vercel logs chessarcade
```

---

## 🐛 **Troubleshooting Común**

### **Error: "Score too high"**
- ✅ **Solucionado**: Límites actualizados en `api/scores/games-config.js`
- Master Sequence: 100 → 100,000
- Memory Matrix: 50 → 50,000

### **Error: "Failed to fetch" desde Hostinger**
- Verificar CORS configurado en Vercel
- Verificar URL de API en `leaderboard-api.js`
- Verificar que backend esté deployado

### **Error: "Failed to fetch" desde localhost**
- Si usas `http-server` → necesitas apuntar a Vercel
- Si usas `vercel dev` → ya incluye backend

---

## 📅 **Historial de Cambios**

### **2025-01-08**
- ✅ Fix: Corregidos límites de scoring (master-sequence, memory-matrix)
- ✅ Fix: Cambiado de URLs hardcoded a sistema flexible
- ✅ Documentado plan de deployment (este archivo)
- 📝 Estado: Frontend en Hostinger + Backend en Vercel (separados)

---

## 🔐 **Credenciales y Accesos**

### **NO compartir en Git:**
- `.env.local` (variables de entorno locales)
- Credenciales de Supabase
- Credenciales de Hostinger

### **Dónde están:**
- Vercel: Variables de entorno en dashboard de Vercel
- Hostinger: Panel de control de Hostinger
- Supabase: Dashboard de Supabase

---

## 📞 **Notas para Futuros Claude Sessions**

### **Contexto Importante:**
1. **Arquitectura es INTENCIONAL** (Frontend + Backend separados)
2. **NO sugerir mover todo a Vercel** (ya se discutió, se prefiere Hostinger por ahora)
3. **Plan futuro es VPS privado** (cuando haya presupuesto)
4. **Google AdSense pendiente** (no eliminar espacios para ads)
5. **URL de Vercel es `chessarcade.vercel.app`** (usar esta en producción)

### **Si el usuario pregunta sobre deployment:**
- Leer este archivo primero
- Respetar la decisión de arquitectura actual
- Solo sugerir VPS si el usuario menciona presupuesto

---

**Última actualización**: 2025-01-08
**Mantenido por**: Fasmote (con ayuda de Claude Code)
