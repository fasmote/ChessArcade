/**
 * ChessArcade - API Test Script
 *
 * Tests all endpoints with sample data
 * Run with: node test-api.js
 */

const BASE_URL = 'http://localhost:3000';

// Helper function to make requests
async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();
    return {
      status: response.status,
      data
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message
    };
  }
}

// Test 1: Submit a score
async function testSubmitScore() {
  console.log('\n🧪 Test 1: POST /api/scores - Submit score');
  console.log('================================================');

  const scoreData = {
    game: 'square-rush',
    player_name: 'TESTPLAYER',
    score: 12500,
    level: 'MASTER',
    time_ms: 120000,
    country_code: 'AR',
    country_name: 'Argentina',
    metadata: {
      browser: 'Chrome',
      device: 'Desktop'
    }
  };

  const result = await request('POST', '/api/scores', scoreData);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  return result.status === 201;
}

// Test 2: Get leaderboard
async function testLeaderboard() {
  console.log('\n🧪 Test 2: GET /api/scores/leaderboard');
  console.log('================================================');

  const result = await request('GET', '/api/scores/leaderboard?game=square-rush&limit=10');
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  return result.status === 200;
}

// Test 3: Search for player
async function testSearch() {
  console.log('\n🧪 Test 3: GET /api/scores/search');
  console.log('================================================');

  const result = await request('GET', '/api/scores/search?game=square-rush&player_name=TEST');
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  return result.status === 200;
}

// Test 4: Get recent scores
async function testRecent() {
  console.log('\n🧪 Test 4: GET /api/scores/recent');
  console.log('================================================');

  const result = await request('GET', '/api/scores/recent?game=square-rush&limit=5');
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  return result.status === 200;
}

// Test 5: Validation errors
async function testValidation() {
  console.log('\n🧪 Test 5: Validation Errors');
  console.log('================================================');

  // Invalid game
  const result1 = await request('POST', '/api/scores', {
    game: 'invalid-game',
    player_name: 'TEST',
    score: 100
  });
  console.log('Invalid game:', result1.status, result1.data);

  // Score too high
  const result2 = await request('POST', '/api/scores', {
    game: 'square-rush',
    player_name: 'TEST',
    score: 999999999
  });
  console.log('Score too high:', result2.status, result2.data);

  // Invalid player name
  const result3 = await request('POST', '/api/scores', {
    game: 'square-rush',
    player_name: '<script>alert("xss")</script>',
    score: 100
  });
  console.log('Invalid name:', result3.status, result3.data);

  return result1.status === 400 && result2.status === 400 && result3.status === 400;
}

// Run all tests
async function runTests() {
  console.log('🚀 ChessArcade API Tests');
  console.log('========================\n');
  console.log(`Testing against: ${BASE_URL}`);
  console.log('Make sure "vercel dev" is running!\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  const tests = [
    { name: 'Submit Score', fn: testSubmitScore },
    { name: 'Leaderboard', fn: testLeaderboard },
    { name: 'Search', fn: testSearch },
    { name: 'Recent Scores', fn: testRecent },
    { name: 'Validation', fn: testValidation }
  ];

  for (const test of tests) {
    results.total++;
    try {
      const passed = await test.fn();
      if (passed) {
        results.passed++;
        console.log(`\n✅ ${test.name} PASSED`);
      } else {
        results.failed++;
        console.log(`\n❌ ${test.name} FAILED`);
      }
    } catch (error) {
      results.failed++;
      console.log(`\n❌ ${test.name} ERROR:`, error.message);
    }

    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n================================================');
  console.log('📊 Test Results');
  console.log('================================================');
  console.log(`Total: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Error: fetch is not available.');
  console.error('Please use Node.js 18 or higher.');
  process.exit(1);
}

runTests();
