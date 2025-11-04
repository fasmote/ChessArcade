# ChessArcade - Leaderboard Backend System Design

**Versión:** 1.1.0
**Fecha:** Noviembre 2025
**Estado:** Diseño
**Autor:** ChessArcade Team
**Última Actualización:** 2025-11-04 - Sistema de banderas de país añadido

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Especificaciones de Nombres](#especificaciones-de-nombres)
4. [Sistema de Banderas de País](#sistema-de-banderas-de-país)
5. [Base de Datos](#base-de-datos)
6. [API Endpoints](#api-endpoints)
7. [Seguridad y Validación](#seguridad-y-validación)
8. [Despliegue en Vercel](#despliegue-en-vercel)
9. [UI/UX - Ideas de Diseño](#uiux---ideas-de-diseño)
10. [Escalabilidad Futura](#escalabilidad-futura)
11. [Configuración por Juego](#configuración-por-juego)
12. [Plan de Implementación](#plan-de-implementación)

---

## 🎯 Visión General

Sistema de leaderboard (tabla de clasificación) estilo **arcade retro** para todos los juegos de ChessArcade. Sin autenticación inicial, basado en el sistema de honor clásico de las máquinas arcade.

### Características Principales

- ✅ **Sin login requerido** (Sistema de honor)
- ✅ **Nombres de 15 caracteres máximo** con las 3 primeras letras destacadas
- ✅ **Banderas de país** detectadas por IP (editables por el jugador)
- ✅ **Persistencia global** para todos los juegos
- ✅ **Deployment en Vercel** (Serverless Functions + Postgres)
- ✅ **Rate limiting** y validación anti-spam
- ✅ **Multi-juego** con configuración específica por juego
- ⏳ **Escalable** para login, ELO rankings, y nuevas features

### Filosofía de Diseño

> "Todo juego puede escalar: otros niveles, agregar otros items, etc."

El sistema está diseñado para empezar simple (honor system) y crecer hacia autenticación, rankings ELO, y competición avanzada.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    ChessArcade Frontend                     │
│  (index.html, square-rush, knight-quest, chessinfive, etc) │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS/JSON
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel Serverless Functions                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  GET  /api/scores/leaderboard?game=X&limit=Y        │   │
│  │  POST /api/scores                                   │   │
│  │  GET  /api/scores/recent?game=X                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                        │                                     │
│           ┌────────────┼────────────┐                       │
│           ▼            ▼            ▼                       │
│  ┌──────────────┐ ┌─────────┐ ┌────────────┐              │
│  │ Validation   │ │  Rate   │ │  Profanity │              │
│  │ Middleware   │ │ Limiter │ │   Filter   │              │
│  └──────────────┘ └─────────┘ └────────────┘              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Vercel Postgres Database                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Table: scores                                       │  │
│  │  - id (SERIAL PRIMARY KEY)                           │  │
│  │  - game (VARCHAR 50)                                 │  │
│  │  - player_name (VARCHAR 15) ← 15 CHARS MAX           │  │
│  │  - country_code (VARCHAR 2) ← Bandera del país       │  │
│  │  - country_name (VARCHAR 100)                        │  │
│  │  - score (INTEGER)                                   │  │
│  │  - level (VARCHAR 20)                                │  │
│  │  - time_ms (INTEGER)                                 │  │
│  │  - metadata (JSONB)                                  │  │
│  │  - created_at (TIMESTAMP)                            │  │
│  │  - ip_hash (VARCHAR 64)                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel KV (Redis) - Rate Limiting              │
│  - IP-based request tracking                                │
│  - 10 submissions per hour per IP                           │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Componente | Tecnología | Razón |
|------------|------------|-------|
| **Frontend** | HTML/CSS/JS Vanilla | Ya implementado, cero dependencias |
| **Backend** | Vercel Serverless Functions | Free tier generoso, deploy automático |
| **Database** | Vercel Postgres | Free: 256MB storage, 60 horas compute/mes |
| **Cache/Rate Limit** | Vercel KV (Redis) | Free: 256MB, 100K comandos/día |
| **Hosting** | Vercel | Free tier con dominio custom |

---

## 🔤 Especificaciones de Nombres

### Reglas de Validación

```javascript
const NAME_RULES = {
  minLength: 1,
  maxLength: 15,           // ← ACTUALIZADO: 15 caracteres max
  allowedChars: /^[A-Z0-9\s\-\.]+$/i,  // Letras, números, espacios, guiones, puntos
  profanityCheck: true,
  trimSpaces: true,
  uppercase: true          // Convertir todo a mayúsculas (estilo arcade)
};
```

### Ejemplos Válidos

✅ `JOE SMITH`
✅ `PLAYER-1`
✅ `A.B.C`
✅ `XYZABC123456789` (15 chars exactos)
✅ `JOHN`

### Ejemplos Inválidos

❌ `THISISWAYTOOLONGNAME` (16+ caracteres)
❌ `J@hn` (caracteres especiales no permitidos)
❌ `<script>` (intento de XSS)
❌ `` (vacío)

---

## 🎨 UI/UX - Ideas de Diseño

### Concepto 1: "Highlight + Fade" (🌟 RECOMENDADO)

Las **3 primeras letras** tienen neón brillante, el resto se desvanece, con **bandera del país** al inicio:

```
Rango  País  Nombre              Puntuación
──────────────────────────────────────────────
  1.   🇺🇸   JOHn smith          15,000 pts
            ^^^
            (neón cyan brillante)
                 ^^^^^^^^^
                 (cyan suave, 50% opacity)

  2.   🇦🇷   ALE x rodriguez     12,500 pts
  3.   🇧🇷   MAR y gonzalez      11,000 pts
  4.   🇪🇸   CAR los perez       10,500 pts

  Hover sobre la bandera → Tooltip: "United States"
```

**HTML Ejemplo:**
```html
<div class="leaderboard-entry">
  <span class="rank">1.</span>

  <!-- Bandera con tooltip -->
  <img
    src="flags/US.svg"
    class="flag-icon"
    alt="United States"
    title="United States"
  >

  <!-- Nombre con highlight -->
  <span class="player-name">
    <span class="first-three">JOH</span><span class="rest">n smith</span>
  </span>

  <span class="score">15,000 pts</span>
</div>
```

**CSS Ejemplo:**
```css
.leaderboard-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(42, 42, 78, 0.5);
  border-bottom: 1px solid rgba(0, 255, 212, 0.1);
}

.flag-icon {
  width: 24px;
  height: 16px;
  border: 1px solid rgba(0, 255, 212, 0.3);
  border-radius: 2px;
  cursor: help;
  transition: all 0.3s;
}

.flag-icon:hover {
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(0, 255, 212, 0.5);
}

.player-name {
  font-family: 'Press Start 2P', monospace;
  font-size: 1.2em;
}

.player-name .first-three {
  color: #00FFD4;           /* Neón cyan brillante */
  text-shadow:
    0 0 10px #00FFD4,
    0 0 20px #00FFD4,
    0 0 30px #00FFD4;
  font-weight: bold;
  letter-spacing: 2px;
}

.player-name .rest {
  color: #00FFD4;
  opacity: 0.5;
  letter-spacing: 1px;
}
```

---

### Concepto 2: "Tag Style"

Las 3 primeras letras en un **badge/tag** separado:

```
┌─────────────────────────────────────────┐
│  Rango  Nombre         Puntuación       │
├─────────────────────────────────────────┤
│   1.   ┌───┐                            │
│        │JOH│n smith     15,000 pts      │
│        └───┘                            │
│         ^^^^                            │
│        (badge neón)                     │
│                                         │
│   2.   ┌───┐                            │
│        │ALE│x rodriguez 12,500 pts      │
│        └───┘                            │
└─────────────────────────────────────────┘
```

**HTML Ejemplo:**
```html
<div class="leaderboard-entry">
  <span class="rank">1.</span>
  <span class="name-container">
    <span class="name-tag">JOH</span>
    <span class="name-rest">n smith</span>
  </span>
  <span class="score">15,000 pts</span>
</div>
```

---

### Concepto 3: "Arcade Monitor Scanlines"

Efecto de **monitor CRT** con scanlines que atraviesan todo el nombre, pero las 3 primeras letras tienen mayor brillo:

```
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ░  1.  JOH░n smith     15,000  ░
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
         ^^^
      (scanline effect + brightness boost)
```

**CSS Ejemplo:**
```css
.leaderboard-row {
  position: relative;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 255, 212, 0.03),
      rgba(0, 255, 212, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
}

.first-three {
  filter: brightness(1.8) contrast(1.3);
  animation: flicker 3s infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
}
```

---

### Concepto 4: "Color Shift Gradient"

Las 3 primeras letras en **color primario** (cyan), el resto en **color secundario** (amarillo):

```
  1.  JOHn smith     ← "JOH" en cyan, "n smith" en amarillo
  2.  ALEx gonzalez  ← "ALE" en cyan, "x gonzalez" en amarillo
```

**CSS Ejemplo:**
```css
.first-three {
  color: #00FFD4;  /* Cyan neón */
}

.rest {
  color: #FFD700;  /* Amarillo neón */
}
```

---

### 🎖️ Recomendación Final: **Concepto 1 (Highlight + Fade + Banderas)**

**Ventajas:**
- ✅ Más legible (mismo color, diferente intensidad)
- ✅ Mantiene estética neón coherente
- ✅ Banderas añaden color y representación visual internacional
- ✅ Tooltip en hover para nombre completo del país
- ✅ Fácil de implementar
- ✅ Funciona bien en pantallas pequeñas
- ✅ No fragmenta visualmente el nombre
- ✅ Las banderas son inmediatamente reconocibles

**UX Flow Completo:**

1. **Jugador termina partida** → Aparece modal "GAME OVER"
2. **Modal muestra:**
   - Tu puntuación final
   - Input para nombre (15 chars max, auto-uppercase)
   - Bandera detectada (con botón "Change Flag")
   - Botón "SUBMIT TO LEADERBOARD"
3. **Al hacer hover en bandera** → Tooltip muestra nombre del país
4. **Al enviar** → Score se guarda con bandera
5. **Leaderboard se actualiza** → Nuevo score aparece con bandera + nombre destacado

---

## 🌍 Sistema de Banderas de País

### Detección Automática por IP

Al enviar un score, el sistema detecta automáticamente el país del jugador mediante **geolocalización de IP**.

#### Servicio: Vercel Geolocation

Vercel proporciona automáticamente información geográfica en cada request:

```javascript
// api/scores/index.js
export default async function handler(req, res) {
  // Vercel automáticamente inyecta headers de geolocalización
  const country = req.headers['x-vercel-ip-country'] || 'XX';  // ISO 3166-1 alpha-2
  const countryName = req.headers['x-vercel-ip-country-name'] || 'Unknown';
  const city = req.headers['x-vercel-ip-city'] || '';

  // Guardar en database
  const score = {
    player_name: req.body.player_name,
    score: req.body.score,
    country_code: country,        // ← 'US', 'AR', 'ES', etc.
    country_name: countryName,    // ← 'United States', 'Argentina', etc.
    // ...
  };
}
```

**Headers disponibles de Vercel:**
- `x-vercel-ip-country`: Código ISO de país (ej. `US`, `AR`, `BR`)
- `x-vercel-ip-country-name`: Nombre del país (ej. `Argentina`)
- `x-vercel-ip-city`: Ciudad (opcional)
- `x-vercel-ip-country-region`: Región/Estado (opcional)

**Ventajas:**
✅ Gratis (incluido en Vercel)
✅ No requiere API key externa
✅ Latencia cero (headers nativos)
✅ 99.9% de precisión a nivel país

---

### Edición Manual de Bandera

El jugador puede **cambiar su bandera** antes de enviar el score:

```javascript
// Frontend: Selector de país
<div class="score-submission-modal">
  <input type="text" id="player-name" maxlength="15" placeholder="YOUR NAME">

  <div class="country-selector">
    <label>Your country:</label>
    <img src="flags/AR.svg" id="flag-preview" class="flag-icon">
    <span id="country-name">Argentina</span>
    <button id="change-flag">Change Flag</button>
  </div>

  <button id="submit-score">SUBMIT TO LEADERBOARD</button>
</div>

<!-- Modal de selección de bandera -->
<div id="flag-picker-modal" class="hidden">
  <h3>Select Your Country</h3>
  <div class="flag-grid">
    <div class="flag-option" data-country="US" data-name="United States">
      <img src="flags/US.svg">
      <span>United States</span>
    </div>
    <div class="flag-option" data-country="AR" data-name="Argentina">
      <img src="flags/AR.svg">
      <span>Argentina</span>
    </div>
    <!-- ... más países -->
  </div>
</div>
```

---

### Banderas en Leaderboard

```
┌─────────────────────────────────────────────────────┐
│            🏆 SQUARE RUSH - LEADERBOARD             │
├─────┬───────────────────────────┬───────────────────┤
│ #1  │ 🇺🇸 JOHn smith           │ 15,000 pts        │
│     │    ^^^ (hover: "United States")               │
├─────┼───────────────────────────┼───────────────────┤
│ #2  │ 🇦🇷 ALE x rodriguez       │ 12,500 pts        │
│     │    ^^^ (hover: "Argentina")                   │
├─────┼───────────────────────────┼───────────────────┤
│ #3  │ 🇧🇷 MAR costas            │ 11,000 pts        │
│     │    ^^^ (hover: "Brazil")                      │
└─────┴───────────────────────────┴───────────────────┘
```

**HTML Ejemplo:**
```html
<div class="leaderboard-entry">
  <span class="rank">1.</span>

  <!-- Bandera con tooltip -->
  <img
    src="flags/US.svg"
    class="flag-icon"
    alt="United States"
    title="United States"
  >

  <!-- Nombre con highlight -->
  <span class="player-name">
    <span class="first-three">JOH</span><span class="rest">n smith</span>
  </span>

  <span class="score">15,000 pts</span>
</div>
```

**CSS Ejemplo:**
```css
.flag-icon {
  width: 24px;
  height: 16px;
  margin-right: 8px;
  border: 1px solid rgba(0, 255, 212, 0.3);
  border-radius: 2px;
  cursor: help;  /* Cursor cambia al pasar */
  transition: all 0.3s;
}

.flag-icon:hover {
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(0, 255, 212, 0.5);
  border-color: #00FFD4;
}

/* Tooltip nativo (via title attribute) o custom */
.flag-icon[title]:hover::after {
  content: attr(title);
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: #00FFD4;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  white-space: nowrap;
  margin-top: -30px;
  z-index: 1000;
}
```

---

### Librería de Banderas SVG

**Opción 1: flag-icons (Recomendado)**

https://github.com/lipis/flag-icons

```bash
npm install flag-icons
# O usar CDN:
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css"/>

<!-- Uso: -->
<span class="fi fi-ar"></span>  <!-- Argentina -->
<span class="fi fi-us"></span>  <!-- USA -->
<span class="fi fi-br"></span>  <!-- Brasil -->
```

**Ventajas:**
- ✅ 266 banderas (todos los países)
- ✅ SVG optimizados (cada bandera ~1-3KB)
- ✅ MIT License (uso libre)
- ✅ Tamaños: 1x1 y 4x3

**Opción 2: country-flag-emoji-polyfill**

Usa emojis nativos de banderas (🇺🇸 🇦🇷 🇧🇷) con fallback a imágenes:

```javascript
// JavaScript para renderizar
function getCountryFlag(countryCode) {
  // Convierte "US" a 🇺🇸
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// Uso:
console.log(getCountryFlag('AR'));  // 🇦🇷
console.log(getCountryFlag('US'));  // 🇺🇸
```

**Ventajas:**
- ✅ Sin imágenes ni CSS (Unicode nativo)
- ✅ Peso cero
- ⚠️ Depende del soporte del navegador/OS

**Recomendación:** **flag-icons** por consistencia visual cross-platform.

---

### País "Unknown" (IP no detectable)

Para VPNs, Tor, o IPs sin geolocalización:

```javascript
// Bandera por defecto
const DEFAULT_FLAG = {
  code: 'XX',           // ISO 3166-1 user-assigned
  name: 'Unknown',
  icon: '🌍'            // Emoji tierra o icono genérico
};
```

```html
<!-- Leaderboard entry sin país detectado -->
<div class="leaderboard-entry">
  <span class="rank">5.</span>
  <span class="flag-icon unknown">🌍</span>
  <span class="player-name">
    <span class="first-three">MYS</span><span class="rest">tery player</span>
  </span>
  <span class="score">8,000 pts</span>
</div>
```

---

### Top Países (Estadísticas)

**Vista adicional:** Ranking de países por puntuación total/promedio

```
┌─────────────────────────────────────────────────┐
│          🌍 TOP COUNTRIES - SQUARE RUSH         │
├──────┬────────────────────────┬─────────────────┤
│  #1  │ 🇺🇸 United States      │ 45,320 pts avg  │
├──────┼────────────────────────┼─────────────────┤
│  #2  │ 🇦🇷 Argentina          │ 42,150 pts avg  │
├──────┼────────────────────────┼─────────────────┤
│  #3  │ 🇧🇷 Brazil             │ 39,800 pts avg  │
└──────┴────────────────────────┴─────────────────┘
```

**Query SQL:**
```sql
SELECT
  country_code,
  country_name,
  COUNT(*) as total_players,
  AVG(score) as avg_score,
  MAX(score) as best_score
FROM scores
WHERE game = 'square-rush'
GROUP BY country_code, country_name
ORDER BY avg_score DESC
LIMIT 10;
```

---

## 💾 Base de Dados

### Schema SQL

```sql
-- Tabla principal de puntuaciones
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,

    -- Identificación del juego
    game VARCHAR(50) NOT NULL,

    -- Datos del jugador (15 caracteres max)
    player_name VARCHAR(15) NOT NULL,

    -- Geolocalización (banderas de país)
    country_code VARCHAR(2),     -- ISO 3166-1 alpha-2: 'US', 'AR', 'BR', etc.
    country_name VARCHAR(100),   -- Nombre del país: 'Argentina', 'United States'

    -- Puntuación y métricas
    score INTEGER NOT NULL,
    level VARCHAR(20),           -- 'BABY STEPS', '4x4', 'EASY', 'HARD', etc.
    time_ms INTEGER,             -- Tiempo en milisegundos (si aplica)

    -- Metadata flexible por juego (JSONB)
    metadata JSONB DEFAULT '{}',

    -- Timestamps y anti-spam
    created_at TIMESTAMP DEFAULT NOW(),
    ip_hash VARCHAR(64),         -- SHA-256 del IP para rate limiting

    -- Índices para constraints
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_name CHECK (LENGTH(player_name) >= 1 AND LENGTH(player_name) <= 15)
);

-- Índices para performance
CREATE INDEX idx_game_score ON scores(game, score DESC);
CREATE INDEX idx_game_date ON scores(game, created_at DESC);
CREATE INDEX idx_ip_hash_date ON scores(ip_hash, created_at);
CREATE INDEX idx_country ON scores(country_code);  -- Para rankings por país

-- Índice GIN para búsquedas en metadata
CREATE INDEX idx_metadata ON scores USING GIN (metadata);
```

### Estructura de Metadata por Juego

#### Square Rush
```json
{
  "difficulty": "BABY STEPS",
  "errors": 2,
  "combo_max": 5,
  "perfect_moves": 12
}
```

#### Knight Quest
```json
{
  "board_size": "8x8",
  "hints_used": 3,
  "moves_count": 64,
  "time_per_move_avg": 1500
}
```

#### Memory Matrix
```json
{
  "level": "HARD",
  "mistakes": 1,
  "streak_max": 8
}
```

#### Master Sequence
```json
{
  "sequence_length": 12,
  "speed": "FAST",
  "lives_remaining": 2
}
```

#### ChessInFive
```json
{
  "opponent": "AI",
  "difficulty": "HARD",
  "phase1_duration_ms": 45000,
  "phase2_duration_ms": 120000,
  "total_moves": 28,
  "winning_pattern": "diagonal"
}
```

---

## 🔌 API Endpoints

### 1. GET `/api/scores/leaderboard`

**Descripción:** Obtiene el top de puntuaciones para un juego específico.

**Query Parameters:**
- `game` (required): ID del juego (`square-rush`, `knight-quest`, etc.)
- `limit` (optional): Número de resultados (default: 10, max: 100)
- `level` (optional): Filtrar por nivel específico

**Request:**
```http
GET /api/scores/leaderboard?game=square-rush&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "game": "square-rush",
  "total_entries": 1543,
  "leaderboard": [
    {
      "rank": 1,
      "player_name": "JOHN SMITH",
      "country_code": "US",
      "country_name": "United States",
      "score": 15000,
      "level": "MASTER",
      "time_ms": 45000,
      "metadata": {
        "errors": 0,
        "combo_max": 8
      },
      "created_at": "2025-11-03T10:30:00Z"
    },
    {
      "rank": 2,
      "player_name": "ALEX RODRIGUEZ",
      "country_code": "AR",
      "country_name": "Argentina",
      "score": 12500,
      "level": "MASTER",
      "time_ms": 52000,
      "created_at": "2025-11-03T09:15:00Z"
    }
    // ... hasta limit
  ]
}
```

**Errores:**
```json
// 400 Bad Request
{
  "success": false,
  "error": "Missing required parameter: game"
}

// 404 Not Found
{
  "success": false,
  "error": "Invalid game ID"
}
```

---

### 2. POST `/api/scores`

**Descripción:** Registra una nueva puntuación.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "game": "square-rush",
  "player_name": "JOHN SMITH",
  "country_code": "US",           // Opcional - se detecta por IP si no se envía
  "country_name": "United States", // Opcional - se detecta por IP si no se envía
  "score": 15000,
  "level": "MASTER",
  "time_ms": 45000,
  "metadata": {
    "errors": 0,
    "combo_max": 8,
    "perfect_moves": 12
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Score submitted successfully",
  "data": {
    "id": 12345,
    "rank": 1,
    "total_players": 1544,
    "is_personal_best": true,
    "is_top_10": true
  }
}
```

**Errores:**
```json
// 400 Bad Request - Validación
{
  "success": false,
  "error": "Player name must be 1-15 characters"
}

// 400 Bad Request - Profanidad
{
  "success": false,
  "error": "Player name contains prohibited words"
}

// 429 Too Many Requests - Rate Limit
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 30 minutes.",
  "retry_after": 1800
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Database error"
}
```

---

### 3. GET `/api/scores/recent`

**Descripción:** Obtiene las últimas puntuaciones (feed en tiempo real).

**Query Parameters:**
- `game` (optional): Filtrar por juego específico
- `limit` (optional): Número de resultados (default: 20, max: 50)

**Request:**
```http
GET /api/scores/recent?game=knight-quest&limit=5
```

**Response (200 OK):**
```json
{
  "success": true,
  "recent_scores": [
    {
      "game": "knight-quest",
      "player_name": "MARY JONES",
      "score": 5000,
      "level": "8x8",
      "created_at": "2025-11-03T14:25:00Z"
    }
    // ...
  ]
}
```

---

## 🔒 Seguridad y Validación

### Middleware Stack

```javascript
// api/scores/index.js
import { validateRequest } from './middleware/validator.js';
import { checkRateLimit } from './middleware/rateLimit.js';
import { filterProfanity } from './middleware/profanity.js';

export default async function handler(req, res) {
  // 1. Validar request
  const validation = validateRequest(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error
    });
  }

  // 2. Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const rateLimitOK = await checkRateLimit(clientIP);
  if (!rateLimitOK) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Try again in 30 minutes.',
      retry_after: 1800
    });
  }

  // 3. Profanity filter
  const cleanName = filterProfanity(req.body.player_name);
  if (!cleanName) {
    return res.status(400).json({
      success: false,
      error: 'Player name contains prohibited words'
    });
  }

  // 4. Procesar request...
}
```

---

### Validación de Input

```javascript
// middleware/validator.js
export function validateRequest(body) {
  const { game, player_name, score, level, time_ms, metadata } = body;

  // Validar game
  const validGames = ['square-rush', 'knight-quest', 'memory-matrix',
                      'master-sequence', 'chessinfive'];
  if (!validGames.includes(game)) {
    return { valid: false, error: 'Invalid game ID' };
  }

  // Validar player_name
  if (!player_name || typeof player_name !== 'string') {
    return { valid: false, error: 'Player name is required' };
  }

  const trimmedName = player_name.trim();
  if (trimmedName.length < 1 || trimmedName.length > 15) {
    return { valid: false, error: 'Player name must be 1-15 characters' };
  }

  // Solo caracteres válidos
  if (!/^[A-Z0-9\s\-\.]+$/i.test(trimmedName)) {
    return { valid: false, error: 'Player name contains invalid characters' };
  }

  // Validar score
  if (typeof score !== 'number' || score < 0 || score > 999999999) {
    return { valid: false, error: 'Invalid score value' };
  }

  // Validar level (opcional)
  if (level && typeof level !== 'string') {
    return { valid: false, error: 'Invalid level format' };
  }

  // Validar time_ms (opcional)
  if (time_ms !== undefined && (typeof time_ms !== 'number' || time_ms < 0)) {
    return { valid: false, error: 'Invalid time value' };
  }

  // Validar metadata (opcional)
  if (metadata && typeof metadata !== 'object') {
    return { valid: false, error: 'Invalid metadata format' };
  }

  return { valid: true };
}
```

---

### Rate Limiting (Vercel KV)

```javascript
// middleware/rateLimit.js
import { kv } from '@vercel/kv';
import crypto from 'crypto';

const RATE_LIMIT = {
  maxSubmissions: 10,      // Máximo de submissions
  windowMinutes: 60        // Ventana de tiempo (1 hora)
};

export async function checkRateLimit(clientIP) {
  // Hash del IP para privacidad
  const ipHash = crypto.createHash('sha256').update(clientIP).digest('hex');
  const key = `ratelimit:${ipHash}`;

  // Obtener contador actual
  const current = await kv.get(key);

  if (!current) {
    // Primera submission, inicializar contador
    await kv.set(key, 1, { ex: RATE_LIMIT.windowMinutes * 60 });
    return true;
  }

  if (current >= RATE_LIMIT.maxSubmissions) {
    // Límite excedido
    return false;
  }

  // Incrementar contador
  await kv.incr(key);
  return true;
}

export function getIPHash(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}
```

---

### Filtro de Profanidad

```javascript
// middleware/profanity.js
const PROHIBITED_WORDS = [
  // Lista básica (expandir según necesidad)
  'badword1', 'badword2', // etc.
];

export function filterProfanity(name) {
  const lowerName = name.toLowerCase();

  // Verificar palabras prohibidas
  for (const word of PROHIBITED_WORDS) {
    if (lowerName.includes(word)) {
      return null;  // Nombre rechazado
    }
  }

  // Convertir a mayúsculas (estilo arcade)
  return name.trim().toUpperCase();
}
```

---

## 🚀 Despliegue en Vercel

### Estructura de Archivos

```
multiajedrez-2025/
├── api/
│   └── scores/
│       ├── index.js              # POST /api/scores
│       ├── leaderboard.js        # GET /api/scores/leaderboard
│       ├── recent.js             # GET /api/scores/recent
│       └── middleware/
│           ├── validator.js
│           ├── rateLimit.js
│           └── profanity.js
├── games/
│   ├── square-rush/
│   ├── knight-quest/
│   └── chessinfive/
├── index.html
├── vercel.json
└── package.json
```

---

### `vercel.json` Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/scores/leaderboard",
      "dest": "/api/scores/leaderboard.js"
    },
    {
      "src": "/api/scores/recent",
      "dest": "/api/scores/recent.js"
    },
    {
      "src": "/api/scores",
      "dest": "/api/scores/index.js",
      "methods": ["POST"]
    }
  ],
  "env": {
    "POSTGRES_URL": "@postgres_url",
    "KV_URL": "@kv_url",
    "KV_REST_API_URL": "@kv_rest_api_url",
    "KV_REST_API_TOKEN": "@kv_rest_api_token"
  }
}
```

---

### `package.json`

```json
{
  "name": "chessarcade-backend",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@vercel/postgres": "^0.5.1",
    "@vercel/kv": "^1.0.1"
  }
}
```

---

### Setup en Vercel Dashboard

#### 1. Crear Postgres Database

```bash
# En Vercel Dashboard:
Storage → Create Database → Postgres

# Nombre: chessarcade-scores
# Región: Washington D.C. (us-east-1) - más cercano a users
```

#### 2. Ejecutar Schema SQL

```bash
# Conectar a Vercel Postgres
vercel env pull .env.local

# Ejecutar schema
psql $POSTGRES_URL < schema.sql
```

#### 3. Crear KV Store

```bash
# En Vercel Dashboard:
Storage → Create Database → KV (Redis)

# Nombre: chessarcade-ratelimit
```

#### 4. Deploy

```bash
vercel --prod
```

---

### Variables de Entorno

Vercel automáticamente inyecta estas variables cuando conectas los stores:

```bash
POSTGRES_URL=postgres://user:pass@host/db
POSTGRES_PRISMA_URL=postgres://user:pass@host/db?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgres://user:pass@host/db

KV_URL=redis://default:token@host:port
KV_REST_API_URL=https://host.upstash.io
KV_REST_API_TOKEN=token
```

---

## 🎮 Configuración por Juego

### `games-config.json`

```json
{
  "square-rush": {
    "name": "Square Rush",
    "score_type": "points",
    "has_levels": true,
    "has_time": true,
    "leaderboard_limit": 10,
    "metadata_schema": {
      "difficulty": ["BABY STEPS", "YOUNG PUPIL", "SEMI PRO", "MASTER"],
      "errors": "number",
      "combo_max": "number",
      "perfect_moves": "number"
    }
  },
  "knight-quest": {
    "name": "Knight Quest",
    "score_type": "points",
    "has_levels": true,
    "has_time": true,
    "leaderboard_limit": 10,
    "metadata_schema": {
      "board_size": ["4x4", "5x5", "6x6", "7x7", "8x8"],
      "hints_used": "number",
      "moves_count": "number"
    }
  },
  "memory-matrix": {
    "name": "Memory Matrix",
    "score_type": "level_reached",
    "has_levels": true,
    "has_time": false,
    "leaderboard_limit": 10,
    "metadata_schema": {
      "level": ["EASY", "MEDIUM", "HARD"],
      "mistakes": "number",
      "streak_max": "number"
    }
  },
  "master-sequence": {
    "name": "Master Sequence",
    "score_type": "sequence_length",
    "has_levels": false,
    "has_time": false,
    "leaderboard_limit": 10,
    "metadata_schema": {
      "sequence_length": "number",
      "speed": ["SLOW", "NORMAL", "FAST"],
      "lives_remaining": "number"
    }
  },
  "chessinfive": {
    "name": "ChessInFive",
    "score_type": "wins",
    "has_levels": false,
    "has_time": true,
    "leaderboard_limit": 10,
    "metadata_schema": {
      "opponent": ["AI", "HUMAN"],
      "difficulty": ["EASY", "MEDIUM", "HARD"],
      "total_moves": "number",
      "winning_pattern": ["horizontal", "vertical", "diagonal", "anti-diagonal"]
    }
  }
}
```

---

## 📈 Escalabilidad Futura

### Fase 1: Honor System (Actual) ← **ESTAMOS AQUÍ**
- ✅ Sin autenticación
- ✅ Nombres de 15 caracteres (3 primeras destacadas)
- ✅ **Banderas de país** (detección automática + edición manual)
- ✅ **Tooltip con nombre del país** en hover
- ✅ Rate limiting por IP
- ✅ Leaderboards globales
- ✅ **Rankings por país** (vista adicional)

### Fase 2: User Accounts (Q1 2026)
```sql
-- Nueva tabla: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE
);

-- Modificar tabla scores
ALTER TABLE scores
  ADD COLUMN user_id INTEGER REFERENCES users(id),
  ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;

-- Índice para relación
CREATE INDEX idx_user_scores ON scores(user_id, score DESC);
```

**Features:**
- Login opcional (mantener honor system)
- Scores verificados vs. no verificados
- Perfil de usuario con historial
- Avatares personalizados

---

### Fase 3: ELO Rankings (Q2 2026)

```sql
-- Nueva tabla: elo_ratings
CREATE TABLE elo_ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    game VARCHAR(50) NOT NULL,
    rating INTEGER DEFAULT 1200,    -- ELO inicial
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    peak_rating INTEGER DEFAULT 1200,
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, game)
);

-- Nueva tabla: matches (para PvP)
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    game VARCHAR(50) NOT NULL,
    player1_id INTEGER REFERENCES users(id),
    player2_id INTEGER REFERENCES users(id),
    winner_id INTEGER REFERENCES users(id),
    player1_rating_before INTEGER,
    player2_rating_before INTEGER,
    player1_rating_after INTEGER,
    player2_rating_after INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**
- Matchmaking basado en ELO
- Modo competitivo separado
- Temporadas (seasons) con resets
- Rewards por ranking

---

### Fase 4: Niveles Adicionales & Items

```sql
-- Nueva tabla: user_inventory
CREATE TABLE user_inventory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game VARCHAR(50) NOT NULL,
    item_type VARCHAR(50),           -- 'theme', 'powerup', 'avatar', etc.
    item_id VARCHAR(100),
    acquired_at TIMESTAMP DEFAULT NOW(),
    is_equipped BOOLEAN DEFAULT FALSE,

    UNIQUE(user_id, game, item_type, item_id)
);

-- Nueva tabla: achievements
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game VARCHAR(50) NOT NULL,
    achievement_id VARCHAR(100),
    unlocked_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, game, achievement_id)
);
```

**Features Square Rush:**
- Nuevos niveles: "GRANDMASTER", "LEGENDARY"
- Power-ups: "UNDO MOVE", "HIGHLIGHT HINT", "FREEZE TIME"
- Temas: "NEON PURPLE", "RETRO AMBER", "MATRIX GREEN"

**Features ChessInFive:**
- Modos: "BLITZ (5min)", "RAPID (15min)", "CLASSICAL (30min)"
- Variantes: "No Queens", "Knights Only", "Diagonal Victory"
- AI personalities: "Aggressive", "Defensive", "Balanced"

---

## 📝 Plan de Implementación

### Sprint 1: Backend Setup (1 semana)

**Tareas:**
- [ ] Crear cuenta Vercel (si no existe)
- [ ] Configurar Vercel Postgres database
- [ ] Configurar Vercel KV (Redis) para rate limiting
- [ ] Ejecutar schema.sql en Postgres
- [ ] Crear estructura de carpetas `/api/scores/`

---

### Sprint 2: API Development (1 semana)

**Tareas:**
- [ ] Implementar `POST /api/scores` endpoint
  - [ ] Validación de input (validator.js)
  - [ ] Rate limiting (rateLimit.js)
  - [ ] Filtro de profanidad (profanity.js)
  - [ ] Inserción en Postgres
  - [ ] Retornar ranking actual
- [ ] Implementar `GET /api/scores/leaderboard` endpoint
  - [ ] Query parametrizada por juego
  - [ ] Limit y paginación
  - [ ] Ordenamiento por score DESC
- [ ] Implementar `GET /api/scores/recent` endpoint
  - [ ] Últimas 20 submissions
  - [ ] Filtro opcional por juego
- [ ] Testing con Postman/Insomnia

---

### Sprint 3: Frontend Integration (1 semana)

**Tareas por juego:**

#### Square Rush
- [ ] Crear modal "Submit Score" al terminar partida
- [ ] Input field de nombre (15 chars max, uppercase automático)
- [ ] Botón "SUBMIT TO LEADERBOARD"
- [ ] Mostrar leaderboard in-game (top 10)
- [ ] Highlighting de primeras 3 letras (CSS)
- [ ] Animación cuando entras al top 10

#### Knight Quest
- [ ] (Igual que Square Rush, adaptado al juego)

#### Memory Matrix
- [ ] (Igual que Square Rush, adaptado al juego)

#### Master Sequence
- [ ] (Igual que Square Rush, adaptado al juego)

#### ChessInFive
- [ ] (Igual que Square Rush, adaptado al juego)

---

### Sprint 4: Polish & Deploy (1 semana)

**Tareas:**
- [ ] Pruebas de rate limiting (intentar spam)
- [ ] Pruebas de profanity filter
- [ ] Pruebas de validación (nombres inválidos, scores negativos)
- [ ] Responsive design del leaderboard (mobile)
- [ ] Animaciones y efectos de sonido
- [ ] Deploy a producción
- [ ] Monitoreo de Vercel Analytics
- [ ] Documentación de uso para jugadores

---

## 🎯 Métricas de Éxito

### KPIs Fase 1 (Primeros 3 meses)

| Métrica | Target | Tracking |
|---------|--------|----------|
| **Submissions totales** | 1,000+ | Postgres query |
| **Jugadores únicos** | 500+ | `COUNT(DISTINCT ip_hash)` |
| **Tasa de spam detectado** | <5% | Profanity filter hits |
| **Uptime API** | >99.5% | Vercel Analytics |
| **Latencia p95** | <200ms | Vercel Analytics |
| **Rate limit hits** | <10% | KV metrics |

### Analytics Dashboard (Vercel)

```sql
-- Query: Jugadores por juego
SELECT game, COUNT(*) as total_scores, COUNT(DISTINCT ip_hash) as unique_players
FROM scores
GROUP BY game
ORDER BY total_scores DESC;

-- Query: Top 10 global (cross-game)
SELECT player_name, game, score, created_at
FROM scores
ORDER BY score DESC
LIMIT 10;

-- Query: Activity heatmap (últimos 7 días)
SELECT DATE(created_at) as date, COUNT(*) as submissions
FROM scores
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date;
```

---

## 🔧 Troubleshooting

### Problema: Rate Limit No Funciona

**Síntoma:** Usuarios pueden hacer spam ilimitado

**Diagnóstico:**
```javascript
// Verificar conexión a KV
import { kv } from '@vercel/kv';
const test = await kv.get('test');
console.log('KV Connection:', test !== null);
```

**Solución:**
1. Verificar que `KV_REST_API_URL` y `KV_REST_API_TOKEN` están configurados
2. Revisar que el proyecto está en región compatible
3. Verificar límites del free tier (100K comandos/día)

---

### Problema: Postgres Timeout

**Síntoma:** `Error: Connection timeout`

**Diagnóstico:**
```javascript
// Verificar pooling
import { sql } from '@vercel/postgres';
const result = await sql`SELECT NOW()`;
console.log('DB Connection:', result.rows[0]);
```

**Solución:**
1. Usar `POSTGRES_PRISMA_URL` con pgBouncer para pooling
2. Implementar retry logic (3 intentos)
3. Aumentar timeout en `vercel.json`:
```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10
    }
  }
}
```

---

### Problema: Nombres con Caracteres Raros

**Síntoma:** Nombres como `█████` o `\u0000` se guardan

**Solución:**
```javascript
// Mejorar validación en validator.js
const sanitizedName = name
  .replace(/[^\x20-\x7E]/g, '')  // Solo ASCII printable
  .trim()
  .toUpperCase();

if (sanitizedName.length === 0) {
  return { valid: false, error: 'Invalid characters in name' };
}
```

---

## 📚 Referencias

### Documentación Técnica
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Functions API](https://vercel.com/docs/functions/serverless-functions)

### Inspiración de Diseño
- [Arcade High Score Tables](https://www.arcade-museum.com/)
- [Pac-Man Leaderboard](https://en.wikipedia.org/wiki/List_of_Pac-Man_scores)
- [Street Fighter ELO System](https://game.capcom.com/cfn/sfv/ranking/)

---

## 🏆 Conclusión

Este sistema de leaderboard está diseñado para:

1. ✅ **Empezar simple** - Honor system sin fricción, submit instantáneo
2. ✅ **Escalar fácilmente** - Arquitectura preparada para login y ELO
3. ✅ **Mantener el espíritu arcade** - Nombres destacados, estética retro, banderas de país
4. ✅ **Ser visualmente atractivo** - Banderas añaden color e identidad internacional
5. ✅ **Ser robusto** - Rate limiting, validación, anti-spam
6. ✅ **Aprovechar Vercel** - Free tier generoso, deploy automático, geolocalización nativa

### 🌟 Features Destacadas v1.1.0

- **🌍 Banderas de país automáticas** (detectadas por IP vía Vercel headers)
- **✏️ Edición manual de bandera** (el jugador puede cambiarla)
- **💬 Tooltip informativo** al pasar mouse sobre bandera
- **🏅 Rankings por país** (vista adicional de "Top Countries")
- **🎨 3 primeras letras destacadas** con efecto neón brillante

**Próximo paso:** Implementar Sprint 1 (Backend Setup).

---

**Versión:** 1.1.0
**Última actualización:** Noviembre 2025
**Mantenido por:** ChessArcade Team
**Licencia:** Propietaria

---

## 📝 Changelog

### v1.1.0 (2025-11-04)
- ➕ **Feature:** Sistema de banderas de país
  - Detección automática por IP (Vercel Geolocation)
  - Edición manual de país
  - Tooltip con nombre completo del país
  - Rankings por país (vista adicional)
  - Campos `country_code` y `country_name` en database
  - Índice optimizado para queries por país
- 📝 **Docs:** Sección completa de "Sistema de Banderas de País"
- 🎨 **UI:** Ejemplos actualizados con banderas en todos los conceptos
- 📊 **API:** Endpoints actualizados para incluir información de país

### v1.0.0 (2025-11-03)
- 🎉 **Initial Release**
  - Sistema de honor sin autenticación
  - Nombres de 15 caracteres (3 primeras destacadas)
  - Rate limiting por IP
  - Leaderboards globales
  - Multi-juego (5 juegos soportados)
  - Vercel Serverless + Postgres + KV
  - 4 conceptos de diseño UI/UX
