# 🚀 Cómo Subir el Formulario de Contacto a Hostinger

## 📋 Checklist Rápido

- [ ] Subir `contact-send.php` a la raíz del sitio
- [ ] Subir `contact.html` (reemplazar el actual)
- [ ] Crear email `noreply@chessarcade.com.ar` en Hostinger
- [ ] Verificar que Sendmail esté habilitado
- [ ] Probar el formulario
- [ ] Verificar que llegue el email

---

## 📁 PASO 1: Subir Archivos

### Opción A: File Manager de Hostinger (más fácil)

1. **Entrar a hPanel:**
   - Ir a https://hpanel.hostinger.com/
   - Login con tu cuenta

2. **Abrir File Manager:**
   - En el panel, buscar "File Manager"
   - Click en "File Manager"
   - Se abre el explorador de archivos

3. **Ir a la raíz del sitio:**
   - Navegar a `public_html/` o `domains/chessarcade.com.ar/public_html/`
   - Esta es la carpeta raíz donde está tu sitio

4. **Subir archivos:**
   - Click en botón "Upload" (arriba a la derecha)
   - Seleccionar estos archivos de tu PC:
     - `contact-send.php`
     - `contact.html`
   - Esperar que suban (barra de progreso)
   - Si pregunta si reemplazar `contact.html` → Click "Yes"

### Opción B: FTP (FileZilla)

1. **Conectar por FTP:**
   - Host: `ftp.chessarcade.com.ar`
   - Usuario: (tu usuario FTP de Hostinger)
   - Password: (tu password FTP)
   - Puerto: 21

2. **Subir archivos:**
   - En panel derecho, ir a `public_html/`
   - Arrastrar `contact-send.php` y `contact.html` desde tu PC
   - Reemplazar `contact.html` si pregunta

---

## 📧 PASO 2: Crear Email en Hostinger

1. **Ir a Emails:**
   - En hPanel, click en "Emails"
   - Click en "Crear cuenta de email"

2. **Crear `noreply@chessarcade.com.ar`:**
   - Email address: `noreply`
   - Domain: `chessarcade.com.ar` (debería estar seleccionado)
   - Password: Crear una contraseña segura (anótala)
   - Click "Crear"

**¿No querés crear otro email?**
Alternativa: Editar `contact-send.php` línea 20:
```php
// Cambiar esto:
define('EMAIL_ORIGEN', 'noreply@chessarcade.com.ar');

// Por esto:
define('EMAIL_ORIGEN', 'contact@chessarcade.com.ar');
```
Así usa `contact@` directamente (si ya existe).

---

## ⚙️ PASO 3: Verificar Sendmail (Importante)

1. **Ir a Mail Service Control:**
   - En hPanel, ir a "Emails"
   - Buscar "Mail Service Control" (puede estar en un menú desplegable)
   - Click

2. **Verificar estado:**
   - Debe decir "Sendmail: **Enabled**" (verde)
   - Si dice "Disabled" (rojo):
     - Click en botón para habilitarlo
     - Esperar 2-3 minutos

**Nota:** Sendmail está habilitado por defecto en Hostinger, pero verificar no está de más.

---

## ✅ PASO 4: Probar el Formulario

1. **Ir al formulario:**
   - Abrir navegador
   - Ir a: `https://chessarcade.com.ar/contact.html`
   - O `http://chessarcade.com.ar/contact.html` si no tenés HTTPS aún

2. **Enviar mensaje de prueba:**
   - Nombre: Tu Nombre
   - Email: tu email personal (para que te llegue la confirmación)
   - Asunto: Bug/Error
   - Mensaje: "Test del formulario"
   - Click "Enviar Mensaje"

3. **Verificar:**
   - Debe aparecer mensaje verde: "✓ ¡Mensaje enviado con éxito!"
   - Si aparece mensaje rojo, ver sección de errores abajo

4. **Revisar email:**
   - Abrir `contact@chessarcade.com.ar`
   - Buscar el email de prueba
   - **Si no está:**
     - Revisar carpeta de SPAM
     - Esperar 5-10 minutos (a veces demora)

---

## 🔧 PASO 5: Configuración Adicional (Opcional)

### A. Permisos del archivo PHP

Si da error tipo "Permission denied":

1. En File Manager, click derecho en `contact-send.php`
2. Click en "Permissions" o "Change Permissions"
3. Cambiar a: **644** (rw-r--r--)
4. Click OK

### B. Ver errores PHP (para debugging)

Si algo no funciona, activar errores PHP temporalmente:

1. Editar `contact-send.php`
2. Agregar al principio (después de `<?php`):
```php
<?php
// DEBUGGING - REMOVER EN PRODUCCIÓN
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

3. Probar de nuevo y ver qué error aparece
4. **IMPORTANTE:** Remover estas líneas después de arreglar

### C. Proteger archivo de log

Crear archivo `.htaccess` en la raíz con:
```apache
# Denegar acceso a logs
<Files "contact-log.txt">
    Order Allow,Deny
    Deny from all
</Files>
```

---

## ❌ TROUBLESHOOTING (Si algo falla)

### Error: "Método no permitido"
**Causa:** Archivo PHP no se subió o la ruta está mal
**Solución:** Verificar que `contact-send.php` esté en la raíz (mismo nivel que contact.html)

### Error: "Email inválido"
**Causa:** Validación falló
**Solución:** Verificar que el email tenga formato correcto (con @)

### Email no llega
**Posibles causas:**
1. **SPAM:** Revisar carpeta de spam/correo no deseado
2. **Sendmail deshabilitado:** Ir a hPanel → Emails → Mail Service Control → Habilitar
3. **Email origen no existe:** Crear `noreply@chessarcade.com.ar` o cambiar a `contact@`
4. **Demora del servidor:** Esperar 10-15 minutos

**Verificar logs de Hostinger:**
- hPanel → Error Logs
- Buscar errores relacionados con "mail" o "contact-send"

### Error 500 (Internal Server Error)
**Posibles causas:**
1. Error de sintaxis en PHP (poco probable, el código está testeado)
2. Permisos incorrectos (cambiar a 644)
3. PHP desactualizado (Hostinger usa PHP 7.4+ por defecto)

**Solución:**
1. Ver Error Logs en hPanel
2. Activar display_errors temporalmente (ver arriba)
3. Contactar soporte de Hostinger si persiste

### Mensaje "Enviando..." pero nunca termina
**Causa:** Problema de conexión o CORS
**Solución:**
1. Abrir consola del navegador (F12)
2. Ver qué error aparece en la pestaña "Console"
3. Verificar que `contact-send.php` esté en la ruta correcta

---

## 📊 Verificar que Funciona Correctamente

### Email de prueba debe incluir:

✅ Nombre del remitente
✅ Email del remitente
✅ Asunto seleccionado
✅ Mensaje completo
✅ Fecha y hora (GMT-3)
✅ IP del visitante
✅ Diseño HTML bonito (con colores)

### UX en el formulario:

✅ Botón cambia a "Enviando..." mientras procesa
✅ Mensaje verde de éxito aparece
✅ Formulario se limpia después de envío exitoso
✅ Scroll automático al mensaje de confirmación

---

## 🔒 Seguridad Incluida

El script ya incluye:

✅ **Honeypot anti-spam:** Campo invisible que atrapa bots
✅ **Rate limiting:** Máximo 1 mensaje cada 60 segundos por IP
✅ **Validación:** Verifica formato de email y campos requeridos
✅ **Sanitización:** Limpia datos contra XSS y ataques
✅ **Logging:** Guarda registro de envíos (IP, fecha, datos)

**Archivo de log:** `contact-log.txt` (automático, ya está en .gitignore)

---

## 📞 Si Necesitás Ayuda

1. **Soporte de Hostinger:**
   - Chat en vivo: https://www.hostinger.com/
   - Email: success@hostinger.com
   - Teléfono: +54 (disponible en la web)

2. **Verificar documentación:**
   - Leer: `docs/CONTACT_FORM_SETUP.md` (más detallado)

3. **Logs útiles:**
   - hPanel → Error Logs (errores PHP)
   - hPanel → Email Logs (envíos de email)
   - Consola navegador F12 (errores JavaScript)

---

## ✅ Resumen de Archivos

| Archivo | Ubicación | Qué hace |
|---------|-----------|----------|
| `contact.html` | Raíz del sitio | Formulario frontend |
| `contact-send.php` | Raíz del sitio | Script que envía emails |
| `contact-log.txt` | Raíz (se crea solo) | Log de envíos |

---

## 🎯 Después de Configurar

Una vez que funcione:

1. ✅ Probar desde diferentes dispositivos (PC, móvil)
2. ✅ Verificar que emails lleguen correctamente
3. ✅ Revisar que no caigan en SPAM
4. ✅ Testear con diferentes asuntos y mensajes
5. ✅ Confirmar que el rate limiting funciona (enviar 2 mensajes seguidos)

---

**¡Listo!** Con estos pasos el formulario debería funcionar perfectamente.

**Tiempo estimado:** 10-15 minutos

**Última actualización:** Octubre 2025
**Autor:** ChessArcade Team
