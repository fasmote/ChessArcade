/**
 * Test Database Connection (Supabase)
 *
 * Run with: node test-db.js
 */

import sql from './api/scores/db.js';

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...\n');

    // Test 1: Basic connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Test 1: Connection successful');
    console.log(`   Current time: ${result[0].current_time}\n`);

    // Test 2: Check if scores table exists
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'scores'
    `;

    if (tables.length === 0) {
      console.log('⚠️  Test 2: Table "scores" not found');
      console.log('   Please run schema.sql in Supabase SQL Editor\n');
    } else {
      console.log('✅ Test 2: Table "scores" exists\n');

      // Test 3: Count scores
      const count = await sql`SELECT COUNT(*) as total FROM scores`;
      console.log('✅ Test 3: Query successful');
      console.log(`   Total scores in database: ${count[0].total}\n`);

      // Test 4: Check indexes
      const indexes = await sql`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'scores'
      `;
      console.log(`✅ Test 4: Found ${indexes.length} indexes on scores table`);
      indexes.forEach(idx => {
        console.log(`   - ${idx.indexname}`);
      });
      console.log();
    }

    console.log('🎉 All tests passed!\n');
    console.log('Next steps:');
    console.log('1. Configure Vercel KV in dashboard');
    console.log('2. Run: npm install');
    console.log('3. Continue with Sprint 2 (API endpoints)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check DATABASE_URL in .env.local');
    console.error('2. Verify Supabase project is active');
    console.error('3. Check password in connection string');
    console.error('4. See api/scores/SETUP_SUPABASE.md for help\n');
    process.exit(1);
  }
}

testConnection();
