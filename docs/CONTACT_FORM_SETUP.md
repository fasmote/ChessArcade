# 📧 Configuración del Formulario de Contacto

**Email de destino:** contact@chessarcade.com.ar
**Hosting:** Hostinger Argentina (compartido)

## ✅ IMPLEMENTADO - Usando Hostinger PHP

El formulario ahora envía emails REALES usando el hosting de Hostinger.

**Archivos:**
- `contact.html` - Formulario frontend
- `contact-send.php` - Script backend PHP que envía los emails

**Estado:** ✅ FUNCIONAL - Listo para subir a Hostinger

---

## 🚀 INSTRUCCIONES DE DESPLIEGUE EN HOSTINGER

### Paso 1: Subir archivos

1. Conectarse a Hostinger vía FTP o File Manager
2. Subir `contact-send.php` a la **raíz** del sitio (mismo nivel que contact.html)
3. Subir `contact.html` actualizado (reemplazar el anterior)

### Paso 2: Configurar email en Hostinger

**IMPORTANTE:** El email `noreply@chessarcade.com.ar` debe existir en Hostinger.

1. Ir a **hPanel → Emails**
2. Si no existe `noreply@chessarcade.com.ar`:
   - Click en **"Crear cuenta de email"**
   - Email: `noreply@chessarcade.com.ar`
   - Contraseña: (elige una segura)
   - Click "Crear"

**Alternativa:** Cambiar línea 20 de `contact-send.php`:
```php
// En vez de:
define('EMAIL_ORIGEN', 'noreply@chessarcade.com.ar');

// Usar contact@ directamente:
define('EMAIL_ORIGEN', 'contact@chessarcade.com.ar');
```

### Paso 3: Verificar Sendmail en Hostinger

1. Ir a **hPanel → Emails → Mail Service Control**
2. Verificar que **Sendmail** esté **Habilitado** (verde)
3. Si está deshabilitado, habilitarlo

### Paso 4: Probar el formulario

1. Ir a `https://chessarcade.com.ar/contact.html`
2. Llenar el formulario con datos de prueba
3. Enviar
4. Verificar que llegue a `contact@chessarcade.com.ar`

**Si no llega el email:**
- Revisar carpeta de SPAM
- Esperar 5-10 minutos (a veces demora)
- Verificar logs en Hostinger (hPanel → Error Logs)

### Paso 5: Permisos (si es necesario)

Si da error de permisos, conectar por SSH o File Manager:
```bash
chmod 644 contact-send.php
chmod 666 contact-log.txt  # Si querés guardar logs
```

### Paso 6: Seguridad Adicional (Opcional)

**Crear archivo `.htaccess` para proteger el log:**
```apache
# Denegar acceso directo a archivos de log
<Files "contact-log.txt">
    Order Allow,Deny
    Deny from all
</Files>
```

---

## 🔴 Situación Anterior (RESUELTO)

El formulario en `contact.html` ERA **FAKE** (simulado). No enviaba emails reales.

```javascript
// Líneas 237-256 de contact.html
// Simulación de envío de formulario
// En producción, esto debería conectarse a un servicio de backend
```

**Comportamiento actual:**
- ✅ Muestra mensaje de "éxito"
- ✅ Limpia el formulario
- ❌ **NO envía email**
- ❌ **NO guarda los datos**

---

## 📋 Opciones para Envío Real de Emails

### Opción 1: **Formspree** 🏆 RECOMENDADA

**Ventajas:**
- ✅ **100% GRATIS** hasta 1,000 envíos/mes
- ✅ **Sin backend** necesario (perfecto para sitios estáticos)
- ✅ **Anti-spam** con reCAPTCHA incluido
- ✅ **Setup en 5 minutos**
- ✅ **Email anónimo** (no expone tu email en el código)
- ✅ **Confirmación automática** al usuario

**Limitaciones:**
- ⚠️ Solo guarda últimos 100 envíos en plan gratuito
- ⚠️ Requiere confirmar email la primera vez

**Cómo funciona:**
1. Registrarse en https://formspree.io
2. Crear un formulario nuevo
3. Te dan un endpoint: `https://formspree.io/f/{FORM_ID}`
4. Cambiar el `<form>` a `<form action="https://formspree.io/f/{FORM_ID}" method="POST">`
5. ¡Listo! Los emails llegan a contact@chessarcade.com.ar

**Ejemplo de código:**
```html
<form action="https://formspree.io/f/xyzabc123" method="POST" id="contactForm">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <button type="submit">Enviar</button>
</form>
```

---

### Opción 2: **EmailJS**

**Ventajas:**
- ✅ Gratis hasta 200 envíos/mes
- ✅ Templates de email personalizables
- ✅ Sin backend
- ✅ Muy flexible

**Desventajas:**
- ⚠️ Más complejo de configurar (requiere API keys)
- ⚠️ Requiere conectar con Gmail/Outlook/etc
- ⚠️ API keys visibles en el código (riesgo de abuso)
- ⚠️ Límite de 200 envíos/mes (menor que Formspree)

**Cómo funciona:**
1. Registrarse en https://www.emailjs.com
2. Conectar tu cuenta Gmail/Outlook
3. Crear template de email
4. Obtener: Service ID, Template ID, Public Key
5. Agregar JavaScript para enviar
6. Emails llegan a tu cuenta conectada

---

### Opción 3: **Web3Forms**

**Ventajas:**
- ✅ **250 envíos/mes gratis**
- ✅ Sin límite de formularios
- ✅ Anti-spam integrado
- ✅ Muy simple

**Desventajas:**
- ⚠️ Menos conocido que Formspree
- ⚠️ Menor límite que Formspree (250 vs 1000)

---

### Opción 4: **Google Forms** (alternativa simple)

**Ventajas:**
- ✅ 100% gratis e ilimitado
- ✅ Datos en Google Sheets automáticamente
- ✅ Notificaciones por email

**Desventajas:**
- ❌ No se integra bien con diseño custom
- ❌ Redirige a página de Google
- ❌ Pierde la estética neón del sitio

---

### Opción 5: **Backend Propio** (más avanzado)

**Requerido:**
- Node.js + Express
- Servidor (Vercel, Netlify Functions, Railway, etc.)
- Configuración de SMTP o servicio como SendGrid

**Ventajas:**
- ✅ Control total
- ✅ Sin límites
- ✅ Puedes guardar en base de datos

**Desventajas:**
- ❌ Requiere programación backend
- ❌ Más mantenimiento
- ❌ Posibles costos de hosting

---

## 🏆 Recomendación Final: Formspree

**Por qué:**
1. **Gratis y generoso:** 1,000 envíos/mes es suficiente para empezar
2. **Sin código backend:** Solo cambiar 2 líneas de HTML
3. **Anti-spam incluido:** Protección contra bots
4. **Profesional:** Usado por miles de sitios estáticos

**Para cuándo considerar upgrade:**
- Si recibís más de 1,000 mensajes/mes → Formspree Gold ($10/mes)
- Si necesitás guardar todos los mensajes → Backend propio
- Si querés webhooks o integraciones avanzadas → Formspree o backend

---

## 📝 Pasos de Implementación (Formspree)

### 1. Registrarse en Formspree

1. Ir a https://formspree.io
2. Click en "Get Started" (gratuito)
3. Registrarse con email (puede ser contact@chessarcade.com.ar)
4. Confirmar email

### 2. Crear Nuevo Formulario

1. En el dashboard, click "+ New Form"
2. Nombre: "ChessArcade Contact Form"
3. Email de notificación: `contact@chessarcade.com.ar`
4. Guardar

### 3. Copiar Endpoint

Te dan algo como: `https://formspree.io/f/xyzabc123`

### 4. Actualizar contact.html

**Cambiar línea 173:**
```html
<!-- ANTES (fake) -->
<form class="contact-form" id="contactForm">

<!-- DESPUÉS (real) -->
<form class="contact-form" id="contactForm"
      action="https://formspree.io/f/TU_FORM_ID_AQUI"
      method="POST">
```

**Agregar campo oculto (opcional pero recomendado):**
```html
<input type="hidden" name="_subject" value="Nuevo mensaje de ChessArcade">
<input type="hidden" name="_next" value="https://chessarcade.com.ar/contact.html?success=true">
```

### 5. Actualizar JavaScript (opcional)

Puedes mantener el JavaScript actual para la animación, pero el envío lo hace Formspree.

O usar AJAX para envío sin recargar página:
```javascript
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Mostrar mensaje de éxito
            document.getElementById('successMessage').style.display = 'block';
            form.reset();
        } else {
            alert('Error al enviar. Por favor intenta de nuevo.');
        }
    } catch (error) {
        alert('Error de conexión. Por favor intenta de nuevo.');
    }
});
```

### 6. Testear

1. Enviar mensaje de prueba desde contact.html
2. Verificar que llegue a contact@chessarcade.com.ar
3. ¡Listo!

---

## 🔒 Seguridad y Anti-Spam

### Formspree incluye:

- **reCAPTCHA** automático en plan gratuito
- **Rate limiting** (límite de envíos por IP)
- **Honeypot fields** para detectar bots

### Opcional: Agregar honeypot manual

```html
<!-- Campo trampa para bots (invisible para humanos) -->
<input type="text" name="_gotcha" style="display:none">
```

Si un bot llena este campo, Formspree rechaza el envío.

---

## 📊 Estadísticas y Monitoreo

Con Formspree puedes:
- Ver dashboard con cantidad de envíos
- Exportar últimos 100 mensajes (plan gratuito)
- Configurar webhooks para integraciones

---

## 💰 Costos (si creces)

| Plan | Precio | Envíos/mes | Almacenamiento |
|------|--------|------------|----------------|
| **Free** | $0 | 1,000 | Últimos 100 |
| **Gold** | $10/mes | 5,000 | Ilimitado |
| **Platinum** | $40/mes | 50,000 | Ilimitado + webhooks |

**Proyección:**
- Con 30 visitantes/día y tasa de contacto del 5% = ~45 mensajes/mes
- Con 1000 visitantes/día y tasa del 2% = ~600 mensajes/mes
- Plan gratuito cubre cómodamente los primeros meses

---

## 🚀 Alternativa Rápida: mailto: (no recomendado)

Si solo querés algo temporal:

```html
<form action="mailto:contact@chessarcade.com.ar"
      method="post"
      enctype="text/plain">
```

**Problemas:**
- Abre cliente de email del usuario
- Mala experiencia de usuario
- No funciona si no tienen email configurado
- Formato feo del mensaje

**Solo usar para prototipado rápido.**

---

## 📚 Recursos

- [Formspree Docs](https://formspree.io/docs/)
- [EmailJS Tutorial](https://www.emailjs.com/docs/tutorial/creating-contact-form/)
- [Comparación de servicios](https://css-tricks.com/a-comparison-of-static-form-providers/)

---

## ✅ Checklist de Implementación

- [ ] Crear cuenta en Formspree
- [ ] Crear formulario y obtener endpoint
- [ ] Actualizar contact.html con action y method
- [ ] Probar envío de mensaje de prueba
- [ ] Verificar recepción en contact@chessarcade.com.ar
- [ ] Configurar respuesta automática (opcional)
- [ ] Documentar FORM_ID en archivo .env o nota privada
- [ ] Commit de cambios

---

**Última actualización:** Octubre 2025
**Autor:** ChessArcade Team
**Email:** contact@chessarcade.com.ar
