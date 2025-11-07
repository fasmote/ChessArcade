/**
 * ChessArcade - Admin Endpoint
 *
 * ⚠️ IMPORTANTE: Este endpoint tiene acceso privilegiado
 * Solo debe ser usado por administradores autorizados
 *
 * Acciones disponibles:
 * - reset_all: Borra TODOS los scores de todos los juegos
 * - reset_game: Borra scores de un juego específico
 * - backup: Crea backup completo de la tabla scores
 * - restore: Restaura desde un backup específico
 * - stats: Obtiene estadísticas completas de la base de datos
 * - list_backups: Lista todos los backups disponibles
 *
 * Seguridad:
 * - Requiere ADMIN_PASSWORD en cada request
 * - Solo acepta método POST
 * - Logs de todas las acciones
 */

import { neon } from '@neondatabase/serverless';

// Conexión a la base de datos
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // ========================================
  // 1. CONFIGURAR CORS
  // ========================================
  // Permitir requests desde cualquier origen (necesario para frontend en Hostinger)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  // ========================================
  // 2. EXTRAER PARÁMETROS
  // ========================================
  const { action, admin_password, game, backup_name } = req.body;

  // Validar que action esté presente
  if (!action) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter: action'
    });
  }

  // ========================================
  // 3. VERIFICAR PASSWORD DE ADMIN
  // ========================================
  // ⚠️ CRÍTICO: Esta es nuestra única línea de defensa
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  // Si no hay password configurado en Vercel, rechazar
  if (!ADMIN_PASSWORD) {
    console.error('❌ ADMIN_PASSWORD not configured in environment');
    return res.status(500).json({
      success: false,
      error: 'Admin system not configured'
    });
  }

  // Si el password no coincide, rechazar y loguear el intento
  if (admin_password !== ADMIN_PASSWORD) {
    console.warn(`⚠️ Unauthorized admin access attempt. Action: ${action}`);
    return res.status(403).json({
      success: false,
      error: 'Unauthorized. Invalid admin password.'
    });
  }

  // Password correcto, proceder con la acción
  console.log(`✅ Admin authenticated. Action: ${action}`);

  // ========================================
  // 4. EJECUTAR ACCIÓN SOLICITADA
  // ========================================
  try {
    switch (action) {

      // ----------------------------------------
      // ACCIÓN: reset_all
      // Borra TODOS los scores de todos los juegos
      // ----------------------------------------
      case 'reset_all': {
        console.log('🗑️ Resetting ALL scores...');

        // Primero obtener el count antes de borrar
        const countResult = await sql`
          SELECT COUNT(*) as total FROM scores
        `;
        const totalScores = parseInt(countResult[0].total);

        // Borrar todos los registros
        await sql`DELETE FROM scores`;

        console.log(`✅ Deleted ${totalScores} scores from ALL games`);

        return res.status(200).json({
          success: true,
          action: 'reset_all',
          message: `Successfully deleted ${totalScores} scores from all games`,
          data: {
            deleted_count: totalScores
          }
        });
      }

      // ----------------------------------------
      // ACCIÓN: reset_game
      // Borra scores de un juego específico
      // ----------------------------------------
      case 'reset_game': {
        if (!game) {
          return res.status(400).json({
            success: false,
            error: 'Missing required parameter: game'
          });
        }

        console.log(`🗑️ Resetting scores for game: ${game}`);

        // Obtener count antes de borrar
        const countResult = await sql`
          SELECT COUNT(*) as total
          FROM scores
          WHERE game = ${game}
        `;
        const totalScores = parseInt(countResult[0].total);

        // Borrar scores del juego específico
        await sql`
          DELETE FROM scores
          WHERE game = ${game}
        `;

        console.log(`✅ Deleted ${totalScores} scores from ${game}`);

        return res.status(200).json({
          success: true,
          action: 'reset_game',
          message: `Successfully deleted ${totalScores} scores from ${game}`,
          data: {
            game: game,
            deleted_count: totalScores
          }
        });
      }

      // ----------------------------------------
      // ACCIÓN: backup
      // Crea un backup completo de todos los scores
      // ----------------------------------------
      case 'backup': {
        console.log('💾 Creating backup...');

        // Obtener TODOS los scores
        const allScores = await sql`
          SELECT * FROM scores
          ORDER BY created_at DESC
        `;

        // Crear nombre automático si no se proporciona
        const backupNameFinal = backup_name || `backup_${new Date().toISOString().replace(/:/g, '-')}`;

        // Guardar en tabla backups como JSONB
        await sql`
          INSERT INTO backups (backup_name, backup_data, created_at)
          VALUES (
            ${backupNameFinal},
            ${JSON.stringify(allScores)}::jsonb,
            NOW()
          )
        `;

        console.log(`✅ Backup created: ${backupNameFinal} (${allScores.length} scores)`);

        return res.status(200).json({
          success: true,
          action: 'backup',
          message: `Backup created successfully: ${backupNameFinal}`,
          data: {
            backup_name: backupNameFinal,
            scores_count: allScores.length,
            created_at: new Date().toISOString()
          }
        });
      }

      // ----------------------------------------
      // ACCIÓN: restore
      // Restaura desde un backup específico
      // ----------------------------------------
      case 'restore': {
        if (!backup_name) {
          return res.status(400).json({
            success: false,
            error: 'Missing required parameter: backup_name'
          });
        }

        console.log(`♻️ Restoring from backup: ${backup_name}`);

        // Buscar el backup
        const backupResult = await sql`
          SELECT backup_data, created_at
          FROM backups
          WHERE backup_name = ${backup_name}
        `;

        if (backupResult.length === 0) {
          return res.status(404).json({
            success: false,
            error: `Backup not found: ${backup_name}`
          });
        }

        const backupData = backupResult[0].backup_data;
        const backupCreatedAt = backupResult[0].created_at;

        // PRIMERO: Borrar todos los scores actuales
        await sql`DELETE FROM scores`;

        // SEGUNDO: Restaurar los scores del backup
        // Insertar uno por uno (PostgreSQL no tiene INSERT múltiple sencillo con JSONB)
        let restoredCount = 0;
        for (const score of backupData) {
          await sql`
            INSERT INTO scores (
              game, player_name, score, level, time_ms,
              country_code, ip_address, user_agent, created_at
            ) VALUES (
              ${score.game},
              ${score.player_name},
              ${score.score},
              ${score.level || null},
              ${score.time_ms || null},
              ${score.country_code || null},
              ${score.ip_address || null},
              ${score.user_agent || null},
              ${score.created_at}
            )
          `;
          restoredCount++;
        }

        console.log(`✅ Restored ${restoredCount} scores from backup: ${backup_name}`);

        return res.status(200).json({
          success: true,
          action: 'restore',
          message: `Successfully restored ${restoredCount} scores from backup: ${backup_name}`,
          data: {
            backup_name: backup_name,
            backup_created_at: backupCreatedAt,
            restored_count: restoredCount
          }
        });
      }

      // ----------------------------------------
      // ACCIÓN: stats
      // Obtiene estadísticas completas de la BD
      // ----------------------------------------
      case 'stats': {
        console.log('📊 Gathering statistics...');

        // 1. Total de scores
        const totalResult = await sql`
          SELECT COUNT(*) as total FROM scores
        `;
        const totalScores = parseInt(totalResult[0].total);

        // 2. Total de jugadores únicos
        const playersResult = await sql`
          SELECT COUNT(DISTINCT player_name) as total FROM scores
        `;
        const totalPlayers = parseInt(playersResult[0].total);

        // 3. Scores por juego
        const gameStatsResult = await sql`
          SELECT
            game,
            COUNT(*) as scores_count,
            COUNT(DISTINCT player_name) as unique_players,
            MAX(score) as highest_score,
            AVG(score) as avg_score
          FROM scores
          GROUP BY game
          ORDER BY scores_count DESC
        `;

        // 4. Total de backups
        const backupsResult = await sql`
          SELECT COUNT(*) as total FROM backups
        `;
        const totalBackups = parseInt(backupsResult[0].total);

        // 5. Score más reciente
        const latestResult = await sql`
          SELECT game, player_name, score, created_at
          FROM scores
          ORDER BY created_at DESC
          LIMIT 1
        `;
        const latestScore = latestResult[0] || null;

        console.log(`✅ Stats gathered: ${totalScores} scores, ${totalPlayers} players`);

        return res.status(200).json({
          success: true,
          action: 'stats',
          data: {
            total_scores: totalScores,
            total_players: totalPlayers,
            total_backups: totalBackups,
            game_stats: gameStatsResult,
            latest_score: latestScore,
            timestamp: new Date().toISOString()
          }
        });
      }

      // ----------------------------------------
      // ACCIÓN: list_backups
      // Lista todos los backups disponibles
      // ----------------------------------------
      case 'list_backups': {
        console.log('📋 Listing backups...');

        const backupsResult = await sql`
          SELECT
            backup_name,
            created_at,
            jsonb_array_length(backup_data) as scores_count
          FROM backups
          ORDER BY created_at DESC
        `;

        console.log(`✅ Found ${backupsResult.length} backups`);

        return res.status(200).json({
          success: true,
          action: 'list_backups',
          data: {
            backups_count: backupsResult.length,
            backups: backupsResult
          }
        });
      }

      // ----------------------------------------
      // ACCIÓN DESCONOCIDA
      // ----------------------------------------
      default: {
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: [
            'reset_all',
            'reset_game',
            'backup',
            'restore',
            'stats',
            'list_backups'
          ]
        });
      }
    }

  } catch (error) {
    // ========================================
    // 5. MANEJO DE ERRORES
    // ========================================
    console.error('❌ Admin endpoint error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      action: action
    });
  }
}
