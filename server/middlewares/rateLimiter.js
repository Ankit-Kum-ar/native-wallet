const { ratelimit } = require("../config/upstash");

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit('my-limit-key');
        if (!success) {
            return res.status(429).json({
                message: 'Rate limit exceeded. Please try again later.'
            });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = rateLimiter;