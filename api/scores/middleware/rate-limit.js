/**
 * ChessArcade - Rate Limiting Middleware
 *
 * Simple in-memory rate limiting (for testing)
 * TODO: Switch to Vercel KV for production
 */

// In-memory store for rate limiting (temporary, until Vercel KV is configured)
const requestCounts = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.resetTime > 60000) { // 1 minute old
      requestCounts.delete(key);
    }
  }
}, 300000); // 5 minutes

/**
 * Rate limit configuration by endpoint type
 */
const RATE_LIMITS = {
  submit: {
    max: 10,        // 10 requests
    window: 60000,  // per minute (60s)
    message: 'Too many score submissions. Please wait before submitting again.'
  },
  query: {
    max: 60,        // 60 requests
    window: 60000,  // per minute
    message: 'Too many requests. Please slow down.'
  }
};

/**
 * Create rate limiter middleware
 * @param {string} type - 'submit' or 'query'
 * @returns {Function} Middleware function
 */
export function createRateLimiter(type = 'query') {
  const config = RATE_LIMITS[type];

  return async function rateLimitMiddleware(req, res) {
    // Get client identifier (IP hash)
    const clientIp = getClientIp(req);
    const key = `${type}:${clientIp}`;

    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record) {
      // First request from this client
      requestCounts.set(key, {
        count: 1,
        resetTime: now + config.window
      });
      return { allowed: true };
    }

    // Check if window has expired
    if (now >= record.resetTime) {
      // Reset counter
      requestCounts.set(key, {
        count: 1,
        resetTime: now + config.window
      });
      return { allowed: true };
    }

    // Within window, check if limit exceeded
    if (record.count >= config.max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return {
        allowed: false,
        retryAfter,
        message: config.message
      };
    }

    // Increment counter
    record.count++;
    return { allowed: true };
  };
}

/**
 * Get client IP address from request headers
 * @param {Object} req - Request object
 * @returns {string} Client IP hash
 */
function getClientIp(req) {
  // Try various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }

  // Fallback to Vercel-specific header
  const vercelIp = req.headers['x-vercel-forwarded-for'];
  if (vercelIp) {
    return vercelIp;
  }

  return 'unknown';
}

/**
 * Hash IP address for privacy
 * @param {string} ip - IP address
 * @returns {string} Hashed IP
 */
export function hashIp(ip) {
  // Simple hash function (for production, use crypto.createHash)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get hashed IP from request
 * @param {Object} req - Request object
 * @returns {string} Hashed IP
 */
export function getHashedIp(req) {
  const ip = getClientIp(req);
  return hashIp(ip);
}

// Export rate limiters for different endpoint types
export const submitRateLimiter = createRateLimiter('submit');
export const queryRateLimiter = createRateLimiter('query');
