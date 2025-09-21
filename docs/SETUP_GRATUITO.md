# 🎮 CHESSARCADE - SETUP 100% GRATUITO

## 💰 ARQUITECTURA GRATUITA COMPLETA

### 🏗️ STACK TECNOLÓGICO:
```
Frontend:     Hostinger Premium (ya lo tienes ✅)
Backend:      Vercel Functions (GRATIS - 100k requests/mes)
Database:     Supabase (GRATIS - 500MB, 50k requests/mes)
Auth:         Supabase Auth (GRATIS)
Storage:      LocalStorage + Supabase
```

### 💸 COSTO TOTAL: $0 EXTRA

---

## 🚀 FASE 1: DESARROLLO LOCAL SIN BACKEND (SEMANA 1-2)

### 📋 CARACTERÍSTICAS LOCALES:
- ✅ Todos los juegos funcionan offline
- ✅ Puntuaciones guardadas en localStorage
- ✅ Progreso local del usuario
- ✅ Sin necesidad de internet para jugar
- ✅ Puede desplegarse inmediatamente en Hostinger

### 🛠️ FUNCIONALIDADES SIN BACKEND:
```javascript
// Guardar localmente
function saveLocalScore(game, score) {
    const data = JSON.parse(localStorage.getItem('chessarcade_data') || '{}');
    if (!data[game]) data[game] = [];
    data[game].push({
        score: score,
        date: new Date().toISOString(),
        id: Date.now()
    });
    data[game].sort((a, b) => b.score - a.score);
    data[game] = data[game].slice(0, 10); // Top 10
    localStorage.setItem('chessarcade_data', JSON.stringify(data));
}

// Obtener rankings locales
function getLocalLeaderboard(game) {
    const data = JSON.parse(localStorage.getItem('chessarcade_data') || '{}');
    return data[game] || [];
}

// Sistema de achievements local
function unlockAchievement(achievementId) {
    const achievements = JSON.parse(localStorage.getItem('chessarcade_achievements') || '[]');
    if (!achievements.includes(achievementId)) {
        achievements.push(achievementId);
        localStorage.setItem('chessarcade_achievements', JSON.stringify(achievements));
        showAchievementNotification(achievementId);
    }
}
```

---

## 🌐 FASE 2: BACKEND GRATUITO CON VERCEL + SUPABASE (SEMANA 3-4)

### 🔧 SETUP VERCEL FUNCTIONS:

#### 📁 Estructura para Vercel:
```
api/
├── users/
│   └── register.js         # /api/users/register
├── games/
│   ├── save-score.js       # /api/games/save-score
│   └── leaderboard.js      # /api/games/leaderboard
└── auth/
    └── login.js            # /api/auth/login
```

#### 📄 Ejemplo: api/games/save-score.js
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, gameType, score, time, level } = req.body;

    try {
        const { data, error } = await supabase
            .from('game_scores')
            .insert([
                {
                    user_id: userId,
                    game_type: gameType,
                    score: score,
                    time_taken: time,
                    level: level,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
```

### 🗄️ SETUP SUPABASE:

#### 📊 Tablas básicas:
```sql
-- Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    total_coins INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
);

-- Puntuaciones
CREATE TABLE game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    game_type VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    time_taken INTEGER, -- en segundos
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Logros
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    achievement_id VARCHAR(100) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Índices para performance
CREATE INDEX idx_game_scores_user_game ON game_scores(user_id, game_type);
CREATE INDEX idx_game_scores_leaderboard ON game_scores(game_type, score DESC);
```

---

## 🔄 MIGRACIÓN GRADUAL: LOCAL → CLOUD

### 📋 ESTRATEGIA DE MIGRACIÓN:

#### 🏠 PASO 1: Detectar si hay backend disponible
```javascript
// En shared-utils.js
const API_BASE = 'https://chessarcade-api.vercel.app';
let isOnlineMode = false;

async function checkBackendAvailability() {
    try {
        const response = await fetch(`${API_BASE}/api/health`, { 
            method: 'GET',
            timeout: 3000 
        });
        isOnlineMode = response.ok;
    } catch (error) {
        isOnlineMode = false;
    }
    updateUIMode();
}

function updateUIMode() {
    const modeIndicator = document.getElementById('mode-indicator');
    if (modeIndicator) {
        modeIndicator.textContent = isOnlineMode ? '🌐 ONLINE' : '💾 LOCAL';
        modeIndicator.className = isOnlineMode ? 'online-mode' : 'local-mode';
    }
}
```

#### ☁️ PASO 2: Función híbrida para guardar datos
```javascript
async function saveGameScore(gameType, score, time, level = 1) {
    // Siempre guardar local primero (backup)
    saveLocalScore(gameType, score, time, level);
    
    // Si hay backend, guardar también online
    if (isOnlineMode) {
        try {
            const response = await fetch(`${API_BASE}/api/games/save-score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: getCurrentUserId(),
                    gameType,
                    score,
                    time,
                    level
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Score saved online:', result);
                syncLocalWithOnline(gameType); // Opcional: sincronizar
            }
        } catch (error) {
            console.log('Failed to save online, using local storage');
        }
    }
}
```

#### 🔄 PASO 3: Leaderboards híbridos
```javascript
async function getLeaderboard(gameType, limit = 10) {
    if (isOnlineMode) {
        try {
            const response = await fetch(`${API_BASE}/api/games/leaderboard?game=${gameType}&limit=${limit}`);
            if (response.ok) {
                const onlineData = await response.json();
                return formatLeaderboardData(onlineData, 'online');
            }
        } catch (error) {
            console.log('Failed to get online leaderboard, using local');
        }
    }
    
    // Fallback a datos locales
    const localData = getLocalLeaderboard(gameType);
    return formatLeaderboardData(localData, 'local');
}
```

---

## 📱 FUNCIONALIDADES PROGRESSIVE WEB APP (GRATIS)

### 🌐 PWA Setup para Hostinger:

#### 📄 manifest.json:
```json
{
    "name": "ChessArcade",
    "short_name": "ChessArcade",
    "description": "Retro chess gaming experience",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0a0a0a",
    "theme_color": "#ff0080",
    "icons": [
        {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

#### 📄 service-worker.js (cache para offline):
```javascript
const CACHE_NAME = 'chessarcade-v1';
const urlsToCache = [
    '/',
    '/css/arcade-shared.css',
    '/js/shared-utils.js',
    '/games/knight-quest/index.html',
    '/games/knight-quest/knight-quest.js',
    '/games/knight-quest/knight-styles.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
```

---

## 🎯 LÍMITES Y CAPACIDADES GRATUITAS

### 📊 VERCEL (GRATIS):
- ✅ 100,000 requests/mes
- ✅ 100GB bandwidth/mes  
- ✅ Serverless functions
- ✅ Custom domains
- ✅ SSL automático

### 📊 SUPABASE (GRATIS):
- ✅ 500MB database
- ✅ 50,000 requests/mes
- ✅ 2GB file storage
- ✅ Auth integrado
- ✅ Real-time subscriptions

### 📊 HOSTINGER PREMIUM (YA LO TIENES):
- ✅ 100GB storage
- ✅ Unlimited bandwidth
- ✅ Free SSL
- ✅ CDN gratis

### 🎮 ESTIMACIÓN DE CAPACIDAD:
Con estos límites gratuitos, ChessArcade puede manejar:
- **~1,000 usuarios activos/mes**
- **~50,000 partidas/mes** 
- **~500MB de datos** (suficiente para millones de scores)

---

## 🚀 PLAN DE DESPLIEGUE

### 📅 CRONOGRAMA:

**SEMANA 1-2: Local First**
- Desarrollar todos los juegos con funcionalidad local
- Deploy en Hostinger con localStorage
- ¡Funcional desde día 1!

**SEMANA 3: Backend Setup**
- Crear cuenta Vercel (gratis)
- Crear cuenta Supabase (gratis)
- Setup APIs básicas

**SEMANA 4: Integración**
- Conectar frontend con backend
- Migración gradual de funcionalidades
- Mantener compatibilidad local

### 🎯 RESULTADO:
**ChessArcade funcionando 100% gratis con capacidad profesional**

---

**¿Te parece perfecto este plan gratuito?** 🎮💰
