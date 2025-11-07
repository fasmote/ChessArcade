/**
 * ChessArcade - POST /api/scores
 *
 * Submit a new score to the leaderboard
 */

import sql from './db.js';
import { validateScoreSubmission } from './middleware/validate.js';
import { submitRateLimiter, getHashedIp } from './middleware/rate-limit.js';

/**
 * POST /api/scores - Submit score
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // 1. Rate limiting
    const rateLimitResult = await submitRateLimiter(req, res);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: rateLimitResult.message,
        retryAfter: rateLimitResult.retryAfter
      });
    }

    // 2. Parse and validate request body
    const data = req.body;

    const validation = validateScoreSubmission(data);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // 3. Prepare data for insertion
    const {
      game,
      player_name,
      score,
      level,
      time_ms,
      country_code,
      country_name,
      metadata = {}
    } = data;

    const ip_hash = getHashedIp(req);

    // 4. Insert score into database
    const result = await sql`
      INSERT INTO scores (
        game,
        player_name,
        score,
        level,
        time_ms,
        country_code,
        country_name,
        metadata,
        ip_hash
      ) VALUES (
        ${game},
        ${player_name},
        ${score},
        ${level || null},
        ${time_ms || null},
        ${country_code || null},
        ${country_name || null},
        ${JSON.stringify(metadata)},
        ${ip_hash}
      )
      RETURNING id, created_at
    `;

    const insertedScore = result[0];

    // 5. Get player's rank in leaderboard
    const rankResult = await sql`
      SELECT COUNT(*) + 1 as rank
      FROM scores
      WHERE game = ${game}
        AND score > ${score}
    `;

    const rank = parseInt(rankResult[0].rank);

    // 6. Get total scores for this game
    const totalResult = await sql`
      SELECT COUNT(*) as total
      FROM scores
      WHERE game = ${game}
    `;

    const totalPlayers = parseInt(totalResult[0].total);

    // 7. Return success response
    return res.status(201).json({
      success: true,
      data: {
        id: insertedScore.id,
        rank,
        totalPlayers,
        score,
        player_name,
        game,
        created_at: insertedScore.created_at,
        message: rank <= 10
          ? `🎉 Top 10! You're rank #${rank}!`
          : rank <= 50
          ? `🌟 Great job! Rank #${rank}`
          : `Score submitted! Rank #${rank}`
      }
    });

  } catch (error) {
    console.error('Error submitting score:', error);

    // Check for specific database errors
    if (error.message?.includes('scores_game_check')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid game name'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.'
    });
  }
}
