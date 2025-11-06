/**
 * ChessArcade - GET /api/scores/search
 *
 * Search for scores by player name
 */

import sql from './db.js';
import { validateSearchParams } from './middleware/validate.js';
import { queryRateLimiter } from './middleware/rate-limit.js';

/**
 * GET /api/scores/search?game=square-rush&player_name=JOHN&limit=20
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

    // 2. Validate query parameters
    const validation = validateSearchParams(req.query);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { game, player_name, limit } = validation.sanitized;

    // 3. Search for player (case-insensitive, partial match)
    const searchPattern = `%${player_name.toUpperCase()}%`;

    const scores = await sql`
      SELECT
        id,
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
        AND UPPER(player_name) LIKE ${searchPattern}
      ORDER BY score DESC, created_at ASC
      LIMIT ${limit}
    `;

    // 4. Get player statistics
    let playerStats = null;
    if (scores.length > 0) {
      const statsResult = await sql`
        SELECT
          COUNT(*) as total_scores,
          MAX(score) as best_score,
          AVG(score)::int as avg_score,
          MIN(created_at) as first_score_date
        FROM scores
        WHERE game = ${game}
          AND UPPER(player_name) LIKE ${searchPattern}
      `;

      playerStats = {
        total_scores: parseInt(statsResult[0].total_scores),
        best_score: statsResult[0].best_score,
        avg_score: statsResult[0].avg_score,
        first_score_date: statsResult[0].first_score_date
      };
    }

    // 5. Format scores
    const formattedScores = scores.map(score => ({
      rank: parseInt(score.rank),
      id: score.id,
      player_name: score.player_name,
      score: score.score,
      level: score.level,
      time_ms: score.time_ms,
      country: {
        code: score.country_code,
        name: score.country_name
      },
      created_at: score.created_at
    }));

    // 6. Return response
    return res.status(200).json({
      success: true,
      data: {
        game,
        search_term: player_name,
        scores: formattedScores,
        stats: playerStats,
        found: scores.length
      }
    });

  } catch (error) {
    console.error('Error searching scores:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.'
    });
  }
}
