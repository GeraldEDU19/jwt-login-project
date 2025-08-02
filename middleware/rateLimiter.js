const rateLimit = require('express-rate-limit');

//General Rate Limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standarHeaders: 'draft-8',
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet:56,
    message: {
        error: 'Too many requests, please try again later.',
        retryAfter: '15 minutes'
    }
});

//Login Rate Limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 5 minutes
    limit: 10000, // Limit each IP to 2 requests per windowMs
    standardHeaders: 'draft-8',
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet:56,
    skipSuccesfulRequests: true, // Skip successful requests
    message: {
        error: 'Too many login attempts, please try again later.',
        retryAfter: '15 minutes'
    }
});

const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: 'draft-8',
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet: 56,
    message: {
        error: 'Limit exceeded, please try again later.',
        retryAfter: '1 minute'
    }
});


module.exports = {
    generalLimiter,
    loginLimiter,
    strictLimiter
};