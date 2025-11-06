/**
 * Script para ejecutar schema.sql en Supabase
 * Run with: node run-schema.js
 */

import postgres from 'postgres';
import fs from 'fs';

// Connection string directo
const connectionString = 'postgresql://postgres:S_michigaN_7799@db.eyuuujpwgpmajrjhnah.supabase.co:5432/postgres';

const sql = postgres(connectionString, {
  max: 1,
  connect_timeout: 10,
});

async function runSchema() {
  try {
    console.log('🔄 Conectando a Supabase...\n');

    // Leer el schema
    const schema = fs.readFileSync('./api/scores/schema.sql', 'utf8');

    console.log('📄 Ejecutando schema.sql...\n');

    // Ejecutar el schema completo
    await sql.unsafe(schema);

    console.log('✅ Schema ejecutado exitosamente!\n');

    // Verificar que la tabla existe
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'scores'
    `;

    if (tables.length > 0) {
      console.log('✅ Tabla "scores" creada correctamente\n');

      // Verificar índices
      const indexes = await sql`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'scores'
      `;

      console.log(`✅ ${indexes.length} índices creados:`);
      indexes.forEach(idx => {
        console.log(`   - ${idx.indexname}`);
      });
      console.log();
    }

    console.log('🎉 Setup de base de datos completado!\n');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sql.end();
    process.exit(1);
  }
}

runSchema();
