# ChessArcade - Leaderboard Backend System Design

**Versión:** 1.2.0
**Fecha:** Noviembre 2025
**Estado:** Diseño
**Autor:** ChessArcade Team
**Última Actualización:** 2025-11-04 - Features avanzadas: Paginación, búsqueda, ordenamiento, edge cases

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Especificaciones de Nombres](#especificaciones-de-nombres)
4. [Sistema de Banderas de País](#sistema-de-banderas-de-país)
5. [Base de Datos](#base-de-datos)
6. [API Endpoints](#api-endpoints)
7. [Paginación y Navegación](#paginación-y-navegación)
8. [Búsqueda de Jugadores](#búsqueda-de-jugadores)
9. [Ordenamiento y Filtros](#ordenamiento-y-filtros)
10. [Manejo de Edge Cases](#manejo-de-edge-cases)
11. [Seguridad y Validación](#seguridad-y-validación)
12. [Despliegue en Vercel](#despliegue-en-vercel)
13. [UI/UX - Ideas de Diseño](#uiux---ideas-de-diseño)
14. [Escalabilidad Futura](#escalabilidad-futura)
15. [Configuración por Juego](#configuración-por-juego)
16. [Plan de Implementación](#plan-de-implementación)

---

## 🎯 Visión General

Sistema de leaderboard (tabla de clasificación) estilo **arcade retro** para todos los juegos de ChessArcade. Sin autenticación inicial, basado en el sistema de honor clásico de las máquinas arcade.

### Características Principales

- ✅ **Sin login requerido** (Sistema de honor)
- ✅ **Nombres de 15 caracteres máximo** con las 3 primeras letras destacadas
- ✅ **Banderas de país** detectadas por IP (editables por el jugador)
- ✅ **Paginación** - Navegación por miles de registros
- ✅ **Búsqueda de jugadores** - Encuentra cualquier nombre
- ✅ **Ordenamiento múltiple** - Por ranking, nombre, fecha, país
- ✅ **Edge cases cubiertos** - Nombres vacíos, desconexiones, abandonos
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

## 📄 Paginación y Navegación

### Problema: Escalar a Miles de Registros

Con el tiempo, cada juego acumulará **miles de scores**. Cargar 1,000+ registros de una vez:
- ❌ Consume mucho ancho de banda
- ❌ Lento para el usuario
- ❌ Costoso para Postgres (memoria + CPU)

**Solución:** Paginación con LIMIT/OFFSET.

---

### Opción A: Paginación Clásica (Recomendado)

```
┌─────────────────────────────────────────────────────────┐
│            🏆 SQUARE RUSH - LEADERBOARD                 │
├──────┬──────┬────────────────────┬─────────────────────┤
│  #1  │ 🇺🇸  │ JOHn smith         │ 15,000 pts          │
│  #2  │ 🇦🇷  │ ALE x rodriguez    │ 12,500 pts          │
│  #3  │ 🇧🇷  │ MAR costas         │ 11,000 pts          │
│  ...                                                    │
│ #10  │ 🇪🇸  │ CAR los perez      │ 8,000 pts           │
└──────┴──────┴────────────────────┴─────────────────────┘

        [< Prev]  [1] [2] [3] ... [100]  [Next >]

              Showing 1-10 of 1,543 players
```

#### API Endpoint

```
GET /api/scores/leaderboard?game=square-rush&page=1&limit=50
GET /api/scores/leaderboard?game=square-rush&page=2&limit=50
```

**Query Parameters:**
- `page` (default: 1) - Número de página
- `limit` (default: 50, max: 100) - Registros por página

**Response:**
```json
{
  "success": true,
  "game": "square-rush",
  "pagination": {
    "current_page": 1,
    "total_pages": 31,
    "total_entries": 1543,
    "per_page": 50,
    "has_next": true,
    "has_prev": false
  },
  "leaderboard": [
    {
      "rank": 1,
      "player_name": "JOHN SMITH",
      "country_code": "US",
      "score": 15000
    }
    // ... 49 más
  ]
}
```

#### SQL Query

```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
  id,
  player_name,
  country_code,
  country_name,
  score,
  level,
  time_ms,
  created_at
FROM scores
WHERE game = $1
ORDER BY score DESC
LIMIT $2 OFFSET $3;
```

**Valores:**
- `$1` = `'square-rush'`
- `$2` = `50` (limit)
- `$3` = `(page - 1) * limit` = `0` para página 1, `50` para página 2, etc.

#### Backend Implementation

```javascript
// api/scores/leaderboard.js
export default async function handler(req, res) {
  const { game, page = 1, limit = 50 } = req.query;

  // Validación
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Query principal
  const { rows: scores } = await sql`
    SELECT
      ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
      player_name,
      country_code,
      country_name,
      score,
      level,
      time_ms,
      created_at
    FROM scores
    WHERE game = ${game}
    ORDER BY score DESC
    LIMIT ${limitNum} OFFSET ${offset}
  `;

  // Contar total de registros
  const { rows: countResult } = await sql`
    SELECT COUNT(*) as total FROM scores WHERE game = ${game}
  `;
  const totalEntries = parseInt(countResult[0].total);
  const totalPages = Math.ceil(totalEntries / limitNum);

  res.json({
    success: true,
    game,
    pagination: {
      current_page: pageNum,
      total_pages: totalPages,
      total_entries: totalEntries,
      per_page: limitNum,
      has_next: pageNum < totalPages,
      has_prev: pageNum > 1
    },
    leaderboard: scores
  });
}
```

---

### Opción B: Scroll Infinito

Para una experiencia más fluida en móviles:

```javascript
// Frontend: Cargar más al hacer scroll
let currentOffset = 0;
const BATCH_SIZE = 50;

async function loadMore() {
  const response = await fetch(
    `/api/scores/leaderboard?game=square-rush&offset=${currentOffset}&limit=${BATCH_SIZE}`
  );
  const data = await response.json();

  // Agregar a la lista existente
  data.leaderboard.forEach(entry => {
    appendToLeaderboard(entry);
  });

  currentOffset += BATCH_SIZE;

  // Deshabilitar si no hay más
  if (!data.has_more) {
    disableInfiniteScroll();
  }
}

// Detectar cuando el usuario está cerca del final
window.addEventListener('scroll', () => {
  const scrollBottom = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollBottom >= pageHeight - 200) {  // 200px antes del final
    loadMore();
  }
});
```

**API Response para Scroll Infinito:**
```json
{
  "success": true,
  "game": "square-rush",
  "offset": 0,
  "limit": 50,
  "has_more": true,
  "total_entries": 1543,
  "leaderboard": [...]
}
```

---

### Optimización: Índices de Database

Para que LIMIT/OFFSET sea rápido con miles de registros:

```sql
-- Índice compuesto para ordenamiento rápido
CREATE INDEX idx_game_score_desc ON scores(game, score DESC);

-- Query usa el índice automáticamente
EXPLAIN ANALYZE
SELECT * FROM scores
WHERE game = 'square-rush'
ORDER BY score DESC
LIMIT 50 OFFSET 1000;

-- Resultado esperado:
-- Index Scan using idx_game_score_desc
-- Planning time: 0.5ms
-- Execution time: 2.3ms  ← Rápido incluso con 100K registros
```

---

### UI/UX - Componente de Paginación

```html
<div class="pagination">
  <button class="page-btn" id="prev-page" disabled>
    ◀ Previous
  </button>

  <div class="page-numbers">
    <button class="page-num active">1</button>
    <button class="page-num">2</button>
    <button class="page-num">3</button>
    <span class="page-ellipsis">...</span>
    <button class="page-num">31</button>
  </div>

  <button class="page-btn" id="next-page">
    Next ▶
  </button>
</div>

<div class="pagination-info">
  Showing <strong>1-50</strong> of <strong>1,543</strong> players
</div>
```

**CSS Arcade Style:**
```css
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  font-family: 'Press Start 2P', monospace;
}

.page-btn {
  background: rgba(0, 188, 212, 0.2);
  border: 2px solid #00bcd4;
  color: #00bcd4;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: rgba(0, 188, 212, 0.4);
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.5);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-num {
  background: transparent;
  border: 1px solid #00bcd4;
  color: #00bcd4;
  padding: 8px 15px;
  cursor: pointer;
  min-width: 40px;
}

.page-num.active {
  background: #00bcd4;
  color: #1a1a2e;
  font-weight: bold;
  box-shadow: 0 0 10px #00bcd4;
}

.page-ellipsis {
  color: #00bcd4;
  padding: 0 10px;
}

.pagination-info {
  text-align: center;
  color: #aaa;
  font-size: 0.9em;
  margin-top: 10px;
}
```

---

### Recomendación

**Usar Paginación Clásica** porque:
- ✅ Mejor para Postgres (queries consistentes)
- ✅ Usuario puede saltar directo a página N
- ✅ Más fácil de implementar
- ✅ Mejor UX en desktop
- ✅ Compatible con búsquedas y ordenamiento

---

## 🔍 Búsqueda de Jugadores

### Feature: Buscar por Nombre

Los usuarios querrán **buscar sus propios scores** o ver cómo les fue a amigos.

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Search player: [john smith______] [🔎 Search]      │
│                                                         │
│            🏆 SQUARE RUSH - SEARCH RESULTS              │
├──────┬──────┬────────────────────┬─────────────────────┤
│ #142 │ 🇺🇸  │ JOHn smith         │ 8,520 pts           │
│      │      │ ^^^ (your search)                        │
├──────┼──────┼────────────────────┼─────────────────────┤
│ #287 │ 🇦🇷  │ JOHnny doe         │ 6,100 pts           │
└──────┴──────┴────────────────────┴─────────────────────┘

Found 2 players matching "john"
```

---

### API Endpoint

```
GET /api/scores/search?game=square-rush&name=john&limit=10
```

**Query Parameters:**
- `game` (required) - ID del juego
- `name` (required) - Término de búsqueda (min 2 caracteres)
- `limit` (optional, default: 10) - Máximo resultados

**Response:**
```json
{
  "success": true,
  "game": "square-rush",
  "search_term": "john",
  "found": 2,
  "results": [
    {
      "rank": 142,
      "player_name": "JOHN SMITH",
      "country_code": "US",
      "score": 8520,
      "level": "MASTER",
      "created_at": "2025-11-03T10:30:00Z"
    },
    {
      "rank": 287,
      "player_name": "JOHNNY DOE",
      "country_code": "AR",
      "score": 6100,
      "level": "SEMI PRO",
      "created_at": "2025-11-02T15:45:00Z"
    }
  ]
}
```

---

### SQL Query con ILIKE (Case-Insensitive)

```sql
WITH ranked_scores AS (
  SELECT
    ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
    player_name,
    country_code,
    country_name,
    score,
    level,
    time_ms,
    created_at
  FROM scores
  WHERE game = $1
)
SELECT *
FROM ranked_scores
WHERE player_name ILIKE $2  -- Case-insensitive LIKE
ORDER BY rank ASC
LIMIT $3;
```

**Valores:**
- `$1` = `'square-rush'`
- `$2` = `'%john%'` (búsqueda parcial)
- `$3` = `10` (limit)

**Ejemplo:** `ILIKE '%john%'` encuentra:
- ✅ `JOHN SMITH`
- ✅ `JOHNNY DOE`
- ✅ `MARY JOHNS`
- ❌ `JANE DOE`

---

### Backend Implementation

```javascript
// api/scores/search.js
export default async function handler(req, res) {
  const { game, name, limit = 10 } = req.query;

  // Validación
  if (!game || !name) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: game, name'
    });
  }

  if (name.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Search term must be at least 2 characters'
    });
  }

  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const searchPattern = `%${name}%`;

  // Query con ranking
  const { rows: results } = await sql`
    WITH ranked_scores AS (
      SELECT
        ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
        player_name,
        country_code,
        country_name,
        score,
        level,
        time_ms,
        created_at
      FROM scores
      WHERE game = ${game}
    )
    SELECT *
    FROM ranked_scores
    WHERE player_name ILIKE ${searchPattern}
    ORDER BY rank ASC
    LIMIT ${limitNum}
  `;

  res.json({
    success: true,
    game,
    search_term: name,
    found: results.length,
    results
  });
}
```

---

### Optimización: Full-Text Search (Opcional)

Para búsquedas más rápidas con 100K+ registros:

```sql
-- Añadir índice de texto
CREATE INDEX idx_player_name_search ON scores
USING gin(to_tsvector('simple', player_name));

-- Query optimizada
SELECT
  ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
  player_name,
  score
FROM scores
WHERE game = 'square-rush'
  AND to_tsvector('simple', player_name) @@ to_tsquery('simple', 'john:*')
ORDER BY score DESC
LIMIT 10;
```

**Ventaja:** 10x más rápido que ILIKE en tablas grandes.

---

### Frontend: Search Box Component

```html
<div class="search-container">
  <input
    type="text"
    id="search-input"
    placeholder="Search player name..."
    maxlength="15"
  >
  <button id="search-btn">🔎 Search</button>
  <button id="clear-search" class="hidden">✖ Clear</button>
</div>

<div id="search-results" class="hidden">
  <h3>Search Results</h3>
  <div id="results-list"></div>
</div>

<script>
document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value.trim();

  if (query.length < 2) {
    alert('Please enter at least 2 characters');
    return;
  }

  const response = await fetch(
    `/api/scores/search?game=square-rush&name=${encodeURIComponent(query)}`
  );
  const data = await response.json();

  displaySearchResults(data.results);
});

function displaySearchResults(results) {
  const container = document.getElementById('results-list');
  container.innerHTML = '';

  if (results.length === 0) {
    container.innerHTML = '<p>No players found.</p>';
    return;
  }

  results.forEach(result => {
    const entry = document.createElement('div');
    entry.className = 'leaderboard-entry';
    entry.innerHTML = `
      <span class="rank">#${result.rank}</span>
      <img src="flags/${result.country_code}.svg" class="flag-icon">
      <span class="player-name">
        <span class="first-three">${result.player_name.slice(0, 3)}</span>
        <span class="rest">${result.player_name.slice(3)}</span>
      </span>
      <span class="score">${result.score.toLocaleString()} pts</span>
    `;
    container.appendChild(entry);
  });

  document.getElementById('search-results').classList.remove('hidden');
  document.getElementById('clear-search').classList.remove('hidden');
}
</script>
```

---

## ⚙️ Ordenamiento y Filtros

### Feature: Múltiples Modos de Ordenamiento

Los jugadores quieren ver el leaderboard desde diferentes perspectivas:

```
┌─────────────────────────────────────────────────────────┐
│  Sort by: [▼ Ranking] [Name A-Z] [Recent] [Country]    │
│                                                         │
│            🏆 SQUARE RUSH - LEADERBOARD                 │
└─────────────────────────────────────────────────────────┘
```

---

### Modos de Ordenamiento

| Modo | Descripción | SQL ORDER BY | Use Case |
|------|-------------|--------------|----------|
| **Ranking** ⭐ | Orden por puntuación (default) | `ORDER BY score DESC` | Ver los mejores |
| **Name A-Z** | Orden alfabético | `ORDER BY player_name ASC` | Buscar a alguien |
| **Recent** | Últimos scores primero | `ORDER BY created_at DESC` | Ver actividad reciente |
| **Country** | Agrupar por país | `ORDER BY country_name ASC, score DESC` | Comparación regional |

---

### API Endpoint

```
GET /api/scores/leaderboard?game=square-rush&sort=name&page=1&limit=50
```

**Query Parameter:**
- `sort` (optional, default: `ranking`)
  - `ranking` - Por puntuación DESC
  - `name` - Alfabético ASC
  - `recent` - Por fecha DESC
  - `country` - Por país ASC, luego puntuación DESC

---

### SQL Queries por Modo

#### 1. Ranking (Default)
```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
  *
FROM scores
WHERE game = 'square-rush'
ORDER BY score DESC
LIMIT 50 OFFSET 0;
```

#### 2. Name A-Z
```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY score DESC) as rank,  -- Ranking siempre por score
  *
FROM scores
WHERE game = 'square-rush'
ORDER BY player_name ASC  -- Pero ordenamos por nombre
LIMIT 50 OFFSET 0;
```

**Nota:** El ranking sigue siendo por score, pero la lista se ordena alfabéticamente.

#### 3. Recent
```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
  *
FROM scores
WHERE game = 'square-rush'
ORDER BY created_at DESC  -- Más recientes primero
LIMIT 50 OFFSET 0;
```

#### 4. Country
```sql
SELECT
  ROW_NUMBER() OVER (PARTITION BY country_code ORDER BY score DESC) as rank_in_country,
  ROW_NUMBER() OVER (ORDER BY score DESC) as global_rank,
  *
FROM scores
WHERE game = 'square-rush'
ORDER BY country_name ASC, score DESC
LIMIT 50 OFFSET 0;
```

**Output:**
```
🇦🇷 Argentina
  #5   ALEX RODRIGUEZ    12,500 pts  (rank_in_country: 1)
  #18  MARIA GOMEZ       9,200 pts   (rank_in_country: 2)

🇧🇷 Brazil
  #3   MARCOS COSTA      11,000 pts  (rank_in_country: 1)
  #12  PAULA SILVA       10,100 pts  (rank_in_country: 2)

🇺🇸 United States
  #1   JOHN SMITH        15,000 pts  (rank_in_country: 1)
  #7   MARY JONES        11,500 pts  (rank_in_country: 2)
```

---

### Backend Implementation

```javascript
// api/scores/leaderboard.js
export default async function handler(req, res) {
  const { game, sort = 'ranking', page = 1, limit = 50 } = req.query;

  // Validación
  const validSorts = ['ranking', 'name', 'recent', 'country'];
  if (!validSorts.includes(sort)) {
    return res.status(400).json({
      success: false,
      error: `Invalid sort mode. Use: ${validSorts.join(', ')}`
    });
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Determinar ORDER BY
  let orderByClause;
  let rankingClause = 'ROW_NUMBER() OVER (ORDER BY score DESC) as rank';

  switch (sort) {
    case 'ranking':
      orderByClause = 'ORDER BY score DESC';
      break;
    case 'name':
      orderByClause = 'ORDER BY player_name ASC';
      break;
    case 'recent':
      orderByClause = 'ORDER BY created_at DESC';
      break;
    case 'country':
      rankingClause = `
        ROW_NUMBER() OVER (PARTITION BY country_code ORDER BY score DESC) as rank_in_country,
        ROW_NUMBER() OVER (ORDER BY score DESC) as global_rank
      `;
      orderByClause = 'ORDER BY country_name ASC, score DESC';
      break;
  }

  // Query principal
  const { rows: scores } = await sql`
    SELECT
      ${sql.raw(rankingClause)},
      player_name,
      country_code,
      country_name,
      score,
      level,
      time_ms,
      created_at
    FROM scores
    WHERE game = ${game}
    ${sql.raw(orderByClause)}
    LIMIT ${limitNum} OFFSET ${offset}
  `;

  // Total count
  const { rows: countResult } = await sql`
    SELECT COUNT(*) as total FROM scores WHERE game = ${game}
  `;
  const totalEntries = parseInt(countResult[0].total);
  const totalPages = Math.ceil(totalEntries / limitNum);

  res.json({
    success: true,
    game,
    sort_mode: sort,
    pagination: {
      current_page: pageNum,
      total_pages: totalPages,
      total_entries: totalEntries,
      per_page: limitNum
    },
    leaderboard: scores
  });
}
```

---

### Frontend: Sort Dropdown

```html
<div class="sort-controls">
  <label for="sort-select">Sort by:</label>
  <select id="sort-select">
    <option value="ranking" selected>🏆 Ranking (Best Scores)</option>
    <option value="name">🔤 Name (A-Z)</option>
    <option value="recent">🕒 Recent (Newest First)</option>
    <option value="country">🌍 Country (A-Z)</option>
  </select>
</div>

<script>
document.getElementById('sort-select').addEventListener('change', async (e) => {
  const sortMode = e.target.value;
  const currentGame = 'square-rush';

  const response = await fetch(
    `/api/scores/leaderboard?game=${currentGame}&sort=${sortMode}&page=1&limit=50`
  );
  const data = await response.json();

  renderLeaderboard(data.leaderboard, sortMode);
});

function renderLeaderboard(scores, sortMode) {
  const container = document.getElementById('leaderboard-container');
  container.innerHTML = '';

  scores.forEach(entry => {
    // Mostrar rank apropiado según modo
    const rankDisplay = sortMode === 'country'
      ? `#${entry.global_rank} (${entry.country_name}: #${entry.rank_in_country})`
      : `#${entry.rank}`;

    const div = document.createElement('div');
    div.className = 'leaderboard-entry';
    div.innerHTML = `
      <span class="rank">${rankDisplay}</span>
      <img src="flags/${entry.country_code}.svg" class="flag-icon">
      <span class="player-name">
        <span class="first-three">${entry.player_name.slice(0, 3)}</span>
        <span class="rest">${entry.player_name.slice(3)}</span>
      </span>
      <span class="score">${entry.score.toLocaleString()} pts</span>
    `;
    container.appendChild(div);
  });
}
</script>
```

---

### Índices para Performance

```sql
-- Índice para sort por ranking (default)
CREATE INDEX idx_game_score_desc ON scores(game, score DESC);

-- Índice para sort por nombre
CREATE INDEX idx_game_name ON scores(game, player_name ASC);

-- Índice para sort por recent
CREATE INDEX idx_game_date ON scores(game, created_at DESC);

-- Índice para sort por país
CREATE INDEX idx_game_country_score ON scores(game, country_name ASC, score DESC);
```

---

## 🚨 Manejo de Edge Cases

### Caso 1: Jugador NO Ingresa Nombre (Vacío o Cancela)

#### Problema
Usuario termina el juego pero:
- Deja el input de nombre vacío
- Hace click en "Cancel" o cierra el modal
- Presiona ESC

#### Solución Recomendada: Nombre Automático

```javascript
// Frontend: Generar nombre si está vacío
function submitScore(score, level, metadata) {
  let playerName = document.getElementById('name-input').value.trim().toUpperCase();

  // Si está vacío, generar automático
  if (playerName.length === 0) {
    playerName = generateAnonymousName();
  }

  // Enviar al servidor
  fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      game: 'square-rush',
      player_name: playerName,
      score,
      level,
      metadata
    })
  });
}

// Generar nombre anónimo único
function generateAnonymousName() {
  const adjectives = ['SWIFT', 'BRAVE', 'WISE', 'COOL', 'FAST'];
  const nouns = ['PLAYER', 'KNIGHT', 'MASTER', 'GAMER', 'HERO'];
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj} ${noun} ${random}`;
  // Ejemplos: "SWIFT PLAYER 7142", "BRAVE KNIGHT 0023"
}
```

**Alternativas:**

| Opción | Ejemplo | Ventajas | Desventajas |
|--------|---------|----------|-------------|
| **Nombre generado** | `PLAYER 7A2K` | ✅ Leaderboard siempre lleno<br>✅ Jugador puede reconocerse | ⚠️ Menos personal |
| **Símbolos placeholder** | `??? ??? ???` | ✅ Visualmente claro que es anónimo | ❌ Menos motivador |
| **No guardar** | (nada) | ✅ Respeta decisión del jugador | ❌ Leaderboard vacío al inicio |

**Recomendación:** **Nombre generado** porque mantiene el leaderboard dinámico y motiva a otros jugadores.

---

### Caso 2: Se Corta la Conexión ANTES de Enviar

#### Problema
Usuario termina partida pero pierde Internet antes de hacer submit.

#### Solución: LocalStorage + Retry al Reconectar

```javascript
// Guardar score localmente durante el juego
function saveScorePending(scoreData) {
  const pending = {
    ...scoreData,
    timestamp: Date.now(),
    game: 'square-rush'
  };
  localStorage.setItem('pending_score', JSON.stringify(pending));
}

// Al cargar el juego, verificar si hay scores pendientes
window.addEventListener('load', async () => {
  const pendingStr = localStorage.getItem('pending_score');

  if (pendingStr) {
    const pending = JSON.parse(pendingStr);

    // Verificar que no sea muy antiguo (máximo 24 horas)
    const ageHours = (Date.now() - pending.timestamp) / (1000 * 60 * 60);

    if (ageHours < 24) {
      // Mostrar banner
      showPendingScoreBanner(pending);
    } else {
      // Muy antiguo, descartar
      localStorage.removeItem('pending_score');
    }
  }
});

function showPendingScoreBanner(pending) {
  const banner = document.createElement('div');
  banner.className = 'pending-score-banner';
  banner.innerHTML = `
    <p>You have a pending score: <strong>${pending.score.toLocaleString()} pts</strong></p>
    <button id="submit-pending">Submit Now</button>
    <button id="discard-pending">Discard</button>
  `;
  document.body.appendChild(banner);

  document.getElementById('submit-pending').addEventListener('click', async () => {
    const success = await submitScoreToServer(pending);
    if (success) {
      localStorage.removeItem('pending_score');
      banner.remove();
      alert('Score submitted successfully!');
    }
  });

  document.getElementById('discard-pending').addEventListener('click', () => {
    localStorage.removeItem('pending_score');
    banner.remove();
  });
}
```

**CSS para Banner:**
```css
.pending-score-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 193, 7, 0.95);
  color: #1a1a2e;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
  z-index: 10000;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8em;
  text-align: center;
}

.pending-score-banner button {
  margin: 10px 5px 0;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9em;
}

#submit-pending {
  background: #00bcd4;
  color: #fff;
}

#discard-pending {
  background: #666;
  color: #fff;
}
```

---

### Caso 3: Se Corta DURANTE el Envío (POST Request)

#### Problema
Request a `/api/scores` falla por timeout o red caída.

#### Solución: Retry Automático con Exponential Backoff

```javascript
async function submitScoreWithRetry(scoreData, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData),
        signal: AbortSignal.timeout(10000)  // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Score submitted successfully!', data);
      return { success: true, data };

    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      } else {
        // Todos los intentos fallaron, guardar localmente
        console.error('All retry attempts failed. Saving locally.');
        localStorage.setItem('failed_submission', JSON.stringify(scoreData));
        return { success: false, error: 'Network error' };
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Uso:
const result = await submitScoreWithRetry({
  game: 'square-rush',
  player_name: 'JOHN SMITH',
  score: 12500,
  level: 'MASTER'
});

if (!result.success) {
  alert('Could not submit score. It has been saved and will retry later.');
}
```

---

### Caso 4: Usuario Abandona el Modal Sin Enviar

#### Problema
Usuario cierra el modal de "Submit Score" sin hacer submit.

#### Solución: Guardar como Pendiente

```javascript
// Modal de submit score
const modal = document.getElementById('submit-score-modal');
const submitBtn = document.getElementById('submit-btn');
const maybeLaterBtn = document.getElementById('maybe-later-btn');
const closeBtn = document.getElementById('close-modal-btn');

// Si hace submit, enviar normal
submitBtn.addEventListener('click', async () => {
  const name = document.getElementById('name-input').value.trim();
  await submitScore(name);
  modal.style.display = 'none';
});

// Si hace "Maybe Later", guardar pendiente
maybeLaterBtn.addEventListener('click', () => {
  const scoreData = {
    game: 'square-rush',
    score: currentScore,
    level: currentLevel,
    timestamp: Date.now()
  };
  localStorage.setItem('pending_score', JSON.stringify(scoreData));
  modal.style.display = 'none';

  // Mostrar toast
  showToast('Score saved! You can submit it later from the main menu.');
});

// Si cierra el modal (X), también guardar pendiente
closeBtn.addEventListener('click', () => {
  const scoreData = {
    game: 'square-rush',
    score: currentScore,
    level: currentLevel,
    timestamp: Date.now()
  };
  localStorage.setItem('pending_score', JSON.stringify(scoreData));
  modal.style.display = 'none';
});
```

**Nota:** En el próximo inicio del juego, el banner de "pending score" aparecerá automáticamente (ver Caso 2).

---

### Caso 5: Nombres con Caracteres Inválidos

#### Problema
Usuario intenta enviar nombres con emojis, caracteres Unicode raros, o intentos de XSS.

#### Solución: Sanitización en Frontend y Backend

**Frontend (Prevención):**
```javascript
const nameInput = document.getElementById('name-input');

nameInput.addEventListener('input', (e) => {
  // Solo permitir letras, números, espacios, guiones, puntos
  e.target.value = e.target.value
    .replace(/[^A-Za-z0-9\s\-\.]/g, '')  // Quitar inválidos
    .slice(0, 15)                        // Max 15 chars
    .toUpperCase();                      // Convertir a mayúsculas
});
```

**Backend (Validación):**
```javascript
// middleware/validator.js
function sanitizeName(name) {
  return name
    .replace(/[^\x20-\x7E]/g, '')  // Solo ASCII printable
    .replace(/[^A-Z0-9\s\-\.]/gi, '')  // Solo alfanuméricos, espacios, - y .
    .trim()
    .toUpperCase()
    .slice(0, 15);
}

export function validateRequest(body) {
  let { player_name } = body;

  if (!player_name || typeof player_name !== 'string') {
    return { valid: false, error: 'Player name is required' };
  }

  player_name = sanitizeName(player_name);

  if (player_name.length === 0) {
    return { valid: false, error: 'Player name contains only invalid characters' };
  }

  // Reemplazar en body
  body.player_name = player_name;

  return { valid: true };
}
```

---

### Caso 6: Score Demasiado Alto (Posible Cheat)

#### Problema
Usuario envía un score imposible (ej. 999,999,999 pts cuando el máximo realista es 50,000).

#### Solución: Validación por Juego

```javascript
// games-config.js
export const GAME_LIMITS = {
  'square-rush': {
    max_score: 100000,      // Máximo teórico posible
    max_time_ms: 3600000    // 1 hora máximo
  },
  'knight-quest': {
    max_score: 50000,
    max_time_ms: 1800000    // 30 minutos
  },
  'chessinfive': {
    max_score: 1,           // Solo victoria (1) o derrota (0)
    max_time_ms: 7200000    // 2 horas
  }
};

// middleware/validator.js
import { GAME_LIMITS } from '../games-config.js';

export function validateRequest(body) {
  const { game, score, time_ms } = body;

  const limits = GAME_LIMITS[game];
  if (!limits) {
    return { valid: false, error: 'Invalid game ID' };
  }

  // Validar score
  if (score > limits.max_score) {
    return {
      valid: false,
      error: `Score too high. Maximum for ${game}: ${limits.max_score}`
    };
  }

  // Validar tiempo
  if (time_ms && time_ms > limits.max_time_ms) {
    return {
      valid: false,
      error: `Time too long. Maximum: ${limits.max_time_ms}ms`
    };
  }

  return { valid: true };
}
```

---

### Resumen de Edge Cases

| Caso | Estrategia | Resultado en DB |
|------|------------|-----------------|
| **Nombre vacío** | Generar nombre automático (`PLAYER 7A2K`) | ✅ Score guardado con nombre generado |
| **Conexión cortada antes** | Guardar en localStorage + banner al volver | ❌ No se guarda hasta que usuario lo envíe |
| **Conexión cortada durante** | Retry 3 veces + guardar en localStorage | ❌ No se guarda hasta retry exitoso |
| **Usuario abandona modal** | Guardar como pendiente en localStorage | ❌ No se guarda hasta que usuario lo envíe |
| **Caracteres inválidos** | Sanitizar (quitar emojis, XSS, etc.) | ✅ Score guardado con nombre sanitizado |
| **Score imposible** | Rechazar si excede límite del juego | ❌ No se guarda, retorna error 400 |

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
│       ├── leaderboard.js        # GET /api/scores/leaderboard (paginación + sort)
│       ├── search.js             # GET /api/scores/search (búsqueda por nombre)
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
5. ✅ **Manejar edge cases** - Nombres vacíos, desconexiones, abandonos cubiertos
6. ✅ **Escalar a miles de usuarios** - Paginación, búsqueda, ordenamiento
7. ✅ **Ser robusto** - Rate limiting, validación, anti-spam, anti-cheat
8. ✅ **Aprovechar Vercel** - Free tier generoso, deploy automático, geolocalización nativa

### 🌟 Features Destacadas v1.2.0

#### Core Features
- **🎮 Honor System** - Submit instantáneo sin fricción de login
- **📛 Nombres de 15 caracteres** con las 3 primeras letras en neón brillante
- **🌍 Banderas de país automáticas** detectadas por IP (editables)
- **💬 Tooltip informativo** con nombre del país en hover

#### Navegación y Búsqueda
- **📄 Paginación robusta** - Navega por miles de registros (50/página)
- **🔍 Búsqueda de jugadores** - Encuentra cualquier nombre (case-insensitive)
- **⚙️ Ordenamiento múltiple** - Por ranking, nombre A-Z, recientes, país
- **🏅 Rankings por país** - Vista agrupada por nación

#### Edge Cases Cubiertos
- **👤 Nombres vacíos** → Generación automática (`SWIFT PLAYER 7142`)
- **🔌 Conexión cortada** → localStorage + retry automático (3 intentos)
- **❌ Usuario abandona** → Score guardado como pendiente
- **🛡️ Caracteres inválidos** → Sanitización automática (sin emojis/XSS)
- **⚠️ Scores imposibles** → Validación por juego (max scores configurables)

#### Optimizaciones
- **⚡ Índices de DB** optimizados para cada modo de ordenamiento
- **🔒 Rate limiting** - 10 submissions por hora por IP
- **📊 Full-text search** (opcional) para búsquedas ultrarrápidas

**Próximo paso:** Implementar Sprint 1 (Backend Setup).

---

**Versión:** 1.2.0
**Última actualización:** Noviembre 2025
**Mantenido por:** ChessArcade Team
**Licencia:** Propietaria

---

## 📝 Changelog

### v1.2.0 (2025-11-04) - Paginación, Búsqueda y Edge Cases ✨

#### 📄 Paginación y Navegación
- ➕ **Feature:** Sistema de paginación completo
  - Paginación clásica con LIMIT/OFFSET
  - Soporte para scroll infinito (alternativa)
  - Navegación por miles de registros (50 por página, máx 100)
  - Metadata de paginación (total_pages, has_next, has_prev)
  - Componente UI con botones Previous/Next
- ⚡ **Performance:** Índices optimizados para queries paginadas
- 📝 **API:** `?page=1&limit=50` en `/api/scores/leaderboard`

#### 🔍 Búsqueda de Jugadores
- ➕ **Feature:** Endpoint de búsqueda por nombre
  - Búsqueda case-insensitive (ILIKE)
  - Búsqueda parcial (`%john%` encuentra "JOHN", "JOHNNY", etc.)
  - Retorna ranking global de cada resultado
  - Límite configurable (default: 10, max: 50)
- ⚡ **Performance:** Full-text search opcional para 100K+ registros
- 📝 **API:** Nuevo endpoint `GET /api/scores/search?game=X&name=Y`
- 🎨 **UI:** Search box component con resultados destacados

#### ⚙️ Ordenamiento y Filtros
- ➕ **Feature:** 4 modos de ordenamiento
  1. **Ranking** (default) - Por puntuación DESC
  2. **Name A-Z** - Alfabético ASC
  3. **Recent** - Por fecha DESC (últimos scores)
  4. **Country** - Agrupado por país con rank local
- ⚡ **Performance:** Índices específicos para cada modo
- 📝 **API:** `?sort=ranking|name|recent|country`
- 🎨 **UI:** Dropdown selector con 4 opciones

#### 🚨 Manejo de Edge Cases
- ➕ **Feature:** Nombres vacíos
  - Generación automática de nombres (`SWIFT PLAYER 7142`)
  - 5 adjetivos + 5 sustantivos + 4 dígitos = nombres únicos
  - Leaderboard siempre poblado
- ➕ **Feature:** Conexión cortada
  - LocalStorage para scores pendientes
  - Banner amarillo al reconectar ("Submit pending score?")
  - Retry automático con exponential backoff (3 intentos)
  - Timeout de 24 horas para descarte automático
- ➕ **Feature:** Usuario abandona modal
  - Guardar score como pendiente en localStorage
  - Toast notification "Score saved for later"
  - Botón "Maybe Later" explícito
- 🛡️ **Security:** Sanitización de caracteres
  - Frontend: Solo A-Z, 0-9, espacios, guiones, puntos
  - Backend: Doble validación + sanitización
  - Protección contra XSS y emojis
- 🛡️ **Anti-cheat:** Validación de scores imposibles
  - Límites máximos configurables por juego
  - `GAME_LIMITS` con max_score y max_time_ms
  - Rechazo de scores que exceden el límite (400 error)

#### 📚 Documentación
- 📝 4 nuevas secciones principales (1,250+ líneas):
  1. **Paginación y Navegación** (300 líneas)
  2. **Búsqueda de Jugadores** (250 líneas)
  3. **Ordenamiento y Filtros** (280 líneas)
  4. **Manejo de Edge Cases** (420 líneas)
- 💻 Código completo de implementación
- 🎨 CSS arcade-style para todos los componentes
- 📊 SQL queries optimizadas para cada feature
- 🔧 Troubleshooting específico por edge case

#### 🎯 Cambios Técnicos
- **Database:** 4 nuevos índices para performance
- **API Structure:** Nuevo archivo `api/scores/search.js`
- **Frontend:** 3 nuevos componentes (pagination, search, sort dropdown)
- **Middleware:** Validación extendida en `validator.js`
- **Config:** Nuevo archivo `games-config.js` con límites por juego

**Total:** ~1,300 líneas de documentación añadidas
**Estado:** Diseño completo, listo para implementación

---

### v1.1.0 (2025-11-04) - Sistema de Banderas 🌍

- ➕ **Feature:** Sistema de banderas de país
  - Detección automática por IP (Vercel Geolocation)
  - Edición manual de país
  - Tooltip con nombre completo del país
  - Rankings por país (vista adicional)
  - Campos `country_code` y `country_name` en database
  - Índice optimizado para queries por país
- 📝 **Docs:** Sección completa de "Sistema de Banderas de País" (270 líneas)
- 🎨 **UI:** Ejemplos actualizados con banderas en todos los conceptos
- 📊 **API:** Endpoints actualizados para incluir información de país
- 🎨 **Library:** Recomendación de flag-icons (266 banderas SVG)

**Total:** ~300 líneas de documentación añadidas
**Estado:** Diseño completo

---

### v1.0.0 (2025-11-03) - Initial Release 🎉

- 🎉 **Initial Release**
  - Sistema de honor sin autenticación
  - Nombres de 15 caracteres (3 primeras destacadas)
  - Rate limiting por IP
  - Leaderboards globales
  - Multi-juego (5 juegos soportados)
  - Vercel Serverless + Postgres + KV
  - 4 conceptos de diseño UI/UX

**Total:** ~1,350 líneas de documentación
**Estado:** Diseño base completo
