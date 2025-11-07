-- ================================================
-- ChessArcade - Tabla de Backups
-- ================================================
-- Esta tabla almacena backups completos de la tabla scores
-- Los backups se guardan como JSONB para fácil restauración
--
-- Usar en Supabase SQL Editor:
-- 1. Ir a https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- 2. Copiar y pegar este script
-- 3. Ejecutar "Run"

-- Crear tabla backups
CREATE TABLE IF NOT EXISTS backups (
  -- ID único del backup (auto-incremental)
  id SERIAL PRIMARY KEY,

  -- Nombre descriptivo del backup (ej: "backup_2025-01-15", "before_reset")
  backup_name VARCHAR(100) NOT NULL UNIQUE,

  -- Datos del backup en formato JSONB (JSON binario, más eficiente)
  -- Contiene el array completo de todos los scores en el momento del backup
  backup_data JSONB NOT NULL,

  -- Timestamp de cuándo se creó el backup
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Crear índice en backup_name para búsquedas rápidas
CREATE INDEX idx_backups_backup_name ON backups(backup_name);

-- Crear índice en created_at para ordenar cronológicamente
CREATE INDEX idx_backups_created_at ON backups(created_at DESC);

-- Agregar comentarios para documentación
COMMENT ON TABLE backups IS 'Almacena backups completos de la tabla scores en formato JSONB';
COMMENT ON COLUMN backups.id IS 'ID único del backup (auto-incremental)';
COMMENT ON COLUMN backups.backup_name IS 'Nombre descriptivo del backup (ej: backup_2025-01-15)';
COMMENT ON COLUMN backups.backup_data IS 'Array de todos los scores en formato JSONB';
COMMENT ON COLUMN backups.created_at IS 'Timestamp de creación del backup';

-- ================================================
-- Verificación
-- ================================================
-- Para verificar que la tabla se creó correctamente:
-- SELECT * FROM backups;

-- Para ver el tamaño de cada backup:
-- SELECT
--   backup_name,
--   created_at,
--   jsonb_array_length(backup_data) as scores_count,
--   pg_size_pretty(pg_column_size(backup_data)) as backup_size
-- FROM backups
-- ORDER BY created_at DESC;
