-- ChessArcade Leaderboard Database Schema
-- Version: 1.2.0
-- Created: 2025-11-04

-- ============================================
-- TABLA PRINCIPAL: scores
-- ============================================

CREATE TABLE IF NOT EXISTS scores (
    -- Primary Key
    id SERIAL PRIMARY KEY,

    -- Identificación del juego
    game VARCHAR(50) NOT NULL,

    -- Datos del jugador (15 caracteres max)
    player_name VARCHAR(15) NOT NULL,

    -- Geolocalización (banderas de país)
    country_code VARCHAR(2),          -- ISO 3166-1 alpha-2: 'US', 'AR', 'BR', etc.
    country_name VARCHAR(100),        -- Nombre del país: 'Argentina', 'United States'

    -- Puntuación y métricas
    score INTEGER NOT NULL,
    level VARCHAR(20),                -- 'BABY STEPS', '4x4', 'EASY', 'HARD', etc.
    time_ms INTEGER,                  -- Tiempo en milisegundos (si aplica)

    -- Metadata flexible por juego (JSONB)
    metadata JSONB DEFAULT '{}',

    -- Timestamps y anti-spam
    created_at TIMESTAMP DEFAULT NOW(),
    ip_hash VARCHAR(64),              -- SHA-256 del IP para rate limiting

    -- Constraints
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_name CHECK (LENGTH(player_name) >= 1 AND LENGTH(player_name) <= 15)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índice para leaderboard por juego (ordenamiento default por score)
CREATE INDEX IF NOT EXISTS idx_game_score_desc
ON scores(game, score DESC);

-- Índice para ordenamiento por fecha (modo "Recent")
CREATE INDEX IF NOT EXISTS idx_game_date
ON scores(game, created_at DESC);

-- Índice para ordenamiento por nombre (modo "Name A-Z")
CREATE INDEX IF NOT EXISTS idx_game_name
ON scores(game, player_name ASC);

-- Índice para ordenamiento por país (modo "Country")
CREATE INDEX IF NOT EXISTS idx_game_country_score
ON scores(game, country_name ASC, score DESC);

-- Índice para rankings por país
CREATE INDEX IF NOT EXISTS idx_country
ON scores(country_code);

-- Índice para rate limiting (búsquedas por IP)
CREATE INDEX IF NOT EXISTS idx_ip_hash_date
ON scores(ip_hash, created_at);

-- Índice GIN para búsquedas en metadata (JSONB)
CREATE INDEX IF NOT EXISTS idx_metadata
ON scores USING GIN (metadata);

-- ============================================
-- ÍNDICE OPCIONAL: FULL-TEXT SEARCH
-- ============================================
-- Descomentar si necesitas búsquedas ultra-rápidas con 100K+ registros

-- CREATE INDEX IF NOT EXISTS idx_player_name_search
-- ON scores USING gin(to_tsvector('simple', player_name));

-- ============================================
-- QUERIES DE VERIFICACIÓN
-- ============================================

-- Contar registros totales por juego
-- SELECT game, COUNT(*) as total_scores
-- FROM scores
-- GROUP BY game
-- ORDER BY total_scores DESC;

-- Ver los últimos 10 scores insertados
-- SELECT * FROM scores
-- ORDER BY created_at DESC
-- LIMIT 10;

-- Verificar performance de índices
-- EXPLAIN ANALYZE
-- SELECT * FROM scores
-- WHERE game = 'square-rush'
-- ORDER BY score DESC
-- LIMIT 50;
