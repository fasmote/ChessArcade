# 📱 Master Sequence - Guía para Publicar en Google Play

**Fecha:** 2025-11-14
**Objetivo:** Convertir Master Sequence (juego web) en una app Android publicable en Google Play Store

---

## 📋 Índice

1. [Opciones Tecnológicas](#opciones-tecnológicas)
2. [Opción Recomendada: Capacitor](#opción-recomendada-capacitor)
3. [Requisitos Previos](#requisitos-previos)
4. [Paso a Paso Completo](#paso-a-paso-completo)
5. [Costos y Tiempos](#costos-y-tiempos)
6. [Checklist Final](#checklist-final)

---

## 🎯 Opciones Tecnológicas

### Comparativa de Alternativas

| Tecnología | Dificultad | Tiempo | Costo | Características |
|-----------|-----------|--------|-------|-----------------|
| **Capacitor** ⭐ | Baja | 2-3 días | $25 | Convierte web a app nativa |
| **Cordova** | Media | 3-4 días | $25 | Similar a Capacitor pero más antiguo |
| **PWA** | Muy Baja | 1 día | $0 | App "instalable" desde el navegador |
| **React Native** | Alta | 2-3 semanas | $25 | Reescribir todo en React Native |
| **Flutter** | Alta | 3-4 semanas | $25 | Reescribir todo en Flutter |
| **WebView Nativo** | Media | 1 semana | $25 | Programar app Android desde cero |

### 🏆 Opción Recomendada: **Capacitor**

**¿Por qué Capacitor?**

✅ **Reutiliza tu código web existente al 100%**
✅ **No requiere reescribir nada**
✅ **Crea apps nativas reales** (no solo un navegador empaquetado)
✅ **Acceso a APIs nativas** (cámara, GPS, notificaciones, etc.)
✅ **Mantenido por Ionic** (empresa sólida)
✅ **Documentación excelente**
✅ **Soporta iOS también** (futuro)

---

## 🔧 Opción Recomendada: Capacitor

### ¿Qué es Capacitor?

Capacitor es una herramienta que **empaqueta tu juego web** (HTML/CSS/JS) dentro de una app Android nativa. Es como poner tu sitio web dentro de una "caja" que el teléfono entiende.

**Analogía:**
Imagina que tu juego web es un cuadro. Capacitor es el marco que lo convierte en algo que puedes colgar en la pared de Google Play.

### Arquitectura

```
┌─────────────────────────────────────────┐
│     Master Sequence Web (actual)        │
│     - HTML + CSS + JavaScript           │
│     - Funciona en navegador             │
└──────────────┬──────────────────────────┘
               │
               │ Capacitor empaqueta
               ▼
┌─────────────────────────────────────────┐
│        Master Sequence App               │
│  ┌───────────────────────────────────┐  │
│  │   Tu juego web (sin cambios)     │  │
│  │   - Misma UI                      │  │
│  │   - Mismo código                  │  │
│  │   - Mismo leaderboard             │  │
│  └───────────────────────────────────┘  │
│                                          │
│  + Android APIs (vibración, notis, etc) │
│  + Icono de app                         │
│  + Splash screen                        │
│  + Navegación nativa                    │
└─────────────────────────────────────────┘
               │
               │ Sube a Google Play
               ▼
┌─────────────────────────────────────────┐
│         Google Play Store                │
│    Users descargan como app normal      │
└─────────────────────────────────────────┘
```

### Ventajas de Capacitor

1. **Cero reescritura**: Tu código JavaScript actual funciona tal cual
2. **Mantenimiento simple**: Un solo codebase para web y móvil
3. **Actualización fácil**: Cambios en web = cambios en app
4. **Acceso a hardware**: Puedes agregar vibración, sonido, notificaciones
5. **Performance**: Usa el motor del navegador del sistema (muy rápido)

### Desventajas

1. **Tamaño de la app**: ~15-20 MB (más grande que nativa pura)
2. **No es 100% nativo**: Algunas animaciones pueden ser menos fluidas
3. **Requiere Node.js**: Necesitas instalar herramientas de desarrollo

---

## ✅ Requisitos Previos

### 1. Cuenta de Google Play Developer

- **Costo:** $25 USD (pago único, de por vida)
- **Tiempo de aprobación:** 2-3 días hábiles
- **Enlace:** https://play.google.com/console/signup

**Pasos:**
1. Ir a Google Play Console
2. Pagar $25 con tarjeta de crédito
3. Completar perfil (nombre, dirección, teléfono)
4. Aceptar términos y condiciones
5. Esperar aprobación (revisan identidad)

### 2. Software Necesario

#### Opción A: Desarrollo en Windows (TU CASO)

```bash
# Software a instalar:
1. Node.js (v18 o superior) → https://nodejs.org/
2. Android Studio → https://developer.android.com/studio
3. Java JDK 17 → Incluido en Android Studio
4. Git (ya lo tienes)
```

#### Opción B: Desarrollo en Mac (para iOS en el futuro)

```bash
# Igual que Windows +
5. Xcode → Mac App Store (solo para iOS)
```

### 3. Espacio en Disco

- **Android Studio:** ~10 GB
- **Emulador Android:** ~8 GB
- **Proyecto Capacitor:** ~500 MB
- **Total:** ~20 GB libres recomendados

### 4. Tiempo Estimado

| Actividad | Tiempo | Notas |
|-----------|--------|-------|
| Instalar software | 2-4 horas | Descargas lentas + configuración |
| Crear cuenta Google Play | 15 min | + 2-3 días espera aprobación |
| Configurar proyecto Capacitor | 1 hora | Siguiendo esta guía |
| Adaptar Master Sequence | 4-6 horas | Ajustes CSS para móvil |
| Generar APK/AAB | 30 min | Primera vez puede fallar, iteración |
| Crear assets (iconos, screenshots) | 2-3 horas | Diseño gráfico |
| Subir a Google Play | 1 hora | Formularios, descripciones |
| Revisión de Google | 1-7 días | Automático, pueden pedir cambios |
| **TOTAL** | **2-3 días** | De trabajo efectivo + esperas |

---

## 📝 Paso a Paso Completo

### FASE 1: Preparación del Entorno (Día 1)

#### Paso 1.1: Instalar Node.js

```bash
# 1. Descargar desde: https://nodejs.org/
# 2. Instalar versión LTS (Long Term Support)
# 3. Verificar instalación:
node --version   # Debe mostrar v18.x o superior
npm --version    # Debe mostrar 9.x o superior
```

#### Paso 1.2: Instalar Android Studio

```bash
# 1. Descargar: https://developer.android.com/studio
# 2. Ejecutar instalador
# 3. En el wizard de setup:
#    - Elegir "Standard" installation
#    - Aceptar descargar Android SDK
#    - Aceptar descargar Android Virtual Device (AVD)
#
# 4. Esperar que descargue (puede tardar 1-2 horas)
```

#### Paso 1.3: Configurar Variables de Entorno

**Windows:**

```bash
# Agregar a las variables de entorno del sistema:

ANDROID_HOME=C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr

# Agregar al PATH:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\cmdline-tools\latest\bin
```

**Verificar:**

```bash
# Abrir CMD nuevo y ejecutar:
adb --version     # Debe mostrar versión de ADB
sdkmanager --version  # Debe mostrar versión del SDK Manager
```

#### Paso 1.4: Crear Cuenta de Google Play Developer

```
1. Ir a: https://play.google.com/console/signup
2. Iniciar sesión con cuenta Google (puede ser gmail personal)
3. Pagar $25 USD
4. Completar formulario:
   - Nombre de desarrollador (puede ser "Claudio Chess Arcade")
   - Dirección de correo de contacto
   - Sitio web (puedes poner chessarcade.com.ar)
   - Categoría: "Games"
5. Esperar email de aprobación (1-3 días)
```

---

### FASE 2: Crear Proyecto Capacitor (Día 1-2)

#### Paso 2.1: Preparar Estructura del Proyecto

```bash
cd /home/user/chessarcade

# Crear carpeta para la app móvil
mkdir -p mobile-apps/master-sequence-app
cd mobile-apps/master-sequence-app
```

#### Paso 2.2: Inicializar Proyecto Capacitor

```bash
# Instalar Capacitor CLI globalmente
npm install -g @capacitor/cli @capacitor/core

# Crear proyecto
npm init -y

# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Inicializar Capacitor
npx cap init "Master Sequence" "ar.com.chessarcade.mastersequence" --web-dir=www
```

**Explicación de parámetros:**
- `"Master Sequence"` → Nombre de la app (mostrado en el teléfono)
- `"ar.com.chessarcade.mastersequence"` → ID único de la app (como DNI)
- `--web-dir=www` → Carpeta donde estará el código web

#### Paso 2.3: Copiar Código del Juego

```bash
# Crear carpeta www
mkdir www

# Copiar archivos de Master Sequence
cp -r ../../games/master-sequence/* www/

# Copiar dependencias compartidas (leaderboard, etc)
cp -r ../../js www/
cp -r ../../css www/
cp -r ../../assets www/
```

#### Paso 2.4: Ajustar Rutas en el HTML

**Problema:** Las rutas relativas `../../js/leaderboard-api.js` no funcionarán en la app.

**Solución:** Editar `www/index.html` para usar rutas absolutas desde `/`:

```html
<!-- ANTES (web): -->
<script src="../../js/leaderboard-api.js"></script>
<link rel="stylesheet" href="../../css/leaderboard.css">

<!-- DESPUÉS (app): -->
<script src="/js/leaderboard-api.js"></script>
<link rel="stylesheet" href="/css/leaderboard.css">
```

#### Paso 2.5: Agregar Plataforma Android

```bash
# Agregar soporte para Android
npx cap add android

# Esto crea la carpeta android/ con el proyecto Android Studio
```

---

### FASE 3: Adaptar Master Sequence para Móvil (Día 2)

#### Paso 3.1: Configurar Viewport

En `www/index.html`, agregar/verificar en el `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="msapplication-tap-highlight" content="no">
```

#### Paso 3.2: Ajustar CSS para Pantallas Móviles

**Crear archivo:** `www/css/mobile-overrides.css`

```css
/* ========================================
   AJUSTES PARA MÓVIL
   ======================================== */

/* Prevenir zoom en inputs */
input, select, textarea {
    font-size: 16px !important;
}

/* Hacer botones más grandes (dedos) */
button, .btn {
    min-height: 48px;
    min-width: 48px;
    padding: 12px 24px;
}

/* Ajustar tamaño de fuente para legibilidad */
body {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
}

/* Ocultar scroll bars nativas (mejora UX) */
::-webkit-scrollbar {
    display: none;
}

/* Safe area para notch/barra de estado */
body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
}

/* Optimizar grid de secuencia para móvil */
@media (max-width: 768px) {
    .sequence-display {
        font-size: clamp(1.5rem, 5vw, 3rem);
    }

    .number-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 10px;
    }

    .number-button {
        font-size: clamp(1.2rem, 4vw, 2rem);
        aspect-ratio: 1;
    }
}
```

**Incluir en `www/index.html`:**

```html
<link rel="stylesheet" href="/css/mobile-overrides.css">
```

#### Paso 3.3: Configurar API URL

**Problema:** La app necesita saber dónde está el backend.

**Editar:** `www/js/leaderboard-api.js`

```javascript
// Detectar si estamos en app móvil o web
const isCapacitor = typeof Capacitor !== 'undefined';

// URL del backend
const API_BASE_URL = isCapacitor
    ? 'https://chessarcade.vercel.app/api/scores'  // Producción
    : '/api/scores';  // Desarrollo local
```

#### Paso 3.4: Agregar Splash Screen y Configuración

**Editar:** `capacitor.config.json`

```json
{
  "appId": "ar.com.chessarcade.mastersequence",
  "appName": "Master Sequence",
  "webDir": "www",
  "server": {
    "cleartext": true
  },
  "android": {
    "backgroundColor": "#000000"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#000000",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false
    }
  }
}
```

---

### FASE 4: Generar Iconos y Assets (Día 2)

#### Paso 4.1: Crear Icono de la App

**Requisitos:**
- Tamaño: 1024x1024 píxeles
- Formato: PNG con transparencia
- Contenido: Logo de Master Sequence + texto

**Herramientas recomendadas:**
- **Canva** → https://canva.com (gratis, fácil)
- **Figma** → https://figma.com (gratis, profesional)
- **GIMP** → https://gimp.org (gratis, potente)

**Sugerencia de diseño:**

```
┌─────────────────────┐
│                     │
│   🧩 MASTER        │
│   SEQUENCE         │
│                     │
│   [Patrón de       │
│    números         │
│    coloridos]      │
│                     │
└─────────────────────┘
```

#### Paso 4.2: Generar Iconos Adaptativos (Android)

**Opción A: Usar herramienta online (recomendado)**

```bash
# 1. Ir a: https://icon.kitchen/
# 2. Subir tu icono 1024x1024
# 3. Configurar:
#    - Tipo: Adaptive Icon
#    - Forma: Circle, Square, Rounded Square
#    - Background: #000000 (negro)
# 4. Descargar ZIP
# 5. Extraer en: android/app/src/main/res/
```

**Opción B: Usar Capacitor Assets (automático)**

```bash
npm install -g @capacitor/assets

# Poner tu icono en:
# resources/icon.png (1024x1024)

# Generar automáticamente todos los tamaños:
npx capacitor-assets generate --android
```

#### Paso 4.3: Crear Splash Screen

**Tamaños necesarios:**

- **drawable-land-hdpi:** 800x480
- **drawable-land-xhdpi:** 1280x720
- **drawable-land-xxhdpi:** 1600x960
- **drawable-port-hdpi:** 480x800
- **drawable-port-xhdpi:** 720x1280
- **drawable-port-xxhdpi:** 960x1600

**Diseño sugerido:**

```
┌─────────────────────┐
│                     │
│                     │
│   [LOGO GRANDE]     │
│                     │
│   Master Sequence   │
│                     │
│   Powered by        │
│   Chess Arcade      │
│                     │
└─────────────────────┘
```

**Generar automáticamente:**

```bash
# Poner tu splash en:
# resources/splash.png (2732x2732 - grande con contenido centrado)

npx capacitor-assets generate --android
```

---

### FASE 5: Build y Testeo (Día 2-3)

#### Paso 5.1: Sincronizar Código con Android

```bash
# Copiar archivos web al proyecto Android
npx cap sync android

# Esto actualiza la carpeta android/ con el contenido de www/
```

#### Paso 5.2: Abrir en Android Studio

```bash
# Abrir el proyecto en Android Studio
npx cap open android

# Esto abre Android Studio automáticamente
```

#### Paso 5.3: Crear Emulador (Primera Vez)

**En Android Studio:**

1. Click en "Device Manager" (icono de teléfono, lado derecho)
2. Click en "Create Device"
3. Seleccionar "Pixel 5" (recomendado)
4. Seleccionar System Image:
   - API Level: 33 (Android 13) o 34 (Android 14)
   - Target: Android 13.0 (Google APIs)
5. Click "Next" → "Finish"
6. Esperar descarga (1-2 GB)

#### Paso 5.4: Ejecutar en Emulador

```bash
# Opción 1: Desde terminal
npx cap run android

# Opción 2: Desde Android Studio
# Click en el botón verde "Run" (▶️) en la barra superior
```

**Primera ejecución:**
- Puede tardar 2-5 minutos
- El emulador se inicia (puede ser lento)
- La app se instala automáticamente
- Se abre Master Sequence

#### Paso 5.5: Testear Funcionalidad

**Checklist de testeo:**

- [ ] La app abre sin crashes
- [ ] El diseño se ve bien (no cortado)
- [ ] Los botones responden al toque
- [ ] La secuencia de números funciona
- [ ] Se puede ingresar respuesta
- [ ] El leaderboard carga (conexión a internet)
- [ ] Se puede enviar score
- [ ] El botón de atrás del teléfono funciona bien
- [ ] La app maneja la rotación de pantalla
- [ ] No hay errores en Logcat (Android Studio)

#### Paso 5.6: Debug de Errores

**Ver logs en Android Studio:**

1. Abrir pestaña "Logcat" (parte inferior)
2. Filtrar por: "Chromium" o "Console"
3. Buscar errores JavaScript (aparecen como en navegador)

**Errores comunes:**

```
ERROR: net::ERR_CONNECTION_REFUSED
→ El backend no es accesible, verificar API_BASE_URL

ERROR: Uncaught ReferenceError: X is not defined
→ Falta incluir algún script, verificar <script> tags

ERROR: Failed to load resource
→ Ruta incorrecta, usar rutas absolutas desde /
```

---

### FASE 6: Generar APK/AAB para Producción (Día 3)

#### Paso 6.1: Configurar Signing Key

**¿Qué es una Signing Key?**
Es como tu "firma digital" que identifica que tú eres el autor de la app. Google Play la requiere.

```bash
cd android

# Generar keystore (solo una vez, guardar muy bien!)
keytool -genkey -v -keystore master-sequence-release.keystore -alias master-sequence -keyalg RSA -keysize 2048 -validity 10000

# Te pedirá:
# - Contraseña del keystore (IMPORTANTE: guardar en lugar seguro)
# - Nombre y organización
# - Datos de contacto

# Ejemplo de respuestas:
# Password: MiPasswordSuperSeguro123!
# First and Last Name: Claudio
# Organizational Unit: Chess Arcade
# Organization: Chess Arcade
# City: Buenos Aires
# State: Buenos Aires
# Country Code: AR
```

**⚠️ CRÍTICO: Backup de la Key**

```bash
# Copiar el keystore a un lugar SEGURO fuera del proyecto
cp master-sequence-release.keystore ~/Documents/ChessArcade-Keys/

# NUNCA subir a Git (ya está en .gitignore)
# Si pierdes esta key, NO podrás actualizar la app nunca más
```

#### Paso 6.2: Configurar Gradle para Signing

**Crear archivo:** `android/key.properties`

```properties
storePassword=MiPasswordSuperSeguro123!
keyPassword=MiPasswordSuperSeguro123!
keyAlias=master-sequence
storeFile=master-sequence-release.keystore
```

**⚠️ NO subir `key.properties` a Git!**

**Editar:** `android/app/build.gradle`

```gradle
// Agregar ANTES de android { ... }
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... configuración existente ...

    // Agregar en la sección android:
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Paso 6.3: Aumentar Version Code

**Editar:** `android/app/build.gradle`

```gradle
android {
    defaultConfig {
        applicationId "ar.com.chessarcade.mastersequence"
        minSdkVersion 22  // Android 5.1 (cubre 98% de dispositivos)
        targetSdkVersion 34  // Android 14 (más reciente)
        versionCode 1  // Incrementar en cada release (1, 2, 3...)
        versionName "1.0.0"  // Visible para usuarios
    }
}
```

#### Paso 6.4: Generar AAB (Android App Bundle)

```bash
cd android

# Build de producción
./gradlew bundleRelease

# Si estás en Windows:
gradlew.bat bundleRelease

# El AAB estará en:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Tiempo:** 2-5 minutos la primera vez.

**Tamaño esperado:** ~15-20 MB

#### Paso 6.5: Testear AAB Localmente (Opcional)

```bash
# Instalar bundletool
# Descargar de: https://github.com/google/bundletool/releases

# Generar APKs desde AAB
java -jar bundletool.jar build-apks --bundle=app-release.aab --output=master-sequence.apks --mode=universal

# Instalar en dispositivo conectado
java -jar bundletool.jar install-apks --apks=master-sequence.apks
```

---

### FASE 7: Publicar en Google Play (Día 3)

#### Paso 7.1: Preparar Assets Gráficos

**Necesitarás crear:**

1. **Icono de la app (512x512)**
   - Ya lo tienes del paso 4.1
   - Formato: PNG con transparencia

2. **Feature Graphic (1024x500)**
   - Banner promocional horizontal
   - Aparece en la tienda
   - Diseño sugerido: Logo + captura del juego + texto "Master Sequence"

3. **Screenshots (mínimo 2, máximo 8)**
   - Tamaño: 1080x1920 (portrait) o 1920x1080 (landscape)
   - Capturas reales del juego en acción
   - Sugerencias:
     - Pantalla principal
     - Jugando nivel fácil
     - Jugando nivel difícil
     - Leaderboard
     - Pantalla de victoria

4. **Video promocional (opcional)**
   - Duración: 30-120 segundos
   - Link de YouTube
   - No necesario para primera versión

#### Paso 7.2: Entrar a Google Play Console

```
1. Ir a: https://play.google.com/console/
2. Iniciar sesión con tu cuenta de desarrollador
3. Click en "Create App"
```

#### Paso 7.3: Completar Información de la App

**Sección: App details**

- **App name:** Master Sequence
- **Default language:** Spanish (Argentina) o English (United States)
- **App or game:** Game
- **Free or paid:** Free

**Sección: Store listing**

```
Short description (80 characters max):
"Desafía tu mente completando secuencias numéricas. ¿Cuál es el siguiente?"

Full description (4000 characters max):
Master Sequence es un juego de puzzle que desafía tu capacidad de reconocer patrones y completar secuencias numéricas.

🧩 CARACTERÍSTICAS:
• Múltiples niveles de dificultad (Novato a Maestro)
• Secuencias aritméticas, geométricas, fibonacci y más
• Sistema de pistas para cuando te atascas
• Leaderboard global para competir con jugadores de todo el mundo
• Interfaz elegante con tema NeonChess
• Sin anuncios ni compras dentro de la app

🎯 CÓMO JUGAR:
1. Observa la secuencia de números mostrada
2. Identifica el patrón
3. Ingresa el número que sigue
4. Avanza de nivel y desafía tu mente

🏆 CARACTERÍSTICAS DESTACADAS:
• Gratis para siempre
• Entrena tu cerebro
• Mejora tu pensamiento lógico
• Compite en el ranking mundial

¿Listo para el desafío? ¡Descarga ahora y descubre hasta dónde puedes llegar!

Desarrollado por Chess Arcade - chessarcade.com.ar
```

- **Category:** Puzzle
- **Tags:** Brain games, Puzzle, Education, Logic
- **Email:** (tu email de contacto)
- **Website:** https://chessarcade.com.ar

#### Paso 7.4: Subir Assets Gráficos

- **App icon:** Subir icon-512x512.png
- **Feature graphic:** Subir feature-graphic-1024x500.png
- **Phone screenshots:** Subir 2-8 imágenes

#### Paso 7.5: Configurar Clasificación de Contenido

```
1. Click en "Content rating"
2. Llenar cuestionario:
   - ¿Violencia? NO
   - ¿Contenido sexual? NO
   - ¿Lenguaje inapropiado? NO
   - ¿Drogas/alcohol? NO
   - ¿Apuestas? NO
   - ¿Interacción con usuarios? SÍ (leaderboard)

3. Resultado esperado: PEGI 3 / Everyone (apto para todos)
```

#### Paso 7.6: Configurar Público Objetivo

```
- Target age: 13+ (o "All ages" si no recolectas datos)
- Does your app appeal to children? NO (salvo que sea específicamente para niños)
```

#### Paso 7.7: Subir el AAB

```
1. Ir a "Release" → "Production"
2. Click "Create new release"
3. Subir app-release.aab
4. Release name: "1.0.0 - First Release"
5. Release notes:
   - Versión inicial
   - Múltiples niveles de dificultad
   - Sistema de leaderboard global
   - Interfaz optimizada para móvil
```

#### Paso 7.8: Configurar Política de Privacidad

**IMPORTANTE:** Google Play requiere una URL de política de privacidad si:
- Recolectas datos de usuarios (nombre para leaderboard = SÍ)
- Tienes conexión a internet = SÍ

**Crear página:** `https://chessarcade.com.ar/privacy-policy.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Privacy Policy - Master Sequence</title>
</head>
<body>
    <h1>Política de Privacidad - Master Sequence</h1>
    <p><strong>Última actualización:</strong> 14 de noviembre de 2025</p>

    <h2>Información que recopilamos</h2>
    <p>Master Sequence recopila la siguiente información:</p>
    <ul>
        <li>Nombre de jugador (opcional, ingresado por el usuario)</li>
        <li>Puntajes de juego</li>
        <li>País (opcional, detectado por IP)</li>
    </ul>

    <h2>Cómo usamos la información</h2>
    <p>La información recopilada se usa exclusivamente para:</p>
    <ul>
        <li>Mostrar el leaderboard global</li>
        <li>Permitir a los usuarios comparar sus puntajes</li>
    </ul>

    <h2>Compartir información</h2>
    <p>No compartimos información personal con terceros.</p>
    <p>Los puntajes y nombres de jugador son públicos en el leaderboard.</p>

    <h2>Seguridad</h2>
    <p>Usamos medidas de seguridad estándar para proteger los datos.</p>

    <h2>Contacto</h2>
    <p>Para preguntas sobre privacidad: [tu-email]@gmail.com</p>
</body>
</html>
```

**Subir URL en Play Console:**
Store listing → Privacy Policy → `https://chessarcade.com.ar/privacy-policy.html`

#### Paso 7.9: Revisar y Enviar

```
1. Review en Play Console verificará:
   ✅ Content rating completado
   ✅ Target audience configurado
   ✅ Privacy policy agregada
   ✅ Store listing completo
   ✅ AAB subido
   ✅ Screenshots subidos

2. Si todo está ✅, click "Send for review"
```

#### Paso 7.10: Esperar Aprobación

**Timeline:**
- **Procesamiento inicial:** 1-2 horas
- **Revisión de Google:** 1-7 días (usualmente 1-3 días)
- **Aprobación:** Recibirás email cuando esté publicada

**Posibles resultados:**
- ✅ **Aprobada:** La app está live en Play Store
- ⚠️ **Cambios necesarios:** Google pide ajustes (descripciones, permisos, etc)
- ❌ **Rechazada:** Violación de políticas (raro si seguiste la guía)

---

## 💰 Costos y Tiempos

### Costos Únicos

| Concepto | Costo | Frecuencia |
|----------|-------|------------|
| Google Play Developer Account | $25 USD | Una vez (de por vida) |
| Dominio (ya tienes) | $0 | - |
| **TOTAL** | **$25 USD** | - |

### Costos Recurrentes

| Concepto | Costo | Frecuencia |
|----------|-------|------------|
| Hosting backend (Vercel) | $0 | Gratis (plan hobby) |
| Base de datos (Supabase) | $0 | Gratis (hasta 500MB) |
| **TOTAL** | **$0/mes** | - |

### Tiempo de Desarrollo

| Fase | Tiempo estimado | Notas |
|------|----------------|-------|
| Instalar software | 2-4 horas | Descargas lentas |
| Configurar proyecto Capacitor | 1 hora | Siguiendo pasos |
| Adaptar juego para móvil | 4-6 horas | CSS, testing |
| Crear assets (iconos, screenshots) | 2-3 horas | Diseño |
| Generar AAB y configurar signing | 1 hora | Puede haber errores |
| Completar Google Play Console | 2 horas | Formularios |
| **TOTAL TRABAJO** | **12-17 horas** | ~2-3 días |
| Espera aprobación cuenta | 2-3 días | Google verifica identidad |
| Espera aprobación app | 1-7 días | Revisión automática |
| **TOTAL CALENDARIO** | **5-14 días** | Desde inicio hasta live |

---

## ✅ Checklist Final

### Pre-Launch

- [ ] Cuenta Google Play creada y aprobada
- [ ] Node.js y Android Studio instalados
- [ ] Variables de entorno configuradas
- [ ] Proyecto Capacitor creado
- [ ] Master Sequence copiado a `www/`
- [ ] Rutas de assets corregidas
- [ ] CSS adaptado para móvil
- [ ] API URL configurada (producción)
- [ ] Iconos generados (todos los tamaños)
- [ ] Splash screen creado
- [ ] Testeado en emulador (funciona sin errores)
- [ ] Testeado en dispositivo real (opcional pero recomendado)

### Signing & Build

- [ ] Keystore generado
- [ ] Backup de keystore guardado en lugar seguro
- [ ] `key.properties` configurado (NO en Git)
- [ ] `build.gradle` configurado para signing
- [ ] Version code incrementado
- [ ] AAB generado sin errores
- [ ] Tamaño del AAB razonable (<50 MB)

### Google Play Console

- [ ] Información básica completada (nombre, descripción)
- [ ] Categoría y tags configurados
- [ ] Content rating completado (PEGI 3 / Everyone)
- [ ] Target audience configurado
- [ ] Icono 512x512 subido
- [ ] Feature graphic 1024x500 subido
- [ ] Mínimo 2 screenshots subidos
- [ ] Política de privacidad publicada y URL agregada
- [ ] AAB subido a producción
- [ ] Release notes escritos
- [ ] Revisión pasada (todos los checks en verde)
- [ ] Enviado para revisión

### Post-Launch

- [ ] Email de aprobación recibido
- [ ] App visible en Play Store
- [ ] Link de la app guardado: `https://play.google.com/store/apps/details?id=ar.com.chessarcade.mastersequence`
- [ ] Probar instalación desde Play Store
- [ ] Compartir link en redes sociales / sitio web
- [ ] Monitorear reviews y ratings
- [ ] Responder a comentarios de usuarios

---

## 🚀 Próximos Pasos (Futuro)

Una vez que Master Sequence esté publicada, puedes:

1. **Agregar más juegos:**
   - ChessInFive
   - Memory Matrix
   - Knight Quest
   - Square Rush
   - Vision Blitz

2. **Crear app "Chess Arcade Hub":**
   - Una sola app con todos los juegos
   - Menú principal para elegir juego
   - Leaderboard unificado

3. **Publicar en iOS (App Store):**
   - Requiere Mac + Xcode
   - Costo: $99 USD/año (Apple Developer)
   - Mismo código Capacitor, solo agregar plataforma

4. **Monetización (opcional):**
   - Admob (anuncios)
   - In-app purchases (desbloquear niveles premium)
   - Versión PRO sin anuncios

5. **Features adicionales:**
   - Notificaciones push (recordatorio de jugar)
   - Modo offline (jugar sin internet)
   - Logros / achievements
   - Multiplayer en tiempo real

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Capacitor:** https://capacitorjs.com/docs
- **Google Play Console:** https://support.google.com/googleplay/android-developer
- **Android Studio:** https://developer.android.com/studio/intro

### Tutoriales Recomendados

- **Capacitor Crash Course:** https://www.youtube.com/watch?v=K7ghUiXLef8
- **Google Play Publishing Guide:** https://developer.android.com/distribute/best-practices/launch

### Herramientas Útiles

- **Icon Generator:** https://icon.kitchen/
- **Screenshot Maker:** https://mockuphone.com/
- **App Store Optimization:** https://www.apptweak.com/

### Comunidad

- **Capacitor Discord:** https://ionic.link/discord
- **Stack Overflow:** Tag `capacitor`, `android`, `google-play`

---

## 🆘 Troubleshooting

### Error: SDK not found

```bash
# Verificar que ANDROID_HOME está configurado
echo $ANDROID_HOME  # Linux/Mac
echo %ANDROID_HOME%  # Windows

# Si no está configurado, agregar a ~/.bashrc o variables de entorno
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Error: Gradle build failed

```bash
# Limpiar cache de Gradle
cd android
./gradlew clean

# Invalidar cache de Android Studio
# File → Invalidate Caches → Invalidate and Restart
```

### Error: App crashes al abrir

```bash
# Ver logs en tiempo real
adb logcat | grep "Chromium"

# Buscar el error específico y googlear
# Usualmente es un problema de ruta de archivos o API no accesible
```

### Error: AAB upload failed

```
"Your app's signing configuration is invalid"
→ Verificar key.properties y build.gradle

"Version code X has already been used"
→ Incrementar versionCode en build.gradle

"APK size too large"
→ Optimizar assets (comprimir imágenes, remover archivos no usados)
```

---

## 📞 Ayuda Personalizada

Si te trabas en algún paso, puedo ayudarte:

1. **Revisión de errores:** Comparte el log completo
2. **Debug de configuración:** Reviso tus archivos de config
3. **Optimización:** Mejoro performance y tamaño de la app
4. **Diseño de assets:** Sugiero mejoras visuales
5. **Copywriting:** Ayudo con descripciones para Play Store

---

**¡Éxito con tu app! 🚀**

*Documento creado: 2025-11-14*
*Versión: 1.0*
*Autor: Claude (Anthropic) + Claudio Chess Arcade*
