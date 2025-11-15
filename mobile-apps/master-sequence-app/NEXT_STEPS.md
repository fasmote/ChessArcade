# 🚀 Próximos Pasos - Después de Instalar Android Studio

¡Android Studio instalado! ✅ Ahora vamos a ejecutar Master Sequence en el emulador.

---

## PASO 1: Verificar Variables de Entorno (Crítico)

Android Studio necesita que tu sistema sepa dónde está instalado el SDK de Android.

### Windows:

1. **Encontrar la ruta del SDK:**
   - Abre Android Studio
   - Ve a: `File` → `Settings` (o `Ctrl + Alt + S`)
   - En el menú izquierdo: `Languages & Frameworks` → `Android SDK`
   - Copia la ruta que dice "Android SDK Location"
   - Ejemplo: `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`

2. **Configurar variables de entorno:**
   - Presiona `Win + R`
   - Escribe: `sysdm.cpl` y Enter
   - Ve a la pestaña "Opciones avanzadas"
   - Click en "Variables de entorno"
   - En "Variables del sistema" → Click "Nueva"

   **Variable 1:**
   ```
   Nombre: ANDROID_HOME
   Valor: C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
   ```

3. **Agregar al PATH:**
   - En "Variables del sistema" busca "Path"
   - Click "Editar"
   - Click "Nuevo" y agrega estas 3 rutas:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\cmdline-tools\latest\bin
   ```

4. **Verificar (abrir CMD NUEVO):**
   ```bash
   adb --version
   # Debe mostrar: Android Debug Bridge version X.X.X
   ```

   Si no funciona, **reinicia la computadora** y vuelve a intentar.

---

## PASO 2: Sincronizar Proyecto Capacitor

Esto copia los archivos web (www/) al proyecto Android.

```bash
cd /home/user/chessarcade/mobile-apps/master-sequence-app

npx cap sync android
```

**Salida esperada:**
```
✔ Copying web assets from www to android/app/src/main/assets/public
✔ Creating capacitor.config.json in android/app/src/main/assets
✔ copy android
✔ Updating Android plugins
✔ update android
```

---

## PASO 3: Abrir Proyecto en Android Studio

### Opción A: Desde Terminal (recomendado)

```bash
npx cap open android
```

Esto abrirá Android Studio automáticamente con el proyecto cargado.

### Opción B: Manualmente

1. Abre Android Studio
2. Click en "Open"
3. Navega a: `C:\Users\...\chessarcade\mobile-apps\master-sequence-app\android`
4. Click "OK"

**Primera vez:** Android Studio hará un "Gradle Sync" (puede tardar 2-5 minutos)
- Verás una barra de progreso abajo
- Espera a que diga "Gradle build finished"

---

## PASO 4: Crear Emulador Android (AVD)

Si Android Studio ya está abierto:

1. **Abrir Device Manager:**
   - En la barra derecha, click en el icono de teléfono 📱
   - O ve a: `Tools` → `Device Manager`

2. **Crear dispositivo:**
   - Click en "Create Device" (o el botón ➕)
   - Selecciona: **Pixel 5** (recomendado)
   - Click "Next"

3. **Seleccionar System Image:**
   - Pestaña "Recommended"
   - Selecciona: **"Tiramisu" (API Level 33)** o **"UpsideDownCake" (API Level 34)**
   - Si tiene un ⬇️ al lado, click para descargar (1-2 GB, puede tardar)
   - Espera la descarga
   - Click "Next"

4. **Configuración final:**
   - Nombre: "Pixel 5 API 33" (o el que quieras)
   - Click "Finish"

**Listo!** El emulador aparecerá en la lista de dispositivos.

---

## PASO 5: Ejecutar la App 🎯

### Opción A: Botón verde "Run" en Android Studio

1. En la barra superior, verás:
   - Un desplegable con "app"
   - Un desplegable con tu emulador "Pixel 5 API 33"
   - Un botón verde ▶️ "Run"

2. Click en el botón verde ▶️

3. **Primera ejecución:**
   - El emulador se inicia (puede tardar 1-3 minutos la primera vez)
   - La app se compila (barra de progreso abajo)
   - La app se instala en el emulador
   - La app se abre automáticamente

### Opción B: Desde Terminal

```bash
npx cap run android
```

---

## PASO 6: ¿Qué Deberías Ver?

Si todo salió bien, verás:

1. **Emulador iniciado** (pantalla de Android como un teléfono)
2. **Master Sequence abierto** automáticamente
3. **Pantalla del juego** con:
   - Botones HOME, START, LEADERBOARD
   - Diseño NeonChess (fondo oscuro, neones)
   - Secuencia de números

**Prueba:**
- Click en "START"
- Juega una ronda
- Verifica que el leaderboard cargue (necesita internet)

---

## PASO 7: Ver Logs (Debug)

Si algo no funciona, los logs te dirán qué pasó.

**En Android Studio:**
1. Pestaña "Logcat" (parte inferior)
2. Filtro: Selecciona tu emulador
3. Busca errores en rojo

**Filtros útiles:**
- `Chromium` → Ver errores JavaScript (como en browser console)
- `Console` → Ver console.log() de tu código

---

## PASO 8: Generar APK para Testear en Tu Teléfono

Si quieres instalar la app en tu teléfono real (sin emulador):

```bash
cd android

# Windows:
gradlew.bat assembleDebug

# Linux/Mac:
./gradlew assembleDebug
```

**El APK estará en:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Instalarlo:**
1. Copia el APK a tu teléfono (USB, email, WhatsApp, Drive)
2. En el teléfono:
   - Ve a Configuración → Seguridad
   - Habilita "Fuentes desconocidas" o "Instalar apps desconocidas"
3. Toca el archivo APK
4. Click "Instalar"
5. ¡Listo! La app está en tu teléfono

---

## ⚠️ Errores Comunes

### Error: "SDK not found"
```bash
# Verificar ANDROID_HOME
echo %ANDROID_HOME%  # Windows
echo $ANDROID_HOME   # Linux/Mac

# Debe mostrar: C:\Users\...\Android\Sdk
```

**Solución:** Configurar variables de entorno (Paso 1)

---

### Error: "Gradle sync failed"

**Solución 1:** Limpiar cache
```bash
cd android
gradlew.bat clean  # Windows
./gradlew clean    # Linux/Mac
```

**Solución 2:** En Android Studio
- `File` → `Invalidate Caches` → `Invalidate and Restart`

---

### Error: La app crashea al abrir

**Ver logs:**
1. Android Studio → Logcat
2. Buscar líneas rojas
3. Googlear el error específico

**Errores comunes:**
- `net::ERR_CONNECTION_REFUSED` → Backend no accesible, verificar internet
- `Failed to load resource` → Ruta incorrecta, verificar paths en index.html

---

### Error: Emulador muy lento

**Soluciones:**
1. En Device Manager → Editar emulador → Usar menos RAM (2 GB en vez de 4 GB)
2. Habilitar "Hardware acceleration" en BIOS (Intel VT-x o AMD-V)
3. Probar con API Level más bajo (API 29 en vez de 33)

---

## 📝 Checklist de Testeo

Una vez que la app esté corriendo:

- [ ] La app abre sin crashes
- [ ] El diseño se ve completo (no cortado)
- [ ] Los botones responden al toque
- [ ] Click en START inicia el juego
- [ ] La secuencia de números se muestra
- [ ] Se puede ingresar respuesta con los botones
- [ ] El juego avanza de nivel
- [ ] Click en LEADERBOARD muestra el modal
- [ ] El leaderboard carga datos (necesita internet)
- [ ] Se puede enviar un score
- [ ] No hay errores en Logcat

---

## 🎉 ¿Y Después?

Una vez que la app funcione correctamente:

### Siguiente Fase: Personalización

1. **Crear iconos personalizados**
   - Diseñar icono 1024x1024
   - Generar todos los tamaños (mipmap)

2. **Crear splash screen personalizado**
   - Diseño con logo de Master Sequence
   - Generar para todas las orientaciones

3. **Ajustar CSS para móvil**
   - Botones más grandes (dedos)
   - Fuentes legibles
   - Safe area para notch

4. **Optimizaciones**
   - Comprimir imágenes
   - Minimizar JavaScript
   - Testear performance

### Fase Final: Publicación

Cuando tengas los $25 para Google Play Developer:

1. Generar keystore (firma digital)
2. Compilar AAB de release
3. Completar Google Play Console
4. Subir AAB
5. Esperar aprobación (1-7 días)
6. ¡App publicada! 🚀

---

## 🆘 ¿Necesitas Ayuda?

Si te trabas en algún paso:

1. **Lee el error completo** (no solo la primera línea)
2. **Copia el error** y búscalo en Google
3. **Revisa Logcat** en Android Studio
4. **Comparte el error conmigo** y te ayudo a resolverlo

---

**¡Éxito!** 🎮

Cualquier duda, pregúntame y te guío paso a paso.
