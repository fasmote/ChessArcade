# 🔐 Setup del Sistema de Administración - ChessArcade

## 📋 Pasos para Activar el Admin Endpoint

### 1️⃣ Crear la Tabla `backups` en Supabase

1. Ir al dashboard de Supabase: https://supabase.com/dashboard
2. Seleccionar tu proyecto de ChessArcade
3. En el menú lateral, ir a **SQL Editor**
4. Click en **+ New query**
5. Copiar todo el contenido del archivo `sql/create_backups_table.sql`
6. Pegar en el editor
7. Click en **Run** (o presionar Ctrl+Enter)
8. Verificar que aparece el mensaje: "Success. No rows returned"

**Verificación:**
```sql
SELECT * FROM backups;
```
Debería mostrar una tabla vacía (sin errores).

---

### 2️⃣ Configurar ADMIN_PASSWORD en Vercel

El admin endpoint requiere un password para autorizar operaciones. Este password se guarda como **variable de entorno** en Vercel.

#### Opción A: Via Vercel Dashboard (Recomendado)

1. Ir a: https://vercel.com/dashboard
2. Seleccionar el proyecto: **chessarcade**
3. Ir a **Settings** (en el menú superior)
4. En el menú lateral, ir a **Environment Variables**
5. Click en **Add New**
6. Configurar:
   ```
   Key: ADMIN_PASSWORD
   Value: [TU_PASSWORD_SEGURO]
   ```
   **⚠️ IMPORTANTE**: Elegir un password fuerte, por ejemplo:
   - `ChessArcade2025!Admin`
   - `MyS3cur3P@ssw0rd!`
   - `NeonChess#Admin#2025`

7. En "Environment":
   - ✅ **Production** (obligatorio)
   - ✅ **Preview** (opcional, útil para testing)
   - ✅ **Development** (opcional)

8. Click en **Save**

#### Opción B: Via Vercel CLI (Alternativa)

```bash
# Desde la terminal en la carpeta del proyecto
cd "C:\Users\clau\Documents\Multiajedrez 2025"

# Agregar la variable de entorno
vercel env add ADMIN_PASSWORD

# Cuando pregunte:
# > What's the value of ADMIN_PASSWORD?
# Escribir tu password

# Seleccionar environments:
# > Add ADMIN_PASSWORD to which Environments?
# Seleccionar: Production, Preview, Development
```

---

### 3️⃣ Re-Deploy del Backend a Vercel

Después de agregar la variable de entorno, **DEBES hacer un nuevo deploy** para que Vercel la cargue.

```bash
cd "C:\Users\clau\Documents\Multiajedrez 2025"

# Deploy a producción
vercel --prod --yes
```

Esperar a que termine. Verás algo como:
```
✅ Production: https://chessarcade-xxxx.vercel.app [2s]
```

---

### 4️⃣ Testear el Admin Endpoint

Una vez deployado, testear que funciona:

#### Test 1: Sin password (debe fallar)

```bash
curl -X POST https://chessarcade-xxxx.vercel.app/api/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "stats"}'
```

**Resultado esperado:**
```json
{
  "success": false,
  "error": "Unauthorized. Invalid admin password."
}
```

#### Test 2: Con password incorrecto (debe fallar)

```bash
curl -X POST https://chessarcade-xxxx.vercel.app/api/admin \
  -H "Content-Type: application/json" \
  -d '{
    "action": "stats",
    "admin_password": "wrong_password"
  }'
```

**Resultado esperado:**
```json
{
  "success": false,
  "error": "Unauthorized. Invalid admin password."
}
```

#### Test 3: Con password correcto (debe funcionar)

```bash
curl -X POST https://chessarcade-xxxx.vercel.app/api/admin \
  -H "Content-Type: application/json" \
  -d '{
    "action": "stats",
    "admin_password": "TU_PASSWORD_AQUI"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "action": "stats",
  "data": {
    "total_scores": 42,
    "total_players": 15,
    "total_backups": 0,
    "game_stats": [...],
    "latest_score": {...}
  }
}
```

---

## 🎮 Uso del Admin Endpoint

### URL del Endpoint

```
POST https://chessarcade-xxxx.vercel.app/api/admin
```

Reemplazar `xxxx` con tu URL real de Vercel.

### Formato de Request

Todos los requests deben incluir:
1. **Method**: POST
2. **Header**: `Content-Type: application/json`
3. **Body**: JSON con `action` y `admin_password`

---

## 📊 Acciones Disponibles

### 1. `stats` - Obtener Estadísticas

```json
{
  "action": "stats",
  "admin_password": "TU_PASSWORD"
}
```

**Respuesta:**
```json
{
  "success": true,
  "action": "stats",
  "data": {
    "total_scores": 150,
    "total_players": 45,
    "total_backups": 3,
    "game_stats": [
      {
        "game": "square-rush",
        "scores_count": 50,
        "unique_players": 20,
        "highest_score": 25000,
        "avg_score": 12500
      }
    ],
    "latest_score": {
      "game": "knight-quest",
      "player_name": "ALICE",
      "score": 8500,
      "created_at": "2025-01-15T10:30:00Z"
    }
  }
}
```

---

### 2. `list_backups` - Listar Backups

```json
{
  "action": "list_backups",
  "admin_password": "TU_PASSWORD"
}
```

**Respuesta:**
```json
{
  "success": true,
  "action": "list_backups",
  "data": {
    "backups_count": 2,
    "backups": [
      {
        "backup_name": "backup_2025-01-15",
        "created_at": "2025-01-15T08:00:00Z",
        "scores_count": 120
      },
      {
        "backup_name": "before_reset",
        "created_at": "2025-01-10T15:30:00Z",
        "scores_count": 100
      }
    ]
  }
}
```

---

### 3. `backup` - Crear Backup

```json
{
  "action": "backup",
  "admin_password": "TU_PASSWORD",
  "backup_name": "backup_antes_de_limpiar"
}
```

**Nota**: Si no proporcionas `backup_name`, se genera automáticamente con timestamp.

**Respuesta:**
```json
{
  "success": true,
  "action": "backup",
  "message": "Backup created successfully: backup_antes_de_limpiar",
  "data": {
    "backup_name": "backup_antes_de_limpiar",
    "scores_count": 150,
    "created_at": "2025-01-15T12:00:00Z"
  }
}
```

---

### 4. `reset_game` - Borrar Scores de un Juego

```json
{
  "action": "reset_game",
  "admin_password": "TU_PASSWORD",
  "game": "square-rush"
}
```

**⚠️ PELIGRO**: Esta acción es irreversible. **Hacer backup antes**.

**Respuesta:**
```json
{
  "success": true,
  "action": "reset_game",
  "message": "Successfully deleted 50 scores from square-rush",
  "data": {
    "game": "square-rush",
    "deleted_count": 50
  }
}
```

---

### 5. `reset_all` - Borrar TODOS los Scores

```json
{
  "action": "reset_all",
  "admin_password": "TU_PASSWORD"
}
```

**⚠️ PELIGRO MÁXIMO**: Esta acción borra **TODOS** los scores de **TODOS** los juegos.
**SIEMPRE hacer backup antes**.

**Respuesta:**
```json
{
  "success": true,
  "action": "reset_all",
  "message": "Successfully deleted 150 scores from all games",
  "data": {
    "deleted_count": 150
  }
}
```

---

### 6. `restore` - Restaurar desde Backup

```json
{
  "action": "restore",
  "admin_password": "TU_PASSWORD",
  "backup_name": "backup_antes_de_limpiar"
}
```

**⚠️ IMPORTANTE**: Esto borra todos los scores actuales y los reemplaza con el backup.

**Respuesta:**
```json
{
  "success": true,
  "action": "restore",
  "message": "Successfully restored 150 scores from backup: backup_antes_de_limpiar",
  "data": {
    "backup_name": "backup_antes_de_limpiar",
    "backup_created_at": "2025-01-15T12:00:00Z",
    "restored_count": 150
  }
}
```

---

## 🔒 Seguridad

### ✅ Buenas Prácticas

1. **Password fuerte**: Mínimo 12 caracteres, letras, números y símbolos
2. **No compartir**: Solo los administradores deben conocer el password
3. **Backup antes de reset**: SIEMPRE crear backup antes de borrar datos
4. **Logs**: Vercel guarda logs de todas las acciones admin
5. **HTTPS**: Todas las comunicaciones van encriptadas por HTTPS

### ⚠️ Limitaciones de Seguridad Actuales

Esta es una implementación **básica**. Para producción real considerar:

1. **Rate limiting específico**: El admin endpoint NO tiene rate limiting separado
2. **Audit log**: No hay tabla de auditoría de acciones admin
3. **Multi-factor auth**: Solo password, sin 2FA
4. **IP whitelisting**: Cualquiera con el password puede acceder
5. **Roles**: No hay distinción entre admin/super-admin

Ver `SEGURIDAD_Y_ANTI_CHEAT.md` para mejoras futuras.

---

## 🧪 Testing con test-leaderboard.html

Después de configurar todo, se agregará una nueva sección en `test-leaderboard.html` para hacer tests visuales de las funciones admin:

```html
<!-- Test 6: Admin Actions -->
<div class="test-section">
  <h2>6️⃣ Admin Actions</h2>

  <div class="input-group">
    <label>Admin Password:</label>
    <input type="password" id="admin-password">
  </div>

  <button class="test-btn" onclick="testAdminStats()">Get Stats</button>
  <button class="test-btn" onclick="testListBackups()">List Backups</button>
  <button class="test-btn" onclick="testCreateBackup()">Create Backup</button>

  <div id="admin-output" class="test-output" style="display: none;"></div>
</div>
```

---

## 📝 Checklist de Setup Completo

- [ ] Tabla `backups` creada en Supabase
- [ ] `ADMIN_PASSWORD` configurado en Vercel
- [ ] Re-deploy del backend a Vercel
- [ ] Test 1: stats sin password (debe fallar)
- [ ] Test 2: stats con password correcto (debe funcionar)
- [ ] Test 3: Crear backup de prueba
- [ ] Test 4: Listar backups (debe mostrar el backup creado)
- [ ] Password guardado en lugar seguro (password manager)
- [ ] Documentación compartida con otros admins (si aplica)

---

## 🚨 Troubleshooting

### Problema: "Admin system not configured"

**Causa**: La variable `ADMIN_PASSWORD` no está configurada en Vercel.

**Solución**:
1. Verificar en Vercel Dashboard → Settings → Environment Variables
2. Si no existe, agregarla
3. Hacer re-deploy: `vercel --prod --yes`

---

### Problema: "Unauthorized. Invalid admin password"

**Causa**: El password enviado no coincide con el configurado.

**Solución**:
1. Verificar el password en Vercel Dashboard → Environment Variables
2. Copiar exactamente (incluyendo mayúsculas/minúsculas)
3. Intentar nuevamente

---

### Problema: Backup falla con "table backups does not exist"

**Causa**: La tabla `backups` no se creó en Supabase.

**Solución**:
1. Ir a Supabase SQL Editor
2. Ejecutar: `SELECT * FROM backups;`
3. Si falla, ejecutar `sql/create_backups_table.sql`

---

### Problema: Restore muy lento

**Causa**: Restaurar inserta scores uno por uno (sin bulk insert).

**Solución**:
- Esto es normal para backups grandes (>1000 scores)
- Esperar pacientemente (puede tomar 10-30 segundos)
- Para optimizar: ver `LEADERBOARD_FUTURAS_MEJORAS.md` → "Bulk Insert"

---

**Fecha**: 2025-11-07
**Versión**: v2.1.0
**Sistema**: Admin Endpoint + Backups

🚀 ¡Listo para usar el sistema de administración!
