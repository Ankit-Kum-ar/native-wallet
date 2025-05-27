const { Ratelimit } = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = require('./env');

const ratelimit = new Ratelimit({
    redis: new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
}); 

exports.ratelimit = ratelimit;