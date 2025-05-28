const dotenv = require('dotenv');
dotenv.config({
    path: '.env'
})

const {
    PORT,
    POSTGRESS_URL,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV
} = process.env;

module.exports = {
    PORT,
    POSTGRESS_URL,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV
}