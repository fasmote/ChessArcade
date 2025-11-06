/**
 * ChessArcade - GET /api/scores/recent
 *
 * Get recent scores across all games or for a specific game
 */

import sql from './db.js';
import { queryRateLimiter } from './middleware/rate-limit.js';
import { GAME_LIMITS } from './games-config.js';

/**
 * GET /api/scores/recent?game=square-rush&limit=20
 * GET /api/scores/recent?limit=50  (all games)
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    // 1. Rate limiting
    const rateLimitResult = await queryRateLimiter(req, res);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: rateLimitResult.message,
        retryAfter: rateLimitResult.retryAfter
      });
    }

    // 2. Parse query parameters
    const { game, limit = 20 } = req.query;

    // Validate limit
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'limit must be between 1 and 100'
      });
    }

    // Validate game if provided
    if (game && !GAME_LIMITS[game]) {
      return res.status(400).json({
        success: false,
        error: `Invalid game: ${game}. Valid games: ${Object.keys(GAME_LIMITS).join(', ')}`
      });
    }

    // 3. Query recent scores
    let scores;

    if (game) {
      // Recent scores for specific game
      scores = await sql`
        SELECT
          id,
          game,
          player_name,
          score,
          level,
          time_ms,
          country_code,
          country_name,
          created_at,
          (
            SELECT COUNT(*) + 1
            FROM scores s2
            WHERE s2.game = ${game}
              AND s2.score > scores.score
          ) as rank
        FROM scores
        WHERE game = ${game}
        ORDER BY created_at DESC
        LIMIT ${limitNum}
      `;
    } else {
      // Recent scores across all games
      scores = await sql`
        SELECT
          id,
          game,
          player_name,
          score,
          level,
          time_ms,
          country_code,
          country_name,
          created_at
        FROM scores
        ORDER BY created_at DESC
        LIMIT ${limitNum}
      `;
    }

    // 4. Format scores
    const formattedScores = scores.map(score => ({
      id: score.id,
      game: score.game,
      player_name: score.player_name,
      score: score.score,
      level: score.level,
      time_ms: score.time_ms,
      rank: score.rank ? parseInt(score.rank) : null,
      country: {
        code: score.country_code,
        name: score.country_name
      },
      created_at: score.created_at,
      time_ago: getTimeAgo(score.created_at)
    }));

    // 5. Return response
    return res.status(200).json({
      success: true,
      data: {
        game: game || 'all',
        scores: formattedScores,
        count: scores.length
      }
    });

  } catch (error) {
    console.error('Error fetching recent scores:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.'
    });
  }
}

/**
 * Get human-readable time ago string
 * @param {Date} date - Date to compare
 * @returns {string} Time ago string
 */
function getTimeAgo(date) {
  const now = new Date();
  const scoreDate = new Date(date);
  const diffMs = now - scoreDate;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  } else {
    return scoreDate.toLocaleDateString();
  }
}
